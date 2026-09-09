import { Check, Clock, Dices, Film, Search } from 'lucide-react'
import { Logo } from '../components/layout/Logo'
import { MovieCard } from '../components/movie/MovieCard'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { StatsCard } from '../components/ui/StatsCard'
import { useMovieJar } from '../context/movieJar'
import { getMovieService } from '../services/movie'
import type { Movie } from '../types/movie'

export interface HomePageProps {
  onGoToSearch: () => void
  onGoToDraw: () => void
  onGoToMovies: () => void
  onRequestRemove: (movie: Movie) => void
  onOpenDetails: (movie: Movie) => void
}

export function HomePage({
  onGoToSearch,
  onGoToDraw,
  onGoToMovies,
  onRequestRemove,
  onOpenDetails,
}: HomePageProps) {
  const { movies, total, watchedCount, unwatchedCount, toggleWatched } = useMovieJar()
  const service = getMovieService()

  const recent = movies.slice(0, 6)

  return (
    <div className="flex flex-col gap-12">
      {/* Chamada principal */}
      <section className="flex flex-col items-center pt-6 text-center sm:pt-10">
        <Logo className="size-14" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">O Pote</h1>
        <p className="text-pote-muted mt-2.5 text-base">Seu próximo filme está aqui.</p>

        <Button
          size="lg"
          className="shadow-pote-accent/20 mt-8 min-w-56 shadow-lg"
          onClick={onGoToDraw}
          disabled={unwatchedCount === 0}
        >
          <Dices aria-hidden="true" className="size-5" />
          Sortear
        </Button>

        {total > 0 && unwatchedCount === 0 && (
          <p className="text-pote-subtle mt-3 text-xs">
            Todos os filmes do pote já foram assistidos.
          </p>
        )}
      </section>

      <hr className="border-pote-border" />

      {/* Estatisticas */}
      <section aria-labelledby="estatisticas">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 id="estatisticas" className="text-lg font-semibold tracking-tight">
            Meu Pote
          </h2>
          {total > 0 && (
            <Button variant="ghost" size="sm" onClick={onGoToMovies}>
              Ver todos
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatsCard value={total} label="Filmes" icon={Film} />
          <StatsCard value={unwatchedCount} label="Não assistidos" icon={Clock} highlight />
          <StatsCard value={watchedCount} label="Assistidos" icon={Check} />
        </div>
      </section>

      {/* Adicionados recentemente */}
      <section aria-labelledby="recentes">
        <h2 id="recentes" className="mb-5 text-lg font-semibold tracking-tight">
          {total > 0 ? 'Últimos adicionados' : 'Comece o seu pote'}
        </h2>

        {total === 0 ? (
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
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {recent.map((movie) => (
              <li key={movie.id} className="flex">
                <MovieCard
                  movie={movie}
                  onToggleWatched={toggleWatched}
                  onRequestRemove={onRequestRemove}
                  onOpenDetails={onOpenDetails}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Adicionar mais */}
      {total > 0 && (
        <section className="border-pote-border bg-pote-surface/60 flex flex-col items-center rounded-card border border-dashed px-6 py-10 text-center">
          <h2 className="text-base font-semibold">Quer adicionar um filme?</h2>
          <p className="text-pote-muted mt-1.5 text-sm">
            Pesquise em {service.providerLabel} e jogue no pote.
          </p>
          <Button variant="secondary" className="mt-5" onClick={onGoToSearch}>
            <Search aria-hidden="true" className="size-4" />
            Buscar filmes
          </Button>
        </section>
      )}
    </div>
  )
}
