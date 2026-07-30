import {
  Compass,
  Shield,
  Leaf,
  Heart,
  Map,
  Star,
  Users,
  Award,
  Mountain,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  shield: Shield,
  leaf: Leaf,
  heart: Heart,
  map: Map,
  star: Star,
  users: Users,
  award: Award,
  mountain: Mountain,
  sparkles: Sparkles,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name?.toLowerCase()] ?? Compass;
  return <Cmp className={className} aria-hidden />;
}
