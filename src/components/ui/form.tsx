"use client";

import {
  useActionState,
  useTransition,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { EMPTY_FORM_STATE, type FormState } from "@/lib/forms";
import { cn } from "@/lib/utils";

/* ------------------------------ Envio ------------------------------- */

/**
 * Para formulários de EDIÇÃO: envia a action sem o reset automático do React 19.
 * Assim, se a validação falhar, nada do que foi digitado se perde.
 * Use `onSubmit` no <form> e passe `pending` para o SubmitButton.
 */
export function useEditForm(action: (state: FormState, formData: FormData) => Promise<FormState>) {
  const [state, dispatch, pending] = useActionState(action, EMPTY_FORM_STATE);
  const [, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  }

  return { state, onSubmit, pending };
}

/* ------------------------------ Botões ------------------------------ */

/** Botão de envio que mostra o carregamento sozinho enquanto a action roda. */
export function SubmitButton({
  children,
  className = "btn btn-primary",
  pendingLabel,
  pending: pendingOverride,
  ...props
}: {
  children: ReactNode;
  className?: string;
  pendingLabel?: string;
  /** Informe quando o formulário usa `useEditForm` (o status automático não funciona nesse caso). */
  pending?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "className" | "children">) {
  const status = useFormStatus();
  const pending = pendingOverride ?? status.pending;

  return (
    <button type="submit" className={className} disabled={pending || props.disabled} aria-busy={pending} {...props}>
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}

/** Botão de envio que pede confirmação antes (para excluir, cancelar etc.). */
export function ConfirmSubmitButton({
  children,
  message,
  className = "btn btn-danger-ghost btn-sm",
  ...props
}: {
  children: ReactNode;
  message: string;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "className" | "children" | "onClick">) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      {...props}
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

/* ------------------------------ Campos ------------------------------ */

function FieldShell({
  id,
  label,
  error,
  hint,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
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

type FieldBase = { label: string; name: string; error?: string; hint?: ReactNode; wrapperClassName?: string };

export function Field({
  label,
  name,
  error,
  hint,
  wrapperClassName,
  className,
  ...props
}: FieldBase & InputHTMLAttributes<HTMLInputElement>) {
  const id = props.id ?? `f-${name}`;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={wrapperClassName}>
      <input
        {...props}
        id={id}
        name={name}
        className={cn("input", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  name,
  error,
  hint,
  wrapperClassName,
  className,
  ...props
}: FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = props.id ?? `f-${name}`;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={wrapperClassName}>
      <textarea
        {...props}
        id={id}
        name={name}
        className={cn("input", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  name,
  error,
  hint,
  wrapperClassName,
  className,
  children,
  ...props
}: FieldBase & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = props.id ?? `f-${name}`;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={wrapperClassName}>
      <select
        {...props}
        id={id}
        name={name}
        className={cn("input appearance-auto", className)}
        aria-invalid={error ? true : undefined}
      >
        {children}
      </select>
    </FieldShell>
  );
}

/** Caixa de seleção com título e explicação. */
export function CheckboxField({
  label,
  description,
  name,
  ...props
}: { label: string; description?: string; name: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const id = props.id ?? `f-${name}`;
  return (
    <label
      htmlFor={id}
      className="border-line hover:border-brand-300 flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-3.5 transition"
    >
      <input {...props} id={id} name={name} type="checkbox" className="accent-brand-500 mt-0.5 size-4.5 shrink-0" />
      <span className="min-w-0">
        <span className="text-navy-900 block text-[15px] leading-tight font-medium">{label}</span>
        {description ? <span className="text-muted mt-1 block text-sm leading-snug">{description}</span> : null}
      </span>
    </label>
  );
}

/* ----------------------------- Mensagens ----------------------------- */

export function FormMessage({ state, className }: { state: FormState; className?: string }) {
  if (!state.message) return null;
  return (
    <p
      role="status"
      className={cn(
        "rounded-xl px-4 py-3 text-sm font-medium",
        state.ok ? "bg-mint-50 text-mint-700" : "bg-danger-50 text-danger-700",
        className,
      )}
    >
      {state.message}
    </p>
  );
}
