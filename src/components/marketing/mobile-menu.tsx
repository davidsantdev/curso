"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { MARKETING_LINKS } from "./links";

export function MobileMenu({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o menu ao trocar de página.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="text-navy-900 hover:bg-brand-50 grid size-11 place-items-center rounded-xl"
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
      </button>

      {open ? (
        <div
          id="menu-mobile"
          className="animate-pop shadow-float border-line absolute inset-x-4 top-[4.5rem] z-50 rounded-3xl border bg-white p-4"
        >
          <nav className="flex flex-col">
            {MARKETING_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-navy-900 hover:bg-brand-50 rounded-xl px-4 py-3 text-base font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-line mt-3 grid gap-2 border-t pt-4">
            {signedIn ? (
              <Link href="/painel" className="btn btn-primary">
                Ir para o painel
              </Link>
            ) : (
              <>
                <Link href="/cadastro" className="btn btn-primary">
                  Criar conta grátis
                </Link>
                <Link href="/entrar" className="btn btn-outline">
                  Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
