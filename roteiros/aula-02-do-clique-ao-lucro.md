# Aula 2 — Do clique ao lucro: falas para o ElevenLabs

Trilha **Vender sem estoque** (grátis) · módulo 1 · aula 2 de 77.

**Voz:** ElevenLabs (voz "Darren", gerada em 16/11/2026) · **Duração:** 7 min 46 s de fala depois dos cortes ·
**Vídeo:** os slides do PDF [`aula-02-do-clique-ao-lucro-como-o-dinheiro-circula.pdf`](../materiais/pdf/01-vender-sem-estoque/aula-02-do-clique-ao-lucro-como-o-dinheiro-circula.pdf),
com as marcações animadas, legendas e capítulos.

> O estilo segue o guia [estilo-do-professor.md](estilo-do-professor.md). Os números estão escritos por extenso de
> propósito: a voz lê "cento e vinte reais" certinho, mas tropeça em "R$ 120" e em "3.850".

## Como gerar a voz

1. **Cole o texto inteiro de uma vez** no ElevenLabs e gere um áudio só. Se o ElevenLabs recusar pelo tamanho, divida
   em dois na linha em branco depois de "Simples assim." e gere as duas metades com as mesmas configurações.
2. **Use a mesma voz e as mesmas configurações em todas as aulas.** Se clonar a sua própria voz (a gravação da aula 1,
   `voz.mp3`, serve de amostra), as aulas da IA e as que você gravar ficam com a mesma voz.
3. **Ouça antes de mandar.** Se uma palavra sair errada, dá para ajudar a voz mudando a grafia (por exemplo, "Mei" em
   vez de "MEI") e gerar de novo.
4. **Salve em MP3** como `video/audio/aula-02/voz.mp3` (ou `voz-1.mp3` e `voz-2.mp3`, se dividir). Eu acho sozinho,
   pela fala, o momento de trocar cada slide, e cuido do resto.

## Vídeo

Pronto em `video/out/aula-02.mp4` (7 min 49 s) e publicado na aula como `/videos/aula-02.mp4`, com capa
(`aula-02.jpg`) e legenda (`aula-02.vtt`). Para o YouTube, a legenda é `video/out/aula-02.srt`.

Para refazer depois de mudar o áudio ou os slides (na pasta `video/`): `npm run audio:aula2`, `npm run slides:aula2`
(antes, na raiz: `PDF_HTML=video/.cache-slides npm run materiais:pdf -- 2`) e `npm run render:aula2`. As marcações e os
tempos ficam em `video/src/aula2/dados.ts`, presos às frases da fala.

**Capítulos (para a descrição do YouTube):**

```
0:00 Abertura
0:37 O que você vai aprender
0:59 O caminho de um pedido
2:52 Os quatro custos
4:33 Atenção ao dinheiro em caixa
6:43 O que você faz agora
7:19 Nos próximos módulos
```

## Cortes feitos no áudio

O áudio gerado fica guardado como `video/audio/aula-02/voz-original.mp3`. Os cortes estão em
`video/audio/aula-02/cortes.json` e são aplicados por `python video/scripts/cortar.py video/audio/aula-02/cortes.json`,
que gera `voz.mp3`. O texto abaixo já está sem eles.

- "Não é promessa de nada." (pedido do dono do curso)
- No custo de impostos, saiu a explicação de MEI, porcentagem, contador e estimativa: a papelada fica para bem depois.
  Ficou só "Quarto: impostos. Quando você formalizar o negócio, entra imposto."
- "Na próxima aula, a gente vai falar do fornecedor…" (17/11/2026): a aula 3 passou a ser "O que vem pela frente", e o
  gancho dos próximos módulos leva direto para ela. O cartão final e o slide de "Próxima aula" já mostram a aula nova.

## Falas (texto inteiro, como está no áudio)

Cada parágrafo em branco é uma pausa natural. As trocas de slide acontecem em "Olha só o roteiro de hoje" (slide 2),
"Primeira coisa" (slide 3), "Beleza. Dessa conta" (slide 4), "E agora, a parte" (slide 5) e "Então, o que você faz com
isso agora" (slide 6). O gancho dos próximos módulos fica no fim, ainda no slide 6.

```text
Opa, fala galera, professor na área. Na aula passada eu te mostrei como funciona vender sem estoque e deixei uma conta pela metade, lembra? Sobraram cinquenta e quatro reais da garrafa, e eu falei: calma, que desse dinheiro ainda sai muita coisa. Pois é. Hoje é a aula dessa conta. Então aqui eu vou te mostrar o caminho completo do dinheiro numa venda. Pra onde vai cada real que o cliente paga? Quanto sobra de verdade no seu bolso? E por que tem loja que vende bem e, mesmo assim, fica sem dinheiro? Bora.

Olha só o roteiro de hoje. Primeiro, a gente segue um pedido, passo a passo, do pagamento até o que sobra. Depois, eu te mostro os quatro custos que você precisa conhecer antes de vender qualquer coisa. E no fim, a parte que pega muita gente desprevenida: o dinheiro em caixa. Tá bom?

Primeira coisa. Vou trocar de exemplo aqui, pra gente fazer a conta inteira: um produto que você vende por cento e vinte reais. Número redondo, tá? É só exemplo, pra você enxergar a estrutura.

O cliente entra na sua loja e paga cento e vinte reais. Beleza, entrou cento e vinte. Só que esse dinheiro não chega inteiro pra você. Primeiro, o meio de pagamento, que é a empresa que recebe o Pix ou o cartão no seu lugar, fica com uma taxa. Aqui no exemplo, seis reais. Aí você vai no fornecedor e paga o produto e o frete: cinquenta e cinco reais. E tem uma parte que muita gente esquece, que é o anúncio. Pra esse cliente chegar até a sua loja, você gastou com anúncio. Aqui, trinta reais por essa venda. E o que sobrou? Cento e vinte, menos seis, menos cinquenta e cinco, menos trinta... sobra vinte e nove. Esses vinte e nove reais são a sua margem. Margem é isso: o que sobra pra você depois de pagar tudo o que a venda custou.

Agora, repara. Tem gente que vende cento e vinte e fala: faturei cento e vinte. E faturou mesmo, porque faturamento é o total que entrou. O problema é quando o cara acha que ganhou cento e vinte. Isso tá errado. Isso tá errado. Ele ganhou vinte e nove. Dos cento e vinte que entraram, noventa e um já tinham dono antes de chegar na conta dele. Faturamento e lucro são coisas completamente diferentes, e confundir as duas é o erro mais comum de quem tá começando, pode ter certeza.

E olha que essa conta é por venda. Se você não sabe a sua margem por venda, você não sabe se tá ganhando ou perdendo dinheiro. Simples assim.

Beleza. Dessa conta saem os quatro custos que você precisa conhecer antes de vender qualquer produto. Vou passar um por um.

Primeiro: produto mais frete. É o que o fornecedor te cobra. E presta atenção no frete, porque tem fornecedor que mostra o preço do produto bem baixinho, e o frete vem depois, separado. Pra sua conta, o que importa é a soma dos dois.

Segundo: as taxas. Tem a taxa do meio de pagamento, que a gente já viu, e muitas vezes tem também a da plataforma da loja, que é o site onde você monta a sua loja. Umas cobram mensalidade, outras cobram um pedacinho de cada venda, outras cobram as duas coisas. Isso varia, então você confere na plataforma que for usar.

Terceiro, e esse é o que mais engana: o custo do anúncio por venda. Não é quanto você gastou de anúncio no total. É quanto custou, em anúncio, cada venda. Por exemplo: você gastou trezentos reais de anúncio na semana e fez dez vendas. Trezentos dividido por dez: cada venda custou trinta reais de anúncio. Esse é o número que entra na conta. E por que ele engana? Porque ele muda. Numa semana é trinta, na outra pode ser cinquenta. E se ele passar da sua margem, cada venda que você faz dá prejuízo. Eu ainda vou me aprofundar nisso, tem trilha inteira de anúncio aqui dentro, tá bom?

Quarto: impostos. Quando você formalizar o negócio, entra imposto.

E agora, a parte que pega muita gente desprevenida. Olha, essa aqui é muito, muito importante.

Não sei se você sabe, mas o dinheiro da venda não cai na sua conta na hora em que o cliente paga. Depende do meio de pagamento e da forma de pagamento. No Pix, costuma cair rápido. No cartão, pode levar dias, às vezes semanas, porque o meio de pagamento segura o dinheiro um tempo antes de te repassar. E o fornecedor? O fornecedor você paga na hora, quando faz o pedido.

Então, olha a situação. O cara começa a vender bem: dez vendas por dia, no cartão. Cada pedido, ele paga cinquenta e cinco reais pro fornecedor, na hora. Dez vendas: quinhentos e cinquenta reais por dia saindo do bolso dele. Em uma semana, três mil oitocentos e cinquenta reais. E o dinheiro dessas vendas? Ainda não caiu. Tá lá no meio de pagamento, esperando o prazo. Isso sem contar o anúncio, que também é cobrado enquanto as vendas acontecem. Resultado: o cara tá vendendo bem e não tem dinheiro pra pagar o próximo pedido. Parece contraditório, mas acontece direto. Tem loja que fecha vendendo.

Então, o que você faz? Duas coisas. Primeira: antes de começar, descobre em quantos dias o meio de pagamento que você vai usar libera o dinheiro do Pix e do cartão. Segunda: separa uma reserva pra pagar os pedidos enquanto o dinheiro não cai. Quanto? Faz a conta: quanto você paga de fornecedor e de anúncio por dia, vezes o número de dias que o dinheiro demora pra cair.

E pra não fazer tudo isso no papel, tem a Calculadora de margem, lá em Ferramentas, aqui dentro da plataforma. Você coloca o preço, o custo do produto, o frete, o anúncio por venda, as taxas e os impostos, e ela te mostra quanto sobra por venda. Usa antes de anunciar qualquer produto.

Então, o que você faz com isso agora? Três tarefas, que tão aqui na tela. Primeira: pega um produto que você pensa em vender e lista todos os custos dele, os quatro que a gente viu. Segunda: joga esses números na Calculadora de margem e anota quanto sobra por venda. Terceira: descobre em quantos dias um meio de pagamento libera o dinheiro das vendas. Escolhe um, entra no site dele e procura o prazo de recebimento. Isso leva dez minutos e te salva muita dor de cabeça.

E já fica o aviso: nos próximos módulos, eu vou te passar as dicas de quem vende muito. Produto de low ticket, que é aquele de preço baixo, que a pessoa compra sem pensar muito: como achar esse produto, com quem falar pra conseguir ele, e como separar o que é tendência de verdade do que é só modinha passageira. É ali que o jogo começa a ficar interessante, pode ter certeza.

Te vejo lá.
```

## Marcações no vídeo (para a edição)

As marcações aparecem animadas sobre o slide, no momento em que a voz fala delas, como se alguém escrevesse na tela.

| Parte | Slide | O que aparece |
| --- | --- | --- |
| 1 | Capa | Só o slide, com uma aproximação lenta |
| 2 | Nesta aula | Destaque passando pelos três tópicos do "Roteiro da aula" |
| 3 | O caminho de um pedido | Círculo no R$ 120; − 6, − 55 e − 30 escritos ao lado de cada passo; círculo forte no R$ 29; "faturamento 120 ≠ lucro 29" no espaço em branco |
| 4 | Os quatro custos | Números 1 a 4 nos cartões; "R$ 300 ÷ 10 vendas = R$ 30 por venda" no terceiro |
| 5 | Dinheiro em caixa | Sublinhado em "paga o fornecedor na hora" e "recebe dias depois"; a conta "10 × R$ 55 = R$ 550 por dia" e "7 dias = R$ 3.850"; círculo na Calculadora de margem |
| 6 | Pratique | Marca em cada tarefa enquanto é lida; destaque no quadro "Próxima aula"; no gancho, aparecem escritas as palavras "low ticket", "como achar", "com quem falar" e "tendência × modinha" |
