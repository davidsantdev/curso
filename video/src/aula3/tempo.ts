/**
 * Aula 3 — O que vem pela frente: os métodos, a IA e os robôs.
 * Voz do ElevenLabs em duas partes, unidas com uma pausa (audio/aula-03/voz-original.mp3). Todo o tempo vem da fala.
 */
import palavras from "../data/aula-03/palavras.json";
import volume from "../data/aula-03/volume.json";
import type { CapituloHud } from "../componentes/hud";
import type { TempoAula } from "../lib/contexto";
import { criarTempo } from "../lib/tempo";

const tempo = criarTempo(palavras);
export const { em, fimDe } = tempo;
export const FIM_DA_FALA = tempo.FIM_DA_FALA;
/** Cartão final sem voz: a próxima aula e as tarefas. */
export const CARTAO_FINAL = 5.5;
export const DURACAO_AULA3 = FIM_DA_FALA + CARTAO_FINAL;

export const TEMPO_AULA3: TempoAula = {
  aula: "Aula 03",
  palavras: tempo.PALAVRAS,
  indices: tempo.indices,
  duracao: DURACAO_AULA3,
  volume: volume.values,
};

/** Cada cena começa um pouquinho antes da primeira palavra dela. */
const antes = (s: number, folga = 0.15) => Math.max(0, s - folga);

export const T = {
  inicio: 0,
  rapidinha: antes(em("Essa aula vai ser rapidinha")),
  frente: antes(em("Antes de a gente seguir")),
  caminho: antes(em("Porque quando você enxerga")),
  roteiro: antes(em("Olha só o que eu vou te mostrar")),
  cap1: antes(em("Primeira coisa os métodos"), 0.4),
  produtos: antes(em("Logo depois desta trilha grátis")),
  quemVende: antes(em("É ali que eu te passo")),
  lowTicket: antes(em("como achar produto de low ticket")),
  falar: antes(em("com quem falar")),
  tendencia: antes(em("e como separar")),
  loja: antes(em("Depois você aprende a montar")),
  pagamentos: antes(em("Aí vem pagamentos")),
  anuncios: antes(em("E depois o que faz o cliente chegar")),
  marketplaces: antes(em("E ainda tem os marketplaces")),
  muitaCoisa: antes(em("É muita coisa")),
  passo: antes(em("Mas é tudo passo a passo")),
  cap2: antes(em("Agora a parte que eu mais gosto"), 0.4),
  codigo: antes(em("A gente vai aprender programação")),
  facil: antes(em("Só que do jeito fácil")),
  antesProg: antes(em("Antes pra criar um site")),
  ia: antes(em("Hoje a inteligência artificial")),
  melhor: antes(em("E aqui dentro a gente vai usar")),
  ensinar: antes(em("Eu vou te ensinar como usar")),
  claro: antes(em("Que fique claro")),
  resto: antes(em("O resto a IA faz")),
  cap3: antes(em("E o melhor de tudo"), 0.4),
  filme: antes(em("Robô aqui não é aquele de filme")),
  regra: antes(em("É uma regra que o computador")),
  exemplos: antes(em("Chegou um pedido")),
  estrategias: antes(em("Ou seja a gente vai botar")),
  perguntas: antes(em("Qual produto vender qual oferta")),
  crescer: antes(em("Isso nenhum robô faz por você")),
  fimDaFala: FIM_DA_FALA,
  fim: DURACAO_AULA3,
};

/** Capítulos (indicador do canto e descrição do YouTube). */
export const CAPITULOS = [
  { n: "01", titulo: "Os métodos", de: T.cap1, cartaoAte: T.produtos },
  { n: "02", titulo: "Programação, do jeito fácil", de: T.cap2, cartaoAte: T.codigo },
  { n: "03", titulo: "Robôs trabalhando por você", de: T.cap3, cartaoAte: T.filme },
];

export const TRECHOS_HUD: CapituloHud[] = CAPITULOS.map((c, i) => ({
  n: c.n,
  titulo: c.titulo,
  de: c.cartaoAte,
  ate: i + 1 < CAPITULOS.length ? CAPITULOS[i + 1].de : T.fimDaFala,
}));

/** Batidas de câmera (zoom rápido + tremida) nos momentos de meme. */
export const BATIDAS: { em: number; forca: number }[] = [
  { em: em("rapidinha"), forca: 0.6 },
  { em: em("programação", em("vai te surpreender")), forca: 1 },
  { em: em("dicas de quem vende muito"), forca: 0.5 },
  { em: em("sem nem ter uma loja própria"), forca: 0.7 },
  { em: em("É", em("É muita coisa") + 0.5), forca: 0.8 },
  { em: em("Isso mesmo programação"), forca: 0.9 },
  { em: em("custa caro"), forca: 1 },
  { em: em("a melhor IA do mercado"), forca: 0.7 },
  { em: em("O resto a IA faz") + 0.55, forca: 0.9 },
  { em: em("aquele de filme"), forca: 0.8 },
  { em: em("pode ter certeza"), forca: 0.8 },
];
