import "server-only";
import fs from "node:fs";
import path from "node:path";
import { pdfSlug } from "./lesson-pdf-name";

const ROOT = path.join(process.cwd(), "materiais", "pdf");
const LFS_POINTER = "version https://git-lfs";

export type LessonPdf = { file: string; downloadName: string };

/**
 * PDF de slides da aula, gerado por `npm run materiais:pdf` em materiais/pdf/<NN-trilha>/aula-NN-<título>.pdf.
 * Acha pela trilha e pelo título (o número na frente muda quando entra uma aula nova). Devolve null quando não há
 * PDF, ou quando o arquivo é só o "ponteiro" do Git LFS (servidor que não baixou os arquivos do LFS).
 */
export function lessonPdf(trackSlug: string, title: string): LessonPdf | null {
  let folders: fs.Dirent[];
  try {
    folders = fs.readdirSync(ROOT, { withFileTypes: true });
  } catch {
    return null;
  }
  const folder = folders.find((entry) => entry.isDirectory() && entry.name.replace(/^\d+-/, "") === trackSlug);
  if (!folder) return null;

  const wanted = `${pdfSlug(title)}.pdf`;
  const name = fs.readdirSync(path.join(ROOT, folder.name)).find((file) => file.replace(/^aula-\d+-/, "") === wanted);
  if (!name) return null;

  const file = path.join(ROOT, folder.name, name);
  try {
    const head = Buffer.alloc(LFS_POINTER.length);
    const fd = fs.openSync(file, "r");
    fs.readSync(fd, head, 0, head.length, 0);
    fs.closeSync(fd);
    if (head.toString("utf8") === LFS_POINTER) return null;
  } catch {
    return null;
  }
  return { file, downloadName: name };
}
