import { beforeEach, describe, expect, it, vi } from 'vitest'
import { makeMovie } from '../test/factories'
import {
  addMovie,
  clearMovies,
  getMovies,
  MOVIES_STORAGE_KEY,
  removeMovie,
  saveMovies,
  updateMovie,
} from './movieStorage'

beforeEach(() => {
  clearMovies()
  vi.restoreAllMocks()
})

describe('persistencia', () => {
  it('salva e carrega os filmes', () => {
    const movies = [
      makeMovie({ title: 'Duna', providerId: '438631', year: 2021 }),
      makeMovie({ title: 'Matrix', providerId: '603', year: 1999 }),
    ]

    expect(saveMovies(movies)).toBe(true)
    expect(getMovies().map((movie) => movie.title)).toEqual(['Duna', 'Matrix'])
  })

  it('devolve lista vazia quando nada foi salvo', () => {
    expect(getMovies()).toEqual([])
  })

  it('atualiza um filme', () => {
    saveMovies([makeMovie({ title: 'Duna', providerId: '438631' })])
    const id = getMovies()[0]?.id ?? ''

    updateMovie(id, { watched: true })
    expect(getMovies()[0]?.watched).toBe(true)

    updateMovie(id, { watched: false })
    expect(getMovies()[0]?.watched).toBe(false)
  })

  it('remove um filme e ele nao volta na proxima leitura', () => {
    saveMovies([
      makeMovie({ title: 'Duna', providerId: '438631' }),
      makeMovie({ title: 'Matrix', providerId: '603' }),
    ])
    const id = getMovies()[0]?.id ?? ''

    removeMovie(id)
    expect(getMovies().map((movie) => movie.title)).toEqual(['Matrix'])
    // Segunda leitura: confirma que a remocao foi realmente persistida.
    expect(getMovies().map((movie) => movie.title)).toEqual(['Matrix'])
  })
})

describe('duplicidade', () => {
  it('adiciona um filme novo', () => {
    const result = addMovie(makeMovie({ title: 'Duna', providerId: '438631', year: 2021 }))
    expect(result.status).toBe('added')
    expect(getMovies()).toHaveLength(1)
  })

  it('nao adiciona o mesmo filme duas vezes', () => {
    const movie = makeMovie({ title: 'Duna', providerId: '438631', year: 2021 })

    expect(addMovie(movie).status).toBe('added')
    expect(addMovie(movie).status).toBe('duplicate')
    expect(getMovies()).toHaveLength(1)
  })

  it('bloqueia o duplicado pelo IMDb ID, mesmo com titulo diferente', () => {
    addMovie(makeMovie({ title: 'Interestelar', imdbId: 'tt0816692', providerId: '157336' }))
    const again = addMovie(
      makeMovie({ title: 'Interstellar', imdbId: 'tt0816692', providerId: '999999' }),
    )

    expect(again.status).toBe('duplicate')
    expect(again.movie.title).toBe('Interestelar')
    expect(getMovies()).toHaveLength(1)
  })

  it('bloqueia o duplicado por titulo + ano quando os ids nao coincidem', () => {
    addMovie(makeMovie({ title: 'O Poderoso Chefão', year: 1972, providerId: '238' }))
    const again = addMovie(
      makeMovie({ title: 'o poderoso chefao', year: 1972, providerId: '777' }),
    )

    expect(again.status).toBe('duplicate')
    expect(getMovies()).toHaveLength(1)
  })

  it('permite filmes homonimos de anos diferentes', () => {
    addMovie(makeMovie({ title: 'Duna', year: 1984, providerId: '841' }))
    expect(addMovie(makeMovie({ title: 'Duna', year: 2021, providerId: '438631' })).status).toBe(
      'added',
    )
    expect(getMovies()).toHaveLength(2)
  })
})

describe('dados corrompidos', () => {
  it('recupera estado vazio quando o JSON e invalido', () => {
    localStorage.setItem(MOVIES_STORAGE_KEY, '{isso nao e json')
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(getMovies()).toEqual([])
    expect(spy).toHaveBeenCalled()
  })

  it('recupera estado vazio quando o conteudo nao e uma lista', () => {
    localStorage.setItem(MOVIES_STORAGE_KEY, '{"movies":[]}')
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(getMovies()).toEqual([])
  })

  it('descarta apenas os registros invalidos e mantem os validos', () => {
    localStorage.setItem(
      MOVIES_STORAGE_KEY,
      JSON.stringify([
        { title: 'sem id' },
        null,
        'texto solto',
        { id: 'provider:1', title: 'Duna', genres: ['Aventura'], watched: false, addedAt: 'x' },
      ]),
    )
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const movies = getMovies()
    expect(movies).toHaveLength(1)
    expect(movies[0]?.title).toBe('Duna')
  })

  it('normaliza campos com o tipo errado em vez de quebrar', () => {
    localStorage.setItem(
      MOVIES_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'provider:1',
          title: 'Duna',
          year: 'dois mil e vinte e um',
          rating: null,
          genres: ['Aventura', 42, ''],
          watched: 'sim',
        },
      ]),
    )
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const movie = getMovies()[0]
    expect(movie?.year).toBeUndefined()
    expect(movie?.rating).toBeUndefined()
    expect(movie?.genres).toEqual(['Aventura'])
    // Somente o booleano `true` marca como assistido.
    expect(movie?.watched).toBe(false)
    expect(typeof movie?.addedAt).toBe('string')
  })
})
