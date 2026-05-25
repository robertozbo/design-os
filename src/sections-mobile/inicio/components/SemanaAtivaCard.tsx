import type { SemanaAtiva } from '@/../product-mobile/sections/inicio/types'
import { Activity, Check, ChevronRight } from 'lucide-react'

interface SemanaAtivaCardProps {
  data: SemanaAtiva
  onClick?: () => void
}

export function SemanaAtivaCard({ data, onClick }: SemanaAtivaCardProps) {
  const bateuMeta = data.diasAtivos >= data.meta
  const accent = bateuMeta ? 'emerald' : 'teal'

  return (
    <button
      onClick={onClick}
      className="mx-4 mb-4 block w-[calc(100%-32px)] text-left rounded-2xl bg-slate-900 border border-slate-800 p-4 active:scale-[0.99] transition-transform"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl bg-${accent}-500/15 flex items-center justify-center text-${accent}-300 shrink-0`}>
            <Activity size={18} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="text-slate-100 font-semibold text-[15px] truncate">Esta Semana</div>
            <div className="text-slate-400 text-[11.5px] truncate font-mono tabular-nums">
              {data.diasAtivos}/{data.diasTotal} dias ativos · meta {data.meta}
            </div>
          </div>
        </div>
        <ChevronRight size={18} className="text-slate-500 shrink-0 mt-1" />
      </div>

      {/* 7 day circles */}
      <div className="grid grid-cols-7 gap-1.5">
        {data.dias.map((d) => {
          const ativoClasses = bateuMeta
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'bg-teal-500 border-teal-500 text-white'
          const inativoClasses = d.hoje
            ? 'border-slate-500 text-slate-300 ring-2 ring-slate-700/60 ring-offset-2 ring-offset-slate-900'
            : 'border-slate-700 text-slate-600'
          return (
            <div key={d.dia} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full border-[1.5px] flex items-center justify-center transition-all ${
                  d.ativo ? ativoClasses : inativoClasses
                }`}
              >
                {d.ativo ? (
                  <Check size={13} strokeWidth={3} />
                ) : (
                  <span className="text-[10px] font-mono opacity-50">–</span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  d.hoje ? 'text-slate-200' : d.ativo ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {d.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      {bateuMeta ? (
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-300 text-[11.5px] font-medium">
            Meta semanal batida
          </span>
        </div>
      ) : (
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-1.5">
          <span className="text-slate-400 text-[11.5px]">
            Faltam <span className="text-slate-200 font-mono tabular-nums">{data.meta - data.diasAtivos}</span> {data.meta - data.diasAtivos === 1 ? 'dia' : 'dias'} pra bater a meta
          </span>
        </div>
      )}
    </button>
  )
}
