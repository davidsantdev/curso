import type { Metadata } from "next";
import { CalendarX2, LockKeyhole, RefreshCw } from "lucide-react";
import { PlanCards } from "@/components/plan-cards";
import { getCurrentUser } from "@/lib/auth/dal";
import { listActivePlans } from "@/lib/billing";

export const metadata: Metadata = {
  title: "Planos",
  description: "Comece grátis e libere todos os métodos quando quiser. Pix, cartão ou boleto, sem renovação automática.",
};

const PROMISES = [
  {
    icon: CalendarX2,
    title: "Sem renovação automática",
    text: "Você paga uma vez pelo período escolhido. Nada é cobrado depois sem você pedir.",
  },
  {
    icon: RefreshCw,
    title: "7 dias de garantia",
    text: "Não era o que esperava? Peça o reembolso em até 7 dias após a compra.",
  },
  {
    icon: LockKeyhole,
    title: "Pagamento seguro",
    text: "Pix, cartão em até 12x ou boleto, pelo Mercado Pago. Os dados do cartão não passam pela gente.",
  },
];

export default async function PricingPage() {
  const [user, plans] = await Promise.all([getCurrentUser(), listActivePlans()]);

  return (
    <div className="container-page pt-12 pb-20 lg:pt-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Planos</p>
        <h1 className="mt-3 text-4xl leading-[1.1] font-bold text-balance lg:text-5xl">
          Invista no seu aprendizado, não em promessas
        </h1>
        <p className="text-ink mt-5 text-[17px] leading-relaxed">
          Comece grátis com a trilha Vender sem estoque. Quando quiser ir além, libere todos os métodos — loja, site,
          pagamentos, robôs e anúncios — com o plano Pro.
        </p>
      </div>

      <div className="mt-14">
        <PlanCards
          plans={plans}
          viewer={{
            signedIn: Boolean(user),
            isPremium: Boolean(user?.isPremium),
            activePlanId: user?.subscription?.active ? user.subscription.planId : null,
          }}
        />
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
        {PROMISES.map((item) => (
          <div key={item.title} className="text-center">
            <span className="bg-brand-50 text-brand-600 mx-auto grid size-12 place-items-center rounded-2xl">
              <item.icon className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-[17px] font-semibold">{item.title}</h2>
            <p className="text-ink mt-1.5 text-[15px] leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
