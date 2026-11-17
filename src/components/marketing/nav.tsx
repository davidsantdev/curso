import Link from "next/link";
import { Logo } from "@/components/logo";
import { MARKETING_LINKS } from "./links";
import { MobileMenu } from "./mobile-menu";

/** Menu das páginas públicas: escuro, fixo no topo e com o fundo desfocado por trás. */
export function MarketingNav({ signedIn }: { signedIn: boolean }) {
  return (
    <div className="bg-night-950/85 sticky top-0 z-40 border-b border-white/7 backdrop-blur-xl">
      <header className="container-page relative flex h-18 items-center justify-between gap-6">
        <div className="flex items-center gap-12">
          <Logo tone="light" />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
            {MARKETING_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium text-white/65 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {signedIn ? (
            <Link href="/painel" className="btn btn-white btn-sm hidden md:inline-flex">
              Ir para o painel
            </Link>
          ) : (
            <>
              <Link
                href="/entrar"
                className="btn btn-sm hidden text-white/75 hover:bg-white/8 hover:text-white md:inline-flex"
              >
                Entrar
              </Link>
              <Link href="/cadastro" className="btn btn-white btn-sm hidden sm:inline-flex">
                Criar conta grátis
              </Link>
            </>
          )}
          <MobileMenu signedIn={signedIn} />
        </div>
      </header>
    </div>
  );
}
