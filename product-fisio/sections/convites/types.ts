export type StatusRecebido = 'pendente' | 'aceito' | 'recusado' | 'expirado'
export type StatusEnviado = 'pendente' | 'aceito' | 'recusado' | 'expirado'
export type CanalEnvio = 'whatsapp' | 'email' | 'link'
export type ModalidadeRecebido = 'presencial' | 'teleconsulta' | 'domicilio'

export interface ConviteRecebido {
  id: string
  pacienteNome: string
  pacienteIdade?: number
  pacienteTelefone?: string
  pacienteEmail?: string
  /** Source — perfil público, recomendação, etc. */
  origem: 'perfil-publico' | 'indicacao' | 'whatsapp'
  servico: string
  modalidade: ModalidadeRecebido
  dataPreferida: string
  horaPreferida: string
  duracaoMin: number
  valorCentavos: number
  mensagem?: string
  status: StatusRecebido
  recebidoEm: string
  /** Já é paciente cadastrado? */
  pacienteJaCadastrado: boolean
}

export interface ConviteEnviado {
  id: string
  pacienteNome: string
  pacienteIdade?: number
  pacienteContato: string
  canal: CanalEnvio
  enviadoEm: string
  expiraEm: string
  status: StatusEnviado
  /** Reenvios feitos */
  reenvios: number
  linkConvite: string
}

export interface ConvitesData {
  recebidos: ConviteRecebido[]
  enviados: ConviteEnviado[]
}
