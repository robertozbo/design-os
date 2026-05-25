// Types for Objetivos (Mobile)
//
// Estende Goal do backend (goals table + goals module) com campos UI:
// metricType info aninhado, ícone, cor, progress %, tempo restante, visual style.

import type { Goal, GoalStatus, MetricTypeInfo } from '../../api-types'

/** Estilo visual da meta — derivado da direção (subir/descer/manter na faixa) */
export type GoalVisual = 'ring' | 'bar' | 'range'

/** Tom da cor de progresso baseado em pct concluído */
export type ProgressTone = 'cold' | 'warm' | 'hot' | 'done' | 'late'

export interface ObjetivoViewModel {
  /** Goal row do backend */
  goal: Goal
  /** Catálogo do metricType associado (label, unit, normalMin/Max) */
  tipo: MetricTypeInfo
  /** Lucide icon name */
  iconeNome: string
  /** Tailwind suffix (ex: 'teal-300') */
  iconeCor: string
  /** Tailwind class (ex: 'bg-teal-500/15') */
  iconeBg: string
  /** Visual escolhido pra progress */
  visual: GoalVisual
  /** Direção esperada (true = aumentar, false = reduzir, null = manter) */
  isAscending: boolean | null
  /** Progress 0-100 (clamp) */
  progressPct: number
  /** Tom do progresso */
  tone: ProgressTone
  /** Texto humanizado de tempo restante ("Faltam 12 dias", "Atrasado 3 dias", "Concluído") */
  tempoLabel: string
  /** Sugestão IA opcional ("Mantenha o ritmo atual", "Aumente caminhada nos finais de semana") */
  sugestaoIA: string | null
}

export interface ObjetivosStats {
  ativos: number
  progressoMedio: number // 0-100
  concluidos: number
  cancelados: number
}

export interface FiltroOpcao {
  id: GoalStatus
  label: string
  count: number
}

export interface ObjetivosData {
  stats: ObjetivosStats
  filtros: FiltroOpcao[]
  objetivos: ObjetivoViewModel[]
}

export interface ObjetivosProps {
  data: ObjetivosData
  selectedStatus: GoalStatus
  onStatusChange?: (status: GoalStatus) => void
  onObjetivoClick?: (objetivo: ObjetivoViewModel) => void
  onCriarClick?: () => void
  onRefresh?: () => Promise<void>
}
