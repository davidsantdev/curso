# Vídeos das aulas

Vídeos editados das aulas (a aula 1 com animações próprias; da aula 2 em diante, sobre os slides do PDF), feitos com [Remotion](https://www.remotion.dev): o vídeo é
código, e cada animação está presa ao momento exato em que a palavra é falada na gravação (`public/voz.mp3`).

- **Vídeo pronto:** `out/aula-01.mp4` (1920×1080, 30 fps, 7 min 19 s)
- **Legenda para o YouTube:** `out/aula-01.srt`
- **Capítulos para a descrição do YouTube:** no roteiro, [`../roteiros/aula-01-vender-sem-estoque.md`](../roteiros/aula-01-vender-sem-estoque.md)

## Comandos

Rode dentro da pasta `video/`:

| Comando | O que faz |
| --- | --- |
| `npm run studio` | Abre o editor no navegador (http://localhost:3200) para assistir e navegar pelo vídeo |
| `npm run render` | Gera `out/aula-01.mp4` (uns 15 a 20 minutos) e ajusta o volume para a referência do YouTube (−14 LUFS) |
| `npm run render:legendado` | Gera a mesma edição com legenda na imagem (`out/aula-01-legendada.mp4`), para redes sociais |
| `npm run render:rascunho` | Versão em meia resolução, bem mais rápida, para conferir |
| `npm run quadros -- 74 186.5` | Gera só alguns quadros (em segundos) em `out/quadros/`, para revisar o visual |
| `npm run sincronizar` | Depois de regravar a voz: transcreve, alinha com o roteiro e refaz a legenda |

## Como funciona

1. `scripts/transcribe.py` transcreve a voz no próprio computador (faster-whisper) com o tempo de cada palavra.
2. `scripts/align.py` junta essa transcrição com o texto do roteiro. O texto vem sempre do roteiro (o
   reconhecimento erra coisas como "embala" ou "R$ 4.500"), e o tempo vem da voz. Resultado: `src/data/palavras.json`.
3. As cenas (`src/cenas/`) não usam segundos fixos: dizem `em("você só paga o fornecedor")`, e o tempo vem da fala.
   Se a voz for regravada com outro ritmo, é só rodar `npm run sincronizar` e renderizar de novo.

Onde mexer:

- **Textos e cenas:** `src/cenas/` (um arquivo por capítulo). `src/marcos.ts` diz onde cada cena começa.
- **Cores e fontes:** `src/tema.ts` (as cores da marca, mais claras para o fundo escuro; Geist, Instrument Serif e Geist Mono).
- **Efeitos sonoros:** `src/sons.ts`. Os sons são sintetizados por `scripts/sfx.py` (sem direitos de terceiros).

Para regravar a voz: troque `public/voz.mp3` (precisa de Python com `faster-whisper`, `av`, `numpy` e `Pillow`),
rode `npm run sincronizar` e depois `npm run render`. Se mudar o texto falado, mude também o roteiro: ele é a
referência do alinhamento.

## Aulas em slides (aula 2 em diante)

A partir da aula 2, o vídeo é o PDF da aula (os slides de `materiais/pdf/`) com a voz e marcações animadas, como se
alguém escrevesse com caneta na tela: círculos, marca-texto, contas escritas à mão, ✓ nas tarefas. A voz pode ser
gravada ou gerada no ElevenLabs.

- **Vídeo pronto:** `out/aula-02.mp4` (8 min 1 s) · **Legendas:** `out/aula-02.srt` (YouTube) e `out/aula-02.vtt` (site)
- **No site:** os arquivos vão para `../public/videos/` (`aula-02.mp4`, `.jpg` de capa e `.vtt`). Na aula, o campo de
  vídeo fica `/videos/aula-02.mp4`.

Passo a passo para uma aula nova (troque 02 pelo número da aula):

1. **Voz:** salve a voz em `audio/aula-02/voz-original.mp3` e transcreva:
   `python scripts/transcribe.py audio/aula-02/voz-original.mp3 audio/aula-02/transcricao-original.json`.
2. **Cortes (opcional):** liste os trechos a tirar em `audio/aula-02/cortes.json` (os tempos vêm da transcrição) e
   as palavras que o reconhecimento errou em `audio/aula-02/correcoes.json`. `npm run audio:aula2` corta a voz sem
   estalos, leva as palavras para o tempo do áudio cortado e copia a voz para `public/aula-02/`.
3. **Slides:** na raiz do site, `PDF_HTML=video/.cache-slides npm run materiais:pdf -- 2`; aqui,
   `npm run slides:aula2` fotografa os slides em 1920×1080 e mede onde fica cada texto (`src/data/aula-02/slides.json`).
4. **Marcações:** em `src/aula2/dados.ts`, cada slide entra numa frase da fala e cada marcação tem o seu momento
   (`em("frase falada")`) e o seu lugar (`el(slide, "cartao", 0)` ou `frase(slide, "R$ 120")`).
5. **Vídeo:** `npm run render:aula2` (uns 10 minutos), depois as legendas:
   `python scripts/legendas.py src/data/aula-02/palavras.json out/aula-02.vtt`.

## Aula 3: estilo da aula 1, mais editada e com memes

`src/aula3/` usa os mesmos componentes da aula 1 (fundo, texto no ritmo da fala, cartões de capítulo, indicador do
canto) com cortes mais rápidos, batidas de câmera (`camera` em `src/aula3/memes.tsx`), efeitos sonoros novos (pop,
ding, caixa registradora, arranhão de disco, glitch, tique-taque, boom e subida, todos de `scripts/sfx.py`) e memes.

- **Os memes são originais:** emoji (Noto Color Emoji, licença livre), letra de meme (Anton) e desenhos em código.
  Não use imagens de memes da internet: elas têm direito autoral e muitas vezes o rosto de gente real.
- **Os componentes leem a aula do contexto** (`src/lib/contexto.ts`): `Fala`, `Barras`, `Hud` e `Legenda` usam as
  palavras, o volume e a duração da aula que estiver no `TempoContexto.Provider`. Sem provedor, valem os da aula 1.
- **Voz em mais de um arquivo:** junte com uma pausa curta (o `ffmpeg` do Remotion, filtro `concat`), transcreva com
  `scripts/transcribe.py` e alinhe com o texto falado em `.txt`: `python scripts/align.py transcricao.json texto.txt
  src/data/aula-03/palavras.json`.
- **Comandos:** `npm run render:aula3` e `npm run render:aula3:legendado`. Para conferir antes:
  `COMPOSICAO=Aula3 node scripts/quadros.mjs 28 84.6 135.9`.

## Cenas de apoio do Higgsfield (opcional)

O vídeo está completo só com animações. Para deixar com cara de comercial, dá para colocar cenas filmadas geradas
por IA atrás dos textos. A extensão do Higgsfield no Claude só lê a conta (créditos, modelos, histórico): **não gera
vídeos**. Gere no site do Higgsfield, com os prompts abaixo, e salve cada arquivo em `public/broll/`.

Sugestão: **Cinema Studio Video 3.0** ou **Seedance 2.5**, 1080p, sem áudio, de 8 a 10 segundos. A conta está no plano
grátis, e os créditos de hoje não cobrem essas cenas.

| Arquivo | Onde entra | Proporção | Prompt |
| --- | --- | --- | --- |
| `casa-vazia.mp4` | 0:35, "não está na sua casa" | 16:9 | Slow cinematic dolly-in through an empty, minimalist bedroom in soft morning light. No products, no boxes, no people. Muted neutral tones, shallow depth of field, 35mm film look. |
| `armazem.mp4` | 0:46, "o fornecedor" | 16:9 | Slow push-in down the aisle of a large distribution warehouse with tall metal shelves full of plain cardboard boxes. Cool moody light, light haze, cinematic, no logos or text. |
| `pacote.mp4` | 1:21, "você já comprou assim" | 16:9 | A plain cardboard package is placed at the front door of a modern house, then a hand picks it up. Warm evening light, shallow depth of field, cinematic commercial look, no logos. |
| `garrafa.mp4` | 1:50, a garrafa térmica | 3:4 | Premium product shot of a matte black stainless-steel thermal bottle slowly rotating on a dark seamless background, soft purple and pink rim light, commercial studio lighting. |
| `estoque-parado.mp4` | 2:50, as 100 garrafas | 3:4 | A cluttered garage packed with stacked unsold cardboard boxes, dust floating in a beam of light, slow dolly, melancholic mood, cinematic. |
| `cliente-esperando.mp4` | 4:26, "o problema é dele" | 16:9 | A person at home on the sofa checking a delivery tracking screen on their phone, slightly frustrated, window light, cinematic, shallow depth of field, no visible logos. |
| `trabalho.mp4` | 5:33, "não é dinheiro fácil" | 16:9 | Over-the-shoulder shot of a person working late at night on a laptop, building an online store, warm desk lamp, city lights bokeh in the window, cinematic, 35mm. |

Para usar uma cena, abra `src/broll.ts` e troque o `null` dela pelo arquivo e pela duração do clipe, por exemplo
`armazem: { arquivo: "armazem.mp4", duracao: 10 }`. Depois rode `npm run render`. O clipe entra escurecido,
atrás do texto, e desacelera um pouco se for mais curto que a cena.

## Trilha musical (opcional)

Coloque o arquivo em `public/musica.mp3` e, em `src/broll.ts`, troque `MUSICA = null` por `MUSICA = "musica.mp3"`.
Ela entra baixinha por baixo da voz, com entrada e saída suaves. Use só música com licença: a Biblioteca de áudio do
YouTube é grátis para vídeos no YouTube, e catálogos pagos (Artlist, Epidemic Sound) liberam qualquer plataforma.

## Licença do Remotion

Grátis, inclusive para uso comercial, para pessoa física e empresas com até 3 funcionários. Acima disso, a
empresa precisa da licença paga ([remotion.dev/license](https://www.remotion.dev/license)).
