export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type StatusEncaminhamento = 'pendente' | 'aceito' | 'recusado'
export type Direcao = 'recebido' | 'enviado'
export type ItemCompartilhado = 'prontuario' | 'exames' | 'medicacoes'

export interface MedicoRef {
  id: string
  nome: string
  iniciais: string
  especialidade: string
  cor: CorEspecialidade
  crm?: string
}

export interface PacienteRef {
  id: string
  nome: string
  iniciais: string
  idade: number
}

export interface Encaminhamento {
  id: string
  direcao: Direcao
  /** Quem enviou (se recebido) ou quem recebe (se enviado). */
  contraparte: MedicoRef
  paciente: PacienteRef
  motivo: string
  contexto: string
  compartilhado: ItemCompartilhado[]
  consentimentoPaciente: boolean
  status: StatusEncaminhamento
  em: string
}

export interface ColegaSelector extends MedicoRef {
  disponivel: boolean
}

export interface PacienteSelector extends PacienteRef {
  condicoesCronicas: string[]
  meuVinculo: boolean
}

export interface EncaminhamentoData {
  clinica: string
  medicoLogado: MedicoRef
  recebidos: Encaminhamento[]
  enviados: Encaminhamento[]
  colegas: ColegaSelector[]
  pacientes: PacienteSelector[]
}
