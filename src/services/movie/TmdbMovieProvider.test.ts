import { describe, expect, it, vi } from 'vitest'
import { MovieProviderError } from './errors'
import { TmdbMovieProvider } from './TmdbMovieProvider'

/**
 * Testes do mapper e do tratamento de erros do TMDB.
 *
 * O `fetch` e injetado, entao nada aqui depende de rede ou de uma chave real.
 * As respostas imitam o formato documentado do TMDB v3.
 */

const GENRE_LIST = {
  genres: [
    { id: 12, name: 'Aventura' },
    { id: 18, name: 'Drama' },
    { id: 878, name: 'Ficção científica' },
    { id: 27, name: 'Terror' },
  ],
}

const SEARCH_RESPONSE = {
  page: 1,
  results: [
    {
      id: 157336,
      title: 'Interestelar',
      original_title: 'Interstellar',
      release_date: '2014-11-05',
      poster_path: '/abc123.jpg',
      backdrop_path: '/def456.jpg',
      vote_average: 8.442,
      genre_ids: [12, 18, 878],
      overview: 'Uma equipe atravessa um buraco de minhoca.',
    },
    {
      // Sem nota (filme ainda sem votos) e sem poster.
      id: 999,
      title: 'Sem Nota',
      original_title: 'No Rating',
      release_date: '',
      poster_path: null,
      vote_average: 0,
      genre_ids: [],
      overview: '',
    },
    // Registro quebrado: deve ser descartado sem derrubar a busca.
    { id: null, title: null },
  ],
}

const DETAIL_RESPONSE = {
  id: 157336,
  imdb_id: 'tt0816692',
  title: 'Interestelar',
  original_title: 'Interstellar',
  release_date: '2014-11-05',
  poster_path: '/abc123.jpg',
  vote_average: 8.442,
  genres: [
    { id: 12, name: 'Aventura' },
    { id: 18, name: 'Drama' },
  ],
  overview: 'Uma equipe atravessa um buraco de minhoca.',
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

/** `fetch` falso que responde por rota. */
function fakeFetch(routes: { genres?: unknown; search?: unknown; detail?: unknown }) {
  const calls: string[] = []
  const impl = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input)
    calls.push(url)
    if (url.includes('/genre/movie/list')) return jsonResponse(routes.genres ?? GENRE_LIST)
    if (url.includes('/search/movie')) return jsonResponse(routes.search ?? SEARCH_RESPONSE)
    return jsonResponse(routes.detail ?? DETAIL_RESPONSE)
  })
  return { impl: impl as unknown as typeof fetch, calls }
}

function makeProvider(fetchImpl: typeof fetch, apiKey = 'chave-de-teste') {
  return new TmdbMovieProvider({ apiKey, fetchImpl })
}

describe('searchMovies', () => {
  it('mapeia a resposta do TMDB para MovieSearchResult', async () => {
    const { impl } = fakeFetch({})
    const results = await makeProvider(impl).searchMovies('Interstellar')

    expect(results).toHaveLength(2) // o registro quebrado foi descartado

    expect(results[0]).toEqual({
      id: '157336',
      title: 'Interestelar',
      originalTitle: 'Interstellar',
      year: 2014,
      posterUrl: 'https://image.tmdb.org/t/p/w500/abc123.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/w1280/def456.jpg',
      rating: 8.4,
      genres: ['Aventura', 'Drama', 'Ficção científica'],
      overview: 'Uma equipe atravessa um buraco de minhoca.',
    })
  })

  it('nao inventa campos ausentes', async () => {
    const { impl } = fakeFetch({})
    const results = await makeProvider(impl).searchMovies('qualquer')
    const semNota = results[1]

    expect(semNota?.rating).toBeUndefined()
    expect(semNota?.posterUrl).toBeUndefined()
    expect(semNota?.year).toBeUndefined()
    expect(semNota?.overview).toBeUndefined()
    // A busca do TMDB nao devolve IMDb ID: ele so vem em getMovie.
    expect(semNota?.imdbId).toBeUndefined()
    expect(results[0]?.imdbId).toBeUndefined()
  })

  it('envia a chave v3 na query e pede pt-BR', async () => {
    const { impl, calls } = fakeFetch({})
    await makeProvider(impl).searchMovies('duna')

    const searchCall = calls.find((url) => url.includes('/search/movie')) ?? ''
    expect(searchCall).toContain('api_key=chave-de-teste')
    expect(searchCall).toContain('language=pt-BR')
    expect(searchCall).toContain('query=duna')
    expect(searchCall).toContain('include_adult=false')
  })

  it('usa Authorization Bearer quando a chave e um token v4 (JWT)', async () => {
    const { impl } = fakeFetch({})
    const provider = makeProvider(impl, 'eyJhbGciOiJIUzI1NiJ9.fake.token')
    await provider.searchMovies('duna')

    const init = (impl as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[1] as
      | RequestInit
      | undefined
    const headers = init?.headers as Record<string, string>
    expect(headers.authorization).toBe('Bearer eyJhbGciOiJIUzI1NiJ9.fake.token')
  })

  it('busca a tabela de generos uma vez so e reaproveita', async () => {
    const { impl, calls } = fakeFetch({})
    const provider = makeProvider(impl)

    await provider.searchMovies('a')
    await provider.searchMovies('b')

    expect(calls.filter((url) => url.includes('/genre/movie/list'))).toHaveLength(1)
  })

  it('cai no mapa estatico de generos quando a tabela do TMDB falha', async () => {
    const impl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/genre/movie/list')) return jsonResponse({}, 500)
      return jsonResponse(SEARCH_RESPONSE)
    }) as unknown as typeof fetch

    vi.spyOn(console, 'error').mockImplementation(() => {})
    const results = await makeProvider(impl).searchMovies('Interstellar')

    expect(results[0]?.genres).toEqual(['Aventura', 'Drama', 'Ficção científica'])
  })

  it('nao chama a API para uma busca vazia', async () => {
    const { impl, calls } = fakeFetch({})
    expect(await makeProvider(impl).searchMovies('   ')).toEqual([])
    expect(calls).toHaveLength(0)
  })

  it('devolve lista vazia quando o TMDB nao acha nada', async () => {
    const { impl } = fakeFetch({ search: { page: 1, results: [] } })
    expect(await makeProvider(impl).searchMovies('zzzzz')).toEqual([])
  })
})

describe('getMovie', () => {
  it('traz o IMDb ID do endpoint de detalhes', async () => {
    const { impl } = fakeFetch({})
    const movie = await makeProvider(impl).getMovie('157336')

    expect(movie?.imdbId).toBe('tt0816692')
    expect(movie?.title).toBe('Interestelar')
    expect(movie?.genres).toEqual(['Aventura', 'Drama'])
  })

  it('aceita o IMDb ID vindo de external_ids', async () => {
    const { impl } = fakeFetch({
      detail: { ...DETAIL_RESPONSE, imdb_id: null, external_ids: { imdb_id: 'tt0816692' } },
    })
    expect((await makeProvider(impl).getMovie('157336'))?.imdbId).toBe('tt0816692')
  })

  it('devolve null quando o filme nao existe (404)', async () => {
    const impl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/genre/movie/list')) return jsonResponse(GENRE_LIST)
      return jsonResponse({}, 404)
    }) as unknown as typeof fetch

    expect(await makeProvider(impl).getMovie('000')).toBeNull()
  })
})

describe('tratamento de erros', () => {
  async function expectCode(status: number, code: string) {
    const impl = vi.fn(async () => jsonResponse({}, status)) as unknown as typeof fetch
    vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(makeProvider(impl).searchMovies('duna')).rejects.toMatchObject({ code })
  }

  it('401 vira invalid-api-key', () => expectCode(401, 'invalid-api-key'))
  it('403 vira invalid-api-key', () => expectCode(403, 'invalid-api-key'))
  it('429 vira rate-limited', () => expectCode(429, 'rate-limited'))
  it('500 vira unknown', () => expectCode(500, 'unknown'))

  it('chave ausente vira missing-api-key, sem tocar na rede', async () => {
    const impl = vi.fn() as unknown as typeof fetch
    await expect(makeProvider(impl, '').searchMovies('duna')).rejects.toBeInstanceOf(
      MovieProviderError,
    )
    expect(impl).not.toHaveBeenCalled()
  })

  it('falha de rede vira network', async () => {
    const impl = vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    }) as unknown as typeof fetch

    await expect(makeProvider(impl).searchMovies('duna')).rejects.toMatchObject({
      code: 'network',
    })
  })

  it('AbortError sobe intacto, sem virar erro de provider', async () => {
    const impl = vi.fn(async () => {
      throw new DOMException('aborted', 'AbortError')
    }) as unknown as typeof fetch

    await expect(makeProvider(impl).searchMovies('duna')).rejects.toMatchObject({
      name: 'AbortError',
    })
  })
})
