import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from './Button'

export interface ErrorStateProps {
  title: string
  description?: string
  onRetry?: () => void
}

/**
 * Erro amigavel.
 *
 * Recebe titulo e descricao ja traduzidos (ver `describeMovieError`); nunca
 * exibe stack trace nem mensagem tecnica do provider.
 */
export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="border-pote-danger/30 bg-pote-danger/5 flex flex-col items-center rounded-card border px-6 py-12 text-center"
    >
      <span
        aria-hidden="true"
        className="bg-pote-danger/10 text-pote-danger mb-4 flex size-12 items-center justify-center rounded-2xl"
      >
        <AlertTriangle className="size-6" />
      </span>
      <h2 className="text-pote-text text-base font-semibold">{title}</h2>
      {description && (
        <p className="text-pote-muted mt-2 max-w-sm text-sm leading-relaxed">{description}</p>
      )}
      {onRetry && (
        <Button variant="secondary" className="mt-6" onClick={onRetry}>
          <RotateCcw aria-hidden="true" className="size-4" />
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
