import { Check, Undo2 } from 'lucide-react'
import { Button, type ButtonProps } from '../ui/Button'

export interface WatchedButtonProps extends Omit<ButtonProps, 'children' | 'variant'> {
  watched: boolean
  title: string
  onToggle: () => void
}

/**
 * Alterna assistido / nao assistido.
 *
 * O `aria-label` inclui o titulo do filme porque, numa grade, "Já assisti"
 * repetido dezenas de vezes nao diz nada a um leitor de tela.
 */
export function WatchedButton({
  watched,
  title,
  onToggle,
  size = 'sm',
  className = '',
  ...rest
}: WatchedButtonProps) {
  const label = watched ? 'Marcar como não assistido' : 'Já assisti'
  const Icon = watched ? Undo2 : Check

  return (
    <Button
      variant={watched ? 'secondary' : 'primary'}
      size={size}
      onClick={onToggle}
      aria-label={`${label}: ${title}`}
      className={`flex-1 ${className}`}
      {...rest}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="truncate">{watched ? 'Não assisti' : 'Já assisti'}</span>
    </Button>
  )
}
