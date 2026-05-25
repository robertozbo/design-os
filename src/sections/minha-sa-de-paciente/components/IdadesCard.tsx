import { Calendar, Activity } from 'lucide-react'
import type { FourAges } from '@/../product/sections/minha-sa-de-paciente/types'

interface IdadesCardProps {
  ages: FourAges
}

export function IdadesCard({ ages }: IdadesCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Idades
        </h3>
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
          estimativas
        </span>
      </header>

      <div className="divide-y divide-slate-100 px-5 dark:divide-slate-800">
        {/* Real */}
        <div className="flex items-center gap-3 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Real
            </p>
            <p className="font-mono text-sm text-slate-500 dark:text-slate-400">
              {ages.real} anos
            </p>
          </div>
        </div>

        {/* Corporal */}
        <div className="flex items-center gap-3 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
            <Activity className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Corporal
              </p>
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                estimativa
              </span>
            </div>
            <p className="font-mono text-sm text-slate-500 dark:text-slate-400">
              {ages.corporal != null ? `${ages.corporal} anos` : '—'}
            </p>
          </div>
          {ages.corporalDelta != null && (
            <span
              className={`inline-flex items-center rounded-lg px-2.5 py-1 font-mono text-sm font-bold ${
                ages.corporalDelta < 0
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                  : ages.corporalDelta > 0
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
              aria-label={`Diferença ${ages.corporalDelta} anos`}
            >
              {ages.corporalDelta > 0 ? '+' : ''}
              {ages.corporalDelta}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
