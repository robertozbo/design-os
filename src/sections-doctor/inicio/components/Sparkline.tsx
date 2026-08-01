interface Props {
  values: number[]
  positive?: boolean
  width?: number
  height?: number
}

export function Sparkline({ values, positive = true, width = 80, height = 22 }: Props) {
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = width / (values.length - 1)

  const points = values
    .map((v, i) => {
      const x = i * stepX
      const y = height - ((v - min) / range) * height
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const areaPath = `M0,${height} L${points} L${width},${height} Z`
  const color = positive ? '#0d9488' : '#f97316'
  const colorAlpha = positive ? 'rgba(13, 148, 136, 0.12)' : 'rgba(249, 115, 22, 0.12)'

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden="true"
    >
      <path d={areaPath} fill={colorAlpha} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}
