import { useMemo, useState } from 'react'
import {
  Heart,
  HeartPulse,
  Moon,
  Footprints,
  Activity,
  Waves,
  Scale,
  Droplet,
  LineChart,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type {
  HistoryRangeId,
  MetricHistory,
  MetricType,
  HistoryReading,
} from '@/../product/sections/metrics/types'

export interface HistoryEvolutionProps {
  history: MetricHistory
  revealIndex?: number
  onFilterChange?: (filter: { type: MetricType; range: HistoryRangeId }) => void
}

const TYPE_META: Record<MetricType, { label: string; unit: string; icon: ComponentType<{ className?: string }> }> = {
  heartRate: { label: 'Frequência cardíaca', unit: 'bpm', icon: Heart },
  sleep: { label: 'Sono', unit: 'h', icon: Moon },
  steps: { label: 'Passos', unit: 'passos', icon: Footprints },
  spo2: { label: 'SpO2', unit: '%', icon: Activity },
  hrv: { label: 'HRV', unit: 'ms', icon: Waves },
  weight: { label: 'Peso', unit: 'kg', icon: Scale },
  bloodPressure: { label: 'Pressão arterial', unit: 'mmHg', icon: HeartPulse },
  glucose: { label: 'Glicemia', unit: 'mg/dL', icon: Droplet },
}

function toNumber(v: number | string): number | null {
  if (typeof v === 'number') return v
  if (typeof v === 'string' && v.includes('/')) {
    const [sys] = v.split('/')
    const n = Number(sys)
    return Number.isFinite(n) ? n : null
  }
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function formatShortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
  } catch {
    return iso
  }
}

function formatLongDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function HistoryEvolution({
  history,
  revealIndex = 0,
  onFilterChange,
}: HistoryEvolutionProps) {
  const availableTypes = useMemo(
    () => (Object.keys(history.byType) as MetricType[]),
    [history.byType],
  )

  const [type, setType] = useState<MetricType>(history.defaultType)
  const [range, setRange] = useState<HistoryRangeId>(history.defaultRange)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const handleSetType = (next: MetricType) => {
    setType(next)
    onFilterChange?.({ type: next, range })
  }
  const handleSetRange = (next: HistoryRangeId) => {
    setRange(next)
    onFilterChange?.({ type, range: next })
  }

  const rangeMeta = history.ranges.find((r) => r.id === range) ?? history.ranges[0]
  const cutoff = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - rangeMeta.days)
    return d.getTime()
  }, [rangeMeta])

  const readings = useMemo(() => {
    const all = history.byType[type] ?? []
    return all
      .filter((r) => new Date(r.t).getTime() >= cutoff)
      .sort((a, b) => new Date(a.t).getTime() - new Date(b.t).getTime())
  }, [history.byType, type, cutoff])

  const stats = useMemo(() => {
    const nums = readings.map((r) => toNumber(r.v)).filter((n): n is number => n !== null)
    if (nums.length === 0) return null
    const min = Math.min(...nums)
    const max = Math.max(...nums)
    const avg = nums.reduce((acc, n) => acc + n, 0) / nums.length
    return { min, max, avg, count: nums.length }
  }, [readings])

  const meta = TYPE_META[type]
  const Icon = meta?.icon ?? Activity
  const isEmpty = readings.length === 0

  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        backdrop-blur-[2px]
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
      "
    >
      <header className="px-5 pt-5 pb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Histórico & Evolução
            </span>
          </div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Acompanhe a tendência ao longo do tempo
          </h3>
        </div>

        <div
          className="
            inline-flex items-center gap-0.5 p-1 self-start lg:self-auto
            rounded-full
            bg-slate-100/80 dark:bg-slate-800/60
            border border-slate-200 dark:border-slate-700/60
          "
          role="tablist"
          aria-label="Período do histórico"
        >
          {history.ranges.map((r) => {
            const active = r.id === range
            return (
              <button
                key={r.id}
                role="tab"
                aria-selected={active}
                onClick={() => handleSetRange(r.id)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${
                    active
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }
                `}
              >
                {r.label}
              </button>
            )
          })}
        </div>
      </header>

      <div className="px-5 pb-2">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Tipo de métrica">
          {availableTypes.map((t) => {
            const m = TYPE_META[t]
            const active = t === type
            const ChipIcon = m?.icon ?? Activity
            const hasData = (history.byType[t] ?? []).length > 0
            return (
              <button
                key={t}
                role="tab"
                aria-selected={active}
                disabled={!hasData}
                onClick={() => handleSetType(t)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  text-xs font-medium transition-colors border
                  ${
                    active
                      ? 'bg-teal-600 text-white border-teal-600 dark:bg-teal-500 dark:text-slate-950 dark:border-teal-500'
                      : hasData
                        ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        : 'bg-slate-50 dark:bg-slate-900/60 text-slate-400 dark:text-slate-600 border-slate-200/60 dark:border-slate-800 cursor-not-allowed'
                  }
                `}
              >
                <ChipIcon className="w-3.5 h-3.5" />
                {m?.label ?? t}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-5 pt-3 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="
              shrink-0 grid place-items-center w-10 h-10 rounded-xl
              bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300
            "
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              {meta.label}
            </div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
              Período: últimos {rangeMeta.days} dias
            </div>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Stat label="Mínimo" value={stats.min} unit={meta.unit} />
            <Stat label="Média" value={Number(stats.avg.toFixed(1))} unit={meta.unit} highlight />
            <Stat label="Máximo" value={stats.max} unit={meta.unit} />
          </div>
        )}

        {isEmpty ? (
          <div
            className="
              flex flex-col items-center justify-center text-center gap-3
              py-10 px-4
              rounded-xl
              bg-slate-50/60 dark:bg-slate-800/40
              border border-dashed border-slate-200 dark:border-slate-700
            "
          >
            <div className="grid place-items-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
              <LineChart className="w-5 h-5" />
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Nenhuma leitura para <span className="font-medium">{meta.label}</span> nos últimos{' '}
              {rangeMeta.days} dias.
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Mude o período ou registre uma nova medida no card acima.
            </div>
          </div>
        ) : (
          <>
            <BigChart
              readings={readings}
              unit={meta.unit}
              hoverIdx={hoverIdx}
              onHover={setHoverIdx}
            />
            <ReadingsTable readings={readings} unit={meta.unit} />
          </>
        )}
      </div>
    </section>
  )
}

function Stat({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string
  value: number
  unit: string
  highlight?: boolean
}) {
  return (
    <div
      className={`
        rounded-xl px-3 py-2.5 border
        ${
          highlight
            ? 'bg-teal-500/5 dark:bg-teal-400/5 border-teal-500/20 dark:border-teal-400/20'
            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
        }
      `}
    >
      <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <div
          className={`
            font-mono text-lg font-semibold leading-none tabular-nums
            ${highlight ? 'text-teal-700 dark:text-teal-300' : 'text-slate-900 dark:text-slate-100'}
          `}
        >
          {value}
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400">{unit}</div>
      </div>
    </div>
  )
}

function BigChart({
  readings,
  unit,
  hoverIdx,
  onHover,
}: {
  readings: HistoryReading[]
  unit: string
  hoverIdx: number | null
  onHover: (idx: number | null) => void
}) {
  const width = 600
  const height = 200
  const padX = 16
  const padY = 24

  const numericPoints = readings
    .map((r) => toNumber(r.v))
    .map((v, i) => ({ v, i, raw: readings[i] }))
    .filter((p): p is { v: number; i: number; raw: HistoryReading } => p.v !== null)

  if (numericPoints.length < 2) return null

  const values = numericPoints.map((p) => p.v)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = (width - padX * 2) / (numericPoints.length - 1)

  const coords = numericPoints.map((p, i) => ({
    x: padX + i * stepX,
    y: padY + (1 - (p.v - min) / range) * (height - padY * 2),
    point: p,
  }))

  const linePath = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(' ')

  const areaPath =
    `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${(height - padY).toFixed(1)} ` +
    `L${coords[0].x.toFixed(1)},${(height - padY).toFixed(1)} Z`

  const active = hoverIdx !== null ? coords[hoverIdx] : null

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-[200px]"
        role="img"
        aria-label="Gráfico de evolução"
        onMouseLeave={() => onHover(null)}
      >
        <defs>
          <linearGradient id="evo-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(20 184 166)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(20 184 166)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={padX}
            y1={padY + f * (height - padY * 2)}
            x2={width - padX}
            y2={padY + f * (height - padY * 2)}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
        ))}

        <path d={areaPath} fill="url(#evo-fill)" />
        <path
          d={linePath}
          className="stroke-teal-500 dark:stroke-teal-400"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {coords.map((c, i) => (
          <g key={c.point.raw.id}>
            <circle
              cx={c.x}
              cy={c.y}
              r={hoverIdx === i ? 5 : 3}
              className={`
                stroke-teal-500 dark:stroke-teal-400 fill-white dark:fill-slate-900
                transition-[r] duration-150
              `}
              strokeWidth="1.5"
            />
            <rect
              x={c.x - stepX / 2}
              y={0}
              width={Math.max(stepX, 12)}
              height={height}
              fill="transparent"
              onMouseEnter={() => onHover(i)}
            />
          </g>
        ))}

        {active && (
          <line
            x1={active.x}
            y1={padY}
            x2={active.x}
            y2={height - padY}
            className="stroke-teal-500/40 dark:stroke-teal-400/40"
            strokeWidth="1"
          />
        )}
      </svg>

      {active && (
        <div
          className="
            pointer-events-none absolute -translate-x-1/2 -top-2
            px-2.5 py-1.5 rounded-lg
            bg-slate-900 dark:bg-slate-100
            text-white dark:text-slate-900
            text-xs font-mono shadow-lg
            whitespace-nowrap
          "
          style={{ left: `${(active.x / width) * 100}%` }}
        >
          <div className="font-semibold tabular-nums">
            {active.point.raw.v} <span className="opacity-60 font-normal">{unit}</span>
          </div>
          <div className="text-[10px] opacity-70">{formatShortDate(active.point.raw.t)}</div>
        </div>
      )}

      <div className="mt-1 flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono px-1">
        <span>{formatShortDate(readings[0].t)}</span>
        <span>{formatShortDate(readings[readings.length - 1].t)}</span>
      </div>
    </div>
  )
}

function ReadingsTable({
  readings,
  unit,
}: {
  readings: HistoryReading[]
  unit: string
}) {
  const sorted = [...readings].sort(
    (a, b) => new Date(b.t).getTime() - new Date(a.t).getTime(),
  )
  const limited = sorted.slice(0, 20)

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/40">
          <tr className="text-left">
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Data
            </th>
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 text-right">
              Valor
            </th>
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 hidden sm:table-cell">
              Fonte
            </th>
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 hidden md:table-cell">
              Observação
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {limited.map((r) => (
            <tr
              key={r.id}
              className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td className="px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap font-mono tabular-nums">
                {formatLongDate(r.t)}
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums whitespace-nowrap">
                {r.v}{' '}
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                  {unit}
                </span>
              </td>
              <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 hidden sm:table-cell whitespace-nowrap">
                {r.source}
              </td>
              <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 hidden md:table-cell">
                {r.note || <span className="text-slate-400 dark:text-slate-600">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length > limited.length && (
        <div className="px-4 py-2 text-center text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800">
          Exibindo {limited.length} de {sorted.length} leituras
        </div>
      )}
    </div>
  )
}
