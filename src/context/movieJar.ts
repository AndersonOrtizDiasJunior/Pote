import { createContext, useContext } from 'react'
import type { UseMoviesResult } from '../hooks/useMovies'

/**
 * Contexto do pote.
 *
 * Fica separado do componente `MoviesProvider` para que aquele arquivo exporte
 * somente componentes (requisito do fast refresh do Vite).
 */
export const MovieJarContext = createContext<UseMoviesResult | null>(null)

/** Acessa o pote compartilhado. Lanca se usado fora do provider. */
export function useMovieJar(): UseMoviesResult {
  const context = useContext(MovieJarContext)
  if (context === null) {
    throw new Error('useMovieJar precisa estar dentro de <MoviesProvider>.')
  }
  return context
}
