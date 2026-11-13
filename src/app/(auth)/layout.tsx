import { CircleCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { HeroIllustration } from "@/components/marketing/hero-illustration";

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
        <div className="bg-hero relative flex h-full flex-col justify-between overflow-hidden rounded-[32px] p-12 xl:p-14">
          <div className="max-w-md">
            <h2 className="text-[40px] leading-[1.1] font-bold text-white">Seu negócio online começa com a primeira aula</h2>
            <ul className="mt-8 space-y-3.5">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-[16px] text-white/95">
                  <CircleCheck className="size-5 shrink-0" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <HeroIllustration className="mx-auto -mb-6 h-auto w-full max-w-[560px]" />
        </div>
      </aside>
    </div>
  );
}
