export type StatusSessao = 'realizada' | 'confirmada' | 'agendada' | 'faltou' | 'livre'

export interface SlotAgenda {
  id: string
  hora: string
  fim: string
  status: StatusSessao
  aluno?: string
  inicial?: string
  tipo?: string
  modalidade?: 'presencial' | 'online'
  local?: string
}

export interface DiaSemana {
  id: string
  sigla: string
  numero: number
  sessoes: number
  hoje?: boolean
}

export interface PersonalAgendaData {
  mes: string
  semana: DiaSemana[]
  diaSelecionado: string
  slots: SlotAgenda[]
  solicitacoesPendentes: number
}

export interface PersonalAgendaProps {
  data: PersonalAgendaData
  onSlotClick?: (slot: SlotAgenda) => void
  onNovaSessao?: () => void
  onSolicitacoes?: () => void
}
