export type CorPapel = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type AcaoAudit =
  | 'entrou'
  | 'editou'
  | 'convidou'
  | 'integrou'
  | 'exportou'
  | 'consentimento'
export type StatusConsentimento = 'ativo' | 'rascunho'
export type IntegracaoId = 'memed' | 'escriba' | 'pix' | 'whatsapp'

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
