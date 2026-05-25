interface Props {
  cobertura: number
  minimo: number
  respondentes: number
  elegiveis: number
}

export function CoberturaGauge({ cobertura, minimo, respondentes, elegiveis }: Props) {
  const pct = Math.max(0, Math.min(100, cobertura))
  const radius = 76
  const stroke = 12
  const c = 2 * Math.PI * radius
  const offset = c * (1 - pct / 100)
  const minDegrees = (minimo / 100) * 360 - 90

  const meetsMin = pct >= minimo
  const trackColor = meetsMin ? '#10b981' : pct >= minimo * 0.8 ? '#d97706' : '#e11d48'

  return (
    <div className="relative flex items-center justify-center w-44 h-44 mx-auto">
      <svg viewBox="0 0 200 200" className="w-44 h-44 -rotate-90">
        <circle cx="100" cy="100" r={radius} fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth={stroke} />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1)' }}
        />
        <g transform={`rotate(${minDegrees} 100 100)`}>
          <line x1="100" y1={100 - radius - stroke / 2 - 2} x2="100" y2={100 - radius + stroke / 2 + 2} className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">{pct.toFixed(1)}%</span>
        <span className="mt-0.5 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">cobertura</span>
        <span className="mt-1.5 text-[11px] tabular-nums text-slate-600 dark:text-slate-400">
          {respondentes} / {elegiveis}
        </span>
      </div>
    </div>
  )
}
