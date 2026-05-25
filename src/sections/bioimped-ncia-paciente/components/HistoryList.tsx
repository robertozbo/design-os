import {
  ChevronRight,
  Scale,
  Wand2,
  Smartphone,
  Bluetooth,
  type LucideIcon,
} from 'lucide-react'
import type {
  BioHistoryEntry,
  EvaluationSource,
} from '@/../product/sections/bioimped-ncia-paciente/types'

interface HistoryListProps {
  entries: BioHistoryEntry[]
  onOpen?: (id: string) => void
}

const SOURCE_BADGE: Record<
  EvaluationSource,
  { label: string; Icon: LucideIcon; cls: string }
> = {
  ia: {
    label: 'IA',
    Icon: Wand2,
    cls: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  },
  manual: {
    label: 'Manual',
    Icon: Smartphone,
    cls: 'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200',
  },
  device: {
    label: 'Device',
    Icon: Bluetooth,
    cls: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
  },
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

function MiniKpi({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  return (
    <div className="text-center">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
        {value != null ? value.toFixed(1) : '—'}
        <span className="ml-0.5 text-[9px] font-normal text-slate-500">
          {unit}
        </span>
      </p>
    </div>
  )
}

export function HistoryList({ entries, onOpen }: HistoryListProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Histórico
        </h2>
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {entries.length} leitura{entries.length !== 1 ? 's' : ''}
        </span>
      </header>

      {entries.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <Scale className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Nenhuma leitura ainda
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {entries.map((entry) => {
            const src = SOURCE_BADGE[entry.source]
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onOpen?.(entry.id)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                >
                  <div className="h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                    {entry.thumbnailUrl ? (
                      <img
                        src={entry.thumbnailUrl}
                        alt={`Leitura ${formatDate(entry.date)}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <Scale className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {formatDate(entry.date)}
                    </p>
                    <span
                      className={`mt-0.5 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${src.cls}`}
                      title={`Fonte: ${src.label}`}
                    >
                      <src.Icon className="h-2.5 w-2.5" />
                      {src.label}
                    </span>
                  </div>
                  <div className="hidden gap-3 sm:flex">
                    <MiniKpi label="Peso" value={entry.weight} unit="kg" />
                    <MiniKpi label="Gord." value={entry.bodyFat} unit="%" />
                    <MiniKpi label="Músc." value={entry.muscleMass} unit="kg" />
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
