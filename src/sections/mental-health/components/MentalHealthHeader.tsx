import type { MentalHealthHeader as HeaderData } from '@/../product/sections/mental-health/types'

interface Props {
  header: HeaderData
}

export function MentalHealthHeader({ header }: Props) {
  return (
    <header className="nymos-reveal opacity-0">
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
        <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
          {header.tag}
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {header.title}
      </h1>
      <p className="mt-2 text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl">
        {header.subtitle}
      </p>
    </header>
  )
}
