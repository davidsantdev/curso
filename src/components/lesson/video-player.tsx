"use client";

import { Play } from "lucide-react";
import { useRef, useState } from "react";

/**
 * Player para arquivos de vídeo (.mp4/.webm): mostra a capa com um botão de play no visual da marca e,
 * depois do primeiro clique, os controles normais do navegador. A legenda (.vtt) fica disponível no menu.
 */
export function VideoPlayer({
  src,
  poster,
  captions,
  title,
}: {
  src: string;
  poster?: string;
  captions?: string;
  title: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function start() {
    setStarted(true);
    ref.current?.play().catch(() => {
      // Se o navegador recusar o play automático, os controles já estão visíveis para a pessoa tocar.
    });
  }

  return (
    <div className="bg-navy-950 relative aspect-video overflow-hidden rounded-3xl shadow-[0_24px_60px_-30px_rgb(21_21_77/0.6)]">
      <video
        ref={ref}
        src={src}
        poster={poster}
        controls={started}
        playsInline
        preload="metadata"
        className="absolute inset-0 size-full"
        onPlay={() => setStarted(true)}
      >
        {captions ? <track kind="captions" src={captions} srcLang="pt-BR" label="Português" /> : null}
        Seu navegador não conseguiu reproduzir este vídeo.
      </video>
      {started ? null : (
        // A capa inteira é clicável; o botão visível fica no canto, sem cobrir o título da capa.
        <button
          type="button"
          onClick={start}
          aria-label={`Assistir ao vídeo: ${title}`}
          className="group absolute inset-0 cursor-pointer"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-70"
            style={{ backgroundImage: "linear-gradient(to top, rgb(7 7 11 / 0.6), rgb(7 7 11 / 0) 45%)" }}
          />
          <span className="text-navy-900 absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white py-1 pr-3.5 pl-1 text-[13px] font-semibold shadow-[0_12px_30px_-10px_rgb(0_0_0/0.55)] transition-transform duration-200 group-hover:scale-[1.04] sm:bottom-6 sm:left-6 sm:gap-3 sm:py-1.5 sm:pr-5 sm:pl-1.5 sm:text-base">
            <span className="bg-hero grid size-7 place-items-center rounded-full text-white sm:size-11">
              <Play className="ml-0.5 size-3.5 fill-current sm:size-5" aria-hidden="true" />
            </span>
            Assistir à aula
          </span>
        </button>
      )}
    </div>
  );
}
