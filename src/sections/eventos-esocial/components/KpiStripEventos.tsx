import type { AgregadoKpis } from '@/../product/sections/eventos-esocial/types'
import { Hourglass, Radio, CheckCircle2, XCircle, Clock4 } from 'lucide-react'

interface Props {
  agregado: AgregadoKpis
}

interface KpiItem {
  key: string
  label: string
  value: number
  Icon: typeof Hourglass
  accent: string
  iconBg: string
  iconColor: string
  emphasizeWarning?: boolean
}

export function KpiStripEventos({ agregado }: Props) {
  const items: KpiItem[] = [
    {
      key: 'pendentes',
      label: 'Pendentes',
      value: agregado.pendentes,
      Icon: Hourglass,
      accent: 'from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-950',
      iconBg: 'bg-slate-100 dark:bg-slate-800',
      iconColor: 'text-slate-600 dark:text-slate-300',
    },
    {
      key: 'em_transmissao',
      label: 'Em transmissão',
      value: agregado.emTransmissao,
      Icon: Radio,
      accent: 'from-amber-50/60 to-white dark:from-amber-950/30 dark:to-slate-950',
      iconBg: 'bg-amber-100 dark:bg-amber-950/50',
      iconColor: 'text-amber-700 dark:text-amber-300',
    },
    {
      key: 'aceitos',
      label: 'Aceitos no mês',
      value: agregado.aceitosMes,
      Icon: CheckCircle2,
      accent: 'from-emerald-50/60 to-white dark:from-emerald-950/30 dark:to-slate-950',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/50',
      iconColor: 'text-emerald-700 dark:text-emerald-300',
    },
    {
      key: 'rejeitados',
      label: 'Rejeitados no mês',
      value: agregado.rejeitadosMes,
      Icon: XCircle,
      accent: 'from-rose-50/60 to-white dark:from-rose-950/30 dark:to-slate-950',
      iconBg: 'bg-rose-100 dark:bg-rose-950/50',
      iconColor: 'text-rose-700 dark:text-rose-300',
    },
    {
      key: 'retificacao',
      label: 'Prazo retificação',
      value: agregado.recibosProximosPrazoRetificacao,
      Icon: Clock4,
      accent: 'from-orange-50/60 to-white dark:from-orange-950/30 dark:to-slate-950',
      iconBg: 'bg-orange-100 dark:bg-orange-950/50',
      iconColor: 'text-orange-700 dark:text-orange-300',
      emphasizeWarning: agregado.recibosProximosPrazoRetificacao > 0,
    },
  ]

  return (
    <div
      style={{ animationDelay: '180ms' }}
      className="nymos-reveal opacity-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
    >
      {items.map((item) => (
        <article
          key={item.key}
          className={`
            relative overflow-hidden rounded-2xl
            bg-gradient-to-br ${item.accent}
            border border-slate-200/70 dark:border-slate-800
            px-4 py-3.5
            transition-all duration-300
            hover:border-slate-300 dark:hover:border-slate-700
            hover:-translate-y-[1px]
          `}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                {item.value}
              </p>
            </div>
            <span
              className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-xl ${item.iconBg}`}
              aria-hidden="true"
            >
              <item.Icon className={`w-4 h-4 ${item.iconColor}`} strokeWidth={1.75} />
            </span>
          </div>
          {item.emphasizeWarning && (
            <p className="mt-1 text-[10px] text-orange-700 dark:text-orange-400 font-medium">
              Recibos ≤ 30 dias para retificar
            </p>
          )}
        </article>
      ))}
    </div>
  )
}
