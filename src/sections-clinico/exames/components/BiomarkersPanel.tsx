import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { BiomarkerDetalhe, Tendencia } from '@/../product-clinico/sections/exames/types'
import {
  ALERT_NIVEL_BG,
  ALERT_NIVEL_BORDER,
  ALERT_NIVEL_LABEL,
  ALERT_NIVEL_TEXT,
} from './helpers'
import { Sparkline } from './Sparkline'

interface Props {
  biomarkers: BiomarkerDetalhe[]
  onAbrirBiomarker?: (nome: string) => void
}

const TREND_ICON: Record<Tendencia, typeof TrendingUp> = {
  subindo: TrendingUp,
  caindo: TrendingDown,
  estavel: Minus,
}

export function BiomarkersPanel({ biomarkers, onAbrirBiomarker }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Valores estruturados
      </h2>
      <ul className="space-y-3">
        {biomarkers.map((b) => {
          const TrendIcon = TREND_ICON[b.tendencia]
          const positivoDelta = b.tendencia === 'caindo' && b.alertNivel !== 'baixo'
          const trendColor = positivoDelta
            ? 'text-emerald-600 dark:text-emerald-400'
            : b.tendencia === 'subindo' && b.alertNivel !== 'normal'
            ? 'text-rose-600 dark:text-rose-400'
            : 'text-slate-500 dark:text-slate-400'
          return (
            <li key={b.nome}>
              <button
                onClick={() => onAbrirBiomarker?.(b.nome)}
                className={`
                  group/bio block w-full overflow-hidden rounded-xl border ${ALERT_NIVEL_BORDER[b.alertNivel]}
                  ${ALERT_NIVEL_BG[b.alertNivel]} text-left
                  transition-all hover:shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-teal-500/40
                `}
              >
                <div className="flex items-center justify-between gap-2 px-3 py-2 backdrop-blur-sm">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {b.nome}
                    </p>
                    <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                      {b.nomeCompleto}
                    </p>
                  </div>
                  <span
                    className={`
                      shrink-0 rounded-full border bg-white/80 px-1.5 py-0 text-[9px] font-medium backdrop-blur-sm
                      ${ALERT_NIVEL_BORDER[b.alertNivel]} ${ALERT_NIVEL_TEXT[b.alertNivel]}
                      dark:bg-slate-900/80
                    `}
                  >
                    {ALERT_NIVEL_LABEL[b.alertNivel]}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-3 px-3 pb-3">
                  <div>
                    <p
                      className={`font-mono text-2xl font-semibold tabular-nums leading-none ${
                        ALERT_NIVEL_TEXT[b.alertNivel]
                      }`}
                    >
                      {b.valor}
                      <span className="ml-1 text-[10px] font-normal text-slate-400">
                        {b.unidade}
                      </span>
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                      Ref. {b.faixaReferencia}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Sparkline
                      values={b.historico.map((h) => h.valor)}
                      alertNivel={b.alertNivel}
                      showArea
                      width={70}
                      height={24}
                    />
                    {b.deltaPercent !== 0 && (
                      <span
                        className={`inline-flex items-center gap-0.5 text-[10px] font-medium tabular-nums ${trendColor}`}
                      >
                        <TrendIcon className="size-2.5" />
                        {b.deltaPercent > 0 ? '+' : ''}
                        {b.deltaPercent.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
