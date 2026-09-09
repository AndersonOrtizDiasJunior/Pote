/**
 * `localStorage` minimo para os testes de persistencia.
 *
 * Os testes cobrem regras de negocio puras, entao um stub em memoria basta e
 * evita trazer jsdom so para isso.
 */
class MemoryStorage implements Storage {
  private data = new Map<string, string>()

  get length(): number {
    return this.data.size
  }

  clear(): void {
    this.data.clear()
  }

  getItem(key: string): string | null {
    return this.data.get(key) ?? null
  }

  key(index: number): string | null {
    return [...this.data.keys()][index] ?? null
  }

  removeItem(key: string): void {
    this.data.delete(key)
  }

  setItem(key: string, value: string): void {
    this.data.set(key, String(value))
  }
}

globalThis.localStorage = new MemoryStorage()
