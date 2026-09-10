/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Caminho base do site.
 *
 * No GitHub Pages de um repositorio de projeto a aplicacao nao fica na raiz do
 * dominio, e sim em `https://<usuario>.github.io/<repo>/`. Sem isso o HTML
 * pediria `/assets/index.js` em vez de `/Pote/assets/index.js` e a pagina
 * abriria em branco.
 *
 * O workflow de deploy define `BASE_PATH`; localmente fica na raiz, entao
 * `npm run dev` e `npm run build` continuam funcionando sem configuracao.
 */
const base = process.env.BASE_PATH ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./src/test/setup.ts'],
  },
})
