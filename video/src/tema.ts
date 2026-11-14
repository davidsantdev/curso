import { loadFont as carregarGeist } from "@remotion/google-fonts/Geist";
import { loadFont as carregarGeistMono } from "@remotion/google-fonts/GeistMono";
import { loadFont as carregarInstrument } from "@remotion/google-fonts/InstrumentSerif";

/** Geist nos títulos e textos, Instrument Serif itálica nos destaques, Geist Mono nos rótulos e números. */
export const FONTE = {
  sans: carregarGeist("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] }).fontFamily,
  mono: carregarGeistMono("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] }).fontFamily,
  serif: carregarInstrument("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] }).fontFamily,
};

/** Cores do vídeo: as da marca (roxo -> rosa), mais claras para funcionar sobre o fundo escuro. */
export const COR = {
  fundo: "#07070B",
  texto: "#F6F5FB",
  suave: "rgba(246,245,251,0.66)",
  apagado: "rgba(246,245,251,0.4)",
  fraco: "rgba(246,245,251,0.16)",
  linha: "rgba(255,255,255,0.11)",
  azul: "#8C9BFF",
  violeta: "#A99BFF",
  lilas: "#C9A6F5",
  rosa: "#F4A6DE",
  verde: "#5EE3A1",
  vermelho: "#FF7A93",
};

/** Degradê da marca para textos sobre fundo escuro. */
export const DEGRADE = "linear-gradient(100deg, #8C9BFF 0%, #B49CFB 45%, #F4A6DE 100%)";
/** Degradê da marca original (o mesmo do site), para preenchimentos. */
export const DEGRADE_FORTE = "linear-gradient(118deg, #5565FF 0%, #7D72F8 34%, #B885ED 68%, #F29BD9 100%)";
