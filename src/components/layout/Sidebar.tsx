import { NAV_ITEMS, type Route } from '../../navigation'
import { Logo } from './Logo'

export interface SidebarProps {
  current: Route
  onNavigate: (route: Route) => void
  unwatchedCount: number
}

/** Navegacao lateral, visivel a partir de `md`. */
export function Sidebar({ current, onNavigate, unwatchedCount }: SidebarProps) {
  return (
    <aside className="border-pote-border bg-pote-surface/50 hidden w-60 shrink-0 border-r md:flex md:flex-col">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <Logo />
        <span className="text-lg font-bold tracking-tight">O Pote</span>
      </div>

      <nav aria-label="Navegação principal" className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ route, label, icon: Icon }) => {
          const active = route === current
          return (
            <button
              key={route}
              type="button"
              onClick={() => onNavigate(route)}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                active
                  ? 'bg-pote-accent/10 text-pote-accent'
                  : 'text-pote-muted hover:bg-pote-elevated hover:text-pote-text'
              }`}
            >
              <Icon aria-hidden="true" className="size-4.5 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {route === 'movies' && unwatchedCount > 0 && (
                <span
                  className="bg-pote-elevated text-pote-muted rounded-full px-1.5 py-0.5 text-[0.6875rem] tabular-nums"
                  aria-label={`${unwatchedCount} não assistidos`}
                >
                  {unwatchedCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <p className="text-pote-subtle mt-auto px-6 py-6 text-xs leading-relaxed">
        Guarde os filmes que você quer assistir e deixe o sorteio decidir.
      </p>
    </aside>
  )
}
