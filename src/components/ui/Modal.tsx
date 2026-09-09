import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'

export interface ModalProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children?: ReactNode
  footer?: ReactNode
  /** `sm` para confirmacoes, `lg` para detalhes do filme. */
  size?: 'sm' | 'lg'
}

const SELECTOR_FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Modal acessivel.
 *
 * - `role="dialog"` + `aria-modal` + titulo/descricao ligados por id
 * - fecha com Escape e com clique no backdrop
 * - move o foco para dentro ao abrir e devolve ao gatilho ao fechar
 * - prende o Tab dentro do dialogo
 */
export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  size = 'sm',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement as HTMLElement | null

    const panel = panelRef.current
    const firstFocusable = panel?.querySelector<HTMLElement>(SELECTOR_FOCUSABLE)
    ;(firstFocusable ?? panel)?.focus()

    // Impede a pagina de rolar atras do modal.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = [...(panelRef.current?.querySelectorAll<HTMLElement>(SELECTOR_FOCUSABLE) ?? [])]
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = previousOverflow
      previouslyFocused.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`border-pote-border bg-pote-surface animate-pote-rise relative my-auto w-full rounded-card border p-6 shadow-2xl shadow-black/60 ${
          size === 'lg' ? 'max-w-3xl' : 'max-w-md'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="text-pote-subtle hover:bg-pote-elevated hover:text-pote-text absolute top-4 right-4 rounded-lg p-1.5 transition-colors"
        >
          <X aria-hidden="true" className="size-5" />
        </button>

        <h2 id={titleId} className="pr-10 text-lg font-semibold tracking-tight">
          {title}
        </h2>
        {description && (
          <p id={descriptionId} className="text-pote-muted mt-2 text-sm leading-relaxed">
            {description}
          </p>
        )}

        {children && <div className="mt-5">{children}</div>}
        {footer && <div className="mt-7 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
