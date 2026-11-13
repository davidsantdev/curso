import type { TrackSeed } from "./types";

export const PRODUTOS_E_FORNECEDORES: TrackSeed = {
  slug: "produtos-e-fornecedores",
  title: "Produtos e fornecedores",
  description:
    "Descubra o que vender e de quem comprar: público certo, produtos que estão vendendo, testes antes de investir e fornecedores confiáveis.",
  level: "INICIANTE",
  icon: "package-search",
  color: "sun",
  modules: [
    {
      title: "Escolhendo o que vender",
      description: "Público, produtos com procura e a conta que mostra se vale a pena.",
      lessons: [
        {
          title: "Nicho: para quem você vai vender",
          summary: "Por que vender \"de tudo\" costuma dar errado.",
          learn: [
            "O que é um nicho e como escolher o seu",
            "Critérios: procura, lucro e concorrência",
            "Exemplos de nichos bons para começar",
          ],
          minutes: 8,
          content: `## O que é um nicho

Nicho é um **grupo de pessoas com um interesse ou uma necessidade em comum**: quem tem cachorro, quem treina em casa, quem acabou de ter um bebê, quem gosta de pescar.

Escolher um nicho é decidir **para quem** você vende antes de decidir **o que** vende.

## Por que vender "de tudo" costuma dar errado

- **O anúncio fica genérico.** Quem fala com todo mundo não chama a atenção de ninguém.
- **A loja não passa confiança.** Uma loja que vende coleira, fone de ouvido e panela parece improvisada.
- **Você não vende de novo.** Quem comprou um bebedouro para gato pode comprar um arranhador. Quem comprou "qualquer coisa" não volta.

## Os 3 critérios para escolher

| Critério | A pergunta | Como conferir |
| --- | --- | --- |
| **Procura** | Tem gente comprando isso hoje? | Produtos com muitas vendas e avaliações nos grandes sites de compra; buscas estáveis ou subindo no Google Trends |
| **Lucro** | O preço deixa sobrar dinheiro? | Produtos vendidos entre R$ 60 e R$ 250 costumam pagar o anúncio e ainda sobrar |
| **Concorrência** | Dá para se diferenciar? | Se já existe gente vendendo, ótimo: a procura é real. O problema é só quando todos vendem o mesmo produto pelo mesmo preço |

## Nichos bons para começar

- **Pets** (acessórios, brinquedos, higiene)
- **Casa e organização**
- **Exercício em casa**
- **Carro e moto** (acessórios)
- **Hobbies**: pesca, camping, jardinagem, artesanato

Eles têm em comum: público apaixonado, compra repetida e produtos leves.

## O que evitar no começo

- **Produtos controlados**: suplementos, cosméticos, remédios e itens que exigem certificação (muitos eletrônicos e brinquedos).
- **Produtos de marca famosa e réplicas.** Vender imitação é ilegal e derruba a sua conta de anúncios.
- **Itens grandes ou frágeis**: o frete come o lucro e as trocas aumentam.
- **Roupas e calçados com muitos tamanhos**: a troca por tamanho errado é frequente.

> **Dica:** prefira um nicho que você conhece ou tem curiosidade de conhecer. Você vai escrever, gravar e responder sobre ele todos os dias.
`,
          tasks: [
            "Liste 3 nichos que você conhece ou tem interesse",
            "Dê uma nota de 1 a 5 para procura, lucro e concorrência de cada um",
            "Escolha o nicho com a maior soma e escreva em uma frase quem é o seu cliente",
          ],
        },
        {
          title: "Onde encontrar produtos que estão vendendo",
          summary: "As fontes que mostram o que o público já está comprando.",
          learn: [
            "Como pesquisar tendências em marketplaces e redes sociais",
            "Sinais de que um produto está em alta",
            "Como montar a sua lista de produtos candidatos",
          ],
          minutes: 10,
          content: `## Não tente adivinhar: observe

Você não precisa inventar um produto. Precisa **encontrar o que as pessoas já estão comprando** e vender melhor: com uma página mais clara, um vídeo melhor ou um atendimento mais atencioso.

## Onde pesquisar

**1. Grandes sites de compra (marketplaces)**

- Abra a lista de **mais vendidos** da categoria do seu nicho.
- Em sites de fornecedores de fora, ordene os resultados por **número de pedidos**.
- Leia as avaliações: elas mostram o que o cliente ama e do que reclama.

**2. Redes sociais**

- No TikTok e no Instagram, busque pelo nicho e por termos como "achadinhos" e "comprei e amei".
- Observe os comentários. Muita gente perguntando **"onde compra?"** é um ótimo sinal.

**3. Bibliotecas de anúncios**

- A **Biblioteca de Anúncios da Meta** mostra todos os anúncios ativos no Facebook e no Instagram. Busque por palavras do seu nicho.
- Um anúncio que está no ar **há várias semanas** provavelmente dá lucro: ninguém paga por muito tempo um anúncio que dá prejuízo.

**4. Google Trends**

- Mostra se a procura por um termo está subindo, caindo ou se só aparece em uma época do ano.

## Sinais de que um produto está em alta

- Muitos pedidos e **avaliações recentes**
- Vários vendedores anunciando, mas com páginas e vídeos fracos
- Resolve um **problema claro** ou causa um "uau" em poucos segundos de vídeo
- É difícil de encontrar em loja de bairro

## O perfil do produto ideal para vender sem estoque

| Característica | Por quê |
| --- | --- |
| Preço de venda entre R$ 60 e R$ 250 | Paga o anúncio e ainda sobra |
| Leve e pequeno | Frete barato e menos avarias |
| Custa no máximo um terço do preço de venda | Deixa espaço para taxas e anúncios |
| Fácil de mostrar em vídeo | O anúncio se explica sozinho |

## Monte a sua lista

Crie uma planilha simples com as colunas: **produto, link do fornecedor, custo com frete, preço dos concorrentes, sinais que você viu** e **observações**. Anote tudo que parecer interessante — você filtra depois.
`,
          tasks: [
            "Monte uma planilha com 10 produtos candidatos do seu nicho",
            "Anote o custo no fornecedor e o preço de pelo menos 2 concorrentes para cada um",
            "Marque os 3 produtos com mais sinais de alta",
          ],
        },
        {
          title: "Testando um produto antes de investir",
          summary: "Testes baratos para não apostar no escuro.",
          learn: [
            "Como medir o interesse antes de gastar com anúncios",
            "O que observar nos concorrentes",
            "Quando desistir de um produto sem perder dinheiro",
          ],
          minutes: 9,
          content: `## Teste antes, invista depois

Todo produto é uma **hipótese** até alguém comprar. O seu trabalho é descobrir se ela é verdadeira gastando o mínimo possível.

## Testes que custam pouco ou nada

1. **Raio-x dos concorrentes.** Quem vende esse produto? Por quanto? Há quanto tempo? Se três lojas diferentes anunciam há meses, existe mercado.
2. **Leitura das avaliações negativas.** Os defeitos apontados pelos clientes são o seu mapa: escolha um fornecedor que não tenha o problema, ou avise na página o que os outros escondem.
3. **Procura ao longo do ano.** No Google Trends, veja se o interesse é estável, crescente ou de uma época só (ventilador vende no verão, não em julho).
4. **Vídeos sem anúncio.** Publique de 3 a 5 vídeos curtos mostrando o produto. Comentários como "quero" e "onde compra?" valem mais do que curtidas.
5. **Teste pago pequeno.** Só depois dos passos acima, anuncie com um valor baixo e com **limite definido antes de começar**.

## O que observar nos concorrentes

| Item | O que anotar |
| --- | --- |
| Preço e frete | Quanto o cliente paga no total |
| Prazo de entrega | Você consegue igualar ou ser honesto sobre a diferença? |
| Fotos e vídeos | Dá para fazer melhor? |
| Avaliações | Quantas, quão recentes e quais reclamações se repetem |

## A regra para desistir sem perder dinheiro

Decida o limite **antes** de anunciar, com a cabeça fria:

> Se eu gastar **3 vezes o lucro de uma venda** em anúncios e não vender nada, eu pauso e reviso.

**Exemplo:** se cada venda deixa R$ 40 de lucro antes do anúncio, o limite do teste é R$ 120. Chegou lá sem nenhuma venda? Pause. Antes de descartar o produto, confira se o problema não está no vídeo, na página ou no preço.

## Erros comuns

- Julgar o produto com um único vídeo ruim
- Continuar gastando "porque agora vai"
- Testar cinco produtos ao mesmo tempo com pouco dinheiro em cada um
`,
          tasks: [
            "Escolha 1 produto da sua lista e faça o raio-x de 3 concorrentes",
            "Leia 20 avaliações negativas e anote as 3 reclamações que mais se repetem",
            "Escreva o seu limite de teste: quanto vai gastar antes de pausar",
          ],
        },
        {
          title: "Preço, lucro e ponto de equilíbrio",
          summary: "A conta que mostra se o produto vale a pena.",
          learn: [
            "Como calcular o preço de venda ideal",
            "O lucro mínimo para anunciar com segurança",
            "Usando a calculadora de margem da plataforma",
          ],
          minutes: 8,
          content: `## A conta que vem antes de tudo

Antes de criar a página ou gravar um vídeo, faça esta conta. Ela diz se o produto **tem chance** de dar lucro.

## Passo a passo com um exemplo

Você pensa em vender uma luminária por **R$ 129**.

| Item | Valor |
| --- | --- |
| Preço de venda | R$ 129,00 |
| Produto + frete do fornecedor | − R$ 48,00 |
| Taxa do meio de pagamento (5%) | − R$ 6,45 |
| Impostos (exemplo) | − R$ 5,00 |
| **Sobra antes do anúncio** | **R$ 69,55** |

Esses **R$ 69,55** são o máximo que você pode gastar em anúncios para conseguir **uma** venda sem ter prejuízo. Esse número tem nome: **custo por venda de equilíbrio**.

- Gastou R$ 40 em anúncio para vender uma luminária? Lucro de R$ 29,55.
- Gastou R$ 80? Prejuízo de R$ 10,45.

## Outra forma de olhar: retorno do anúncio

Divida o preço pela sobra: 129 ÷ 69,55 = **1,85**.

Isso quer dizer que cada R$ 1 investido em anúncio precisa trazer pelo menos R$ 1,85 em vendas para você não perder dinheiro. As plataformas de anúncio chamam esse retorno de **ROAS** — você vai usar esse número nas trilhas de anúncios.

## Como definir o preço

1. Veja quanto os concorrentes cobram (preço **com** frete).
2. Comece pelo preço que deixa a sobra antes do anúncio em **pelo menos metade** do valor de venda.
3. Prefira embutir o frete e anunciar **"frete grátis"**: o cliente desiste menos.
4. Use preços como R$ 97 ou R$ 129,90 — são os que o público está acostumado a ver.

## O mínimo para anunciar com segurança

- Sobra antes do anúncio de **R$ 40 ou mais** por venda.
- Produtos muito baratos (abaixo de R$ 50) quase nunca pagam o custo do anúncio. Para eles, o caminho é vender em kits ou em marketplaces.

> Abra **Ferramentas → Calculadora de margem**, preencha os seus números e guarde o resultado. Você vai consultar esse valor toda vez que olhar uma campanha.
`,
          tasks: [
            "Calcule a sobra antes do anúncio dos seus 3 melhores produtos",
            "Anote o custo por venda de equilíbrio de cada um",
            "Descarte os produtos em que a sobra fica abaixo de R$ 40",
          ],
          quiz: [
            {
              text: "Um produto é vendido por R$ 100 e, depois de pagar fornecedor, taxas e impostos, sobram R$ 45. O que esse valor representa?",
              explanation:
                "É o máximo que você pode gastar em anúncios para fazer uma venda sem ter prejuízo.",
              options: [
                "O máximo que dá para gastar em anúncio por venda sem ter prejuízo",
                "O lucro garantido de cada venda",
                "O valor que o fornecedor recebe",
              ],
            },
            {
              text: "Qual é a melhor regra para encerrar o teste de um produto?",
              explanation:
                "Com o limite definido antes, você não decide no impulso quando o teste vai mal.",
              options: [
                "Definir antes um limite de gasto e pausar ao atingi-lo sem vendas",
                "Continuar anunciando até a primeira venda aparecer",
                "Parar no primeiro dia sem vendas, sempre",
              ],
            },
            {
              text: "Por que produtos muito baratos são difíceis de vender com anúncios?",
              explanation:
                "A sobra por venda é pequena e não cobre o que se gasta para conseguir cada cliente.",
              options: [
                "Porque a sobra por venda não cobre o custo do anúncio",
                "Porque as plataformas proíbem anunciar produtos baratos",
                "Porque ninguém procura produtos baratos",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Fornecedores",
      description: "Encontre, avalie e teste quem vai entregar os seus pedidos.",
      lessons: [
        {
          title: "Onde encontrar fornecedores confiáveis",
          summary: "Canais de busca e os primeiros filtros.",
          learn: [
            "Fornecedores no Brasil e de fora: onde procurar",
            "Como reconhecer um fornecedor sério",
            "Perguntas para fazer antes de fechar",
          ],
          minutes: 9,
          content: `## Onde procurar no Brasil

- **Fornecedores que já trabalham com envio pedido a pedido.** Muitas distribuidoras e fábricas têm um programa para lojistas: você vende, eles enviam ao seu cliente. Busque pelo nome do produto + "fornecedor dropshipping" e confira cada resultado com os filtros desta aula.
- **Atacadistas e polos de produção.** Regiões conhecidas por um tipo de produto (moda, calçados, semijoias, utilidades) concentram fornecedores abertos a negociar.
- **Feiras e eventos do setor.** Bons para conhecer o produto ao vivo e negociar direto com o dono.
- **A embalagem do concorrente.** Muitas vezes o nome do fabricante está na caixa do produto.

## Onde procurar fora do país

- **Grandes sites internacionais de varejo e atacado**, que reúnem milhares de fabricantes. Dá para comprar uma unidade por vez, sem pedido mínimo.
- **Agentes de compra**: empresas que compram, conferem a qualidade e enviam os pedidos por você. Costumam valer a pena quando as vendas ficam frequentes.

## Como reconhecer um fornecedor sério

- **CNPJ ativo** (consulte no site da Receita Federal) e endereço que existe
- **Tempo de mercado** e avaliações de outros lojistas
- **Responde rápido** e com clareza
- **Envia nota fiscal** e código de rastreio
- **Política de troca e defeito por escrito**
- Mostra o catálogo e os preços **antes** de cobrar qualquer coisa

## Sinais de alerta

- "Lista de fornecedores" vendida como segredo: quase sempre são contatos públicos e desatualizados
- Taxa de adesão alta para "liberar o catálogo"
- Preço muito abaixo de todos os outros
- Pressa para você pagar e nenhuma resposta sobre trocas

## Perguntas para fazer antes de fechar

1. Em quanto tempo o pedido é postado depois do pagamento?
2. Por quais transportadoras vocês enviam? O rastreio é enviado automaticamente?
3. O pacote vai **sem propaganda e sem o preço** que eu paguei?
4. A nota fiscal sai em nome de quem?
5. Como funcionam trocas e produtos com defeito? Quem paga o frete de volta?
6. Como eu fico sabendo quando um produto acaba no estoque?
7. Existe pedido mínimo ou mensalidade?

> Guarde as respostas por escrito (e-mail ou WhatsApp). Elas viram o seu "contrato" no dia a dia.
`,
          tasks: [
            "Encontre 3 fornecedores para o seu produto principal",
            "Envie as 7 perguntas para cada um e anote quanto tempo levaram para responder",
            "Consulte o CNPJ dos fornecedores brasileiros",
          ],
        },
        {
          title: "Avaliando prazo, qualidade e reputação",
          summary: "Como evitar dor de cabeça com entregas.",
          learn: [
            "Como checar avaliações e histórico",
            "Prazos de entrega: o que é aceitável",
            "Como negociar condições melhores",
          ],
          minutes: 8,
          content: `## Reputação: confira em mais de um lugar

**Fornecedor brasileiro**

- Busque o nome em sites de reclamação e veja **como ele responde**, não só a nota.
- Leia as avaliações no Google e os comentários nas redes sociais.
- Pergunte se pode falar com um lojista que já compra dele.

**Fornecedor em site internacional**

| O que olhar | Referência |
| --- | --- |
| Nota da loja | 4,7 ou mais |
| Tempo de loja | Mais de 1 ano |
| Pedidos do produto | Centenas ou milhares |
| Avaliações com foto | Mostram o produto real |
| Prazo de envio declarado | Quanto menor, melhor |

## Prazos: o que é aceitável

- **Fornecedor nacional:** postagem em até 2 dias úteis e entrega entre 3 e 10 dias úteis, dependendo da região.
- **Fornecedor de fora:** de 10 a 25 dias nas linhas de envio mais rápidas, podendo passar de 40 nas mais baratas.

O prazo em si não é o problema. O problema é **prometer um prazo e não cumprir**. Informe na loja o prazo real, com folga.

## Qualidade

- Compare as fotos do anúncio com as fotos das avaliações.
- Desconfie de descrição vaga: peça medidas, peso e material.
- Faça o pedido de teste (é o assunto da próxima aula).

## Como negociar

No primeiro contato você ainda não tem volume, então negocie o que não custa nada ao fornecedor:

- Fotos e vídeos em boa qualidade
- Embalagem sem propaganda
- Aviso antes de o estoque acabar

Depois de algumas dezenas de pedidos, peça:

- **Desconto por volume**
- **Prioridade** no envio dos seus pedidos
- Condições melhores de troca

## Tenha sempre um reserva

Fornecedor fica sem estoque, muda preço e atrasa. Para cada produto importante, tenha **um segundo fornecedor já avaliado**. No dia em que o principal falhar, você troca sem parar de vender.
`,
          tasks: [
            "Confira a reputação dos seus 3 fornecedores em pelo menos 2 fontes",
            "Anote o prazo de postagem e o prazo total de cada um",
            "Defina o fornecedor principal e o reserva",
          ],
        },
        {
          title: "Pedido de teste: compre antes de vender",
          summary: "Seja o seu próprio cliente e avalie a experiência.",
          learn: [
            "O que observar no pedido de teste",
            "Como usar o pedido para fazer fotos e vídeos",
            "Quando trocar de fornecedor",
          ],
          minutes: 6,
          content: `## Por que comprar antes de vender

O pedido de teste custa o preço de uma unidade e evita os problemas mais caros: produto diferente da foto, embalagem ruim e prazo que não se cumpre. **Compre como se fosse um cliente** e mande entregar na sua casa.

## O que observar

| Etapa | Pergunta |
| --- | --- |
| Depois do pagamento | Em quanto tempo o pedido foi postado? |
| Rastreio | O código chegou sozinho? Funcionou? |
| Entrega | Chegou dentro do prazo prometido? |
| Embalagem | Protege bem? Veio com propaganda ou preço do fornecedor? |
| Produto | É igual às fotos? O material, o tamanho e o acabamento são bons? |
| Uso | Funciona como prometido depois de alguns dias? |

Anote tudo, com datas. Esses números vão para a sua página de produto: prazo real, medidas reais, o que vem na caixa.

## Use o pedido para criar o seu material

Fotos e vídeos **feitos por você** são a maior diferença entre a sua loja e as outras que usam as mesmas imagens do fornecedor.

- Grave a abertura da caixa
- Mostre o produto **em uso**, com as mãos e em um ambiente real
- Fotografe perto de uma janela, com fundo simples
- Faça um "antes e depois" verdadeiro, se o produto permitir
- Registre detalhes: textura, tamanho ao lado de um objeto conhecido

## Quando trocar de fornecedor

- Atrasou no pedido de teste **e** não avisou
- O produto veio diferente do anunciado
- Demora dias para responder
- Avaliações recentes pioraram

Um único deslize pode acontecer. Padrão de falhas, não.

> Com o teste aprovado, você tem o que precisa para a próxima etapa: montar a loja. Siga para a trilha **Criar sua loja virtual**.
`,
          tasks: [
            "Faça o pedido de teste do seu produto principal",
            "Preencha a tabela de avaliação quando o pedido chegar",
            "Grave pelo menos 3 vídeos curtos e tire 6 fotos do produto",
          ],
          quiz: [
            {
              text: "Qual é o principal motivo para fazer um pedido de teste?",
              explanation:
                "Você vive a experiência do cliente e descobre problemas de prazo, embalagem e qualidade antes de vender.",
              options: [
                "Conferir prazo, embalagem e qualidade antes de vender para clientes",
                "Ganhar desconto com o fornecedor",
                "Formar um pequeno estoque em casa",
              ],
            },
            {
              text: "Um fornecedor tem preço ótimo, mas cobra uma taxa alta para mostrar o catálogo e tem pressa para você pagar. O que fazer?",
              explanation:
                "Fornecedor sério mostra produtos e preços antes de cobrar. Pressa e taxa de adesão são sinais de alerta.",
              options: [
                "Tratar como sinal de alerta e procurar outro fornecedor",
                "Pagar logo para não perder a oportunidade",
                "Pagar metade da taxa para testar",
              ],
            },
          ],
        },
      ],
    },
  ],
};
