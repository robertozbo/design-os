import type { KpisPlano } from '@/../product/sections/plano-de-a-o-and-pgr/types'
import {
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  CalendarCheck,
  UserMinus,
} from 'lucide-react'

interface KpiStripPlanoProps {
  kpis: KpisPlano
}

const NUM = new Intl.NumberFormat('pt-BR')

export function KpiStripPlano({ kpis }: KpiStripPlanoProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <KpiCard
        revealIndex={1}
        label="Total"
        value={NUM.format(kpis.totalItens)}
        sub="itens no ciclo"
        icon={<ListChecks className="w-3.5 h-3.5" strokeWidth={1.75} />}
        accent="slate"
      />
      <KpiCard
        revealIndex={2}
        label="Concluídos"
        value={`${(kpis.pctConclusao * 100).toFixed(0)}%`}
        sub={`${kpis.concluidos} de ${kpis.totalItens}`}
        icon={<CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} />}
        accent="emerald"
      />
      <KpiCard
        revealIndex={3}
        label="Em atraso"
        value={NUM.format(kpis.emAtraso)}
        sub={kpis.emAtraso === 0 ? 'tudo no prazo' : 'requer atenção'}
        icon={<AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.75} />}
        accent={kpis.emAtraso > 0 ? 'rose' : 'slate'}
      />
      <KpiCard
        revealIndex={4}
        label="No prazo"
        value={NUM.format(kpis.noPrazo)}
        sub="dentro do cronograma"
        icon={<CalendarCheck className="w-3.5 h-3.5" strokeWidth={1.75} />}
        accent="teal"
      />
      <KpiCard
        revealIndex={5}
        label="Sem responsável"
        value={NUM.format(kpis.semResponsavel)}
        sub={kpis.semResponsavel === 0 ? 'todos atribuídos' : 'precisa atribuir'}
        icon={<UserMinus className="w-3.5 h-3.5" strokeWidth={1.75} />}
        accent={kpis.semResponsavel > 0 ? 'amber' : 'slate'}
      />
    </div>
  )
}

function KpiCard({
  label,
  value,
  sub,
  icon,
  accent,
  revealIndex,
}: {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
  accent: 'teal' | 'slate' | 'emerald' | 'rose' | 'amber'
  revealIndex: number
}) {
  const accents = {
    teal: 'text-teal-700 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/30 ring-teal-200/60 dark:ring-teal-900/50',
    slate: 'text-slate-700 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/50 ring-slate-200/60 dark:ring-slate-700/60',
    emerald: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/30 ring-emerald-200/60 dark:ring-emerald-900/50',
    rose: 'text-rose-700 dark:text-rose-300 bg-rose-50/70 dark:bg-rose-950/30 ring-rose-200/60 dark:ring-rose-900/50',
    amber: 'text-amber-700 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/30 ring-amber-200/60 dark:ring-amber-900/50',
  }[accent]

  return (
    <div
      style={{ animationDelay: `${50 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        relative rounded-2xl
        bg-white/95 dark:bg-slate-900/70
        border border-slate-200/80 dark:border-slate-800
        px-4 py-3.5
        flex flex-col justify-between gap-3
        min-h-[104px]
      "
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className={`inline-flex w-6 h-6 items-center justify-center rounded-md ring-1 ${accents}`}>
          {icon}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="text-2xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-slate-50">
          {value}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{sub}</span>
      </div>
    </div>
  )
}
