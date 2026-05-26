// Insights — types do protótipo mobile (espelhando o que existe em produção)
// Real source: mobile/src/hooks/use-insights.ts + mobile/src/services/insights.service.ts

export type InsightSource = 'micro' | 'weekly'

export type InsightCategory =
  | 'weekly_summary'
  | 'metric_alert'
  | 'metric_highlight'
  | 'nutrition'
  | 'nutrition_tip'
  | 'activity'
  | 'activity_suggestion'
  | 'weekend_tip'

export type InsightSeverity = 'info' | 'attention' | 'alert'

/** Métrica relacionada exibida como chip no card (ex.: "humor 7d", "passos 24h"). */
export interface InsightRelatedMetric {
  key: string
  label: string
}

export interface Insight {
  id: string
  source: InsightSource
  category: InsightCategory
  severity: InsightSeverity
  title: string
  /** Texto completo. Card mostra preview de até ~120 chars + "Ver mais" pra expandir. */
  content: string
  isRead: boolean
  /** ISO datetime de geração. */
  generatedAtISO: string
  /** Label formatado pra render: `dd/mm HH:mm`. */
  generatedAtLabel: string
  /** Métricas correlacionadas pela IA (display-only). */
  relatedMetrics?: InsightRelatedMetric[]
}

export interface InsightStats {
  total: number
  unread: number
  weekly: number
  alerts: number
}

export type InsightFilterKey =
  | 'all'
  | 'weekly_summary'
  | 'metric_alert'
  | 'nutrition'
  | 'activity'

export interface InsightsData {
  stats: InsightStats
  /** Ordem desc (mais recente primeiro). */
  insights: Insight[]
}

export interface InsightsProps {
  data: InsightsData
  /** Marca insight como lido (chamado on expand de card não lido, source: 'micro'). */
  onMarcarLido?: (insightId: string) => void
  /** Pull-to-refresh. */
  onRefresh?: () => void
}
