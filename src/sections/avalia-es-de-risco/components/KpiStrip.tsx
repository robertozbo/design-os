import type { AvaliacoesKpis } from '@/../product/sections/avalia-es-de-risco/types'

interface KpiStripProps {
  kpis: AvaliacoesKpis
  diasAteVigenciaNr1: number
}

interface StatItem {
  label: string
  value: number | string
  unit?: string
  separator?: string
  caption: string
  urgent?: boolean
  pulse?: boolean
}

export function KpiStrip({ kpis, diasAteVigenciaNr1 }: KpiStripProps) {
  const items: StatItem[] = [
    { label: 'Total criadas', value: kpis.totalCriadas, unit: 'no total', separator: '—', caption: 'todos os instrumentos' },
    { label: 'Em rascunho', value: kpis.emRascunho, unit: 'aguardando', separator: '↗', caption: 'publicação' },
    { label: 'Em aplicação', value: kpis.emAplicacao, unit: 'campanhas', separator: '↗', caption: 'cobertura ao vivo', pulse: true },
    { label: 'Encerradas', value: kpis.encerradas, unit: 'sem cobertura', separator: '—', caption: 'arquivadas' },
    { label: 'Publicadas', value: kpis.publicadas, unit: 'vigentes', separator: '↗', caption: 'no PGR' },
    { label: 'Vigência NR-1', value: diasAteVigenciaNr1, unit: 'dias', separator: '—', caption: '24/08/2026', urgent: true },
  ]

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
  return (
    <div
      style={{ animationDelay: `${60 * revealIndex}ms` }}
      className={`
        nymos-reveal opacity-0
        rounded-2xl px-5 py-4
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        ${isUrgent ? 'ring-1 ring-rose-200/60 dark:ring-rose-900/40 bg-gradient-to-br from-rose-50/40 to-white dark:from-rose-950/30 dark:to-slate-900/80' : ''}
      `}
    >
      <div className={`text-[10px] uppercase tracking-[0.16em] font-semibold ${isUrgent ? 'text-rose-700 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
        {item.label}
      </div>
      <div className="mt-2 flex items-baseline gap-x-2 gap-y-1 flex-wrap">
        <span className="relative inline-flex items-baseline gap-2">
          <span className={`text-[28px] leading-none font-semibold tracking-tight tabular-nums ${isUrgent ? 'text-rose-900 dark:text-rose-100' : 'text-slate-900 dark:text-slate-50'}`}>
            {typeof item.value === 'number' ? item.value.toLocaleString('pt-BR') : item.value}
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
    </div>
  )
}
