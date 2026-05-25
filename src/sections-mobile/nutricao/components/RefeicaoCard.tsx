import { useState } from 'react'
import type { RefeicaoSection } from '@/../product-mobile/sections/nutricao/types'
import type { NutritionMeal } from '@/../product-mobile/api-types'
import { ChevronDown, Plus, CheckCircle2, Camera, Search } from 'lucide-react'
import { getIcon, bgFromCor, textFromCor } from './_shared'

interface RefeicaoCardProps {
  refeicao: RefeicaoSection
  onAdicionar?: (r: RefeicaoSection) => void
  onMarcarPlanejada?: (r: RefeicaoSection) => void
  onAlimentoClick?: (m: NutritionMeal) => void
}

export function RefeicaoCard({
  refeicao,
  onAdicionar,
  onMarcarPlanejada,
  onAlimentoClick,
}: RefeicaoCardProps) {
  const [expanded, setExpanded] = useState(refeicao.expandidaDefault)
  const Icon = getIcon(refeicao.iconeNome)
  const iconBg = bgFromCor(refeicao.cor)
  const iconText = textFromCor(refeicao.cor)
  const hasItems = refeicao.registrados.length > 0
  const hasMeta = refeicao.kcalMeta !== null
  const acima = hasMeta && refeicao.kcalConsumida > refeicao.kcalMeta!
  const completo = hasMeta && refeicao.kcalConsumida >= refeicao.kcalMeta!
  const statusDot = completo
    ? 'bg-emerald-400'
    : hasItems
      ? 'bg-amber-400'
      : 'bg-slate-600'

  return (
    <div className="mx-4 mb-3 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-slate-800/40"
      >
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconText} shrink-0`}>
          <Icon size={18} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-100 font-semibold text-[14px]">{refeicao.type.displayName}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
          </div>
          {refeicao.horarioPlanejado && (
            <span className="block text-slate-500 font-mono text-[10.5px] tabular-nums mt-0.5">
              {refeicao.horarioPlanejado}
              {hasItems && ` · ${refeicao.registrados.length} item${refeicao.registrados.length > 1 ? 's' : ''}`}
            </span>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono text-[14px] font-bold tabular-nums leading-none">
            <span className={acima ? 'text-rose-400' : 'text-slate-50'}>
              {refeicao.kcalConsumida}
            </span>
            {hasMeta && (
              <span className="text-slate-500 text-[10px]">
                <span className="mx-0.5">/</span>
                {refeicao.kcalMeta}
              </span>
            )}
            <span className="text-slate-400 text-[10px] font-medium ml-0.5">kcal</span>
          </div>
          <ChevronDown
            size={14}
            strokeWidth={2.2}
            className={`text-slate-500 mt-1 ml-auto transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Body expandido */}
      {expanded && (
        <div className="border-t border-slate-800/60">
          {/* Items registrados */}
          {refeicao.registrados.map((m) => (
            <AlimentoRow key={m.id} meal={m} onClick={onAlimentoClick} />
          ))}

          {/* Item planejado pendente */}
          {!hasItems && refeicao.planejado && !refeicao.planejado.registrada && (
            <PlanejadaRow
              refeicao={refeicao}
              onMarcar={() => onMarcarPlanejada?.(refeicao)}
            />
          )}

          {/* Adicionar */}
          <button
            onClick={() => onAdicionar?.(refeicao)}
            className="w-full px-3.5 py-2.5 flex items-center gap-2 hover:bg-slate-800/40 text-teal-300 text-[12.5px] font-medium border-t border-slate-800/40"
          >
            <Plus size={14} strokeWidth={2.4} />
            Adicionar alimento
            <span className="ml-auto flex items-center gap-1.5 text-slate-500">
              <Search size={11} strokeWidth={2.2} />
              <Camera size={11} strokeWidth={2.2} />
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

interface AlimentoRowProps {
  meal: NutritionMeal
  onClick?: (m: NutritionMeal) => void
}

function AlimentoRow({ meal, onClick }: AlimentoRowProps) {
  return (
    <button
      onClick={() => onClick?.(meal)}
      className="w-full px-3.5 py-2 flex items-center gap-3 text-left border-b border-slate-800/40 last:border-b-0 hover:bg-slate-800/30"
    >
      <div className="min-w-0 flex-1">
        <div className="text-slate-100 font-medium text-[12.5px] truncate">{meal.portionName}</div>
        <div className="text-slate-500 font-mono text-[10px] tabular-nums">
          {meal.protein}P · {meal.carbohydrates}C · {meal.fat}G
          {meal.notes ? ` · ${meal.notes}` : ''}
        </div>
      </div>
      <div className="text-right shrink-0 font-mono text-[13px] tabular-nums text-slate-50">
        {meal.calories}
        <span className="text-slate-400 text-[9.5px] font-medium ml-0.5">kcal</span>
      </div>
    </button>
  )
}

interface PlanejadaRowProps {
  refeicao: RefeicaoSection
  onMarcar: () => void
}

function PlanejadaRow({ refeicao, onMarcar }: PlanejadaRowProps) {
  if (!refeicao.planejado) return null
  const meal = refeicao.planejado.meal
  return (
    <div className="px-3.5 py-3 flex items-start gap-3 border-b border-slate-800/40 bg-teal-500/5">
      <div className="w-7 h-7 rounded-lg bg-teal-500/15 flex items-center justify-center text-teal-300 shrink-0">
        <CheckCircle2 size={13} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-teal-200 font-semibold text-[12.5px] mb-0.5">Refeição planejada</div>
        <div className="text-slate-400 text-[11.5px]">
          Plano sugere {meal.calories} kcal
          <span className="font-mono text-[10px] tabular-nums text-slate-500 ml-1">
            ({meal.protein}P · {meal.carbohydrates}C · {meal.fat}G)
          </span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onMarcar()
        }}
        className="shrink-0 px-2 py-1 rounded-full bg-teal-500/15 text-teal-200 text-[10.5px] font-medium hover:bg-teal-500/25"
      >
        Marcar
      </button>
    </div>
  )
}
