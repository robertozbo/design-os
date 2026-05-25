import type { AlertNivel, Tendencia, IABlocoTipo } from '@/../product-clinico/sections/exames/types'

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

export function formatRelativo(iso: string | null): string {
  if (!iso) return 'sem registro'
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diasAtras = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const horasAtras = Math.floor(diffMs / (1000 * 60 * 60))
  if (diasAtras === 0 && horasAtras === 0) return 'agora'
  if (diasAtras === 0) return `há ${horasAtras}h`
  if (diasAtras === 1) return 'ontem'
  if (diasAtras < 7) return `há ${diasAtras} dias`
  if (diasAtras < 30) return `há ${Math.floor(diasAtras / 7)} sem`
  if (diasAtras < 365) return `há ${Math.floor(diasAtras / 30)} m`
  return `há ${Math.floor(diasAtras / 365)} a`
}

export const ALERT_NIVEL_BG: Record<AlertNivel, string> = {
  baixo: 'bg-sky-50 dark:bg-sky-950/40',
  normal: 'bg-slate-50 dark:bg-slate-900/40',
  alto: 'bg-amber-50 dark:bg-amber-950/40',
  critico: 'bg-rose-50 dark:bg-rose-950/40',
}

export const ALERT_NIVEL_BORDER: Record<AlertNivel, string> = {
  baixo: 'border-sky-200/70 dark:border-sky-900/40',
  normal: 'border-slate-200/70 dark:border-slate-800',
  alto: 'border-amber-200/70 dark:border-amber-900/40',
  critico: 'border-rose-200/70 dark:border-rose-900/40',
}

export const ALERT_NIVEL_TEXT: Record<AlertNivel, string> = {
  baixo: 'text-sky-700 dark:text-sky-300',
  normal: 'text-slate-700 dark:text-slate-300',
  alto: 'text-amber-700 dark:text-amber-300',
  critico: 'text-rose-700 dark:text-rose-300',
}

export const ALERT_NIVEL_LABEL: Record<AlertNivel, string> = {
  baixo: 'Baixo',
  normal: 'Normal',
  alto: 'Alterado',
  critico: 'Crítico',
}

export const TENDENCIA_LABEL: Record<Tendencia, string> = {
  subindo: '↑ subindo',
  caindo: '↓ caindo',
  estavel: '↔ estável',
}

export const IA_BLOCO_STYLE: Record<
  IABlocoTipo,
  { iconBg: string; iconText: string; accent: string }
> = {
  'resumo-laudo': {
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    iconText: 'text-emerald-700 dark:text-emerald-300',
    accent: 'border-l-emerald-500',
  },
  'comparacao-historica': {
    iconBg: 'bg-sky-100 dark:bg-sky-950/60',
    iconText: 'text-sky-700 dark:text-sky-300',
    accent: 'border-l-sky-500',
  },
  'cruzamento-queixa': {
    iconBg: 'bg-amber-100 dark:bg-amber-950/60',
    iconText: 'text-amber-700 dark:text-amber-300',
    accent: 'border-l-amber-500',
  },
  'cruzamento-medicacao': {
    iconBg: 'bg-violet-100 dark:bg-violet-950/60',
    iconText: 'text-violet-700 dark:text-violet-300',
    accent: 'border-l-violet-500',
  },
}
