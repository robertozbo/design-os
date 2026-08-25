import { AlertTriangle, Dumbbell, HeartPulse, Timer } from 'lucide-react'
import type { Funcional } from '@/../product-clinic/sections/avaliacao-fisica/types'
import { FMS_TESTES, resumirFuncional } from './formulas'
import { ClassBadge } from './FormPrimitives'
import { TOM_BARRA, numero } from './helpers'

interface Props {
  funcional: Funcional | null
  pesoKg: number | null
  /** Funcional da avaliação anterior, para o delta. */
  anterior: Funcional | null
}

/**
 * O que a metade funcional produz de derivado: 1RM por exercício, força relativa ao peso
 * corporal, total do FMS e VO₂máx.
 *
 * A força relativa é a que muda a conduta: 100 kg de supino significa uma coisa num paciente de
 * 60 kg e outra num de 100 kg, e o número absoluto sozinho faz o educador físico comparar o
 * paciente com quem ele não é.
 */
export function ResultadoFuncionalPanel({ funcional, pesoKg, anterior }: Props) {
  const r = resumirFuncional(funcional, pesoKg)
  const rAnt = resumirFuncional(anterior, pesoKg)
  const temAlgo =
    r.totalRM != null || r.fmsTotal != null || r.vo2 != null || funcional?.resistenciaLocal

  if (!temAlgo) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
        <p className="text-[11px] leading-snug text-slate-400">
          Nada medido ainda nesta aba. A avaliação funcional é opcional — a consulta de nutrição
          costuma parar na antropometria.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
          <Dumbbell className="h-3.5 w-3.5 text-teal-500" /> Força
        </h2>
        <ul className="mt-3 space-y-1.5">
          {r.rm.map((x) => (
            <li key={x.id} className="flex items-baseline gap-2">
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                {x.label}
              </span>
              {x.teste?.pesoTesteKg != null && x.teste.repsTeste != null && (
                <span className="font-mono text-[10px] tabular-nums text-slate-400">
                  {numero(x.teste.pesoTesteKg, 0)} kg × {x.teste.repsTeste}
                </span>
              )}
              <span className="flex-1" />
              <span className="font-mono text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                {numero(x.estimado, 0)}
                <span className="ml-0.5 text-[10px] font-normal text-slate-400">kg</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Mini label="Total 1RM" valor={r.totalRM} casas={0} sufixo="kg" />
          <Mini
            label="Força relativa"
            valor={r.forcaRelativa}
            casas={2}
            sufixo="× peso"
            destaque
            delta={
              r.forcaRelativa != null && rAnt.forcaRelativa != null
                ? r.forcaRelativa - rAnt.forcaRelativa
                : null
            }
          />
        </div>
      </section>

      {r.fmsTotal != null && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
              <Timer className="h-3.5 w-3.5 text-teal-500" /> FMS
            </h2>
            <span className="font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              {r.fmsTotal}
              <span className="text-[11px] font-normal text-slate-400">/21</span>
            </span>
          </div>
          <div className="mt-2">
            <ClassBadge classificacao={r.fmsClasse} />
          </div>
          <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <span
              className={TOM_BARRA[r.fmsClasse?.tom ?? 'slate']}
              style={{ width: `${(r.fmsTotal / 21) * 100}%` }}
            />
          </div>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-slate-400">
            corte validado · 14
          </p>

          {r.fmsComDor.length > 0 && (
            <p className="mt-3 inline-flex items-start gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-[11px] leading-snug text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
              <span>
                Dor relatada em{' '}
                <strong className="font-semibold">
                  {r.fmsComDor
                    .map((id) => FMS_TESTES.find((t) => t.id === id)?.label ?? id)
                    .join(' · ')}
                </strong>
                . Encaminhar antes de prescrever — o total não substitui isso.
              </span>
            </p>
          )}
        </section>
      )}

      {(r.vo2 != null || funcional?.cardio) && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
            <HeartPulse className="h-3.5 w-3.5 text-teal-500" /> Cardiorrespiratório
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Mini label="VO₂máx" valor={r.vo2} sufixo="mL/kg/min" destaque />
            <Mini
              label="FC recuperação"
              valor={funcional?.cardio?.fcRecuperacao ?? null}
              casas={0}
              sufixo="bpm"
            />
          </div>
          <p className="mt-2 text-[10px] leading-snug text-slate-400">
            {funcional?.cardio?.protocolo === 'astrand'
              ? 'Åstrand sai de nomograma (carga × FC × idade) — o VO₂ é digitado, não calculado.'
              : 'Cooper (1968): VO₂máx = (distância − 504,9) / 44,73.'}
          </p>
        </section>
      )}

      {funcional?.resistenciaLocal && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Resistência local
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Mini
              label="Flexões"
              valor={funcional.resistenciaLocal.flexoesMax}
              casas={0}
              sufixo="reps"
            />
            <Mini
              label="Abdominais"
              valor={funcional.resistenciaLocal.abdominais1min}
              casas={0}
              sufixo="reps"
            />
            <Mini
              label="Prancha"
              valor={funcional.resistenciaLocal.pranchaSegundos}
              casas={0}
              sufixo="s"
            />
          </div>
        </section>
      )}
    </div>
  )
}

function Mini({
  label,
  valor,
  sufixo,
  casas = 1,
  destaque = false,
  delta,
}: {
  label: string
  valor: number | null
  sufixo: string
  casas?: number
  destaque?: boolean
  delta?: number | null
}) {
  return (
    <div
      className={`rounded-xl p-2.5 ${
        destaque ? 'bg-teal-50 dark:bg-teal-950/30' : 'border border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {numero(valor, casas)}
        <span className="ml-1 text-[10px] font-normal text-slate-400">{sufixo}</span>
      </div>
      {delta != null && delta !== 0 && (
        <div
          className={`font-mono text-[10px] tabular-nums ${
            delta > 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {delta > 0 ? '+' : '−'}
          {numero(Math.abs(delta), casas)}
        </div>
      )}
    </div>
  )
}
