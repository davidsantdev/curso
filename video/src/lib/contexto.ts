import { createContext, useContext } from "react";
import volume1 from "../data/volume.json";
import { DURACAO, indices, PALAVRAS, type Palavra } from "./tempo";

/**
 * A aula que está sendo montada: palavras com tempo, volume da voz e duração. Os componentes de texto (Fala),
 * as barrinhas da voz (Barras), o indicador do canto (Hud) e a legenda leem daqui. Sem provedor, valem os dados
 * da aula 1, então a aula 1 não precisa de nada.
 */
export type TempoAula = {
  aula: string;
  palavras: Palavra[];
  indices: (frase: string, depois?: number) => number[];
  duracao: number;
  volume: number[];
};

export const TEMPO_AULA1: TempoAula = {
  aula: "Aula 01",
  palavras: PALAVRAS,
  indices,
  duracao: DURACAO,
  volume: volume1.values,
};

export const TempoContexto = createContext<TempoAula>(TEMPO_AULA1);
export const useTempo = () => useContext(TempoContexto);
