import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cena, Fala, Palco, Revela, Rotulo } from "../componentes/base";
import { Barras } from "../componentes/hud";
import { prog } from "../lib/anim";
import { em, FPS } from "../lib/tempo";
import { T } from "../marcos";
import { COR, FONTE } from "../tema";

/** "Opa, fala galera, professor na área." */
export const Abertura: React.FC = () => (
  <Cena de={T.inicio} ate={T.hoje}>
    <Palco centro>
      <Rotulo em={0.1}>Aula 01 · Vender sem estoque</Rotulo>
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

const OUTROS_NOMES = [
  { texto: "dropshipping", x: 250, y: 240 },
  { texto: "drop", x: 1580, y: 220 },
  { texto: "loja sem estoque", x: 300, y: 830 },
  { texto: "dropship", x: 1460, y: 860 },
];

/** "Hoje a gente começa do começo, tá bom? Vender sem estoque." (o título fica enquanto ele cita os outros nomes) */
export const Titulo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const tVender = em("Vender sem estoque", T.hoje);
  const tNomes = em("com outro nome", T.hoje);
  const brilho = prog(frame, tVender, 1.6);
  return (
    <Cena de={T.hoje} ate={T.duvida} zoom={0.05}>
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 1500,
            height: 760,
            transform: `translate(-50%, -50%) scale(${(0.7 + 0.3 * brilho).toFixed(4)})`,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(125,114,248,0.4), rgba(242,95,220,0.12) 55%, transparent 100%)",
            opacity: brilho,
          }}
        />
        {OUTROS_NOMES.map((n, i) => {
          const p = prog(frame, tNomes + i * 0.18, 0.9);
          return (
            <div
              key={n.texto}
              style={{
                position: "absolute",
                left: n.x,
                top: n.y + Math.sin(t * 0.5 + i * 1.7) * 10,
                fontFamily: FONTE.mono,
                fontSize: 28,
                letterSpacing: "0.08em",
                color: COR.apagado,
                opacity: p * 0.8,
                filter: `blur(${((1 - p) * 8 + 0.6).toFixed(2)}px)`,
              }}
            >
              {n.texto}
            </div>
          );
        })}
      </AbsoluteFill>
      <Palco centro>
        <Rotulo em={em("começa do começo", T.hoje) - 0.1}>Do começo</Rotulo>
        <Fala
          texto="Vender sem *estoque*"
          frase="Vender sem estoque"
          depois={T.hoje}
          tamanho={184}
          alinhar="center"
          style={{ marginTop: 30, letterSpacing: "-0.05em" }}
        />
        <Revela em={tVender + 1.1} style={{ marginTop: 30 }}>
          <div style={{ fontFamily: FONTE.sans, fontSize: 44, color: COR.suave, letterSpacing: "-0.015em" }}>
            como funciona de verdade
          </div>
        </Revela>
      </Palco>
    </Cena>
  );
};

/** "...e talvez tenha ficado com aquela dúvida: como assim vender uma coisa que eu não tenho?" */
export const Duvida: React.FC = () => (
  <Cena de={T.duvida} ate={T.explicacao}>
    <Palco>
      <Rotulo em={T.duvida + 0.1}>Aquela dúvida</Rotulo>
      <Fala
        texto="Como assim vender uma coisa que eu *não tenho*?"
        frase="como assim vender uma coisa que eu não tenho"
        depois={T.duvida}
        tamanho={118}
        largura={1450}
        style={{ marginTop: 36 }}
      />
    </Palco>
  </Cena>
);

const PERGUNTAS = [
  { texto: "Como isso funciona na prática?", frase: "Como isso funciona na prática" },
  { texto: "Quem faz o quê?", frase: "Quem faz o quê" },
  { texto: "É verdade ou conversa de internet?", frase: "É verdade ou é conversa de internet" },
  { texto: "O que muda pra você, que tá começando do zero?", frase: "E o que muda pra você" },
];

/** As 4 perguntas que a aula responde: cada uma acende quando é falada. */
export const Perguntas: React.FC = () => {
  const frame = useCurrentFrame();
  const tempos = PERGUNTAS.map((p) => em(p.frase, T.explicacao));
  return (
    <Cena de={T.explicacao} ate={T.cap1}>
      <Palco>
        <Rotulo em={T.explicacao + 0.1}>Nesta aula</Rotulo>
        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 28 }}>
          {PERGUNTAS.map((p, i) => {
            const ativo = i === PERGUNTAS.length - 1 ? 1 : 1 - prog(frame, tempos[i + 1] - 0.1, 0.4);
            return (
              <Revela key={p.texto} em={tempos[i] - 0.1} y={30}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 36, opacity: 0.36 + 0.64 * ativo }}>
                  <span style={{ fontFamily: FONTE.mono, fontSize: 26, color: COR.violeta, letterSpacing: "0.08em" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: FONTE.sans,
                      fontWeight: 600,
                      fontSize: 64,
                      letterSpacing: "-0.035em",
                      color: COR.texto,
                    }}
                  >
                    {p.texto}
                  </span>
                </div>
              </Revela>
            );
          })}
        </div>
      </Palco>
    </Cena>
  );
};
