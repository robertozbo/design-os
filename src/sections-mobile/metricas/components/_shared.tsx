import {
  Scale,
  Activity,
  Heart,
  Footprints,
  Flame,
  Moon,
  Droplet,
  Watch,
  type LucideIcon,
} from 'lucide-react'

export const ICON_MAP: Record<string, LucideIcon> = {
  Scale,
  Activity,
  Heart,
  Footprints,
  Flame,
  Moon,
  Droplet,
  Watch,
}

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Activity
}

const HEX_MAP: Record<string, string> = {
  'teal-300': '#5eead4',
  'teal-400': '#2dd4bf',
  'amber-300': '#fcd34d',
  'amber-400': '#fbbf24',
  'emerald-300': '#6ee7b7',
  'emerald-400': '#34d399',
  'rose-300': '#fda4af',
  'rose-400': '#fb7185',
  'violet-300': '#c4b5fd',
  'violet-400': '#a78bfa',
  'sky-300': '#7dd3fc',
  'sky-400': '#38bdf8',
  'cyan-300': '#67e8f9',
  'cyan-400': '#22d3ee',
  'slate-300': '#cbd5e1',
}

export function hexFromCor(cor: string): string {
  return HEX_MAP[cor] ?? '#94a3b8'
}
