import type { CorEspecialidade } from '@/../product-clinic/sections/prontuario/types'

/** Fundo sólido para avatares (iniciais brancas). */
export const AVATAR_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

/** Badge (fundo claro + texto), light/dark, para especialidade. */
export const BADGE_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
  rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
  slate: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  sky: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
}

/** Barra lateral colorida (accent) para cards de evolução. */
export const ACCENT_BORDER: Record<CorEspecialidade, string> = {
  teal: 'border-l-teal-500',
  rose: 'border-l-rose-500',
  violet: 'border-l-violet-500',
  slate: 'border-l-slate-400',
  sky: 'border-l-sky-500',
  amber: 'border-l-amber-500',
}

const HOJE = new Date('2026-07-20T12:00:00')

/** "há 3 dias", "há 2h" — relativo a uma data de referência fixa (protótipo). */
export function relativo(iso: string): string {
  const d = new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso)
  const diffMs = HOJE.getTime() - d.getTime()
  const min = Math.round(diffMs / 60000)
  if (min < 60) return `há ${Math.max(1, min)}min`
  const h = Math.round(min / 60)
  if (h < 24) return `há ${h}h`
  const dias = Math.round(h / 24)
  if (dias < 30) return `há ${dias}d`
  const meses = Math.round(dias / 30)
  return `há ${meses}mes${meses > 1 ? 'es' : ''}`
}

/** "10 jul 2026" a partir de ISO date. */
export function dataCurta(iso: string): string {
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  const d = new Date((iso.length <= 10 ? iso + 'T12:00:00' : iso))
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`
}
