import palavras from "../data/palavras.json";

/**
 * Tempo da fala. `palavras.json` tem cada palavra do roteiro com o segundo em que é falada
 * (gerado por scripts/align.py a partir da transcrição da voz). Todas as animações se prendem a isso:
 * em vez de "aos 73,6 s", o código diz em("você só paga o fornecedor") e o tempo vem da própria voz.
 */
export const FPS = 30;

export type Palavra = { t: string; s: number; e: number };
export const PALAVRAS: Palavra[] = palavras;

/** Fim da última palavra falada (segundos). */
export const FIM_DA_FALA = PALAVRAS[PALAVRAS.length - 1].e;
/** Duração total: a fala mais o cartão final. */
export const DURACAO = FIM_DA_FALA + 2.6;

const chave = (token: string) =>
  token
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Palavras de uma frase, sem acento, pontuação nem maiúsculas. */
export const tokens = (frase: string) => frase.split(/\s+/).map(chave).filter(Boolean);

// posições das palavras que contam (ignora pontuação solta)
const CHAVES = PALAVRAS.map((p) => chave(p.t));
const POSICOES = CHAVES.map((c, i) => (c ? i : -1)).filter((i) => i >= 0);

/** Índices (em PALAVRAS) de cada palavra da frase, na primeira vez em que ela é falada a partir de `depois` segundos. */
export function indices(frase: string, depois = 0): number[] {
  const alvo = tokens(frase);
  if (alvo.length === 0) throw new Error("Frase vazia");
  for (let j = 0; j + alvo.length <= POSICOES.length; j++) {
    if (PALAVRAS[POSICOES[j]].s + 0.001 < depois) continue;
    let igual = true;
    for (let k = 0; k < alvo.length && igual; k++) igual = CHAVES[POSICOES[j + k]] === alvo[k];
    if (igual) return POSICOES.slice(j, j + alvo.length);
  }
  throw new Error(`Frase não encontrada na fala: "${frase}" (procurando a partir de ${depois.toFixed(2)} s)`);
}

/** Segundo em que a frase começa a ser falada. */
export const em = (frase: string, depois = 0) => PALAVRAS[indices(frase, depois)[0]].s;

/** Segundo em que a frase termina de ser falada. */
export const fimDe = (frase: string, depois = 0) => {
  const ids = indices(frase, depois);
  return PALAVRAS[ids[ids.length - 1]].e;
};

/** Segundos -> quadros. */
export const q = (segundos: number) => Math.round(segundos * FPS);
