import type { AlunoStatus, Objetivo } from '@/../product-personal/sections/alunos/types'

export interface StatusStyle {
  label: string
  badge: string
  dot: string
  rowTone?: string
}

export const STATUS_STYLE: Record<AlunoStatus, StatusStyle> = {
  'em-plano': {
    label: 'Em plano',
    badge:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  pausado: {
    label: 'Pausado',
    badge:
      'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-500',
    rowTone: 'opacity-70',
  },
  'sem-plano': {
    label: 'Sem plano',
    badge:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
  arquivado: {
    label: 'Arquivado',
    badge:
      'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    dot: 'bg-slate-400',
    rowTone: 'opacity-50',
  },
}

export const OBJETIVO_LABEL: Record<Objetivo, string> = {
  hipertrofia: 'Hipertrofia',
  emagrecimento: 'Emagrecimento',
  performance: 'Performance',
  reabilitacao: 'Reabilitação',
  geral: 'Geral',
}

export const OBJETIVO_TONE: Record<Objetivo, string> = {
  hipertrofia: 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  emagrecimento:
    'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  performance:
    'bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  reabilitacao:
    'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  geral: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
}

export function getAdesaoTone(percentual: number) {
  if (percentual >= 85) {
    return {
      bar: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
    }
  }
  if (percentual >= 60) {
    return {
      bar: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
    }
  }
  return {
    bar: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
  }
}

export function diasAteHoje(dataISO: string | null): number | null {
  if (!dataISO) return null
  const d = new Date(dataISO)
  const hoje = new Date()
  d.setHours(0, 0, 0, 0)
  hoje.setHours(0, 0, 0, 0)
  return Math.round((hoje.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatDiasRel(dataISO: string | null): string {
  const dias = diasAteHoje(dataISO)
  if (dias == null) return '—'
  if (dias < 0) return `em ${Math.abs(dias)}d`
  if (dias === 0) return 'hoje'
  if (dias === 1) return 'ontem'
  if (dias < 30) return `há ${dias}d`
  const meses = Math.round(dias / 30)
  return `há ${meses}m`
}

export function formatProximaRel(dataISO: string | undefined): string {
  if (!dataISO) return '—'
  const dias = diasAteHoje(dataISO)
  if (dias == null) return '—'
  if (dias < 0) return `em ${Math.abs(dias)}d`
  if (dias === 0) return 'hoje'
  return `há ${dias}d`
}
