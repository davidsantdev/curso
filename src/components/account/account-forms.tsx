"use client";

import { useActionState } from "react";
import { changePasswordAction, deleteAccountAction, updateProfileAction } from "@/actions/account";
import { ConfirmSubmitButton, Field, FormMessage, SubmitButton } from "@/components/ui/form";
import { EMPTY_FORM_STATE } from "@/lib/forms";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, action] = useActionState(updateProfileAction, EMPTY_FORM_STATE);

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      <Field
        label="Nome"
        name="name"
        autoComplete="name"
        required
        defaultValue={state.values?.name ?? name}
        error={state.errors?.name}
        hint="É o nome que aparece nos comentários e no certificado."
      />
      <Field
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email ?? email}
        error={state.errors?.email}
      />
      <SubmitButton pendingLabel="Salvando…">Salvar dados</SubmitButton>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState(changePasswordAction, EMPTY_FORM_STATE);

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      <Field
        label="Senha atual"
        name="current"
        type="password"
        autoComplete="current-password"
        required
        error={state.errors?.current}
      />
      <Field
        label="Nova senha"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        error={state.errors?.password}
        hint="Use pelo menos 8 caracteres."
      />
      <Field
        label="Repita a nova senha"
        name="confirmation"
        type="password"
        autoComplete="new-password"
        required
        error={state.errors?.confirmation}
      />
      <SubmitButton pendingLabel="Alterando…">Alterar senha</SubmitButton>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action] = useActionState(deleteAccountAction, EMPTY_FORM_STATE);

  return (
    <form action={action} className="space-y-4">
      <FormMessage state={state} />
      <Field
        label="Para confirmar, digite a sua senha"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={state.errors?.password}
      />
      <ConfirmSubmitButton
        message="Excluir a sua conta de vez? O progresso, as anotações e os certificados serão apagados e não dá para desfazer."
        className="btn btn-danger-ghost"
      >
        Excluir a minha conta
      </ConfirmSubmitButton>
    </form>
  );
}
