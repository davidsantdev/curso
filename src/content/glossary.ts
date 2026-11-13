/**
 * Dicionário de quem vende pela internet.
 * Cada termo é explicado em linguagem simples, para quem está começando do zero.
 *
 * `track` (opcional) é o slug da trilha em que o assunto é ensinado.
 */

export const GLOSSARY_CATEGORIES = [
  "Negócio",
  "Loja e site",
  "Pagamentos",
  "Anúncios",
  "Números",
  "Operação",
] as const;

export type GlossaryCategory = (typeof GLOSSARY_CATEGORIES)[number];

export type GlossaryTerm = {
  term: string;
  /** Outros nomes pelos quais o termo é conhecido. */
  also?: string;
  category: GlossaryCategory;
  definition: string;
  track?: string;
};

export const GLOSSARY: GlossaryTerm[] = [
  /* ------------------------------- Negócio ------------------------------- */
  {
    term: "Dropshipping",
    also: "vender sem estoque",
    category: "Negócio",
    definition:
      "Modelo em que você vende um produto que não está na sua casa. Quando o cliente compra, você repassa o pedido a um fornecedor, e é ele quem embala e envia direto para o cliente.",
    track: "vender-sem-estoque",
  },
  {
    term: "Fornecedor",
    category: "Negócio",
    definition:
      "A empresa que tem o produto em estoque e faz o envio. Pode ser uma fábrica, uma distribuidora ou um atacadista, no Brasil ou em outro país.",
    track: "produtos-e-fornecedores",
  },
  {
    term: "Nicho",
    category: "Negócio",
    definition:
      "Um grupo de pessoas com um interesse ou uma necessidade em comum, como donos de gato ou quem treina em casa. Escolher um nicho é decidir para quem você vende.",
    track: "produtos-e-fornecedores",
  },
  {
    term: "Marketplace",
    category: "Negócio",
    definition:
      "Um grande site de compras em que muitos lojistas vendem lado a lado, como um shopping na internet. O site cuida do pagamento e da logística e cobra uma comissão por venda.",
    track: "vender-em-marketplaces",
  },
  {
    term: "E-commerce",
    also: "comércio eletrônico",
    category: "Negócio",
    definition: "Qualquer venda de produtos feita pela internet, em loja própria ou em marketplace.",
  },
  {
    term: "Margem",
    also: "margem de lucro",
    category: "Negócio",
    definition:
      "O que sobra do preço de venda depois de pagar os custos. Pode ser dita em reais (sobram R$ 30) ou em porcentagem (sobram 30% do preço).",
    track: "produtos-e-fornecedores",
  },
  {
    term: "Ponto de equilíbrio",
    category: "Negócio",
    definition:
      "A situação em que você não ganha nem perde. Nos anúncios, é o valor máximo que dá para gastar por venda sem ter prejuízo.",
    track: "produtos-e-fornecedores",
  },
  {
    term: "Capital de giro",
    category: "Negócio",
    definition:
      "O dinheiro guardado para manter o negócio funcionando no dia a dia. Para quem vende sem estoque, serve principalmente para pagar o fornecedor antes de o valor do cartão cair.",
    track: "pagamentos-e-checkout",
  },
  {
    term: "MEI",
    also: "Microempreendedor Individual",
    category: "Negócio",
    definition:
      "A forma mais simples de ter um CNPJ no Brasil. A abertura é gratuita e pela internet, o imposto é um valor fixo por mês e existe um limite de faturamento por ano.",
    track: "pagamentos-e-checkout",
  },
  {
    term: "Faturamento",
    category: "Negócio",
    definition:
      "A soma de tudo o que foi vendido em um período, antes de descontar qualquer custo. Faturamento não é lucro.",
  },
  {
    term: "Nota fiscal",
    category: "Negócio",
    definition:
      "O documento oficial que registra uma venda. Em vendas pela internet, transportadoras e marketplaces costumam exigir a nota para o envio.",
    track: "pagamentos-e-checkout",
  },

  /* ----------------------------- Loja e site ----------------------------- */
  {
    term: "Loja virtual",
    category: "Loja e site",
    definition:
      "Um site com catálogo de produtos, carrinho e pagamento, em que o cliente escolhe e compra sozinho, a qualquer hora.",
    track: "criar-loja-virtual",
  },
  {
    term: "Plataforma de loja",
    category: "Loja e site",
    definition:
      "Um serviço que entrega a loja virtual pronta: você paga uma mensalidade ou uma taxa por venda e só precisa escolher o visual e cadastrar os produtos.",
    track: "criar-loja-virtual",
  },
  {
    term: "Domínio",
    category: "Loja e site",
    definition: "O endereço do site na internet, como sualoja.com.br. É registrado e renovado uma vez por ano.",
    track: "criar-loja-virtual",
  },
  {
    term: "Hospedagem",
    category: "Loja e site",
    definition:
      "O serviço que mantém os arquivos do site guardados e ligados 24 horas. Plataformas de loja e construtores de site já incluem a hospedagem.",
    track: "criar-sites-e-paginas",
  },
  {
    term: "Página de venda",
    also: "landing page",
    category: "Loja e site",
    definition:
      "Uma página única sobre um único produto, sem menu nem distrações, em que tudo leva ao mesmo botão de compra.",
    track: "criar-sites-e-paginas",
  },
  {
    term: "Checkout",
    category: "Loja e site",
    definition:
      "A etapa final da compra, em que o cliente informa os dados, escolhe a forma de pagamento e paga. É onde mais gente desiste.",
    track: "pagamentos-e-checkout",
  },
  {
    term: "Carrinho abandonado",
    category: "Loja e site",
    definition:
      "Quando a pessoa coloca um produto no carrinho e sai sem pagar. Lembretes automáticos conseguem recuperar parte dessas vendas.",
    track: "robos-e-automacoes",
  },
  {
    term: "Tema",
    also: "template",
    category: "Loja e site",
    definition: "O modelo visual pronto de uma loja ou de um site: cores, fontes e disposição dos blocos.",
    track: "criar-loja-virtual",
  },
  {
    term: "Variação",
    category: "Loja e site",
    definition:
      "As opções de um mesmo produto, como cor e tamanho. Ficam todas no mesmo cadastro, cada uma com a sua foto e o seu estoque.",
    track: "criar-loja-virtual",
  },
  {
    term: "Código de rastreio",
    category: "Loja e site",
    definition:
      "A sequência de letras e números que permite acompanhar onde o pacote está, da postagem à entrega.",
    track: "robos-e-automacoes",
  },
  {
    term: "Copy",
    also: "texto de venda",
    category: "Loja e site",
    definition: "O texto escrito para convencer alguém a comprar: títulos, descrições e textos de anúncio.",
    track: "criar-sites-e-paginas",
  },

  /* ------------------------------ Pagamentos ----------------------------- */
  {
    term: "Meio de pagamento",
    also: "gateway, intermediador",
    category: "Pagamentos",
    definition:
      "A empresa que recebe o pagamento do cliente, confere se a compra é segura e repassa o valor para você, descontando uma taxa.",
    track: "pagamentos-e-checkout",
  },
  {
    term: "Pix",
    category: "Pagamentos",
    definition:
      "O pagamento instantâneo brasileiro. Para o lojista, é a forma mais barata e o dinheiro entra em segundos.",
    track: "pagamentos-e-checkout",
  },
  {
    term: "Boleto",
    category: "Pagamentos",
    definition:
      "Um documento de cobrança com código de barras. A confirmação leva de 1 a 3 dias úteis, e muitos boletos gerados nunca são pagos.",
    track: "pagamentos-e-checkout",
  },
  {
    term: "Parcelamento sem juros",
    category: "Pagamentos",
    definition:
      "O cliente divide a compra no cartão sem pagar a mais por isso. O custo das parcelas existe e fica por conta do lojista.",
    track: "pagamentos-e-checkout",
  },
  {
    term: "Antecipação",
    category: "Pagamentos",
    definition:
      "Receber antes do prazo normal o valor de uma venda no cartão, pagando uma taxa maior por isso.",
    track: "pagamentos-e-checkout",
  },
  {
    term: "Chargeback",
    also: "contestação de compra",
    category: "Pagamentos",
    definition:
      "Quando o dono do cartão pede ao banco o dinheiro de volta por não reconhecer a compra ou não ter recebido o produto. Se o banco aceitar, o valor sai da conta do lojista.",
    track: "pagamentos-e-checkout",
  },
  {
    term: "Antifraude",
    category: "Pagamentos",
    definition:
      "A análise automática que avalia se uma compra parece legítima antes de aprovar o pagamento no cartão.",
    track: "pagamentos-e-checkout",
  },
  {
    term: "Reembolso",
    also: "estorno",
    category: "Pagamentos",
    definition: "A devolução do valor pago pelo cliente, total ou parcial, feita pela loja.",
  },
  {
    term: "Direito de arrependimento",
    category: "Pagamentos",
    definition:
      "Regra do Código de Defesa do Consumidor: quem compra pela internet pode desistir em até 7 dias depois de receber o produto, sem dizer o motivo, e receber tudo de volta.",
    track: "criar-loja-virtual",
  },

  /* ------------------------------- Anúncios ------------------------------ */
  {
    term: "Tráfego pago",
    category: "Anúncios",
    definition: "As visitas que chegam ao site por meio de anúncios, em plataformas como Meta, TikTok e Google.",
    track: "anuncios-facebook-instagram",
  },
  {
    term: "Tráfego orgânico",
    category: "Anúncios",
    definition:
      "As visitas que chegam sem anúncio pago: por publicações nas redes sociais, pela busca do Google ou por indicação.",
  },
  {
    term: "Criativo",
    category: "Anúncios",
    definition: "A parte visual do anúncio: o vídeo ou a imagem. É o que mais influencia o resultado de uma campanha.",
    track: "anuncios-facebook-instagram",
  },
  {
    term: "Gancho",
    category: "Anúncios",
    definition:
      "Os primeiros segundos de um vídeo, feitos para fazer a pessoa parar de rolar a tela e continuar assistindo.",
    track: "anuncios-tiktok",
  },
  {
    term: "Pixel",
    category: "Anúncios",
    definition:
      "Um pequeno código instalado no site que avisa a plataforma de anúncios sobre o que o visitante fez: viu um produto, colocou no carrinho, comprou.",
    track: "criar-sites-e-paginas",
  },
  {
    term: "Público",
    also: "segmentação",
    category: "Anúncios",
    definition: "O grupo de pessoas para quem um anúncio é mostrado, definido por localização, idade, interesses ou comportamento.",
    track: "anuncios-facebook-instagram",
  },
  {
    term: "Remarketing",
    category: "Anúncios",
    definition:
      "Anunciar de novo para quem já teve contato com a loja, como quem visitou um produto ou abandonou o carrinho.",
    track: "anuncios-facebook-instagram",
  },
  {
    term: "Fase de aprendizado",
    category: "Anúncios",
    definition:
      "O período inicial de uma campanha, em que a plataforma testa para quem mostrar o anúncio. Os resultados oscilam bastante até ela juntar dados.",
    track: "anuncios-facebook-instagram",
  },
  {
    term: "Palavra-chave",
    category: "Anúncios",
    definition: "O termo que a pessoa digita em uma busca. Nos anúncios do Google, você escolhe em quais palavras quer aparecer.",
    track: "anuncios-google",
  },
  {
    term: "Palavra-chave negativa",
    category: "Anúncios",
    definition: "Um termo para o qual você não quer aparecer, como “grátis” ou “usado”. Evita pagar por cliques sem chance de venda.",
    track: "anuncios-google",
  },
  {
    term: "UGC",
    also: "conteúdo gerado por usuários",
    category: "Anúncios",
    definition:
      "Vídeos com cara de conteúdo comum, gravados por clientes ou por criadores, mostrando o produto em uso.",
    track: "anuncios-tiktok",
  },
  {
    term: "Teste A/B",
    category: "Anúncios",
    definition:
      "A comparação entre duas versões de um anúncio ou de uma página, mudando uma única coisa, para descobrir qual funciona melhor.",
    track: "criar-sites-e-paginas",
  },
  {
    term: "Feed de produtos",
    category: "Anúncios",
    definition:
      "A lista com os dados dos produtos (título, foto, preço, estoque) enviada da loja para plataformas como o Google Shopping.",
    track: "anuncios-google",
  },

  /* ------------------------------- Números ------------------------------- */
  {
    term: "Impressão",
    also: "exibição",
    category: "Números",
    definition: "Cada vez que um anúncio aparece na tela de alguém.",
  },
  {
    term: "CPM",
    also: "custo por mil exibições",
    category: "Números",
    definition: "Quanto custa para o anúncio aparecer mil vezes. Mostra se está caro ou barato alcançar o público.",
    track: "anuncios-facebook-instagram",
  },
  {
    term: "CTR",
    also: "taxa de cliques",
    category: "Números",
    definition: "De todas as vezes em que o anúncio apareceu, em quantas alguém clicou. Mostra se o anúncio chama a atenção.",
    track: "anuncios-facebook-instagram",
  },
  {
    term: "CPC",
    also: "custo por clique",
    category: "Números",
    definition: "Quanto você paga, em média, por cada clique no anúncio.",
    track: "anuncios-facebook-instagram",
  },
  {
    term: "CPA",
    also: "custo por venda",
    category: "Números",
    definition: "Quanto você gastou em anúncios para conseguir cada venda. É o gasto dividido pelo número de compras.",
    track: "anuncios-facebook-instagram",
  },
  {
    term: "ROAS",
    also: "retorno do investimento em anúncios",
    category: "Números",
    definition: "Quanto voltou em vendas para cada real gasto em anúncios. Um ROAS de 3 significa R$ 3 vendidos para cada R$ 1 investido.",
    track: "anuncios-facebook-instagram",
  },
  {
    term: "ACOS",
    also: "custo de publicidade sobre as vendas",
    category: "Números",
    definition:
      "Usado nos marketplaces: quanto do valor vendido foi gasto em anúncios patrocinados. Um ACOS de 10% significa R$ 10 de anúncio para cada R$ 100 vendidos.",
    track: "vender-em-marketplaces",
  },
  {
    term: "Conversão",
    category: "Números",
    definition: "Quando o visitante faz o que você queria. Em uma loja, quase sempre significa uma compra.",
    track: "criar-sites-e-paginas",
  },
  {
    term: "Taxa de conversão",
    category: "Números",
    definition: "De cada 100 visitantes, quantos compram. É o número de pedidos dividido pelo número de visitantes.",
    track: "criar-sites-e-paginas",
  },
  {
    term: "Ticket médio",
    category: "Números",
    definition: "Quanto cada cliente gasta por pedido, em média. É o faturamento dividido pelo número de pedidos.",
    track: "criar-sites-e-paginas",
  },

  /* ------------------------------- Operação ------------------------------ */
  {
    term: "Automação",
    category: "Operação",
    definition:
      "Uma regra que o sistema executa sozinho: quando acontece uma coisa, ele faz outra. Por exemplo, quando o pedido é pago, ele é enviado ao fornecedor.",
    track: "robos-e-automacoes",
  },
  {
    term: "Chatbot",
    also: "robô de atendimento",
    category: "Operação",
    definition: "Um programa que responde às mensagens dos clientes automaticamente, por menu de opções ou com inteligência artificial.",
    track: "robos-e-automacoes",
  },
  {
    term: "ERP",
    also: "sistema de gestão",
    category: "Operação",
    definition:
      "Um sistema que reúne em um só lugar pedidos, estoque e notas fiscais, inclusive de vários canais de venda ao mesmo tempo.",
    track: "robos-e-automacoes",
  },
  {
    term: "Integração",
    category: "Operação",
    definition:
      "A ligação entre dois sistemas para que troquem informações sozinhos, como a loja e o fornecedor, ou a loja e a plataforma de anúncios.",
    track: "robos-e-automacoes",
  },
  {
    term: "Reputação",
    category: "Operação",
    definition:
      "A nota que um marketplace dá ao vendedor, com base em reclamações, cancelamentos e atrasos. Define a exposição dos anúncios.",
    track: "vender-em-marketplaces",
  },
  {
    term: "Pós-venda",
    category: "Operação",
    definition: "Tudo o que acontece depois da compra: avisos de entrega, atendimento, trocas e o convite para comprar de novo.",
    track: "robos-e-automacoes",
  },
  {
    term: "LGPD",
    also: "Lei Geral de Proteção de Dados",
    category: "Operação",
    definition:
      "A lei brasileira que define como empresas podem coletar e usar dados pessoais. Exige, entre outras coisas, uma política de privacidade clara.",
    track: "criar-loja-virtual",
  },
];
