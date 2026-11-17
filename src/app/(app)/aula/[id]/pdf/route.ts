import { readFile } from "node:fs/promises";
import { getCurrentUser } from "@/lib/auth/dal";
import { canAccessLesson, getCatalog, locateLesson } from "@/lib/content";
import { lessonPdf } from "@/lib/lesson-pdf";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Download do PDF de slides da aula. Só para quem pode abrir a aula: o PDF de uma aula Pro é conteúdo pago, então
 * nunca fica em uma pasta pública.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await params;
  const lessonUrl = new URL(`/aula/${encodeURIComponent(id)}`, request.url);

  const user = await getCurrentUser();
  if (!user) {
    const login = new URL("/entrar", request.url);
    login.searchParams.set("next", lessonUrl.pathname);
    return Response.redirect(login, 303);
  }

  const context = locateLesson(await getCatalog(), id);
  if (!context) return new Response("Aula não encontrada.", { status: 404 });
  if (!canAccessLesson(user, context.lesson)) return Response.redirect(lessonUrl, 303);

  const limit = rateLimit(`pdf:${user.id}`, 60, 10 * 60_000);
  if (!limit.ok) return new Response("Muitos downloads seguidos. Tente de novo em alguns minutos.", { status: 429 });

  const pdf = lessonPdf(context.track.slug, context.lesson.title);
  if (!pdf) return new Response("O PDF desta aula ainda não está disponível.", { status: 404 });

  const data = await readFile(pdf.file);
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdf.downloadName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
