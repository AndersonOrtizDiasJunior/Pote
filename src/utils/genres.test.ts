import { describe, expect, it } from 'vitest'
import { collectGenres, toGenreName, toGenreNames } from './genres'

describe('toGenreName', () => {
  it('traduz ids do TMDB', () => {
    expect(toGenreName(878)).toBe('Ficção científica')
    expect(toGenreName(27)).toBe('Terror')
    expect(toGenreName('16')).toBe('Animação')
  })

  it('traduz nomes em ingles', () => {
    expect(toGenreName('Horror')).toBe('Terror')
    expect(toGenreName('science fiction')).toBe('Ficção científica')
    expect(toGenreName('Western')).toBe('Faroeste')
  })

  it('mantem nomes que o provider ja mandou em portugues', () => {
    expect(toGenreName('Ficção científica')).toBe('Ficção científica')
    expect(toGenreName('Aventura')).toBe('Aventura')
  })

  it('devolve null para entradas inuteis', () => {
    expect(toGenreName(null)).toBeNull()
    expect(toGenreName(undefined)).toBeNull()
    expect(toGenreName('   ')).toBeNull()
    expect(toGenreName(999999)).toBeNull()
  })
})

describe('toGenreNames', () => {
  it('traduz, remove nulos e nao repete', () => {
    expect(toGenreNames([28, 'Action', 12, null, 'Aventura', 999999])).toEqual([
      'Ação',
      'Aventura',
    ])
  })
})

describe('collectGenres', () => {
  it('lista apenas os generos presentes, em ordem alfabetica', () => {
    const genres = collectGenres([
      { genres: ['Terror', 'Drama'] },
      { genres: ['Aventura', 'Terror'] },
      { genres: [] },
    ])
    expect(genres).toEqual(['Aventura', 'Drama', 'Terror'])
  })

  it('devolve vazio quando nao ha filmes', () => {
    expect(collectGenres([])).toEqual([])
  })
})
