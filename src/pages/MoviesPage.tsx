import { FilterX, Film, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { MovieDetailsDialog } from '../components/movie/MovieDetailsDialog'
import { MovieGrid } from '../components/movie/MovieGrid'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { useMovieJar } from '../context/movieJar'
import type { Movie, WatchFilter } from '../types/movie'

const FILTERS: readonly { value: WatchFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'unwatched', label: 'Não assistidos' },
  { value: 'watched', label: 'Assistidos' },
]

export interface MoviesPageProps {
  onGoToSearch: () => void
  onNotify: (text: string, tone: 'success' | 'info' | 'error') => void
}

export function MoviesPage({ onGoToSearch, onNotify }: MoviesPageProps) {
  const { movies, total, watchedCount, unwatchedCount, toggleWatched, removeMovie } =
    useMovieJar()

  const [filter, setFilter] = useState<WatchFilter>('all')
  const [pendingRemoval, setPendingRemoval] = useState<Movie | null>(null)
  const [details, setDetails] = useState<Movie | null>(null)

  const visible = useMemo(() => {
    if (filter === 'unwatched') return movies.filter((movie) => !movie.watched)
    if (filter === 'watched') return movies.filter((movie) => movie.watched)
    return movies
  }, [filter, movies])

  function confirmRemoval() {
    if (!pendingRemoval) return
    const { title } = pendingRemoval
    removeMovie(pendingRemoval.id)
    setPendingRemoval(null)
    setDetails(null)
    onNotify(`${title} saiu do pote.`, 'success')
  }

  if (total === 0) {
    return (
      <>
        <PageHeader title="Meu Pote" />
        <EmptyState
          icon={Film}
          title="O pote está vazio"
          description="Você ainda não adicionou nenhum filme."
          action={
            <Button onClick={onGoToSearch}>
              <Search aria-hidden="true" className="size-4" />
              Buscar filmes
            </Button>
          }
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Meu Pote"
        description={`${total} ${total === 1 ? 'filme' : 'filmes'} · ${unwatchedCount} não ${
          unwatchedCount === 1 ? 'assistido' : 'assistidos'
        } · ${watchedCount} ${watchedCount === 1 ? 'assistido' : 'assistidos'}`}
        actions={
          <Button variant="secondary" onClick={onGoToSearch}>
            <Search aria-hidden="true" className="size-4" />
            Adicionar filme
          </Button>
        }
      />

      <div
        role="radiogroup"
        aria-label="Filtrar filmes"
        className="border-pote-border bg-pote-surface mb-6 inline-flex flex-wrap gap-1 rounded-xl border p-1"
      >
        {FILTERS.map((option) => {
          const active = option.value === filter
          const count =
            option.value === 'all'
              ? total
              : option.value === 'watched'
                ? watchedCount
                : unwatchedCount

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setFilter(option.value)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                active
                  ? 'bg-pote-accent text-pote-bg'
                  : 'text-pote-muted hover:bg-pote-elevated hover:text-pote-text'
              }`}
            >
              {option.label}
              <span className="ml-1.5 tabular-nums opacity-70">{count}</span>
            </button>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={FilterX}
          title={
            filter === 'watched'
              ? 'Nenhum filme assistido ainda.'
              : 'Nenhum filme não assistido.'
          }
          description={
            filter === 'watched'
              ? 'Marque um filme como assistido para vê-lo aqui.'
              : 'Você já assistiu tudo que está no pote. Que tal adicionar mais filmes?'
          }
          action={
            <Button variant="secondary" onClick={() => setFilter('all')}>
              Ver todos os filmes
            </Button>
          }
        />
      ) : (
        <MovieGrid
          movies={visible}
          onToggleWatched={toggleWatched}
          onRequestRemove={setPendingRemoval}
          onOpenDetails={setDetails}
        />
      )}

      <ConfirmDialog
        open={pendingRemoval !== null}
        title="Remover este filme do pote?"
        description={
          pendingRemoval
            ? `"${pendingRemoval.title}" será removido. Esta ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Remover"
        destructive
        onConfirm={confirmRemoval}
        onCancel={() => setPendingRemoval(null)}
      />

      <MovieDetailsDialog movie={details} onClose={() => setDetails(null)} />
    </>
  )
}
