import { Dices, ExternalLink, Info } from 'lucide-react'
import type { Movie } from '../../types/movie'
import { GenreBadge, RatingBadge } from '../movie/MovieBadge'
import { MoviePoster } from '../movie/MoviePoster'
import { WatchedButton } from '../movie/WatchedButton'
import { Button } from '../ui/Button'

export interface DrawResultProps {
  movie: Movie
  onToggleWatched: (id: string) => void
  onDrawAgain: () => void
  onOpenDetails: (movie: Movie) => void
}

/**
 * Resultado do sorteio.
 *
 * O filme NAO e marcado como assistido automaticamente: marcar continua sendo
 * uma decisao explicita do usuario.
 */
export function DrawResult({
  movie,
  onToggleWatched,
  onDrawAgain,
  onOpenDetails,
}: DrawResultProps) {
  return (
    <div className="animate-pote-rise flex flex-col items-center">
      <p
        className="text-pote-subtle text-xs font-bold tracking-[0.2em] uppercase"
        aria-hidden="true"
      >
        Seu filme é...
      </p>

      <div className="mt-6 grid w-full max-w-2xl gap-6 sm:grid-cols-[200px_1fr] sm:items-start">
        <MoviePoster
          posterUrl={movie.posterUrl}
          title={movie.title}
          year={movie.year}
          loading="eager"
          className="border-pote-border mx-auto max-w-[200px] rounded-card border shadow-xl shadow-black/50"
        />

        <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <h2 className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
            {movie.title}
          </h2>

          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className="text-pote-muted -mt-1 text-sm italic">{movie.originalTitle}</p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            {movie.year !== undefined && (
              <span className="text-pote-muted text-sm tabular-nums">{movie.year}</span>
            )}
            {movie.rating !== undefined && <RatingBadge rating={movie.rating} />}
          </div>

          {movie.genres.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
              {movie.genres.map((genre) => (
                <li key={genre}>
                  <GenreBadge genre={genre} />
                </li>
              ))}
            </ul>
          )}

          {movie.overview && (
            <p className="text-pote-muted line-clamp-4 max-w-prose text-sm leading-relaxed">
              {movie.overview}
            </p>
          )}

          <div className="mt-2 flex w-full flex-wrap items-stretch justify-center gap-2 sm:justify-start">
            <WatchedButton
              watched={movie.watched}
              title={movie.title}
              size="md"
              onToggle={() => onToggleWatched(movie.id)}
              className="max-w-44 flex-none"
            />
            <Button variant="secondary" onClick={() => onOpenDetails(movie)}>
              <Info aria-hidden="true" className="size-4" />
              Detalhes
            </Button>
            {movie.imdbId && (
              <Button
                variant="ghost"
                onClick={() =>
                  window.open(
                    `https://www.imdb.com/title/${movie.imdbId}/`,
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
              >
                <ExternalLink aria-hidden="true" className="size-4" />
                Ver no IMDb
              </Button>
            )}
          </div>
        </div>
      </div>

      <Button variant="secondary" size="lg" className="mt-10" onClick={onDrawAgain}>
        <Dices aria-hidden="true" className="size-5" />
        Sortear novamente
      </Button>
    </div>
  )
}
