/**
 * Parte do nome do arquivo do PDF de uma aula que vem do título (materiais/pdf/<trilha>/aula-NN-<isto>.pdf).
 * O gerador de PDFs (materiais/gerar-pdfs.mts) e o download no site usam esta mesma função, para baterem.
 */
export function pdfSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
    .replace(/-$/, "");
}
