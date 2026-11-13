"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  LayoutDashboard,
  MessageSquareText,
  Receipt,
  Tags,
  TicketPercent,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const ITEMS: Array<{ href: string; label: string; icon: LucideIcon; exact?: boolean }> = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { href: "/admin/conteudo", label: "Conteúdo", icon: BookOpen },
  { href: "/admin/usuarios", label: "Alunos", icon: Users },
  { href: "/admin/comentarios", label: "Comentários", icon: MessageSquareText },
  { href: "/admin/pagamentos", label: "Pagamentos", icon: Receipt },
  { href: "/admin/planos", label: "Planos", icon: Tags },
  { href: "/admin/cupons", label: "Cupons", icon: TicketPercent },
];

function useActive() {
  const pathname = usePathname();
  return (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const isActive = useActive();

  return (
    <aside className="border-line fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-white lg:flex">
      <div className="flex items-center gap-2 px-6 pt-6 pb-4">
        <Logo href="/admin" />
        <span className="badge bg-navy-900 text-white">Admin</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-4 py-2" aria-label="Administração">
        {ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition-colors",
                active ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-surface hover:text-navy-900",
              )}
            >
              <item.icon className={cn("size-5", active ? "text-brand-600" : "text-muted")} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-line border-t p-4">
        <Link href="/painel" className="btn btn-outline btn-sm w-full">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar para a plataforma
        </Link>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const isActive = useActive();

  return (
    <nav className="border-line overflow-x-auto border-b bg-white lg:hidden" aria-label="Administração">
      <ul className="flex gap-1 px-4 py-2">
        {ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                  active ? "bg-brand-50 text-brand-700" : "text-ink",
                )}
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li className="shrink-0">
          <Link href="/painel" className="text-ink flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Plataforma
          </Link>
        </li>
      </ul>
    </nav>
  );
}
