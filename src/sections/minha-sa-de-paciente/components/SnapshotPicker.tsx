import type { AnalysisSnapshot } from '@/../product/sections/minha-sa-de-paciente/types'
import { SnapshotRow } from './SnapshotRow'

interface SnapshotPickerProps {
  label: string
  snapshots: AnalysisSnapshot[]
  selectedId: string | null
  thumbnailById?: Record<string, string>
  onSelect: (snapshotId: string) => void
}

export function SnapshotPicker({
  label,
  snapshots,
  selectedId,
  thumbnailById,
  onSelect,
}: SnapshotPickerProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </h4>
      <div
        role="listbox"
        aria-label={label}
        className="max-h-[420px] space-y-2 overflow-y-auto pr-1"
      >
        {snapshots.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Nenhum snapshot disponível
          </p>
        ) : (
          snapshots.map((snapshot, idx) => {
            const previous = snapshots[idx + 1] // older snapshot
            return (
              <SnapshotRow
                key={snapshot.id}
                snapshot={snapshot}
                previousScore={previous?.score ?? null}
                thumbnailUrl={thumbnailById?.[snapshot.id]}
                selected={snapshot.id === selectedId}
                onClick={onSelect}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
