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
  /**
   * Módulos vendidos à parte — Marketing, Fiscal e os que vierem.
   *
   * Lista, não campos: add-on é família, não caso especial. A primeira versão tratou
   * Marketing como exceção e teria exigido reescrever esta tela no dia em que o Fiscal
   * entrou.
   */
  addons: Addon[]
}

export type StatusAddon = 'ativo' | 'disponivel' | 'suspenso'

/**
 * Um módulo cobrado por fora do plano base.
 *
 * A cota existe porque o módulo tem **custo variável** (chamada de IA no Marketing,
 * emissão no Fiscal), não porque o plano queira limitar uso — por isso o número mora
 * aqui, ao lado do preço, e não escondido dentro da tela que o gasta.
 */
export interface Addon {
  id: string
  nome: string
  descricao: string
  status: StatusAddon
  /** Em reais por mês. É o que a tela mostra para quem ainda não contratou. */
  precoMensal: number
  /**
   * Consumo do ciclo. `null` nos dois casos em que não existe número para mostrar:
   * add-on não contratado e add-on sem cota (cobrança por assinatura pura).
   */
  usados: number | null
  incluidos: number | null
  /**
   * O que a cota conta, no plural: "gerações de IA", "notas emitidas". Sem isto a
   * barra vira um número sem unidade, e 12/30 de coisas diferentes parece a mesma coisa.
   */
  unidade: string
  /** `null` quando não contratado — não há ciclo correndo. */
  renovaEm: string | null
  /** A section que o add-on destrava. `null` enquanto o módulo não existe no produto. */
  secao: string | null
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
