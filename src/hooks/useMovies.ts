import { useCallback, useEffect, useMemo, useState } from 'react'
import * as movieStorage from '../storage/movieStorage'
import type { Movie } from '../types/movie'
import { drawMovie } from '../utils/draw'
import { collectGenres } from '../utils/genres'
import { findExistingMovie } from '../utils/identity'

/** Resultado de `addMovie`, para a UI decidir a mensagem. */
export type AddMovieOutcome =
  | { status: 'added'; movie: Movie }
  | { status: 'duplicate'; movie: Movie }

export interface UseMoviesResult {
  movies: Movie[]
  total: number
  watchedCount: number
  unwatchedCount: number
  /** Generos presentes no pote, em ordem alfabetica. */
  genres: string[]
  /** Generos presentes entre os filmes ainda NAO assistidos. */
  drawableGenres: string[]

  addMovie: (movie: Movie) => AddMovieOutcome
  removeMovie: (id: string) => void
  markAsWatched: (id: string) => void
  markAsUnwatched: (id: string) => void
  toggleWatched: (id: string) => void

  hasMovie: (candidate: { imdbId?: string; id?: string; title: string; year?: number }) => boolean
  getUnwatchedMovies: () => Movie[]
  getMoviesByGenre: (genre: string) => Movie[]
  getRandomMovie: () => Movie | null
  getRandomMovieByGenre: (genre: string | null) => Movie | null
}

/**
 * Estado do pote.
 *
 * Fonte da verdade e o `localStorage`; o estado do React e um espelho. Toda
 * mutacao grava primeiro e depois atualiza o espelho, entao um refresh nunca
 * perde nada.
 */
export function useMovies(): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>(() => movieStorage.getMovies())

  // Mantem abas/janelas diferentes em sincronia.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === movieStorage.MOVIES_STORAGE_KEY) {
        setMovies(movieStorage.getMovies())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addMovie = useCallback((movie: Movie): AddMovieOutcome => {
    const result = movieStorage.addMovie(movie)
    setMovies(result.movies)
    return result.status === 'added'
      ? { status: 'added', movie: result.movie }
      : { status: 'duplicate', movie: result.movie }
  }, [])

  const removeMovie = useCallback((id: string) => {
    setMovies(movieStorage.removeMovie(id))
  }, [])

  const setWatched = useCallback((id: string, watched: boolean) => {
    setMovies(movieStorage.updateMovie(id, { watched }))
  }, [])

  const markAsWatched = useCallback((id: string) => setWatched(id, true), [setWatched])
  const markAsUnwatched = useCallback((id: string) => setWatched(id, false), [setWatched])

  const toggleWatched = useCallback(
    (id: string) => {
      const current = movies.find((movie) => movie.id === id)
      if (!current) return
      setWatched(id, !current.watched)
    },
    [movies, setWatched],
  )

  const hasMovie = useCallback(
    (candidate: { imdbId?: string; id?: string; title: string; year?: number }) =>
      findExistingMovie(movies, candidate) !== undefined,
    [movies],
  )

  const unwatched = useMemo(() => movies.filter((movie) => !movie.watched), [movies])
  const watchedCount = movies.length - unwatched.length

  const genres = useMemo(() => collectGenres(movies), [movies])
  const drawableGenres = useMemo(() => collectGenres(unwatched), [unwatched])

  const getUnwatchedMovies = useCallback(() => unwatched, [unwatched])

  const getMoviesByGenre = useCallback(
    (genre: string) => movies.filter((movie) => movie.genres.includes(genre)),
    [movies],
  )

  /** Sorteio: apenas filmes nao assistidos, todos com a mesma chance. */
  const getRandomMovie = useCallback(() => drawMovie(movies), [movies])

  const getRandomMovieByGenre = useCallback(
    (genre: string | null) => drawMovie(movies, genre),
    [movies],
  )

  return {
    movies,
    total: movies.length,
    watchedCount,
    unwatchedCount: unwatched.length,
    genres,
    drawableGenres,
    addMovie,
    removeMovie,
    markAsWatched,
    markAsUnwatched,
    toggleWatched,
    hasMovie,
    getUnwatchedMovies,
    getMoviesByGenre,
    getRandomMovie,
    getRandomMovieByGenre,
  }
}
