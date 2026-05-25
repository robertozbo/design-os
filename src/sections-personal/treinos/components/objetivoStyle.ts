import type { Objetivo } from '@/../product-personal/sections/treinos/types'

interface ObjetivoStyle {
  label: string
  badge: string
  dot: string
  bar: string
}

export const OBJETIVO_STYLE: Record<Objetivo, ObjetivoStyle> = {
  hipertrofia: {
    label: 'Hipertrofia',
    badge:
      'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    dot: 'bg-teal-500',
    bar: 'bg-teal-500',
  },
  emagrecimento: {
    label: 'Emagrecimento',
    badge:
      'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
  },
  performance: {
    label: 'Performance',
    badge:
      'bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    dot: 'bg-violet-500',
    bar: 'bg-violet-500',
  },
  reabilitacao: {
    label: 'Reabilitação',
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    dot: 'bg-rose-500',
    bar: 'bg-rose-500',
  },
  geral: {
    label: 'Geral',
    badge:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-400',
    bar: 'bg-slate-400',
  },
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

export function diasAteHoje(dataISO: string): number {
  const d = new Date(dataISO)
  const hoje = new Date()
  d.setHours(0, 0, 0, 0)
  hoje.setHours(0, 0, 0, 0)
  return Math.round((hoje.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatProximaSessao(dataISO: string): string {
  const dias = diasAteHoje(dataISO)
  if (dias < 0) return `em ${Math.abs(dias)} dia${Math.abs(dias) === 1 ? '' : 's'}`
  if (dias === 0) return 'hoje'
  if (dias === 1) return 'ontem'
  return `há ${dias} dias`
}

export function formatDuracao(semanas: number | undefined): string {
  if (!semanas) return 'indeterminado'
  return `${semanas} semana${semanas === 1 ? '' : 's'}`
}
