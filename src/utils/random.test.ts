import { describe, expect, it } from 'vitest'
import { pickRandom, pickRandomSequence } from './random'

describe('pickRandom', () => {
  it('devolve null quando nao ha opcoes', () => {
    expect(pickRandom([])).toBeNull()
  })

  it('devolve o unico item quando existe apenas um', () => {
    expect(pickRandom(['a'])).toBe('a')
  })

  it('sempre devolve um item da lista', () => {
    const items = ['a', 'b', 'c']
    for (let i = 0; i < 200; i += 1) {
      expect(items).toContain(pickRandom(items))
    }
  })

  it('nao favorece nenhuma posicao (todos os itens saem em 2000 sorteios)', () => {
    const items = ['a', 'b', 'c', 'd', 'e']
    const seen = new Set<string>()
    for (let i = 0; i < 2000; i += 1) {
      const picked = pickRandom(items)
      if (picked !== null) seen.add(picked)
    }
    expect(seen.size).toBe(items.length)
  })
})

describe('pickRandomSequence', () => {
  it('devolve a quantidade pedida', () => {
    expect(pickRandomSequence(['a', 'b'], 5)).toHaveLength(5)
  })

  it('devolve vazio quando nao ha opcoes', () => {
    expect(pickRandomSequence([], 5)).toEqual([])
  })
})
