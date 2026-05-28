// Types for Histórico de Consentimentos (Mobile)
//
// Lista auditável LGPD art. 9 — consentimentos aceitos/revogados.

import type { Tema } from '../configuracoes/types'

export type ConsentimentoTipo =
  | 'terms_of_use'
  | 'privacy_policy'
  | 'data_processing'
  | 'marketing'
  | 'corporate_followup'

export type ConsentimentoStatus = 'ativo' | 'revogado'

export type ConsentimentoFiltro = 'todos' | ConsentimentoStatus

export interface ConsentimentoItem {
  id: string
  tipo: ConsentimentoTipo
  /** Versão do termo aceito — ex.: "v3.2" */
  versao: string
  /** Aceito (true) ou revogado (false) */
  ativo: boolean
  /** ISO data do aceite */
  aceitoEm: string
  /** ISO data da revogação, null se ainda ativo */
  revogadoEm: string | null
  /** IP de registro (anonimizar em telas de auditoria pública) */
  ipRegistro: string | null
  /** True se este consentimento é obrigatório (revogação implica excluir conta) */
  obrigatorio: boolean
  /** Preview curto do termo aceito (~200 chars) */
  trechoTermo: string
}

export interface HistoricoConsentimentosData {
  tema: Tema
  consentimentos: ConsentimentoItem[]
}

export interface HistoricoConsentimentosProps {
  data: HistoricoConsentimentosData

  /** Revoga consentimento opt-in (não obrigatório). */
  onRevogarConsentimento?: (id: string) => Promise<void> | void
  /** Navega para visualização completa do termo. */
  onAbrirTermoCompleto?: (tipo: ConsentimentoTipo, versao: string) => void
  /** Navega para fluxo de excluir conta (link mostrado quando user tenta revogar obrigatório). */
  onAbrirExcluirConta?: () => void
}
