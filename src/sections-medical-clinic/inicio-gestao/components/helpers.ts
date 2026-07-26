import type { CorEspecialidade } from '@/../product-medical-clinic/sections/inicio-gestao/types'

export const AVATAR_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

export const BAR_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-400',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

/** R$ 28.800 -> "R$ 28,8 mil" (compacto pt-BR). */
export function brlCompacto(valor: number): string {
  if (valor >= 1000) {
    const mil = valor / 1000
    return `R$ ${mil.toFixed(1).replace('.', ',')} mil`
  }
  return `R$ ${valor}`
}

export function ocupacaoBar(pct: number): string {
  if (pct >= 85) return 'bg-rose-500'
  if (pct >= 60) return 'bg-amber-500'
  return 'bg-teal-500'
}
