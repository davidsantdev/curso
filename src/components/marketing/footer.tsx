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
    <footer className="border-line mt-8 border-t">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="text-ink mt-4 max-w-xs text-[15px] leading-relaxed">
            {site.tagline}. Método, prática e ferramentas — sem promessa de dinheiro fácil.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-navy-900 text-sm font-semibold">{column.title}</h2>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ink hover:text-brand-600 text-[15px] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-line border-t">
        <div className="container-page text-muted flex flex-col gap-2 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          </p>
          <p>Os resultados dependem da sua execução — não garantimos ganhos.</p>
        </div>
      </div>
    </footer>
  );
}
