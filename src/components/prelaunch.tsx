/**
 * Avisos da pré-estreia (ligada em `site.prelaunch`): o curso está no ar em texto e os vídeos estão sendo gravados,
 * por isso o preço é de estreia. Tudo aqui some quando a pré-estreia é desligada.
 */
import Link from "next/link";
import { Check, Clapperboard } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress";
import { site } from "@/config/site";
import type { VideoProgress } from "@/lib/content";
import { cn } from "@/lib/utils";

const readyLabel = ({ withVideo, total }: VideoProgress) =>
  `${withVideo} de ${total} ${total === 1 ? "aula" : "aulas"} já com vídeo`;

/** Faixa fina no topo das páginas públicas. */
export function PrelaunchBar({ progress }: { progress: VideoProgress }) {
  if (!site.prelaunch || progress.total === 0) return null;
  return (
    <div className="bg-night-950 border-b border-white/7 text-white/85">
      <p className="container-page py-2.5 text-center text-[13px] sm:text-[13.5px] lg:flex lg:flex-wrap lg:items-center lg:justify-center lg:gap-x-2 lg:gap-y-1">
        <Clapperboard
          className="mr-1.5 inline size-4 shrink-0 -translate-y-px align-middle text-white/80 lg:mr-0"
          aria-hidden="true"
        />
        <span className="lg:hidden">
          <strong className="font-semibold">Pré-estreia:</strong> vídeos em gravação ({progress.withVideo} de{" "}
          {progress.total} prontos) e preço de estreia.
        </span>
        <span className="hidden lg:inline">
          <strong className="font-semibold">Pré-estreia:</strong> os vídeos das aulas estão sendo gravados (
          {readyLabel(progress)}). Por isso, o preço é de estreia.
        </span>{" "}
        <Link href="/precos#pre-estreia" className="font-semibold whitespace-nowrap underline underline-offset-4">
          Entenda
        </Link>
      </p>
    </div>
  );
}

/** Explica o preço de estreia, perto dos planos. */
export function PrelaunchNote({ progress, className }: { progress: VideoProgress; className?: string }) {
  if (!site.prelaunch || progress.total === 0) return null;
  const percent = Math.round((progress.withVideo / progress.total) * 100);
  return (
    <section
      id="pre-estreia"
      className={cn("card border-line mx-auto grid max-w-4xl scroll-mt-24 gap-8 border p-7 sm:p-9 md:grid-cols-[1fr_300px]", className)}
    >
      <div>
        <p className="eyebrow">Pré-estreia</p>
        <h2 className="mt-3 text-2xl leading-tight font-semibold sm:text-[30px]">Por que o preço está tão baixo?</h2>
        <p className="text-ink mt-3 text-[16px] leading-relaxed">
          O {site.name} está em pré-estreia. Todas as {progress.total} aulas já estão no ar em texto, com tarefas e quiz,
          e os vídeos estão sendo gravados, um por um. Enquanto isso, o plano Pro sai pelo preço de estreia.
        </p>
        <ul className="mt-5 space-y-2.5">
          {[
            "Cada vídeo novo aparece na aula assim que fica pronto",
            "Os vídeos que saírem durante o seu acesso já estão incluídos, sem pagar nada a mais",
            "As aulas que ainda não têm vídeo aparecem marcadas como “vídeo em breve”",
          ].map((item) => (
            <li key={item} className="text-ink flex items-start gap-3 text-[15px] leading-snug">
              <span className="bg-mint-50 text-mint-600 mt-0.5 grid size-5 shrink-0 place-items-center rounded-full">
                <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-surface flex flex-col justify-center rounded-3xl p-6">
        <span className="bg-brand-50 text-brand-600 grid size-12 place-items-center rounded-2xl">
          <Clapperboard className="size-6" aria-hidden="true" />
        </span>
        <p className="text-navy-900 mt-4 text-[38px] leading-none font-semibold tracking-[-0.04em] tabular-nums">
          {progress.withVideo}
          <span className="text-muted text-lg font-medium tracking-normal"> de {progress.total}</span>
        </p>
        <p className="text-ink mt-1.5 text-sm">aulas já com vídeo</p>
        <ProgressBar value={percent} label="Aulas já com vídeo" size="sm" className="mt-4" />
      </div>
    </section>
  );
}

/** Selo das aulas que ainda não têm vídeo. */
export function VideoSoonBadge({ className }: { className?: string }) {
  if (!site.prelaunch) return null;
  return (
    <span className={cn("badge bg-surface text-muted", className)}>
      <Clapperboard className="size-3" aria-hidden="true" />
      Vídeo em breve
    </span>
  );
}

/** Situação dos vídeos de uma trilha, para o cabeçalho dela. */
export function trackVideoLabel({ withVideo, total }: VideoProgress): string {
  if (withVideo === 0) return "Vídeos em gravação";
  if (withVideo === total) return "Todas com vídeo";
  return `${withVideo} de ${total} com vídeo`;
}
