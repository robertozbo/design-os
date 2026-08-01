import type { LucideIcon } from 'lucide-react'

export interface MobileNavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface MobileBottomNavProps {
  items: MobileNavItem[]
  activeHref?: string
  onNavigate?: (href: string) => void
}

export function MobileBottomNav({ items, activeHref, onNavigate }: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Navegação principal"
      className="shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const isActive = item.href === activeHref
          const Icon = item.icon
          return (
            <li key={item.href}>
              <button
                type="button"
                onClick={() => onNavigate?.(item.href)}
                className={`w-full flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-teal-600 dark:text-teal-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-5 h-5" strokeWidth={1.75} />
                <span>{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
