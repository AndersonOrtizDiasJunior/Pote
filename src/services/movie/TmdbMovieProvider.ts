import type { MovieDetails, MovieSearchResult } from '../../types/movie'
import { toGenreNames } from '../../utils/genres'
import { MovieProviderError } from './errors'
import type { MovieProvider } from './MovieProvider'

/**
 * Provider baseado no TMDB (The Movie Database) - https://www.themoviedb.org
 *
 * Escolhido porque, entre as opcoes gratuitas, e a que devolve tudo que a
 * aplicacao precisa numa unica busca: titulo, titulo original, ano, poster,
 * backdrop, sinopse, nota e generos, com suporte nativo a pt-BR.
 *
 * A chave (v3) e do tipo publico/cliente: o proprio TMDB documenta o uso
 * direto no frontend, entao nao existe backend/proxy neste projeto.
 */

const TMDB_API_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'
const POSTER_SIZE = 'w500'
const BACKDROP_SIZE = 'w1280'

interface TmdbSearchItem {
  id?: unknown
  title?: unknown
  original_title?: unknown
  release_date?: unknown
  poster_path?: unknown
  backdrop_path?: unknown
  vote_average?: unknown
  genre_ids?: unknown
  overview?: unknown
}

interface TmdbMovieDetail extends TmdbSearchItem {
  imdb_id?: unknown
  genres?: unknown
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined
}

function num(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

/** `2014-11-05` -> `2014` */
function yearFromReleaseDate(value: unknown): number | undefined {
  const date = str(value)
  if (!date) return undefined
  const year = Number.parseInt(date.slice(0, 4), 10)
  return Number.isFinite(year) ? year : undefined
}

function imageUrl(path: unknown, size: string): string | undefined {
  const value = str(path)
  return value ? `${TMDB_IMAGE_BASE}/${size}${value}` : undefined
}

/** TMDB devolve `0` quando ainda nao ha votos: nesse caso nao ha nota. */
function ratingFrom(value: unknown): number | undefined {
  const rating = num(value)
  if (rating === undefined || rating <= 0) return undefined
  return Math.round(rating * 10) / 10
}

export interface TmdbMovieProviderOptions {
  apiKey: string
  /** Idioma das respostas. Padrao: `pt-BR`. */
  language?: string
  /** Injetavel para testes. Padrao: `fetch` global. */
  fetchImpl?: typeof fetch
}

export class TmdbMovieProvider implements MovieProvider {
  readonly id = 'tmdb'
  readonly label = 'TMDB'
  readonly requiresApiKey = true

  private readonly apiKey: string
  private readonly language: string
  private readonly fetchImpl: typeof fetch

  /** Cache do mapa `genre id -> nome`, ja no idioma configurado. */
  private genreNames: Map<number, string> | null = null
  private genreNamesPromise: Promise<Map<number, string>> | null = null

  constructor(options: TmdbMovieProviderOptions) {
    this.apiKey = options.apiKey
    this.language = options.language ?? 'pt-BR'
    this.fetchImpl = options.fetchImpl ?? ((...args) => fetch(...args))
  }

  /**
   * A chave v4 (read access token) e um JWT e vai no header; a chave v3 e uma
   * string hexadecimal e vai na query. Aceitamos as duas.
   */
  private get usesBearerToken(): boolean {
    return this.apiKey.startsWith('eyJ')
  }

  private buildUrl(path: string, params: Record<string, string> = {}): string {
    const url = new URL(`${TMDB_API_BASE}${path}`)
    url.searchParams.set('language', this.language)
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value)
    }
    if (!this.usesBearerToken) url.searchParams.set('api_key', this.apiKey)
    return url.toString()
  }

  private async request<T>(
    path: string,
    params: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<T | null> {
    if (this.apiKey.trim() === '') {
      throw new MovieProviderError('missing-api-key', 'VITE_TMDB_API_KEY nao configurada.')
    }

    const headers: Record<string, string> = { accept: 'application/json' }
    if (this.usesBearerToken) headers.authorization = `Bearer ${this.apiKey}`

    let response: Response
    try {
      response = await this.fetchImpl(this.buildUrl(path, params), { headers, signal })
    } catch (error) {
      // AbortError precisa subir intacto para o chamador ignorar o resultado.
      if (error instanceof DOMException && error.name === 'AbortError') throw error
      throw new MovieProviderError('network', 'Falha de rede ao contatar o TMDB.', {
        cause: error,
      })
    }

    if (response.status === 401 || response.status === 403) {
      throw new MovieProviderError('invalid-api-key', 'TMDB recusou a chave de API.')
    }
    if (response.status === 404) return null
    if (response.status === 429) {
      throw new MovieProviderError('rate-limited', 'Limite de requisicoes do TMDB atingido.')
    }
    if (!response.ok) {
      throw new MovieProviderError('unknown', `TMDB respondeu ${response.status}.`)
    }

    try {
      return (await response.json()) as T
    } catch (error) {
      throw new MovieProviderError('invalid-response', 'Resposta do TMDB nao e JSON valido.', {
        cause: error,
      })
    }
  }

  /**
   * Mapa de generos do TMDB.
   *
   * Consultado com `language=pt-BR`, o TMDB ja devolve os nomes traduzidos,
   * entao usamos o que ele mandar. Se a chamada falhar, `toGenreNames` cai no
   * mapa estatico de `utils/genres`.
   */
  private async loadGenreNames(signal?: AbortSignal): Promise<Map<number, string>> {
    if (this.genreNames) return this.genreNames
    if (this.genreNamesPromise) return this.genreNamesPromise

    this.genreNamesPromise = (async () => {
      try {
        const data = await this.request<{ genres?: unknown }>('/genre/movie/list', {}, signal)
        const map = new Map<number, string>()
        if (data && Array.isArray(data.genres)) {
          for (const raw of data.genres) {
            if (typeof raw !== 'object' || raw === null) continue
            const entry = raw as { id?: unknown; name?: unknown }
            const id = num(entry.id)
            const name = str(entry.name)
            if (id !== undefined && name !== undefined) map.set(id, name)
          }
        }
        this.genreNames = map
        return map
      } catch (error) {
        // Nao e fatal: seguimos com o mapa estatico.
        console.error('[o-pote] nao foi possivel carregar os generos do TMDB:', error)
        const empty = new Map<number, string>()
        this.genreNames = empty
        return empty
      } finally {
        this.genreNamesPromise = null
      }
    })()

    return this.genreNamesPromise
  }

  /** `genre_ids` (busca) ou `genres` (detalhe) -> nomes em portugues. */
  private resolveGenres(item: TmdbMovieDetail, names: Map<number, string>): string[] {
    if (Array.isArray(item.genres)) {
      const fromDetail = item.genres.map((raw) => {
        if (typeof raw !== 'object' || raw === null) return null
        const entry = raw as { id?: unknown; name?: unknown }
        return str(entry.name) ?? num(entry.id) ?? null
      })
      return toGenreNames(fromDetail)
    }

    if (Array.isArray(item.genre_ids)) {
      return toGenreNames(
        item.genre_ids.map((raw) => {
          const id = num(raw)
          if (id === undefined) return null
          // Prioriza o nome que o proprio TMDB devolveu em pt-BR.
          return names.get(id) ?? id
        }),
      )
    }

    return []
  }

  private toSearchResult(item: TmdbSearchItem, names: Map<number, string>): MovieSearchResult | null {
    const id = num(item.id)
    const title = str(item.title) ?? str(item.original_title)
    if (id === undefined || title === undefined) return null

    return {
      id: String(id),
      title,
      originalTitle: str(item.original_title),
      year: yearFromReleaseDate(item.release_date),
      posterUrl: imageUrl(item.poster_path, POSTER_SIZE),
      backdropUrl: imageUrl(item.backdrop_path, BACKDROP_SIZE),
      rating: ratingFrom(item.vote_average),
      genres: this.resolveGenres(item, names),
      overview: str(item.overview),
      // O endpoint de busca do TMDB nao devolve IMDb ID. Nao inventamos:
      // ele so aparece quando `getMovie` for chamado.
    }
  }

  async searchMovies(query: string, signal?: AbortSignal): Promise<MovieSearchResult[]> {
    const trimmed = query.trim()
    if (trimmed === '') return []

    const names = await this.loadGenreNames(signal)
    const data = await this.request<{ results?: unknown }>(
      '/search/movie',
      { query: trimmed, include_adult: 'false', page: '1' },
      signal,
    )

    if (!data || !Array.isArray(data.results)) return []

    const results: MovieSearchResult[] = []
    for (const raw of data.results) {
      if (typeof raw !== 'object' || raw === null) continue
      const mapped = this.toSearchResult(raw as TmdbSearchItem, names)
      if (mapped) results.push(mapped)
    }
    return results
  }

  async getMovie(id: string, signal?: AbortSignal): Promise<MovieDetails | null> {
    const names = await this.loadGenreNames(signal)
    const data = await this.request<TmdbMovieDetail>(
      `/movie/${encodeURIComponent(id)}`,
      { append_to_response: 'external_ids' },
      signal,
    )
    if (!data) return null

    const movieId = num(data.id)
    const title = str(data.title) ?? str(data.original_title)
    if (movieId === undefined || title === undefined) return null

    const externalIds = (data as { external_ids?: { imdb_id?: unknown } }).external_ids
    const imdbId = str(data.imdb_id) ?? str(externalIds?.imdb_id)

    return {
      id: String(movieId),
      imdbId,
      title,
      originalTitle: str(data.original_title),
      year: yearFromReleaseDate(data.release_date),
      posterUrl: imageUrl(data.poster_path, POSTER_SIZE),
      backdropUrl: imageUrl(data.backdrop_path, BACKDROP_SIZE),
      rating: ratingFrom(data.vote_average),
      genres: this.resolveGenres(data, names),
      overview: str(data.overview),
    }
  }
}
