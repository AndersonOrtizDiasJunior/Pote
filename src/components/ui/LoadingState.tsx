import { Loader2 } from 'lucide-react'

/** Loading acessivel: anuncia o texto para leitores de tela via aria-live. */
export function LoadingState({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="text-pote-muted flex flex-col items-center justify-center gap-3 py-16"
    >
      <Loader2 aria-hidden="true" className="text-pote-accent size-7 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
