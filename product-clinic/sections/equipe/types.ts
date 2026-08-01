export type PapelClinic = 'admin' | 'medico' | 'recepcao'
export type StatusMembro = 'ativo' | 'convite-pendente' | 'inativo'
export type FiltroPapel = 'todos' | PapelClinic
export type FiltroStatus = 'todos' | StatusMembro

export interface MembroEquipe {
  id: string
  nome: string
  iniciais: string
  email: string
  papel: PapelClinic
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
  papel: PapelClinic
  especialidade?: string
  enviadoEm: string
  expiraEm: string
  enviadoPor: string
}

/**
 * Faixa de preço do tier Clínica. **Só médico é seat pago** — recepção e admin são ilimitados e
 * gratuitos: quem gera receita e consome IA é o médico, e cobrar pelo administrativo empurraria a
 * secretária a usar o login do médico (ruim pra auditoria e pra LGPD).
 */
export interface FaixaPlano {
  /** Teto de médicos da faixa. `null` = sob consulta. */
  ateMedicos: number | null
  /** Mensalidade em reais. `null` = sob consulta. */
  preco: number | null
}

export interface PlanoClinic {
  nome: string
  medicosUsados: number
  medicosLimite: number
  /** Mensalidade vigente, em reais. */
  precoMensal: number
  /** Escada de faixas — o upgrade acontece ao estourar `medicosLimite`. */
  faixas: FaixaPlano[]
}

export interface ClinicResumo {
  nome: string
  cnpj: string
  plano: PlanoClinic
}

export interface FiltroEquipe {
  busca: string
  papel: FiltroPapel
  status: FiltroStatus
}

export interface ConviteForm {
  email: string
  papel: PapelClinic
  especialidade: string
}
