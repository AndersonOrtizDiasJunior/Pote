import { Check, Loader2, Plus } from 'lucide-react'
import type { MovieSearchResult } from '../../types/movie'
import { GenreBadge, RatingBadge } from '../movie/MovieBadge'
import { MoviePoster } from '../movie/MoviePoster'
import { Button } from '../ui/Button'

export interface MovieSearchResultCardProps {
  result: MovieSearchResult
  /** Ja esta no pote: o botao vira um estado, nao uma acao. */
  alreadyInJar: boolean
  adding: boolean
  onAdd: (result: MovieSearchResult) => void
}

export function MovieSearchResultCard({
  result,
  alreadyInJar,
  adding,
  onAdd,
}: MovieSearchResultCardProps) {
  return (
    <article className="border-pote-border bg-pote-surface hover:border-pote-border-strong flex w-full flex-col overflow-hidden rounded-card border transition-colors duration-200">
      <MoviePoster posterUrl={result.posterUrl} title={result.title} year={result.year} />

      <div className="flex flex-1 flex-col gap-2.5 p-3.5">
        <div>
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold" title={result.title}>
            {result.title}
          </h3>
          <div className="text-pote-muted mt-1 flex items-center gap-2 text-xs">
            {result.year !== undefined && <span className="tabular-nums">{result.year}</span>}
            {result.year !== undefined && result.rating !== undefined && (
              <span aria-hidden="true" className="text-pote-subtle">
                •
              </span>
            )}
            {result.rating !== undefined && <RatingBadge rating={result.rating} />}
          </div>
        </div>

        {result.genres && result.genres.length > 0 && (
          <ul className="flex flex-wrap gap-1">
            {result.genres.slice(0, 3).map((genre) => (
              <li key={genre}>
                <GenreBadge genre={genre} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-1">
          {/*
            Filme ja no pote: o botao muda de aparencia mas continua ativo.
            Assim o estado fica visivel de imediato e, se o usuario insistir,
            recebe a explicacao ("Este filme já está no pote.") em vez de um
            clique que nao faz nada.
          */}
          <Button
            variant={alreadyInJar ? 'secondary' : 'primary'}
            size="sm"
            disabled={adding}
            onClick={() => onAdd(result)}
            aria-label={
              alreadyInJar
                ? `${result.title} já está no pote`
                : `Adicionar ${result.title} ao pote`
            }
            className={`w-full ${alreadyInJar ? 'text-pote-success' : ''}`}
          >
            {adding ? (
              <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
            ) : alreadyInJar ? (
              <Check aria-hidden="true" className="size-3.5" />
            ) : (
              <Plus aria-hidden="true" className="size-3.5" />
            )}
            {adding ? 'Adicionando' : alreadyInJar ? 'No pote' : 'Adicionar ao pote'}
          </Button>
        </div>
      </div>
    </article>
  )
}
