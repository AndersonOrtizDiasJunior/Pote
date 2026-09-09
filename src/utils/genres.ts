/**
 * Generos.
 *
 * O modelo interno guarda sempre NOMES de genero em portugues, nunca ids.
 * Isso mantem a UI simples (filtros, badges e sorteio por categoria comparam
 * strings) e evita que a aplicacao inteira dependa da tabela de ids do TMDB.
 *
 * Existem dois caminhos de traducao:
 *
 *   1. O TMDB, quando consultado com `language=pt-BR`, ja devolve os nomes
 *      traduzidos. Nesse caso usamos o que o provider mandou.
 *   2. Como rede de seguranca (chamada de generos falhou, ou o provider
 *      devolveu ids / nomes em ingles), usamos os mapas abaixo.
 */

/** TMDB genre id -> nome em portugues. */
export const TMDB_GENRE_NAMES_PT: Readonly<Record<number, string>> = {
  28: 'Ação',
  12: 'Aventura',
  16: 'Animação',
  35: 'Comédia',
  80: 'Crime',
  99: 'Documentário',
  18: 'Drama',
  10751: 'Família',
  14: 'Fantasia',
  36: 'História',
  27: 'Terror',
  10402: 'Música',
  9648: 'Mistério',
  10749: 'Romance',
  878: 'Ficção científica',
  10770: 'Filme para TV',
  53: 'Thriller',
  10752: 'Guerra',
  37: 'Faroeste',
}

/** Nome em ingles -> nome em portugues. */
export const GENRE_NAMES_EN_TO_PT: Readonly<Record<string, string>> = {
  action: 'Ação',
  adventure: 'Aventura',
  animation: 'Animação',
  comedy: 'Comédia',
  crime: 'Crime',
  documentary: 'Documentário',
  drama: 'Drama',
  family: 'Família',
  fantasy: 'Fantasia',
  history: 'História',
  horror: 'Terror',
  music: 'Música',
  mystery: 'Mistério',
  romance: 'Romance',
  'science fiction': 'Ficção científica',
  'sci-fi': 'Ficção científica',
  'tv movie': 'Filme para TV',
  thriller: 'Thriller',
  war: 'Guerra',
  western: 'Faroeste',
}

/**
 * Normaliza um genero para o nome em portugues usado pela aplicacao.
 *
 * Aceita id do TMDB (numero ou string numerica), nome em ingles ou nome que ja
 * esteja em portugues. Devolve `null` quando nao for possivel aproveitar nada.
 */
export function toGenreName(input: number | string | null | undefined): string | null {
  if (input === null || input === undefined) return null

  if (typeof input === 'number') {
    return TMDB_GENRE_NAMES_PT[input] ?? null
  }

  const trimmed = input.trim()
  if (trimmed === '') return null

  // String puramente numerica: trata como id do TMDB.
  if (/^\d+$/.test(trimmed)) {
    return TMDB_GENRE_NAMES_PT[Number(trimmed)] ?? null
  }

  const translated = GENRE_NAMES_EN_TO_PT[trimmed.toLowerCase()]
  if (translated !== undefined) return translated

  // Provider ja devolveu em portugues (ou em um idioma que nao mapeamos):
  // aproveita o nome como veio, apenas sem duplicar.
  return trimmed
}

/** Converte uma lista heterogenea de generos em nomes unicos e ordenados. */
export function toGenreNames(inputs: readonly (number | string | null | undefined)[]): string[] {
  const names = new Set<string>()
  for (const input of inputs) {
    const name = toGenreName(input)
    if (name !== null) names.add(name)
  }
  return [...names]
}

/**
 * Generos efetivamente presentes numa colecao de filmes, em ordem alfabetica.
 *
 * Usado pelo filtro de categoria: nunca oferecemos uma categoria vazia.
 */
export function collectGenres(movies: readonly { genres: string[] }[]): string[] {
  const names = new Set<string>()
  for (const movie of movies) {
    for (const genre of movie.genres) names.add(genre)
  }
  return [...names].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}
