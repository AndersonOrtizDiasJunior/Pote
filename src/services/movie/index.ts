import { createMovieService, type MovieService } from './MovieService'

export { MovieService } from './MovieService'
export type { MovieProvider } from './MovieProvider'
export { describeMovieError, MovieProviderError } from './errors'

let instance: MovieService | null = null

/**
 * Instancia unica do servico.
 *
 * O provider e escolhido a partir do ambiente uma vez por sessao; assim o
 * cache de busca e o mapa de generos do TMDB sao compartilhados entre paginas.
 */
export function getMovieService(): MovieService {
  instance ??= createMovieService()
  return instance
}
