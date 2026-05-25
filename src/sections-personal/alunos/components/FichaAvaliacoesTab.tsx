import { useMemo, useState } from 'react'
import { Plus, Activity, Pencil, ChevronRight } from 'lucide-react'
import type { Aluno, AvaliacaoResumo } from '@/../product-personal/sections/alunos/types'

type MetricaKey = 'pesoKg' | 'percentualGordura' | 'fmsScore' | 'rmSupino'

const METRICA_OPTIONS: {
  id: MetricaKey
  label: string
  unidade: string
  positivoQuandoBaixa: boolean
}[] = [
  { id: 'pesoKg', label: 'Peso', unidade: 'kg', positivoQuandoBaixa: false },
  {
    id: 'percentualGordura',
    label: '% Gordura',
    unidade: '%',
    positivoQuandoBaixa: true,
  },
  { id: 'fmsScore', label: 'FMS', unidade: '/21', positivoQuandoBaixa: false },
  {
    id: 'rmSupino',
    label: 'RM Supino',
    unidade: 'kg',
    positivoQuandoBaixa: false,
  },
]

interface FichaAvaliacoesTabProps {
  aluno: Aluno
  onNovaAvaliacao?: () => void
  onOpenAvaliacao?: (id: string) => void
  onEditAvaliacao?: (id: string) => void
}

export function FichaAvaliacoesTab({
  aluno,
  onNovaAvaliacao,
  onOpenAvaliacao,
  onEditAvaliacao,
}: FichaAvaliacoesTabProps) {
  const avaliacoes = aluno.avaliacoes ?? []
  const [metricaSelecionada, setMetricaSelecionada] = useState<MetricaKey>('pesoKg')

  const pontos = useMemo(() => {
    return [...avaliacoes]
      .sort((a, b) => a.data.localeCompare(b.data))
      .map((a) => ({
        data: a.data,
        valor: a[metricaSelecionada] as number | null,
      }))
      .filter((p): p is { data: string; valor: number } => p.valor != null)
  }, [avaliacoes, metricaSelecionada])

  if (avaliacoes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
          <Activity size={20} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
          Sem avaliações ainda
        </h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Inicie a primeira avaliação para começar a acompanhar a evolução.
        </p>
        <button
          type="button"
          onClick={onNovaAvaliacao}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Plus size={14} strokeWidth={2.5} />
          Nova avaliação
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          {avaliacoes.length} avaliaç
          {avaliacoes.length === 1 ? 'ão' : 'ões'} registradas
        </p>
        <button
          type="button"
          onClick={onNovaAvaliacao}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          <Plus size={12} strokeWidth={2.5} />
          Nova avaliação
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Chart */}
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <header className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Evolução
            </p>
            <div className="flex flex-wrap gap-1">
              {METRICA_OPTIONS.map((m) => {
                const active = metricaSelecionada === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMetricaSelecionada(m.id)}
                    className={`
                      rounded-md px-2 py-1 text-[11px] font-semibold transition-colors
                      ${
                        active
                          ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                      }
                    `}
                  >
                    {m.label}
                  </button>
                )
              })}
            </div>
          </header>

          <LineChart pontos={pontos} unidade={METRICA_OPTIONS.find((m) => m.id === metricaSelecionada)?.unidade ?? ''} />
        </article>

        {/* Lista compacta */}
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <header className="border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Avaliações
            </p>
          </header>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {avaliacoes.map((a) => (
              <AvaliacaoCompactRow
                key={a.id}
                avaliacao={a}
                onClick={() => onOpenAvaliacao?.(a.id)}
                onEdit={onEditAvaliacao ? () => onEditAvaliacao(a.id) : undefined}
              />
            ))}
          </ul>
        </article>
      </div>
    </div>
  )
}

function AvaliacaoCompactRow({
  avaliacao,
  onClick,
  onEdit,
}: {
  avaliacao: AvaliacaoResumo
  onClick?: () => void
  onEdit?: () => void
}) {
  return (
    <li className="group relative transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
      <button
        type="button"
        onClick={onClick}
        className="block w-full px-5 py-3 pr-16 text-left"
      >
        <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {new Date(avaliacao.data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
          <Metric label="Peso" value={avaliacao.pesoKg} unit="kg" />
          <Metric label="% Gord." value={avaliacao.percentualGordura} unit="%" />
          <Metric label="FMS" value={avaliacao.fmsScore} unit="/21" />
          <Metric label="Sup 1RM" value={avaliacao.rmSupino} unit="kg" />
        </div>
      </button>

      {/* Action buttons (revealed on hover) */}
      <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-0.5 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            aria-label="Editar avaliação"
            title="Editar"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white text-slate-500 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-teal-50 hover:text-teal-700 hover:ring-teal-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700 dark:hover:bg-teal-900/30 dark:hover:text-teal-300 dark:hover:ring-teal-800"
          >
            <Pencil size={12} />
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
          aria-label="Ver detalhe"
          title="Ver detalhe"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white text-slate-500 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <ChevronRight size={12} />
        </button>
      </div>
    </li>
  )
}

function Metric({
  label,
  value,
  unit,
}: {
  label: string
  value: number | null
  unit: string
}) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="font-mono text-[12px] font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {value != null ? `${value}` : '—'}
        {value != null && unit && (
          <span className="ml-0.5 text-[9px] text-slate-400 dark:text-slate-500">
            {unit}
          </span>
        )}
      </p>
    </div>
  )
}

function LineChart({
  pontos,
  unidade,
}: {
  pontos: { data: string; valor: number }[]
  unidade: string
}) {
  if (pontos.length < 2) {
    return (
      <p className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
        Precisa de ao menos 2 avaliações pra mostrar evolução.
      </p>
    )
  }

  const valores = pontos.map((p) => p.valor)
  const min = Math.min(...valores)
  const max = Math.max(...valores)
  const yMax = max + (max - min) * 0.15
  const yMin = Math.max(0, min - (max - min) * 0.15)
  const range = yMax - yMin || 1

  const W = 100
  const H = 60
  const padX = 6

  const pointX = (i: number) =>
    pontos.length === 1 ? W / 2 : padX + (i / (pontos.length - 1)) * (W - padX * 2)
  const pointY = (v: number) => H - ((v - yMin) / range) * H + 2

  const linePath = pontos
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${pointX(i)} ${pointY(p.valor)}`)
    .join(' ')

  const areaPath =
    `${linePath} L ${pointX(pontos.length - 1)} ${H + 2} L ${pointX(0)} ${H + 2} Z`

  const delta = pontos[pontos.length - 1].valor - pontos[0].valor

  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {pontos[pontos.length - 1].valor}
          <span className="ml-1 text-sm text-slate-400 dark:text-slate-500">
            {unidade}
          </span>
        </p>
        <p
          className={`font-mono text-xs font-semibold tabular-nums ${
            delta > 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : delta < 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {delta > 0 ? '+' : ''}
          {delta.toFixed(1)} {unidade} desde {new Date(pontos[0].data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </p>
      </div>

      <div className="mt-4 flex h-32 items-stretch gap-2">
        <div className="flex flex-col justify-between font-mono text-[9px] text-slate-400 dark:text-slate-500 py-0.5">
          <span>{yMax.toFixed(1)}</span>
          <span>{((yMax + yMin) / 2).toFixed(1)}</span>
          <span>{yMin.toFixed(1)}</span>
        </div>

        <div className="relative flex-1">
          <svg
            viewBox={`0 0 ${W} ${H + 4}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <path
              d={areaPath}
              className="fill-teal-500/15 dark:fill-teal-400/10"
            />
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="text-teal-500 dark:text-teal-400"
            />
            {pontos.map((p, i) => (
              <circle
                key={i}
                cx={pointX(i)}
                cy={pointY(p.valor)}
                r="1.6"
                className="fill-teal-500 dark:fill-teal-400"
              />
            ))}
          </svg>
        </div>
      </div>

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
