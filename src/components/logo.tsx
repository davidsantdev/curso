import { useId } from "react";
import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/** Símbolo da marca: duas cápsulas em degradê formando um "V" (que também lembra um ✓). */
export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  const left = `${id}-left`;
  const right = `${id}-right`;

  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={left} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#35d6c6" />
          <stop offset="1" stopColor="#6c5cff" />
        </linearGradient>
        <linearGradient id={right} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#7c6cff" />
          <stop offset="1" stopColor="#f25fdc" />
        </linearGradient>
      </defs>
      <rect x="6" y="5" width="13" height="29" rx="6.5" transform="rotate(-24 12.5 19.5)" fill={`url(#${left})`} />
      <rect
        x="20.5"
        y="2"
        width="13"
        height="34"
        rx="6.5"
        transform="rotate(24 27 19)"
        fill={`url(#${right})`}
        opacity="0.93"
      />
    </svg>
  );
}

export function Logo({
  href = "/",
  tone = "dark",
  className,
}: {
  href?: string | null;
  tone?: "dark" | "light";
  className?: string;
}) {
  const content = (
    <>
      <LogoMark className="size-9 shrink-0" />
      <span
        className={cn(
          "text-[26px] leading-none font-bold tracking-tight lowercase",
          tone === "light" ? "text-white" : "text-navy-900",
        )}
      >
        {site.name}
      </span>
    </>
  );

  if (!href) return <span className={cn("inline-flex items-center gap-2", className)}>{content}</span>;

  return (
    <Link href={href} className={cn("inline-flex items-center gap-2", className)} aria-label={`${site.name} — início`}>
      {content}
    </Link>
  );
}
