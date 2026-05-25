import type { AtividadeViewModel } from '@/../product-mobile/sections/atividades/types'
import { Watch, Pencil } from 'lucide-react'
import { getIcon, bgClass } from './_shared'

interface AtividadeRowProps {
  atividade: AtividadeViewModel
  onClick?: (a: AtividadeViewModel) => void
}

export function AtividadeRow({ atividade, onClick }: AtividadeRowProps) {
  const Icon = getIcon(atividade.iconeNome)
  const isAuto = atividade.source !== 'manual'
  const SourceIcon = isAuto ? Watch : Pencil
  const { activity } = atividade

  return (
    <button
      onClick={() => onClick?.(atividade)}
      className="w-[calc(100%-32px)] mx-4 mb-2 flex items-center gap-3 rounded-2xl bg-slate-900 border border-slate-800 px-3 py-2.5 text-left active:scale-[0.99] transition-transform hover:bg-slate-800/40"
    >
      {/* Ícone categoria */}
      <div className={`w-10 h-10 rounded-xl ${bgClass(atividade.iconeBg)} flex items-center justify-center text-${atividade.iconeCor} shrink-0`} style={{ color: atividade.iconeCor.includes('rose') ? '#fda4af' : atividade.iconeCor.includes('amber') ? '#fcd34d' : atividade.iconeCor.includes('violet') ? '#c4b5fd' : atividade.iconeCor.includes('sky') ? '#7dd3fc' : '#cbd5e1' }}>
        <Icon size={18} strokeWidth={2.2} />
      </div>

      {/* Centro: nome + meta */}
      <div className="min-w-0 flex-1">
        <div className="text-slate-100 font-semibold text-[14px] truncate">
          {activity.activityType.name}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-semibold uppercase tracking-wide ${
              isAuto
                ? 'bg-cyan-500/15 text-cyan-300'
                : 'bg-slate-800/80 text-slate-400'
            }`}
          >
            <SourceIcon size={9} strokeWidth={2.4} />
            {isAuto ? 'auto' : 'manual'}
          </span>
          <span className="text-slate-500 font-mono text-[10.5px] tabular-nums truncate">
            {atividade.sourceLabel} · {atividade.duracaoFormatada} · {atividade.horarioFormatado}
          </span>
        </div>
      </div>

      {/* Direita: kcal + pontos */}
      <div className="text-right shrink-0">
        <div className="font-mono text-[15px] font-bold text-slate-50 tabular-nums leading-none">
          {activity.caloriesBurned ?? '—'}
          <span className="text-slate-400 text-[10px] font-medium ml-0.5">kcal</span>
        </div>
        <div className="text-emerald-400 font-mono text-[10.5px] mt-0.5 tabular-nums">
          +{activity.points} pts
        </div>
      </div>
    </button>
  )
}
