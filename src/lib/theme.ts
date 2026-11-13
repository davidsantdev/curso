/** Temas de cor das trilhas. A chave é salva no banco (tracks.color). */
export type TrackTheme = {
  label: string;
  /** Início e fim do degradê claro (ícones, barras de progresso, capas sem texto). */
  from: string;
  to: string;
  /**
   * Degradê escuro, usado quando há texto branco por cima (banners e cabeçalhos).
   * O início tem contraste de pelo menos 4,5:1 com branco e o fim, pelo menos 3:1.
   */
  deepFrom: string;
  deepTo: string;
  /** Fundo claro e cor de texto para selos. */
  soft: string;
  ink: string;
};

export const TRACK_THEMES = {
  violet: {
    label: "Violeta",
    from: "#5868ff",
    to: "#a98bfa",
    deepFrom: "#4f46e5",
    deepTo: "#8b6cf0",
    soft: "#efeeff",
    ink: "#5546e8",
  },
  pink: {
    label: "Rosa",
    from: "#f25fdc",
    to: "#ff9fcf",
    deepFrom: "#c026a8",
    deepTo: "#db4f9a",
    soft: "#ffeefb",
    ink: "#b02a9c",
  },
  blue: {
    label: "Azul",
    from: "#3f8cff",
    to: "#6f5cff",
    deepFrom: "#2563eb",
    deepTo: "#5b5bf0",
    soft: "#e9f2ff",
    ink: "#1d56c9",
  },
  sky: {
    label: "Céu",
    from: "#22b8f0",
    to: "#62d6e8",
    deepFrom: "#0975ad",
    deepTo: "#1491bd",
    soft: "#e6f7fd",
    ink: "#0a6a93",
  },
  mint: {
    label: "Menta",
    from: "#1fc8b4",
    to: "#5fd9a0",
    deepFrom: "#0b7f71",
    deepTo: "#149a74",
    soft: "#e4faf5",
    ink: "#0b7566",
  },
  lime: {
    label: "Lima",
    from: "#4cc46a",
    to: "#a8de5f",
    deepFrom: "#2a7f38",
    deepTo: "#4a9a2c",
    soft: "#ebf9e9",
    ink: "#2a7537",
  },
  sun: {
    label: "Âmbar",
    from: "#ff9f43",
    to: "#ffc55c",
    deepFrom: "#b84f0a",
    deepTo: "#d97706",
    soft: "#fff4e2",
    ink: "#a35200",
  },
  coral: {
    label: "Coral",
    from: "#ff7a6b",
    to: "#ffb38a",
    deepFrom: "#c83c28",
    deepTo: "#e06a48",
    soft: "#fff0ec",
    ink: "#b5371f",
  },
  grape: {
    label: "Uva",
    from: "#9b5cf6",
    to: "#e879f9",
    deepFrom: "#7c3aed",
    deepTo: "#b44ce0",
    soft: "#f6edff",
    ink: "#6d28d9",
  },
} satisfies Record<string, TrackTheme>;

export type TrackThemeKey = keyof typeof TRACK_THEMES;

export const TRACK_THEME_KEYS = Object.keys(TRACK_THEMES) as TrackThemeKey[];

export function getTheme(key: string | null | undefined): TrackTheme {
  return TRACK_THEMES[(key ?? "violet") as TrackThemeKey] ?? TRACK_THEMES.violet;
}

/** Degradê claro (sem texto por cima). */
export function gradient(theme: TrackTheme, angle = 135): string {
  return `linear-gradient(${angle}deg, ${theme.from} 0%, ${theme.to} 100%)`;
}

/** Degradê escuro, para banners com texto branco. */
export function deepGradient(theme: TrackTheme, angle = 120): string {
  return `linear-gradient(${angle}deg, ${theme.deepFrom} 0%, ${theme.deepTo} 100%)`;
}

/** Ícones disponíveis para trilhas (ver src/components/icons.tsx). */
export const TRACK_ICON_KEYS = [
  "package",
  "package-search",
  "shopping-bag",
  "store",
  "globe",
  "credit-card",
  "bot",
  "megaphone",
  "clapperboard",
  "search",
  "target",
  "smartphone",
  "rocket",
  "chart",
  "wallet",
] as const;

export type TrackIconKey = (typeof TRACK_ICON_KEYS)[number];

export const TRACK_ICON_LABEL: Record<TrackIconKey, string> = {
  package: "Caixa",
  "package-search": "Caixa com lupa (produtos)",
  "shopping-bag": "Sacola (loja)",
  store: "Vitrine (marketplace)",
  globe: "Globo (site)",
  "credit-card": "Cartão (pagamentos)",
  bot: "Robô (automação)",
  megaphone: "Megafone (anúncios)",
  clapperboard: "Claquete (vídeos)",
  search: "Lupa (busca)",
  target: "Alvo",
  smartphone: "Celular",
  rocket: "Foguete",
  chart: "Gráfico",
  wallet: "Carteira",
};
