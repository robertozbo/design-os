import type { CorEspecialidade } from '@/../product-clinic/sections/relatorios/types'

export const AVATAR_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

export const BADGE_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
  rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
  slate: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  sky: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
}

/** Cor da barra sólida por especialidade. */
export const BAR_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

/** R$ 28.800 formatado pt-BR. */
export function brl(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

/**
 * "2026-08-01" → "01/08/2026".
 * Fatia a string em vez de usar `new Date(iso)`: o construtor interpreta
 * `yyyy-mm-dd` como UTC e, em BRT, devolveria o dia anterior.
 */
export function dataBR(iso: string): string {
  const [a, m, d] = iso.split('-')
  return a && m && d ? `${d}/${m}/${a}` : iso
}

/** "01/08 – 31/08/2026" — omite o ano da ponta esquerda quando é o mesmo. */
export function intervaloLabel(de: string, ate: string): string {
  const [anoDe] = de.split('-')
  const [anoAte] = ate.split('-')
  const esquerda = anoDe === anoAte ? dataBR(de).slice(0, 5) : dataBR(de)
  return `${esquerda} – ${dataBR(ate)}`
}

/** 8,2 → "8,2%" (1 casa, sem casa quando inteiro). */
export function pct(valor: number): string {
  const s = Number.isInteger(valor) ? String(valor) : valor.toFixed(1).replace('.', ',')
  return `${s}%`
}
