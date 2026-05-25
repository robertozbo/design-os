import { useId } from 'react'
import type { WeeklySignal } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { Activity, ArrowDown, ArrowRight, ArrowUp, Bell, Clock, Stethoscope } from 'lucide-react'

interface Props {
  signal: WeeklySignal
  delayMs?: number
}

const ICON_MAP = {
  clock: Clock,
  stethoscope: Stethoscope,
  bell: Bell,
  activity: Activity,
} as const

const CONCERN = {
  high: {
    label: 'Alta atenção',
    chip: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
    dot: 'bg-rose-500',
    sparkColor: '#e11d48',
  },
  medium: {
    label: 'Atenção',
    chip: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
    dot: 'bg-amber-500',
    sparkColor: '#d97706',
  },
  low: {
    label: 'Estável',
    chip: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
    dot: 'bg-emerald-500',
    sparkColor: '#059669',
  },
} as const

export function SignalKpiCard({ signal, delayMs = 0 }: Props) {
  const Icon = ICON_MAP[signal.icon as keyof typeof ICON_MAP] ?? Activity
  const tone = CONCERN[signal.concern]

  const ArrowIcon = signal.direction === 'up' ? ArrowUp : signal.direction === 'down' ? ArrowDown : ArrowRight
  const isWorsening = signal.direction === 'up'
  const deltaColor =
    signal.direction === 'flat'
      ? 'text-slate-500 dark:text-slate-400'
      : isWorsening
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-emerald-600 dark:text-emerald-400'

  return (
    <article
      style={{ animationDelay: `${delayMs}ms` }}
      className="
        nymos-reveal opacity-0
        group relative rounded-2xl bg-white dark:bg-slate-900/60
        border border-slate-200 dark:border-slate-800 p-5
        transition
        hover:border-slate-300 dark:hover:border-slate-700
        hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.25)]
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <Icon className="w-4 h-4" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight">
              {signal.label}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
              {signal.unit}
            </div>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap ${tone.chip}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
          {tone.label}
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
          {signal.current}
        </span>
        <span className={`inline-flex items-center gap-0.5 text-sm font-semibold ${deltaColor}`}>
          <ArrowIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span className="tabular-nums">{Math.abs(signal.delta)}</span>
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          vs. {signal.previous}
        </span>
      </div>

      <div className="mt-3">
        <Sparkline data={signal.sparkline} color={tone.sparkColor} />
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
        <span>8 sem.</span>
        <span>agora</span>
      </div>
    </article>
  )
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const id = useId().replace(/:/g, '')
  const w = 200
  const h = 36
  const pad = 2
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = (w - pad * 2) / (data.length - 1)

  const points = data.map((v, i) => ({
    x: pad + i * stepX,
    y: pad + (h - pad * 2) * (1 - (v - min) / range),
  }))

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')
  const last = points[points.length - 1]
  const areaPath = `${path} L ${last.x.toFixed(2)} ${(h - pad).toFixed(2)} L ${points[0].x.toFixed(2)} ${(h - pad).toFixed(2)} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-9 overflow-visible">
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#spark-${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="2.5" fill={color} />
      <circle cx={last.x} cy={last.y} r="5" fill={color} fillOpacity="0.18" />
    </svg>
  )
}
