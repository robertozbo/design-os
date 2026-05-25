import { Check, Clock } from 'lucide-react'
import type { ResumoHoje } from '@/../product-mobile/sections/medicacao/types'

interface Props {
  resumo: ResumoHoje
  onMarcarDose?: (doseId: string) => void
}

const DIA_LABEL = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

const DIA_DOT: Record<string, string> = {
  cumprido: 'bg-emerald-400',
  perdido: 'bg-rose-400',
  parcial: 'bg-amber-300',
  hoje: 'bg-teal-400 animate-pulse',
  futuro: 'bg-slate-700',
}

export function MedicacaoHojeCard({ resumo, onMarcarDose }: Props) {
  return (
    <>
      {resumo.adesaoBaixa && (
        <div className="mx-4 mb-2 rounded-2xl bg-amber-500/10 border-l-[3px] border-amber-400 px-3 py-2.5">
          <p className="text-amber-200 text-[12.5px]">
            Adesão caiu nos últimos 7 dias. Bora retomar o ritmo?
          </p>
        </div>
      )}

      <div className="mx-4 mb-4 rounded-2xl bg-slate-900 border border-slate-800 p-4">
        {/* Header adesão */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              Medicação hoje
            </div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-slate-100 text-[15px] font-semibold">
                Adesão semana
              </span>
              <span className="text-emerald-400 font-mono text-[15px] font-bold tabular-nums">
                {resumo.adesaoSemana.percentual}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {resumo.adesaoSemana.dias.map((status, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${DIA_DOT[status] ?? DIA_DOT.futuro}`} />
                <span className="text-[9px] font-mono text-slate-500">{DIA_LABEL[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-800 -mx-4 mb-2" />

        {/* Doses */}
        <ul className="space-y-1.5">
          {resumo.doses.map((d) => {
            const cumprido = d.status === 'cumprido'
            const pendente = d.status === 'pendente'
            const futuro = d.status === 'futuro'
            return (
              <li key={d.id}>
                <button
                  onClick={() => pendente && onMarcarDose?.(d.id)}
                  disabled={!pendente}
                  className={`
                    w-full flex items-center gap-3 py-1.5 px-1 rounded-md text-left
                    ${pendente ? 'hover:bg-slate-800/60 active:scale-[0.99]' : ''}
                    transition-all
                  `}
                >
                  {/* Status icon */}
                  {cumprido && (
                    <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                      <Check size={12} strokeWidth={2.6} className="text-emerald-300" />
                    </span>
                  )}
                  {pendente && (
                    <span className="shrink-0 w-5 h-5 rounded-full border-2 border-slate-600" />
                  )}
                  {futuro && (
                    <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center">
                      <Clock size={11} strokeWidth={2.4} className="text-amber-300" />
                    </span>
                  )}

                  {/* Horário */}
                  <span
                    className={`shrink-0 font-mono tabular-nums text-[12.5px] ${
                      cumprido ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {d.horario}
                  </span>

                  {/* Nome + dose */}
                  <span
                    className={`flex-1 min-w-0 text-[13.5px] truncate ${
                      cumprido
                        ? 'text-slate-500 line-through'
                        : 'text-slate-100 font-medium'
                    }`}
                  >
                    {d.nome}{' '}
                    <span
                      className={`font-mono text-[12px] ${
                        cumprido ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {d.dose}
                    </span>
                  </span>

                  {/* Tempo restante (só futuro) */}
                  {futuro && d.tempoRestante && (
                    <span className="shrink-0 text-amber-300 font-mono text-[11px] tabular-nums">
                      {d.tempoRestante}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
