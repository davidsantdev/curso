import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * Faz o site poder ser instalado no celular e no computador como um aplicativo
 * ("Adicionar à tela de início" / "Instalar app").
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    lang: "pt-BR",
    start_url: "/painel",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f6f6fd",
    theme_color: "#6c5cff",
    categories: ["education", "business"],
    icons: [
      { src: "/app-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/app-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/app-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Continuar estudando", url: "/painel" },
      { name: "Trilhas", url: "/trilhas" },
      { name: "Ferramentas", url: "/ferramentas" },
    ],
  };
}
