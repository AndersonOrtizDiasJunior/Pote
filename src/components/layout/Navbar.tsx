import { NAV_ITEMS, type Route } from '../../navigation'
import { Logo } from './Logo'

export interface NavbarProps {
  current: Route
  onNavigate: (route: Route) => void
}

/** Cabecalho do celular: so a marca. A navegacao fica na barra inferior. */
export function Navbar({ current, onNavigate }: NavbarProps) {
  return (
    <header className="border-pote-border bg-pote-bg/90 sticky top-0 z-30 flex items-center gap-2.5 border-b px-4 py-3 backdrop-blur-md md:hidden">
      <button
        type="button"
        onClick={() => onNavigate('home')}
        aria-label="Ir para o início"
        className="flex items-center gap-2.5"
      >
        <Logo className="size-7" />
        <span className="text-base font-bold tracking-tight">O Pote</span>
      </button>
      <span className="text-pote-subtle ml-auto text-xs">
        {NAV_ITEMS.find((item) => item.route === current)?.label}
      </span>
    </header>
  )
}

/** Navegacao inferior do celular. */
export function BottomNav({ current, onNavigate }: NavbarProps) {
  return (
    <nav
      aria-label="Navegação principal"
      className="border-pote-border bg-pote-bg/95 fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t backdrop-blur-md md:hidden"
    >
      {NAV_ITEMS.map(({ route, label, icon: Icon }) => {
        const active = route === current
        return (
          <button
            key={route}
            type="button"
            onClick={() => onNavigate(route)}
            aria-current={active ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 py-2.5 text-[0.6875rem] font-medium transition-colors ${
              active ? 'text-pote-accent' : 'text-pote-subtle'
            }`}
          >
            <Icon aria-hidden="true" className="size-5" />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
