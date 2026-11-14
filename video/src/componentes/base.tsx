import type { LucideIcon } from "lucide-react";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ENTRADA, prog, SUAVE } from "../lib/anim";
import { FPS, indices, PALAVRAS, tokens } from "../lib/tempo";
import { COR, DEGRADE, DEGRADE_FORTE, FONTE } from "../tema";

/**
 * Uma cena: aparece em `de` e some em `ate` (segundos do vídeo), com transição desfocada
 * e uma leve aproximação de câmera durante a cena.
 */
export const Cena: React.FC<{ de: number; ate: number; children: React.ReactNode; zoom?: number }> = ({
  de,
  ate,
  children,
  zoom = 0.03,
}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const TRANSICAO = 0.45;
  if (t < de || t > ate + TRANSICAO) return null;
  const entra = prog(frame, de, 0.6);
  const sai = prog(frame, ate, TRANSICAO, ENTRADA);
  const camera = 1 + zoom * Math.min(1, Math.max(0, (t - de) / Math.max(ate - de, 1)));
  const escala = camera * (1 + (1 - entra) * 0.02) * (1 + sai * 0.04);
  const desfoque = (1 - entra) * 8 + sai * 12;
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(entra, 1 - sai),
        transform: `scale(${escala})`,
        filter: desfoque > 0.1 ? `blur(${desfoque.toFixed(2)}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Entrada de um bloco: sobe, ganha nitidez e aparece em `em`; some em `ate` (opcional). */
export const Revela: React.FC<{
  em: number;
  ate?: number;
  children: React.ReactNode;
  y?: number;
  desfoque?: number;
  duracao?: number;
  escala?: number;
  style?: React.CSSProperties;
}> = ({ em, ate, children, y = 28, desfoque = 10, duracao = 0.7, escala = 1, style }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, em, duracao);
  const s = ate === undefined ? 0 : prog(frame, ate, 0.4, ENTRADA);
  const blur = (1 - p) * desfoque + s * 8;
  return (
    <div
      style={{
        ...style,
        opacity: p * (1 - s),
        transform: `translateY(${((1 - p) * y - s * 14).toFixed(2)}px) scale(${(1 + (1 - p) * (escala - 1)).toFixed(4)})`,
        filter: blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

/** Palavra(s) em destaque: serifa itálica com o degradê da marca. */
export const Destaque: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      fontFamily: FONTE.serif,
      fontStyle: "italic",
      fontWeight: 400,
      fontSize: "1.12em",
      lineHeight: 0.9,
      letterSpacing: "-0.01em",
      backgroundImage: DEGRADE,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      paddingRight: "0.08em",
      marginRight: "-0.04em",
    }}
  >
    {children}
  </span>
);

type FalaProps = {
  /** Texto na tela. Trechos entre *asteriscos* viram destaque. */
  texto: string;
  /** Frase falada que comanda o tempo (padrão: o próprio texto). Mesmo número de palavras = sincronia palavra a palavra. */
  frase?: string;
  /** Procura a frase a partir deste segundo. */
  depois?: number;
  /** Força o início (sem sincronia com a voz); as palavras entram em sequência. */
  em?: number;
  intervalo?: number;
  ate?: number;
  tamanho?: number;
  peso?: number;
  cor?: string;
  alinhar?: "left" | "center" | "right";
  largura?: number;
  entrelinha?: number;
  style?: React.CSSProperties;
};

/** Texto que entra palavra por palavra, no instante em que cada palavra é falada. */
export const Fala: React.FC<FalaProps> = ({
  texto,
  frase,
  depois = 0,
  em: inicio,
  intervalo = 0.07,
  ate,
  tamanho = 88,
  peso = 600,
  cor = COR.texto,
  alinhar = "left",
  largura,
  entrelinha = 1.08,
  style,
}) => {
  const frame = useCurrentFrame();
  let dentro = false;
  const itens = texto
    .split(/\s+/)
    .filter(Boolean)
    .map((pedaco) => {
      let palavra = pedaco;
      if (palavra.startsWith("*")) {
        dentro = true;
        palavra = palavra.slice(1);
      }
      const fecha = /\*[.,!?:;”"…]*$/.test(palavra);
      if (fecha) palavra = palavra.replace(/\*([.,!?:;”"…]*)$/, "$1");
      const destaque = dentro;
      if (fecha) dentro = false;
      return { palavra, destaque };
    });

  let tempos: number[];
  if (inicio !== undefined) {
    tempos = itens.map((_, k) => inicio + k * intervalo);
  } else {
    const faladas = frase ?? texto.replace(/\*/g, "");
    const ids = indices(faladas, depois);
    tempos =
      tokens(faladas).length === itens.length
        ? ids.map((i) => PALAVRAS[i].s)
        : itens.map((_, k) => PALAVRAS[ids[0]].s + k * intervalo);
  }

  const saida = ate === undefined ? 0 : prog(frame, ate, 0.4, ENTRADA);
  return (
    <div
      style={{
        fontFamily: FONTE.sans,
        fontSize: tamanho,
        fontWeight: peso,
        color: cor,
        lineHeight: entrelinha,
        letterSpacing: "-0.035em",
        textAlign: alinhar,
        maxWidth: largura,
        opacity: 1 - saida,
        filter: saida > 0.01 ? `blur(${(saida * 8).toFixed(2)}px)` : undefined,
        ...style,
      }}
    >
      {itens.map(({ palavra, destaque }, k) => {
        const p = prog(frame, tempos[k] - 0.05, 0.5);
        return (
          <span
            key={k}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: p,
              transform: `translateY(${((1 - p) * 0.25).toFixed(4)}em)`,
              filter: p < 0.99 ? `blur(${((1 - p) * 7).toFixed(2)}px)` : undefined,
              marginRight: k < itens.length - 1 ? "0.24em" : 0,
            }}
          >
            {destaque ? <Destaque>{palavra}</Destaque> : palavra}
          </span>
        );
      })}
    </div>
  );
};

/** Rótulo pequeno em maiúsculas (fonte mono), com um ponto de luz da marca. */
export const Rotulo: React.FC<{
  children: React.ReactNode;
  em: number;
  ate?: number;
  cor?: string;
  style?: React.CSSProperties;
}> = ({ children, em, ate, cor = COR.suave, style }) => (
  <Revela em={em} ate={ate} y={12} desfoque={6} style={style}>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        fontFamily: FONTE.mono,
        fontSize: 21,
        fontWeight: 500,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: cor,
      }}
    >
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: 9,
          backgroundImage: DEGRADE_FORTE,
          boxShadow: "0 0 18px rgba(180,156,251,0.9)",
        }}
      />
      {children}
    </div>
  </Revela>
);

/** Etiqueta em formato de pílula. */
export const Etiqueta: React.FC<{
  children: React.ReactNode;
  icone?: React.ReactNode;
  cor?: string;
  style?: React.CSSProperties;
}> = ({ children, icone, cor = COR.suave, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 22px",
      borderRadius: 999,
      border: `1px solid ${COR.linha}`,
      background: "rgba(255,255,255,0.045)",
      fontFamily: FONTE.mono,
      fontSize: 19,
      fontWeight: 500,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: cor,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {icone}
    {children}
  </div>
);

/** Cartão de vidro. `ativo` (0 a 1) acende a borda com o degradê da marca. */
export const Vidro: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; ativo?: number }> = ({
  children,
  style,
  ativo = 0,
}) => (
  <div
    style={{
      position: "relative",
      borderRadius: 32,
      background: "linear-gradient(180deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.025) 100%)",
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow: `0 40px 100px -30px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 90px -20px rgba(125,114,248,${(0.45 * ativo).toFixed(3)})`,
      ...style,
    }}
  >
    {ativo > 0.01 && (
      <div
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: 32,
          padding: 1.5,
          backgroundImage: DEGRADE_FORTE,
          opacity: ativo,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />
    )}
    {children}
  </div>
);

/** Ícone dentro de um quadrado arredondado de vidro (ou preenchido com o degradê, se `destaque`). */
export const IconeCaixa: React.FC<{ icone: LucideIcon; tamanho?: number; cor?: string; destaque?: boolean }> = ({
  icone: Icone,
  tamanho = 96,
  cor = COR.texto,
  destaque = false,
}) => (
  <div
    style={{
      width: tamanho,
      height: tamanho,
      flexShrink: 0,
      borderRadius: tamanho * 0.28,
      display: "grid",
      placeItems: "center",
      backgroundImage: destaque
        ? DEGRADE_FORTE
        : "linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.03))",
      border: destaque ? "none" : "1px solid rgba(255,255,255,0.12)",
      boxShadow: destaque
        ? "0 20px 50px -12px rgba(125,114,248,0.65)"
        : "inset 0 1px 0 rgba(255,255,255,0.08)",
    }}
  >
    <Icone size={Math.round(tamanho * 0.44)} strokeWidth={1.6} color={destaque ? "#FFFFFF" : cor} />
  </div>
);

/** Texto que leva um risco animado em `em` (e fica mais apagado). */
export const Riscado: React.FC<{ children: React.ReactNode; em: number; cor?: string }> = ({
  children,
  em,
  cor = COR.vermelho,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, em, 0.45, SUAVE);
  return (
    <span style={{ position: "relative", display: "inline-block", opacity: 1 - 0.45 * p }}>
      {children}
      <span
        style={{
          position: "absolute",
          left: "-3%",
          right: "-3%",
          top: "54%",
          height: "0.075em",
          borderRadius: 99,
          background: cor,
          transform: `scaleX(${p.toFixed(4)})`,
          transformOrigin: "left center",
          boxShadow: `0 0 18px ${cor}`,
        }}
      />
    </span>
  );
};

/** Número que conta até o valor final, no formato brasileiro (4.500). */
export const Contador: React.FC<{
  para: number;
  de?: number;
  em: number;
  duracao?: number;
  prefixo?: string;
  sufixo?: string;
}> = ({ para, de = 0, em, duracao = 1.1, prefixo = "", sufixo = "" }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, em, duracao, SUAVE);
  const valor = Math.round(de + (para - de) * p);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefixo}
      {valor.toLocaleString("pt-BR")}
      {sufixo}
    </span>
  );
};

/** Centraliza o conteúdo de uma cena com as margens de segurança do vídeo. */
export const Palco: React.FC<{
  children: React.ReactNode;
  centro?: boolean;
  linha?: boolean;
  gap?: number;
  style?: React.CSSProperties;
}> = ({ children, centro = false, linha = false, gap = 0, style }) => (
  <AbsoluteFill
    style={{
      display: "flex",
      flexDirection: linha ? "row" : "column",
      justifyContent: "center",
      alignItems: centro ? "center" : linha ? "center" : "flex-start",
      padding: "120px 170px",
      gap,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);
