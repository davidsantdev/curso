/**
 * Aula 2 — Do clique ao lucro. Tudo aqui se prende à fala: cada slide entra quando a voz chega na parte dele e
 * cada marcação aparece na palavra certa. As posições vêm de slides.json (medidas nos próprios slides).
 */
import palavras from "../data/aula-02/palavras.json";
import medidas from "../data/aula-02/slides.json";
import { criarTempo } from "../lib/tempo";

export const T2 = criarTempo(palavras);
const { em } = T2;

export type Caixa = { x: number; y: number; w: number; h: number };
type Slide = {
  arquivo: string;
  elementos: Record<string, Caixa[]>;
  frases: Record<string, Caixa[][]>;
};
export const SLIDES = (medidas as unknown as { slides: Slide[] }).slides;

/** Caixa de um elemento medido no slide `n` (1 a 6). */
export const el = (n: number, nome: string, i = 0): Caixa => {
  const caixa = SLIDES[n - 1].elementos[nome]?.[i];
  if (!caixa) throw new Error(`Slide ${n} não tem "${nome}" #${i}`);
  return caixa;
};
/** Linhas de uma frase no slide `n` (a frase pode quebrar de linha). */
export const frase = (n: number, texto: string, ocorrencia = 0): Caixa[] => {
  const linhas = SLIDES[n - 1].frases[texto]?.[ocorrencia];
  if (!linhas) throw new Error(`Slide ${n} não tem a frase "${texto}"`);
  return linhas;
};

/* ------------------------------------------------------------------ */
/* Quando cada slide entra                                             */
/* ------------------------------------------------------------------ */

const s2 = em("Olha só o roteiro de hoje");
const s3 = em("Primeira coisa vou trocar de exemplo");
const s4 = em("Beleza dessa conta saem os quatro custos");
const s5 = em("E agora a parte que pega muita gente desprevenida", s4);
const s6 = em("Então o que você faz com isso agora");

export const INICIO_SLIDE = [0, s2, s3, s4, s5, s6];
export const GANCHO = em("E já fica o aviso");
export const FIM_FALA = T2.FIM_DA_FALA;
/** Cartão final depois da última palavra. */
export const CARTAO_FINAL = 3.4;
export const DURACAO_AULA2 = FIM_FALA + CARTAO_FINAL;

/* ------------------------------------------------------------------ */
/* Marcações                                                           */
/* ------------------------------------------------------------------ */

export type Marca =
  | { tipo: "circulo"; slide: number; em: number; caixa: Caixa; forte?: boolean }
  | { tipo: "sublinhado"; slide: number; em: number; caixa: Caixa }
  | { tipo: "marcaTexto"; slide: number; em: number; linhas: Caixa[] }
  | { tipo: "anel"; slide: number; em: number; caixa: Caixa; ate?: number }
  | { tipo: "check"; slide: number; em: number; caixa: Caixa }
  | { tipo: "escrita"; slide: number; em: number; x: number; y: number; texto: string; tamanho?: number; alinhar?: "esquerda" | "direita" }
  | { tipo: "traco"; slide: number; em: number; x1: number; x2: number; y: number }
  | { tipo: "lousa"; slide: number; em: number };

/** Área da direita (onde fica a ilustração) vira "lousa" para escrever as contas. */
export const LOUSA: Caixa = { x: 1264, y: 180, w: 600, h: 810 };

const sobrou = em("E o que sobrou", s3);
const exemplo300 = em("Por exemplo você gastou 300", s4);

export const MARCAS: Marca[] = [
  /* Slide 2: o roteiro da aula */
  { tipo: "sublinhado", slide: 2, em: em("a gente segue um pedido"), caixa: el(2, "roteiro", 0) },
  { tipo: "sublinhado", slide: 2, em: em("os quatro custos", s2), caixa: el(2, "roteiro", 1) },
  { tipo: "sublinhado", slide: 2, em: em("o dinheiro em caixa", s2), caixa: el(2, "roteiro", 2) },

  /* Slide 3: o caminho de um pedido */
  { tipo: "circulo", slide: 3, em: em("e paga R$ 120", s3), caixa: frase(3, "R$ 120")[0] },
  { tipo: "circulo", slide: 3, em: em("Aqui no exemplo R$ 6", s3), caixa: frase(3, "R$ 6")[0] },
  { tipo: "circulo", slide: 3, em: em("o frete R$ 55", s3), caixa: frase(3, "R$ 55")[0] },
  { tipo: "circulo", slide: 3, em: em("R$ 30 por essa venda", s3), caixa: frase(3, "R$ 30").slice(-1)[0] },
  { tipo: "lousa", slide: 3, em: sobrou - 0.2 },
  { tipo: "escrita", slide: 3, em: em("R$ 120 menos", sobrou), x: 1640, y: 250, texto: "120", alinhar: "direita" },
  { tipo: "escrita", slide: 3, em: em("menos R$ 6", sobrou), x: 1640, y: 322, texto: "− 6", alinhar: "direita" },
  { tipo: "escrita", slide: 3, em: em("menos R$ 55", sobrou), x: 1640, y: 394, texto: "− 55", alinhar: "direita" },
  { tipo: "escrita", slide: 3, em: em("menos R$ 30", sobrou), x: 1640, y: 466, texto: "− 30", alinhar: "direita" },
  { tipo: "traco", slide: 3, em: em("sobra R$ 29", sobrou) - 0.15, x1: 1430, x2: 1660, y: 552 },
  { tipo: "escrita", slide: 3, em: em("sobra R$ 29", sobrou), x: 1640, y: 562, texto: "29", alinhar: "direita", tamanho: 84 },
  { tipo: "circulo", slide: 3, em: em("Esses R$ 29", sobrou), caixa: { x: 1556, y: 572, w: 92, h: 84 }, forte: true },
  { tipo: "circulo", slide: 3, em: em("Esses R$ 29", sobrou) + 0.5, caixa: frase(3, "R$ 29")[0] },
  { tipo: "sublinhado", slide: 3, em: em("são a sua margem", sobrou), caixa: frase(3, "margem")[0] },
  { tipo: "escrita", slide: 3, em: em("faturei R$ 120", sobrou), x: 1330, y: 700, texto: "faturou: 120", tamanho: 58 },
  { tipo: "escrita", slide: 3, em: em("Ele ganhou R$ 29", sobrou), x: 1330, y: 770, texto: "ganhou: 29", tamanho: 58 },
  { tipo: "escrita", slide: 3, em: em("Faturamento e lucro são coisas", sobrou), x: 1330, y: 860, texto: "faturamento  ≠  lucro", tamanho: 58 },

  /* Slide 4: os quatro custos */
  { tipo: "anel", slide: 4, em: em("Primeiro produto mais frete", s4), ate: em("Segundo as taxas", s4), caixa: el(4, "cartao", 0) },
  { tipo: "escrita", slide: 4, em: em("Primeiro produto mais frete", s4), x: el(4, "cartao", 0).x + el(4, "cartao", 0).w - 64, y: el(4, "cartao", 0).y + 4, texto: "1", tamanho: 78 },
  { tipo: "anel", slide: 4, em: em("Segundo as taxas", s4), ate: em("Terceiro e esse é o que mais engana", s4), caixa: el(4, "cartao", 1) },
  { tipo: "escrita", slide: 4, em: em("Segundo as taxas", s4), x: el(4, "cartao", 1).x + el(4, "cartao", 1).w - 64, y: el(4, "cartao", 1).y + 4, texto: "2", tamanho: 78 },
  { tipo: "anel", slide: 4, em: em("Terceiro e esse é o que mais engana", s4), ate: em("Quarto impostos", s4), caixa: el(4, "cartao", 2) },
  { tipo: "escrita", slide: 4, em: em("Terceiro e esse é o que mais engana", s4), x: el(4, "cartao", 2).x + el(4, "cartao", 2).w - 64, y: el(4, "cartao", 2).y + 4, texto: "3", tamanho: 78 },
  { tipo: "anel", slide: 4, em: em("Quarto impostos", s4), ate: s5, caixa: el(4, "cartao", 3) },
  { tipo: "escrita", slide: 4, em: em("Quarto impostos", s4), x: el(4, "cartao", 3).x + el(4, "cartao", 3).w - 64, y: el(4, "cartao", 3).y + 4, texto: "4", tamanho: 78 },
  { tipo: "lousa", slide: 4, em: exemplo300 - 0.2 },
  { tipo: "escrita", slide: 4, em: em("gastou 300 reais", s4), x: 1330, y: 250, texto: "R$ 300 de anúncio", tamanho: 58 },
  { tipo: "escrita", slide: 4, em: em("fez 10 vendas", s4), x: 1330, y: 320, texto: "10 vendas", tamanho: 58 },
  { tipo: "escrita", slide: 4, em: em("300 dividido por 10", s4), x: 1330, y: 420, texto: "300 ÷ 10 = 30", tamanho: 70 },
  { tipo: "escrita", slide: 4, em: em("cada venda custou 30 reais", s4), x: 1330, y: 500, texto: "por venda", tamanho: 58 },
  { tipo: "escrita", slide: 4, em: em("Porque ele muda", s4), x: 1330, y: 610, texto: "ele muda: 30… 50…", tamanho: 58 },
  { tipo: "escrita", slide: 4, em: em("E se ele passar da sua margem", s4), x: 1330, y: 700, texto: "passou da margem", tamanho: 58 },
  { tipo: "escrita", slide: 4, em: em("dá prejuízo", s4), x: 1330, y: 770, texto: "= prejuízo", tamanho: 58 },

  /* Slide 5: dinheiro em caixa */
  { tipo: "marcaTexto", slide: 5, em: em("No cartão pode levar dias", s5), linhas: frase(5, "recebe do meio de pagamento dias depois") },
  { tipo: "marcaTexto", slide: 5, em: em("O fornecedor você paga na hora", s5), linhas: frase(5, "paga o fornecedor na hora") },
  { tipo: "escrita", slide: 5, em: em("Dez vendas R$ 550", s5), x: 140, y: 680, texto: "10 vendas × R$ 55 = R$ 550 por dia", tamanho: 58 },
  { tipo: "escrita", slide: 5, em: em("Em uma semana", s5), x: 140, y: 765, texto: "7 dias = R$ 3.850 saindo do bolso", tamanho: 58 },
  { tipo: "escrita", slide: 5, em: em("Faz a conta", s5), x: 140, y: 850, texto: "reserva = gasto por dia × dias até o dinheiro cair", tamanho: 54 },
  { tipo: "circulo", slide: 5, em: em("tem a Calculadora de margem", s5), caixa: frase(5, "Calculadora de margem")[0] },

  /* Slide 6: tarefas e próxima aula */
  { tipo: "check", slide: 6, em: em("Primeira pega um produto", s6), caixa: el(6, "caixa", 0) },
  { tipo: "check", slide: 6, em: em("Segunda joga esses números", s6), caixa: el(6, "caixa", 1) },
  { tipo: "check", slide: 6, em: em("Terceira descobre em quantos dias", s6), caixa: el(6, "caixa", 2) },
  // a frase "na próxima aula" saiu do áudio: o contorno entra logo antes do gancho
  { tipo: "anel", slide: 6, em: T2.fimDe("muita dor de cabeça", s6) + 0.15, caixa: el(6, "seguinte", 0) },
];

/** Itens do gancho dos próximos módulos. */
export const GANCHO_ITENS = [
  { icone: "Tag", texto: "Produto de low ticket", em: em("Produto de low ticket", GANCHO) },
  { icone: "Search", texto: "Como achar esse produto", em: em("Como achar esse produto", GANCHO) },
  { icone: "Handshake", texto: "Com quem falar", em: em("com quem falar", GANCHO) },
  { icone: "TrendingUp", texto: "Tendência × modinha", em: em("tendência de verdade", GANCHO) },
] as const;

/** Capítulos (para a descrição do vídeo e para o player). */
export const CAPITULOS = [
  { titulo: "Abertura", em: 0 },
  { titulo: "O que você vai aprender", em: s2 },
  { titulo: "O caminho de um pedido", em: s3 },
  { titulo: "Os quatro custos", em: s4 },
  { titulo: "Atenção ao dinheiro em caixa", em: s5 },
  { titulo: "O que você faz agora", em: s6 },
  { titulo: "Nos próximos módulos", em: GANCHO },
];
