import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/brand-image";

/** Ícone usado pelo iPhone e pelo iPad ao adicionar o site à tela de início. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<AppIcon size={size.width} />, size);
}
