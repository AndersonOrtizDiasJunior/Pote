import { Film } from 'lucide-react'
import { useState } from 'react'

export interface MoviePosterProps {
  posterUrl?: string
  title: string
  year?: number
  className?: string
  /** `lazy` na grade, `eager` no resultado do sorteio. */
  loading?: 'lazy' | 'eager'
}

/**
 * Poster com placeholder.
 *
 * Nem todo filme tem poster (e o catalogo de demonstracao nao tem nenhum),
 * entao o placeholder e um caminho normal, nao um caso de erro: mostra o
 * titulo, de forma legivel, dentro da mesma proporcao 2:3.
 */
export function MoviePoster({
  posterUrl,
  title,
  year,
  className = '',
  loading = 'lazy',
}: MoviePosterProps) {
  // Guarda QUAL url falhou, e nao apenas "falhou": assim um poster novo ganha
  // automaticamente uma nova chance, sem precisar de um efeito de reset.
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  const showImage = posterUrl !== undefined && failedUrl !== posterUrl

  return (
    <div
      className={`bg-pote-elevated relative aspect-2/3 w-full overflow-hidden ${className}`}
    >
      {showImage ? (
        <img
          src={posterUrl}
          alt={`Pôster de ${title}${year ? ` (${year})` : ''}`}
          loading={loading}
          decoding="async"
          onError={() => setFailedUrl(posterUrl ?? null)}
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-3 bg-linear-to-br from-pote-elevated to-pote-surface px-3 text-center">
          <Film aria-hidden="true" className="text-pote-subtle size-8" />
          <span className="text-pote-muted line-clamp-3 text-xs leading-snug font-medium">
            {title}
          </span>
          <span className="sr-only">Pôster não disponível.</span>
        </div>
      )}
    </div>
  )
}
