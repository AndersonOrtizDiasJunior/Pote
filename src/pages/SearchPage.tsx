import { KeyRound, SearchX, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { MovieSearch } from '../components/search/MovieSearch'
import { MovieSearchResultCard } from '../components/search/MovieSearchResultCard'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { useMovieJar } from '../context/movieJar'
import { describeMovieError, getMovieService } from '../services/movie'
import type { MovieSearchResult } from '../types/movie'

type SearchStatus = 'idle' | 'loading' | 'success' | 'error'

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export interface SearchPageProps {
  onNotify: (text: string, tone: 'success' | 'info' | 'error') => void
}

export function SearchPage({ onNotify }: SearchPageProps) {
  const service = getMovieService()
  const { addMovie, hasMovie } = useMovieJar()

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [results, setResults] = useState<MovieSearchResult[]>([])
  const [error, setError] = useState<{ title: string; description: string } | null>(null)
  const [addingId, setAddingId] = useState<string | null>(null)
  /** Termo da ultima busca concluida, para a mensagem de "nada encontrado". */
  const [searchedTerm, setSearchedTerm] = useState('')

  const abortRef = useRef<AbortController | null>(null)

  // Cancela a busca em andamento se o usuario sair da pagina.
  useEffect(() => () => abortRef.current?.abort(), [])

  const runSearch = useCallback(
    async (term: string) => {
      const trimmed = term.trim()
      if (trimmed === '') return

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setStatus('loading')
      setError(null)

      try {
        const found = await service.searchMovies(trimmed, controller.signal)
        if (controller.signal.aborted) return
        setResults(found)
        setSearchedTerm(trimmed)
        setStatus('success')
      } catch (caught) {
        if (isAbort(caught) || controller.signal.aborted) return
        console.error('[o-pote] falha na busca:', caught)
        setError(describeMovieError(caught))
        setResults([])
        setStatus('error')
      }
    },
    [service],
  )

  const handleAdd = useCallback(
    async (result: MovieSearchResult) => {
      // Atalho: se ja sabemos que o filme esta no pote, avisa na hora e nao
      // gasta uma chamada de detalhes. A trava definitiva continua sendo a do
      // storage, que cobre tambem cliques simultaneos.
      if (hasMovie(result)) {
        onNotify('Este filme já está no pote.', 'info')
        return
      }

      setAddingId(result.id)
      try {
        // `buildMovie` tenta enriquecer com o IMDb ID antes de guardar.
        const movie = await service.buildMovie(result)
        const outcome = addMovie(movie)

        if (outcome.status === 'duplicate') {
          onNotify('Este filme já está no pote.', 'info')
        } else {
          onNotify(`${movie.title} entrou no pote.`, 'success')
        }
      } catch (caught) {
        if (isAbort(caught)) return
        console.error('[o-pote] falha ao adicionar o filme:', caught)
        onNotify('Não foi possível adicionar o filme. Tente novamente.', 'error')
      } finally {
        setAddingId(null)
      }
    },
    [addMovie, hasMovie, onNotify, service],
  )

  const handleClear = useCallback(() => {
    abortRef.current?.abort()
    setQuery('')
    setResults([])
    setSearchedTerm('')
    setError(null)
    setStatus('idle')
  }, [])

  return (
    <>
      <PageHeader
        title="Buscar filmes"
        description={`Resultados fornecidos por ${service.providerLabel}.`}
      />

      <div className="mb-8 max-w-2xl">
        <MovieSearch
          query={query}
          loading={status === 'loading'}
          onQueryChange={setQuery}
          onSubmit={() => void runSearch(query)}
          onClear={handleClear}
        />

        {service.isDemoMode && (
          <p className="border-pote-accent/25 bg-pote-accent-soft/40 text-pote-muted mt-4 flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-xs leading-relaxed">
            <KeyRound aria-hidden="true" className="text-pote-accent mt-0.5 size-4 shrink-0" />
            <span>
              <strong className="text-pote-text font-semibold">Modo demonstração.</strong> Sem
              uma chave de API configurada, a busca usa um catálogo local com algumas dezenas de
              filmes conhecidos, sem pôsteres e sem notas. Para buscar o catálogo completo,
              configure a chave gratuita do TMDB em{' '}
              <code className="text-pote-accent">.env</code> — o README explica como.
            </span>
          </p>
        )}
      </div>

      {status === 'idle' && (
        <EmptyState
          icon={Sparkles}
          title="Pesquise por um filme para adicioná-lo ao seu pote."
          description="Digite o nome de um filme no campo acima e toque em Buscar."
        />
      )}

      {status === 'loading' && <LoadingState label="Buscando filmes..." />}

      {status === 'error' && error && (
        <ErrorState
          title={error.title}
          description={error.description}
          onRetry={() => void runSearch(query)}
        />
      )}

      {status === 'success' && results.length === 0 && (
        <EmptyState
          icon={SearchX}
          title="Nenhum filme encontrado."
          description={`Nada encontrado para "${searchedTerm}". Tente pesquisar por outro nome.`}
        />
      )}

      {status === 'success' && results.length > 0 && (
        <>
          <p className="text-pote-muted mb-4 text-sm" role="status" aria-live="polite">
            {results.length === 1
              ? '1 filme encontrado'
              : `${results.length} filmes encontrados`}{' '}
            para "{searchedTerm}"
          </p>

          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {results.map((result) => (
              <li key={result.id} className="flex">
                <MovieSearchResultCard
                  result={result}
                  alreadyInJar={hasMovie(result)}
                  adding={addingId === result.id}
                  onAdd={(item) => void handleAdd(item)}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
