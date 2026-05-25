import { useMemo, useState } from 'react'
import type {
  Avaliacao,
  JanelaGrafico,
  MedidaId,
  MedidaSerieOpcao,
  MetaMedida,
} from '@/../product/sections/avalia-o-antropom-trica/types'
import { formatDateShort, formatNumber, getMedidaValue } from './utils'

interface EvolutionChartProps {
  avaliacoes: Avaliacao[]
  medidasSerieOpcoes: MedidaSerieOpcao[]
  metas: MetaMedida[]
  medidaGrafico: MedidaId
  janelaGrafico: JanelaGrafico
  onMedidaGraficoChange: (m: MedidaId) => void
  onJanelaGraficoChange: (j: JanelaGrafico) => void
}

const JANELA_OPCOES: { value: JanelaGrafico; label: string; days: number | null }[] = [
  { value: '90d', label: '90 dias', days: 90 },
  { value: '6m', label: '6 meses', days: 180 },
  { value: '1a', label: '1 ano', days: 365 },
  { value: 'tudo', label: 'Tudo', days: null },
]

export function EvolutionChart({
  avaliacoes,
  medidasSerieOpcoes,
  metas,
  medidaGrafico,
  janelaGrafico,
  onMedidaGraficoChange,
  onJanelaGraficoChange,
}: EvolutionChartProps) {
  const opcao = medidasSerieOpcoes.find((o) => o.value === medidaGrafico) ?? medidasSerieOpcoes[0]
  const meta = metas.find((m) => m.medida === medidaGrafico)

  const points = useMemo(() => {
    const cutoff = JANELA_OPCOES.find((j) => j.value === janelaGrafico)?.days ?? null
    const cutoffDate =
      cutoff === null ? null : new Date(Date.now() - cutoff * 86_400_000)
    return avaliacoes
      .filter((a) => (cutoffDate ? new Date(a.dataIso) >= cutoffDate : true))
      .map((a) => ({
        dateIso: a.dataIso,
        date: new Date(a.dataIso).getTime(),
        value: getMedidaValue(a, medidaGrafico),
      }))
      .filter((p): p is { dateIso: string; date: number; value: number } => p.value !== null)
      .sort((a, b) => a.date - b.date)
  }, [avaliacoes, medidaGrafico, janelaGrafico])

  const allValues = points.map((p) => p.value)
  if (meta) allValues.push(meta.valor)

  const minVal = allValues.length ? Math.min(...allValues) : 0
  const maxVal = allValues.length ? Math.max(...allValues) : 1
  const valueRange = Math.max(0.1, maxVal - minVal)
  const padded = valueRange * 0.15
  const yMin = minVal - padded
  const yMax = maxVal + padded

  const minDate = points.length ? points[0].date : Date.now() - 90 * 86_400_000
  const maxDate = points.length ? points[points.length - 1].date : Date.now()
  const dateRange = Math.max(1, maxDate - minDate)

  // SVG geometry
  const W = 720
  const H = 200
  const padL = 38
  const padR = 16
  const padT = 12
  const padB = 26
  const innerW = W - padL - padR
  const innerH = H - padT - padB

  function xAt(date: number): number {
    return padL + ((date - minDate) / dateRange) * innerW
  }
  function yAt(value: number): number {
    return padT + (1 - (value - yMin) / (yMax - yMin)) * innerH
  }

  const path =
    points.length > 0
      ? `M ${points.map((p) => `${xAt(p.date)},${yAt(p.value)}`).join(' L ')}`
      : ''
  const areaPath =
    points.length > 0
      ? `${path} L ${xAt(points[points.length - 1].date)},${padT + innerH} L ${xAt(points[0].date)},${padT + innerH} Z`
      : ''

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const steps = 4
    const tickStep = (yMax - yMin) / steps
    return Array.from({ length: steps + 1 }, (_, i) => yMin + i * tickStep)
  }, [yMax, yMin])

  // Hover state
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const hovered = hoveredIdx !== null ? points[hoveredIdx] : null

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/40">
      {/* Header with toggles */}
      <header className="flex flex-col gap-3 border-b border-slate-200/80 px-5 py-4 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Evolução · {opcao.label}
            </h2>
            {meta && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
                Meta {formatNumber(meta.valor)} {meta.unidade}
              </span>
            )}
          </div>

          {/* Time window pills */}
          <div className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            {JANELA_OPCOES.map((j) => {
              const active = janelaGrafico === j.value
              return (
                <button
                  key={j.value}
                  type="button"
                  onClick={() => onJanelaGraficoChange(j.value)}
                  className={`
                    rounded-md px-2.5 py-1 text-[11px] font-semibold transition
                    ${active
                      ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}
                  `}
                >
                  {j.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Medida pills */}
        <div className="flex flex-wrap gap-1.5">
          {medidasSerieOpcoes.map((m) => {
            const active = medidaGrafico === m.value
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => onMedidaGraficoChange(m.value)}
                className={`
                  inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition
                  ${active
                    ? 'bg-teal-600 text-white dark:bg-teal-500'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}
                `}
              >
                {m.label}
                <span className="font-mono text-[9px] opacity-70">{m.unidade}</span>
              </button>
            )
          })}
        </div>
      </header>

      {/* SVG chart */}
      <div className="relative px-5 py-4">
        {points.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-xs text-slate-400">
            Sem dados nesta janela.
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block w-full"
            preserveAspectRatio="none"
            onMouseLeave={() => setHoveredIdx(null)}
            role="img"
            aria-label={`Gráfico de evolução de ${opcao.label}`}
          >
            <defs>
              <linearGradient id="aa-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(20 184 166 / 0.35)" />
                <stop offset="100%" stopColor="rgb(20 184 166 / 0)" />
              </linearGradient>
            </defs>

            {/* Y grid + ticks */}
            {yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={padL}
                  x2={W - padR}
                  y1={yAt(tick)}
                  y2={yAt(tick)}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeDasharray="2 4"
                />
                <text
                  x={padL - 4}
                  y={yAt(tick) + 3}
                  textAnchor="end"
                  className="fill-slate-400 font-mono dark:fill-slate-500"
                  fontSize="9"
                >
                  {formatNumber(tick, opcao.value === 'rcq' ? 2 : 0)}
                </text>
              </g>
            ))}

            {/* Meta dashed line */}
            {meta && meta.valor >= yMin && meta.valor <= yMax && (
              <g>
                <line
                  x1={padL}
                  x2={W - padR}
                  y1={yAt(meta.valor)}
                  y2={yAt(meta.valor)}
                  className="stroke-emerald-500"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
                <text
                  x={W - padR - 4}
                  y={yAt(meta.valor) - 4}
                  textAnchor="end"
                  className="fill-emerald-600 font-mono dark:fill-emerald-400"
                  fontSize="9"
                >
                  Meta {formatNumber(meta.valor, 0)}
                </text>
              </g>
            )}

            {/* Area */}
            {areaPath && (
              <path d={areaPath} fill="url(#aa-gradient)" />
            )}

            {/* Line */}
            {path && (
              <path
                d={path}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="stroke-teal-500"
              />
            )}

            {/* Points */}
            {points.map((p, i) => {
              const cx = xAt(p.date)
              const cy = yAt(p.value)
              const isHovered = hoveredIdx === i
              return (
                <g key={i}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 5 : 3.5}
                    className={`
                      fill-white stroke-teal-500 transition-all
                      dark:fill-slate-900
                    `}
                    strokeWidth={isHovered ? 2.5 : 1.75}
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={14}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(i)}
                  />
                </g>
              )
            })}

            {/* X axis labels (start, middle, end) */}
            {points.length > 0 && (
              <>
                <text
                  x={xAt(points[0].date)}
                  y={H - 8}
                  textAnchor="start"
                  className="fill-slate-400 font-mono dark:fill-slate-500"
                  fontSize="9"
                >
                  {formatDateShort(points[0].dateIso)}
                </text>
                <text
                  x={xAt(points[points.length - 1].date)}
                  y={H - 8}
                  textAnchor="end"
                  className="fill-slate-400 font-mono dark:fill-slate-500"
                  fontSize="9"
                >
                  {formatDateShort(points[points.length - 1].dateIso)}
                </text>
              </>
            )}
          </svg>
        )}

        {/* Hover tooltip */}
        {hovered && (
          <div
            className="
              pointer-events-none absolute -translate-x-1/2 -translate-y-full
              rounded-lg bg-slate-900 px-2 py-1.5 text-[11px] shadow-lg dark:bg-slate-950
            "
            style={{
              left: `${(xAt(hovered.date) / W) * 100}%`,
              top: `calc(${(yAt(hovered.value) / H) * 100}% - 4px)`,
            }}
          >
            <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
              {formatDateShort(hovered.dateIso)}
            </p>
            <p className="font-semibold text-white tabular-nums">
              {formatNumber(hovered.value, opcao.value === 'rcq' ? 2 : 1)}{' '}
              <span className="text-[9px] text-slate-300">{opcao.unidade}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
