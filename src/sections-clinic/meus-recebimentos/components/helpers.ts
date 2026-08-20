import type { StatusLinha } from '@/../product-clinic/sections/meus-recebimentos/types'

export function brl(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

/** Sem centavos — para número grande de destaque, onde os centavos só poluem. */
export function brlCurto(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

interface StatusMeta {
  label: string
  chip: string
  barra: string
  texto: string
}

export const STATUS_META: Record<StatusLinha, StatusMeta> = {
  liberado: {
    label: 'Liberado',
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    barra: 'bg-emerald-500',
    texto: 'text-emerald-600 dark:text-emerald-400',
  },
  aguardando: {
    label: 'Aguardando',
    chip: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    barra: 'bg-amber-400',
    texto: 'text-amber-600 dark:text-amber-400',
  },
  glosado: {
    label: 'Glosado',
    chip: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300',
    barra: 'bg-rose-400',
    texto: 'text-rose-600 dark:text-rose-400',
  },
}

/** Chip da fonte: particular é teal, cada convênio tem seu tom fixo. */
export function corFonte(nome: string): string {
  switch (nome) {
    case 'Particular':
      return 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
    case 'Unimed':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
    case 'Bradesco Saúde':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
    case 'Amil':
      return 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
    default:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
  }
}

export function barraFonte(nome: string): string {
  switch (nome) {
    case 'Particular':
      return 'bg-teal-500'
    case 'Unimed':
      return 'bg-emerald-500'
    case 'Bradesco Saúde':
      return 'bg-rose-400'
    case 'Amil':
      return 'bg-sky-500'
    default:
      return 'bg-slate-400'
  }
}
