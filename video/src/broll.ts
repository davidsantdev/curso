/**
 * Cenas de apoio (B-roll) geradas no Higgsfield ou em outro gerador. São opcionais: sem elas, cada cena usa
 * as próprias animações. Para usar uma: salve o .mp4 em public/broll/ e troque o `null` por
 * { arquivo: "armazem.mp4", duracao: <segundos do clipe> }. Os prompts de cada cena estão no README
 * (casaVazia = casa-vazia.mp4, estoqueParado = estoque-parado.mp4, clienteEsperando = cliente-esperando.mp4).
 */
export type Clipe = { arquivo: string; duracao: number } | null;

export const BROLL: Record<
  "casaVazia" | "armazem" | "pacote" | "garrafa" | "estoqueParado" | "clienteEsperando" | "trabalho",
  Clipe
> = {
  casaVazia: null,
  armazem: null,
  pacote: null,
  garrafa: null,
  estoqueParado: null,
  clienteEsperando: null,
  trabalho: null,
};

/** Trilha musical opcional (arquivo em public/, ex.: "musica.mp3"). Entra baixinha, por baixo da voz. */
export const MUSICA: string | null = null;
