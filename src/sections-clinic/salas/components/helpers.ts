import type {
  CorEspecialidade,
  TipoSala,
} from '@/../product-clinic/sections/salas/types'

export const TIPO_LABEL: Record<TipoSala, string> = {
  consultorio: 'Consultório',
  procedimento: 'Procedimento',
  tele: 'Teleconsulta',
}

export const TIPO_BADGE: Record<TipoSala, string> = {
  consultorio: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  procedimento: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  tele: 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
}

export const ESPEC_DOT: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

export function ocupacaoPct(ocupadas: number, disponiveis: number): number {
  if (disponiveis <= 0) return 0
  return Math.min(100, Math.round((ocupadas / disponiveis) * 100))
}

/** Cor da barra de ocupação. */
export function ocupacaoBar(pct: number): string {
  if (pct >= 85) return 'bg-rose-500'
  if (pct >= 60) return 'bg-amber-500'
  return 'bg-teal-500'
}
