import type {
  Agendamento,
  CorEspecialidade,
  Modalidade,
  Recorrencia,
  StatusConsulta,
} from '@/../product-medical-clinic/sections/agenda/types'

export const AVATAR_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

/** Bloco de consulta: fundo tênue + borda esquerda + texto, light/dark. */
export const BLOCO_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-50 border-l-teal-500 text-teal-900 dark:bg-teal-950/40 dark:text-teal-100',
  rose: 'bg-rose-50 border-l-rose-500 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100',
  violet: 'bg-violet-50 border-l-violet-500 text-violet-900 dark:bg-violet-950/40 dark:text-violet-100',
  slate: 'bg-slate-100 border-l-slate-400 text-slate-900 dark:bg-slate-800/60 dark:text-slate-100',
  sky: 'bg-sky-50 border-l-sky-500 text-sky-900 dark:bg-sky-950/40 dark:text-sky-100',
  amber: 'bg-amber-50 border-l-amber-500 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100',
}

export const BADGE_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
  rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
  slate: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  sky: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
}

export const STATUS_META: Record<
  StatusConsulta,
  { label: string; dot: string; badge: string; esmaecido: boolean }
> = {
  pendente: {
    label: 'Pendente',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    esmaecido: false,
  },
  confirmado: {
    label: 'Confirmado',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    esmaecido: false,
  },
  realizado: {
    label: 'Realizado',
    dot: 'bg-slate-400',
    badge: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    esmaecido: false,
  },
  cancelado: {
    label: 'Cancelado',
    dot: 'bg-red-400',
    badge: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    esmaecido: true,
  },
  faltou: {
    label: 'Faltou',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    esmaecido: true,
  },
}

/** "HH:MM" -> minutos desde 00:00. */
export function minutos(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function dataExtenso(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return `${DIAS[d.getDay()]}, ${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

/** "HH:MM" + minutos → "HH:MM". */
export function somaMinutos(hhmm: string, mins: number): string {
  const t = minutos(hhmm) + mins
  return `${pad2(Math.floor(t / 60) % 24)}:${pad2(t % 60)}`
}

/** "2026-07-25" → "25/07". */
export function dataCurta(iso: string): string {
  const [, mes, dia] = iso.split('-')
  return dia && mes ? `${dia}/${mes}` : iso
}

/** Soma dias a uma data ISO, devolvendo ISO. Aritmética local — sem passar por UTC. */
export function addDias(iso: string, dias: number): string {
  const [ano, mes, dia] = iso.split('-').map(Number)
  const d = new Date(ano, mes - 1, dia + dias)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

const pad2 = (n: number) => String(n).padStart(2, '0')

/**
 * Soma meses a uma data ISO, **clampando no último dia do mês alvo** —
 * 31/01 + 1 mês = 28/02, não 03/03 (que é o que `setMonth` faria sozinho).
 */
export function addMeses(iso: string, meses: number): string {
  const [ano, mes, dia] = iso.split('-').map(Number)
  const alvo = new Date(ano, mes - 1 + meses, 1)
  const ultimoDia = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate()
  alvo.setDate(Math.min(dia, ultimoDia))
  return `${alvo.getFullYear()}-${pad2(alvo.getMonth() + 1)}-${pad2(alvo.getDate())}`
}

/** Datas de uma série recorrente, incluindo a primeira ocorrência. */
export function datasDaSerie(inicio: string, recorrencia: Recorrencia, repeticoes: number): string[] {
  const n = Math.max(1, Math.min(52, Math.floor(repeticoes) || 1))
  if (recorrencia === 'Não repetir') return [inicio]
  const passo = { Semanal: 7, Quinzenal: 14 } as const
  return Array.from({ length: n }, (_, i) =>
    recorrencia === 'Mensal' ? addMeses(inicio, i) : addDias(inicio, i * passo[recorrencia]),
  )
}

/** Janela de um candidato a agendamento — o que basta pra checar sobreposição. */
export interface Janela {
  id?: string
  data: string
  inicio: string
  fim: string
  medicoId: string
  salaId: string
  modalidade: Modalidade
}

/**
 * Primeiro agendamento que colide com `alvo` — mesmo dia, horário sobreposto e
 * mesmo médico (ou mesma sala, quando presencial). Cancelados não ocupam.
 */
export function acharConflito(agendamentos: Agendamento[], alvo: Janela): Agendamento | null {
  const ini = minutos(alvo.inicio)
  const fim = minutos(alvo.fim)
  for (const a of agendamentos) {
    if (a.data !== alvo.data) continue
    if (a.status === 'cancelado') continue
    if (alvo.id && a.id === alvo.id) continue
    if (!(ini < minutos(a.fim) && fim > minutos(a.inicio))) continue
    if (a.medicoId === alvo.medicoId) return a
    if (alvo.modalidade === 'presencial' && a.salaId === alvo.salaId) return a
  }
  return null
}
