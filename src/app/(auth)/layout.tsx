import { Check } from "lucide-react";
import { Logo } from "@/components/logo";
import { HeroShowcase } from "@/components/marketing/hero-showcase";

const BENEFITS = [
  "Trilha Vender sem estoque 100% grátis",
  "Veja a grade completa de todos os métodos",
  "Progresso salvo para continuar de onde parou",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <Logo />
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </main>
      </div>

      <aside className="hidden p-4 lg:block">
        <div className="bg-night relative flex h-full flex-col justify-between gap-14 overflow-hidden rounded-[32px] p-12 xl:p-14">
          <div className="night-glow" aria-hidden="true" />
          <div className="night-grid" aria-hidden="true" />
          <div className="max-w-md">
            <h2 className="text-[40px] leading-[1.06] font-semibold xl:text-[46px]">
              Seu negócio online começa com a <span className="accent">primeira aula</span>
            </h2>
            <ul className="mt-8 space-y-3.5">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-[16px] text-white/75">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#6c5cff,#f25fdc)] text-white">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <HeroShowcase className="mx-auto mb-6 w-full max-w-[440px]" />
        </div>
      </aside>
    </div>
  );
}
