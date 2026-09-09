import { ExternalLink } from 'lucide-react'
import type { Movie } from '../../types/movie'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { GenreBadge, RatingBadge, WatchedBadge } from './MovieBadge'
import { MoviePoster } from './MoviePoster'

/** Linha `rotulo: valor` da ficha tecnica. */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-xs">
      <dt className="text-pote-subtle shrink-0">{label}</dt>
      <dd className="text-pote-muted font-mono break-all">{value}</dd>
    </div>
  )
}

export function MovieDetailsDialog({
  movie,
  onClose,
}: {
  movie: Movie | null
  onClose: () => void
}) {
  if (!movie) return null

  return (
    <Modal open size="lg" title={movie.title} onClose={onClose}>
      <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
        <MoviePoster
          posterUrl={movie.posterUrl}
          title={movie.title}
          year={movie.year}
          loading="eager"
          className="mx-auto max-w-[180px] rounded-xl"
        />

        <div className="flex flex-col gap-4">
          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className="text-pote-muted text-sm italic">{movie.originalTitle}</p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {movie.year !== undefined && (
              <span className="text-pote-muted text-sm tabular-nums">{movie.year}</span>
            )}
            {movie.rating !== undefined && <RatingBadge rating={movie.rating} />}
            <WatchedBadge watched={movie.watched} />
          </div>

          {movie.genres.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {movie.genres.map((genre) => (
                <li key={genre}>
                  <GenreBadge genre={genre} />
                </li>
              ))}
            </ul>
          )}

          {movie.overview ? (
            <p className="text-pote-muted text-sm leading-relaxed">{movie.overview}</p>
          ) : (
            <p className="text-pote-subtle text-sm italic">Sinopse não disponível.</p>
          )}

          <dl className="border-pote-border mt-auto flex flex-col gap-1.5 border-t pt-4">
            {movie.providerId && <DetailRow label="ID do provider:" value={movie.providerId} />}
            {movie.imdbId && <DetailRow label="IMDb ID:" value={movie.imdbId} />}
            <DetailRow
              label="Adicionado em:"
              value={new Date(movie.addedAt).toLocaleDateString('pt-BR')}
            />
          </dl>

          {/* O botao so aparece quando existe um IMDb ID real do provider. */}
          {movie.imdbId && (
            <Button
              variant="secondary"
              size="sm"
              className="self-start"
              onClick={() =>
                window.open(
                  `https://www.imdb.com/title/${movie.imdbId}/`,
                  '_blank',
                  'noopener,noreferrer',
                )
              }
            >
              <ExternalLink aria-hidden="true" className="size-3.5" />
              Ver no IMDb
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
