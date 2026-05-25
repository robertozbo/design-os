import { Calendar, ChevronDown } from 'lucide-react'
import type { Snapshot } from '@/../product-mobile/sections/minha-saude/types'
import { formatDateBR, statusFromScore, STATUS_VISUAL } from './_shared'

interface SnapshotPickerProps {
  label: string
  snapshot: Snapshot
  onClick?: () => void
}

export function SnapshotPicker({ label, snapshot, onClick }: SnapshotPickerProps) {
  const visual = STATUS_VISUAL[statusFromScore(snapshot.scoreGeral)]
  return (
    <button
      onClick={onClick}
      className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3 flex items-center gap-3 text-left"
    >
      <div className={`w-11 h-11 rounded-xl ${visual.bg} flex flex-col items-center justify-center ${visual.text} shrink-0`}>
        <span className="text-[14px] font-bold font-mono tabular-nums leading-none">{snapshot.scoreGeral}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">{label}</div>
        <div className="text-slate-100 font-semibold text-[13.5px] font-mono tabular-nums mt-0.5">
          {formatDateBR(snapshot.geradoEm)}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-1 text-slate-500">
        <Calendar size={13} strokeWidth={2.2} />
        <ChevronDown size={13} />
      </div>
    </button>
  )
}
