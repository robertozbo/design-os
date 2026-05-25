interface ChipOption<TId extends string> {
  id: TId
  label: string
  count: number
}

interface FilterChipsProps<TId extends string> {
  label: string
  options: ChipOption<TId>[]
  selected: TId
  onChange?: (id: TId) => void
}

export function FilterChips<TId extends string>({
  label,
  options,
  selected,
  onChange,
}: FilterChipsProps<TId>) {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 sm:inline">
        {label}
      </span>
      <div className="flex flex-1 gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {options.map((opt) => {
          const active = selected === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange?.(opt.id)}
              className={`
                shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all
                ${
                  active
                    ? 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:ring-teal-800'
                    : 'text-slate-600 ring-1 ring-inset ring-transparent hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }
              `}
            >
              {opt.label}
              {opt.id !== ('todos' as TId) && (
                <span
                  className={`ml-1 font-mono tabular-nums text-[10px] ${
                    active
                      ? 'text-teal-500 dark:text-teal-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {opt.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
