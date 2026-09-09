import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { useEffect } from 'react'

export type ToastTone = 'success' | 'info' | 'error'

export interface ToastMessage {
  id: number
  tone: ToastTone
  text: string
}

const TONES: Record<ToastTone, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: 'border-pote-success/40 text-pote-success' },
  info: { icon: Info, className: 'border-pote-accent/40 text-pote-accent' },
  error: { icon: XCircle, className: 'border-pote-danger/40 text-pote-danger' },
}

/**
 * Avisos curtos (filme adicionado, filme duplicado).
 *
 * `aria-live="polite"` para que o leitor de tela anuncie sem interromper.
 */
export function Toast({
  message,
  onDismiss,
  durationMs = 3200,
}: {
  message: ToastMessage | null
  onDismiss: () => void
  durationMs?: number
}) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDismiss, durationMs)
    return () => clearTimeout(timer)
  }, [message, onDismiss, durationMs])

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-60 flex justify-center px-4 sm:bottom-8"
    >
      {message && (
        <div
          className={`bg-pote-elevated animate-pote-rise pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-xl shadow-black/50 ${
            TONES[message.tone].className
          }`}
        >
          {(() => {
            const Icon = TONES[message.tone].icon
            return <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          })()}
          <p className="text-pote-text text-sm leading-relaxed">{message.text}</p>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Fechar aviso"
            className="text-pote-subtle hover:text-pote-text ml-1 shrink-0 text-xs"
          >
            <XCircle aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
