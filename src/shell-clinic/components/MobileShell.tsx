import { Bell } from 'lucide-react'
import type { ReactNode } from 'react'
import { MobileBottomNav, type MobileNavItem } from './MobileBottomNav'

interface MobileShellProps {
  children: ReactNode
  navItems: MobileNavItem[]
  activeHref?: string
  notificationCount?: number
  onNavigate?: (href: string) => void
  onNotificationsClick?: () => void
}

export function MobileShell({
  children,
  navItems,
  activeHref,
  notificationCount,
  onNavigate,
  onNotificationsClick,
}: MobileShellProps) {
  return (
    <div className="mx-auto w-full max-w-sm h-[844px] flex flex-col bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
      <header
        className="shrink-0 h-14 px-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-teal-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold leading-none">N</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Nymos
            </div>
            <div className="text-[10px] uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Saúde
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onNotificationsClick}
          className="relative p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Notificações"
        >
          <Bell className="w-5 h-5" strokeWidth={1.75} />
          {notificationCount && notificationCount > 0 ? (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          ) : null}
        </button>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>

      <MobileBottomNav
        items={navItems}
        activeHref={activeHref}
        onNavigate={onNavigate}
      />
    </div>
  )
}
