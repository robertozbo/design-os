import type { TabId, TabOption } from '@/../product-personal/sections/treinos/types'

interface TabsBarProps {
  tabs: TabOption[]
  selected: TabId
  onChange?: (id: TabId) => void
}

export function TabsBar({ tabs, selected, onChange }: TabsBarProps) {
  return (
    <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800">
      {tabs.map((t) => {
        const active = selected === t.id
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange?.(t.id)}
            className={`
              relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors
              ${
                active
                  ? 'text-slate-900 dark:text-slate-50'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }
            `}
          >
            {t.label}
            <span
              className={`font-mono tabular-nums text-[10px] ${
                active
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {t.count}
            </span>
            {active && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 bg-teal-500 dark:bg-teal-400" />
            )}
          </button>
        )
      })}
    </div>
  )
}
