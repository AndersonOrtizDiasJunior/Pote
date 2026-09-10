# 🫙 O Pote

Aplicação web pessoal para guardar os filmes que você quer assistir e, quando bater a
indecisão, deixar o sorteio escolher por você.

> Você coloca filmes dentro do pote. Quando não souber o que assistir, aperta **Sortear**.

Interface em português do Brasil, tema escuro, funciona no celular e no desktop.
Sem login, sem banco de dados, sem backend — tudo fica no seu navegador.

---

## Funcionalidades

- 🔎 **Buscar filmes** por nome e adicioná-los ao pote
- 🚫 **Bloqueio de duplicidade** (IMDb ID → ID do provider → título + ano)
- 🎬 **Meu Pote** com estatísticas e grade responsiva
- ✅ **Marcar / desmarcar** como assistido
- 🗑️ **Remover** filmes, com diálogo de confirmação
- 🔀 **Filtros**: todos, não assistidos, assistidos
- 🎲 **Sorteio aleatório e imparcial**, sempre entre os filmes **não assistidos**
- 🔁 **"Sortear novamente" nunca repete** o filme que está na tela
- 🏷️ **Sorteio por categoria**, com as categorias tiradas dos filmes que estão no pote
- 💾 **Persistência** em `localStorage` — os filmes sobrevivem ao refresh
- ♿ **Acessibilidade**: navegação por teclado, foco visível, `aria-label`, modais com
  foco preso, status anunciados por `aria-live`
- 🛡️ **Estados tratados**: vazio, carregando, erro, sem resultados, sem filmes na
  categoria, todos assistidos e `localStorage` corrompido

---

## Tecnologias

| Camada       | Escolha                                    |
| ------------ | ------------------------------------------ |
| UI           | React 19 + TypeScript (modo `strict`)      |
| Build        | Vite 8                                     |
| Estilo       | Tailwind CSS v4 (plugin oficial do Vite)   |
| Ícones       | lucide-react                                |
| Estado       | Hooks do React + Context (sem Redux)       |
| Persistência | `localStorage`                              |
| Testes       | Vitest                                      |
| Lint         | oxlint                                      |

---

## API utilizada

### Provider escolhido: **TMDB — The Movie Database**

O TMDB foi escolhido por três motivos:

1. **É gratuito.** A chave de desenvolvedor não custa nada e é aprovada na hora.
2. **Entrega tudo em uma única busca**: título, título original, ano, pôster, backdrop,
   sinopse, nota e gêneros. A OMDb, por comparação, precisaria de uma chamada extra por
   filme para montar a mesma tela, e o plano gratuito dela é limitado a 1.000
   requisições por dia.
3. **Fala português.** Consultado com `language=pt-BR`, o TMDB devolve títulos, sinopses
   e **nomes de gênero já traduzidos** — não é preciso manter uma tabela de tradução
   como fonte principal (mantemos uma apenas como rede de segurança).

O IMDb ID é aproveitado **quando o TMDB o fornece** (no endpoint de detalhes), para
reforçar a checagem de duplicidade e habilitar o botão “Ver no IMDb”. Ele é uma
referência opcional, nunca uma dependência: se não vier, o botão simplesmente não
aparece — nenhum ID é inventado.

### Precisa de API key?

**Sim, para a busca real** — e ela é gratuita. Como obter:

1. Crie uma conta em <https://www.themoviedb.org/signup>
2. Acesse <https://www.themoviedb.org/settings/api>
3. Peça uma chave do tipo **Developer** (aceite os termos de uso; a aprovação é imediata)
4. Copie o campo **API Key (v3 auth)**

> A chave v4 (*Read Access Token*, um JWT) também funciona — a aplicação detecta o
> formato e envia no header `Authorization: Bearer` em vez da query string.

### Limites do plano gratuito

O TMDB removeu o limite fixo de 40 requisições/10 s em dezembro de 2019. Hoje existe
apenas um teto elástico, documentado como “algo na faixa de 40 requisições por segundo”,
para desencorajar coleta em massa. A aplicação fica muito abaixo disso: a busca só
dispara quando você clica em **Buscar** (sem debounce por tecla), resultados repetidos
saem de um cache em memória de 5 minutos, e a tabela de gêneros é carregada uma vez por
sessão. Um `429` é tratado e vira a mensagem “Muitas buscas em pouco tempo”.

Documentação consultada:
[Getting started](https://developer.themoviedb.org/docs/getting-started) ·
[Rate limiting](https://developer.themoviedb.org/docs/rate-limiting)

### A chave fica exposta no frontend. Tudo bem?

Sim, **neste caso específico**. A chave v3 do TMDB é um identificador de aplicação
cliente, feito para uso direto no navegador — não dá acesso à sua conta nem permite
escrita. Por isso **não existe backend nem proxy aqui**: seria complexidade sem
benefício. Se um dia o provider for trocado por um que trate a chave como segredo,
a troca deve vir acompanhada de uma camada servidor.

### E sem chave nenhuma?

A aplicação **continua funcionando**. Sem `VITE_TMDB_API_KEY`, ela entra em **modo
demonstração** e a busca passa a rodar sobre um catálogo local embutido
(`src/services/movie/demoCatalog.ts`) com ~37 filmes conhecidos. Todo o resto —
adicionar, bloquear duplicados, filtrar, marcar, remover, sortear, sortear por
categoria, persistir — funciona igual.

O catálogo local traz apenas dados verificáveis: **título, título original, ano,
gêneros e sinopse**. Ele **não tem pôsteres, notas nem IMDb IDs**, porque esses valores
viriam do provider real e inventá-los seria mostrar informação falsa (e um IMDb ID
inventado geraria um link quebrado). Os cards caem no pôster-placeholder e a nota
simplesmente não aparece. Um aviso na tela de busca deixa o modo explícito.

Trocar de provider é uma troca de classe: veja [Arquitetura](#arquitetura).

---

## Instalação

Requisitos: **Node.js 20+** e npm.

```bash
cd C:\Pote
npm install
```

## Configuração

Opcional para rodar, necessário para a busca real.

```bash
cp .env.example .env
```

Abra o `.env` e preencha:

```env
VITE_TMDB_API_KEY=sua_chave_aqui

# Opcional. Padrão: pt-BR
VITE_TMDB_LANGUAGE=pt-BR
```

Reinicie o `npm run dev` depois de editar o `.env` — o Vite só lê variáveis de
ambiente na inicialização.

> O `.env` está no `.gitignore` e **nunca** deve ser versionado. Não há nenhuma chave
> escrita no código-fonte.

## Execução

```bash
npm run dev
```

Abra <http://localhost:5173>.

## Build

```bash
npm run build     # typecheck (tsc -b) + build de produção em dist/
npm run preview   # serve o build gerado
```

## Deploy (GitHub Pages)

O site é estático — não há servidor, então **não é preciso Render, Vercel nem um
segundo repositório**. O workflow `.github/workflows/deploy.yml` roda lint, testes e
build a cada push em `master` e publica a pasta `dist/`.

Duas configurações no repositório:

1. **Settings → Secrets and variables → Actions → New repository secret**
   Nome `VITE_TMDB_API_KEY`, valor = sua chave. Sem o secret o build passa mesmo assim,
   e o site publicado entra em modo demonstração.
2. **Settings → Pages → Source: GitHub Actions.**
   O workflow tenta ajustar isso sozinho (`enablement: true`), mas confira.

> ⚠️ Se o Pages ficar em *Deploy from a branch*, o GitHub serve o `index.html` do
> código-fonte, que aponta para `/src/main.tsx` — um arquivo TypeScript que o navegador
> não executa. O resultado é uma **tela branca**. A origem precisa ser *GitHub Actions*.

### Caminho base

Num repositório de projeto o site fica em `https://<usuário>.github.io/<repo>/`, e não
na raiz do domínio. Por isso o `vite.config.ts` lê `BASE_PATH`, que o workflow preenche
a partir do `configure-pages`. Localmente a variável não existe e o base continua `/`,
então `npm run dev` e `npm run build` funcionam sem configuração nenhuma.

> No Git Bash do Windows, `BASE_PATH=/Pote/ npm run build` é reescrito pelo MSYS para um
> caminho do Windows. Use `MSYS_NO_PATHCONV=1` na frente se precisar reproduzir o build
> do Pages localmente.

### A chave fica visível no site publicado

O Vite embute `VITE_TMDB_API_KEY` no JavaScript do build. Guardar a chave como secret
mantém ela fora do repositório, **mas ela é legível no bundle servido** — isso é
inerente a qualquer site estático. Para a chave v3 do TMDB isso é o uso previsto (é um
identificador de cliente, não dá acesso à conta e não permite escrita), mas a cota é
sua: se quiser escondê-la de verdade, seria necessário um proxy com a chave no
servidor, e aí o site deixa de ser puramente estático.

## Testes e lint

```bash
npm test          # Vitest, sem watch
npm run test:watch
npm run lint      # oxlint
```

Os testes cobrem as regras de negócio, não a aparência:

- **Sorteio** — nunca sorteia assistidos; respeita a categoria; devolve vazio quando não
  há candidatos; alcança todos os candidatos ao longo de muitos sorteios
- **Duplicidade** — IMDb ID, ID do provider e título+ano; filmes homônimos de anos
  diferentes continuam sendo filmes diferentes
- **Persistência** — salvar, carregar, atualizar, remover
- **Robustez** — JSON inválido, formato inesperado e campos com tipo errado no
  `localStorage` não derrubam a aplicação
- **Gêneros** — tradução a partir de id do TMDB e de nome em inglês

---

## Persistência

Tudo é gravado em `localStorage`, sob a chave:

```text
o-pote.movies
```

Não há servidor: os filmes ficam **naquele navegador, naquele computador**. Limpar os
dados do site apaga o pote.

Todo o acesso ao `localStorage` passa por `src/storage/movieStorage.ts`
(`getMovies`, `saveMovies`, `addMovie`, `updateMovie`, `removeMovie`). Nenhum
componente chama `localStorage` diretamente.

**Dados corrompidos** nunca quebram a aplicação: JSON inválido ou formato inesperado
são registrados no console e o pote volta como lista vazia; registros individuais
inválidos são descartados e os válidos são preservados.

---

## Arquitetura

```text
Componentes React
       ↓
Hooks  (useMovies / useMovieJar)  ──→  Storage (localStorage)
       ↓
MovieService          fachada: busca, detalhes, cache, montagem do modelo
       ↓
MovieProvider         interface
       ↓
TmdbMovieProvider  |  DemoMovieProvider
       ↓
TMDB API           |  catálogo local
```

Nenhum componente faz `fetch`. Nada acima de `MovieProvider` sabe que o TMDB existe:
os componentes só conhecem os tipos `Movie` e `MovieSearchResult`, montados por mappers
a partir da resposta crua da API. Para trocar de provider, basta escrever uma classe que
implemente `MovieProvider` e devolvê-la em `createMovieService()`.

```text
C:\Pote
├── public/pote.svg
├── src
│   ├── components
│   │   ├── layout   AppShell, Sidebar, Navbar, BottomNav, PageHeader, Logo
│   │   ├── movie    MovieCard, MovieGrid, MoviePoster, MovieBadge,
│   │   │            WatchedButton, MovieDetailsDialog
│   │   ├── search   MovieSearch, MovieSearchResultCard
│   │   ├── draw     DrawButton, DrawRolling, DrawResult, GenreFilter
│   │   └── ui       Button, Modal, ConfirmDialog, EmptyState,
│   │                LoadingState, ErrorState, StatsCard, Toast
│   ├── context      movieJar (contexto + hook), MoviesProvider
│   ├── hooks        useMovies, useToast
│   ├── pages        HomePage, MoviesPage, DrawPage, SearchPage
│   ├── services
│   │   └── movie    MovieProvider, TmdbMovieProvider, DemoMovieProvider,
│   │                MovieService, demoCatalog, errors
│   ├── storage      movieStorage
│   ├── test         setup, factories
│   ├── types        movie
│   ├── utils        draw, random, genres, identity
│   ├── App.tsx  main.tsx  index.css  navigation.ts
├── .env.example
├── vite.config.ts  tsconfig*.json  package.json
└── README.md
```

### Decisões que valem uma linha

- **Sem biblioteca de rotas.** São quatro telas sem URL própria nem parâmetros; o
  roteamento é um `useState<Route>` no `App`.
- **Sem Redux, sem Zustand.** Um `useMovies` compartilhado por Context resolve.
- **Botão de busca em vez de debounce.** Uma requisição por intenção do usuário.
- **Sorteio antes da animação.** O vencedor é escolhido por
  `Math.floor(Math.random() * candidatos.length)`; a animação de ~1,5 s é enfeite. Não há
  peso por nota, por data de lançamento nem por ordem de entrada no pote.
- **"Sortear novamente" exclui o filme exibido.** Um sorteio puramente uniforme repete o
  resultado anterior com frequência `1/n` — num pote de 3 filmes, uma vez a cada três
  cliques, e o botão parece quebrado. Por isso o filme que está na tela sai da disputa.
  Isso **não** torna o sorteio tendencioso: entre os candidatos restantes a chance
  continua igual para todos; a única regra adicional é que dois sorteios seguidos não
  caem no mesmo filme. Quando o filme exibido é o **único** candidato, o botão dá lugar a
  uma explicação em vez de repetir. E se ele foi marcado como assistido, sai da disputa
  sozinho — aí um único candidato restante ainda rende um sorteio útil.
- **A regra do sorteio mora em `utils/draw.ts`**, fora do React, para poder ser testada
  diretamente.
- **`prefers-reduced-motion`** desliga as animações.

---

## Limitações conhecidas

- **Um navegador, um pote.** Sem conta e sem sincronização entre dispositivos.
- **Modo demonstração é limitado**: ~37 filmes, sem pôster, sem nota e sem IMDb ID.
  Configure a chave do TMDB para a experiência completa.
- **O IMDb ID depende do TMDB.** A busca do TMDB não o devolve; a aplicação o obtém na
  chamada de detalhes ao adicionar o filme. Se essa chamada falhar, o filme entra no
  pote mesmo assim, só que sem o botão “Ver no IMDb”.
- **O cache de busca é em memória**, com TTL de 5 minutos — some ao recarregar a página.
- **Sem paginação**: a busca mostra a primeira página de resultados do TMDB (até 20).

---

Os dados de filmes são fornecidos pelo [TMDB](https://www.themoviedb.org/).
Este projeto não é endossado nem certificado pelo TMDB.
