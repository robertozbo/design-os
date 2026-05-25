import { Check, ChevronRight, Clock, Pill } from 'lucide-react'
import type { MedicacaoHojePreview } from '@/../product-mobile/sections/inicio/types'

interface Props {
  medicacao: MedicacaoHojePreview
  onClick?: () => void
  onMarcarDose?: (doseId: string) => void
}

export function MedicacaoHojeMini({ medicacao, onClick, onMarcarDose }: Props) {
  const { total, cumpridas, proximasDoses, adesaoSemana, medicoNome } = medicacao
  const completo = cumpridas === total && total > 0
  const proximaPendente = proximasDoses.find((d) => d.status === 'pendente')

  return (
    <div className="mx-4 mb-4 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      {/* Header tappable */}
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 pt-4 pb-3 text-left active:bg-slate-800/40"
      >
        <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
          <Pill size={16} strokeWidth={2.2} className="text-teal-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-100 font-semibold text-[14px]">Medicação hoje</span>
            <span className="text-slate-500 text-[10.5px] font-mono uppercase tracking-wider">
              {adesaoSemana}% sem
            </span>
          </div>
          <div className="text-slate-400 text-[12px] truncate mt-0.5">
            {completo ? (
              <span className="text-emerald-300">Todas as doses cumpridas hoje ✓</span>
            ) : proximaPendente ? (
              <>
                Próxima:{' '}
                <span className="text-slate-100 font-medium">
                  {proximaPendente.horario} · {proximaPendente.nome} {proximaPendente.dose}
                </span>
              </>
            ) : (
              `${cumpridas} de ${total} tomadas`
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono tabular-nums text-slate-50 text-[18px] font-bold leading-none">
            {cumpridas}
            <span className="text-slate-500 text-[12px]">/{total}</span>
          </div>
          <div className="text-slate-500 text-[10px] mt-0.5">doses</div>
        </div>
      </button>

      {/* Lista compacta de doses */}
      <div className="border-t border-slate-800 px-3 py-2 space-y-0.5">
        {proximasDoses.map((d) => {
          const cumprido = d.status === 'cumprido'
          const pendente = d.status === 'pendente'
          const futuro = d.status === 'futuro'
          const perdido = d.status === 'perdido'
          return (
            <button
              key={d.id}
              onClick={(e) => {
                e.stopPropagation()
                if (pendente) onMarcarDose?.(d.id)
              }}
              disabled={!pendente}
              className={`
                w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-left
                ${pendente ? 'active:bg-slate-800/60 hover:bg-slate-800/30' : ''}
                transition
              `}
            >
              {cumprido && (
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                  <Check size={11} strokeWidth={2.6} className="text-emerald-300" />
                </span>
              )}
              {pendente && (
                <span className="shrink-0 w-5 h-5 rounded-full border-2 border-slate-600" />
              )}
              {futuro && (
                <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center">
                  <Clock size={10} strokeWidth={2.4} className="text-amber-300" />
                </span>
              )}
              {perdido && (
                <span className="shrink-0 w-5 h-5 rounded-full bg-rose-500/15 border border-rose-400/30" />
              )}

              <span
                className={`shrink-0 font-mono tabular-nums text-[12px] ${
                  cumprido ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {d.horario}
              </span>

              <span
                className={`flex-1 min-w-0 text-[12.5px] truncate ${
                  cumprido
                    ? 'text-slate-500 line-through'
                    : perdido
                      ? 'text-rose-300'
                      : 'text-slate-100'
                }`}
              >
                {d.nome}{' '}
                <span
                  className={`font-mono text-[11px] ${
                    cumprido ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {d.dose}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 border-t border-slate-800 text-teal-300 hover:text-teal-200 active:bg-slate-800/40 transition-colors"
      >
        <span className="text-[11px] text-slate-500 truncate">{medicoNome}</span>
        <span className="text-[12.5px] font-medium flex items-center gap-0.5 shrink-0">
          Ver tudo
          <ChevronRight size={13} strokeWidth={2.2} />
        </span>
      </button>
    </div>
  )
}
