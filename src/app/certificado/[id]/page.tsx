import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { Logo, LogoMark } from "@/components/logo";
import { PrintButton } from "@/components/print-button";
import { site } from "@/config/site";
import { getCurrentUser } from "@/lib/auth/dal";
import { getCertificate } from "@/lib/certificates";
import { formatDateLong, formatDuration } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const certificate = await getCertificate((await params).id);
  if (!certificate) return { title: "Certificado não encontrado" };
  return {
    title: `Certificado — ${certificate.trackTitle}`,
    description: `${certificate.userName} concluiu a trilha ${certificate.trackTitle} na ${site.name}.`,
  };
}

/** Página pública: qualquer pessoa com o link pode verificar o certificado. */
export default async function CertificatePage({ params }: Props) {
  const { id } = await params;
  const [certificate, viewer] = await Promise.all([getCertificate(id), getCurrentUser()]);
  if (!certificate) notFound();

  const isOwner = viewer?.id === certificate.userId;
  const verifyUrl = `${site.url}/certificado/${certificate.id}`;

  return (
    <main className="bg-surface min-h-screen px-4 py-8 sm:py-12 print:bg-white print:p-0">
      <div className="no-print mx-auto mb-8 flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <Logo href={viewer ? "/painel" : "/"} />
        <div className="flex flex-wrap gap-3">
          {isOwner ? (
            <Link href="/certificados" className="btn btn-outline">
              Meus certificados
            </Link>
          ) : null}
          <PrintButton />
        </div>
      </div>

      <article className="relative mx-auto aspect-[1.414] w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-40px_rgb(79_70_180/0.5)] print:max-w-none print:rounded-none print:shadow-none">
        <div className="bg-hero absolute inset-x-0 top-0 h-3" aria-hidden="true" />
        <div className="bg-hero absolute -right-28 -bottom-28 size-80 rounded-full opacity-15" aria-hidden="true" />
        <div className="bg-hero absolute -top-24 -left-24 size-64 rounded-full opacity-10" aria-hidden="true" />

        <div className="relative flex h-full flex-col px-[7%] py-[6%]">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2">
              <LogoMark className="size-[clamp(1.75rem,4vw,2.75rem)]" />
              <span className="text-navy-900 text-[clamp(1.25rem,3vw,2rem)] font-bold lowercase">{site.name}</span>
            </span>
            <span className="text-muted text-[clamp(0.6rem,1.3vw,0.85rem)] font-semibold tracking-[0.2em] uppercase">
              Certificado de conclusão
            </span>
          </div>

          <div className="my-auto text-center">
            <p className="text-ink text-[clamp(0.75rem,1.6vw,1.1rem)]">Certificamos que</p>
            <p className="text-gradient mt-[2%] text-[clamp(1.75rem,5.5vw,4rem)] leading-tight font-bold">
              {certificate.userName}
            </p>
            <p className="text-ink mx-auto mt-[2.5%] max-w-[80%] text-[clamp(0.75rem,1.6vw,1.15rem)] leading-relaxed">
              concluiu a trilha
            </p>
            <p className="text-navy-900 mt-[1%] text-[clamp(1.1rem,3vw,2.1rem)] leading-tight font-semibold">
              {certificate.trackTitle}
            </p>
            <p className="text-ink mt-[2.5%] text-[clamp(0.7rem,1.5vw,1.05rem)]">
              com carga horária de {formatDuration(certificate.totalMinutes)}, em {formatDateLong(certificate.issuedAt)}.
            </p>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-navy-900 border-navy-900/20 border-t pt-2 text-[clamp(0.7rem,1.4vw,1rem)] font-semibold">
                Equipe {site.name}
              </p>
              <p className="text-muted text-[clamp(0.6rem,1.2vw,0.85rem)]">{site.tagline}</p>
            </div>
            <div className="text-right">
              <p className="text-mint-700 inline-flex items-center gap-1.5 text-[clamp(0.65rem,1.3vw,0.9rem)] font-semibold">
                <BadgeCheck className="size-[1.2em]" aria-hidden="true" />
                Certificado autêntico
              </p>
              <p className="text-muted mt-0.5 text-[clamp(0.55rem,1.1vw,0.8rem)]">Código: {certificate.id}</p>
              <p className="text-muted text-[clamp(0.55rem,1.1vw,0.8rem)] break-all">{verifyUrl}</p>
            </div>
          </div>
        </div>
      </article>

      <p className="no-print text-muted mx-auto mt-6 max-w-5xl text-center text-sm">
        Este certificado foi emitido pela {site.name} e pode ser verificado por este endereço.
      </p>
    </main>
  );
}
