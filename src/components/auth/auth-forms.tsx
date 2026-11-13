"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import {
  loginAction,
  requestPasswordResetAction,
  resetPasswordAction,
  signupAction,
} from "@/actions/auth";
import { Field, FormMessage, SubmitButton } from "@/components/ui/form";
import { EMPTY_FORM_STATE } from "@/lib/forms";

/** Campo de senha com botão para mostrar/ocultar. */
function PasswordField({
  label,
  name,
  error,
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  error?: string;
  autoComplete: string;
  hint?: string;
}) {
  const [visible, setVisible] = useState(false);
  const id = `f-${name}`;

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={name === "current" ? undefined : 8}
          className="input pr-12"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="text-muted hover:text-navy-900 absolute inset-y-0 right-0 grid w-12 place-items-center"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          {visible ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-danger-600 mt-1.5 text-sm">
          {error}
        </p>
      ) : hint ? (
        <p className="text-muted mt-1.5 text-sm">{hint}</p>
      ) : null}
    </div>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(loginAction, EMPTY_FORM_STATE);

  return (
    <form action={action} className="space-y-5" noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <FormMessage state={state} />
      <Field
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        error={state.errors?.email}
      />
      <div>
        <PasswordField label="Senha" name="password" autoComplete="current-password" error={state.errors?.password} />
        <div className="mt-2 text-right">
          <Link href="/esqueci-senha" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
            Esqueci a minha senha
          </Link>
        </div>
      </div>
      <SubmitButton className="btn btn-primary w-full" pendingLabel="Entrando…">
        Entrar
      </SubmitButton>
    </form>
  );
}

export function SignupForm({ next }: { next?: string }) {
  const [state, action] = useActionState(signupAction, EMPTY_FORM_STATE);

  return (
    <form action={action} className="space-y-5" noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <FormMessage state={state} />
      <Field
        label="Nome"
        name="name"
        autoComplete="name"
        required
        defaultValue={state.values?.name}
        error={state.errors?.name}
      />
      <Field
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        error={state.errors?.email}
      />
      <PasswordField
        label="Senha"
        name="password"
        autoComplete="new-password"
        error={state.errors?.password}
        hint="Use pelo menos 8 caracteres."
      />
      <SubmitButton className="btn btn-primary w-full" pendingLabel="Criando a sua conta…">
        Criar conta grátis
      </SubmitButton>
      <p className="text-muted text-center text-sm leading-relaxed">
        Ao continuar, você concorda com os{" "}
        <Link href="/termos" className="text-ink underline underline-offset-2">
          termos de uso
        </Link>{" "}
        e a{" "}
        <Link href="/privacidade" className="text-ink underline underline-offset-2">
          política de privacidade
        </Link>
        .
      </p>
    </form>
  );
}

export function ForgotPasswordForm({ devHint }: { devHint: boolean }) {
  const [state, action] = useActionState(requestPasswordResetAction, EMPTY_FORM_STATE);

  return (
    <form action={action} className="space-y-5" noValidate>
      <FormMessage state={state} />
      {state.ok && devHint ? (
        <p className="bg-surface text-ink rounded-xl px-4 py-3 text-sm">
          Modo de desenvolvimento: o e-mail não é enviado de verdade — o link aparece no terminal onde o{" "}
          <code>npm run dev</code> está rodando.
        </p>
      ) : null}
      <Field label="E-mail da conta" name="email" type="email" autoComplete="email" required error={state.errors?.email} />
      <SubmitButton className="btn btn-primary w-full" pendingLabel="Enviando…">
        Enviar link de recuperação
      </SubmitButton>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPasswordAction, EMPTY_FORM_STATE);

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="token" value={token} />
      <FormMessage state={state} />
      <PasswordField
        label="Nova senha"
        name="password"
        autoComplete="new-password"
        error={state.errors?.password}
        hint="Use pelo menos 8 caracteres."
      />
      <PasswordField
        label="Repita a nova senha"
        name="confirmation"
        autoComplete="new-password"
        error={state.errors?.confirmation}
      />
      <SubmitButton className="btn btn-primary w-full" pendingLabel="Salvando…">
        Salvar nova senha
      </SubmitButton>
    </form>
  );
}
