import type { TrackSeed } from "./types";

export const ROBOS_E_AUTOMACOES: TrackSeed = {
  slug: "robos-e-automacoes",
  title: "Robôs e automações",
  description:
    "Deixe o trabalho repetitivo com os robôs: pedidos enviados ao fornecedor automaticamente, atendimento no WhatsApp, recuperação de carrinho e inteligência artificial.",
  level: "INTERMEDIARIO",
  icon: "bot",
  color: "grape",
  modules: [
    {
      title: "Automatizando a operação",
      description: "Pedidos e avisos de entrega sem trabalho manual.",
      lessons: [
        {
          title: "O que dá para automatizar (e o que não dá)",
          summary: "Onde os robôs economizam mais tempo.",
          learn: [
            "As tarefas repetitivas de uma loja",
            "Ferramentas de automação sem programação",
            "O que continua precisando de você",
          ],
          minutes: 7,
          content: `## O que é um "robô" aqui

Nada de ficção científica. Um robô, nesta trilha, é uma **regra que o computador executa sozinho**:

> **Quando** acontecer isto → **faça** aquilo.

*Quando um pedido for pago → envie ao fornecedor. Quando o código de rastreio chegar → avise o cliente.*

## As tarefas repetitivas de uma loja

| Tarefa | Dá para automatizar? |
| --- | --- |
| Copiar o pedido para o fornecedor | Sim |
| Atualizar estoque e preço de custo | Sim |
| Enviar o código de rastreio | Sim |
| Avisar sobre cada etapa da entrega | Sim |
| Lembrar quem abandonou o carrinho | Sim |
| Responder às perguntas mais comuns | Sim, em boa parte |
| Pedir avaliação depois da entrega | Sim |
| Emitir nota fiscal | Sim |
| Escolher produtos e definir preços | **Não** |
| Resolver uma reclamação difícil | **Não** |
| Criar a estratégia dos anúncios | **Não** |

## As ferramentas, sem programação

1. **Recursos da própria plataforma de loja.** E-mails automáticos, recuperação de carrinho e avisos de envio costumam vir prontos. **Comece por aqui**: é de graça e já está instalado.
2. **Aplicativos da loja de aplicativos** da plataforma: integração com fornecedor, rastreio, avaliações, WhatsApp.
3. **Sistemas de gestão** (os chamados ERPs): reúnem pedidos de vários canais, emitem notas fiscais e controlam o estoque.
4. **Conectores:** ferramentas que ligam dois serviços que não conversam entre si, no formato "quando acontecer X no serviço A, faça Y no serviço B". Exemplos: Zapier e Make.

## O que continua precisando de você

- **Decisões:** o que vender, por quanto, quanto investir.
- **Casos fora do padrão:** o cliente irritado, o pedido extraviado, o pagamento em dobro.
- **Qualidade:** conferir se o robô está fazendo o que deveria.
- **Relacionamento** com fornecedores e parceiros.

## Três regras antes de automatizar

1. **Faça à mão primeiro.** Só automatize uma tarefa depois de executá-la algumas vezes. Automatizar um processo confuso só gera confusão mais rápido.
2. **Comece pelo que é frequente.** Uma tarefa de 3 minutos, repetida 20 vezes por dia, é uma hora diária.
3. **Monitore.** Toda automação falha um dia: a senha expira, o fornecedor muda um código. Confira os resultados toda semana.

## Por onde começar

A ordem que costuma dar mais retorno:

1. Avisos de pedido e de envio para o cliente
2. Recuperação de carrinho
3. Envio do pedido ao fornecedor
4. Respostas automáticas no WhatsApp
5. E-mails de pós-venda

> Automatizar não é deixar de cuidar. É **parar de digitar** para ter tempo de cuidar do que importa.
`,
          tasks: [
            "Liste as 10 tarefas que você mais repete na loja e quanto tempo cada uma leva",
            "Marque quais já têm recurso automático na sua plataforma",
            "Escolha a primeira tarefa que você vai automatizar",
          ],
        },
        {
          title: "Pedidos enviados ao fornecedor automaticamente",
          summary: "Do pagamento aprovado ao pedido no fornecedor, sem copiar e colar.",
          learn: [
            "Como funciona a ligação entre a loja e o fornecedor",
            "Configurando o envio automático de pedidos",
            "Conferências para evitar erros",
          ],
          minutes: 10,
          content: `## O caminho automático de um pedido

1. O cliente paga na sua loja.
2. O pedido muda para **"pago"**.
3. O aplicativo de integração **envia o pedido ao fornecedor**, com produto, variação e endereço.
4. O fornecedor separa e posta.
5. O **código de rastreio volta** para a loja.
6. O cliente é avisado.

Sem automação, os passos 3, 5 e 6 são feitos à mão, pedido por pedido. Com 5 vendas por dia, dá para fazer. Com 30, vira o seu dia inteiro — e os erros aparecem.

## Como é a ligação

- **Fornecedores de fora do país:** existem aplicativos de integração que ligam a loja aos grandes sites de compra internacionais. Eles importam os produtos e repassam os pedidos.
- **Fornecedores brasileiros:** muitos oferecem integração direta com as principais plataformas de loja ou trabalham por meio de um sistema de gestão.
- **Fornecedor sem integração:** dá para automatizar em parte com uma planilha compartilhada, preenchida por um conector a cada novo pedido pago.

Pergunte ao fornecedor **qual integração ele recomenda** antes de escolher uma por conta própria.

## Configurando, passo a passo

1. **Instale o aplicativo** de integração e conecte as contas da loja e do fornecedor.
2. **Ligue cada produto** da loja ao produto correspondente do fornecedor.
3. **Ligue cada variação:** "Azul / M" na loja precisa apontar para "Azul / M" no fornecedor. É aqui que acontece a maioria dos erros.
4. **Escolha a forma de envio** padrão para cada produto.
5. **Defina a regra:** só enviar pedidos com **pagamento aprovado**.
6. **Configure a volta do rastreio**, para o código entrar no pedido sozinho.
7. **Faça um pedido de teste** real e acompanhe até o fim.

## Automático, mas com um clique seu

Em muitas integrações, o pedido é **preparado** automaticamente, mas o **pagamento ao fornecedor** precisa da sua confirmação. Isso é bom: você confere e paga vários pedidos de uma vez, em um minuto.

Mantenha saldo ou limite no cartão usado para pagar o fornecedor. Pedido parado por falta de pagamento é atraso para o cliente.

## Dados que o fornecedor precisa

- Nome completo e telefone
- Endereço com número, complemento e CEP
- **CPF do destinatário** — obrigatório em compras internacionais

Confira se o checkout da loja pede todos esses campos.

## A conferência diária (5 minutos)

- Há pedidos **pagos e não enviados** ao fornecedor?
- Algum pedido com **erro**: endereço incompleto, variação sem ligação?
- Algum produto **esgotado** no fornecedor?
- O **preço de custo** mudou? Se subiu, a sua margem diminuiu.
- Algum pedido **sem rastreio** há mais dias do que o normal?

## Quando o fornecedor fica sem estoque

Decida antes o que fazer: usar o **fornecedor reserva**, oferecer a troca por outra cor ou **reembolsar na hora**. O pior caminho é o silêncio.
`,
          tasks: [
            "Pergunte ao fornecedor qual integração ele recomenda para a sua plataforma",
            "Ligue os produtos e confira cada variação",
            "Faça um pedido de teste e acompanhe até o rastreio voltar para a loja",
            "Crie o lembrete da conferência diária de 5 minutos",
          ],
        },
        {
          title: "Rastreio e avisos de entrega automáticos",
          summary: "O cliente informado sem você precisar responder.",
          learn: [
            "Envio automático do código de rastreio",
            "Mensagens para cada etapa da entrega",
            "Como diminuir as perguntas no atendimento",
          ],
          minutes: 7,
          content: `## A pergunta número 1 do atendimento

*"Cadê o meu pedido?"* é, de longe, a mensagem mais recebida por qualquer loja. Quase sempre, ela existe porque o cliente **não recebeu informação**. Informar antes de ele perguntar é a automação que mais reduz o atendimento.

## O básico: código de rastreio automático

Quando o código entra no pedido (pela integração com o fornecedor), a plataforma envia sozinha o e-mail de **"pedido enviado"**. Confira se esse e-mail:

- Está **ativado**
- Tem o **código** e um **link direto** para o rastreio
- Informa o **prazo estimado**
- Diz **o que fazer** em caso de dúvida

## Um passo além: avisos a cada etapa

Aplicativos de rastreamento acompanham o pacote e avisam o cliente a cada mudança, por e-mail ou WhatsApp.

| Etapa | Mensagem |
| --- | --- |
| **Pedido confirmado** | "Recebemos o seu pedido! Em até X dias úteis ele será postado." |
| **Postado** | "Seu pedido está a caminho. Código: … Previsão de entrega: …" |
| **Em trânsito há alguns dias** | "Seu pedido segue viagem. É normal o rastreio ficar alguns dias sem atualizar." |
| **Saiu para entrega** | "Seu pedido sai para entrega hoje. Fique de olho!" |
| **Entregue** | "Seu pedido chegou! Qualquer problema, é só responder esta mensagem." |
| **Problema na entrega** | "Houve uma tentativa de entrega sem sucesso. Veja como resolver: …" |

## Página de rastreio na loja

Coloque no menu um link **"Rastrear pedido"**. O cliente digita o código ou o e-mail e vê a situação sem sair do seu site — e sem escrever para você.

## Produtos que vêm de fora do país

O rastreio internacional tem períodos longos sem atualização e etapas com nomes confusos. Avise **antes**:

- No e-mail de envio, explique que o pacote passa por **fiscalização** ao entrar no Brasil e que o rastreio pode ficar parado por alguns dias.
- Deixe claro na sua política **quem é responsável** por eventuais tributos de importação.
- Mande uma mensagem no meio do caminho: ela evita que o cliente pense que o pedido foi esquecido.

## Como diminuir as perguntas

1. **Prazo claro** na página do produto e no checkout.
2. **E-mail de confirmação** dizendo o que vai acontecer e quando.
3. **Perguntas frequentes** com um bloco só sobre entrega.
4. **Resposta automática** no WhatsApp com o link de rastreio.
5. **Aviso antecipado de atraso.** Se o prazo vai estourar, avise primeiro. Cliente avisado costuma esperar; cliente surpreendido contesta a compra.

## Depois da entrega

Programe uma mensagem para **alguns dias depois** de o pedido chegar:

- Pergunte se está tudo certo.
- Peça uma **avaliação**, com um link direto.
- Sugira um produto que combina com o que ele comprou.

Não ofereça desconto ou brinde **em troca de avaliação positiva**: a avaliação precisa ser livre para ser verdadeira.
`,
          tasks: [
            "Revise o e-mail de pedido enviado: código, link, prazo e contato",
            "Crie a página Rastrear pedido e coloque o link no menu",
            "Escreva as mensagens das 6 etapas da entrega",
            "Programe a mensagem de pós-entrega pedindo a avaliação",
          ],
          quiz: [
            {
              text: "O que é uma automação, na prática?",
              explanation:
                "É uma regra do tipo \"quando acontecer isto, faça aquilo\", executada sozinha pelo sistema.",
              options: [
                "Uma regra que o sistema executa sozinho quando algo acontece",
                "Um funcionário contratado para o atendimento",
                "Um tipo de anúncio pago",
              ],
            },
            {
              text: "Qual é o erro mais comum ao ligar a loja ao fornecedor?",
              explanation:
                "Se a variação da loja aponta para a opção errada do fornecedor, o cliente recebe cor ou tamanho diferente do que pediu.",
              options: [
                "Ligar uma variação à opção errada do fornecedor",
                "Usar o mesmo e-mail na loja e no fornecedor",
                "Enviar o código de rastreio cedo demais",
              ],
            },
            {
              text: "O prazo de um pedido vai estourar. Qual é a melhor atitude?",
              explanation:
                "Quem é avisado antes tende a esperar. O silêncio leva a reclamações e contestações de compra.",
              options: [
                "Avisar o cliente antes que ele pergunte",
                "Esperar o cliente reclamar para responder",
                "Parar de responder até o pedido chegar",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Robôs de venda e atendimento",
      description: "WhatsApp, carrinho abandonado e mensagens que vendem.",
      lessons: [
        {
          title: "Robô de atendimento no WhatsApp",
          summary: "Respostas rápidas 24 horas por dia.",
          learn: [
            "Como funciona um robô de WhatsApp",
            "Montando o fluxo de perguntas e respostas",
            "Quando passar a conversa para uma pessoa",
          ],
          minutes: 11,
          content: `## Três níveis de automação no WhatsApp

| Nível | O que é | Custo |
| --- | --- | --- |
| **1. Aplicativo WhatsApp Business** | Perfil da loja, catálogo, saudação, mensagem de ausência e respostas rápidas | Gratuito |
| **2. Robô de menu** | O cliente escolhe opções (1, 2, 3…) e recebe as respostas | Ferramenta paga |
| **3. Assistente com IA** | Entende a pergunta escrita livremente e responde | Ferramenta paga |

**Comece pelo nível 1.** Ele resolve muita coisa e ensina quais são as perguntas mais frequentes.

## Nível 1: o que configurar hoje

- **Perfil comercial:** nome da loja, descrição, horário, site e e-mail.
- **Mensagem de saudação:** enviada no primeiro contato.
- **Mensagem de ausência:** fora do horário, dizendo quando você responde.
- **Respostas rápidas:** textos salvos para as perguntas mais comuns, acionados com um atalho.
- **Etiquetas:** para marcar as conversas ("aguardando pagamento", "enviado", "problema").

## Níveis 2 e 3: como funcionam

Para ter um robô de verdade, o número é conectado a uma **plataforma de atendimento** que usa a **conexão oficial do WhatsApp para empresas**.

Três regras importantes:

1. **Use ferramentas oficiais.** Programas não autorizados, que "automatizam" o aplicativo comum, podem fazer o número ser **banido** — e você perde o contato de todos os clientes.
2. **Para mandar mensagem primeiro, o cliente precisa ter autorizado.** Mensagens que partem da loja (avisos, lembretes, ofertas) usam modelos aprovados e são cobradas por envio.
3. **Responder é livre por 24 horas.** Depois que o cliente escreve, a loja pode responder livremente durante esse período.

## Montando o fluxo

Um bom fluxo inicial cabe em uma tela:

> Olá! Aqui é a assistente virtual da **[loja]**. Como posso ajudar?
>
> - **1** – Rastrear o meu pedido
> - **2** – Prazos e frete
> - **3** – Trocas e devoluções
> - **4** – Dúvidas sobre um produto
> - **5** – Falar com uma pessoa

Para cada opção, escreva uma resposta **curta**, com o link certo:

- **1:** pede o número do pedido ou envia o link de rastreio.
- **2:** informa os prazos e leva à página de entregas.
- **3:** explica o passo a passo e os prazos.
- **4:** pergunta qual é o produto e envia as informações principais.
- **5:** transfere para o atendimento, informando o horário.

## Boas práticas

- **Diga que é um assistente virtual.** Ninguém gosta de descobrir depois.
- **Mensagens curtas**, uma ideia por vez.
- **Sempre uma saída** para falar com uma pessoa.
- **Teste** você mesmo, digitando errado e fora de ordem.

## Quando passar para uma pessoa

- O cliente pediu
- Reclamação, pedido atrasado ou produto com defeito
- Cobrança em dobro ou qualquer problema com pagamento
- O cliente demonstra irritação
- O robô não entendeu **duas vezes seguidas**

Ao transferir, o robô deve dizer **em quanto tempo** alguém responde — e alguém precisa responder nesse prazo.

## Medindo

Acompanhe toda semana: quantas conversas o robô resolveu sozinho, quantas foram transferidas e **quais perguntas ele não soube responder**. Essas últimas mostram o que falta no fluxo — ou na sua página de produto.
`,
          tasks: [
            "Instale o WhatsApp Business e complete o perfil da loja",
            "Configure as mensagens de saudação e de ausência",
            "Crie respostas rápidas para as 5 perguntas mais frequentes",
            "Desenhe o fluxo de menu com 5 opções e a resposta de cada uma",
          ],
        },
        {
          title: "Recuperação de carrinho abandonado",
          summary: "Traga de volta quem desistiu na última etapa.",
          learn: [
            "Por que tanta gente abandona o carrinho",
            "Mensagens automáticas por e-mail e WhatsApp",
            "Ofertas que recuperam vendas sem dar prejuízo",
          ],
          minutes: 8,
          content: `## Abandonar o carrinho é o normal

Em lojas virtuais, **a maioria dos carrinhos não vira pedido** — é comum que sete em cada dez sejam abandonados. Isso não quer dizer que a loja é ruim; quer dizer que existe muita venda quase feita esperando um empurrão.

## Por que as pessoas desistem

- O **frete** ou outro custo apareceu só no final
- Estavam **só pesquisando**
- O **cadastro** era longo demais
- **Desconfiaram** da loja
- O **pagamento falhou**
- Foram **interrompidas**: o ônibus chegou, o filho chamou

Repare que os dois últimos motivos são de pessoas que **queriam comprar**. É para elas que a recuperação existe.

## A sequência de 3 mensagens

| Mensagem | Quando | Conteúdo |
| --- | --- | --- |
| **1. Lembrete** | De 30 a 60 minutos depois | "Você deixou algo no carrinho." Foto do produto e botão para voltar. **Sem desconto** |
| **2. Confiança** | 24 horas depois | Tire dúvidas: prazo, garantia de 7 dias, avaliações de clientes |
| **3. Incentivo** | De 48 a 72 horas depois | Um benefício com prazo curto: frete grátis ou um cupom pequeno |

O botão das mensagens deve levar ao **carrinho já montado**, não à página inicial.

## Canais

- **E-mail:** quase toda plataforma de loja tem a recuperação pronta. Você só ativa e ajusta os textos.
- **WhatsApp:** costuma ter resultado melhor, mas exige que o cliente tenha **informado o telefone e autorizado** o contato, além de uma ferramenta oficial.
- **SMS:** uma opção para lembretes curtos.

## Um exemplo de primeira mensagem

> **Assunto:** Esqueceu algo? Seu carrinho está guardado
>
> Oi, [nome]! Vimos que você separou a **[produto]** e não concluiu a compra. O seu carrinho continua guardado. É só clicar para finalizar:
>
> **[Voltar ao meu carrinho]**
>
> Ficou com alguma dúvida? Responda este e-mail que a gente ajuda.

## Pix e boleto gerados e não pagos

É o caso mais fácil de recuperar: a pessoa **já decidiu comprar**. Envie um lembrete com o **código do Pix** ou o **link do boleto** poucas horas depois e outro antes do vencimento.

## Ofertas sem prejuízo

- **Não comece pelo desconto.** As duas primeiras mensagens já recuperam boa parte, sem custo.
- **Desconto pequeno:** de 5% a 10%, ou frete grátis.
- **Confira a margem** antes: o desconto sai do seu lucro.
- **Prazo curto e verdadeiro:** 24 ou 48 horas.
- **Cupom de uso único**, para não se espalhar.

Cuidado para não "ensinar" o cliente a abandonar o carrinho só para receber um cupom. Se muita gente estiver fazendo isso, tire o desconto da sequência.

## O que medir

- **Taxa de recuperação:** carrinhos recuperados ÷ carrinhos abandonados
- **Vendas recuperadas**, em reais
- Qual das três mensagens **recupera mais**

## A melhor recuperação é não precisar dela

Se o abandono estiver muito alto, o problema pode estar antes: frete surpresa, checkout longo ou falta de confiança. Releia a aula *Checkout que não perde venda*.
`,
          tasks: [
            "Ative a recuperação de carrinho da sua plataforma",
            "Escreva as 3 mensagens da sequência",
            "Configure o lembrete de Pix e boleto não pagos",
            "Calcule qual desconto máximo cabe na sua margem",
          ],
        },
        {
          title: "E-mails e mensagens que vendem sozinhos",
          summary: "Sequências automáticas para vender de novo.",
          learn: [
            "Boas-vindas, pós-venda e nova compra",
            "Como montar uma sequência simples",
            "A frequência certa para não incomodar",
          ],
          minutes: 8,
          content: `## Vender de novo custa menos

Conquistar um cliente novo exige anúncio. Vender para quem **já comprou e gostou** exige uma mensagem. As sequências automáticas fazem esse trabalho todos os dias, sem você lembrar.

## As quatro sequências principais

**1. Boas-vindas** — para quem se cadastrou e ainda não comprou

- Mensagem 1 (na hora): quem é a loja e o que ela resolve
- Mensagem 2 (2 dias depois): os produtos mais vendidos
- Mensagem 3 (4 dias depois): avaliações de clientes e, se quiser, um incentivo para a primeira compra

**2. Pós-compra** — para quem acabou de comprar

- Confirmação do pedido e o que esperar
- Dicas de **como usar** o produto, perto da data de entrega
- Pedido de **avaliação**, alguns dias depois de chegar
- Sugestão de um produto **que combina** com o que foi comprado

**3. Recompra** — para produtos que acabam

Refil, ração, filtro: programe um lembrete para **pouco antes** de o produto acabar. "O filtro da sua fonte dura cerca de 30 dias. Quer garantir o próximo?"

**4. Reativação** — para quem sumiu

Depois de 60 a 90 dias sem comprar: novidades da loja e um motivo para voltar.

## Como uma sequência é montada

Toda automação tem quatro peças:

| Peça | Exemplo |
| --- | --- |
| **Gatilho:** o que dá início | "Pedido entregue" |
| **Espera:** quanto tempo aguardar | "5 dias" |
| **Mensagem:** o que enviar | "Pedido de avaliação" |
| **Condição:** quando não enviar | "Se já avaliou, pare" |

As plataformas de loja e as ferramentas de e-mail têm **modelos prontos** para essas sequências. Comece por eles e ajuste os textos.

## Como escrever

- **Assunto curto**, que diga o que há dentro: "Chegou! Veja como usar a sua fonte".
- **Uma mensagem, um objetivo, um botão.**
- Texto como se fosse para **uma pessoa**, não um folheto.
- **Leia no celular** antes de ativar.

## As regras que você precisa seguir

- **Consentimento.** Só envie ofertas para quem **aceitou receber**. No cadastro e no checkout, deixe uma opção clara para isso.
- **Saída fácil.** Toda mensagem de marketing precisa de um link para **parar de receber** — e o pedido tem de ser atendido.
- **Mensagens sobre o pedido** (confirmação, envio, entrega) fazem parte da compra e podem ser enviadas sempre.
- **Nunca compre listas** de e-mails ou de telefones. Além de irregular, isso leva as suas mensagens para a caixa de spam.

## A frequência certa

- **Sequências automáticas:** rodam sozinhas, conforme os gatilhos.
- **Campanhas avulsas** (novidade, promoção): **uma por semana** é um bom limite para começar.
- No **WhatsApp**, envie bem menos do que no e-mail: é um canal mais pessoal, e o cliente bloqueia rápido.

## O que acompanhar

| Número | O que indica |
| --- | --- |
| **Taxa de abertura** | Se o assunto desperta interesse |
| **Taxa de clique** | Se o conteúdo e o botão convencem |
| **Vendas geradas** | O resultado de verdade |
| **Pedidos de saída** | Se você está exagerando na frequência |

> Comece com **uma** sequência: a de pós-compra. Ela usa clientes que você já tem e melhora a experiência de quem acabou de confiar na loja.
`,
          tasks: [
            "Ative a sequência de pós-compra usando o modelo da sua plataforma",
            "Escreva a mensagem de dicas de uso do seu produto principal",
            "Confira se o cadastro e o checkout têm a opção de aceitar receber ofertas",
            "Verifique se todas as mensagens de marketing têm o link para parar de receber",
          ],
          quiz: [
            {
              text: "Qual deve ser o conteúdo da primeira mensagem de recuperação de carrinho?",
              explanation:
                "Um lembrete simples já recupera boa parte dos carrinhos. O desconto fica para a última mensagem, se for necessário.",
              options: [
                "Um lembrete com o produto e o botão para voltar, sem desconto",
                "O maior desconto possível, para garantir a venda",
                "Um pedido de avaliação da loja",
              ],
            },
            {
              text: "Por que usar apenas ferramentas oficiais para automatizar o WhatsApp?",
              explanation:
                "Programas não autorizados violam as regras do WhatsApp e podem fazer o número ser banido.",
              options: [
                "Porque ferramentas não autorizadas podem causar o banimento do número",
                "Porque as ferramentas oficiais são sempre gratuitas",
                "Porque só elas permitem enviar mensagens sem autorização do cliente",
              ],
            },
            {
              text: "Para quem a loja pode enviar ofertas por e-mail?",
              explanation:
                "Mensagens de marketing exigem o consentimento de quem recebe e um caminho fácil para sair da lista.",
              options: [
                "Para quem aceitou receber, sempre com um link para parar de receber",
                "Para qualquer e-mail encontrado na internet",
                "Para listas compradas de outras empresas",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Inteligência artificial no seu negócio",
      description: "Atendimento e criação de anúncios com IA.",
      lessons: [
        {
          title: "Assistentes de IA para o atendimento",
          summary: "Um atendente que conhece os seus produtos e políticas.",
          learn: [
            "Como ensinar um assistente com as informações da loja",
            "Limites e cuidados com respostas automáticas",
            "Como medir a qualidade do atendimento",
          ],
          minutes: 9,
          content: `## O que muda em relação ao robô de menu

O robô de menu só entende **opções** (1, 2, 3). O assistente com inteligência artificial entende **frases escritas do jeito do cliente** — "oi, comprei semana passada e ainda não chegou, tá normal?" — e responde com base nas informações que você forneceu.

Muitas plataformas de atendimento e de loja já oferecem esse recurso. Você não programa nada: **ensina** o assistente.

## Como ensinar o assistente

Ele só sabe o que você conta. Monte uma **base de conhecimento** com:

1. **Perguntas frequentes** e as respostas, como você mesmo responderia
2. **Políticas:** troca, devolução, garantia e privacidade
3. **Entrega:** prazos por região, formas de envio e como rastrear
4. **Pagamento:** formas aceitas, parcelas e desconto no Pix
5. **Produtos:** medidas, materiais, como usar e o que vem na caixa

**Dica:** escreva em formato de pergunta e resposta, com frases curtas. Quanto mais organizado o material, melhores as respostas.

## As instruções de comportamento

Além do conteúdo, diga ao assistente **como agir**:

- **Tom de voz:** "Responda de forma simpática e direta, em poucas linhas."
- **Apresentação:** "Diga que é a assistente virtual da loja."
- **Limites:** "Não prometa prazos diferentes dos informados. Não ofereça descontos. Não dê orientações de saúde."
- **Quando não souber:** "Se a informação não estiver na base, diga que vai encaminhar para a equipe. Nunca invente."
- **Transferência:** "Em caso de reclamação, defeito, cobrança ou cliente insatisfeito, transfira para um atendente."

## Os limites que você precisa conhecer

- **A IA pode inventar.** Ela responde com segurança mesmo quando está errada. Por isso as instruções "nunca invente" e "transfira" são tão importantes.
- **O que o assistente promete, a loja cumpre.** Para o cliente, quem falou foi a loja. Se o assistente garantir um prazo ou um desconto, a loja fica responsável por isso.
- **Dados pessoais.** Use ferramentas confiáveis, informe o uso na política de privacidade e não deixe o assistente pedir dados desnecessários.
- **Transparência.** O cliente deve saber que está falando com um assistente virtual e deve conseguir falar com uma pessoa.

## Teste antes de ligar

Passe uma tarde fazendo perguntas como um cliente difícil:

- Perguntas fora do assunto
- Pedidos de desconto
- Reclamações
- Perguntas com erros de digitação
- Tentativas de fazer o assistente prometer algo

Cada resposta ruim vira um ajuste na base ou nas instruções.

## Como medir a qualidade

| Indicador | O que mostra |
| --- | --- |
| **Conversas resolvidas sem uma pessoa** | O quanto o assistente dá conta |
| **Tempo até a primeira resposta** | A rapidez |
| **Nota do cliente** ao fim da conversa | A satisfação |
| **Perguntas sem resposta** | O que falta na base |

E o mais importante: **leia 10 conversas por semana**, escolhidas ao acaso. Nenhum número substitui ver o que o assistente realmente disse.

## Mantenha atualizado

Mudou o prazo, o preço do frete ou a política de troca? **Atualize a base no mesmo dia.** Um assistente com informação antiga cria problemas mais rápido do que qualquer atendente.
`,
          tasks: [
            "Monte a base de conhecimento com as 20 perguntas mais frequentes e as respostas",
            "Escreva as instruções de comportamento: tom, limites e quando transferir",
            "Teste o assistente com 15 perguntas difíceis e ajuste o que falhou",
            "Reserve um horário semanal para ler 10 conversas",
          ],
        },
        {
          title: "IA para criar anúncios, textos e imagens",
          summary: "Produza mais anúncios em menos tempo.",
          learn: [
            "Gerando ideias de anúncios com IA",
            "Criando variações de textos e imagens",
            "Revisando para manter a qualidade",
          ],
          minutes: 9,
          content: `## Por que usar IA nos anúncios

Quem anuncia precisa de **criativos novos toda semana**, porque os anúncios cansam. A IA não substitui o seu conhecimento do produto, mas multiplica a quantidade de ideias e de versões que você consegue testar.

## 1. Ideias: os ângulos de venda

Um mesmo produto pode ser vendido por caminhos diferentes. Peça à IA uma lista deles:

> Produto: fonte bebedouro para gatos, 2 litros, silenciosa, com filtro. Público: donos de gato. Liste 10 ângulos de venda diferentes: dores, desejos, objeções, comparações e situações do dia a dia. Uma linha para cada.

Você recebe ideias como "o gato que só bebe água da torneira", "a preocupação com os rins do animal" ou "chega de pote virado". **Cada ângulo vira um anúncio para testar.**

## 2. Ganchos e roteiros

Com um ângulo escolhido, peça:

- **10 ganchos** de até 8 palavras para os 3 primeiros segundos
- **Um roteiro de 15 segundos** em 4 partes: gancho, demonstração, resultado e chamada
- **3 versões** do mesmo roteiro, mudando só o gancho

## 3. Textos de anúncio

- Versões **curta** (1 linha) e **longa** (3 a 4 linhas)
- Tons diferentes: direto, bem-humorado, emocional
- Títulos dentro do limite de caracteres de cada plataforma — informe o limite no pedido

## 4. Imagens e vídeos

- **Novos cenários** para a foto real do produto
- **Adaptação de formato:** quadrado, vertical e horizontal a partir da mesma imagem
- **Remoção de fundo** e melhoria de iluminação
- **Legendas automáticas** nos vídeos
- **Narração** gerada a partir de um texto, para quem não quer gravar a voz

As próprias plataformas de anúncio têm ferramentas de IA que geram variações de texto, imagem e fundo. Vale testar — sempre conferindo o resultado antes de publicar.

## O checklist de revisão

Nenhum material gerado por IA vai ao ar sem passar por estas perguntas:

1. **É verdade?** Medidas, materiais e funções conferem com o produto?
2. **A promessa é realista?** Nada de resultado garantido.
3. **A imagem mostra o produto como ele é?** Tamanho, cor e acabamento.
4. **O português está correto** e soa natural?
5. **Combina com a página?** Preço, oferta e produto iguais.
6. **Respeita as regras** das plataformas de anúncio?
7. **Não usa** rosto, voz ou marca de outra pessoa?

## O que não fazer

- **Depoimentos falsos.** Avatares ou vozes que fingem ser clientes reais enganam o consumidor.
- **"Antes e depois" criado por IA.**
- **Imagens que melhoram o produto** além da realidade.
- **Copiar o anúncio de um concorrente** e pedir para a IA "disfarçar".

## Um fluxo semanal

1. **Segunda:** veja quais anúncios venderam mais na semana anterior.
2. Peça à IA **novos ângulos e ganchos** inspirados nos vencedores.
3. Escolha **de 3 a 5 ideias** e grave ou monte as peças.
4. Passe pelo **checklist de revisão**.
5. Publique e **anote** o que foi testado.

> A IA aumenta a sua velocidade. O que continua sendo seu é a escolha: **qual ideia é verdadeira, útil e combina com a sua loja**.
`,
          tasks: [
            "Peça à IA 10 ângulos de venda para o seu produto e escolha 3",
            "Gere 10 ganchos para cada ângulo escolhido",
            "Crie 3 variações de texto e 2 de imagem a partir de uma foto real",
            "Passe todo o material pelo checklist de revisão antes de publicar",
          ],
          quiz: [
            {
              text: "O assistente de IA não encontrou a resposta na base de conhecimento. O que ele deve fazer?",
              explanation:
                "A IA pode inventar com segurança. A instrução correta é admitir que não sabe e encaminhar para a equipe.",
              options: [
                "Dizer que vai encaminhar para a equipe, sem inventar",
                "Dar a resposta que parecer mais provável",
                "Encerrar a conversa sem responder",
              ],
            },
            {
              text: "O assistente prometeu ao cliente um prazo menor do que o real. Quem responde por isso?",
              explanation:
                "Para o cliente, o assistente fala em nome da loja. O que for prometido passa a ser um compromisso dela.",
              options: [
                "A loja, porque o assistente fala em nome dela",
                "A empresa que criou a ferramenta de IA",
                "Ninguém, porque foi um erro da máquina",
              ],
            },
            {
              text: "Qual destes usos de IA em anúncios é inadequado?",
              explanation:
                "Criar depoimentos que fingem ser de clientes reais engana o consumidor e viola as regras das plataformas.",
              options: [
                "Criar um depoimento com avatar fingindo ser um cliente real",
                "Gerar 10 ideias de gancho para testar",
                "Adaptar a mesma imagem para os formatos quadrado e vertical",
              ],
            },
          ],
        },
      ],
    },
  ],
};
