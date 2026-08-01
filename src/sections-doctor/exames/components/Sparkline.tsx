interface Props {
  values: number[]
  alertNivel?: 'baixo' | 'normal' | 'alto' | 'critico'
  width?: number
  height?: number
  showArea?: boolean
}

const COLORS = {
  baixo: '#0284c7',
  normal: '#64748b',
  alto: '#d97706',
  critico: '#e11d48',
}

export function Sparkline({
  values,
  alertNivel = 'normal',
  width = 80,
  height = 22,
  showArea = false,
}: Props) {
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

  const last = values[values.length - 1]
  const lastY = height - ((last - min) / range) * height
  const lastX = (values.length - 1) * stepX

  const color = COLORS[alertNivel]

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden="true"
    >
      {showArea && (
        <path
          d={`M0,${height} L${points} L${width},${height} Z`}
          fill={color}
          fillOpacity="0.12"
        />
      )}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle cx={lastX} cy={lastY} r="2.6" fill={color} />
    </svg>
  )
}
