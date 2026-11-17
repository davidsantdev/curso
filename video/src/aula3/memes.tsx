/**
 * Memes e "adesivos" da aula 3. Tudo é original: emoji (Noto Color Emoji, licença livre), letra de meme (Anton) e
 * desenhos em código. Nenhuma imagem de meme da internet: elas têm direito autoral e, muitas vezes, rosto de gente
 * real, o que não pode entrar num curso pago nem num anúncio.
 */
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont as carregarAnton } from "@remotion/google-fonts/Anton";
import { loadFont as carregarEmoji } from "@remotion/google-fonts/NotoColorEmoji";
import { prog, SAIDA, SUAVE } from "../lib/anim";
import { FPS } from "../lib/tempo";
import { COR, DEGRADE_FORTE, FONTE } from "../tema";

export const EMOJI = `${carregarEmoji().fontFamily}, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
export const MEME = carregarAnton("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] }).fontFamily;

/** Mola com um pouco de passagem do ponto (a "batida" dos adesivos). */
const mola = Easing.bezier(0.34, 1.56, 0.64, 1);

/** Contorno preto grosso da letra de meme, feito com sombras (funciona em qualquer navegador). */
export const contorno = (px: number, cor = "#000") =>
  Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `${(Math.cos(a) * px).toFixed(1)}px ${(Math.sin(a) * px).toFixed(1)}px 0 ${cor}`;
  }).join(", ");

/** Entrada e saída de um adesivo: bate grande, assenta, e some rápido. */
function useBatida(em: number, ate: number) {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const visivel = t >= em - 0.02 && t <= ate + 0.25;
  const entra = prog(frame, em, 0.32, mola);
  const sai = prog(frame, ate, 0.22, SUAVE);
  return { frame, t, visivel, entra, sai };
}

export const Emoji: React.FC<{ children: string; tamanho: number; style?: React.CSSProperties }> = ({
  children,
  tamanho,
  style,
}) => (
  <span style={{ fontFamily: EMOJI, fontSize: tamanho, lineHeight: 1, display: "inline-block", ...style }}>{children}</span>
);

/* ------------------------------------------------------------------ */
/* Adesivo: emoji grande, com legenda opcional                         */
/* ------------------------------------------------------------------ */

export const Adesivo: React.FC<{
  em: number;
  ate: number;
  emoji: string;
  x: number;
  y: number;
  tamanho?: number;
  giro?: number;
  legenda?: string;
  balanco?: boolean;
}> = ({ em, ate, emoji, x, y, tamanho = 260, giro = -8, legenda, balanco = true }) => {
  const { t, visivel, entra, sai } = useBatida(em, ate);
  if (!visivel) return null;
  const escala = (0.2 + 0.8 * entra) * (1 - 0.35 * sai);
  const oscila = balanco ? Math.sin((t - em) * 5) * 3 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${(giro + oscila).toFixed(2)}deg) scale(${escala.toFixed(4)})`,
        opacity: Math.min(1, entra * 3) * (1 - sai),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))",
      }}
    >
      <Emoji tamanho={tamanho}>{emoji}</Emoji>
      {legenda ? (
        <div
          style={{
            marginTop: -tamanho * 0.08,
            padding: "10px 26px 6px",
            background: "#ffffff",
            color: "#0b0b14",
            borderRadius: 14,
            fontFamily: MEME,
            fontSize: Math.max(40, tamanho * 0.2),
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            transform: "rotate(4deg)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
            whiteSpace: "nowrap",
          }}
        >
          {legenda}
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Letra de meme (branca, contorno preto, maiúscula)                   */
/* ------------------------------------------------------------------ */

export const TextoMeme: React.FC<{
  em: number;
  ate: number;
  texto: string;
  x?: number;
  y: number;
  tamanho?: number;
  giro?: number;
  cor?: string;
}> = ({ em, ate, texto, x = 960, y, tamanho = 150, giro = 0, cor = "#ffffff" }) => {
  const { t, visivel, entra, sai } = useBatida(em, ate);
  if (!visivel) return null;
  const tremor = t - em < 0.25 ? Math.sin(t * 90) * 6 * (1 - (t - em) / 0.25) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x + tremor,
        top: y,
        transform: `translate(-50%, -50%) rotate(${giro}deg) scale(${((1.6 - 0.6 * entra) * (1 - 0.2 * sai)).toFixed(4)})`,
        opacity: Math.min(1, entra * 4) * (1 - sai),
        fontFamily: MEME,
        fontSize: tamanho,
        lineHeight: 1,
        letterSpacing: "0.01em",
        textTransform: "uppercase",
        color: cor,
        textShadow: `${contorno(tamanho * 0.055)}, 0 ${tamanho * 0.12}px ${tamanho * 0.2}px rgba(0,0,0,0.5)`,
        whiteSpace: "nowrap",
        textAlign: "center",
      }}
    >
      {texto}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Carimbo                                                             */
/* ------------------------------------------------------------------ */

export const Carimbo: React.FC<{ em: number; ate: number; texto: string; x: number; y: number; cor?: string; giro?: number; tamanho?: number }> = ({
  em,
  ate,
  texto,
  x,
  y,
  cor = "#FF4D6D",
  giro = -12,
  tamanho = 130,
}) => {
  const { visivel, frame, sai } = useBatida(em, ate);
  if (!visivel) return null;
  const bate = prog(frame, em, 0.18, Easing.in(Easing.cubic));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${giro}deg) scale(${(2.4 - 1.4 * bate).toFixed(4)})`,
        opacity: Math.min(1, bate * 2) * (1 - sai),
        padding: "10px 38px 4px",
        border: `${tamanho * 0.07}px solid ${cor}`,
        borderRadius: 18,
        color: cor,
        fontFamily: MEME,
        fontSize: tamanho,
        lineHeight: 1,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        mixBlendMode: "screen",
        textShadow: `0 0 24px ${cor}55`,
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Chuva de emoji (dinheiro, foguinho...)                              */
/* ------------------------------------------------------------------ */

const aleatorio = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const Chuva: React.FC<{ em: number; ate: number; emojis: string[]; quantidade?: number; subindo?: boolean }> = ({
  em,
  ate,
  emojis,
  quantidade = 26,
  subindo = false,
}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < em || t > ate + 1.2) return null;
  const some = 1 - prog(frame, ate, 0.6, SUAVE);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: some }}>
      {Array.from({ length: quantidade }, (_, i) => {
        const atraso = aleatorio(i) * 0.9;
        const vida = t - em - atraso;
        if (vida < 0) return null;
        const velocidade = 520 + aleatorio(i + 50) * 520;
        const x = 80 + aleatorio(i + 100) * 1760 + Math.sin(vida * 2 + i) * 40;
        const y = subindo ? 1180 - vida * velocidade : -140 + vida * velocidade;
        const tamanho = 70 + aleatorio(i + 200) * 80;
        return (
          <Emoji
            key={i}
            tamanho={tamanho}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `rotate(${(vida * (aleatorio(i + 300) - 0.5) * 400).toFixed(1)}deg)`,
              filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.45))",
            }}
          >
            {emojis[i % emojis.length]}
          </Emoji>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* "Carregando cérebro..."                                             */
/* ------------------------------------------------------------------ */

export const Carregando: React.FC<{ em: number; travaEm: number; ate: number }> = ({ em, travaEm, ate }) => {
  const { frame, visivel, entra, sai } = useBatida(em, ate);
  if (!visivel) return null;
  const enche = interpolate(frame, [em * FPS, travaEm * FPS], [0, 99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const travado = frame / FPS >= travaEm;
  const pisca = travado ? (Math.floor(frame / 6) % 2 === 0 ? 1 : 0.45) : 1;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: Math.min(1, entra * 2) * (1 - sai) }}>
      <div
        style={{
          width: 1080,
          padding: "44px 54px 50px",
          borderRadius: 30,
          background: "rgba(14,14,24,0.92)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 50px 120px -30px rgba(0,0,0,0.8)",
          transform: `scale(${(0.9 + 0.1 * entra).toFixed(4)})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: FONTE.sans, color: COR.texto }}>
          <Emoji tamanho={92}>{travado ? "🤯" : "🧠"}</Emoji>
          <div>
            <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-0.02em" }}>Processando informação…</div>
            <div style={{ fontFamily: FONTE.mono, fontSize: 22, color: COR.apagado, marginTop: 6, letterSpacing: "0.08em" }}>
              métodos · loja · pagamentos · anúncios · marketplaces
            </div>
          </div>
        </div>
        <div style={{ marginTop: 34, height: 30, borderRadius: 30, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ width: `${enche}%`, height: "100%", borderRadius: 30, backgroundImage: DEGRADE_FORTE, opacity: pisca }} />
        </div>
        <div
          style={{
            marginTop: 16,
            textAlign: "right",
            fontFamily: FONTE.mono,
            fontSize: 30,
            color: travado ? COR.vermelho : COR.suave,
            fontVariantNumeric: "tabular-nums",
            opacity: pisca,
          }}
        >
          {Math.round(enche)}%
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Óculos pixelados que caem                                           */
/* ------------------------------------------------------------------ */

const OCULOS = [
  "XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "XWWXXXXXXXXXXXXXXWWXXXXXXXXX",
  "XXWWXXXXXXXX..XXXXWWXXXXXXX.",
  ".XXXXXXXXXX....XXXXXXXXXXX..",
  "..XXXXXXXX......XXXXXXXXX...",
];

export const OculosPixel: React.FC<{ em: number; ate: number; x: number; y: number; largura?: number }> = ({
  em,
  ate,
  x,
  y,
  largura = 420,
}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < em - 0.8 || t > ate + 0.3) return null;
  const desce = prog(frame, em - 0.8, 0.8, Easing.out(Easing.bounce));
  const sai = prog(frame, ate, 0.25);
  const px = largura / OCULOS[0].length;
  return (
    <div
      style={{
        position: "absolute",
        left: x - largura / 2,
        top: y - 500 * (1 - desce),
        width: largura,
        height: px * OCULOS.length,
        opacity: 1 - sai,
        filter: "drop-shadow(0 18px 20px rgba(0,0,0,0.5))",
      }}
    >
      {OCULOS.flatMap((linha, r) =>
        [...linha].map((c, k) =>
          c === "." ? null : (
            <div
              key={`${r}-${k}`}
              style={{ position: "absolute", left: k * px, top: r * px, width: px + 0.5, height: px + 0.5, background: c === "W" ? "#ffffff" : "#000000" }}
            />
          ),
        ),
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Notificação de celular                                              */
/* ------------------------------------------------------------------ */

export const Notificacao: React.FC<{
  em: number;
  ate: number;
  icone: string;
  titulo: string;
  texto: string;
  x?: number;
  y?: number;
  largura?: number;
}> = ({ em, ate, icone, titulo, texto, x = 960, y = 170, largura = 820 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < em - 0.05 || t > ate + 0.4) return null;
  const desce = prog(frame, em, 0.55, SAIDA);
  const sobe = prog(frame, ate, 0.35, SUAVE);
  return (
    <div
      style={{
        position: "absolute",
        left: x - largura / 2,
        top: y - 160 * (1 - desce) - 120 * sobe,
        width: largura,
        opacity: desce * (1 - sobe),
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "24px 28px",
        borderRadius: 34,
        background: "rgba(245,245,250,0.94)",
        boxShadow: "0 30px 70px -20px rgba(0,0,0,0.7)",
        fontFamily: FONTE.sans,
      }}
    >
      <div style={{ width: 84, height: 84, borderRadius: 22, backgroundImage: DEGRADE_FORTE, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Emoji tamanho={50}>{icone}</Emoji>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
          <span style={{ fontSize: 30, fontWeight: 700, color: "#111", letterSpacing: "-0.01em" }}>{titulo}</span>
          <span style={{ fontSize: 22, color: "#888" }}>agora</span>
        </div>
        <div style={{ fontSize: 28, color: "#333", marginTop: 4, fontFamily: `${FONTE.sans}, ${EMOJI}` }}>{texto}</div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Balão de conversa                                                   */
/* ------------------------------------------------------------------ */

export const Balao: React.FC<{ em: number; texto: string; lado: "esquerda" | "direita"; nome?: string }> = ({
  em,
  texto,
  lado,
  nome,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, em, 0.45, mola);
  const meu = lado === "direita";
  return (
    <div
      style={{
        alignSelf: meu ? "flex-end" : "flex-start",
        maxWidth: 820,
        opacity: Math.min(1, p * 2),
        transform: `translateY(${((1 - p) * 30).toFixed(2)}px) scale(${(0.85 + 0.15 * p).toFixed(4)})`,
        transformOrigin: meu ? "right bottom" : "left bottom",
      }}
    >
      {nome ? (
        <div style={{ fontFamily: FONTE.mono, fontSize: 20, color: COR.apagado, letterSpacing: "0.1em", textTransform: "uppercase", margin: meu ? "0 12px 8px 0" : "0 0 8px 12px", textAlign: meu ? "right" : "left" }}>
          {nome}
        </div>
      ) : null}
      <div
        style={{
          padding: "22px 30px",
          borderRadius: 30,
          borderBottomRightRadius: meu ? 8 : 30,
          borderBottomLeftRadius: meu ? 30 : 8,
          background: meu ? DEGRADE_FORTE : "rgba(255,255,255,0.1)",
          border: meu ? "none" : "1px solid rgba(255,255,255,0.12)",
          color: "#fff",
          fontFamily: `${FONTE.sans}, ${EMOJI}`,
          fontSize: 38,
          lineHeight: 1.25,
          letterSpacing: "-0.01em",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Batida de câmera (zoom rápido e tremida) para o vídeo inteiro       */
/* ------------------------------------------------------------------ */

export function camera(frame: number, batidas: { em: number; forca: number }[]) {
  const t = frame / FPS;
  let escala = 1;
  let dx = 0;
  let dy = 0;
  for (const b of batidas) {
    const d = t - b.em;
    if (d < -0.02 || d > 0.6) continue;
    const pico = d < 0.06 ? d / 0.06 : Math.exp(-(d - 0.06) / 0.16);
    escala += 0.07 * b.forca * pico;
    dx += Math.sin(d * 85) * 14 * b.forca * pico;
    dy += Math.cos(d * 70) * 10 * b.forca * pico;
  }
  return `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${escala.toFixed(4)})`;
}

/** Clarão branco rápido (corte seco entre um meme e a cena). */
export const Clarao: React.FC<{ em: number; forca?: number }> = ({ em, forca = 0.5 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const d = t - em;
  if (d < 0 || d > 0.35) return null;
  return <AbsoluteFill style={{ background: "#ffffff", opacity: forca * Math.exp(-d / 0.08), pointerEvents: "none" }} />;
};

/** Escurece o fundo enquanto um meme ocupa a tela. */
export const Escurecer: React.FC<{ em: number; ate: number; forca?: number }> = ({ em, ate, forca = 0.62 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < em || t > ate + 0.3) return null;
  const o = prog(frame, em, 0.12) * (1 - prog(frame, ate, 0.25));
  return <AbsoluteFill style={{ background: `rgba(4,4,10,${(forca * o).toFixed(3)})`, pointerEvents: "none" }} />;
};
