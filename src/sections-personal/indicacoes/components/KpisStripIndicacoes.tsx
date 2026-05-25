import { ArrowDown, ArrowUp, CheckCircle2, Clock, Send, TrendingUp } from 'lucide-react'
import type { IndicacoesKpis } from '@/../product-personal/sections/indicacoes/types'

interface KpisStripIndicacoesProps {
  kpis: IndicacoesKpis
}

export function KpisStripIndicacoes({ kpis }: KpisStripIndicacoesProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card
        icon={<Send size={12} />}
        label="Total enviados"
        value={
          <p className="font-mono">
            <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              {kpis.totalEnviados}
            </span>
          </p>
        }
        hint="convites no histórico"
      />

      <Card
        icon={<CheckCircle2 size={12} />}
        label="Aceitos no mês"
        value={
          <p className="flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              {kpis.aceitosNoMes}
            </span>
            <span className="text-sm text-slate-400 dark:text-slate-500">
              aceitos
            </span>
          </p>
        }
        delta={
          kpis.deltaAceitosMes !== 0
            ? {
                sign: kpis.deltaAceitosMes > 0 ? 'up' : 'down',
                value: Math.abs(kpis.deltaAceitosMes),
                positive: kpis.deltaAceitosMes > 0,
              }
            : undefined
        }
      />

      <Card
        icon={<TrendingUp size={12} />}
        label="Conversão"
        value={
          <p className="flex items-baseline gap-1 font-mono">
            <span
              className={`text-2xl font-semibold tabular-nums ${
                kpis.taxaConversaoPercentual >= 70
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : kpis.taxaConversaoPercentual >= 50
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {kpis.taxaConversaoPercentual}
            </span>
            <span className="text-sm text-slate-400 dark:text-slate-500">%</span>
          </p>
        }
        progress={kpis.taxaConversaoPercentual}
        progressTone={
          kpis.taxaConversaoPercentual >= 70
            ? 'emerald'
            : kpis.taxaConversaoPercentual >= 50
              ? 'amber'
              : 'rose'
        }
        hint="aceitos / enviados"
      />

      <Card
        icon={<Clock size={12} />}
        label="Tempo médio"
        value={
          <p className="flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              {kpis.tempoMedioAceiteDias}
            </span>
            <span className="text-sm text-slate-400 dark:text-slate-500">
              {kpis.tempoMedioAceiteDias === 1 ? 'dia' : 'dias'}
            </span>
          </p>
        }
        hint="até aceitar"
      />
    </div>
  )
}

function Card({
  icon,
  label,
  value,
  hint,
  progress,
  progressTone = 'teal',
  delta,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  hint?: string
  progress?: number
  progressTone?: 'teal' | 'emerald' | 'amber' | 'rose'
  delta?: { sign: 'up' | 'down'; value: number; positive: boolean }
}) {
  const progressBg = {
    teal: 'bg-teal-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  }[progressTone]

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-teal-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800">
      <header className="flex items-center justify-between text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 dark:text-slate-500">{icon}</span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">
            {label}
          </span>
        </div>
        {delta && (
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
            {delta.value}
          </span>
        )}
      </header>

      <div className="mt-2">{value}</div>

      {progress != null && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full ${progressBg}`}
            style={{ width: `${Math.min(100, progress)}%` }}
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
