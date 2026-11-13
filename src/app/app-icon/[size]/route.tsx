import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/brand-image";

/** Ícones do app instalável (usados pelo manifest): /app-icon/192 e /app-icon/512. */
const SIZES = ["192", "512"];

export const dynamicParams = false;

export function generateStaticParams() {
  return SIZES.map((size) => ({ size }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size: sizeParam } = await params;
  if (!SIZES.includes(sizeParam)) return new Response("Tamanho não disponível", { status: 404 });

  const size = Number(sizeParam);
  return new ImageResponse(<AppIcon size={size} />, { width: size, height: size });
}
