import { Sparkles } from 'lucide-react'

interface DimensionsCountCardProps {
  evaluated: number
  total: number
}

export function DimensionsCountCard({
  evaluated,
  total,
}: DimensionsCountCardProps) {
  const pct = total > 0 ? (evaluated / total) * 100 : 0
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-4 px-5 py-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            <span className="font-bold">{evaluated} de {total}</span> dimensões
            avaliadas
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Quanto mais dados você coletar, mais preciso fica seu score.
          </p>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={evaluated}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
