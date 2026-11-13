import Link from "next/link";
import { ArrowDown, ArrowRight, CreditCard, Store, Truck, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Store,
    who: "Você",
    title: "Você anuncia",
    text: "Escolhe um produto de um fornecedor e coloca à venda na sua loja. Por exemplo: uma garrafa térmica por R$ 99.",
    box: "bg-brand-50 text-brand-600",
  },
  {
    icon: CreditCard,
    who: "Cliente",
    title: "O cliente compra",
    text: "Ele paga os R$ 99 na sua loja, por Pix ou cartão. O dinheiro da venda vem para você.",
    box: "bg-magenta-50 text-magenta-600",
  },
  {
    icon: Truck,
    who: "Fornecedor",
    title: "O fornecedor entrega",
    text: "Você repassa o pedido (R$ 45, no exemplo) e ele envia o produto direto para a casa do cliente.",
    box: "bg-mint-50 text-mint-600",
  },
];

/** Explica o modelo "vender sem estoque" para quem nunca ouviu falar de dropshipping. */
export function HowItWorks({ startHref }: { startHref: string }) {
  return (
    <section id="como-funciona" className="container-page py-20 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Vender sem estoque</p>
        <h2 className="mt-3 text-4xl leading-[1.12] font-bold lg:text-[44px]">
          Você vende. <span className="block">O fornecedor entrega.</span>
        </h2>
        <p className="text-ink mt-4 text-[17px] leading-relaxed">
          Você não precisa comprar nada antes nem guardar produto em casa. Veja como funciona uma venda:
        </p>
      </div>

      <ol className="mt-14 grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:gap-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="contents">
            <div className="card relative flex flex-col p-7">
              <div className="flex items-center justify-between gap-3">
                <span className={cn("grid size-14 place-items-center rounded-2xl", step.box)}>
                  <step.icon className="size-7" aria-hidden="true" />
                </span>
                <span className="text-muted text-sm font-semibold">
                  {index + 1} · {step.who}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="text-ink mt-2 text-[15px] leading-relaxed">{step.text}</p>
            </div>
            {index < STEPS.length - 1 ? (
              <div className="flex items-center justify-center py-1 lg:py-0" aria-hidden="true">
                <span className="text-brand-500 grid size-10 place-items-center rounded-full bg-white shadow-[0_8px_20px_-10px_rgb(79_70_180/0.5)]">
                  <ArrowDown className="size-5 lg:hidden" />
                  <ArrowRight className="hidden size-5 lg:block" />
                </span>
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="bg-hero relative mt-6 overflow-hidden rounded-3xl p-7 text-white sm:p-9">
        <div className="absolute -top-16 -right-10 size-56 rounded-full bg-white/10" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/20">
              <Wallet className="size-7" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-2xl leading-tight font-bold text-white">Você fica com a diferença</h3>
              <p className="mt-1.5 max-w-xl text-[16px] leading-relaxed text-white/90">
                Do que sobra, você paga as taxas e os anúncios — o resto é o seu lucro. Sem estoque parado, sem depósito
                e sem embalar nada.
              </p>
            </div>
          </div>
          <Link href={startHref} className="btn btn-white btn-lg shrink-0">
            Começar a trilha grátis
          </Link>
        </div>
      </div>

      <p className="text-ink mx-auto mt-8 max-w-2xl text-center text-[16px] leading-relaxed">
        Esse modelo tem nome: <strong className="text-navy-900 font-semibold">dropshipping</strong>. Não sabia? Sem
        problema — a trilha <strong className="text-navy-900 font-semibold">Vender sem estoque</strong> explica tudo do
        zero, e é grátis. E, se aparecer outra palavra estranha pelo caminho, o{" "}
        <Link href="/glossario" className="text-brand-600 hover:text-brand-700 font-semibold underline underline-offset-2">
          dicionário
        </Link>{" "}
        resolve.
      </p>
    </section>
  );
}
