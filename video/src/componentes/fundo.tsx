import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import type { Clipe } from "../broll";
import { FPS, q } from "../lib/tempo";
import { COR } from "../tema";

/** Fundo de todo o vídeo: preto profundo com brilhos da marca que se movem devagar e uma grade discreta. */
export const Fundo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const x1 = 26 + Math.sin(t * 0.13) * 9;
  const y1 = 28 + Math.cos(t * 0.1) * 8;
  const x2 = 76 + Math.cos(t * 0.09) * 8;
  const y2 = 74 + Math.sin(t * 0.14) * 7;
  const x3 = 60 + Math.sin(t * 0.07) * 14;
  const y3 = 16 + Math.cos(t * 0.11) * 6;
  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
      <AbsoluteFill
        style={{
          backgroundImage: [
            `radial-gradient(52% 62% at ${x1.toFixed(2)}% ${y1.toFixed(2)}%, rgba(85,101,255,0.24) 0%, rgba(85,101,255,0) 70%)`,
            `radial-gradient(48% 58% at ${x2.toFixed(2)}% ${y2.toFixed(2)}%, rgba(242,95,220,0.16) 0%, rgba(242,95,220,0) 70%)`,
            `radial-gradient(40% 40% at ${x3.toFixed(2)}% ${y3.toFixed(2)}%, rgba(184,133,237,0.13) 0%, rgba(184,133,237,0) 70%)`,
          ].join(", "),
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          backgroundPosition: "center center",
          WebkitMaskImage: "radial-gradient(ellipse 62% 58% at 50% 50%, #000 0%, transparent 85%)",
          maskImage: "radial-gradient(ellipse 62% 58% at 50% 50%, #000 0%, transparent 85%)",
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};

/** Vinheta e granulação de filme por cima de tudo (o ruído também evita 'degraus' nos degradês). */
export const Acabamento: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)" }}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Img
          key={i}
          src={staticFile(`grain/${i}.png`)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            // troca a cada 2 quadros: mantém o efeito de filme e deixa o arquivo bem mais leve
            opacity: Math.floor(frame / 2) % 6 === i ? 0.045 : 0,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** Velocidade para o clipe cobrir a cena (desacelera até a metade; mais que isso fica artificial). */
const velocidade = (clipe: NonNullable<Clipe>, segundos: number) =>
  Math.max(0.5, Math.min(1, clipe.duracao / Math.max(segundos, 0.1)));

/** Cena de apoio em tela cheia, escurecida para o texto continuar legível. Sem clipe, não desenha nada. */
export const FundoVideo: React.FC<{ clipe: Clipe; de: number; ate: number; escurecer?: number }> = ({
  clipe,
  de,
  ate,
  escurecer = 0.6,
}) => {
  if (!clipe) return null;
  return (
    <Sequence from={q(de)} durationInFrames={q(ate - de + 0.6)} layout="none">
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile(`broll/${clipe.arquivo}`)}
          muted
          playbackRate={velocidade(clipe, ate - de + 0.6)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <AbsoluteFill
          style={{
            background: `linear-gradient(90deg, rgba(7,7,11,${Math.min(0.95, escurecer + 0.25)}) 0%, rgba(7,7,11,${escurecer}) 50%, rgba(7,7,11,${Math.max(0, escurecer - 0.2)}) 100%)`,
          }}
        />
      </AbsoluteFill>
    </Sequence>
  );
};

/** Cena de apoio dentro de uma moldura (ex.: a garrafa, o estoque parado). */
export const MolduraVideo: React.FC<{
  clipe: NonNullable<Clipe>;
  de: number;
  ate: number;
  style?: React.CSSProperties;
}> = ({ clipe, de, ate, style }) => (
  <div style={{ position: "relative", overflow: "hidden", borderRadius: 28, ...style }}>
    <Sequence from={q(de)} durationInFrames={q(ate - de + 0.6)} layout="none">
      <OffthreadVideo
        src={staticFile(`broll/${clipe.arquivo}`)}
        muted
        playbackRate={velocidade(clipe, ate - de + 0.6)}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Sequence>
  </div>
);
