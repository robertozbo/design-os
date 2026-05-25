import { ArrowDown, ArrowUp } from 'lucide-react'

interface KpiCardProps {
  label: string
  icon: React.ReactNode
  value: React.ReactNode
  delta?: { sign: 'up' | 'down' | 'neutral'; text: string; positive?: boolean }
  hint?: React.ReactNode
  progress?: { percent: number; tone?: 'teal' | 'emerald' | 'amber' }
}

export function KpiCard({ label, icon, value, delta, hint, progress }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-teal-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800">
      <header className="flex items-center justify-between text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 dark:text-slate-500">{icon}</span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">
            {label}
          </span>
        </div>
        {delta && delta.sign !== 'neutral' && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums ${
              delta.positive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
            }`}
          >
            {delta.sign === 'up' ? (
              <ArrowUp size={9} strokeWidth={3} />
            ) : (
              <ArrowDown size={9} strokeWidth={3} />
            )}
            {delta.text}
          </span>
        )}
      </header>

      <div className="mt-2.5">{value}</div>

      {progress && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full ${
              progress.tone === 'emerald'
                ? 'bg-emerald-500'
                : progress.tone === 'amber'
                  ? 'bg-amber-500'
                  : 'bg-teal-500'
            }`}
            style={{ width: `${Math.min(100, progress.percent)}%` }}
          />
        </div>
      )}

      {hint && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {hint}
        </p>
      )}
    </div>
  )
}
