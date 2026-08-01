import type {
  CorEspecialidade,
  ItemCompartilhado,
  StatusEncaminhamento,
} from '@/../product-clinic/sections/encaminhamento/types'

export const AVATAR_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

export const BADGE_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  sky: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
}

interface StatusMeta {
  label: string
  chip: string
}

export const STATUS_META: Record<StatusEncaminhamento, StatusMeta> = {
  pendente: {
    label: 'Pendente',
    chip: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  },
  aceito: {
    label: 'Aceito',
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
  recusado: {
    label: 'Recusado',
    chip: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300',
  },
}

export const ITEM_LABEL: Record<ItemCompartilhado, string> = {
  prontuario: 'Prontuário',
  exames: 'Exames',
  medicacoes: 'Medicações',
}
