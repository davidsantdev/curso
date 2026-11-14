import { Check, House, X } from "lucide-react";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BROLL } from "../broll";
import { Cena, Destaque, Etiqueta, Fala, IconeCaixa, Palco, Revela, Riscado, Rotulo, Vidro } from "../componentes/base";
import { FundoVideo } from "../componentes/fundo";
import { Prateleira, Triangulo } from "../componentes/graficos";
import { prog } from "../lib/anim";
import { em } from "../lib/tempo";
import { T } from "../marcos";
import { COR, DEGRADE_FORTE, FONTE } from "../tema";

const pilula: React.CSSProperties = {
  fontFamily: FONTE.sans,
  textTransform: "none",
  letterSpacing: "-0.01em",
  fontSize: 30,
  padding: "14px 26px 14px 20px",
};

/** "Você vende um produto que não está na sua casa. Não tá no seu quarto, não tá num depósito..." */
export const NaoEsta: React.FC = () => {
  const de = T.naoEsta;
  const ate = T.fornecedor;
  const lugares = ["no seu quarto", "num depósito", "em lugar nenhum seu"];
  return (
    <Cena de={de} ate={ate}>
      <FundoVideo clipe={BROLL.casaVazia} de={de} ate={ate} />
      <Palco linha gap={110}>
        <div style={{ flex: 1 }}>
          <Rotulo em={de + 0.1}>Vender sem estoque é</Rotulo>
          <Fala
            texto="Você vende um produto que *não está* na sua casa."
            frase="você vende um produto que não está na sua casa"
            depois={de}
            tamanho={90}
            largura={1020}
            style={{ marginTop: 34 }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 52 }}>
            {lugares.map((texto) => (
              <Revela key={texto} em={em(texto, de) - 0.05} y={16}>
                <Etiqueta icone={<X size={22} strokeWidth={2.4} color={COR.vermelho} />} cor={COR.texto} style={pilula}>
                  {texto}
                </Etiqueta>
              </Revela>
            ))}
          </div>
        </div>
        {!BROLL.casaVazia && (
          <Revela em={de + 0.6} y={40}>
            <Vidro style={{ width: 440, padding: "46px 44px" }}>
              <IconeCaixa icone={House} tamanho={88} />
              <div
                style={{
                  marginTop: 34,
                  fontFamily: FONTE.mono,
                  fontSize: 19,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: COR.apagado,
                }}
              >
                Estoque na sua casa
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: FONTE.sans,
                  fontWeight: 600,
                  fontSize: 168,
                  lineHeight: 1,
                  letterSpacing: "-0.06em",
                }}
              >
                0
              </div>
              <div style={{ fontFamily: FONTE.sans, fontSize: 28, color: COR.suave }}>produtos guardados</div>
            </Vidro>
          </Revela>
        )}
      </Palco>
    </Cena>
  );
};

/** "Quem tem o produto guardado é o fornecedor, que é a empresa que fabrica... na verdade nem sempre fabrica..." */
export const Fornecedor: React.FC = () => {
  const de = T.fornecedor;
  const ate = T.caminho;
  const tFabrica = em("fabrica", de);
  const tNemSempre = em("nem sempre fabrica", de);
  const tDistribui = em("só distribui", de);
  const tPrateleira = em("tem o produto na prateleira", de);
  const tFornecedor = em("o fornecedor", de);
  const linha: React.CSSProperties = {
    fontFamily: FONTE.sans,
    fontSize: 52,
    fontWeight: 500,
    letterSpacing: "-0.025em",
    color: COR.suave,
    lineHeight: 1.3,
  };
  return (
    <Cena de={de} ate={ate}>
      <FundoVideo clipe={BROLL.armazem} de={de} ate={ate} />
      <Palco linha gap={100}>
        <div style={{ flex: 1 }}>
          <Rotulo em={de + 0.1}>Quem tem o produto guardado</Rotulo>
          <Fala texto="O *fornecedor*." frase="o fornecedor" depois={de} tamanho={156} style={{ marginTop: 26 }} />
          <div style={{ marginTop: 40 }}>
            <Revela em={tFabrica - 0.1} y={14} style={linha}>
              A empresa que <Riscado em={tNemSempre + 0.2}>fabrica</Riscado>
            </Revela>
            <Revela em={tDistribui - 0.1} y={14} style={linha}>
              … ou que só <span style={{ color: COR.texto }}>distribui</span>,
            </Revela>
            <Revela em={tPrateleira - 0.1} y={14} style={linha}>
              e tem o produto <span style={{ color: COR.texto }}>na prateleira</span>.
            </Revela>
          </div>
        </div>
        {!BROLL.armazem && (
          <Revela em={tFornecedor} y={40}>
            <Prateleira em={tFornecedor + 0.3} />
          </Revela>
        )}
      </Palco>
    </Cena>
  );
};

/** "E aí, quando um cliente compra na sua loja, você repassa o pedido pra esse fornecedor, e é ele que embala e manda direto..." */
export const Caminho: React.FC = () => {
  const de = T.caminho;
  const ate = T.ponto;
  return (
    <Cena de={de} ate={ate} zoom={0.02}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
        <Rotulo em={de + 0.1}>O caminho de uma venda</Rotulo>
      </AbsoluteFill>
      <Triangulo
        cliente={{ em: em("um cliente compra", de) - 0.1, nota: "compra na sua loja" }}
        voce={{ em: em("na sua loja", de), nota: "recebe o pedido" }}
        fornecedor={{ em: em("pra esse fornecedor", de) - 0.1, nota: "embala e envia" }}
        ligacoes={{
          clienteVoce: em("na sua loja", de) + 0.2,
          voceFornecedor: em("você repassa o pedido", de),
          fornecedorCliente: em("embala e manda direto", de),
        }}
        rotulos={{ clienteVoce: "pedido", voceFornecedor: "repassa o pedido", fornecedorCliente: "manda direto pra casa" }}
        dy={40}
      />
    </Cena>
  );
};

/** "...o ponto mais importante da aula inteira: você só paga o fornecedor depois que o cliente já te pagou. Não antes. Depois." */
export const Ponto: React.FC = () => {
  const de = T.ponto;
  const ate = T.jaComprou;
  const tNao = em("Não antes", de);
  const tDepois = em("Depois", tNao);
  return (
    <Cena de={de} ate={ate} zoom={0.04}>
      <Palco>
        <Rotulo em={em("o ponto mais importante", de) - 0.1} cor={COR.texto}>
          O ponto mais importante da aula
        </Rotulo>
        <Fala
          texto="Você só paga o fornecedor *depois* que o cliente já te pagou."
          frase="você só paga o fornecedor depois que o cliente já te pagou"
          depois={de}
          tamanho={100}
          largura={1560}
          style={{ marginTop: 36 }}
        />
        <div style={{ display: "flex", alignItems: "baseline", gap: 60, marginTop: 70 }}>
          <Revela em={tNao - 0.05} y={20}>
            <span
              style={{ fontFamily: FONTE.sans, fontWeight: 600, fontSize: 84, letterSpacing: "-0.04em", color: COR.suave }}
            >
              <Riscado em={tNao + 0.35}>Não antes.</Riscado>
            </span>
          </Revela>
          <Revela em={tDepois - 0.08} y={20} escala={0.9}>
            <span style={{ fontSize: 132 }}>
              <Destaque>Depois.</Destaque>
            </span>
          </Revela>
        </div>
      </Palco>
    </Cena>
  );
};

const PedidoCard: React.FC<{ tComprou: number; tEnviado: number; tChegou: number; tCerto: number }> = ({
  tComprou,
  tEnviado,
  tChegou,
  tCerto,
}) => {
  const frame = useCurrentFrame();
  const passos = [
    { nome: "Compra confirmada", nota: "pagamento aprovado", em: tComprou },
    { nome: "Pedido enviado", nota: "a caminho", em: tEnviado },
    { nome: "Entregue", nota: "na sua casa", em: tChegou },
  ];
  const ok = prog(frame, tCerto, 0.5);
  return (
    <Vidro style={{ width: 600, padding: "40px 44px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            fontFamily: FONTE.mono,
            fontSize: 19,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: COR.apagado,
          }}
        >
          Pedido #48213
        </div>
        <div style={{ opacity: ok, transform: `scale(${(0.9 + 0.1 * ok).toFixed(4)})` }}>
          <Etiqueta
            icone={<Check size={18} strokeWidth={2.6} color={COR.verde} />}
            cor={COR.verde}
            style={{
              borderColor: "rgba(94,227,161,0.35)",
              background: "rgba(94,227,161,0.08)",
              fontSize: 17,
              padding: "9px 16px",
            }}
          >
            Tudo certo
          </Etiqueta>
        </div>
      </div>
      <div style={{ marginTop: 18, fontFamily: FONTE.sans, fontWeight: 600, fontSize: 44, letterSpacing: "-0.03em" }}>
        Sua compra online
      </div>
      <div style={{ marginTop: 30 }}>
        {passos.map((p, i) => {
          const a = prog(frame, p.em - 0.1, 0.5);
          const proximo = i < passos.length - 1 ? prog(frame, passos[i + 1].em - 0.1, 0.5) : 0;
          return (
            <div
              key={p.nome}
              style={{ display: "flex", gap: 22, alignItems: "flex-start", paddingBottom: i < 2 ? 26 : 0, position: "relative" }}
            >
              {i < 2 && (
                <div
                  style={{
                    position: "absolute",
                    left: 17,
                    top: 40,
                    bottom: 2,
                    width: 2,
                    background: COR.fraco,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${(proximo * 100).toFixed(2)}%`,
                      backgroundImage: DEGRADE_FORTE,
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 36,
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  backgroundImage: a > 0.5 ? DEGRADE_FORTE : undefined,
                  border: a > 0.5 ? "none" : `2px solid ${COR.fraco}`,
                }}
              >
                {a > 0.5 && <Check size={20} strokeWidth={2.8} color="#FFFFFF" />}
              </div>
              <div style={{ opacity: 0.35 + 0.65 * a }}>
                <div style={{ fontFamily: FONTE.sans, fontWeight: 600, fontSize: 32, letterSpacing: "-0.02em" }}>
                  {p.nome}
                </div>
                <div style={{ fontFamily: FONTE.sans, fontSize: 24, color: COR.suave, marginTop: 2 }}>{p.nota}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Vidro>
  );
};

/** "Pô, isso muda tudo, tá? ...você já tenha comprado de uma loja que funciona assim ... nunca encostou no produto." */
export const JaComprou: React.FC = () => {
  const de = T.jaComprou;
  const ate = T.cap2;
  const tProvavel = em("é bem provável", de);
  const tCard = em("já tenha comprado", de);
  const tComprou = em("Você comprou", de);
  const tChegou = em("o pacote chegou", de);
  const tCerto = em("tava tudo certo", de);
  const tPunch = em("aquela loja nunca encostou", de);
  return (
    <Cena de={de} ate={ate}>
      <FundoVideo clipe={BROLL.pacote} de={de} ate={ate} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Fala
          texto="Pô, isso muda *tudo*."
          frase="Pô, isso muda tudo"
          depois={de}
          tamanho={128}
          alinhar="center"
          ate={tProvavel - 0.5}
        />
      </AbsoluteFill>
      <Palco linha gap={110}>
        <div style={{ flex: 1 }}>
          <Rotulo em={tProvavel}>Não sei se você sabe</Rotulo>
          <div style={{ position: "relative", marginTop: 34, minHeight: 330 }}>
            <Fala
              texto="Você já comprou de uma loja assim e *nem percebeu*."
              em={tProvavel + 0.2}
              intervalo={0.08}
              tamanho={84}
              largura={880}
              ate={tPunch - 0.45}
            />
            <Fala
              texto="A loja *nunca encostou* no produto."
              frase="aquela loja nunca encostou no produto"
              depois={de}
              tamanho={100}
              largura={880}
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          </div>
        </div>
        <Revela em={tCard} y={50}>
          <PedidoCard tComprou={tComprou} tEnviado={(tComprou + tChegou) / 2} tChegou={tChegou} tCerto={tCerto} />
        </Revela>
      </Palco>
    </Cena>
  );
};
