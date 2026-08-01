import type {
  CorEspecialidade,
  StatusApp,
} from '@/../product-clinic/sections/pacientes/types'

export const AVATAR_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

export const BADGE_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
  rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
  slate: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  sky: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
}

export const STATUS_APP_META: Record<StatusApp, { label: string; badge: string }> = {
  vinculado: {
    label: 'App vinculado',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
  'convite-pendente': {
    label: 'Convite pendente',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  },
  'nao-convidado': {
    label: 'Não convidado',
    badge: 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  },
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function dataCurta(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso + 'T12:00:00')
  return `${d.getDate()} ${MESES[d.getMonth()]}`
}

/** Deriva as iniciais (2 letras) a partir do nome completo. */
export function iniciaisDe(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}
