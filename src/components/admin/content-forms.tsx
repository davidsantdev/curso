"use client";

import { useActionState, useId, useState } from "react";
import { Eye, PencilLine } from "lucide-react";
import {
  createLessonAction,
  createModuleAction,
  createTrackAction,
  updateLessonAction,
  updateModuleAction,
  updateTrackAction,
} from "@/actions/admin-content";
import { Markdown } from "@/components/markdown";
import {
  CheckboxField,
  Field,
  FormMessage,
  SelectField,
  SubmitButton,
  TextAreaField,
  useEditForm,
} from "@/components/ui/form";
import { LEVEL_LABEL } from "@/lib/format";
import { EMPTY_FORM_STATE } from "@/lib/forms";
import { TRACK_ICON_KEYS, TRACK_ICON_LABEL, TRACK_THEME_KEYS, TRACK_THEMES } from "@/lib/theme";
import { cn } from "@/lib/utils";

// (Não importe "@/db/schema" aqui: este arquivo roda no navegador.)
const TRACK_LEVELS = Object.keys(LEVEL_LABEL) as Array<keyof typeof LEVEL_LABEL>;

/* ------------------------------------------------------------------ */
/* Criação rápida (um campo só)                                        */
/* ------------------------------------------------------------------ */

function QuickCreateForm({
  action,
  hidden,
  label,
  placeholder,
  button,
}: {
  action: typeof createTrackAction;
  hidden?: Record<string, string>;
  label: string;
  placeholder: string;
  button: string;
}) {
  const [state, formAction] = useActionState(action, EMPTY_FORM_STATE);
  const inputId = useId();

  return (
    <form action={formAction} className="space-y-2">
      {Object.entries(hidden ?? {}).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor={inputId}>
          {label}
        </label>
        <input
          id={inputId}
          name="title"
          required
          minLength={3}
          placeholder={placeholder}
          defaultValue={state.ok ? "" : state.values?.title}
          className="input"
          aria-invalid={state.errors?.title ? true : undefined}
        />
        <SubmitButton className="btn btn-primary shrink-0" pendingLabel="Criando…">
          {button}
        </SubmitButton>
      </div>
      {state.errors?.title ? <p className="text-danger-600 text-sm">{state.errors.title}</p> : null}
      {state.message ? (
        <p className={cn("text-sm", state.ok ? "text-mint-700" : "text-danger-600")}>{state.message}</p>
      ) : null}
    </form>
  );
}

export function CreateTrackForm() {
  return (
    <QuickCreateForm
      action={createTrackAction}
      label="Nome da nova trilha"
      placeholder="Ex.: Vendas no Instagram"
      button="Criar trilha"
    />
  );
}

export function CreateModuleForm({ trackId }: { trackId: string }) {
  return (
    <QuickCreateForm
      action={createModuleAction}
      hidden={{ trackId }}
      label="Nome do novo módulo"
      placeholder="Ex.: Primeiros passos"
      button="Adicionar módulo"
    />
  );
}

export function CreateLessonForm({ moduleId }: { moduleId: string }) {
  return (
    <QuickCreateForm
      action={createLessonAction}
      hidden={{ moduleId }}
      label="Título da nova aula"
      placeholder="Título da nova aula"
      button="Adicionar aula"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Trilha                                                              */
/* ------------------------------------------------------------------ */

export function TrackForm({
  track,
}: {
  track: {
    id: string;
    title: string;
    slug: string;
    description: string;
    level: string;
    icon: string;
    color: string;
    published: boolean;
  };
}) {
  const { state, onSubmit, pending } = useEditForm(updateTrackAction);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="hidden" name="id" value={track.id} />
      <FormMessage state={state} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Título" name="title" required defaultValue={track.title} error={state.errors?.title} />
        <Field
          label="Endereço (slug)"
          name="slug"
          defaultValue={track.slug}
          error={state.errors?.slug}
          hint="Aparece na URL: /trilhas/endereco. Deixe vazio para gerar pelo título."
        />
      </div>
      <TextAreaField
        label="Descrição"
        name="description"
        rows={3}
        maxLength={400}
        defaultValue={track.description}
        error={state.errors?.description}
      />
      <div className="grid gap-5 md:grid-cols-3">
        <SelectField label="Nível" name="level" defaultValue={track.level} error={state.errors?.level}>
          {TRACK_LEVELS.map((level) => (
            <option key={level} value={level}>
              {LEVEL_LABEL[level]}
            </option>
          ))}
        </SelectField>
        <SelectField label="Ícone" name="icon" defaultValue={track.icon} error={state.errors?.icon}>
          {TRACK_ICON_KEYS.map((icon) => (
            <option key={icon} value={icon}>
              {TRACK_ICON_LABEL[icon]}
            </option>
          ))}
        </SelectField>
        <SelectField label="Cor" name="color" defaultValue={track.color} error={state.errors?.color}>
          {TRACK_THEME_KEYS.map((color) => (
            <option key={color} value={color}>
              {TRACK_THEMES[color].label}
            </option>
          ))}
        </SelectField>
      </div>
      <CheckboxField
        name="published"
        label="Trilha publicada"
        description="Quando desmarcada, a trilha some para os alunos (o progresso deles fica guardado)."
        defaultChecked={track.published}
      />
      <SubmitButton pending={pending} pendingLabel="Salvando…">
        Salvar trilha
      </SubmitButton>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Módulo                                                              */
/* ------------------------------------------------------------------ */

export function ModuleForm({
  module,
}: {
  module: { id: string; title: string; description: string; published: boolean };
}) {
  const { state, onSubmit, pending } = useEditForm(updateModuleAction);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="id" value={module.id} />
      <FormMessage state={state} />
      <Field
        label="Nome do módulo"
        name="title"
        id={`module-title-${module.id}`}
        required
        defaultValue={module.title}
        error={state.errors?.title}
      />
      <TextAreaField
        label="Descrição"
        name="description"
        id={`module-description-${module.id}`}
        rows={2}
        maxLength={300}
        defaultValue={module.description}
        error={state.errors?.description}
      />
      <CheckboxField
        name="published"
        id={`module-published-${module.id}`}
        label="Módulo publicado"
        defaultChecked={module.published}
      />
      <SubmitButton className="btn btn-primary btn-sm" pending={pending} pendingLabel="Salvando…">
        Salvar módulo
      </SubmitButton>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Aula                                                                */
/* ------------------------------------------------------------------ */

const MARKDOWN_HELP = "Use ## para títulos, **negrito**, - para listas, > para destaques e | para tabelas.";

export function LessonForm({
  lesson,
}: {
  lesson: {
    id: string;
    title: string;
    summary: string;
    videoUrl: string | null;
    durationMinutes: number;
    xpReward: number;
    content: string;
    objectives: string[];
    isFree: boolean;
    published: boolean;
    tasks: string[];
    resources: Array<{ title: string; url: string }>;
  };
}) {
  const { state, onSubmit, pending } = useEditForm(updateLessonAction);
  const [content, setContent] = useState(lesson.content);
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <input type="hidden" name="id" value={lesson.id} />

      <div className="card min-w-0 space-y-5 p-6 sm:p-7">
        <Field label="Título da aula" name="title" required defaultValue={lesson.title} error={state.errors?.title} />
        <TextAreaField
          label="Resumo"
          name="summary"
          rows={2}
          maxLength={240}
          defaultValue={lesson.summary}
          error={state.errors?.summary}
          hint="Uma frase que aparece na lista de aulas."
        />
        <TextAreaField
          label="O que o aluno vai aprender"
          name="objectives"
          rows={4}
          defaultValue={lesson.objectives.join("\n")}
          error={state.errors?.objectives}
          hint="Um tópico por linha (até 8). Aparece para todos — inclusive quem ainda não assinou —, então é o que dá vontade de aprender."
        />
        <Field
          label="Link do vídeo"
          name="videoUrl"
          type="url"
          placeholder="https://www.youtube.com/watch?v=…"
          defaultValue={lesson.videoUrl ?? ""}
          error={state.errors?.videoUrl}
          hint="YouTube, Vimeo, Panda Video, Bunny Stream ou arquivo .mp4. Deixe vazio para aula só em texto."
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label htmlFor="f-content" className="label mb-0">
              Texto da aula
            </label>
            <div className="bg-surface flex rounded-lg p-1" role="tablist" aria-label="Modo do editor">
              {(
                [
                  ["write", "Escrever", PencilLine],
                  ["preview", "Pré-visualizar", Eye],
                ] as const
              ).map(([key, label, Icon]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  onClick={() => setTab(key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
                    tab === key ? "text-brand-700 bg-white shadow-sm" : "text-ink",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          {/* O textarea continua no formulário mesmo na pré-visualização. */}
          <textarea
            id="f-content"
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={22}
            className={cn("input font-mono text-sm leading-relaxed", tab === "preview" && "hidden")}
            aria-invalid={state.errors?.content ? true : undefined}
          />
          {tab === "preview" ? (
            <div className="border-line min-h-80 rounded-xl border bg-white p-6">
              {content.trim() ? <Markdown>{content}</Markdown> : <p className="text-muted">Nada para mostrar ainda.</p>}
            </div>
          ) : null}
          {state.errors?.content ? (
            <p className="text-danger-600 mt-1.5 text-sm">{state.errors.content}</p>
          ) : (
            <p className="text-muted mt-1.5 text-sm">{MARKDOWN_HELP}</p>
          )}
        </div>
      </div>

      <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
        <div className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold">Configurações</h2>
          <CheckboxField
            name="published"
            label="Aula publicada"
            description="Rascunhos não aparecem para os alunos."
            defaultChecked={lesson.published}
          />
          <CheckboxField
            name="isFree"
            label="Aula grátis"
            description="Liberada para quem está no plano grátis."
            defaultChecked={lesson.isFree}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Duração (min)"
              name="durationMinutes"
              type="number"
              min={1}
              max={600}
              required
              defaultValue={lesson.durationMinutes}
              error={state.errors?.durationMinutes}
            />
            <Field
              label="XP da aula"
              name="xpReward"
              type="number"
              min={0}
              max={500}
              required
              defaultValue={lesson.xpReward}
              error={state.errors?.xpReward}
            />
          </div>
        </div>

        <div className="card space-y-5 p-6">
          <TextAreaField
            label="Tarefas práticas"
            name="tasks"
            rows={5}
            defaultValue={lesson.tasks.join("\n")}
            hint="Uma tarefa por linha."
          />
          <TextAreaField
            label="Materiais"
            name="resources"
            rows={4}
            placeholder="Planilha de custos | https://…"
            defaultValue={lesson.resources.map((resource) => `${resource.title} | ${resource.url}`).join("\n")}
            error={state.errors?.resources}
            hint="Um por linha, no formato: Título | link"
          />
        </div>

        <div className="card p-4">
          <SubmitButton className="btn btn-primary w-full" pending={pending} pendingLabel="Salvando…">
            Salvar aula
          </SubmitButton>
          {state.message && !pending ? (
            <p className={cn("mt-2 text-center text-sm", state.ok ? "text-mint-700" : "text-danger-600")}>
              {state.message}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
