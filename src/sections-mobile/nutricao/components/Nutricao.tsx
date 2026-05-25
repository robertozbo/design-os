import type { NutricaoProps } from '@/../product-mobile/sections/nutricao/types'
import { DayPicker } from './DayPicker'
import { CalorieAndMacros } from './CalorieAndMacros'
import { PlanoPill } from './PlanoPill'
import { RefeicaoCard } from './RefeicaoCard'

export function Nutricao({
  data,
  onPrevDia,
  onProxDia,
  onAlimentoClick,
  onAdicionarAlimento,
  onMarcarPlanejada,
  onPlanoClick,
}: NutricaoProps) {
  return (
    <div className="min-h-full bg-slate-950 pb-6 pt-3">
      <DayPicker label={data.diaLabel} onPrev={onPrevDia} onNext={onProxDia} />

      <CalorieAndMacros anel={data.anel} macros={data.macros} />

      <PlanoPill plano={data.plano} onClick={onPlanoClick} />

      {data.refeicoes.map((r) => (
        <RefeicaoCard
          key={r.type.id}
          refeicao={r}
          onAdicionar={onAdicionarAlimento}
          onMarcarPlanejada={onMarcarPlanejada}
          onAlimentoClick={onAlimentoClick}
        />
      ))}
    </div>
  )
}
