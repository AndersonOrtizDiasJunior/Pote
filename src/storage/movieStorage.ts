import type { Movie } from '../types/movie'
import { findExistingMovie } from '../utils/identity'

/**
 * Unica camada da aplicacao que fala com o `localStorage`.
 *
 * Nenhum componente ou hook chama `localStorage` diretamente. Isso deixa a
 * persistencia trocavel (IndexedDB, API, ...) e concentra num lugar so o
 * tratamento de dados corrompidos.
 */

export const MOVIES_STORAGE_KEY = 'o-pote.movies'

/** Storage disponivel? (SSR, modo privado restrito, storage desativado) */
function getStore(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') return null
    return localStorage
  } catch (error) {
    console.error('[o-pote] localStorage indisponivel:', error)
    return null
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

function optionalString(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value : undefined
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

/**
 * Valida e saneia um registro vindo do storage.
 *
 * Registros sem `id` ou sem `title` sao descartados; os demais campos caem
 * para um valor seguro. Assim um item estragado nao derruba o pote inteiro.
 */
function parseMovie(raw: unknown): Movie | null {
  if (typeof raw !== 'object' || raw === null) return null

  const value = raw as Record<string, unknown>
  if (!isNonEmptyString(value.id) || !isNonEmptyString(value.title)) return null

  const genres = Array.isArray(value.genres)
    ? value.genres.filter(isNonEmptyString)
    : []

  return {
    id: value.id,
    providerId: optionalString(value.providerId),
    imdbId: optionalString(value.imdbId),
    title: value.title,
    originalTitle: optionalString(value.originalTitle),
    year: optionalNumber(value.year),
    posterUrl: optionalString(value.posterUrl),
    backdropUrl: optionalString(value.backdropUrl),
    rating: optionalNumber(value.rating),
    genres,
    overview: optionalString(value.overview),
    watched: value.watched === true,
    addedAt: isNonEmptyString(value.addedAt) ? value.addedAt : new Date().toISOString(),
  }
}

/**
 * Le os filmes guardados.
 *
 * Nunca lanca excecao: JSON invalido, formato inesperado ou storage bloqueado
 * resultam em uma lista vazia, com o erro registrado no console.
 */
export function getMovies(): Movie[] {
  const store = getStore()
  if (!store) return []

  let serialized: string | null
  try {
    serialized = store.getItem(MOVIES_STORAGE_KEY)
  } catch (error) {
    console.error('[o-pote] falha ao ler o localStorage:', error)
    return []
  }

  if (serialized === null) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(serialized)
  } catch (error) {
    console.error('[o-pote] dados corrompidos em', MOVIES_STORAGE_KEY, error)
    return []
  }

  if (!Array.isArray(parsed)) {
    console.error('[o-pote] formato inesperado em', MOVIES_STORAGE_KEY)
    return []
  }

  const movies: Movie[] = []
  for (const raw of parsed) {
    const movie = parseMovie(raw)
    if (movie) movies.push(movie)
    else console.error('[o-pote] registro de filme invalido descartado:', raw)
  }
  return movies
}

/** Grava a lista completa. Devolve `false` se o storage recusou (ex.: cota). */
export function saveMovies(movies: readonly Movie[]): boolean {
  const store = getStore()
  if (!store) return false

  try {
    store.setItem(MOVIES_STORAGE_KEY, JSON.stringify(movies))
    return true
  } catch (error) {
    console.error('[o-pote] falha ao gravar no localStorage:', error)
    return false
  }
}

/** Resultado de uma tentativa de adicionar um filme. */
export type AddMovieResult =
  | { status: 'added'; movies: Movie[]; movie: Movie }
  | { status: 'duplicate'; movies: Movie[]; movie: Movie }

/**
 * Adiciona um filme, respeitando a regra de duplicidade.
 *
 * Quando o filme ja existe, devolve `duplicate` com o registro existente e
 * NAO cria uma segunda entrada.
 */
export function addMovie(movie: Movie): AddMovieResult {
  const movies = getMovies()

  // Usa a regra completa de identidade (IMDb ID > provider ID > titulo+ano),
  // e nao apenas a igualdade de `id`.
  const existing = findExistingMovie(movies, movie)
  if (existing) return { status: 'duplicate', movies, movie: existing }

  const next = [movie, ...movies]
  saveMovies(next)
  return { status: 'added', movies: next, movie }
}

/** Aplica alteracoes parciais a um filme e persiste. */
export function updateMovie(id: string, changes: Partial<Omit<Movie, 'id'>>): Movie[] {
  const next = getMovies().map((movie) =>
    movie.id === id ? { ...movie, ...changes } : movie,
  )
  saveMovies(next)
  return next
}

/** Remove um filme e persiste. */
export function removeMovie(id: string): Movie[] {
  const next = getMovies().filter((movie) => movie.id !== id)
  saveMovies(next)
  return next
}

/** Limpa o pote. Usado nos testes e por acoes de manutencao. */
export function clearMovies(): void {
  const store = getStore()
  if (!store) return
  try {
    store.removeItem(MOVIES_STORAGE_KEY)
  } catch (error) {
    console.error('[o-pote] falha ao limpar o localStorage:', error)
  }
}
