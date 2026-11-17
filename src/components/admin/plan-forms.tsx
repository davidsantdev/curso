"use client";

import { useActionState } from "react";
import { createPlanAction, updatePlanAction } from "@/actions/admin-plans";
import {
  CheckboxField,
  Field,
  FormMessage,
  SelectField,
  SubmitButton,
  TextAreaField,
  useEditForm,
} from "@/components/ui/form";
import { INTERVAL_LABEL } from "@/lib/format";
import { EMPTY_FORM_STATE, type FormState } from "@/lib/forms";

const INTERVALS = Object.keys(INTERVAL_LABEL) as Array<keyof typeof INTERVAL_LABEL>;

type PlanValues = {
  id?: string;
  name: string;
  description: string;
  price: string;
  interval: string;
  features: string;
  paymentLink: string;
  highlighted?: boolean;
  active?: boolean;
};

function PlanFields({ values, state, idPrefix }: { values: PlanValues; state: FormState; idPrefix: string }) {
  const v = { ...values, ...state.values };

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id={`${idPrefix}-name`} label="Nome" name="name" required defaultValue={v.name} error={state.errors?.name} />
        <Field
          id={`${idPrefix}-description`}
          label="Descrição curta"
          name="description"
          maxLength={200}
          defaultValue={v.description}
          error={state.errors?.description}
        />
        <Field
          id={`${idPrefix}-price`}
          label="Preço (R$)"
          name="price"
          inputMode="decimal"
          required
          placeholder="49,90"
          defaultValue={v.price}
          error={state.errors?.price}
        />
        <SelectField
          id={`${idPrefix}-interval`}
          label="Recorrência"
          name="interval"
          defaultValue={v.interval}
          error={state.errors?.interval}
        >
          {INTERVALS.map((interval) => (
            <option key={interval} value={interval}>
              {INTERVAL_LABEL[interval].name}
            </option>
          ))}
        </SelectField>
      </div>
      <TextAreaField
        id={`${idPrefix}-features`}
        label="Benefícios"
        name="features"
        rows={5}
        defaultValue={v.features}
        hint="Um por linha. Aparecem no cartão do plano."
      />
      <Field
        id={`${idPrefix}-link`}
        label="Link de pagamento (Cakto)"
        name="paymentLink"
        type="url"
        inputMode="url"
        placeholder="https://pay.cakto.com.br/abc123"
        defaultValue={v.paymentLink}
        error={state.errors?.paymentLink}
        hint="Na Cakto: no seu produto, copie o link da oferta deste plano. O preço cobrado é o da oferta na Cakto, então deixe os dois iguais. (Também aceita o link de uma oferta da Hotmart.)"
      />
    </>
  );
}

export function PlanForm({ plan }: { plan: PlanValues & { id: string; highlighted: boolean; active: boolean } }) {
  const { state, onSubmit, pending } = useEditForm(updatePlanAction);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="hidden" name="id" value={plan.id} />
      <FormMessage state={state} />
      <PlanFields values={plan} state={state} idPrefix={`plan-${plan.id}`} />
      <div className="grid gap-3 md:grid-cols-2">
        <CheckboxField
          id={`plan-${plan.id}-active`}
          name="active"
          label="À venda"
          description="Desmarque para tirar o plano da página de preços. Quem já assinou não perde o acesso."
          defaultChecked={plan.active}
        />
        <CheckboxField
          id={`plan-${plan.id}-highlighted`}
          name="highlighted"
          label="Destacar"
          description="Mostra o plano em destaque (recomendado) na página de preços."
          defaultChecked={plan.highlighted}
        />
      </div>
      <SubmitButton pending={pending} pendingLabel="Salvando…">
        Salvar plano
      </SubmitButton>
    </form>
  );
}

export function CreatePlanForm() {
  const [state, action] = useActionState(createPlanAction, EMPTY_FORM_STATE);

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      <PlanFields
        values={{ name: "", description: "", price: "", interval: "MONTH", features: "", paymentLink: "" }}
        state={state.ok ? EMPTY_FORM_STATE : state}
        idPrefix="new-plan"
      />
      <SubmitButton pendingLabel="Criando…">Criar plano</SubmitButton>
    </form>
  );
}
