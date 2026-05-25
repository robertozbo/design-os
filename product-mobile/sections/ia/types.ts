// Types for IA (Mobile)
//
// Hub de IA: combina ChatOption (catálogo do backend ai-chat) + ChatHistoryItem
// (histórico) num view-model UI.

import type {
  ChatHistoryItem,
  ChatOption,
  ChatOptionType,
} from '../../api-types'

/** Cor visual por ChatOptionType */
export type IACor = 'teal' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet'

/**
 * Quick action card UI estendendo ChatOption do backend.
 */
export interface QuickActionUI {
  /** ChatOption original do backend */
  option: ChatOption
  /** Cor da categoria */
  cor: IACor
  /** Lucide icon name (UI-friendly, mapeado de option.icon) */
  iconeNome: string
  /** Subtítulo curto pra card */
  resumo: string
}

/**
 * Item do histórico estendido com formatação UI.
 */
export interface HistoricoItemUI {
  /** ChatHistoryItem original */
  item: ChatHistoryItem
  /** Cor por optionType */
  cor: IACor
  iconeNome: string
  /** Label humanizado da option ("Foto da Balança") */
  label: string
  /** Resumo do extracted data ("83,4 kg · 92% confiança") */
  resumoExtraido: string
  /** Tempo relativo ("há 2h", "ontem") */
  tempoRelativo: string
  /** Rota de detalhe */
  rota: string
}

export interface HeroIAState {
  fraseTitulo: string
  fraseSubtitulo: string
  ctaLabel: string
}

export interface IAData {
  hero: HeroIAState
  /** Quick actions na ordem do grid 2-col */
  quickActions: QuickActionUI[]
  historico: HistoricoItemUI[]
}

export interface IAProps {
  data: IAData
  onQuickActionClick?: (option: QuickActionUI) => void
  onHistoricoClick?: (item: HistoricoItemUI) => void
  onChatClick?: () => void
  onRefresh?: () => Promise<void>
}

export type { ChatOptionType }
