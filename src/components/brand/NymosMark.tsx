/**
 * Nymos Health — logo mark and lockup.
 *
 * Mirrors the production mark (`frontend/public/icon-source.svg`): an emerald
 * squircle with a white "N". Rendered as SVG so the manual can show every
 * variant at any size without raster assets.
 */

export type MarkVariant = 'brand' | 'mono-dark' | 'mono-light' | 'outline'

interface NymosMarkProps {
  size?: number
  variant?: MarkVariant
  className?: string
}

const variantStyles: Record<MarkVariant, { fill: string; letter: string; stroke?: string }> = {
  brand: { fill: '#10b981', letter: '#ffffff' },
  'mono-dark': { fill: '#0f172a', letter: '#ffffff' },
  'mono-light': { fill: '#ffffff', letter: '#0f172a' },
  outline: { fill: 'transparent', letter: 'currentColor', stroke: 'currentColor' },
}

export function NymosMark({ size = 48, variant = 'brand', className = '' }: NymosMarkProps) {
  const s = variantStyles[variant]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Nymos"
    >
      <rect
        x="1.5"
        y="1.5"
        width="97"
        height="97"
        rx="27"
        ry="27"
        fill={s.fill}
        stroke={s.stroke}
        strokeWidth={s.stroke ? 3 : 0}
      />
      <text
        x="50"
        y="53"
        textAnchor="middle"
        dominantBaseline="central"
        fill={s.letter}
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: 56,
          fontWeight: 700,
          letterSpacing: '-0.03em',
        }}
      >
        N
      </text>
    </svg>
  )
}

interface NymosLockupProps {
  size?: number
  variant?: MarkVariant
  /** Wordmark colour — defaults to the current text colour */
  wordmarkColor?: string
  tagline?: string
}

export function NymosLockup({
  size = 40,
  variant = 'brand',
  wordmarkColor,
  tagline,
}: NymosLockupProps) {
  return (
    <div className="flex items-center" style={{ gap: size * 0.35 }}>
      <NymosMark size={size} variant={variant} />
      <div className="flex flex-col" style={{ gap: 2 }}>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: size * 0.62,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: wordmarkColor ?? 'var(--nymos-text)',
          }}
        >
          Nymos
        </span>
        {tagline && (
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: size * 0.26,
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              lineHeight: 1,
              color: 'var(--nymos-text-2)',
            }}
          >
            {tagline}
          </span>
        )}
      </div>
    </div>
  )
}
