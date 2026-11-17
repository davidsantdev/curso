/** Aula 3, segunda metade: programação do jeito fácil, a IA, os robôs e o fechamento. */
import {
  AppWindow,
  BadgeCheck,
  Bell,
  Bot,
  Check,
  Megaphone,
  MessageSquare,
  MousePointerClick,
  Package,
  Store,
  Tag,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cena, Contador, Destaque, Etiqueta, Fala, IconeCaixa, Palco, Revela, Riscado, Rotulo, Vidro } from "../componentes/base";
import { CenaCapitulo } from "../componentes/graficos";
import { prog, SAIDA, SUAVE } from "../lib/anim";
import { FPS } from "../lib/tempo";
import { COR, DEGRADE_FORTE, FONTE } from "../tema";
import { Adesivo, Carimbo, Chuva, Emoji, OculosPixel, TextoMeme } from "./memes";
import { em, fimDe, FIM_DA_FALA, T } from "./tempo";

/* ------------------------------------------------------------------ */
/* Capítulo 2: programação                                             */
/* ------------------------------------------------------------------ */

export const Cap2: React.FC = () => (
  <>
    <CenaCapitulo
      numero="02"
      titulo="Programação, do jeito fácil"
      de={T.cap2}
      ate={T.codigo}
      extra={
        <Revela em={T.cap2 + 0.8} y={10}>
          <Etiqueta>A parte que eu mais gosto</Etiqueta>
        </Revela>
      }
    />
    <Adesivo em={em("a parte que eu mais gosto") + 0.4} ate={T.codigo - 0.1} emoji="❤️" x={1640} y={300} tamanho={170} giro={12} />
  </>
);

const CODIGO: { cor: string; texto: string }[][] = [
  [{ cor: "#8C9BFF", texto: '<section class="oferta">' }],
  [{ cor: "#8C9BFF", texto: "  <h1>" }, { cor: "#F6F5FB", texto: "Garrafa térmica" }, { cor: "#8C9BFF", texto: "</h1>" }],
  [{ cor: "#8C9BFF", texto: "  <p>" }, { cor: "#F6F5FB", texto: "Gelada por 24 horas" }, { cor: "#8C9BFF", texto: "</p>" }],
  [{ cor: "#8C9BFF", texto: "  <button " }, { cor: "#F4A6DE", texto: "onclick" }, { cor: "#F6F5FB", texto: "=" }, { cor: "#5EE3A1", texto: '"comprar()"' }, { cor: "#8C9BFF", texto: ">" }],
  [{ cor: "#F6F5FB", texto: "    Comprar agora" }],
  [{ cor: "#8C9BFF", texto: "  </button>" }],
  [{ cor: "#8C9BFF", texto: "</section>" }],
];

/** Editor de código que se escreve sozinho. */
const Editor: React.FC<{ de: number; x: number; y: number; largura: number }> = ({ de, x, y, largura }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let restante = Math.max(0, (t - de) * 32);
  return (
    <Vidro style={{ position: "absolute", left: x, top: y, width: largura, padding: "0 0 34px", overflow: "hidden" }}>
      <div style={{ height: 56, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {["#FF7A93", "#FFD36B", "#5EE3A1"].map((c) => (
          <span key={c} style={{ width: 14, height: 14, borderRadius: 14, background: c, opacity: 0.85 }} />
        ))}
        <span style={{ marginLeft: 14, fontFamily: FONTE.mono, fontSize: 19, color: COR.apagado }}>pagina.html</span>
      </div>
      <div style={{ padding: "26px 34px 0", fontFamily: FONTE.mono, fontSize: 30, lineHeight: 1.6, whiteSpace: "pre" }}>
        {CODIGO.map((linha, i) => (
          <div key={i} style={{ display: "flex" }}>
            <span style={{ width: 46, color: COR.fraco }}>{i + 1}</span>
            {linha.map((pedaco, k) => {
              const mostra = Math.min(pedaco.texto.length, Math.floor(restante));
              restante -= pedaco.texto.length;
              return mostra > 0 ? (
                <span key={k} style={{ color: pedaco.cor }}>
                  {pedaco.texto.slice(0, mostra)}
                </span>
              ) : null;
            })}
            {restante <= 0 && restante > -40 ? (
              <span style={{ width: 14, background: Math.floor(frame / 15) % 2 ? "transparent" : COR.texto, marginLeft: 2 }} />
            ) : null}
          </div>
        ))}
      </div>
    </Vidro>
  );
};

export const Codigo: React.FC = () => {
  const tMesmo = em("Isso mesmo programação");
  return (
    <Cena de={T.codigo} ate={T.facil} zoom={0.04}>
      <AbsoluteFill style={{ padding: "190px 170px" }}>
        <Rotulo em={T.codigo + 0.1}>Isso mesmo</Rotulo>
        <Fala texto="A gente vai aprender" frase="a gente vai aprender" tamanho={72} peso={500} cor={COR.suave} style={{ marginTop: 28 }} />
        <Fala texto="*programação*." frase="programação" depois={T.codigo} tamanho={150} />
      </AbsoluteFill>
      <Editor de={T.codigo + 0.4} x={1090} y={300} largura={720} />
      <TextoMeme em={tMesmo} ate={T.facil} texto="Isso mesmo." x={700} y={860} tamanho={140} giro={-5} cor="#FFE45C" />
    </Cena>
  );
};

export const Facil: React.FC = () => (
  <Cena de={T.facil} ate={T.antesProg} zoom={0.05}>
    <Palco centro>
      <Fala texto="Só que do *jeito fácil*." frase="Só que do jeito fácil" tamanho={150} alinhar="center" />
    </Palco>
    <Adesivo em={em("jeito fácil")} ate={T.antesProg} emoji="✨" x={1620} y={300} tamanho={180} giro={10} legenda="fácil" />
  </Cena>
);

const ANTES: { icone: LucideIcon; texto: string; frase: string }[] = [
  { icone: AppWindow, texto: "Criar um site", frase: "criar um site" },
  { icone: Store, texto: "Ajustar uma loja", frase: "ajustar uma loja" },
  { icone: Workflow, texto: "Ligar uma ferramenta na outra", frase: "ligar uma ferramenta" },
];

export const AntesProg: React.FC = () => {
  const tCaro = em("custa caro");
  return (
    <Cena de={T.antesProg} ate={T.ia} zoom={0.03}>
      <AbsoluteFill style={{ padding: "120px 170px" }}>
        <Rotulo em={T.antesProg + 0.1}>Antes</Rotulo>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 40 }}>
          {ANTES.map((a) => (
            <Revela key={a.texto} em={em(a.frase, T.antesProg) - 0.1} y={20}>
              <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
                <IconeCaixa icone={a.icone} tamanho={92} />
                <span style={{ fontFamily: FONTE.sans, fontSize: 56, fontWeight: 500, letterSpacing: "-0.02em", color: COR.texto }}>{a.texto}</span>
              </div>
            </Revela>
          ))}
        </div>
        <Fala
          texto="você precisava de um *programador*."
          frase="você precisava de um programador"
          depois={T.antesProg}
          tamanho={84}
          style={{ marginTop: 70 }}
        />
      </AbsoluteFill>
      <Carimbo em={tCaro} ate={T.ia} texto="Caro" x={1500} y={430} tamanho={170} />
      <Chuva em={tCaro + 0.1} ate={T.ia - 0.2} emojis={["💸", "💸", "😭"]} quantidade={18} subindo />
    </Cena>
  );
};

/** Conversa com a IA: o pedido em português e a página pronta. */
export const IA: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const tIA = em("inteligência artificial");
  const tFaz = em("faz boa parte desse trabalho");
  const pedido = "Cria uma página pra vender garrafa térmica, com botão de comprar.";
  const letras = Math.max(0, Math.min(pedido.length, Math.floor((t - tIA) * 34)));
  const montar = (k: number) => prog(frame, tFaz + 0.25 + k * 0.28, 0.45, SAIDA);
  return (
    <Cena de={T.ia} ate={T.melhor} zoom={0.03}>
      <AbsoluteFill style={{ padding: "120px 170px" }}>
        <Fala texto="Hoje, a *inteligência artificial*" frase="Hoje a inteligência artificial" tamanho={86} />
        <Fala texto="faz boa parte desse trabalho." frase="faz boa parte desse trabalho" tamanho={54} peso={400} cor={COR.suave} style={{ marginTop: 14 }} />
      </AbsoluteFill>
      <Revela em={tIA - 0.2} y={40} style={{ position: "absolute", left: 170, top: 420 }}>
        <Vidro style={{ width: 1580, height: 530, padding: 40, display: "flex", gap: 40 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                alignSelf: "flex-end",
                maxWidth: 680,
                padding: "22px 28px",
                borderRadius: 26,
                borderBottomRightRadius: 8,
                background: "rgba(255,255,255,0.1)",
                fontFamily: FONTE.sans,
                fontSize: 34,
                lineHeight: 1.3,
                color: COR.texto,
                minHeight: 60,
              }}
            >
              {pedido.slice(0, letras)}
              {letras < pedido.length ? <span style={{ opacity: Math.floor(frame / 12) % 2 }}>|</span> : null}
            </div>
            <Revela em={tFaz} y={20}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: FONTE.sans, fontSize: 34, color: COR.texto }}>
                <Emoji tamanho={46}>✨</Emoji>
                Pronto! Montei a sua página:
              </div>
            </Revela>
          </div>
          <div style={{ width: 560, borderRadius: 24, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: 26, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ height: 140, borderRadius: 18, backgroundImage: DEGRADE_FORTE, opacity: montar(0), display: "grid", placeItems: "center" }}>
              <Emoji tamanho={84}>🧴</Emoji>
            </div>
            <div style={{ opacity: montar(1), fontFamily: FONTE.sans, fontWeight: 600, fontSize: 40, color: COR.texto, letterSpacing: "-0.02em" }}>
              Garrafa térmica
            </div>
            <div style={{ opacity: montar(2), height: 18, width: "70%", borderRadius: 18, background: "rgba(255,255,255,0.12)" }} />
            <div
              style={{
                opacity: montar(3),
                marginTop: 8,
                height: 70,
                borderRadius: 18,
                background: "#ffffff",
                color: "#3a2fd0",
                display: "grid",
                placeItems: "center",
                fontFamily: FONTE.sans,
                fontWeight: 700,
                fontSize: 30,
              }}
            >
              Comprar agora
            </div>
          </div>
        </Vidro>
      </Revela>
    </Cena>
  );
};

export const Melhor: React.FC = () => {
  const frame = useCurrentFrame();
  const tMelhor = em("a melhor IA do mercado");
  const brilho = prog(frame, tMelhor, 1.2);
  return (
    <Cena de={T.melhor} ate={T.ensinar} zoom={0.05}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(50% 50% at 50% 50%, rgba(255,211,107,0.28), rgba(255,211,107,0) 70%)",
          opacity: brilho,
        }}
      />
      <Palco centro>
        <Rotulo em={T.melhor + 0.1}>Aqui dentro</Rotulo>
        <Fala texto="a *melhor IA* do mercado." frase="a melhor IA do mercado" tamanho={140} alinhar="center" style={{ marginTop: 30 }} />
      </Palco>
      <Adesivo em={tMelhor + 0.25} ate={T.ensinar} emoji="🏆" x={1570} y={330} tamanho={240} giro={10} />
      <Adesivo em={tMelhor + 0.45} ate={T.ensinar} emoji="👑" x={360} y={320} tamanho={150} giro={-16} />
    </Cena>
  );
};

const ENSINO: { icone: LucideIcon; titulo: string; texto: string; frase: string }[] = [
  { icone: MousePointerClick, titulo: "Como usar", texto: "o passo a passo da ferramenta", frase: "como usar" },
  { icone: MessageSquare, titulo: "Como pedir", texto: "em português, do jeito certo", frase: "como pedir as coisas" },
  { icone: BadgeCheck, titulo: "Como conferir", texto: "se o que ela entregou funciona", frase: "pra conferir" },
];

export const Ensinar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Cena de={T.ensinar} ate={T.claro} zoom={0.025}>
      <AbsoluteFill style={{ padding: "130px 170px" }}>
        <Rotulo em={T.ensinar + 0.1}>Eu vou te ensinar</Rotulo>
        <div style={{ display: "flex", gap: 40, marginTop: 70 }}>
          {ENSINO.map((e, i) => {
            const tE = em(e.frase, T.ensinar);
            const ok = prog(frame, tE + 0.5, 0.35);
            return (
              <Revela key={e.titulo} em={tE - 0.1} y={40}>
                <Vidro ativo={ok * 0.8} style={{ width: 500, padding: "42px 40px 46px", minHeight: 420 }}>
                  <IconeCaixa icone={e.icone} tamanho={104} destaque />
                  <div style={{ marginTop: 34, fontFamily: FONTE.sans, fontSize: 54, fontWeight: 600, letterSpacing: "-0.03em", color: COR.texto }}>{e.titulo}</div>
                  <div style={{ marginTop: 14, fontFamily: FONTE.sans, fontSize: 32, color: COR.suave, lineHeight: 1.3 }}>{e.texto}</div>
                  <div style={{ position: "absolute", top: 36, right: 36, width: 56, height: 56, borderRadius: 56, background: "#5EE3A1", display: "grid", placeItems: "center", opacity: ok, transform: `scale(${(0.6 + 0.4 * ok).toFixed(3)})` }}>
                    <Check size={32} color="#07070B" strokeWidth={3} />
                  </div>
                </Vidro>
              </Revela>
            );
          })}
        </div>
      </AbsoluteFill>
    </Cena>
  );
};

export const Claro: React.FC = () => {
  const tVirar = em("não precisa virar programador");
  const tProg = em("programador", tVirar);
  return (
    <Cena de={T.claro} ate={T.resto} zoom={0.03}>
      <Palco>
        <Rotulo em={T.claro + 0.1}>Que fique claro</Rotulo>
        <div style={{ display: "flex", alignItems: "baseline", gap: 30, marginTop: 34, flexWrap: "wrap" }}>
          <Fala texto="Você não precisa virar" frase="você não precisa virar" depois={T.claro} tamanho={96} />
          <Revela em={tProg - 0.05} y={20}>
            <span style={{ fontFamily: FONTE.sans, fontWeight: 600, fontSize: 96, letterSpacing: "-0.035em", color: COR.texto }}>
              <Riscado em={tProg + 0.45}>programador</Riscado>
            </span>
          </Revela>
        </div>
        <div style={{ display: "flex", gap: 30, marginTop: 70 }}>
          {["saber pedir", "saber conferir"].map((p) => (
            <Revela key={p} em={em(p, T.claro) - 0.08} y={20} escala={0.8}>
              <div
                style={{
                  padding: "26px 46px",
                  borderRadius: 999,
                  backgroundImage: DEGRADE_FORTE,
                  fontFamily: FONTE.sans,
                  fontWeight: 600,
                  fontSize: 56,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  boxShadow: "0 20px 50px -14px rgba(125,114,248,0.7)",
                }}
              >
                {p}
              </div>
            </Revela>
          ))}
        </div>
      </Palco>
      <Adesivo em={tVirar + 0.6} ate={em("saber pedir", T.claro) - 0.2} emoji="😮‍💨" x={1600} y={340} tamanho={200} giro={10} legenda="ufa" />
    </Cena>
  );
};

export const Resto: React.FC = () => {
  const tFaz = em("a IA faz", T.resto);
  return (
    <Cena de={T.resto} ate={T.cap3} zoom={0.04}>
      <Palco centro>
        <div style={{ position: "relative", marginTop: -60 }}>
          <IconeCaixa icone={Bot} tamanho={300} destaque />
          <OculosPixel em={tFaz + 0.35} ate={T.cap3} x={150} y={140} largura={160} />
        </div>
      </Palco>
      <TextoMeme em={tFaz} ate={T.cap3} texto="O resto, a IA faz" y={880} tamanho={130} />
    </Cena>
  );
};

/* ------------------------------------------------------------------ */
/* Capítulo 3: robôs                                                   */
/* ------------------------------------------------------------------ */

export const Cap3: React.FC = () => (
  <CenaCapitulo
    numero="03"
    titulo="Robôs trabalhando por você"
    de={T.cap3}
    ate={T.filme}
    extra={
      <Revela em={T.cap3 + 0.8} y={10}>
        <Etiqueta>O melhor de tudo</Etiqueta>
      </Revela>
    }
  />
);

/** O robô vilão de filme (genérico), com olhos vermelhos. */
const RoboVilao: React.FC<{ de: number }> = ({ de }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const p = prog(frame, de, 1.4, SUAVE);
  const pisca = 0.75 + 0.25 * Math.abs(Math.sin(t * 9));
  return (
    <svg width={900} height={900} viewBox="0 0 900 900" style={{ position: "absolute", left: 510, top: 120, transform: `scale(${(0.9 + 0.12 * p).toFixed(4)})`, opacity: p }}>
      <defs>
        <radialGradient id="a3-olho" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd1da" />
          <stop offset="0.35" stopColor="#ff2d55" />
          <stop offset="1" stopColor="rgba(255,45,85,0)" />
        </radialGradient>
        <linearGradient id="a3-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a4a" />
          <stop offset="1" stopColor="#101018" />
        </linearGradient>
      </defs>
      <line x1="450" y1="150" x2="450" y2="70" stroke="#3a3a4a" strokeWidth="14" />
      <circle cx="450" cy="60" r="20" fill="#ff2d55" opacity={pisca} />
      <rect x="210" y="150" width="480" height="420" rx="70" fill="url(#a3-metal)" stroke="#4a4a5c" strokeWidth="6" />
      <rect x="260" y="250" width="380" height="130" rx="40" fill="#07070b" />
      <circle cx="350" cy="315" r="70" fill="url(#a3-olho)" opacity={pisca} />
      <circle cx="550" cy="315" r="70" fill="url(#a3-olho)" opacity={pisca} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={300 + i * 52} y="450" width="30" height="70" rx="8" fill="#22222e" />
      ))}
      <rect x="300" y="590" width="300" height="40" rx="14" fill="#1a1a24" />
    </svg>
  );
};

export const Filme: React.FC = () => {
  const frame = useCurrentFrame();
  const tNao = fimDe("aquele de filme") + 0.25;
  const vermelho = prog(frame, T.filme, 0.6) * (1 - prog(frame, T.regra - 0.3, 0.3));
  return (
    <Cena de={T.filme} ate={T.regra} zoom={0.06}>
      <AbsoluteFill style={{ background: "radial-gradient(60% 60% at 50% 45%, rgba(255,45,85,0.28), rgba(0,0,0,0) 70%)", opacity: vermelho }} />
      <RoboVilao de={T.filme} />
      <AbsoluteFill style={{ padding: "110px 170px" }}>
        <Fala texto="Não é aquele de *filme*" frase="não é aquele de filme" depois={T.filme} tamanho={78} />
      </AbsoluteFill>
      <Carimbo em={tNao} ate={T.regra} texto="Não é esse" x={960} y={900} tamanho={120} giro={-6} />
    </Cena>
  );
};

export const Regra: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const tQuando = em("quando acontecer isso");
  const tFaca = em("faça aquilo");
  const seta = prog(frame, tFaca - 0.3, 0.5, SUAVE);
  return (
    <Cena de={T.regra} ate={T.exemplos} zoom={0.03}>
      <AbsoluteFill style={{ padding: "120px 170px" }}>
        <Fala texto="Uma regra que o computador *executa sozinho*" frase="uma regra que o computador executa sozinho" tamanho={78} largura={1500} />
        <div style={{ display: "flex", alignItems: "center", gap: 50, marginTop: 110 }}>
          <Revela em={tQuando - 0.1} y={30}>
            <Vidro ativo={0.5} style={{ width: 620, padding: "40px 44px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <IconeCaixa icone={Bell} tamanho={84} />
                <span style={{ fontFamily: FONTE.mono, fontSize: 28, letterSpacing: "0.16em", color: COR.suave }}>QUANDO</span>
              </div>
              <div style={{ marginTop: 26, fontFamily: FONTE.sans, fontSize: 58, fontWeight: 600, letterSpacing: "-0.03em", color: COR.texto }}>acontecer isso</div>
            </Vidro>
          </Revela>
          <div style={{ width: 150, height: 8, borderRadius: 8, backgroundImage: DEGRADE_FORTE, transform: `scaleX(${seta.toFixed(3)})`, transformOrigin: "left" }} />
          <Revela em={tFaca - 0.1} y={30}>
            <Vidro ativo={0.9} style={{ width: 620, padding: "40px 44px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <IconeCaixa icone={Zap} tamanho={84} destaque />
                <span style={{ fontFamily: FONTE.mono, fontSize: 28, letterSpacing: "0.16em", color: COR.suave }}>FAÇA</span>
              </div>
              <div style={{ marginTop: 26, fontFamily: FONTE.sans, fontSize: 58, fontWeight: 600, letterSpacing: "-0.03em", color: COR.texto }}>aquilo</div>
            </Vidro>
          </Revela>
        </div>
      </AbsoluteFill>
      <Revela em={T.regra + 0.4} style={{ position: "absolute", left: 1610, top: 160 }}>
        <Emoji tamanho={150} style={{ transform: `rotate(${(t * 70).toFixed(1)}deg)` }}>
          ⚙️
        </Emoji>
      </Revela>
    </Cena>
  );
};

/** Os três exemplos de robô, cada um em uma coluna. */
const Coluna: React.FC<{ pergunta: string; tPergunta: number; tRobo: number; icone: string; resposta: string; detalhe: string }> = ({
  pergunta,
  tPergunta,
  tRobo,
  icone,
  resposta,
  detalhe,
}) => {
  const frame = useCurrentFrame();
  const feito = prog(frame, tRobo, 0.45, SAIDA);
  return (
    <Revela em={tPergunta - 0.1} y={40}>
      <Vidro ativo={feito * 0.8} style={{ width: 500, minHeight: 560, padding: "38px 38px 40px", display: "flex", flexDirection: "column" }}>
        <Emoji tamanho={92}>{icone}</Emoji>
        <div style={{ marginTop: 26, fontFamily: FONTE.sans, fontSize: 46, fontWeight: 600, letterSpacing: "-0.03em", color: COR.texto, lineHeight: 1.1 }}>{pergunta}</div>
        <div
          style={{
            marginTop: "auto",
            opacity: feito,
            transform: `translateY(${((1 - feito) * 30).toFixed(2)}px)`,
            padding: "22px 24px",
            borderRadius: 22,
            background: "rgba(94,227,161,0.12)",
            border: "1px solid rgba(94,227,161,0.35)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONTE.sans, fontSize: 32, fontWeight: 600, color: "#5EE3A1" }}>
            <Emoji tamanho={40}>🤖</Emoji>
            {resposta}
          </div>
          <div style={{ marginTop: 10, fontFamily: FONTE.sans, fontSize: 26, color: COR.suave }}>{detalhe}</div>
        </div>
      </Vidro>
    </Revela>
  );
};

export const Exemplos: React.FC = () => {
  const p1 = em("Chegou um pedido");
  const r1 = em("O robô manda pro fornecedor");
  const p2 = em("O produto saiu pra entrega");
  const r2 = em("O robô avisa o cliente");
  const p3 = em("Alguém esqueceu o carrinho");
  const r3 = em("O robô lembra a pessoa");
  return (
    <Cena de={T.exemplos} ate={T.estrategias} zoom={0.025}>
      <AbsoluteFill style={{ padding: "150px 170px", flexDirection: "row", gap: 40, alignItems: "flex-start" }}>
        <Coluna pergunta="Chegou um pedido?" tPergunta={p1} tRobo={r1} icone="🛒" resposta="Manda pro fornecedor" detalhe="pedido enviado em segundos" />
        <Coluna pergunta="Saiu pra entrega?" tPergunta={p2} tRobo={r2} icone="🚚" resposta="Avisa o cliente" detalhe="“Seu pedido está a caminho!”" />
        <Coluna pergunta="Esqueceu o carrinho?" tPergunta={p3} tRobo={r3} icone="🛍️" resposta="Lembra a pessoa" detalhe="“Esqueceu alguma coisa?”" />
      </AbsoluteFill>
      <Adesivo em={r3 + 0.3} ate={T.estrategias} emoji="👀" x={1640} y={250} tamanho={150} giro={10} />
    </Cena>
  );
};

export const Estrategias: React.FC = () => {
  const frame = useCurrentFrame();
  const tRep = em("no que é repetitivo");
  const tVoce = em("enquanto você fica só com as estratégias");
  const tEstr = em("estratégias", tVoce);
  const contadores = [
    { nome: "pedidos enviados", para: 128 },
    { nome: "avisos de entrega", para: 96 },
    { nome: "carrinhos lembrados", para: 41 },
  ];
  return (
    <Cena de={T.estrategias} ate={T.perguntas} zoom={0.025}>
      <AbsoluteFill style={{ padding: "130px 170px", flexDirection: "row", gap: 50 }}>
        <Revela em={T.estrategias + 0.2} y={30} style={{ flex: 1 }}>
          <Vidro style={{ height: 780, padding: "44px 46px" }}>
            <div style={{ fontFamily: FONTE.mono, fontSize: 24, letterSpacing: "0.14em", color: COR.apagado }}>OS ROBÔS</div>
            <div style={{ marginTop: 16, fontFamily: FONTE.sans, fontSize: 64, fontWeight: 600, letterSpacing: "-0.03em", color: COR.texto }}>
              o <Destaque>repetitivo</Destaque>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 50 }}>
              {contadores.map((c, i) => (
                <div key={c.nome} style={{ display: "flex", alignItems: "center", gap: 24, opacity: prog(frame, tRep + i * 0.2, 0.4) }}>
                  <Emoji tamanho={62} style={{ transform: `translateY(${(Math.sin(frame / 4 + i) * 4).toFixed(1)}px)` }}>
                    🤖
                  </Emoji>
                  <span style={{ fontFamily: FONTE.sans, fontSize: 60, fontWeight: 700, color: "#5EE3A1", width: 140 }}>
                    <Contador para={c.para} em={tRep + i * 0.2} duracao={4} />
                  </span>
                  <span style={{ fontFamily: FONTE.sans, fontSize: 34, color: COR.suave }}>{c.nome}</span>
                </div>
              ))}
            </div>
          </Vidro>
        </Revela>
        <Revela em={tVoce - 0.1} y={30} style={{ flex: 1 }}>
          <Vidro ativo={prog(frame, tEstr, 0.5)} style={{ height: 780, padding: "44px 46px" }}>
            <div style={{ fontFamily: FONTE.mono, fontSize: 24, letterSpacing: "0.14em", color: COR.apagado }}>VOCÊ</div>
            <div style={{ marginTop: 16, fontFamily: FONTE.sans, fontSize: 64, fontWeight: 600, letterSpacing: "-0.03em", color: COR.texto }}>
              só as <Destaque>estratégias</Destaque>
            </div>
            <div style={{ marginTop: 70, display: "flex", alignItems: "center", gap: 30 }}>
              <Emoji tamanho={200}>♟️</Emoji>
              <Emoji tamanho={150}>🧠</Emoji>
            </div>
          </Vidro>
        </Revela>
      </AbsoluteFill>
      <Adesivo em={tEstr + 0.2} ate={T.perguntas} emoji="😎" x={1700} y={240} tamanho={170} giro={12} legenda="só estratégia" />
    </Cena>
  );
};

const PERGUNTAS: { icone: LucideIcon; texto: string; frase: string }[] = [
  { icone: Package, texto: "Qual produto vender?", frase: "Qual produto vender" },
  { icone: Tag, texto: "Qual oferta fazer?", frase: "qual oferta fazer" },
  { icone: Megaphone, texto: "Onde anunciar?", frase: "onde anunciar" },
];

export const Perguntas: React.FC = () => (
  <Cena de={T.perguntas} ate={T.crescer} zoom={0.03}>
    <Palco gap={34}>
      {PERGUNTAS.map((p) => (
        <Revela key={p.texto} em={em(p.frase, T.perguntas) - 0.1} y={30}>
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            <IconeCaixa icone={p.icone} tamanho={120} destaque />
            <span style={{ fontFamily: FONTE.sans, fontSize: 104, fontWeight: 600, letterSpacing: "-0.04em", color: COR.texto }}>{p.texto}</span>
          </div>
        </Revela>
      ))}
    </Palco>
  </Cena>
);

/** Gráfico que cresce, com o foguete na ponta. */
const Cresce: React.FC<{ de: number }> = ({ de }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, de, 1.6, SUAVE);
  const pontos = [0.05, 0.1, 0.08, 0.22, 0.2, 0.38, 0.35, 0.58, 0.62, 0.85, 1];
  const x0 = 220;
  const y0 = 960;
  const largura = 1480;
  const altura = 470;
  const xy = pontos.map((v, i) => [x0 + (i / (pontos.length - 1)) * largura, y0 - v * altura] as const);
  const n = Math.max(1, Math.round(p * (xy.length - 1)));
  const parcial = xy.slice(0, n + 1);
  const ultimo = parcial[parcial.length - 1];
  const linha = parcial.map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`).join("");
  if (frame / FPS < de) return null;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="a3-cresce" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(140,155,255,0.42)" />
            <stop offset="1" stopColor="rgba(140,155,255,0)" />
          </linearGradient>
          <linearGradient id="a3-cresce-linha" x1="0" x2="1">
            <stop offset="0" stopColor="#8C9BFF" />
            <stop offset="1" stopColor="#F4A6DE" />
          </linearGradient>
        </defs>
        <path d={`${linha} L ${ultimo[0]} ${y0} L ${x0} ${y0} Z`} fill="url(#a3-cresce)" />
        <path d={linha} fill="none" stroke="url(#a3-cresce-linha)" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Emoji tamanho={110} style={{ position: "absolute", left: ultimo[0] - 46, top: ultimo[1] - 120 }}>
        🚀
      </Emoji>
    </>
  );
};

export const Crescer: React.FC = () => {
  const tCrescer = em("o negócio crescer");
  const tCerteza = em("pode ter certeza");
  return (
    <Cena de={T.crescer} ate={FIM_DA_FALA + 0.35} zoom={0.035}>
      <AbsoluteFill style={{ padding: "110px 170px" }}>
        <Fala texto="Isso *nenhum robô* faz por você," frase="Isso nenhum robô faz por você" tamanho={92} largura={1500} />
        <Fala texto="e é isso que faz o negócio crescer." frase="e é isso que faz o negócio crescer" tamanho={54} peso={400} cor={COR.suave} style={{ marginTop: 16 }} />
      </AbsoluteFill>
      <Cresce de={tCrescer - 0.3} />
      <Adesivo em={tCerteza} ate={FIM_DA_FALA + 0.3} emoji="💯" x={1600} y={330} tamanho={240} giro={12} />
    </Cena>
  );
};

/* ------------------------------------------------------------------ */
/* Fechamento (sem voz)                                                */
/* ------------------------------------------------------------------ */

export const Fechamento: React.FC = () => {
  const de = FIM_DA_FALA + 0.3;
  return (
    <Cena de={de} ate={T.fim + 1} zoom={0.03}>
      <Palco>
        <Rotulo em={de + 0.1}>Próxima aula</Rotulo>
        <Fala texto="Fornecedor do Brasil *ou de fora?*" em={de + 0.3} intervalo={0.09} tamanho={120} largura={1500} style={{ marginTop: 26 }} />
        <Revela em={de + 1.3} style={{ marginTop: 70 }}>
          <div style={{ fontFamily: FONTE.mono, fontSize: 22, letterSpacing: "0.14em", textTransform: "uppercase", color: COR.apagado }}>
            Antes dela, faça
          </div>
          <div style={{ display: "flex", gap: 40, marginTop: 22 }}>
            {["Escolha a trilha que mais chamou a sua atenção", "Anote uma tarefa repetitiva para um robô"].map((tarefa) => (
              <div key={tarefa} style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: FONTE.sans, fontSize: 34, color: COR.suave, maxWidth: 640 }}>
                <span style={{ width: 46, height: 46, borderRadius: 14, border: "3px solid rgba(201,166,245,0.7)", flexShrink: 0 }} />
                {tarefa}
              </div>
            ))}
          </div>
        </Revela>
      </Palco>
    </Cena>
  );
};
