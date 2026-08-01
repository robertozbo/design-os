export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type Modalidade = 'presencial' | 'tele'
export type StatusConsulta =
  | 'confirmado'
  | 'aguardando'
  | 'em-atendimento'
  | 'realizado'
  | 'faltou'
  | 'cancelado'

export interface PacienteMini {
  nome: string
  iniciais: string
  idade: number
  convenio: string
}

export interface ConsultaDia {
  id: string
  hora: string
  duracaoMin: number
  paciente: PacienteMini
  motivo: string
  modalidade: Modalidade
  /** Sala quando presencial; null em teleconsulta. */
  sala: string | null
  status: StatusConsulta
  /** Paciente chegou por encaminhamento de um colega. */
  viaEncaminhamento?: boolean
}

export interface AlertaResumo {
  id: string
  tipo: 'mensagens' | 'exames' | 'encaminhamentos'
  label: string
  count: number
  href: string
}

export interface MedicoOrigem {
  nome: string
  iniciais: string
  especialidade: string
  cor: CorEspecialidade
}

export interface EncaminhamentoRecebido {
  id: string
  de: MedicoOrigem
  paciente: PacienteMini
  motivo: string
  contexto: string
  recebidoEm: string
}

export interface ResumoDia {
  consultas: number
  realizadas: number
  proximaHora: string | null
}

export interface InicioData {
  medico: {
    nome: string
    primeiroNome: string
    especialidade: string
  }
  saudacao: string
  dataHoje: string
  resumoDia: ResumoDia
  alertas: AlertaResumo[]
  agendaDia: ConsultaDia[]
  encaminhamentos: EncaminhamentoRecebido[]
}
