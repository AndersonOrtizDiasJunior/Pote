import type { Movie } from '../types/movie'
import { pickRandom } from './random'

/**
 * Regras do sorteio, isoladas da UI para poderem ser testadas direto.
 *
 *   1. Somente filmes com `watched === false` participam.
 *   2. Com uma categoria escolhida, so participam os filmes daquela categoria.
 *   3. Entre os candidatos, a escolha e uniformemente aleatoria.
 *   4. "Sortear novamente" nao devolve o filme que ja esta na tela, desde que
 *      exista outro candidato.
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

export interface DrawOptions {
  genre?: string | null
  /**
   * Id do filme atualmente exibido.
   *
   * Ele e retirado do sorteio para que "Sortear novamente" sempre mude de
   * filme. Com apenas um candidato no total, a exclusao e ignorada - repetir
   * e a unica resposta possivel, e devolver `null` seria pior.
   *
   * Isso nao torna o sorteio tendencioso: entre os candidatos restantes a
   * chance continua igual para todos. O que muda e apenas a regra de que dois
   * sorteios seguidos nao caem no mesmo filme.
   */
  excludeId?: string | null
}

/** Sorteia um filme. `null` quando nao ha nenhum candidato. */
export function drawMovie(
  movies: readonly Movie[],
  { genre = null, excludeId = null }: DrawOptions = {},
): Movie | null {
  const candidates = getDrawableMovies(movies, genre)
  if (candidates.length === 0) return null
  if (candidates.length === 1 || excludeId === null) return pickRandom(candidates)

  const withoutCurrent = candidates.filter((movie) => movie.id !== excludeId)
  // `withoutCurrent` so fica vazio se o excluido era o unico candidato, caso
  // ja coberto acima; o fallback existe apenas por seguranca.
  return pickRandom(withoutCurrent.length > 0 ? withoutCurrent : candidates)
}
