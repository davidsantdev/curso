"use client";

import { useActionState } from "react";
import { createCouponAction } from "@/actions/admin-billing";
import { Field, FormMessage, SubmitButton } from "@/components/ui/form";
import { EMPTY_FORM_STATE } from "@/lib/forms";

export function CouponForm() {
  const [state, action] = useActionState(createCouponAction, EMPTY_FORM_STATE);
  // Depois de criar, o formulário volta vazio; com erro, mantém o que foi digitado.
  const values = state.ok ? undefined : state.values;

  return (
    <form action={action} className="space-y-4">
      <FormMessage state={state} />
      <Field
        label="Código"
        name="code"
        required
        maxLength={30}
        autoComplete="off"
        autoCapitalize="characters"
        placeholder="Ex.: BEMVINDO20"
        className="uppercase placeholder:normal-case"
        defaultValue={values?.code}
        error={state.errors?.code}
        hint="Letras e números, sem espaços. É o que o aluno digita no checkout."
      />
      <Field
        label="Desconto (%)"
        name="percentOff"
        type="number"
        required
        min={1}
        max={100}
        step={1}
        inputMode="numeric"
        placeholder="Ex.: 20"
        defaultValue={values?.percentOff}
        error={state.errors?.percentOff}
        hint="Com 100, o aluno libera o plano sem pagar (cortesia)."
      />
      <Field
        label="Limite de usos (opcional)"
        name="maxRedemptions"
        type="number"
        min={1}
        step={1}
        inputMode="numeric"
        placeholder="Sem limite"
        defaultValue={values?.maxRedemptions}
        error={state.errors?.maxRedemptions}
      />
      <Field
        label="Válido até (opcional)"
        name="expiresAt"
        type="date"
        defaultValue={values?.expiresAt}
        error={state.errors?.expiresAt}
        hint="Vale até o fim do dia escolhido."
      />
      <SubmitButton pendingLabel="Criando…">Criar cupom</SubmitButton>
    </form>
  );
}
