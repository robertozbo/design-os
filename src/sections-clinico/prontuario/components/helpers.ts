import type {
  AlertNivel,
  StatusHipotese,
  SeveridadeAlergia,
  TipoHabito,
} from '@/../product-clinico/sections/prontuario/types'

export function formatDataBR(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso + (iso.includes('T') ? '' : 'T12:00:00'))
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatRelativo(iso: string | null): string {
  if (!iso) return 'sem registro'
  const d = new Date(iso + (iso.includes('T') ? '' : 'T12:00:00'))
  const now = new Date()
  const diasAtras = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diasAtras === 0) return 'hoje'
  if (diasAtras === 1) return 'ontem'
  if (diasAtras < 7) return `há ${diasAtras} dias`
  if (diasAtras < 30) return `há ${Math.floor(diasAtras / 7)} sem`
  if (diasAtras < 365) return `há ${Math.floor(diasAtras / 30)} m`
  return `há ${Math.floor(diasAtras / 365)} a`
}

export const ALERT_TEXT: Record<AlertNivel, string> = {
  baixo: 'text-sky-600 dark:text-sky-400',
  normal: 'text-slate-600 dark:text-slate-400',
  alto: 'text-amber-600 dark:text-amber-400',
  critico: 'text-rose-600 dark:text-rose-400',
}

export const HIPOTESE_STYLE: Record<StatusHipotese, { label: string; chip: string }> = {
  provavel: {
    label: 'Provável',
    chip: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50',
  },
  confirmada: {
    label: 'Confirmada',
    chip: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/50',
  },
  descartada: {
    label: 'Descartada',
    chip: 'bg-slate-100 text-slate-500 border-slate-200 line-through dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700',
  },
}

export const ALERGIA_STYLE: Record<SeveridadeAlergia, string> = {
  leve: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50',
  moderada: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/50',
  grave: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50',
}

export const HABITO_LABEL: Record<TipoHabito, string> = {
  tabaco: 'Tabaco',
  alcool: 'Álcool',
  'atividade-fisica': 'Atividade física',
  sono: 'Sono',
}

export const HABITO_ICON: Record<TipoHabito, string> = {
  tabaco: '🚭',
  alcool: '🍷',
  'atividade-fisica': '🏃',
  sono: '🌙',
}
