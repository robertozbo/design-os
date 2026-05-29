export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0=Dom, 1=Seg, ..., 6=Sab

export interface Intervalo {
  id: string
  inicio: string // 'HH:mm'
  fim: string // 'HH:mm'
}

export interface DiaDisponibilidade {
  dayOfWeek: DayOfWeek
  ativo: boolean
  intervalos: Intervalo[]
  /** Override do slot global pro dia (null = usa global) */
  slotMinutesOverride: number | null
}

export type SlotMinutes = 30 | 45 | 60 | 90 | 120
export type AntecedenciaHoras = 1 | 4 | 12 | 24 | 48

export interface SessaoConflito {
  diaIso: string
  pacienteNome: string
  horario: string
}

export interface DisponibilidadeData {
  dias: DiaDisponibilidade[]
  slotMinutesPadrao: SlotMinutes
  antecedenciaMinima: AntecedenciaHoras
  bloqueioEntreSessoes: boolean
  conflitosPendentes: SessaoConflito[]
}

export interface DisponibilidadeStats {
  diasAtivos: number
  horasPorSemana: number
  slotsTotais: number
  slotMinutesPadrao: SlotMinutes
}
