"use client";

import { useActionState } from "react";
import { grantAccessAction, setUserPasswordAction } from "@/actions/admin-users";
import { Field, FormMessage, SelectField, SubmitButton } from "@/components/ui/form";
import { EMPTY_FORM_STATE } from "@/lib/forms";

export function GrantAccessForm({
  userId,
  plans,
}: {
  userId: string;
  plans: Array<{ id: string; label: string; price: string }>;
}) {
  const [state, action] = useActionState(grantAccessAction, EMPTY_FORM_STATE);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="userId" value={userId} />
      <FormMessage state={state} />
      <SelectField label="Plano" name="planId" required error={state.errors?.planId} defaultValue={plans[0]?.id}>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.label}
          </option>
        ))}
      </SelectField>
      <Field
        label="Valor recebido (opcional)"
        name="amount"
        inputMode="decimal"
        placeholder="Ex.: 49,90"
        defaultValue={state.values?.amount}
        error={state.errors?.amount}
        hint="Se informar, o pagamento entra no histórico e na receita."
      />
      <SubmitButton pendingLabel="Liberando…">Liberar acesso</SubmitButton>
    </form>
  );
}

export function SetPasswordForm({ userId }: { userId: string }) {
  const [state, action] = useActionState(setUserPasswordAction, EMPTY_FORM_STATE);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="userId" value={userId} />
      <FormMessage state={state} />
      <Field
        label="Nova senha"
        name="password"
        type="text"
        autoComplete="off"
        minLength={8}
        required
        error={state.errors?.password}
        hint="O aluno será desconectado de todos os aparelhos."
      />
      <SubmitButton className="btn btn-outline" pendingLabel="Salvando…">
        Definir senha
      </SubmitButton>
    </form>
  );
}
