import { useMemo, useState } from 'react'
import { LineChart, Layers, X, type LucideIcon } from 'lucide-react'
import {
  Footprints,
  Bike,
  Droplet,
  Music,
  Zap,
  Dumbbell,
  Sparkles,
  Activity,
  Award,
  Heart,
  MoreHorizontal,
} from 'lucide-react'
import type {
  Activity as ActivitySession,
  ActivityHistoryConfig,
  ActivityType,
  HistoryRangeId,
} from '@/../product/sections/activities/types'
import { SourceBadge } from './SourceBadge'

const TYPE_ICONS: Record<string, LucideIcon> = {
  footprints: Footprints,
  bike: Bike,
  droplet: Droplet,
  music: Music,
  zap: Zap,
  dumbbell: Dumbbell,
  sparkles: Sparkles,
  activity: Activity,
  award: Award,
  heart: Heart,
  'more-horizontal': MoreHorizontal,
}

interface ChartPoint {
  x: number
  y: number
  activity: ActivitySession
}

export interface HistoryFiltersProps {
  activities: ActivitySession[]
  types: ActivityType[]
  history: ActivityHistoryConfig
  revealIndex?: number
  onFilterChange?: (filter: { typeKey: string | null; range: HistoryRangeId }) => void
}

function formatDateTime(iso: string): string {
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

function formatDuration(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}

export function HistoryFilters({
  activities,
  types,
  history,
  revealIndex = 0,
  onFilterChange,
}: HistoryFiltersProps) {
  const [range, setRange] = useState<HistoryRangeId>(history.defaultRange)
  const [typeKey, setTypeKey] = useState<string | null>(history.defaultTypeKey)

  const rangeMeta = history.ranges.find((r) => r.id === range) ?? history.ranges[0]

  const cutoffMs = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - rangeMeta.days)
    return d.getTime()
  }, [rangeMeta])

  // Map type keys to their data within window for the chip list (with hasData state)
  const typesWithData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const a of activities) {
      if (new Date(a.performedAt).getTime() < cutoffMs) continue
      counts.set(a.activityType.key, (counts.get(a.activityType.key) ?? 0) + 1)
    }
    const result = types
      .map((t) => ({ type: t, count: counts.get(t.key) ?? 0 }))
      .filter((row) => row.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
    return result
  }, [activities, types, cutoffMs])

  const filtered = useMemo(() => {
    return activities
      .filter((a) => new Date(a.performedAt).getTime() >= cutoffMs)
      .filter((a) => !typeKey || a.activityType.key === typeKey)
      .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
  }, [activities, cutoffMs, typeKey])

  const handleRange = (r: HistoryRangeId) => {
    setRange(r)
    onFilterChange?.({ typeKey, range: r })
  }
  const handleType = (k: string | null) => {
    setTypeKey(k)
    onFilterChange?.({ typeKey: k, range })
  }

  const activeType = typeKey ? types.find((t) => t.key === typeKey) ?? null : null
  const ActiveIcon = activeType ? TYPE_ICONS[activeType.icon] ?? Activity : Layers
  const activeLabel = activeType?.label ?? 'Todas as atividades'

  const isEmpty = filtered.length === 0

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
                onClick={() => handleRange(r.id)}
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
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Tipo de atividade">
          <button
            role="tab"
            aria-selected={typeKey === null}
            onClick={() => handleType(null)}
            className={chipClass(typeKey === null)}
          >
            <Layers className="w-3.5 h-3.5" />
            Todos
          </button>
          {typesWithData.map(({ type: t }) => {
            const ChipIcon = TYPE_ICONS[t.icon] ?? Activity
            const active = t.key === typeKey
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => handleType(t.key)}
                className={chipClass(active)}
              >
                <ChipIcon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            )
          })}
          {typesWithData.length === 0 && (
            <span className="text-xs text-slate-500 dark:text-slate-400 py-1.5">
              Sem tipos no período selecionado.
            </span>
          )}
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
            <ActiveIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              {activeLabel}
            </div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
              Período: últimos {rangeMeta.days} dias
            </div>
          </div>
        </div>

        {!isEmpty && (
          <>
            <SummaryStats activities={filtered} />
            <EvolutionChart activities={filtered} />
          </>
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
              Nenhuma atividade nos últimos {rangeMeta.days} dias com este filtro.
            </div>
            <button
              type="button"
              onClick={() => handleType(null)}
              className="
                inline-flex items-center gap-1
                px-3 py-1.5 rounded-full
                text-xs font-medium
                text-teal-700 dark:text-teal-300
                hover:bg-teal-500/10 dark:hover:bg-teal-400/10
                transition-colors
              "
            >
              <X className="w-3 h-3" />
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="mt-1 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/40">
                <tr className="text-left">
                  <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    Data
                  </th>
                  <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                    Tipo
                  </th>
                  <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap text-right hidden sm:table-cell">
                    Duração
                  </th>
                  <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap text-right">
                    Pontos
                  </th>
                  <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden md:table-cell">
                    Fonte
                  </th>
                  <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                    Observação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.slice(0, 20).map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap font-mono tabular-nums">
                      {formatDateTime(a.performedAt)}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {a.activityType.label}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 truncate">
                        {a.activityType.categoryLabel}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap font-mono tabular-nums hidden sm:table-cell">
                      {formatDuration(a.durationMinutes)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-sm font-semibold text-teal-700 dark:text-teal-300 tabular-nums whitespace-nowrap">
                      {a.points}
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell">
                      <SourceBadge source={a.source} label={a.sourceLabel} />
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                      {a.notes || <span className="text-slate-400 dark:text-slate-600">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 20 && (
              <div className="px-4 py-2 text-center text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800">
                Exibindo 20 de {filtered.length} atividades
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function SummaryStats({ activities }: { activities: ActivitySession[] }) {
  const totalDuration = activities.reduce((acc, a) => acc + a.durationMinutes, 0)
  const totalPoints = activities.reduce((acc, a) => acc + a.points, 0)
  const totalCalories = activities.reduce(
    (acc, a) => acc + (a.caloriesBurned ?? 0),
    0,
  )
  const avgPoints =
    activities.length > 0 ? Math.round(totalPoints / activities.length) : 0
  const hours = Math.floor(totalDuration / 60)
  const mins = totalDuration % 60
  const durationLabel = hours > 0 ? `${hours}h ${mins}min` : `${mins} min`

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      <Stat label="Sessões" value={String(activities.length)} unit="" />
      <Stat label="Tempo total" value={durationLabel} unit="" />
      <Stat label="Calorias" value={String(totalCalories)} unit="kcal" />
      <Stat
        label="Pontos média"
        value={String(avgPoints)}
        unit="pts"
        highlight
      />
    </div>
  )
}

function Stat({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string
  value: string
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
            font-mono text-base font-semibold leading-none tabular-nums
            ${highlight ? 'text-teal-700 dark:text-teal-300' : 'text-slate-900 dark:text-slate-100'}
          `}
        >
          {value}
        </div>
        {unit && (
          <div className="text-[10px] text-slate-500 dark:text-slate-400">{unit}</div>
        )}
      </div>
    </div>
  )
}

function EvolutionChart({ activities }: { activities: ActivitySession[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const points: ChartPoint[] = useMemo(() => {
    return [...activities]
      .sort((a, b) => new Date(a.performedAt).getTime() - new Date(b.performedAt).getTime())
      .map((a) => ({
        x: new Date(a.performedAt).getTime(),
        y: a.points,
        activity: a,
      }))
  }, [activities])

  if (points.length < 2) {
    if (points.length === 1) {
      return (
        <div
          className="
            flex items-center justify-center
            py-8 rounded-xl
            bg-slate-50/60 dark:bg-slate-800/40
            border border-dashed border-slate-200 dark:border-slate-700
            mb-4
          "
        >
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Uma única sessão no período — gráfico aparece com 2+ atividades.
          </span>
        </div>
      )
    }
    return null
  }

  const width = 600
  const height = 200
  const padX = 16
  const padY = 24

  const minX = points[0].x
  const maxX = points[points.length - 1].x
  const rangeX = maxX - minX || 1
  const yValues = points.map((p) => p.y)
  const minY = Math.min(...yValues, 0)
  const maxY = Math.max(...yValues)
  const rangeY = maxY - minY || 1

  const coords = points.map((p) => ({
    x: padX + ((p.x - minX) / rangeX) * (width - padX * 2),
    y: padY + (1 - (p.y - minY) / rangeY) * (height - padY * 2),
    point: p,
  }))

  const linePath = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(' ')

  const areaPath =
    `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${(height - padY).toFixed(1)} ` +
    `L${coords[0].x.toFixed(1)},${(height - padY).toFixed(1)} Z`

  const active = hoverIdx !== null ? coords[hoverIdx] : null
  const stepHover = (width - padX * 2) / Math.max(1, points.length - 1)

  return (
    <div className="relative mb-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-[200px]"
        role="img"
        aria-label="Gráfico de evolução de pontos por sessão"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="activities-evo-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(20, 184, 166)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(20, 184, 166)" stopOpacity="0" />
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

        <path d={areaPath} fill="url(#activities-evo-fill)" />
        <path
          d={linePath}
          stroke="rgb(20, 184, 166)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {coords.map((c, i) => (
          <g key={c.point.activity.id}>
            <circle
              cx={c.x}
              cy={c.y}
              r={hoverIdx === i ? 5 : 3}
              stroke="rgb(20, 184, 166)"
              strokeWidth="1.5"
              className="fill-white dark:fill-slate-900 transition-[r] duration-150"
            />
            <rect
              x={c.x - stepHover / 2}
              y={0}
              width={Math.max(stepHover, 12)}
              height={height}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
            />
          </g>
        ))}

        {active && (
          <line
            x1={active.x}
            y1={padY}
            x2={active.x}
            y2={height - padY}
            stroke="rgb(20, 184, 166)"
            strokeOpacity="0.4"
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
            text-xs shadow-lg
            whitespace-nowrap
          "
          style={{ left: `${(active.x / width) * 100}%` }}
        >
          <div className="font-medium">{active.point.activity.activityType.label}</div>
          <div className="font-mono tabular-nums">
            {active.point.activity.points} pts ·{' '}
            <span className="opacity-70">{active.point.activity.durationMinutes}min</span>
          </div>
          <div className="text-[10px] opacity-70 font-mono">
            {new Date(active.point.activity.performedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
            })}
          </div>
        </div>
      )}

      <div className="mt-1 flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono px-1">
        <span>
          {new Date(points[0].x).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
          })}
        </span>
        <span>
          {new Date(points[points.length - 1].x).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
          })}
        </span>
      </div>
    </div>
  )
}

function chipClass(active: boolean): string {
  return `
    shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
    text-xs font-medium transition-colors border
    ${
      active
        ? 'bg-teal-600 text-white border-teal-600 dark:bg-teal-500 dark:text-slate-950 dark:border-teal-500'
        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
    }
  `
}
