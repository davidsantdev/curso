import Link from "next/link";
import { Crown } from "lucide-react";
import { plural } from "@/lib/format";

/** Chamada para assinar, mostrada para quem está no plano grátis. */
export function UpgradeBanner({ lockedLessons }: { lockedLessons: number }) {
  if (lockedLessons <= 0) return null;

  return (
    <section className="bg-night relative overflow-hidden rounded-3xl p-7 text-white sm:p-9">
      <div className="night-glow" aria-hidden="true" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#6c5cff,#f25fdc)] shadow-[0_10px_24px_-10px_rgb(214_84_230/0.7)]">
            <Crown className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl leading-tight font-semibold">Libere todos os métodos</h2>
            <p className="mt-1.5 max-w-xl text-[16px] leading-relaxed text-white/65">
              São {plural(lockedLessons, "aula", "aulas")} de loja, site, pagamentos, robôs e anúncios esperando por
              você — com tarefas práticas e certificado em cada trilha.
            </p>
          </div>
        </div>
        <Link href="/assinatura" className="btn btn-pink btn-lg shrink-0">
          Ver planos
        </Link>
      </div>
    </section>
  );
}
