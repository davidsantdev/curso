import { BookOpen } from "lucide-react";
import { deepGradient, getTheme } from "@/lib/theme";
import { toVideoEmbed } from "@/lib/video";

export function LessonVideo({
  url,
  title,
  summary,
  moduleLabel,
  color,
}: {
  url: string | null;
  title: string;
  summary: string;
  moduleLabel: string;
  color: string;
}) {
  const embed = toVideoEmbed(url);

  if (!embed) {
    // Sem vídeo: um banner decorativo (o título já aparece logo abaixo).
    const theme = getTheme(color);
    return (
      <div
        className="relative flex min-h-48 items-end overflow-hidden rounded-3xl p-7 text-white sm:min-h-56 sm:p-9"
        style={{ backgroundImage: deepGradient(theme) }}
      >
        <div className="absolute -top-16 -right-10 size-56 rounded-full bg-white/12" aria-hidden="true" />
        <div className="absolute right-40 -bottom-16 size-36 rounded-full bg-white/10" aria-hidden="true" />
        <div className="relative">
          <span className="badge bg-white/90" style={{ color: theme.ink }}>
            <BookOpen className="size-3.5" aria-hidden="true" />
            Aula em texto · {moduleLabel}
          </span>
          {summary ? (
            <p className="mt-4 max-w-xl text-xl leading-snug font-semibold text-white sm:text-2xl">{summary}</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-950 relative aspect-video overflow-hidden rounded-3xl shadow-[0_24px_60px_-30px_rgb(21_21_77/0.6)]">
      {embed.kind === "iframe" ? (
        <iframe
          src={embed.src}
          title={`Vídeo: ${title}`}
          className="absolute inset-0 size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <video src={embed.src} controls playsInline preload="metadata" className="absolute inset-0 size-full">
          Seu navegador não conseguiu reproduzir este vídeo.
        </video>
      )}
    </div>
  );
}
