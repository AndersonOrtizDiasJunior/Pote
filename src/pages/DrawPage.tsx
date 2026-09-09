import { CheckCheck, Film, Search } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DrawButton } from '../components/draw/DrawButton'
import { DrawResult } from '../components/draw/DrawResult'
import { DrawRolling } from '../components/draw/DrawRolling'
import { GenreFilter } from '../components/draw/GenreFilter'
import { PageHeader } from '../components/layout/PageHeader'
import { MovieDetailsDialog } from '../components/movie/MovieDetailsDialog'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { useMovieJar } from '../context/movieJar'
import type { Movie } from '../types/movie'
import { pickRandomSequence } from '../utils/random'

/** Duracao total da animacao e intervalo entre os titulos que passam. */
const ROLL_DURATION_MS = 1500
const ROLL_TICK_MS = 110

export interface DrawPageProps {
  onGoToSearch: () => void
  onGoToMovies: () => void
}

export function DrawPage({ onGoToSearch, onGoToMovies }: DrawPageProps) {
  const {
    total,
    unwatchedCount,
    drawableGenres,
    getUnwatchedMovies,
    getRandomMovieByGenre,
    toggleWatched,
    movies,
  } = useMovieJar()

  const [genre, setGenre] = useState<string | null>(null)
  const [drawing, setDrawing] = useState(false)
  const [rollingTitle, setRollingTitle] = useState('')
  const [drawnId, setDrawnId] = useState<string | null>(null)
  const [noneInGenre, setNoneInGenre] = useState(false)
  const [details, setDetails] = useState<Movie | null>(null)

  const timers = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id)
    timers.current = []
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  /**
   * O resultado e derivado do id sorteado, e nao guardado como objeto.
   * Assim, ao marcar como assistido, o card na tela reflete o novo estado.
   */
  const drawn = drawnId === null ? null : (movies.find((movie) => movie.id === drawnId) ?? null)

  const handleDraw = useCallback(() => {
    clearTimers()
    setNoneInGenre(false)
    setDrawnId(null)

    const winner = getRandomMovieByGenre(genre)
    if (!winner) {
      setNoneInGenre(true)
      return
    }

    // Sorteia primeiro, depois anima: a animacao e enfeite, nao o sorteio.
    const pool = genre === null
      ? getUnwatchedMovies()
      : getUnwatchedMovies().filter((movie) => movie.genres.includes(genre))

    const ticks = Math.max(1, Math.floor(ROLL_DURATION_MS / ROLL_TICK_MS))
    const sequence = pickRandomSequence(pool, ticks)

    setDrawing(true)
    setRollingTitle(sequence[0]?.title ?? winner.title)

    sequence.forEach((movie, index) => {
      if (index === 0) return
      timers.current.push(
        window.setTimeout(() => setRollingTitle(movie.title), index * ROLL_TICK_MS),
      )
    })

    timers.current.push(
      window.setTimeout(() => {
        setDrawnId(winner.id)
        setDrawing(false)
      }, ROLL_DURATION_MS),
    )
  }, [clearTimers, genre, getRandomMovieByGenre, getUnwatchedMovies])

  function handleGenreChange(next: string | null) {
    clearTimers()
    setGenre(next)
    setDrawing(false)
    setDrawnId(null)
    setNoneInGenre(false)
  }

  // Pote vazio.
  if (total === 0) {
    return (
      <>
        <PageHeader title="Sortear" />
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

  // Tem filmes, mas todos já foram assistidos.
  if (unwatchedCount === 0) {
    return (
      <>
        <PageHeader title="Sortear" />
        <EmptyState
          icon={CheckCheck}
          title="Todos os filmes já foram assistidos"
          description="Seu pote não tem nenhum filme disponível para sorteio."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="secondary" onClick={onGoToMovies}>
                Ver meus filmes
              </Button>
              <Button onClick={onGoToSearch}>
                <Search aria-hidden="true" className="size-4" />
                Buscar filmes
              </Button>
            </div>
          }
        />
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center py-4 text-center">
        <h1 className="text-pote-accent text-sm font-bold tracking-[0.3em] uppercase">
          O Pote
        </h1>
        <p className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          O que vamos assistir?
        </p>
        <p className="text-pote-muted mt-2 text-sm">
          {unwatchedCount} {unwatchedCount === 1 ? 'filme disponível' : 'filmes disponíveis'} para
          sorteio.
        </p>

        {drawableGenres.length > 0 && (
          <div className="mt-8 w-full max-w-3xl">
            <GenreFilter genres={drawableGenres} selected={genre} onSelect={handleGenreChange} />
          </div>
        )}

        {/*
          Com um resultado na tela, o proprio card ja traz "Sortear novamente".
          Esconder o botao daqui evita dois botoes identicos na mesma pagina.
        */}
        {!drawn && (
          <div className="mt-8">
            <DrawButton drawing={drawing} onDraw={handleDraw} />
          </div>
        )}

        {/* Anuncio para leitores de tela, independente da animacao visual. */}
        <p role="status" aria-live="polite" className="sr-only">
          {drawing ? 'Sorteando...' : drawn ? `Seu filme é ${drawn.title}.` : ''}
        </p>

        <div className="mt-2 w-full">
          {drawing && <DrawRolling title={rollingTitle} />}

          {!drawing && noneInGenre && (
            <div className="mx-auto mt-8 max-w-lg">
              <EmptyState
                icon={Film}
                title="Nenhum filme disponível."
                description={`Você não possui filmes não assistidos${
                  genre ? ` na categoria "${genre}"` : ''
                }.`}
                action={
                  <Button variant="secondary" onClick={() => handleGenreChange(null)}>
                    Escolher outra categoria
                  </Button>
                }
              />
            </div>
          )}

          {!drawing && drawn && (
            <div className="mt-10">
              <DrawResult
                movie={drawn}
                onToggleWatched={toggleWatched}
                onDrawAgain={handleDraw}
                onOpenDetails={setDetails}
              />
            </div>
          )}
        </div>
      </div>

      <MovieDetailsDialog movie={details} onClose={() => setDetails(null)} />
    </>
  )
}
