# Vendra — plataforma de cursos para vender online

Plataforma completa de ensino por **trilhas → módulos → aulas**, com área do aluno, gamificação, certificados,
plano grátis + plano pago (Pix, cartão e boleto) e painel de administração para gerenciar conteúdo, alunos,
pagamentos e cupons.

> **"Vendra" é um nome provisório.** Troque o nome, o slogan e o e-mail de contato em
> [`src/config/site.ts`](src/config/site.ts) — o site inteiro, os e-mails e as imagens de compartilhamento leem dali.

---

## Rodando no seu computador

Requisitos: **Node.js 20 ou mais novo** (testado com o 22).

```bash
npm install
npm run dev
```

Abra **http://localhost:3000**. Na primeira vez, o banco de dados local é criado sozinho (arquivo `data/app.db`)
com as 10 trilhas (77 aulas já escritas), 2 planos e duas contas de teste:

| Conta          | E-mail              | Senha        |
| -------------- | ------------------- | ------------ |
| Administrador  | `admin@vendra.test` | `admin12345` |
| Aluno          | `aluno@vendra.test` | `aluno12345` |

Comandos úteis:

| Comando              | O que faz                                                      |
| -------------------- | -------------------------------------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento                                    |
| `npm run db:reset`   | Apaga o banco local e recria com os dados iniciais (pare o `dev` antes) |
| `npm run db:studio`  | Abre um visualizador do banco no navegador                     |
| `npm run typecheck`  | Confere os tipos do TypeScript                                 |
| `npm run build`      | Gera a versão de produção                                      |

Sem nenhuma configuração, o projeto roda em **modo demonstração**: o checkout ativa o plano sem cobrar e os
e-mails aparecem no terminal. Para cobrar e enviar e-mails de verdade, veja as seções
[Planos e pagamentos](#planos-e-pagamentos) e [E-mails](#e-mails).

---

## O que já está pronto

**Site público** — pensado para quem **não sabe nada** de dropshipping

- Página inicial que abre com "Venda pela internet sem ter estoque", explica o modelo em 3 passos (você anuncia →
  o cliente compra → o fornecedor entrega) e só depois apresenta o nome "dropshipping"
- **Aula 1 aberta na página inicial**: logo depois do topo, qualquer visitante lê a primeira aula grátis, no
  estilo do professor, sem cadastro (o começo aparece aberto e o resto em "Continuar lendo"). Quando a aula ganha
  um vídeo no admin, o vídeo toma o lugar do texto ali (dentro da plataforma, o texto continua embaixo do vídeo)
- Vitrine dos métodos (selos Grátis/Pro), recursos, planos e dúvidas frequentes
- **O que você aprende** (`/cursos`): a grade completa, aberta a qualquer visitante, com todas as trilhas, módulos,
  aulas e o que se aprende em cada uma — inclusive nas aulas pagas
- **Dicionário** (`/glossario`): 61 termos de quem vende pela internet explicados em linguagem simples, com busca,
  filtro por assunto e link para a trilha que ensina cada um
- Página de planos, termos de uso e política de privacidade (textos modelo — revise com um advogado)
- Cadastro, login, "esqueci minha senha" e redefinição de senha
- Imagem de compartilhamento (WhatsApp, Instagram, Facebook) gerada com o nome e o slogan do site

**Área do aluno**

- **Painel**: continue de onde parou, nível e XP, sequência de dias, aulas, tarefas, certificados,
  progresso por trilha, semana de estudos e conquistas recentes
- **Trilhas** e página de cada trilha com módulos, progresso e selo Pro/cadeado nas aulas pagas
- **Aula**: "Nesta aula você vai aprender", vídeo (YouTube, Vimeo, Panda, Bunny ou .mp4), texto em Markdown,
  tarefas práticas, materiais, quiz com correção e explicação, anotações com salvamento automático, comentários e
  botão "Concluir aula"
- **Aulas Pro para quem está no grátis**: aparecem com os tópicos, as tarefas e uma prévia borrada com o convite
  para assinar — o conteúdo em si nunca é enviado ao navegador
- **Conquistas**: 7 níveis, 10 conquistas e regras de XP
- **Ferramentas**: calculadoras de margem e preço, resultado de campanha e meta de vendas
- **Certificados**: emitidos automaticamente ao concluir uma trilha, com página pública de verificação e
  impressão em PDF
- **Assinatura**: planos, checkout com cupom, pagamentos aguardando confirmação (com "Continuar pagamento" e
  "Já paguei"), validade do acesso, renovação e histórico de pagamentos
- **Minha conta**: nome, e-mail, troca de senha, **baixar os meus dados** e **excluir a conta** (LGPD)
- **App instalável**: no celular ou no computador, o site pode ser instalado como aplicativo
  ("Adicionar à tela de início"), com ícone próprio

**Administração** (`/admin`, só para administradores)

- **Visão geral**: alunos, assinantes, receita mensal, recebido em 30 dias, gráficos de cadastros e de aulas
  concluídas, últimos pagamentos e alunos
- **Conteúdo**: criar, editar, reordenar, publicar e excluir trilhas, módulos e aulas; editor de aula com
  pré-visualização; editor de quiz
- **Alunos**: busca, filtros, progresso, liberar acesso manualmente (vendas por fora), cortar acesso,
  tornar administrador, redefinir senha
- **Comentários**: tudo o que os alunos escreveram nas aulas, com link para responder e botão de apagar
- **Pagamentos**: todos os pagamentos com filtro por situação, totais e o botão "Conferir" (consulta o
  Mercado Pago na hora)
- **Planos**: preço, período, benefícios, destaque e "à venda"
- **Cupons**: desconto em porcentagem, limite de usos e validade; cupom de 100% vira cortesia

---

## O conteúdo

**As 10 trilhas já vêm com as 77 aulas escritas** — texto, "o que você vai aprender", tarefas práticas e um quiz
por módulo:

| Trilha | Aulas | Acesso |
| --- | --- | --- |
| Vender sem estoque | 6 | Grátis |
| Produtos e fornecedores | 7 | Pro |
| Criar sua loja virtual | 9 | Pro |
| Criar sites e páginas de venda | 8 | Pro |
| Pagamentos e checkout | 8 | Pro |
| Anúncios no Facebook e Instagram (Meta Ads) | 9 | Pro |
| Anúncios no TikTok (TikTok Ads) | 7 | Pro |
| Anúncios no Google (Google Ads) | 6 | Pro |
| Robôs e automações | 8 | Pro |
| Vender em marketplaces | 9 | Pro |

O que **ainda falta** no conteúdo e só você pode fazer:

- **Vídeos.** As aulas funcionam como aulas em texto. Para adicionar um vídeo, cole o link no editor da aula.
  A aula 1 já tem vídeo editado (`video/out/aula-01.mp4`, ver [`video/README.md`](video/README.md)): suba no
  YouTube como não listado (ou no Bunny/Panda) e cole o link. No seu computador, ele já está no ar pela pasta
  `public/videos/`: um arquivo ali é usado como `/videos/nome.mp4`, e a capa (`nome.jpg`) e a legenda (`nome.vtt`)
  com o mesmo nome entram sozinhas. Voz e vídeos vão para o GitHub pelo Git LFS (`.gitattributes`); mesmo assim,
  no site publicado use o link do YouTube/Bunny/Panda: a Vercel não baixa arquivos LFS por padrão, e servir vídeo
  pesado direto do site fica lento e caro.
- **Revisão.** Leia as aulas e ajuste o tom, os exemplos e as ferramentas que você recomenda. Nas aulas sobre
  impostos, MEI e taxas, os valores mudam com o tempo: confira antes de publicar.

### Onde o conteúdo fica

- **No dia a dia: em Administração → Conteúdo.** É lá que você edita textos, adiciona vídeos, cria aulas e
  publica. O que os alunos veem vem sempre do banco de dados.
- **Conteúdo inicial:** [`scripts/content`](scripts/content), um arquivo por trilha. Esses arquivos só são lidos
  quando o banco está vazio (primeira execução ou `npm run db:reset`). Editar um deles **não** altera um banco
  que já existe.

### O estilo do professor

A aula 1 foi escrita como um vídeo de YouTube falado de frente pra câmera, seguindo o guia
[`roteiros/estilo-do-professor.md`](roteiros/estilo-do-professor.md). As outras aulas ainda estão em texto
didático; o mesmo guia serve para reescrever qualquer uma delas. Divida o texto em capítulos com `## Título`: eles
organizam a leitura e viram os capítulos do vídeo.

### Passo a passo no admin

1. **Trilha**: crie e preencha título, descrição, nível, ícone e cor.
2. **Módulos**: adicione os módulos da trilha (use as setas ↑↓ para ordenar).
3. **Aulas**: adicione dentro de cada módulo e clique para editar: "o que o aluno vai aprender" (um tópico por
   linha — aparece para todos, até para quem não assinou), vídeo, texto, tarefas (uma por linha), materiais
   (`Título | link`), duração, XP e quiz.
4. Marque **Aula grátis** nas aulas que o plano gratuito pode abrir. Dica: liberar a primeira aula de um método
   Pro funciona como amostra.
5. Publique: a aula, o módulo e a trilha precisam estar publicados para o aluno ver.

---

## Planos e pagamentos

### Como funciona

O modelo é de **períodos de acesso, sem cobrança automática**: o aluno paga uma vez — por **Pix, cartão (em até
12x) ou boleto** — e libera 1 mês ou 1 ano. Quando o período está acabando, ele recebe um e-mail e decide se
renova. Ao renovar, o novo período é somado ao que ainda resta.

O acesso pago é decidido em um único lugar: a tabela `subscriptions`, controlada por
[`src/lib/billing.ts`](src/lib/billing.ts). Um plano pode ser liberado de quatro formas:

| Forma | Quando acontece |
| --- | --- |
| **Mercado Pago** | Pagamento real aprovado |
| **Cupom de 100%** | Cortesia: o aluno "compra" sem pagar |
| **Liberação manual** | Administração → Alunos → (aluno) → "Liberar acesso". Para vendas por fora |
| **Demonstração** | Sem Mercado Pago configurado: ativa na hora, sem cobrar. Só para testar |

### Ligando o Mercado Pago

1. Crie a sua conta no [Mercado Pago](https://www.mercadopago.com.br) e, no painel de desenvolvedores
   (**Suas integrações**), crie uma aplicação do tipo **Checkout Pro**.
2. Copie o **Access Token** e coloque no arquivo `.env`:

   ```bash
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
   NEXT_PUBLIC_SITE_URL=https://seudominio.com.br
   ```

   Com o token preenchido, o botão do checkout passa a ser "Pagar com Pix, cartão ou boleto".
   O `NEXT_PUBLIC_SITE_URL` precisa ser o endereço público de verdade: é para ele que o Mercado Pago devolve o
   aluno e envia os avisos de pagamento.
3. Em **Suas integrações → Webhooks**, cadastre a URL
   `https://seudominio.com.br/api/webhooks/mercadopago`, marque o evento **Pagamentos** e copie a
   **assinatura secreta** para o `.env`:

   ```bash
   MERCADOPAGO_WEBHOOK_SECRET=...
   ```

4. **Teste antes de vender.** Use as credenciais de teste do Mercado Pago e uma compra de valor baixo. Confira:
   o plano é liberado sozinho, o e-mail de confirmação chega e o pagamento aparece em Administração → Pagamentos.

> **O que foi testado e o que não foi.** O fluxo inteiro — criar a cobrança, aviso assinado, valor adulterado,
> aprovação, avisos repetidos, reembolso, "Já paguei" e rotina diária — foi testado contra um **simulador** que
> imita a API do Mercado Pago. Ele ainda **não** foi testado com uma conta real, porque isso depende das suas
> credenciais. Faça o passo 4 antes de divulgar o site.

### O que a plataforma faz sozinha

- **Libera o plano** quando o Mercado Pago avisa que o pagamento foi aprovado e envia o e-mail de confirmação.
- **Nunca confia no navegador:** o plano só é liberado depois de consultar o pagamento direto na API do Mercado
  Pago, conferindo valor e moeda. Avisos repetidos não liberam duas vezes.
- **Reembolso:** você devolve o dinheiro no painel do Mercado Pago; a plataforma recebe o aviso, marca o
  pagamento como reembolsado e encerra aquele período. Lembre que o cliente tem **7 dias** para desistir da
  compra (Código de Defesa do Consumidor) — isso está prometido no checkout e nos termos.
- **Pagamentos pendentes** (boleto, Pix não pago): aparecem para o aluno com "Continuar pagamento" e "Já paguei".
  Cobranças abandonadas há mais de 10 dias são encerradas pela [rotina diária](#rotina-diária).

### Cupons

Em **Administração → Cupons**: código, desconto em %, limite de usos e validade. O aluno digita no checkout, ou
você divulga um link que já abre com o desconto: `https://seudominio.com.br/checkout/pro-anual?cupom=CODIGO`.

### Usando outro meio de pagamento

A integração está isolada em dois arquivos: [`src/lib/payments/mercadopago.ts`](src/lib/payments/mercadopago.ts)
(conversa com a API) e [`src/lib/checkout.ts`](src/lib/checkout.ts) (cria a cobrança e confirma o pagamento).
Para trocar de gateway, escreva o equivalente desses dois e uma rota em `src/app/api/webhooks/<gateway>/route.ts`
que termine chamando `activateSubscription(...)`. O restante do app não muda.

---

## E-mails

Os e-mails são enviados pelo [Resend](https://resend.com). Sem a chave configurada, eles aparecem no terminal do
`npm run dev` (útil para testar, inclusive o link de recuperação de senha).

1. Crie a conta no Resend e **verifique o seu domínio** (eles mostram os registros para colar onde o domínio foi
   registrado).
2. Crie uma chave de API e coloque no `.env`:

   ```bash
   RESEND_API_KEY=re_...
   EMAIL_FROM=Vendra <contato@seudominio.com.br>
   NEXT_PUBLIC_SUPPORT_EMAIL=contato@seudominio.com.br
   ```

E-mails que a plataforma envia:

| E-mail | Quando |
| --- | --- |
| Boas-vindas | No cadastro |
| Redefinir a senha | Em "esqueci minha senha" (link válido por 1 hora) |
| Pagamento confirmado | Quando o Mercado Pago aprova o pagamento |
| O seu acesso termina em breve | 3 dias antes do fim do período, pela rotina diária |

Os textos ficam em [`src/lib/email-templates.ts`](src/lib/email-templates.ts).

---

## Rotina diária

A rota `/api/cron/diario` deve ser chamada **uma vez por dia**. Ela:

1. avisa por e-mail quem tem o acesso terminando nos próximos 3 dias;
2. confere no Mercado Pago os pagamentos que ainda estão aguardando (rede de segurança caso um aviso se perca);
3. encerra cobranças abandonadas há mais de 10 dias;
4. apaga sessões e links de senha vencidos.

Defina uma senha longa em `CRON_SECRET`. Na **Vercel**, só isso basta: o arquivo [`vercel.json`](vercel.json) já
agenda a rotina para todo dia às 9h (horário de Brasília). Em outro servidor, agende esta chamada:

```bash
curl -H "Authorization: Bearer SUA_SENHA" https://seudominio.com.br/api/cron/diario
```

---

## Publicando na internet

Sugestão simples: **Vercel** (site) + **Turso** (banco, compatível com o SQLite usado localmente).

1. Crie um banco no [Turso](https://turso.tech) e pegue a URL (`libsql://…`) e o token.
2. No seu computador, aponte para o banco de produção e crie as tabelas e os dados iniciais:

   ```bash
   # .env
   DATABASE_URL=libsql://seu-banco.turso.io
   DATABASE_AUTH_TOKEN=seu-token
   ADMIN_EMAIL=voce@seudominio.com
   ADMIN_PASSWORD=uma-senha-forte-de-verdade
   ```

   ```bash
   npm run db:push
   npm run db:seed -- --production
   ```

   Em produção o seed **não** cria o aluno de teste, e só cria o administrador se `ADMIN_PASSWORD` estiver definido.

3. Suba o projeto para o GitHub e importe na [Vercel](https://vercel.com). Em _Environment Variables_, cadastre:

   | Variável | Para quê |
   | --- | --- |
   | `DATABASE_URL`, `DATABASE_AUTH_TOKEN` | Banco de dados |
   | `NEXT_PUBLIC_SITE_URL` | Endereço público (ex.: `https://seudominio.com.br`) |
   | `NEXT_PUBLIC_SUPPORT_EMAIL` | E-mail de atendimento mostrado no site |
   | `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET` | Pagamentos |
   | `RESEND_API_KEY`, `EMAIL_FROM` | E-mails |
   | `CRON_SECRET` | Rotina diária |

4. Antes de divulgar: troque o nome em `src/config/site.ts`, revise os textos legais (termos e privacidade),
   faça uma compra de teste e confira se os e-mails chegam.

Veja todas as variáveis, com explicação, em [`.env.example`](.env.example).

---

## Estrutura do projeto

```
src/
  app/
    (marketing)/      página inicial, grade, dicionário, planos, termos, privacidade
    (auth)/           entrar, cadastro, recuperar senha
    (app)/            área do aluno (painel, trilhas, aula, checkout, assinatura, conta…)
    admin/            administração
    api/              webhook do Mercado Pago e rotina diária
    certificado/[id]  página pública do certificado
  actions/            Server Actions (tudo que grava no banco)
  components/         componentes de interface
  config/site.ts      nome, slogan, URL e e-mail de contato
  content/            dicionário de termos
  db/schema.ts        tabelas do banco
  lib/                regras: sessão, cobrança, checkout, e-mails, progresso, conteúdo, gamificação
  proxy.ts            manda para o login quem não está conectado
scripts/
  content/            conteúdo inicial das trilhas, um arquivo por trilha
  seed.ts             carrega planos, contas e conteúdo em um banco vazio
roteiros/             roteiros de gravação e o guia do estilo do professor
video/                vídeo editado das aulas (Remotion), sincronizado com a gravação da voz; ver video/README.md
```

Tecnologias: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Drizzle ORM e SQLite/libSQL.

**Cores e visual**: os tokens de cor ficam no topo de [`src/app/globals.css`](src/app/globals.css); as cores das
trilhas, em [`src/lib/theme.ts`](src/lib/theme.ts); o logo, em [`src/components/logo.tsx`](src/components/logo.tsx);
o ícone do app e a imagem de compartilhamento, em [`src/lib/brand-image.tsx`](src/lib/brand-image.tsx).

---

## Segurança — o que já está feito

- Senhas com hash **scrypt**; sessões em cookie `HttpOnly` com só o hash do token guardado no banco
- Toda action confere login, acesso ao conteúdo e permissão de administrador no servidor
- Respostas certas do quiz nunca vão para o navegador antes do envio
- Limite de tentativas em login, cadastro, recuperação de senha, quiz, comentários, checkout e webhook
- Links de recuperação de senha expiram em 1 hora, valem uma vez só e desconectam os outros aparelhos
- Proteção contra redirecionamento para outros sites após o login
- **Pagamentos**: assinatura do webhook conferida; o plano só é liberado depois de consultar o pagamento na API
  do Mercado Pago (valor e moeda conferidos); avisos repetidos ou simultâneos liberam uma vez só; a volta do
  checkout não aceita pagamento de outra conta
- **LGPD**: o aluno baixa os próprios dados e exclui a conta sem depender de ninguém

**Antes de crescer**: o limite de tentativas fica na memória do servidor. Se rodar em várias instâncias
(serverless), troque por um armazenamento compartilhado, como Redis/Upstash — veja
[`src/lib/rate-limit.ts`](src/lib/rate-limit.ts).
