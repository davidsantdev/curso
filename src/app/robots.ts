import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/cursos", "/precos", "/glossario", "/termos", "/privacidade"],
      disallow: ["/admin", "/api", "/painel", "/aula", "/trilhas", "/conta", "/assinatura", "/checkout"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
