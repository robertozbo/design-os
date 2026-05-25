import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon?: LucideIcon
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

interface MainNavProps {
  groups: NavGroup[]
  activeHref?: string
  onNavigate?: (href: string) => void
}

export function MainNav({ groups, activeHref, onNavigate }: MainNavProps) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {group.label}
          </div>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = item.href === activeHref
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => onNavigate?.(item.href)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 font-medium'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {Icon && <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />}
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
