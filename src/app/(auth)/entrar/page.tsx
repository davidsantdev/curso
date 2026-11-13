import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/auth-forms";
import { getCurrentUser } from "@/lib/auth/dal";
import { safeInternalPath } from "@/lib/utils";

export const metadata: Metadata = { title: "Entrar" };

const NOTICES: Record<string, string> = {
  "senha-redefinida": "Senha redefinida! Entre com a nova senha.",
  "conta-excluida": "A sua conta e os seus dados foram excluídos. Se quiser voltar, é só criar uma conta nova.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; aviso?: string }>;
}) {
  const params = await searchParams;
  const next = safeInternalPath(params.next) ?? undefined;

  if (await getCurrentUser()) redirect(next ?? "/painel");

  const notice = params.aviso ? NOTICES[params.aviso] : undefined;

  return (
    <>
      <h1 className="text-[32px] leading-tight font-bold">Que bom ver você de novo</h1>
      <p className="text-ink mt-2 text-[16px]">Entre para continuar de onde parou.</p>

      {notice ? (
        <p role="status" className="bg-mint-50 text-mint-700 mt-6 rounded-xl px-4 py-3 text-sm font-medium">
          {notice}
        </p>
      ) : null}

      <div className="mt-8">
        <LoginForm next={next} />
      </div>

      <p className="text-ink mt-8 text-center text-[15px]">
        Ainda não tem conta?{" "}
        <Link
          href={next ? `/cadastro?next=${encodeURIComponent(next)}` : "/cadastro"}
          className="text-brand-600 hover:text-brand-700 font-semibold"
        >
          Criar conta grátis
        </Link>
      </p>
    </>
  );
}
