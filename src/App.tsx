import { useCallback, useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { MovieDetailsDialog } from './components/movie/MovieDetailsDialog'
import { ConfirmDialog } from './components/ui/ConfirmDialog'
import { Toast, type ToastTone } from './components/ui/Toast'
import { useMovieJar } from './context/movieJar'
import { MoviesProvider } from './context/MoviesProvider'
import { useToast } from './hooks/useToast'
import type { Route } from './navigation'
import { DrawPage } from './pages/DrawPage'
import { HomePage } from './pages/HomePage'
import { MoviesPage } from './pages/MoviesPage'
import { SearchPage } from './pages/SearchPage'
import type { Movie } from './types/movie'

/**
 * Conteudo da aplicacao.
 *
 * Fica separado de `App` porque precisa estar DENTRO de `<MoviesProvider>`
 * para poder consumir o pote.
 */
function AppContent() {
  const [route, setRoute] = useState<Route>('home')
  const { unwatchedCount, removeMovie } = useMovieJar()
  const { toast, showToast, dismissToast } = useToast()

  // Remocao e detalhes disparados pela Home vivem aqui, junto do shell.
  const [pendingRemoval, setPendingRemoval] = useState<Movie | null>(null)
  const [details, setDetails] = useState<Movie | null>(null)

  const notify = useCallback(
    (text: string, tone: ToastTone) => showToast(text, tone),
    [showToast],
  )

  const goTo = useCallback((next: Route) => {
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  function confirmRemoval() {
    if (!pendingRemoval) return
    const { title } = pendingRemoval
    removeMovie(pendingRemoval.id)
    setPendingRemoval(null)
    setDetails(null)
    notify(`${title} saiu do pote.`, 'success')
  }

  return (
    <AppShell current={route} onNavigate={goTo} unwatchedCount={unwatchedCount}>
      {route === 'home' && (
        <HomePage
          onGoToSearch={() => goTo('search')}
          onGoToDraw={() => goTo('draw')}
          onGoToMovies={() => goTo('movies')}
          onRequestRemove={setPendingRemoval}
          onOpenDetails={setDetails}
        />
      )}

      {route === 'movies' && (
        <MoviesPage onGoToSearch={() => goTo('search')} onNotify={notify} />
      )}

      {route === 'draw' && (
        <DrawPage onGoToSearch={() => goTo('search')} onGoToMovies={() => goTo('movies')} />
      )}

      {route === 'search' && <SearchPage onNotify={notify} />}

      <ConfirmDialog
        open={pendingRemoval !== null}
        title="Remover este filme do pote?"
        description={
          pendingRemoval
            ? `"${pendingRemoval.title}" será removido. Esta ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Remover"
        destructive
        onConfirm={confirmRemoval}
        onCancel={() => setPendingRemoval(null)}
      />

      <MovieDetailsDialog movie={details} onClose={() => setDetails(null)} />

      <Toast message={toast} onDismiss={dismissToast} />
    </AppShell>
  )
}

export default function App() {
  return (
    <MoviesProvider>
      <AppContent />
    </MoviesProvider>
  )
}
