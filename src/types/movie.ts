/**
 * Modelo de dados central da aplicacao.
 *
 * Nada aqui depende de um provider especifico. Cada provider (TMDB, catalogo
 * local, ...) traduz a sua resposta para estes tipos atraves de um mapper.
 */

/** Um filme guardado no pote do usuario. */
export interface Movie {
  /** Identificador interno e estavel. Ver `buildMovieId`. */
  id: string
  /** Identificador do filme no provider de origem (ex.: TMDB ID). */
  providerId?: string
  /** IMDb ID (ex.: `tt0816692`), somente quando o provider fornecer. */
  imdbId?: string
  title: string
  originalTitle?: string
  year?: number
  posterUrl?: string
  backdropUrl?: string
  /** Nota de 0 a 10, conforme o provider. */
  rating?: number
  /** Nomes de genero em portugues, ja traduzidos. */
  genres: string[]
  overview?: string
  watched: boolean
  /** Data ISO em que o filme entrou no pote. */
  addedAt: string
}

/** Resultado de busca, ainda fora do pote. */
export interface MovieSearchResult {
  /** Id do filme no provider. */
  id: string
  imdbId?: string
  title: string
  originalTitle?: string
  year?: number
  posterUrl?: string
  backdropUrl?: string
  rating?: number
  genres?: string[]
  overview?: string
}

/**
 * Detalhes completos de um filme, do ponto de vista do provider.
 *
 * Difere de `Movie` por nao conter os campos que pertencem ao pote do usuario
 * (`watched`, `addedAt`), que sao responsabilidade da camada de storage.
 */
export interface MovieDetails {
  id: string
  imdbId?: string
  title: string
  originalTitle?: string
  year?: number
  posterUrl?: string
  backdropUrl?: string
  rating?: number
  genres: string[]
  overview?: string
}

/** Filtro da pagina "Meu Pote". */
export type WatchFilter = 'all' | 'unwatched' | 'watched'
