import { CheckCircle2, ChevronRight } from 'lucide-react'
import type { RepassePago } from '@/../product-clinic/sections/meus-recebimentos/types'
import { brl } from './helpers'

interface Props {
  historico: RepassePago[]
  onAbrir: (r: RepassePago) => void
}

export function HistoricoRepasses({ historico, onAbrir }: Props) {
  const acumuladoAno = historico.reduce((s, r) => s + r.liquido, 0)

  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Repasses já pagos
        </h2>
        <span className="text-[11px] text-slate-400">
          acumulado recebido:{' '}
          <span className="font-medium tabular-nums text-slate-700 dark:text-slate-200">
            {brl(acumuladoAno)}
          </span>
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {historico.map((r) => (
          <li key={r.id}>
            <button
              onClick={() => onAbrir(r)}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-colors hover:border-teal-500 dark:border-slate-800 dark:hover:border-teal-500"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {r.competencia}
                </div>
                <div className="truncate text-[11px] text-slate-400">
                  {r.atendimentos} atendimentos · pago em {r.pagoEm} · {r.recibo}
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                {brl(r.liquido)}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
