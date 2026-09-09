import type { Movie } from '../../types/movie'
import { MovieCard } from './MovieCard'

export interface MovieGridProps {
  movies: readonly Movie[]
  onToggleWatched: (id: string) => void
  onRequestRemove: (movie: Movie) => void
  onOpenDetails?: (movie: Movie) => void
}

/**
 * Grade responsiva: 2 colunas no celular ate 6 em telas largas.
 */
export function MovieGrid({
  movies,
  onToggleWatched,
  onRequestRemove,
  onOpenDetails,
}: MovieGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {movies.map((movie) => (
        <li key={movie.id} className="flex">
          <MovieCard
            movie={movie}
            onToggleWatched={onToggleWatched}
            onRequestRemove={onRequestRemove}
            onOpenDetails={onOpenDetails}
          />
        </li>
      ))}
    </ul>
  )
}
