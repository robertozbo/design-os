interface TimerCircularProps {
  /** Segundos restantes */
  remaining: number
  /** Total de segundos pra calcular o progresso */
  total: number
  size?: number
  thickness?: number
}

export function TimerCircular({ remaining, total, size = 200, thickness = 10 }: TimerCircularProps) {
  const center = size / 2
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const pct = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0
  const filled = circumference * pct
  const min = Math.floor(remaining / 60)
  const sec = remaining % 60
  const cor = remaining <= 5 ? 'stroke-rose-400 text-rose-300' : remaining <= 15 ? 'stroke-amber-400 text-amber-300' : 'stroke-teal-400 text-teal-300'
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          className="stroke-slate-800"
          strokeWidth={thickness}
          fill="none"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          className={cor.split(' ')[0]}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.95s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`font-bold text-[44px] leading-none font-mono tabular-nums ${cor.split(' ')[1]}`}>
          {min > 0 ? `${min}:${String(sec).padStart(2, '0')}` : sec}
        </div>
        <div className="text-slate-500 text-[10.5px] mt-1 uppercase tracking-wider">
          {min > 0 ? 'min' : 'segundos'}
        </div>
      </div>
    </div>
  )
}
