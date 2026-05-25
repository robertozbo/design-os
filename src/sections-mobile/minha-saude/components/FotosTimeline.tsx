import { useState } from 'react'
import { Camera, PersonStanding, ChevronRight } from 'lucide-react'
import type { Snapshot, SnapshotFotos } from '@/../product-mobile/sections/minha-saude/types'
import { formatDateBR } from './_shared'

type Pose = keyof SnapshotFotos

const POSES: { id: Pose; label: string }[] = [
  { id: 'frontal', label: 'Frente' },
  { id: 'posterior', label: 'Costas' },
  { id: 'lateralEsquerda', label: 'Perfil E' },
  { id: 'lateralDireita', label: 'Perfil D' },
]

interface FotosTimelineProps {
  snapshots: Snapshot[]
  onSnapshotClick?: (id: string) => void
}

export function FotosTimeline({ snapshots, onSnapshotClick }: FotosTimelineProps) {
  const [pose, setPose] = useState<Pose>('frontal')

  const cronologico = [...snapshots]
    .filter((s) => s.fotos?.[pose])
    .sort((a, b) => a.geradoEm.localeCompare(b.geradoEm))

  if (cronologico.length === 0) return null

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <div className="px-3.5 py-2.5 border-b border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Camera size={11} strokeWidth={2.4} />
          Evolução visual
        </span>
        <span className="text-slate-600 text-[10px] font-mono tabular-nums">
          {cronologico.length} análise{cronologico.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="px-2 pt-2 pb-1 flex gap-1 overflow-x-auto no-scrollbar">
        {POSES.map((p) => {
          const active = p.id === pose
          return (
            <button
              key={p.id}
              onClick={() => setPose(p.id)}
              className={`px-2.5 h-7 rounded-full text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      <div className="relative">
        <div className="px-3 pb-3 pt-1 flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {cronologico.map((s, i) => {
            const isLast = i === cronologico.length - 1
            return (
              <button
                key={s.id}
                onClick={() => onSnapshotClick?.(s.id)}
                className="shrink-0 w-[88px] snap-start text-left group"
              >
                <div
                  className={`aspect-[3/4] rounded-xl bg-slate-950/60 border ${
                    isLast ? 'border-teal-500/40' : 'border-slate-800'
                  } flex items-center justify-center relative overflow-hidden group-hover:border-slate-700 transition-colors`}
                >
                  <PersonStanding
                    size={48}
                    className={isLast ? 'text-teal-300/40' : 'text-slate-600/60'}
                    strokeWidth={1.3}
                  />
                  {isLast && (
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[8.5px] font-semibold uppercase tracking-wider font-mono">
                      hoje
                    </span>
                  )}
                  <span className="absolute bottom-0.5 left-0 right-0 text-center text-[9px] font-mono text-slate-500 font-semibold">
                    {snapshotShortLabel(s, i, cronologico.length)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono tabular-nums mt-1.5 text-center">
                  {formatDateShort(s.geradoEm)}
                </div>
                <div className="text-[9.5px] text-slate-600 text-center mt-0.5">
                  score {s.scoreGeral}
                </div>
              </button>
            )
          })}
        </div>
        {cronologico.length > 3 && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronRight size={14} className="text-slate-600" />
          </div>
        )}
      </div>
    </div>
  )
}

function snapshotShortLabel(s: Snapshot, i: number, total: number): string {
  if (i === 0) return 'baseline'
  if (i === total - 1) return formatDateBR(s.geradoEm).slice(0, 5)
  return formatDateBR(s.geradoEm).slice(0, 5)
}

function formatDateShort(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y.slice(2)}`
}
