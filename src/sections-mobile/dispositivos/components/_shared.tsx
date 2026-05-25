import {
  Watch,
  Activity,
  Scale,
  Heart,
  Footprints,
  Moon,
  Flame,
  Smartphone,
  Wifi,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react'

export const ICON_MAP: Record<string, LucideIcon> = {
  Watch,
  Activity,
  Scale,
  Heart,
  Footprints,
  Moon,
  Flame,
  Smartphone,
  Wifi,
  RefreshCw,
}

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Activity
}

const COLOR_BG_MAP: Record<string, string> = {
  'red-400': 'bg-red-500/15',
  'red-500/15': 'bg-red-500/15',
  'blue-400': 'bg-blue-500/15',
  'blue-500/15': 'bg-blue-500/15',
  'cyan-400': 'bg-cyan-500/15',
  'cyan-500/15': 'bg-cyan-500/15',
  'indigo-400': 'bg-indigo-500/15',
  'orange-400': 'bg-orange-500/15',
  'slate-300': 'bg-slate-500/15',
  'slate-500/15': 'bg-slate-500/15',
  'violet-400': 'bg-violet-500/15',
  'violet-500/15': 'bg-violet-500/15',
  'lime-400': 'bg-lime-500/15',
  'amber-400': 'bg-amber-500/15',
  'amber-500/15': 'bg-amber-500/15',
  'emerald-400': 'bg-emerald-500/15',
  'rose-400': 'bg-rose-500/15',
  'yellow-400': 'bg-yellow-500/15',
  'pink-400': 'bg-pink-500/15',
  'pink-500/15': 'bg-pink-500/15',
  'green-400': 'bg-green-500/15',
  'green-500/15': 'bg-green-500/15',
  'teal-400': 'bg-teal-500/15',
}

const COLOR_TEXT_MAP: Record<string, string> = {
  'red-400': 'text-red-400',
  'blue-400': 'text-blue-400',
  'cyan-400': 'text-cyan-400',
  'indigo-400': 'text-indigo-400',
  'orange-400': 'text-orange-400',
  'slate-300': 'text-slate-300',
  'violet-400': 'text-violet-400',
  'lime-400': 'text-lime-400',
  'amber-400': 'text-amber-400',
  'emerald-400': 'text-emerald-400',
  'rose-400': 'text-rose-400',
  'yellow-400': 'text-yellow-400',
  'pink-400': 'text-pink-400',
  'green-400': 'text-green-400',
  'teal-400': 'text-teal-400',
}

export function bgFromCor(cor: string): string {
  return COLOR_BG_MAP[cor] ?? 'bg-slate-700/40'
}

export function textFromCor(cor: string): string {
  return COLOR_TEXT_MAP[cor] ?? 'text-slate-300'
}
