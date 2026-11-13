import type { TrackSeed } from "./types";

export const CRIAR_LOJA_VIRTUAL: TrackSeed = {
  slug: "criar-loja-virtual",
  title: "Criar sua loja virtual",
  description:
    "Monte uma loja profissional sem saber programar: plataforma, domínio, visual, páginas de produto e as políticas que passam confiança.",
  level: "INICIANTE",
  icon: "shopping-bag",
  color: "pink",
  modules: [
    {
      title: "Escolhendo a plataforma",
      description: "Onde montar a loja, quanto custa e o endereço na internet.",
      lessons: [
        {
          title: "As plataformas de loja virtual e quanto custam",
          summary: "Compare as opções pelo que importa no começo.",
          learn: [
            "Como funcionam as plataformas de loja pronta",
            "Mensalidades, taxas e o que está incluído",
            "Qual escolher para o seu momento",
          ],
          minutes: 9,
          content: `## Você não precisa construir uma loja do zero

Existem empresas que alugam a loja pronta: você paga uma mensalidade (ou uma taxa por venda) e recebe **o site, o carrinho, a página de pagamento, a hospedagem e a segurança** funcionando. Você só escolhe o visual e cadastra os produtos.

Alguns exemplos conhecidos no Brasil: **Nuvemshop, Shopify, Loja Integrada, Tray, Yampi** e **Cartpanda**. Quem tem mais conhecimento técnico também usa o **WooCommerce**, que é gratuito, mas exige contratar hospedagem e cuidar da manutenção.

## O que entra no custo

| Custo | Como funciona |
| --- | --- |
| **Mensalidade** | Valor fixo por mês. Algumas plataformas têm plano de entrada gratuito |
| **Taxa por venda da plataforma** | Uma porcentagem de cada pedido, comum nos planos mais baratos |
| **Taxa do meio de pagamento** | Cobrada por quem processa o Pix, o cartão e o boleto |
| **Aplicativos** | Funções extras (avaliações, integração com fornecedor) podem ser pagas |
| **Domínio** | O endereço da loja, pago uma vez por ano |

Os preços mudam com frequência e algumas plataformas cobram em dólar. **Confira sempre a tabela atual no site de cada uma.**

## O que comparar

1. **Custo total com poucas vendas.** No começo, plano sem mensalidade e com taxa por venda costuma sair mais barato.
2. **Meios de pagamento aceitos.** Pix, cartão parcelado e boleto são o mínimo.
3. **Integração com o seu fornecedor.** Pergunte ao fornecedor com quais plataformas ele se conecta.
4. **Suporte em português** e material de ajuda.
5. **Temas gratuitos** bons no celular.

## Qual escolher

- **Quer gastar o mínimo para começar:** uma plataforma com plano de entrada gratuito.
- **O fornecedor é de fora do país:** veja qual plataforma tem o aplicativo de integração que ele recomenda.
- **Pretende crescer rápido com anúncios:** priorize a que tiver o melhor checkout e mais integrações.

> Não existe plataforma "certa". Existe a que cabe no seu bolso hoje e conversa com o seu fornecedor. Trocar depois é possível — o que não dá é adiar a loja por meses tentando escolher.
`,
          tasks: [
            "Abra o site de 3 plataformas e anote mensalidade e taxa por venda de cada uma",
            "Pergunte ao seu fornecedor com quais plataformas ele se integra",
            "Escolha a sua plataforma e crie a conta de teste",
          ],
        },
        {
          title: "Criando a conta e configurando o básico",
          summary: "Do cadastro à loja pronta para receber produtos.",
          learn: [
            "As configurações essenciais da loja",
            "Dados do negócio, e-mails e notificações",
            "Erros comuns na configuração inicial",
          ],
          minutes: 10,
          content: `## Antes de começar

Crie um **e-mail só para a loja**. Todos os avisos de pedido, pagamento e fornecedor vão chegar nele — misturar com o e-mail pessoal é o caminho para perder mensagens importantes.

## O passo a passo

Os nomes dos menus mudam de uma plataforma para outra, mas a ordem é sempre parecida.

1. **Crie a conta** com o e-mail da loja e uma senha forte. Ative a verificação em duas etapas.
2. **Dê nome à loja.** Curto, fácil de falar e de escrever.
3. **Preencha os dados do negócio:** nome ou razão social, CPF ou CNPJ, endereço e telefone.
4. **Confira moeda, idioma e fuso horário:** real, português e horário de Brasília.
5. **Configure os e-mails automáticos** que o cliente recebe: pedido confirmado, pagamento aprovado e pedido enviado. Leia cada um e ajuste o texto para o tom da sua loja.
6. **Ative os avisos para você:** novo pedido e pagamento aprovado.
7. **Defina o e-mail de atendimento** que aparece para o cliente.

## O rodapé também é configuração

A lei brasileira do comércio eletrônico exige que a loja mostre, em local fácil de ver:

- Nome e **CPF ou CNPJ** de quem vende
- **Endereço** físico e eletrônico
- Um **canal de contato**

Coloque esses dados no rodapé. Além de obrigatório, é um dos primeiros sinais que o cliente desconfiado procura.

## Erros comuns

- **Deixar texto de exemplo do tema** ("Sua frase aqui", produtos fictícios).
- **Esquecer a loja com senha** ou em modo de manutenção depois do lançamento.
- **Não testar os e-mails automáticos.** Faça um pedido de teste e veja o que chega.
- **Usar o WhatsApp pessoal** como contato. Crie um número ou, no mínimo, use o WhatsApp Business.

> Pagamento e frete têm aulas próprias. Por enquanto, deixe a loja fechada ao público: você abre no fim desta trilha, com tudo revisado.
`,
          tasks: [
            "Crie o e-mail da loja e ative a verificação em duas etapas na plataforma",
            "Preencha os dados do negócio e o rodapé",
            "Leia e ajuste os 3 e-mails automáticos enviados ao cliente",
          ],
        },
        {
          title: "Domínio próprio: o endereço da sua loja",
          summary: "Como registrar e conectar o seu .com.br.",
          learn: [
            "Como escolher um bom nome de domínio",
            "Registro e custo do domínio",
            "Conectando o domínio à loja, passo a passo",
          ],
          minutes: 7,
          content: `## O que é e por que ter

Domínio é o endereço que o cliente digita: **sualoja.com.br**. Sem ele, a loja fica com o endereço da plataforma (algo como sualoja.plataforma.com), que passa menos confiança e atrapalha os anúncios.

## Como escolher

- **Curto e fácil de falar.** Se você precisa soletrar, complique menos.
- **Sem hífen, sem número e sem letras dobradas.**
- **Termine em .com.br** se você vende para o Brasil.
- **Confira se o nome está livre** também no Instagram e no TikTok.
- Evite nome igual ou parecido com o de uma marca conhecida.

## Onde registrar e quanto custa

O **.com.br** é registrado no **Registro.br**, o órgão oficial. Você precisa de CPF ou CNPJ, e o custo fica em torno de **R$ 40 por ano**. Confira o valor atual no site.

## Conectando o domínio à loja

1. Na plataforma da loja, abra **Domínios** e escolha **Adicionar domínio que já tenho**.
2. A plataforma mostra **dois ou três registros** (com nomes como "A" e "CNAME") para você copiar.
3. No Registro.br, abra o seu domínio, entre em **Configurar endereçamento / DNS** e cole esses registros exatamente como aparecem.
4. Salve e aguarde. A mudança pode levar de alguns minutos a 24 horas para valer.
5. De volta à plataforma, defina o domínio novo como **principal**.
6. Confira se o **cadeado** aparece ao lado do endereço no navegador. Ele indica que a conexão é segura e, na maioria das plataformas, é ativado sozinho.

Se algo não funcionar, o suporte da plataforma faz essa parte com você: é a dúvida mais comum que eles recebem.

## Aproveite: e-mail com o nome da loja

Com o domínio, você pode ter **contato@sualoja.com.br**. Parece detalhe, mas um e-mail profissional faz diferença para clientes, fornecedores e meios de pagamento.
`,
          tasks: [
            "Liste 5 opções de nome e confira quais estão livres no Registro.br e nas redes sociais",
            "Registre o domínio escolhido",
            "Conecte o domínio à loja e confira o cadeado no navegador",
          ],
          quiz: [
            {
              text: "O que deve aparecer no rodapé de uma loja virtual brasileira?",
              explanation:
                "A lei do comércio eletrônico exige identificação de quem vende, endereço e um canal de contato.",
              options: [
                "Nome, CPF ou CNPJ, endereço e um canal de contato",
                "Apenas o logo e os links das redes sociais",
                "A lista de fornecedores da loja",
              ],
            },
            {
              text: "Qual é o melhor critério para escolher a plataforma no começo?",
              explanation:
                "Com poucas vendas, o que importa é o custo total baixo e a ligação com quem vai entregar os pedidos.",
              options: [
                "Custo total com poucas vendas e integração com o seu fornecedor",
                "A plataforma mais cara, porque é a mais completa",
                "A que tiver o maior número de temas pagos",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Montando a loja",
      description: "Visual, produtos, páginas e frete.",
      lessons: [
        {
          title: "O visual da loja sem precisar de designer",
          summary: "Tema, logo e cores que passam confiança.",
          learn: [
            "Como escolher e ajustar um tema",
            "Criando um logo simples",
            "Organizando menu, categorias e página inicial",
          ],
          minutes: 11,
          content: `## A regra principal: simples e limpo

O cliente decide em poucos segundos se confia na loja. Loja confiável não é a mais enfeitada: é a que **parece organizada** e deixa fácil encontrar e comprar.

## Escolhendo o tema

- Comece com um **tema gratuito** da própria plataforma.
- Abra a demonstração **no celular**: a maior parte das compras pela internet no Brasil é feita por ele.
- Prefira temas com bastante espaço em branco, fotos grandes e botão de compra bem visível.

## Logo

Você não precisa de um símbolo elaborado. Um bom logo de loja iniciante é **o nome escrito em uma fonte legível**, no máximo com um ícone simples ao lado.

- Use um editor gratuito, como o Canva.
- Faça duas versões: **horizontal** (para o topo da loja) e **quadrada** (para redes sociais).
- Salve com fundo transparente.

## Cores e fontes

- **Uma cor principal** para a marca.
- **Uma cor de destaque** só para os botões de compra.
- Preto ou cinza-escuro para os textos, fundo claro.
- **Uma ou duas fontes** em toda a loja.

## Menu e categorias

- No máximo **5 ou 6 itens** no menu.
- Nomes que o cliente usaria: "Para cães", não "Linha canina premium".
- Tenha sempre os links **Rastrear pedido** e **Fale conosco**.

## Página inicial, de cima para baixo

1. **Banner único** com a proposta da loja e um botão
2. **Faixa de benefícios**: frete, parcelamento, troca
3. **Produtos mais vendidos**
4. **Categorias**
5. **Avaliações** de clientes, quando tiver
6. **Rodapé completo**: dados da empresa, políticas e contato

## O que evitar

- Vários banners girando sozinhos
- Janelas que pulam na tela assim que o cliente chega
- Imagens pesadas, que deixam a loja lenta
- Cores demais e textos em cima de fotos
`,
          tasks: [
            "Escolha um tema gratuito e veja a demonstração no celular",
            "Crie o logo nas versões horizontal e quadrada",
            "Defina a cor principal e a cor dos botões",
            "Monte o menu com até 6 itens",
          ],
        },
        {
          title: "Cadastrando os produtos do fornecedor",
          summary: "Produtos com fotos, variações e preço certo.",
          learn: [
            "Como importar produtos do fornecedor",
            "Variações de cor e tamanho",
            "Revisando fotos, títulos e descrições",
          ],
          minutes: 10,
          content: `## Duas formas de cadastrar

**Importação automática.** Um aplicativo de integração copia o produto do fornecedor para a sua loja com fotos, variações e preço de custo. Para fornecedores de fora, existem aplicativos próprios para isso; fornecedores brasileiros costumam ter integração direta ou enviar uma planilha.

**Cadastro manual.** Você cria o produto e preenche os campos. Dá mais trabalho, mas funciona em qualquer plataforma e é suficiente para quem começa com poucos produtos.

## Nunca publique um produto sem revisar

O que vem do fornecedor é matéria-prima. Antes de publicar:

| Campo | O que fazer |
| --- | --- |
| **Título** | Reescreva. Tire códigos e palavras repetidas. Ex.: "Bebedouro Fonte para Gatos 2 L" |
| **Descrição** | Escreva do zero, pensando no cliente. Tradução automática espanta comprador |
| **Fotos** | Escolha as melhores, sem marca d'água e sem texto em outro idioma. Coloque as suas fotos primeiro |
| **Preço** | Use a conta da trilha *Produtos e fornecedores* |
| **Peso e medidas** | Necessários para o cálculo do frete |

## Variações

Cor, tamanho e modelo são **variações** de um mesmo produto, não produtos separados.

- Confira se cada variação está ligada à opção certa do fornecedor. Um erro aqui faz o cliente pedir azul e receber verde.
- Use nomes claros: "Azul-marinho", não "Color 3".
- Cada variação precisa da sua foto.
- Tire as variações que o fornecedor quase nunca tem em estoque.

## Estoque

Mesmo sem estoque em casa, a loja precisa saber se o **fornecedor** tem o produto. Com integração, a quantidade é atualizada sozinha. Sem integração, combine com o fornecedor um aviso e confira os seus produtos principais toda semana.

## Comece com poucos

**De 3 a 10 produtos bem-feitos** vendem mais do que 200 copiados. Cada produto novo é mais uma página para revisar, mais um estoque para acompanhar e mais uma dúvida para responder.
`,
          tasks: [
            "Cadastre os seus 3 primeiros produtos",
            "Reescreva o título e a descrição de cada um",
            "Confira se cada variação está ligada à opção certa do fornecedor",
          ],
        },
        {
          title: "Página de produto que convence",
          summary: "Fotos, título, benefícios e prova de que funciona.",
          learn: [
            "A estrutura de uma página de produto que vende",
            "Como escrever benefícios em vez de características",
            "Avaliações e garantias que aumentam a confiança",
          ],
          minutes: 9,
          content: `## A página faz o papel do vendedor

Na loja física, o cliente pega o produto e pergunta ao vendedor. Na internet, **a página precisa responder a tudo sozinha**.

## A ordem que funciona

1. **Fotos e vídeo** — o produto em uso, de vários ângulos
2. **Título** claro, dizendo o que é
3. **Preço**, parcelamento e valor no Pix
4. **Botão de compra** grande e visível sem rolar a tela
5. **3 a 5 benefícios** em tópicos curtos
6. **Frete e prazo** de entrega
7. **Descrição completa**: como funciona, medidas, material, o que vem na caixa
8. **Avaliações** de quem comprou
9. **Perguntas frequentes**
10. **Garantia e troca**

## Benefício vende, característica informa

Característica é o que o produto **tem**. Benefício é o que o cliente **ganha** com isso.

| Característica | Benefício |
| --- | --- |
| Bateria de 2.000 mAh | Dura o dia inteiro sem recarregar |
| Tecido impermeável | Pode usar na chuva sem molhar o que está dentro |
| Filtro de carvão | Água sempre limpa, e o seu gato bebe mais |

Escreva o benefício primeiro e deixe a característica como prova.

## Fotos

- A primeira foto mostra o produto inteiro, em fundo limpo.
- Inclua uma foto de **tamanho** (na mão ou ao lado de algo conhecido).
- Um vídeo curto de demonstração aumenta muito a confiança.

## Prova e confiança

- **Avaliações reais.** Depois das primeiras entregas, peça a opinião dos clientes. Fotos enviadas por eles valem ouro.
- **Garantia clara:** "7 dias para devolver e receber o dinheiro de volta" — é um direito do cliente; mostrá-lo em destaque só ajuda.
- **Formas de pagamento** visíveis perto do botão.

## O que nunca fazer

- **Inventar avaliações.** É propaganda enganosa, proibida pelo Código de Defesa do Consumidor.
- **Urgência falsa**: contador que reinicia ao recarregar a página, "últimas unidades" que nunca acabam.
- **Prometer o que o produto não entrega.** A devolução custa mais do que a venda rendeu.
`,
          tasks: [
            "Reorganize a página do seu produto principal na ordem da aula",
            "Transforme 5 características em benefícios",
            "Adicione uma foto de tamanho e um vídeo curto de demonstração",
          ],
        },
        {
          title: "Frete e prazos de entrega",
          summary: "Configure o frete sem assustar o cliente.",
          learn: [
            "Frete grátis, fixo ou calculado: quando usar",
            "Como informar os prazos com honestidade",
            "Rastreamento dos pedidos",
          ],
          minutes: 7,
          content: `## Frete é o maior motivo de desistência

Muita gente coloca o produto no carrinho e desiste ao ver o valor do frete na última etapa. Por isso, a regra é: **sem surpresa no final**.

## Os três tipos

| Tipo | Como funciona | Quando usar |
| --- | --- | --- |
| **Grátis** | O custo do envio já está dentro do preço | Produtos leves; é o que mais converte |
| **Fixo** | Um valor único para todo o Brasil ou por região | Quando o custo de envio varia pouco |
| **Calculado** | O cliente digita o CEP e vê o valor | Produtos pesados ou grandes |

**Dica:** "Frete grátis acima de R$ 199" incentiva o cliente a colocar mais um item no carrinho.

## Frete grátis não é grátis para você

Some o frete médio ao custo do produto **antes** de definir o preço. Se o fornecedor cobra R$ 18 de envio, esses R$ 18 precisam estar na sua conta.

## Como informar o prazo

O prazo que o cliente vê é a soma de duas partes:

**Prazo total = tempo para o fornecedor postar + tempo de transporte**

- Informe sempre uma **faixa com folga**: "Entrega de 7 a 12 dias úteis".
- Mostre o prazo **na página do produto**, não só no carrinho.
- Se o produto vem de fora do país, **diga isso com clareza**. Cliente avisado espera; cliente surpreendido reclama e pede o dinheiro de volta.

O prazo anunciado é um compromisso: se ele não for cumprido, o cliente pode cancelar a compra e receber tudo de volta.

## Rastreamento

- Envie o **código de rastreio** assim que o fornecedor postar.
- Tenha uma página **"Rastrear pedido"** no menu.
- Avise antes que o cliente pergunte: um e-mail de "seu pedido saiu para entrega" evita muita mensagem no atendimento.

Na trilha *Robôs e automações* você aprende a deixar esses avisos automáticos.
`,
          tasks: [
            "Defina o tipo de frete de cada produto",
            "Refaça o preço incluindo o frete médio do fornecedor",
            "Escreva o prazo de entrega na página de cada produto",
          ],
          quiz: [
            {
              text: "Qual destas frases é um benefício, e não uma característica?",
              explanation:
                "Benefício é o que o cliente ganha. As outras opções descrevem o que o produto tem.",
              options: [
                "Dura o dia inteiro sem recarregar",
                "Bateria de 2.000 mAh",
                "Carregador com cabo de 1 metro",
              ],
            },
            {
              text: "O produto vem de fora do país e demora 20 dias. O que fazer na loja?",
              explanation:
                "Prazo claro evita reclamação e pedido de reembolso. O prazo anunciado é um compromisso com o cliente.",
              options: [
                "Informar o prazo real, com folga, já na página do produto",
                "Prometer 7 dias para não perder a venda",
                "Não informar prazo e responder só se o cliente perguntar",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Confiança e lançamento",
      description: "Políticas, revisão final e o dia de abrir a loja.",
      lessons: [
        {
          title: "Políticas de troca, devolução e privacidade",
          summary: "O que a lei exige e o que o cliente espera.",
          learn: [
            "O direito de arrependimento nas compras pela internet",
            "Como escrever as suas políticas",
            "Canais de atendimento que passam segurança",
          ],
          minutes: 8,
          content: `## O que a lei garante ao seu cliente

Você precisa conhecer três regras do Código de Defesa do Consumidor:

- **Arrependimento em 7 dias.** Quem compra pela internet pode desistir em até 7 dias depois de receber o produto, **sem explicar o motivo**. Você devolve tudo o que foi pago, inclusive o frete.
- **Produto com defeito.** O cliente tem 30 dias para reclamar de produtos não duráveis e 90 dias para os duráveis.
- **Oferta é compromisso.** O que está escrito na página (prazo, preço, o que acompanha) precisa ser cumprido.

Vender sem estoque não muda nada disso: para o cliente e para a lei, **quem vendeu foi você**.

## As páginas que toda loja precisa ter

1. **Trocas e devoluções:** prazos, como pedir e quem paga o envio de volta.
2. **Prazos e entregas:** de onde o produto sai e quanto tempo leva.
3. **Política de privacidade:** quais dados você coleta e para quê. É uma exigência da Lei Geral de Proteção de Dados.
4. **Termos de uso.**
5. **Quem somos e contato.**

As plataformas oferecem modelos prontos. Use como ponto de partida e **adapte ao que você realmente faz** — não prometa na política o que não consegue cumprir.

## Como escrever

- Frases curtas e diretas.
- Passo a passo: "1. Envie um e-mail para… 2. Em até 2 dias úteis respondemos…".
- Diga os prazos em **dias**, não em expressões vagas.

## A conta da devolução

Devolver um produto para um fornecedor de fora do país costuma custar mais do que o próprio produto. Muitas lojas preferem **reembolsar ou reenviar** sem exigir a devolução em pedidos de valor baixo. Combine com o seu fornecedor como funcionam os casos de defeito e reserve uma parte do faturamento para isso.

## Atendimento

- Mostre **pelo menos dois canais**: e-mail e WhatsApp.
- Informe o **horário** e o prazo de resposta.
- Responda rápido: a maioria das contestações de compra começa com um cliente que não conseguiu falar com a loja.
`,
          tasks: [
            "Crie as 5 páginas de política a partir dos modelos da plataforma",
            "Combine com o fornecedor como serão tratados defeitos e devoluções",
            "Coloque os links das políticas e os canais de atendimento no rodapé",
          ],
        },
        {
          title: "Checklist antes de abrir a loja",
          summary: "Tudo revisado antes do primeiro visitante.",
          learn: [
            "O teste de compra completo",
            "Os itens obrigatórios de uma loja",
            "O que fazer no dia do lançamento",
          ],
          minutes: 6,
          content: `## Faça uma compra de verdade

O teste mais importante é comprar na sua própria loja, **pelo celular**, como um cliente faria.

1. Entre pela página inicial e encontre o produto.
2. Escolha a variação e coloque no carrinho.
3. Preencha o endereço e confira o frete e o prazo.
4. Pague com **Pix** e, em outro pedido, com **cartão**.
5. Confira se os e-mails chegaram: pedido recebido e pagamento aprovado.
6. Veja o pedido no painel da loja.
7. Faça o **reembolso** do teste.

Anote tudo o que travou, confundiu ou demorou. É isso que o seu cliente vai sentir.

## Checklist da loja

**Identidade**

- Logo, cores e fontes definidos
- Domínio próprio com cadeado
- Nenhum texto de exemplo do tema

**Produtos**

- Título, fotos e descrição revisados
- Variações conferidas
- Preço com frete e taxas calculados
- Prazo de entrega na página

**Compra**

- Pix, cartão e boleto funcionando
- Frete configurado
- E-mails automáticos revisados

**Confiança**

- CPF ou CNPJ, endereço e contato no rodapé
- Páginas de troca, entrega, privacidade e termos
- Página de rastreio

**Medição**

- Ferramentas de medição instaladas (você aprende na trilha *Criar sites e páginas de venda*)

## No dia do lançamento

1. **Tire a senha** ou o modo de manutenção.
2. Abra a loja em outro celular, sem estar logado, para ver o que o cliente vê.
3. **Avise conhecidos.** Os primeiros pedidos e as primeiras opiniões costumam vir de quem confia em você.
4. Fique de olho no e-mail e no WhatsApp da loja.
5. Anote as dúvidas que aparecerem: cada uma vira uma melhoria na página.

> Loja no ar não é linha de chegada, é o começo. Os próximos passos são **receber pagamentos** e **levar gente até ela**.
`,
          tasks: [
            "Faça uma compra completa pelo celular com Pix e outra com cartão",
            "Percorra o checklist e resolva os itens pendentes",
            "Abra a loja e peça a opinião de 3 pessoas",
          ],
          quiz: [
            {
              text: "Um cliente recebeu o produto há 4 dias e quer devolver sem dizer o motivo. O que a loja deve fazer?",
              explanation:
                "Nas compras pela internet, o cliente tem 7 dias após o recebimento para desistir, com devolução total do valor.",
              options: [
                "Aceitar a devolução e reembolsar o valor, incluindo o frete",
                "Recusar, porque o produto não tem defeito",
                "Oferecer apenas um vale-compras",
              ],
            },
            {
              text: "Qual é o teste mais importante antes de abrir a loja?",
              explanation:
                "Só comprando você descobre os pontos em que o cliente trava: frete, pagamento e e-mails.",
              options: [
                "Fazer uma compra completa pelo celular, do produto ao pagamento",
                "Conferir se o logo está bonito no computador",
                "Cadastrar o maior número possível de produtos",
              ],
            },
          ],
        },
      ],
    },
  ],
};
