/** Aula 3, primeira metade: abertura, o caminho, o roteiro e os métodos (até "passo a passo"). */
import { Bot, CodeXml, Layers, Package, type LucideIcon } from "lucide-react";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cena, Etiqueta, Fala, IconeCaixa, Palco, Revela, Rotulo, Vidro } from "../componentes/base";
import { CenaCapitulo } from "../componentes/graficos";
import { Barras } from "../componentes/hud";
import { prog, SAIDA, SUAVE } from "../lib/anim";
import { FPS } from "../lib/tempo";
import { COR, DEGRADE_FORTE, FONTE } from "../tema";
import { Adesivo, Balao, Carregando, Chuva, Emoji, EMOJI, Escurecer, MEME, Notificacao, TextoMeme, contorno } from "./memes";
import { em, T } from "./tempo";

/* ------------------------------------------------------------------ */
/* Abertura                                                            */
/* ------------------------------------------------------------------ */

export const Abertura: React.FC = () => (
  <Cena de={T.inicio} ate={T.rapidinha}>
    <Palco centro>
      <Rotulo em={0.1}>Aula 03 · O que vem pela frente</Rotulo>
      <div style={{ marginTop: 52, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Fala texto="Opa, fala galera," tamanho={96} peso={500} cor={COR.suave} alinhar="center" />
        <Fala texto="professor na *área*." tamanho={132} alinhar="center" style={{ marginTop: 8 }} />
      </div>
      <Revela em={0.3} style={{ marginTop: 64 }}>
        <Barras quantidade={9} altura={48} largura={6} />
      </Revela>
    </Palco>
  </Cena>
);

/** Linhas de velocidade (aquele fundo de "correndo" dos desenhos), girando devagar. */
const Velocidade: React.FC<{ em: number; ate: number }> = ({ em: de, ate }) => {
  const frame = useCurrentFrame();
  const o = prog(frame, de, 0.25) * (1 - prog(frame, ate, 0.3));
  return (
    <AbsoluteFill
      style={{
        opacity: 0.55 * o,
        backgroundImage:
          "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.10) 0deg 1.2deg, transparent 1.2deg 7deg)",
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 18%, #000 60%)",
        maskImage: "radial-gradient(circle at 50% 50%, transparent 18%, #000 60%)",
        transform: `rotate(${(frame * 0.6).toFixed(2)}deg) scale(1.6)`,
      }}
    />
  );
};

export const Rapidinha: React.FC = () => {
  const tRapida = em("rapidinha");
  return (
    <Cena de={T.rapidinha} ate={T.frente} zoom={0.04}>
      <Velocidade em={tRapida - 0.1} ate={T.frente} />
      <Palco centro>
        <Fala texto="Essa aula vai ser *rapidinha*," tamanho={118} alinhar="center" />
        <Fala texto="tá bom?" tamanho={64} peso={400} cor={COR.suave} alinhar="center" style={{ marginTop: 18 }} />
      </Palco>
      <Adesivo em={tRapida} ate={T.frente} emoji="⏱️" x={1530} y={290} tamanho={230} giro={12} />
      <TextoMeme em={tRapida + 0.15} ate={T.frente} texto="Rapidinha" y={860} tamanho={150} giro={-4} cor="#FFE45C" />
    </Cena>
  );
};

/* ------------------------------------------------------------------ */
/* Tudo o que vem pela frente / o caminho inteiro                      */
/* ------------------------------------------------------------------ */

const PARTES: { icone: LucideIcon; nome: string }[] = [
  { icone: Layers, nome: "Os métodos" },
  { icone: CodeXml, nome: "Programação" },
  { icone: Bot, nome: "Os robôs" },
];

export const Frente: React.FC = () => {
  const tFrente = em("vem pela frente");
  return (
    <Cena de={T.frente} ate={T.caminho} zoom={0.03}>
      <Palco centro>
        <Rotulo em={T.frente + 0.1}>O que vem pela frente</Rotulo>
        <Fala
          texto="Tudo o que vem *pela frente*"
          frase="tudo o que vem pela frente"
          depois={T.frente}
          tamanho={120}
          alinhar="center"
          style={{ marginTop: 30 }}
        />
        <div style={{ display: "flex", gap: 60, marginTop: 80 }}>
          {PARTES.map((p, i) => (
            <Revela key={p.nome} em={tFrente + 0.35 + i * 0.22} y={30}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                <IconeCaixa icone={p.icone} tamanho={120} destaque={i === 0} />
                <span style={{ fontFamily: FONTE.mono, fontSize: 22, letterSpacing: "0.12em", textTransform: "uppercase", color: COR.suave }}>
                  {p.nome}
                </span>
              </div>
            </Revela>
          ))}
        </div>
      </Palco>
    </Cena>
  );
};

/** Mapa do curso, com o pino "você está aqui" e a bandeira de chegada. */
const PONTOS = [
  { x: 280, y: 700, nome: "Você" },
  { x: 560, y: 560, nome: "Produtos" },
  { x: 840, y: 680, nome: "Loja" },
  { x: 1120, y: 540, nome: "Anúncios" },
  { x: 1400, y: 660, nome: "IA" },
  { x: 1660, y: 520, nome: "Robôs" },
];

export const Caminho: React.FC = () => {
  const frame = useCurrentFrame();
  const tCaminho = em("caminho inteiro");
  const tAqui = em("onde você tá");
  const tVai = em("pra onde você vai");
  const desenha = prog(frame, tCaminho - 0.2, 1.6, SUAVE);
  const d = PONTOS.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `S ${(PONTOS[i - 1].x + p.x) / 2 + 40} ${p.y + 90} ${p.x} ${p.y}`)).join(" ");
  return (
    <Cena de={T.caminho} ate={T.roteiro} zoom={0.035}>
      <AbsoluteFill style={{ padding: "120px 170px" }}>
        <Fala
          texto="Enxergar o *caminho inteiro*"
          frase="enxerga o caminho inteiro"
          depois={T.caminho}
          tamanho={92}
        />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="a3-trilha" x1="0" x2="1">
            <stop offset="0" stopColor="#8C9BFF" />
            <stop offset="1" stopColor="#F4A6DE" />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14} strokeLinecap="round" />
        <path
          d={d}
          fill="none"
          stroke="url(#a3-trilha)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="2400"
          strokeDashoffset={2400 * (1 - desenha)}
        />
      </svg>
      {PONTOS.map((p, i) => {
        const pp = prog(frame, tCaminho + i * 0.22, 0.5);
        return (
          <div key={p.nome} style={{ position: "absolute", left: p.x, top: p.y, transform: "translate(-50%, -50%)", opacity: pp }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 30,
                background: i === 0 ? "#fff" : "rgba(255,255,255,0.2)",
                border: "3px solid rgba(255,255,255,0.8)",
                transform: `scale(${(0.5 + 0.5 * pp).toFixed(3)})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 44,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: FONTE.mono,
                fontSize: 20,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: COR.suave,
                whiteSpace: "nowrap",
              }}
            >
              {p.nome}
            </div>
          </div>
        );
      })}
      <Adesivo em={tAqui} ate={T.roteiro} emoji="📍" x={PONTOS[0].x} y={PONTOS[0].y - 150} tamanho={170} giro={0} legenda="você está aqui" />
      <Adesivo em={tVai} ate={T.roteiro} emoji="🏁" x={PONTOS[5].x + 20} y={PONTOS[5].y - 140} tamanho={150} giro={8} />
    </Cena>
  );
};

/* ------------------------------------------------------------------ */
/* Roteiro da aula (com o susto da "programação")                      */
/* ------------------------------------------------------------------ */

export const Roteiro: React.FC = () => {
  const frame = useCurrentFrame();
  const t1 = em("os métodos que você vai aprender");
  const tProg = em("programação", em("vai te surpreender"));
  const tCalma = em("Calma não precisa se assustar");
  const tRobos = em("os robôs que vão trabalhar");
  const tempos = [t1, tProg, tRobos];
  return (
    <>
      <Cena de={T.roteiro} ate={T.cap1} zoom={0.025}>
        <AbsoluteFill style={{ padding: "120px 170px" }}>
          <Rotulo em={T.roteiro + 0.1}>Nesta aula</Rotulo>
          <Fala texto="Olha só o que eu vou te *mostrar*." tamanho={72} style={{ marginTop: 24 }} />
          <div style={{ display: "flex", gap: 44, marginTop: 90 }}>
            {PARTES.map((p, i) => {
              const ativo = prog(frame, tempos[i], 0.5) * (i === 2 || frame / FPS < (tempos[i + 1] ?? 999) ? 1 : 0.6);
              return (
                <Revela key={p.nome} em={tempos[i] - 0.05} y={40}>
                  <Vidro ativo={ativo} style={{ width: 470, padding: "40px 40px 46px" }}>
                    <div style={{ fontFamily: FONTE.mono, fontSize: 22, color: COR.apagado, letterSpacing: "0.12em" }}>0{i + 1}</div>
                    <div style={{ marginTop: 26 }}>
                      <IconeCaixa icone={p.icone} tamanho={110} destaque />
                    </div>
                    <div style={{ marginTop: 30, fontFamily: FONTE.sans, fontSize: 54, fontWeight: 600, letterSpacing: "-0.03em", color: COR.texto }}>
                      {p.nome}
                    </div>
                    {i === 1 ? (
                      <Revela em={tCalma + 1.2} y={10} style={{ marginTop: 18 }}>
                        <Etiqueta>do jeito fácil</Etiqueta>
                      </Revela>
                    ) : null}
                  </Vidro>
                </Revela>
              );
            })}
          </div>
        </AbsoluteFill>
        <Adesivo em={tRobos + 0.2} ate={T.cap1} emoji="🤖" x={1600} y={420} tamanho={140} giro={14} />
      </Cena>

      {/* o susto e a calma */}
      <Escurecer em={tProg - 0.05} ate={tCalma + 1.6} forca={0.72} />
      <Adesivo em={tProg} ate={tCalma - 0.05} emoji="😱" x={960} y={450} tamanho={340} giro={-6} />
      <TextoMeme em={tProg + 0.1} ate={tCalma - 0.05} texto="Programação?!" y={850} tamanho={170} giro={-3} />
      <Adesivo em={tCalma} ate={tCalma + 1.6} emoji="🧘" x={960} y={470} tamanho={300} giro={0} legenda="relaxa" />
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Capítulo 1: os métodos                                              */
/* ------------------------------------------------------------------ */

export const Cap1: React.FC = () => (
  <CenaCapitulo
    numero="01"
    titulo="Os métodos"
    de={T.cap1}
    ate={T.produtos}
    extra={
      <Revela em={T.cap1 + 0.7} y={10}>
        <Etiqueta>Do produto ao anúncio</Etiqueta>
      </Revela>
    }
  />
);

export const Produtos: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <Cena de={T.produtos} ate={T.quemVende} zoom={0.04}>
      <Palco>
        <Rotulo em={T.produtos + 0.1}>Logo depois da trilha grátis</Rotulo>
        <div style={{ display: "flex", alignItems: "center", gap: 50, marginTop: 34 }}>
          <Revela em={em("produtos e fornecedores") - 0.1}>
            <IconeCaixa icone={Package} tamanho={170} destaque />
          </Revela>
          <Fala texto="Produtos e *fornecedores*" frase="produtos e fornecedores" tamanho={124} largura={1200} />
        </div>
      </Palco>
      {["📦", "📦", "📦"].map((e, i) => (
        <Revela key={i} em={em("produtos e fornecedores") + 0.2 + i * 0.15} style={{ position: "absolute", left: 1320 + i * 150, top: 700 + Math.sin(t * 1.6 + i) * 14 }}>
          <Emoji tamanho={110 - i * 10}>{e}</Emoji>
        </Revela>
      ))}
    </Cena>
  );
};

/** Gráfico que sobe, com o foguete na ponta. */
const Sobe: React.FC<{ em: number; x: number; y: number; largura: number; altura: number }> = ({ em: de, x, y, largura, altura }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, de, 1.4, SUAVE);
  const pontos = [0, 0.12, 0.08, 0.3, 0.26, 0.5, 0.46, 0.78, 1];
  const xy = pontos.map((v, i) => [x + (i / (pontos.length - 1)) * largura, y + altura - v * altura] as const);
  const n = Math.max(1, Math.floor(p * (xy.length - 1)));
  const parcial = xy.slice(0, n + 1);
  const ultimo = parcial[parcial.length - 1];
  const linha = parcial.map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`).join("");
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="a3-sobe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(94,227,161,0.45)" />
            <stop offset="1" stopColor="rgba(94,227,161,0)" />
          </linearGradient>
        </defs>
        <path d={`${linha} L ${ultimo[0]} ${y + altura} L ${x} ${y + altura} Z`} fill="url(#a3-sobe)" />
        <path d={linha} fill="none" stroke="#5EE3A1" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Emoji tamanho={96} style={{ position: "absolute", left: ultimo[0] - 40, top: ultimo[1] - 100, opacity: p > 0.05 ? 1 : 0 }}>
        🚀
      </Emoji>
    </>
  );
};

export const QuemVende: React.FC = () => {
  const tMuito = em("vende muito");
  return (
    <Cena de={T.quemVende} ate={T.lowTicket} zoom={0.03}>
      <AbsoluteFill style={{ padding: "150px 170px" }}>
        <Rotulo em={T.quemVende + 0.1}>Na trilha de produtos</Rotulo>
        <Fala texto="É ali que eu te passo" frase="É ali que eu te passo" tamanho={60} peso={500} cor={COR.suave} style={{ marginTop: 28 }} />
        <Fala texto="as dicas de quem *vende muito*" frase="as dicas de quem vende muito" tamanho={104} largura={1100} style={{ marginTop: 8 }} />
      </AbsoluteFill>
      <Sobe em={tMuito} x={1150} y={560} largura={600} altura={330} />
      <Chuva em={tMuito} ate={T.lowTicket - 0.2} emojis={["💸", "💰", "🤑", "💵"]} quantidade={24} />
    </Cena>
  );
};

export const LowTicket: React.FC = () => {
  const frame = useCurrentFrame();
  const tProduto = em("produto de low ticket");
  const tBaixo = em("preço baixo");
  const balanca = Math.sin((frame / FPS - tProduto) * 3) * 4;
  return (
    <Cena de={T.lowTicket} ate={T.falar} zoom={0.03}>
      <AbsoluteFill style={{ padding: "150px 170px" }}>
        <Rotulo em={T.lowTicket + 0.1}>Como achar</Rotulo>
        <Fala texto="Produto de *low ticket*" frase="produto de low ticket" tamanho={112} style={{ marginTop: 28 }} />
        <Revela em={tBaixo - 0.1} y={16} style={{ marginTop: 34 }}>
          <Etiqueta>= aquele de preço baixo</Etiqueta>
        </Revela>
      </AbsoluteFill>
      {/* etiqueta de preço */}
      <Revela em={tProduto + 0.2} y={40} style={{ position: "absolute", left: 1150, top: 470 }}>
        <div style={{ transform: `rotate(${(-8 + balanca).toFixed(2)}deg)`, transformOrigin: "20px 50%" }}>
          <div
            style={{
              position: "relative",
              width: 560,
              height: 260,
              borderRadius: "30px 40px 40px 30px",
              background: "linear-gradient(135deg, #FFE45C, #FFB547)",
              clipPath: "polygon(16% 0, 100% 0, 100% 100%, 16% 100%, 0 50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 120,
              boxShadow: "0 40px 80px -30px rgba(0,0,0,0.7)",
            }}
          >
            <div style={{ position: "absolute", left: 40, top: "50%", width: 30, height: 30, borderRadius: 30, background: COR.fundo, transform: "translateY(-50%)" }} />
            <div style={{ fontFamily: FONTE.sans, fontWeight: 700, fontSize: 118, letterSpacing: "-0.05em", color: "#1a1200" }}>R$ 19,90</div>
          </div>
        </div>
      </Revela>
      <Adesivo em={tBaixo} ate={T.falar} emoji="🤑" x={1640} y={360} tamanho={170} giro={14} legenda="baratinho" />
    </Cena>
  );
};

export const Falar: React.FC = () => {
  const tFalar = em("com quem falar");
  return (
    <Cena de={T.falar} ate={T.tendencia} zoom={0.025}>
      <AbsoluteFill style={{ padding: "150px 170px", flexDirection: "row", gap: 90, alignItems: "flex-start" }}>
        <div style={{ width: 620 }}>
          <Rotulo em={T.falar + 0.1}>E também</Rotulo>
          <Fala texto="Com quem *falar*" frase="com quem falar" tamanho={110} style={{ marginTop: 28 }} />
          <Fala
            texto="pra conseguir esse produto."
            frase="pra conseguir esse produto"
            tamanho={52}
            peso={400}
            cor={COR.suave}
            style={{ marginTop: 22 }}
          />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26, paddingTop: 40 }}>
          <Balao em={tFalar + 0.25} lado="direita" nome="Você" texto="Oi! Vocês têm esse produto pra pronta entrega?" />
          <Balao em={tFalar + 1.4} lado="esquerda" nome="Fornecedor" texto="Temos sim! Enviamos para todo o Brasil 📦" />
        </div>
      </AbsoluteFill>
    </Cena>
  );
};

/** Meme de dois quadros: o que não vale × o que vale. */
const Quadro: React.FC<{ em: number; emoji: string; texto: string; bom: boolean }> = ({ em: de, emoji, texto, bom }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, de, 0.4, SAIDA);
  return (
    <div
      style={{
        display: "flex",
        height: 330,
        width: 1340,
        borderRadius: 26,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.14)",
        opacity: Math.min(1, p * 2),
        transform: `translateX(${((1 - p) * (bom ? -80 : 80)).toFixed(2)}px)`,
      }}
    >
      <div style={{ width: 420, display: "grid", placeItems: "center", background: bom ? "rgba(94,227,161,0.16)" : "rgba(255,122,147,0.16)" }}>
        <Emoji tamanho={200}>{emoji}</Emoji>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 30,
          padding: "0 60px",
          background: "rgba(255,255,255,0.05)",
          fontFamily: MEME,
          fontSize: 120,
          textTransform: "uppercase",
          color: bom ? "#5EE3A1" : "#FF7A93",
          textShadow: contorno(5),
        }}
      >
        <span style={{ fontFamily: EMOJI, fontSize: 90 }}>{bom ? "📈" : "📉"}</span>
        {texto}
      </div>
    </div>
  );
};

export const Tendencia: React.FC = () => {
  const tTend = em("tendência", T.tendencia);
  const tModa = em("modinha", T.tendencia);
  return (
    <Cena de={T.tendencia} ate={T.loja} zoom={0.02}>
      <Palco centro gap={30}>
        <Quadro em={tTend - 0.05} emoji="😎" texto="Tendência" bom />
        <Quadro em={tModa - 0.05} emoji="🙅" texto="Só modinha" bom={false} />
      </Palco>
    </Cena>
  );
};

/* ------------------------------------------------------------------ */
/* Loja, pagamentos, anúncios, marketplaces                            */
/* ------------------------------------------------------------------ */

const Janela: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <Vidro style={{ overflow: "hidden", ...style }}>
    <div style={{ height: 58, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      {["#FF7A93", "#FFD36B", "#5EE3A1"].map((c) => (
        <span key={c} style={{ width: 15, height: 15, borderRadius: 15, background: c, opacity: 0.85 }} />
      ))}
      <span style={{ marginLeft: 16, height: 22, flex: 1, maxWidth: 420, borderRadius: 22, background: "rgba(255,255,255,0.07)" }} />
    </div>
    {children}
  </Vidro>
);

const Cai: React.FC<{ em: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ em: de, children, style }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, de, 0.55, SAIDA);
  return (
    <div style={{ opacity: Math.min(1, p * 2), transform: `translateY(${((1 - p) * -90).toFixed(2)}px)`, ...style }}>{children}</div>
  );
};

export const Loja: React.FC = () => {
  const tLoja = em("loja virtual");
  const tPaginas = em("páginas de venda");
  return (
    <Cena de={T.loja} ate={T.pagamentos} zoom={0.03}>
      <AbsoluteFill style={{ padding: "120px 170px" }}>
        <Fala texto="Montar a sua *loja virtual*" frase="montar a sua loja virtual" tamanho={84} />
        <Fala texto="e as suas *páginas de venda*." frase="e as suas páginas de venda" tamanho={60} peso={500} cor={COR.suave} style={{ marginTop: 12 }} />
      </AbsoluteFill>
      <Revela em={tLoja - 0.3} y={50} style={{ position: "absolute", left: 170, top: 430 }}>
        <Janela style={{ width: 1000, height: 520 }}>
          <div style={{ padding: 34 }}>
            <Cai em={tLoja}>
              <div style={{ height: 120, borderRadius: 22, backgroundImage: DEGRADE_FORTE, opacity: 0.85 }} />
            </Cai>
            <div style={{ display: "flex", gap: 24, marginTop: 28 }}>
              {["🧴", "🎒", "⌚"].map((e, i) => (
                <Cai key={e} em={tLoja + 0.35 + i * 0.25} style={{ flex: 1 }}>
                  <div style={{ height: 210, borderRadius: 22, background: "rgba(255,255,255,0.07)", display: "grid", placeItems: "center" }}>
                    <Emoji tamanho={100}>{e}</Emoji>
                  </div>
                </Cai>
              ))}
            </div>
          </div>
        </Janela>
      </Revela>
      <Revela em={tPaginas - 0.1} y={60} style={{ position: "absolute", left: 1250, top: 500 }}>
        <Janela style={{ width: 500, height: 450 }}>
          <div style={{ padding: 30, display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ height: 150, borderRadius: 18, background: "rgba(255,255,255,0.07)", display: "grid", placeItems: "center" }}>
              <Emoji tamanho={90}>🧴</Emoji>
            </div>
            <div style={{ height: 22, width: "80%", borderRadius: 22, background: "rgba(255,255,255,0.14)" }} />
            <div style={{ height: 18, width: "60%", borderRadius: 18, background: "rgba(255,255,255,0.08)" }} />
            <div style={{ marginTop: 10, height: 70, borderRadius: 18, backgroundImage: DEGRADE_FORTE, display: "grid", placeItems: "center", fontFamily: FONTE.sans, fontWeight: 600, fontSize: 30, color: "#fff" }}>
              Comprar agora
            </div>
          </div>
        </Janela>
      </Revela>
    </Cena>
  );
};

export const Pagamentos: React.FC = () => {
  const formas = [
    { nome: "Pix", emoji: "⚡", em: em("Pix", T.pagamentos) },
    { nome: "Cartão", emoji: "💳", em: em("cartão", T.pagamentos) },
    { nome: "Boleto", emoji: "🧾", em: em("boleto", T.pagamentos) },
  ];
  return (
    <Cena de={T.pagamentos} ate={T.anuncios} zoom={0.03}>
      <Palco centro>
        <Rotulo em={T.pagamentos + 0.1}>Depois</Rotulo>
        <Fala texto="Aí vem *pagamentos*" frase="Aí vem pagamentos" tamanho={120} alinhar="center" style={{ marginTop: 26 }} />
        <div style={{ display: "flex", gap: 34, marginTop: 70 }}>
          {formas.map((f) => (
            <Revela key={f.nome} em={f.em - 0.08} y={30} escala={0.7}>
              <Vidro ativo={0.6} style={{ padding: "26px 44px", display: "flex", alignItems: "center", gap: 20 }}>
                <Emoji tamanho={64}>{f.emoji}</Emoji>
                <span style={{ fontFamily: FONTE.sans, fontWeight: 600, fontSize: 52, letterSpacing: "-0.02em", color: COR.texto }}>{f.nome}</span>
              </Vidro>
            </Revela>
          ))}
        </div>
      </Palco>
      <Notificacao
        em={formas[2].em + 0.6}
        ate={T.anuncios - 0.1}
        icone="💰"
        titulo="Pagamento aprovado"
        texto="Você recebeu um Pix de R$ 97,00"
        y={110}
      />
    </Cena>
  );
};

const PLATAFORMAS = [
  { nome: "Facebook", cor: "#8C9BFF" },
  { nome: "Instagram", cor: "#F4A6DE" },
  { nome: "TikTok", cor: "#5EE3A1" },
  { nome: "Google", cor: "#FFD36B" },
];

export const Anuncios: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const tChegar = em("cliente chegar");
  const tAnuncios = em("os anúncios", T.anuncios);
  const nomes = PLATAFORMAS.map((p) => em(p.nome, T.anuncios));
  return (
    <Cena de={T.anuncios} ate={T.marketplaces} zoom={0.03}>
      <AbsoluteFill style={{ padding: "120px 170px" }}>
        <Fala texto="O que faz o *cliente chegar* até você:" frase="o que faz o cliente chegar até você" tamanho={78} largura={1300} />
        <Fala texto="os *anúncios*." frase="os anúncios" depois={T.anuncios} tamanho={150} style={{ marginTop: 20 }} />
        <div style={{ display: "flex", gap: 26, marginTop: 70 }}>
          {PLATAFORMAS.map((p, i) => (
            <Revela key={p.nome} em={nomes[i] - 0.05} y={24} escala={0.75}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "20px 34px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  fontFamily: FONTE.sans,
                  fontSize: 42,
                  fontWeight: 600,
                  color: COR.texto,
                }}
              >
                <span style={{ width: 18, height: 18, borderRadius: 18, background: p.cor, boxShadow: `0 0 20px ${p.cor}` }} />
                {p.nome}
              </div>
            </Revela>
          ))}
        </div>
      </AbsoluteFill>
      {/* clientes chegando na loja, sem parar enquanto a cena estiver na tela */}
      {Array.from({ length: Math.ceil((T.marketplaces - tChegar) / 0.4) }, (_, i) => {
        const vida = t - tChegar - i * 0.4;
        if (vida < 0 || vida > 1.8) return null;
        const x = 1060 + Math.min(1, vida / 1.6) * 470;
        const o = Math.min(1, vida * 3) * (1 - Math.max(0, (vida - 1.45) / 0.3));
        return (
          <Emoji key={i} tamanho={60} style={{ position: "absolute", left: x, top: 300 + (i % 3) * 64, opacity: Math.max(0, o) }}>
            🧍
          </Emoji>
        );
      })}
      <Revela em={tChegar} style={{ position: "absolute", left: 1560, top: 300 }}>
        <Emoji tamanho={170}>🏪</Emoji>
      </Revela>
      <Adesivo em={tAnuncios} ate={nomes[0] - 0.1} emoji="📣" x={1500} y={640} tamanho={230} giro={-12} />
    </Cena>
  );
};

export const Marketplaces: React.FC = () => {
  const tSites = em("sites grandes de compra");
  const tSem = em("sem nem ter uma loja própria");
  return (
    <Cena de={T.marketplaces} ate={T.muitaCoisa} zoom={0.03}>
      <AbsoluteFill style={{ padding: "120px 170px" }}>
        <Fala texto="E ainda tem os *marketplaces*" frase="E ainda tem os marketplaces" tamanho={96} largura={1300} />
        <Revela em={tSites - 0.1} y={14} style={{ marginTop: 28 }}>
          <Etiqueta>Os grandes sites de compra</Etiqueta>
        </Revela>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 200px)", gap: 26, marginTop: 80 }}>
          {["🛍️", "🏬", "📦", "🛒", "🏷️", "🚚"].map((e, i) => (
            <Revela key={e} em={tSites + i * 0.12} y={30} escala={0.7}>
              <Vidro style={{ height: 200, display: "grid", placeItems: "center" }}>
                <Emoji tamanho={96}>{e}</Emoji>
              </Vidro>
            </Revela>
          ))}
        </div>
      </AbsoluteFill>
      <Adesivo em={tSem} ate={T.muitaCoisa} emoji="🤯" x={1440} y={810} tamanho={240} giro={8} legenda="sem loja própria?!" />
    </Cena>
  );
};

export const MuitaCoisa: React.FC = () => {
  const tE = em("É", em("É muita coisa") + 0.5);
  return (
    <Cena de={T.muitaCoisa} ate={T.passo} zoom={0}>
      <Carregando em={T.muitaCoisa + 0.05} travaEm={tE} ate={T.passo + 0.1} />
    </Cena>
  );
};

export const Passo: React.FC = () => {
  const frame = useCurrentFrame();
  const tPasso = em("passo a passo");
  const tCada = em("uma coisa de cada vez");
  return (
    <Cena de={T.passo} ate={T.cap2} zoom={0.03}>
      <AbsoluteFill style={{ padding: "130px 170px" }}>
        <Fala texto="Mas é tudo *passo a passo*," frase="Mas é tudo passo a passo" tamanho={108} />
        <Fala texto="uma coisa de cada vez." frase="uma coisa de cada vez" tamanho={56} peso={400} cor={COR.suave} style={{ marginTop: 18 }} />
      </AbsoluteFill>
      {[0, 1, 2, 3, 4].map((i) => {
        const p = prog(frame, tPasso + 0.1 + i * 0.32, 0.45, SAIDA);
        const aceso = prog(frame, tCada + i * 0.18, 0.3);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 520 + i * 250,
              top: 880 - i * 95,
              width: 250,
              height: 95 + i * 95,
              borderRadius: "18px 18px 0 0",
              background: aceso > 0.5 ? DEGRADE_FORTE : "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              opacity: p,
              transform: `translateY(${((1 - p) * 60).toFixed(2)}px)`,
            }}
          />
        );
      })}
      <Revela em={tCada + 0.9} style={{ position: "absolute", left: 1530, top: 300 }}>
        <Emoji tamanho={130}>👣</Emoji>
      </Revela>
    </Cena>
  );
};
