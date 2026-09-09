import { Info, Trash2 } from 'lucide-react'
import type { Movie } from '../../types/movie'
import { Button } from '../ui/Button'
import { GenreBadge, RatingBadge, WatchedBadge } from './MovieBadge'
import { MoviePoster } from './MoviePoster'
import { WatchedButton } from './WatchedButton'

export interface MovieCardProps {
  movie: Movie
  onToggleWatched: (id: string) => void
  onRequestRemove: (movie: Movie) => void
  onOpenDetails?: (movie: Movie) => void
}

/** Card de um filme que ja esta no pote. */
export function MovieCard({
  movie,
  onToggleWatched,
  onRequestRemove,
  onOpenDetails,
}: MovieCardProps) {
  return (
    <article className="border-pote-border bg-pote-surface hover:border-pote-border-strong group flex w-full flex-col overflow-hidden rounded-card border transition-colors duration-200">
      <div className="relative">
        <MoviePoster posterUrl={movie.posterUrl} title={movie.title} year={movie.year} />

        {movie.watched && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-pote-bg/55 transition-opacity group-hover:bg-pote-bg/35"
          />
        )}

        {onOpenDetails && (
          <button
            type="button"
            onClick={() => onOpenDetails(movie)}
            aria-label={`Ver detalhes de ${movie.title}`}
            className="text-pote-text absolute top-2 right-2 rounded-lg bg-black/60 p-1.5 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <Info aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3.5">
        <div>
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold" title={movie.title}>
            {movie.title}
          </h3>
          <div className="text-pote-muted mt-1 flex items-center gap-2 text-xs">
            {movie.year !== undefined && <span className="tabular-nums">{movie.year}</span>}
            {movie.year !== undefined && movie.rating !== undefined && (
              <span aria-hidden="true" className="text-pote-subtle">
                •
              </span>
            )}
            {movie.rating !== undefined && <RatingBadge rating={movie.rating} />}
          </div>
        </div>

        {movie.genres.length > 0 && (
          <ul className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 3).map((genre) => (
              <li key={genre}>
                <GenreBadge genre={genre} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-1">
          <WatchedBadge watched={movie.watched} />
        </div>

        <div className="flex items-stretch gap-2">
          <WatchedButton
            watched={movie.watched}
            title={movie.title}
            onToggle={() => onToggleWatched(movie.id)}
          />
          <Button
            variant="danger"
            size="sm"
            onClick={() => onRequestRemove(movie)}
            aria-label={`Remover ${movie.title} do pote`}
            className="shrink-0"
          >
            <Trash2 aria-hidden="true" className="size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  )
}
