import React from "react";
import { AbsoluteFill } from "remotion";
import { Cena, Destaque, Fala, Palco, Revela, Riscado, Rotulo } from "../componentes/base";
import { Triangulo } from "../componentes/graficos";
import { em, fimDe } from "../lib/tempo";
import { T } from "../marcos";
import { COR, FONTE } from "../tema";

const antes = (s: number) => s - 0.15;

/**
 * "Que fique claro: dropshipping é só o nome desse modelo em inglês. Não é outra coisa, não é segredo, não é esquema.
 * Drop é deixar, shipping é envio. O fornecedor 'deixa'... sem passar por você. ...é vender sem estoque. Mesma coisa."
 */
export const Dropshipping: React.FC = () => {
  const de = T.dropshipping;
  const ate = T.cap4;
  const bOutra = antes(em("Não é outra coisa", de));
  const bDrop = antes(em("Drop é deixar", de));
  const bDeixa = antes(em("O fornecedor deixa", de));
  const bEntao = antes(em("Então, quando você vir", de));

  const negacoes = [
    { texto: "outra coisa", frase: "Não é outra coisa" },
    { texto: "segredo", frase: "não é segredo" },
    { texto: "esquema", frase: "não é esquema" },
  ];
  const palavras = [
    { en: "drop", pt: "deixar", frase: "Drop é deixar" },
    { en: "shipping", pt: "envio", frase: "shipping é envio" },
  ];

  return (
    <>
      <Cena de={de} ate={bOutra}>
        <Palco centro>
          <Rotulo em={de + 0.1}>Que fique claro</Rotulo>
          <Fala
            texto="dropshipping"
            frase="dropshipping"
            depois={de}
            tamanho={200}
            alinhar="center"
            style={{ marginTop: 26, letterSpacing: "-0.055em" }}
          />
          <Fala
            texto="é só o nome desse modelo em *inglês*."
            frase="é só o nome desse modelo em inglês"
            depois={de}
            tamanho={56}
            peso={500}
            cor={COR.suave}
            alinhar="center"
            style={{ marginTop: 20 }}
          />
        </Palco>
      </Cena>

      <Cena de={bOutra} ate={bDrop}>
        <Palco>
          {negacoes.map((n) => (
            <Revela key={n.texto} em={em(n.frase, bOutra) - 0.1} y={20}>
              <div
                style={{
                  fontFamily: FONTE.sans,
                  fontWeight: 600,
                  fontSize: 112,
                  letterSpacing: "-0.045em",
                  lineHeight: 1.18,
                }}
              >
                <span style={{ color: COR.apagado }}>Não é </span>
                <Riscado em={fimDe(n.frase, bOutra) + 0.05}>{n.texto}</Riscado>
                <span style={{ color: COR.apagado }}>.</span>
              </div>
            </Revela>
          ))}
        </Palco>
      </Cena>

      <Cena de={bDrop} ate={bDeixa}>
        <Palco linha style={{ justifyContent: "center" }}>
          {palavras.map((w, i) => {
            const t0 = em(w.frase, bDrop);
            return (
              <div
                key={w.en}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px 60px",
                  borderLeft: i ? `1px solid ${COR.linha}` : undefined,
                }}
              >
                <Revela em={t0 - 0.1} y={30}>
                  <div style={{ fontFamily: FONTE.sans, fontWeight: 600, fontSize: 210, letterSpacing: "-0.055em", lineHeight: 1 }}>
                    {w.en}
                  </div>
                </Revela>
                <Revela em={em(w.pt, t0) - 0.08} y={20} style={{ marginTop: 24 }}>
                  <div style={{ fontSize: 112, lineHeight: 1 }}>
                    <Destaque>{w.pt}</Destaque>
                  </div>
                </Revela>
              </div>
            );
          })}
        </Palco>
      </Cena>

      <Cena de={bDeixa} ate={bEntao} zoom={0.02}>
        <Triangulo
          cliente={{ em: bDeixa + 0.2, nota: "recebe direto" }}
          voce={{ em: bDeixa + 0.1, nota: "não toca no produto" }}
          fornecedor={{ em: bDeixa + 0.15, nota: "deixa o produto" }}
          ligacoes={{
            clienteVoce: bDeixa + 0.3,
            voceFornecedor: bDeixa + 0.4,
            fornecedorCliente: em("o produto direto com o seu cliente", bDeixa) - 0.2,
          }}
          rotulos={{ clienteVoce: "pedido", voceFornecedor: "pedido", fornecedorCliente: "direto pro cliente" }}
          voceApagaEm={em("sem passar por você", bDeixa)}
          dy={70}
        />
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 116 }}>
          <Fala
            texto="Direto com o seu cliente, *sem passar por você*."
            frase="direto com o seu cliente sem passar por você"
            depois={bDeixa}
            tamanho={56}
            peso={500}
            alinhar="center"
          />
        </AbsoluteFill>
      </Cena>

      <Cena de={bEntao} ate={ate}>
        <Palco centro>
          <Fala texto="dropshipping" frase="dropshipping" depois={bEntao} tamanho={136} alinhar="center" />
          <Revela em={em("é vender sem estoque", bEntao) - 0.05} y={10}>
            <div style={{ fontFamily: FONTE.sans, fontSize: 96, lineHeight: 1.1, color: COR.apagado }}>=</div>
          </Revela>
          <Fala
            texto="vender sem *estoque*"
            frase="vender sem estoque"
            depois={bEntao}
            tamanho={136}
            alinhar="center"
          />
          <Fala
            texto="Mesma coisa."
            frase="Mesma coisa"
            depois={bEntao}
            tamanho={50}
            peso={500}
            cor={COR.suave}
            alinhar="center"
            style={{ marginTop: 44 }}
          />
        </Palco>
      </Cena>
    </>
  );
};
