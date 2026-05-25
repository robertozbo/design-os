import {
  Heart,
  HeartPulse,
  Moon,
  Footprints,
  Activity,
  Waves,
  Scale,
  Droplet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type {
  EntriesView,
  MetricReading,
  MetricType,
} from '@/../product/sections/metrics/types'

export interface RecentEntriesListProps {
  entries: MetricReading[]
  view: EntriesView
  page: number
  pageSize: number
  totalFiltered: number
  query: string
  revealIndex?: number
  onPageChange: (page: number) => void
  onClearQuery: () => void
}

const TYPE_META: Record<MetricType, { label: string; icon: ComponentType<{ className?: string }> }> = {
  heartRate: { label: 'Frequência cardíaca', icon: Heart },
  sleep: { label: 'Sono', icon: Moon },
  steps: { label: 'Passos', icon: Footprints },
  spo2: { label: 'SpO2', icon: Activity },
  hrv: { label: 'HRV', icon: Waves },
  weight: { label: 'Peso', icon: Scale },
  bloodPressure: { label: 'Pressão arterial', icon: HeartPulse },
  glucose: { label: 'Glicemia', icon: Droplet },
}

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function RecentEntriesList({
  entries,
  view,
  page,
  pageSize,
  totalFiltered,
  query,
  revealIndex = 0,
  onPageChange,
  onClearQuery,
}: RecentEntriesListProps) {
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize

  if (totalFiltered === 0) {
    return (
      <section
        style={{ animationDelay: `${80 * revealIndex}ms` }}
        className="
          nymos-reveal opacity-0
          rounded-2xl
          bg-white/90 dark:bg-slate-900/80
          border border-dashed border-slate-200 dark:border-slate-800
          p-10 text-center
        "
      >
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Nenhum registro encontrado
        </div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {query
            ? 'Ajuste a busca pra ver outros resultados.'
            : 'Cadastre uma medida pelo botão "+ Cadastrar" no topo.'}
        </div>
        {query && (
          <button
            type="button"
            onClick={onClearQuery}
            className="
              mt-3 inline-flex items-center
              px-3 py-1.5 rounded-full
              text-xs font-medium
              text-teal-700 dark:text-teal-300
              hover:bg-teal-500/10 dark:hover:bg-teal-400/10
              transition-colors
            "
          >
            Limpar busca
          </button>
        )}
      </section>
    )
  }

  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        backdrop-blur-[2px]
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
        overflow-hidden
      "
    >
      {view === 'list' ? (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {entries.map((entry) => {
            const meta = TYPE_META[entry.metricType]
            const Icon = meta?.icon ?? Activity
            return (
              <li
                key={entry.id}
                className="
                  flex items-center gap-3 px-5 py-3.5
                  hover:bg-slate-50/60 dark:hover:bg-slate-800/40
                  transition-colors
                "
              >
                <div
                  className="
                    shrink-0 grid place-items-center w-9 h-9 rounded-xl
                    bg-slate-100 dark:bg-slate-800
                    text-slate-600 dark:text-slate-300
                  "
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {meta?.label ?? entry.metricType}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0 font-mono tabular-nums">
                      {formatWhen(entry.recordedAt)}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {entry.note}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {entry.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    {entry.unit}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {entries.map((entry) => {
            const meta = TYPE_META[entry.metricType]
            const Icon = meta?.icon ?? Activity
            return (
              <div
                key={entry.id}
                className="
                  flex flex-col gap-2 p-3
                  rounded-xl
                  bg-slate-50 dark:bg-slate-800/40
                  border border-slate-200/80 dark:border-slate-800
                  hover:border-slate-300 dark:hover:border-slate-700
                  transition-colors
                "
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="
                      shrink-0 grid place-items-center w-7 h-7 rounded-lg
                      bg-white dark:bg-slate-900
                      text-slate-600 dark:text-slate-300
                      border border-slate-200 dark:border-slate-800
                    "
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                    {meta?.label ?? entry.metricType}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <div className="font-mono text-lg font-semibold text-slate-900 dark:text-slate-100 leading-none tabular-nums">
                    {entry.value}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {entry.unit}
                  </div>
                </div>
                <div className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400 -mb-0.5">
                  {formatWhen(entry.recordedAt)}
                </div>
                {entry.note && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {entry.note}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {totalFiltered > pageSize && (
        <footer className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {start + 1}–{Math.min(start + pageSize, totalFiltered)} de {totalFiltered}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, safePage - 1))}
              disabled={safePage === 1}
              aria-label="Página anterior"
              className="
                grid place-items-center w-8 h-8 rounded-lg
                text-slate-500 dark:text-slate-400
                hover:bg-slate-100 dark:hover:bg-slate-800
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
                transition-colors
              "
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-mono tabular-nums text-slate-600 dark:text-slate-400">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
              disabled={safePage === totalPages}
              aria-label="Próxima página"
              className="
                grid place-items-center w-8 h-8 rounded-lg
                text-slate-500 dark:text-slate-400
                hover:bg-slate-100 dark:hover:bg-slate-800
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
                transition-colors
              "
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
    </section>
  )
}
