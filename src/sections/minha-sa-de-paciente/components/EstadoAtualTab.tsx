import type {
  DimensionAggregate,
  DimensionId,
  FourAges,
  HealthNarrative,
  OverallScore,
  PeriodFilterValue,
  PeriodOption,
} from '@/../product/sections/minha-sa-de-paciente/types'
import { ScoreGauge } from './ScoreGauge'
import { IdadesCard } from './IdadesCard'
import { DimensionsCountCard } from './DimensionsCountCard'
import { DimensionCard } from './DimensionCard'
import { NarrativeCard } from './NarrativeCard'
import { PeriodFilter } from './PeriodFilter'
import { EmptyState } from './EmptyState'

interface EstadoAtualTabProps {
  overallScore: OverallScore
  fourAges: FourAges
  dimensions: DimensionAggregate[]
  narrative: HealthNarrative | null
  activeFilter: PeriodFilterValue
  rangeLabel: string
  periodOptions: PeriodOption[]
  onFilterChange?: (next: PeriodFilterValue) => void
  onDrillRoute?: (id: DimensionId, href: string) => void
  onGapAction?: (id: DimensionId, href: string) => void
  onToggleInline?: (id: DimensionId, open: boolean) => void
  onRefreshNarrative?: () => void
  onAddFirstMeasurement?: () => void
  onViewDevices?: () => void
  isLoadingNarrative?: boolean
  hasNarrativeError?: boolean
  isRefreshingNarrative?: boolean
}

function formatUpdatedRelative(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return ''
  const today = new Date()
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'atualizado hoje'
  }
  const diffDays = Math.floor(
    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (diffDays === 1) return 'atualizado ontem'
  if (diffDays < 7) return `atualizado há ${diffDays} dias`
  return `atualizado em ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function EstadoAtualTab({
  overallScore,
  fourAges,
  dimensions,
  narrative,
  activeFilter,
  rangeLabel,
  periodOptions,
  onFilterChange,
  onDrillRoute,
  onGapAction,
  onToggleInline,
  onRefreshNarrative,
  onAddFirstMeasurement,
  onViewDevices,
  isLoadingNarrative,
  hasNarrativeError,
  isRefreshingNarrative,
}: EstadoAtualTabProps) {
  const allEmpty =
    dimensions.length > 0 && dimensions.every((d) => d.state === 'empty')

  return (
    <div className="space-y-6">
      {/* Score gauge */}
      <section className="flex justify-center py-2">
        <ScoreGauge
          value={overallScore.value}
          band={overallScore.band}
          label={overallScore.label}
          updatedRelative={formatUpdatedRelative(overallScore.updatedAt)}
        />
      </section>

      {/* Ages + dimensions count */}
      <div className="grid gap-4 md:grid-cols-2">
        <IdadesCard ages={fourAges} />
        <DimensionsCountCard
          evaluated={overallScore.dimensionsEvaluated}
          total={overallScore.dimensionsTotal}
        />
      </div>

      {/* Dimensions section header */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          Dimensões
        </h2>
      </div>

      <PeriodFilter
        value={activeFilter}
        options={periodOptions}
        rangeLabel={rangeLabel}
        onChange={(next) => onFilterChange?.(next)}
      />

      {allEmpty ? (
        <EmptyState
          onAddFirstMeasurement={onAddFirstMeasurement}
          onViewDevices={onViewDevices}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dimensions.map((d) => (
              <DimensionCard
                key={d.id}
                dimension={d}
                onDrillRoute={onDrillRoute}
                onGapAction={onGapAction}
                onToggleInline={onToggleInline}
              />
            ))}
          </div>
          <NarrativeCard
            narrative={narrative}
            isLoading={isLoadingNarrative}
            isError={hasNarrativeError}
            isRefreshing={isRefreshingNarrative}
            onRefresh={onRefreshNarrative}
          />
        </>
      )}
    </div>
  )
}
