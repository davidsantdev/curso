import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CreateTrackForm } from "@/components/admin/content-forms";
import { MoveButtons } from "@/components/admin/move-buttons";
import { PageHeader } from "@/components/app/page-header";
import { TrackBadge } from "@/components/icons";
import { getAdminTracks } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth/dal";
import { LEVEL_LABEL, plural } from "@/lib/format";

export const metadata: Metadata = { title: "Conteúdo" };

export default async function AdminContentPage() {
  await requireAdmin();
  const tracks = await getAdminTracks();

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Conteúdo"
        description="Organize a trilha de aprendizado: trilhas → módulos → aulas. Use as setas para mudar a ordem."
      />

      <section className="card p-6">
        <h2 className="text-lg font-semibold">Nova trilha</h2>
        <p className="text-ink mt-1 mb-4 text-sm">Ela nasce como rascunho — publique quando estiver pronta.</p>
        <CreateTrackForm />
      </section>

      <section className="card mt-6 overflow-hidden">
        {tracks.length === 0 ? (
          <p className="text-ink p-6 text-[15px]">Nenhuma trilha ainda. Crie a primeira acima.</p>
        ) : (
          <ul className="divide-line divide-y">
            {tracks.map((track, index) => {
              const allLessons = track.modules.flatMap((mod) => mod.lessons);
              const published = allLessons.filter((lesson) => lesson.published).length;
              return (
                <li key={track.id} className="flex items-center gap-4 p-5">
                  <MoveButtons kind="track" id={track.id} isFirst={index === 0} isLast={index === tracks.length - 1} />
                  <TrackBadge icon={track.icon} color={track.color} className="size-11" iconClassName="size-5" />
                  <Link href={`/admin/conteudo/trilha/${track.id}`} className="group min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-navy-900 group-hover:text-brand-600 truncate text-[16px] font-semibold">
                        {track.title}
                      </p>
                      {track.published ? (
                        <span className="badge bg-mint-50 text-mint-700">Publicada</span>
                      ) : (
                        <span className="badge bg-surface text-ink">Rascunho</span>
                      )}
                    </div>
                    <p className="text-muted mt-0.5 text-sm">
                      {LEVEL_LABEL[track.level]} · {plural(track.modules.length, "módulo", "módulos")} ·{" "}
                      {published} de {plural(allLessons.length, "aula publicada", "aulas publicadas")}
                    </p>
                  </Link>
                  <ChevronRight className="text-muted size-5 shrink-0" aria-hidden="true" />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
