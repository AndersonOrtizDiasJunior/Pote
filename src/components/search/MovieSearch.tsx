import { Loader2, Search, X } from 'lucide-react'
import { useId, type FormEvent } from 'react'
import { Button } from '../ui/Button'

export interface MovieSearchProps {
  query: string
  loading: boolean
  onQueryChange: (query: string) => void
  onSubmit: () => void
  onClear: () => void
}

/**
 * Campo de busca.
 *
 * Usa botao explicito (e submit do formulario) em vez de debounce: uma
 * requisicao por intencao do usuario, e nao uma por tecla digitada.
 */
export function MovieSearch({
  query,
  loading,
  onQueryChange,
  onSubmit,
  onClear,
}: MovieSearchProps) {
  const inputId = useId()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <label htmlFor={inputId} className="sr-only">
          Buscar filme
        </label>
        <Search
          aria-hidden="true"
          className="text-pote-subtle pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
        />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Digite o nome de um filme..."
          autoComplete="off"
          className="border-pote-border bg-pote-surface text-pote-text placeholder:text-pote-subtle focus:border-pote-accent w-full rounded-xl border py-2.5 pr-10 pl-10 text-sm transition-colors outline-none"
        />
        {query !== '' && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpar busca"
            className="text-pote-subtle hover:text-pote-text absolute top-1/2 right-3 -translate-y-1/2"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>

      <Button type="submit" disabled={loading || query.trim() === ''} className="sm:w-32">
        {loading ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Search aria-hidden="true" className="size-4" />
        )}
        {loading ? 'Buscando' : 'Buscar'}
      </Button>
    </form>
  )
}
