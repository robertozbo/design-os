import { ArrowRight, ShieldAlert } from 'lucide-react'
import type {
  Nr1Kpi,
  Nr1StripData,
  WorkspaceContext,
} from '@/../product/sections/professional-dashboard/types'

interface Props {
  workspace: WorkspaceContext
  nr1: Nr1StripData
  revealIndex?: number
  onOpenModule?: () => void
}

const toneClass: Record<Nr1Kpi['tone'], { value: string; hint: string; ring: string }> = {
  good: {
    value: 'text-teal-700 dark:text-teal-300',
    hint: 'text-teal-700/70 dark:text-teal-300/70',
    ring: 'ring-teal-500/30',
  },
  neutral: {
    value: 'text-slate-900 dark:text-slate-50',
    hint: 'text-slate-500 dark:text-slate-400',
    ring: 'ring-slate-300/40 dark:ring-slate-700/60',
  },
  warning: {
    value: 'text-amber-700 dark:text-amber-300',
    hint: 'text-amber-700/70 dark:text-amber-300/70',
    ring: 'ring-amber-500/30',
  },
  critical: {
    value: 'text-rose-700 dark:text-rose-300',
    hint: 'text-rose-700/70 dark:text-rose-300/70',
    ring: 'ring-rose-500/30',
  },
  pending: {
    value: 'text-slate-400 dark:text-slate-500',
    hint: 'text-slate-400 dark:text-slate-500',
    ring: 'ring-slate-300/40 dark:ring-slate-700/60',
  },
}

export function Nr1Strip({ workspace, nr1, revealIndex = 0, onOpenModule }: Props) {
  return (
    <section
      style={{ animationDelay: `${60 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        rounded-2xl
        bg-gradient-to-br from-indigo-50 via-white to-white
        dark:from-indigo-950/30 dark:via-slate-900/80 dark:to-slate-900/80
        border border-indigo-200/70 dark:border-indigo-900/50
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        overflow-hidden
      "
      aria-labelledby="nr1-heading"
    >
      {/* Header */}
      <header className="flex flex-col gap-2 px-5 py-3 md:flex-row md:items-center md:justify-between border-b border-indigo-200/60 dark:border-indigo-900/40">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center">
            <ShieldAlert
              aria-hidden="true"
              className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
            />
          </div>
          <div className="min-w-0">
            <h2
              id="nr1-heading"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300"
            >
              NR-1 · Compliance psicossocial
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {workspace.name}
              </span>
              <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
              <span>{nr1.cycleLabel}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenModule?.()}
          className="
            shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full
            text-xs font-medium
            bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50
            dark:bg-slate-900/80 dark:text-indigo-300 dark:border-indigo-900/60 dark:hover:bg-indigo-950/40
            transition-colors
          "
        >
          <span>Abrir módulo NR-1</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-indigo-200/40 dark:divide-indigo-900/30">
        {nr1.kpis.map((kpi) => (
          <Nr1KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    </section>
  )
}

function Nr1KpiCard({ kpi }: { kpi: Nr1Kpi }) {
  const tone = toneClass[kpi.tone]
  return (
    <div
      className={`
        relative px-5 py-3
        ${kpi.isPending ? 'opacity-80' : ''}
      `}
    >
      <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
        {kpi.label}
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className={`text-2xl font-semibold tracking-tight tabular-nums ${tone.value}`}>
          {kpi.value}
        </span>
        {kpi.unit && (
          <span className="text-xs text-slate-500 dark:text-slate-400">{kpi.unit}</span>
        )}
        {kpi.isPending && (
          <span
            className="
              ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded
              text-[9px] font-semibold uppercase tracking-wider
              bg-slate-100 text-slate-500
              dark:bg-slate-800 dark:text-slate-400
            "
          >
            em breve
          </span>
        )}
      </div>
      <p className={`mt-0.5 text-[11px] ${tone.hint}`}>{kpi.hint}</p>
    </div>
  )
}
