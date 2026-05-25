import { Pill, Coffee, Check } from 'lucide-react'
import type { MedicacaoAtiva } from '@/../product-mobile/sections/medicacao/types'

interface Props {
  medicacao: MedicacaoAtiva
  /** Sequência de dias consecutivos cumpridos. */
  streakDias: number
  /** Se a dose de hoje já foi marcada. */
  tomadoHoje: boolean
  /** Exige janela em jejum (Rybelsus, p.ex). */
  exigeJejum?: boolean
  onMarcarComprimido?: (medicacaoId: string) => void
  onAbrirDetalhe?: (medicacaoId: string) => void
}

export function MedicacaoOralCard({
  medicacao,
  streakDias,
  tomadoHoje,
  exigeJejum = false,
  onMarcarComprimido,
  onAbrirDetalhe,
}: Props) {
  return (
    <div className="mx-4 mb-4 rounded-2xl bg-slate-900 border border-slate-800 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
            <Pill size={16} className="text-teal-300" />
          </span>
          <div>
            <div className="text-slate-100 text-[14.5px] font-semibold leading-tight">
              {medicacao.nome}{' '}
              <span className="font-mono text-slate-400 text-[12px]">
                {medicacao.dose}
              </span>
            </div>
            <div className="text-slate-500 text-[11.5px] mt-0.5">
              {medicacao.posologia}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-emerald-400 text-[16px] font-bold tabular-nums leading-none">
            {streakDias}
          </div>
          <div className="text-slate-500 text-[10px] uppercase tracking-wide mt-0.5">
            dias
          </div>
        </div>
      </div>

      {/* Aviso jejum */}
      {exigeJejum && !tomadoHoje && (
        <div className="mb-3 rounded-lg bg-amber-500/10 border-l-[3px] border-amber-400 px-3 py-2 flex items-start gap-2">
          <Coffee size={12} className="text-amber-300 mt-0.5 shrink-0" />
          <p className="text-amber-200 text-[11.5px] leading-snug">
            Em jejum · aguarde 30min antes de comer ou beber qualquer coisa além de água.
          </p>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => !tomadoHoje && onMarcarComprimido?.(medicacao.id)}
        disabled={tomadoHoje}
        className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13.5px] font-semibold transition-all ${
          tomadoHoje
            ? 'bg-emerald-500/15 text-emerald-300'
            : 'bg-teal-500 text-slate-950 active:scale-[0.99]'
        }`}
      >
        <Check size={14} strokeWidth={2.6} />
        {tomadoHoje ? 'Tomado hoje' : 'Marcar comprimido'}
      </button>

      {streakDias >= 7 && !tomadoHoje && (
        <p className="mt-2 text-center text-slate-500 text-[10.5px]">
          {streakDias} dias consecutivos · siga firme
        </p>
      )}

      {onAbrirDetalhe && (
        <button
          onClick={() => onAbrirDetalhe(medicacao.id)}
          className="mt-2 w-full rounded-lg py-1.5 text-[11.5px] text-teal-300 hover:text-teal-200 active:scale-[0.99] transition-all"
        >
          Ver detalhes →
        </button>
      )}
    </div>
  )
}
