import Link from "next/link";
import { Logo } from "@/components/logo";
import { MARKETING_LINKS } from "./links";
import { MobileMenu } from "./mobile-menu";

export function MarketingNav({ signedIn }: { signedIn: boolean }) {
  return (
    <header className="container-page relative flex h-20 items-center justify-between gap-6">
      <div className="flex items-center gap-12">
        <Logo />
        <nav className="hidden items-center gap-9 md:flex" aria-label="Principal">
          {MARKETING_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-navy-900 hover:text-brand-600 text-[15px] font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {signedIn ? (
          <Link href="/painel" className="btn btn-outline btn-sm hidden md:inline-flex">
            Ir para o painel
          </Link>
        ) : (
          <>
            <Link href="/entrar" className="btn btn-ghost btn-sm hidden md:inline-flex">
              Entrar
            </Link>
            <Link href="/cadastro" className="btn btn-outline btn-sm hidden sm:inline-flex">
              Criar conta
            </Link>
          </>
        )}
        <MobileMenu signedIn={signedIn} />
      </div>
    </header>
  );
}
