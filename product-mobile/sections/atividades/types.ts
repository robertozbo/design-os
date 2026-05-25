// Types for Atividades (Mobile)
//
// Estende ActivityResponse do backend (Activity + activityType.category aninhado)
// com campos UI: badge de origem, ícone, cor por categoria.
// Mistura auto (smartwatch via HealthKit) com manual numa lista única.

import type {
  ActivityResponse,
  ActivitySource,
} from '../../api-types'

export type Periodo = 'hoje' | '7d' | '30d'

export interface PeriodoOpcao {
  id: Periodo
  label: string
}

/** Categoria de UI — mapeada de ActivityCategory.name (lowercased). */
export type CategoriaUI =
  | 'cardio'
  | 'forca'
  | 'flexibilidade'
  | 'esportes'
  | 'outros'

export interface CategoriaPill {
  id: CategoriaUI | 'todas'
  label: string
  count: number
}

/**
 * View-model UI que embute ActivityResponse + extensões visuais.
 */
export interface AtividadeViewModel {
  /** Activity row do backend (com activityType + category aninhado) */
  activity: ActivityResponse
  /** Categoria mapeada pra UI */
  categoria: CategoriaUI
  /** Lucide icon name */
  iconeNome: string
  /** Tailwind suffix (ex: 'rose-300') */
  iconeCor: string
  /** Tailwind class (ex: 'bg-rose-500/15') */
  iconeBg: string
  /** Origem do registro (humanizada pro badge) */
  source: ActivitySource
  sourceLabel: string // "Apple Watch", "Manual", "Health Connect"
  /** Hora formatada (ex: "14:30") */
  horarioFormatado: string
  /** Duração formatada (ex: "45 min", "1h 20m") */
  duracaoFormatada: string
}

export interface AtividadesStats {
  /** Quantidade de atividades no período */
  quantidade: number
  /** Soma de calorias */
  kcalTotal: number
  /** Soma de minutos */
  minutosTotal: number
  /** Soma de pontos */
  pontosTotal: number
}

export interface AtividadesData {
  periodos: PeriodoOpcao[]
  categoriasFiltro: CategoriaPill[]
  stats: AtividadesStats
  atividades: AtividadeViewModel[]
}

export interface AtividadesProps {
  data: AtividadesData
  selectedPeriodo: Periodo
  onPeriodoChange?: (periodo: Periodo) => void
  /** Filtros multi-select de categorias. 'todas' limpa o array. */
  selectedCategorias: CategoriaUI[]
  onCategoriasChange?: (categorias: CategoriaUI[]) => void
  onAtividadeClick?: (atividade: AtividadeViewModel) => void
  onRegistrarClick?: () => void
  onConectarDispositivoClick?: () => void
  onRefresh?: () => Promise<void>
}
