/**
 * Dados iniciais da plataforma.
 *
 * Só preenche o que estiver vazio, então pode rodar mais de uma vez sem duplicar nada:
 *   npm run db:seed
 *
 * O conteúdo das trilhas fica em scripts/content, um arquivo por trilha.
 * Todas as aulas já vêm com texto, tarefas e quizzes; os vídeos podem ser
 * adicionados depois, em /admin/conteudo.
 */

import "./load-env";
import { count, eq } from "drizzle-orm";
import { db } from "../src/db";
import { lessonTasks, lessons, modules, plans, quizOptions, quizQuestions, tracks, users } from "../src/db/schema";
import { hashPassword } from "../src/lib/auth/password";
import { TRACKS } from "./content";

// Em produção: não cria o aluno de teste nem senha padrão de admin.
// Use `npm run db:seed -- --production` (funciona no Windows, macOS e Linux).
const isProduction = process.env.NODE_ENV === "production" || process.argv.includes("--production");

/* ------------------------------------------------------------------ */
/* Planos (preços de exemplo — ajuste em /admin/planos)                */
/* ------------------------------------------------------------------ */

const PRO_FEATURES = [
  "Todos os métodos: loja, site, pagamentos e robôs",
  "Anúncios no Facebook, Instagram, TikTok e Google",
  "Produtos, fornecedores e vendas em marketplaces",
  "Tarefas práticas e materiais em cada aula",
  "Certificado ao concluir cada trilha",
];

const PLANS = [
  {
    slug: "pro-mensal",
    name: "Pro Mensal",
    description: "Todos os métodos liberados, pagando mês a mês.",
    priceCents: 4990,
    interval: "MONTH" as const,
    features: PRO_FEATURES,
    highlighted: false,
    sortOrder: 1,
  },
  {
    slug: "pro-anual",
    name: "Pro Anual",
    description: "Todos os métodos liberados o ano inteiro, com desconto.",
    priceCents: 39700,
    interval: "YEAR" as const,
    features: PRO_FEATURES,
    highlighted: true,
    sortOrder: 2,
  },
];

/** Texto provisório para uma aula que ainda não tem conteúdo (o aluno vê). */
const COMING_SOON = `> ✍️ **Aula em produção.** O material completo desta aula está sendo preparado e chega em breve.

Enquanto isso, veja acima o que você vai aprender e use as **Ferramentas** da plataforma para adiantar a prática.
`;

/* ------------------------------------------------------------------ */
/* Execução                                                            */
/* ------------------------------------------------------------------ */

/** Embaralha de forma determinística, para a resposta certa não ficar sempre em primeiro. */
function rotate<T>(items: T[], by: number): T[] {
  const shift = by % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

async function seedPlans() {
  const [{ total }] = await db.select({ total: count() }).from(plans);
  if (total > 0) return console.log("• Planos: já existem, nada a fazer.");

  await db.insert(plans).values(PLANS);
  console.log(`• Planos: ${PLANS.length} criados.`);
}

async function seedUsers() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@vendra.test").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || (isProduction ? "" : "admin12345");

  const [existingAdmin] = await db.select({ id: users.id }).from(users).where(eq(users.role, "ADMIN")).limit(1);

  if (existingAdmin) {
    console.log("• Administrador: já existe, nada a fazer.");
  } else if (!adminPassword) {
    console.log("• Administrador: NÃO criado. Defina ADMIN_PASSWORD no ambiente e rode o seed de novo.");
  } else {
    await db.insert(users).values({
      name: "Administrador",
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      role: "ADMIN",
    });
    console.log(`• Administrador criado → ${adminEmail}${process.env.ADMIN_PASSWORD ? "" : `  senha: ${adminPassword}`}`);
  }

  if (isProduction) return;

  const studentEmail = "aluno@vendra.test";
  const [existingStudent] = await db.select({ id: users.id }).from(users).where(eq(users.email, studentEmail)).limit(1);
  if (existingStudent) return;

  await db.insert(users).values({
    name: "Aluno Teste",
    email: studentEmail,
    passwordHash: await hashPassword("aluno12345"),
  });
  console.log(`• Aluno de teste criado → ${studentEmail}  senha: aluno12345`);
}

async function seedContent() {
  const [{ total }] = await db.select({ total: count() }).from(tracks);
  if (total > 0) return console.log("• Conteúdo: já existe, nada a fazer.");

  let lessonCount = 0;

  for (const [trackIndex, track] of TRACKS.entries()) {
    const [createdTrack] = await db
      .insert(tracks)
      .values({
        slug: track.slug,
        title: track.title,
        description: track.description,
        level: track.level,
        icon: track.icon,
        color: track.color,
        sortOrder: trackIndex,
        published: true,
      })
      .returning({ id: tracks.id });

    for (const [moduleIndex, moduleSeed] of track.modules.entries()) {
      const [createdModule] = await db
        .insert(modules)
        .values({
          trackId: createdTrack.id,
          title: moduleSeed.title,
          description: moduleSeed.description,
          sortOrder: moduleIndex,
          published: true,
        })
        .returning({ id: modules.id });

      for (const [lessonIndex, lesson] of moduleSeed.lessons.entries()) {
        const [createdLesson] = await db
          .insert(lessons)
          .values({
            moduleId: createdModule.id,
            title: lesson.title,
            summary: lesson.summary,
            objectives: lesson.learn,
            durationMinutes: lesson.minutes ?? 8,
            content: lesson.content ?? COMING_SOON,
            isFree: track.free ?? false,
            xpReward: 10,
            sortOrder: lessonIndex,
            published: true,
          })
          .returning({ id: lessons.id });
        lessonCount++;

        if (lesson.tasks?.length) {
          await db
            .insert(lessonTasks)
            .values(lesson.tasks.map((text, sortOrder) => ({ lessonId: createdLesson.id, text, sortOrder })));
        }

        for (const [questionIndex, question] of (lesson.quiz ?? []).entries()) {
          const [createdQuestion] = await db
            .insert(quizQuestions)
            .values({
              lessonId: createdLesson.id,
              text: question.text,
              explanation: question.explanation,
              sortOrder: questionIndex,
            })
            .returning({ id: quizQuestions.id });

          const options = question.options.map((text, index) => ({ text, isCorrect: index === 0 }));
          await db.insert(quizOptions).values(
            rotate(options, questionIndex + lessonIndex + 1).map((option, sortOrder) => ({
              questionId: createdQuestion.id,
              text: option.text,
              isCorrect: option.isCorrect,
              sortOrder,
            })),
          );
        }
      }
    }
  }

  console.log(`• Conteúdo: ${TRACKS.length} trilhas e ${lessonCount} aulas criadas.`);
}

async function main() {
  console.log("\nCarregando dados iniciais…");
  await seedPlans();
  await seedUsers();
  await seedContent();
  console.log("Concluído.\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nFalha ao carregar os dados iniciais:\n", error);
    process.exit(1);
  });
