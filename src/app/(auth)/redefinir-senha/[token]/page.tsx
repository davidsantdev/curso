import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Nova senha", robots: { index: false } };

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <>
      <h1 className="text-[32px] leading-tight font-bold">Crie uma senha nova</h1>
      <p className="text-ink mt-2 text-[16px]">Depois de salvar, você será desconectado dos outros aparelhos.</p>
      <div className="mt-8">
        <ResetPasswordForm token={token} />
      </div>
    </>
  );
}
