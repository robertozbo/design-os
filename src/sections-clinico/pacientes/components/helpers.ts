import type { StatusApp, AlertNivel, StatusPrescricao } from '@/../product-clinico/sections/pacientes/types'

export function formatDataBR(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso + (iso.includes('T') ? '' : 'T12:00:00'))
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDataCurta(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso + (iso.includes('T') ? '' : 'T12:00:00'))
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function formatDataExtenso(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso + (iso.includes('T') ? '' : 'T12:00:00'))
  return d
    .toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    .replace(/^./, (c) => c.toUpperCase())
}

export function formatRelativo(iso: string | null): string {
  if (!iso) return 'sem registro'
  const d = new Date(iso + (iso.includes('T') ? '' : 'T12:00:00'))
  const now = new Date()
  const diasAtras = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diasAtras < 0) return formatDataBR(iso)
  if (diasAtras === 0) return 'hoje'
  if (diasAtras === 1) return 'ontem'
  if (diasAtras < 7) return `há ${diasAtras} dias`
  if (diasAtras < 30) return `há ${Math.floor(diasAtras / 7)} sem`
  if (diasAtras < 365) return `há ${Math.floor(diasAtras / 30)} m`
  return `há ${Math.floor(diasAtras / 365)} a`
}

export function formatPercent(v: number): string {
  return `${Math.round(v * 100)}%`
}

export function inicialsName(nome: string): string {
  const parts = nome.split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const STATUS_APP_LABEL: Record<StatusApp, string> = {
  vinculado: 'Vinculado',
  'convite-pendente': 'Convite pendente',
  'nao-convidado': 'Não convidado',
}

export const STATUS_APP_STYLE: Record<StatusApp, string> = {
  vinculado:
    'border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300',
  'convite-pendente':
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',
  'nao-convidado':
    'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
}

export const STATUS_APP_DOT: Record<StatusApp, string> = {
  vinculado: 'bg-teal-500',
  'convite-pendente': 'bg-amber-500',
  'nao-convidado': 'bg-slate-400 dark:bg-slate-600',
}

export const ALERT_NIVEL_STYLE: Record<AlertNivel, string> = {
  baixo: 'text-sky-600 dark:text-sky-400',
  normal: 'text-slate-600 dark:text-slate-400',
  alto: 'text-amber-600 dark:text-amber-400',
  critico: 'text-rose-600 dark:text-rose-400',
}

export const PRESCRICAO_STATUS_LABEL: Record<StatusPrescricao, string> = {
  ativa: 'Ativa',
  expirada: 'Expirada',
  cancelada: 'Cancelada',
}

export const PRESCRICAO_STATUS_STYLE: Record<StatusPrescricao, string> = {
  ativa: 'border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300',
  expirada: 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
  cancelada: 'border-slate-200 bg-slate-50 text-slate-400 line-through dark:border-slate-800 dark:bg-slate-900',
}
