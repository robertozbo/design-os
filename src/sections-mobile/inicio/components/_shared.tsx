import {
  Apple,
  Flame,
  Dumbbell,
  Sparkles,
  Utensils,
  MessageSquare,
  Camera,
  Trophy,
  Scale,
  Moon,
  Footprints,
  Droplet,
  Heart,
  Activity,
  type LucideIcon,
} from 'lucide-react'

export const ICON_MAP: Record<string, LucideIcon> = {
  Apple,
  Flame,
  Dumbbell,
  Sparkles,
  Utensils,
  MessageSquare,
  Camera,
  Trophy,
  Scale,
  Moon,
  Footprints,
  Droplet,
  Heart,
  Activity,
}

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkles
}
