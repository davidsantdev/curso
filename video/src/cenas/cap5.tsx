import { Check, MessageCircle, Package, Tag, X } from "lucide-react";
import React from "react";
import { useCurrentFrame } from "remotion";
import { BROLL } from "../broll";
import { Cena, Fala, IconeCaixa, Palco, Revela, Riscado, Rotulo, Vidro } from "../componentes/base";
import { FundoVideo } from "../componentes/fundo";
import { prog } from "../lib/anim";
import { em } from "../lib/tempo";
import { T } from "../marcos";
import { COR, FONTE } from "../tema";

const antes = (s: number) => s - 0.15;

/** "...isso é verdade ou é conversa de internet? É verdade." (volta à pergunta 03 do começo) */
export const Verdade: React.FC = () => {
  const de = T.verdade;
  const ate = T.cap5;
  const tPergunta = em("isso é verdade ou é conversa de internet", de);
  const tResposta = em("É verdade", tPergunta + 1.2);
  return (
    <Cena de={de} ate={ate}>
      <Palco>
        <Rotulo em={de + 0.1}>Lá do começo · pergunta 03</Rotulo>
        <Revela em={tPergunta - 0.1} y={16} style={{ marginTop: 30 }}>
          <div style={{ fontFamily: FONTE.sans, fontWeight: 600, fontSize: 70, letterSpacing: "-0.035em", color: COR.suave }}>
            É verdade ou conversa de internet?
          </div>
        </Revela>
        <div style={{ display: "flex", alignItems: "center", gap: 44, marginTop: 36 }}>
          <Fala texto="É *verdade*." frase="É verdade" depois={tPergunta + 1.2} tamanho={180} />
          <Revela em={tResposta + 0.25} y={0} escala={0.6}>
            <div
              style={{
                width: 116,
                height: 116,
                borderRadius: 116,
                display: "grid",
                placeItems: "center",
                background: "rgba(94,227,161,0.14)",
                border: "1px solid rgba(94,227,161,0.45)",
              }}
            >
              <Check size={62} strokeWidth={2.4} color={COR.verde} />
            </div>
          </Revela>
        </div>
      </Palco>
    </Cena>
  );
};

type Cartao = {
  n: string;
  titulo: string;
  de: number;
  ate: number;
  chips?: { texto: string; em: number }[];
  extra?: React.ReactNode;
};

/** Os três "não é": dinheiro fácil, sem custo, sem responsabilidade. Cada cartão acende quando é falado. */
export const NaoE: React.FC = () => {
  const de = T.naoE;
  const ate = T.vantagem;
  const frame = useCurrentFrame();
  const c1 = em("não é dinheiro fácil", de);
  const c2 = em("não é sem custo", de);
  const c3 = em("não tira a sua responsabilidade", de);
  const nota: React.CSSProperties = {
    fontFamily: FONTE.sans,
    fontSize: 27,
    lineHeight: 1.3,
    color: COR.suave,
    letterSpacing: "-0.01em",
  };
  const cartoes: Cartao[] = [
    {
      n: "01",
      titulo: "Não é dinheiro fácil",
      de: c1,
      ate: c2,
      chips: ["escolher produto", "montar loja", "divulgar", "atender", "ajustar"].map((texto) => ({ texto, em: em(texto, c1) })),
      extra: (
        <Revela em={em("é só abrir a loja", c1) - 0.1} y={10}>
          <div style={nota}>
            <Riscado em={em("tá te vendendo ilusão", c1)}>“É só abrir a loja e esperar o dinheiro cair.”</Riscado>
          </div>
        </Revela>
      ),
    },
    {
      n: "02",
      titulo: "Não é sem custo",
      de: c2,
      ate: c3,
      chips: [
        { texto: "plataforma da loja", em: em("plataforma da loja", c2) },
        { texto: "taxa de pagamento", em: em("taxa de pagamento", c2) },
        { texto: "anúncio", em: em("paga anúncio", c2) },
      ],
      extra: (
        <Revela em={em("É um custo bem menor", c2) - 0.1} y={10}>
          <div style={nota}>
            Bem menor que montar estoque. <span style={{ color: COR.texto }}>Mas existe.</span>
          </div>
        </Revela>
      ),
    },
    {
      n: "03",
      titulo: "Não tira a sua responsabilidade",
      de: c3,
      ate,
      extra: (
        <Revela em={em("quem vendeu foi você", c3) - 0.1} y={10}>
          <div style={{ ...nota, fontSize: 34, color: COR.texto }}>Quem vendeu foi você.</div>
        </Revela>
      ),
    },
  ];
  return (
    <Cena de={de} ate={ate} zoom={0.02}>
      <FundoVideo clipe={BROLL.trabalho} de={de} ate={ate} escurecer={0.72} />
      <Palco centro>
        <div style={{ display: "flex", gap: 32 }}>
          {cartoes.map((c) => {
            const entra = prog(frame, c.de - 0.25, 0.7);
            const ativo = entra * (1 - prog(frame, c.ate - 0.1, 0.5));
            return (
              <div
                key={c.n}
                style={{
                  opacity: entra * (0.42 + 0.58 * ativo),
                  transform: `translateY(${((1 - entra) * 40).toFixed(2)}px)`,
                  filter: entra < 0.99 ? `blur(${((1 - entra) * 10).toFixed(2)}px)` : undefined,
                }}
              >
                <Vidro ativo={ativo} style={{ width: 500, height: 640, padding: "42px 40px", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 64,
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(255,122,147,0.12)",
                        border: "1px solid rgba(255,122,147,0.4)",
                      }}
                    >
                      <X size={32} strokeWidth={2.4} color={COR.vermelho} />
                    </div>
                    <span style={{ fontFamily: FONTE.mono, fontSize: 20, color: COR.apagado, letterSpacing: "0.1em" }}>{c.n}</span>
                  </div>
                  <div
                    style={{
                      marginTop: 34,
                      fontFamily: FONTE.sans,
                      fontWeight: 600,
                      fontSize: 50,
                      letterSpacing: "-0.035em",
                      lineHeight: 1.06,
                    }}
                  >
                    {c.titulo}
                  </div>
                  {c.chips && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 30 }}>
                      {c.chips.map((ch) => (
                        <Revela key={ch.texto} em={ch.em - 0.08} y={10}>
                          <div
                            style={{
                              padding: "9px 16px",
                              borderRadius: 999,
                              border: `1px solid ${COR.linha}`,
                              background: "rgba(255,255,255,0.05)",
                              fontFamily: FONTE.sans,
                              fontSize: 24,
                              color: COR.texto,
                            }}
                          >
                            {ch.texto}
                          </div>
                        </Revela>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: "auto" }}>{c.extra}</div>
                </Vidro>
              </div>
            );
          })}
        </div>
      </Palco>
    </Cena>
  );
};

/** "Qual é a vantagem real, então? É começar com pouco dinheiro e com pouco risco..." + o básico que faz dar certo. */
export const Vantagem: React.FC = () => {
  const de = T.vantagem;
  const ate = T.cap6;
  const tBasico = antes(em("O que faz dar certo", de));
  const tSoIsso = em("Só isso", de);
  const pilares = [
    { icone: Package, texto: "Produto certo", em: em("produto certo", tBasico) },
    { icone: Tag, texto: "Oferta clara", em: em("oferta clara", tBasico) },
    { icone: MessageCircle, texto: "Atendimento bom", em: em("atendimento bom", tBasico) },
  ];
  const tConstruir = em("é exatamente isso que a gente vai construir", tBasico);
  return (
    <>
      <Cena de={de} ate={tBasico}>
        <Palco>
          <Rotulo em={de + 0.1}>Qual é a vantagem real?</Rotulo>
          <div style={{ marginTop: 34 }}>
            <Fala texto="Pouco *dinheiro*." frase="pouco dinheiro" depois={de} tamanho={140} entrelinha={1.04} />
            <Fala texto="Pouco *risco*." frase="pouco risco" depois={de} tamanho={140} entrelinha={1.04} />
          </div>
          <div style={{ display: "flex", gap: 28, alignItems: "baseline", marginTop: 46 }}>
            <Fala texto="Só isso?" em={tSoIsso} tamanho={52} peso={500} cor={COR.suave} />
            <Fala texto="E isso já é *muita coisa*." frase="E isso já é muita coisa" depois={de} tamanho={52} peso={500} />
          </div>
        </Palco>
      </Cena>

      <Cena de={tBasico} ate={ate}>
        <Palco centro>
          <Rotulo em={tBasico + 0.1}>O que faz dar certo: o básico</Rotulo>
          <div style={{ display: "flex", gap: 32, marginTop: 50 }}>
            {pilares.map((p) => (
              <Revela key={p.texto} em={p.em - 0.15} y={30}>
                <Vidro style={{ width: 460, padding: "44px 40px" }}>
                  <IconeCaixa icone={p.icone} tamanho={88} destaque />
                  <div style={{ marginTop: 36, fontFamily: FONTE.sans, fontWeight: 600, fontSize: 52, letterSpacing: "-0.035em" }}>
                    {p.texto}
                  </div>
                </Vidro>
              </Revela>
            ))}
          </div>
          <Fala
            texto="É isso que a gente vai construir, *passo a passo*."
            em={tConstruir}
            intervalo={0.08}
            tamanho={50}
            peso={500}
            cor={COR.suave}
            alinhar="center"
            style={{ marginTop: 60 }}
          />
        </Palco>
      </Cena>
    </>
  );
};
