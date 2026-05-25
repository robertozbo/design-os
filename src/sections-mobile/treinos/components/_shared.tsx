import {
  Dumbbell,
  Heart,
  Footprints,
  Activity,
  Flame,
  type LucideIcon,
} from 'lucide-react'
import type { TreinoCor } from '@/../product-mobile/sections/treinos/types'
import type { MuscleGroupCategory } from '@/../product-mobile/api-types'

export const COR_BG: Record<TreinoCor, string> = {
  teal: 'bg-teal-500/15',
  sky: 'bg-sky-500/15',
  emerald: 'bg-emerald-500/15',
  amber: 'bg-amber-500/15',
  rose: 'bg-rose-500/15',
  violet: 'bg-violet-500/15',
  orange: 'bg-orange-500/15',
}

export const COR_TEXT: Record<TreinoCor, string> = {
  teal: 'text-teal-300',
  sky: 'text-sky-300',
  emerald: 'text-emerald-300',
  amber: 'text-amber-300',
  rose: 'text-rose-300',
  violet: 'text-violet-300',
  orange: 'text-orange-300',
}

export const COR_BORDER: Record<TreinoCor, string> = {
  teal: 'border-teal-500/30',
  sky: 'border-sky-500/30',
  emerald: 'border-emerald-500/30',
  amber: 'border-amber-500/30',
  rose: 'border-rose-500/30',
  violet: 'border-violet-500/30',
  orange: 'border-orange-500/30',
}

export const COR_GRADIENT: Record<TreinoCor, string> = {
  teal: 'from-teal-500/20 via-slate-900 to-slate-900',
  sky: 'from-sky-500/20 via-slate-900 to-slate-900',
  emerald: 'from-emerald-500/20 via-slate-900 to-slate-900',
  amber: 'from-amber-500/20 via-slate-900 to-slate-900',
  rose: 'from-rose-500/20 via-slate-900 to-slate-900',
  violet: 'from-violet-500/20 via-slate-900 to-slate-900',
  orange: 'from-orange-500/20 via-slate-900 to-slate-900',
}

export const CATEGORY_ICON: Record<MuscleGroupCategory, LucideIcon> = {
  upper_body: Dumbbell,
  lower_body: Footprints,
  core: Activity,
  cardio: Heart,
}

export function iconForExercise(category: MuscleGroupCategory): LucideIcon {
  return CATEGORY_ICON[category] ?? Flame
}

export function formatLoad(loadKg: number | null): string {
  if (loadKg === null) return '—'
  return `${loadKg} kg`
}

export function formatRest(restSeconds: number): string {
  if (restSeconds < 60) return `${restSeconds}s`
  const min = Math.floor(restSeconds / 60)
  const sec = restSeconds % 60
  return sec === 0 ? `${min}min` : `${min}min ${sec}s`
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min}min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}
