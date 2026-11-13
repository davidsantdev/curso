import Link from "next/link";
import { Award, Check, CircleCheck, Crown, FileText, ListChecks, Lock, PlayCircle } from "lucide-react";
import { plural } from "@/lib/format";
import { deepGradient, getTheme } from "@/lib/theme";

/**
 * Prévia de aula bloqueada: um "conteúdo" borrado (decorativo — nenhum texto real
 * da aula vai para a página) com o convite para assinar por cima.
 */
export function LockedPreview({
  color,
  trackSlug,
  minutes,
  hasVideo,
  taskCount,
  questionCount,
  resourceCount,
}: {
  color: string;
  trackSlug: string;
  minutes: number;
  hasVideo: boolean;
  taskCount: number;
  questionCount: number;
  resourceCount: number;
}) {
  const theme = getTheme(color);

  const included = [
    { icon: PlayCircle, text: hasVideo ? `Vídeo de ${minutes} min` : `Aula de ${minutes} min` },
    taskCount > 0 ? { icon: ListChecks, text: plural(taskCount, "tarefa prática", "tarefas práticas") } : null,
    questionCount > 0 ? { icon: CircleCheck, text: `Quiz com ${plural(questionCount, "pergunta", "perguntas")}` } : null,
    resourceCount > 0 ? { icon: FileText, text: plural(resourceCount, "material de apoio", "materiais de apoio") } : null,
    { icon: Award, text: "Certificado ao concluir a trilha" },
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <section className="card grid overflow-hidden" aria-labelledby="paywall-title">
      {/* Conteúdo de mentira, só para dar a sensação do que tem por trás. */}
      <div className="pointer-events-none p-6 blur-[6px] select-none [grid-area:1/1] sm:p-8" aria-hidden="true">
        <div className="aspect-video rounded-2xl" style={{ backgroundImage: deepGradient(theme), opacity: 0.55 }} />
        <div className="mt-8 space-y-3">
          <div className="bg-line h-6 w-1/2 rounded-lg" />
          {[100, 94, 98, 76, 100, 88, 60].map((width, index) => (
            <div key={index} className="bg-line/80 h-3.5 rounded-md" style={{ width: `${width}%` }} />
          ))}
          <div className="bg-line mt-6 h-6 w-1/3 rounded-lg" />
          {[96, 100, 82, 90].map((width, index) => (
            <div key={`b${index}`} className="bg-line/80 h-3.5 rounded-md" style={{ width: `${width}%` }} />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center bg-white/35 p-5 [grid-area:1/1] sm:p-8">
        <div
          className="shadow-float w-full max-w-lg rounded-3xl p-7 text-white sm:p-9"
          style={{ backgroundImage: deepGradient(theme) }}
        >
          <span className="grid size-14 place-items-center rounded-2xl bg-white/20">
            <Lock className="size-7" aria-hidden="true" />
          </span>
          <h2 id="paywall-title" className="mt-5 text-[26px] leading-tight font-bold text-white">
            Esta aula faz parte do plano Pro
          </h2>
          <p className="mt-2 text-[16px] leading-relaxed text-white/90">
            Assine para liberar esta aula e todos os métodos: loja, site, pagamentos, robôs e anúncios no Facebook,
            Instagram, TikTok e Google.
          </p>

          <p className="mt-6 text-sm font-semibold text-white/85">O que vem nesta aula</p>
          <ul className="mt-2 space-y-2">
            {included.map((item) => (
              <li key={item.text} className="flex items-center gap-2.5 text-[15px] text-white">
                <item.icon className="size-4.5 shrink-0" aria-hidden="true" />
                {item.text}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/assinatura" className="btn btn-white">
              <Crown className="size-4" aria-hidden="true" />
              Ver planos
            </Link>
            <Link href={`/trilhas/${trackSlug}`} className="btn btn-glass">
              Voltar para a trilha
            </Link>
          </div>
          <p className="mt-5 flex items-center gap-1.5 text-xs text-white/80">
            <Check className="size-3.5" aria-hidden="true" />
            Sem renovação automática e com 7 dias de garantia.
          </p>
        </div>
      </div>
    </section>
  );
}
