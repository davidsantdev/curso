# Aula 3 — O que vem pela frente: os métodos, a IA e os robôs

Trilha **Vender sem estoque** (grátis) · módulo 1 · aula 3 de 78 · aula nova, curta, entre "Do clique ao lucro" e
"Fornecedor do Brasil ou de fora?".

**Voz:** ElevenLabs (use a mesma voz da aula 2, "Darren", com as mesmas configurações) · **Duração prevista:** cerca de
3 min 30 s (511 palavras, 2.786 caracteres) · **Vídeo:** os slides do PDF
[`aula-03-o-que-vem-pela-frente-os-metodos-a-ia-e-os-robos.pdf`](../materiais/pdf/01-vender-sem-estoque/aula-03-o-que-vem-pela-frente-os-metodos-a-ia-e-os-robos.pdf),
com as marcações animadas, legendas e capítulos.

> O estilo segue o guia [estilo-do-professor.md](estilo-do-professor.md): sem "não é promessa", sem papelada.

## Vídeo

Pronto em `video/out/aula-03.mp4` (3 min 3 s), no estilo da aula 1 (fundo escuro, texto que entra no ritmo da fala),
mais editado: cortes rápidos, batidas de câmera, efeitos sonoros e memes. Os memes são **originais** (emoji livre,
letra de meme e desenhos em código): nada de imagem de meme da internet, que tem direito autoral e muitas vezes o rosto
de gente real, o que não pode entrar num curso pago nem num anúncio.

- **Voz:** duas partes do ElevenLabs (`video/audio/aula-03/voz-a.mp3` e `voz-b.mp3`), unidas com uma pausa curta em
  `voz-original.mp3`. **O último parágrafo** ("Então, pra fechar…", com as tarefas e a próxima aula) **não veio no
  áudio**: o vídeo fecha com um cartão sem voz mostrando a próxima aula e as tarefas. Se esse trecho for gerado, ele
  entra no fim.
- **Legendas:** `video/out/aula-03.srt` (YouTube) e `.vtt` (site).
- **Onde mexer:** `video/src/aula3/` (`tempo.ts` com os tempos, `cenas-a.tsx` e `cenas-b.tsx` com as cenas,
  `memes.tsx` com os memes). Para refazer: `npm run render:aula3`, na pasta `video/`.

**Capítulos (para a descrição do YouTube):**

```
0:00 Abertura
0:34 Os métodos
1:29 Programação, do jeito fácil
2:16 Robôs trabalhando por você
2:57 Próxima aula
```

**Onde entram os memes:**

| Fala | Meme |
| --- | --- |
| "rapidinha" | Cronômetro, linhas de velocidade e "RAPIDINHA" |
| "onde você tá… pra onde você vai" | Mapa do curso com o pino "você está aqui" e a bandeira de chegada |
| "programação" / "calma" | Susto 😱 com "PROGRAMAÇÃO?!" e, logo depois, 🧘 "relaxa" |
| "dicas de quem vende muito" | Chuva de dinheiro e gráfico subindo com foguete |
| "low ticket… preço baixo" | Etiqueta de R$ 19,90 e 🤑 "baratinho" |
| "tendência… modinha" | Meme de dois quadros: 😎 tendência × 🙅 só modinha |
| "sem nem ter uma loja própria" | 🤯 "sem loja própria?!" |
| "É muita coisa? É." | "Processando informação…" que trava em 99% |
| "Isso mesmo, programação" | "ISSO MESMO." com arranhão de disco |
| "programador custa caro" | Carimbo "CARO" e dinheiro voando embora |
| "a melhor IA do mercado" | Troféu e coroa |
| "não precisa virar programador" | "programador" riscado e 😮‍💨 "ufa" |
| "O resto, a IA faz" | Óculos pixelados caindo no robô |
| "não é aquele de filme" | Robô vilão de olhos vermelhos e carimbo "NÃO É ESSE" |
| "esqueceu o carrinho" | 👀 |
| "você fica só com as estratégias" | 😎 "só estratégia" |
| "pode ter certeza" | 💯 |

## Como gerar a voz

1. **Cole o texto inteiro de uma vez** no ElevenLabs e gere um áudio só.
2. **Mesma voz e mesmas configurações da aula 2**, para as aulas soarem iguais.
3. **Ouça antes de mandar.** Se "IA" ou "low ticket" saírem estranhos, gere de novo (ou escreva "i-a" no lugar de
   "IA").
4. **Me avise quando estiver pronto.** Pode deixar em Downloads, como na aula 2. Eu copio para
   `video/audio/aula-03/voz-original.mp3`, faço os cortes que você pedir e monto o vídeo.

## Falas (texto inteiro)

As trocas de slide acontecem em "Olha só o que eu vou te mostrar" (slide 2), "Primeira coisa: os métodos" (slide 3),
"Agora, a parte que eu mais gosto" (slide 4), "E o melhor de tudo: os robôs" (slide 5) e "Então, pra fechar"
(slide 6).

```text
Opa, fala galera, professor na área. Essa aula vai ser rapidinha, tá bom? Antes de a gente seguir, eu quero te mostrar tudo o que vem pela frente aqui dentro. Porque, quando você enxerga o caminho inteiro, fica muito mais fácil saber onde você tá e pra onde você vai.

Olha só o que eu vou te mostrar. Primeiro, os métodos que você vai aprender, um por um. Depois, uma coisa que eu tenho certeza que vai te surpreender: programação. Calma, não precisa se assustar. E no fim, os robôs que vão trabalhar por você.

Primeira coisa: os métodos. Logo depois desta trilha grátis, vem produtos e fornecedores. É ali que eu te passo as dicas de quem vende muito: como achar produto de low ticket, que é aquele de preço baixo, com quem falar pra conseguir esse produto, e como separar o que é tendência do que é só modinha. Depois, você aprende a montar a sua loja virtual e as suas páginas de venda. Aí vem pagamentos, pra você receber por Pix, cartão e boleto. E depois, o que faz o cliente chegar até você: os anúncios. No Facebook e no Instagram, no TikTok e no Google. E ainda tem os marketplaces, que são aqueles sites grandes de compra, onde dá pra vender sem nem ter uma loja própria. É muita coisa? É. Mas é tudo passo a passo, uma coisa de cada vez.

Agora, a parte que eu mais gosto. A gente vai aprender programação. Isso mesmo, programação. Só que do jeito fácil. Antes, pra criar um site, ajustar uma loja ou ligar uma ferramenta na outra, você precisava de um programador. E programador custa caro. Hoje, a inteligência artificial faz boa parte desse trabalho. E aqui dentro a gente vai usar a melhor IA do mercado. Eu vou te ensinar como usar, como pedir as coisas pra ela do jeito certo, e o que você precisa saber pra conferir se o que ela entregou funciona. Que fique claro: você não precisa virar programador. Você precisa saber pedir e saber conferir. O resto, a IA faz.

E o melhor de tudo: os robôs. Robô aqui não é aquele de filme, tá? É uma regra que o computador executa sozinho: quando acontecer isso, faça aquilo. Chegou um pedido? O robô manda pro fornecedor. O produto saiu pra entrega? O robô avisa o cliente. Alguém esqueceu o carrinho? O robô lembra a pessoa. Ou seja: a gente vai botar os robôs pra trabalhar no que é repetitivo, enquanto você fica só com as estratégias. Qual produto vender, qual oferta fazer, onde anunciar. Isso nenhum robô faz por você, e é isso que faz o negócio crescer, pode ter certeza.

Então, pra fechar, duas tarefas rápidas, que tão aqui na tela. Primeira: escolhe qual dessas trilhas mais chamou a sua atenção. Segunda: anota uma tarefa repetitiva que você adoraria deixar com um robô. Guarda essa anotação, que ela vai ser útil mais pra frente. Na próxima aula, a gente volta pro jogo: fornecedor do Brasil ou de fora? Te vejo lá.
```

## Marcações no vídeo (para a edição)

| Slide | O que aparece |
| --- | --- |
| 1 · Capa | Só o slide, com uma aproximação lenta |
| 2 · Nesta aula | Sublinhado em cada tópico do roteiro da aula, quando ele é falado |
| 3 · Os métodos | Cada linha da tabela é destacada quando a voz fala dela; círculo em "low ticket" |
| 4 · Programação | Sublinhado em "a melhor IA do mercado"; os três cartões são contornados um a um (pedir, saber, usar); destaque no "Para lembrar" |
| 5 · Robôs | Marca-texto em "quando acontecer isso, faça aquilo"; ✓ em cada exemplo quando a voz fala dele; círculo em "estratégias" |
| 6 · Pratique | ✓ em cada tarefa; contorno no quadro "Próxima aula" |
