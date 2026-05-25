import { LayoutTemplate, Notebook } from 'lucide-react'

export type SectionTab = 'planos' | 'templates'

interface SectionTabsProps {
  active: SectionTab
  planosCount: number
  templatesCount: number
  onChange: (tab: SectionTab) => void
}

export function SectionTabs({ active, planosCount, templatesCount, onChange }: SectionTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
      <TabButton
        label="Planos"
        count={planosCount}
        icon={<Notebook size={14} />}
        active={active === 'planos'}
        onClick={() => onChange('planos')}
      />
      <TabButton
        label="Templates"
        count={templatesCount}
        icon={<LayoutTemplate size={14} />}
        active={active === 'templates'}
        onClick={() => onChange('templates')}
      />
    </div>
  )
}

function TabButton({
  label,
  count,
  icon,
  active,
  onClick,
}: {
  label: string
  count: number
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all
        ${
          active
            ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
        }
      `}
    >
      {icon}
      {label}
      <span
        className={`font-mono text-[11px] tabular-nums ${
          active ? 'text-slate-300 dark:text-slate-500' : 'text-slate-400 dark:text-slate-600'
        }`}
      >
        {count}
      </span>
    </button>
  )
}
