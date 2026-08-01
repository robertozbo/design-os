import type { CorEspecialidade, StatusConsulta } from '@/../product-clinic/sections/inicio/types'

export const AVATAR_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

interface StatusMeta {
  label: string
  dot: string
  chip: string
  esmaecido: boolean
}

export const STATUS_META: Record<StatusConsulta, StatusMeta> = {
  confirmado: {
    label: 'Confirmado',
    dot: 'bg-teal-500',
    chip: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
    esmaecido: false,
  },
  aguardando: {
    label: 'Aguardando',
    dot: 'bg-amber-500',
    chip: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    esmaecido: false,
  },
  'em-atendimento': {
    label: 'Em atendimento',
    dot: 'bg-teal-500 animate-pulse',
    chip: 'bg-teal-500 text-white dark:bg-teal-500',
    esmaecido: false,
  },
  realizado: {
    label: 'Realizado',
    dot: 'bg-slate-400',
    chip: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    esmaecido: true,
  },
  faltou: {
    label: 'Faltou',
    dot: 'bg-rose-400',
    chip: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300',
    esmaecido: true,
  },
  cancelado: {
    label: 'Cancelado',
    dot: 'bg-slate-300',
    chip: 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 line-through',
    esmaecido: true,
  },
}
