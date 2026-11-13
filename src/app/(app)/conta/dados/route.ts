import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  certificates,
  comments,
  lessonProgress,
  lessons,
  notes,
  payments,
  plans,
  quizAttempts,
  userAchievements,
  users,
} from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/dal";
import { rateLimit } from "@/lib/rate-limit";

/**
 * "Baixar os meus dados": devolve em um arquivo tudo o que a plataforma guarda sobre a pessoa logada
 * (direito de acesso e de portabilidade da LGPD). A senha não entra — ela nem pode ser lida.
 */
export async function GET(): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return new Response("Entre na sua conta para baixar os seus dados.", { status: 401 });

  const limit = rateLimit(`export:${user.id}`, 10, 10 * 60_000);
  if (!limit.ok) return new Response("Muitos pedidos seguidos. Tente de novo em alguns minutos.", { status: 429 });

  const [[profile], progress, userNotes, userComments, attempts, achievements, userCertificates, userPayments] =
    await Promise.all([
      db
        .select({
          lastActiveDay: users.lastActiveDay,
          longestStreak: users.longestStreak,
        })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1),
      db
        .select({ aula: lessons.title, concluidaEm: lessonProgress.completedAt })
        .from(lessonProgress)
        .innerJoin(lessons, eq(lessons.id, lessonProgress.lessonId))
        .where(eq(lessonProgress.userId, user.id))
        .orderBy(desc(lessonProgress.completedAt)),
      db
        .select({ aula: lessons.title, texto: notes.content, atualizadaEm: notes.updatedAt })
        .from(notes)
        .innerJoin(lessons, eq(lessons.id, notes.lessonId))
        .where(eq(notes.userId, user.id)),
      db
        .select({ aula: lessons.title, texto: comments.content, publicadoEm: comments.createdAt })
        .from(comments)
        .innerJoin(lessons, eq(lessons.id, comments.lessonId))
        .where(eq(comments.userId, user.id))
        .orderBy(desc(comments.createdAt)),
      db
        .select({
          aula: lessons.title,
          acertos: quizAttempts.score,
          perguntas: quizAttempts.total,
          aprovado: quizAttempts.passed,
          em: quizAttempts.createdAt,
        })
        .from(quizAttempts)
        .innerJoin(lessons, eq(lessons.id, quizAttempts.lessonId))
        .where(eq(quizAttempts.userId, user.id))
        .orderBy(desc(quizAttempts.createdAt)),
      db
        .select({ conquista: userAchievements.key, em: userAchievements.unlockedAt })
        .from(userAchievements)
        .where(eq(userAchievements.userId, user.id)),
      db
        .select({ codigo: certificates.id, trilha: certificates.trackTitle, emitidoEm: certificates.issuedAt })
        .from(certificates)
        .where(eq(certificates.userId, user.id)),
      db
        .select({
          plano: plans.name,
          valorEmCentavos: payments.amountCents,
          situacao: payments.status,
          forma: payments.method,
          em: payments.createdAt,
        })
        .from(payments)
        .leftJoin(plans, eq(plans.id, payments.planId))
        .where(eq(payments.userId, user.id))
        .orderBy(desc(payments.createdAt)),
    ]);

  const data = {
    geradoEm: new Date(),
    cadastro: {
      nome: user.name,
      email: user.email,
      contaCriadaEm: user.createdAt,
      xp: user.xp,
      maiorSequenciaDeDias: profile?.longestStreak ?? user.longestStreak,
      ultimoDiaDeEstudo: profile?.lastActiveDay ?? null,
    },
    plano: user.subscription
      ? {
          nome: user.subscription.planName,
          ativo: user.subscription.active,
          acessoAte: user.subscription.currentPeriodEnd,
        }
      : null,
    aulasConcluidas: progress,
    anotacoes: userNotes,
    comentarios: userComments,
    quizzes: attempts,
    conquistas: achievements,
    certificados: userCertificates,
    pagamentos: userPayments,
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="meus-dados.json"',
      "Cache-Control": "no-store",
    },
  });
}
