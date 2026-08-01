interface ShellInvocationIconProps {
  hasProactiveSuggestion?: boolean
  onClick?: () => void
  size?: number
}

// Mini low-poly head used as the floating shell invocation icon.
// Continuous scanner line travels vertically to communicate "Nymos tá monitorando".
export function ShellInvocationIcon({
  hasProactiveSuggestion = false,
  onClick,
  size = 56,
}: ShellInvocationIconProps) {
  const accent = hasProactiveSuggestion ? 'orange' : 'teal'
  const strokeColor =
    accent === 'orange' ? 'stroke-orange-300' : 'stroke-teal-300'
  const fillColor =
    accent === 'orange' ? 'fill-orange-300' : 'fill-teal-300'
  const scanColor =
    accent === 'orange' ? 'stroke-orange-200' : 'stroke-teal-200'
  const haloColor =
    accent === 'orange' ? 'bg-orange-500/25' : 'bg-teal-500/25'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Abrir assistente Nymos"
      title="Falar com Nymos"
      className="relative inline-flex items-center justify-center group"
      style={{ width: size, height: size }}
    >
      <style>{`
        @keyframes nymos-icon-scan {
          0% { transform: translateY(-22px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(22px); opacity: 0; }
        }
        @keyframes nymos-icon-halo {
          0%, 100% { opacity: 0.4; transform: scale(0.95); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>

      {/* Halo */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-full ${haloColor} blur-xl`}
        style={{ animation: 'nymos-icon-halo 2.4s ease-in-out infinite' }}
      />

      {/* Background plate */}
      <span
        aria-hidden="true"
        className="absolute inset-1 rounded-full bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition-colors"
      />

      {/* Mesh face */}
      <svg
        viewBox="0 0 60 60"
        className="relative z-10"
        width={size - 12}
        height={size - 12}
        aria-hidden="true"
      >
        {/* Scanner line */}
        <line
          x1="8"
          x2="52"
          y1="30"
          y2="30"
          className={scanColor}
          strokeWidth="0.7"
          opacity="0.9"
          style={{
            transformOrigin: 'center',
            animation: 'nymos-icon-scan 2.4s linear infinite',
          }}
        />

        {/* Mini face mesh edges */}
        <g className={strokeColor} fill="none" strokeWidth="0.8" strokeLinecap="round" opacity="0.85">
          {/* Outline */}
          <line x1="30" y1="10" x2="18" y2="14" />
          <line x1="30" y1="10" x2="42" y2="14" />
          <line x1="18" y1="14" x2="13" y2="25" />
          <line x1="42" y1="14" x2="47" y2="25" />
          <line x1="13" y1="25" x2="16" y2="40" />
          <line x1="47" y1="25" x2="44" y2="40" />
          <line x1="16" y1="40" x2="24" y2="50" />
          <line x1="44" y1="40" x2="36" y2="50" />
          <line x1="24" y1="50" x2="30" y2="53" />
          <line x1="36" y1="50" x2="30" y2="53" />
          {/* Inner */}
          <line x1="22" y1="26" x2="26" y2="28" />
          <line x1="38" y1="26" x2="34" y2="28" />
          <line x1="26" y1="28" x2="34" y2="28" />
          <line x1="30" y1="32" x2="26" y2="40" />
          <line x1="30" y1="32" x2="34" y2="40" />
          <line x1="26" y1="40" x2="34" y2="40" />
        </g>

        {/* Vertices */}
        <g className={fillColor}>
          {[
            [30, 10],
            [18, 14],
            [42, 14],
            [13, 25],
            [47, 25],
            [16, 40],
            [44, 40],
            [24, 50],
            [36, 50],
            [30, 53],
            [22, 26],
            [38, 26],
            [26, 28],
            [34, 28],
            [30, 32],
            [26, 40],
            [34, 40],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.4" />
          ))}
        </g>
      </svg>

      {/* Badge dot when proactive */}
      {hasProactiveSuggestion && (
        <span
          className="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-400 rounded-full ring-2 ring-slate-950"
          aria-hidden="true"
        />
      )}
    </button>
  )
}
