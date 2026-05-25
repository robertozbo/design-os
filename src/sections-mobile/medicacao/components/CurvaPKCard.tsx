import { useMemo, useState } from 'react'
import { HelpCircle } from 'lucide-react'
import {
  STATUS_PK_LABEL,
  type CurvaPK,
  type MedicacaoAtiva,
  type PeriodoPK,
  type StatusPK,
} from '@/../product-mobile/sections/medicacao/types'

interface Props {
  curva: CurvaPK
  medicacao: MedicacaoAtiva
}

const PERIODOS: PeriodoPK[] = ['14D', '30D', '90D']

const STATUS_COLOR: Record<StatusPK, string> = {
  no_pico: 'text-emerald-300',
  subindo: 'text-teal-300',
  caindo: 'text-amber-300',
  vale: 'text-rose-300',
}

const STATUS_HINT: Record<StatusPK, string> = {
  no_pico: 'Saciedade alta esperada',
  subindo: 'Efeito aumentando',
  caindo: 'Efeito reduzindo',
  vale: 'Próximo da próxima dose',
}

// SVG viewBox
const W = 320
const H = 120
const PADDING = { top: 12, right: 14, bottom: 22, left: 14 }
const PLOT_W = W - PADDING.left - PADDING.right
const PLOT_H = H - PADDING.top - PADDING.bottom

function formatTickLabel(iso: string): string {
  // "2026-05-15" → "15/5"
  const [, m, d] = iso.split('-')
  return `${d}/${Number(m)}`
}

export function CurvaPKCard({ curva, medicacao }: Props) {
  const [periodo, setPeriodo] = useState<PeriodoPK>('14D')

  // V1: data.json só fornece 14D. Filtra de qualquer forma se houver mais pontos no futuro.
  const pontos = useMemo(() => {
    const dias = periodo === '14D' ? 14 : periodo === '30D' ? 30 : 90
    return curva.pontos.slice(-dias)
  }, [curva.pontos, periodo])

  if (pontos.length === 0) return null

  const n = pontos.length
  const xs = pontos.map((_, i) => PADDING.left + (i * PLOT_W) / Math.max(1, n - 1))
  const ys = pontos.map(
    (p) => PADDING.top + PLOT_H * (1 - Math.max(0, Math.min(1, p.nivel))),
  )

  // Construir paths separados pra sólido (passado) e tracejado (projeção)
  let solidPath = ''
  let dashedPath = ''
  let crossoverIndex = -1
  pontos.forEach((p, i) => {
    if (!p.projetado) {
      solidPath += i === 0 ? `M${xs[i]},${ys[i]}` : ` L${xs[i]},${ys[i]}`
    } else {
      if (crossoverIndex === -1) {
        crossoverIndex = i
        // garante continuidade: tracejado começa no último sólido
        dashedPath = `M${xs[i - 1]},${ys[i - 1]} L${xs[i]},${ys[i]}`
      } else {
        dashedPath += ` L${xs[i]},${ys[i]}`
      }
    }
  })

  // Área sob curva sólida — preenchimento sutil
  let areaPath = ''
  pontos.forEach((p, i) => {
    if (p.projetado) return
    areaPath += i === 0 ? `M${xs[i]},${ys[i]}` : ` L${xs[i]},${ys[i]}`
  })
  const lastSolidIdx = crossoverIndex === -1 ? n - 1 : crossoverIndex - 1
  if (lastSolidIdx >= 0) {
    areaPath += ` L${xs[lastSolidIdx]},${PADDING.top + PLOT_H} L${xs[0]},${PADDING.top + PLOT_H} Z`
  }

  // Marker "Hoje" = último ponto sólido
  const hojeX = xs[lastSolidIdx]
  const hojeY = ys[lastSolidIdx]

  // Ticks de data: primeiro, meio, último sólido
  const tickIndices = [0, Math.floor(lastSolidIdx / 2), lastSolidIdx]

  return (
    <div className="mx-4 mb-4 rounded-2xl bg-slate-900 border border-slate-800 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
            Nível estimado
          </div>
          <div className="mt-0.5 text-slate-100 text-[15px] font-semibold">
            {medicacao.nome}{' '}
            <span className="font-mono text-slate-400 text-[13px]">
              {medicacao.dose}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`font-mono text-[15px] font-bold tabular-nums ${STATUS_COLOR[curva.statusHoje]}`}
          >
            {STATUS_PK_LABEL[curva.statusHoje]}
          </div>
          <div className="text-slate-500 text-[11px]">
            {STATUS_HINT[curva.statusHoje]}
          </div>
        </div>
      </div>

      {/* Tabs período */}
      <div className="flex gap-1 mb-3">
        {PERIODOS.map((p) => {
          const active = p === periodo
          return (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono tabular-nums transition-all ${
                active
                  ? 'bg-slate-700 text-slate-100'
                  : 'bg-slate-800/60 text-slate-500 active:scale-[0.97]'
              }`}
            >
              {p}
            </button>
          )
        })}
      </div>

      {/* Gráfico SVG */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        {/* Grid lines horizontais sutis */}
        {[0.25, 0.5, 0.75].map((frac) => {
          const y = PADDING.top + PLOT_H * frac
          return (
            <line
              key={frac}
              x1={PADDING.left}
              x2={W - PADDING.right}
              y1={y}
              y2={y}
              stroke="rgb(30 41 59)" // slate-800
              strokeWidth={1}
            />
          )
        })}

        {/* Linha vertical "Hoje" tracejada */}
        {lastSolidIdx >= 0 && (
          <line
            x1={hojeX}
            x2={hojeX}
            y1={PADDING.top}
            y2={PADDING.top + PLOT_H}
            stroke="rgb(71 85 105)" // slate-600
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        )}

        {/* Área sob curva */}
        {areaPath && (
          <path d={areaPath} fill="rgb(20 184 166 / 0.08)" stroke="none" />
        )}

        {/* Linha sólida (histórico) */}
        {solidPath && (
          <path
            d={solidPath}
            stroke="rgb(94 234 212)" // teal-300
            strokeWidth={2}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Linha tracejada (projeção) */}
        {dashedPath && (
          <path
            d={dashedPath}
            stroke="rgb(94 234 212)"
            strokeWidth={2}
            fill="none"
            strokeDasharray="4 3"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.55}
          />
        )}

        {/* Marker "Hoje" */}
        {lastSolidIdx >= 0 && (
          <>
            <circle cx={hojeX} cy={hojeY} r={4} fill="rgb(20 184 166)" />
            <circle
              cx={hojeX}
              cy={hojeY}
              r={7}
              fill="none"
              stroke="rgb(20 184 166)"
              strokeOpacity={0.35}
              strokeWidth={2}
            />
          </>
        )}

        {/* Ticks de data */}
        {tickIndices.map((i) => {
          if (i < 0 || i >= pontos.length) return null
          return (
            <text
              key={i}
              x={xs[i]}
              y={H - 6}
              textAnchor="middle"
              fontSize={9}
              fontFamily="ui-monospace, monospace"
              fill="rgb(100 116 139)" // slate-500
            >
              {formatTickLabel(pontos[i].data)}
            </text>
          )
        })}

        {/* Label "Hoje" */}
        {lastSolidIdx >= 0 && lastSolidIdx !== tickIndices[2] && (
          <text
            x={hojeX}
            y={H - 6}
            textAnchor="middle"
            fontSize={9}
            fontFamily="ui-monospace, monospace"
            fill="rgb(94 234 212)"
          >
            hoje
          </text>
        )}
      </svg>

      {/* Disclaimer */}
      <div className="mt-2 flex items-start gap-1.5">
        <HelpCircle size={11} className="text-slate-600 mt-px shrink-0" />
        <p className="text-slate-500 text-[10.5px] leading-snug">
          Estimativa baseada em farmacocinética populacional. Não substitui medição clínica.
        </p>
      </div>
    </div>
  )
}
