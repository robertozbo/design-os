import { ChevronRight, TrendingUp, TrendingDown, Minus, Camera } from 'lucide-react'
import type { Snapshot } from '@/../product-mobile/sections/minha-saude/types'
import { statusFromScore, STATUS_VISUAL, formatDateBR } from './_shared'

interface SnapshotRowProps {
  snapshot: Snapshot
  isFirst?: boolean
  isLatest?: boolean
  onClick?: (id: string) => void
}

export function SnapshotRow({ snapshot, isFirst, isLatest, onClick }: SnapshotRowProps) {
  const status = statusFromScore(snapshot.scoreGeral)
  const visual = STATUS_VISUAL[status]
  const hasFotos = !!snapshot.fotos
  const fotoCount = snapshot.fotos
    ? Object.values(snapshot.fotos).filter(Boolean).length
    : 0

  return (
    <button
      onClick={() => onClick?.(snapshot.id)}
      className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 flex items-start gap-3 text-left"
    >
      <div className="shrink-0 flex flex-col items-center gap-1">
        <div
          className={`w-12 h-12 rounded-xl ${visual.bg} flex items-center justify-center ${visual.text} font-bold text-[16px] font-mono tabular-nums`}
        >
          {snapshot.scoreGeral}
        </div>
        {snapshot.deltaScore !== null && <DeltaIndicator delta={snapshot.deltaScore} />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-100 font-semibold text-[13.5px] font-mono tabular-nums">
            {formatDateBR(snapshot.geradoEm)}
          </span>
          {isLatest && (
            <span className="px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-300 text-[9px] font-semibold uppercase tracking-wider">
              Última
            </span>
          )}
          {isFirst && (
            <span className="px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 text-[9px] font-semibold uppercase tracking-wider">
              Linha de base
            </span>
          )}
        </div>
        <p className="text-slate-400 text-[11.5px] mt-1 leading-snug line-clamp-2">{snapshot.resumoIA}</p>
        <div className="mt-2 flex items-center gap-2.5 text-[10px] text-slate-500">
          {hasFotos && (
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <Camera size={10} strokeWidth={2.4} />
              {fotoCount} foto{fotoCount === 1 ? '' : 's'}
            </span>
          )}
          {snapshot.destaques.length > 0 && (
            <span className="font-mono tabular-nums">{snapshot.destaques.length} destaques</span>
          )}
        </div>
      </div>

      <ChevronRight size={14} className="text-slate-600 shrink-0 mt-1" />
    </button>
  )
}

function DeltaIndicator({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <div className="text-slate-500 text-[10px] font-mono tabular-nums flex items-center gap-0.5">
        <Minus size={10} />
        <span>0</span>
      </div>
    )
  }
  const Icon = delta > 0 ? TrendingUp : TrendingDown
  const cls = delta > 0 ? 'text-emerald-400' : 'text-rose-400'
  return (
    <div className={`${cls} text-[10px] font-mono tabular-nums font-semibold flex items-center gap-0.5`}>
      <Icon size={10} strokeWidth={2.6} />
      <span>
        {delta > 0 ? '+' : ''}
        {delta}
      </span>
    </div>
  )
}
