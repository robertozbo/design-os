// Types for Sessões Ativas (Mobile)
//
// Lista auditável dos dispositivos com sessão autenticada.

import type { Tema } from '../configuracoes/types'

export type SessaoTipo = 'mobile' | 'desktop' | 'tablet' | 'web'

export interface SessaoAtiva {
  id: string
  /** Nome amigável do device — "iPhone 15 Pro" */
  device: string
  /** Sistema operacional + versão — "iOS 17.4 · Safari" */
  os: string
  tipo: SessaoTipo
  /** Cidade aproximada por geo do IP */
  local: string
  /** Última atividade ISO */
  ultimaAtividade: string
  /** É a sessão da request atual */
  atual: boolean
}

export interface SessoesAtivasData {
  tema: Tema
  sessoes: SessaoAtiva[]
}

export interface SessoesAtivasProps {
  data: SessoesAtivasData

  /** Encerra uma sessão específica. Retorna Promise para mostrar loading. */
  onEncerrarSessao?: (id: string) => Promise<void> | void
  /** Encerra todas as outras sessões (não a atual). */
  onEncerrarTodasOutras?: () => Promise<void> | void
}
