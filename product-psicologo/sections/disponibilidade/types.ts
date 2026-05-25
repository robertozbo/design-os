export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0=Dom, 1=Seg, ..., 6=Sab

export interface Intervalo {
  id: string
  inicio: string // 'HH:mm'
  fim: string   // 'HH:mm'
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

export interface ConsultaConflito {
  diaIso: string // 'YYYY-MM-DD'
  pacienteNome: string
  horario: string
}

export interface DisponibilidadeData {
  /** Default ordering: Seg→Dom (1..6, 0). */
  dias: DiaDisponibilidade[]
  slotMinutesPadrao: SlotMinutes
  antecedenciaMinima: AntecedenciaHoras
  bloqueioEntreSessoes: boolean
  /** Conflitos com agenda existente quando o usuário desativa um dia — gera modal. */
  conflitosPendentes: ConsultaConflito[]
}

export interface DisponibilidadeStats {
  diasAtivos: number
  horasPorSemana: number
  slotsTotais: number
  slotMinutesPadrao: SlotMinutes
}

export type Template = {
  id: 'comercial' | 'saude_estendida' | 'apenas_tardes' | 'apenas_online' | 'limpar'
  nome: string
  descricao: string
}

export interface DisponibilidadeProps {
  data: DisponibilidadeData
  hasChanges?: boolean
  onToggleDia?: (dayOfWeek: DayOfWeek) => void
  onAddIntervalo?: (dayOfWeek: DayOfWeek) => void
  onUpdateIntervalo?: (dayOfWeek: DayOfWeek, intervaloId: string, patch: Partial<Intervalo>) => void
  onRemoveIntervalo?: (dayOfWeek: DayOfWeek, intervaloId: string) => void
  onCopiarDia?: (fromDay: DayOfWeek, toDays: DayOfWeek[]) => void
  onLimparDia?: (dayOfWeek: DayOfWeek) => void
  onSetSlotPadrao?: (m: SlotMinutes) => void
  onSetAntecedencia?: (h: AntecedenciaHoras) => void
  onToggleBloqueio?: () => void
  onAplicarTemplate?: (t: Template['id']) => void
  onSalvar?: () => void
  onDescartar?: () => void
  onLimparTudo?: () => void
}
