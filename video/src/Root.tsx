import React from "react";
import { Composition } from "remotion";
import { Aula1 } from "./Aula1";
import { DURACAO, FPS } from "./lib/tempo";

/**
 * Aula1: versão principal (sem legenda na imagem; a legenda vai no arquivo .srt para o YouTube).
 * Aula1Legendada: a mesma edição com legenda na imagem, para redes sociais e WhatsApp.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Aula1"
      component={Aula1}
      durationInFrames={Math.ceil(DURACAO * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ legendas: false }}
    />
    <Composition
      id="Aula1Legendada"
      component={Aula1}
      durationInFrames={Math.ceil(DURACAO * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ legendas: true }}
    />
  </>
);
