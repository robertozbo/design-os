import { useMemo, useState } from 'react'
import type {
  EntriesView,
  MetricsProps,
  MetricType,
  Timeframe,
} from '@/../product/sections/metrics/types'
import { MetricsHeader } from './MetricsHeader'
import { MetricCardItem } from './MetricCardItem'
import { ManualEntryModal } from './ManualEntryModal'
import { EntriesControlsBar } from './EntriesControlsBar'
import { RecentEntriesList } from './RecentEntriesList'
import { HistoryEvolution } from './HistoryEvolution'

const TYPE_LABEL_FOR_SEARCH: Record<MetricType, string> = {
  heartRate: 'frequência cardíaca',
  sleep: 'sono',
  steps: 'passos',
  spo2: 'spo2',
  hrv: 'hrv variabilidade',
  weight: 'peso',
  bloodPressure: 'pressão arterial',
  glucose: 'glicemia glicose',
}

export function Metrics({
  timeframe,
  metrics,
  manualEntryConfigs,
  recentEntries,
  entriesPagination,
  history,
  onTimeframeChange,
  onOpenManualEntry,
  onSubmitManualEntry,
  onConnectDevice,
  onSelectMetric,
  onHistoryFilterChange,
  onEntriesSearchChange,
  onEntriesViewChange,
  onEntriesPageChange,
}: MetricsProps) {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>(timeframe)
  const [modalType, setModalType] = useState<MetricType | null>(null)
  const [entriesQuery, setEntriesQuery] = useState('')
  const [entriesView, setEntriesView] = useState<EntriesView>('list')
  const [entriesPage, setEntriesPage] = useState(entriesPagination.page)

  const handleTimeframe = (next: Timeframe) => {
    setActiveTimeframe(next)
    onTimeframeChange?.(next)
  }

  const handleRegister = (type: MetricType) => {
    setModalType(type)
    onOpenManualEntry?.(type)
  }

  const handleClose = () => setModalType(null)

  const handleEntriesQuery = (q: string) => {
    setEntriesQuery(q)
    setEntriesPage(1)
    onEntriesSearchChange?.(q)
  }

  const handleEntriesView = (v: EntriesView) => {
    setEntriesView(v)
    onEntriesViewChange?.(v)
  }

  const handleEntriesPage = (p: number) => {
    setEntriesPage(p)
    onEntriesPageChange?.(p)
  }

  const filteredEntries = useMemo(() => {
    const q = entriesQuery.trim().toLowerCase()
    if (!q) return recentEntries
    return recentEntries.filter((e) => {
      const typeLabel = TYPE_LABEL_FOR_SEARCH[e.metricType] ?? e.metricType
      return (
        typeLabel.includes(q) ||
        e.metricType.toLowerCase().includes(q) ||
        String(e.value).toLowerCase().includes(q) ||
        e.note.toLowerCase().includes(q)
      )
    })
  }, [recentEntries, entriesQuery])

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / entriesPagination.pageSize))
  const safePage = Math.min(entriesPage, totalPages)
  const start = (safePage - 1) * entriesPagination.pageSize
  const pagedEntries = filteredEntries.slice(start, start + entriesPagination.pageSize)

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <MetricsHeader
          timeframe={activeTimeframe}
          manualEntryConfigs={manualEntryConfigs}
          onTimeframeChange={handleTimeframe}
          onCreate={handleRegister}
        />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {metrics.map((metric, idx) => (
            <MetricCardItem
              key={metric.id}
              metric={metric}
              revealIndex={idx + 2}
              onRegister={handleRegister}
              onConnect={onConnectDevice}
              onSelect={onSelectMetric}
            />
          ))}
        </div>

        {recentEntries.length > 0 && (
          <>
            <div
              className="nymos-reveal opacity-0 mt-10"
              style={{ animationDelay: `${80 * (metrics.length + 2)}ms` }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                  Registros manuais
                </span>
              </div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Últimas medições
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                {entriesQuery.trim() ? (
                  <>
                    {filteredEntries.length} de {recentEntries.length} registros
                  </>
                ) : (
                  <>{recentEntries.length} registros no total</>
                )}
              </p>
            </div>

            <div
              className="nymos-reveal opacity-0 mt-3"
              style={{ animationDelay: `${80 * (metrics.length + 3)}ms` }}
            >
              <EntriesControlsBar
                query={entriesQuery}
                view={entriesView}
                onQueryChange={handleEntriesQuery}
                onViewChange={handleEntriesView}
              />
            </div>

            <div className="mt-3">
              <RecentEntriesList
                entries={pagedEntries}
                view={entriesView}
                page={safePage}
                pageSize={entriesPagination.pageSize}
                totalFiltered={filteredEntries.length}
                query={entriesQuery}
                revealIndex={metrics.length + 4}
                onPageChange={handleEntriesPage}
                onClearQuery={() => handleEntriesQuery('')}
              />
            </div>
          </>
        )}

        <div className="mt-6">
          <HistoryEvolution
            history={history}
            revealIndex={metrics.length + 5}
            onFilterChange={onHistoryFilterChange}
          />
        </div>
      </div>

      <ManualEntryModal
        open={modalType !== null}
        metricType={modalType}
        config={modalType ? (manualEntryConfigs[modalType] ?? null) : null}
        onClose={handleClose}
        onSubmit={onSubmitManualEntry}
      />
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
