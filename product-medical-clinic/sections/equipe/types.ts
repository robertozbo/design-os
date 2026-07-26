export type PapelMedicalClinic = 'admin' | 'medico' | 'recepcao'
export type StatusMembro = 'ativo' | 'convite-pendente' | 'inativo'
export type FiltroPapel = 'todos' | PapelMedicalClinic
export type FiltroStatus = 'todos' | StatusMembro

export interface MembroEquipe {
  id: string
  nome: string
  iniciais: string
  email: string
  papel: PapelMedicalClinic
  status: StatusMembro
  /** Só quando papel = medico */
  especialidade?: string
  crm?: string
  /** Indicadores só pra médico ativo */
  pacientesAtivos?: number
  atendimentosMes?: number
  ativoDesde?: string
  avatarCor?: string
}

export interface ConviteEquipe {
  id: string
  email: string
  papel: PapelMedicalClinic
  especialidade?: string
  enviadoEm: string
  expiraEm: string
  enviadoPor: string
}

export interface PlanoMedicalClinic {
  nome: string
  medicosUsados: number
  medicosLimite: number
}

export interface MedicalClinicResumo {
  nome: string
  cnpj: string
  plano: PlanoMedicalClinic
}

export interface FiltroEquipe {
  busca: string
  papel: FiltroPapel
  status: FiltroStatus
}

export interface ConviteForm {
  email: string
  papel: PapelMedicalClinic
  especialidade: string
}
