import { ArrowDown, ArrowRight, ArrowUp, Minus } from 'lucide-react'
import type { Avaliacao } from '@/../product-personal/sections/avaliacoes/types'

interface ComparacaoPanelProps {
  atual: Avaliacao
  outras: Avaliacao[]
  comparacaoId: string | null
  onChange?: (id: string | null) => void
}

interface MetricaCompare {
  label: string
  unit: string
  atual: number | null
  comparada: number | null
  diminuirEhPositivo: boolean
}

export function ComparacaoPanel({
  atual,
  outras,
  comparacaoId,
  onChange,
}: ComparacaoPanelProps) {
  const candidatos = outras
    .filter((a) => a.alunoId === atual.alunoId && a.id !== atual.id)
    .sort((a, b) => b.data.localeCompare(a.data))
  const comparada = candidatos.find((a) => a.id === comparacaoId) ?? null

  if (candidatos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sem avaliações anteriores deste aluno para comparar.
        </p>
      </div>
    )
  }

  const metricas: MetricaCompare[] = comparada
    ? buildMetricas(atual, comparada)
    : []

  return (
    <div className="space-y-5">
      {/* Selector */}
      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Comparar com avaliação anterior
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {candidatos.slice(0, 6).map((c) => {
            const active = comparacaoId === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange?.(active ? null : c.id)}
                className={`
                  inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors
                  ${
                    active
                      ? 'border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-900/40 dark:text-teal-300'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }
                `}
              >
                {new Date(c.data).toLocaleDateString('pt-BR')}
              </button>
            )
          })}
        </div>
      </article>

      {!comparada ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Selecione uma avaliação acima para comparar.
          </p>
        </div>
      ) : (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <header className="grid grid-cols-[1.5fr_1fr_60px_1fr] gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
            <div>Métrica</div>
            <div className="text-right">
              {new Date(comparada.data).toLocaleDateString('pt-BR')}
            </div>
            <div className="text-center">Δ</div>
            <div className="text-right">
              {new Date(atual.data).toLocaleDateString('pt-BR')}{' '}
              <span className="text-teal-600 dark:text-teal-400">·</span>{' '}
              <span className="text-teal-700 dark:text-teal-400">atual</span>
            </div>
          </header>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {metricas.map((m) => (
              <CompareRow key={m.label} m={m} />
            ))}
          </div>
        </article>
      )}
    </div>
  )
}

function CompareRow({ m }: { m: MetricaCompare }) {
  const delta =
    m.atual != null && m.comparada != null ? m.atual - m.comparada : null
  const isPositive =
    delta == null
      ? null
      : delta === 0
        ? 'neutral'
        : m.diminuirEhPositivo
          ? delta < 0
          : delta > 0

  const tone =
    isPositive === 'neutral'
      ? 'text-slate-500 dark:text-slate-400'
      : isPositive
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400'

  const Arrow =
    isPositive === 'neutral' ? Minus : delta != null && delta > 0 ? ArrowUp : ArrowDown

  return (
    <div className="grid grid-cols-[1.5fr_1fr_60px_1fr] items-center gap-3 px-5 py-2.5">
      <div>
        <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
          {m.label}
        </p>
      </div>
      <div className="text-right font-mono">
        {m.comparada != null ? (
          <>
            <span className="text-[13px] tabular-nums text-slate-500 dark:text-slate-400">
              {m.comparada}
            </span>
            <span className="ml-0.5 text-[10px] text-slate-400 dark:text-slate-500">
              {m.unit}
            </span>
          </>
        ) : (
          <span className="text-[12px] text-slate-400 dark:text-slate-500">—</span>
        )}
      </div>
      <div className={`text-center ${tone}`}>
        {delta == null ? (
          <ArrowRight size={12} className="mx-auto opacity-30" />
        ) : (
          <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold tabular-nums">
            <Arrow size={11} strokeWidth={3} />
            {Math.abs(delta).toFixed(delta % 1 === 0 ? 0 : 1)}
          </span>
        )}
      </div>
      <div className="text-right font-mono">
        {m.atual != null ? (
          <>
            <span className="text-[14px] font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              {m.atual}
            </span>
            <span className="ml-0.5 text-[10px] text-slate-400 dark:text-slate-500">
              {m.unit}
            </span>
          </>
        ) : (
          <span className="text-[12px] text-slate-400 dark:text-slate-500">—</span>
        )}
      </div>
    </div>
  )
}

function buildMetricas(atual: Avaliacao, comparada: Avaliacao): MetricaCompare[] {
  const aA = atual.antropometria
  const aC = comparada.antropometria
  const fA = atual.funcional
  const fC = comparada.funcional

  return [
    // Antropometria
    {
      label: 'Peso',
      unit: 'kg',
      atual: aA?.pesoKg ?? null,
      comparada: aC?.pesoKg ?? null,
      diminuirEhPositivo: false,
    },
    {
      label: 'IMC',
      unit: 'kg/m²',
      atual: aA?.imc ?? null,
      comparada: aC?.imc ?? null,
      diminuirEhPositivo: false,
    },
    {
      label: '% Gordura (Pollock)',
      unit: '%',
      atual: aA?.dobras.percentualGorduraPollock ?? null,
      comparada: aC?.dobras.percentualGorduraPollock ?? null,
      diminuirEhPositivo: true,
    },
    {
      label: 'Massa magra (bioimp)',
      unit: 'kg',
      atual: aA?.bioimpedancia?.massaMagraKg ?? null,
      comparada: aC?.bioimpedancia?.massaMagraKg ?? null,
      diminuirEhPositivo: false,
    },
    {
      label: 'Cintura',
      unit: 'cm',
      atual: aA?.circunferencias.cintura ?? null,
      comparada: aC?.circunferencias.cintura ?? null,
      diminuirEhPositivo: true,
    },
    {
      label: 'Braço',
      unit: 'cm',
      atual: aA?.circunferencias.braco ?? null,
      comparada: aC?.circunferencias.braco ?? null,
      diminuirEhPositivo: false,
    },
    {
      label: 'Coxa',
      unit: 'cm',
      atual: aA?.circunferencias.coxa ?? null,
      comparada: aC?.circunferencias.coxa ?? null,
      diminuirEhPositivo: false,
    },
    // Funcional
    {
      label: 'Supino 1RM',
      unit: 'kg',
      atual: fA?.rm.supino?.estimadoKg ?? null,
      comparada: fC?.rm.supino?.estimadoKg ?? null,
      diminuirEhPositivo: false,
    },
    {
      label: 'Squat 1RM',
      unit: 'kg',
      atual: fA?.rm.squat?.estimadoKg ?? null,
      comparada: fC?.rm.squat?.estimadoKg ?? null,
      diminuirEhPositivo: false,
    },
    {
      label: 'Deadlift 1RM',
      unit: 'kg',
      atual: fA?.rm.deadlift?.estimadoKg ?? null,
      comparada: fC?.rm.deadlift?.estimadoKg ?? null,
      diminuirEhPositivo: false,
    },
    {
      label: 'FMS',
      unit: '/21',
      atual: fA?.fms?.totalScore ?? null,
      comparada: fC?.fms?.totalScore ?? null,
      diminuirEhPositivo: false,
    },
    {
      label: 'VO2 estimado',
      unit: 'mL/kg/min',
      atual: fA?.cardio?.vo2Estimado ?? null,
      comparada: fC?.cardio?.vo2Estimado ?? null,
      diminuirEhPositivo: false,
    },
    {
      label: 'Prancha',
      unit: 's',
      atual: fA?.resistenciaLocal?.pranchaTempoSegundos ?? null,
      comparada: fC?.resistenciaLocal?.pranchaTempoSegundos ?? null,
      diminuirEhPositivo: false,
    },
  ].filter((m) => m.atual != null || m.comparada != null)
}
