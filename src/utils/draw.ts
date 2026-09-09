import type { Movie } from '../types/movie'
import { pickRandom } from './random'

/**
 * Regras do sorteio, isoladas da UI para poderem ser testadas direto.
 *
 *   1. Somente filmes com `watched === false` participam.
 *   2. Com uma categoria escolhida, so participam os filmes daquela categoria.
 *   3. Entre os candidatos, a escolha e uniformemente aleatoria.
 */

/** Filmes elegiveis ao sorteio. `genre === null` significa "todos". */
export function getDrawableMovies(
  movies: readonly Movie[],
  genre: string | null = null,
): Movie[] {
  const unwatched = movies.filter((movie) => !movie.watched)
  if (genre === null) return unwatched
  return unwatched.filter((movie) => movie.genres.includes(genre))
}

/** Sorteia um filme. `null` quando nao ha nenhum candidato. */
export function drawMovie(
  movies: readonly Movie[],
  genre: string | null = null,
): Movie | null {
  return pickRandom(getDrawableMovies(movies, genre))
}
