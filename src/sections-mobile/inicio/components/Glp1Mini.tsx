import { ChevronRight, Syringe, TrendingDown, Clock, AlertTriangle } from 'lucide-react'
import type { Glp1Preview } from '@/../product-mobile/sections/inicio/types'

interface Props {
  glp1: Glp1Preview
  onClick?: () => void
}

const n1 = (v: number) => v.toFixed(1).replace('.', ',')

export function Glp1Mini({ glp1, onClick }: Props) {
  // Convite: paciente elegível que ainda não configurou o módulo.
  if (!glp1.configurado) {
    return (
      <button
        onClick={onClick}
        className="mx-4 mb-6 w-[calc(100%-2rem)] flex items-center gap-3 rounded-2xl bg-slate-900 border border-dashed border-slate-700 px-4 py-3.5 text-left active:scale-[0.99] transition-transform"
      >
        <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
          <Syringe size={16} strokeWidth={2.2} className="text-teal-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-slate-100 text-[13.5px] font-semibold">
            Usa GLP-1? Acompanhe aqui
          </div>
          <div className="text-slate-400 text-[11.5px] mt-0.5">
            Doses, local de aplicação e curva de peso
          </div>
        </div>
        <ChevronRight size={15} className="text-slate-500 shrink-0" />
      </button>
    )
  }

  const hoje = glp1.proximaDoseEmDias === 0
  const spark = glp1.sparkline
  const min = Math.min(...spark)
  const max = Math.max(...spark)
  const span = Math.max(0.1, max - min)

  return (
    <div className="mx-4 mb-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 pt-4 pb-3 text-left active:bg-slate-800/40"
      >
        <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
          <Syringe size={16} strokeWidth={2.2} className="text-teal-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-100 font-semibold text-[14px]">GLP-1</span>
            <span className="text-slate-500 text-[10.5px] font-mono uppercase tracking-wider">
              sem {glp1.semanas}
            </span>
          </div>
          <div className="text-slate-400 text-[12px] truncate mt-0.5">
            {glp1.medicamentoNome}
            {glp1.dose && (
              <span className="font-mono text-slate-300"> · {glp1.dose}</span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono tabular-nums text-slate-50 text-[18px] font-bold leading-none">
            {n1(glp1.pesoAtualKg)}
            <span className="text-slate-500 text-[11px]"> kg</span>
          </div>
          <div className="flex items-center justify-end gap-0.5 text-emerald-300 text-[10.5px] mt-0.5">
            <TrendingDown size={10} strokeWidth={2.6} />
            <span className="font-mono tabular-nums">{n1(glp1.perdidoKg)} kg</span>
          </div>
        </div>
      </button>

      {/* Sparkline de peso + falta pra meta */}
      <div className="px-4 pb-3 flex items-center gap-3">
        <svg viewBox="0 0 120 28" className="h-8 flex-1 max-w-[170px]" preserveAspectRatio="none">
          <polyline
            points={spark
              .map((v, i) => {
                const x = (i * 120) / (spark.length - 1)
                const y = 24 - ((v - min) / span) * 20
                return `${x},${y}`
              })
              .join(' ')}
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle
            cx={120}
            cy={24 - ((spark[spark.length - 1] - min) / span) * 20}
            r="2.4"
            fill="#2dd4bf"
          />
        </svg>
        <div className="shrink-0 text-right ml-auto">
          <div className="font-mono tabular-nums text-amber-300 text-[12px] font-medium">
            {n1(glp1.faltaKg)} kg
          </div>
          <div className="text-slate-500 text-[10px]">pra meta</div>
        </div>
      </div>

      {/* Próxima dose + CTA */}
      <div className="border-t border-slate-800 px-3 py-2.5 flex items-center gap-2">
        <div className="flex-1 min-w-0 flex items-center gap-1.5 pl-1">
          {glp1.atrasada ? (
            <AlertTriangle size={12} className="text-rose-300 shrink-0" />
          ) : (
            <Clock
              size={12}
              className={hoje ? 'text-teal-300 shrink-0' : 'text-slate-500 shrink-0'}
            />
          )}
          <span
            className={`text-[11.5px] truncate ${
              glp1.atrasada ? 'text-rose-200' : hoje ? 'text-teal-200' : 'text-slate-400'
            }`}
          >
            {glp1.dosesAplicadas === 0
              ? 'Registre sua primeira aplicação'
              : glp1.atrasada
                ? 'Dose atrasada'
                : glp1.proximaDoseLabel}
          </span>
        </div>
        <button
          onClick={onClick}
          className="shrink-0 rounded-lg bg-teal-500 px-3 py-1.5 text-[12px] font-semibold text-slate-950 active:scale-[0.97] transition-transform"
        >
          {glp1.dosesAplicadas === 0 ? 'Iniciar' : 'Acompanhar'}
        </button>
      </div>
    </div>
  )
}
