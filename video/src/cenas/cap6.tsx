import React from "react";
import { useCurrentFrame } from "remotion";
import { Cena, Destaque, Fala, Palco, Revela, Rotulo, Vidro } from "../componentes/base";
import { Barras } from "../componentes/hud";
import { prog } from "../lib/anim";
import { em } from "../lib/tempo";
import { T } from "../marcos";
import { COR, FONTE } from "../tema";

const antes = (s: number) => s - 0.15;

/** As duas tarefas e o quiz, no ritmo da fala. */
export const Tarefas: React.FC = () => {
  const de = T.tarefas;
  const ate = T.proxima;
  const frame = useCurrentFrame();
  const tarefas = [
    {
      n: "01",
      titulo: "Explique, em 3 linhas, como funciona vender sem estoque",
      nota: "Pra alguém da sua casa ou numa anotação.",
      em: em("Primeira: explica", de),
      emNota: em("Pode ser pra alguém", de),
    },
    {
      n: "02",
      titulo: "Anote 2 dúvidas que ficaram",
      nota: "As próximas aulas devem responder.",
      em: em("Segunda: anota", de),
      emNota: em("Elas provavelmente", de),
    },
    {
      n: "03",
      titulo: "Responda o quiz da aula",
      nota: "3 perguntas, rapidinho, e fixa o que importa.",
      em: em("E responde as três perguntas", de),
      emNota: em("que é rapidinho", de),
    },
  ];
  return (
    <Cena de={de} ate={ate} zoom={0.02}>
      <Palco>
        <Rotulo em={de + 0.05}>Sua tarefa agora</Rotulo>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 22, width: 1500 }}>
          {tarefas.map((tf, i) => {
            const ativo = prog(frame, tf.em, 0.5) * (i < tarefas.length - 1 ? 1 - prog(frame, tarefas[i + 1].em, 0.5) : 1);
            return (
              <Revela key={tf.n} em={tf.em - 0.15} y={24}>
                <Vidro ativo={ativo} style={{ padding: "30px 40px", display: "flex", alignItems: "center", gap: 32 }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 14,
                      flexShrink: 0,
                      border: `2px solid ${ativo > 0.5 ? COR.violeta : COR.fraco}`,
                    }}
                  />
                  <span style={{ fontFamily: FONTE.mono, fontSize: 22, color: COR.violeta, letterSpacing: "0.08em" }}>{tf.n}</span>
                  <div>
                    <div style={{ fontFamily: FONTE.sans, fontWeight: 600, fontSize: 44, letterSpacing: "-0.03em" }}>{tf.titulo}</div>
                    <Revela em={tf.emNota - 0.1} y={8}>
                      <div style={{ fontFamily: FONTE.sans, fontSize: 28, color: COR.suave, marginTop: 6 }}>{tf.nota}</div>
                    </Revela>
                  </div>
                </Vidro>
              </Revela>
            );
          })}
        </div>
        <Fala
          texto="Se você consegue explicar, é porque *entendeu*."
          frase="se você consegue explicar é porque entendeu"
          depois={de}
          tamanho={44}
          peso={500}
          cor={COR.suave}
          style={{ marginTop: 40 }}
        />
      </Palco>
    </Cena>
  );
};

/** Próxima aula, "vender ≠ lucrar" e a despedida. */
export const Proxima: React.FC = () => {
  const de = T.proxima;
  const ate = T.fim;
  const tPorque = antes(em("Porque vender é uma coisa", de));
  const tTchau = antes(em("Te vejo lá", de));
  const tVender = em("vender é uma coisa", de);
  const tDiferente = em("e lucrar", de);
  const tLucrar = em("lucrar é outra", de);
  return (
    <>
      <Cena de={de} ate={tPorque}>
        <Palco>
          <Rotulo em={de + 0.1}>Próxima aula</Rotulo>
          <Fala texto="Do clique ao *lucro*." em={de + 0.25} intervalo={0.09} tamanho={170} style={{ marginTop: 26 }} />
          <Fala
            texto="A conta completa, do clique até o que sobra no seu bolso."
            frase="a conta completa do clique até o que sobra no seu bolso"
            depois={de}
            tamanho={48}
            peso={400}
            cor={COR.suave}
            style={{ marginTop: 30 }}
          />
        </Palco>
      </Cena>

      <Cena de={tPorque} ate={tTchau}>
        <Palco centro>
          <div style={{ display: "flex", alignItems: "center", gap: 64 }}>
            <Revela em={tVender - 0.1} y={30}>
              <div style={{ fontFamily: FONTE.sans, fontWeight: 600, fontSize: 180, letterSpacing: "-0.05em", lineHeight: 1 }}>
                Vender
              </div>
            </Revela>
            <Revela em={tDiferente - 0.05} y={0} escala={0.6}>
              <div style={{ fontFamily: FONTE.sans, fontWeight: 400, fontSize: 150, lineHeight: 1, color: COR.apagado }}>≠</div>
            </Revela>
            <Revela em={tLucrar - 0.1} y={30}>
              <div style={{ fontSize: 172, lineHeight: 1 }}>
                <Destaque>lucrar</Destaque>
              </div>
            </Revela>
          </div>
          <Fala
            texto="São coisas completamente diferentes."
            em={em("completamente diferente", de)}
            intervalo={0.08}
            tamanho={48}
            peso={400}
            cor={COR.suave}
            alinhar="center"
            style={{ marginTop: 44 }}
          />
        </Palco>
      </Cena>

      <Cena de={tTchau} ate={ate + 1} zoom={0.03}>
        <Palco centro>
          <Fala texto="Te vejo *lá*." frase="Te vejo lá" depois={de} tamanho={160} alinhar="center" />
          <Revela em={tTchau + 0.6} style={{ marginTop: 54, display: "flex", alignItems: "center", gap: 24 }}>
            <Barras quantidade={7} altura={34} largura={5} />
            <span
              style={{
                fontFamily: FONTE.mono,
                fontSize: 20,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: COR.apagado,
              }}
            >
              Próxima: aula 02 · Do clique ao lucro
            </span>
          </Revela>
        </Palco>
      </Cena>
    </>
  );
};
