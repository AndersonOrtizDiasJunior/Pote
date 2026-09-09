import { describe, expect, it } from 'vitest'
import { makeMovie } from '../test/factories'
import { drawMovie, getDrawableMovies } from './draw'

const jar = [
  makeMovie({ title: 'Duna', providerId: '1', genres: ['Ficção científica', 'Aventura'] }),
  makeMovie({ title: 'O Iluminado', providerId: '2', genres: ['Terror', 'Thriller'] }),
  makeMovie({ title: 'Hereditário', providerId: '3', genres: ['Terror', 'Drama'] }),
  makeMovie({ title: 'Shrek', providerId: '4', genres: ['Comédia'], watched: true }),
  makeMovie({ title: 'Corra!', providerId: '5', genres: ['Terror'], watched: true }),
]

describe('getDrawableMovies', () => {
  it('exclui os filmes ja assistidos', () => {
    const drawable = getDrawableMovies(jar)
    expect(drawable.map((movie) => movie.title)).toEqual([
      'Duna',
      'O Iluminado',
      'Hereditário',
    ])
  })

  it('filtra pela categoria e ainda exclui os assistidos', () => {
    const drawable = getDrawableMovies(jar, 'Terror')
    expect(drawable.map((movie) => movie.title)).toEqual(['O Iluminado', 'Hereditário'])
  })

  it('devolve vazio para categoria sem filmes disponiveis', () => {
    expect(getDrawableMovies(jar, 'Comédia')).toEqual([])
    expect(getDrawableMovies(jar, 'Faroeste')).toEqual([])
  })
})

describe('drawMovie', () => {
  it('nunca sorteia um filme assistido', () => {
    for (let i = 0; i < 300; i += 1) {
      expect(drawMovie(jar)?.watched).toBe(false)
    }
  })

  it('sorteia sempre dentro da categoria escolhida', () => {
    for (let i = 0; i < 300; i += 1) {
      const drawn = drawMovie(jar, 'Terror')
      expect(drawn).not.toBeNull()
      expect(drawn?.genres).toContain('Terror')
      expect(drawn?.watched).toBe(false)
    }
  })

  it('devolve null quando a categoria nao tem filmes disponiveis', () => {
    expect(drawMovie(jar, 'Comédia')).toBeNull()
  })

  it('devolve null quando todos os filmes ja foram assistidos', () => {
    const allWatched = jar.map((movie) => ({ ...movie, watched: true }))
    expect(drawMovie(allWatched)).toBeNull()
  })

  it('devolve null quando o pote esta vazio', () => {
    expect(drawMovie([])).toBeNull()
  })

  it('alcanca todos os candidatos ao longo de muitos sorteios', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 1000; i += 1) {
      const drawn = drawMovie(jar)
      if (drawn) seen.add(drawn.title)
    }
    expect(seen).toEqual(new Set(['Duna', 'O Iluminado', 'Hereditário']))
  })
})
