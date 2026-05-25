import { ChevronRight, ImageIcon } from 'lucide-react'
import type {
  AnalysisSnapshot,
  ScoreBand,
} from '@/../product/sections/minha-sa-de-paciente/types'

interface SnapshotRowProps {
  snapshot: AnalysisSnapshot
  previousScore?: number | null
  thumbnailUrl?: string
  selected?: boolean
  onClick?: (snapshotId: string) => void
}

const BAND_COLOR: Record<ScoreBand, string> = {
  good: 'text-emerald-500 dark:text-emerald-400',
  attention: 'text-amber-500 dark:text-amber-400',
  risk: 'text-rose-500 dark:text-rose-400',
}

const BADGE_LABEL: Record<string, string> = {
  baseline: 'Inicial',
  latest: 'Atual',
}

function formatDateBR(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function deltaLabel(score: number, previous?: number | null): string {
  if (previous == null) return ''
  const diff = score - previous
  if (diff === 0) return '±0'
  return diff > 0 ? `+${diff}` : `${diff}`
}

export function SnapshotRow({
  snapshot,
  previousScore,
  thumbnailUrl,
  selected,
  onClick,
}: SnapshotRowProps) {
  const delta = deltaLabel(snapshot.score, previousScore)
  const deltaColor =
    previousScore == null
      ? 'text-slate-400 dark:text-slate-500'
      : snapshot.score > previousScore
        ? 'text-emerald-500 dark:text-emerald-400'
        : snapshot.score < previousScore
          ? 'text-rose-500 dark:text-rose-400'
          : 'text-slate-400 dark:text-slate-500'

  return (
    <button
      type="button"
      onClick={() => onClick?.(snapshot.id)}
      aria-pressed={selected}
      className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
        selected
          ? 'border-teal-500 bg-teal-500/5 dark:border-teal-400 dark:bg-teal-400/10'
          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
      }`}
    >
      {/* Thumbnail */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon
            className="h-5 w-5 text-slate-400 dark:text-slate-500"
            aria-hidden
          />
        )}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
            {formatDateBR(snapshot.date)}
          </span>
          {snapshot.badges.map((b) => (
            <span
              key={b}
              className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-teal-700 ring-1 ring-teal-500/20 dark:text-teal-300"
            >
              {BADGE_LABEL[b] ?? b}
            </span>
          ))}
        </div>
        <p className="mt-1 truncate text-sm text-slate-700 dark:text-slate-200">
          {snapshot.excerpt}
        </p>
      </div>

      {/* Score */}
      <div className="flex items-baseline gap-1.5">
        <span
          className={`font-mono text-2xl font-semibold ${BAND_COLOR[snapshot.band]}`}
        >
          {snapshot.score}
        </span>
        {delta && (
          <span className={`font-mono text-xs ${deltaColor}`}>{delta}</span>
        )}
      </div>

      <ChevronRight
        className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-slate-500"
        aria-hidden
      />
    </button>
  )
}
