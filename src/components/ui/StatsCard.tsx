import type { LucideIcon } from 'lucide-react'

export interface StatsCardProps {
  value: number
  label: string
  icon?: LucideIcon
  /** Destaca o numero com a cor de acento. */
  highlight?: boolean
}

export function StatsCard({ value, label, icon: Icon, highlight = false }: StatsCardProps) {
  return (
    <div className="border-pote-border bg-pote-surface flex flex-col items-center gap-1 rounded-card border px-4 py-6 text-center">
      {Icon && (
        <Icon
          aria-hidden="true"
          className={`mb-1 size-5 ${highlight ? 'text-pote-accent' : 'text-pote-subtle'}`}
        />
      )}
      <span
        className={`text-3xl font-bold tabular-nums tracking-tight ${
          highlight ? 'text-pote-accent' : 'text-pote-text'
        }`}
      >
        {value}
      </span>
      <span className="text-pote-muted text-xs tracking-wide uppercase">{label}</span>
    </div>
  )
}
