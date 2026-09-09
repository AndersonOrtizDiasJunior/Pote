import type { Movie, MovieDetails, MovieSearchResult } from '../../types/movie'
import { buildMovieId } from '../../utils/identity'
import { DemoMovieProvider } from './DemoMovieProvider'
import type { MovieProvider } from './MovieProvider'
import { TmdbMovieProvider } from './TmdbMovieProvider'

/**
 * Fachada que a aplicacao consome.
 *
 *   React Component -> useMovies / paginas
 *                   -> MovieService   (esta classe)
 *                   -> MovieProvider  (TMDB | catalogo local)
 *                   -> API
 *
 * Responsabilidades: pesquisar, buscar detalhes, transformar o resultado do
 * provider no modelo interno `Movie` e oferecer um cache curto de busca.
 */

/** TTL do cache de busca em memoria. */
const SEARCH_CACHE_TTL_MS = 5 * 60 * 1000
const SEARCH_CACHE_MAX_ENTRIES = 40

interface CacheEntry {
  results: MovieSearchResult[]
  expiresAt: number
}

export class MovieService {
  private readonly provider: MovieProvider
  private readonly searchCache = new Map<string, CacheEntry>()

  constructor(provider: MovieProvider) {
    this.provider = provider
  }

  get providerId(): string {
    return this.provider.id
  }

  get providerLabel(): string {
    return this.provider.label
  }

  /** `true` quando estamos no catalogo local por falta de chave de API. */
  get isDemoMode(): boolean {
    return this.provider.id === 'demo'
  }

  /** Busca filmes por nome, com cache curto para repeticoes do mesmo termo. */
  async searchMovies(query: string, signal?: AbortSignal): Promise<MovieSearchResult[]> {
    const trimmed = query.trim()
    if (trimmed === '') return []

    const cacheKey = trimmed.toLowerCase()
    const cached = this.searchCache.get(cacheKey)
    if (cached && cached.expiresAt > Date.now()) return cached.results
    if (cached) this.searchCache.delete(cacheKey)

    const results = await this.provider.searchMovies(trimmed, signal)

    // Cache simples com limite de tamanho: descarta a entrada mais antiga.
    if (this.searchCache.size >= SEARCH_CACHE_MAX_ENTRIES) {
      const oldest = this.searchCache.keys().next()
      if (!oldest.done) this.searchCache.delete(oldest.value)
    }
    this.searchCache.set(cacheKey, { results, expiresAt: Date.now() + SEARCH_CACHE_TTL_MS })

    return results
  }

  /** Detalhes completos de um filme no provider. */
  getMovieDetails(providerId: string, signal?: AbortSignal): Promise<MovieDetails | null> {
    return this.provider.getMovie(providerId, signal)
  }

  /**
   * Converte um resultado de busca em um filme pronto para entrar no pote.
   *
   * O endpoint de busca do TMDB nao devolve o IMDb ID, e nao inventamos um.
   * Por isso tentamos buscar os detalhes: se der certo, guardamos o IMDb ID
   * junto (o que fortalece a checagem de duplicidade e habilita o link para o
   * IMDb); se falhar, seguimos apenas com o que a busca ja trouxe.
   */
  async buildMovie(result: MovieSearchResult, signal?: AbortSignal): Promise<Movie> {
    let details: MovieDetails | null = null
    try {
      details = await this.getMovieDetails(result.id, signal)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error
      // Enriquecimento e opcional: nao impede o filme de entrar no pote.
      console.error('[o-pote] nao foi possivel detalhar o filme', result.id, error)
    }

    const merged = {
      providerId: result.id,
      imdbId: details?.imdbId ?? result.imdbId,
      title: details?.title ?? result.title,
      originalTitle: details?.originalTitle ?? result.originalTitle,
      year: details?.year ?? result.year,
      posterUrl: details?.posterUrl ?? result.posterUrl,
      backdropUrl: details?.backdropUrl ?? result.backdropUrl,
      rating: details?.rating ?? result.rating,
      genres: details?.genres?.length ? details.genres : (result.genres ?? []),
      overview: details?.overview ?? result.overview,
    }

    return {
      ...merged,
      id: buildMovieId(merged),
      watched: false,
      addedAt: new Date().toISOString(),
    }
  }
}

/**
 * Escolhe o provider a partir do ambiente.
 *
 * Com `VITE_TMDB_API_KEY` preenchida, usa o TMDB. Sem chave, cai no catalogo
 * local para que a aplicacao continue utilizavel de ponta a ponta.
 */
export function createMovieService(): MovieService {
  const apiKey = (import.meta.env.VITE_TMDB_API_KEY ?? '').trim()
  const language = (import.meta.env.VITE_TMDB_LANGUAGE ?? '').trim() || 'pt-BR'

  if (apiKey === '') {
    console.info(
      '[o-pote] VITE_TMDB_API_KEY nao configurada: usando o catalogo local de demonstracao. ' +
        'Veja o README para configurar a chave gratuita do TMDB.',
    )
    return new MovieService(new DemoMovieProvider())
  }

  return new MovieService(new TmdbMovieProvider({ apiKey, language }))
}
