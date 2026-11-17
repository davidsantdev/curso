// Fotografa os slides de uma aula (o HTML que o gerador de PDFs monta) e mede onde fica cada texto,
// para as marcações do vídeo caírem no lugar certo.
//
// uso: node scripts/slides.mjs <aula.html> <pasta das imagens> <saida.json> ["frase 1" "frase 2" ...]
//   ex.: node scripts/slides.mjs .cache-slides/aula-02.html public/aula-02 src/data/aula-02/slides.json "R$ 120" "R$ 29"
//
// O HTML vem de: PDF_HTML=video/.cache-slides npm run materiais:pdf -- <número da aula>   (na raiz do site)
// Saída: <pasta>/slide-N.png (1920x1080) e um JSON com, para cada slide, as caixas (em pixels do vídeo) de:
//   - elementos: título, passos, cartões, tarefas, notas, itens do roteiro, fim do conteúdo;
//   - frases: cada frase pedida, onde ela aparecer no slide (uma lista por ocorrência, com uma caixa por linha).
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const [html, outDir, outJson, ...phrases] = process.argv.slice(2);
if (!html || !outDir || !outJson) {
  console.error("uso: node scripts/slides.mjs <aula.html> <pasta das imagens> <saida.json> [frases...]");
  process.exit(1);
}
const CHROME = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => p && fs.existsSync(p));
const SCALE = 1.5; // 1280x720 -> 1920x1080

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.dirname(outJson), { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--hide-scrollbars"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: SCALE });
  await page.goto(pathToFileURL(path.resolve(html)).href);
  await page.waitForFunction(() => document.documentElement.dataset.pronto === "1", { timeout: 20000 });
  await page.addStyleTag({
    content: "html, body { background: #fff !important; } #deck { display: block !important; padding: 0 !important; } .slide { margin: 0 !important; }",
  });

  const count = await page.$$eval(".slide", (s) => s.length);
  const slides = [];
  for (let i = 0; i < count; i++) {
    // mostra só o slide i, no canto da página
    await page.$$eval(".slide", (all, k) => all.forEach((s, j) => (s.style.display = j === k ? "" : "none")), i);
    const file = `slide-${i + 1}.png`;
    const handle = (await page.$$(".slide"))[i];
    await handle.screenshot({ path: path.join(outDir, file) });

    const info = await page.evaluate(
      (k, wanted, scale) => {
        const slide = document.querySelectorAll(".slide")[k];
        const origin = slide.getBoundingClientRect();
        const box = (r) => ({
          x: Math.round((r.left - origin.left) * scale),
          y: Math.round((r.top - origin.top) * scale),
          w: Math.round(r.width * scale),
          h: Math.round(r.height * scale),
        });
        const elementos = {};
        const take = (name, selector) => {
          const found = [...slide.querySelectorAll(selector)].map((el) => box(el.getBoundingClientRect()));
          if (found.length) elementos[name] = found;
        };
        take("titulo", "h2");
        take("passo", ".passo");
        take("passoTexto", ".passo .txt");
        take("cartao", ".cartao");
        take("tarefa", ".tarefa");
        take("caixa", ".tarefa .box");
        take("seguinte", ".seguinte");
        take("nota", ".nota");
        take("roteiro", ".roteiro li");
        take("aprender", ".aprender li");
        take("paragrafo", ".corpo > p");
        take("arte", ".slide.com-arte .arte, .pratique .arte");
        const corpo = slide.querySelector(".corpo, .tarefas");
        if (corpo) {
          const last = [...corpo.parentElement.querySelectorAll(".corpo > *, .tarefas")].pop();
          const r = corpo.getBoundingClientRect();
          elementos.corpo = [box(r)];
          if (last) elementos.fimDoConteudo = [box(last.getBoundingClientRect())];
        }

        // frases: procura o texto nos nós de texto do slide (cada ocorrência vira uma caixa)
        const frases = {};
        const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
        const nodes = [];
        let full = "";
        while (walker.nextNode()) {
          nodes.push({ node: walker.currentNode, start: full.length });
          full += walker.currentNode.nodeValue;
        }
        const locate = (offset) => {
          let lo = 0;
          for (let j = 0; j < nodes.length; j++) if (nodes[j].start <= offset) lo = j;
          return { node: nodes[lo].node, offset: offset - nodes[lo].start };
        };
        for (const phrase of wanted) {
          let from = 0;
          let at;
          while ((at = full.indexOf(phrase, from)) !== -1) {
            const a = locate(at);
            const b = locate(at + phrase.length - 1);
            const range = document.createRange();
            range.setStart(a.node, a.offset);
            range.setEnd(b.node, b.offset + 1);
            // uma caixa por linha (a frase pode quebrar de linha)
            const lines = [];
            for (const r of range.getClientRects()) {
              if (r.width < 1) continue;
              const same = lines.find((l) => Math.abs(l.top - r.top) < 4);
              if (same) {
                same.right = Math.max(same.right, r.right);
                same.left = Math.min(same.left, r.left);
                same.bottom = Math.max(same.bottom, r.bottom);
              } else lines.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
            }
            (frases[phrase] ??= []).push(
              lines.map((l) => box({ left: l.left, top: l.top, width: l.right - l.left, height: l.bottom - l.top })),
            );
            from = at + phrase.length;
          }
        }
        return { elementos, frases, classe: slide.className };
      },
      i,
      phrases,
      SCALE,
    );
    slides.push({ arquivo: file, ...info });
    console.log(`slide ${i + 1}: ${info.classe} · ${Object.keys(info.frases).length} frases encontradas`);
  }
  fs.writeFileSync(outJson, JSON.stringify({ largura: 1920, altura: 1080, slides }, null, 1));
} finally {
  await browser.close();
}
