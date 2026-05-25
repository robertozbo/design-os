import { ArrowDown, ArrowUp, AlertTriangle, ListChecks, Sparkles, Users } from 'lucide-react'
import type { AlunosKpis } from '@/../product-personal/sections/alunos/types'

interface KpisStripAlunosProps {
  kpis: AlunosKpis
}

export function KpisStripAlunos({ kpis }: KpisStripAlunosProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card
        icon={<Users size={12} />}
        label="Total ativos"
        value={kpis.totalAtivo}
        unit="alunos"
        tone="teal"
      />
      <Card
        icon={<ListChecks size={12} />}
        label="Em plano"
        value={kpis.emPlano}
        unit={`de ${kpis.totalAtivo}`}
        tone="emerald"
        progress={Math.round((kpis.emPlano / Math.max(kpis.totalAtivo, 1)) * 100)}
      />
      <Card
        icon={<AlertTriangle size={12} />}
        label="Em risco"
        value={kpis.emRisco}
        unit="alunos"
        tone="amber"
      />
      <Card
        icon={<Sparkles size={12} />}
        label="Novos no mês"
        value={kpis.novosNoMes}
        unit="entradas"
        tone="violet"
        delta={
          kpis.deltaNovosMes !== 0
            ? {
                sign: kpis.deltaNovosMes > 0 ? 'up' : 'down',
                value: Math.abs(kpis.deltaNovosMes),
                positive: kpis.deltaNovosMes > 0,
              }
            : undefined
        }
      />
    </div>
  )
}

function Card({
  icon,
  label,
  value,
  unit,
  tone,
  progress,
  delta,
}: {
  icon: React.ReactNode
  label: string
  value: number
  unit?: string
  tone: 'teal' | 'emerald' | 'amber' | 'violet'
  progress?: number
  delta?: { sign: 'up' | 'down'; value: number; positive: boolean }
}) {
  const valueTone = {
    teal: 'text-slate-900 dark:text-slate-50',
    emerald: 'text-slate-900 dark:text-slate-50',
    amber: 'text-amber-600 dark:text-amber-400',
    violet: 'text-slate-900 dark:text-slate-50',
  }[tone]

  const progressTone = {
    teal: 'bg-teal-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
  }[tone]

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

      <div className="mt-2 flex items-baseline gap-1 font-mono">
        <span className={`text-2xl font-semibold tabular-nums ${valueTone}`}>{value}</span>
        {unit && (
          <span className="text-sm text-slate-400 dark:text-slate-500">{unit}</span>
        )}
      </div>

      {progress != null && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full ${progressTone}`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}
    </div>
  )
}
