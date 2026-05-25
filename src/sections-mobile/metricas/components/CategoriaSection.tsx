import type { CategoriaSection as CategoriaSectionType, MetricaViewModel } from '@/../product-mobile/sections/metricas/types'
import { getIcon } from './_shared'
import { MetricaRow } from './MetricaRow'

interface CategoriaSectionProps {
  categoria: CategoriaSectionType
  onMetricaClick?: (m: MetricaViewModel) => void
}

export function CategoriaSection({ categoria, onMetricaClick }: CategoriaSectionProps) {
  const Icon = getIcon(categoria.iconeNome)
  return (
    <section className="mb-5">
      <div className="flex items-center gap-2 px-5 mb-2">
        <Icon size={12} className="text-slate-400" strokeWidth={2.4} />
        <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
          {categoria.label}
        </span>
        <span className="text-slate-600 text-[10px] font-mono tabular-nums">
          {categoria.metricas.length}
        </span>
      </div>
      {categoria.metricas.map((m) => (
        <MetricaRow key={m.id} metrica={m} onClick={onMetricaClick} />
      ))}
    </section>
  )
}
