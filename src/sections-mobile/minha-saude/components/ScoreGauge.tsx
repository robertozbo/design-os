import { statusFromScore, STATUS_VISUAL } from './_shared'

interface ScoreGaugeProps {
  score: number
  /** Tamanho do gauge em px */
  size?: number
  /** Espessura do anel em px */
  thickness?: number
  /** Label opcional abaixo do número */
  label?: string
}

export function ScoreGauge({ score, size = 168, thickness = 12, label = 'Score Saúde' }: ScoreGaugeProps) {
  const status = statusFromScore(score)
  const visual = STATUS_VISUAL[status]
  const center = size / 2
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const arcLength = circumference * 0.78 // 281° de arco
  const filled = arcLength * (score / 100)
  const rotation = -90 - (281 / 2) // 0% começa do canto superior esquerdo

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: `rotate(${rotation}deg)` }}>
        {/* track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className="stroke-slate-800"
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        {/* progress */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className={visual.ring}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-slate-100 font-bold text-[44px] leading-none font-mono tabular-nums">
          {score}
        </div>
        <div className={`mt-1 text-[10.5px] font-semibold uppercase tracking-wider ${visual.text}`}>
          {visual.label}
        </div>
        <div className="text-slate-500 text-[10.5px] mt-0.5">{label}</div>
      </div>
    </div>
  )
}
