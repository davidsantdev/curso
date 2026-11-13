import type { TrackSeed } from "./types";

export const ANUNCIOS_GOOGLE: TrackSeed = {
  slug: "anuncios-google",
  title: "Anúncios no Google (Google Ads)",
  description:
    "Apareça para quem já está procurando o seu produto: anúncios na pesquisa e no Shopping, palavras-chave e acompanhamento das vendas.",
  level: "INTERMEDIARIO",
  icon: "search",
  color: "lime",
  modules: [
    {
      title: "Fundamentos",
      description: "Como funciona e a conta pronta para medir vendas.",
      lessons: [
        {
          title: "Como funcionam os anúncios no Google",
          summary: "Por que quem pesquisa já está perto de comprar.",
          learn: [
            "Pesquisa, Shopping e YouTube: o que é cada um",
            "Como funciona o leilão das palavras-chave",
            "Quando o Google é melhor que as redes sociais",
          ],
          minutes: 8,
          content: `## A diferença está na intenção

Nas redes sociais, você **interrompe** alguém que estava vendo vídeos. No Google, a pessoa **foi atrás**: quem digita "comprar bebedouro para gato" já decidiu que quer um. Falta só escolher de quem.

Por isso, o visitante que vem do Google costuma chegar **mais perto da compra**.

## Onde os anúncios aparecem

| Tipo | Como é | Para que serve |
| --- | --- | --- |
| **Pesquisa** | Anúncio de texto no topo dos resultados | Aparecer para quem busca por palavras específicas |
| **Shopping** | Foto, nome, preço e loja | Mostrar o produto antes mesmo do clique |
| **YouTube** | Vídeo antes ou durante outros vídeos | Apresentar o produto em vídeo |
| **Display** | Banners em sites e aplicativos | Lembrar quem já visitou a loja |
| **Performance Max** | Uma campanha automática que usa todos os anteriores | Deixar o Google distribuir o orçamento |

Para lojas, os dois primeiros são os mais importantes. Esta trilha se concentra neles.

## O leilão das palavras-chave

A cada pesquisa, o Google faz um leilão entre os anunciantes interessados naquelas palavras. A posição de cada um depende de:

1. **O lance:** quanto o anunciante aceita pagar por um clique
2. **A qualidade:** a chance de o anúncio ser clicado, o quanto ele combina com a busca e a experiência na página de destino
3. **Os complementos do anúncio:** links extras, preço, promoções

**Um anúncio muito relevante pode aparecer acima de um concorrente que paga mais.**

## Você paga pelo clique

Aparecer não custa nada: você só paga quando alguém **clica**. O valor de cada clique varia conforme a concorrência pela palavra — de centavos a vários reais.

## Google ou redes sociais?

| Situação | Melhor caminho |
| --- | --- |
| As pessoas **já procuram** pelo produto ("capa de chuva para moto") | Google |
| O produto é **novidade** e ninguém sabe que existe | Redes sociais |
| O produto resolve um **problema que a pessoa pesquisa** ("como tirar pelo de gato do sofá") | Google |
| A venda depende de **ver o produto funcionando** | Redes sociais |
| Ticket mais alto, compra pensada | Google |

Muitas lojas usam os dois: as redes sociais para **apresentar** o produto e o Google para **capturar** quem saiu procurando por ele depois.

## O teste rápido

Antes de anunciar no Google, pesquise o seu produto como um cliente faria.

- **Aparecem anúncios?** Há procura e outros lojistas investindo.
- **Aparecem fotos com preço?** O Shopping funciona para essa categoria.
- **Qual é o preço dos concorrentes?** Se o seu for muito maior, o clique sai caro e a venda não vem.
`,
          tasks: [
            "Pesquise o seu produto no Google de 5 formas diferentes, como um cliente faria",
            "Anote quais buscas mostram anúncios de texto e quais mostram fotos com preço",
            "Compare o seu preço com o dos 3 primeiros anúncios",
          ],
        },
        {
          title: "Criando e configurando a conta",
          summary: "Conta de anúncios, pagamento e medição de vendas.",
          learn: [
            "Criando a conta do jeito certo",
            "Configurando a medição das vendas (conversões)",
            "Preparando o catálogo para o Shopping",
          ],
          minutes: 10,
          content: `## Criando a conta

1. Acesse o site do Google Ads com a **conta Google da loja**.
2. Durante o cadastro, o Google tenta levar você a criar uma campanha simplificada na hora. Procure a opção de **criar a conta sem campanha** ou de **mudar para o modo especialista**. É nele que ficam todos os controles.
3. Confirme **país: Brasil**, **moeda: real** e o **fuso horário** de São Paulo. Essas escolhas não podem ser alteradas depois.
4. Preencha os **dados de faturamento** com CPF ou CNPJ.
5. Cadastre a **forma de pagamento**: cartão de crédito, ou saldo adicionado por Pix ou boleto.

## Verificação do anunciante

O Google pede a confirmação da identidade de quem anuncia. Quando o aviso aparecer, envie os documentos solicitados dentro do prazo — sem isso, os anúncios são pausados.

## Medição das vendas (conversões)

No Google, uma venda registrada se chama **conversão**. Sem ela, você vê cliques e gastos, mas não sabe o que deu resultado.

**O caminho mais simples:**

1. Na sua plataforma de loja, abra a integração com o **Google** e conecte a conta de anúncios.
2. A integração instala a etiqueta do Google e cria a conversão de **compra**, com o **valor** de cada pedido.

**Se a sua plataforma não tiver integração:**

1. No Google Ads, abra **Metas → Conversões** e crie uma conversão do tipo **compra** para o site.
2. Siga as instruções para instalar a etiqueta. O suporte da plataforma de loja costuma ter um passo a passo.

## Conferindo

- Faça uma **compra de teste**.
- Em **Conversões**, o status deve mudar para algo como **"registrando conversões"** em até um dia.
- Confira se o **valor** veio certo e se a compra foi contada **uma vez**.

## Preparando o Shopping: o Merchant Center

Para aparecer com foto e preço, o Google precisa conhecer os seus produtos. Isso é feito no **Google Merchant Center**.

1. **Crie a conta** do Merchant Center com o mesmo e-mail.
2. **Informe os dados da loja:** nome, endereço e contato.
3. **Confirme que o site é seu.** A integração da plataforma faz isso sozinha.
4. **Configure frete e devolução** dentro do Merchant Center, iguais aos do site.
5. **Envie os produtos.** Com a integração, a lista (chamada de **feed**) é enviada e atualizada automaticamente.
6. **Vincule** o Merchant Center ao Google Ads.

Os produtos passam por uma análise, que pode levar alguns dias.

## O que o Google confere no seu site

Lojas incompletas são reprovadas ou suspensas. Antes de enviar, garanta que o site tem:

- **Contato** visível: e-mail e telefone ou WhatsApp
- **Endereço** e CPF ou CNPJ
- **Política de troca e devolução** clara
- **Prazos de entrega** reais
- **Preço e disponibilidade** iguais aos enviados no feed
- **Pagamento seguro** (cadeado no endereço)
`,
          tasks: [
            "Crie a conta do Google Ads no modo especialista, com moeda real",
            "Conecte a loja e confirme a conversão de compra com um pedido de teste",
            "Crie o Merchant Center, envie os produtos e vincule ao Google Ads",
          ],
          quiz: [
            {
              text: "Qual é a principal diferença entre anunciar no Google e nas redes sociais?",
              explanation:
                "No Google, a pessoa demonstra a intenção ao pesquisar. Nas redes, ela é apresentada a algo que não estava procurando.",
              options: [
                "No Google, a pessoa já está procurando o produto ou a solução",
                "No Google, os anúncios são sempre mais baratos",
                "Nas redes sociais, não é possível medir as vendas",
              ],
            },
            {
              text: "Nos anúncios da rede de pesquisa, quando você paga?",
              explanation: "A cobrança é feita por clique. Só aparecer nos resultados não gera custo.",
              options: [
                "Quando alguém clica no anúncio",
                "Cada vez que o anúncio aparece",
                "Somente quando a pessoa compra",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Campanhas",
      description: "Palavras-chave e as campanhas que mais vendem.",
      lessons: [
        {
          title: "Palavras-chave: o que o seu cliente digita",
          summary: "Encontre as buscas certas e evite as caras.",
          learn: [
            "Como pesquisar palavras-chave",
            "Os tipos de correspondência",
            "Palavras-chave negativas",
          ],
          minutes: 9,
          content: `## Pense na intenção por trás da busca

Nem toda pesquisa sobre o seu produto vem de alguém que quer comprar.

| Busca | Intenção | Vale anunciar? |
| --- | --- | --- |
| "comprar fonte para gato" | Comprar | **Sim** |
| "fonte para gato preço" | Comprar | **Sim** |
| "melhor fonte para gato" | Comparar | Sim, com cuidado |
| "como fazer fonte para gato" | Fazer em casa | **Não** |
| "fonte para gato faz mal?" | Tirar dúvida | Não |

Concentre o orçamento nas buscas com **intenção de compra**.

## Como encontrar palavras-chave

- **Planejador de palavras-chave** (dentro do Google Ads, em Ferramentas): mostra quantas pessoas buscam cada termo e uma estimativa do custo por clique.
- **Sugestões do próprio Google:** comece a digitar e veja como ele completa a frase.
- **"Pesquisas relacionadas"**, no fim da página de resultados.
- **As palavras dos seus clientes:** avaliações, perguntas e mensagens.

Monte uma lista com **de 10 a 20 termos** de compra para começar.

## Tipos de correspondência

A correspondência define o quanto a busca da pessoa precisa parecer com a sua palavra-chave.

| Tipo | Como se escreve | Quando o anúncio aparece |
| --- | --- | --- |
| **Ampla** | fonte para gato | Em buscas **relacionadas** ao tema, mesmo sem as palavras |
| **De frase** | "fonte para gato" | Em buscas que incluem o **sentido** da frase |
| **Exata** | [fonte para gato] | Em buscas com o **mesmo significado** |

**Para começar:** use **de frase** e **exata**. Você alcança menos gente, mas com controle. A correspondência ampla pode gastar o orçamento em buscas que não têm a ver com o produto — ela funciona melhor em contas que já têm histórico de vendas.

## Palavras-chave negativas

São os termos para os quais você **não** quer aparecer. Elas evitam cliques inúteis.

Uma lista inicial que serve para quase toda loja:

- grátis, gratuito
- usado, usada
- como fazer, caseiro, passo a passo
- conserto, assistência
- pdf, curso, vaga, emprego
- o que é, significado

Acrescente as específicas do seu produto: marcas que você não vende, modelos e materiais diferentes.

## O relatório que economiza dinheiro

O **relatório de termos de pesquisa** mostra o que as pessoas **realmente digitaram** antes de clicar no seu anúncio. Toda semana:

1. Abra o relatório.
2. Para cada termo sem relação com o produto → **adicione como negativo**.
3. Para cada termo bom que você não tinha → **adicione como palavra-chave**.

Nas primeiras semanas, esse hábito é o que mais reduz o gasto desperdiçado.
`,
          tasks: [
            "Liste 15 palavras-chave com intenção de compra para o seu produto",
            "Veja o volume e o custo estimado de cada uma no Planejador de palavras-chave",
            "Monte a sua lista inicial de palavras-chave negativas",
          ],
        },
        {
          title: "Campanha na pesquisa, passo a passo",
          summary: "Anúncios de texto para quem está procurando.",
          learn: [
            "Estrutura de campanha e grupos de anúncios",
            "Escrevendo anúncios de texto",
            "Lances e orçamento para começar",
          ],
          minutes: 11,
          content: `## A estrutura

| Nível | O que você decide |
| --- | --- |
| **Campanha** | Orçamento, região, idioma e estratégia de lances |
| **Grupo de anúncios** | Um conjunto de palavras-chave **do mesmo assunto** |
| **Anúncio** | Os títulos, as descrições e a página de destino |

**Regra de ouro:** cada grupo de anúncios trata de **um** assunto. Se as palavras são sobre "fonte para gato", o anúncio fala de fonte para gato e leva para a página da fonte para gato.

## Criando a campanha

1. Clique em **nova campanha** e escolha o objetivo **Vendas**.
2. Tipo de campanha: **Pesquisa**.
3. Em redes, **desmarque a Rede de Display**. Ela mistura públicos e confunde a leitura dos resultados.
4. **Localização:** Brasil ou os estados em que você entrega. Nas opções de local, escolha alcançar pessoas que **estão** na região, e não as que apenas demonstram interesse nela.
5. **Idioma:** português.
6. **Orçamento diário:** o valor do seu teste.
7. **Lances:** veja a seção abaixo.

## Criando o grupo de anúncios

- Dê o nome do assunto: "Fonte para gato".
- Adicione **de 5 a 15 palavras-chave** bem próximas, em correspondência **de frase** e **exata**.
- Adicione a sua lista de **negativas**.

## Escrevendo o anúncio

O formato padrão é o **anúncio responsivo de pesquisa**: você escreve vários títulos e descrições, e o Google combina os que funcionam melhor.

- **Títulos:** até 15, com no máximo 30 caracteres cada. Escreva pelo menos 8.
- **Descrições:** até 4, com no máximo 90 caracteres cada.

**O que colocar nos títulos**

- A **palavra-chave** principal: "Fonte para Gatos 2 Litros"
- Um **benefício**: "Água Sempre Limpa e Fresca"
- A **oferta**: "Frete Grátis para Todo o Brasil"
- As **condições**: "Em até 12x no Cartão"
- Uma **chamada**: "Compre Hoje com 7 Dias de Garantia"

**O que evitar:** letras maiúsculas em excesso, pontos de exclamação repetidos e promessas que a página não confirma.

## Complementos do anúncio

Chamados de **recursos**, eles aumentam o tamanho do anúncio sem custar mais:

- **Links adicionais** para outras páginas da loja
- **Frases de destaque:** "Envio em 24 h", "Troca fácil"
- **Preços** e **promoções**

Adicione pelo menos os dois primeiros.

## Lances e orçamento

- **Para começar sem histórico:** a estratégia **Maximizar cliques**, com um **limite de custo por clique**. Você junta dados gastando pouco.
- **Com vendas registradas:** mude para **Maximizar conversões**, e o Google passa a buscar quem compra.

Use o Planejador de palavras-chave para estimar o custo por clique e defina um orçamento diário que pague **pelo menos 10 a 20 cliques por dia**.

## Página de destino

Leve o clique para a **página do produto pesquisado**, nunca para a página inicial. O título da página deve repetir a ideia da busca.
`,
          tasks: [
            "Crie a campanha de Pesquisa com a Rede de Display desmarcada",
            "Monte 1 grupo de anúncios com 5 a 15 palavras-chave do mesmo assunto",
            "Escreva pelo menos 8 títulos e 3 descrições",
            "Adicione links adicionais e frases de destaque",
          ],
        },
        {
          title: "Campanha no Shopping",
          summary: "Mostre os seus produtos com foto e preço no Google.",
          learn: [
            "Como preparar o catálogo de produtos",
            "Configurando a campanha",
            "Cuidados com produtos reprovados",
          ],
          minutes: 10,
          content: `## Como o Shopping funciona

Os anúncios do Shopping mostram **foto, nome, preço e loja**. O cliente já sabe o que vai encontrar antes de clicar — por isso os cliques costumam ser de quem tem mais interesse.

A grande diferença: **não existem palavras-chave**. O Google lê as informações dos seus produtos e decide em quais buscas cada um aparece. Por isso, a qualidade do **feed** (a lista de produtos) é o que mais importa.

## O que cada produto precisa ter

| Informação | Dica |
| --- | --- |
| **Título** | É o campo mais importante. Coloque no início o que a pessoa busca |
| **Descrição** | Clara, com material, medidas e uso |
| **Imagem** | Fundo limpo, produto inteiro, sem texto nem logo por cima |
| **Preço e disponibilidade** | **Idênticos** aos do site |
| **Marca** | A marca do produto, se houver |
| **Código de barras (GTIN)** | Quando o produto tiver. Sem código, indique que ele não possui |
| **Categoria** | A mais específica possível |
| **Frete** | Configurado no Merchant Center |

## Um bom título

**Fórmula:** tipo de produto + característica principal + detalhe (tamanho, cor, material).

- Fraco: "Fonte Premium Top"
- Forte: "Fonte Bebedouro para Gatos 2 L Silenciosa com Filtro de Carvão"

## Dois tipos de campanha

| Tipo | Como funciona | Quando usar |
| --- | --- | --- |
| **Shopping padrão** | Você controla lances e pode adicionar negativas | Para começar, com poucos produtos e orçamento curto |
| **Performance Max** | O Google decide tudo e usa os produtos em todas as redes | Quando a conta já registra vendas com frequência |

## Configurando o Shopping padrão

1. Nova campanha → objetivo **Vendas** → tipo **Shopping**.
2. Selecione a conta do **Merchant Center**.
3. Escolha **campanha padrão**.
4. Defina o **orçamento diário** e um **lance por clique** baixo para começar.
5. **Localização:** Brasil.
6. Publique e acompanhe os **termos de pesquisa**, adicionando negativas toda semana.

## Produtos reprovados

No Merchant Center, a aba de produtos mostra o que foi aprovado, o que tem aviso e o que foi reprovado, com o motivo.

| Motivo | Como resolver |
| --- | --- |
| **Preço ou estoque diferente do site** | Manter a atualização automática do feed |
| **Imagem com texto ou marca d'água** | Trocar por uma imagem limpa |
| **Falta de código de barras** | Informar o código ou marcar que o produto não possui |
| **Produto de categoria restrita** | Consultar as políticas; alguns itens não podem ser anunciados |

## Suspensão da conta inteira

O motivo mais comum em lojas novas é o Google considerar que o site **não é transparente o suficiente**. Para evitar:

- Contato, endereço e CPF ou CNPJ **visíveis**
- Política de devolução completa
- **Prazo de entrega real**, inclusive quando o produto vem de fora do país
- Nenhuma promessa exagerada
- Avaliações verdadeiras

Se a conta for suspensa, corrija os pontos indicados e **peça uma revisão**. Os pedidos de revisão são limitados: só envie depois de corrigir tudo.
`,
          tasks: [
            "Reescreva o título dos seus produtos com a fórmula da aula",
            "Confira no Merchant Center se há produtos reprovados e corrija os motivos",
            "Crie uma campanha de Shopping padrão com lance baixo",
          ],
          quiz: [
            {
              text: "Qual busca tem a maior intenção de compra?",
              explanation:
                "Quem digita \"comprar\" já decidiu. As outras buscas são de quem quer fazer em casa ou tirar uma dúvida.",
              options: [
                "comprar fonte para gato",
                "como fazer fonte para gato",
                "fonte para gato faz mal?",
              ],
            },
            {
              text: "Para que servem as palavras-chave negativas?",
              explanation:
                "Elas bloqueiam buscas sem intenção de compra, como \"grátis\" ou \"como fazer\", evitando cliques inúteis.",
              options: [
                "Para impedir que o anúncio apareça em buscas que não interessam",
                "Para diminuir a nota de qualidade dos concorrentes",
                "Para aumentar o orçamento automaticamente",
              ],
            },
            {
              text: "No Shopping, o que define em quais buscas o seu produto aparece?",
              explanation:
                "O Shopping não usa palavras-chave. O Google lê os dados do feed, principalmente o título do produto.",
              options: [
                "As informações do produto no feed, principalmente o título",
                "A lista de palavras-chave da campanha",
                "A quantidade de seguidores da loja",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Otimização",
      description: "Ajustes semanais para gastar melhor.",
      lessons: [
        {
          title: "Lendo os resultados e otimizando",
          summary: "O que ajustar toda semana.",
          learn: [
            "As métricas principais no Google",
            "Como cortar buscas que não vendem",
            "Ajustando lances e orçamento",
          ],
          minutes: 8,
          content: `## As métricas principais

| Métrica | O que mostra |
| --- | --- |
| **Impressões** | Quantas vezes o anúncio apareceu |
| **Cliques** e **CTR** | Quantas pessoas clicaram e a proporção em relação às exibições |
| **CPC médio** | Quanto custou cada clique, em média |
| **Conversões** | Quantas vendas vieram dos anúncios |
| **Custo por conversão** | Quanto custou cada venda |
| **Valor de conversão ÷ custo** | O retorno: quanto voltou para cada real gasto |

Compare o **custo por conversão** com o seu **custo por venda de equilíbrio**. É essa comparação que diz se há lucro.

## Duas métricas próprias do Google

- **Índice de qualidade** (de 1 a 10, por palavra-chave): a nota que o Google dá para a combinação de palavra, anúncio e página. Nota baixa faz você pagar mais pelo mesmo clique.
- **Parcela de impressões:** de todas as vezes em que o anúncio poderia ter aparecido, em quantas apareceu. Se uma palavra dá lucro e a parcela é baixa, existe espaço para crescer.

## A rotina semanal, em 6 passos

**1. Termos de pesquisa**

Abra o relatório e negative tudo o que não tem a ver com o produto. É o passo que mais economiza.

**2. Palavras que gastam sem vender**

Pause as palavras-chave que já gastaram **de 2 a 3 vezes** o seu custo por venda de equilíbrio sem nenhuma conversão.

**3. Palavras que vendem**

Se o custo por conversão está abaixo do equilíbrio, aumente o lance ou o orçamento **aos poucos**.

**4. Anúncios**

O Google classifica a qualidade de cada anúncio responsivo. Troque os títulos com avaliação baixa por novas ideias.

**5. Página de destino**

Muitos cliques e poucas vendas apontam para a página: preço, prazo, fotos ou confiança.

**6. Shopping**

- Veja quais produtos concentram as vendas e garanta orçamento para eles.
- Corrija os produtos reprovados.
- Melhore os títulos dos produtos com muitas exibições e poucos cliques.

## Descobrindo onde está o problema

| O que você vê | Causa provável | O que fazer |
| --- | --- | --- |
| Poucas impressões | Lance baixo ou palavras pouco buscadas | Aumentar o lance, ampliar a lista |
| Muitas impressões, CTR baixo | Anúncio pouco relevante | Reescrever títulos, incluir a palavra-chave |
| Muitos cliques, sem vendas | Busca errada ou página fraca | Negativar termos, revisar a página |
| Vende, mas sem lucro | Clique caro para a margem | Reduzir lances, focar nas palavras mais específicas |

## Quando mudar a estratégia de lances

Com vendas registradas com frequência — cerca de **30 conversões por mês** é uma boa referência —, experimente as estratégias automáticas baseadas em conversão. Você informa o custo por venda ou o retorno desejado, e o Google ajusta os lances a cada leilão.

Antes disso, as estratégias automáticas têm poucos dados e oscilam muito.

## Não mexa em tudo ao mesmo tempo

Faça **uma ou duas mudanças por vez** e espere alguns dias para ver o efeito. Anote o que mudou e quando: o Google Ads guarda um histórico de alterações, mas a sua anotação com o **motivo** é o que ajuda a aprender.
`,
          tasks: [
            "Abra o relatório de termos de pesquisa e negative os termos sem relação com o produto",
            "Pause as palavras-chave que gastaram sem converter",
            "Marque um dia fixo da semana para a rotina de 6 passos",
          ],
          quiz: [
            {
              text: "O que é o índice de qualidade de uma palavra-chave?",
              explanation:
                "É a nota de 1 a 10 para a combinação de palavra, anúncio e página. Nota baixa encarece o clique.",
              options: [
                "A nota que o Google dá para a combinação de palavra-chave, anúncio e página",
                "A quantidade de vendas que a palavra-chave gerou",
                "O número de concorrentes que usam a mesma palavra",
              ],
            },
            {
              text: "O que o relatório de termos de pesquisa mostra?",
              explanation:
                "Ele lista as buscas reais que acionaram os anúncios, o que permite negativar as que não interessam.",
              options: [
                "O que as pessoas realmente digitaram antes de clicar no anúncio",
                "A lista de palavras-chave dos concorrentes",
                "Os produtos reprovados no Merchant Center",
              ],
            },
            {
              text: "Uma palavra-chave gastou três vezes o seu custo por venda de equilíbrio e não gerou nenhuma venda. O que fazer?",
              explanation:
                "Depois de um gasto relevante sem retorno, pausar evita continuar perdendo dinheiro com aquela busca.",
              options: [
                "Pausar a palavra-chave",
                "Aumentar o lance para aparecer mais",
                "Trocar para correspondência ampla",
              ],
            },
          ],
        },
      ],
    },
  ],
};
