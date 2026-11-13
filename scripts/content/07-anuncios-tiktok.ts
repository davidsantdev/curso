import type { TrackSeed } from "./types";

export const ANUNCIOS_TIKTOK: TrackSeed = {
  slug: "anuncios-tiktok",
  title: "Anúncios no TikTok (TikTok Ads)",
  description:
    "Venda com vídeos curtos: conteúdo no estilo da plataforma, conta de anúncios, campanhas e parcerias com criadores.",
  level: "INTERMEDIARIO",
  icon: "clapperboard",
  color: "coral",
  modules: [
    {
      title: "Entendendo o TikTok",
      description: "Por que vende tanto e como preparar a conta.",
      lessons: [
        {
          title: "Por que o TikTok vende tanto (e para quem)",
          summary: "Como as pessoas compram dentro da plataforma.",
          learn: [
            "Como os vídeos são distribuídos",
            "Que tipo de produto vende bem no TikTok",
            "Vídeo comum ou anúncio: quando usar cada um",
          ],
          minutes: 8,
          content: `## O que o TikTok tem de diferente

Na maioria das redes sociais, você vê o conteúdo de quem segue. No TikTok, a tela principal — a aba **Para você** — mostra vídeos escolhidos pelo **interesse** de cada pessoa, não importa quem publicou.

Consequência: **uma conta nova, sem seguidores, pode alcançar milhares de pessoas** se o vídeo for bom. Cada vídeo é testado com um grupo pequeno; se as pessoas assistem até o fim, comentam e compartilham, ele é mostrado para mais gente.

## Compra por descoberta

No Google, a pessoa **procura** o que quer. No TikTok, ela **descobre** algo que nem sabia que existia. A compra acontece por impulso: viu, gostou, comprou.

## O que vende bem

| Característica | Por quê |
| --- | --- |
| **Dá para demonstrar em poucos segundos** | O vídeo se explica sozinho |
| **Tem um efeito visual** | Transformação, organização, limpeza, "antes e depois" real |
| **Resolve um incômodo do dia a dia** | A pessoa se reconhece na hora |
| **Preço de impulso** (até cerca de R$ 200) | Não exige pensar muito |
| **É novidade** | Ninguém viu na loja do bairro |

**Vende menos:** produtos difíceis de explicar, muito caros, ou que todo mundo já conhece e compra pelo menor preço.

## E o público?

O TikTok deixou de ser "rede de adolescente" há tempo. Adultos de todas as idades usam, e muitas compras são feitas por pessoas entre 25 e 45 anos.

## Vídeo comum ou anúncio?

| | Vídeo comum (orgânico) | Anúncio |
| --- | --- | --- |
| **Custo** | Gratuito | Pago |
| **Alcance** | Imprevisível | Controlado pelo orçamento |
| **Para que serve** | Testar ideias e ganchos sem gastar | Vender de forma constante |

O melhor caminho combina os dois: **publique vídeos comuns para descobrir o que prende a atenção** e **transforme os melhores em anúncios**.

## Loja dentro do TikTok

O TikTok também tem uma área de compras própria, em que o cliente compra sem sair do aplicativo e criadores divulgam produtos em troca de comissão. Ela tem regras próprias de cadastro, envio e prazo — consulte as condições atuais antes de decidir se vale para o seu modelo.

Nesta trilha, o foco são os **anúncios que levam para a sua loja**.

> No TikTok, vídeo com cara de propaganda é ignorado. O que funciona parece conteúdo: uma pessoa mostrando algo interessante.
`,
          tasks: [
            "Crie a conta da loja no TikTok e complete o perfil com o link do site",
            "Salve 10 vídeos de produtos do seu nicho que tiveram muitas visualizações",
            "Anote como cada um desses vídeos começa",
          ],
        },
        {
          title: "Configurando a conta de anúncios e o pixel",
          summary: "Tudo pronto para medir as vendas.",
          learn: [
            "Criando a conta de anúncios",
            "Instalando o pixel do TikTok na loja",
            "Formas de pagamento e limites",
          ],
          minutes: 9,
          content: `## Criando a conta de anúncios

Os anúncios são criados no **Gerenciador de Anúncios do TikTok** (TikTok Ads Manager), que é separado do aplicativo.

1. Acesse o site de anúncios do TikTok e clique em **criar conta**.
2. Use o **e-mail da loja**.
3. Escolha **Brasil**, moeda **real** e o fuso horário de **São Paulo**. Essas escolhas não podem ser alteradas depois.
4. Preencha os **dados do negócio**: nome, CPF ou CNPJ, endereço e site.
5. Informe os **dados de faturamento**.

A conta passa por uma análise. Site fora do ar, sem políticas ou sem dados de contato é motivo de recusa.

## Vincule a conta da loja no TikTok

Nas configurações do gerenciador, conecte o **perfil do TikTok** da loja. Assim, os anúncios aparecem em nome dele, e você pode transformar os seus vídeos publicados em anúncios.

## Instalando o pixel

O pixel do TikTok faz o mesmo papel do pixel das outras plataformas: registra o que o visitante fez na loja.

1. No gerenciador, abra **Ferramentas → Eventos** e escolha **eventos da web**.
2. **Crie o pixel** e dê um nome a ele.
3. Escolha a instalação por **plataforma parceira** e selecione a sua plataforma de loja. Na maioria delas, existe um aplicativo oficial do TikTok: você instala, faz login e a conexão é feita.
4. Se houver a opção de enviar os eventos também **pelo servidor**, ative. A medição fica mais completa.

## Os eventos que importam

| Evento | Quando acontece |
| --- | --- |
| **Ver conteúdo** | A pessoa abriu a página do produto |
| **Adicionar ao carrinho** | Colocou o produto no carrinho |
| **Iniciar finalização da compra** | Chegou ao checkout |
| **Concluir pagamento** | Comprou — com o valor do pedido |

## Testando

- Use a função de **teste de eventos** do gerenciador e navegue pela loja.
- Faça uma **compra de teste** e confira se o evento de pagamento chegou **uma vez**, com o **valor certo**.

## Pagamento

Existem dois modelos, e a conta é criada em um deles:

- **Pagamento automático:** você cadastra um cartão e é cobrado conforme gasta.
- **Pagamento manual:** você adiciona saldo antes de anunciar.

Confira no momento do cadastro quais formas estão disponíveis para a sua conta.

## Limites

- O TikTok exige um **orçamento diário mínimo** por campanha e por grupo de anúncios. O valor aparece na tela na hora de criar.
- Contas novas podem ter **limite de gasto diário** nos primeiros dias.

## Para não ter a conta suspensa

- Dados verdadeiros e site completo
- Produto **igual** nos vídeos e na página
- Sem promessas exageradas, sem produtos proibidos e sem marcas de terceiros
`,
          tasks: [
            "Crie a conta de anúncios com moeda real e fuso de São Paulo",
            "Vincule o perfil do TikTok da loja",
            "Instale o pixel pela integração da sua plataforma",
            "Faça uma compra de teste e confirme o evento de pagamento",
          ],
          quiz: [
            {
              text: "Por que uma conta nova consegue alcançar muita gente no TikTok?",
              explanation:
                "A aba Para você distribui cada vídeo pelo interesse que ele desperta, e não pelo número de seguidores de quem publicou.",
              options: [
                "Porque os vídeos são distribuídos pelo interesse das pessoas, não pelos seguidores",
                "Porque o TikTok dá prioridade a contas criadas há pouco tempo",
                "Porque toda conta nova recebe crédito grátis em anúncios",
              ],
            },
            {
              text: "Que tipo de produto costuma vender melhor no TikTok?",
              explanation:
                "A compra é por descoberta e impulso, então o vídeo precisa mostrar o valor do produto em segundos.",
              options: [
                "Produtos que dão para demonstrar em poucos segundos e têm preço de impulso",
                "Produtos caros, que exigem muita explicação",
                "Produtos que todos já conhecem e compram pelo menor preço",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Criativos e campanhas",
      description: "Vídeos que vendem e a primeira campanha.",
      lessons: [
        {
          title: "Roteiro de vídeo que vende em 15 segundos",
          summary: "Gancho, demonstração e chamada para a compra.",
          learn: [
            "A estrutura de um vídeo de venda curto",
            "Ganchos que prendem a atenção",
            "Como mostrar o produto em uso",
          ],
          minutes: 9,
          content: `## Um vídeo, uma ideia

Em 15 segundos não cabe tudo. Cada vídeo fala de **um** problema, **um** benefício ou **uma** forma de uso. Se você tem cinco coisas a dizer, faça cinco vídeos.

## A estrutura

| Tempo | Parte | O que acontece |
| --- | --- | --- |
| 0 a 3 s | **Gancho** | Algo que faz a pessoa parar de rolar |
| 3 a 10 s | **Demonstração** | O produto em uso, resolvendo o problema |
| 10 a 13 s | **Resultado** | Como ficou; o benefício |
| 13 a 15 s | **Chamada** | O que a pessoa deve fazer agora |

## Ganchos que prendem

O gancho é imagem **e** frase. Alguns modelos para adaptar:

- **Problema:** "Se o seu gato derruba o pote de água todo dia…"
- **Surpresa:** "Eu não sabia que precisava disso até testar"
- **Resultado primeiro:** comece pela cena final, depois mostre como chegou lá
- **Lista:** "3 coisas que mudaram a organização da minha cozinha"
- **Opinião direta:** "Parei de usar esponja comum por causa disto"
- **Pergunta:** "Você também sofre para guardar tampas de panela?"

Escreva **pelo menos 5 ganchos** para cada vídeo. O gancho é a parte que mais muda o resultado.

## Como mostrar o produto em uso

- **Mãos e produto**, bem de perto.
- **Situação real:** a cozinha, o carro, o quarto — não um fundo de estúdio.
- **Mostre o problema** antes do produto: a bagunça, a sujeira, a dificuldade.
- **Deixe o som natural** do produto funcionando quando ele for agradável.
- **Transformações precisam ser verdadeiras.** Mostrar um resultado que o produto não entrega derruba o anúncio e gera devolução.

## Texto na tela

- A frase do gancho escrita nos **primeiros segundos**
- Legendas para as falas
- Texto **no centro** da tela: as bordas ficam cobertas pelos botões do aplicativo

## A chamada final

Diga exatamente o que fazer: "Toque no link para garantir o seu com frete grátis". Vídeo sem chamada vira entretenimento.

## Um roteiro pronto para adaptar

- **Gancho (texto na tela):** "Seu gato quase não bebe água?"
- **Cena 1:** pote de água parado, gato ignorando.
- **Cena 2:** a fonte ligada, a água correndo, o gato se aproximando e bebendo.
- **Cena 3:** close no filtro. Texto: "Água sempre limpa".
- **Final:** "Frete grátis hoje. Toque no link."

## Antes de gravar

Assista de novo aos vídeos que você salvou do seu nicho e responda: **como começam? quanto duram? o que mostram no segundo 5?** Aprender com o que já funciona é pesquisa, não cópia — o roteiro e as imagens precisam ser seus.
`,
          tasks: [
            "Escolha UMA ideia central para o seu primeiro vídeo",
            "Escreva 5 ganchos diferentes para essa ideia",
            "Monte o roteiro em 4 partes: gancho, demonstração, resultado e chamada",
          ],
        },
        {
          title: "Gravando e editando pelo celular",
          summary: "Vídeos com cara de conteúdo, não de propaganda.",
          learn: [
            "Luz, som e enquadramento com o celular",
            "Edição rápida com aplicativos gratuitos",
            "Como gravar sem aparecer, se preferir",
          ],
          minutes: 11,
          content: `## Você só precisa do celular

Os vídeos que mais vendem no TikTok parecem gravados por uma pessoa comum — porque foram. Câmera profissional não ajuda; **luz, som e ritmo** ajudam.

## Luz

- Grave **de dia, de frente para uma janela**.
- Evite a luz atrás do produto: ele vira uma sombra.
- À noite, use um abajur ou uma luminária apontada para a parede, não direto no produto.

## Som

- Escolha um ambiente **silencioso**.
- Fale perto do celular ou use um **microfone de lapela** simples.
- Outra opção: grave as imagens primeiro e a **narração depois**, com calma.

## Enquadramento

- **Vertical**, sempre.
- **Limpe a lente** antes de gravar.
- Ajuste a câmera para a **melhor qualidade** do aparelho.
- Apoie o celular: uma pilha de livros resolve.
- **Fundo limpo.** Tire da cena o que não tem a ver com o produto.
- Grave **mais do que precisa**: várias tomadas da mesma cena, de ângulos diferentes.

## Edição em poucos passos

Existem aplicativos gratuitos de edição que fazem tudo no próprio celular, como o **CapCut**.

1. **Importe** as cenas na ordem do roteiro.
2. **Corte os silêncios** e os começos lentos. Cada cena deve durar de 1 a 3 segundos.
3. **Adicione o texto do gancho** nos primeiros segundos.
4. **Gere as legendas automáticas** e corrija os erros.
5. **Ajuste o som:** a voz mais alta do que a música.
6. **Exporte** em alta qualidade, sem marca d'água.

## Música: atenção

Músicas famosas **não podem ser usadas em anúncios**: o uso comercial exige licença. O TikTok oferece uma **biblioteca de músicas comerciais**, liberadas para anúncios. Use só as que estão nela.

## Como gravar sem aparecer

Você não precisa mostrar o rosto. Formatos que funcionam bem:

- **Só as mãos** usando o produto, com narração
- **Texto na tela** contando a história, com música de fundo
- **Voz gerada pelo aplicativo** de edição, a partir de um texto
- **Abertura da caixa** vista de cima
- **Ponto de vista:** a câmera no lugar dos seus olhos
- Vídeos gravados por **clientes** ou por **criadores de conteúdo** (tema de outra aula)

## Checklist antes de publicar

- O gancho aparece **nos 3 primeiros segundos**?
- Dá para entender **sem som**?
- O texto está **longe das bordas**?
- O produto aparece **em uso**?
- Tem **chamada** no final?
- A música é **liberada para uso comercial**?

## Produza em lote

Reserve um período para gravar várias cenas de uma vez. Com 30 minutos de gravação, você monta **de 4 a 6 vídeos** mudando o gancho, a ordem das cenas e a narração.
`,
          tasks: [
            "Grave as cenas do seu roteiro com várias tomadas de cada uma",
            "Edite o primeiro vídeo com gancho, legendas e chamada",
            "Monte mais 2 versões trocando apenas o gancho",
            "Publique os 3 vídeos no perfil da loja",
          ],
        },
        {
          title: "Sua primeira campanha no TikTok",
          summary: "Configuração passo a passo para começar a testar.",
          learn: [
            "Os objetivos de campanha e quando usar cada um",
            "Público e orçamento para o teste",
            "Como subir vários vídeos de uma vez",
          ],
          minutes: 10,
          content: `## Os três níveis

A organização é parecida com a de outras plataformas de anúncio:

| Nível | O que você decide |
| --- | --- |
| **Campanha** | O objetivo |
| **Grupo de anúncios** | Para quem, onde e quanto por dia |
| **Anúncio** | O vídeo, o texto e o link |

## Os objetivos

| Objetivo | Para que serve |
| --- | --- |
| **Alcance e visualizações de vídeo** | Ser visto pelo máximo de pessoas |
| **Tráfego** | Levar visitas ao site |
| **Interação** | Ganhar seguidores e visitas ao perfil |
| **Geração de cadastros** | Coletar contatos |
| **Vendas** | Gerar compras no seu site |

Para vender na sua loja, escolha **Vendas**, com o **site** como destino e o evento **concluir pagamento** como meta. A plataforma entrega o que você pede: quem pede visitas recebe visitas, não compradores.

## Passo a passo

**Campanha**

1. No gerenciador, clique em **criar** e escolha **Vendas**.
2. Dê um nome claro: "Teste – Fonte para gatos – abril".

**Grupo de anúncios**

3. Selecione o **pixel** e o evento de **pagamento concluído**.
4. **Posicionamento:** deixe apenas o TikTok no primeiro teste.
5. **Localização:** Brasil ou os estados em que você entrega bem.
6. **Idade:** a partir de 18 anos, ajustando à faixa de quem compra.
7. **Público:** amplo, sem interesses. O vídeo se encarrega de atrair as pessoas certas.
8. **Orçamento diário:** o valor do seu teste, respeitando o mínimo mostrado na tela.
9. **Lance:** deixe na opção automática, que busca o menor custo.

**Anúncios**

10. Envie **de 3 a 5 vídeos** no mesmo grupo. Existe a opção de enviar vários de uma vez.
11. Escreva um **texto curto** para cada um: uma linha com o benefício.
12. Cole o **link** da página do produto e escolha o botão **Comprar agora**.
13. Publique.

A análise dos anúncios costuma levar algumas horas.

## Quanto investir no teste

A mesma lógica dos outros canais: um orçamento diário próximo do que você pode pagar por **uma venda**, durante **3 a 5 dias**, com um **limite total** definido antes.

## Se o anúncio for reprovado

O gerenciador mostra o motivo. Os mais comuns:

- **Promessa exagerada** ou resultado garantido
- **Vídeo e página diferentes:** preço, produto ou oferta que não batem
- **Música sem licença**
- **Site incompleto:** sem contato, sem políticas
- **Baixa qualidade** de imagem

Corrija o ponto indicado e envie de novo.

## Erros de quem está começando

- Um único vídeo no grupo
- Trocar tudo no segundo dia
- Dividir pouco dinheiro em muitos grupos
- Levar o cliente para a página inicial, e não para o produto
`,
          tasks: [
            "Crie a campanha com objetivo Vendas e evento de pagamento concluído",
            "Configure 1 grupo com público amplo e o seu orçamento diário",
            "Envie de 3 a 5 vídeos no mesmo grupo",
          ],
        },
        {
          title: "Parcerias com criadores de conteúdo",
          summary: "Use vídeos de criadores para vender mais.",
          learn: [
            "Como encontrar criadores do seu nicho",
            "Como propor uma parceria",
            "Usando os vídeos dos criadores nos anúncios",
          ],
          minutes: 8,
          content: `## Por que funciona

As pessoas confiam mais em **outra pessoa mostrando o produto** do que na própria loja falando dele. Um vídeo gravado por um criador de conteúdo — alguém acostumado a prender a atenção — costuma render mais do que os feitos em casa.

Você não precisa de celebridade. Criadores pequenos, com **de mil a 50 mil seguidores**, cobram menos, respondem rápido e têm um público fiel.

## Dois tipos de parceria

| Tipo | Como funciona |
| --- | --- |
| **O criador publica** no perfil dele | Você alcança o público que ele já tem |
| **O criador grava para você** | Você recebe o vídeo e usa nos seus anúncios, mesmo que ele não publique |

Para quem está começando, o segundo tipo costuma ter o melhor custo-benefício: o que você compra é um **bom vídeo**.

## Onde encontrar

- **Busque no próprio TikTok** pelo seu nicho e veja quem publica com frequência sobre o assunto.
- **Plataforma oficial do TikTok** para conectar marcas e criadores.
- **Seus clientes:** quem já comprou e gostou pode gravar em troca de um desconto.
- **Sites de contratação** de criadores de conteúdo.

## Como avaliar

- Os vídeos têm **boa luz e bom ritmo**?
- Os comentários são de **pessoas reais**?
- O conteúdo combina com o seu produto?
- Ele já fez divulgação antes? Ficou natural?

## Como propor

Uma mensagem curta e objetiva:

> Oi, [nome]! Sou da [loja], que vende [produto] para [público]. Gostei dos seus vídeos sobre [tema]. Quero te enviar o produto e contratar **1 vídeo de 15 a 30 segundos** mostrando ele em uso. Qual é o seu valor? Posso mandar os detalhes.

## O que combinar por escrito

1. **O que será entregue:** quantos vídeos, de quanto tempo.
2. **Os pontos obrigatórios:** o benefício principal e a chamada final. Deixe o resto livre: o criador sabe o que funciona.
3. **O prazo** de entrega.
4. **O pagamento:** valor fixo, produto, comissão ou uma combinação.
5. **O direito de uso** do vídeo em anúncios e por quanto tempo.
6. **Uma rodada de ajustes**, se necessário.

## Usando o vídeo do criador como anúncio

Se o criador publicou o vídeo no perfil dele, você pode impulsionar **a própria publicação**. Esse formato se chama **Spark Ads**:

1. O criador abre as configurações de anúncio do vídeo e **gera um código de autorização**, com prazo de validade.
2. Você cola esse código no gerenciador de anúncios.
3. O anúncio aparece em nome do criador, e as curtidas e os comentários ficam na publicação original.

## Publicidade precisa ser identificada

Conteúdo pago deve deixar claro que é publicidade — com a marcação de parceria paga do aplicativo ou termos como "publi". Além de ser regra da plataforma e do mercado publicitário, esconder isso engana o consumidor.

Também vale para depoimentos: o criador só pode dizer o que **realmente** viveu com o produto.
`,
          tasks: [
            "Liste 10 criadores pequenos do seu nicho",
            "Envie a proposta para os 5 que mais combinam com o produto",
            "Escreva os pontos do acordo: entrega, prazo, pagamento e direito de uso",
          ],
          quiz: [
            {
              text: "Qual é o papel dos 3 primeiros segundos de um vídeo de venda?",
              explanation:
                "É o gancho: se ele não prender, a pessoa rola a tela e o resto do vídeo não é visto.",
              options: [
                "Fazer a pessoa parar de rolar a tela",
                "Apresentar a história completa da loja",
                "Mostrar as formas de pagamento",
              ],
            },
            {
              text: "Por que não usar uma música famosa no anúncio?",
              explanation:
                "O uso comercial de músicas exige licença. A biblioteca comercial do TikTok reúne as que podem ser usadas em anúncios.",
              options: [
                "Porque o uso comercial exige licença; use a biblioteca de músicas comerciais",
                "Porque vídeos com música não podem ser anunciados",
                "Porque músicas famosas deixam o vídeo mais lento",
              ],
            },
            {
              text: "Um criador publicou um vídeo do seu produto no perfil dele. Como usar essa publicação como anúncio?",
              explanation:
                "No formato Spark Ads, o criador gera um código de autorização e o anunciante usa a publicação original.",
              options: [
                "Pedindo que o criador gere um código de autorização para o vídeo",
                "Baixando o vídeo e publicando sem avisar",
                "Pedindo a senha da conta do criador",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Otimização",
      description: "Descubra rápido o que funciona.",
      lessons: [
        {
          title: "Lendo os resultados e testando vídeos",
          summary: "Descubra o que funciona e aumente o investimento.",
          learn: [
            "As métricas que importam no TikTok",
            "Quantos vídeos testar por vez",
            "Quando renovar os vídeos",
          ],
          minutes: 8,
          content: `## As métricas de sempre

Elas funcionam como em qualquer plataforma de anúncios:

| Métrica | O que responde |
| --- | --- |
| **CPM** | Quanto custa aparecer mil vezes |
| **CTR** | De quem viu, quantos clicaram |
| **CPC** | Quanto custa cada clique |
| **CPA** | Quanto custa cada venda |
| **ROAS** | Quanto voltou para cada real gasto |

Compare o CPA com o seu **custo por venda de equilíbrio**. É ele que diz se há lucro.

## As métricas de vídeo

No TikTok, elas mostram **em que parte** o vídeo perde a atenção:

| Métrica | O que mostra | Se estiver baixa |
| --- | --- | --- |
| **Visualizações de 2 segundos** | Se o gancho funcionou | Troque o gancho |
| **Visualizações de 6 segundos** | Se o começo sustentou o interesse | Acelere a demonstração |
| **Tempo médio assistido** | Até onde as pessoas ficam | Corte as partes lentas |
| **Vídeo assistido até o fim** | Se a história prendeu | Encurte o vídeo |

## Descobrindo onde está o problema

| O que você vê | O que fazer |
| --- | --- |
| Poucos passam dos 2 segundos | Novo gancho |
| Assistem, mas não clicam | Chamada mais clara, oferta mais forte |
| Clicam, mas não compram | Revisar a página: preço, prazo, confiança |
| Tudo vai bem, mas o custo sobe com o tempo | O vídeo cansou: renove |

## Quantos vídeos testar

- **De 3 a 5 por vez**, no mesmo grupo.
- Depois de alguns dias, **mantenha o melhor** e troque os outros por novos.
- A cada rodada, mude **uma coisa**: o gancho, a primeira cena ou a narração.

Com menos de 3 vídeos, você depende da sorte. Com mais de 6, o dinheiro se divide demais e nenhum recebe dados suficientes.

## Os vídeos cansam rápido

No TikTok, um vídeo pode ter resultado excelente por uma ou duas semanas e depois cair. Os sinais:

- O **CTR diminui**
- O **CPA sobe**
- As pessoas saem cada vez mais cedo

Por isso, quem vende bem no TikTok tem uma **rotina de produção**: novos vídeos toda semana, usando o que aprendeu com os anteriores.

## Reaproveite o vencedor

Um vídeo que funcionou vale muito. Faça versões dele:

- Mesmo vídeo, **outro gancho**
- Mesma ideia, **outro cenário**
- Mesma estrutura, **outro benefício**
- Peça a um **criador** para gravar a mesma ideia do jeito dele

## Quando aumentar o investimento

- O custo por venda está **abaixo do equilíbrio** por alguns dias seguidos.
- Aumente o orçamento **aos poucos** — de 20% a 30% por vez — e observe por um ou dois dias.
- Ou **duplique o grupo** com o vídeo vencedor e teste outro público.

> Guarde em uma planilha: **vídeo, gancho, data, gasto, vendas e CPA**. Em poucas semanas, você enxerga quais tipos de gancho funcionam com o **seu** público.
`,
          tasks: [
            "Abra o relatório e anote as visualizações de 2 e de 6 segundos de cada vídeo",
            "Identifique o vídeo vencedor e crie 2 versões com outro gancho",
            "Monte a planilha de vídeos com gancho, gasto, vendas e CPA",
          ],
          quiz: [
            {
              text: "Poucas pessoas passam dos 2 primeiros segundos do seu vídeo. O que mudar?",
              explanation:
                "As visualizações de 2 segundos medem a força do gancho, que é a abertura do vídeo.",
              options: [
                "O gancho, que é o começo do vídeo",
                "O preço do produto",
                "A forma de pagamento da conta de anúncios",
              ],
            },
            {
              text: "Quantos vídeos vale a pena testar por vez no mesmo grupo de anúncios?",
              explanation:
                "Com menos de 3, o resultado depende da sorte. Com muitos, o orçamento se divide e nenhum recebe dados suficientes.",
              options: ["De 3 a 5 vídeos", "Apenas 1 vídeo", "Pelo menos 20 vídeos"],
            },
            {
              text: "Um vídeo vendeu muito bem por duas semanas e agora o custo por venda está subindo. O que fazer?",
              explanation:
                "Os vídeos cansam rápido no TikTok. A saída é renovar, criando versões do que funcionou.",
              options: [
                "Criar novas versões do vídeo vencedor, com outros ganchos",
                "Aumentar o orçamento do mesmo vídeo para compensar",
                "Parar de anunciar o produto para sempre",
              ],
            },
          ],
        },
      ],
    },
  ],
};
