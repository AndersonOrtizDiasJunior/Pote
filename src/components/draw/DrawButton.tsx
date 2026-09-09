import { Dices } from 'lucide-react'
import { Button } from '../ui/Button'

export interface DrawButtonProps {
  drawing: boolean
  onDraw: () => void
}

/** Botao de sorteio. Fica desabilitado enquanto a animacao roda. */
export function DrawButton({ drawing, onDraw }: DrawButtonProps) {
  return (
    <Button
      size="lg"
      onClick={onDraw}
      disabled={drawing}
      aria-busy={drawing}
      className="shadow-pote-accent/20 min-w-56 text-base shadow-lg"
    >
      <Dices aria-hidden="true" className={`size-5 ${drawing ? 'animate-pote-shake' : ''}`} />
      {drawing ? 'Sorteando...' : 'Sortear'}
    </Button>
  )
}
