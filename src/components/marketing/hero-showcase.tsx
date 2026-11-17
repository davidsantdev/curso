import Image from "next/image";
import { Award, Circle, Play, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Vitrine da plataforma (decorativa): a janela da aula com a capa do vídeo da aula 1, o progresso da trilha e
 * alguns cartões flutuando. Feita para o fundo escuro.
 */
export function HeroShowcase({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <div className={cn("relative", className)} aria-hidden="true">
      <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(125_114_248/0.45),rgb(242_95_220/0.12)_60%,transparent)] blur-2xl" />

      <div className="glass rounded-[28px] p-3 backdrop-blur-xl">
        <div className="flex items-center gap-2 px-2.5 pt-1 pb-3">
          {["bg-[#ff7a93]", "bg-[#ffd36b]", "bg-[#5ee3a1]"].map((color) => (
            <span key={color} className={cn("size-2.5 rounded-full opacity-80", color)} />
          ))}
          <span className="ml-3 h-6 flex-1 rounded-full bg-white/6 px-3 font-mono text-[11px] leading-6 text-white/40">
            vendra.com.br/aula
          </span>
        </div>

        <div className="bg-night-900 relative aspect-video overflow-hidden rounded-[18px]">
          <Image src="/videos/aula-01.jpg" alt="" fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" priority={priority} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
          <div className="absolute inset-x-4 bottom-4 flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/95 shadow-[0_8px_24px_rgb(0_0_0/0.45)]">
              <Play className="text-navy-900 ml-0.5 size-4.5 fill-current" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="font-mono text-[10.5px] tracking-[0.14em] text-white/60 uppercase">Aula 01 · 7 min</p>
              <p className="mt-1 truncate text-[15px] font-semibold tracking-[-0.02em] text-white">
                O que é e como funciona
              </p>
            </div>
          </div>
        </div>

        <div className="px-2 pt-4 pb-2">
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-medium text-white/80">Trilha Vender sem estoque</span>
            <span className="font-mono text-white/50">25%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/4 rounded-full bg-[linear-gradient(90deg,#8c9bff,#f4a6de)]" />
          </div>
          <ul className="mt-4 space-y-2 text-[13.5px]">
            <li className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/7 px-3 py-2.5 text-white">
              <Play className="size-4 shrink-0 fill-current text-[#b49cfb]" />
              <span className="flex-1">Vender sem estoque: o que é</span>
              <span className="font-mono text-[11px] text-white/40">7 min</span>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-white/4 px-3 py-2.5 text-white/70">
              <Circle className="size-4 shrink-0 text-white/35" />
              <span className="flex-1">Do clique ao lucro</span>
              <span className="font-mono text-[11px] text-white/40">7 min</span>
            </li>
          </ul>
        </div>
      </div>

      {/* cartões flutuando */}
      <div className="animate-float absolute -top-7 -right-3 flex items-center gap-3 rounded-2xl bg-white py-3 pr-5 pl-3 shadow-[0_24px_50px_-18px_rgb(0_0_0/0.6)] sm:-right-8">
        <span className="bg-mint-50 text-mint-600 grid size-10 place-items-center rounded-xl">
          <ShoppingBag className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="text-muted text-xs">Nova venda</p>
          <p className="text-navy-900 text-[15px] font-semibold">R$ 129,90</p>
        </div>
      </div>

      <div className="animate-float-slow glass absolute -bottom-12 -left-3 flex items-center gap-3 rounded-2xl py-3 pr-5 pl-3 backdrop-blur-xl sm:-left-10">
        <span className="grid size-10 place-items-center rounded-xl bg-[linear-gradient(135deg,#6c5cff,#f25fdc)] text-white">
          <Award className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="text-xs text-white/55">Certificado liberado</p>
          <p className="text-[15px] font-semibold text-white">Vender sem estoque</p>
        </div>
      </div>

      <div className="text-brand-600 absolute top-[46%] -right-5 hidden rounded-full bg-white px-3.5 py-2 font-mono text-[12px] font-semibold shadow-[0_14px_30px_-12px_rgb(0_0_0/0.55)] sm:block">
        +10 XP
      </div>
    </div>
  );
}
