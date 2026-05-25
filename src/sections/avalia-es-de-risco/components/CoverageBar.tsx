interface CoverageBarProps {
  cobertura: number
  coberturaMinima: number
  respondentes: number
  elegiveis: number
}

const IDEAL_COVERAGE_PERCENT = 85

export function CoverageBar({ cobertura, coberturaMinima, respondentes, elegiveis }: CoverageBarProps) {
  const cleared = cobertura >= coberturaMinima
  const idealReached = cobertura >= IDEAL_COVERAGE_PERCENT

  const fillTone = idealReached
    ? 'from-teal-500 to-teal-400'
    : cleared
    ? 'from-teal-500 to-emerald-400'
    : 'from-amber-500 to-amber-300'

  const labelTone = idealReached
    ? 'text-teal-700 dark:text-teal-300'
    : cleared
    ? 'text-teal-600 dark:text-teal-400'
    : 'text-amber-700 dark:text-amber-300'

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between text-[11px] mb-1.5">
        <div className="flex items-baseline gap-2 tabular-nums">
          <span className={`text-sm font-semibold tracking-tight ${labelTone}`}>
            {cobertura.toFixed(1)}%
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {respondentes.toLocaleString('pt-BR')}/{elegiveis.toLocaleString('pt-BR')}
          </span>
        </div>
        <span className="text-slate-400 dark:text-slate-500 font-mono">
          mín {coberturaMinima}%
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${fillTone} transition-[width] duration-700 ease-out`}
          style={{ width: `${Math.min(cobertura, 100)}%` }}
        />
        <div
          className="absolute top-[-2px] bottom-[-2px] w-px bg-slate-400 dark:bg-slate-500"
          style={{ left: `${coberturaMinima}%` }}
        >
          <span className="absolute top-[-3px] left-[-1px] block w-[3px] h-[3px] rotate-45 bg-slate-400 dark:bg-slate-500" />
        </div>
      </div>
    </div>
  )
}
