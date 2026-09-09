import type { ReactNode } from 'react'
import type { Route } from '../../navigation'
import { BottomNav, Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export interface AppShellProps {
  current: Route
  onNavigate: (route: Route) => void
  unwatchedCount: number
  children: ReactNode
}

/**
 * Estrutura da aplicacao.
 *
 * Desktop: sidebar fixa. Celular: cabecalho no topo e navegacao inferior.
 */
export function AppShell({ current, onNavigate, unwatchedCount, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <a
        href="#conteudo"
        className="focus:bg-pote-accent focus:text-pote-bg sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-70 focus:rounded-lg focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Pular para o conteúdo
      </a>

      <Sidebar current={current} onNavigate={onNavigate} unwatchedCount={unwatchedCount} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar current={current} onNavigate={onNavigate} />

        <main
          id="conteudo"
          className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-24 sm:px-6 md:pb-10 lg:px-8"
        >
          {children}
        </main>

        <BottomNav current={current} onNavigate={onNavigate} />
      </div>
    </div>
  )
}
