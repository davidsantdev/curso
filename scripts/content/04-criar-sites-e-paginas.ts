import type { TrackSeed } from "./types";

export const CRIAR_SITES_E_PAGINAS: TrackSeed = {
  slug: "criar-sites-e-paginas",
  title: "Criar sites e páginas de venda",
  description:
    "Crie sites e páginas de venda para um produto só, sem programar: estrutura, textos que convencem, inteligência artificial e medição de resultados.",
  level: "INICIANTE",
  icon: "globe",
  color: "sky",
  modules: [
    {
      title: "Fundamentos",
      description: "O formato certo e as ferramentas para colocar um site no ar.",
      lessons: [
        {
          title: "Loja, site ou página de venda: quando usar cada um",
          summary: "Escolha o formato certo para o que você vende.",
          learn: [
            "A diferença entre loja, site e página de venda",
            "Quando uma página de produto único vende mais",
            "Exemplos de cada formato",
          ],
          minutes: 7,
          content: `## Três formatos, três objetivos

| Formato | O que é | Objetivo |
| --- | --- | --- |
| **Loja virtual** | Um catálogo com vários produtos, categorias e carrinho | O cliente navega e escolhe |
| **Site** | Páginas que apresentam uma marca ou um serviço | O cliente conhece e entra em contato |
| **Página de venda** | **Uma** página sobre **um** produto, com **um** botão | O cliente lê e compra |

A página de venda também é chamada de *landing page*, e a loja montada em torno de um único produto, de "loja de um produto só".

## Por que a página de venda vende tanto

Quem clica em um anúncio chega com a atenção curta e uma única pergunta: *"isso é para mim?"*. A página de venda responde só a isso. Não tem menu, nem outras categorias, nem distrações: tudo conduz ao mesmo botão.

## Quando usar cada um

**Página de venda**

- Você anuncia **um produto principal**
- O produto precisa de explicação ou demonstração
- A maior parte dos visitantes vem de anúncios

**Loja virtual**

- Você tem **vários produtos do mesmo nicho**
- Quer que o cliente compre mais de um item
- Quer construir uma marca e vender de novo para quem já comprou

**Site**

- Você presta um serviço ou quer apresentar a empresa
- A "venda" acontece por contato: WhatsApp, formulário, orçamento

## Dá para combinar

É muito comum ter uma **loja** e, dentro dela, uma **página especial** para o produto campeão. Os anúncios levam para a página; quem quiser ver mais encontra o restante da loja.

## Exemplos

- Um corretor de postura anunciado no Instagram → **página de venda**
- Uma loja de acessórios para gatos com 30 itens → **loja virtual**
- Um serviço de instalação de ar-condicionado → **site** com botão de WhatsApp

> Não existe formato melhor. Existe o que combina com **quantos produtos você tem** e **de onde vêm os visitantes**.
`,
          tasks: [
            "Defina qual formato combina com o que você vai vender",
            "Encontre 2 exemplos reais de página de venda e anote o que elas têm em comum",
          ],
        },
        {
          title: "Domínio, hospedagem e construtores sem código",
          summary: "As ferramentas para colocar um site no ar.",
          learn: [
            "O que é hospedagem e quando você precisa dela",
            "Construtores de site que não exigem programação",
            "Quanto custa manter um site no ar",
          ],
          minutes: 9,
          content: `## As três peças de qualquer site

- **Domínio:** o endereço (sualoja.com.br).
- **Hospedagem:** o "terreno" onde os arquivos do site ficam guardados e ligados 24 horas.
- **Construtor:** a ferramenta em que você monta as páginas arrastando blocos, sem escrever código.

## Quando você precisa contratar hospedagem

Na maioria dos casos, **não precisa**. Plataformas de loja e construtores de site já incluem a hospedagem no plano.

Você só contrata hospedagem à parte se escolher uma ferramenta instalada por conta própria, como o **WordPress**. Ele é gratuito e muito flexível, mas pede mais cuidado com atualizações e segurança.

## Tipos de construtor

| Tipo | Exemplos | Para quem |
| --- | --- | --- |
| **Editor da plataforma de loja** | O editor de temas da sua loja e os aplicativos de criação de página | Quem já tem loja e quer uma página especial para um produto |
| **Construtor de sites** | Wix, Hostinger, WordPress com Elementor | Sites e páginas com mais liberdade de visual |
| **Construtor de páginas de venda** | GreatPages, Leadlovers e similares | Páginas focadas em anúncios, que carregam rápido |

## O que observar ao escolher

1. **Modelos prontos** parecidos com o que você quer fazer.
2. **Versão para celular** fácil de ajustar.
3. **Velocidade**: páginas lentas perdem visitantes antes de carregar.
4. **Botão de compra**: a página consegue levar o cliente direto para o pagamento?
5. **Preço** e se a cobrança é em real.

## Quanto custa manter no ar

| Item | Faixa de preço |
| --- | --- |
| Domínio .com.br | Cerca de R$ 40 por ano |
| Construtor ou plataforma | De gratuito a cerca de R$ 100 por mês nos planos iniciais |
| Hospedagem (só se usar WordPress) | A partir de cerca de R$ 15 por mês |

São valores de referência: confira os preços atuais em cada serviço.

## Como a página recebe o pagamento

Uma página de venda fora da loja precisa de um **checkout**: a etapa em que o cliente paga. Você pode ligar o botão ao checkout da sua plataforma de loja ou a um link de pagamento. Isso é assunto da trilha *Pagamentos e checkout*.
`,
          tasks: [
            "Escolha o construtor que você vai usar e crie a conta",
            "Abra 3 modelos prontos e salve o que mais combina com o seu produto",
          ],
          quiz: [
            {
              text: "Você vai anunciar um único produto, que precisa de demonstração. Qual formato tende a vender mais?",
              explanation:
                "A página de venda trata de um produto só e conduz o visitante a um único botão, sem distrações.",
              options: [
                "Uma página de venda dedicada ao produto",
                "Um site institucional com várias páginas",
                "Uma loja com dezenas de categorias",
              ],
            },
            {
              text: "Quando é preciso contratar hospedagem separada?",
              explanation:
                "Plataformas de loja e construtores já incluem hospedagem. Só ferramentas instaladas por conta própria, como o WordPress, precisam dela.",
              options: [
                "Quando você usa uma ferramenta instalada por conta própria, como o WordPress",
                "Sempre, em qualquer plataforma",
                "Nunca, hospedagem não existe mais",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Página de venda na prática",
      description: "Estrutura, textos e montagem, passo a passo.",
      lessons: [
        {
          title: "A estrutura de uma página que vende",
          summary: "A ordem dos blocos que leva o visitante à compra.",
          learn: [
            "Título, promessa e prova",
            "Como apresentar oferta, bônus e garantia",
            "Botões de compra que funcionam",
          ],
          minutes: 10,
          content: `## A página segue a conversa de uma venda

Pense em um bom vendedor: ele chama a atenção, entende o problema, mostra a solução, prova que funciona, apresenta a oferta e tira as dúvidas. A página faz o mesmo, **nessa ordem**.

## Os 9 blocos

1. **Topo (primeira tela).** Título com a promessa principal, uma frase de apoio, foto ou vídeo do produto e o botão de compra. Muita gente decide aqui se continua.
2. **O problema.** Descreva a situação que o cliente vive, com as palavras dele.
3. **A solução.** Apresente o produto e mostre **como funciona**, de preferência em 3 passos.
4. **Benefícios.** O que muda na vida de quem usa.
5. **Prova.** Avaliações, fotos de clientes, demonstração em vídeo, números verdadeiros.
6. **A oferta.** O que o cliente recebe, o preço, o parcelamento e o frete.
7. **Garantia.** O prazo para devolver e receber o dinheiro de volta.
8. **Perguntas frequentes.** Prazo de entrega, formas de pagamento, tamanho, troca.
9. **Chamada final.** Um resumo em duas linhas e o botão, mais uma vez.

## O título

O título responde: *"o que eu ganho com isso?"*. Compare:

- Fraco: "Massageador elétrico modelo X200"
- Forte: "Alivie a tensão do pescoço em 15 minutos, sem sair de casa"

## A oferta

- Mostre **o que vem na caixa**.
- Deixe o **preço e as parcelas** bem visíveis.
- Um bônus só ajuda se for útil de verdade (um guia de uso, um acessório).
- Se houver desconto, ele precisa ser **real**: anunciar um preço "de" que nunca foi praticado é propaganda enganosa.

## O botão de compra

- **Um único objetivo**: todos os botões levam para a compra.
- Texto de ação: "Quero o meu", "Comprar com frete grátis".
- **Cor de destaque**, que não aparece em mais nada na página.
- Repita o botão depois do topo, da prova, da oferta e no final.
- No celular, ele precisa ser fácil de tocar com o polegar.

> Uma boa página não é a mais longa nem a mais curta: é a que responde a todas as dúvidas na ordem em que elas aparecem na cabeça do cliente.
`,
          tasks: [
            "Faça o rascunho dos 9 blocos da sua página em um documento",
            "Escreva 5 versões do título e escolha a mais clara",
            "Liste as 6 perguntas que um cliente faria antes de comprar",
          ],
        },
        {
          title: "Textos que convencem",
          summary: "Escreva para quem vai comprar, não para você.",
          learn: [
            "Como falar das dores e dos desejos do cliente",
            "Fórmulas simples de título",
            "Erros de texto que espantam o comprador",
          ],
          minutes: 9,
          content: `## Comece ouvindo o cliente

Os melhores textos de venda não são inventados: são **copiados da boca do cliente**. Antes de escrever, colete frases reais em:

- Avaliações do produto em grandes sites de compra
- Comentários em vídeos e anúncios de concorrentes
- Perguntas que as pessoas fazem em grupos e fóruns do nicho

Anote as palavras que se repetem. Se dez pessoas escrevem "minha lombar trava", o seu título não deve dizer "desconforto lombar".

## Dor e desejo

- **Dor:** o problema que a pessoa quer resolver. "Acordo com o pescoço travado."
- **Desejo:** como ela quer ficar. "Quero acordar disposta."

Um bom texto mostra que você entende a dor e pinta o desejo de forma realista.

## Fórmulas de título

| Fórmula | Exemplo |
| --- | --- |
| **[Resultado] sem [obstáculo]** | Cozinha organizada sem furar a parede |
| **Como [resultado] em [tempo]** | Como deixar o tênis branco de novo em 5 minutos |
| **Chega de [problema]** | Chega de fios espalhados pela mesa |
| **O [produto] que [benefício]** | A garrafa que mantém a água gelada por 24 horas |

Use as fórmulas como ponto de partida e ajuste até soar natural.

## Regras para o resto da página

- **Frases curtas.** Uma ideia por frase.
- **"Você"**, não "nossos clientes".
- **Números concretos:** "2 litros", "12 horas", "pesa 300 g".
- **Tópicos e subtítulos:** a maioria das pessoas passa o olho antes de ler.
- **Benefício primeiro, característica depois.**

## Erros que espantam o comprador

- **Promessa exagerada:** "resultado garantido em 3 dias". Além de afastar quem é atento, pode derrubar o seu anúncio.
- **Texto traduzido automaticamente**, com frases sem sentido.
- **Erros de português.** Peça a alguém para revisar ou use um corretor.
- **Falar só da loja** ("somos referência no mercado") em vez de falar do cliente.
- **Parágrafos enormes** sem respiro.

> Leia o texto em voz alta. Onde você travar, o cliente também vai travar.
`,
          tasks: [
            "Colete 15 frases de clientes sobre o problema que o seu produto resolve",
            "Escreva um título com cada uma das 4 fórmulas",
            "Reescreva a descrição do produto começando pelos benefícios",
          ],
        },
        {
          title: "Montando a página passo a passo",
          summary: "Da página em branco ao site publicado.",
          learn: [
            "Montando os blocos no construtor",
            "A versão para celular",
            "Publicando e testando",
          ],
          minutes: 12,
          content: `## Antes de abrir o construtor

Tenha em mãos:

- O **rascunho dos 9 blocos** e os textos prontos
- **Fotos e vídeos** do produto (os seus, do pedido de teste)
- O **logo** e as **cores** da marca
- O **link de compra** (o checkout do produto)

Montar a página com o conteúdo pronto leva uma tarde. Montar "criando na hora" leva semanas.

## Passo a passo

1. **Escolha um modelo** parecido com a estrutura que você rascunhou. Não comece do zero.
2. **Apague os blocos que sobram** e coloque os restantes na ordem da aula anterior.
3. **Troque os textos** de cima para baixo.
4. **Troque as imagens.** Antes de enviar, reduza o tamanho dos arquivos: imagem pesada é a principal causa de página lenta.
5. **Ajuste cores e fontes** para as da sua marca. A cor de destaque fica só nos botões.
6. **Ligue todos os botões** ao link de compra.
7. **Preencha o rodapé:** nome, CPF ou CNPJ, contato e links das políticas.

## A versão para celular

A maior parte dos seus visitantes vai ver a página no celular. Abra a pré-visualização para celular e confira:

- O **título inteiro** e o **botão** aparecem na primeira tela?
- O texto dá para ler **sem dar zoom**?
- Os botões são **grandes** e têm espaço em volta?
- Nenhuma imagem ou tabela **vaza para o lado**?
- Blocos que ficam compridos demais podem ser encurtados ou escondidos só no celular.

## Publicando

1. Defina o **endereço** da página (por exemplo, sualoja.com.br/garrafa).
2. Preencha o **título e a descrição** que aparecem no Google e ao compartilhar o link.
3. Clique em **publicar**.

## Testando

- Abra a página no **seu celular**, usando a internet móvel.
- Clique em **todos** os botões.
- Faça uma **compra de teste** até o fim.
- Meça a velocidade em uma ferramenta gratuita, como o **PageSpeed Insights**, do Google. Ela aponta o que está deixando a página lenta.
- Peça a alguém que nunca viu o produto para abrir a página e dizer, em 10 segundos, **o que está sendo vendido**. Se a pessoa não souber, o topo precisa melhorar.
`,
          tasks: [
            "Monte a página a partir de um modelo, com os 9 blocos",
            "Revise a versão para celular usando a lista da aula",
            "Publique e faça uma compra de teste completa",
            "Meça a velocidade da página e anote a nota",
          ],
        },
        {
          title: "Inteligência artificial para criar textos e imagens",
          summary: "Use IA para acelerar sem perder qualidade.",
          learn: [
            "Como pedir bons textos para a IA",
            "Criando imagens do produto em uso",
            "Cuidados com direitos de imagem e informações falsas",
          ],
          minutes: 10,
          content: `## A IA é uma assistente, não a autora

Assistentes de inteligência artificial escrevem rascunhos em segundos, sugerem títulos e melhoram fotos. O que eles **não** sabem é a verdade sobre o seu produto e o seu cliente. O bom resultado vem de **um pedido bem-feito** e de **uma revisão cuidadosa**.

## Como pedir um bom texto

Um pedido completo tem cinco partes:

1. **Papel:** "Você é um redator de lojas virtuais."
2. **Produto:** o que é, do que é feito, medidas, o que vem na caixa.
3. **Cliente:** quem compra e qual problema quer resolver.
4. **Tarefa e formato:** "Escreva 10 títulos de até 60 caracteres."
5. **Tom e limites:** "Linguagem simples, sem exageros e sem prometer resultados."

**Exemplo de pedido:**

> Você é um redator de lojas virtuais. Produto: fonte bebedouro para gatos, 2 litros, silenciosa, com filtro de carvão. Cliente: donos de gato preocupados porque o animal bebe pouca água. Escreva 10 títulos de até 60 caracteres e 5 benefícios em tópicos. Linguagem simples, sem exageros e sem prometer resultados de saúde.

Depois, refine: "deixe mais curto", "use as palavras destas avaliações", "me dê mais 5 no estilo do número 3".

## Onde a IA mais ajuda

- Variações de **títulos** e de textos de anúncio
- **Perguntas frequentes** a partir da descrição do produto
- **Resumo de avaliações**: cole 30 avaliações e peça os elogios e as reclamações mais comuns
- **Revisão** de português e de clareza

## Imagens

- **Remover ou trocar o fundo** de uma foto sua.
- **Criar um cenário** (o produto em uma bancada de cozinha, em uma mesa de escritório).
- **Melhorar** iluminação e nitidez.
- **Adaptar o formato** para quadrado, vertical ou horizontal.

Parta sempre de uma **foto real do seu produto**.

## Cuidados que evitam problemas

- **Confira os fatos.** A IA inventa medidas, materiais e funções com muita segurança. O que estiver escrito na página é promessa sua.
- **A imagem precisa mostrar o produto real.** Se a foto gerada deixa o produto maior, mais bonito ou diferente, é propaganda enganosa.
- **Nunca crie depoimentos ou avaliações** com IA.
- **Não use rosto, voz ou marca de terceiros** sem autorização.
- **Não coloque dados de clientes** nessas ferramentas.

> Regra simples: a IA escreve o rascunho, **você assina embaixo**. Só publique o que você conferiu.
`,
          tasks: [
            "Escreva um pedido completo, com as 5 partes, para o seu produto",
            "Gere 10 títulos e escolha 3 para testar",
            "Crie 2 imagens do produto em um cenário de uso a partir de uma foto real",
            "Confira cada informação do texto gerado antes de publicar",
          ],
          quiz: [
            {
              text: "Qual é o papel do topo (primeira tela) de uma página de venda?",
              explanation:
                "Muita gente decide no topo se continua lendo. Por isso ele traz a promessa, a imagem do produto e o botão.",
              options: [
                "Mostrar a promessa principal, o produto e o botão de compra",
                "Contar a história completa da empresa",
                "Listar todas as políticas da loja",
              ],
            },
            {
              text: "A IA gerou uma descrição dizendo que o produto é à prova d'água, mas você não tem essa informação do fornecedor. O que fazer?",
              explanation:
                "A IA pode inventar características. O que está na página é uma promessa da loja e precisa ser verdadeiro.",
              options: [
                "Conferir com o fornecedor e remover a frase se não for verdade",
                "Publicar, porque a IA deve ter pesquisado",
                "Deixar a frase em letras pequenas",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Medindo resultados",
      description: "Saiba de onde vêm as vendas e melhore a página.",
      lessons: [
        {
          title: "Pixel e métricas: saiba de onde vêm as vendas",
          summary: "Instale a medição antes do primeiro anúncio.",
          learn: [
            "O que é o pixel e por que instalar",
            "As métricas básicas do site",
            "Como conferir se a medição está funcionando",
          ],
          minutes: 8,
          content: `## Sem medição, você anuncia no escuro

Imagine gastar R$ 300 em anúncios, fazer 4 vendas e não saber **qual anúncio** trouxe cada uma. A medição existe para responder a isso.

## O que é o pixel

O **pixel** é um pequeno código instalado no seu site. Ele avisa a plataforma de anúncios sobre o que cada visitante fez:

- **Viu** um produto
- **Colocou** no carrinho
- **Começou** a pagar
- **Comprou** (e quanto gastou)

Com essas informações, a plataforma de anúncios faz duas coisas: mostra a você **qual anúncio gerou vendas** e aprende a **procurar pessoas parecidas com quem comprou**.

Cada plataforma tem o seu: há o pixel da Meta (Facebook e Instagram), o do TikTok e a tag do Google.

## Como instalar

Você não precisa mexer em código. O caminho mais comum é:

1. Criar o pixel dentro da plataforma de anúncios.
2. Copiar o **número de identificação** dele.
3. Colar esse número na área de **integrações** da sua loja ou do construtor.

O passo a passo de cada um está nas trilhas de anúncios.

## As métricas básicas do site

| Métrica | O que mostra | Como calcular |
| --- | --- | --- |
| **Visitantes** | Quantas pessoas chegaram | — |
| **Taxa de conversão** | De cada 100 visitantes, quantos compram | Pedidos ÷ visitantes |
| **Ticket médio** | Quanto cada cliente gasta, em média | Faturamento ÷ pedidos |
| **Abandono de carrinho** | Quem colocou no carrinho e não pagou | — |
| **Origem** | De onde vieram os visitantes | — |

Para ter uma referência: em lojas virtuais, é comum que **1 ou 2 de cada 100 visitantes** comprem. Abaixo disso, vale investigar a página; acima, você está indo bem.

## Como conferir se está funcionando

- Use a ferramenta de **teste de eventos** da plataforma de anúncios: você navega no site e vê os eventos chegando em tempo real.
- Faça uma **compra de teste** e confira se a compra apareceu **uma vez só** e com o **valor certo**.

## Privacidade

Ferramentas de medição usam cookies. Avise o visitante com um **aviso de cookies** e explique o uso na sua **política de privacidade**. A maioria das plataformas tem esse aviso pronto para ativar.
`,
          tasks: [
            "Crie o pixel da plataforma em que você pretende anunciar primeiro",
            "Instale o pixel pela área de integrações da loja",
            "Faça uma compra de teste e confira se ela aparece uma vez, com o valor certo",
            "Ative o aviso de cookies",
          ],
        },
        {
          title: "Testando e melhorando a página",
          summary: "Pequenas mudanças que aumentam as vendas.",
          learn: [
            "O que testar primeiro",
            "Como comparar duas versões da página",
            "Velocidade e experiência no celular",
          ],
          minutes: 7,
          content: `## Melhorar a página é o anúncio mais barato

Se a sua página passa de 1 para 2 vendas a cada 100 visitantes, você **dobra o faturamento sem gastar um real a mais** em anúncios.

## O que testar primeiro

Comece pelo que mais gente vê:

1. **O topo:** título, imagem ou vídeo principal
2. **A oferta:** preço, frete, parcelamento
3. **As provas:** avaliações e demonstração
4. **O botão:** texto e posição
5. Só depois: cores, ordem dos blocos, detalhes

Mudar a cor do botão raramente muda o resultado. Mudar o título, com frequência.

## Como comparar duas versões

O **teste A/B** mostra a versão A para metade dos visitantes e a versão B para a outra metade, ao mesmo tempo. Muitos construtores de página têm essa função.

Para o resultado valer:

- **Mude uma coisa de cada vez.** Se você trocar o título e o preço juntos, não vai saber o que funcionou.
- **Rode as duas versões no mesmo período**, com o mesmo anúncio.
- **Espere ter volume.** Algumas centenas de visitantes em cada versão é o mínimo. Com 20 visitas, a diferença é sorte.
- **Só declare um vencedor se a diferença for grande.**

Sem ferramenta de teste? Compare **semanas inteiras**: uma com a versão antiga, outra com a nova. É menos preciso, mas já ajuda.

## Onde os visitantes desistem

| Sintoma | Onde olhar |
| --- | --- |
| Muitos visitantes, poucos cliques no botão | Topo, título e oferta |
| Muitos carrinhos, poucas compras | Frete, prazo e formas de pagamento |
| Visitantes saem em poucos segundos | Velocidade, ou o anúncio promete algo que a página não mostra |

## Velocidade

- Reduza o tamanho das imagens antes de enviar.
- Vídeos: prefira incorporar de um serviço de vídeo a subir o arquivo na página.
- Desinstale aplicativos e recursos que você não usa.
- Meça de novo depois de cada mudança.

## Anote tudo

Mantenha um registro simples: **data, o que mudou, resultado**. Em alguns meses, esse histórico vira o seu maior patrimônio: você sabe o que funciona **com o seu público**.
`,
          tasks: [
            "Anote a taxa de conversão atual da sua página",
            "Escolha UMA mudança para testar no topo da página",
            "Crie o seu registro de testes com data, mudança e resultado",
          ],
          quiz: [
            {
              text: "Para que serve o pixel?",
              explanation:
                "O pixel registra as ações do visitante e envia para a plataforma de anúncios, que mede as vendas e aprende quem costuma comprar.",
              options: [
                "Avisar a plataforma de anúncios sobre o que os visitantes fazem no site",
                "Deixar as imagens do site mais nítidas",
                "Proteger a loja contra fraudes",
              ],
            },
            {
              text: "Em um teste A/B, por que mudar apenas uma coisa de cada vez?",
              explanation:
                "Com uma única mudança, qualquer diferença no resultado só pode ter vindo dela.",
              options: [
                "Para saber exatamente qual mudança causou a diferença",
                "Porque os construtores só permitem uma mudança por mês",
                "Para a página carregar mais rápido",
              ],
            },
          ],
        },
      ],
    },
  ],
};
