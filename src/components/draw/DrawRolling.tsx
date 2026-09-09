/**
 * Animacao do sorteio: os titulos do pote passam rapidamente na tela.
 *
 * E puramente decorativa (`aria-hidden`); quem usa leitor de tela recebe o
 * aviso "Sorteando..." pelo `aria-live` da pagina.
 */
export function DrawRolling({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <p className="text-pote-accent text-xs font-bold tracking-[0.2em] uppercase">
        Sorteando...
      </p>
      <div className="flex h-10 items-center overflow-hidden" aria-hidden="true">
        {/* `key` muda a cada titulo, reiniciando a animacao de entrada. */}
        <span
          key={title}
          className="animate-pote-scroll text-pote-muted max-w-[80vw] truncate text-xl font-semibold sm:text-2xl"
        >
          {title}
        </span>
      </div>
    </div>
  )
}
