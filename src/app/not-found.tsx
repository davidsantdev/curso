import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main className="bg-surface flex min-h-screen flex-col items-center justify-center px-5 py-16 text-center">
      <Logo />
      <p className="text-gradient mt-12 text-[96px] leading-none font-bold">404</p>
      <h1 className="mt-4 text-3xl font-bold">Página não encontrada</h1>
      <p className="text-ink mt-3 max-w-md text-[17px] leading-relaxed">
        O endereço pode ter mudado, ou o conteúdo ainda não foi publicado.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/painel" className="btn btn-primary">
          Ir para o painel
        </Link>
        <Link href="/" className="btn btn-outline">
          Página inicial
        </Link>
      </div>
    </main>
  );
}
