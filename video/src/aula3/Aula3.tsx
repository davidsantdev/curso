import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Acabamento, Fundo } from "../componentes/fundo";
import { Hud, Legenda } from "../componentes/hud";
import { prog } from "../lib/anim";
import { TempoContexto } from "../lib/contexto";
import { q } from "../lib/tempo";
import { COR, FONTE } from "../tema";
import { Abertura, Anuncios, Cap1, Caminho, Falar, Frente, Loja, LowTicket, Marketplaces, MuitaCoisa, Pagamentos, Passo, Produtos, QuemVende, Rapidinha, Roteiro, Tendencia } from "./cenas-a";
import { AntesProg, Cap2, Cap3, Claro, Codigo, Crescer, Ensinar, Estrategias, Exemplos, Facil, Fechamento, Filme, IA, Melhor, Perguntas, Regra, Resto } from "./cenas-b";
import { camera, Clarao } from "./memes";
import { BATIDAS, em, fimDe, T, TEMPO_AULA3, TRECHOS_HUD } from "./tempo";

/* ------------------------------------------------------------------ */
/* Sons (todos sintetizados: scripts/sfx.py)                           */
/* ------------------------------------------------------------------ */

type Som = { arquivo: string; em: number; volume: number };
const som = (arquivo: string, quando: number, volume: number): Som => ({ arquivo, em: quando, volume });

const CORTES = [
  T.frente, T.caminho, T.roteiro, T.produtos, T.quemVende, T.lowTicket, T.falar, T.tendencia, T.loja,
  T.pagamentos, T.anuncios, T.marketplaces, T.passo, T.codigo, T.antesProg, T.ia, T.ensinar, T.claro,
  T.regra, T.exemplos, T.estrategias, T.perguntas, T.crescer,
];

const tProg = em("programação", em("vai te surpreender"));
const tE = em("É", em("É muita coisa") + 0.5);
const tPasso = em("passo a passo");

const SONS: Som[] = [
  // cortes de cena: um "vuuush" baixinho (o pico do arquivo vem ~0,5 s depois do início)
  ...CORTES.map((s) => som("whoosh", s - 0.45, 0.07)),
  // capítulos: subida + impacto
  ...[T.cap1, T.cap2, T.cap3].flatMap((s) => [som("subida", s - 1.05, 0.16), som("impacto", s + 0.05, 0.26)]),
  // batidas de meme
  ...BATIDAS.map((b) => som(b.forca >= 0.8 ? "boom" : "impacto", b.em - 0.02, b.forca >= 0.8 ? 0.3 : 0.2)),
  // adesivos e memes
  ...[
    em("onde você tá"),
    em("pra onde você vai"),
    em("Calma não precisa se assustar"),
    em("os robôs que vão trabalhar") + 0.2,
    em("preço baixo"),
    em("a parte que eu mais gosto") + 0.4,
    em("jeito fácil"),
    em("a melhor IA do mercado") + 0.25,
    em("a melhor IA do mercado") + 0.45,
    em("não precisa virar programador") + 0.6,
    em("O robô lembra a pessoa") + 0.3,
    em("estratégias", em("enquanto você fica só")) + 0.2,
    em("os anúncios", T.anuncios),
  ].map((s) => som("pop", s - 0.01, 0.2)),
  som("tique", em("rapidinha") - 0.02, 0.22),
  som("glitch", tProg - 0.02, 0.24),
  som("arranhao", tE - 0.02, 0.24),
  som("arranhao", em("Isso mesmo programação") - 0.02, 0.2),
  som("arranhao", fimDe("aquele de filme") + 0.22, 0.2),
  som("glitch", T.codigo + 0.35, 0.12),
  som("caixa", em("vende muito") - 0.05, 0.2),
  som("caixa", em("boleto", T.pagamentos) + 0.6, 0.22),
  som("ding", em("com quem falar") + 1.4, 0.2),
  ...["O robô manda pro fornecedor", "O robô avisa o cliente", "O robô lembra a pessoa"].map((f) => som("ding", em(f) - 0.02, 0.18)),
  ...[0, 1, 2, 3, 4].map((i) => som("tique", tPasso + 0.1 + i * 0.32, 0.12)),
  ...["Pix", "cartão", "boleto"].map((f) => som("clique", em(f, T.pagamentos) - 0.05, 0.14)),
  ...["Facebook", "Instagram", "TikTok", "Google"].map((f) => som("clique", em(f, T.anuncios) - 0.05, 0.14)),
  som("whoosh", T.fimDaFala - 0.1, 0.08),
];

const Sons: React.FC = () => (
  <>
    {SONS.map((s, i) => (
      <Sequence key={i} from={q(Math.max(0, s.em))} durationInFrames={q(2.2)} layout="none">
        <Html5Audio src={staticFile(`sfx/${s.arquivo}.wav`)} volume={s.volume} />
      </Sequence>
    ))}
  </>
);

/* ------------------------------------------------------------------ */
/* A aula                                                              */
/* ------------------------------------------------------------------ */

/** Aula 3 — O que vem pela frente. A voz manda no tempo de tudo; os memes entram nas deixas da fala. */
export const Aula3: React.FC<{ legendas: boolean }> = ({ legendas }) => {
  const frame = useCurrentFrame();
  const abre = 1 - prog(frame, 0, 0.6);
  const fecha = prog(frame, T.fim - 1.2, 1.2);
  return (
    <TempoContexto.Provider value={TEMPO_AULA3}>
      <AbsoluteFill style={{ backgroundColor: COR.fundo, color: COR.texto, fontFamily: FONTE.sans }}>
        <Fundo />
        <AbsoluteFill style={{ transform: camera(frame, BATIDAS) }}>
          <Abertura />
          <Rapidinha />
          <Frente />
          <Caminho />
          <Roteiro />
          <Cap1 />
          <Produtos />
          <QuemVende />
          <LowTicket />
          <Falar />
          <Tendencia />
          <Loja />
          <Pagamentos />
          <Anuncios />
          <Marketplaces />
          <MuitaCoisa />
          <Passo />
          <Cap2 />
          <Codigo />
          <Facil />
          <AntesProg />
          <IA />
          <Melhor />
          <Ensinar />
          <Claro />
          <Resto />
          <Cap3 />
          <Filme />
          <Regra />
          <Exemplos />
          <Estrategias />
          <Perguntas />
          <Crescer />
          <Fechamento />
        </AbsoluteFill>
        {BATIDAS.filter((b) => b.forca >= 0.9).map((b) => (
          <Clarao key={b.em} em={b.em} forca={0.35} />
        ))}
        <Hud trechos={TRECHOS_HUD} />
        {legendas ? <Legenda /> : null}
        <Acabamento />
        <AbsoluteFill style={{ backgroundColor: "#000000", opacity: Math.max(abre, fecha) }} />
        <Html5Audio src={staticFile("aula-03/voz.mp3")} volume={0.92} />
        <Sons />
      </AbsoluteFill>
    </TempoContexto.Provider>
  );
};
