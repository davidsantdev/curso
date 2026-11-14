import { ArrowRight, Check, House, Package, ShoppingBag, Store } from "lucide-react";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BROLL } from "../broll";
import {
  Cena,
  Contador,
  Etiqueta,
  Fala,
  IconeCaixa,
  Palco,
  Revela,
  Rotulo,
  Vidro,
} from "../componentes/base";
import { MolduraVideo } from "../componentes/fundo";
import { Garrafa, GradeGarrafas, TextoDegrade } from "../componentes/graficos";
import { prog, SUAVE } from "../lib/anim";
import { em, fimDe } from "../lib/tempo";
import { T } from "../marcos";
import { COR, FONTE } from "../tema";

/** "Tô usando número redondo aqui, só pra você enxergar a lógica, tá bom? Não é promessa de nada." */
export const Ilustrativo: React.FC = () => {
  const de = T.ilustrativo;
  const ate = T.garrafa;
  return (
    <Cena de={de} ate={ate}>
      <Palco centro>
        <Fala texto="Números redondos," em={de + 0.15} intervalo={0.1} tamanho={120} alinhar="center" />
        <Fala
          texto="só pra enxergar a *lógica*."
          em={em("só pra você enxergar", de)}
          intervalo={0.1}
          tamanho={120}
          alinhar="center"
        />
        <Revela em={em("Não é promessa de nada", de) - 0.1} style={{ marginTop: 60 }}>
          <Etiqueta icone={<span style={{ width: 8, height: 8, borderRadius: 8, background: COR.rosa }} />}>
            Valores ilustrativos · não é promessa
          </Etiqueta>
        </Revela>
      </Palco>
    </Cena>
  );
};

/** "Você acha um fornecedor que vende uma garrafa térmica por 45 reais. Você coloca essa garrafa na sua loja por 99." */
export const CenaGarrafa: React.FC = () => {
  const de = T.garrafa;
  const ate = T.venda;
  const tGarrafa = em("garrafa térmica", de);
  const t45 = em("por 45 reais", de);
  const t99 = em("por 99", de);
  const linha = (rotulo: string, valor: React.ReactNode, quando: number, destaque = false) => (
    <Revela em={quando - 0.15} y={16}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          padding: "26px 0",
          borderTop: `1px solid ${COR.linha}`,
        }}
      >
        <span style={{ fontFamily: FONTE.sans, fontSize: 32, color: COR.suave, letterSpacing: "-0.015em" }}>{rotulo}</span>
        <span style={{ fontFamily: FONTE.sans, fontWeight: 600, fontSize: 80, letterSpacing: "-0.045em" }}>
          {destaque ? <TextoDegrade>{valor}</TextoDegrade> : valor}
        </span>
      </div>
    </Revela>
  );
  return (
    <Cena de={de} ate={ate}>
      <Palco linha gap={150} style={{ justifyContent: "center" }}>
        <div style={{ width: 460, height: 780, display: "grid", placeItems: "center" }}>
          {BROLL.garrafa ? (
            <MolduraVideo clipe={BROLL.garrafa} de={de} ate={ate} style={{ width: 460, height: 700 }} />
          ) : (
            <Garrafa em={tGarrafa - 0.3} altura={690} />
          )}
        </div>
        <Revela em={tGarrafa} y={40}>
          <Vidro style={{ width: 680, padding: "44px 52px 20px" }}>
            <div
              style={{
                fontFamily: FONTE.mono,
                fontSize: 19,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: COR.apagado,
              }}
            >
              Produto
            </div>
            <div
              style={{
                marginTop: 10,
                marginBottom: 26,
                fontFamily: FONTE.sans,
                fontWeight: 600,
                fontSize: 62,
                letterSpacing: "-0.035em",
              }}
            >
              Garrafa térmica
            </div>
            {linha("O fornecedor cobra", <Contador para={45} em={t45} prefixo="R$ " />, t45)}
            {linha("Você vende por", <Contador para={99} em={t99} prefixo="R$ " />, t99, true)}
          </Vidro>
        </Revela>
      </Palco>
    </Cena>
  );
};

/** A venda em 4 etapas: cliente paga, você paga o fornecedor, fornecedor envia, cliente recebe. */
export const Venda: React.FC = () => {
  const de = T.venda;
  const ate = T.sobra;
  const frame = useCurrentFrame();
  const passos = [
    { icone: ShoppingBag, titulo: "Cliente paga", valor: "+ R$ 99", cor: COR.verde, nota: "na sua loja", em: em("paga 99 reais", de) },
    { icone: Store, titulo: "Você paga o fornecedor", valor: "− R$ 45", cor: COR.vermelho, nota: "e passa o endereço", em: em("paga os 45", de) },
    { icone: Package, titulo: "Fornecedor embala e envia", nota: "direto pro cliente", em: em("embala e envia", de) },
    { icone: House, titulo: "Cliente recebe em casa", nota: "e a venda está feita", em: em("o cliente recebe a garrafa", de) },
  ];
  const tPronto = em("Pronto", de);
  return (
    <Cena de={de} ate={ate} zoom={0.02}>
      <Palco centro>
        <Rotulo em={de + 0.1}>Uma venda, do começo ao fim</Rotulo>
        <div style={{ display: "flex", alignItems: "stretch", gap: 18, marginTop: 50 }}>
          {passos.map((p, i) => {
            const ativo = prog(frame, p.em, 0.5) * (i < passos.length - 1 ? 1 - prog(frame, passos[i + 1].em, 0.5) : 1);
            return (
              <React.Fragment key={p.titulo}>
                {i > 0 && (
                  <Revela em={p.em - 0.25} y={0} style={{ alignSelf: "center" }}>
                    <ArrowRight size={34} strokeWidth={1.6} color={COR.apagado} />
                  </Revela>
                )}
                <Revela em={p.em - 0.15} y={30}>
                  <Vidro
                    ativo={ativo}
                    style={{ width: 330, height: 370, padding: "34px 30px", display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <IconeCaixa icone={p.icone} tamanho={76} />
                      <span style={{ fontFamily: FONTE.mono, fontSize: 18, color: COR.apagado, letterSpacing: "0.1em" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: "auto",
                        fontFamily: FONTE.sans,
                        fontWeight: 600,
                        fontSize: 36,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.12,
                      }}
                    >
                      {p.titulo}
                    </div>
                    {p.valor && (
                      <div
                        style={{
                          marginTop: 10,
                          fontFamily: FONTE.sans,
                          fontWeight: 600,
                          fontSize: 46,
                          letterSpacing: "-0.03em",
                          color: p.cor,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {p.valor}
                      </div>
                    )}
                    <div style={{ marginTop: 8, fontFamily: FONTE.sans, fontSize: 24, color: COR.suave }}>{p.nota}</div>
                  </Vidro>
                </Revela>
              </React.Fragment>
            );
          })}
        </div>
        <Revela em={tPronto - 0.1} style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 54,
              display: "grid",
              placeItems: "center",
              background: "rgba(94,227,161,0.14)",
              border: "1px solid rgba(94,227,161,0.4)",
            }}
          >
            <Check size={30} strokeWidth={2.6} color={COR.verde} />
          </div>
          <Fala
            texto="A venda aconteceu e você *nunca encostou* na garrafa."
            frase="a venda aconteceu e você nunca encostou na garrafa"
            depois={de}
            tamanho={50}
            peso={500}
          />
        </Revela>
      </Palco>
    </Cena>
  );
};

/** "Sobraram 54 reais? Sobraram, mas calma..." — o que ainda sai dessa sobra. */
export const Sobra: React.FC = () => {
  const de = T.sobra;
  const ate = T.estrutura;
  const frame = useCurrentFrame();
  const t54 = em("Sobraram 54 reais", de);
  const tPergunta = fimDe("Sobraram 54 reais", de);
  const tCalma = em("Sobraram, mas calma", de);
  const deducoes = [
    { texto: "taxa de pagamento", em: em("a taxa de quem processou", de) },
    { texto: "anúncio", em: em("gastou de anúncio", de) },
    { texto: "e por aí vai…", em: em("e por aí vai", de) },
  ];
  const tAula = em("Eu ainda vou me aprofundar", de);
  const duvida = prog(frame, tCalma, 0.6, SUAVE);
  const numero: React.CSSProperties = {
    fontFamily: FONTE.sans,
    fontWeight: 600,
    fontSize: 130,
    letterSpacing: "-0.05em",
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
  };
  return (
    <Cena de={de} ate={ate}>
      <Palco centro>
        <Rotulo em={de + 0.05}>Quanto sobra?</Rotulo>
        <div style={{ display: "flex", alignItems: "baseline", gap: 34, marginTop: 40 }}>
          <Revela em={de + 0.1} y={20}>
            <span style={{ ...numero, color: COR.suave }}>R$ 99</span>
          </Revela>
          <Revela em={de + 0.3} y={20}>
            <span style={{ ...numero, color: COR.apagado }}>−</span>
          </Revela>
          <Revela em={de + 0.45} y={20}>
            <span style={{ ...numero, color: COR.suave }}>R$ 45</span>
          </Revela>
          <Revela em={t54 - 0.1} y={20}>
            <span style={{ ...numero, color: COR.apagado }}>=</span>
          </Revela>
          <Revela em={t54} y={20}>
            <span style={{ position: "relative", display: "inline-block", opacity: 1 - 0.35 * duvida }}>
              <TextoDegrade style={numero}>
                <Contador para={54} em={t54} duracao={0.8} prefixo="R$ " />
              </TextoDegrade>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -16,
                  height: 4,
                  borderRadius: 4,
                  backgroundImage: "repeating-linear-gradient(90deg, rgba(246,245,251,0.7) 0 14px, transparent 14px 24px)",
                  opacity: duvida,
                }}
              />
            </span>
          </Revela>
          <Revela em={tPergunta - 0.1} y={10}>
            <span style={{ fontFamily: FONTE.serif, fontStyle: "italic", fontSize: 150, lineHeight: 1, color: COR.rosa }}>?</span>
          </Revela>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 76 }}>
          {deducoes.map((d) => (
            <Revela key={d.texto} em={d.em - 0.05} y={16}>
              <Etiqueta
                cor={COR.texto}
                icone={<span style={{ color: COR.vermelho, fontSize: 34, lineHeight: 0.5, marginTop: -4 }}>−</span>}
                style={{ fontFamily: FONTE.sans, textTransform: "none", letterSpacing: "-0.01em", fontSize: 32, padding: "16px 28px" }}
              >
                {d.texto}
              </Etiqueta>
            </Revela>
          ))}
        </div>
        <Revela em={tAula - 0.1} style={{ marginTop: 64 }}>
          <Etiqueta icone={<ArrowRight size={18} color={COR.rosa} />}>Essa conta tem uma aula só pra ela · Aula 02</Etiqueta>
        </Revela>
      </Palco>
    </Cena>
  );
};

/** "Por enquanto, guarda a estrutura: o cliente paga você, você paga o fornecedor e o fornecedor entrega." */
export const Estrutura: React.FC = () => {
  const de = T.estrutura;
  const ate = T.comparacao;
  const linhas = [
    { texto: "O cliente paga *você*.", frase: "o cliente paga você" },
    { texto: "Você paga o *fornecedor*.", frase: "você paga o fornecedor" },
    { texto: "O fornecedor *entrega*.", frase: "o fornecedor entrega" },
  ];
  const tempos: number[] = [];
  linhas.forEach((l, i) => tempos.push(em(l.frase, i === 0 ? de : tempos[i - 1])));
  return (
    <Cena de={de} ate={ate}>
      <Palco>
        <Rotulo em={de + 0.1}>Por enquanto, guarda a estrutura</Rotulo>
        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 26 }}>
          {linhas.map((l, i) => (
            <div key={l.frase} style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <Revela em={tempos[i] - 0.15} y={10}>
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 84,
                    display: "grid",
                    placeItems: "center",
                    border: `1px solid ${COR.linha}`,
                    background: "rgba(255,255,255,0.05)",
                    fontFamily: FONTE.mono,
                    fontSize: 30,
                    color: COR.violeta,
                  }}
                >
                  {i + 1}
                </div>
              </Revela>
              <Fala texto={l.texto} frase={l.frase} depois={i === 0 ? de : tempos[i - 1]} tamanho={96} />
            </div>
          ))}
        </div>
      </Palco>
    </Cena>
  );
};

/** Jeito tradicional (100 garrafas antes da 1ª venda) contra vender sem estoque (R$ 0 em produto). */
export const Comparacao: React.FC = () => {
  const de = T.comparacao;
  const ate = T.cap3;
  const frame = useCurrentFrame();
  const tCem = em("compra cem garrafas", de);
  const tConta = em("Cem vezes 45", de);
  const t4500 = em("4.500 reais", de);
  const tAntes = em("antes de entrar um real sequer", de);
  const tParado = em("E se a garrafa não vender", de);
  const marcas = [
    { texto: "parado", em: em("parada na casa dele", de) },
    { texto: "ocupando espaço", em: em("ocupando espaço", de) },
    { texto: "prendendo dinheiro", em: em("prendendo dinheiro", de) },
  ];
  const tOutro = em("O outro cara", de);
  const tZero = em("gastou zero", de);
  const tZero2 = em("Zero", tZero + 0.4);
  const tPouco = em("E é por isso que esse modelo", de);
  const direita = prog(frame, tOutro - 0.2, 0.8);
  const pulso = prog(frame, tZero2, 0.3) * (1 - prog(frame, tZero2 + 0.3, 0.9));
  const painel: React.CSSProperties = { width: 760, height: 560, padding: "40px 46px", display: "flex", flexDirection: "column" };
  const numeroGrande: React.CSSProperties = {
    fontFamily: FONTE.sans,
    fontWeight: 600,
    fontSize: 84,
    letterSpacing: "-0.05em",
    lineHeight: 1,
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
  };
  return (
    <Cena de={de} ate={ate} zoom={0.02}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
        <div style={{ display: "flex", gap: 44 }}>
          <div style={{ opacity: 1 - 0.4 * direita }}>
            <Revela em={de + 0.2} y={30}>
              <Vidro style={painel}>
                <Rotulo em={de + 0.3}>Jeito tradicional</Rotulo>
                <div style={{ display: "flex", gap: 44, marginTop: 30, flex: 1 }}>
                  {BROLL.estoqueParado ? (
                    <MolduraVideo clipe={BROLL.estoqueParado} de={de} ate={ate} style={{ width: 260, height: 400 }} />
                  ) : (
                    <GradeGarrafas em={tCem} paradoEm={tParado} tamanho={17} />
                  )}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
                    <Revela em={tConta - 0.1} y={12}>
                      <div style={{ fontFamily: FONTE.sans, fontSize: 38, color: COR.suave, fontVariantNumeric: "tabular-nums" }}>
                        100 × R$ 45
                      </div>
                    </Revela>
                    <Revela em={t4500 - 0.1} y={16} style={{ marginTop: 10 }}>
                      <div style={numeroGrande}>
                        <Contador para={4500} em={t4500} duracao={0.9} prefixo="R$ " />
                      </div>
                    </Revela>
                    <Revela em={tAntes - 0.1} y={12} style={{ marginTop: 12 }}>
                      <div style={{ fontFamily: FONTE.sans, fontSize: 28, color: COR.suave }}>antes da 1ª venda</div>
                    </Revela>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 30 }}>
                      {marcas.map((m) => (
                        <Revela key={m.texto} em={m.em - 0.05} y={10}>
                          <Etiqueta style={{ fontSize: 17, padding: "9px 15px" }}>{m.texto}</Etiqueta>
                        </Revela>
                      ))}
                    </div>
                  </div>
                </div>
              </Vidro>
            </Revela>
          </div>
          <div style={{ opacity: 0.3 + 0.7 * direita }}>
            <Revela em={de + 0.35} y={30}>
              <Vidro ativo={direita} style={painel}>
                <Rotulo em={de + 0.45}>Sem estoque</Rotulo>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Revela em={tZero - 0.1} y={16} escala={0.9}>
                    <div
                      style={{
                        ...numeroGrande,
                        fontSize: 200,
                        transform: `scale(${(1 + 0.06 * pulso).toFixed(4)})`,
                        transformOrigin: "left center",
                      }}
                    >
                      <TextoDegrade>R$ 0</TextoDegrade>
                    </div>
                  </Revela>
                  <Revela em={tZero + 0.4} y={12} style={{ marginTop: 16 }}>
                    <div style={{ fontFamily: FONTE.sans, fontSize: 30, color: COR.suave }}>em produto antes da 1ª venda</div>
                  </Revela>
                </div>
              </Vidro>
            </Revela>
          </div>
        </div>
        <div style={{ marginTop: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Fala
            texto="Uma diferença brutal de *risco*."
            frase="uma diferença brutal de risco"
            depois={de}
            tamanho={64}
            alinhar="center"
          />
          <Fala
            texto="Por isso esse modelo é tão usado por quem começa com pouco dinheiro."
            em={tPouco}
            intervalo={0.06}
            tamanho={32}
            peso={400}
            cor={COR.suave}
            alinhar="center"
          />
        </div>
      </AbsoluteFill>
    </Cena>
  );
};
