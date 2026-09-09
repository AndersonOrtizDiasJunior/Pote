import { Dices, Film, Home, Search, type LucideIcon } from 'lucide-react'

/**
 * Navegacao da aplicacao.
 *
 * Sao quatro telas sem URLs proprias nem parametros, entao o roteamento e um
 * simples estado no `App` - nao vale trazer uma biblioteca de rotas para isso.
 */
export type Route = 'home' | 'movies' | 'draw' | 'search'

export interface NavItem {
  route: Route
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: readonly NavItem[] = [
  { route: 'home', label: 'Início', icon: Home },
  { route: 'movies', label: 'Meu Pote', icon: Film },
  { route: 'draw', label: 'Sortear', icon: Dices },
  { route: 'search', label: 'Buscar', icon: Search },
]

export const PAGE_TITLES: Readonly<Record<Route, string>> = {
  home: 'Início',
  movies: 'Meu Pote',
  draw: 'Sortear',
  search: 'Buscar filmes',
}
