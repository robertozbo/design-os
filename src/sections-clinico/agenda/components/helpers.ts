import type { StatusAgendamento, Modalidade } from '@/../product-clinico/sections/agenda/types'

export const HORAS_GRID = Array.from({ length: 14 }, (_, i) => 7 + i) // 07h - 20h

export function formatHora(h: number): string {
  return `${h.toString().padStart(2, '0')}:00`
}

export function formatHoraMin(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function formatDataCompacta(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function formatDataExtenso(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

export function formatDuracao(min: number): string {
  if (min >= 60) {
    const h = Math.floor(min / 60)
    const m = min % 60
    return m > 0 ? `${h}h${m}` : `${h}h`
  }
  return `${min} min`
}

export function formatRelativo(minutosAteInicio: number): string {
  if (minutosAteInicio < 0) return 'agora'
  if (minutosAteInicio < 60) return `em ${minutosAteInicio} min`
  if (minutosAteInicio < 60 * 24) {
    const h = Math.floor(minutosAteInicio / 60)
    return `em ${h}h`
  }
  const d = Math.floor(minutosAteInicio / 60 / 24)
  return `em ${d} ${d === 1 ? 'dia' : 'dias'}`
}

export function formatBRL(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export const STATUS_LABEL: Record<StatusAgendamento, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
  faltou: 'Faltou',
}

export const STATUS_BLOCK_STYLE: Record<StatusAgendamento, string> = {
  pendente:
    'border border-dashed border-amber-400/80 bg-amber-50 text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200',
  confirmado:
    'border border-teal-500/80 bg-teal-100/80 text-teal-900 dark:border-teal-400/40 dark:bg-teal-900/40 dark:text-teal-100',
  realizado:
    'border border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
  cancelado:
    'border border-slate-200 bg-slate-50 text-slate-400 line-through opacity-70 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-600',
  faltou:
    'border border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-200',
}

export const STATUS_CHIP_STYLE: Record<StatusAgendamento, string> = {
  pendente: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  confirmado: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300',
  realizado: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  cancelado: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500',
  faltou: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
}

export const MODALIDADE_LABEL: Record<Modalidade, string> = {
  presencial: 'Presencial',
  tele: 'Teleconsulta',
}

export function getDuracaoEntre(iniciaEm: string, duracaoMin: number) {
  const ini = new Date(iniciaEm)
  const fim = new Date(ini.getTime() + duracaoMin * 60_000)
  return {
    horaIni: ini.getHours() + ini.getMinutes() / 60,
    horaFim: fim.getHours() + fim.getMinutes() / 60,
  }
}

export function getIsoDia(iso: string): string {
  return iso.split('T')[0]
}
