import type { MetricasProps } from '@/../product-mobile/sections/metricas/types'
import { Watch, ChevronRight } from 'lucide-react'
import { PeriodoPills } from './PeriodoPills'
import { CategoriaSection } from './CategoriaSection'

export function Metricas({
  data,
  selectedPeriodo,
  onPeriodoChange,
  onMetricaClick,
  onConectarDispositivoClick,
}: MetricasProps) {
  return (
    <div className="min-h-full bg-slate-950 pb-6 pt-3">
      {/* Banner sem wearables */}
      {data.semWearables && (
        <button
          onClick={onConectarDispositivoClick}
          className="w-[calc(100%-32px)] mx-4 mb-3 flex items-center gap-2 rounded-2xl bg-amber-500/10 border-l-[3px] border-amber-400 px-3 py-2.5 text-left"
        >
          <Watch size={16} className="text-amber-300 shrink-0" />
          <span className="text-slate-100 text-[12.5px] flex-1">
            Conecte um wearable pra começar a coletar dados.
          </span>
          <ChevronRight size={14} className="text-amber-300 shrink-0" />
        </button>
      )}

      {/* Period pills */}
      <PeriodoPills
        periodos={data.periodos}
        selected={selectedPeriodo}
        onChange={onPeriodoChange}
      />

      {/* Categorias */}
      {data.categorias.map((cat) => (
        <CategoriaSection key={cat.id} categoria={cat} onMetricaClick={onMetricaClick} />
      ))}
    </div>
  )
}
