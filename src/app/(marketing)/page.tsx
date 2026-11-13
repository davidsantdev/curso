import Link from "next/link";
import {
  ArrowRight,
  Award,
  Calculator,
  ChevronDown,
  CircleCheck,
  Flame,
  ListChecks,
  MessageCircle,
  NotebookPen,
  TrendingUp,
} from "lucide-react";
import { TrackBadge } from "@/components/icons";
import { ArtChecklist, ArtNumbers, ArtPractice } from "@/components/marketing/feature-art";
import { FirstLesson } from "@/components/marketing/first-lesson";
import { HeroIllustration } from "@/components/marketing/hero-illustration";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ProductMock } from "@/components/marketing/product-mock";
import { PlanCards } from "@/components/plan-cards";
import { AccessBadge } from "@/components/track-access-badge";
import { site } from "@/config/site";
import { getCurrentUser } from "@/lib/auth/dal";
import { listActivePlans } from "@/lib/billing";
import { getCatalog, getFeaturedLesson, trackAccess, trackLessons } from "@/lib/content";
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

const FAQ = [
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

  return (
    <>
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="container-page pt-2 md:pt-4">
        <div className="bg-hero relative rounded-[28px] px-6 pt-12 sm:px-10 md:rounded-[36px] lg:rounded-br-[200px] lg:px-16 lg:py-24">
          <div className="relative z-10 max-w-[560px]">
            <h1 className="text-[40px] leading-[1.08] font-bold text-white sm:text-5xl sm:leading-[1.06] lg:text-[48px] xl:text-[56px]">
              Venda pela internet <span className="block">sem ter estoque</span>
            </h1>
            <p className="mt-6 max-w-[500px] text-[17px] leading-relaxed text-white/90">
              Você não precisa comprar produto, ter loja física nem experiência. Aprenda do zero a montar a sua loja,
              receber pagamentos, automatizar com robôs e anunciar no Facebook, Instagram, TikTok e Google.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href={startHref} className="btn btn-pink btn-lg">
                {user ? "Continuar estudando" : "Começar grátis"}
              </Link>
              <Link href={featured ? "#aula-1" : "/cursos"} className="btn btn-glass btn-lg">
                {featured ? `Ver a aula ${featured.position} grátis` : "Ver o que você vai aprender"}
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/85">Sem cartão de crédito · Trilha inicial 100% grátis</p>
          </div>

          <div className="relative mx-auto mt-6 w-full max-w-[520px] lg:absolute lg:-top-10 lg:right-0 lg:mt-0 lg:w-[46%] lg:max-w-[580px]">
            <HeroIllustration className="h-auto w-full" />
          </div>
        </div>
      </section>

      {/* ------------------- Aula 1, aberta para todo mundo ---------------- */}
      {featured ? <FirstLesson featured={featured} signedIn={Boolean(user)} /> : null}

      {/* ------------------- Vender sem estoque: o modelo ------------------ */}
      <HowItWorks startHref={startHref} />

      {/* ----------------------------- Métodos ---------------------------- */}
      <section id="metodos" className="bg-surface py-20 lg:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Métodos</p>
            <h2 className="mt-3 text-4xl leading-[1.12] font-bold text-balance lg:text-[42px]">
              Tudo o que você precisa para fazer a primeira venda
            </h2>
            <p className="text-ink mt-4 text-[17px] leading-relaxed">
              {catalog.length > 0
                ? `${plural(catalog.length, "trilha", "trilhas")} e ${plural(totalLessons, "aula", "aulas")}, do produto ao anúncio. Comece pela trilha grátis e libere os métodos quando quiser.`
                : "As primeiras trilhas estão sendo preparadas. Crie a sua conta para ser avisado."}
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {catalog.map((track) => {
              const lessonList = trackLessons(track);
              const minutes = lessonList.reduce((sum, lesson) => sum + lesson.durationMinutes, 0);
              return (
                <Link
                  key={track.id}
                  href={`/cursos#${track.slug}`}
                  className="card group flex flex-col p-6 transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-3">
                    <TrackBadge icon={track.icon} color={track.color} />
                    <AccessBadge access={trackAccess(track)} />
                  </div>
                  <h3 className="group-hover:text-brand-600 mt-5 text-[17px] leading-snug font-semibold">
                    {track.title}
                  </h3>
                  <p className="text-ink mt-2 line-clamp-3 text-sm leading-relaxed">{track.description}</p>
                  <p className="text-muted mt-auto pt-4 text-xs">
                    {plural(lessonList.length, "aula", "aulas")} · {formatDuration(minutes)}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
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
      <section className="container-page py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[300px_1fr] lg:items-center lg:gap-16">
          <div>
            <h2 className="text-4xl leading-[1.12] font-bold lg:text-[42px]">Feita para quem nunca vendeu nada</h2>
            <p className="text-ink mt-5 text-[17px] leading-relaxed">
              Nada de aulas intermináveis nem promessa de dinheiro fácil. Você aprende um passo, executa e segue para o
              próximo.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
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
      <section id="passos" className="bg-surface overflow-x-clip py-20 lg:py-28">
        <div className="container-page grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Como começar</p>
            <h2 className="mt-3 text-4xl leading-[1.12] font-bold lg:text-[42px]">Comece em 4 passos</h2>

            <ol className="mt-10 space-y-7">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <span className="bg-brand-gradient shadow-brand grid size-11 shrink-0 place-items-center rounded-2xl text-lg font-bold text-white">
                    {index + 1}
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
      <section className="container-page py-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Por dentro da plataforma</p>
          <h2 className="mt-3 text-4xl leading-[1.12] font-bold lg:text-[42px]">Tudo para você estudar e executar</h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="card p-6">
              <span className="bg-brand-50 text-brand-600 grid size-11 place-items-center rounded-2xl">
                <feature.icon className="size-5.5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-[17px] leading-tight font-semibold">{feature.title}</h3>
              <p className="text-ink mt-2 text-[15px] leading-relaxed">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------ Planos ---------------------------- */}
      <section id="planos" className="bg-surface py-20 lg:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Planos</p>
            <h2 className="mt-3 text-4xl leading-[1.12] font-bold lg:text-[42px]">Comece grátis. Evolua quando quiser.</h2>
            <p className="text-ink mt-4 text-[17px] leading-relaxed">
              Pague por Pix, cartão ou boleto. Sem renovação automática e com 7 dias de garantia.
            </p>
          </div>

          <div className="mt-12">
            <PlanCards
              plans={plans}
              viewer={{
                signedIn: Boolean(user),
                isPremium: Boolean(user?.isPremium),
                activePlanId: user?.subscription?.active ? user.subscription.planId : null,
              }}
            />
          </div>
        </div>
      </section>

      {/* ------------------------------ Dúvidas --------------------------- */}
      <section id="duvidas" className="container-page py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[340px_1fr]">
          <div>
            <p className="eyebrow">Dúvidas frequentes</p>
            <h2 className="mt-3 text-4xl leading-[1.12] font-bold lg:text-[42px]">Antes de você perguntar</h2>
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
              <details key={item.question} className="card group px-6 py-5 open:pb-6">
                <summary className="text-navy-900 flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronDown
                    className="text-brand-500 size-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="text-ink mt-3 max-w-2xl text-[16px] leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- Chamada final ----------------------- */}
      <section className="container-page pb-20 lg:pb-24">
        <div className="bg-hero relative overflow-hidden rounded-[36px] px-6 py-16 text-center sm:px-12 lg:py-20">
          <div className="absolute -top-24 -left-16 size-64 rounded-full bg-white/10" aria-hidden="true" />
          <div className="absolute -right-10 -bottom-28 size-72 rounded-full bg-white/10" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-4xl leading-[1.1] font-bold text-white lg:text-5xl">
              Sua primeira venda começa com a primeira aula
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/90">
              Crie a sua conta grátis e comece hoje pela trilha Vender sem estoque. Você decide o ritmo.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link href={startHref} className="btn btn-pink btn-lg">
                {user ? "Ir para o painel" : "Criar conta grátis"}
              </Link>
              <Link href="/cursos" className="btn btn-glass btn-lg">
                Ver o que você vai aprender
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
