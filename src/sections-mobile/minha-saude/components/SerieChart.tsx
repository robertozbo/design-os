import type { EvolucaoPonto } from '@/../product-mobile/sections/minha-saude/types'
import { STATUS_VISUAL, statusFromScore, formatDateBR } from './_shared'

interface SerieChartProps {
  pontos: EvolucaoPonto[]
  /** Largura em px (assumida pelo SVG) */
  width?: number
  /** Altura em px */
  height?: number
}

export function SerieChart({ pontos, width = 300, height = 80 }: SerieChartProps) {
  const validos = pontos.filter((p) => p.score !== null) as { data: string; score: number }[]

  if (validos.length === 0) {
    return (
      <div
        className="rounded-xl bg-slate-800/40 flex items-center justify-center text-slate-600 text-[10.5px]"
        style={{ width, height }}
      >
        sem dados
      </div>
    )
  }

  const padX = 8
  const padY = 12
  const innerW = width - padX * 2
  const innerH = height - padY * 2

  // Y axis fixo 0-100
  const yMin = 0
  const yMax = 100

  const xStep = validos.length > 1 ? innerW / (validos.length - 1) : 0
  const yScale = (v: number) => padY + innerH - ((v - yMin) / (yMax - yMin)) * innerH

  const linhaPath = validos
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${padX + i * xStep} ${yScale(p.score)}`)
    .join(' ')

  // Área abaixo da linha (gradient fill)
  const areaPath = `${linhaPath} L ${padX + (validos.length - 1) * xStep} ${padY + innerH} L ${padX} ${padY + innerH} Z`

  const ultimoPonto = validos[validos.length - 1]
  const status = statusFromScore(ultimoPonto.score)
  const visual = STATUS_VISUAL[status]
  const gradientId = `grad-${visual.hex.replace('#', '')}`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={visual.hex} stopOpacity="0.25" />
          <stop offset="100%" stopColor={visual.hex} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Linhas guia 50 e 80 (faixas de status) */}
      <line
        x1={padX}
        x2={width - padX}
        y1={yScale(50)}
        y2={yScale(50)}
        className="stroke-slate-800"
        strokeDasharray="2 3"
        strokeWidth={1}
      />
      <line
        x1={padX}
        x2={width - padX}
        y1={yScale(85)}
        y2={yScale(85)}
        className="stroke-slate-800"
        strokeDasharray="2 3"
        strokeWidth={1}
      />

      {/* Área */}
      <path d={areaPath} fill={`url(#${gradientId})`} />

      {/* Linha */}
      <path
        d={linhaPath}
        fill="none"
        stroke={visual.hex}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pontos */}
      {validos.map((p, i) => {
        const cx = padX + i * xStep
        const cy = yScale(p.score)
        const isLast = i === validos.length - 1
        return (
          <g key={p.data}>
            <circle
              cx={cx}
              cy={cy}
              r={isLast ? 4 : 2.5}
              fill={visual.hex}
              stroke="#020617"
              strokeWidth={isLast ? 2 : 1}
            />
            {isLast && (
              <text
                x={cx}
                y={cy - 8}
                textAnchor="end"
                className="fill-slate-100 font-mono"
                fontSize={10}
                fontWeight={600}
              >
                {p.score}
              </text>
            )}
          </g>
        )
      })}

      {/* Labels do eixo X (primeiro e último) */}
      {validos.length > 1 && (
        <>
          <text
            x={padX}
            y={height - 1}
            className="fill-slate-600 font-mono"
            fontSize={9}
          >
            {formatDateBR(validos[0].data).slice(0, 5)}
          </text>
          <text
            x={width - padX}
            y={height - 1}
            textAnchor="end"
            className="fill-slate-600 font-mono"
            fontSize={9}
          >
            {formatDateBR(validos[validos.length - 1].data).slice(0, 5)}
          </text>
        </>
      )}
    </svg>
  )
}
