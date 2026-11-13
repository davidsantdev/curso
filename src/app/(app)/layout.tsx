import Link from "next/link";
import { redirect } from "next/navigation";
import { Flame, Zap } from "lucide-react";
import { AppSidebar, MobileTabBar } from "@/components/app/app-nav";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/ui/avatar";
import { getCurrentUser } from "@/lib/auth/dal";
import { getLevel } from "@/lib/gamification";
import { cn } from "@/lib/utils";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  const level = getLevel(user.xp);
  const planLabel = user.isAdmin
    ? "Administrador"
    : user.subscription?.active
      ? user.subscription.planName
      : "Plano grátis";

  return (
    <div className="bg-surface min-h-screen">
      <AppSidebar
        user={{ name: user.name, email: user.email, isPremium: user.isPremium, isAdmin: user.isAdmin, planLabel }}
      />

      <div className="lg:pl-68">
        <header className="bg-surface/85 no-print sticky top-0 z-30 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-5 lg:h-20 lg:px-10">
            <div className="lg:hidden">
              <Logo href="/painel" />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/conquistas"
                className={cn(
                  "badge h-9 px-3 text-sm",
                  user.streak > 0 ? "bg-sun-50 text-sun-700" : "text-muted bg-white",
                )}
                title={user.streak > 0 ? "Dias seguidos estudando" : "Conclua uma aula hoje para começar uma sequência"}
              >
                <Flame className="size-4" aria-hidden="true" />
                <span>
                  {user.streak}
                  <span className="sr-only">
                    {user.streak === 1 ? " dia seguido estudando" : " dias seguidos estudando"}
                  </span>
                </span>
              </Link>
              <Link href="/conquistas" className="badge bg-brand-50 text-brand-700 h-9 px-3 text-sm" title="Seu nível e XP">
                <Zap className="size-4" aria-hidden="true" />
                <span>
                  <span className="hidden sm:inline">Nível {level.number} · </span>
                  {user.xp} XP
                </span>
              </Link>
              <Link href="/conta" className="lg:hidden" aria-label="Minha conta">
                <Avatar name={user.name} className="size-9 text-xs" />
              </Link>
            </div>
          </div>
        </header>

        <main className="px-5 pt-2 pb-28 lg:px-10 lg:pb-14">{children}</main>
      </div>

      <MobileTabBar />
    </div>
  );
}
