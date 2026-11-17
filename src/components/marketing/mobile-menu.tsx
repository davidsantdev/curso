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
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="grid size-11 place-items-center rounded-full text-white hover:bg-white/10"
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
      </button>

      {open ? (
        <div
          id="menu-mobile"
          className="animate-pop bg-night-900 absolute inset-x-4 top-19 z-50 rounded-3xl border border-white/10 p-4 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]"
        >
          <nav className="flex flex-col">
            {MARKETING_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-white/80 hover:bg-white/6 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid gap-2 border-t border-white/10 pt-4">
            {signedIn ? (
              <Link href="/painel" className="btn btn-pink">
                Ir para o painel
              </Link>
            ) : (
              <>
                <Link href="/cadastro" className="btn btn-pink">
                  Criar conta grátis
                </Link>
                <Link href="/entrar" className="btn btn-glass">
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
