export type NavKey = "painel" | "trilhas" | "conquistas" | "ferramentas" | "certificados" | "assinatura" | "conta" | "admin";

export const MAIN_NAV: Array<{ key: NavKey; href: string; label: string; match: string[] }> = [
  { key: "painel", href: "/painel", label: "Painel", match: ["/painel"] },
  { key: "trilhas", href: "/trilhas", label: "Trilhas", match: ["/trilhas", "/aula"] },
  { key: "conquistas", href: "/conquistas", label: "Conquistas", match: ["/conquistas"] },
  { key: "ferramentas", href: "/ferramentas", label: "Ferramentas", match: ["/ferramentas"] },
  { key: "certificados", href: "/certificados", label: "Certificados", match: ["/certificados"] },
];

export const ACCOUNT_NAV: Array<{ key: NavKey; href: string; label: string; match: string[] }> = [
  { key: "assinatura", href: "/assinatura", label: "Assinatura", match: ["/assinatura", "/checkout"] },
  { key: "conta", href: "/conta", label: "Minha conta", match: ["/conta"] },
];

export function isActive(pathname: string, match: string[]): boolean {
  return match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
