import type { Metadata } from "next";
import { CalendarX2, LockKeyhole, RefreshCw } from "lucide-react";
import { PageHero, PageHeroText } from "@/components/marketing/page-hero";
import { PlanCards } from "@/components/plan-cards";
import { PrelaunchNote } from "@/components/prelaunch";
import { getCurrentUser } from "@/lib/auth/dal";
import { listActivePlans } from "@/lib/billing";
import { getCatalog, videoProgress } from "@/lib/content";

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
    text: "Pix, cartão parcelado ou boleto, pela Cakto. Os dados do cartão não passam pela gente.",
  },
];

export default async function PricingPage() {
  const [user, plans, catalog] = await Promise.all([getCurrentUser(), listActivePlans(), getCatalog()]);

  return (
    <>
      <PageHero
        eyebrow="Planos"
        title={
          <>
            Invista no seu aprendizado, <span className="accent">não em promessas</span>
          </>
        }
      >
        <PageHeroText>
          Comece grátis com a trilha Vender sem estoque. Quando quiser ir além, libere todos os métodos — loja, site,
          pagamentos, robôs e anúncios — com o plano Pro.
        </PageHeroText>
      </PageHero>

      <div className="container-page pt-14 pb-24 lg:pt-20">
        <PlanCards
          plans={plans}
          viewer={{
            signedIn: Boolean(user),
            isPremium: Boolean(user?.isPremium),
            activePlanId: user?.subscription?.active ? user.subscription.planId : null,
          }}
        />

        <PrelaunchNote progress={videoProgress(catalog)} className="mt-14" />

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
          {PROMISES.map((item) => (
            <div key={item.title} className="text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#6c5cff,#f25fdc)] text-white shadow-[0_10px_24px_-10px_rgb(214_84_230/0.7)]">
                <item.icon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[17px] font-semibold">{item.title}</h2>
              <p className="text-ink mt-1.5 text-[15px] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
