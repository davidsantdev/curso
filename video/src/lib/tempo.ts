import palavras from "../data/palavras.json";

/**
 * Tempo da fala. `palavras.json` tem cada palavra do roteiro com o segundo em que é falada
 * (gerado por scripts/align.py a partir da transcrição da voz). Todas as animações se prendem a isso:
 * em vez de "aos 73,6 s", o código diz em("você só paga o fornecedor") e o tempo vem da própria voz.
 * Cada aula tem a sua lista de palavras: `criarTempo` monta as funções para uma lista; as exportações soltas
 * abaixo são as da aula 1.
 */
export const FPS = 30;

export type Palavra = { t: string; s: number; e: number };

const chave = (token: string) =>
  token
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Palavras de uma frase, sem acento, pontuação nem maiúsculas. */
export const tokens = (frase: string) => frase.split(/\s+/).map(chave).filter(Boolean);

export function criarTempo(lista: Palavra[]) {
  // posições das palavras que contam (ignora pontuação solta)
  const CHAVES = lista.map((p) => chave(p.t));
  const POSICOES = CHAVES.map((c, i) => (c ? i : -1)).filter((i) => i >= 0);

  /** Índices (na lista) de cada palavra da frase, na primeira vez em que ela é falada a partir de `depois` segundos. */
  function indices(frase: string, depois = 0): number[] {
    const alvo = tokens(frase);
    if (alvo.length === 0) throw new Error("Frase vazia");
    for (let j = 0; j + alvo.length <= POSICOES.length; j++) {
      if (lista[POSICOES[j]].s + 0.001 < depois) continue;
      let igual = true;
      for (let k = 0; k < alvo.length && igual; k++) igual = CHAVES[POSICOES[j + k]] === alvo[k];
      if (igual) return POSICOES.slice(j, j + alvo.length);
    }
    throw new Error(`Frase não encontrada na fala: "${frase}" (procurando a partir de ${depois.toFixed(2)} s)`);
  }

  return {
    PALAVRAS: lista,
    /** Fim da última palavra falada (segundos). */
    FIM_DA_FALA: lista[lista.length - 1].e,
    indices,
    /** Segundo em que a frase começa a ser falada. */
    em: (frase: string, depois = 0) => lista[indices(frase, depois)[0]].s,
    /** Segundo em que a frase termina de ser falada. */
    fimDe: (frase: string, depois = 0) => {
      const ids = indices(frase, depois);
      return lista[ids[ids.length - 1]].e;
    },
  };
}

const aula1 = criarTempo(palavras);
export const PALAVRAS: Palavra[] = aula1.PALAVRAS;
export const FIM_DA_FALA = aula1.FIM_DA_FALA;
/** Duração total da aula 1: a fala mais o cartão final. */
export const DURACAO = FIM_DA_FALA + 2.6;
export const indices = aula1.indices;
export const em = aula1.em;
export const fimDe = aula1.fimDe;

/** Segundos -> quadros. */
export const q = (segundos: number) => Math.round(segundos * FPS);
