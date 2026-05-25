interface NymosMarkProps {
  /** Tamanho em px (square) */
  size?: number
  /** Variante: ícone sozinho ou com wordmark "nymos" ao lado */
  variant?: 'mark' | 'lockup'
  /** Cor de fundo do mark */
  variantColor?: 'teal' | 'gradient' | 'white'
  /** Cor do wordmark text (override opcional) */
  wordmarkClassName?: string
}

/**
 * Logo Nymos — letra "N" branca em fundo teal (verde do tema).
 */
export function NymosMark({
  size = 32,
  variant = 'mark',
  variantColor = 'teal',
  wordmarkClassName,
}: NymosMarkProps) {
  const bgCls =
    variantColor === 'teal'
      ? 'bg-teal-500'
      : variantColor === 'gradient'
        ? 'bg-gradient-to-br from-teal-500 to-sky-500'
        : 'bg-white'
  const textCls = variantColor === 'white' ? 'text-teal-500' : 'text-white'

  const iconBlock = (
    <div
      className={`${bgCls} ${textCls} flex items-center justify-center shrink-0 font-bold leading-none`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: size * 0.62,
        letterSpacing: '-0.04em',
      }}
      aria-label="Nymos"
    >
      N
    </div>
  )

  if (variant === 'mark') return iconBlock

  return (
    <div className="flex items-center gap-2.5">
      {iconBlock}
      <span
        className={
          wordmarkClassName ??
          'text-slate-50 font-bold tracking-tight lowercase'
        }
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: size * 0.72,
          letterSpacing: '-0.04em',
        }}
      >
        nymos
      </span>
    </div>
  )
}
