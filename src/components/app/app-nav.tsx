"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Calculator,
  CreditCard,
  Crown,
  LayoutDashboard,
  LogOut,
  Route,
  ShieldCheck,
  Trophy,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ACCOUNT_NAV, isActive, MAIN_NAV, type NavKey } from "./nav-items";

const ICONS: Record<NavKey, LucideIcon> = {
  painel: LayoutDashboard,
  trilhas: Route,
  conquistas: Trophy,
  ferramentas: Calculator,
  certificados: Award,
  assinatura: CreditCard,
  conta: UserRound,
  admin: ShieldCheck,
};

export type NavUser = {
  name: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
  planLabel: string;
};

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition-colors",
        active ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-surface hover:text-navy-900",
      )}
    >
      <Icon className={cn("size-5 shrink-0", active ? "text-brand-600" : "text-muted")} aria-hidden="true" />
      {label}
    </Link>
  );
}

/** Menu lateral (computador). */
export function AppSidebar({ user }: { user: NavUser }) {
  const pathname = usePathname();

  return (
    <aside className="border-line fixed inset-y-0 left-0 z-40 hidden w-68 flex-col border-r bg-white lg:flex">
      <div className="px-6 pt-6 pb-4">
        <Logo href="/painel" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-2" aria-label="Plataforma">
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.key}
            href={item.href}
            label={item.label}
            icon={ICONS[item.key]}
            active={isActive(pathname, item.match)}
          />
        ))}

        <p className="text-muted mt-6 mb-1 px-3.5 text-xs font-semibold tracking-wider uppercase">Conta</p>
        {ACCOUNT_NAV.map((item) => (
          <NavLink
            key={item.key}
            href={item.href}
            label={item.label}
            icon={ICONS[item.key]}
            active={isActive(pathname, item.match)}
          />
        ))}
        {user.isAdmin ? (
          <NavLink href="/admin" label="Administração" icon={ICONS.admin} active={isActive(pathname, ["/admin"])} />
        ) : null}

        {!user.isPremium ? (
          <div className="bg-hero relative mt-6 overflow-hidden rounded-2xl p-5 text-white">
            <div className="absolute -top-8 -right-8 size-24 rounded-full bg-white/15" aria-hidden="true" />
            <Crown className="size-6" aria-hidden="true" />
            <p className="mt-3 text-[15px] leading-snug font-semibold">Libere todos os métodos</p>
            <p className="mt-1 text-sm leading-snug text-white/85">
              Loja, site, pagamentos, robôs e anúncios no Facebook, Instagram, TikTok e Google.
            </p>
            <Link href="/assinatura" className="btn btn-white btn-sm mt-4 w-full">
              Conhecer o Pro
            </Link>
          </div>
        ) : null}
      </nav>

      <div className="border-line border-t p-4">
        <div className="flex items-center gap-3 px-1">
          <Avatar name={user.name} />
          <div className="min-w-0 flex-1">
            <p className="text-navy-900 truncate text-[15px] leading-tight font-semibold">{user.name}</p>
            <p className="text-muted truncate text-xs">{user.planLabel}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-muted hover:bg-danger-50 hover:text-danger-600 grid size-9 place-items-center rounded-lg transition-colors"
              aria-label="Sair da conta"
              title="Sair"
            >
              <LogOut className="size-4.5" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

const TAB_KEYS: NavKey[] = ["painel", "trilhas", "conquistas", "ferramentas", "conta"];
const TAB_LABELS: Partial<Record<NavKey, string>> = { conta: "Conta" };

/** Barra de navegação inferior (celular). */
export function MobileTabBar() {
  const pathname = usePathname();
  const items = [...MAIN_NAV, ...ACCOUNT_NAV].filter((item) => TAB_KEYS.includes(item.key));

  return (
    <nav
      className="border-line no-print fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      aria-label="Navegação principal"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {items.map((item) => {
          const Icon = ICONS[item.key];
          const active =
            isActive(pathname, item.match) ||
            (item.key === "conta" && isActive(pathname, ["/assinatura", "/checkout", "/certificados", "/admin"]));
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                  active ? "text-brand-600" : "text-muted",
                )}
              >
                <Icon className="size-5.5" aria-hidden="true" />
                {TAB_LABELS[item.key] ?? item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
