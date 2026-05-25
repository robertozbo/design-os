import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BatteryFull,
  Footprints,
  Heart,
  Minus,
  Moon,
  Scale,
  Wifi,
} from 'lucide-react'
import type {
  Aluno,
  MetricaDiaria,
  MetricaTipo,
} from '@/../product-personal/sections/alunos/types'

interface FichaMetricasTabProps {
  aluno: Aluno
}

type Periodo = '7d' | '30d' | '90d'

const PERIODO_DAYS: Record<Periodo, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
}

interface MetricaConfig {
  key: MetricaTipo
  label: string
  icon: React.ElementType
  unit: string
  decimals: number
  /** "down" significa que diminuir é positivo (ex: FC repouso) */
  diminuirEhPositivo: boolean
  ringTone: string
}

const METRICAS: MetricaConfig[] = [
  {
    key: 'peso',
    label: 'Peso',
    icon: Scale,
    unit: 'kg',
    decimals: 1,
    diminuirEhPositivo: false,
    ringTone: 'text-teal-500 dark:text-teal-400',
  },
  {
    key: 'fcRepouso',
    label: 'FC repouso',
    icon: Heart,
    unit: 'bpm',
    decimals: 0,
    diminuirEhPositivo: true,
    ringTone: 'text-rose-500 dark:text-rose-400',
  },
  {
    key: 'hrv',
    label: 'HRV',
    icon: Activity,
    unit: 'ms',
    decimals: 0,
    diminuirEhPositivo: false,
    ringTone: 'text-violet-500 dark:text-violet-400',
  },
  {
    key: 'sonoHoras',
    label: 'Sono',
    icon: Moon,
    unit: 'h',
    decimals: 1,
    diminuirEhPositivo: false,
    ringTone: 'text-indigo-500 dark:text-indigo-400',
  },
  {
    key: 'passos',
    label: 'Passos',
    icon: Footprints,
    unit: '',
    decimals: 0,
    diminuirEhPositivo: false,
    ringTone: 'text-emerald-500 dark:text-emerald-400',
  },
  {
    key: 'energia',
    label: 'Energia',
    icon: BatteryFull,
    unit: '/5',
    decimals: 1,
    diminuirEhPositivo: false,
    ringTone: 'text-amber-500 dark:text-amber-400',
  },
]

export function FichaMetricasTab({ aluno }: FichaMetricasTabProps) {
  const [periodo, setPeriodo] = useState<Periodo>('30d')
  const [selecionada, setSelecionada] = useState<MetricaTipo>('peso')
  const metricas = aluno.metricasDiarias ?? []

  const ordenadas = useMemo(
    () => [...metricas].sort((a, b) => a.data.localeCompare(b.data)),
    [metricas],
  )

  const days = PERIODO_DAYS[periodo]
  const limiteData = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - days)
    return d.toISOString().slice(0, 10)
  }, [days])
  const limitePrev = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - days * 2)
    return d.toISOString().slice(0, 10)
  }, [days])

  const filtradas = ordenadas.filter((m) => m.data >= limiteData)
  const previas = ordenadas.filter(
    (m) => m.data >= limitePrev && m.data < limiteData,
  )

  if (metricas.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
          <Activity size={20} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
          Sem métricas sincronizadas ainda
        </h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
          As métricas aparecem aqui conforme o aluno conectar Apple Health, Garmin ou registrar manualmente no app.
        </p>
      </div>
    )
  }

  const metricaConfig = METRICAS.find((m) => m.key === selecionada)!

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Sinais do app
          </h2>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <Wifi size={10} className="text-emerald-500" />
            Sincronizado · Apple Health / Garmin / manual
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {(Object.keys(PERIODO_DAYS) as Periodo[]).map((p) => {
            const active = periodo === p
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPeriodo(p)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  active
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Últimos {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '90 dias'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {METRICAS.map((m) => (
          <MetricaCard
            key={m.key}
            config={m}
            atuais={filtradas}
            previas={previas}
            active={selecionada === m.key}
            onClick={() => setSelecionada(m.key)}
          />
        ))}
      </div>

      {/* Chart full */}
      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <metricaConfig.icon size={13} className={metricaConfig.ringTone} />
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">
            {metricaConfig.label} · {periodo}
          </p>
        </header>
        <FullChart pontos={filtradas} config={metricaConfig} />
      </article>
    </div>
  )
}

// ===== MetricaCard with sparkline =====

function MetricaCard({
  config,
  atuais,
  previas,
  active,
  onClick,
}: {
  config: MetricaConfig
  atuais: MetricaDiaria[]
  previas: MetricaDiaria[]
  active: boolean
  onClick: () => void
}) {
  const valoresAtuais = atuais
    .map((m) => m[config.key as keyof MetricaDiaria] as number | null | undefined)
    .filter((v): v is number => v != null)
  const valoresPrevios = previas
    .map((m) => m[config.key as keyof MetricaDiaria] as number | null | undefined)
    .filter((v): v is number => v != null)

  const mediaAtual =
    valoresAtuais.length > 0
      ? valoresAtuais.reduce((a, b) => a + b, 0) / valoresAtuais.length
      : null
  const mediaPrevia =
    valoresPrevios.length > 0
      ? valoresPrevios.reduce((a, b) => a + b, 0) / valoresPrevios.length
      : null

  const delta =
    mediaAtual != null && mediaPrevia != null ? mediaAtual - mediaPrevia : null
  const isPositive =
    delta == null
      ? null
      : delta === 0
        ? 'neutral'
        : config.diminuirEhPositivo
          ? delta < 0
          : delta > 0

  const deltaTone =
    isPositive === 'neutral'
      ? 'text-slate-500 dark:text-slate-400'
      : isPositive
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400'
  const Arrow = delta != null && delta > 0 ? ArrowUp : delta != null && delta < 0 ? ArrowDown : Minus

  const formatado =
    mediaAtual != null
      ? config.decimals === 0
        ? Math.round(mediaAtual).toLocaleString('pt-BR')
        : mediaAtual.toFixed(config.decimals)
      : '—'

  const Icon = config.icon

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl border p-4 text-left transition-all
        ${
          active
            ? 'border-teal-300 bg-teal-50/30 dark:border-teal-700 dark:bg-teal-900/10'
            : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Icon size={12} className={config.ringTone} />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">
            {config.label}
          </span>
        </div>
        {delta != null && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums ${
              isPositive === 'neutral'
                ? 'bg-slate-100 dark:bg-slate-800'
                : isPositive
                  ? 'bg-emerald-50 dark:bg-emerald-900/40'
                  : 'bg-rose-50 dark:bg-rose-900/40'
            } ${deltaTone}`}
          >
            <Arrow size={9} strokeWidth={3} />
            {Math.abs(delta).toFixed(config.decimals === 0 ? 0 : 1)}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-1 font-mono">
        <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {formatado}
        </span>
        {config.unit && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {config.unit}
          </span>
        )}
      </div>

      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        média do período · {valoresAtuais.length} dias
      </p>

      {/* Sparkline */}
      <div className="mt-3 h-10">
        <Sparkline valores={valoresAtuais} tone={config.ringTone} />
      </div>
    </button>
  )
}

function Sparkline({ valores, tone }: { valores: number[]; tone: string }) {
  if (valores.length < 2) return null
  const min = Math.min(...valores)
  const max = Math.max(...valores)
  const range = max - min || 1
  const W = 100
  const H = 30
  const pointX = (i: number) => (i / (valores.length - 1)) * W
  const pointY = (v: number) => H - ((v - min) / range) * H

  const path = valores
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${pointX(i)} ${pointY(v)}`)
    .join(' ')

  const areaPath = `${path} L ${W} ${H} L 0 ${H} Z`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-full w-full"
    >
      <path d={areaPath} className={tone} fill="currentColor" fillOpacity="0.12" />
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={tone}
      />
    </svg>
  )
}

// ===== Full chart =====

function FullChart({
  pontos,
  config,
}: {
  pontos: MetricaDiaria[]
  config: MetricaConfig
}) {
  const valores = pontos
    .map((p) => ({
      data: p.data,
      v: p[config.key as keyof MetricaDiaria] as number | null | undefined,
    }))
    .filter((p): p is { data: string; v: number } => p.v != null)

  if (valores.length < 2) {
    return (
      <p className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
        Dados insuficientes neste período pra mostrar o gráfico.
      </p>
    )
  }

  const vs = valores.map((p) => p.v)
  const min = Math.min(...vs)
  const max = Math.max(...vs)
  const yMax = max + (max - min) * 0.15 || max + 1
  const yMin = Math.max(0, min - (max - min) * 0.15)
  const range = yMax - yMin || 1

  const W = 100
  const H = 60
  const padX = 4

  const pointX = (i: number) =>
    valores.length === 1 ? W / 2 : padX + (i / (valores.length - 1)) * (W - padX * 2)
  const pointY = (v: number) => H - ((v - yMin) / range) * H + 2

  const linePath = valores
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${pointX(i)} ${pointY(p.v)}`)
    .join(' ')
  const areaPath = `${linePath} L ${pointX(valores.length - 1)} ${H + 2} L ${pointX(0)} ${H + 2} Z`

  const inicio = valores[0]
  const fim = valores[valores.length - 1]
  const delta = fim.v - inicio.v
  const positive =
    delta === 0
      ? 'neutral'
      : config.diminuirEhPositivo
        ? delta < 0
        : delta > 0
  const deltaTone =
    positive === 'neutral'
      ? 'text-slate-500 dark:text-slate-400'
      : positive
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400'

  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between">
        <p className="font-mono">
          <span className="text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
            {config.decimals === 0 ? Math.round(fim.v).toLocaleString('pt-BR') : fim.v.toFixed(config.decimals)}
          </span>
          {config.unit && (
            <span className="ml-1 text-sm text-slate-400 dark:text-slate-500">
              {config.unit}
            </span>
          )}
        </p>
        <p className={`font-mono text-xs font-semibold tabular-nums ${deltaTone}`}>
          {delta > 0 ? '+' : ''}
          {delta.toFixed(config.decimals === 0 ? 0 : 1)}{config.unit ? ' ' + config.unit : ''} desde{' '}
          {new Date(inicio.data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
          })}
        </p>
      </div>

      <div className="mt-4 flex h-32 items-stretch gap-2">
        <div className="flex flex-col justify-between font-mono text-[9px] text-slate-400 dark:text-slate-500 py-0.5">
          <span>{config.decimals === 0 ? Math.round(yMax) : yMax.toFixed(config.decimals)}</span>
          <span>{config.decimals === 0 ? Math.round((yMax + yMin) / 2) : ((yMax + yMin) / 2).toFixed(config.decimals)}</span>
          <span>{config.decimals === 0 ? Math.round(yMin) : yMin.toFixed(config.decimals)}</span>
        </div>

        <div className="relative flex-1">
          <svg
            viewBox={`0 0 ${W} ${H + 4}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <path
              d={areaPath}
              className={config.ringTone}
              fill="currentColor"
              fillOpacity="0.12"
            />
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              className={config.ringTone}
            />
          </svg>
        </div>
      </div>

      <div className="ml-9 mt-1 flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        <span>
          {new Date(inicio.data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
          })}
        </span>
        <span>
          {new Date(fim.data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
          })}
        </span>
      </div>
    </div>
  )
}
