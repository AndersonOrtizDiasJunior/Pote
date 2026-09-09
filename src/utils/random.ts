/**
 * Sorteio imparcial: cada item tem exatamente a mesma chance.
 *
 * Nao ordena, nao pondera por nota e nao favorece itens recentes.
 */
export function pickRandom<T>(items: readonly T[]): T | null {
  if (items.length === 0) return null
  const index = Math.floor(Math.random() * items.length)
  return items[index] ?? null
}

/** Sequencia de itens aleatorios, usada apenas na animacao do sorteio. */
export function pickRandomSequence<T>(items: readonly T[], length: number): T[] {
  const sequence: T[] = []
  for (let i = 0; i < length; i += 1) {
    const item = pickRandom(items)
    if (item !== null) sequence.push(item)
  }
  return sequence
}
