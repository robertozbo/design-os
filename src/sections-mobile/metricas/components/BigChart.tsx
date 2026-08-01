import { useId, useState } from 'react'
import type { SeriePonto, FaixaNormal } from '@/../product-mobile/sections/metricas/types'
import { formatNum } from '../_detalheData'

interface BigChartProps {
  serie: SeriePonto[]
  color: string // hex
  unidade: string
  faixaNormal?: FaixaNormal
  height?: number
}

const VB_W = 320
const PAD_L = 8
const PAD_R = 8
const PAD_T = 14
const PAD_B = 22

export function BigChart({ serie, color, unidade, faixaNormal, height = 200 }: BigChartProps) {
  const gid = useId().replace(/:/g, '')
  const [hover, setHover] = useState<number | null>(null)

  if (serie.length < 2) {
    return (
      <div
        className="flex items-center justify-center text-slate-600 text-[12px] font-mono"
        style={{ height }}
      >
        Sem dados suficientes pra exibir o gráfico
      </div>
    )
  }

  const vals = serie.map((p) => p.v)
  let lo = Math.min(...vals)
  let hi = Math.max(...vals)
  // inclui a faixa normal no domínio pra ela aparecer no gráfico
  if (faixaNormal?.min != null) lo = Math.min(lo, faixaNormal.min)
  if (faixaNormal?.max != null) hi = Math.max(hi, faixaNormal.max)
  const span = hi - lo || 1
  // padding vertical de 8% no domínio
  const dLo = lo - span * 0.08
  const dHi = hi + span * 0.08
  const dSpan = dHi - dLo || 1

  const plotW = VB_W - PAD_L - PAD_R
  const plotH = height - PAD_T - PAD_B
  const stepX = plotW / (serie.length - 1)

  const xAt = (i: number) => PAD_L + i * stepX
  const yAt = (v: number) => PAD_T + plotH - ((v - dLo) / dSpan) * plotH

  const linePts = serie.map((p, i) => `${xAt(i)},${yAt(p.v)}`).join(' ')
  const areaPts = `${PAD_L},${PAD_T + plotH} ${linePts} ${xAt(serie.length - 1)},${PAD_T + plotH}`

  // faixa normal (band horizontal)
  const bandTop = faixaNormal?.max != null ? yAt(faixaNormal.max) : PAD_T
  const bandBottom = faixaNormal?.min != null ? yAt(faixaNormal.min) : PAD_T + plotH
  const hasBand = faixaNormal && (faixaNormal.min != null || faixaNormal.max != null)

  // rótulos do eixo X (primeiro, meio, último)
  const xTicks = [0, Math.floor((serie.length - 1) / 2), serie.length - 1]

  const active = hover != null ? serie[hover] : null

  function handlePointer(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * VB_W
    const i = Math.round((x - PAD_L) / stepX)
    setHover(Math.max(0, Math.min(serie.length - 1, i)))
  }

  return (
    <div className="relative">
      {/* Tooltip */}
      {active && (
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-center shadow-lg pointer-events-none"
        >
          <div className="font-mono font-bold text-slate-50 text-[13px] tabular-nums leading-none">
            {formatNum(active.v)}
            {unidade && <span className="text-slate-400 text-[10px] ml-0.5">{unidade}</span>}
          </div>
          <div className="text-slate-400 font-mono text-[9.5px] mt-0.5">{active.rotulo}</div>
        </div>
      )}

      <svg
        viewBox={`0 0 ${VB_W} ${height}`}
        width="100%"
        height={height}
        className="touch-none select-none"
        onPointerDown={handlePointer}
        onPointerMove={(e) => hover != null && handlePointer(e)}
        onPointerUp={() => setHover(null)}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`area-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Faixa normal */}
        {hasBand && (
          <rect
            x={PAD_L}
            y={bandTop}
            width={plotW}
            height={Math.max(0, bandBottom - bandTop)}
            fill="#10b981"
            fillOpacity="0.08"
          />
        )}
        {hasBand && faixaNormal?.max != null && (
          <line x1={PAD_L} y1={bandTop} x2={PAD_L + plotW} y2={bandTop} stroke="#10b981" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 3" />
        )}
        {hasBand && faixaNormal?.min != null && (
          <line x1={PAD_L} y1={bandBottom} x2={PAD_L + plotW} y2={bandBottom} stroke="#10b981" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 3" />
        )}

        {/* Área + linha */}
        <polygon points={areaPts} fill={`url(#area-${gid})`} />
        <polyline
          points={linePts}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Último ponto destacado */}
        <circle cx={xAt(serie.length - 1)} cy={yAt(serie[serie.length - 1].v)} r="3" fill={color} stroke="#0f172a" strokeWidth="1.5" />

        {/* Guia + ponto do hover */}
        {active && hover != null && (
          <>
            <line x1={xAt(hover)} y1={PAD_T} x2={xAt(hover)} y2={PAD_T + plotH} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
            <circle cx={xAt(hover)} cy={yAt(active.v)} r="4" fill={color} stroke="#0f172a" strokeWidth="1.5" />
          </>
        )}

        {/* Rótulos eixo X */}
        {xTicks.map((i, k) => (
          <text
            key={i}
            x={xAt(i)}
            y={height - 6}
            textAnchor={k === 0 ? 'start' : k === xTicks.length - 1 ? 'end' : 'middle'}
            className="font-mono"
            fontSize="9"
            fill="#64748b"
          >
            {serie[i].rotulo}
          </text>
        ))}
      </svg>
    </div>
  )
}
