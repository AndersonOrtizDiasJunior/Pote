import type { MovieDetails, MovieSearchResult } from '../../types/movie'
import { normalizeTitle } from '../../utils/identity'
import { DEMO_CATALOG } from './demoCatalog'
import type { MovieProvider } from './MovieProvider'

/**
 * Provider de fallback: busca em um catalogo local embutido.
 *
 * Entra em cena quando `VITE_TMDB_API_KEY` nao esta configurada, para que a
 * aplicacao seja totalmente utilizavel (adicionar, sortear, filtrar,
 * persistir) sem exigir cadastro em servico nenhum.
 *
 * Nao substitui o TMDB: sao poucas dezenas de filmes, sem poster e sem nota.
 */
export class DemoMovieProvider implements MovieProvider {
  readonly id = 'demo'
  readonly label = 'Catálogo local (demonstração)'
  readonly requiresApiKey = false

  /** Latencia simulada, so para os estados de loading ficarem visiveis. */
  private readonly delayMs: number

  constructor(options: { delayMs?: number } = {}) {
    this.delayMs = options.delayMs ?? 220
  }

  private async delay(signal?: AbortSignal): Promise<void> {
    if (this.delayMs <= 0) return
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        signal?.removeEventListener('abort', onAbort)
        resolve()
      }, this.delayMs)

      function onAbort() {
        clearTimeout(timer)
        reject(new DOMException('Busca cancelada.', 'AbortError'))
      }

      signal?.addEventListener('abort', onAbort, { once: true })
    })
  }

  async searchMovies(query: string, signal?: AbortSignal): Promise<MovieSearchResult[]> {
    const term = normalizeTitle(query)
    if (term === '') return []

    await this.delay(signal)

    return DEMO_CATALOG.filter((movie) => {
      const haystack = `${normalizeTitle(movie.title)} ${normalizeTitle(movie.originalTitle ?? '')}`
      return haystack.includes(term)
    }).map((movie) => ({
      id: movie.id,
      title: movie.title,
      originalTitle: movie.originalTitle,
      year: movie.year,
      genres: [...movie.genres],
      overview: movie.overview,
    }))
  }

  async getMovie(id: string, signal?: AbortSignal): Promise<MovieDetails | null> {
    await this.delay(signal)
    const movie = DEMO_CATALOG.find((candidate) => candidate.id === id)
    return movie ? { ...movie, genres: [...movie.genres] } : null
  }
}
