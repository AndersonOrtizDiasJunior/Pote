/**
 * Identidade de um filme, usada para bloquear duplicidade.
 *
 * A ordem de prioridade (mais forte para mais fraca) e:
 *
 *   1. IMDb ID, quando o provider fornecer
 *   2. ID do provider
 *   3. Titulo normalizado + ano
 */

/** Campos minimos necessarios para identificar um filme. */
export interface MovieIdentitySource {
  imdbId?: string
  /** Id no provider. `Movie` usa `providerId`; `MovieSearchResult` usa `id`. */
  providerId?: string
  id?: string
  title: string
  year?: number
}

/** Remove acentos, pontuacao e espacos duplicados. */
export function normalizeTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function providerIdOf(source: MovieIdentitySource): string | undefined {
  return source.providerId ?? source.id
}

/** Chave estavel usada como `Movie.id`. */
export function buildMovieId(source: MovieIdentitySource): string {
  if (source.imdbId) return `imdb:${source.imdbId}`

  const providerId = providerIdOf(source)
  if (providerId) return `provider:${providerId}`

  return `title:${normalizeTitle(source.title)}:${source.year ?? 'na'}`
}

/** Todas as chaves pelas quais um filme pode ser reconhecido. */
function identityKeys(source: MovieIdentitySource): string[] {
  const keys: string[] = []

  if (source.imdbId) keys.push(`imdb:${source.imdbId}`)

  const providerId = providerIdOf(source)
  if (providerId) keys.push(`provider:${providerId}`)

  keys.push(`title:${normalizeTitle(source.title)}:${source.year ?? 'na'}`)
  return keys
}

/**
 * Diz se dois filmes sao o mesmo.
 *
 * Basta uma chave em comum. Isso cobre o caso em que o mesmo filme entrou por
 * caminhos diferentes (ex.: uma vez com IMDb ID e outra sem).
 */
export function isSameMovie(a: MovieIdentitySource, b: MovieIdentitySource): boolean {
  const keysA = new Set(identityKeys(a))
  return identityKeys(b).some((key) => keysA.has(key))
}

/** Localiza no pote um filme que corresponda ao candidato. */
export function findExistingMovie<T extends MovieIdentitySource>(
  movies: readonly T[],
  candidate: MovieIdentitySource,
): T | undefined {
  return movies.find((movie) => isSameMovie(movie, candidate))
}
