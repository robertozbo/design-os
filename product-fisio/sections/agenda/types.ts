export type StatusAgendamento =
  | 'agendada'
  | 'confirmada'
  | 'realizada'
  | 'falta'
  | 'cancelada'
  | 'bloqueio'

export type VisaoAgenda = 'dia' | 'semana' | 'mes'
export type DuracaoMin = 30 | 45 | 60 | 90
export type TipoAtendimento = 'presencial' | 'teleconsulta' | 'domicilio'

export interface PacienteResumo {
  id: string
  nome: string
  queixaCurta: string
  evaUltima?: number
  statusNymosMove: 'conectado' | 'pendente' | 'nao-convidado'
}

export interface Agendamento {
  id: string
  data: string
  horaInicio: string
  duracaoMin: DuracaoMin
  status: StatusAgendamento
  paciente?: PacienteResumo
  observacao?: string
  recorrencia?: 'semanal' | 'quinzenal'
  bloqueio?: { titulo: string; cor?: string }
  lembreteEnviado?: boolean
  tipoAtendimento?: TipoAtendimento
}

export interface KPIsAgenda {
  totalDia: number
  confirmados: number
  pendentes: number
  realizadosAteAgora: number
}

export interface DiaResumo {
  data: string
  diaSemana: string
  totalSessoes: number
  realizadas: number
  faltas: number
}
