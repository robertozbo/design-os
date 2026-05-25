// Types for Métricas (Mobile)
//
// Estende os tipos do backend (Metric + MetricTypeInfo) com campos UI-only:
// sparkline, delta formatado, fonte humanizada, agrupamento por categoria.
// O backend não envia esses campos — são computados no frontend a partir
// do array de Metric e formatados pra exibição.

import type { Metric, MetricTypeInfo } from '../../api-types'

export type Periodo = 'hoje' | '7d' | '30d' | '6m' | '1a'

export interface PeriodoOpcao {
  id: Periodo
  label: string
}

export type StatTendencia = 'up' | 'down' | 'stable'
export type DeltaTone = 'positive' | 'negative' | 'neutral'

/**
 * Categorias de UI (agrupamento visual). Não vem do backend — são derivadas
 * de `metricType.value` por convenção (ver getCategoriaForMetric em utils).
 */
export type CategoriaMetrica =
  | 'composicao'
  | 'cardio'
  | 'atividade'
  | 'sono'
  | 'hidratacao'
  | 'outros'

/**
 * View-model que combina o último Metric da série + metadata da MetricTypeInfo
 * + campos UI computados (sparkline, delta, fonte humanizada).
 *
 * Construído no frontend a partir de uma chamada à API GET /metrics?metricTypeId=X
 * (que retorna histórico) — usa-se a última pra valor atual e a série pra sparkline.
 */
export interface MetricaViewModel {
  /** ID estável (= metricType.value, ex: 'weight', 'heart_rate') */
  id: string
  /** A última medição (pode ser null se sem dados) */
  ultimo: Metric | null
  /** Catálogo (label, unidade, faixa normal, etc.) */
  tipo: MetricTypeInfo
  /** Categoria derivada (UI-only) */
  categoria: CategoriaMetrica
  /** Ícone Lucide (UI-only) */
  iconeNome: string
  /** Tailwind suffix (ex: 'teal-300') */
  iconeCor: string
  /** Tailwind class (ex: 'bg-teal-500/15') */
  iconeBg: string
  /** Valor formatado pra display (ex: '83,4', '8h 12m'). null se semDados. */
  valorFormatado: string | null
  /** Delta formatado (ex: '↓ -0,3 kg'). null se semDados ou sem comparação. */
  delta: string | null
  tendencia: StatTendencia
  deltaTone: DeltaTone
  /** "Apple Watch · há 3 min" — humanizado a partir de Metric.source/deviceId/measuredAt */
  fonte: string
  /** Últimos N pontos pra sparkline (vem da API ou computado no client) */
  sparkline: number[]
  semDados: boolean
  /** Rota de detalhe (ex: '/metricas/weight') */
  rota: string
}

export interface CategoriaSection {
  id: CategoriaMetrica
  label: string
  iconeNome: string
  metricas: MetricaViewModel[]
}

export interface MetricasData {
  periodos: PeriodoOpcao[]
  categorias: CategoriaSection[]
  /** True se nenhum Device com isConnected=true */
  semWearables: boolean
}

export interface MetricasProps {
  data: MetricasData
  selectedPeriodo: Periodo
  onPeriodoChange?: (periodo: Periodo) => void
  /** Recebe a métrica view-model (componente parent navega usando rota) */
  onMetricaClick?: (metrica: MetricaViewModel) => void
  onAdicionarClick?: () => void
  onConectarDispositivoClick?: () => void
  onRefresh?: () => Promise<void>
}

// Backwards-compat alias for the old `Metrica` type used in components.
// Antes era um tipo flat; agora é o view-model. O alias simplifica migração.
export type Metrica = MetricaViewModel
