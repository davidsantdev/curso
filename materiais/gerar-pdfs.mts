/**
 * Gera um PDF por aula, em slides 16:9, para gravar as videoaulas explicando no tablet.
 *
 *   npm run materiais:pdf             → todas as aulas
 *   npm run materiais:pdf -- 2 15 40  → só as aulas com esses números
 *
 * O texto vem de scripts/content (o mesmo do seed). Se existir materiais/resumos/aula-NN.md, o PDF usa esse texto
 * no lugar do conteúdo da aula (a aula 1 é um roteiro falado, então o PDF dela tem um resumo próprio).
 *
 * Como cada PDF é montado:
 * - capa com a ilustração da trilha, nas cores da trilha (as mesmas do site, src/lib/theme.ts);
 * - "Nesta aula": o que o aluno vai aprender e o roteiro da aula;
 * - um slide por tópico ("## " no texto), com ícone. Tópico curto ganha uma ilustração ao lado; o que não cabe
 *   continua no slide seguinte. Listas curtas viram cartões, listas numeradas viram passos, citações viram
 *   quadros de destaque;
 * - "Pratique": as tarefas da aula e a próxima aula.
 *
 * A montagem dos slides (quanto cabe em cada um) roda dentro do Chrome, que depois imprime o PDF.
 * Saída: materiais/pdf/<trilha>/aula-NN-<titulo>.pdf e materiais/lista-de-gravacao.md.
 * Precisa do Google Chrome instalado (ou de CHROME_PATH). Com PDF_HTML=<pasta>, guarda também o HTML de cada aula.
 */
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import * as Lucide from "lucide-react";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TRACKS } from "../scripts/content/index";
import type { LessonSeed, ModuleSeed, TrackSeed } from "../scripts/content/types";
import { site } from "../src/config/site";
import { pdfSlug } from "../src/lib/lesson-pdf-name";
import { getTheme } from "../src/lib/theme";
import { practiceArt, spotArt, trackArt, type ArtTheme } from "./arte.mjs";

const run = promisify(execFile);
const ROOT = path.resolve("materiais");
const OUT = path.join(ROOT, "pdf");
const KEEP_HTML = process.env.PDF_HTML ? path.resolve(process.env.PDF_HTML) : null;

const CHROME = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((candidate) => candidate && existsSync(candidate));

type Item = {
  n: number;
  track: TrackSeed;
  trackIndex: number;
  module: ModuleSeed;
  moduleIndex: number;
  lesson: LessonSeed;
  file: string;
};

const pad = (value: number) => String(value).padStart(2, "0");

/** O mesmo nome que o download do site procura (src/lib/lesson-pdf.ts). */
const slug = pdfSlug;

const plain = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const esc = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Pirâmide desenhada (bloco ```piramide no texto). Uma camada por linha, de cima para baixo, no formato
 * "Título | detalhe"; a última linha, começando com "=", vira o chão embaixo da pirâmide.
 */
function piramide(source: string): string {
  const lines = source.split("\n").map((line) => line.trim()).filter(Boolean);
  const ground = lines.find((line) => line.startsWith("="))?.slice(1).trim();
  const layers = lines.filter((line) => !line.startsWith("=")).map((line) => line.split("|").map((part) => part.trim()));
  const W = 900;
  const H = 120 * layers.length;
  const gap = 10;
  const top = 0.3;
  const widthAt = (y: number) => W * (top + (1 - top) * (y / H));
  const fills = ["var(--to)", "var(--from)", "var(--deep-from)", "var(--deep-to)"];
  const shapes = layers
    .map(([title, detail], i) => {
      const y0 = (i * H) / layers.length + (i ? gap / 2 : 0);
      const y1 = ((i + 1) * H) / layers.length - (i < layers.length - 1 ? gap / 2 : 0);
      const w0 = widthAt(y0);
      const w1 = widthAt(y1);
      const cx = W / 2;
      const points = `${cx - w0 / 2},${y0} ${cx + w0 / 2},${y0} ${cx + w1 / 2},${y1} ${cx - w1 / 2},${y1}`;
      const fill = fills[Math.round((i / Math.max(1, layers.length - 1)) * (fills.length - 2))];
      const mid = (y0 + y1) / 2;
      return `<polygon points="${points}" fill="${fill}" />
<text x="${cx}" y="${detail ? mid - 6 : mid + 10}" text-anchor="middle" font-family="Jost, sans-serif" font-size="30" font-weight="600" fill="#fff">${esc(title)}</text>
${detail ? `<text x="${cx}" y="${mid + 26}" text-anchor="middle" font-family="Jost, sans-serif" font-size="19" font-weight="500" fill="rgba(255,255,255,0.88)">${esc(detail)}</text>` : ""}`;
    })
    .join("");
  const groundBar = ground
    ? `<rect x="-30" y="${H + 18}" width="${W + 60}" height="58" rx="16" fill="var(--soft)" />
<text x="${W / 2}" y="${H + 56}" text-anchor="middle" font-family="Jost, sans-serif" font-size="24" font-weight="600" fill="var(--ink)">${esc(ground)}</text>`
    : "";
  const height = H + (ground ? 82 : 0);
  return `<div class="piramide"><svg viewBox="-34 -4 ${W + 68} ${height + 8}" width="${(W + 68) * 0.88}" height="${(height + 8) * 0.88}">${shapes}${groundBar}</svg></div>`;
}

const markdown = (text: string) =>
  renderToStaticMarkup(createElement(Markdown, { remarkPlugins: [remarkGfm] }, text)).replace(
    /<pre><code class="language-piramide">([\s\S]*?)<\/code><\/pre>/g,
    (_, body: string) =>
      piramide(body.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, "&")),
  );

/** Markdown de uma linha só (títulos), sem o <p> em volta. */
const inline = (text: string) => markdown(text).replace(/^<p>|<\/p>\s*$/g, "");

/* ------------------------------------------------------------------ */
/* Ícones                                                              */
/* ------------------------------------------------------------------ */

/**
 * Ícone de um texto, pela primeira palavra-chave que aparecer (texto sem acentos, em minúsculas).
 * A ordem importa: as regras mais específicas vêm primeiro.
 */
const ICON_RULES: [string, string][] = [
  ["\\b(programa|programacao|programar|programador|codigo)", "CodeXml"],
  ["\\b(metodo|metodos|trilha|trilhas)", "Layers"],
  ["\\b(pix|cartao|cartoes|boleto|parcel|checkout|cobranc|gateway|pagamento|pagamentos)", "CreditCard"],
  ["\\b(reembolso|devoluc|estorno|chargeback|troca)", "RotateCcw"],
  ["\\b(imposto|cnpj|mei\\b|nota fiscal|codigo de defesa|cdc\\b|contrato|lgpd|politica|politicas)", "Scale"],
  ["\\b(golpe|fraude|seguranc|senha|bloquei|banid|proteg)", "ShieldCheck"],
  ["\\b(erro|erros|errad|evite|evitar|cuidado|armadilha|risco|riscos|problema|nao e\\b|nao faca)", "TriangleAlert"],
  ["\\b(conta|calcul|margem|precific|lucro|lucrar)", "Calculator"],
  ["\\b(custo|custos|preco|precos|taxa|taxas|dinheiro|orcamento|faturamento|caixa|reais|investimento)", "Wallet"],
  ["\\b(pixel|metrica|metricas|medi|rastre|relatorio|resultado|resultados|dados|numeros|conversao|ctr|cpc|cpm|roas)", "ChartColumn"],
  ["\\b(publico|publicos|segmenta|interesse|interesses|alvo|persona)", "Target"],
  ["\\b(criativo|criativos|video|videos|gravar|gravacao|roteiro|gancho)", "Clapperboard"],
  ["\\b(foto|fotos|imagem|imagens|banner)", "Image"],
  ["\\b(anuncio|anuncios|campanha|campanhas|impulsion|ads\\b)", "Megaphone"],
  ["\\b(tiktok|tendencia|tendencias|trend|musica)", "Music"],
  ["\\b(google|busca|pesquisa|palavra|palavras|seo)", "Search"],
  ["\\b(fornecedor|fornecedores|fabrica|distribuidor|importa)", "Factory"],
  ["\\b(entrega|envio|frete|prazo de entrega|rastreio|correios|transportadora|logistica)", "Truck"],
  ["\\b(marketplace|marketplaces|mercado livre|shopee|amazon|magalu)", "ShoppingBag"],
  ["\\b(loja|lojas|vitrine|shopify|nuvemshop)", "Store"],
  ["\\b(site|sites|pagina|paginas|landing|dominio|layout|cabecalho|botao)", "AppWindow"],
  ["\\b(robo|robos|automac|automati|inteligencia artificial|ia\\b|chatgpt|bot)", "Bot"],
  ["\\b(atendimento|atender|suporte|whatsapp|mensagem|mensagens|conversa|chat|duvida|duvidas)", "MessageCircle"],
  ["\\b(e-mail|email|e-mails|emails)", "Mail"],
  ["\\b(celular|aplicativo|app\\b|mobile)", "Smartphone"],
  ["\\b(avaliac|reputac|estrela|estrelas|review|depoimento)", "Star"],
  ["\\b(oferta|ofertas|desconto|cupom|promoc|brinde)", "Tag"],
  ["\\b(produto|produtos|catalogo|estoque|mercadoria)", "Package"],
  ["\\b(teste|testar|testes|experiment|otimiz|ajuste|ajustar|melhorar)", "FlaskConical"],
  ["\\b(escala|escalar|crescer|aumentar|crescimento)", "TrendingUp"],
  ["\\b(tempo|dias|semana|semanas|rotina|cronograma|agenda)", "CalendarClock"],
  ["\\b(passo|passos|etapa|etapas|configur|criar|crie|montar|cadastr|instal)", "ListChecks"],
  ["\\b(link|links|url)", "Link"],
  ["\\b(o que e|o que sao|entenda|conceito|ideia|como funciona)", "Lightbulb"],
];
const RULES = ICON_RULES.map(([source, icon]) => [new RegExp(source), icon] as const);
const pickIcon = (text: string) => RULES.find(([pattern]) => pattern.test(plain(text)))?.[1] ?? null;

/** Regras genéricas valem menos quando o ícone é escolhido pelo texto inteiro do tópico. */
const WEAK = new Set(["TriangleAlert", "Lightbulb", "ListChecks", "CalendarClock", "FlaskConical", "Link"]);

/** Ícone pelo assunto mais frequente no texto (para tópicos cujo título não diz nada). */
function dominantIcon(text: string): string | null {
  const source = plain(text);
  let best: string | null = null;
  let bestScore = 0;
  for (const [pattern, icon] of RULES) {
    const hits = source.match(new RegExp(pattern.source, "g"))?.length ?? 0;
    const score = hits * (WEAK.has(icon) ? 0.5 : 1);
    if (score > bestScore) {
      best = icon;
      bestScore = score;
    }
  }
  return bestScore >= 2 ? best : null;
}

const EXTRA_ICONS = ["Lightbulb", "TriangleAlert", "Check", "ArrowRight", "Sparkles", "Clock", "Layers", "Crown", "Gift"];
const pascal = (kebab: string) => kebab.replace(/(^|-)([a-z0-9])/g, (_, __, char: string) => char.toUpperCase());

function iconSvg(name: string): string {
  const component = (Lucide as unknown as Record<string, ComponentType<{ size?: number }>>)[name];
  if (!component) throw new Error(`Ícone "${name}" não existe no lucide-react`);
  return renderToStaticMarkup(createElement(component, { size: 24 }));
}

const ICONS: Record<string, string> = {};
const useIcon = (name: string) => {
  if (!ICONS[name]) ICONS[name] = iconSvg(name);
  return name;
};
for (const name of [...ICON_RULES.map(([, icon]) => icon), ...EXTRA_ICONS]) useIcon(name);
for (const track of TRACKS) useIcon(pascal(track.icon));

/* ------------------------------------------------------------------ */
/* Catálogo                                                            */
/* ------------------------------------------------------------------ */

const items: Item[] = [];
TRACKS.forEach((track, t) => {
  track.modules.forEach((module, m) => {
    for (const lesson of module.lessons) {
      const n = items.length + 1;
      const file = path.join(`${pad(t + 1)}-${track.slug}`, `aula-${pad(n)}-${slug(lesson.title)}.pdf`);
      items.push({ n, track, trackIndex: t + 1, module, moduleIndex: m + 1, lesson, file });
    }
  });
});
const TOTAL = items.length;

type Topic = { title: string; icon: string; html: string; art: string };

/** Divide o texto nos tópicos "## ". O que vem antes do primeiro tópico vira a introdução. */
function topics(item: Item, theme: ArtTheme): Topic[] {
  // texto próprio do PDF: pelo título (não muda quando a ordem das aulas muda) ou, nos antigos, pelo número
  const summaryFile = [
    path.join(ROOT, "resumos", `${slug(item.lesson.title)}.md`),
    path.join(ROOT, "resumos", `aula-${pad(item.n)}.md`),
  ].find((file) => existsSync(file));
  const text = summaryFile ? readFileSync(summaryFile, "utf8") : (item.lesson.content ?? "");
  const parts = text.split(/^## /m);
  const raw: { title: string; body: string }[] = [];
  if (parts[0].trim()) raw.push({ title: "Introdução", body: parts[0] });
  for (const part of parts.slice(1)) {
    const lineEnd = part.indexOf("\n");
    raw.push({
      title: (lineEnd === -1 ? part : part.slice(0, lineEnd)).trim(),
      body: lineEnd === -1 ? "" : part.slice(lineEnd + 1),
    });
  }
  const fallback = pascal(item.track.icon);
  return raw.map((part, index) => {
    // "## Título {icone: Truck}" escolhe o ícone à mão (nomes do lucide-react).
    const chosen = part.title.match(/\{\s*icone:\s*([A-Za-z0-9]+)\s*\}\s*$/);
    const title = part.title.replace(/\{\s*icone:[^}]*\}\s*$/, "").trim();
    const icon = chosen ? useIcon(chosen[1]) : (pickIcon(title) ?? dominantIcon(part.body) ?? fallback);
    return {
      title: inline(title),
      icon,
      html: markdown(part.body),
      art: spotArt(String(index), ICONS[icon], theme, `${item.n}-${title}`),
    };
  });
}

/* ------------------------------------------------------------------ */
/* Estilo                                                              */
/* ------------------------------------------------------------------ */

const font = (file: string) => readFileSync(path.join(ROOT, "fonte", file)).toString("base64");
const FONTS = `
@font-face { font-family: Jost; font-weight: 100 900; src: url(data:font/woff2;base64,${font("jost-latin.woff2")}) format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: Jost; font-weight: 100 900; src: url(data:font/woff2;base64,${font("jost-latin-ext.woff2")}) format("woff2");
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF; }`;

const STYLE = `
@page { size: 1280px 720px; margin: 0; }
:root {
  --navy: #15154d;
  --text: #33335f;
  --muted: #8282a3;
  --line: #e6e4f4;
  --paper: #ffffff;
  --mint: #0d9482;
  --mint-soft: #e6faf6;
  --sun-soft: #fff4e2;
  --sun-ink: #a35200;
}
* { box-sizing: border-box; }
html, body { margin: 0; background: #d9d8e8; }
body {
  font-family: Jost, "Segoe UI", Arial, sans-serif;
  color: var(--text);
  font-size: 21px;
  line-height: 1.5;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
@media screen { #deck { display: grid; gap: 24px; padding: 24px; justify-content: center; } }
@media print { html, body { background: none; } }
svg { display: block; }

.slide {
  position: relative;
  width: 1280px;
  height: 720px;
  overflow: hidden;
  background: var(--paper);
  break-after: page;
}
.slide:last-child { break-after: auto; }

/* ---------- Moldura (topo e rodapé) ---------- */
.topo, .rodape {
  position: absolute;
  left: 84px;
  right: 84px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}
.topo { top: 38px; }
.rodape { bottom: 30px; letter-spacing: 0.04em; text-transform: none; font-size: 14px; }
.topo .aula { color: var(--ink); }
.marca { display: inline-flex; align-items: center; gap: 9px; color: var(--navy); font-weight: 600; }
.marca i { width: 14px; height: 14px; border-radius: 5px; background: linear-gradient(135deg, var(--from), var(--to)); }
.pag { font-variant-numeric: tabular-nums; }

.area { position: absolute; top: 86px; left: 84px; right: 84px; bottom: 76px; display: flex; flex-direction: column; }
.slide.com-arte .area { right: 470px; }
.slide .arte { position: absolute; right: 64px; top: 130px; width: 360px; height: 417px; }
.slide:not(.com-arte) .arte { display: none; }

.olho { margin: 0 0 6px; font-size: 14px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink); }
h2 { margin: 0; font-size: 40px; line-height: 1.12; font-weight: 600; color: var(--navy); text-wrap: balance; }

/* ---------- Capa ---------- */
.capa { background: linear-gradient(118deg, var(--deep-from), var(--deep-to)); color: #fff; }
.capa::before, .capa::after { content: ""; position: absolute; border-radius: 50%; background: rgb(255 255 255 / 0.08); }
.capa::before { width: 640px; height: 640px; right: -180px; top: -200px; }
.capa::after { width: 280px; height: 280px; left: 420px; bottom: -190px; background: rgb(255 255 255 / 0.06); }
.capa-texto {
  position: absolute;
  z-index: 1;
  left: 84px;
  top: 64px;
  bottom: 60px;
  width: 640px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.capa-olho { margin: 0; width: max-content; white-space: nowrap; display: flex; align-items: center; gap: 14px; font-size: 14px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.capa-olho .marca-b { display: inline-flex; align-items: center; gap: 9px; letter-spacing: 0.04em; text-transform: none; font-size: 17px; }
.capa-olho .marca-b i { width: 16px; height: 16px; border-radius: 5px; background: #fff; }
.capa-olho .sep { width: 1px; height: 16px; background: rgb(255 255 255 / 0.5); }
.selo {
  display: inline-block;
  margin-bottom: 22px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.95);
  color: var(--ink);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.capa h1 { margin: 0; font-size: 54px; line-height: 1.08; font-weight: 600; text-wrap: balance; }
.capa .resumo { margin: 20px 0 0; font-size: 23px; line-height: 1.42; color: rgb(255 255 255 / 0.9); max-width: 600px; }
.dados { margin: 0; display: flex; gap: 44px; }
.dados div { min-width: 0; }
.dados dt { font-size: 12.5px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: rgb(255 255 255 / 0.75); margin-bottom: 4px; }
.dados dd { margin: 0; font-size: 18px; font-weight: 500; }
.dados div:first-child { max-width: 300px; }
.capa-arte { position: absolute; z-index: 1; right: 40px; top: 150px; width: 520px; height: 440px; }

/* ---------- Abertura ---------- */
.abertura .area { flex-direction: row; gap: 56px; align-items: stretch; }
.abertura .col { flex: 1; min-width: 0; padding-top: 14px; }
.abertura h2 { margin-bottom: 30px; }
.aprender { list-style: none; margin: 0; padding: 0; display: grid; gap: 18px; }
.aprender li { display: grid; grid-template-columns: 38px 1fr; gap: 16px; align-items: start; font-size: 24px; line-height: 1.35; color: var(--navy); }
.aprender .ck { width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg, var(--from), var(--to)); display: grid; place-items: center; }
.aprender .ck svg { width: 22px; height: 22px; color: #fff; stroke-width: 2.6; }
.roteiro { width: 420px; flex-shrink: 0; align-self: center; padding: 28px 30px; border-radius: 26px; background: var(--soft); }
.roteiro .rot { margin: 0 0 16px; font-size: 13px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink); }
.roteiro ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.roteiro li { display: grid; grid-template-columns: 40px 1fr; gap: 14px; align-items: center; font-size: 18px; line-height: 1.3; color: var(--navy); font-weight: 500; }
.roteiro .mini { width: 40px; height: 40px; border-radius: 12px; background: #fff; display: grid; place-items: center; color: var(--ink); }
.roteiro .mini svg { width: 20px; height: 20px; }
.roteiro.longo li { font-size: 16px; }
.roteiro.longo .mini { width: 34px; height: 34px; }
.roteiro.longo ol { gap: 7px; }

/* ---------- Tópico ---------- */
.cab { display: flex; align-items: center; gap: 22px; margin-bottom: 26px; }
.cab .badge {
  flex-shrink: 0;
  width: 66px;
  height: 66px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--from), var(--to));
  display: grid;
  place-items: center;
  color: #fff;
  box-shadow: 0 12px 24px -12px var(--deep-from);
}
.cab .badge svg { width: 32px; height: 32px; stroke-width: 1.9; }
.cont .cab .badge { width: 52px; height: 52px; border-radius: 16px; }
.cont .cab .badge svg { width: 26px; height: 26px; }
.cont h2 { font-size: 30px; }
.corpo { flex: 1; min-height: 0; overflow: hidden; }
.corpo > * { margin-top: 0; margin-bottom: 18px; }
.corpo > :last-child { margin-bottom: 0 !important; }
.corpo p { max-width: 1000px; }
.corpo strong { color: var(--navy); font-weight: 600; }
.corpo em { color: var(--navy); }
.corpo a { color: var(--ink); text-decoration: none; }
.corpo code { font-family: Consolas, "Cascadia Mono", monospace; font-size: 0.86em; padding: 2px 7px; border-radius: 6px; background: var(--soft); color: var(--navy); }
.corpo h3 { margin: 6px 0 12px; font-size: 26px; line-height: 1.25; font-weight: 600; color: var(--navy); }
.corpo h4 { margin: 6px 0 10px; font-size: 22px; font-weight: 600; color: var(--navy); }
.corpo hr { display: none; }
.rotulo { display: inline-block; margin-bottom: 12px !important; padding: 6px 14px; border-radius: 999px; background: var(--soft); color: var(--ink); font-size: 15px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
.rotulo strong { color: inherit !important; }
.apertado { font-size: 18px; line-height: 1.42; }
.compacto .corpo { font-size: 19px; line-height: 1.42; }
.compacto .corpo > * { margin-bottom: 13px; }
.compacto .cab { margin-bottom: 20px; }
.compacto .cartoes { gap: 12px; }
.compacto .cartao { padding: 13px 18px; font-size: 17.5px; gap: 6px; }
.compacto .cartao .ic { width: 34px; height: 34px; }
.compacto .passo { padding-bottom: 9px; }
.compacto .nota { padding: 14px 22px 14px 16px; }
.compacto .corpo th { padding: 9px 16px; }
.compacto .corpo td { padding: 8px 16px; }
.compacto .corpo table { font-size: 17px; }
.piramide { margin: 6px 0 0 10px; }
.piramide svg { overflow: visible; }

/* lista comum */
.lista { list-style: none; padding: 0; max-width: 1000px; }
.lista li { position: relative; padding-left: 32px; margin-bottom: 9px; }
.lista li::before { content: ""; position: absolute; left: 4px; top: 0.56em; width: 11px; height: 11px; border-radius: 3.5px; background: linear-gradient(135deg, var(--from), var(--to)); }
.lista li p { margin: 0 0 6px; }
.lista ul, .lista ol { margin: 8px 0 0; padding-left: 4px; list-style: none; }
.lista li li::before { background: var(--line); }

/* cartões */
.cartoes { display: grid; gap: 16px; }
.cartoes.c2 { grid-template-columns: repeat(2, 1fr); }
.cartoes.c3 { grid-template-columns: repeat(3, 1fr); }
.cartao {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 20px;
  border-radius: 18px;
  background: var(--paper);
  border: 1.5px solid var(--line);
  font-size: 19px;
  line-height: 1.4;
}
.cartao .ic { width: 40px; height: 40px; border-radius: 12px; background: var(--soft); color: var(--ink); display: grid; place-items: center; }
.cartao .ic svg { width: 21px; height: 21px; }
.cartao .tt { font-size: 20px; line-height: 1.25; color: var(--navy); font-weight: 600; }
.cartao .tx p { margin: 0; }

/* passos */
.passos { display: grid; gap: 0; max-width: 1000px; }
.passo { position: relative; display: grid; grid-template-columns: 40px 1fr; gap: 18px; padding-bottom: 14px; }
.passo .num {
  position: relative;
  z-index: 1;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--from), var(--to));
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  display: grid;
  place-items: center;
  font-variant-numeric: tabular-nums;
}
.passos .passo:not(:last-child)::before { content: ""; position: absolute; left: 19px; top: 40px; bottom: 0; width: 2px; background: var(--soft); }
.passo .txt { padding-top: 5px; min-width: 0; }
.passo .txt p { margin: 0 0 6px; }
.passo .txt ul { margin: 6px 0 0; padding-left: 20px; }

/* fluxo (poucos passos curtos, lado a lado) */
.fluxo { display: grid; gap: 40px; grid-auto-flow: column; grid-auto-columns: 1fr; }
.fluxo .passo { grid-template-columns: 1fr; gap: 12px; padding: 20px 20px 22px; border-radius: 18px; background: var(--soft); font-size: 19px; line-height: 1.38; color: var(--navy); }
.fluxo .passo .txt { padding: 0; }
.fluxo .passo:not(:last-child)::after {
  content: "";
  position: absolute;
  right: -31px;
  top: 50%;
  width: 22px;
  height: 22px;
  margin-top: -11px;
  background: var(--from);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14M13 6l6 6-6 6'/%3E%3C/svg%3E") center / contain no-repeat;
}

/* destaque (citações) */
.nota {
  display: grid;
  grid-template-columns: 46px 1fr;
  gap: 18px;
  align-items: start;
  max-width: 1000px;
  padding: 20px 26px 20px 20px;
  border-radius: 20px;
  background: var(--soft);
  color: var(--navy);
  font-weight: 500;
}
.nota .ic { width: 46px; height: 46px; border-radius: 14px; background: linear-gradient(135deg, var(--from), var(--to)); color: #fff; display: grid; place-items: center; }
.nota .ic svg { width: 24px; height: 24px; }
.nota .rot { display: block; margin: 1px 0 4px; font-size: 13px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink); }
.nota p { margin: 0 0 6px; }
.nota p:last-child { margin: 0; }
.nota.alerta { background: var(--sun-soft); }
.nota.alerta .ic { background: linear-gradient(135deg, #ffc55c, #f08a1c); }
.nota.alerta .rot { color: var(--sun-ink); }

/* tabela */
.corpo table { width: 100%; border-collapse: separate; border-spacing: 0; border: 1.5px solid var(--line); border-radius: 16px; font-size: 18.5px; line-height: 1.38; overflow: hidden; }
.corpo th { padding: 12px 18px; text-align: left; font-weight: 600; color: var(--navy); background: var(--soft); }
.corpo td { padding: 11px 18px; border-top: 1.5px solid var(--line); vertical-align: top; }
.corpo td:first-child { color: var(--navy); font-weight: 500; }
.corpo tr { break-inside: avoid; }

/* ---------- Pratique ---------- */
.pratique .area { right: 470px; }
.pratique h2 { margin-bottom: 26px; }
.tarefas { display: grid; gap: 12px; }
.tarefa { display: grid; grid-template-columns: 28px 1fr; gap: 16px; align-items: start; padding: 16px 20px; border-radius: 16px; border: 1.5px solid var(--line); font-size: 19.5px; line-height: 1.4; color: var(--navy); }
.tarefa .box { width: 26px; height: 26px; margin-top: 1px; border-radius: 8px; border: 2.5px solid var(--from); }
.seguinte { margin-top: auto; display: grid; grid-template-columns: 52px 1fr; gap: 18px; align-items: center; padding: 18px 22px; border-radius: 20px; background: var(--soft); }
.seguinte .ic { width: 52px; height: 52px; border-radius: 16px; background: linear-gradient(135deg, var(--from), var(--to)); color: #fff; display: grid; place-items: center; }
.seguinte .ic svg { width: 26px; height: 26px; }
.seguinte .rot { display: block; font-size: 13px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink); margin-bottom: 2px; }
.seguinte strong { display: block; font-size: 20px; line-height: 1.3; font-weight: 600; color: var(--navy); }
.fim { margin-top: auto; padding: 18px 22px; border-radius: 20px; background: var(--soft); color: var(--navy); font-size: 20px; font-weight: 500; }
`;

/* ------------------------------------------------------------------ */
/* Montagem dos slides (roda no Chrome)                                */
/* ------------------------------------------------------------------ */

const LAYOUT = String.raw`
(async () => {
  const D = JSON.parse(document.getElementById("dados").textContent);
  await document.fonts.ready;
  const deck = document.getElementById("deck");
  const practice = document.getElementById("pratique");
  const plain = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const RULES = D.rules.map(([source, icon]) => [new RegExp(source), icon]);
  const pickIcon = (text) => { const t = plain(text); for (const [re, icon] of RULES) if (re.test(t)) return icon; return null; };
  const icon = (name) => D.icons[name] || "";
  const el = (tag, cls, html) => { const node = document.createElement(tag); if (cls) node.className = cls; if (html != null) node.innerHTML = html; return node; };

  /* ----- peças visuais ----- */
  function steps(ol) {
    const items = [...ol.children];
    const start = Number(ol.getAttribute("start")) || 1;
    const short = items.length >= 2 && items.length <= 4 && items.every((li) => li.textContent.trim().length <= 90 && !li.querySelector("ul, ol, p + p"));
    const wrap = el("div", short ? "fluxo" : "passos");
    items.forEach((li, k) => wrap.append(el("div", "passo", '<span class="num">' + (start + k) + '</span><div class="txt">' + li.innerHTML + "</div>")));
    return wrap;
  }
  function cards(ul) {
    const items = [...ul.children];
    const ok = items.length >= 2 && items.length <= 6 && items.every((li) => li.textContent.trim().length <= 140 && !li.querySelector("ul, ol, p + p"));
    if (!ok) { ul.className = "lista"; return ul; }
    const icons = items.map((li) => pickIcon(li.textContent));
    const withIcons = icons.every(Boolean) && new Set(icons).size >= Math.min(items.length, 3) - 0;
    const n = items.length;
    const wrap = el("div", "cartoes " + (n === 2 || n === 4 ? "c2" : "c3"));
    items.forEach((li, k) => {
      let html = li.innerHTML.trim().replace(/^<p>|<\/p>$/g, "");
      let title = null;
      const lone = html.match(/^<strong>([\s\S]*?)<\/strong>$/);
      const term =
        html.match(/^<strong>([\s\S]*?)<\/strong>\s*(?:[:\u2013\u2014]|\s-\s)\s*([\s\S]+)$/) ||
        html.match(/^<strong>([\s\S]*?[:.])<\/strong>\s*([\s\S]+)$/);
      if (lone) { title = lone[1]; html = ""; }
      else if (term) { title = term[1].replace(/[:.]\s*$/, ""); html = term[2]; }
      const card = el("div", "cartao");
      if (withIcons) card.append(el("span", "ic", icon(icons[k])));
      if (title) card.append(el("strong", "tt", title));
      if (html) card.append(el("div", "tx", html));
      wrap.append(card);
    });
    return wrap;
  }
  function note(blockquote) {
    const warn = /\b(cuidado|atencao|nunca|proibid|golpe|bloquei|risco|evite|nao faca|nao use|perde)/.test(plain(blockquote.textContent));
    return el("div", "nota" + (warn ? " alerta" : ""), '<span class="ic">' + icon(warn ? "TriangleAlert" : "Lightbulb") + '</span><div><span class="rot">' + (warn ? "Atenção" : "Para lembrar") + "</span>" + blockquote.innerHTML + "</div>");
  }
  function enhance(nodes) {
    return nodes.map((node) => {
      if (node.matches("ol")) return steps(node);
      if (node.matches("ul")) return cards(node);
      if (node.matches("blockquote")) return note(node);
      if (node.matches("p") && node.children.length === 1 && node.firstElementChild.matches("strong") && node.textContent.trim() === node.firstElementChild.textContent.trim()) {
        node.className = "rotulo";
      }
      return node;
    });
  }

  /* ----- slides ----- */
  const frame = '<div class="topo"><span>' + D.label + '</span><span class="aula">Aula ' + D.n + '</span></div><div class="rodape"><span class="marca"><i></i>' + D.brand + '</span><span class="pag"></span></div>';
  function topicSlide(topic, index, first, art) {
    const slide = el("section", "slide topico" + (first ? "" : " cont") + (art ? " com-arte" : ""));
    slide.innerHTML = frame +
      '<div class="area"><header class="cab"><span class="badge">' + icon(topic.icon) + '</span><div><p class="olho">Tópico ' + (index + 1) + " de " + D.topics.length + (first ? "" : " · continuação") + "</p><h2>" + topic.title + '</h2></div></header><div class="corpo"></div></div>' +
      (art ? '<div class="arte">' + topic.art + "</div>" : "");
    deck.insertBefore(slide, practice);
    return slide;
  }
  const bodyOf = (slide) => slide.querySelector(".corpo");
  function fits(slide) {
    const body = bodyOf(slide);
    const last = body.lastElementChild;
    if (!last) return true;
    const limit = body.getBoundingClientRect().bottom;
    return last.getBoundingClientRect().bottom <= limit + 0.5 && body.scrollWidth <= body.clientWidth + 1;
  }
  /** Coloca no slide a parte de um bloco (lista, passos, cartões, tabela) que couber. Devolve o que sobrou. */
  function split(slide, block) {
    let source, part, target;
    if (block.matches("ul, ol, .passos, .fluxo, .cartoes")) { source = block; part = block.cloneNode(false); target = part; }
    else if (block.matches("table") && block.tBodies[0]) {
      source = block.tBodies[0];
      part = block.cloneNode(false);
      if (block.tHead) part.append(block.tHead.cloneNode(true));
      target = document.createElement("tbody");
      part.append(target);
    } else return block;
    if (source.children.length < 2) return block;
    bodyOf(slide).append(part);
    let placed = 0;
    while (source.firstElementChild) {
      const piece = source.firstElementChild;
      target.append(piece);
      if (!fits(slide)) { source.prepend(piece); break; }
      placed++;
    }
    if (!placed) { part.remove(); return block; }
    return source.children.length ? block : null;
  }
  const keepsWithNext = (node) => node && (node.matches("h3, h4, .rotulo") || (node.matches("p") && /:\s*$/.test(node.textContent)));

  D.topics.forEach((topic, index) => {
    const template = document.createElement("template");
    template.innerHTML = topic.html;
    const queue = enhance([...template.content.children]);
    // tabela, fluxo, 3 colunas de cartões e pirâmide ocupam a largura toda (a pirâmide deixa espaço para a caneta)
    const wide = queue.some((node) => node.matches("table, .fluxo, .cartoes.c3, .piramide"));
    let slide = topicSlide(topic, index, true, !wide);
    while (queue.length) {
      const block = queue.shift();
      const body = bodyOf(slide);
      body.append(block);
      if (fits(slide)) continue;
      if (slide.classList.contains("com-arte")) {
        slide.classList.remove("com-arte");
        if (fits(slide)) continue;
      }
      if (!slide.classList.contains("compacto")) {
        slide.classList.add("compacto");
        if (fits(slide)) continue;
        slide.classList.remove("compacto");
      }
      block.remove();
      const rest = split(slide, block);
      if (!body.children.length) {
        body.append(rest);
        rest.classList.add("apertado");
        continue;
      }
      const tail = body.lastElementChild;
      if (rest && keepsWithNext(tail) && body.children.length > 1 && tail !== rest) {
        tail.remove();
        queue.unshift(tail, rest);
      } else if (rest) {
        queue.unshift(rest);
      }
      slide = topicSlide(topic, index, false, false);
    }
  });

  const slides = [...document.querySelectorAll(".slide")];
  slides.forEach((slide, k) => { const page = slide.querySelector(".pag"); if (page) page.textContent = (k + 1) + " / " + slides.length; });
  document.documentElement.dataset.slides = String(slides.length);
  document.documentElement.dataset.pronto = "1";
})();
`;

/* ------------------------------------------------------------------ */
/* HTML de uma aula                                                    */
/* ------------------------------------------------------------------ */

function lessonHtml(item: Item): string {
  const { track, module, lesson } = item;
  const theme = getTheme(track.color);
  const list = topics(item, theme);
  const next = items[item.n];
  const label = `Trilha ${pad(item.trackIndex)} · ${track.title}`;
  const frame = `<div class="topo"><span>${esc(label)}</span><span class="aula">Aula ${pad(item.n)}</span></div>
<div class="rodape"><span class="marca"><i></i>${esc(site.name)}</span><span class="pag"></span></div>`;

  const cover = `
<section class="slide capa">
  <div class="capa-texto">
    <p class="capa-olho"><span class="marca-b"><i></i>${esc(site.name)}</span><span class="sep"></span>Trilha ${pad(item.trackIndex)} · ${esc(track.title)}</p>
    <div>
      <span class="selo">Aula ${pad(item.n)} de ${TOTAL}</span>
      <h1>${esc(lesson.title)}</h1>
      <p class="resumo">${esc(lesson.summary)}</p>
    </div>
    <dl class="dados">
      <div><dt>Módulo ${item.moduleIndex}</dt><dd>${esc(module.title)}</dd></div>
      ${lesson.minutes ? `<div><dt>Duração</dt><dd>cerca de ${lesson.minutes} min</dd></div>` : ""}
      <div><dt>Acesso</dt><dd>${track.free ? "Grátis" : "Pro"}</dd></div>
    </dl>
  </div>
  <div class="capa-arte">${trackArt(track.slug, theme)}</div>
</section>`;

  const opening = `
<section class="slide abertura">
  ${frame}
  <div class="area">
    <div class="col">
      <p class="olho">Antes de começar</p>
      <h2>Nesta aula você vai aprender</h2>
      <ul class="aprender">${lesson.learn.map((entry) => `<li><span class="ck">${ICONS.Check}</span><span>${esc(entry)}</span></li>`).join("")}</ul>
    </div>
    <aside class="roteiro${list.length > 6 ? " longo" : ""}">
      <p class="rot">Roteiro da aula</p>
      <ol>${list.map((topic) => `<li><span class="mini">${ICONS[topic.icon]}</span><span>${topic.title}</span></li>`).join("")}</ol>
    </aside>
  </div>
</section>`;

  const nextLabel = next
    ? next.track === track
      ? `Aula ${pad(next.n)} · ${esc(next.lesson.title)}`
      : `Trilha ${pad(next.trackIndex)} · ${esc(next.track.title)}`
    : null;
  const practice = `
<section class="slide pratique com-arte" id="pratique">
  ${frame}
  <div class="area">
    <p class="olho">Depois da aula</p>
    <h2>Pratique</h2>
    <div class="tarefas">${(lesson.tasks ?? []).map((task) => `<div class="tarefa"><span class="box"></span><span>${esc(task)}</span></div>`).join("")}</div>
    ${
      nextLabel
        ? `<div class="seguinte"><span class="ic">${ICONS.ArrowRight}</span><div><span class="rot">${next!.track === track ? "Próxima aula" : "Próxima trilha"}</span><strong>${nextLabel}</strong></div></div>`
        : `<div class="fim">Você chegou ao fim do curso. Parabéns!</div>`
    }
  </div>
  <div class="arte">${practiceArt(theme)}</div>
</section>`;

  const data = {
    n: pad(item.n),
    label: esc(label),
    brand: esc(site.name),
    topics: list.map(({ title, icon, html, art }) => ({ title, icon, html, art })),
    icons: ICONS,
    rules: ICON_RULES,
  };
  const vars = `--from:${theme.from};--to:${theme.to};--deep-from:${theme.deepFrom};--deep-to:${theme.deepTo};--soft:${theme.soft};--ink:${theme.ink};`;

  return `<!doctype html>
<html lang="pt-BR" style="${vars}">
<head>
<meta charset="utf-8">
<title>Aula ${pad(item.n)} · ${esc(lesson.title)}</title>
<style>${FONTS}${STYLE}</style>
</head>
<body>
<main id="deck">${cover}${opening}${practice}</main>
<script type="application/json" id="dados">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
<script>${LAYOUT}</script>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* PDF                                                                 */
/* ------------------------------------------------------------------ */

const pageCount = (file: string) => (readFileSync(file, "latin1").match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length;

async function render(item: Item, work: string, worker: number): Promise<number> {
  const html = path.join(KEEP_HTML ?? work, `aula-${pad(item.n)}.html`);
  const pdf = path.join(OUT, item.file);
  writeFileSync(html, lessonHtml(item));
  mkdirSync(path.dirname(pdf), { recursive: true });
  await run(
    CHROME!,
    [
      "--headless",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${path.join(work, `perfil-${worker}`)}`,
      "--no-pdf-header-footer",
      "--virtual-time-budget=8000",
      `--print-to-pdf=${pdf}`,
      pathToFileURL(html).href,
    ],
    { timeout: 120_000 },
  );
  if (!existsSync(pdf)) throw new Error(`O Chrome não gerou ${item.file}`);
  return pageCount(pdf);
}

async function main() {
  if (!CHROME) {
    console.error("Não encontrei o Google Chrome. Instale-o ou defina CHROME_PATH com o caminho do executável.");
    process.exit(1);
  }
  const wanted = process.argv.slice(2).map(Number).filter(Number.isInteger);
  const queue = wanted.length ? items.filter((item) => wanted.includes(item.n)) : [...items];
  const work = mkdtempSync(path.join(os.tmpdir(), "vendra-pdf-"));
  if (KEEP_HTML) mkdirSync(KEEP_HTML, { recursive: true });
  const pages = new Map<number, number>();
  const started = Date.now();

  try {
    let cursor = 0;
    const worker = async (id: number) => {
      while (cursor < queue.length) {
        const item = queue[cursor++];
        const count = await render(item, work, id);
        pages.set(item.n, count);
        console.log(`aula ${pad(item.n)}  ${String(count).padStart(2)} páginas  ${item.file.replace(/\\/g, "/")}`);
      }
    };
    await Promise.all([1, 2, 3, 4].map(worker));
  } finally {
    rmSync(work, { recursive: true, force: true });
  }

  if (!wanted.length) writeChecklist(pages);
  const total = [...pages.values()].reduce((sum, count) => sum + count, 0);
  console.log(`\n${pages.size} PDFs, ${total} páginas, em ${Math.round((Date.now() - started) / 1000)} s.`);
}

/** Lista de gravação: uma linha por aula, para ir marcando o que já foi gravado. */
function writeChecklist(pages: Map<number, number>) {
  const minutes = items.reduce((sum, item) => sum + (item.lesson.minutes ?? 0), 0);
  const lines = [
    "# Lista de gravação",
    "",
    `${TOTAL} videoaulas, uma por aula, com cerca de ${Math.floor(minutes / 60)} h ${minutes % 60} min de vídeo no total.`,
    "Cada aula tem um PDF em `materiais/pdf/`. Marque com `x` o que já foi gravado.",
    "",
    "> Gerado por `npm run materiais:pdf`. Rodar de novo para todas as aulas recria esta lista e apaga as marcações;",
    "> para refazer só alguns PDFs sem mexer na lista, passe os números das aulas: `npm run materiais:pdf -- 3 4`.",
    "",
  ];
  for (const [t, track] of TRACKS.entries()) {
    const own = items.filter((item) => item.track === track);
    const trackMinutes = own.reduce((sum, item) => sum + (item.lesson.minutes ?? 0), 0);
    lines.push(
      `## Trilha ${pad(t + 1)} · ${track.title} ${track.free ? "(grátis)" : "(Pro)"}`,
      "",
      `${own.length} aulas · cerca de ${trackMinutes} min`,
      "",
    );
    for (const item of own) {
      // aula com vídeo publicado no site (public/videos/aula-NN.mp4) já sai marcada
      const video = `public/videos/aula-${pad(item.n)}.mp4`;
      const hasVideo = existsSync(path.resolve(video));
      const done = hasVideo ? "x" : " ";
      const note = hasVideo ? ` · vídeo pronto em \`${video}\`` : "";
      lines.push(
        `- [${done}] **Aula ${pad(item.n)}** · ${item.lesson.title} · ${item.lesson.minutes ?? "?"} min · ${pages.get(item.n) ?? "?"} páginas · [PDF](pdf/${item.file.replace(/\\/g, "/")})${note}`,
      );
    }
    lines.push("");
  }
  writeFileSync(path.join(ROOT, "lista-de-gravacao.md"), lines.join("\n"));
}

await main();
