import type { SignalHistory, WeeklySignal } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { TrendingUp } from 'lucide-react'

interface Props {
  signals: WeeklySignal[]
  history: SignalHistory
  hiddenSeries: Set<string>
  onToggleSeries: (id: string) => void
}

const SERIES_KEY: Record<string, keyof SignalHistory['series']> = {
  'delays-absences': 'delaysAndAbsences',
  'sick-leaves': 'sickLeaves',
  'nymos-alerts': 'nymosAlerts',
  presenteeism: 'presenteeism',
}

const SERIES_STYLE: Record<
  string,
  {
    label: string
    hex: string
    chipOn: string
    chipOff: string
    dotOn: string
  }
> = {
  'delays-absences': {
    label: 'Atrasos e faltas',
    hex: '#e11d48',
    chipOn:
      'border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
    chipOff: 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500',
    dotOn: 'bg-rose-500',
  },
  'sick-leaves': {
    label: 'Atestados',
    hex: '#d97706',
    chipOn:
      'border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
    chipOff: 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500',
    dotOn: 'bg-amber-500',
  },
  'nymos-alerts': {
    label: 'Alertas Nymos',
    hex: '#7c3aed',
    chipOn:
      'border-violet-200 dark:border-violet-900/60 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300',
    chipOff: 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500',
    dotOn: 'bg-violet-500',
  },
  presenteeism: {
    label: 'Presenteísmo',
    hex: '#0d9488',
    chipOn:
      'border-teal-200 dark:border-teal-900/60 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300',
    chipOff: 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500',
    dotOn: 'bg-teal-500',
  },
}

export function SignalEvolutionChart({ signals, history, hiddenSeries, onToggleSeries }: Props) {
  const W = 800
  const H = 240
  const PAD_L = 32
  const PAD_R = 16
  const PAD_T = 18
  const PAD_B = 36
  const innerW = W - PAD_L - PAD_R
  const innerH = H - PAD_T - PAD_B

  const weekCount = history.weeks.length
  const stepX = innerW / Math.max(1, weekCount - 1)

  const series = signals.map((signal) => {
    const key = SERIES_KEY[signal.id]
    const data = history.series[key] ?? []
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const points = data.map((v, i) => ({
      x: PAD_L + i * stepX,
      y: PAD_T + innerH * (1 - (v - min) / range),
      v,
    }))
    const path = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ')
    const style = SERIES_STYLE[signal.id]
    return { id: signal.id, points, path, style, current: data[data.length - 1] }
  })

  const xLabels = history.weekLabels.map((label, i) => ({
    label,
    x: PAD_L + i * stepX,
    week: history.weeks[i],
    hasDiagnosis: history.diagnosesRegisteredWeeks.includes(history.weeks[i]),
  }))

  return (
    <section
      style={{ animationDelay: '500ms' }}
      className="
        nymos-reveal opacity-0
        rounded-2xl bg-white dark:bg-slate-900/60
        border border-slate-200 dark:border-slate-800
        p-5 sm:p-6
      "
    >
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            <TrendingUp className="w-3 h-3" strokeWidth={2.25} />
            Últimas {weekCount} semanas
          </div>
          <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">
            Evolução do time
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Tendência relativa de cada sinal · clique nas legendas para alternar séries
          </p>
        </div>
      </header>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {signals.map((signal) => {
          const style = SERIES_STYLE[signal.id]
          const hidden = hiddenSeries.has(signal.id)
          return (
            <button
              key={signal.id}
              type="button"
              onClick={() => onToggleSeries(signal.id)}
              className={`
                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition
                ${hidden ? style.chipOff : style.chipOn}
                hover:translate-y-[-1px]
              `}
            >
              <span className={`w-2 h-2 rounded-full ${hidden ? 'bg-slate-300 dark:bg-slate-700' : style.dotOn}`} />
              {style.label}
            </button>
          )
        })}
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <text
            x={6}
            y={PAD_T + 8}
            fontSize="9"
            className="font-mono fill-slate-400 dark:fill-slate-600"
          >
            +
          </text>
          <text
            x={6}
            y={H - PAD_B + 4}
            fontSize="9"
            className="font-mono fill-slate-400 dark:fill-slate-600"
          >
            −
          </text>

          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={PAD_L}
              y1={PAD_T + innerH * t}
              x2={W - PAD_R}
              y2={PAD_T + innerH * t}
              stroke="currentColor"
              strokeWidth="1"
              className="text-slate-100 dark:text-slate-800/80"
              strokeDasharray={t === 0 || t === 1 ? '0' : '2 4'}
            />
          ))}

          {xLabels.map((x, i) =>
            x.hasDiagnosis ? (
              <line
                key={`vl-${i}`}
                x1={x.x}
                y1={PAD_T}
                x2={x.x}
                y2={H - PAD_B}
                stroke="currentColor"
                strokeWidth="1"
                className="text-teal-100 dark:text-teal-950/60"
                strokeDasharray="2 3"
              />
            ) : null
          )}

          {series.map((s) => {
            if (hiddenSeries.has(s.id)) return null
            const last = s.points[s.points.length - 1]
            return (
              <g key={s.id}>
                <path
                  d={s.path}
                  fill="none"
                  stroke={s.style.hex}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <circle cx={last.x} cy={last.y} r="6" fill={s.style.hex} fillOpacity="0.18" />
                <circle cx={last.x} cy={last.y} r="3" fill={s.style.hex} />
              </g>
            )
          })}

          {xLabels.map((x, i) =>
            x.hasDiagnosis ? (
              <circle
                key={`m-${i}`}
                cx={x.x}
                cy={H - PAD_B + 10}
                r="3"
                className="fill-teal-500 dark:fill-teal-400"
              />
            ) : null
          )}

          {xLabels.map((x, i) =>
            i % 2 === 0 || i === xLabels.length - 1 ? (
              <text
                key={`xl-${i}`}
                x={x.x}
                y={H - 6}
                fontSize="9"
                textAnchor="middle"
                className="font-mono fill-slate-400 dark:fill-slate-500"
              >
                {x.label}
              </text>
            ) : null
          )}
        </svg>

        <div className="mt-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-500" />
          Semanas com diagnóstico registrado
        </div>
      </div>
    </section>
  )
}
