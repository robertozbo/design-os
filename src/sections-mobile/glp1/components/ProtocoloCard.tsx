import { Syringe, Settings2, Clock, AlertTriangle } from 'lucide-react'
import {
  DIA_SEMANA_LABEL,
  FREQUENCIA_LABEL,
  type Glp1Configuracao,
  type ProximaDose,
} from '@/../product-mobile/sections/glp1/types'

interface Props {
  configuracao: Glp1Configuracao
  proximaDose: ProximaDose | null
  semanas: number
  onNovaDose: () => void
  onAjustar: () => void
}

export function ProtocoloCard({
  configuracao,
  proximaDose,
  semanas,
  onNovaDose,
  onAjustar,
}: Props) {
  const hoje = proximaDose?.emDias === 0
  const atrasada = proximaDose?.atrasada ?? false

  return (
    <div className="mx-4 mb-4 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
          <Syringe size={17} strokeWidth={2.2} className="text-teal-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-slate-50 text-[15px] font-semibold leading-tight truncate">
            {configuracao.medicamentoNome}
            {configuracao.dose && (
              <span className="ml-1.5 font-mono tabular-nums text-teal-300 text-[13px]">
                {configuracao.dose}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-slate-400 text-[12px]">
            {FREQUENCIA_LABEL[configuracao.frequencia]}
            {configuracao.diaSemana && ` · ${DIA_SEMANA_LABEL[configuracao.diaSemana]}`}
            {' · '}
            <span className="font-mono">{configuracao.horario}</span>
          </div>
          <div className="mt-0.5 text-slate-500 text-[11px] font-mono tabular-nums">
            semana {semanas} de tratamento
          </div>
        </div>
        <button
          onClick={onAjustar}
          className="w-8 h-8 -mr-1 rounded-lg flex items-center justify-center hover:bg-slate-800 shrink-0"
          aria-label="Ajustar protocolo"
        >
          <Settings2 size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Próxima dose */}
      {proximaDose && (
        <div
          className={`mx-4 mb-3 rounded-xl px-3.5 py-2.5 flex items-center gap-2 ${
            atrasada
              ? 'bg-rose-500/10 border border-rose-500/25'
              : hoje
                ? 'bg-teal-500/10 border border-teal-500/25'
                : 'bg-slate-800/60 border border-slate-800'
          }`}
        >
          {atrasada ? (
            <AlertTriangle size={13} className="text-rose-300 shrink-0" />
          ) : (
            <Clock
              size={13}
              className={hoje ? 'text-teal-300 shrink-0' : 'text-slate-400 shrink-0'}
            />
          )}
          <span
            className={`text-[12.5px] ${
              atrasada ? 'text-rose-200' : hoje ? 'text-teal-100' : 'text-slate-300'
            }`}
          >
            {atrasada ? 'Dose atrasada · ' : 'Próxima dose: '}
            <span className="font-medium">{proximaDose.label}</span>
          </span>
        </div>
      )}

      <div className="px-4 pb-4">
        <button
          onClick={onNovaDose}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-500 py-3 text-[14px] font-semibold text-slate-950 active:scale-[0.99] transition-transform"
        >
          <Syringe size={15} strokeWidth={2.4} />
          Nova dose
        </button>
      </div>
    </div>
  )
}
