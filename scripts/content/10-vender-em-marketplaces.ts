import type { TrackSeed } from "./types";

export const VENDER_EM_MARKETPLACES: TrackSeed = {
  slug: "vender-em-marketplaces",
  title: "Vender em marketplaces",
  description:
    "Venda onde os compradores já estão: conta de vendedor, anúncios que aparecem na busca, reputação e anúncios patrocinados.",
  level: "INICIANTE",
  icon: "store",
  color: "sun",
  modules: [
    {
      title: "Como os marketplaces funcionam",
      description: "Entenda as regras antes do primeiro anúncio.",
      lessons: [
        {
          title: "Por que vender em um marketplace",
          summary: "Vantagens e limites de vender na vitrine dos outros.",
          learn: [
            "Como funcionam os grandes sites de compra",
            "As vantagens para quem está começando",
            "Regras de prazo e envio que você precisa cumprir",
          ],
          minutes: 7,
          content: `## O que é um marketplace

É um **shopping na internet**: um site grande, em que milhares de lojistas vendem lado a lado. O comprador confia no site, paga por ele e recebe pela logística dele. Você entra com o produto e o atendimento.

Exemplos no Brasil: **Mercado Livre, Shopee, Amazon** e **Magalu**.

## As vantagens para quem está começando

- **Os compradores já estão lá.** Milhões de pessoas entram todos os dias procurando o que comprar. Você não precisa pagar anúncio para ter a primeira visita.
- **Confiança emprestada.** O cliente que não conhece a sua loja confia no site.
- **Pagamento e frete prontos.** Você não configura checkout nem negocia com transportadora.
- **Custo inicial baixo.** Em geral, não há mensalidade: você paga uma comissão quando vende.

## Os limites

| Limite | O que significa |
| --- | --- |
| **Comissão** | Uma parte de cada venda fica com o marketplace |
| **Concorrência ao lado** | O seu anúncio aparece junto de outros iguais, muitas vezes mais baratos |
| **O cliente é do marketplace** | Você não pode levar a conversa para fora nem usar os dados dele para vender depois |
| **Regras rígidas** | Prazo de envio, atendimento e reputação são medidos o tempo todo |
| **Risco de suspensão** | Quem descumpre as regras pode ter a conta limitada ou encerrada |

## E para quem vende sem estoque?

Dá para vender em marketplace sem ter estoque em casa, mas **a regra do prazo muda tudo**.

Os marketplaces exigem que o pedido seja **postado rápido** — em geral, em um ou dois dias úteis. Atrasou, a sua reputação cai.

Por isso, o modelo que funciona é:

- **Fornecedor brasileiro**, que posta no mesmo dia ou no dia seguinte
- Fornecedor que aceita **postar com a etiqueta gerada pelo marketplace**
- **Estoque do fornecedor confiável**, para você não vender o que não existe

Produtos enviados de fora do país, com semanas de prazo, **não se encaixam** nas regras de envio da maioria dos marketplaces. Alguns permitem informar um prazo de preparação maior para itens sob encomenda, com limites. **Leia as regras de cada um** antes de anunciar.

## Marketplace ou loja própria?

Não é preciso escolher. Cada um tem um papel:

| | Marketplace | Loja própria |
| --- | --- | --- |
| **Primeiras vendas** | Mais rápidas | Dependem de anúncios |
| **Custo por venda** | Comissão | Anúncios e taxas |
| **Cliente** | Do marketplace | Seu |
| **Marca** | Pouco espaço | Você constrói |

Muita gente começa pelo marketplace para **validar o produto** com pouco dinheiro e depois abre a loja própria.

> Marketplace recompensa quem **entrega bem**. Mais do que anunciar bonito, o segredo é postar no prazo e responder rápido.
`,
          tasks: [
            "Pesquise o seu produto em 2 marketplaces e anote o preço e as vendas dos 5 primeiros anúncios",
            "Leia as regras de prazo de envio do marketplace em que pretende começar",
            "Pergunte ao fornecedor se ele posta em até 1 dia útil com a etiqueta do marketplace",
          ],
        },
        {
          title: "Taxas, comissões e frete: entendendo a conta",
          summary: "Tudo o que sai do valor de cada venda.",
          learn: [
            "Comissões e tarifas por venda",
            "Como o frete entra na conta",
            "Calculando o preço mínimo",
          ],
          minutes: 8,
          content: `## O que sai de cada venda

| Custo | Como funciona |
| --- | --- |
| **Comissão** | Uma porcentagem do preço. Varia por categoria e pelo tipo de anúncio |
| **Tarifa fixa** | Um valor por unidade vendida, comum em produtos de preço baixo |
| **Frete** | Quando o marketplace oferece frete grátis ao comprador, parte do custo fica com o vendedor |
| **Programas opcionais** | Participar de programas de frete grátis ou de cupons costuma aumentar a comissão |
| **Anúncios patrocinados** | Se você pagar para aparecer em destaque |
| **Custo do produto** | O que você paga ao fornecedor |
| **Impostos** | Conforme o seu enquadramento |

As porcentagens mudam com frequência. **Consulte a tabela atual** na central do vendedor de cada marketplace.

## Tipos de anúncio

Alguns marketplaces oferecem mais de um tipo de anúncio: um com **comissão menor** e exposição normal, outro com **comissão maior**, mais destaque e parcelamento sem juros para o comprador. Em produtos de valor mais alto, o parcelamento costuma compensar a diferença.

## Um exemplo de conta

Os percentuais abaixo são **apenas ilustrativos**.

| Item | Valor |
| --- | --- |
| Preço de venda | R$ 100,00 |
| Comissão (14%) | − R$ 14,00 |
| Tarifa fixa | − R$ 5,00 |
| Parte do frete paga por você | − R$ 12,00 |
| Custo do produto | − R$ 40,00 |
| Impostos | − R$ 4,00 |
| **Lucro** | **R$ 25,00** |

De cada R$ 100, sobram R$ 25. Quem olha só para "R$ 100 − R$ 40" e imagina um lucro de R$ 60 leva um susto no fim do mês.

## O frete é o item que mais engana

- Em muitos marketplaces, acima de um certo preço o **frete grátis é obrigatório**, e o vendedor paga uma parte.
- O valor depende do **peso e das medidas** do pacote. Cadastrar o produto com as dimensões erradas pode gerar cobrança a mais.
- **Boa reputação dá desconto** no frete em alguns marketplaces.

Produtos **leves e pequenos** são os mais fáceis de fazer a conta fechar.

## Calculando o preço mínimo

O preço mínimo é aquele em que você **não ganha nem perde**.

**Preço mínimo = custos fixos em reais ÷ (1 − custos em porcentagem)**

Usando o exemplo:

- Custos em reais: R$ 40 (produto) + R$ 5 (tarifa) + R$ 12 (frete) = **R$ 57**
- Custos em porcentagem: 14% (comissão) + 4% (impostos) = **18%**
- Preço mínimo: 57 ÷ 0,82 = **R$ 69,51**

Abaixo de R$ 69,51, cada venda dá prejuízo. Você vai usar esse número para decidir se entra em promoções e se acompanha o preço de um concorrente.

## Use o simulador

Os marketplaces têm **calculadoras ou simuladores de custos** na central do vendedor. Informe categoria, preço, peso e medidas e veja quanto você recebe. Faça isso **antes** de criar cada anúncio.

> Se a conta não fecha com um produto de R$ 30, considere vender em **kit**. Você vê como na aula sobre preço.
`,
          tasks: [
            "Abra a tabela de comissões do marketplace escolhido e anote a porcentagem da sua categoria",
            "Simule o custo de frete do seu produto com o peso e as medidas reais",
            "Calcule o preço mínimo do seu produto principal",
          ],
        },
        {
          title: "Criando a conta de vendedor",
          summary: "Do cadastro às primeiras configurações.",
          learn: [
            "Cadastro como pessoa física ou com CNPJ",
            "Configurações de envio e recebimento",
            "Os primeiros passos para ganhar reputação",
          ],
          minutes: 9,
          content: `## CPF ou CNPJ?

- **Alguns marketplaces aceitam cadastro com CPF**, com limite de vendas. É um bom caminho para testar.
- **Outros exigem CNPJ** desde o início.
- Mesmo onde o CPF é aceito, quem vende com frequência é chamado a **formalizar**. Com CNPJ, você emite nota fiscal e tem acesso a mais recursos.

Veja na trilha *Pagamentos e checkout* como abrir um MEI.

## O cadastro

1. **Crie a conta** com o e-mail da loja e os seus dados verdadeiros.
2. **Envie os documentos** pedidos: documento com foto e, às vezes, uma selfie e um comprovante de endereço.
3. **Cadastre a conta para receber.** O dinheiro das vendas entra em uma carteira do próprio marketplace e, de lá, você transfere para o banco. A conta bancária precisa estar no **mesmo nome** do cadastro.
4. **Ative a verificação em duas etapas.**

Use sempre os **seus** dados. Contas abertas em nome de terceiros são bloqueadas, e o saldo fica preso.

## Configurações de envio

- **Endereço de origem:** de onde os pacotes saem. Se o fornecedor posta por você, combine com ele qual endereço usar e confira as regras do marketplace.
- **Forma de envio:** quase sempre é a **logística do próprio marketplace**. Ele gera uma etiqueta para cada venda, e o pacote é postado em um ponto de coleta ou retirado.
- **Horário de corte:** vendas feitas até certo horário precisam ser postadas no mesmo dia ou no dia útil seguinte.
- **Prazo de preparação:** quanto tempo você leva para ter o pacote pronto.

## Nota fiscal

- Vendedores com **CNPJ** precisam emitir nota em cada venda. Um sistema de gestão ligado ao marketplace emite sozinho.
- Para vendedores com **CPF**, o envio costuma acompanhar uma declaração de conteúdo, gerada pelo próprio marketplace.

## Outras configurações

- **Nome e logo** da loja
- **Horário de atendimento**
- **Respostas automáticas** para fora do horário
- **Política de devolução**, dentro do que o marketplace exige

## Os primeiros passos para ganhar reputação

Toda conta começa **sem reputação**, e os primeiros pedidos pesam muito.

1. **Comece com poucos anúncios** — de 3 a 5 produtos que você domina.
2. **Poste rápido**, de preferência no mesmo dia.
3. **Responda às perguntas em minutos**, no horário comercial.
4. **Não cancele vendas.** Só anuncie o que o fornecedor realmente tem.
5. **Embale bem.** Avaria vira reclamação.
6. **Preço competitivo** nas primeiras vendas, mesmo com margem menor. As primeiras avaliações valem mais do que o lucro delas.

## O que nunca fazer

- **Combinar a venda por fora** do marketplace
- **Passar telefone, e-mail ou link** nas perguntas e mensagens
- **Simular vendas** ou avaliações com contas de conhecidos
- **Abrir outra conta** depois de uma suspensão

Essas práticas são detectadas e levam ao encerramento da conta.
`,
          tasks: [
            "Crie a conta de vendedor com os seus dados e ative a verificação em duas etapas",
            "Cadastre a conta para receber e confira os dados",
            "Configure o envio e combine com o fornecedor o horário de corte",
          ],
          quiz: [
            {
              text: "Qual tipo de fornecedor combina com a venda em marketplaces?",
              explanation:
                "Os marketplaces exigem postagem rápida. Só um fornecedor nacional, com estoque confiável, consegue cumprir.",
              options: [
                "Um fornecedor brasileiro que posta em até 1 dia útil",
                "Um fornecedor de fora do país, com 30 dias de prazo",
                "Qualquer fornecedor, porque o prazo não é medido",
              ],
            },
            {
              text: "Os custos em reais de um produto somam R$ 57 e os custos em porcentagem somam 18%. Qual é o preço mínimo aproximado?",
              explanation: "Preço mínimo = 57 ÷ (1 − 0,18) = 57 ÷ 0,82 ≈ R$ 69,51.",
              options: ["Cerca de R$ 69,50", "R$ 57,00", "Cerca de R$ 75,00"],
            },
          ],
        },
      ],
    },
    {
      title: "Anúncios que vendem",
      description: "O que faz um anúncio aparecer e vender.",
      lessons: [
        {
          title: "Título, fotos e ficha técnica",
          summary: "O básico bem-feito que a maioria ignora.",
          learn: [
            "Como escrever títulos que aparecem na busca",
            "Fotos que vendem dentro das regras",
            "Ficha técnica completa",
          ],
          minutes: 9,
          content: `## O anúncio é a sua vitrine e o seu vendedor

No marketplace, o cliente compara vários anúncios em segundos. Três coisas decidem se ele clica no seu: **a foto, o título e o preço**. E uma quarta decide se ele compra: **as informações**.

## O título

O título serve para **ser encontrado**. Use as palavras que o comprador digita.

**Fórmula:** produto + marca + modelo + característica principal + detalhe (cor, tamanho, quantidade).

- Fraco: "Fonte Linda para Seu Pet Promoção"
- Forte: "Fonte Bebedouro Gatos 2 L Silenciosa Filtro Carvão Bivolt"

**Regras:**

- A **palavra principal no começo**.
- **Sem** "promoção", "frete grátis", "melhor preço" e símbolos: as regras proíbem e a busca ignora.
- **Sem repetir** palavras.
- Respeite o **limite de caracteres**.
- Em muitos marketplaces, mudar o título depois das primeiras vendas é limitado. Capriche antes de publicar.

## As fotos

A primeira foto é a que aparece na busca. As regras variam, mas o padrão é:

- **Fundo branco** e limpo
- **Produto inteiro**, centralizado e ocupando a maior parte da imagem
- **Sem texto, logo, borda ou selo**
- **Alta resolução**, para o zoom funcionar

**As demais fotos** (use todas as posições disponíveis):

1. Outros ângulos
2. O produto **em uso**
3. Uma foto com as **medidas**
4. Detalhes: material, encaixes, botões
5. **O que vem na caixa**
6. A embalagem

Se o marketplace permitir **vídeo curto**, grave um. Poucos concorrentes fazem.

## A ficha técnica

São os campos do cadastro: marca, modelo, material, cor, medidas, voltagem. **Preencha todos.**

- Os **filtros da busca** usam esses campos. Quem não informa a cor não aparece para quem filtra por cor.
- Fichas completas aumentam a **qualidade do anúncio**, que o marketplace mede e mostra.
- Informe o **código de barras** quando o produto tiver.
- Não invente: informação errada vira devolução e reclamação.

## A descrição

Use texto simples, em blocos curtos:

- O que é e para que serve
- **Medidas e peso**
- **O que acompanha**
- Como usar
- Garantia
- Respostas para as dúvidas mais comuns

Não coloque contato, links ou propaganda de outros canais.

## Variações

Cores e tamanhos diferentes devem estar em **um único anúncio**, como variações. Assim, as vendas e as avaliações de todas elas se somam, e o anúncio sobe mais rápido na busca.

## Aprenda com as perguntas

Cada pergunta de um comprador é um aviso de que **faltou informação**. Responda e, em seguida, **acrescente a resposta à descrição ou às fotos**.
`,
          tasks: [
            "Escreva o título do seu anúncio com a fórmula da aula",
            "Faça a foto principal com fundo branco e mais 5 fotos complementares",
            "Preencha todos os campos da ficha técnica",
          ],
        },
        {
          title: "Preço competitivo sem destruir o lucro",
          summary: "Como se posicionar sem entrar em guerra de preço.",
          learn: [
            "Como analisar o preço dos concorrentes",
            "Quando vale a pena ter o menor preço",
            "Kits e combos para vender mais",
          ],
          minutes: 8,
          content: `## O preço pesa, mas não decide sozinho

No marketplace, o cliente vê os preços lado a lado. Mesmo assim, muita gente paga um pouco mais por um vendedor com **boa reputação, entrega rápida e anúncio claro**.

## Como analisar os concorrentes

Pesquise o produto e anote, para os 5 primeiros anúncios:

| O que olhar | Por quê |
| --- | --- |
| **Preço com frete** | É o valor que o cliente compara |
| **Quantidade vendida** | Mostra o preço que o mercado aceita |
| **Reputação do vendedor** | Vendedor novo precisa compensar com preço ou oferta |
| **Prazo de entrega** | Entregar antes vale dinheiro |
| **É exatamente o mesmo produto?** | Se for, a comparação é direta |

## Quando o produto é idêntico

Em alguns marketplaces, produtos iguais de vários vendedores aparecem em **uma única página**, e um vendedor é destacado como a opção principal de compra. Quem leva esse destaque costuma ser quem combina **bom preço, boa reputação e entrega rápida**.

Aqui, o preço pesa muito. Só vale disputar se:

- A sua conta **fecha com lucro** nesse preço
- Você consegue **cumprir os prazos** com folga

Se a conta não fecha, não entre nessa disputa: **diferencie a oferta**.

## Como fugir da guerra de preço

**1. Kits e combos**

- **2 unidades** com um pequeno desconto
- Produto + **acessório** (a fonte com um refil extra)
- Produto + **item complementar**

Um kit vira um anúncio **que ninguém mais tem**, difícil de comparar. E como a tarifa fixa e o frete são cobrados por pedido, vender mais itens por pedido melhora a conta.

**2. Anúncio melhor**

Fotos próprias, vídeo, ficha completa e descrição clara justificam alguns reais a mais.

**3. Entrega mais rápida**

Postar no mesmo dia aparece para o comprador como um prazo menor.

**4. Atendimento**

Responder em minutos fecha vendas que o concorrente lento perde.

## Nunca abaixo do preço mínimo

Você calculou o **preço mínimo** na aula sobre taxas. Ele é o piso: abaixo dele, cada venda aumenta o prejuízo. Não existe "ganhar no volume" vendendo com prejuízo.

## Promoções do marketplace

Datas especiais, ofertas com tempo limitado e cupons trazem muito movimento.

- **Faça a conta antes de aceitar.** Alguns programas aumentam a comissão.
- **Garanta o estoque** com o fornecedor.
- Promoção boa é a que **dá lucro** ou **traz avaliações** para um anúncio novo — decida qual é o objetivo.

## Desconto falso é proibido

Aumentar o preço para depois "dar desconto" é propaganda enganosa. Os marketplaces acompanham o histórico de preços e punem a prática, e o consumidor pode denunciar.

## Reveja os preços com frequência

Custos de fornecedor, comissões e fretes mudam. Uma vez por mês, refaça a conta dos seus principais produtos.
`,
          tasks: [
            "Analise os 5 primeiros concorrentes do seu produto usando a tabela da aula",
            "Crie 1 kit ou combo e calcule o preço mínimo dele",
            "Defina o seu preço e confira se ele fica acima do preço mínimo",
          ],
        },
        {
          title: "Aparecendo na busca do marketplace",
          summary: "Como o comprador encontra o seu anúncio.",
          learn: [
            "Como a busca do marketplace ordena os anúncios",
            "Palavras-chave nos anúncios",
            "O peso das vendas e das avaliações",
          ],
          minutes: 8,
          content: `## A busca é a maior vitrine

A maioria das vendas em um marketplace começa na **barra de busca**. Aparecer na primeira página para a busca certa vale mais do que qualquer outra coisa.

## O que faz um anúncio subir

O marketplace quer mostrar primeiro o que tem **mais chance de virar uma venda sem problema**. Para isso, ele observa:

| Fator | O que significa |
| --- | --- |
| **Relevância** | O título e a ficha técnica combinam com o que foi buscado |
| **Vendas** | Anúncios que vendem mais sobem |
| **Conversão** | De quem abre o anúncio, quantos compram |
| **Preço** | Competitivo em relação a produtos parecidos |
| **Reputação do vendedor** | Poucas reclamações, cancelamentos e atrasos |
| **Entrega** | Frete grátis e prazo curto ganham destaque |
| **Qualidade do anúncio** | Ficha completa, boas fotos, vídeo |
| **Atendimento** | Perguntas respondidas rapidamente |

Não existe truque. O que funciona é **fazer bem o básico em todos esses pontos**.

## Encontrando as palavras certas

- **Comece a digitar** na busca do marketplace e veja as sugestões: são as buscas mais feitas.
- Alguns marketplaces publicam uma página com os **termos em alta**.
- Leia os **títulos dos anúncios mais vendidos** e veja quais palavras se repetem.
- Preste atenção em como **os compradores escrevem** nas perguntas.

## Onde usar as palavras

1. **No título**, com a principal no começo
2. **Na ficha técnica**, preenchendo todos os campos
3. **Na descrição**, de forma natural, incluindo sinônimos ("bebedouro", "fonte", "fonte de água")

Repetir a mesma palavra várias vezes não ajuda — e deixa o anúncio com cara de spam.

## O efeito bola de neve

Vendas trazem posição, e posição traz vendas. O desafio é a **primeira volta**. Para um anúncio novo:

- Entre com **preço competitivo**
- Capriche em **fotos e ficha**
- Considere um pequeno orçamento de **anúncios patrocinados** (última aula desta trilha)
- **Responda a todas as perguntas** rapidamente
- Entregue bem para conseguir as **primeiras avaliações**

## Não jogue fora o histórico

Cada anúncio acumula vendas, avaliações e posição. Por isso:

- **Não exclua** um anúncio para criar outro igual. Você recomeça do zero.
- Quer mudar o preço ou o estoque? **Edite** o anúncio.
- Ficou sem estoque? **Pause** e reative depois, em vez de encerrar.
- **Junte as variações** em um só anúncio, para concentrar o histórico.

## O que derruba um anúncio

- **Cancelar vendas** por falta de estoque
- **Atrasar a postagem**
- Muitas **devoluções** por produto diferente do anunciado
- **Perguntas sem resposta**
- Ficar **sem estoque** por muito tempo

## Acompanhe os números do anúncio

A central do vendedor mostra **visitas** e **vendas** de cada anúncio.

| O que você vê | O que fazer |
| --- | --- |
| Poucas visitas | Rever o título, a foto principal e o preço |
| Muitas visitas, poucas vendas | Rever fotos, descrição, preço e frete |
| Vende bem | Garantir o estoque e manter o padrão |
`,
          tasks: [
            "Liste 10 termos sugeridos pela busca do marketplace para o seu produto",
            "Ajuste o título e a ficha técnica com os termos mais buscados",
            "Anote as visitas e as vendas do seu anúncio para comparar na semana que vem",
          ],
          quiz: [
            {
              text: "Como deve ser a primeira foto de um anúncio em marketplace?",
              explanation:
                "O padrão é fundo branco, produto inteiro e nenhuma informação por cima. Fotos fora da regra perdem exposição.",
              options: [
                "Fundo branco, produto inteiro e sem texto ou logo",
                "Com o preço e \"frete grátis\" escritos em destaque",
                "Uma montagem com várias fotos pequenas",
              ],
            },
            {
              text: "Um concorrente vende o mesmo produto abaixo do seu preço mínimo. O que fazer?",
              explanation:
                "Vender abaixo do preço mínimo é prejuízo em cada venda. O caminho é criar uma oferta que não seja comparável.",
              options: [
                "Não acompanhar e diferenciar a oferta, por exemplo com um kit",
                "Baixar o preço para vender com prejuízo e ganhar no volume",
                "Excluir o anúncio e criar outro igual",
              ],
            },
            {
              text: "Por que não excluir um anúncio para criar outro idêntico?",
              explanation:
                "Vendas, avaliações e posição ficam ligadas ao anúncio. Um anúncio novo começa sem nada disso.",
              options: [
                "Porque o histórico de vendas e avaliações se perde",
                "Porque o marketplace cobra uma multa por anúncio excluído",
                "Porque anúncios novos não podem ter fotos",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Operação e reputação",
      description: "Entregar bem é o que mantém a conta vendendo.",
      lessons: [
        {
          title: "Prazos, envio e atendimento",
          summary: "Organize a operação para não atrasar.",
          learn: [
            "Como cumprir os prazos de envio",
            "Respondendo perguntas rápido",
            "Lidando com reclamações",
          ],
          minutes: 8,
          content: `## O prazo é a regra mais importante

Cada venda tem uma **data limite de postagem**. Postar depois dela conta como atraso, mesmo que o cliente receba dentro do prazo final. Atrasos repetidos derrubam a reputação e a posição dos anúncios.

## Organizando o envio com o fornecedor

Como quem posta é o fornecedor, o combinado precisa ser claro:

1. **Horário de corte:** até que horas você envia o pedido para ele postar no mesmo dia.
2. **Envio da etiqueta:** assim que a venda entra, você baixa a etiqueta do marketplace e manda para o fornecedor.
3. **Confirmação:** ele avisa quando postou.
4. **Fins de semana e feriados:** quem posta e quando.
5. **Embalagem:** tamanho e peso iguais aos cadastrados no anúncio.

Quanto mais desse caminho for automático, menor o risco. Sistemas de gestão que ligam o marketplace ao fornecedor fazem o envio do pedido e da etiqueta sozinhos.

## O estoque é o seu ponto fraco

Vender o que o fornecedor não tem obriga você a **cancelar** — e cancelamento por culpa do vendedor pesa muito na reputação.

- Peça **atualização do estoque** todos os dias, ou integração automática.
- No anúncio, informe uma **quantidade menor** do que a disponível, por segurança.
- **Pause** o anúncio ao menor sinal de falta.
- Para os produtos que mais vendem, considere **ter algumas unidades em casa**. Esse modelo misto dá segurança sem exigir um grande investimento.

## Perguntas dos compradores

Responder rápido **vende**. Muita gente pergunta para vários vendedores e compra de quem responde primeiro.

- Ative as **notificações** no celular.
- Tenha **respostas prontas** para as dúvidas mais comuns, mas personalize o começo.
- Seja direto: **responda primeiro**, explique depois.
- Termine convidando para a compra: "Pode comprar tranquilo, postamos amanhã cedo."
- **Nunca** passe contato ou link de fora.

## Mensagens depois da venda

- Uma mensagem curta confirmando o pedido e o prazo já evita ansiedade.
- Use o canal de mensagens **do próprio marketplace**.
- Mantenha o tom cordial mesmo com clientes difíceis: as conversas podem ser lidas em uma disputa.

## Quando o cliente reclama

Uma reclamação aberta afeta a reputação, e a forma de resolver conta.

1. **Responda dentro do prazo** indicado, de preferência no mesmo dia.
2. **Peça desculpas e ofereça a solução**: reenvio, troca ou reembolso.
3. **Não discuta.** Mesmo com razão, uma briga escrita só piora a situação.
4. Se não houver acordo, o **marketplace decide**. Tenha os comprovantes: postagem, rastreio e conversas.

Em muitos marketplaces, a **devolução é grátis para o comprador**, e parte desse custo pode ficar com o vendedor. Coloque isso na sua conta.

## Um quadro para acompanhar todos os dias

| Pergunta | Meta |
| --- | --- |
| Há vendas **a postar hoje**? | Todas enviadas ao fornecedor antes do horário de corte |
| Há **perguntas sem resposta**? | Nenhuma |
| Há **reclamações abertas**? | Respondidas no mesmo dia |
| Algum produto **quase sem estoque**? | Anúncio ajustado ou pausado |
`,
          tasks: [
            "Combine com o fornecedor o horário de corte e o envio das etiquetas",
            "Crie respostas prontas para as 5 perguntas mais comuns",
            "Ative as notificações de perguntas e vendas no celular",
            "Monte o quadro diário de acompanhamento",
          ],
        },
        {
          title: "Avaliações e reputação",
          summary: "A reputação como motor de vendas.",
          learn: [
            "Como conseguir boas avaliações",
            "O que fazer com uma avaliação ruim",
            "Os indicadores de reputação",
          ],
          minutes: 7,
          content: `## Duas coisas diferentes

- **Avaliação do produto:** as estrelas e os comentários que aparecem no anúncio.
- **Reputação do vendedor:** a nota que o marketplace dá para a sua **operação**.

As duas influenciam as vendas, mas a reputação é a que mais pesa na posição dos anúncios e nos benefícios da conta.

## Os indicadores de reputação

Os nomes mudam de um marketplace para outro, mas a medição gira em torno de:

| Indicador | O que conta |
| --- | --- |
| **Reclamações** | Vendas em que o comprador abriu uma reclamação |
| **Cancelamentos** | Vendas canceladas por responsabilidade do vendedor |
| **Atrasos na postagem** | Pedidos postados depois da data limite |
| **Tempo de resposta** | Rapidez nas perguntas e nas mensagens |
| **Avaliação média** | A nota dada pelos compradores |

O resultado aparece como um **nível**, mostrado por cores, notas ou selos. Níveis mais altos trazem vantagens: **mais exposição, frete com desconto** e selos de destaque. Níveis baixos trazem restrições e, no limite, a suspensão da conta.

Os indicadores são **porcentagens** sobre as vendas de um período. Com poucas vendas, **um único problema pesa muito**: uma reclamação em 10 vendas é 10%. Por isso o começo exige tanto cuidado.

## Como conseguir boas avaliações

1. **O produto é igual ao anúncio.** A maior parte das avaliações ruins vem de expectativa não atendida.
2. **Embalagem cuidadosa.** O cliente avalia o que vê ao abrir.
3. **Postagem rápida.** Chegar antes do prometido surpreende.
4. **Um bilhete de agradecimento** dentro do pacote, se o fornecedor aceitar incluir.
5. **Mensagem cordial** depois da entrega, colocando-se à disposição.

**Não ofereça nada em troca de avaliação positiva** — desconto, brinde ou reembolso. É proibido pelas regras e engana os próximos compradores.

## O que fazer com uma avaliação ruim

1. **Leia com calma.** Tem fundamento?
2. **Responda em público, com educação.** A resposta é lida por quem está decidindo a compra. Agradeça, peça desculpas e diga como vai resolver.
3. **Resolva de verdade** com o cliente, pelo canal de mensagens.
4. **Peça a exclusão só quando a avaliação violar as regras**: ofensas, dados pessoais ou reclamação sobre a transportadora em vez do produto, conforme a política do marketplace.
5. **Corrija a causa.** Três avaliações falando do mesmo defeito são um recado: ajuste o anúncio, troque o fornecedor ou tire o produto.

Um exemplo de resposta:

> Olá, [nome]! Sentimos muito pelo ocorrido. Isso não é o padrão dos nossos envios. Já entramos em contato pelas mensagens para resolver da melhor forma. Obrigado por nos avisar.

## Avaliações são pesquisa de graça

Leia as avaliações dos seus produtos **e as dos concorrentes**. Elas dizem:

- O que o cliente mais valoriza → destaque nas fotos e no título
- O que mais decepciona → resolva ou avise no anúncio
- Quais dúvidas ficam → acrescente à descrição

## Recuperando uma reputação ruim

Como os indicadores consideram um período, **eles melhoram com o tempo** se você parar de errar e continuar vendendo bem. O caminho: reduzir a quantidade de anúncios, manter só o que você entrega com segurança e não acumular novos problemas.

> Reputação não se compra nem se acelera. Ela é a soma de **cada pedido entregue como prometido**.
`,
          tasks: [
            "Encontre na central do vendedor os seus indicadores de reputação",
            "Leia 20 avaliações de concorrentes e anote os elogios e as reclamações mais comuns",
            "Escreva a sua resposta padrão para uma avaliação negativa",
          ],
        },
        {
          title: "Anúncios patrocinados dentro do marketplace",
          summary: "Quando e como pagar para aparecer em destaque.",
          learn: [
            "Como funcionam os anúncios patrocinados",
            "Quanto investir para começar",
            "Medindo se o patrocínio está dando lucro",
          ],
          minutes: 8,
          content: `## O que são

Os marketplaces têm um sistema próprio de publicidade. Você paga para o seu anúncio aparecer **nas primeiras posições da busca** e nas páginas de produtos parecidos, com uma marcação de "patrocinado".

## Como funcionam

- **Você paga por clique**, não por exibição nem por venda.
- O valor do clique é definido em um **leilão** entre os vendedores que disputam a mesma busca.
- Você define um **orçamento diário**. Quando ele acaba, o anúncio volta à posição normal.
- Existem dois modos:

| Modo | Como funciona | Para quem |
| --- | --- | --- |
| **Automático** | O marketplace escolhe as buscas e os lances | Quem está começando |
| **Manual** | Você escolhe as palavras e quanto paga por clique | Quem já tem dados |

## Quando vale a pena

O patrocínio **acelera o que já funciona**. Ele não conserta um anúncio fraco.

**Vale quando:**

- O anúncio tem boas fotos, ficha completa e preço competitivo
- Há **estoque garantido** no fornecedor
- O anúncio é novo e precisa das primeiras vendas
- Chega uma data de muito movimento

**Não vale quando:**

- A margem do produto é muito apertada
- O anúncio tem avaliações ruins
- O fornecedor pode ficar sem estoque

## Quanto investir para começar

- Escolha **de 3 a 5 anúncios**: os seus melhores.
- Comece com um **orçamento diário pequeno** e o modo automático.
- Deixe rodar **de 7 a 14 dias** antes de tirar conclusões.

## A conta que diz se dá lucro

A métrica principal é o **custo de publicidade sobre as vendas**, conhecido pela sigla **ACOS**:

**ACOS = gasto com anúncios ÷ vendas geradas pelos anúncios**

Se você gastou R$ 50 e os anúncios geraram R$ 500 em vendas, o ACOS é de **10%**.

Para saber se isso é bom, compare com a **sua margem antes do anúncio**:

| Situação | Resultado |
| --- | --- |
| ACOS **menor** do que a margem | Lucro |
| ACOS **igual** à margem | Empate |
| ACOS **maior** do que a margem | Prejuízo |

**Exemplo:** se, depois de produto, comissão, frete e impostos, sobram **25%** do preço, o seu ACOS máximo é 25%. Com um ACOS de 10%, sobram 15% de lucro nas vendas patrocinadas.

O **ROAS** é a mesma informação, vista ao contrário: vendas ÷ gasto. Um ACOS de 10% equivale a um ROAS de 10.

## Ajustando

| O que você vê | O que fazer |
| --- | --- |
| Muitos cliques e nenhuma venda | Tirar o anúncio da campanha e rever foto, preço e descrição |
| ACOS acima da margem | Reduzir o lance ou o orçamento desse anúncio |
| ACOS bem abaixo da margem | Aumentar o orçamento aos poucos |
| Poucas exibições | Aumentar um pouco o lance |

No modo manual, veja **quais buscas** geraram vendas e concentre o investimento nelas.

## O efeito que não aparece no relatório

As vendas patrocinadas **contam para o histórico** do anúncio. Com mais vendas e avaliações, ele sobe também na busca normal, que é gratuita. Por isso, um ACOS de empate pode valer a pena por algumas semanas em um anúncio novo — desde que seja uma decisão, com data para reavaliar.

## Acompanhe o total

Além do ACOS, olhe **quanto os anúncios representam de todas as vendas da conta**. Se essa parte só cresce, você está ficando dependente de pagar para vender. O objetivo é o contrário: usar o patrocínio para **fortalecer as vendas que vêm de graça**.
`,
          tasks: [
            "Calcule a sua margem antes do anúncio: ela é o seu ACOS máximo",
            "Crie uma campanha automática com os seus 3 melhores anúncios e um orçamento diário pequeno",
            "Depois de 7 dias, compare o ACOS de cada anúncio com a margem e ajuste",
          ],
          quiz: [
            {
              text: "Você gastou R$ 40 em anúncios patrocinados, que geraram R$ 400 em vendas. Qual é o ACOS?",
              explanation: "ACOS = gasto ÷ vendas geradas = 40 ÷ 400 = 10%.",
              options: ["10%", "40%", "4%"],
            },
            {
              text: "A sua margem antes do anúncio é de 20% e o ACOS está em 30%. O que isso significa?",
              explanation:
                "Quando o custo de publicidade passa da margem, as vendas patrocinadas dão prejuízo.",
              options: [
                "As vendas patrocinadas estão dando prejuízo",
                "As vendas patrocinadas dão 10% de lucro",
                "O anúncio está no ponto ideal",
              ],
            },
            {
              text: "Por que os primeiros pedidos de uma conta nova exigem tanto cuidado?",
              explanation:
                "Os indicadores são porcentagens. Com poucas vendas, uma única reclamação representa uma parte grande do total.",
              options: [
                "Porque, com poucas vendas, um único problema pesa muito na reputação",
                "Porque os primeiros pedidos não pagam comissão",
                "Porque o marketplace não mede a reputação de contas novas",
              ],
            },
          ],
        },
      ],
    },
  ],
};
