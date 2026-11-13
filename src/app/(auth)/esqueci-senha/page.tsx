import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ForgotPasswordForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function ForgotPasswordPage() {
  return (
    <>
      <Link href="/entrar" className="text-ink hover:text-brand-600 inline-flex items-center gap-1.5 text-sm font-medium">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar para o login
      </Link>
      <h1 className="mt-6 text-[32px] leading-tight font-bold">Esqueceu a senha?</h1>
      <p className="text-ink mt-2 text-[16px]">
        Informe o e-mail da sua conta e enviaremos um link para você criar uma senha nova.
      </p>
      <div className="mt-8">
        <ForgotPasswordForm devHint={process.env.NODE_ENV !== "production"} />
      </div>
    </>
  );
}
