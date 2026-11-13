import { ImageResponse } from "next/og";
import { publicSiteUrl, site } from "@/config/site";
import { BrandMark, brandFonts } from "@/lib/brand-image";

/** Imagem que aparece quando o link do site é compartilhado (WhatsApp, Instagram, Facebook…). */
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  // O endereço só aparece quando o site tem um domínio público (nunca "localhost").
  const host = publicSiteUrl()?.replace(/^https?:\/\//, "") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          position: "relative",
          fontFamily: "Jost",
          color: "#ffffff",
          backgroundImage: "linear-gradient(118deg, #5565ff 0%, #7d72f8 34%, #b885ed 68%, #f29bd9 100%)",
        }}
      >
        {/* Círculos decorativos */}
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -100,
            width: 460,
            height: 460,
            borderRadius: 460,
            background: "rgba(255,255,255,0.13)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -170,
            right: 210,
            width: 340,
            height: 340,
            borderRadius: 340,
            background: "rgba(255,255,255,0.09)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              borderRadius: 22,
              background: "#ffffff",
            }}
          >
            <BrandMark size={50} />
          </div>
          <div style={{ display: "flex", fontSize: 46, fontWeight: 700, letterSpacing: -1 }}>
            {site.name.toLowerCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div style={{ display: "flex", fontSize: 82, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            Venda pela internet sem ter estoque
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 34, fontWeight: 500, lineHeight: 1.3, opacity: 0.94 }}>
            Aprenda do zero: loja, pagamentos, robôs e anúncios.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              padding: "16px 34px",
              borderRadius: 999,
              background: "#ffffff",
              color: "#5a48ee",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            Comece grátis
          </div>
          {host ? <div style={{ display: "flex", fontSize: 28, fontWeight: 500, opacity: 0.92 }}>{host}</div> : null}
        </div>
      </div>
    ),
    { ...size, fonts: await brandFonts() },
  );
}
