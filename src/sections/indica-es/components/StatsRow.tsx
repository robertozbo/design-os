import { Send, UserCheck, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import type { Estatistica } from '@/../product/sections/indica-es/types'

interface StatsRowProps {
  stats: Estatistica
  /** Called when the user clicks "Ver lista" on the stuck-pending card. */
  onShowStuck?: () => void
}

export function StatsRow({ stats, onShowStuck }: StatsRowProps) {
  const taxaPct = Math.round(stats.taxaConversao * 1000) / 10
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {/* Total enviados */}
      <Card icon={<Send size={14} strokeWidth={1.75} />} eyebrow="Total enviados">
        <span className="text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {stats.totalEnviados}
        </span>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
          {stats.totalEnviadosMes} este mês
        </p>
      </Card>

      {/* Vinculados */}
      <Card
        icon={<UserCheck size={14} strokeWidth={1.75} />}
        eyebrow="Vinculados"
        iconTone="emerald"
      >
        <span className="text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {stats.totalVinculados}
        </span>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
          {stats.totalVinculadosMes} no mês
          {stats.totalVinculadosDeltaMes !== 0 && (
            <span
              className={`ml-1 ${
                stats.totalVinculadosDeltaMes > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              ({stats.totalVinculadosDeltaMes > 0 ? '+' : ''}
              {stats.totalVinculadosDeltaMes} vs anterior)
            </span>
          )}
        </p>
      </Card>

      {/* Taxa de conversão */}
      <Card
        icon={<TrendingUp size={14} strokeWidth={1.75} />}
        eyebrow="Taxa de conversão"
        iconTone="teal"
      >
        <span className="text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {taxaPct.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          <span className="ml-0.5 text-base font-normal text-slate-500 dark:text-slate-400">%</span>
        </span>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500"
            style={{ width: `${Math.min(100, taxaPct)}%` }}
          />
        </div>
      </Card>

      {/* Pendentes 7+ dias */}
      <Card
        icon={<Clock size={14} strokeWidth={1.75} />}
        eyebrow="Pendentes 7+ dias"
        iconTone={stats.pendentesSetePlus > 0 ? 'amber' : 'slate'}
      >
        <span
          className={`text-3xl font-semibold tabular-nums ${
            stats.pendentesSetePlus > 0
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-900 dark:text-slate-50'
          }`}
        >
          {stats.pendentesSetePlus}
        </span>
        {stats.pendentesSetePlus > 0 ? (
          <button
            type="button"
            onClick={onShowStuck}
            className="
              mt-1 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider
              text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200
            "
          >
            Ver lista
            <ArrowRight size={9} />
          </button>
        ) : (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
            Sem parados
          </p>
        )}
      </Card>
    </div>
  )
}

const ICON_TONE: Record<string, string> = {
  default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  slate: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
}

function Card({
  icon,
  eyebrow,
  iconTone = 'default',
  children,
}: {
  icon: React.ReactNode
  eyebrow: string
  iconTone?: keyof typeof ICON_TONE | 'emerald' | 'teal' | 'amber' | 'slate' | 'default'
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ${ICON_TONE[iconTone] ?? ICON_TONE.default}`}
        >
          {icon}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          {eyebrow}
        </span>
      </div>
      {children}
    </div>
  )
}
