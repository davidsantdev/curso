import type { Metadata } from "next";
import Link from "next/link";
import { Award, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { requireUser } from "@/lib/auth/dal";
import { listUserCertificates } from "@/lib/certificates";
import { formatDate, formatDuration } from "@/lib/format";

export const metadata: Metadata = { title: "Certificados" };

export default async function CertificatesPage() {
  const user = await requireUser();
  const items = await listUserCertificates(user.id);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Certificados"
        description="Ao concluir todas as aulas de uma trilha, o certificado é emitido aqui, com um código que qualquer pessoa pode verificar."
      />

      {items.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-14 text-center">
          <span className="bg-magenta-50 text-magenta-600 grid size-16 place-items-center rounded-3xl">
            <Award className="size-8" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">Seu primeiro certificado está a algumas aulas de distância</h2>
          <p className="text-ink mt-2 max-w-md text-[15px] leading-relaxed">
            Conclua todas as aulas de uma trilha e ele aparece aqui automaticamente.
          </p>
          <Link href="/trilhas" className="btn btn-primary mt-7">
            Ir para as trilhas
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {items.map((certificate) => (
            <li key={certificate.id} className="card flex items-start gap-4 p-6">
              <span className="bg-magenta-50 text-magenta-600 grid size-12 shrink-0 place-items-center rounded-2xl">
                <Award className="size-6" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg leading-tight font-semibold">{certificate.trackTitle}</h2>
                <p className="text-ink mt-1 text-sm">
                  Emitido em {formatDate(certificate.issuedAt)} · {formatDuration(certificate.totalMinutes)}
                </p>
                <p className="text-muted mt-1 text-xs">Código {certificate.id}</p>
                <Link href={`/certificado/${certificate.id}`} className="btn btn-outline btn-sm mt-4">
                  Abrir certificado
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
