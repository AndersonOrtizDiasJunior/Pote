import type { Movie } from '../types/movie'
import { buildMovieId } from '../utils/identity'

/** Cria um filme de teste, deixando sobrescrever qualquer campo. */
export function makeMovie(overrides: Partial<Movie> & { title: string }): Movie {
  const base = {
    providerId: overrides.providerId,
    imdbId: overrides.imdbId,
    title: overrides.title,
    year: overrides.year,
  }

  return {
    id: overrides.id ?? buildMovieId(base),
    genres: [],
    watched: false,
    addedAt: new Date('2026-01-01T12:00:00.000Z').toISOString(),
    ...overrides,
  }
}
