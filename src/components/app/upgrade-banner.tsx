import Link from "next/link";
import { Crown } from "lucide-react";
import { plural } from "@/lib/format";

/** Chamada para assinar, mostrada para quem está no plano grátis. */
export function UpgradeBanner({ lockedLessons }: { lockedLessons: number }) {
  if (lockedLessons <= 0) return null;

  return (
    <section className="bg-hero relative overflow-hidden rounded-3xl p-7 text-white sm:p-9">
      <div className="absolute -top-16 -right-10 size-56 rounded-full bg-white/10" aria-hidden="true" />
      <div className="absolute right-40 -bottom-20 size-40 rounded-full bg-white/10" aria-hidden="true" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/20">
            <Crown className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl leading-tight font-bold text-white">Libere todos os métodos</h2>
            <p className="mt-1.5 max-w-xl text-[16px] leading-relaxed text-white/90">
              São {plural(lockedLessons, "aula", "aulas")} de loja, site, pagamentos, robôs e anúncios esperando por
              você — com tarefas práticas e certificado em cada trilha.
            </p>
          </div>
        </div>
        <Link href="/assinatura" className="btn btn-white btn-lg shrink-0">
          Ver planos
        </Link>
      </div>
    </section>
  );
}
