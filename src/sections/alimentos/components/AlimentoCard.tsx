import { Sparkles, Star } from 'lucide-react'
import type { Alimento, CategoryId } from '@/../product/sections/alimentos/types'

interface AlimentoCardProps {
  alimento: Alimento
  categoryLabel: string
  onClick?: () => void
  onToggleFavorite?: () => void
}

const CATEGORY_TINT: Record<CategoryId, { bg: string; text: string }> = {
  cereais: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-200' },
  leguminosas: { bg: 'bg-rose-50 dark:bg-rose-900/30', text: 'text-rose-800 dark:text-rose-200' },
  frutas: { bg: 'bg-pink-50 dark:bg-pink-900/30', text: 'text-pink-800 dark:text-pink-200' },
  hortalicas: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-800 dark:text-emerald-200' },
  carnes: { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-200' },
  ovos: { bg: 'bg-yellow-50 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-200' },
  leites: { bg: 'bg-sky-50 dark:bg-sky-900/30', text: 'text-sky-800 dark:text-sky-200' },
  tuberculos: { bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-200' },
  oleos: { bg: 'bg-yellow-50 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
  bebidas: { bg: 'bg-cyan-50 dark:bg-cyan-900/30', text: 'text-cyan-800 dark:text-cyan-200' },
  suplementos: { bg: 'bg-violet-50 dark:bg-violet-900/30', text: 'text-violet-800 dark:text-violet-200' },
  outros: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}

export function AlimentoCard({ alimento, categoryLabel, onClick, onToggleFavorite }: AlimentoCardProps) {
  const cat = CATEGORY_TINT[alimento.category]
  const isCustom = alimento.source === 'custom'

  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className="
        group relative flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-4
        transition-all hover:-translate-y-0.5 hover:shadow-md
        dark:border-slate-800 dark:bg-slate-900
      "
    >
      {/* Favorite star (top-right) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite?.()
        }}
        aria-label={alimento.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        className="
          absolute right-3 top-3 rounded-full p-1.5 transition-all
          hover:bg-slate-100 dark:hover:bg-slate-800
        "
      >
        <Star
          size={15}
          className={
            alimento.isFavorite
              ? 'fill-amber-400 text-amber-400'
              : 'text-slate-300 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-500'
          }
        />
      </button>

      {/* Name */}
      <h3 className="pr-7 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-50">
        {alimento.name}
      </h3>

      {/* Badges row */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${cat.bg} ${cat.text}`}
        >
          {categoryLabel}
        </span>
        <span
          className={`
            inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider
            ${
              isCustom
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            }
          `}
        >
          {isCustom && <Sparkles size={9} />}
          {isCustom ? 'Custom' : 'TBCA'}
        </span>
      </div>

      {/* Macros */}
      <footer className="mt-auto flex items-end justify-between gap-3 pt-3">
        <div>
          <div className="font-mono text-2xl font-semibold leading-none tabular-nums text-slate-900 dark:text-slate-50">
            {fmt(alimento.kcalPer100g)}
            <span className="ml-1 text-[10px] font-normal text-slate-400 dark:text-slate-500">kcal</span>
          </div>
          <div className="mt-1 font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
            por 100g
          </div>
        </div>

        <div className="flex flex-col items-end gap-0.5 font-mono text-[10px] tabular-nums">
          <Macro label="P" value={alimento.proteinPer100g} color="text-rose-500 dark:text-rose-400" />
          <Macro label="C" value={alimento.carbPer100g} color="text-amber-500 dark:text-amber-400" />
          <Macro label="G" value={alimento.fatPer100g} color="text-violet-500 dark:text-violet-400" />
        </div>
      </footer>
    </article>
  )
}

function Macro({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`font-semibold ${color}`}>{label}</span>
      <span className="text-slate-700 dark:text-slate-300">{fmt(value)}g</span>
    </div>
  )
}
