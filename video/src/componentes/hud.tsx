import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { prog } from "../lib/anim";
import { useTempo } from "../lib/contexto";
import { FPS, type Palavra } from "../lib/tempo";
import { COR, DEGRADE_FORTE, FONTE } from "../tema";
import { Etiqueta } from "./base";

/** Barrinhas que reagem à voz do professor (volume calculado da gravação, quadro a quadro). */
export const Barras: React.FC<{ quantidade?: number; altura?: number; largura?: number; cor?: string }> = ({
  quantidade = 7,
  altura = 40,
  largura = 6,
  cor = COR.texto,
}) => {
  const frame = useCurrentFrame();
  const VOLUME = useTempo().volume;
  const FORMA = [0.55, 0.8, 1, 0.75, 0.95, 0.6, 0.85, 0.7, 0.5];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: largura * 0.9, height: altura }}>
      {Array.from({ length: quantidade }, (_, i) => {
        const f = Math.max(0, frame - (i % 3));
        const v = ((VOLUME[f - 1] ?? 0) + (VOLUME[f] ?? 0) * 2 + (VOLUME[f + 1] ?? 0)) / 4;
        const h = Math.max(0.12, Math.min(1, v * FORMA[i % FORMA.length] * 1.25));
        return (
          <div
            key={i}
            style={{ width: largura, height: altura * h, borderRadius: largura, background: cor, opacity: 0.9 }}
          />
        );
      })}
    </div>
  );
};

export type CapituloHud = { n: string; titulo: string; de: number; ate: number };

/** Indicador discreto no canto: aula, capítulo atual e a barra de progresso do vídeo. */
export const Hud: React.FC<{ trechos: CapituloHud[] }> = ({ trechos }) => {
  const frame = useCurrentFrame();
  const { duracao: DURACAO, aula } = useTempo();
  const t = frame / FPS;
  const atual = trechos.find((c) => t >= c.de && t < c.ate);
  if (!atual) return null;
  const o = Math.min(prog(frame, atual.de, 0.6), 1 - prog(frame, atual.ate - 0.45, 0.4));
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 3,
          width: `${((t / DURACAO) * 100).toFixed(3)}%`,
          backgroundImage: DEGRADE_FORTE,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 72,
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontFamily: FONTE.mono,
          fontSize: 18,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: COR.apagado,
        }}
      >
        <span>{aula}</span>
        <span style={{ width: 22, height: 1, background: COR.fraco }} />
        <span style={{ color: COR.suave }}>{atual.n}</span>
        <span
          style={{
            fontFamily: FONTE.sans,
            fontSize: 21,
            letterSpacing: "-0.01em",
            textTransform: "none",
            color: COR.suave,
          }}
        >
          {atual.titulo}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/** Selo fixo no canto enquanto há contas na tela. */
export const SeloIlustrativo: React.FC<{ de: number; ate: number }> = ({ de, ate }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < de || t > ate + 0.5) return null;
  const o = Math.min(prog(frame, de, 0.6), 1 - prog(frame, ate, 0.45));
  return (
    <div style={{ position: "absolute", top: 44, right: 72, opacity: o }}>
      <Etiqueta
        icone={<span style={{ width: 7, height: 7, borderRadius: 7, background: COR.rosa }} />}
        style={{ fontSize: 16, padding: "10px 18px" }}
      >
        Valores ilustrativos
      </Etiqueta>
    </div>
  );
};

type Bloco = { de: number; ate: number; palavras: Palavra[] };

/** Agrupa as palavras em legendas de até ~56 caracteres, quebrando no fim das frases e nas pausas. */
function montarBlocos(palavras: Palavra[]): Bloco[] {
  const blocos: Bloco[] = [];
  let atual: Palavra[] = [];
  palavras.forEach((p, i) => {
    atual.push(p);
    const prox = palavras[i + 1];
    const texto = atual.map((x) => x.t).join(" ");
    const fimFrase = /[.?!:]$/.test(p.t);
    const pausa = prox !== undefined && prox.s - p.e > 0.45;
    const longo = prox !== undefined && texto.length + 1 + prox.t.length > 56;
    if (!prox || fimFrase || pausa || longo) {
      blocos.push({ de: atual[0].s, ate: p.e + 0.3, palavras: atual });
      atual = [];
    }
  });
  for (let i = 0; i < blocos.length - 1; i++) blocos[i].ate = Math.min(blocos[i].ate, blocos[i + 1].de);
  return blocos;
}

/** Legenda na imagem (versões legendadas): a palavra falada acende. */
export const Legenda: React.FC = () => {
  const frame = useCurrentFrame();
  const { palavras } = useTempo();
  const BLOCOS = useMemo(() => montarBlocos(palavras), [palavras]);
  const t = frame / FPS;
  const bloco = BLOCOS.find((b) => t >= b.de - 0.05 && t < b.ate);
  if (!bloco) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 64, pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: 1500,
          textAlign: "center",
          fontFamily: FONTE.sans,
          fontWeight: 500,
          fontSize: 42,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
          padding: "12px 28px",
          borderRadius: 16,
          background: "rgba(7,7,11,0.62)",
        }}
      >
        {bloco.palavras.map((p, i) => (
          <span key={i} style={{ color: t >= p.s - 0.03 ? COR.texto : "rgba(246,245,251,0.42)" }}>
            {p.t}
            {i < bloco.palavras.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
