import type {
  TipoNotificacao,
  UrgenciaNotificacao,
} from '@/../product/sections/notifica-es-nutri/types'

// === Time formatting ===

export function formatRelative(iso: string, now = new Date()): string {
  const then = new Date(iso)
  const diffMs = now.getTime() - then.getTime()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffMs / 60_000)
  const diffHour = Math.round(diffMs / 3_600_000)
  const diffDay = Math.round(diffMs / 86_400_000)

  if (diffSec < 60) return 'agora'
  if (diffMin < 60) return `há ${diffMin} min`
  if (diffHour < 24) return `há ${diffHour}h`
  if (diffDay === 1) return 'ontem'
  if (diffDay < 7) return `há ${diffDay} dias`
  if (diffDay < 30) return `há ${Math.round(diffDay / 7)}sem`
  return then.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function formatAbsolute(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${date} às ${time}`
}

export function formatSnoozeUntil(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const today = new Date()
  const isSameDay =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  const isTomorrow =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate() + 1
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (isSameDay) return `hoje às ${time}`
  if (isTomorrow) return `amanhã às ${time}`
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  return `${date} às ${time}`
}

// === Tone classes per urgency ===

export const URGENCY_TONE: Record<UrgenciaNotificacao, {
  badgeBg: string
  badgeText: string
  badgeRing: string
  stripeBg: string
  iconBg: string
  iconText: string
  label: string
}> = {
  critica: {
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeRing: 'ring-rose-200/60 dark:ring-rose-900/60',
    stripeBg: 'bg-rose-400 dark:bg-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-950/40',
    iconText: 'text-rose-600 dark:text-rose-300',
    label: 'Crítica',
  },
  alta: {
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeRing: 'ring-amber-200/60 dark:ring-amber-900/60',
    stripeBg: 'bg-amber-400 dark:bg-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    iconText: 'text-amber-600 dark:text-amber-300',
    label: 'Alta',
  },
  media: {
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40',
    badgeText: 'text-teal-700 dark:text-teal-300',
    badgeRing: 'ring-teal-200/60 dark:ring-teal-900/60',
    stripeBg: 'bg-teal-400 dark:bg-teal-500',
    iconBg: 'bg-teal-50 dark:bg-teal-950/40',
    iconText: 'text-teal-600 dark:text-teal-300',
    label: 'Média',
  },
  informativa: {
    badgeBg: 'bg-slate-100 dark:bg-slate-800/60',
    badgeText: 'text-slate-600 dark:text-slate-400',
    badgeRing: 'ring-slate-200/60 dark:ring-slate-700/60',
    stripeBg: 'bg-slate-300 dark:bg-slate-700',
    iconBg: 'bg-slate-100 dark:bg-slate-800/60',
    iconText: 'text-slate-600 dark:text-slate-400',
    label: 'Informativa',
  },
}

// === Avatar color classes ===

export const AVATAR_COLOR_CLASS: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  sky: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
}

// === Type label fallback ===

export const TIPO_LABEL: Record<TipoNotificacao, string> = {
  'lembrete-consulta': 'Lembrete',
  'mensagem-paciente': 'Mensagem',
  'adesao-baixa': 'Adesão',
  'prazo-revisao-plano': 'Plano',
  'novo-paciente-vinculou': 'Novo paciente',
  'aniversario-paciente': 'Aniversário',
  'diario-inativo': 'Diário',
  'exame-chegou': 'Exame',
}
