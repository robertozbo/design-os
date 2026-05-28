// Types for Excluir Conta (Mobile)
//
// Fluxo LGPD art. 18 com janela de arrependimento de 30 dias.

import type { Tema } from '../configuracoes/types'

export interface ExclusaoStatus {
  /** Conta já está em janela de exclusão (entrada secundária) */
  pendenteExclusao: boolean
  /** ISO da data em que dados serão hard-deleted (only set if pendenteExclusao) */
  exclusaoEm: string | null
  /** Email pra onde foi mandado o link de cancelamento */
  emailNotificacao: string | null
}

export interface ExcluirContaData {
  tema: Tema
  /** Usuário aceitou compartilhar dados anônimos pra pesquisa */
  compartilhaDadosAnonimos: boolean
  /** Biometria configurada e disponível */
  biometriaAtiva: boolean
  /** Status de exclusão atual */
  exclusao: ExclusaoStatus
}

export interface ExcluirContaProps {
  data: ExcluirContaData

  /** Confirmou exclusão com senha. Retorna Promise para mostrar loading. */
  onConfirmar?: (senha: string) => Promise<void> | void
  /** Confirmou exclusão via biometria. */
  onConfirmarBiometria?: () => Promise<void> | void
  /** Cancela e volta para tela anterior. */
  onCancelar?: () => void
  /** Modal de sucesso fechado — geralmente faz logout. */
  onConcluido?: () => void
  /** Reverter exclusão pendente (botão verde quando pendenteExclusao=true). */
  onReverterExclusao?: () => Promise<void> | void
}
