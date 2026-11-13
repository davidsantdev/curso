import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Download, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { DeleteAccountForm, PasswordForm, ProfileForm } from "@/components/account/account-forms";
import { InstallApp } from "@/components/app/install-app";
import { PageHeader } from "@/components/app/page-header";
import { Avatar } from "@/components/ui/avatar";
import { requireUser } from "@/lib/auth/dal";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Minha conta" };

export default async function AccountPage() {
  const user = await requireUser();
  const planLabel = user.isAdmin
    ? "Administrador (acesso total)"
    : user.subscription?.active
      ? user.subscription.planName
      : "Plano grátis";

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Minha conta" description="Seus dados de acesso e a segurança da conta." />

      <section className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} className="size-14 text-lg" />
          <div className="min-w-0">
            <p className="text-navy-900 truncate text-lg font-semibold">{user.name}</p>
            <p className="text-ink truncate text-[15px]">{user.email}</p>
            <p className="text-muted mt-0.5 text-sm">
              {planLabel} · aluno desde {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/assinatura" className="btn btn-outline btn-sm">
            <CreditCard className="size-4" aria-hidden="true" />
            Assinatura
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-danger-ghost btn-sm">
              <LogOut className="size-4" aria-hidden="true" />
              Sair
            </button>
          </form>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-6 sm:p-7">
          <h2 className="text-xl font-semibold">Dados pessoais</h2>
          <div className="mt-5">
            <ProfileForm name={user.name} email={user.email} />
          </div>
        </section>

        <section className="card p-6 sm:p-7">
          <h2 className="text-xl font-semibold">Senha</h2>
          <p className="text-ink mt-1 text-sm">Ao trocar a senha, os outros aparelhos conectados são desconectados.</p>
          <div className="mt-5">
            <PasswordForm />
          </div>
        </section>
      </div>

      <div className="mt-6">
        <InstallApp />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-6 sm:p-7">
          <h2 className="text-xl font-semibold">Seus dados</h2>
          <p className="text-ink mt-1 text-[15px] leading-relaxed">
            Baixe uma cópia de tudo o que guardamos sobre você: cadastro, progresso, anotações, comentários,
            certificados e pagamentos.
          </p>
          <a href="/conta/dados" download className="btn btn-outline mt-5">
            <Download className="size-4" aria-hidden="true" />
            Baixar os meus dados
          </a>
        </section>

        <section className="card p-6 sm:p-7">
          <h2 className="text-xl font-semibold">Excluir conta</h2>
          <p className="text-ink mt-1 text-[15px] leading-relaxed">
            Apaga a conta e todos os seus dados na hora, sem volta.
            {user.subscription?.active ? " O seu plano pago também é encerrado, sem reembolso do período restante." : ""}
          </p>
          <div className="mt-5">
            <DeleteAccountForm />
          </div>
        </section>
      </div>
    </div>
  );
}
