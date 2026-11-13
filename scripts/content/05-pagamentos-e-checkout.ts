import type { TrackSeed } from "./types";

export const PAGAMENTOS_E_CHECKOUT: TrackSeed = {
  slug: "pagamentos-e-checkout",
  title: "Pagamentos e checkout",
  description:
    "Receba por Pix, cartão e boleto com segurança: escolha o meio de pagamento, configure o checkout e entenda taxas, prazos e quando formalizar o negócio.",
  level: "INICIANTE",
  icon: "credit-card",
  color: "mint",
  modules: [
    {
      title: "Como funciona receber pela internet",
      description: "O caminho do dinheiro, as formas de pagamento e as taxas.",
      lessons: [
        {
          title: "Como o pagamento online funciona",
          summary: "O caminho do dinheiro do cliente até a sua conta.",
          learn: [
            "O que faz um meio de pagamento (gateway)",
            "Por que o dinheiro não cai na hora",
            "O que são as taxas por venda",
          ],
          minutes: 7,
          content: `## Quem participa de um pagamento

Quando o cliente clica em "pagar", o dinheiro não vai direto para a sua conta. Ele passa por uma empresa especializada, o **meio de pagamento**.

| Quem | O que faz |
| --- | --- |
| **Cliente** | Escolhe Pix, cartão ou boleto e paga |
| **Checkout** | A tela em que o cliente preenche os dados e paga |
| **Meio de pagamento** | Recebe o valor, confere se a compra é segura e repassa para você |
| **Banco ou operadora do cartão** | Autoriza ou recusa a cobrança |
| **Você** | Recebe o valor, descontadas as taxas |

Você vai ouvir dois nomes para o meio de pagamento: **intermediador** e **gateway**. Para quem está começando, o intermediador é o caminho mais simples: você abre uma conta, conecta à loja e ele cuida de tudo, inclusive da proteção contra fraudes. Exemplos conhecidos no Brasil: **Mercado Pago, PagBank** e **Pagar.me**.

## Por que o dinheiro não cai na hora

Depende da forma de pagamento:

- **Pix:** cai em segundos.
- **Boleto:** leva de 1 a 3 dias úteis depois que o cliente paga.
- **Cartão de crédito:** o prazo normal vai de 14 a 30 dias. Dá para receber antes pagando uma taxa maior — isso se chama **antecipação**.

Esse intervalo existe porque o banco do cliente só repassa o valor do cartão depois, e porque o meio de pagamento guarda um tempo para o caso de a compra ser contestada.

## O que são as taxas

A cada venda aprovada, o meio de pagamento fica com uma parte:

- Uma **porcentagem** do valor (maior no cartão, menor no Pix)
- Às vezes, um **valor fixo** por transação
- No cartão parcelado, um acréscimo por parcela quando é você quem assume os juros

**Exemplo:** em uma venda de R$ 100 no cartão com taxa de 5%, você recebe R$ 95.

Os percentuais variam entre as empresas e conforme o prazo que você escolhe para receber. Você vê isso em detalhe na aula *Taxas e prazos*.

> Guarde esta ideia: **vender não é o mesmo que receber**. Uma loja pode vender bem e ficar sem dinheiro se pagar o fornecedor hoje e só receber do cartão daqui a 30 dias.
`,
          tasks: [
            "Liste 3 meios de pagamento que funcionam com a sua plataforma de loja",
            "Anote em quanto tempo cada um libera o dinheiro do Pix, do boleto e do cartão",
          ],
        },
        {
          title: "Pix, cartão e boleto: prós e contras",
          summary: "Ofereça as formas que o seu cliente prefere.",
          learn: [
            "Vantagens e custos de cada forma de pagamento",
            "Parcelamento: quando oferecer",
            "Como cada forma afeta as vendas",
          ],
          minutes: 8,
          content: `## As três formas, lado a lado

| | Pix | Cartão de crédito | Boleto |
| --- | --- | --- | --- |
| **Aprovação** | Na hora | Na hora | 1 a 3 dias úteis |
| **Taxa** | A mais baixa | A mais alta | Valor fixo por boleto pago |
| **Você recebe** | Em segundos | Em 14 a 30 dias (ou antes, com taxa) | Depois da compensação |
| **Parcelamento** | Não | Sim | Não |
| **Contestação** | Rara | Possível (o cliente contesta no banco) | Rara |

## Pix

- É a forma mais usada no Brasil e a mais barata para o lojista.
- O dinheiro entra na hora, o que ajuda a pagar o fornecedor sem aperto.
- **Dica:** ofereça um pequeno desconto no Pix (3% a 5%). Como a taxa é menor e você recebe na hora, o desconto se paga.

## Cartão de crédito

- O **parcelamento** é o motivo de muita gente comprar: R$ 180 assusta, "6x de R$ 30" não.
- Tem a taxa mais alta e o risco de contestação.
- **Sem juros** para o cliente quer dizer que **você** paga o custo das parcelas. **Com juros**, quem paga é o cliente.

**Quando oferecer parcelas sem juros:** em produtos acima de R$ 100, comece com até 3x sem juros e deixe as demais parcelas com juros. Antes de aumentar esse número, coloque o custo das parcelas na sua conta de preço.

## Boleto

- Alcança quem não tem cartão nem conta com Pix.
- **Muitos boletos gerados nunca são pagos.** Não conte com a venda antes da compensação.
- Só peça o produto ao fornecedor **depois** que o pagamento for confirmado.

## Ofereça as três

Cada forma atende um tipo de cliente. Tirar uma delas é perder vendas:

- Quem quer resolver rápido → **Pix**
- Quem precisa parcelar → **cartão**
- Quem não tem cartão ou prefere pagar depois → **boleto**

## A ordem importa

Mostre o **Pix primeiro** no checkout, com o desconto em destaque. Você paga menos taxa e recebe mais rápido. Mas mantenha o parcelamento do cartão **visível já na página do produto**, porque ele ajuda o cliente a decidir.
`,
          tasks: [
            "Defina se vai dar desconto no Pix e de quanto",
            "Defina o número de parcelas sem juros para cada produto",
            "Refaça a conta de preço considerando a taxa do cartão parcelado",
          ],
        },
        {
          title: "Taxas e prazos: quanto e quando você recebe",
          summary: "Coloque as taxas na conta antes de definir o preço.",
          learn: [
            "Taxas por venda e mensalidades",
            "Prazo de recebimento e antecipação",
            "Como incluir as taxas no preço",
          ],
          minutes: 7,
          content: `## Tudo o que sai de uma venda

Além da taxa do meio de pagamento, outros custos acompanham cada pedido:

| Custo | Quem cobra |
| --- | --- |
| Taxa por transação (Pix, cartão ou boleto) | Meio de pagamento |
| Custo das parcelas sem juros | Meio de pagamento |
| Taxa por venda ou mensalidade | Plataforma da loja |
| Antecipação (se você quiser receber antes) | Meio de pagamento |

## Prazo de recebimento: a escolha que muda a taxa

No cartão, a maioria dos meios de pagamento deixa você escolher:

- **Receber em 30 dias:** a menor taxa.
- **Receber em 14 dias:** taxa intermediária.
- **Receber na hora:** a maior taxa.

Não existe opção certa para todos. Depende do seu caixa.

## Um exemplo para comparar

Venda de **R$ 150** no cartão. As taxas abaixo são **apenas ilustrativas**:

| Prazo escolhido | Taxa | Você recebe |
| --- | --- | --- |
| Na hora | 5,5% | R$ 141,75 |
| 14 dias | 4,5% | R$ 143,25 |
| 30 dias | 3,8% | R$ 144,30 |

A diferença entre receber hoje e daqui a 30 dias é de R$ 2,55 nesta venda. Parece pouco, mas em 200 vendas são R$ 510.

## O que pesa para quem vende sem estoque

Você paga o fornecedor **logo depois da venda**. Se receber do cartão só em 30 dias, precisa ter dinheiro guardado para bancar esses pedidos.

- **Tem reserva?** Escolha o prazo maior e pague menos taxa.
- **Está começando sem reserva?** Receber na hora custa mais, mas evita ficar sem dinheiro para pagar os pedidos.
- **Incentive o Pix:** ele resolve os dois problemas de uma vez.

## Como incluir as taxas no preço

Faça a conta do preço usando **a pior situação**: cartão, no número máximo de parcelas sem juros, no prazo de recebimento que você escolheu. Se a conta fecha nesse cenário, toda venda no Pix vira lucro extra.

> Use **Ferramentas → Calculadora de margem** e coloque no campo de taxas a soma do meio de pagamento com a taxa da plataforma.
`,
          tasks: [
            "Anote as taxas de Pix, boleto e cartão do meio de pagamento que você pretende usar",
            "Escolha o prazo de recebimento do cartão de acordo com a sua reserva",
            "Recalcule a margem do seu produto principal no pior cenário de taxas",
          ],
          quiz: [
            {
              text: "Por que uma loja que vende bem pode ficar sem dinheiro?",
              explanation:
                "No modelo sem estoque, o fornecedor é pago logo após a venda, mas o cartão pode levar até 30 dias para cair.",
              options: [
                "Porque paga o fornecedor na hora e só recebe do cartão dias depois",
                "Porque o Pix demora 30 dias para cair",
                "Porque a plataforma da loja retém todo o valor das vendas",
              ],
            },
            {
              text: "O que significa oferecer parcelamento \"sem juros\"?",
              explanation:
                "O custo das parcelas existe sempre. Sem juros para o cliente, quem paga é o lojista.",
              options: [
                "Que o custo das parcelas fica por conta do lojista",
                "Que o banco não cobra nada de ninguém",
                "Que o cliente paga uma taxa escondida",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Configurando",
      description: "Conta, checkout e proteção contra fraudes.",
      lessons: [
        {
          title: "Escolhendo e abrindo a conta no meio de pagamento",
          summary: "O que comparar e o passo a passo do cadastro.",
          learn: [
            "O que comparar entre os meios de pagamento",
            "Os documentos necessários",
            "Conectando o pagamento à sua loja",
          ],
          minutes: 9,
          content: `## O que comparar

1. **Funciona com a sua plataforma de loja?** Comece pela lista de integrações da plataforma.
2. **Taxas** de Pix, boleto e cartão, em cada prazo de recebimento.
3. **Aceita cadastro com CPF?** Importante para quem ainda não tem CNPJ.
4. **Aceita o seu modelo de negócio?** Algumas empresas têm regras para lojas que vendem sem estoque ou com prazos longos de entrega, e podem segurar parte do saldo por um período. **Leia os termos** e, na dúvida, pergunte ao suporte antes de abrir a conta.
5. **Onde o cliente paga:** dentro da sua loja (checkout transparente) ou em outra página. Pagar sem sair da loja costuma gerar menos desistência.
6. **Suporte:** por onde atendem e em quanto tempo respondem.

## Documentos que costumam pedir

- CPF ou CNPJ
- Documento com foto e uma selfie
- Comprovante de endereço
- Conta bancária **no mesmo nome** do cadastro
- Endereço da loja (o site precisa estar no ar, com políticas e contato)

A análise pode levar de minutos a alguns dias. Lojas sem políticas, sem contato ou com produtos proibidos são recusadas.

## Passo a passo

1. **Abra a conta** no meio de pagamento e conclua a verificação de identidade.
2. **Ative as formas de pagamento:** Pix, cartão e boleto.
3. **Escolha o prazo de recebimento** do cartão.
4. Na plataforma da loja, abra **Pagamentos**, escolha o meio de pagamento e clique em **conectar**. Em geral, basta fazer login e autorizar; em alguns casos, você copia e cola duas chaves de acesso.
5. **Configure as parcelas:** quantas sem juros e qual o valor mínimo de cada parcela.
6. **Defina o nome na fatura** do cartão. Use o nome da loja: se o cliente não reconhecer a cobrança, ele vai contestar.

## Teste com dinheiro de verdade

- Faça um pedido pequeno com **Pix** e outro com **cartão**.
- Confira se o pedido muda para "pago" sozinho.
- Veja o valor chegar à conta do meio de pagamento, já com a taxa descontada.
- Faça o **reembolso** e confira se ele funciona.

## Segurança da conta

- Ative a **verificação em duas etapas**.
- Não compartilhe as chaves de acesso em grupos ou com "prestadores" desconhecidos.
- Cadastre a conta bancária para saque e confira os dados duas vezes.
`,
          tasks: [
            "Compare 2 meios de pagamento usando os 6 critérios da aula",
            "Abra a conta e conclua a verificação de identidade",
            "Conecte o pagamento à loja e faça um pedido de teste com Pix e outro com cartão",
          ],
        },
        {
          title: "Checkout que não perde venda",
          summary: "Os detalhes que fazem o cliente finalizar a compra.",
          learn: [
            "O que um bom checkout precisa ter",
            "Os motivos mais comuns de desistência",
            "Selos e informações que passam segurança",
          ],
          minutes: 8,
          content: `## O checkout é a reta final

O cliente já decidiu comprar. A partir daqui, **cada campo a mais e cada surpresa é uma chance de ele desistir**. Na maioria das lojas, mais da metade das pessoas que chegam ao checkout não termina a compra.

## Por que as pessoas desistem

1. **Frete ou custo que só aparece no final**
2. **Cadastro obrigatório e longo**
3. **Falta de confiança** para colocar os dados do cartão
4. **A forma de pagamento preferida não está disponível**
5. **Erro ou lentidão** na hora de pagar
6. **Prazo de entrega** maior do que o esperado

## O que um bom checkout tem

- **Poucos campos.** Peça só o necessário: nome, e-mail, telefone, CPF, endereço e pagamento.
- **Compra sem criar conta**, ou com o cadastro feito no próprio processo.
- **Endereço preenchido pelo CEP.**
- **Frete e prazo visíveis cedo**, de preferência já na página do produto.
- **Resumo do pedido** sempre à vista: produto, variação, frete e total.
- **Pix em destaque**, com o código "copia e cola" e o QR Code.
- **Parcelas com os valores** escritos: "3x de R$ 43,30 sem juros".
- **Funciona bem no celular:** teclado numérico nos campos de número, botões grandes.

## Confiança na hora de pagar

- **Cadeado** no endereço do site.
- **Logos das formas de pagamento** aceitas.
- Uma linha lembrando a **garantia de 7 dias**.
- Um **contato** visível (WhatsApp ou e-mail).

Use apenas selos que sejam verdadeiros. Selo de segurança inventado, quando percebido, destrói a confiança.

## Oferta extra no checkout

Muitas plataformas permitem oferecer um item complementar com um clique, antes do pagamento (por exemplo, um refil junto com o produto principal). Use com moderação:

- **Um único item**, relacionado ao produto e mais barato do que ele.
- Sem mexer no caminho principal: se atrapalhar a compra, tire.

## Depois do pagamento

A página de confirmação precisa dizer três coisas: **pedido recebido**, **o que acontece agora** e **quando chega**. No Pix e no boleto, mostre o código de novo e envie por e-mail — quem gerou e não pagou pode ser lembrado depois, como você vê na trilha *Robôs e automações*.
`,
          tasks: [
            "Faça uma compra no seu checkout pelo celular e conte quantos campos ele pede",
            "Remova os campos que não são necessários",
            "Confira se o frete e o prazo aparecem antes do pagamento",
          ],
        },
        {
          title: "Fraudes e contestações: como se proteger",
          summary: "Evite prejuízo com compras fraudulentas.",
          learn: [
            "O que é uma contestação de compra (chargeback)",
            "Sinais de pedido suspeito",
            "Como responder a uma contestação",
          ],
          minutes: 8,
          content: `## O que é uma contestação

Quando o dono de um cartão não reconhece uma compra ou diz que não recebeu o produto, ele pode pedir ao banco o dinheiro de volta. Isso se chama **contestação**, ou *chargeback*.

Se o banco der razão a ele, **o valor é retirado da sua conta** — mesmo que o produto já tenha sido enviado. Muitas contestações seguidas podem fazer o meio de pagamento encerrar a sua conta.

## Por que acontecem

| Motivo | Como evitar |
| --- | --- |
| **Cartão roubado ou clonado** | Análise antifraude e atenção aos sinais abaixo |
| **O cliente não reconhece o nome na fatura** | Usar o nome da loja na fatura do cartão |
| **O produto não chegou** | Prazo honesto, rastreio e avisos |
| **O produto é diferente do anunciado** | Página fiel ao produto real |
| **O cliente não conseguiu falar com a loja** | Atendimento fácil e rápido |

Repare que só o primeiro motivo é fraude. Os outros se resolvem com **informação clara e bom atendimento**.

## Sinais de pedido suspeito

- Valor alto no **primeiro** pedido de um cliente
- **Várias tentativas** com cartões diferentes
- Nome do comprador diferente do nome no cartão, com entrega em outro estado
- E-mail com letras e números sem sentido
- Vários pedidos iguais em poucos minutos
- Pressa incomum e pedido para trocar o endereço depois do pagamento

Um sinal sozinho não prova nada. Dois ou três juntos pedem uma checagem: mande uma mensagem confirmando os dados antes de pedir o produto ao fornecedor. Fraudador raramente responde.

## Como se proteger

- Mantenha ligada a **análise antifraude** do meio de pagamento.
- Envie sempre com **rastreio** e guarde o comprovante de entrega.
- Guarde as conversas com o cliente.
- **Reembolse rápido** quando o cliente tiver razão: um reembolso custa menos do que uma contestação.

## Como responder a uma contestação

O meio de pagamento avisa você e dá um **prazo curto**, de poucos dias. Envie:

1. Comprovante do pedido e nota fiscal
2. Código de rastreio e comprovante de entrega
3. Conversas com o cliente
4. A página do produto e a política de troca

Responda sempre, mesmo achando que vai perder: sem resposta, a perda é certa.

## E no Pix?

O Pix não tem contestação como a do cartão, mas existem dois cuidados:

- **Comprovante falso:** nunca libere um pedido com base em print. Confira se o valor **entrou** no extrato.
- **Devolução por fraude:** o Banco Central tem um mecanismo que permite ao banco bloquear e devolver valores em casos de golpe. Vale a mesma regra: guarde todos os comprovantes da venda e da entrega.
`,
          tasks: [
            "Confira se a análise antifraude está ligada no seu meio de pagamento",
            "Defina o nome que aparece na fatura do cartão do cliente",
            "Escreva a mensagem que você vai enviar para confirmar pedidos suspeitos",
          ],
          quiz: [
            {
              text: "O que acontece em uma contestação (chargeback) aceita pelo banco?",
              explanation:
                "O valor é devolvido ao dono do cartão e descontado do lojista, mesmo com o produto já enviado.",
              options: [
                "O valor da venda é retirado da conta do lojista",
                "O banco paga o prejuízo no lugar do lojista",
                "O cliente é obrigado a devolver o produto antes",
              ],
            },
            {
              text: "Um cliente enviou o print de um Pix, mas o valor não aparece no extrato. O que fazer?",
              explanation:
                "Comprovantes podem ser falsificados. Só o extrato confirma que o dinheiro entrou.",
              options: [
                "Liberar o pedido só depois que o valor aparecer no extrato",
                "Liberar o pedido, porque o print é suficiente",
                "Pedir que o cliente envie o print de novo",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Dinheiro e formalização",
      description: "MEI, notas fiscais e o controle do caixa.",
      lessons: [
        {
          title: "CPF, MEI ou empresa: quando formalizar",
          summary: "O caminho para vender dentro das regras.",
          learn: [
            "O que muda ao abrir um MEI",
            "Limites e quando mudar de categoria",
            "Notas fiscais: quando são necessárias",
          ],
          minutes: 9,
          content: `> Esta aula é uma **orientação geral**. Regras de impostos mudam e cada caso tem detalhes. Antes de decidir, confirme os valores atuais em fontes oficiais e converse com um contador.

## Dá para começar com CPF?

Para **testar**, sim: vários meios de pagamento e marketplaces aceitam cadastro com CPF, com limites de valor. Mas vender com frequência é uma atividade comercial e precisa ser formalizada. Além disso, sem CNPJ você tem:

- Limites mais baixos para receber
- Dificuldade para comprar de fornecedores e atacadistas
- Menos confiança de clientes e parceiros
- Imposto de renda como pessoa física sobre o que ganhar

## O MEI

O **Microempreendedor Individual** é a forma mais simples de ter um CNPJ.

| | Como funciona |
| --- | --- |
| **Abertura** | Gratuita e pela internet, no Portal do Empreendedor |
| **Imposto** | Um boleto mensal de valor fixo (em torno de R$ 80 para comércio), que inclui a contribuição para a Previdência |
| **Limite de faturamento** | R$ 81 mil por ano (média de R$ 6.750 por mês). Confira o valor em vigor |
| **Funcionários** | No máximo um |
| **Sócios** | Não pode ter |
| **Obrigações** | Pagar o boleto mensal e entregar uma declaração anual simples |

Atenção: o limite é sobre **tudo o que você vende** (o faturamento), não sobre o lucro.

**Cuidado com golpes:** abrir o MEI é gratuito. Sites que cobram para "abrir o seu MEI" são intermediários desnecessários.

## Quando o MEI deixa de servir

- O faturamento vai passar do limite
- Você quer ter um sócio ou mais de um funcionário
- A sua atividade não está na lista permitida

O passo seguinte é a **Microempresa (ME) no Simples Nacional**, em que o imposto vira uma porcentagem do faturamento e um contador passa a ser necessário. Planeje a mudança **antes** de estourar o limite: passar dele sem avisar gera cobrança retroativa.

## Notas fiscais

- O MEI **precisa** emitir nota nas vendas para outras empresas e sempre que o cliente pedir.
- Nas vendas pela internet, transportadoras e marketplaces costumam exigir nota para o envio. Na prática, **emita em todas as vendas**.
- A emissão pode ser automatizada com sistemas de gestão que se conectam à loja.

## Quem vende sem estoque

Existem pontos próprios desse modelo que você deve levar ao contador:

- Quando o fornecedor brasileiro envia direto ao cliente, **quem emite a nota e em nome de quem**.
- Quando o fornecedor é de fora do país, **como declarar** a operação e quais impostos de importação se aplicam ao pedido.

Combine isso com o fornecedor e registre por escrito.
`,
          tasks: [
            "Confira no Portal do Empreendedor o limite e o valor mensal atuais do MEI",
            "Verifique se a sua atividade está na lista permitida para MEI",
            "Liste as dúvidas sobre nota fiscal para levar a um contador",
          ],
        },
        {
          title: "Organizando o caixa do negócio",
          summary: "Separe o dinheiro da loja do seu dinheiro pessoal.",
          learn: [
            "Controle simples de entradas e saídas",
            "Reserva para anúncios e imprevistos",
            "Os números para acompanhar toda semana",
          ],
          minutes: 7,
          content: `## A primeira regra: contas separadas

Abra uma conta **só para a loja**. Bancos digitais oferecem conta para MEI sem mensalidade. Tudo o que entra das vendas vai para ela; tudo o que a loja paga sai dela.

Misturar o dinheiro da loja com o pessoal é o motivo mais comum de alguém "vender bem e não ver a cor do dinheiro".

## Um controle que cabe em uma planilha

Você precisa de duas listas, atualizadas toda semana.

**Entradas**

- Vendas **recebidas** (o que já caiu na conta)
- Vendas **a receber** (cartão que ainda vai cair)

**Saídas**

- Fornecedor (produto e frete)
- Anúncios
- Taxas do meio de pagamento e da plataforma
- Aplicativos e ferramentas
- Reembolsos
- Impostos

No fim do mês: **entradas − saídas = lucro**. Faturamento não é lucro.

## As três reservas

1. **Reserva para pedidos.** O dinheiro para pagar o fornecedor antes de o cartão cair. Uma boa referência é ter guardado o equivalente a **duas semanas** de pedidos.
2. **Reserva para reembolsos.** Separe de **5% a 10%** do que vende. Trocas e devoluções fazem parte do negócio.
3. **Reserva para anúncios.** O valor do mês, definido antes e que você não ultrapassa por impulso.

## O seu pagamento

Defina um valor ou uma porcentagem do lucro para retirar **uma vez por mês**. Pegar dinheiro do caixa "quando precisa" impede você de saber se a loja dá lucro.

No começo, é normal não retirar nada e reinvestir tudo. O importante é ser uma decisão, não um acidente.

## Os números da semana

| Número | Para que serve |
| --- | --- |
| **Faturamento** | Quanto a loja vendeu |
| **Pedidos** e **ticket médio** | Quantas vendas e de quanto cada uma |
| **Gasto com anúncios** | Quanto custou trazer os clientes |
| **Lucro** | O que sobrou de verdade |
| **Saldo a receber** | Quanto ainda vai cair |
| **Reembolsos** | Sinal de problema em produto ou prazo |

Reserve **30 minutos, sempre no mesmo dia**, para preencher. Em um mês, você enxerga padrões; em três, toma decisões que antes eram palpite.

> As calculadoras de **meta de vendas** e de **resultado de campanha**, em *Ferramentas*, usam esses mesmos números.
`,
          tasks: [
            "Abra uma conta separada para a loja",
            "Monte a planilha de entradas e saídas",
            "Defina o valor das três reservas",
            "Marque na agenda os 30 minutos semanais de controle",
          ],
          quiz: [
            {
              text: "O limite de faturamento do MEI considera o quê?",
              explanation:
                "O limite vale para o total vendido no ano, antes de descontar custos e despesas.",
              options: [
                "Tudo o que foi vendido no ano",
                "Apenas o lucro depois das despesas",
                "Somente as vendas no cartão",
              ],
            },
            {
              text: "Por que manter uma reserva para pedidos?",
              explanation:
                "O fornecedor é pago logo após a venda, enquanto o valor do cartão pode demorar semanas para cair.",
              options: [
                "Para pagar o fornecedor antes de o valor do cartão cair",
                "Porque os bancos exigem um saldo mínimo",
                "Para pagar o imposto de importação do cliente",
              ],
            },
          ],
        },
      ],
    },
  ],
};
