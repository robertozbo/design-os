// =============================================================================
// Data Types
// =============================================================================

/** Espelha `appointment_status` (`backend/src/schema/types/enums.ts`). */
export type StatusConsulta =
  | 'scheduled'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export type Modalidade = 'presencial' | 'teleconsulta' | 'domicilio'

export type TipoProfissional = 'nutricionista' | 'personal' | 'medico' | 'psicologo' | 'fisioterapeuta'

export type ConsultasAba = 'proximas' | 'anteriores'

export interface ProfissionalDaConsulta {
  id: string
  nome: string
  tipo: TipoProfissional
  especialidade: string
  avatarUrl: string | null
}

export interface LocalDaConsulta {
  clinicaNome: string
  sala: string | null
  endereco: string | null
}

export interface Consulta {
  id: string
  /** `YYYY-MM-DD` — `appointment_date`. */
  data: string
  /** `HH:MM` — `appointment_time`. */
  hora: string
  duracaoMin: number
  status: StatusConsulta
  modalidade: Modalidade
  profissional: ProfissionalDaConsulta
  /** Nome do serviço (`professional_services`), ou null quando a consulta não tem serviço. */
  servico: string | null
  /** Null em teleconsulta e em consulta de consultório sem clínica cadastrada. */
  local: LocalDaConsulta | null
  /** `meet_link` — só em teleconsulta, e pode chegar só na hora. */
  meetLink: string | null
  /** Orientação do profissional para o paciente. */
  orientacao: string | null
  /** ISO — `checked_in_at`. */
  checkedInAt: string | null
  /** `cancellation_requested_by_user`. */
  cancelamentoPedido: boolean
  canceladaPor: 'user' | 'professional' | null
  motivoCancelamento: string | null
}

export interface CodigoDeChegada {
  /** Seis dígitos. */
  codigo: string
  /** ISO — quando o código morre (5 minutos depois de gerado). */
  expiraEm: string
}

export interface ConsultasData {
  /** `YYYY-MM-DD` no relógio do dispositivo — o dia é de quem está na porta. */
  hoje: string
  /** `HH:MM` local, para decidir se a teleconsulta já liberou. */
  agora: string
  consultas: Consulta[]
  /** Só para o protótipo: o que a procedure de código devolveria. */
  codigoDeChegadaExemplo: CodigoDeChegada
}

// =============================================================================
// Component Props
// =============================================================================

export interface ConsultasProps {
  data: ConsultasData
  abaInicial?: ConsultasAba
  /** Gera o código de chegada da consulta presencial de hoje. */
  onGerarCodigoDeChegada?: (consultaId: string) => void
  onEntrarTeleconsulta?: (consultaId: string, meetLink: string) => void
  onAdicionarCalendario?: (consultaId: string) => void
  onConversar?: (profissionalId: string) => void
  /** CTA do vazio — leva para Profissionais. */
  onVerProfissionais?: () => void
}
