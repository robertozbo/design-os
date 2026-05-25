import type {
  TabConfig,
  TabId,
} from '@/../product/sections/minha-sa-de-paciente/types'

interface TabsProps {
  tabs: TabConfig[]
  active: TabId
  onChange: (id: TabId) => void
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Seções de Minha Saúde"
      className="mb-6 flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-slate-800"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`tab-panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`relative inline-flex items-center rounded-t-xl px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 ${
              isActive
                ? 'text-slate-900 dark:text-slate-50'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
            {isActive && (
              <span
                aria-hidden
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-teal-500"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
