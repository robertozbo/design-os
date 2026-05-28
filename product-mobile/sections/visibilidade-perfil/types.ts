// Types for Visibilidade do Perfil (Mobile)

import type { Tema } from '../configuracoes/types'

export type Visibilidade = 'publico' | 'profissionais' | 'privado'

export interface VisibilidadePerfilData {
  tema: Tema
  visibilidadeAtual: Visibilidade
  /** Quantidade de profissionais com vínculo ativo — usada para messaging */
  profissionaisAtivos: number
}

export interface VisibilidadePerfilProps {
  data: VisibilidadePerfilData

  /** Muda visibilidade. Pode retornar Promise para mostrar loading. */
  onMudar?: (nova: Visibilidade) => Promise<void> | void
  /** Navega para tela de conexões/profissionais. */
  onReabrirConexoes?: () => void
}
