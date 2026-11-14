import React from "react";
import { AbsoluteFill, Html5Audio, staticFile, useCurrentFrame } from "remotion";
import { MUSICA } from "./broll";
import { Abertura, Duvida, Perguntas, Titulo } from "./cenas/abertura";
import { Caminho, Fornecedor, JaComprou, NaoEsta, Ponto } from "./cenas/cap1";
import { CenaGarrafa, Comparacao, Estrutura, Ilustrativo, Sobra, Venda } from "./cenas/cap2";
import { Dropshipping } from "./cenas/cap3";
import { Atrasou, Objecao, Papeis, Porque } from "./cenas/cap4";
import { NaoE, Vantagem, Verdade } from "./cenas/cap5";
import { Proxima, Tarefas } from "./cenas/cap6";
import { Etiqueta, Fala, Revela } from "./componentes/base";
import { Acabamento, Fundo } from "./componentes/fundo";
import { CenaCapitulo } from "./componentes/graficos";
import { Hud, Legenda, SeloIlustrativo } from "./componentes/hud";
import { prog, SUAVE } from "./lib/anim";
import { em, q } from "./lib/tempo";
import { T, TRECHOS_HUD } from "./marcos";
import { Sons } from "./sons";
import { COR, FONTE } from "./tema";

const complemento = (texto: string, quando: number) => (
  <Fala texto={texto} em={quando} intervalo={0.07} tamanho={40} peso={400} cor={COR.suave} style={{ marginTop: 6 }} />
);

/** Aula 1 — Vender sem estoque: o que é e como funciona. A voz manda no tempo de tudo. */
export const Aula1: React.FC<{ legendas: boolean }> = ({ legendas }) => {
  const frame = useCurrentFrame();
  const escurece = prog(frame, T.fim - 1.3, 1.3, SUAVE);
  const abre = 1 - prog(frame, 0, 0.6);
  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo, color: COR.texto, fontFamily: FONTE.sans }}>
      <Fundo />

      <Abertura />
      <Titulo />
      <Duvida />
      <Perguntas />

      <CenaCapitulo
        numero="01"
        titulo="O que é vender sem estoque"
        de={T.cap1}
        ate={T.naoEsta}
        extra={complemento("É exatamente o que o nome diz.", em("é exatamente o que o nome diz", T.cap1))}
      />
      <NaoEsta />
      <Fornecedor />
      <Caminho />
      <Ponto />
      <JaComprou />

      <CenaCapitulo
        numero="02"
        titulo="Do clique à casa do cliente"
        de={T.cap2}
        ate={T.ilustrativo}
        extra={complemento("Com um exemplo, fica fácil.", em("porque com exemplo fica fácil", T.cap2))}
      />
      <Ilustrativo />
      <CenaGarrafa />
      <Venda />
      <Sobra />
      <Estrutura />
      <Comparacao />

      <CenaCapitulo
        numero="03"
        titulo="E esse tal de dropshipping?"
        de={T.cap3}
        ate={T.dropshipping}
        extra={complemento("A palavra que assusta todo mundo.", em("a palavra que assusta", T.cap3))}
      />
      <Dropshipping />

      <CenaCapitulo
        numero="04"
        titulo="Quem faz o quê"
        de={T.cap4}
        ate={T.papeis}
        extra={
          <Revela em={em("São três personagens", T.cap4) - 0.1} y={10}>
            <Etiqueta>3 personagens nessa história</Etiqueta>
          </Revela>
        }
      />
      <Papeis />
      <Objecao />
      <Porque />
      <Atrasou />

      <Verdade />
      <CenaCapitulo
        numero="05"
        titulo="O que vender sem estoque não é"
        de={T.cap5}
        ate={T.naoE}
        extra={complemento("Tem muita promessa errada por aí.", em("tem muita promessa errada", T.cap5))}
      />
      <NaoE />
      <Vantagem />

      <CenaCapitulo
        numero="06"
        titulo="O que você faz com isso"
        de={T.cap6}
        ate={T.tarefas}
        extra={
          <Revela em={em("Duas coisas", T.cap6) - 0.1} y={10}>
            <Etiqueta>2 tarefas + o quiz</Etiqueta>
          </Revela>
        }
      />
      <Tarefas />
      <Proxima />

      <Hud trechos={TRECHOS_HUD} />
      <SeloIlustrativo de={T.garrafa} ate={T.cap3} />
      {legendas ? <Legenda /> : null}
      <Acabamento />
      <AbsoluteFill style={{ backgroundColor: "#000000", opacity: Math.max(escurece, abre) }} />

      <Html5Audio src={staticFile("voz.mp3")} volume={0.92} />
      <Sons />
      {MUSICA ? (
        <Html5Audio
          src={staticFile(MUSICA)}
          loop
          volume={(f) => 0.07 * Math.max(0, Math.min(1, f / q(2), (q(T.fim) - f) / q(2)))}
        />
      ) : null}
    </AbsoluteFill>
  );
};
