import type { ReactNode } from 'react'
import { useMovies } from '../hooks/useMovies'
import { MovieJarContext } from './movieJar'

/**
 * O pote e um estado unico compartilhado por todas as paginas.
 *
 * `useMovies` e chamado uma vez aqui; as paginas consomem via `useMovieJar`.
 * Sem isso, cada pagina teria a sua propria copia do estado e as telas
 * divergiriam ate o proximo refresh.
 */
export function MoviesProvider({ children }: { children: ReactNode }) {
  const value = useMovies()
  return <MovieJarContext.Provider value={value}>{children}</MovieJarContext.Provider>
}
