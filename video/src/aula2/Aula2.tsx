import React from "react";
import { AbsoluteFill, Html5Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as carregarJost } from "@remotion/google-fonts/Jost";
import { Handshake, Search, Tag, TrendingUp } from "lucide-react";
import { entre, prog, SAIDA, SUAVE } from "../lib/anim";
import { FPS, q } from "../lib/tempo";
import { DURACAO_AULA2, FIM_FALA, GANCHO, GANCHO_ITENS, INICIO_SLIDE, MARCAS, SLIDES } from "./dados";
import { UmaMarca } from "./marcas";

const JOST = carregarJost("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;

/** Cores da trilha "Vender sem estoque" (as mesmas do site). */
const TRILHA = { de: "#4f46e5", ate: "#8b6cf0", suave: "#efeeff", tinta: "#5546e8" };
const TRANSICAO = 0.45;

const ICONES = { Tag, Search, Handshake, TrendingUp } as const;

/* ------------------------------------------------------------------ */
/* Um slide, com as marcações dele                                     */
/* ------------------------------------------------------------------ */

const Slide: React.FC<{ n: number; de: number; ate: number }> = ({ n, de, ate }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < de - TRANSICAO || t > ate + TRANSICAO) return null;
  const entra = n === 1 ? 1 : prog(frame, de - TRANSICAO, TRANSICAO, SUAVE);
  const sai = 1 - prog(frame, ate - 0.05, TRANSICAO, SUAVE);
  // zoom lento, só para a imagem não ficar parada (a capa aproxima mais)
  const vida = (t - de) / Math.max(1, ate - de);
  const zoom = n === 1 ? entre(1, 1.06, Math.min(1, Math.max(0, vida))) : entre(1.012, 1, entra) + 0.012 * Math.max(0, vida);
  return (
    <AbsoluteFill style={{ opacity: Math.min(entra, sai), transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}>
      <Img src={staticFile(`aula-02/${SLIDES[n - 1].arquivo}`)} style={{ width: 1920, height: 1080 }} />
      {MARCAS.map((marca, i) => (marca.slide === n ? <UmaMarca key={i} marca={marca} indice={i} /> : null))}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Gancho: o que vem nos próximos módulos                              */
/* ------------------------------------------------------------------ */

const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const fundo = prog(frame, GANCHO - 0.2, 0.6, SAIDA) * (1 - prog(frame, FIM_FALA + 0.2, 0.5, SUAVE));
  if (fundo <= 0) return null;
  const sobe = 1 - prog(frame, GANCHO - 0.1, 0.7, SAIDA);
  return (
    <AbsoluteFill style={{ fontFamily: JOST }}>
      <AbsoluteFill style={{ background: "rgba(13,13,56,0.55)", opacity: fundo }} />
      <div
        style={{
          position: "absolute",
          left: 240,
          right: 240,
          top: "50%",
          transform: `translateY(calc(-50% + ${sobe * 40}px))`,
          borderRadius: 44,
          padding: "70px 84px",
          backgroundImage: `linear-gradient(118deg, ${TRILHA.de}, ${TRILHA.ate})`,
          color: "#fff",
          opacity: fundo,
          boxShadow: "0 40px 90px -30px rgba(13,13,56,0.7)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", width: 560, height: 560, borderRadius: "50%", background: "rgba(255,255,255,0.08)", right: -160, top: -220 }} />
        <p style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.85 }}>
          Vem aí
        </p>
        <h2 style={{ margin: "10px 0 46px", fontSize: 72, lineHeight: 1.05, fontWeight: 600 }}>Nos próximos módulos</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
          {GANCHO_ITENS.map((item) => {
            const p = prog(frame, item.em - 0.1, 0.5, SAIDA);
            const Icone = ICONES[item.icone];
            return (
              <div
                key={item.texto}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "26px 30px",
                  borderRadius: 28,
                  background: "rgba(255,255,255,0.14)",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 24}px)`,
                }}
              >
                <span
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 22,
                    background: "#fff",
                    color: TRILHA.tinta,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icone size={38} strokeWidth={2} />
                </span>
                <span style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.15 }}>{item.texto}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Cartão final                                                        */
/* ------------------------------------------------------------------ */

const CartaoFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, FIM_FALA + 0.3, 0.7, SAIDA);
  if (p <= 0) return null;
  const apaga = prog(frame, DURACAO_AULA2 - 0.7, 0.7, SUAVE);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(118deg, ${TRILHA.de}, ${TRILHA.ate})`,
        color: "#fff",
        fontFamily: JOST,
        opacity: p,
        justifyContent: "center",
        padding: "0 200px",
      }}
    >
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", background: "rgba(255,255,255,0.08)", right: -260, top: -320 }} />
      <p style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.85, transform: `translateY(${(1 - p) * 20}px)` }}>
        Próxima aula
      </p>
      <h2 style={{ margin: "16px 0 0", fontSize: 88, lineHeight: 1.05, fontWeight: 600, maxWidth: 1350, transform: `translateY(${(1 - p) * 30}px)` }}>
        O que vem pela frente: os métodos, a IA e os robôs
      </h2>
      <p style={{ margin: "40px 0 0", fontSize: 30, fontWeight: 500, opacity: 0.85 }}>Trilha Vender sem estoque · Aula 3</p>
      <AbsoluteFill style={{ background: "#000", opacity: apaga }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Sons                                                                */
/* ------------------------------------------------------------------ */

const SONS = [
  ...INICIO_SLIDE.slice(1).map((s) => ({ arquivo: "whoosh", em: s - 0.85, volume: 0.1 })),
  ...MARCAS.filter((m) => m.tipo === "check").map((m) => ({ arquivo: "clique", em: m.em - 0.02, volume: 0.12 })),
  ...GANCHO_ITENS.map((i) => ({ arquivo: "clique", em: i.em - 0.05, volume: 0.12 })),
  { arquivo: "whoosh", em: GANCHO - 0.7, volume: 0.1 },
  { arquivo: "whoosh", em: FIM_FALA - 0.2, volume: 0.1 },
];

/* ------------------------------------------------------------------ */
/* A aula                                                              */
/* ------------------------------------------------------------------ */

export const Aula2: React.FC = () => {
  const frame = useCurrentFrame();
  const abre = 1 - prog(frame, 0, 0.6);
  const fins = [...INICIO_SLIDE.slice(1), FIM_FALA + 1];
  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      {INICIO_SLIDE.map((de, i) => (
        <Slide key={i} n={i + 1} de={de} ate={fins[i]} />
      ))}
      <Gancho />
      <CartaoFinal />
      <Html5Audio src={staticFile("aula-02/voz.mp3")} />
      {SONS.map((s, i) => (
        <Sequence key={i} from={q(Math.max(0, s.em))} durationInFrames={q(2.2)} layout="none">
          <Html5Audio src={staticFile(`sfx/${s.arquivo}.wav`)} volume={s.volume} />
        </Sequence>
      ))}
      <AbsoluteFill style={{ background: "#000", opacity: abre }} />
    </AbsoluteFill>
  );
};
