import { Syringe, TrendingDown, Clock, AlertTriangle } from 'lucide-react'
import type { Glp1Preview } from '@/../product-mobile/sections/inicio/types'

interface Props {
  glp1: Glp1Preview
  onClick?: () => void
  /** Rodapé do card configurado — abre o registro de aplicação direto. */
  onNovaDose?: () => void
}

const n1 = (v: number) => v.toFixed(1).replace('.', ',')

export function Glp1Mini({ glp1, onClick, onNovaDose }: Props) {
  // Convite: paciente elegível que ainda não configurou o módulo.
  if (!glp1.configurado) {
    return (
      <button
        onClick={onClick}
        className="mx-4 mb-6 w-[calc(100%-2rem)] flex items-center gap-3 rounded-2xl bg-[#0A0E0D] border border-dashed border-[#2A3130] px-4 py-3.5 text-left active:scale-[0.99] transition-transform"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
          <Syringe size={16} strokeWidth={2.2} className="text-emerald-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-slate-100 text-[13.5px] font-semibold">
            Usa GLP-1? Acompanhe aqui
          </div>
          <div className="text-slate-400 text-[11.5px] mt-0.5">
            Doses, local de aplicação e curva de peso
          </div>
        </div>
        <span className="shrink-0 rounded-lg bg-emerald-500 px-3 py-1.5 text-[12px] font-semibold text-[#0E1A17]">
          Iniciar
        </span>
      </button>
    )
  }

  const hoje = glp1.proximaDoseEmDias === 0
  const spark = glp1.sparkline
  const min = Math.min(...spark)
  const max = Math.max(...spark)
  const span = Math.max(0.1, max - min)

  return (
    <div className="mx-4 mb-6 rounded-2xl bg-[#0A0E0D] border border-[#2A3130] overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 pt-4 pb-3 text-left active:bg-[#1B2120]/40"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
          <Syringe size={16} strokeWidth={2.2} className="text-emerald-300" />
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

      {/* Sparkline de peso + inicial · atual · meta */}
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
            stroke="#34d399"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle
            cx={120}
            cy={24 - ((spark[spark.length - 1] - min) / span) * 20}
            r="2.4"
            fill="#34d399"
          />
        </svg>
        <div className="shrink-0 ml-auto flex items-start gap-3">
          <Peso label="Inicial" valor={glp1.pesoInicialKg} tom="text-slate-400" />
          <Peso label="Atual" valor={glp1.pesoAtualKg} tom="text-slate-100" />
          <Peso label="Meta" valor={glp1.pesoAlvoKg} tom="text-amber-300" />
        </div>
      </div>

      {/* Próxima dose + CTA */}
      <div className="border-t border-[#2A3130] px-3 py-2.5 flex items-center gap-2">
        <div className="flex-1 min-w-0 pl-1">
          <div
            className={`text-[9.5px] uppercase tracking-wider font-semibold ${
              glp1.atrasada ? 'text-rose-300' : 'text-slate-500'
            }`}
          >
            {glp1.atrasada ? 'Dose atrasada' : 'Próxima dose'}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            {glp1.atrasada ? (
              <AlertTriangle size={12} className="text-rose-300 shrink-0" />
            ) : (
              <Clock
                size={12}
                className={hoje ? 'text-emerald-300 shrink-0' : 'text-slate-500 shrink-0'}
              />
            )}
            <span
              className={`text-[12px] truncate ${
                glp1.atrasada ? 'text-rose-200' : hoje ? 'text-emerald-200' : 'text-slate-300'
              }`}
            >
              {glp1.proximaDoseLabel}
            </span>
          </div>
        </div>
        <button
          onClick={onNovaDose ?? onClick}
          className="shrink-0 flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-[12px] font-semibold text-[#0E1A17] active:scale-[0.97] transition-transform"
        >
          <Syringe size={12} strokeWidth={2.4} />
          Nova dose
        </button>
      </div>
    </div>
  )
}

/** Coluna de peso do card: rótulo em cima, valor em mono embaixo. */
function Peso({ label, valor, tom }: { label: string; valor: number; tom: string }) {
  return (
    <div className="text-right">
      <div className="text-[8.5px] uppercase tracking-wider font-semibold text-slate-500">
        {label}
      </div>
      <div className={`font-mono tabular-nums text-[12px] font-medium ${tom}`}>
        {n1(valor)}
      </div>
    </div>
  )
}
