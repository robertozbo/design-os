import type { StatusLembrete, AcaoRapidaId } from '@/../product-clinico/sections/inicio-paciente/types'

export function formatHora(s: string): string {
  return s.slice(0, 5)
}

export function formatRelativoMin(min: number): string {
  if (min < 0) return 'agora'
  if (min < 60) return `em ${min}min`
  if (min < 60 * 24) {
    const h = Math.floor(min / 60)
    const m = min % 60
    return m > 0 ? `em ${h}h${m.toString().padStart(2, '0')}` : `em ${h}h`
  }
  const d = Math.floor(min / 60 / 24)
  return d === 1 ? 'amanhã' : `em ${d} dias`
}

export const STATUS_LEMBRETE_LABEL: Record<StatusLembrete, string> = {
  cumprido: 'Cumprida',
  pendente: 'Pendente',
  atrasado: 'Atrasada',
  pulado: 'Pulada',
}

export const ACAO_RAPIDA_GRADIENT: Record<AcaoRapidaId, string> = {
  peso: 'from-teal-500/15 to-teal-500/5',
  glicemia: 'from-rose-500/15 to-rose-500/5',
  exame: 'from-violet-500/15 to-violet-500/5',
  receita: 'from-amber-500/15 to-amber-500/5',
}

export const ACAO_RAPIDA_TEXT: Record<AcaoRapidaId, string> = {
  peso: 'text-teal-700 dark:text-teal-300',
  glicemia: 'text-rose-700 dark:text-rose-300',
  exame: 'text-violet-700 dark:text-violet-300',
  receita: 'text-amber-800 dark:text-amber-300',
}
