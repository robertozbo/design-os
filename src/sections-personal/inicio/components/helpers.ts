import type {
  AtividadeTipo,
  CriterioRisco,
  SessaoStatus,
  SessaoTipo,
} from '@/../product-personal/sections/inicio/types'

export function formatBRL(centavos: number): string {
  const reais = centavos / 100
  return reais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

export function formatDeltaBRL(centavos: number): string {
  const sign = centavos > 0 ? '+' : ''
  return `${sign}${formatBRL(centavos)}`
}

export interface SessaoTipoStyle {
  label: string
  badge: string
  dot: string
}

export const SESSAO_TIPO: Record<SessaoTipo, SessaoTipoStyle> = {
  treino: {
    label: 'Treino',
    badge:
      'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    dot: 'bg-teal-500',
  },
  avaliacao: {
    label: 'Avaliação',
    badge:
      'bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    dot: 'bg-violet-500',
  },
  'primeira-consulta': {
    label: 'Primeira',
    badge:
      'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
}

export const SESSAO_STATUS: Record<SessaoStatus, { label: string; tone: string; dot: string }> = {
  agendada: {
    label: 'Agendada',
    tone: 'text-slate-500 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
  confirmada: {
    label: 'Confirmada',
    tone: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  realizada: {
    label: 'Realizada',
    tone: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  cancelada: {
    label: 'Cancelada',
    tone: 'text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
}

export const RISCO_STYLE: Record<
  CriterioRisco,
  { label: string; iconBg: string; iconColor: string }
> = {
  'adesao-baixa': {
    label: 'Adesão baixa',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  'sem-sessao': {
    label: 'Sem sessão',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  dor: {
    label: 'Comentário de dor',
    iconBg: 'bg-red-100 dark:bg-red-900/40',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  'reavaliacao-atrasada': {
    label: 'Reavaliação atrasada',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-600 dark:text-slate-300',
  },
}

export const ATIVIDADE_STYLE: Record<
  AtividadeTipo,
  { iconBg: string; iconColor: string }
> = {
  'sessao-completa': {
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  'sessao-pulada': {
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  mensagem: {
    iconBg: 'bg-teal-100 dark:bg-teal-900/40',
    iconColor: 'text-teal-600 dark:text-teal-400',
  },
  'indicacao-aceita': {
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  'avaliacao-completa': {
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  'comentario-dor': {
    iconBg: 'bg-red-100 dark:bg-red-900/40',
    iconColor: 'text-red-600 dark:text-red-400',
  },
}

/** Compute "now" hour decimal (eg 14:30 → 14.5) for the agenda current-time marker. */
export function nowHourDecimal(date: Date = new Date()): number {
  return date.getHours() + date.getMinutes() / 60
}

/** Parse "HH:MM" → decimal hour */
export function hourStringToDecimal(s: string): number {
  const [h, m] = s.split(':').map(Number)
  return h + m / 60
}
