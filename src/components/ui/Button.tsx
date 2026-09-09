import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-pote-accent text-pote-bg hover:bg-pote-accent-strong active:bg-pote-accent-strong font-semibold',
  secondary:
    'bg-pote-elevated text-pote-text border border-pote-border hover:border-pote-border-strong hover:bg-pote-border/40',
  ghost: 'text-pote-muted hover:text-pote-text hover:bg-pote-elevated',
  danger:
    'bg-transparent text-pote-danger border border-pote-danger/40 hover:bg-pote-danger/10 hover:border-pote-danger',
}

const SIZES: Record<Size, string> = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
  lg: 'text-base px-7 py-3.5 gap-2.5 rounded-2xl',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children?: ReactNode
}

/** Botao semantico unico da aplicacao, para manter foco e estados coerentes. */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
