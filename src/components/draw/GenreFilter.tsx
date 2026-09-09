export interface GenreFilterProps {
  genres: readonly string[]
  /** `null` significa "Todos". */
  selected: string | null
  onSelect: (genre: string | null) => void
  label?: string
}

/**
 * Filtro de categoria.
 *
 * As opcoes vem sempre dos filmes que existem no pote: uma categoria vazia
 * nunca e oferecida. Usa `role="radiogroup"` porque a escolha e exclusiva.
 */
export function GenreFilter({
  genres,
  selected,
  onSelect,
  label = 'Sortear por categoria',
}: GenreFilterProps) {
  const options: { value: string | null; text: string }[] = [
    { value: null, text: 'Todos' },
    ...genres.map((genre) => ({ value: genre, text: genre })),
  ]

  return (
    <div>
      <p className="text-pote-subtle mb-3 text-center text-xs font-semibold tracking-wider uppercase">
        {label}
      </p>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap justify-center gap-2">
        {options.map((option) => {
          const active = option.value === selected
          return (
            <button
              key={option.value ?? '__all__'}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(option.value)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                active
                  ? 'border-pote-accent bg-pote-accent text-pote-bg'
                  : 'border-pote-border bg-pote-surface text-pote-muted hover:border-pote-border-strong hover:text-pote-text'
              }`}
            >
              {option.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
