import {
  Scale,
  Camera,
  FileText,
  Activity,
  Droplet,
  HeartPulse,
  Apple,
  Sparkles,
  Bot,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import type { IACor } from '@/../product-mobile/sections/ia/types'

export const ICON_MAP: Record<string, LucideIcon> = {
  Scale,
  Camera,
  FileText,
  Activity,
  Droplet,
  HeartPulse,
  Apple,
  Sparkles,
  Bot,
  ChevronRight,
}

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkles
}

const COR_BG: Record<IACor, string> = {
  teal: 'bg-teal-500/15',
  sky: 'bg-sky-500/15',
  emerald: 'bg-emerald-500/15',
  amber: 'bg-amber-500/15',
  rose: 'bg-rose-500/15',
  violet: 'bg-violet-500/15',
}

const COR_TEXT: Record<IACor, string> = {
  teal: 'text-teal-300',
  sky: 'text-sky-300',
  emerald: 'text-emerald-300',
  amber: 'text-amber-300',
  rose: 'text-rose-300',
  violet: 'text-violet-300',
}

const COR_BORDER: Record<IACor, string> = {
  teal: 'hover:border-teal-500/40',
  sky: 'hover:border-sky-500/40',
  emerald: 'hover:border-emerald-500/40',
  amber: 'hover:border-amber-500/40',
  rose: 'hover:border-rose-500/40',
  violet: 'hover:border-violet-500/40',
}

export function bgFromCor(cor: IACor): string {
  return COR_BG[cor]
}

export function textFromCor(cor: IACor): string {
  return COR_TEXT[cor]
}

export function borderHoverFromCor(cor: IACor): string {
  return COR_BORDER[cor]
}
