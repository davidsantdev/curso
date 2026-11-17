import Link from "next/link";
import {
  ArrowRight,
  Award,
  Calculator,
  CircleCheck,
  Flame,
  ListChecks,
  MessageCircle,
  NotebookPen,
  Play,
  Plus,
  TrendingUp,
} from "lucide-react";
import { TrackBadge } from "@/components/icons";
import { ArtChecklist, ArtNumbers, ArtPractice } from "@/components/marketing/feature-art";
import { FirstLesson } from "@/components/marketing/first-lesson";
import { HeroShowcase } from "@/components/marketing/hero-showcase";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ProductMock } from "@/components/marketing/product-mock";
import { PlanCards } from "@/components/plan-cards";
import { PrelaunchNote } from "@/components/prelaunch";
import { AccessBadge } from "@/components/track-access-badge";
import { site } from "@/config/site";
import { getCurrentUser } from "@/lib/auth/dal";
import { listActivePlans } from "@/lib/billing";
import { getCatalog, getFeaturedLesson, trackAccess, trackLessons, videoProgress } from "@/lib/content";
import { formatDuration, plural } from "@/lib/format";

const REASONS = [
  {
    art: ArtChecklist,
    title: "Do zero, na ordem certa",
    text: "Você começa entendendo o modelo e avança um passo de cada vez. Sempre sabe qual é a próxima aula.",
  },
  {
    art: ArtPractice,
    title: "Aprenda fazendo",
    text: "Cada aula termina com tarefas práticas para aplicar no seu negócio no mesmo dia.",
  },
  {
    art: ArtNumbers,
    title: "Números sem mistério",
    text: "Calculadoras de margem e de anúncios para decidir com a conta feita, não no palpite.",
  },
];

const STEPS = [
  {
    title: "Crie a sua conta grátis",
    text: "Leva menos de um minuto e não pedimos cartão de crédito.",
  },
  {
    title: "Faça a trilha Vender sem estoque",
    text: "Grátis do começo ao fim: o modelo explicado, o que você precisa e o seu plano de 30 dias.",
  },
  {
    title: "Escolha os seus métodos",
    text: "Loja, site, pagamentos, robôs e anúncios no Facebook, Instagram, TikTok e Google.",
  },
  {
    title: "Pratique e acompanhe a evolução",
    text: "Tarefas, quizzes, XP, sequência de estudos e certificado em cada trilha.",
  },
];

const FEATURES = [
  { icon: TrendingUp, title: "Progresso sempre visível", text: "Veja quanto falta em cada trilha e continue de onde parou." },
  { icon: ListChecks, title: "Tarefas práticas", text: "Uma lista do que fazer depois de cada aula, para sair do papel." },
  { icon: CircleCheck, title: "Quizzes com explicação", text: "Teste o que aprendeu e entenda o porquê de cada resposta." },
  { icon: Flame, title: "Sequência e conquistas", text: "Ganhe XP, mantenha a constância e desbloqueie conquistas." },
  { icon: Calculator, title: "Calculadoras", text: "Simule margem, preço mínimo e retorno de anúncios em segundos." },
  { icon: Award, title: "Certificados", text: "Certificado com código de verificação ao concluir uma trilha." },
  { icon: NotebookPen, title: "Anotações por aula", text: "Guarde as suas ideias junto do conteúdo, sem perder nada." },
  { icon: MessageCircle, title: "Dúvidas e comentários", text: "Pergunte e troque experiências em cada aula." },
];

/** Só aparece durante a pré-estreia (`site.prelaunch`). */
const PRELAUNCH_FAQ = {
  question: "Por que o preço está tão baixo?",
  answer:
    "Porque o curso está em pré-estreia. Todas as aulas já estão no ar em texto, com tarefas e quiz, e os vídeos estão sendo gravados, um por um. Quem assina agora paga o preço de estreia, e os vídeos que saírem durante o acesso já estão incluídos, sem pagar nada a mais.",
};

const FAQ = [
  ...(site.prelaunch ? [PRELAUNCH_FAQ] : []),
  {
    question: "Nunca vendi nada pela internet. Consigo aprender?",
    answer:
      "Sim. A plataforma foi feita para quem está começando do zero: a primeira trilha explica tudo sem termos difíceis, e cada aula termina com uma tarefa simples para você praticar.",
  },
  {
    question: "O que é vender sem estoque?",
    answer:
      "É vender um produto que fica guardado com o fornecedor. Quando alguém compra na sua loja, você repassa o pedido e o fornecedor entrega direto para o cliente. Esse modelo também é conhecido como dropshipping.",
  },
  {
    question: "O que está incluído no plano grátis?",
    answer:
      "A trilha Vender sem estoque completa, com quizzes, tarefas e certificado, além das calculadoras. Você também vê a grade de todos os métodos para decidir se quer ir além. Não pedimos cartão de crédito.",
  },
  {
    question: "Preciso de dinheiro para começar?",
    answer:
      "Você não compra estoque, mas vai precisar de um valor para a plataforma da loja e para os primeiros anúncios. A trilha inicial ajuda você a definir um limite seguro antes de investir.",
  },
  {
    question: "Preciso aparecer em vídeo ou ter seguidores?",
    answer:
      "Não. Dá para vender sem mostrar o rosto e sem ter seguidores: os anúncios levam os clientes até a sua loja.",
  },
  {
    question: "Vocês garantem que eu vou vender?",
    answer:
      "Não — e desconfie de quem garante. Ninguém controla o mercado, o produto ou a sua execução. O que entregamos é método, prática e ferramentas para você tomar decisões melhores.",
  },
  {
    question: "Como funciona o pagamento? Tem cobrança automática?",
    answer:
      "Você paga uma vez — por Pix, cartão (em até 12x) ou boleto — e libera o acesso por 1 mês ou 1 ano. Não existe cobrança automática: quando o período termina, você decide se quer renovar.",
  },
  {
    question: "E se eu me arrepender da compra?",
    answer:
      "Você tem 7 dias depois da compra para pedir o reembolso, sem precisar explicar o motivo. É só escrever para o nosso atendimento.",
  },
];

export default async function HomePage() {
  const [user, catalog, plans, featured] = await Promise.all([
    getCurrentUser(),
    getCatalog(),
    listActivePlans(),
    getFeaturedLesson(),
  ]);

  const startHref = user ? "/painel" : "/cadastro";
  const totalLessons = catalog.reduce((sum, track) => sum + trackLessons(track).length, 0);
  const totalMinutes = catalog.reduce(
    (sum, track) => sum + trackLessons(track).reduce((acc, lesson) => acc + lesson.durationMinutes, 0),
    0,
  );
  const stats = [
    { value: String(totalLessons), label: "aulas" },
    { value: String(catalog.length), label: "trilhas" },
    { value: `${Math.round(totalMinutes / 60)} h`, label: "de conteúdo" },
  ];

  return (
    <>
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="bg-night relative overflow-hidden">
        <div className="night-glow" aria-hidden="true" />
        <div className="night-grid" aria-hidden="true" />
        <div className="container-page grid grid-cols-1 items-center gap-20 pt-14 pb-24 lg:grid-cols-[1.03fr_1fr] lg:gap-14 lg:pt-24 lg:pb-32">
          <div className="max-w-[600px]">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pr-4 pl-1.5 text-[13px] text-white/75">
              <span className="rounded-full bg-[linear-gradient(135deg,#6c5cff,#f25fdc)] px-2.5 py-1 font-mono text-[10.5px] leading-none font-semibold tracking-[0.1em] text-white uppercase">
                Grátis
              </span>
              Trilha inicial completa, sem cartão de crédito
            </p>
            <h1 className="mt-7 text-[46px] leading-[1.02] font-semibold sm:text-[60px] lg:text-[66px]">
              Venda pela internet <span className="accent whitespace-nowrap">sem ter estoque</span>
            </h1>
            <p className="mt-6 max-w-[540px] text-[18px] leading-relaxed text-white/65">
              Você não precisa comprar produto, ter loja física nem experiência. Aprenda do zero a montar a sua loja,
              receber pagamentos, automatizar com robôs e anunciar no Facebook, Instagram, TikTok e Google.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={startHref} className="btn btn-pink btn-lg">
                {user ? "Continuar estudando" : "Começar grátis"}
                <ArrowRight className="size-4.5" aria-hidden="true" />
              </Link>
              <Link href={featured ? "#aula-1" : "/cursos"} className="btn btn-glass btn-lg">
                <Play className="size-4 fill-current" aria-hidden="true" />
                {featured ? `Assistir à aula ${featured.position}` : "Ver o que você vai aprender"}
              </Link>
            </div>
            {totalLessons > 0 ? (
              <ul className="mt-12 grid max-w-[480px] grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {stats.map((stat) => (
                  <li key={stat.label}>
                    <p className="text-[30px] leading-none font-semibold tracking-[-0.04em] text-white">{stat.value}</p>
                    <p className="mt-2 font-mono text-[11.5px] tracking-[0.14em] text-white/45 uppercase">{stat.label}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <HeroShowcase className="mx-auto w-full max-w-[560px] lg:mr-0 lg:ml-auto" priority />
        </div>
      </section>

      {/* ------------------- Aula 1, aberta para todo mundo ---------------- */}
      {featured ? <FirstLesson featured={featured} signedIn={Boolean(user)} /> : null}

      {/* ------------------- Vender sem estoque: o modelo ------------------ */}
      <HowItWorks startHref={startHref} />

      {/* ----------------------------- Métodos ---------------------------- */}
      <section id="metodos" className="bg-surface py-24 lg:py-32">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Métodos</p>
            <h2 className="mt-4 text-[40px] leading-[1.05] font-semibold lg:text-[52px]">
              Tudo o que você precisa para fazer a <span className="accent">primeira venda</span>
            </h2>
            <p className="text-ink mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed">
              {catalog.length > 0
                ? `${plural(catalog.length, "trilha", "trilhas")} e ${plural(totalLessons, "aula", "aulas")}, do produto ao anúncio. Comece pela trilha grátis e libere os métodos quando quiser.`
                : "As primeiras trilhas estão sendo preparadas. Crie a sua conta para ser avisado."}
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {catalog.map((track) => {
              const lessonList = trackLessons(track);
              const minutes = lessonList.reduce((sum, lesson) => sum + lesson.durationMinutes, 0);
              return (
                <Link
                  key={track.id}
                  href={`/cursos#${track.slug}`}
                  className="card group flex flex-col p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgb(18_18_43/0.35)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <TrackBadge icon={track.icon} color={track.color} />
                    <AccessBadge access={trackAccess(track)} />
                  </div>
                  <h3 className="group-hover:text-brand-600 mt-5 text-[17px] leading-snug font-semibold">
                    {track.title}
                  </h3>
                  <p className="text-ink mt-2 line-clamp-3 text-sm leading-relaxed">{track.description}</p>
                  <p className="text-muted mt-auto pt-5 font-mono text-[11px] tracking-[0.08em] uppercase">
                    {plural(lessonList.length, "aula", "aulas")} · {formatDuration(minutes)}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link href="/cursos" className="btn btn-outline">
              Ver a grade completa
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href={startHref} className="btn btn-primary">
              {user ? "Ir para o painel" : "Começar grátis"}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------- Por que aprender aqui --------------------- */}
      <section className="container-page py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[340px_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow">Para iniciantes</p>
            <h2 className="mt-4 text-[40px] leading-[1.05] font-semibold lg:text-[48px]">
              Feita para quem <span className="accent">nunca vendeu nada</span>
            </h2>
            <p className="text-ink mt-5 text-[17px] leading-relaxed">
              Nada de aulas intermináveis nem promessa de dinheiro fácil. Você aprende um passo, executa e segue para o
              próximo.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {REASONS.map((reason) => (
              <article key={reason.title} className="card px-6 pt-8 pb-8 text-center">
                <reason.art className="mx-auto h-32 w-auto" />
                <h3 className="mt-6 text-lg leading-tight font-semibold">{reason.title}</h3>
                <p className="text-ink mt-2.5 text-[15px] leading-relaxed">{reason.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------- Comece em 4 passos ---------------------- */}
      <section id="passos" className="bg-surface overflow-x-clip py-24 lg:py-32">
        <div className="container-page grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Como começar</p>
            <h2 className="mt-4 text-[40px] leading-[1.05] font-semibold lg:text-[52px]">
              Comece em <span className="accent">4 passos</span>
            </h2>

            <ol className="mt-10 space-y-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-5 rounded-2xl p-4 transition-colors hover:bg-white">
                  <span className="text-brand-600 border-brand-100 grid size-12 shrink-0 place-items-center rounded-2xl border bg-white font-mono text-[15px] font-semibold shadow-[0_8px_20px_-12px_rgb(108_92_255/0.5)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg leading-tight font-semibold">{step.title}</h3>
                    <p className="text-ink mt-1.5 text-[15px] leading-relaxed">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="pb-10 lg:pb-0">
            <ProductMock />
          </div>
        </div>
      </section>

      {/* ----------------------------- Recursos --------------------------- */}
      <section className="bg-night relative overflow-hidden py-24 lg:py-32">
        <div className="night-glow" aria-hidden="true" />
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Por dentro da plataforma</p>
            <h2 className="mt-4 text-[40px] leading-[1.05] font-semibold lg:text-[52px]">
              Tudo para você <span className="accent">estudar e executar</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-white/60">
              Cada aula vira uma tarefa, e cada tarefa te deixa mais perto da primeira venda.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="glass rounded-3xl p-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,#6c5cff,#f25fdc)] text-white shadow-[0_10px_24px_-10px_rgb(214_84_230/0.7)]">
                  <feature.icon className="size-5.5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-[17px] leading-tight font-semibold">{feature.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/55">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Planos ---------------------------- */}
      <section id="planos" className="bg-surface py-24 lg:py-32">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Planos</p>
            <h2 className="mt-4 text-[40px] leading-[1.05] font-semibold lg:text-[52px]">
              Comece grátis. <span className="accent">Evolua quando quiser.</span>
            </h2>
            <p className="text-ink mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed">
              Pague por Pix, cartão ou boleto. Sem renovação automática e com 7 dias de garantia.
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

          <PrelaunchNote progress={videoProgress(catalog)} className="mt-12" />
        </div>
      </section>

      {/* ------------------------------ Dúvidas --------------------------- */}
      <section id="duvidas" className="container-page py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[360px_1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Dúvidas frequentes</p>
            <h2 className="mt-4 text-[40px] leading-[1.05] font-semibold lg:text-[48px]">
              Antes de você <span className="accent">perguntar</span>
            </h2>
            <p className="text-ink mt-5 text-[17px] leading-relaxed">
              Não achou a resposta? Escreva para{" "}
              <a href={`mailto:${site.supportEmail}`} className="text-brand-600 font-medium underline underline-offset-4">
                {site.supportEmail}
              </a>
              .
            </p>
          </div>

          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.question}
                className="group border-line hover:border-brand-200 rounded-2xl border bg-white px-6 py-5 transition open:pb-6 open:shadow-[0_18px_40px_-26px_rgb(18_18_43/0.3)]"
              >
                <summary className="text-navy-900 flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="bg-surface text-brand-600 group-open:bg-brand-500 grid size-8 shrink-0 place-items-center rounded-full transition group-open:rotate-45 group-open:text-white">
                    <Plus className="size-4" aria-hidden="true" />
                  </span>
                </summary>
                <p className="text-ink mt-3 max-w-2xl text-[16px] leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- Chamada final ----------------------- */}
      <section className="bg-night relative overflow-hidden py-24 text-center lg:py-32">
        <div className="night-glow" aria-hidden="true" />
        <div className="night-grid" aria-hidden="true" />
        <div className="container-page">
          <h2 className="mx-auto max-w-3xl text-[40px] leading-[1.04] font-semibold sm:text-[54px] lg:text-[62px]">
            Sua primeira venda começa com a <span className="accent">primeira aula</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-white/60">
            Crie a sua conta grátis e comece hoje pela trilha Vender sem estoque. Você decide o ritmo.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href={startHref} className="btn btn-pink btn-lg">
              {user ? "Ir para o painel" : "Criar conta grátis"}
              <ArrowRight className="size-4.5" aria-hidden="true" />
            </Link>
            <Link href="/cursos" className="btn btn-glass btn-lg">
              Ver o que você vai aprender
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
