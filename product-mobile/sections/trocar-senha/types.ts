// Types for Trocar Senha (Mobile)

import type { Tema } from '../configuracoes/types'

export type ForcaSenha = 'fraca' | 'media' | 'forte' | 'excelente'

export interface TrocarSenhaData {
  tema: Tema
  /** Conta usa login social (Google/Apple) e não tem senha local */
  isSocialLogin: boolean
}

export interface TrocarSenhaProps {
  data: TrocarSenhaData

  /** Submete troca de senha. Pode lançar Error com code identificável. */
  onSubmit?: (currentPassword: string, newPassword: string) => Promise<void>
  /** Modal de sucesso fechado — geralmente faz goBack(). */
  onConcluido?: () => void
}
