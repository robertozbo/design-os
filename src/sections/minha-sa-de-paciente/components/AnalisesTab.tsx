import { Archive } from 'lucide-react'
import type {
  AnalysisSnapshot,
  FreshnessGate,
  FreshnessRequirementKind,
} from '@/../product/sections/minha-sa-de-paciente/types'
import { FreshnessCard } from './FreshnessCard'
import { SnapshotRow } from './SnapshotRow'

interface AnalisesTabProps {
  freshnessGate: FreshnessGate
  snapshots: AnalysisSnapshot[]
  thumbnailById?: Record<string, string>
  onRequestNewAnalysis?: () => void
  onAddFreshnessRequirement?: (
    kind: FreshnessRequirementKind,
    href: string,
  ) => void
  onOpenSnapshot?: (id: string) => void
  isRequesting?: boolean
}

export function AnalisesTab({
  freshnessGate,
  snapshots,
  thumbnailById,
  onRequestNewAnalysis,
  onAddFreshnessRequirement,
  onOpenSnapshot,
  isRequesting,
}: AnalisesTabProps) {
  return (
    <div className="space-y-6">
      <FreshnessCard
        gate={freshnessGate}
        onAddRequirement={onAddFreshnessRequirement}
        onRequestNewAnalysis={onRequestNewAnalysis}
        isRequesting={isRequesting}
      />

      <div>
        <div className="mb-3 flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <Archive className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Histórico
            </h2>
          </div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {snapshots.length} análise{snapshots.length !== 1 ? 's' : ''}
          </span>
        </div>

        {snapshots.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/40 p-8 text-center dark:border-slate-700 dark:bg-slate-800/30">
            <Archive className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500" />
            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Nenhuma análise gerada
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Sua primeira análise aparece aqui quando ficar pronta
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {snapshots.map((snap, idx) => {
              const previous = snapshots[idx + 1] // older
              return (
                <SnapshotRow
                  key={snap.id}
                  snapshot={snap}
                  previousScore={previous?.score ?? null}
                  thumbnailUrl={thumbnailById?.[snap.id]}
                  onClick={onOpenSnapshot}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
