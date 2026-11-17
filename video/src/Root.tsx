import React from "react";
import { Composition } from "remotion";
import { Aula1 } from "./Aula1";
import { Aula2 } from "./aula2/Aula2";
import { DURACAO_AULA2 } from "./aula2/dados";
import { Aula3 } from "./aula3/Aula3";
import { DURACAO_AULA3 } from "./aula3/tempo";
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
    {/* Aula 2: slides do PDF com marcações animadas, voz do ElevenLabs (video/audio/aula-02) */}
    <Composition id="Aula2" component={Aula2} durationInFrames={Math.ceil(DURACAO_AULA2 * FPS)} fps={FPS} width={1920} height={1080} />
    {/* Aula 3: estilo da aula 1 (fundo escuro, texto no ritmo da fala) com memes e cortes mais rápidos */}
    <Composition
      id="Aula3"
      component={Aula3}
      durationInFrames={Math.ceil(DURACAO_AULA3 * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ legendas: false }}
    />
    <Composition
      id="Aula3Legendada"
      component={Aula3}
      durationInFrames={Math.ceil(DURACAO_AULA3 * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ legendas: true }}
    />
  </>
);
