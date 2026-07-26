import type {
  CorEspecialidade,
  MotivoCancelamento,
  StatusPrescricao,
  TipoReceita,
} from '@/../product-medical-clinic/sections/prescricao/types'

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
  riscado?: boolean
}

export const STATUS_META: Record<StatusPrescricao, StatusMeta> = {
  ativa: {
    label: 'Ativa',
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
  expirada: {
    label: 'Expirada',
    chip: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  },
  cancelada: {
    label: 'Cancelada',
    chip: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300',
    riscado: true,
  },
}

interface TipoMeta {
  label: string
  chip: string
}

export const TIPO_META: Record<TipoReceita, TipoMeta> = {
  comum: { label: 'Comum', chip: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
  continua: {
    label: 'Contínua',
    chip: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  },
  controlada: {
    label: 'Controlada',
    chip: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  },
}

export const MOTIVO_LABEL: Record<MotivoCancelamento, string> = {
  erro_prescricao: 'Erro de prescrição',
  mudanca_conduta: 'Mudança de conduta',
  reacao_adversa: 'Reação adversa',
  outro: 'Outro',
}

/** Texto e cor da validade conforme dias até vencer. */
export function validadeLabel(dias: number): { texto: string; alerta: boolean } {
  if (dias < 0) return { texto: `Expirou há ${Math.abs(dias)}d`, alerta: true }
  if (dias === 0) return { texto: 'Vence hoje', alerta: true }
  if (dias <= 7) return { texto: `Vence em ${dias}d`, alerta: true }
  return { texto: `Válida · ${dias}d`, alerta: false }
}
