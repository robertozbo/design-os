import { FlaskConical, ArrowUpRight } from 'lucide-react'
import type {
  BiomarkerStatus,
  DashboardBiomarkers,
} from '@/../product/sections/dashboard/types'

export interface BiomarkersCardProps {
  biomarkers: DashboardBiomarkers
  revealIndex?: number
  onNavigate?: () => void
}

const STATUS_STYLES: Record<BiomarkerStatus, { dot: string; label: string; labelColor: string }> = {
  normal: {
    dot: 'bg-emerald-500',
    label: 'Normal',
    labelColor: 'text-emerald-700 dark:text-emerald-300',
  },
  borderline: {
    dot: 'bg-amber-500',
    label: 'Limítrofe',
    labelColor: 'text-amber-700 dark:text-amber-300',
  },
  'out-of-range': {
    dot: 'bg-rose-500',
    label: 'Fora',
    labelColor: 'text-rose-700 dark:text-rose-300',
  },
}

function formatExamDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
  } catch {
    return iso
  }
}

export function BiomarkersCard({
  biomarkers,
  revealIndex = 0,
  onNavigate,
}: BiomarkersCardProps) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        group flex flex-col text-left h-full
        rounded-2xl p-5
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        backdrop-blur-[2px]
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
        transition-[transform,box-shadow] duration-300 ease-out
        hover:-translate-y-0.5
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40
      "
    >
      <header className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Exames
            </span>
          </div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FlaskConical className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Biomarcadores
          </h3>
          {biomarkers.lastExamDate && (
            <p className="mt-0.5 text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
              Último exame · {formatExamDate(biomarkers.lastExamDate)}
            </p>
          )}
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </header>

      {biomarkers.items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-6">
          <div className="grid place-items-center w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Nenhum exame ainda
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              Faça upload do primeiro exame pra ver seus biomarcadores aqui.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium text-rose-700 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-400/10">
            Fazer upload
          </span>
        </div>
      ) : (
        <ul className="flex-1 flex flex-col gap-2.5">
          {biomarkers.items.slice(0, 4).map((b) => {
            const sty = STATUS_STYLES[b.status]
            return (
              <li key={b.id} className="flex items-center justify-between gap-3 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${sty.dot} shrink-0`} aria-hidden="true" />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                      {b.name}
                    </div>
                    <div className={`text-[10px] font-medium ${sty.labelColor}`}>
                      {sty.label} · ref {b.referenceRange}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-mono text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                    {b.value}
                  </span>
                  <span className="ml-1 text-[10px] text-slate-500 dark:text-slate-400">
                    {b.unit}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </button>
  )
}
