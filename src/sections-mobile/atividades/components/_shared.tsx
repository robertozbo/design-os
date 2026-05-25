import {
  Flame,
  Dumbbell,
  Activity,
  Footprints,
  Bike,
  Heart,
  Watch,
  Pencil,
  type LucideIcon,
} from 'lucide-react'

export const ICON_MAP: Record<string, LucideIcon> = {
  Flame,
  Dumbbell,
  Activity,
  Footprints,
  Bike,
  Heart,
  Watch,
  Pencil,
}

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Activity
}

const HEX_MAP: Record<string, string> = {
  'rose-300': '#fda4af',
  'amber-300': '#fcd34d',
  'violet-300': '#c4b5fd',
  'sky-300': '#7dd3fc',
  'slate-300': '#cbd5e1',
}

export function hexFromCor(cor: string): string {
  return HEX_MAP[cor] ?? '#94a3b8'
}

const BG_MAP: Record<string, string> = {
  'bg-rose-500/15': 'bg-rose-500/15',
  'bg-amber-500/15': 'bg-amber-500/15',
  'bg-violet-500/15': 'bg-violet-500/15',
  'bg-sky-500/15': 'bg-sky-500/15',
  'bg-slate-700/40': 'bg-slate-700/40',
}

export function bgClass(cls: string): string {
  return BG_MAP[cls] ?? 'bg-slate-700/40'
}
