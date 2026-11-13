import Link from "next/link";
import { BookOpen, Clock, Gift, Mic } from "lucide-react";
import { LessonObjectives } from "@/components/lesson/lesson-objectives";
import { LessonVideo } from "@/components/lesson/lesson-video";
import { Markdown } from "@/components/markdown";
import { LessonReader } from "@/components/marketing/lesson-reader";
import type { FeaturedLesson } from "@/lib/content";
import { formatDuration } from "@/lib/format";
import { keepShortWordsTogether } from "@/lib/utils";
import { toVideoEmbed } from "@/lib/video";

/** O começo do texto (até o fim do 1º capítulo) fica aberto; o restante abre em "Continuar lendo". */
function splitPreview(markdown: string, visibleChapters = 1): { preview: string; rest: string } {
  const lines = markdown.split("\n");
  let chapters = 0;
  for (let index = 0; index < lines.length; index++) {
    if (!lines[index].startsWith("## ")) continue;
    chapters++;
    if (chapters > visibleChapters) {
      return { preview: lines.slice(0, index).join("\n").trim(), rest: lines.slice(index).join("\n").trim() };
    }
  }
  return { preview: markdown.trim(), rest: "" };
}

/**
 * A primeira aula, aberta na página inicial para qualquer visitante (só aulas grátis chegam aqui).
 * Com vídeo cadastrado na aula, ele aparece no topo e o texto vira a transcrição.
 */
export function FirstLesson({ featured, signedIn }: { featured: FeaturedLesson; signedIn: boolean }) {
  const { lesson, track, position, next } = featured;
  const hasVideo = Boolean(toVideoEmbed(lesson.videoUrl));
  const { preview, rest } = splitPreview(lesson.content);
  const lessonPath = `/aula/${lesson.id}`;
  const duration = formatDuration(lesson.durationMinutes);

  return (
    <section id="aula-1" aria-labelledby="aula-1-titulo" className="container-page pt-16 lg:pt-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="eyebrow">
            Aula {position} · {signedIn ? "grátis" : "grátis, sem cadastro"}
          </p>
          <h2 id="aula-1-titulo" className="mt-3 text-[34px] leading-[1.12] font-bold text-balance lg:text-[42px]">
            {keepShortWordsTogether(lesson.title)}
          </h2>
          {lesson.summary ? (
            <p className="text-ink mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed">{lesson.summary}</p>
          ) : null}
          <ul className="text-muted mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            <li className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" />
              {hasVideo ? `${duration} de vídeo` : `${duration} de leitura`}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <BookOpen className="size-4" aria-hidden="true" />
              Trilha {track.title}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Gift className="size-4" aria-hidden="true" />
              Aberta para todo mundo
            </li>
          </ul>
        </div>

        {hasVideo ? (
          <div className="mt-10">
            <LessonVideo
              url={lesson.videoUrl}
              title={lesson.title}
              summary={lesson.summary}
              moduleLabel={featured.moduleTitle}
              color={track.color}
            />
          </div>
        ) : null}

        <div className="mt-8">
          <LessonObjectives objectives={lesson.objectives} />
        </div>

        <article className="card mt-6 p-6 sm:p-10" aria-label={`Texto da aula: ${lesson.title}`}>
          <div className="border-line mb-7 flex items-center gap-3 border-b pb-6">
            <span className="bg-hero grid size-11 shrink-0 place-items-center rounded-full text-white">
              <Mic className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-navy-900 text-[15px] leading-tight font-semibold">Professor</p>
              <p className="text-muted mt-0.5 text-sm">
                {hasVideo ? "Transcrição da aula" : "A aula escrita do jeito que é falada"}
              </p>
            </div>
          </div>
          <LessonReader
            preview={<Markdown>{preview}</Markdown>}
            rest={rest ? <Markdown>{rest}</Markdown> : null}
            moreLabel="Continuar lendo a aula"
          />
        </article>

        {/* Próximo passo */}
        <div className="card border-brand-100 mt-6 flex flex-col gap-5 border p-6 sm:p-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-navy-900 text-[17px] leading-snug font-semibold">
              {signedIn ? "Agora é com você" : "Gostou? A próxima aula também é grátis"}
            </p>
            <p className="text-ink mt-1 text-[15px] leading-relaxed">
              {signedIn
                ? "Faça o quiz da aula, marque as tarefas e ganhe os seus primeiros pontos."
                : `Crie sua conta grátis para fazer o quiz, guardar o seu progresso e seguir ${
                    next ? `para a aula ${position + 1}, “${next.title}”` : "com a trilha"
                  }.`}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            {signedIn ? (
              <Link href={lessonPath} className="btn btn-primary">
                Fazer o quiz da aula
              </Link>
            ) : (
              <>
                <Link href={`/cadastro?next=${encodeURIComponent(lessonPath)}`} className="btn btn-pink">
                  Continuar de graça
                </Link>
                <Link href={`/entrar?next=${encodeURIComponent(lessonPath)}`} className="btn btn-outline">
                  Já tenho conta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
