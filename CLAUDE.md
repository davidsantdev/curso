@AGENTS.md

# Projeto

Plataforma de cursos (trilhas → módulos → aulas) para ensinar a vender online, monetizada por plano pago.
Interface e textos em **português do Brasil**. Visão geral, comandos e deploy: [README.md](README.md).

## Regras do código

- **Next.js 16 sem Cache Components**: páginas que leem sessão são dinâmicas; `params`/`searchParams` são Promises;
  o middleware se chama `proxy` (`src/proxy.ts`); `error.tsx` recebe `retry`.
- **Toda Server Action confere permissão no servidor** (`requireUser` / `requireAdmin` / `authorizeLesson`).
  O proxy e os layouts são só conveniência — nunca a única barreira.
- **Acesso pago** é decidido só por `subscriptions` + `canAccessLesson` (`src/lib/content.ts`). Ativar, renovar ou
  cortar plano sempre passa por `src/lib/billing.ts`. O modelo é de períodos de acesso **sem cobrança automática**.
- **Pagamentos**: o plano só é liberado por `settleMercadoPagoPayment` (`src/lib/checkout.ts`), a partir do que a
  API do Mercado Pago responde. Nunca decida nada com parâmetros da URL de retorno nem com o corpo do webhook —
  deles se usa só o id do pagamento. A troca de `payments.status` para `PAID` é atômica (um `UPDATE … WHERE`).
- **Dinheiro** é sempre inteiro em centavos (`amountCents`); formate com `formatMoney`.
- **Respostas do quiz** (`isCorrect`, `explanation`) nunca vão para componentes do navegador antes do envio.
- **Não importe `@/db/schema` (nem `@/db`) em componentes `"use client"`** — o schema puxa `node:crypto`.
  Listas de enums para o navegador saem de `src/lib/format.ts` / `src/lib/theme.ts`.
- **Formulários de edição** usam `useEditForm` (`src/components/ui/form.tsx`) para o React 19 não limpar os
  campos quando a validação falha; formulários de criação podem usar `useActionState` direto.
- **E-mails**: `sendEmail` (`src/lib/email.ts`) nunca lança erro; os textos ficam em `src/lib/email-templates.ts`.
- **Tabelas largas** ficam em um `div.overflow-x-auto` com a classe `table-base` (as células são `relative`
  para um `sr-only` dentro da tabela não criar rolagem lateral na página).
- Cores: tokens do Tailwind em `src/app/globals.css` (`brand`, `magenta`, `mint`, `sun`, `danger`, `navy`, `ink`,
  `muted`, `line`, `surface`). Gráficos e barras de progresso seguem a skill de dataviz (uma cor por série,
  trilho no mesmo tom, valores em cor de texto).

## Conteúdo

- O conteúdo inicial das trilhas fica em `scripts/content` (um arquivo por trilha) e só é carregado pelo
  `npm run db:seed` quando o banco está **vazio**. Em um banco que já existe, o conteúdo é editado em
  `/admin/conteudo`.
- Público-alvo: quem **não sabe nada** de dropshipping. Texto simples, sem jargão (ou com o jargão explicado na
  primeira vez), sem promessa de ganho. Valores de taxas e impostos sempre com o aviso de conferir o valor atual.
- No conteúdo em Markdown, linhas seguidas dentro de uma citação (`>`) viram um parágrafo só: use listas.
- A **primeira aula grátis da grade** aparece aberta na página inicial (`getFeaturedLesson`, em
  `src/lib/content.ts`). Só aula grátis pode entrar ali, porque a página é pública. Com vídeo cadastrado, a seção
  mostra só o vídeo; sem vídeo, mostra o texto dividido pelos capítulos `## …` (o primeiro aberto, o resto em
  "Continuar lendo").
- Vídeo da aula pode ser link (YouTube, Vimeo, Panda, Bunny, .mp4 https) ou arquivo da pasta `public/videos/`
  (`/videos/nome.mp4`, com capa `nome.jpg` e legenda `nome.vtt` achadas pelo nome). Essa pasta é ignorada pelo
  Git: serve para desenvolvimento, não para produção.
- Aulas no **estilo do professor** seguem `roteiros/estilo-do-professor.md` (a aula 1 já está assim; as outras
  ainda em texto didático). O roteiro de gravação de cada aula fica em `roteiros/`.
- `video/` é um projeto separado (Remotion, com `package.json` próprio) que transforma a gravação da voz em vídeo
  editado. Fica fora do `tsconfig` do site. As cenas se prendem a frases do roteiro (`em("…")`), então o texto
  do roteiro e o da gravação precisam bater. O Remotion usa as portas 3100 e 3200, porque a 3000 é do `next dev`.
  Guia: `video/README.md`.

## Verificar mudanças

`npm run typecheck` e `npm run build`. Contas locais: `admin@vendra.test` / `admin12345` e
`aluno@vendra.test` / `aluno12345` (`npm run db:reset` recria o banco — pare o `npm run dev` antes no Windows).

Para testar o pagamento sem conta real, aponte `MERCADOPAGO_API_URL` (e `RESEND_API_URL`) para um servidor que
simule as APIs; o login tem limite de 8 tentativas por 10 minutos por e-mail, o que afeta testes automáticos longos.
