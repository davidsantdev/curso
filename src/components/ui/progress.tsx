import { cn } from "@/lib/utils";

/**
 * Barra de progresso.
 * O trilho (parte vazia) é sempre um tom claro da mesma cor do preenchimento,
 * para a barra ser lida como uma coisa só.
 */
export function ProgressBar({
  value,
  label,
  from = "#6c5cff",
  to = "#a98bfa",
  track = "#e7e5ff",
  size = "md",
  className,
}: {
  /** 0 a 100 */
  value: number;
  /** Descrição para leitores de tela, ex.: "Progresso na trilha". */
  label: string;
  from?: string;
  to?: string;
  track?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const percent = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("w-full overflow-hidden rounded-full", size === "sm" ? "h-1.5" : "h-2.5", className)}
      style={{ backgroundColor: track }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{
          width: `${percent}%`,
          minWidth: percent > 0 ? "0.5rem" : 0,
          backgroundImage: `linear-gradient(90deg, ${from}, ${to})`,
        }}
      />
    </div>
  );
}

/** Anel de progresso com o percentual no centro. */
export function ProgressRing({
  value,
  label,
  size = 72,
  stroke = 7,
  color = "#6c5cff",
  track = "#e7e5ff",
  textClassName = "text-navy-900",
}: {
  value: number;
  label: string;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  textClassName?: string;
}) {
  const percent = Math.min(100, Math.max(0, Math.round(value)));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
        />
      </svg>
      <span className={cn("absolute inset-0 grid place-items-center text-sm font-semibold", textClassName)}>
        {percent}%
      </span>
    </div>
  );
}
