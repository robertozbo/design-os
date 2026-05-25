// Exames — types do protótipo mobile (espelhando o que existe em produção)
// Real source: mobile/src/services/exams.service.ts (simplificado pra spec)

export type ValueStatus = 'normal' | 'warning' | 'critical'

export type ProcessingPhase =
  | 'validating'
  | 'extracting'
  | 'validation_failed'
  | 'extraction_failed'
  | 'error'
  | 'done'

export interface ExamType {
  id: string
  name: string
  displayName: string
  category: 'laboratorial'
}

export interface ExtractedValue {
  value: number
  unit: string
  normalMin: number
  normalMax: number
  status: ValueStatus
}

export interface Exam {
  id: string
  examType: ExamType
  fileName: string
  createdAtISO: string
  /** HH:mm pra render */
  timeLabel: string
  /** Mapa de marcadores extraídos pela IA. Vazio quando ainda processando. */
  extractedValues: Record<string, ExtractedValue>
  /** Estado do pipeline de IA. */
  processing: {
    phase: ProcessingPhase
    failed: boolean
    errorMessage?: string
  }
}

export interface ExamStats {
  total: number
  processed: number
  pending: number
  failed: number
  /** Quantidade de exames por tipo (label → count). Top tipos. */
  byType: { typeName: string; label: string; count: number }[]
}

/** Grupo de exames por data — usado pelo SectionList do mobile. */
export interface ExamDateGroup {
  /** Label formatado: "Segunda, 25 maio" */
  dateLabel: string
  dateISO: string
  exams: Exam[]
}

export interface ExamesData {
  stats: ExamStats
  /** Histórico agrupado por data, ordem desc (mais recente primeiro). */
  groups: ExamDateGroup[]
}

export interface ExamesProps {
  data: ExamesData
  /** Tap no card de exame → abre detalhe (modal/sheet com extractedValues). */
  onAbrirExame?: (examId: string) => void
  /** Botão flutuante / empty state CTA → fluxo de captura novo exame. */
  onNovoExame?: () => void
  /** Tap em "Histórico" no resumo por tipo → tela ExamHistory. */
  onAbrirHistorico?: () => void
  /** Pull-to-refresh. */
  onRefresh?: () => void
}
