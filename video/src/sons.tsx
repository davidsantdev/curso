import React from "react";
import { Html5Audio, Sequence, staticFile } from "remotion";
import { em, q } from "./lib/tempo";
import { T } from "./marcos";

type Som = { arquivo: "whoosh" | "impacto" | "clique"; em: number; volume: number };

// o pico do whoosh fica ~0,5 s depois do início: começa antes para o pico bater com a virada
const whoosh = (s: number, volume = 0.2): Som => ({ arquivo: "whoosh", em: s - 0.5, volume });
const impacto = (s: number, volume = 0.28): Som => ({ arquivo: "impacto", em: s - 0.03, volume });
const clique = (s: number): Som => ({ arquivo: "clique", em: s - 0.02, volume: 0.14 });

/** Efeitos sonoros: whoosh nas viradas de capítulo, impacto nos momentos-chave, clique nas listas. */
export const SONS: Som[] = [
  whoosh(0.5, 0.1),
  impacto(em("Vender sem estoque", T.hoje), 0.3),
  ...[T.cap1, T.cap2, T.cap3, T.cap4, T.cap5, T.cap6].map((s) => whoosh(s)),
  ...["Como isso funciona na prática", "Quem faz o quê", "É verdade ou é conversa de internet", "E o que muda pra você"].map(
    (f) => clique(em(f, T.explicacao)),
  ),
  impacto(em("Depois", em("Não antes", T.ponto)), 0.28),
  ...["paga 99 reais", "paga os 45", "embala e envia", "o cliente recebe a garrafa"].map((f) => clique(em(f, T.venda))),
  impacto(em("4.500 reais", T.comparacao), 0.24),
  impacto(em("Isso tá errado", T.objecao), 0.2),
  ...["produto certo", "oferta clara", "atendimento bom"].map((f) => clique(em(f, T.vantagem))),
  ...["Primeira: explica", "Segunda: anota", "E responde as três perguntas"].map((f) => clique(em(f, T.tarefas))),
  impacto(em("lucrar é outra", T.proxima), 0.22),
];

export const Sons: React.FC = () => (
  <>
    {SONS.map((s, i) => (
      <Sequence key={i} from={q(Math.max(0, s.em))} durationInFrames={q(2.2)} layout="none">
        <Html5Audio src={staticFile(`sfx/${s.arquivo}.wav`)} volume={s.volume} />
      </Sequence>
    ))}
  </>
);
