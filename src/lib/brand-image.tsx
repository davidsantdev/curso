import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Peças usadas nas imagens geradas por código (ícone do app e imagem de compartilhamento).
 * Essas imagens são criadas uma vez, na hora do build.
 */

/** Fonte da marca (Jost), para os textos das imagens. */
export async function brandFonts() {
  const [bold, medium] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/jost-latin-700.woff")),
    readFile(join(process.cwd(), "src/assets/fonts/jost-latin-500.woff")),
  ]);
  return [
    { name: "Jost", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Jost", data: medium, weight: 500 as const, style: "normal" as const },
  ];
}

/** O símbolo da marca (o mesmo de src/components/logo.tsx), em SVG puro. */
export function BrandMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <linearGradient id="mark-left" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#35d6c6" />
          <stop offset="1" stopColor="#6c5cff" />
        </linearGradient>
        <linearGradient id="mark-right" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#7c6cff" />
          <stop offset="1" stopColor="#f25fdc" />
        </linearGradient>
      </defs>
      <rect x="6" y="5" width="13" height="29" rx="6.5" transform="rotate(-24 12.5 19.5)" fill="url(#mark-left)" />
      <rect
        x="20.5"
        y="2"
        width="13"
        height="34"
        rx="6.5"
        transform="rotate(24 27 19)"
        fill="url(#mark-right)"
        opacity="0.93"
      />
    </svg>
  );
}

/** Ícone quadrado do app: o símbolo centralizado, com folga para os cortes arredondados do celular. */
export function AppIcon({ size }: { size: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
      }}
    >
      <BrandMark size={Math.round(size * 0.58)} />
    </div>
  );
}
