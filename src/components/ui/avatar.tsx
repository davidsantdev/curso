import { cn, initials } from "@/lib/utils";

const PALETTES = [
  ["#5868ff", "#a98bfa"],
  ["#f25fdc", "#ff9fcf"],
  ["#1fc8b4", "#5fd9a0"],
  ["#ff9f43", "#ffc55c"],
  ["#3f8cff", "#6f5cff"],
] as const;

/** Avatar com as iniciais; a cor é escolhida a partir do nome (sempre a mesma para a mesma pessoa). */
export function Avatar({ name, className }: { name: string; className?: string }) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const [from, to] = PALETTES[hash % PALETTES.length];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white select-none",
        className,
      )}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials(name)}
    </span>
  );
}
