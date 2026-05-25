// Types for Mais (Mobile)
//
// Hub do menu — perfil resumido + atalhos.

import type { User } from '../../api-types'

export type PlanoTier = 'free' | 'plus' | 'pro'

export interface PlanoStatus {
  tier: PlanoTier
  /** Label legível ("Plus", "Pro") */
  label: string
  /** Renovação ou null pra Free */
  renovaEm: string | null
  /** Preço mensal formatado ("R$ 49,90/mês") */
  precoMensal: string | null
}

export type MaisCor = 'teal' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet'

export interface MaisItem {
  id: string
  label: string
  /** Lucide icon name */
  iconeNome: string
  cor: MaisCor
  /** Subtítulo opcional ("Score 78 · há 30d") */
  subtitulo?: string
  /** Badge à direita (ex: "Pro", "novo") */
  badge?: string
  /** Rota destino */
  rota: string
}

export interface MaisGrupo {
  id: 'saude' | 'conta' | 'suporte'
  label: string
  itens: MaisItem[]
}

export interface MaisData {
  user: User
  primeiroNome: string
  avatarInicial: string
  fotoUrl: string | null
  plano: PlanoStatus
  /** Toggle pra mostrar CTA "upgrade" se for free */
  podeUpgrade: boolean
  grupos: MaisGrupo[]
}

export interface MaisProps {
  data: MaisData
  onPerfilClick?: () => void
  onItemClick?: (item: MaisItem) => void
  onUpgradeClick?: () => void
  onLogoutClick?: () => void
}
