import type { MovieDetails, MovieSearchResult } from '../../types/movie'

/**
 * Contrato de um provider de filmes.
 *
 * Toda a aplicacao acima desta camada (MovieService, hooks, componentes)
 * ignora completamente qual API esta por tras. Trocar TMDB por OMDb significa
 * escrever uma nova classe que implemente esta interface.
 *
 *   React Component -> MovieService -> MovieProvider -> API
 */
export interface MovieProvider {
  /** Identificador tecnico do provider (ex.: `tmdb`). */
  readonly id: string
  /** Nome exibivel do provider (ex.: `TMDB`). */
  readonly label: string
  /** Se `true`, o provider so funciona com uma chave configurada. */
  readonly requiresApiKey: boolean

  /** Busca filmes por nome. Devolve lista vazia quando nao ha resultados. */
  searchMovies(query: string, signal?: AbortSignal): Promise<MovieSearchResult[]>

  /** Detalhes completos de um filme. `null` quando o filme nao existe. */
  getMovie(id: string, signal?: AbortSignal): Promise<MovieDetails | null>
}
