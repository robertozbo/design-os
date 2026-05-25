import { useMemo } from 'react'
import type { Plano } from '@/../product-personal/sections/treinos/types'

interface ComparacaoTabProps {
  plano: Plano
}

interface SerieDataPoint {
  data: string
  prescrito: number
  real: number
}

interface ExercicioComparacao {
  exercicioId: string
  exercicioNome: string
  grupoMuscular: string
  pontos: SerieDataPoint[]
  cargaPrescrita: number
  cargaRealMax: number
  delta: number
}

export function ComparacaoTab({ plano }: ComparacaoTabProps) {
  const dados = useMemo(() => buildComparacao(plano), [plano])

  if (dados.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sem dados de comparação ainda
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          Carga prescrita vs real · evolução
        </h2>
        <p className="text-[12px] text-slate-500 dark:text-slate-400">
          Maior carga prescrita por sessão (em laranja) vs maior carga real registrada pelo aluno (em teal). Quando o real fica acima do prescrito por várias sessões, é sinal de que o aluno tá pronto pra progressão.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {dados.map((ex) => (
          <ExercicioComparacaoCard key={ex.exercicioId} ex={ex} />
        ))}
      </div>
    </div>
  )
}

function ExercicioComparacaoCard({ ex }: { ex: ExercicioComparacao }) {
  const positivo = ex.delta > 0

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            {ex.grupoMuscular}
          </p>
          <h3 className="mt-0.5 text-[15px] font-semibold text-slate-900 dark:text-slate-50">
            {ex.exercicioNome}
          </h3>
        </div>
        <div className="text-right">
          <p
            className={`font-mono text-2xl font-semibold tabular-nums ${
              positivo
                ? 'text-emerald-600 dark:text-emerald-400'
                : ex.delta < 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {positivo ? '+' : ''}
            {ex.delta}
            <span className="ml-0.5 text-sm">kg</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            real vs prescrito
          </p>
        </div>
      </header>

      <ChartCanvas pontos={ex.pontos} />

      <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-[11px] dark:border-slate-800">
        <LegendDot color="bg-amber-400 dark:bg-amber-500" label="Prescrito" />
        <LegendDot color="bg-teal-500 dark:bg-teal-400" label="Real (aluno)" />
      </div>
    </article>
  )
}

function ChartCanvas({ pontos }: { pontos: SerieDataPoint[] }) {
  if (pontos.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
        Sem dados
      </p>
    )
  }

  const maxKg = Math.max(...pontos.flatMap((p) => [p.prescrito, p.real]))
  const yMax = Math.ceil(maxKg / 10) * 10 || 10

  const W = 100
  const H = 60
  const padX = 6
  const innerW = W - padX * 2

  const pointX = (i: number) =>
    pontos.length === 1 ? W / 2 : padX + (i / (pontos.length - 1)) * innerW
  const pointY = (kg: number) => H - (kg / yMax) * H + 2

  const linePath = (key: 'prescrito' | 'real') =>
    pontos
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${pointX(i)} ${pointY(p[key])}`)
      .join(' ')

  return (
    <div className="mt-4 relative">
      <div className="flex h-32 items-stretch gap-2">
        {/* y-axis labels */}
        <div className="flex flex-col justify-between font-mono text-[9px] text-slate-400 dark:text-slate-500 py-0.5">
          <span>{yMax}kg</span>
          <span>{Math.round(yMax / 2)}kg</span>
          <span>0</span>
        </div>

        {/* chart */}
        <div className="relative flex-1">
          <svg
            viewBox={`0 0 ${W} ${H + 4}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {/* gridlines */}
            <line
              x1="0"
              y1={H * 0.5}
              x2={W}
              y2={H * 0.5}
              stroke="currentColor"
              strokeWidth="0.3"
              strokeDasharray="1 1"
              className="text-slate-200 dark:text-slate-800"
            />

            {/* prescrito */}
            <path
              d={linePath('prescrito')}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-amber-400 dark:text-amber-500"
            />

            {/* real */}
            <path
              d={linePath('real')}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="text-teal-500 dark:text-teal-400"
            />

            {/* points */}
            {pontos.map((p, i) => (
              <g key={i}>
                <circle
                  cx={pointX(i)}
                  cy={pointY(p.prescrito)}
                  r="1.4"
                  className="fill-amber-400 dark:fill-amber-500"
                />
                <circle
                  cx={pointX(i)}
                  cy={pointY(p.real)}
                  r="1.6"
                  className="fill-teal-500 dark:fill-teal-400"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* x-axis labels */}
      <div className="ml-9 mt-1 flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {pontos.map((p, i) => (
          <span key={i}>
            {new Date(p.data).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
            })}
          </span>
        ))}
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  )
}

function buildComparacao(plano: Plano): ExercicioComparacao[] {
  const sessoes = plano.sessoesExecutadas ?? []
  if (sessoes.length === 0) return []

  // Map: exercicioId → array of {data, prescrito, real}
  const acc = new Map<string, ExercicioComparacao>()

  // Sort sessões oldest → newest for x-axis
  const ordenadas = [...sessoes].sort((a, b) => a.data.localeCompare(b.data))

  for (const sessao of ordenadas) {
    if (sessao.status !== 'completa' && sessao.status !== 'parcial') continue
    const treino = plano.treinos.find((t) => t.letra === sessao.treinoLetra)
    if (!treino) continue

    for (const exExec of sessao.exercicios) {
      const exPresc = treino.exercicios.find((e) => e.exercicioId === exExec.exercicioId)
      if (!exPresc) continue

      // Only consider weighted exercises (carga in kg)
      const cargasPresc = exPresc.series
        .map((s) => s.cargaKg)
        .filter((c): c is number => c != null)
      const cargasReal = exExec.series
        .map((s) => s.cargaRealKg)
        .filter((c): c is number => c != null)

      if (cargasPresc.length === 0 || cargasReal.length === 0) continue

      const maxPresc = Math.max(...cargasPresc)
      const maxReal = Math.max(...cargasReal)

      const existing = acc.get(exExec.exercicioId) ?? {
        exercicioId: exExec.exercicioId,
        exercicioNome: exExec.exercicioNome,
        grupoMuscular: exPresc.grupoMuscular,
        pontos: [],
        cargaPrescrita: maxPresc,
        cargaRealMax: maxReal,
        delta: 0,
      }
      existing.pontos.push({ data: sessao.data, prescrito: maxPresc, real: maxReal })
      existing.cargaPrescrita = maxPresc
      existing.cargaRealMax = Math.max(existing.cargaRealMax, maxReal)
      acc.set(exExec.exercicioId, existing)
    }
  }

  return Array.from(acc.values())
    .filter((e) => e.pontos.length >= 2)
    .map((e) => ({
      ...e,
      delta: e.cargaRealMax - e.cargaPrescrita,
    }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
}
