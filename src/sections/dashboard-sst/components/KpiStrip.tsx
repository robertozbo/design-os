import type { DashboardKpis } from '@/../product/sections/dashboard-sst/types'

interface KpiStripProps {
  kpis: DashboardKpis
  onAbrirVigencia?: () => void
}

interface StatItem {
  label: string
  value: number | string
  unit?: string
  caption: string
  separator?: string
  delta?: { value: number; suffix: string } | null
  urgent?: boolean
  pulse?: boolean
  onClick?: () => void
}

export function KpiStrip({ kpis, onAbrirVigencia }: KpiStripProps) {
  const items: StatItem[] = [
    {
      label: 'Empregadores ativos',
      value: kpis.empregadoresAtivos,
      unit: 'na carteira',
      separator: '↗',
      caption: 'sob gestão NR-1',
      delta: kpis.deltaEmpregadoresMes > 0 ? { value: kpis.deltaEmpregadoresMes, suffix: 'este mês' } : null,
    },
    {
      label: 'Estabelecimentos',
      value: kpis.estabelecimentos,
      unit: 'unidades',
      separator: '—',
      caption: 'matriz e filiais',
    },
    {
      label: 'Trabalhadores',
      value: kpis.trabalhadores.toLocaleString('pt-BR'),
      unit: 'CLT',
      separator: '↗',
      caption: 'cobertos',
      delta: kpis.deltaTrabalhadoresMes > 0 ? { value: kpis.deltaTrabalhadoresMes, suffix: 'este mês' } : null,
    },
    {
      label: 'Em aplicação',
      value: kpis.avaliacoesEmAplicacao,
      unit: 'campanhas',
      separator: '↗',
      caption: 'cobertura ao vivo',
      pulse: true,
    },
    {
      label: 'Vigência NR-1',
      value: kpis.diasAteVigenciaNr1,
      unit: 'dias',
      separator: '—',
      caption: '24/08/2026',
      urgent: true,
      onClick: onAbrirVigencia,
    },
  ]

  if (kpis.deltaCoberturaUltimosCiclos !== null && kpis.coberturaMediaCicloAtual !== null) {
    const positivo = kpis.deltaCoberturaUltimosCiclos >= 0
    items.push({
      label: 'Δ Cobertura ciclos',
      value: `${kpis.coberturaMediaCicloAtual.toFixed(1)}%`,
      unit: 'média atual',
      separator: positivo ? '↗' : '↘',
      caption: `${positivo ? '+' : ''}${kpis.deltaCoberturaUltimosCiclos.toFixed(1)}pp vs ciclo anterior`,
    })
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item, idx) => (
        <StatCard key={item.label} item={item} revealIndex={idx} />
      ))}
    </div>
  )
}

function StatCard({ item, revealIndex }: { item: StatItem; revealIndex: number }) {
  const isUrgent = item.urgent === true
  const isClickable = typeof item.onClick === 'function'

  const Tag = isClickable ? 'button' : 'div'

  return (
    <Tag
      type={isClickable ? 'button' : undefined}
      onClick={item.onClick}
      style={{ animationDelay: `${60 * revealIndex}ms` }}
      className={`
        nymos-reveal opacity-0 text-left w-full
        rounded-2xl px-5 py-4
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        ${isUrgent ? 'ring-1 ring-rose-200/60 dark:ring-rose-900/40 bg-gradient-to-br from-rose-50/40 to-white dark:from-rose-950/30 dark:to-slate-900/80' : ''}
        ${isClickable ? 'hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2' : ''}
      `}
    >
      <div className={`text-[10px] uppercase tracking-[0.16em] font-semibold ${isUrgent ? 'text-rose-700 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
        {item.label}
      </div>
      <div className="mt-2 flex items-baseline gap-x-2 gap-y-1 flex-wrap">
        <span className="relative inline-flex items-baseline gap-2">
          <span className={`text-[28px] leading-none font-semibold tracking-tight tabular-nums ${isUrgent ? 'text-rose-900 dark:text-rose-100' : 'text-slate-900 dark:text-slate-50'}`}>
            {item.value}
          </span>
          {item.unit && (
            <span className={`text-xs ${isUrgent ? 'text-rose-700/80 dark:text-rose-300/80' : 'text-slate-500 dark:text-slate-400'}`}>
              {item.unit}
            </span>
          )}
          {item.pulse && (
            <span className="absolute -right-2 top-0 inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-500" />
            </span>
          )}
        </span>

        <span className="ml-auto inline-flex items-baseline gap-1.5">
          <span className={`text-[11px] ${isUrgent ? 'text-rose-600 dark:text-rose-400' : 'text-teal-600 dark:text-teal-400'}`}>
            {item.separator ?? '—'}
          </span>
          <span className={`text-[11px] ${isUrgent ? 'text-rose-700/80 dark:text-rose-300/80' : 'text-slate-500 dark:text-slate-400'}`}>
            {item.caption}
          </span>
        </span>
      </div>
      {item.delta && (
        <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-teal-700 dark:text-teal-400 tabular-nums">
          <span aria-hidden="true">↗</span>
          <span className="font-medium">+{item.delta.value}</span>
          <span className="text-slate-500 dark:text-slate-400">{item.delta.suffix}</span>
        </div>
      )}
    </Tag>
  )
}
