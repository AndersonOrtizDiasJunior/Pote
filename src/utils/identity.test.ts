import { describe, expect, it } from 'vitest'
import { makeMovie } from '../test/factories'
import { buildMovieId, findExistingMovie, isSameMovie, normalizeTitle } from './identity'

describe('normalizeTitle', () => {
  it('ignora acentos, caixa e pontuacao', () => {
    expect(normalizeTitle('Ficção Científica!')).toBe('ficcao cientifica')
    expect(normalizeTitle('  O   Poderoso  Chefão ')).toBe('o poderoso chefao')
  })

  it('trata variacoes de pontuacao como o mesmo titulo', () => {
    expect(normalizeTitle('Spider-Man: No Way Home')).toBe(
      normalizeTitle('Spider Man - No Way Home'),
    )
  })
})

describe('buildMovieId', () => {
  it('prioriza o IMDb ID', () => {
    expect(buildMovieId({ imdbId: 'tt0816692', providerId: '157336', title: 'X' })).toBe(
      'imdb:tt0816692',
    )
  })

  it('usa o id do provider quando nao ha IMDb ID', () => {
    expect(buildMovieId({ providerId: '157336', title: 'X' })).toBe('provider:157336')
  })

  it('cai para titulo + ano quando nao ha nenhum id', () => {
    expect(buildMovieId({ title: 'Interestelar', year: 2014 })).toBe(
      'title:interestelar:2014',
    )
  })
})

describe('isSameMovie', () => {
  it('reconhece pelo IMDb ID mesmo com titulos diferentes', () => {
    const a = makeMovie({ title: 'Interestelar', imdbId: 'tt0816692' })
    const b = makeMovie({ title: 'Interstellar', imdbId: 'tt0816692' })
    expect(isSameMovie(a, b)).toBe(true)
  })

  it('reconhece pelo id do provider', () => {
    const a = makeMovie({ title: 'Duna', providerId: '438631' })
    const b = makeMovie({ title: 'Dune', providerId: '438631' })
    expect(isSameMovie(a, b)).toBe(true)
  })

  it('reconhece por titulo + ano quando nao ha ids em comum', () => {
    const a = makeMovie({ title: 'O Poderoso Chefão', year: 1972, providerId: '238' })
    const b = makeMovie({ title: 'o poderoso chefao', year: 1972, providerId: '999' })
    expect(isSameMovie(a, b)).toBe(true)
  })

  it('nao confunde filmes homonimos de anos diferentes', () => {
    const a = makeMovie({ title: 'Duna', year: 1984 })
    const b = makeMovie({ title: 'Duna', year: 2021 })
    expect(isSameMovie(a, b)).toBe(false)
  })

  it('nao confunde filmes diferentes', () => {
    const a = makeMovie({ title: 'Matrix', year: 1999, providerId: '603' })
    const b = makeMovie({ title: 'Duna', year: 2021, providerId: '438631' })
    expect(isSameMovie(a, b)).toBe(false)
  })
})

describe('findExistingMovie', () => {
  it('localiza o filme correspondente no pote', () => {
    const jar = [
      makeMovie({ title: 'Matrix', year: 1999, providerId: '603' }),
      makeMovie({ title: 'Interestelar', year: 2014, imdbId: 'tt0816692' }),
    ]

    const found = findExistingMovie(jar, { title: 'Interstellar', imdbId: 'tt0816692' })
    expect(found?.title).toBe('Interestelar')
  })

  it('devolve undefined quando o filme nao esta no pote', () => {
    const jar = [makeMovie({ title: 'Matrix', year: 1999, providerId: '603' })]
    expect(findExistingMovie(jar, { title: 'Shrek', year: 2001 })).toBeUndefined()
  })
})
