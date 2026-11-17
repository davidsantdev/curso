import { Download, FileDown } from "lucide-react";

/** Cartão com o botão de baixar os slides da aula (o arquivo sai de /aula/<id>/pdf, que confere o acesso). */
export function LessonPdfCard({ href }: { href: string }) {
  return (
    <section className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="flex items-start gap-4">
        <span className="bg-brand-50 text-brand-600 grid size-12 shrink-0 place-items-center rounded-2xl">
          <FileDown className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg leading-tight font-semibold">Slides da aula em PDF</h2>
          <p className="text-ink mt-1 text-[15px]">Para estudar com calma e fazer as suas anotações.</p>
        </div>
      </div>
      <a href={href} download className="btn btn-primary shrink-0">
        <Download className="size-4.5" aria-hidden="true" />
        Baixar o PDF
      </a>
    </section>
  );
}
