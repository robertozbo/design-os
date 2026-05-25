import {
  Scale,
  Activity,
  Footprints,
  Moon,
  Heart,
  Droplet,
  Flame,
  Trophy,
  type LucideIcon,
} from 'lucide-react'

export const ICON_MAP: Record<string, LucideIcon> = {
  Scale,
  Activity,
  Footprints,
  Moon,
  Heart,
  Droplet,
  Flame,
  Trophy,
}

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Activity
}

const HEX_MAP: Record<string, string> = {
  'teal-300': '#5eead4',
  'amber-300': '#fcd34d',
  'sky-300': '#7dd3fc',
  'violet-300': '#c4b5fd',
  'rose-300': '#fda4af',
  'cyan-300': '#67e8f9',
  'emerald-300': '#6ee7b7',
}

export function hexFromCor(cor: string): string {
  return HEX_MAP[cor] ?? '#94a3b8'
}

export function bgClass(cls: string): string {
  return cls
}

const TONE_GRADIENT: Record<string, [string, string]> = {
  cold: ['#475569', '#64748b'], // slate-600 → slate-500
  warm: ['#14b8a6', '#38bdf8'], // teal → sky
  hot: ['#10b981', '#34d399'], // emerald
  done: ['#10b981', '#22d3ee'], // emerald → cyan (festive)
  late: ['#f43f5e', '#fb923c'], // rose → orange
}

export function gradientFromTone(tone: string): [string, string] {
  return TONE_GRADIENT[tone] ?? TONE_GRADIENT.warm
}

const TONE_TEXT: Record<string, string> = {
  cold: 'text-slate-400',
  warm: 'text-teal-300',
  hot: 'text-emerald-300',
  done: 'text-emerald-400',
  late: 'text-rose-400',
}

export function textFromTone(tone: string): string {
  return TONE_TEXT[tone] ?? 'text-slate-400'
}
