import React from "react";
import { useCurrentFrame } from "remotion";
import { loadFont as carregarCaveat } from "@remotion/google-fonts/Caveat";
import { prog, SAIDA, SUAVE } from "../lib/anim";
import { FPS } from "../lib/tempo";
import { LOUSA, type Caixa, type Marca } from "./dados";

/** Letra de mão para o que a "caneta" escreve na tela. */
export const CANETA = carregarCaveat("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;
/** Cor da caneta: o rosa da marca, forte o bastante para aparecer no branco e no lilás. */
export const TINTA = "#E5337F";

/* ------------------------------------------------------------------ */
/* Traços desenhados à mão                                             */
/* ------------------------------------------------------------------ */

type Ponto = [number, number];
const comprimento = (pontos: Ponto[]) =>
  pontos.reduce((soma, p, i) => (i ? soma + Math.hypot(p[0] - pontos[i - 1][0], p[1] - pontos[i - 1][1]) : 0), 0);
const caminho = (pontos: Ponto[]) => pontos.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");

/** Elipse feita à mão: passa um pouco do ponto de partida, com um leve tremor. */
function elipse(c: Caixa, folga = 16, semente = 1): Ponto[] {
  const cx = c.x + c.w / 2;
  const cy = c.y + c.h / 2;
  const rx = c.w / 2 + folga + 6;
  const ry = c.h / 2 + folga * 0.7;
  const inicio = -2.4 + semente * 0.3;
  const pontos: Ponto[] = [];
  for (let i = 0; i <= 90; i++) {
    const t = inicio + (i / 90) * Math.PI * 2 * 1.1;
    const r = 1 + 0.035 * Math.sin(t * 3 + semente) + i * 0.0006;
    pontos.push([cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r]);
  }
  return pontos;
}

/** Retângulo arredondado à mão, em volta de um cartão. */
function anel(c: Caixa, folga = 12): Ponto[] {
  const x0 = c.x - folga;
  const y0 = c.y - folga;
  const x1 = c.x + c.w + folga;
  const y1 = c.y + c.h + folga;
  const r = 30;
  const pontos: Ponto[] = [];
  const arco = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= 8; i++) {
      const a = a0 + (i / 8) * (Math.PI / 2);
      pontos.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  };
  pontos.push([x0 + r + 8, y0 + 3]);
  arco(x1 - r, y0 + r, -Math.PI / 2);
  arco(x1 - r, y1 - r, 0);
  arco(x0 + r, y1 - r, Math.PI / 2);
  arco(x0 + r, y0 + r, Math.PI);
  pontos.push([x0 + r + 70, y0 - 4]);
  return pontos;
}

const Traco: React.FC<{ pontos: Ponto[]; inicio: number; duracao: number; largura?: number; opacidade?: number }> = ({
  pontos,
  inicio,
  duracao,
  largura = 6,
  opacidade = 1,
}) => {
  const frame = useCurrentFrame();
  const total = comprimento(pontos);
  const p = prog(frame, inicio, duracao, SUAVE);
  if (p <= 0) return null;
  return (
    <path
      d={caminho(pontos)}
      fill="none"
      stroke={TINTA}
      strokeWidth={largura}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={total}
      strokeDashoffset={total * (1 - p)}
      opacity={opacidade}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Uma marcação                                                        */
/* ------------------------------------------------------------------ */

const larguraTexto = (texto: string, tamanho: number) => texto.length * tamanho * 0.42;

export const UmaMarca: React.FC<{ marca: Marca; indice: number }> = ({ marca, indice }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < marca.em - 0.05) return null;

  switch (marca.tipo) {
    case "circulo":
      return (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <Traco pontos={elipse(marca.caixa, marca.forte ? 18 : 12, indice)} inicio={marca.em} duracao={0.5} largura={marca.forte ? 7 : 5.5} />
        </svg>
      );

    case "sublinhado": {
      const c = marca.caixa;
      const y = c.y + c.h + 4;
      const pontos: Ponto[] = [];
      for (let i = 0; i <= 30; i++) {
        const x = c.x + 4 + (i / 30) * (c.w - 8);
        pontos.push([x, y + Math.sin(i / 4 + indice) * 1.6 + (i / 30) * 3]);
      }
      return (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <Traco pontos={pontos} inicio={marca.em} duracao={0.45} largura={5} />
        </svg>
      );
    }

    case "marcaTexto":
      return (
        <>
          {marca.linhas.map((l, i) => {
            const p = prog(frame, marca.em + i * 0.3, 0.35, SUAVE);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: l.x - 6,
                  top: l.y + 6,
                  width: (l.w + 12) * p,
                  height: l.h - 6,
                  background: "#FFE45C",
                  opacity: 0.6,
                  mixBlendMode: "multiply",
                  borderRadius: 6,
                }}
              />
            );
          })}
        </>
      );

    case "anel": {
      const some = marca.ate !== undefined ? 1 - 0.75 * prog(frame, marca.ate, 0.4) : 1;
      return (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <Traco pontos={anel(marca.caixa)} inicio={marca.em} duracao={0.6} largura={5} opacidade={some} />
        </svg>
      );
    }

    case "check": {
      const c = marca.caixa;
      const pontos: Ponto[] = [
        [c.x + c.w * 0.12, c.y + c.h * 0.5],
        [c.x + c.w * 0.42, c.y + c.h * 0.86],
        [c.x + c.w * 1.05, c.y - c.h * 0.18],
      ];
      return (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <Traco pontos={pontos} inicio={marca.em} duracao={0.35} largura={7} />
        </svg>
      );
    }

    case "traco":
      return (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <Traco pontos={[[marca.x1, marca.y], [marca.x2, marca.y + 3]]} inicio={marca.em} duracao={0.3} largura={5} />
        </svg>
      );

    case "lousa": {
      const p = prog(frame, marca.em, 0.5, SAIDA);
      return (
        <div
          style={{
            position: "absolute",
            left: LOUSA.x,
            top: LOUSA.y,
            width: LOUSA.w,
            height: LOUSA.h,
            background: "#ffffff",
            opacity: p,
          }}
        />
      );
    }

    case "escrita": {
      const tamanho = marca.tamanho ?? 68;
      const duracao = Math.min(1.1, Math.max(0.35, marca.texto.length * 0.045));
      const p = prog(frame, marca.em, duracao, SUAVE);
      const largura = larguraTexto(marca.texto, tamanho) + 40;
      const direita = marca.alinhar === "direita";
      return (
        <div
          style={{
            position: "absolute",
            top: marca.y,
            ...(direita ? { left: marca.x - largura, width: largura, textAlign: "right" } : { left: marca.x }),
            fontFamily: CANETA,
            fontWeight: 700,
            fontSize: tamanho,
            lineHeight: 1,
            color: TINTA,
            whiteSpace: "nowrap",
            clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`,
          }}
        >
          {marca.texto}
        </div>
      );
    }
  }
};
