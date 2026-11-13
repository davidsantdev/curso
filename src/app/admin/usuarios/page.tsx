import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Avatar } from "@/components/ui/avatar";
import { listAdminUsers, USER_FILTERS, type UserFilter } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth/dal";
import { formatDate, plural } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Alunos" };

const FILTER_LABEL: Record<UserFilter, string> = {
  todos: "Todos",
  pro: "Assinantes",
  gratis: "Plano grátis",
  admin: "Administradores",
};

function buildHref(params: { q?: string; filtro?: string; pagina?: number }) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.filtro && params.filtro !== "todos") search.set("filtro", params.filtro);
  if (params.pagina && params.pagina > 1) search.set("pagina", String(params.pagina));
  const query = search.toString();
  return query ? `/admin/usuarios?${query}` : "/admin/usuarios";
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filtro?: string; pagina?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const q = (params.q ?? "").slice(0, 80);
  const filter: UserFilter = USER_FILTERS.includes(params.filtro as UserFilter) ? (params.filtro as UserFilter) : "todos";
  const page = Math.max(1, Number.parseInt(params.pagina ?? "1", 10) || 1);

  const { rows, total, pages } = await listAdminUsers({ q, filter, page });

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Alunos" description="Busque alunos, veja o progresso e libere acesso manualmente." />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form className="relative w-full max-w-md" role="search">
          {filter !== "todos" ? <input type="hidden" name="filtro" value={filter} /> : null}
          <label htmlFor="busca" className="sr-only">
            Buscar por nome ou e-mail
          </label>
          <Search className="text-muted pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2" aria-hidden="true" />
          <input id="busca" name="q" defaultValue={q} placeholder="Buscar por nome ou e-mail" className="input pl-11" />
        </form>

        <nav className="flex flex-wrap gap-2" aria-label="Filtrar alunos">
          {USER_FILTERS.map((item) => (
            <Link
              key={item}
              href={buildHref({ q, filtro: item })}
              aria-current={filter === item ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                filter === item ? "bg-navy-900 text-white" : "text-ink hover:text-navy-900 bg-white",
              )}
            >
              {FILTER_LABEL[item]}
            </Link>
          ))}
        </nav>
      </div>

      <section className="card mt-6 overflow-hidden">
        <p className="text-muted px-6 pt-5 text-sm">{plural(total, "aluno encontrado", "alunos encontrados")}</p>
        {rows.length === 0 ? (
          <p className="text-ink px-6 pt-3 pb-6 text-[15px]">Ninguém por aqui com esse filtro.</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th scope="col">Aluno</th>
                  <th scope="col">Plano</th>
                  <th scope="col" className="text-right">
                    Aulas
                  </th>
                  <th scope="col" className="text-right">
                    XP
                  </th>
                  <th scope="col">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link href={`/admin/usuarios/${row.id}`} className="group flex items-center gap-3">
                        <Avatar name={row.name} className="size-9 text-xs" />
                        <span className="min-w-0">
                          <span className="text-navy-900 group-hover:text-brand-600 block truncate font-medium">
                            {row.name}
                            {row.role === "ADMIN" ? (
                              <span className="badge bg-navy-900 ml-2 align-middle text-white">Admin</span>
                            ) : null}
                          </span>
                          <span className="text-muted block truncate text-xs">{row.email}</span>
                        </span>
                      </Link>
                    </td>
                    <td>
                      {row.isPro ? (
                        <span className="badge bg-magenta-50 text-magenta-700">{row.planName}</span>
                      ) : (
                        <span className="text-muted">Grátis</span>
                      )}
                    </td>
                    <td className="text-navy-900 text-right tabular-nums">{row.lessonsDone}</td>
                    <td className="text-navy-900 text-right tabular-nums">{row.xp}</td>
                    <td className="whitespace-nowrap">{formatDate(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pages > 1 ? (
        <nav className="mt-6 flex items-center justify-between gap-4" aria-label="Paginação">
          {page > 1 ? (
            <Link href={buildHref({ q, filtro: filter, pagina: page - 1 })} className="btn btn-outline btn-sm">
              <ChevronLeft className="size-4" aria-hidden="true" />
              Anterior
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted text-sm">
            Página {page} de {pages}
          </span>
          {page < pages ? (
            <Link href={buildHref({ q, filtro: filter, pagina: page + 1 })} className="btn btn-outline btn-sm">
              Próxima
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}
