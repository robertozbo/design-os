import {
  ShieldAlert,
  TrendingDown,
  Hourglass,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'
import type {
  NotificationType,
  NotificationUrgency,
  SnoozeDuration,
} from '@/../product/sections/notifica-es-sst/types'

export const TYPE_META: Record<
  NotificationType,
  { icon: LucideIcon; label: string }
> = {
  vigencia: { icon: ShieldAlert, label: 'Vigência' },
  cobertura_baixa: { icon: TrendingDown, label: 'Cobertura' },
  prazo_vencendo: { icon: Hourglass, label: 'Prazo' },
  novo_perigo: { icon: AlertTriangle, label: 'Perigo' },
}

export interface UrgencyTone {
  label: string
  rail: string
  badgeBg: string
  badgeText: string
  iconBg: string
  iconText: string
  ring: string
  dot: string
}

export const URGENCY_TONE: Record<NotificationUrgency, UrgencyTone> = {
  critico: {
    label: 'Crítico',
    rail: 'bg-rose-500 dark:bg-rose-400',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/50',
    badgeText: 'text-rose-700 dark:text-rose-300',
    iconBg: 'bg-rose-50 dark:bg-rose-950/40',
    iconText: 'text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-200 dark:ring-rose-900/60',
    dot: 'bg-rose-500',
  },
  alto: {
    label: 'Alto',
    rail: 'bg-amber-500 dark:bg-amber-400',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
    badgeText: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    iconText: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-200 dark:ring-amber-900/60',
    dot: 'bg-amber-500',
  },
  medio: {
    label: 'Médio',
    rail: 'bg-teal-500 dark:bg-teal-400',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/50',
    badgeText: 'text-teal-700 dark:text-teal-300',
    iconBg: 'bg-teal-50 dark:bg-teal-950/40',
    iconText: 'text-teal-600 dark:text-teal-400',
    ring: 'ring-teal-200 dark:ring-teal-900/60',
    dot: 'bg-teal-500',
  },
  informativo: {
    label: 'Info',
    rail: 'bg-slate-400 dark:bg-slate-500',
    badgeBg: 'bg-slate-100 dark:bg-slate-800/80',
    badgeText: 'text-slate-600 dark:text-slate-300',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconText: 'text-slate-500 dark:text-slate-400',
    ring: 'ring-slate-200 dark:ring-slate-700',
    dot: 'bg-slate-400',
  },
}

export const SNOOZE_OPTIONS: { value: SnoozeDuration; label: string }[] = [
  { value: '1h', label: '1 hora' },
  { value: '3h', label: '3 horas' },
  { value: 'tomorrow', label: 'Amanhã' },
  { value: 'nextWeek', label: 'Próxima semana' },
]

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat('pt-BR', {
  numeric: 'auto',
})

export function formatRelativo(iso: string): string {
  const target = new Date(iso).getTime()
  const now = Date.now()
  const diffMs = target - now
  const diffMin = Math.round(diffMs / 60000)
  const diffH = Math.round(diffMs / 3600000)
  const diffD = Math.round(diffMs / 86400000)
  if (Math.abs(diffMin) < 60) return RELATIVE_FORMATTER.format(diffMin, 'minute')
  if (Math.abs(diffH) < 24) return RELATIVE_FORMATTER.format(diffH, 'hour')
  return RELATIVE_FORMATTER.format(diffD, 'day')
}

export function formatAbsoluto(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function snoozeUntilLabel(iso: string): string {
  const target = new Date(iso)
  const now = new Date()
  const sameDay = target.toDateString() === now.toDateString()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const isTomorrow = target.toDateString() === tomorrow.toDateString()
  const time = target.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  if (sameDay) return `Hoje às ${time}`
  if (isTomorrow) return `Amanhã às ${time}`
  return target.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  }) + ` às ${time}`
}
