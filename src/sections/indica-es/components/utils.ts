import type { EstadoConvite } from '@/../product/sections/indica-es/types'

// === Time formatting ===

export function formatRelative(iso: string, now = new Date()): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.round(diffMs / 60_000)
  const diffHour = Math.round(diffMs / 3_600_000)
  const diffDay = Math.round(diffMs / 86_400_000)
  if (diffMin < 60) return diffMin <= 1 ? 'agora' : `há ${diffMin} min`
  if (diffHour < 24) return `há ${diffHour}h`
  if (diffDay === 1) return 'ontem'
  if (diffDay < 30) return `há ${diffDay} dias`
  if (diffDay < 365) return `há ${Math.round(diffDay / 30)}m`
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function diffDays(iso: string, now = new Date()): number {
  const d = new Date(iso)
  return Math.round((now.getTime() - d.getTime()) / 86_400_000)
}

// === State tone helpers ===

export const ESTADO_TONE: Record<
  EstadoConvite,
  {
    label: string
    badgeBg: string
    badgeText: string
    badgeRing: string
    iconBg: string
    iconText: string
    stripeBg: string
  }
> = {
  pendente: {
    label: 'Pendente',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeRing: 'ring-amber-200/60 dark:ring-amber-900/60',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    iconText: 'text-amber-600 dark:text-amber-300',
    stripeBg: 'bg-amber-400 dark:bg-amber-500',
  },
  vinculado: {
    label: 'Vinculado',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeRing: 'ring-emerald-200/60 dark:ring-emerald-900/60',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconText: 'text-emerald-600 dark:text-emerald-300',
    stripeBg: 'bg-emerald-400 dark:bg-emerald-500',
  },
  expirado: {
    label: 'Expirado',
    badgeBg: 'bg-slate-100 dark:bg-slate-800/60',
    badgeText: 'text-slate-600 dark:text-slate-400',
    badgeRing: 'ring-slate-200/60 dark:ring-slate-700/60',
    iconBg: 'bg-slate-100 dark:bg-slate-800/60',
    iconText: 'text-slate-500 dark:text-slate-400',
    stripeBg: 'bg-slate-300 dark:bg-slate-700',
  },
  cancelado: {
    label: 'Cancelado',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeRing: 'ring-rose-200/60 dark:ring-rose-900/60',
    iconBg: 'bg-rose-50 dark:bg-rose-950/40',
    iconText: 'text-rose-600 dark:text-rose-300',
    stripeBg: 'bg-rose-400 dark:bg-rose-500',
  },
}

// === Avatar color classes ===

export const AVATAR_COLOR: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  sky: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
}
