import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

/** Estado vazio: sempre com um titulo, uma explicacao e um proximo passo. */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="border-pote-border bg-pote-surface/60 flex flex-col items-center rounded-card border border-dashed px-6 py-14 text-center">
      {Icon && (
        <span
          aria-hidden="true"
          className="bg-pote-elevated text-pote-subtle mb-5 flex size-14 items-center justify-center rounded-2xl"
        >
          <Icon className="size-7" />
        </span>
      )}
      <h2 className="text-pote-text text-lg font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="text-pote-muted mt-2 max-w-sm text-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
