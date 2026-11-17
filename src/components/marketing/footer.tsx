import Link from "next/link";
import { Logo } from "@/components/logo";
import { site } from "@/config/site";

const COLUMNS = [
  {
    title: "Plataforma",
    links: [
      { href: "/#como-funciona", label: "Como funciona" },
      { href: "/cursos", label: "O que você aprende" },
      { href: "/precos", label: "Planos" },
      { href: "/glossario", label: "Dicionário" },
      { href: "/#duvidas", label: "Dúvidas frequentes" },
    ],
  },
  {
    title: "Conta",
    links: [
      { href: "/cadastro", label: "Criar conta grátis" },
      { href: "/entrar", label: "Entrar" },
      { href: "/esqueci-senha", label: "Recuperar senha" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/termos", label: "Termos de uso" },
      { href: "/privacidade", label: "Privacidade" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="bg-night relative overflow-hidden border-t border-white/7">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/55">
            {site.tagline}. Método, prática e ferramentas — sem promessa de dinheiro fácil.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="font-mono text-[12px] font-medium tracking-[0.16em] text-white/45 uppercase">{column.title}</h2>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/7">
        <div className="container-page flex flex-col gap-2 py-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          </p>
          <p>Os resultados dependem da sua execução — não garantimos ganhos.</p>
        </div>
      </div>
    </footer>
  );
}
