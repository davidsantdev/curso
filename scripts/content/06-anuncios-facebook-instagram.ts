import type { TrackSeed } from "./types";

export const ANUNCIOS_FACEBOOK_INSTAGRAM: TrackSeed = {
  slug: "anuncios-facebook-instagram",
  title: "Anúncios no Facebook e Instagram (Meta Ads)",
  description:
    "Anuncie no Facebook e no Instagram do jeito certo: configure a conta, crie campanhas, faça criativos que vendem e aprenda a ler os números.",
  level: "INTERMEDIARIO",
  icon: "megaphone",
  color: "blue",
  modules: [
    {
      title: "Primeiros passos",
      description: "Como os anúncios funcionam e a conta configurada.",
      lessons: [
        {
          title: "Como funcionam os anúncios no Facebook e Instagram",
          summary: "O leilão de anúncios explicado de forma simples.",
          learn: [
            "Como a plataforma decide quem vê o seu anúncio",
            "Quanto custa anunciar",
            "O que esperar dos primeiros dias",
          ],
          minutes: 8,
          content: `## Um nome para tudo: Meta Ads

Facebook, Instagram, Messenger e WhatsApp pertencem à mesma empresa, a **Meta**. Os anúncios de todos eles são criados em um único lugar, o **Gerenciador de Anúncios**. Por isso você vai ouvir "Meta Ads" ou "Facebook Ads" para falar da mesma coisa.

## Você não compra um espaço: você entra em um leilão

Cada vez que alguém abre o Instagram, existe um espaço de anúncio disponível e vários anunciantes querendo aparecer para aquela pessoa. A plataforma faz um leilão em milésimos de segundo.

Quem vence **não** é só quem paga mais. Contam três coisas:

1. **O valor que você aceita pagar** (o lance — por padrão, a plataforma define sozinha)
2. **A chance de a pessoa fazer o que você quer** (clicar, comprar)
3. **A qualidade do anúncio** (as pessoas assistem, comentam, ou escondem?)

Resultado prático: **um anúncio bom paga menos** para aparecer do que um anúncio ruim.

## Como a plataforma decide quem vê

Você informa o objetivo (por exemplo, **vendas**) e o sistema procura, entre milhões de pessoas, as que têm mais chance de comprar. Ele aprende com cada resultado: por isso a medição de vendas instalada na loja (o **pixel**) é tão importante.

## Quanto custa

- Não existe preço fixo nem contrato. **Você define um orçamento por dia** e pode pausar quando quiser.
- Dá para começar com **poucos reais por dia**, mas, para vendas, um teste útil costuma pedir de **R$ 20 a R$ 50 por dia** durante alguns dias.
- A cobrança é feita pelas **exibições** do anúncio, não pelas vendas. Ninguém garante resultado.

## O que esperar dos primeiros dias

- **Resultados irregulares.** Um dia vende, no outro não. O sistema ainda está aprendendo.
- **As primeiras campanhas são um investimento em aprendizado**: você descobre qual produto, qual vídeo e qual público funcionam.
- **Não tire conclusões em 24 horas.** Espere alguns dias ou o limite de gasto que você definiu.

## O que precisa estar pronto antes

- Loja ou página de venda **revisada e testada**
- **Pixel** instalado e registrando compras
- **3 ou 4 anúncios** diferentes (vídeos e imagens)
- A conta de **custo por venda de equilíbrio** (trilha *Produtos e fornecedores*)

> Anúncio não conserta produto ruim nem página confusa. Ele só leva mais gente até lá — e você paga por cada visita.
`,
          tasks: [
            "Anote o custo por venda de equilíbrio do produto que você vai anunciar",
            "Defina o orçamento diário e o limite total do seu primeiro teste",
            "Confira se a loja passou no checklist de lançamento",
          ],
        },
        {
          title: "Configurando o gerenciador de anúncios",
          summary: "Conta de anúncios, página e pagamento prontos.",
          learn: [
            "Portfólio empresarial, página e conta de anúncios",
            "Formas de pagamento dos anúncios",
            "Como evitar bloqueios de conta",
          ],
          minutes: 10,
          content: `## As peças que você vai criar

| Peça | O que é |
| --- | --- |
| **Perfil pessoal** | A sua conta do Facebook, verdadeira. É por ela que você acessa tudo |
| **Página do Facebook** | A "cara" da loja. Todo anúncio é publicado em nome de uma página |
| **Conta do Instagram** | O perfil da loja, em modo profissional |
| **Portfólio empresarial** | A pasta que organiza página, Instagram, conta de anúncios e pixel (antes chamado de Gerenciador de Negócios) |
| **Conta de anúncios** | Onde ficam as campanhas e a forma de pagamento |

## Passo a passo

1. **Use o seu perfil pessoal de verdade**, com nome e foto reais. Perfis falsos ou recém-criados são bloqueados com frequência.
2. **Ative a verificação em duas etapas** no perfil.
3. **Crie a Página do Facebook** da loja: nome, logo, capa, descrição e link do site.
4. **Crie o Instagram** da loja e mude para **conta profissional**. Publique alguns conteúdos antes de anunciar.
5. Acesse o endereço de negócios da Meta e **crie o portfólio empresarial** com o nome da loja e o e-mail da loja.
6. Dentro dele, **adicione a página e o Instagram**.
7. **Crie a conta de anúncios.** Escolha moeda **real** e fuso horário de **São Paulo**. Atenção: essas duas escolhas não podem ser alteradas depois.
8. **Cadastre a forma de pagamento.**

## Formas de pagamento

- **Cartão de crédito:** a cobrança é automática, conforme você gasta.
- **Pix ou boleto:** você adiciona saldo antes e os anúncios consomem esse saldo.

Use um cartão **no seu nome**. Comece com um orçamento baixo: contas novas têm limite de gasto diário, que aumenta com o histórico de pagamentos em dia.

## Como evitar bloqueios

A Meta bloqueia contas de forma automática, e contas novas são as mais vigiadas.

**O que fazer**

- Dados verdadeiros em tudo: perfil, página, pagamento
- Aumentar o gasto aos poucos
- Manter a loja com políticas, contato e CNPJ ou CPF visíveis
- Ler os **Padrões de Publicidade** uma vez

**O que não fazer**

- Criar várias contas de anúncios "por garantia"
- Usar cartão de outra pessoa
- Prometer resultados ("emagreça 10 kg", "ganhe R$ 5 mil")
- Falar de características pessoais de quem vê: "Você está acima do peso?"
- Usar "antes e depois" em produtos de saúde e beleza
- Anunciar réplicas ou produtos proibidos

## Se a conta for bloqueada

Não crie outra em seguida — isso piora a situação. Abra a **Qualidade da conta**, veja o motivo e **solicite uma análise**. Muitos bloqueios automáticos são revertidos em poucos dias.
`,
          tasks: [
            "Ative a verificação em duas etapas no seu perfil",
            "Crie a página do Facebook e o Instagram profissional da loja",
            "Crie o portfólio empresarial e a conta de anúncios (real e fuso de São Paulo)",
            "Cadastre a forma de pagamento",
          ],
        },
        {
          title: "Pixel e eventos: o anúncio aprendendo com as vendas",
          summary: "Conecte a loja para a plataforma encontrar compradores.",
          learn: [
            "Instalando o pixel na loja",
            "Eventos de compra e de carrinho",
            "Testando se tudo está registrando",
          ],
          minutes: 9,
          content: `## Por que isso vem antes da primeira campanha

Sem o pixel, a Meta sabe quem **clicou**, mas não sabe quem **comprou**. Ela passa a procurar pessoas que clicam — e clicar é de graça. Com o pixel, ela procura pessoas parecidas com **quem pagou**.

## Os eventos do caminho de compra

Cada passo do cliente na loja é um **evento**:

| Evento | Quando acontece |
| --- | --- |
| **Visualização de página** | A pessoa abriu qualquer página |
| **Visualização de conteúdo** | Viu a página de um produto |
| **Adição ao carrinho** | Colocou um produto no carrinho |
| **Início de finalização da compra** | Chegou ao checkout |
| **Compra** | Pagou — com o **valor** do pedido |

## Instalando

1. No portfólio empresarial, abra o **Gerenciador de Eventos**.
2. Clique em **conectar dados**, escolha **Web** e dê um nome (por exemplo, "Pixel da Loja X").
3. Copie o **número de identificação** do pixel.
4. Na sua plataforma de loja, abra a integração com **Facebook e Instagram** e cole o número. Muitas plataformas fazem a conexão com um login, sem copiar nada.
5. Se a plataforma oferecer a **API de Conversões**, ative também.

## O que é a API de Conversões

O pixel funciona no navegador do cliente, e bloqueadores de anúncio e regras de privacidade do celular fazem parte dos eventos se perder. A **API de Conversões** envia os mesmos eventos **direto da loja para a Meta**. Usar os dois juntos deixa a medição mais completa.

## Verifique o domínio

Ainda no portfólio empresarial, em **Segurança da marca → Domínios**, adicione o endereço da sua loja e siga as instruções. Isso confirma que o site é seu.

## Testando

1. No Gerenciador de Eventos, abra **Testar eventos**.
2. Digite o endereço da loja e navegue como um cliente: abra um produto, coloque no carrinho, vá ao checkout.
3. Cada passo deve aparecer na tela em alguns segundos.
4. Faça uma **compra de teste** e confira:
   - O evento **Compra** apareceu?
   - Apareceu **uma vez só**?
   - O **valor** e a moeda estão certos?

## Problemas comuns

- **Compra duplicada:** o pixel foi instalado duas vezes (pela integração e à mão). Deixe só a integração.
- **Compra sem valor:** refaça a conexão pela integração oficial da plataforma.
- **Compra que não aparece no Pix ou no boleto:** em algumas lojas, o evento é enviado quando o pedido é criado, não quando é pago. Veja nas configurações qual momento a sua plataforma usa.
`,
          tasks: [
            "Crie o pixel e conecte à loja pela integração oficial",
            "Ative a API de Conversões, se a sua plataforma oferecer",
            "Verifique o domínio da loja",
            "Faça uma compra de teste e confirme que o evento Compra chegou uma vez, com o valor certo",
          ],
          quiz: [
            {
              text: "No leilão de anúncios, o que faz um anunciante pagar menos para aparecer?",
              explanation:
                "O leilão considera o lance, a chance de resultado e a qualidade. Anúncios melhores pagam menos.",
              options: [
                "Ter um anúncio de boa qualidade, que as pessoas querem ver",
                "Anunciar apenas de madrugada",
                "Criar várias contas de anúncios",
              ],
            },
            {
              text: "Por que instalar o pixel antes da primeira campanha?",
              explanation:
                "Com o evento de compra, a plataforma mede as vendas e aprende a procurar pessoas com perfil de comprador.",
              options: [
                "Para a plataforma saber quem comprou e buscar pessoas parecidas",
                "Para o anúncio ser aprovado mais rápido",
                "Para reduzir a taxa do meio de pagamento",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Campanhas",
      description: "Da primeira campanha aos criativos que vendem.",
      lessons: [
        {
          title: "Sua primeira campanha, passo a passo",
          summary: "Estrutura simples para um teste bem-feito.",
          learn: [
            "Escolhendo o objetivo da campanha",
            "Campanha, conjunto e anúncio: como organizar",
            "As configurações que iniciantes mais erram",
          ],
          minutes: 12,
          content: `## Os três níveis

Toda campanha na Meta tem três níveis. Entender isso resolve metade das dúvidas.

| Nível | O que você decide |
| --- | --- |
| **Campanha** | O **objetivo**: o que você quer que as pessoas façam |
| **Conjunto de anúncios** | **Para quem**, **onde** e **quanto** por dia |
| **Anúncio** | **O que** a pessoa vê: vídeo ou imagem, texto e link |

## O objetivo: Vendas

A plataforma entrega exatamente o que você pede. Se pedir **cliques**, ela encontra quem clica muito e compra pouco. Para vender, escolha o objetivo **Vendas** e, no conjunto, o evento de conversão **Compra**.

## Uma estrutura simples para o primeiro teste

- **1 campanha** com objetivo Vendas
- **1 conjunto de anúncios**, com público amplo
- **3 ou 4 anúncios** diferentes dentro dele

A plataforma distribui o dinheiro entre os anúncios e mostra qual funciona melhor.

## Passo a passo

**Campanha**

1. No Gerenciador de Anúncios, clique em **Criar**.
2. Escolha **Vendas**.
3. Dê um nome que você entenda depois: "Teste – Garrafa térmica – março".

**Conjunto de anúncios**

4. Local da conversão: **site**. Evento: **Compra**.
5. **Orçamento diário:** o valor que você definiu para o teste.
6. **Localização:** Brasil, ou apenas os estados em que você entrega bem.
7. **Idade:** a faixa de quem realmente compra o produto.
8. **Público:** deixe amplo, sem interesses, neste primeiro teste (a próxima aula explica o motivo).
9. **Posicionamentos:** deixe no automático.

**Anúncio**

10. Confira se a **página** e o **Instagram** da loja estão selecionados.
11. Envie o **vídeo ou a imagem**.
12. Escreva o **texto principal** e o **título**.
13. Cole o **link** da página do produto e escolha o botão **Comprar agora**.
14. Veja a **prévia** no formato de celular.
15. Repita para os outros anúncios e clique em **Publicar**.

Os anúncios passam por uma análise, que costuma levar de minutos a algumas horas.

## Os erros mais comuns

- **Objetivo errado:** tráfego ou engajamento, esperando vendas.
- **Vários conjuntos com pouco dinheiro em cada um.** O sistema não aprende com nenhum.
- **Público pequeno demais**, cheio de filtros.
- **Link errado** ou apontando para a página inicial em vez do produto.
- **Mexer todo dia.** Cada mudança grande faz o aprendizado recomeçar.
- **Não olhar a prévia**: texto cortado, vídeo com bordas.

> Depois de publicar, o mais difícil é **não mexer**. Deixe rodar pelo período que você planejou.
`,
          tasks: [
            "Crie a campanha com objetivo Vendas e evento Compra",
            "Configure 1 conjunto com público amplo e o seu orçamento diário",
            "Suba 3 anúncios diferentes e confira a prévia de cada um no celular",
          ],
        },
        {
          title: "Públicos: para quem mostrar o anúncio",
          summary: "Público aberto, interesses e remarketing.",
          learn: [
            "Quando deixar o público aberto",
            "Interesses e públicos semelhantes",
            "Anunciando de novo para quem visitou a loja",
          ],
          minutes: 9,
          content: `## Quatro tipos de público

| Tipo | O que é |
| --- | --- |
| **Aberto (amplo)** | Só localização, idade e idioma. A plataforma decide o resto |
| **Interesses** | Pessoas que demonstram interesse em um tema: "gatos", "camping" |
| **Semelhante** | Pessoas parecidas com um grupo que você indica, como os seus compradores |
| **Remarketing** | Quem **já teve contato** com a loja: visitou, colocou no carrinho, interagiu no Instagram |

## Por que o público aberto funciona

Parece estranho anunciar para "todo mundo", mas o sistema não mostra o anúncio para todos. Ele observa **quem reage ao seu vídeo** e **quem compra**, e passa a buscar pessoas parecidas.

Na prática, **o criativo faz a segmentação**: um vídeo que começa com "seu gato bebe pouca água?" só prende quem tem gato.

Use o público aberto quando:

- O pixel está registrando compras
- O anúncio deixa claro para quem é o produto
- O produto serve para muita gente

## Quando usar interesses

- A conta e o pixel são novos, sem nenhuma venda registrada
- O produto é de um grupo bem específico (pesca, tricô, um esporte)

Escolha poucos interesses **amplos e relacionados**. Empilhar dezenas de filtros deixa o público pequeno e caro.

## Público semelhante

Você indica uma origem (por exemplo, quem comprou nos últimos 180 dias) e a plataforma monta um grupo parecido. Funciona melhor quando a origem tem **pelo menos algumas centenas de pessoas**. No começo, sem compradores, não se preocupe com ele.

## Remarketing: a segunda chance

A maioria das pessoas não compra na primeira visita. O remarketing mostra um anúncio diferente para quem já demonstrou interesse.

**Públicos para criar** (em Públicos → Público personalizado):

- Visitantes do site nos últimos 30 dias
- Quem colocou no carrinho nos últimos 14 dias e **não** comprou
- Quem interagiu com o Instagram nos últimos 30 dias

**Como anunciar para eles:**

- Fale com quem já conhece o produto: tire uma dúvida, mostre avaliações, lembre do frete grátis ou da garantia.
- **Exclua quem já comprou.**
- Separe uma parte pequena do orçamento: **de 10% a 20%**.
- Com poucas visitas, o público fica pequeno demais para rodar. Comece o remarketing quando a loja tiver tráfego.

## Uma ordem para testar

1. Aberto
2. Aberto + um interesse amplo, se o aberto não funcionou
3. Remarketing, quando houver visitantes suficientes
4. Semelhante, quando houver compradores suficientes

> Se o resultado está ruim, troque o **anúncio** antes de trocar o **público**. Na maioria das vezes, o problema está no criativo.
`,
          tasks: [
            "Crie o público personalizado de visitantes dos últimos 30 dias",
            "Crie o público de quem colocou no carrinho e não comprou",
            "Escreva a ideia de um anúncio de remarketing para o seu produto",
          ],
        },
        {
          title: "Criativos que param a rolagem",
          summary: "Imagens e vídeos que fazem a pessoa parar e clicar.",
          learn: [
            "Ganchos para os primeiros 3 segundos",
            "Formatos que funcionam no feed e nos stories",
            "Como produzir criativos com o celular",
          ],
          minutes: 10,
          content: `## Criativo é o que mais pesa no resultado

**Criativo** é a parte visual do anúncio: o vídeo ou a imagem. Com as plataformas cada vez mais automáticas, é nele que você faz diferença.

## Os primeiros 3 segundos

A pessoa está rolando a tela com o polegar. Se o começo não prender, o resto do vídeo não existe. Esse começo se chama **gancho**.

| Tipo de gancho | Exemplo |
| --- | --- |
| **Problema** | "Seu gato quase não bebe água?" |
| **Resultado** | Mostrar o tênis encardido ficando branco |
| **Curiosidade** | "Eu não acreditava que isso funcionava" |
| **Demonstração direta** | O produto em ação, sem introdução |
| **Prova** | "Mais de 2 mil pessoas já compraram" — só se for verdade |

O gancho tem imagem **e** texto na tela: muita gente assiste sem som.

## A estrutura de um vídeo de 15 a 30 segundos

1. **Gancho** (0 a 3 s)
2. **O problema**, em uma frase
3. **O produto em uso**, resolvendo o problema
4. **Dois ou três benefícios**
5. **A oferta:** frete grátis, parcelas, garantia
6. **Chamada:** "Toque em comprar agora"

## Formatos

| Formato | Onde aparece | Proporção |
| --- | --- | --- |
| **Vídeo vertical** | Reels e Stories | 9:16 |
| **Vídeo ou imagem para o feed** | Feed | 4:5 ou 1:1 |
| **Carrossel** | Feed | Várias imagens deslizáveis |

Se for gravar um só, grave **vertical**: é o formato com mais espaço na tela.

## Produzindo com o celular

- **Luz:** de frente para uma janela, durante o dia.
- **Limpe a lente** e grave na melhor qualidade do aparelho.
- **Mostre o produto em uso**, com as mãos, em um ambiente real.
- **Cortes rápidos:** uma cena a cada 2 ou 3 segundos.
- **Legendas** em todas as falas.
- **Não deixe texto nas bordas**: os botões do aplicativo cobrem.
- Vídeo com "cara de conteúdo", gravado por uma pessoa, costuma ir melhor do que vídeo com cara de comercial de TV.

## O texto do anúncio

- **Primeira linha:** o benefício principal ou uma pergunta.
- **Meio:** dois ou três benefícios e a oferta.
- **Fim:** a chamada para a ação.
- **Título:** curto e direto, como "Frete grátis para todo o Brasil".

## Teste em lotes

- Suba **de 3 a 5 criativos** por vez.
- Para variar, mantenha o vídeo e **troque só o gancho**.
- Anote o que você mudou em cada versão.

## O que derruba anúncios

- Promessas de resultado e "antes e depois" em saúde e beleza
- Imagens que não representam o produto real
- Depoimentos inventados
`,
          tasks: [
            "Escreva 5 ganchos diferentes para o seu produto",
            "Grave 1 vídeo vertical de 15 a 30 segundos seguindo a estrutura da aula",
            "Crie 2 variações do mesmo vídeo trocando apenas o gancho",
          ],
        },
        {
          title: "Orçamento e fase de aprendizado",
          summary: "Quanto investir e quanto tempo esperar.",
          learn: [
            "Como definir o orçamento diário",
            "O que é a fase de aprendizado",
            "Quando mexer e quando esperar",
          ],
          minutes: 7,
          content: `## Como definir o orçamento diário

Use o seu **custo por venda de equilíbrio** como referência.

> **Orçamento diário do teste ≈ o valor que você pode pagar por uma venda.**

Se você pode gastar até R$ 50 para conseguir uma venda, um orçamento de R$ 50 por dia dá ao sistema a chance de gerar cerca de uma venda diária. Com R$ 10 por dia, ele levaria quase uma semana para descobrir se o anúncio funciona.

Não tem esse valor? Comece com o que cabe no bolso e **dê mais tempo** ao teste.

## Defina também o limite total

Antes de publicar, escreva:

- **Quanto** vou gastar no teste inteiro
- **Por quantos dias**
- **O que vai me fazer pausar** antes disso

**Exemplo:** R$ 40 por dia, 5 dias, limite de R$ 200. Se um anúncio gastar R$ 120 sem nenhuma venda, eu pauso esse anúncio.

## O que é a fase de aprendizado

Quando um conjunto de anúncios começa a rodar, o sistema está testando para quem mostrar. Nesse período, o resultado oscila bastante. No painel, aparece o aviso **"Em aprendizado"**.

- O aprendizado termina depois de **cerca de 50 resultados em 7 dias** (no nosso caso, 50 compras).
- Lojas pequenas raramente chegam a esse número, e aparece **"Aprendizado limitado"**. Não é uma punição: é só um aviso de que há poucos dados. A campanha continua rodando e pode dar lucro.

## O que faz o aprendizado recomeçar

- Mudar muito o orçamento de uma vez
- Trocar o público
- Editar o criativo ou adicionar um anúncio novo
- Pausar o conjunto por vários dias

## Para sair do aprendizado limitado

- **Concentre** o orçamento em menos conjuntos
- **Amplie** o público
- Dê **mais tempo** antes de mexer

## Quando mexer e quando esperar

| Situação | O que fazer |
| --- | --- |
| Primeiras 48 a 72 horas | **Esperar**, salvo erro evidente (link quebrado, anúncio reprovado) |
| Um anúncio gastou de 2 a 3 vezes o custo de equilíbrio sem vender | **Pausar esse anúncio** |
| Vendas dentro do custo que você aceita | **Manter** e não mexer |
| Vendas bem abaixo do custo de equilíbrio por vários dias | **Aumentar o orçamento aos poucos** |

## Pagamento

O anúncio para se o cartão for recusado ou o saldo acabar — e isso também atrapalha o aprendizado. Confira a forma de pagamento antes de começar.

> Olhe os resultados **uma vez por dia**, no mesmo horário. Acompanhar de hora em hora só serve para decidir no susto.
`,
          tasks: [
            "Defina o orçamento diário a partir do seu custo por venda de equilíbrio",
            "Escreva o limite total do teste e a regra para pausar um anúncio",
            "Escolha o horário em que você vai olhar os resultados todos os dias",
          ],
          quiz: [
            {
              text: "Qual objetivo de campanha escolher para vender em uma loja virtual?",
              explanation:
                "A plataforma busca quem tem mais chance de fazer o que foi pedido. Para vender, o pedido precisa ser compra.",
              options: [
                "Vendas, com o evento de conversão Compra",
                "Tráfego, para levar o máximo de cliques",
                "Engajamento, para ganhar curtidas",
              ],
            },
            {
              text: "O resultado da campanha está ruim. O que testar primeiro, na maioria dos casos?",
              explanation:
                "O criativo é o que mais influencia o resultado e é ele quem atrai o público certo.",
              options: [
                "Novos criativos, principalmente novos ganchos",
                "Um público com dezenas de interesses empilhados",
                "Dez conjuntos de anúncios com R$ 5 cada um",
              ],
            },
            {
              text: "O que significa o aviso \"Aprendizado limitado\"?",
              explanation:
                "O conjunto tem poucos resultados para o sistema otimizar. Ele continua rodando e pode ser lucrativo.",
              options: [
                "Que há poucos resultados para o sistema aprender, mas a campanha segue rodando",
                "Que a conta de anúncios foi bloqueada",
                "Que o anúncio foi reprovado",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Otimização",
      description: "Leia os resultados e decida com números.",
      lessons: [
        {
          title: "Lendo os números: CPM, CTR, CPC, CPA e ROAS",
          summary: "O que cada métrica diz sobre a sua campanha.",
          learn: [
            "O significado de cada métrica, sem complicação",
            "Como comparar os seus resultados",
            "Como descobrir onde está o problema",
          ],
          minutes: 10,
          content: `## As siglas, traduzidas

| Sigla | Nome | O que responde | Como calcular |
| --- | --- | --- | --- |
| **CPM** | Custo por mil exibições | Quanto custa aparecer? | Gasto ÷ exibições × 1.000 |
| **CTR** | Taxa de cliques | O anúncio chama a atenção? | Cliques ÷ exibições |
| **CPC** | Custo por clique | Quanto custa cada visita? | Gasto ÷ cliques |
| **CPA** | Custo por compra | Quanto custa cada venda? | Gasto ÷ compras |
| **ROAS** | Retorno do investimento em anúncios | Quanto voltou para cada real gasto? | Valor das vendas ÷ gasto |

No painel, use sempre a versão **de link**: "cliques no link" e "CTR (taxa de cliques no link)". As versões "todos" contam curtidas e toques no perfil.

## Um exemplo completo

Você gastou **R$ 200** e teve:

- 20.000 exibições → **CPM de R$ 10**
- 300 cliques no link → **CTR de 1,5%** e **CPC de R$ 0,67**
- 5 compras → **CPA de R$ 40**
- R$ 645 em vendas → **ROAS de 3,2**

## Bom ou ruim? Compare com o **seu** número

Não existe ROAS "bom" universal. O que importa é o **seu ponto de equilíbrio**, calculado na trilha *Produtos e fornecedores*.

- Se o seu custo por venda de equilíbrio é R$ 69, um CPA de R$ 40 dá **R$ 29 de lucro por venda**.
- Se o seu equilíbrio é R$ 35, o mesmo CPA de R$ 40 dá **prejuízo**.

Como referência geral, um CTR de link perto ou acima de **1%** indica um criativo que desperta interesse. Abaixo de 0,5%, vale testar outros.

## Descobrindo onde está o problema

Siga o caminho do cliente, do anúncio até a compra:

| O que você vê | Onde está o problema | O que testar |
| --- | --- | --- |
| CTR baixo | O **anúncio** não chama a atenção | Novo gancho, novo vídeo |
| CTR bom, poucas adições ao carrinho | A **página** não convence | Título, fotos, preço, prazo |
| Carrinhos, mas poucas compras | O **checkout** | Frete, formas de pagamento, campos demais |
| CPM muito alto | Público pequeno, época concorrida ou anúncio mal avaliado | Ampliar o público, melhorar o criativo |
| Tudo razoável, mas sem lucro | A **conta do produto** | Preço, custo, ou trocar de produto |

## Cuidados ao ler os dados

- **Poucos dados enganam.** Uma venda em 20 cliques não quer dizer que você vai vender sempre a cada 20 cliques.
- **Olhe períodos de 3 a 7 dias**, não só o dia de hoje.
- **Compare com a loja.** O painel de anúncios e o painel da loja nunca batem exatamente. Diferenças pequenas são normais; diferenças grandes pedem uma revisão do pixel.

> Use **Ferramentas → Resultado de campanha**: preencha gasto, cliques, vendas e faturamento e veja todas as métricas de uma vez.
`,
          tasks: [
            "Monte no Gerenciador de Anúncios uma visão com CPM, CTR de link, CPC de link, compras, CPA e ROAS",
            "Calcule as métricas da sua campanha na calculadora de resultado de campanha",
            "Use a tabela da aula para identificar em qual etapa está o seu maior problema",
          ],
        },
        {
          title: "O que cortar, manter e escalar",
          summary: "Decisões baseadas em números, não em palpite.",
          learn: [
            "Quando desligar um anúncio",
            "Como aumentar o investimento sem perder o resultado",
            "Testes A/B na prática",
          ],
          minutes: 9,
          content: `## Três decisões possíveis

Para cada anúncio, só existem três caminhos: **cortar**, **manter** ou **escalar** (investir mais). O segredo é decidir com regras escritas antes, não com a emoção do dia.

## Quando cortar

Desligue um anúncio quando:

- Ele gastou **de 2 a 3 vezes o seu custo por venda de equilíbrio** e não vendeu nada
- O CTR de link está **muito abaixo** dos outros anúncios do mesmo conjunto
- O custo por compra está acima do equilíbrio por **vários dias seguidos**

Desligue o **anúncio**, não a campanha inteira, quando outros estiverem funcionando.

## Quando manter

Se o anúncio vende com custo dentro do que você aceita, **não mexa**. A vontade de "melhorar" o que está dando certo é a causa de muita campanha estragada.

## Quando e como escalar

Escale quando o resultado se mantém bom por **pelo menos 3 a 5 dias**.

**Aumentando o orçamento**

- Suba **de 20% a 30%** por vez.
- Espere **2 ou 3 dias** entre um aumento e outro.
- Dobrar o orçamento de uma vez costuma bagunçar o resultado.

**Abrindo novas frentes**

- Duplique o conjunto para testar **outro público**.
- Crie **novos criativos** inspirados no que venceu: mesmo estilo, outro gancho.
- Leve o produto para **outro canal**, como TikTok ou Google.

O custo por venda costuma **subir** um pouco conforme você aumenta o investimento. Acompanhe para parar antes de passar do ponto de equilíbrio.

## Anúncios cansam

Depois de algum tempo, as mesmas pessoas já viram o seu vídeo várias vezes. Os sinais:

- A **frequência** (quantas vezes, em média, cada pessoa viu) sobe
- O **CTR cai**
- O **custo por compra sobe**

A solução é ter **sempre criativos novos em teste**. Reserve um horário fixo na semana para gravar.

## Teste A/B

É a comparação entre duas versões, mudando **uma única coisa**.

- **O que vale testar:** o gancho, o formato (vídeo ou imagem), a oferta, a página de destino.
- **Como fazer:** coloque as versões no mesmo conjunto e deixe rodar, ou use a ferramenta de **teste A/B** do gerenciador, que divide o público entre elas.
- **Quando decidir:** só depois de cada versão ter gasto o suficiente para gerar algumas vendas.

## Uma rotina simples

**Todo dia (5 minutos):** conferir gasto, vendas e se há algum anúncio reprovado.

**Duas vezes por semana:** aplicar as regras de cortar, manter e escalar.

**Uma vez por semana:** subir novos criativos e anotar o que aprendeu.

> O objetivo não é acertar sempre. É **perder pouco nos testes que dão errado** e **aproveitar bem os que dão certo**.
`,
          tasks: [
            "Escreva as suas regras para cortar, manter e escalar",
            "Aplique as regras aos anúncios que estão no ar",
            "Reserve na agenda um horário semanal para gravar novos criativos",
          ],
          quiz: [
            {
              text: "Uma campanha gastou R$ 300 e gerou R$ 900 em vendas. Qual é o ROAS?",
              explanation: "ROAS é o valor das vendas dividido pelo gasto: 900 ÷ 300 = 3.",
              options: ["3", "0,33", "600"],
            },
            {
              text: "O CTR está bom, muita gente visita o produto, mas quase ninguém coloca no carrinho. Onde está o problema mais provável?",
              explanation:
                "Se o anúncio traz visitas e elas não avançam, quem não está convencendo é a página do produto.",
              options: [
                "Na página do produto: título, fotos, preço ou prazo",
                "No gancho do vídeo",
                "Na forma de pagamento dos anúncios",
              ],
            },
            {
              text: "Qual é a forma mais segura de aumentar o investimento em um anúncio que está dando lucro?",
              explanation:
                "Aumentos graduais mantêm a campanha estável. Mudanças bruscas fazem o resultado oscilar.",
              options: [
                "Subir o orçamento de 20% a 30% e esperar alguns dias entre os aumentos",
                "Multiplicar o orçamento por 10 no mesmo dia",
                "Pausar a campanha e criar outra igual com mais dinheiro",
              ],
            },
          ],
        },
      ],
    },
  ],
};
