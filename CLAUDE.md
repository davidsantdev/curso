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
- **Pagamentos**: a venda acontece na Cakto (a Hotmart fica pronta, desligada). O plano só é liberado por
  `settleSaleEvent` (`src/lib/checkout.ts`), chamado pelos webhooks `/api/webhooks/cakto` (assinatura HMAC com
  `CAKTO_WEBHOOK_SECRET`) e `/api/webhooks/hotmart` (hottok). Nada que vem do navegador libera acesso. A venda é
  identificada por `payments.provider` + `providerRef` (pedido da Cakto), com índice único: avisos repetidos liberam
  uma vez só. O link do plano (`plans.paymentLink`) diz a plataforma e a oferta; a conta vem do `sck`/`xcod` do
  link, do e-mail ou é criada.
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
  (`/videos/nome.mp4`, com capa `nome.jpg` e legenda `nome.vtt` achadas pelo nome). No site publicado, use link
  (a Vercel não baixa arquivos do Git LFS por padrão).
- **Commits mandam tudo** (pedido do dono do projeto): código, textos, voz, vídeos e PDFs. Mídia (.mp4, .mp3,
  .mov, .webm, .m4a, .pdf) vai pelo Git LFS (`.gitattributes`). Ficam fora só dependências (`node_modules`), arquivos de
  build, o banco local (`data/`) e `.env`.
- Aulas no **estilo do professor** seguem `roteiros/estilo-do-professor.md` (a aula 1 já está assim; as outras
  ainda em texto didático). O roteiro de gravação de cada aula fica em `roteiros/`.
- `video/` é um projeto separado (Remotion, com `package.json` próprio) que transforma a gravação da voz em vídeo
  editado. Fica fora do `tsconfig` do site. As cenas se prendem a frases do roteiro (`em("…")`), então o texto
  do roteiro e o da gravação precisam bater. O Remotion usa as portas 3100 e 3200, porque a 3000 é do `next dev`.
  Guia: `video/README.md`. Da aula 2 em diante, o vídeo é feito sobre os slides do PDF (`video/src/aula2/`): voz do
  ElevenLabs, cortes em `video/audio/aula-NN/cortes.json`, marcações presas às frases da fala. Depois de renderizar,
  confira alguns quadros (`npx remotion still`) antes de publicar em `public/videos/`. A aula 3
  (`video/src/aula3/`) volta ao estilo da aula 1, mais editada e com memes. Os memes são sempre originais (emoji
  Noto Color Emoji, letra Anton, desenhos em código), nunca imagens de memes da internet (direito autoral e rosto de
  gente real num curso pago). Os componentes da aula 1 (`Fala`, `Barras`, `Hud`, `Legenda`) leem a aula do
  `TempoContexto` (`video/src/lib/contexto.ts`).
- **Pré-estreia** (`site.prelaunch`): avisos de "vídeos em gravação" e "preço de estreia" ficam em
  `src/components/prelaunch.tsx`; a contagem vem de `videoProgress(catalog)` (aulas publicadas com `videoUrl`).
  Texto novo sobre o preço precisa ser verdadeiro: não prometa data de vídeo nem aumento de preço que não foi decidido.
- As videoaulas são gravadas explicando os PDFs de `materiais/pdf/` (um por aula, slides 16:9), gerados por
  `npm run materiais:pdf` a partir de `scripts/content` (ou de `materiais/resumos/aula-NN.md`, quando existe).
  Mudou o texto de uma aula? Refaça o PDF dela (`npm run materiais:pdf -- NN`). No site, o aluno baixa o PDF por
  `/aula/[id]/pdf` (confere `canAccessLesson`; o arquivo é achado por `lessonPdf`, pela trilha e pelo título, com o
  nome de `pdfSlug`, que o gerador também usa). Aula com vídeo não mostra o texto, só o vídeo e o botão do PDF. Depois de mexer no visual, confira
  algumas aulas de trilhas diferentes: o gerador decide quanto cabe em cada slide no próprio Chrome.

## Verificar mudanças

`npm run typecheck` e `npm run build`. Contas locais: `admin@vendra.test` / `admin12345` e
`aluno@vendra.test` / `aluno12345` (`npm run db:reset` recria o banco — pare o `npm run dev` antes no Windows).

Para testar o pagamento sem conta real, defina `CAKTO_WEBHOOK_SECRET` no `.env.local`, cadastre um link
`https://pay.cakto.com.br/...` no plano e mande avisos simulados para `/api/webhooks/cakto`, assinados com
`X-Cakto-Timestamp` e `X-Cakto-Signature: v1=<HMAC-SHA256 de "{timestamp}.{corpo}">`. O login tem limite de 8 tentativas por 10 minutos por e-mail, o que
afeta testes automáticos longos.
