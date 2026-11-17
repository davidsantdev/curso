/**
 * Ilustrações dos PDFs das aulas (SVG original, no estilo das ilustrações do site).
 *
 * - `trackArt`: a cena da capa, uma por trilha, desenhada para ficar sobre o degradê escuro da trilha.
 * - `spotArt`: a ilustração dos tópicos curtos, montada em volta do ícone do tópico.
 * - `practiceArt`: a prancheta da página "Pratique".
 */

export type ArtTheme = { from: string; to: string; deepFrom: string; deepTo: string; soft: string; ink: string };

const NAVY = "#15154d";
const LINE = "#e3e0ff";
const LINE_SOFT = "#efedff";

const grad = (id: string, a: string, b: string) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

/** Degradês e sombras de uma ilustração. `p` é um prefixo único, para os ids não colidirem na página. */
function defs(p: string, t: ArtTheme) {
  return `<defs>
${grad(`${p}a`, t.from, t.to)}
${grad(`${p}p`, "#ffa1ea", "#e94dcf")}
${grad(`${p}m`, "#5ce6cf", "#14b8a0")}
${grad(`${p}s`, "#ffd36b", "#f5a316")}
${grad(`${p}v`, "#a299ff", "#6c5cff")}
<filter id="${p}f" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#120c3d" flood-opacity="0.3"/></filter>
<filter id="${p}g" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#120c3d" flood-opacity="0.22"/></filter>
</defs>`;
}

const bar = (x: number, y: number, w: number, h = 10, fill = LINE) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/>`;

function checkBadge(p: string, cx: number, cy: number, r: number) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}m)" filter="url(#${p}g)"/>
<path d="M${cx - r * 0.42} ${cy + r * 0.02}l${r * 0.3} ${r * 0.3} ${r * 0.56} -${r * 0.6}" stroke="#fff" stroke-width="${r * 0.2}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

const heart = (x: number, y: number, s: number, fill: string) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M12 21s-7.6-4.6-9.7-9.3C.7 8.2 2.9 4.4 6.6 4.4c2.2 0 3.6 1.2 4.4 2.6.8-1.4 2.2-2.6 4.4-2.6 3.7 0 5.9 3.8 4.3 7.3C19.6 16.4 12 21 12 21z" fill="${fill}"/>`;

function star(cx: number, cy: number, r: number, fill: string) {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return `<polygon points="${points.join(" ")}" fill="${fill}"/>`;
}

const route = (d: string) =>
  `<path d="${d}" stroke="#fff" stroke-width="3.5" stroke-dasharray="1 11" stroke-linecap="round" opacity="0.9"/>`;

const cursor = (x: number, y: number) =>
  `<path transform="translate(${x} ${y})" d="M0 0v32l8.5-8 6 13.5 6.5-2.8-6-13.2H26z" fill="${NAVY}" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>`;

function scene(p: string, t: ArtTheme, body: string) {
  return `<svg viewBox="0 0 520 440" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">${defs(p, t)}
<ellipse cx="260" cy="414" rx="210" ry="14" fill="#fff" opacity="0.14"/>${body}</svg>`;
}

/* ------------------------------------------------------------------ */
/* Capas                                                               */
/* ------------------------------------------------------------------ */

const SCENES: Record<string, (p: string, t: ArtTheme) => string> = {
  /** Celular com a compra → caixa do fornecedor → casa do cliente. */
  "vender-sem-estoque": (p, t) => `
${route("M206 132C252 64 318 66 352 122")}
${route("M398 268C414 290 424 300 432 318")}
<g filter="url(#${p}f)"><rect x="40" y="70" width="170" height="306" rx="30" fill="#fff"/></g>
<rect x="54" y="86" width="142" height="274" rx="20" fill="${t.soft}"/>
<rect x="66" y="100" width="118" height="110" rx="14" fill="url(#${p}a)"/>
<rect x="111" y="122" width="28" height="74" rx="11" fill="#fff" opacity="0.95"/>
<rect x="115" y="113" width="20" height="12" rx="4" fill="#fff" opacity="0.8"/>
${bar(66, 222, 92, 10, LINE)}${bar(66, 240, 62, 10, LINE_SOFT)}
<text x="66" y="282" font-family="Jost, sans-serif" font-weight="700" font-size="25" fill="${NAVY}">R$ 99</text>
<rect x="66" y="298" width="118" height="42" rx="13" fill="url(#${p}p)"/>
<text x="125" y="325" text-anchor="middle" font-family="Jost, sans-serif" font-weight="600" font-size="16" fill="#fff">Comprar</text>
<g filter="url(#${p}f)">
<path d="M296 168 360 136 424 168 360 200z" fill="#ffe3b3"/>
<path d="M296 168 360 200v74l-64-32z" fill="#f6b250"/>
<path d="M424 168 360 200v74l64-32z" fill="#e2922a"/>
</g>
<path d="M321 160.5 335 153.5 399 185.5 385 192.5z" fill="#fff" opacity="0.6"/>
<g filter="url(#${p}g)">
<path d="M402 334 452 296 502 334v62H402z" fill="#fff"/>
<rect x="440" y="356" width="24" height="40" rx="6" fill="${t.soft}"/>
</g>
<path d="M394 338 452 292 510 338" stroke="url(#${p}a)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
${checkBadge(p, 494, 270, 24)}`,

  /** Produtos comparados com uma lupa. */
  "produtos-e-fornecedores": (p, t) => `
<g transform="rotate(-11 130 220)" filter="url(#${p}f)">
<rect x="56" y="112" width="150" height="214" rx="22" fill="#fff"/>
<rect x="70" y="126" width="122" height="104" rx="14" fill="url(#${p}s)"/>
<circle cx="131" cy="178" r="28" fill="#fff" opacity="0.9"/>
${bar(70, 244, 90)}${bar(70, 262, 60, 10, LINE_SOFT)}
<text x="70" y="304" font-family="Jost, sans-serif" font-weight="700" font-size="20" fill="${NAVY}">R$ 38</text>
</g>
<g transform="rotate(10 390 220)" filter="url(#${p}f)">
<rect x="314" y="112" width="150" height="214" rx="22" fill="#fff"/>
<rect x="328" y="126" width="122" height="104" rx="14" fill="url(#${p}p)"/>
<rect x="369" y="146" width="40" height="64" rx="12" fill="#fff" opacity="0.9"/>
${bar(328, 244, 90)}${bar(328, 262, 60, 10, LINE_SOFT)}
<text x="328" y="304" font-family="Jost, sans-serif" font-weight="700" font-size="20" fill="${NAVY}">R$ 52</text>
</g>
<g filter="url(#${p}f)">
<rect x="180" y="74" width="164" height="240" rx="24" fill="#fff"/>
</g>
<rect x="195" y="89" width="134" height="118" rx="16" fill="url(#${p}a)"/>
<rect x="246" y="108" width="32" height="82" rx="12" fill="#fff" opacity="0.95"/>
<rect x="251" y="99" width="22" height="13" rx="4" fill="#fff" opacity="0.8"/>
${bar(195, 222, 104)}${bar(195, 240, 70, 10, LINE_SOFT)}
${[0, 1, 2, 3, 4].map((i) => star(203 + i * 20, 270, 8, "#f5a316")).join("")}
<text x="195" y="300" font-family="Jost, sans-serif" font-weight="700" font-size="21" fill="${NAVY}">R$ 45</text>
<g filter="url(#${p}f)">
<rect x="358" y="318" width="96" height="26" rx="13" transform="rotate(42 358 318)" fill="url(#${p}v)"/>
<circle cx="328" cy="282" r="58" fill="#fff" fill-opacity="0.28" stroke="#fff" stroke-width="16"/>
</g>
${checkBadge(p, 448, 92, 24)}`,

  /** Vitrine de loja virtual no navegador. */
  "criar-loja-virtual": (p, t) => `
<g filter="url(#${p}f)"><rect x="34" y="52" width="452" height="320" rx="24" fill="#fff"/></g>
<path d="M34 76a24 24 0 0 1 24-24h404a24 24 0 0 1 24 24v20H34z" fill="${t.soft}"/>
<circle cx="62" cy="74" r="7" fill="#ff8ad8"/><circle cx="84" cy="74" r="7" fill="#ffc55c"/><circle cx="106" cy="74" r="7" fill="#5ce6cf"/>
${bar(134, 66, 220, 16, "#fff")}
${Array.from({ length: 8 }, (_, i) => `<rect x="${58 + i * 50.5}" y="112" width="50.5" height="38" fill="${i % 2 ? t.soft : `url(#${p}a)`}"/>`).join("")}
${Array.from({ length: 8 }, (_, i) => `<path d="M${58 + i * 50.5} 150a25.25 22 0 0 0 50.5 0z" fill="${i % 2 ? t.soft : `url(#${p}a)`}"/>`).join("")}
${[0, 1, 2]
  .map((i) => {
    const x = 66 + i * 134;
    const shapes = [
      `<circle cx="${x + 59}" cy="226" r="26" fill="url(#${p}p)"/>`,
      `<rect x="${x + 35}" y="202" width="48" height="48" rx="12" fill="url(#${p}s)"/>`,
      `<rect x="${x + 46}" y="196" width="26" height="60" rx="10" fill="url(#${p}a)"/>`,
    ];
    return `<rect x="${x}" y="186" width="118" height="92" rx="16" fill="${t.soft}"/>${shapes[i]}${bar(x, 290, 84)}${bar(x, 308, 52, 10, LINE_SOFT)}`;
  })
  .join("")}
<g filter="url(#${p}f)">
<rect x="392" y="296" width="100" height="98" rx="16" fill="url(#${p}p)"/>
</g>
<path d="M418 298v-10a24 24 0 0 1 48 0v10" stroke="#c43aae" stroke-width="7" stroke-linecap="round"/>
<circle cx="476" cy="52" r="20" fill="url(#${p}s)" filter="url(#${p}g)"/>
<text x="476" y="59" text-anchor="middle" font-family="Jost, sans-serif" font-weight="700" font-size="19" fill="#fff">3</text>`,

  /** Página de vendas sendo montada, com cursor e bloco arrastado. */
  "criar-sites-e-paginas": (p, t) => `
<g filter="url(#${p}f)"><rect x="40" y="44" width="400" height="336" rx="24" fill="#fff"/></g>
<path d="M40 68a24 24 0 0 1 24-24h352a24 24 0 0 1 24 24v20H40z" fill="${t.soft}"/>
<circle cx="68" cy="66" r="7" fill="#ff8ad8"/><circle cx="90" cy="66" r="7" fill="#ffc55c"/><circle cx="112" cy="66" r="7" fill="#5ce6cf"/>
<rect x="62" y="106" width="356" height="128" rx="18" fill="url(#${p}a)"/>
${bar(86, 132, 178, 15, "#fff")}${bar(86, 156, 124, 15, "#ffffffcc")}
<rect x="86" y="188" width="104" height="30" rx="15" fill="#fff"/>
<circle cx="356" cy="170" r="40" fill="#fff" opacity="0.28"/>
<circle cx="356" cy="170" r="22" fill="#fff" opacity="0.5"/>
${[0, 1, 2]
  .map(
    (i) =>
      `<rect x="${62 + i * 122}" y="252" width="108" height="104" rx="16" fill="${t.soft}"/><circle cx="${86 + i * 122}" cy="278" r="13" fill="url(#${p}${["p", "s", "m"][i]})"/>${bar(74 + i * 122, 302, 74, 9)}${bar(74 + i * 122, 318, 54, 9, "#fff")}`,
  )
  .join("")}
${cursor(166, 204)}
<g transform="rotate(8 448 304)" filter="url(#${p}f)">
<rect x="384" y="262" width="130" height="86" rx="16" fill="#fff"/>
<rect x="398" y="276" width="40" height="40" rx="10" fill="url(#${p}p)"/>
${bar(448, 280, 52, 9)}${bar(448, 296, 36, 9, LINE_SOFT)}${bar(398, 326, 102, 9, LINE_SOFT)}
</g>`,

  /** Cartão, Pix aprovado no celular e moedas. */
  "pagamentos-e-checkout": (p, t) => {
    const qr = [
      [0, 0, 3], [7, 0, 3], [0, 7, 3],
    ]
      .map(([cx, cy]) => `<rect x="${330 + cx * 10}" y="${108 + cy * 10}" width="30" height="30" rx="5" fill="none" stroke="${NAVY}" stroke-width="6"/><rect x="${340 + cx * 10}" y="${118 + cy * 10}" width="10" height="10" rx="2" fill="${NAVY}"/>`)
      .join("");
    const cells = [
      [4, 0], [5, 1], [4, 2], [6, 3], [3, 4], [4, 4], [6, 5], [8, 4], [9, 5], [4, 6], [5, 7], [7, 7], [9, 7], [4, 9], [6, 9], [8, 8], [9, 9], [0, 4], [1, 5], [2, 4],
    ]
      .map(([cx, cy]) => `<rect x="${330 + cx * 10}" y="${108 + cy * 10}" width="9" height="9" rx="2" fill="${NAVY}"/>`)
      .join("");
    return `
<g transform="rotate(-12 175 190)" filter="url(#${p}f)">
<rect x="50" y="110" width="250" height="160" rx="22" fill="url(#${p}a)"/>
<rect x="78" y="146" width="42" height="32" rx="7" fill="url(#${p}s)"/>
${bar(78, 206, 190, 13, "#ffffffb3")}${bar(78, 230, 90, 11, "#ffffff80")}
<circle cx="250" cy="236" r="15" fill="#fff" opacity="0.7"/><circle cx="268" cy="236" r="15" fill="#fff" opacity="0.45"/>
</g>
<g filter="url(#${p}f)"><rect x="306" y="62" width="170" height="320" rx="30" fill="#fff"/></g>
<rect x="320" y="78" width="142" height="288" rx="20" fill="${t.soft}"/>
<rect x="322" y="100" width="116" height="116" rx="12" fill="#fff"/>
${qr}${cells}
${bar(330, 232, 96)}${bar(330, 250, 64, 10, LINE_SOFT)}
<rect x="330" y="276" width="118" height="40" rx="20" fill="url(#${p}m)"/>
<path d="M346 296l7 7 12-13" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<text x="374" y="302" font-family="Jost, sans-serif" font-weight="600" font-size="15" fill="#fff">Aprovado</text>
<g filter="url(#${p}g)">
${[0, 1, 2]
  .map(
    (i) =>
      `<rect x="92" y="${330 - i * 16}" width="96" height="20" fill="#e2922a"/><ellipse cx="140" cy="${350 - i * 16}" rx="48" ry="14" fill="#e2922a"/><ellipse cx="140" cy="${330 - i * 16}" rx="48" ry="14" fill="url(#${p}s)"/>`,
  )
  .join("")}
</g>
${star(214, 300, 10, "#fff")}`;
  },

  /** Publicação patrocinada no feed, com megafone e curtidas. */
  "anuncios-facebook-instagram": (p, t) => `
<g filter="url(#${p}f)"><rect x="150" y="34" width="220" height="366" rx="32" fill="#fff"/></g>
<rect x="164" y="50" width="192" height="334" rx="22" fill="${t.soft}"/>
<circle cx="192" cy="80" r="14" fill="url(#${p}a)"/>
${bar(214, 70, 84, 9)}
<text x="214" y="96" font-family="Jost, sans-serif" font-weight="500" font-size="11" fill="#8282a3">Patrocinado</text>
<rect x="176" y="108" width="168" height="160" rx="14" fill="url(#${p}a)"/>
<rect x="245" y="132" width="30" height="96" rx="12" fill="#fff" opacity="0.95"/>
<rect x="250" y="122" width="20" height="13" rx="4" fill="#fff" opacity="0.8"/>
${heart(176, 276, 1.05, `url(#${p}p)`)}
<circle cx="220" cy="289" r="10" stroke="${NAVY}" stroke-width="2.6"/>
<path d="M246 280l18 9-18 9 4-9z" stroke="${NAVY}" stroke-width="2.6" stroke-linejoin="round"/>
<rect x="176" y="310" width="168" height="38" rx="11" fill="url(#${p}p)"/>
<text x="260" y="334" text-anchor="middle" font-family="Jost, sans-serif" font-weight="600" font-size="15" fill="#fff">Comprar agora</text>
${bar(176, 360, 118, 8)}
<g filter="url(#${p}f)">
<path d="M56 196 128 160v96L56 220z" fill="url(#${p}s)"/>
<rect x="34" y="190" width="30" height="36" rx="8" fill="#fff"/>
<path d="M66 224 76 260h18l-8-34z" fill="#fff"/>
</g>
<path d="M140 178c10 10 10 50 0 60M150 168c16 16 16 64 0 80" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.85"/>
<g filter="url(#${p}g)"><circle cx="432" cy="132" r="32" fill="url(#${p}p)"/></g>
${heart(416, 118, 1.35, "#fff")}
<g filter="url(#${p}g)"><rect x="386" y="196" width="112" height="40" rx="20" fill="#fff"/></g>
${heart(398, 205, 0.95, "#e94dcf")}
<text x="428" y="222" font-family="Jost, sans-serif" font-weight="700" font-size="16" fill="${NAVY}">1,2 mil</text>
${star(440, 300, 12, "#fff")}${star(470, 330, 7, "#ffffffb3")}`,

  /** Vídeo vertical com ações laterais, nota musical e claquete. */
  "anuncios-tiktok": (p, t) => `
<g filter="url(#${p}f)"><rect x="176" y="26" width="196" height="374" rx="32" fill="#fff"/></g>
<rect x="188" y="40" width="172" height="346" rx="22" fill="url(#${p}a)"/>
<rect x="188" y="246" width="172" height="140" rx="22" fill="${NAVY}" opacity="0.18"/>
<circle cx="274" cy="176" r="40" fill="#fff" opacity="0.28"/>
<path d="M262 154v44l36-22z" fill="#fff"/>
${[0, 1, 2]
  .map((i) => `<circle cx="336" cy="${246 + i * 40}" r="15" fill="#fff" opacity="0.92"/>`)
  .join("")}
${heart(327.5, 238, 0.72, "#e94dcf")}
<circle cx="336" cy="286" r="6" stroke="${NAVY}" stroke-width="2.4"/>
<path d="M330 322l12 4-12 4z" fill="${NAVY}"/>
${bar(202, 326, 104, 9, "#ffffffd9")}${bar(202, 344, 72, 8, "#ffffffa6")}
<rect x="200" y="368" width="148" height="4" rx="2" fill="#fff" opacity="0.4"/>
<rect x="200" y="368" width="88" height="4" rx="2" fill="#fff"/>
<g filter="url(#${p}g)">
<circle cx="96" cy="160" r="15" fill="url(#${p}p)"/><circle cx="136" cy="148" r="15" fill="url(#${p}p)"/>
<path d="M108 160V100l40-10v58" stroke="#e94dcf" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<g transform="rotate(-8 112 320)" filter="url(#${p}f)">
<rect x="48" y="292" width="140" height="88" rx="14" fill="#fff"/>
<rect x="48" y="262" width="140" height="28" rx="8" fill="${NAVY}"/>
${[0, 1, 2, 3].map((i) => `<path d="M${64 + i * 34} 262l18 28h-14l-18-28z" fill="#fff"/>`).join("")}
${bar(66, 314, 100, 10)}${bar(66, 334, 70, 10, LINE_SOFT)}
</g>
${star(430, 120, 14, "#fff")}${star(462, 168, 8, "#ffffffb3")}${star(420, 300, 9, "#ffffffcc")}`,

  /** Busca com resultado patrocinado e alvo. */
  "anuncios-google": (p, t) => `
<g filter="url(#${p}f)"><rect x="34" y="56" width="440" height="66" rx="33" fill="#fff"/></g>
<circle cx="74" cy="87" r="11" stroke="${NAVY}" stroke-width="4"/>
<path d="M82 95l9 9" stroke="${NAVY}" stroke-width="4" stroke-linecap="round"/>
<text x="104" y="96" font-family="Jost, sans-serif" font-weight="500" font-size="21" fill="${NAVY}">garrafa térmica</text>
<rect x="262" y="74" width="3" height="28" rx="1.5" fill="${t.ink}"/>
<g filter="url(#${p}f)"><rect x="34" y="146" width="440" height="240" rx="24" fill="#fff"/></g>
<rect x="60" y="170" width="100" height="24" rx="12" fill="url(#${p}a)"/>
<text x="110" y="187" text-anchor="middle" font-family="Jost, sans-serif" font-weight="600" font-size="12.5" fill="#fff">Patrocinado</text>
${bar(60, 206, 264, 15, t.ink)}${bar(60, 232, 170, 9, "#c7c3f5")}
${bar(60, 252, 340, 9)}${bar(60, 268, 290, 9)}
<rect x="60" y="296" width="388" height="1.5" fill="${LINE}"/>
${bar(60, 316, 230, 13, "#d9d6f5")}${bar(60, 340, 330, 9, LINE_SOFT)}${bar(60, 356, 250, 9, LINE_SOFT)}
${cursor(300, 210)}
<g filter="url(#${p}g)"><circle cx="452" cy="146" r="38" fill="#fff"/></g>
<circle cx="452" cy="146" r="27" fill="url(#${p}p)"/><circle cx="452" cy="146" r="16" fill="#fff"/><circle cx="452" cy="146" r="7" fill="url(#${p}p)"/>`,

  /** Robô com mensagens e engrenagens. */
  "robos-e-automacoes": (p, t) => `
${route("M150 200C170 206 176 196 186 190")}
${route("M352 150C366 140 372 132 382 124")}
<path d="M260 110V80" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
<circle cx="260" cy="72" r="12" fill="url(#${p}p)" filter="url(#${p}g)"/>
<rect x="150" y="160" width="24" height="56" rx="10" fill="url(#${p}a)"/>
<rect x="346" y="160" width="24" height="56" rx="10" fill="url(#${p}a)"/>
<g filter="url(#${p}f)"><rect x="168" y="108" width="184" height="156" rx="46" fill="#fff"/></g>
<rect x="190" y="134" width="140" height="96" rx="32" fill="${NAVY}"/>
<circle cx="232" cy="176" r="13" fill="url(#${p}m)"/><circle cx="288" cy="176" r="13" fill="url(#${p}m)"/>
<path d="M244 206q16 12 32 0" stroke="#5ce6cf" stroke-width="5" stroke-linecap="round"/>
<rect x="214" y="270" width="92" height="22" rx="11" fill="#fff" opacity="0.85"/>
<g filter="url(#${p}f)"><rect x="30" y="160" width="124" height="66" rx="22" fill="#fff"/></g>
${bar(50, 180, 82, 10)}${bar(50, 198, 56, 10, LINE_SOFT)}
<g filter="url(#${p}f)"><rect x="380" y="78" width="122" height="60" rx="22" fill="url(#${p}a)"/></g>
${bar(398, 96, 84, 10, "#fff")}${bar(398, 114, 54, 9, "#ffffffb3")}
<g filter="url(#${p}g)">
<circle cx="418" cy="312" r="36" stroke="#f5a316" stroke-width="14" stroke-dasharray="9 7.157"/>
<circle cx="418" cy="312" r="30" fill="url(#${p}s)"/>
<circle cx="418" cy="312" r="10" fill="#fff"/>
<circle cx="364" cy="364" r="21" stroke="#14b8a0" stroke-width="10" stroke-dasharray="6 4.996"/>
<circle cx="364" cy="364" r="17" fill="url(#${p}m)"/>
<circle cx="364" cy="364" r="6" fill="#fff"/>
</g>
<path d="M112 266 84 318h24l-10 42 38-58h-24l12-36z" fill="url(#${p}p)" filter="url(#${p}g)"/>`,

  /** Anúncios de marketplace, sacola, avaliação e entrega. */
  "vender-em-marketplaces": (p, t) => `
<g transform="rotate(-9 110 190)" filter="url(#${p}f)">
<rect x="40" y="98" width="140" height="190" rx="20" fill="#fff"/>
<rect x="52" y="110" width="116" height="92" rx="12" fill="${t.soft}"/>
<circle cx="110" cy="156" r="26" fill="url(#${p}p)"/>
${bar(52, 214, 92)}${[0, 1, 2, 3, 4].map((i) => star(60 + i * 17, 244, 7, "#f5a316")).join("")}
<text x="52" y="276" font-family="Jost, sans-serif" font-weight="700" font-size="18" fill="${NAVY}">R$ 79</text>
</g>
<g transform="rotate(9 420 190)" filter="url(#${p}f)">
<rect x="350" y="98" width="140" height="190" rx="20" fill="#fff"/>
<rect x="362" y="110" width="116" height="92" rx="12" fill="${t.soft}"/>
<rect x="398" y="128" width="44" height="56" rx="12" fill="url(#${p}m)"/>
${bar(362, 214, 92)}${[0, 1, 2, 3, 4].map((i) => star(370 + i * 17, 244, 7, "#f5a316")).join("")}
<text x="362" y="276" font-family="Jost, sans-serif" font-weight="700" font-size="18" fill="${NAVY}">R$ 64</text>
</g>
<path d="M222 132v-20a38 38 0 0 1 76 0v20" stroke="#fff" stroke-width="10" stroke-linecap="round"/>
<g filter="url(#${p}f)"><rect x="186" y="124" width="148" height="176" rx="24" fill="url(#${p}p)"/></g>
<path d="M226 186a34 34 0 0 0 68 0" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
<g filter="url(#${p}g)"><rect x="196" y="320" width="128" height="46" rx="23" fill="#fff"/></g>
${star(224, 343, 12, "#f5a316")}
<text x="244" y="351" font-family="Jost, sans-serif" font-weight="700" font-size="20" fill="${NAVY}">4,9</text>
<text x="280" y="351" font-family="Jost, sans-serif" font-weight="500" font-size="13" fill="#8282a3">(312)</text>
<g filter="url(#${p}g)">
<rect x="376" y="324" width="76" height="48" rx="8" fill="#fff"/>
<path d="M452 336h22l14 16v20h-36z" fill="#fff"/>
</g>
<rect x="458" y="342" width="14" height="12" rx="2" fill="${t.soft}"/>
<circle cx="398" cy="374" r="10" fill="${NAVY}"/><circle cx="466" cy="374" r="10" fill="${NAVY}"/>
<circle cx="398" cy="374" r="4" fill="#fff"/><circle cx="466" cy="374" r="4" fill="#fff"/>
<g filter="url(#${p}g)"><circle cx="86" cy="340" r="30" fill="url(#${p}p)"/></g>
<text x="86" y="350" text-anchor="middle" font-family="Jost, sans-serif" font-weight="700" font-size="28" fill="#fff">%</text>`,
};

export function trackArt(slug: string, theme: ArtTheme): string {
  const draw = SCENES[slug];
  return draw ? scene("cv", theme, draw("cv", theme)) : "";
}

/* ------------------------------------------------------------------ */
/* Tópicos e prática                                                   */
/* ------------------------------------------------------------------ */

/** Coloca um ícone (SVG do lucide) dentro de outro SVG, na posição e no tamanho dados. */
function placeIcon(icon: string, x: number, y: number, size: number, color: string, stroke = 1.6) {
  return icon
    .replace(/\swidth="24"\s+height="24"/, ` x="${x}" y="${y}" width="${size}" height="${size}"`)
    .replace(/stroke="currentColor"/, `stroke="${color}"`)
    .replace(/stroke-width="2"/, `stroke-width="${stroke}"`)
    .replace(/\sclass="[^"]*"/, "");
}

const hash = (text: string) => [...text].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);

/** Ilustração de um tópico: o ícone em um bloco com degradê, com formas em volta. */
export function spotArt(id: string, icon: string, theme: ArtTheme, seed: string): string {
  const p = `sp${id}`;
  const h = hash(seed);
  const tilt = h % 2 ? -8 : 7;
  const flip = (h >> 1) % 2 === 1;
  const cardX = flip ? 40 : 196;
  const dotX = flip ? 318 : 62;
  return `<svg viewBox="0 0 380 440" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">${defs(p, theme)}
<circle cx="190" cy="214" r="168" fill="${theme.soft}"/>
<circle cx="190" cy="214" r="196" stroke="${theme.from}" stroke-opacity="0.35" stroke-width="2.5" stroke-dasharray="1 12" stroke-linecap="round"/>
<g transform="rotate(${tilt} 190 196)" filter="url(#${p}f)">
<rect x="88" y="94" width="204" height="204" rx="52" fill="url(#${p}a)"/>
</g>
${placeIcon(icon, 134, 140, 112, "#fff", 1.5)}
<g transform="rotate(${flip ? -6 : 6} ${cardX + 74} 352)" filter="url(#${p}g)">
<rect x="${cardX}" y="322" width="148" height="62" rx="18" fill="#fff"/>
<circle cx="${cardX + 30}" cy="353" r="14" fill="url(#${p}m)"/>
<path d="M${cardX + 24} 353.5l4.5 4.5 8-8.5" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
${bar(cardX + 54, 340, 74, 9)}${bar(cardX + 54, 356, 48, 9, LINE_SOFT)}
</g>
<circle cx="${dotX}" cy="96" r="15" fill="url(#${p}p)" filter="url(#${p}g)"/>
<rect x="${flip ? 52 : 300}" y="${(h >> 2) % 2 ? 236 : 190}" width="26" height="26" rx="7" transform="rotate(18 ${flip ? 65 : 313} ${(h >> 2) % 2 ? 249 : 203})" fill="url(#${p}s)" filter="url(#${p}g)"/>
${star(flip ? 300 : 80, 300, 9, theme.from)}
</svg>`;
}

/** Prancheta com tarefas, para a página "Pratique". */
export function practiceArt(theme: ArtTheme): string {
  const p = "pr";
  const rows = [0, 1, 2]
    .map((i) => {
      const y = 170 + i * 58;
      const done = i < 2;
      return `<circle cx="138" cy="${y}" r="15" fill="${done ? "#c9f4ea" : "#ffe0f9"}"/>
${done ? `<path d="M131 ${y + 0.5}l5 5 9-10" stroke="#0d9482" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>` : ""}
${bar(166, y - 7, done ? 100 : 76, 14, LINE)}`;
    })
    .join("");
  return `<svg viewBox="0 0 380 440" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">${defs(p, theme)}
<circle cx="190" cy="220" r="168" fill="${theme.soft}"/>
<ellipse cx="190" cy="404" rx="120" ry="12" fill="${theme.from}" opacity="0.12"/>
<g transform="rotate(-6 190 230)" filter="url(#${p}f)">
<rect x="92" y="88" width="196" height="290" rx="30" fill="url(#${p}a)"/>
<rect x="110" y="122" width="160" height="238" rx="18" fill="#fff"/>
<rect x="148" y="68" width="84" height="44" rx="16" fill="url(#${p}p)"/>
${rows}
</g>
<g filter="url(#${p}f)"><circle cx="300" cy="330" r="42" fill="url(#${p}m)"/></g>
<path d="M281 330l13 13 25-27" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="70" cy="128" r="14" fill="url(#${p}s)" filter="url(#${p}g)"/>
${star(316, 108, 11, theme.from)}
</svg>`;
}
