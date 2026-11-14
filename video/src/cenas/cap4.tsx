import { Check, Clock, Scale, ShoppingBag, Store, Warehouse, type LucideIcon } from "lucide-react";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BROLL } from "../broll";
import {
  Cena,
  Destaque,
  Etiqueta,
  Fala,
  IconeCaixa,
  Palco,
  Revela,
  Riscado,
  Rotulo,
  Vidro,
} from "../componentes/base";
import { FundoVideo } from "../componentes/fundo";
import { TextoDegrade } from "../componentes/graficos";
import { prog, SUAVE } from "../lib/anim";
import { em, fimDe } from "../lib/tempo";
import { T } from "../marcos";
import { COR, FONTE } from "../tema";

const antes = (s: number) => s - 0.15;

const pilula: React.CSSProperties = {
  fontFamily: FONTE.sans,
  textTransform: "none",
  letterSpacing: "-0.01em",
  fontSize: 30,
  padding: "14px 26px 14px 20px",
};

type Item = { texto: React.ReactNode; chave: string; em: number };
type Coluna = { nome: string; icone: LucideIcon; itens: Item[] };

/** Você, fornecedor e cliente: o papel de cada um, item por item, no ritmo da fala. */
export const Papeis: React.FC = () => {
  const de = T.papeis;
  const ate = T.objecao;
  const frame = useCurrentFrame();
  const colunas: Coluna[] = [
    {
      nome: "Você",
      icone: Store,
      itens: [
        { chave: "produto", texto: "Escolhe o produto", em: em("escolhe o produto", de) },
        { chave: "loja", texto: "Monta a loja", em: em("monta a loja", de) },
        { chave: "cliente", texto: "Traz o cliente", em: em("faz o cliente chegar", de) },
        { chave: "atendimento", texto: "Cuida do atendimento", em: em("cuida do atendimento", de) },
      ],
    },
    {
      nome: "Fornecedor",
      icone: Warehouse,
      itens: [
        { chave: "estoque", texto: "Guarda o estoque", em: em("guarda o estoque", de) },
        { chave: "embala", texto: "Embala", em: em("embala e envia", de) },
        { chave: "envia", texto: "Envia", em: fimDe("embala e envia", de) - 0.2 },
      ],
    },
    {
      nome: "Cliente",
      icone: ShoppingBag,
      itens: [
        {
          chave: "compra",
          texto: (
            <>
              Compra de <Destaque>você</Destaque>
            </>
          ),
          em: em("compra de você", de),
        },
      ],
    },
  ];
  const tDeVoce = em("De você, tá", de);
  const tNaoDo = em("Não do fornecedor", de);
  const tConsequencia = em("isso tem uma consequência", de);
  const cliente = prog(frame, tDeVoce, 0.5);
  const voce = prog(frame, tConsequencia, 0.6);
  return (
    <Cena de={de} ate={ate} zoom={0.02}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 }}>
        <div style={{ display: "flex", gap: 36 }}>
          {colunas.map((c, ci) => {
            const tCol = ci === 0 ? de + 0.2 : c.itens[0].em - 0.4;
            const ativo = ci === 0 ? voce : ci === 2 ? cliente * (1 - voce) : 0;
            return (
              <Revela key={c.nome} em={tCol} y={36}>
                <Vidro ativo={ativo} style={{ width: 486, height: 460, padding: "40px 40px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                    <IconeCaixa icone={c.icone} tamanho={80} destaque={ativo > 0.5} />
                    <div style={{ fontFamily: FONTE.sans, fontWeight: 600, fontSize: 50, letterSpacing: "-0.035em" }}>
                      {c.nome}
                    </div>
                  </div>
                  <div style={{ marginTop: 38, display: "flex", flexDirection: "column", gap: 20 }}>
                    {c.itens.map((it) => (
                      <Revela key={it.chave} em={it.em - 0.1} y={12}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            fontFamily: FONTE.sans,
                            fontSize: 34,
                            letterSpacing: "-0.02em",
                            color: COR.texto,
                          }}
                        >
                          <Check size={26} strokeWidth={2.4} color={COR.violeta} />
                          <span>{it.texto}</span>
                        </div>
                      </Revela>
                    ))}
                    {ci === 2 && (
                      <Revela em={tNaoDo - 0.1} y={12} style={{ marginTop: 14, paddingLeft: 42 }}>
                        <div style={{ fontFamily: FONTE.sans, fontSize: 30, color: COR.suave }}>
                          <Riscado em={tNaoDo + 0.3}>do fornecedor</Riscado>
                        </div>
                      </Revela>
                    )}
                  </div>
                </Vidro>
              </Revela>
            );
          })}
        </div>
        <Fala
          texto="Isso tem uma consequência *muito, muito, muito* importante."
          frase="isso tem uma consequência muito muito muito importante"
          depois={de}
          tamanho={56}
          peso={500}
          alinhar="center"
          style={{ marginTop: 60 }}
        />
      </AbsoluteFill>
    </Cena>
  );
};

/** A objeção ("o problema é do fornecedor") e a resposta: "Isso tá errado." */
export const Objecao: React.FC = () => {
  const de = T.objecao;
  const ate = T.porque;
  const frame = useCurrentFrame();
  const tErrado = em("Isso tá errado", de);
  const tErrado2 = em("Isso tá errado", tErrado + 0.3);
  const tPorQue = em("Por quê", de);
  const risco = prog(frame, tErrado + 0.1, 0.5, SUAVE);
  const pulso = prog(frame, tErrado2, 0.25) * (1 - prog(frame, tErrado2 + 0.25, 0.6));
  return (
    <Cena de={de} ate={ate}>
      <FundoVideo clipe={BROLL.clienteEsperando} de={de} ate={ate} />
      <Palco centro>
        <Rotulo em={de + 0.1}>O que muita gente pensa</Rotulo>
        <div style={{ position: "relative", marginTop: 36 }}>
          <Vidro style={{ width: 1420, padding: "54px 70px 54px 120px", opacity: 1 - 0.4 * risco }}>
            <div
              style={{
                position: "absolute",
                top: 18,
                left: 34,
                fontFamily: FONTE.serif,
                fontStyle: "italic",
                fontSize: 190,
                lineHeight: 1,
                color: COR.violeta,
                opacity: 0.55,
              }}
            >
              “
            </div>
            <Fala
              texto="Se quem manda o produto é o fornecedor, então, se atrasar ou chegar quebrado, o problema é dele."
              frase="se quem manda o produto é o fornecedor então se atrasar ou chegar quebrado o problema é dele"
              depois={de}
              tamanho={56}
              peso={500}
              entrelinha={1.26}
            />
          </Vidro>
          <div
            style={{
              position: "absolute",
              left: -20,
              right: -20,
              top: "52%",
              height: 6,
              borderRadius: 6,
              background: COR.vermelho,
              boxShadow: `0 0 24px ${COR.vermelho}`,
              transform: `rotate(-2.5deg) scaleX(${risco.toFixed(4)})`,
              transformOrigin: "left center",
            }}
          />
        </div>
        <div style={{ marginTop: 56, transform: `scale(${(1 + 0.05 * pulso).toFixed(4)})` }}>
          <Fala texto="Isso tá *errado*." frase="Isso tá errado" depois={de} tamanho={116} alinhar="center" />
        </div>
        <Revela em={tPorQue - 0.05} y={10} style={{ marginTop: 18 }}>
          <div style={{ fontFamily: FONTE.serif, fontStyle: "italic", fontSize: 64, color: COR.suave }}>Por quê?</div>
        </Revela>
      </Palco>
    </Cena>
  );
};

/** "Porque, pro cliente, quem vendeu foi você." + o CDC: "a loja responde pelo que vendeu". */
export const Porque: React.FC = () => {
  const de = T.porque;
  const ate = T.atrasou;
  const tCdc = antes(em("E o Código de Defesa", de));
  const chips = [
    { texto: "comprou na sua loja", em: em("Ele comprou na sua loja", de) },
    { texto: "pagou pra você", em: em("pagou pra você", de) },
    { texto: "vai falar com você", em: em("é com você que ele vai falar", de) },
  ];
  const tSigla = em("o CDC", tCdc);
  const tResponde = em("a loja responde pelo que vendeu", tCdc);
  return (
    <>
      <Cena de={de} ate={tCdc}>
        <Palco>
          <Fala
            texto="Pro cliente, quem vendeu foi *você*."
            frase="pro cliente quem vendeu foi você"
            depois={de}
            tamanho={100}
            largura={1600}
          />
          <div style={{ display: "flex", gap: 16, marginTop: 56 }}>
            {chips.map((c) => (
              <Revela key={c.texto} em={c.em - 0.05} y={14}>
                <Etiqueta icone={<Check size={20} strokeWidth={2.6} color={COR.verde} />} cor={COR.texto} style={pilula}>
                  {c.texto}
                </Etiqueta>
              </Revela>
            ))}
          </div>
        </Palco>
      </Cena>

      <Cena de={tCdc} ate={ate}>
        <Palco>
          <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
            <Revela em={tSigla - 0.05} y={20} escala={0.92}>
              <div style={{ fontFamily: FONTE.mono, fontWeight: 500, fontSize: 190, letterSpacing: "-0.02em", lineHeight: 1 }}>
                <TextoDegrade>CDC</TextoDegrade>
              </div>
            </Revela>
            <div>
              <Fala texto="Código de Defesa do Consumidor" frase="Código de Defesa do Consumidor" depois={tCdc} tamanho={66} />
              <Fala
                texto="a lei que protege quem compra"
                frase="a lei que protege quem compra"
                depois={tCdc}
                tamanho={40}
                peso={400}
                cor={COR.suave}
                style={{ marginTop: 12 }}
              />
            </div>
          </div>
          <Revela em={tResponde - 0.15} y={20} style={{ marginTop: 72 }}>
            <Vidro ativo={1} style={{ padding: "36px 50px 36px 36px", display: "flex", alignItems: "center", gap: 32 }}>
              <IconeCaixa icone={Scale} tamanho={88} destaque />
              <Fala
                texto="A loja responde pelo que *vendeu*."
                frase="a loja responde pelo que vendeu"
                depois={tCdc}
                tamanho={72}
              />
            </Vidro>
          </Revela>
        </Palco>
      </Cena>
    </>
  );
};

/** "Então atrasou? É você que resolve com o cliente, e depois você se acerta com o fornecedor." */
export const Atrasou: React.FC = () => {
  const de = T.atrasou;
  const ate = T.verdade;
  const tAtrasou = em("atrasou", de);
  const tEscolher = antes(em("É por isso que escolher", de));
  const passos = [
    { n: "1", texto: "Você resolve com o cliente.", em: em("É você que resolve", de) },
    { n: "2", texto: "Depois, se acerta com o fornecedor.", em: em("e depois você se acerta", de) },
  ];
  const tTrilha = em("tem uma trilha inteira", de);
  return (
    <>
      <Cena de={de} ate={tEscolher}>
        <Palco>
          <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
            <Revela em={tAtrasou - 0.15} y={14}>
              <IconeCaixa icone={Clock} tamanho={104} />
            </Revela>
            <Fala texto="*Atrasou?*" em={tAtrasou - 0.05} tamanho={150} />
          </div>
          <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 26 }}>
            {passos.map((p) => (
              <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 36 }}>
                <Revela em={p.em - 0.15} y={10}>
                  <div
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: 76,
                      display: "grid",
                      placeItems: "center",
                      border: `1px solid ${COR.linha}`,
                      background: "rgba(255,255,255,0.05)",
                      fontFamily: FONTE.mono,
                      fontSize: 28,
                      color: COR.violeta,
                    }}
                  >
                    {p.n}
                  </div>
                </Revela>
                <Fala texto={p.texto} em={p.em} intervalo={0.08} tamanho={72} />
              </div>
            ))}
          </div>
        </Palco>
      </Cena>

      <Cena de={tEscolher} ate={ate}>
        <Palco>
          <Fala
            texto="Escolher um bom fornecedor faz *tanta diferença*."
            frase="escolher um bom fornecedor faz tanta diferença"
            depois={tEscolher}
            tamanho={108}
            largura={1500}
          />
          <Revela em={tTrilha - 0.1} y={16} style={{ marginTop: 64 }}>
            <Etiqueta icone={<Warehouse size={20} color={COR.violeta} />}>
              Tem uma trilha inteira sobre isso · Produtos e fornecedores
            </Etiqueta>
          </Revela>
        </Palco>
      </Cena>
    </>
  );
};
