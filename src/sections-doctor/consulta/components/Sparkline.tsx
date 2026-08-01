interface Props {
  values: number[]
  ariaLabel?: string
}

export function Sparkline({ values, ariaLabel }: Props) {
  if (values.length < 2) return null

  const w = 80
  const h = 22
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = w / (values.length - 1)

  const points = values
    .map((v, i) => {
      const x = i * stepX
      const y = h - ((v - min) / range) * h
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const last = values[values.length - 1]
  const lastY = h - ((last - min) / range) * h
  const lastX = (values.length - 1) * stepX

  // Trend: positive if last > first
  const positiveTrend = values[values.length - 1] > values[0]

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className="overflow-visible"
    >
      <polyline
        fill="none"
        stroke={positiveTrend ? '#f97316' : '#0d9488'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle
        cx={lastX}
        cy={lastY}
        r="2.4"
        fill={positiveTrend ? '#f97316' : '#0d9488'}
      />
    </svg>
  )
}
