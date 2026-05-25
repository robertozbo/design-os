import {
  Coffee,
  Apple,
  Utensils,
  Moon,
  Camera,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type { RefeicaoCor } from '@/../product-mobile/sections/nutricao/types'

export const ICON_MAP: Record<string, LucideIcon> = {
  Coffee,
  Apple,
  Utensils,
  Moon,
  Camera,
  Sparkles,
}

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Utensils
}

const COR_BG: Record<RefeicaoCor, string> = {
  amber: 'bg-amber-500/15',
  teal: 'bg-teal-500/15',
  violet: 'bg-violet-500/15',
  rose: 'bg-rose-500/15',
  sky: 'bg-sky-500/15',
  slate: 'bg-slate-700/40',
}

const COR_TEXT: Record<RefeicaoCor, string> = {
  amber: 'text-amber-300',
  teal: 'text-teal-300',
  violet: 'text-violet-300',
  rose: 'text-rose-300',
  sky: 'text-sky-300',
  slate: 'text-slate-300',
}

const COR_HEX: Record<RefeicaoCor, string> = {
  amber: '#fcd34d',
  teal: '#5eead4',
  violet: '#c4b5fd',
  rose: '#fda4af',
  sky: '#7dd3fc',
  slate: '#cbd5e1',
}

export function bgFromCor(cor: RefeicaoCor): string {
  return COR_BG[cor]
}

export function textFromCor(cor: RefeicaoCor): string {
  return COR_TEXT[cor]
}

export function hexFromCor(cor: RefeicaoCor): string {
  return COR_HEX[cor]
}
