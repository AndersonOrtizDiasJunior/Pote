import { Check, Clock, Star } from 'lucide-react'

/** Nota do filme. */
export function RatingBadge({ rating }: { rating: number }) {
  return (
    <span
      className="text-pote-accent inline-flex items-center gap-1 text-xs font-semibold"
      title={`Nota ${rating.toFixed(1)} de 10`}
    >
      <Star aria-hidden="true" className="size-3.5 fill-current" />
      <span className="tabular-nums">{rating.toFixed(1)}</span>
      <span className="sr-only">de 10</span>
    </span>
  )
}

/** Nome de genero. */
export function GenreBadge({ genre }: { genre: string }) {
  return (
    <span className="border-pote-border bg-pote-elevated text-pote-muted rounded-full border px-2 py-0.5 text-[0.6875rem] leading-tight">
      {genre}
    </span>
  )
}

/**
 * Status assistido / nao assistido.
 *
 * Cor + icone + texto: nao depende somente da cor para comunicar o estado.
 */
export function WatchedBadge({ watched }: { watched: boolean }) {
  const Icon = watched ? Check : Clock
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold tracking-wide uppercase ${
        watched
          ? 'bg-pote-success/10 text-pote-success'
          : 'bg-pote-accent/10 text-pote-accent'
      }`}
    >
      <Icon aria-hidden="true" className="size-3" />
      {watched ? 'Assistido' : 'Não assistido'}
    </span>
  )
}
