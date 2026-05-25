import { Check, Clock, Pill } from 'lucide-react'
import type { ResumoHoje } from '@/../product/sections/medication/types'

interface Props {
  resumo: ResumoHoje
  revealIndex?: number
  onMarcarDose?: (doseId: string) => void
}

const DIA_LABEL = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

const DIA_DOT: Record<string, string> = {
  cumprido: 'bg-emerald-500 dark:bg-emerald-400',
  perdido: 'bg-rose-500 dark:bg-rose-400',
  parcial: 'bg-amber-400 dark:bg-amber-300',
  hoje: 'bg-teal-500 dark:bg-teal-400 animate-pulse',
  futuro: 'bg-slate-300 dark:bg-slate-700',
}

export function TodayDosesList({ resumo, revealIndex = 0, onMarcarDose }: Props) {
  const totalCumpridas = resumo.doses.filter((d) => d.status === 'cumprido').length
  const total = resumo.doses.length

  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="nymos-reveal opacity-0"
    >
      {/* Eyebrow */}
      <div className="mb-1 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          Doses de hoje
        </span>
      </div>
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Lembretes do dia
        </h2>
        <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
          {totalCumpridas} de {total} cumpridas · adesão semana{' '}
          <span className="text-emerald-600 dark:text-emerald-400">
            {resumo.adesaoSemana.percentual}%
          </span>
        </span>
      </div>

      {/* Adesão dots */}
      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
          Semana
        </span>
        <div className="ml-2 flex items-center gap-2">
          {resumo.adesaoSemana.dias.map((status, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span
                className={`h-2 w-2 rounded-full ${DIA_DOT[status] ?? DIA_DOT.futuro}`}
              />
              <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500">
                {DIA_LABEL[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Banner adesão baixa */}
      {resumo.adesaoBaixa && (
        <div className="mt-3 rounded-2xl border-l-[3px] border-amber-500 bg-amber-50 px-4 py-3 dark:border-amber-400 dark:bg-amber-500/10">
          <p className="text-[12.5px] text-amber-900 dark:text-amber-200">
            Adesão caiu nos últimos 7 dias. Bora retomar o ritmo?
          </p>
        </div>
      )}

      {/* Lista doses */}
      <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white/80 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/60">
        {resumo.doses.map((d) => {
          const cumprido = d.status === 'cumprido'
          const pendente = d.status === 'pendente'
          const futuro = d.status === 'futuro'
          return (
            <li key={d.id}>
              <button
                onClick={() => pendente && onMarcarDose?.(d.id)}
                disabled={!pendente}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${pendente ? 'hover:bg-stone-50 active:scale-[0.998] dark:hover:bg-slate-800/40' : ''}`}
              >
                {cumprido && (
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                    <Check size={14} strokeWidth={2.6} />
                  </span>
                )}
                {pendente && (
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                    <Pill size={12} className="text-slate-400 dark:text-slate-500" />
                  </span>
                )}
                {futuro && (
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-300">
                    <Clock size={13} strokeWidth={2.4} />
                  </span>
                )}

                <span
                  className={`shrink-0 font-mono text-[13px] tabular-nums ${cumprido ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  {d.horario}
                </span>

                <span
                  className={`min-w-0 flex-1 truncate text-[14px] ${cumprido ? 'text-slate-400 line-through dark:text-slate-500' : 'font-medium text-slate-900 dark:text-slate-100'}`}
                >
                  {d.nome}{' '}
                  <span
                    className={`font-mono text-[12px] ${cumprido ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    {d.dose}
                  </span>
                </span>

                {pendente && (
                  <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[11px] font-medium text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
                    Marcar
                  </span>
                )}
                {futuro && d.tempoRestante && (
                  <span className="font-mono text-[11px] tabular-nums text-amber-600 dark:text-amber-300">
                    {d.tempoRestante}
                  </span>
                )}
                {cumprido && (
                  <span className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Cumprida
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
