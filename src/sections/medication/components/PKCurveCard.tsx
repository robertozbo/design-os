import { useMemo, useState } from 'react'
import { HelpCircle } from 'lucide-react'
import {
  STATUS_PK_LABEL,
  type CurvaPK,
  type MedicacaoAtiva,
  type PeriodoPK,
  type StatusPK,
} from '@/../product/sections/medication/types'

interface Props {
  curva: CurvaPK
  medicacao: MedicacaoAtiva
}

const PERIODOS: PeriodoPK[] = ['14D', '30D', '90D']

const STATUS_COLOR: Record<StatusPK, string> = {
  no_pico: 'text-emerald-600 dark:text-emerald-300',
  subindo: 'text-teal-600 dark:text-teal-300',
  caindo: 'text-amber-600 dark:text-amber-300',
  vale: 'text-rose-600 dark:text-rose-300',
}

const STATUS_HINT: Record<StatusPK, string> = {
  no_pico: 'Saciedade alta esperada',
  subindo: 'Efeito aumentando',
  caindo: 'Efeito reduzindo',
  vale: 'Próximo da próxima dose',
}

const W = 320
const H = 140
const PADDING = { top: 12, right: 14, bottom: 22, left: 14 }
const PLOT_W = W - PADDING.left - PADDING.right
const PLOT_H = H - PADDING.top - PADDING.bottom

function formatTick(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${d}/${Number(m)}`
}

export function PKCurveCard({ curva, medicacao }: Props) {
  const [periodo, setPeriodo] = useState<PeriodoPK>('14D')

  const pontos = useMemo(() => {
    const dias = periodo === '14D' ? 14 : periodo === '30D' ? 30 : 90
    return curva.pontos.slice(-dias)
  }, [curva.pontos, periodo])

  if (pontos.length === 0) return null

  const n = pontos.length
  const xs = pontos.map(
    (_, i) => PADDING.left + (i * PLOT_W) / Math.max(1, n - 1),
  )
  const ys = pontos.map(
    (p) => PADDING.top + PLOT_H * (1 - Math.max(0, Math.min(1, p.nivel))),
  )

  let solidPath = ''
  let dashedPath = ''
  let crossover = -1
  pontos.forEach((p, i) => {
    if (!p.projetado) {
      solidPath += i === 0 ? `M${xs[i]},${ys[i]}` : ` L${xs[i]},${ys[i]}`
    } else {
      if (crossover === -1) {
        crossover = i
        dashedPath = `M${xs[i - 1]},${ys[i - 1]} L${xs[i]},${ys[i]}`
      } else {
        dashedPath += ` L${xs[i]},${ys[i]}`
      }
    }
  })

  let areaPath = ''
  pontos.forEach((p, i) => {
    if (p.projetado) return
    areaPath += i === 0 ? `M${xs[i]},${ys[i]}` : ` L${xs[i]},${ys[i]}`
  })
  const lastSolid = crossover === -1 ? n - 1 : crossover - 1
  if (lastSolid >= 0) {
    areaPath += ` L${xs[lastSolid]},${PADDING.top + PLOT_H} L${xs[0]},${PADDING.top + PLOT_H} Z`
  }
  const hojeX = xs[lastSolid]
  const hojeY = ys[lastSolid]
  const ticks = [0, Math.floor(lastSolid / 2), lastSolid]

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-500">
            Nível estimado
          </div>
          <div className="mt-0.5 text-[15px] font-semibold text-stone-900 dark:text-slate-100">
            {medicacao.nome}{' '}
            <span className="font-mono text-[13px] text-stone-500 dark:text-slate-400">
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
          <div className="text-[11px] text-stone-500 dark:text-slate-500">
            {STATUS_HINT[curva.statusHoje]}
          </div>
        </div>
      </div>

      {/* Tabs período */}
      <div className="mb-3 flex gap-1">
        {PERIODOS.map((p) => {
          const active = p === periodo
          return (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`rounded-md px-2.5 py-1 font-mono text-[11px] tabular-nums transition-all ${
                active
                  ? 'bg-stone-200 text-stone-900 dark:bg-slate-700 dark:text-slate-100'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-slate-800/60 dark:text-slate-500 dark:hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          )
        })}
      </div>

      {/* SVG */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        preserveAspectRatio="none"
      >
        {[0.25, 0.5, 0.75].map((frac) => {
          const y = PADDING.top + PLOT_H * frac
          return (
            <line
              key={frac}
              x1={PADDING.left}
              x2={W - PADDING.right}
              y1={y}
              y2={y}
              className="stroke-stone-200 dark:stroke-slate-800"
              strokeWidth={1}
            />
          )
        })}

        {lastSolid >= 0 && (
          <line
            x1={hojeX}
            x2={hojeX}
            y1={PADDING.top}
            y2={PADDING.top + PLOT_H}
            className="stroke-stone-400 dark:stroke-slate-600"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        )}

        {areaPath && (
          <path d={areaPath} fill="rgb(20 184 166 / 0.10)" stroke="none" />
        )}

        {solidPath && (
          <path
            d={solidPath}
            className="stroke-teal-500 dark:stroke-teal-300"
            strokeWidth={2.2}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {dashedPath && (
          <path
            d={dashedPath}
            className="stroke-teal-500 dark:stroke-teal-300"
            strokeWidth={2}
            fill="none"
            strokeDasharray="4 3"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.5}
          />
        )}

        {lastSolid >= 0 && (
          <>
            <circle cx={hojeX} cy={hojeY} r={4} className="fill-teal-600 dark:fill-teal-400" />
            <circle
              cx={hojeX}
              cy={hojeY}
              r={8}
              fill="none"
              className="stroke-teal-500 dark:stroke-teal-400"
              strokeOpacity={0.35}
              strokeWidth={2}
            />
          </>
        )}

        {ticks.map((i) => {
          if (i < 0 || i >= pontos.length) return null
          return (
            <text
              key={i}
              x={xs[i]}
              y={H - 6}
              textAnchor="middle"
              fontSize={9}
              fontFamily="ui-monospace, monospace"
              className="fill-stone-500 dark:fill-slate-500"
            >
              {formatTick(pontos[i].data)}
            </text>
          )
        })}

        {lastSolid >= 0 && lastSolid !== ticks[2] && (
          <text
            x={hojeX}
            y={H - 6}
            textAnchor="middle"
            fontSize={9}
            fontFamily="ui-monospace, monospace"
            className="fill-teal-600 dark:fill-teal-300"
          >
            hoje
          </text>
        )}
      </svg>

      <div className="mt-2 flex items-start gap-1.5">
        <HelpCircle
          size={11}
          className="mt-px shrink-0 text-stone-400 dark:text-slate-600"
        />
        <p className="text-[10.5px] leading-snug text-stone-500 dark:text-slate-500">
          Estimativa baseada em farmacocinética populacional. Não substitui medição clínica.
        </p>
      </div>
    </div>
  )
}
