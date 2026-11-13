import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/auth-forms";
import { getCurrentUser } from "@/lib/auth/dal";
import { safeInternalPath } from "@/lib/utils";

export const metadata: Metadata = { title: "Criar conta" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeInternalPath((await searchParams).next) ?? undefined;

  if (await getCurrentUser()) redirect(next ?? "/painel");

  return (
    <>
      <h1 className="text-[32px] leading-tight font-bold">Crie a sua conta grátis</h1>
      <p className="text-ink mt-2 text-[16px]">Leva menos de um minuto. Não pedimos cartão de crédito.</p>

      <div className="mt-8">
        <SignupForm next={next} />
      </div>

      <p className="text-ink mt-8 text-center text-[15px]">
        Já tem conta?{" "}
        <Link
          href={next ? `/entrar?next=${encodeURIComponent(next)}` : "/entrar"}
          className="text-brand-600 hover:text-brand-700 font-semibold"
        >
          Entrar
        </Link>
      </p>
    </>
  );
}
