/**
 * Erros de provider, com codigos estaveis.
 *
 * A UI nunca mostra a mensagem tecnica: ela traduz o `code` para um texto
 * amigavel. As mensagens abaixo existem para o console e para os testes.
 */

export type MovieErrorCode =
  | 'missing-api-key'
  | 'invalid-api-key'
  | 'rate-limited'
  | 'network'
  | 'invalid-response'
  | 'unknown'

export class MovieProviderError extends Error {
  readonly code: MovieErrorCode

  constructor(code: MovieErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'MovieProviderError'
    this.code = code
  }
}

/** Textos exibidos ao usuario, por codigo de erro. */
export const MOVIE_ERROR_MESSAGES: Readonly<
  Record<MovieErrorCode, { title: string; description: string }>
> = {
  'missing-api-key': {
    title: 'Chave de API não configurada.',
    description:
      'Defina VITE_TMDB_API_KEY no arquivo .env para buscar no catálogo completo do TMDB.',
  },
  'invalid-api-key': {
    title: 'Chave de API inválida.',
    description: 'Confira o valor de VITE_TMDB_API_KEY no arquivo .env e recarregue a página.',
  },
  'rate-limited': {
    title: 'Muitas buscas em pouco tempo.',
    description: 'Aguarde alguns segundos e tente novamente.',
  },
  network: {
    title: 'Não foi possível buscar os filmes.',
    description: 'Verifique sua conexão e tente novamente.',
  },
  'invalid-response': {
    title: 'Não foi possível buscar os filmes.',
    description: 'O serviço de filmes respondeu de forma inesperada. Tente novamente.',
  },
  unknown: {
    title: 'Não foi possível buscar os filmes.',
    description: 'Verifique sua conexão e tente novamente.',
  },
}

/** Traduz qualquer erro para a mensagem amigavel correspondente. */
export function describeMovieError(error: unknown): { title: string; description: string } {
  if (error instanceof MovieProviderError) return MOVIE_ERROR_MESSAGES[error.code]
  return MOVIE_ERROR_MESSAGES.unknown
}
