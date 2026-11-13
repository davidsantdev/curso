import {
  Bot,
  CalendarCheck,
  ChartColumn,
  Clapperboard,
  CreditCard,
  Crown,
  Flame,
  Globe,
  Layers,
  ListChecks,
  Medal,
  Megaphone,
  Package,
  PackageSearch,
  Rocket,
  Search,
  ShoppingBag,
  Smartphone,
  Store,
  Target,
  Trophy,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getTheme, gradient, type TrackIconKey } from "@/lib/theme";
import { cn } from "@/lib/utils";

/* ------------------------- Ícones das trilhas ------------------------- */

const TRACK_ICONS: Record<TrackIconKey, LucideIcon> = {
  package: Package,
  "package-search": PackageSearch,
  "shopping-bag": ShoppingBag,
  store: Store,
  globe: Globe,
  "credit-card": CreditCard,
  bot: Bot,
  megaphone: Megaphone,
  clapperboard: Clapperboard,
  search: Search,
  target: Target,
  smartphone: Smartphone,
  rocket: Rocket,
  chart: ChartColumn,
  wallet: Wallet,
};

export function TrackIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = TRACK_ICONS[icon as TrackIconKey] ?? Package;
  return <Icon className={className} aria-hidden="true" />;
}

/** Quadradinho em degradê com o ícone da trilha. */
export function TrackBadge({
  icon,
  color,
  className,
  iconClassName = "size-6",
}: {
  icon: string;
  color: string;
  className?: string;
  iconClassName?: string;
}) {
  const theme = getTheme(color);
  return (
    <span
      className={cn("grid size-12 shrink-0 place-items-center rounded-2xl text-white", className)}
      style={{ backgroundImage: gradient(theme), boxShadow: `0 12px 24px -12px ${theme.from}` }}
    >
      <TrackIcon icon={icon} className={iconClassName} />
    </span>
  );
}

/* ------------------------ Ícones das conquistas ----------------------- */

const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  rocket: Rocket,
  zap: Zap,
  medal: Medal,
  layers: Layers,
  trophy: Trophy,
  target: Target,
  "list-checks": ListChecks,
  flame: Flame,
  "calendar-check": CalendarCheck,
  crown: Crown,
};

export function AchievementIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = ACHIEVEMENT_ICONS[icon] ?? Trophy;
  return <Icon className={className} aria-hidden="true" />;
}
