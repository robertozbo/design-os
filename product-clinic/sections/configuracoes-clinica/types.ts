export type CorPapel = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type AcaoAudit =
  | 'entrou'
  | 'editou'
  | 'convidou'
  | 'integrou'
  | 'exportou'
  | 'consentimento'
export type StatusConsentimento = 'ativo' | 'rascunho'
export type IntegracaoId = 'memed' | 'escriba' | 'pix' | 'whatsapp' | 'instagram'

export interface DadosClinica {
  nome: string
  cnpj: string
  endereco: string
  telefone: string
  logoIniciais: string
}

export interface PlanoInfo {
  nome: string
  descricao: string
  profissionais: number
  maxProfissionais: number
  renovaEm: string
  /** Módulos pagos por fora do plano base. Hoje só Marketing (section `publicacoes`). */
  addons: AddonContratado[]
}

/**
 * Um add-on cobrado à parte, com cota própria.
 *
 * Cota existe porque o módulo tem custo variável (chamada de IA e publicação), e não
 * porque o plano quer limitar uso — por isso o número vive aqui, junto do plano, e
 * não escondido dentro da tela que o gasta.
 */
export interface AddonContratado {
  id: string
  nome: string
  descricao: string
  /** Gerações do mês (post novo e refação contam igual). */
  usados: number
  incluidos: number
  renovaEm: string
  /** A section que o add-on destrava. */
  secao: string
}

export interface Integracao {
  id: IntegracaoId
  nome: string
  descricao: string
  ativa: boolean
  /** Marca "V2" — card esmaecido e toggle desabilitado. */
  indisponivel?: boolean
  /** Só para Escriba IA: modelo + versão do transcritor/SOAP. */
  modelo?: string
  versao?: string
  /**
   * Integração que exige OAuth com um provedor externo (Instagram/Facebook).
   *
   * O toggle não serve: ligar é um fluxo de consentimento na Meta, e desligar
   * revoga um token. O card mostra a conta e um botão — nunca um switch.
   */
  oauth?: boolean
  /** A conta autorizada, quando conectada. `@handle`. */
  conta?: string
  /** Linha de estado: validade da autorização, limite diário, o que for verdade hoje. */
  detalhe?: string
  /** Marca "Add-on" — módulo pago por fora do plano base. */
  addon?: boolean
}

export interface Consentimento {
  id: string
  titulo: string
  descricao: string
  status: StatusConsentimento
  versao: string
  atualizadoEm: string
}

export interface AuditEvento {
  id: string
  ator: string
  iniciais: string
  papel: string
  cor: CorPapel
  acao: AcaoAudit
  alvo: string
  em: string
}

export interface ConfiguracoesClinicaData {
  clinica: DadosClinica
  plano: PlanoInfo
  integracoes: Integracao[]
  consentimentos: Consentimento[]
  auditoria: AuditEvento[]
}
