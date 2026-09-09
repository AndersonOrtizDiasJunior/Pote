import type { MovieDetails } from '../../types/movie'

/**
 * Catalogo local usado no "modo demonstracao", quando nenhuma chave de API
 * esta configurada.
 *
 * Contem apenas dados verificaveis e estaveis: titulo, titulo original, ano,
 * generos e uma sinopse curta. De proposito NAO traz `posterUrl`, `rating`
 * nem `imdbId` - esses valores viriam do provider real, e inventa-los daria
 * ao usuario informacao falsa (e IMDb IDs inventados quebrariam os links).
 *
 * A UI trata a ausencia desses campos normalmente: o poster cai no
 * placeholder e a nota simplesmente nao aparece.
 */

type DemoMovie = Omit<MovieDetails, 'posterUrl' | 'backdropUrl' | 'rating' | 'imdbId'>

export const DEMO_CATALOG: readonly DemoMovie[] = [
  {
    id: 'interstellar',
    title: 'Interestelar',
    originalTitle: 'Interstellar',
    year: 2014,
    genres: ['Aventura', 'Drama', 'Ficção científica'],
    overview:
      'Com a Terra se tornando inabitável, um piloto atravessa um buraco de minhoca em busca de um novo mundo para a humanidade.',
  },
  {
    id: 'inception',
    title: 'A Origem',
    originalTitle: 'Inception',
    year: 2010,
    genres: ['Ação', 'Aventura', 'Ficção científica'],
    overview:
      'Um ladrão especializado em invadir sonhos aceita a missão de plantar uma ideia na mente de um herdeiro.',
  },
  {
    id: 'the-matrix',
    title: 'Matrix',
    originalTitle: 'The Matrix',
    year: 1999,
    genres: ['Ação', 'Ficção científica'],
    overview:
      'Um programador descobre que a realidade que conhece é uma simulação e se junta à resistência humana.',
  },
  {
    id: 'dune',
    title: 'Duna',
    originalTitle: 'Dune',
    year: 2021,
    genres: ['Aventura', 'Ficção científica'],
    overview:
      'O herdeiro da Casa Atreides é lançado em uma disputa mortal pelo controle do planeta desértico Arrakis.',
  },
  {
    id: 'mad-max-fury-road',
    title: 'Mad Max: Estrada da Fúria',
    originalTitle: 'Mad Max: Fury Road',
    year: 2015,
    genres: ['Ação', 'Aventura', 'Ficção científica'],
    overview:
      'Em um deserto pós-apocalíptico, Max e Furiosa fogem de um tirano em uma perseguição sem tréguas.',
  },
  {
    id: 'the-godfather',
    title: 'O Poderoso Chefão',
    originalTitle: 'The Godfather',
    year: 1972,
    genres: ['Crime', 'Drama'],
    overview:
      'O patriarca de uma família mafiosa de Nova York transfere aos poucos o comando dos negócios ao filho mais novo.',
  },
  {
    id: 'pulp-fiction',
    title: 'Pulp Fiction: Tempo de Violência',
    originalTitle: 'Pulp Fiction',
    year: 1994,
    genres: ['Crime', 'Thriller'],
    overview:
      'Histórias de gângsteres, um boxeador e um casal de assaltantes se cruzam em Los Angeles, fora de ordem cronológica.',
  },
  {
    id: 'fight-club',
    title: 'Clube da Luta',
    originalTitle: 'Fight Club',
    year: 1999,
    genres: ['Drama', 'Thriller'],
    overview:
      'Um funcionário insatisfeito e um vendedor de sabonetes criam um clube de luta clandestino.',
  },
  {
    id: 'se7en',
    title: 'Seven: Os Sete Crimes Capitais',
    originalTitle: 'Se7en',
    year: 1995,
    genres: ['Crime', 'Mistério', 'Thriller'],
    overview:
      'Dois detetives caçam um assassino em série que escolhe suas vítimas segundo os sete pecados capitais.',
  },
  {
    id: 'parasite',
    title: 'Parasita',
    originalTitle: 'Gisaengchung',
    year: 2019,
    genres: ['Comédia', 'Drama', 'Thriller'],
    overview:
      'Uma família pobre se infiltra, um a um, na casa de uma família muito rica em Seul.',
  },
  {
    id: 'cidade-de-deus',
    title: 'Cidade de Deus',
    originalTitle: 'Cidade de Deus',
    year: 2002,
    genres: ['Crime', 'Drama'],
    overview:
      'Duas trajetórias opostas no Rio de Janeiro: um jovem que sonha ser fotógrafo e outro que se torna chefe do tráfico.',
  },
  {
    id: 'joker',
    title: 'Coringa',
    originalTitle: 'Joker',
    year: 2019,
    genres: ['Crime', 'Drama', 'Thriller'],
    overview:
      'Um comediante fracassado em uma Gotham em colapso desce lentamente à violência e vira um símbolo do caos.',
  },
  {
    id: 'lotr-fellowship',
    title: 'O Senhor dos Anéis: A Sociedade do Anel',
    originalTitle: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
    genres: ['Ação', 'Aventura', 'Fantasia'],
    overview:
      'Um hobbit recebe a missão de levar um anel de imenso poder até a única forja capaz de destruí-lo.',
  },
  {
    id: 'get-out',
    title: 'Corra!',
    originalTitle: 'Get Out',
    year: 2017,
    genres: ['Mistério', 'Terror', 'Thriller'],
    overview:
      'Um jovem negro visita a família da namorada branca e percebe que algo profundamente errado acontece ali.',
  },
  {
    id: 'hereditary',
    title: 'Hereditário',
    originalTitle: 'Hereditary',
    year: 2018,
    genres: ['Drama', 'Mistério', 'Terror'],
    overview:
      'Após a morte da avó, uma família começa a descobrir segredos sombrios sobre a própria linhagem.',
  },
  {
    id: 'the-shining',
    title: 'O Iluminado',
    originalTitle: 'The Shining',
    year: 1980,
    genres: ['Terror', 'Thriller'],
    overview:
      'Um escritor assume a zeladoria de um hotel isolado no inverno e perde progressivamente a sanidade.',
  },
  {
    id: 'shrek',
    title: 'Shrek',
    originalTitle: 'Shrek',
    year: 2001,
    genres: ['Animação', 'Comédia', 'Família', 'Fantasia'],
    overview:
      'Um ogro rabugento aceita resgatar uma princesa em troca de ter seu pântano de volta.',
  },
  {
    id: 'inside-out',
    title: 'Divertida Mente',
    originalTitle: 'Inside Out',
    year: 2015,
    genres: ['Animação', 'Comédia', 'Drama', 'Família'],
    overview:
      'As emoções que vivem na cabeça de uma menina de onze anos entram em crise quando ela muda de cidade.',
  },
  {
    id: 'spider-verse-2',
    title: 'Homem-Aranha: Através do Aranhaverso',
    originalTitle: 'Spider-Man: Across the Spider-Verse',
    year: 2023,
    genres: ['Animação', 'Ação', 'Aventura'],
    overview:
      'Miles Morales atravessa o multiverso e entra em conflito com uma sociedade de Homens-Aranha.',
  },
  {
    id: 'spirited-away',
    title: 'A Viagem de Chihiro',
    originalTitle: 'Sen to Chihiro no Kamikakushi',
    year: 2001,
    genres: ['Animação', 'Aventura', 'Família', 'Fantasia'],
    overview:
      'Uma menina fica presa em um mundo de espíritos e precisa trabalhar em uma casa de banhos para salvar os pais.',
  },
  {
    id: 'the-hangover',
    title: 'Se Beber, Não Case!',
    originalTitle: 'The Hangover',
    year: 2009,
    genres: ['Comédia'],
    overview:
      'Três amigos acordam em Las Vegas sem qualquer lembrança da noite anterior e sem o noivo.',
  },
  {
    id: 'superbad',
    title: 'Superbad: É Hoje',
    originalTitle: 'Superbad',
    year: 2007,
    genres: ['Comédia'],
    overview:
      'Dois amigos de escola tentam comprar bebida para uma festa na véspera da formatura.',
  },
  {
    id: 'the-shawshank-redemption',
    title: 'Um Sonho de Liberdade',
    originalTitle: 'The Shawshank Redemption',
    year: 1994,
    genres: ['Crime', 'Drama'],
    overview:
      'Condenado por um crime que não cometeu, um bancário constrói uma amizade improvável na prisão de Shawshank.',
  },
  {
    id: 'forrest-gump',
    title: 'Forrest Gump: O Contador de Histórias',
    originalTitle: 'Forrest Gump',
    year: 1994,
    genres: ['Comédia', 'Drama', 'Romance'],
    overview:
      'Um homem de bom coração atravessa por acidente algumas das maiores viradas da história americana.',
  },
  {
    id: 'titanic',
    title: 'Titanic',
    originalTitle: 'Titanic',
    year: 1997,
    genres: ['Drama', 'Romance'],
    overview:
      'Dois passageiros de classes opostas se apaixonam na viagem inaugural do navio considerado inafundável.',
  },
  {
    id: 'before-sunrise',
    title: 'Antes do Amanhecer',
    originalTitle: 'Before Sunrise',
    year: 1995,
    genres: ['Drama', 'Romance'],
    overview:
      'Dois estranhos se conhecem em um trem e passam uma única noite caminhando e conversando por Viena.',
  },
  {
    id: 'gladiator',
    title: 'Gladiador',
    originalTitle: 'Gladiator',
    year: 2000,
    genres: ['Ação', 'Aventura', 'Drama'],
    overview:
      'Um general romano traído é reduzido à escravidão e busca vingança na arena do Coliseu.',
  },
  {
    id: 'saving-private-ryan',
    title: 'O Resgate do Soldado Ryan',
    originalTitle: 'Saving Private Ryan',
    year: 1998,
    genres: ['Ação', 'Drama', 'Guerra'],
    overview:
      'Após o Dia D, um pelotão americano atravessa a França para resgatar um soldado cujos irmãos morreram em combate.',
  },
  {
    id: '1917',
    title: '1917',
    originalTitle: '1917',
    year: 2019,
    genres: ['Ação', 'Drama', 'Guerra'],
    overview:
      'Dois soldados britânicos recebem a missão de atravessar território inimigo para entregar uma ordem que evitará um massacre.',
  },
  {
    id: 'inglourious-basterds',
    title: 'Bastardos Inglórios',
    originalTitle: 'Inglourious Basterds',
    year: 2009,
    genres: ['Drama', 'Guerra', 'Thriller'],
    overview:
      'Na França ocupada, um grupo de soldados e uma dona de cinema tramam separadamente o mesmo golpe contra o alto comando nazista.',
  },
  {
    id: 'schindlers-list',
    title: 'A Lista de Schindler',
    originalTitle: "Schindler's List",
    year: 1993,
    genres: ['Drama', 'Guerra', 'História'],
    overview:
      'Um industrial alemão usa a própria fábrica para salvar mais de mil judeus do Holocausto.',
  },
  {
    id: 'django-unchained',
    title: 'Django Livre',
    originalTitle: 'Django Unchained',
    year: 2012,
    genres: ['Drama', 'Faroeste'],
    overview:
      'Um escravo libertado se torna caçador de recompensas para resgatar a esposa de um fazendeiro do Mississippi.',
  },
  {
    id: 'the-hateful-eight',
    title: 'Os Oito Odiados',
    originalTitle: 'The Hateful Eight',
    year: 2015,
    genres: ['Crime', 'Drama', 'Faroeste'],
    overview:
      'Uma nevasca prende oito estranhos armados em uma loja isolada, e nenhum deles confia nos outros.',
  },
  {
    id: 'bacurau',
    title: 'Bacurau',
    originalTitle: 'Bacurau',
    year: 2019,
    genres: ['Faroeste', 'Ficção científica', 'Thriller'],
    overview:
      'Um povoado do sertão desaparece do mapa e seus moradores percebem que estão sendo caçados.',
  },
  {
    id: 'whiplash',
    title: 'Whiplash: Em Busca da Perfeição',
    originalTitle: 'Whiplash',
    year: 2014,
    genres: ['Drama', 'Música'],
    overview:
      'Um jovem baterista é levado ao limite por um maestro impiedoso em um conservatório de elite.',
  },
  {
    id: 'bohemian-rhapsody',
    title: 'Bohemian Rhapsody',
    originalTitle: 'Bohemian Rhapsody',
    year: 2018,
    genres: ['Drama', 'Música'],
    overview:
      'A trajetória do Queen e de Freddie Mercury até o show do Live Aid em 1985.',
  },
  {
    id: 'free-solo',
    title: 'Free Solo',
    originalTitle: 'Free Solo',
    year: 2018,
    genres: ['Documentário'],
    overview:
      'O escalador Alex Honnold se prepara para subir a parede de El Capitan sem cordas nem equipamento de segurança.',
  },
]
