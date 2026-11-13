"use server";

import { and, asc, eq, inArray, max, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import {
  lessonResources,
  lessonTasks,
  lessons,
  modules,
  quizOptions,
  quizQuestions,
  tracks,
  TRACK_LEVELS,
} from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { checked, field, lines, rawField, zodErrors, type FormState } from "@/lib/forms";
import { TRACK_ICON_KEYS, TRACK_THEME_KEYS } from "@/lib/theme";
import { slugify } from "@/lib/utils";
import { toVideoEmbed } from "@/lib/video";

/** Qualquer mudança de conteúdo pode aparecer em várias telas: atualiza tudo. */
function refreshEverything() {
  revalidatePath("/", "layout");
}

/* ================================================================== */
/* Trilhas                                                             */
/* ================================================================== */

const trackSchema = z.object({
  title: z.string().trim().min(3, "Dê um título com pelo menos 3 letras").max(80, "O título é longo demais"),
  slug: z.string().trim().max(80, "O endereço é longo demais"),
  description: z.string().trim().max(400, "A descrição passou de 400 caracteres"),
  level: z.enum(TRACK_LEVELS),
  icon: z.enum(TRACK_ICON_KEYS),
  color: z.enum(TRACK_THEME_KEYS),
});

async function uniqueTrackSlug(base: string, ignoreId?: string): Promise<string> {
  const root = base || "trilha";
  for (let attempt = 1; attempt <= 50; attempt++) {
    const candidate = attempt === 1 ? root : `${root}-${attempt}`;
    const [taken] = await db
      .select({ id: tracks.id })
      .from(tracks)
      .where(ignoreId ? and(eq(tracks.slug, candidate), ne(tracks.id, ignoreId)) : eq(tracks.slug, candidate))
      .limit(1);
    if (!taken) return candidate;
  }
  return `${root}-${Date.now()}`;
}

export async function createTrackAction(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const title = field(formData, "title");
  if (title.length < 3) return { ok: false, errors: { title: "Dê um título com pelo menos 3 letras" }, values: { title } };
  if (title.length > 80) return { ok: false, errors: { title: "O título é longo demais" }, values: { title } };

  const [{ last }] = await db.select({ last: max(tracks.sortOrder) }).from(tracks);
  const [created] = await db
    .insert(tracks)
    .values({ title, slug: await uniqueTrackSlug(slugify(title)), sortOrder: (last ?? -1) + 1 })
    .returning({ id: tracks.id });

  refreshEverything();
  redirect(`/admin/conteudo/trilha/${created.id}`);
}

export async function updateTrackAction(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const id = field(formData, "id");
  const raw = {
    title: field(formData, "title"),
    slug: field(formData, "slug"),
    description: field(formData, "description"),
    level: field(formData, "level"),
    icon: field(formData, "icon"),
    color: field(formData, "color"),
  };

  const parsed = trackSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, errors: zodErrors(parsed.error), values: raw };

  const slug = await uniqueTrackSlug(slugify(parsed.data.slug || parsed.data.title), id);

  await db
    .update(tracks)
    .set({ ...parsed.data, slug, published: checked(formData, "published") })
    .where(eq(tracks.id, id));

  refreshEverything();
  return { ok: true, message: "Trilha salva." };
}

export async function deleteTrackAction(formData: FormData): Promise<void> {
  await requireAdmin();
  // Módulos, aulas, progresso e certificados da trilha são apagados em cascata.
  await db.delete(tracks).where(eq(tracks.id, field(formData, "id")));
  refreshEverything();
  redirect("/admin/conteudo");
}

/* ================================================================== */
/* Módulos                                                             */
/* ================================================================== */

export async function createModuleAction(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const trackId = field(formData, "trackId");
  const title = field(formData, "title");
  if (title.length < 3) return { ok: false, errors: { title: "Dê um nome com pelo menos 3 letras" }, values: { title } };
  if (title.length > 100) return { ok: false, errors: { title: "O nome é longo demais" }, values: { title } };

  const [track] = await db.select({ id: tracks.id }).from(tracks).where(eq(tracks.id, trackId)).limit(1);
  if (!track) return { ok: false, message: "Trilha não encontrada." };

  const [{ last }] = await db.select({ last: max(modules.sortOrder) }).from(modules).where(eq(modules.trackId, trackId));
  await db.insert(modules).values({ trackId, title, sortOrder: (last ?? -1) + 1 });

  refreshEverything();
  return { ok: true, message: "Módulo criado." };
}

export async function updateModuleAction(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const id = field(formData, "id");
  const raw = { title: field(formData, "title"), description: field(formData, "description") };

  if (raw.title.length < 3) return { ok: false, errors: { title: "Dê um nome com pelo menos 3 letras" }, values: raw };
  if (raw.title.length > 100) return { ok: false, errors: { title: "O nome é longo demais" }, values: raw };
  if (raw.description.length > 300) {
    return { ok: false, errors: { description: "A descrição passou de 300 caracteres" }, values: raw };
  }

  await db
    .update(modules)
    .set({ ...raw, published: checked(formData, "published") })
    .where(eq(modules.id, id));

  refreshEverything();
  return { ok: true, message: "Módulo salvo." };
}

export async function deleteModuleAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await db.delete(modules).where(eq(modules.id, field(formData, "id")));
  refreshEverything();
}

/* ================================================================== */
/* Ordem (setinhas ↑ ↓)                                                */
/* ================================================================== */

export async function moveItemAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const kind = field(formData, "kind");
  const id = field(formData, "id");
  const step = field(formData, "direction") === "up" ? -1 : 1;

  let siblings: Array<{ id: string }>;

  if (kind === "track") {
    siblings = await db.select({ id: tracks.id }).from(tracks).orderBy(asc(tracks.sortOrder), asc(tracks.createdAt));
  } else if (kind === "module") {
    const [current] = await db.select({ trackId: modules.trackId }).from(modules).where(eq(modules.id, id)).limit(1);
    if (!current) return;
    siblings = await db
      .select({ id: modules.id })
      .from(modules)
      .where(eq(modules.trackId, current.trackId))
      .orderBy(asc(modules.sortOrder), asc(modules.createdAt));
  } else if (kind === "lesson") {
    const [current] = await db.select({ moduleId: lessons.moduleId }).from(lessons).where(eq(lessons.id, id)).limit(1);
    if (!current) return;
    siblings = await db
      .select({ id: lessons.id })
      .from(lessons)
      .where(eq(lessons.moduleId, current.moduleId))
      .orderBy(asc(lessons.sortOrder), asc(lessons.createdAt));
  } else {
    return;
  }

  const index = siblings.findIndex((item) => item.id === id);
  const target = index + step;
  if (index === -1 || target < 0 || target >= siblings.length) return;

  [siblings[index], siblings[target]] = [siblings[target], siblings[index]];

  // Regrava a ordem de todos os irmãos: 0, 1, 2…
  for (const [sortOrder, item] of siblings.entries()) {
    if (kind === "track") await db.update(tracks).set({ sortOrder }).where(eq(tracks.id, item.id));
    else if (kind === "module") await db.update(modules).set({ sortOrder }).where(eq(modules.id, item.id));
    else await db.update(lessons).set({ sortOrder }).where(eq(lessons.id, item.id));
  }

  refreshEverything();
}

/* ================================================================== */
/* Aulas                                                               */
/* ================================================================== */

export async function createLessonAction(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const moduleId = field(formData, "moduleId");
  const title = field(formData, "title");
  if (title.length < 3) return { ok: false, errors: { title: "Dê um título com pelo menos 3 letras" }, values: { title } };
  if (title.length > 120) return { ok: false, errors: { title: "O título é longo demais" }, values: { title } };

  const [parent] = await db.select({ id: modules.id }).from(modules).where(eq(modules.id, moduleId)).limit(1);
  if (!parent) return { ok: false, message: "Módulo não encontrado." };

  const [{ last }] = await db.select({ last: max(lessons.sortOrder) }).from(lessons).where(eq(lessons.moduleId, moduleId));
  // Aulas novas nascem como rascunho: só aparecem para os alunos depois de publicadas.
  await db.insert(lessons).values({ moduleId, title, sortOrder: (last ?? -1) + 1, published: false });

  refreshEverything();
  return { ok: true, message: "Aula criada como rascunho." };
}

const lessonSchema = z.object({
  title: z.string().trim().min(3, "Dê um título com pelo menos 3 letras").max(120, "O título é longo demais"),
  summary: z.string().trim().max(240, "O resumo passou de 240 caracteres"),
  videoUrl: z.string().trim().max(500, "O link é longo demais"),
  durationMinutes: z.coerce
    .number({ error: "Informe a duração em minutos" })
    .int("Use um número inteiro")
    .min(1, "A duração mínima é 1 minuto")
    .max(600, "A duração máxima é 600 minutos"),
  xpReward: z.coerce
    .number({ error: "Informe o XP da aula" })
    .int("Use um número inteiro")
    .min(0, "O XP não pode ser negativo")
    .max(500, "O máximo é 500 XP"),
  content: z.string().max(60_000, "O texto passou de 60.000 caracteres"),
});

/** "Título | https://link" por linha. Só aceita http(s) — nunca `javascript:` e afins. */
function parseResources(text: string): { items: Array<{ title: string; url: string }>; error?: string } {
  const items: Array<{ title: string; url: string }> = [];

  for (const [index, line] of lines(text).entries()) {
    const separator = line.lastIndexOf("|");
    const rawUrl = (separator === -1 ? line : line.slice(separator + 1)).trim();
    const title = (separator === -1 ? "" : line.slice(0, separator)).trim();

    let url: URL | null = null;
    try {
      url = new URL(rawUrl);
    } catch {
      url = null;
    }

    if (!url || (url.protocol !== "https:" && url.protocol !== "http:")) {
      return { items: [], error: `Linha ${index + 1}: use o formato "Título | https://link-do-material"` };
    }

    items.push({ title: (title || url.hostname).slice(0, 120), url: url.toString() });
  }

  return { items: items.slice(0, 20) };
}

export async function updateLessonAction(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const id = field(formData, "id");
  const parsed = lessonSchema.safeParse({
    title: field(formData, "title"),
    summary: field(formData, "summary"),
    videoUrl: field(formData, "videoUrl"),
    durationMinutes: field(formData, "durationMinutes"),
    xpReward: field(formData, "xpReward"),
    content: rawField(formData, "content"),
  });
  if (!parsed.success) return { ok: false, errors: zodErrors(parsed.error), message: "Revise os campos destacados." };

  const data = parsed.data;

  if (data.videoUrl && !toVideoEmbed(data.videoUrl)) {
    return {
      ok: false,
      message: "Revise os campos destacados.",
      errors: { videoUrl: "Link não reconhecido. Use YouTube, Vimeo, Panda Video, Bunny ou um arquivo .mp4 (https)." },
    };
  }

  const resources = parseResources(rawField(formData, "resources"));
  if (resources.error) return { ok: false, message: "Revise os campos destacados.", errors: { resources: resources.error } };

  const objectiveLines = lines(rawField(formData, "objectives"));
  if (objectiveLines.length > 8) {
    return { ok: false, message: "Revise os campos destacados.", errors: { objectives: "Use no máximo 8 tópicos." } };
  }
  if (objectiveLines.some((line) => line.length > 160)) {
    return {
      ok: false,
      message: "Revise os campos destacados.",
      errors: { objectives: "Cada tópico pode ter até 160 caracteres." },
    };
  }

  const [lesson] = await db.select({ id: lessons.id }).from(lessons).where(eq(lessons.id, id)).limit(1);
  if (!lesson) return { ok: false, message: "Aula não encontrada." };

  await db
    .update(lessons)
    .set({
      title: data.title,
      summary: data.summary,
      objectives: objectiveLines,
      videoUrl: data.videoUrl || null,
      durationMinutes: data.durationMinutes,
      xpReward: data.xpReward,
      content: data.content,
      isFree: checked(formData, "isFree"),
      published: checked(formData, "published"),
    })
    .where(eq(lessons.id, id));

  /* Tarefas: mantém as que não mudaram de texto, para o aluno não perder o que já marcou. */
  const taskTexts = [...new Set(lines(rawField(formData, "tasks")).map((text) => text.slice(0, 300)))].slice(0, 30);
  const existingTasks = await db.select().from(lessonTasks).where(eq(lessonTasks.lessonId, id));
  const existingByText = new Map(existingTasks.map((task) => [task.text, task]));
  const keptIds = new Set<string>();

  for (const [sortOrder, text] of taskTexts.entries()) {
    const existing = existingByText.get(text);
    if (existing) {
      keptIds.add(existing.id);
      if (existing.sortOrder !== sortOrder) {
        await db.update(lessonTasks).set({ sortOrder }).where(eq(lessonTasks.id, existing.id));
      }
    } else {
      await db.insert(lessonTasks).values({ lessonId: id, text, sortOrder });
    }
  }

  const removedIds = existingTasks.filter((task) => !keptIds.has(task.id)).map((task) => task.id);
  if (removedIds.length > 0) await db.delete(lessonTasks).where(inArray(lessonTasks.id, removedIds));

  /* Materiais: sem estado do aluno, então é só substituir. */
  await db.delete(lessonResources).where(eq(lessonResources.lessonId, id));
  if (resources.items.length > 0) {
    await db
      .insert(lessonResources)
      .values(resources.items.map((item, sortOrder) => ({ lessonId: id, ...item, sortOrder })));
  }

  refreshEverything();
  return { ok: true, message: "Aula salva." };
}

export async function deleteLessonAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = field(formData, "id");
  const [row] = await db
    .select({ trackId: modules.trackId })
    .from(lessons)
    .innerJoin(modules, eq(modules.id, lessons.moduleId))
    .where(eq(lessons.id, id))
    .limit(1);

  await db.delete(lessons).where(eq(lessons.id, id));

  refreshEverything();
  redirect(row ? `/admin/conteudo/trilha/${row.trackId}` : "/admin/conteudo");
}

/* ================================================================== */
/* Quiz                                                                */
/* ================================================================== */

const quizSchema = z
  .array(
    z
      .object({
        text: z.string().trim().min(3, "Toda pergunta precisa de um enunciado").max(500, "Enunciado longo demais"),
        explanation: z.string().trim().max(1000, "Explicação longa demais"),
        options: z
          .array(
            z.object({
              text: z.string().trim().min(1, "Preencha todas as alternativas").max(300, "Alternativa longa demais"),
              isCorrect: z.boolean(),
            }),
          )
          .min(2, "Cada pergunta precisa de pelo menos 2 alternativas")
          .max(6, "Máximo de 6 alternativas por pergunta"),
      })
      .refine((question) => question.options.filter((option) => option.isCorrect).length === 1, {
        message: "Marque exatamente uma alternativa correta em cada pergunta",
      }),
  )
  .max(30, "Máximo de 30 perguntas por aula");

export type QuizDraft = z.input<typeof quizSchema>;

export async function saveQuizAction(lessonId: string, draft: QuizDraft): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();

  const parsed = quizSchema.safeParse(draft);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Quiz inválido." };

  const [lesson] = await db.select({ id: lessons.id }).from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  if (!lesson) return { ok: false, message: "Aula não encontrada." };

  await db.transaction(async (tx) => {
    // As alternativas são apagadas junto (cascata).
    await tx.delete(quizQuestions).where(eq(quizQuestions.lessonId, lessonId));

    for (const [sortOrder, question] of parsed.data.entries()) {
      const [created] = await tx
        .insert(quizQuestions)
        .values({ lessonId, text: question.text, explanation: question.explanation, sortOrder })
        .returning({ id: quizQuestions.id });

      await tx.insert(quizOptions).values(
        question.options.map((option, index) => ({
          questionId: created.id,
          text: option.text,
          isCorrect: option.isCorrect,
          sortOrder: index,
        })),
      );
    }
  });

  refreshEverything();
  return {
    ok: true,
    message: parsed.data.length === 0 ? "Quiz removido." : `Quiz salvo com ${parsed.data.length} pergunta(s).`,
  };
}
