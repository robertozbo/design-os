import { useState } from 'react'
import { type LucideIcon, Menu } from 'lucide-react'
import { MainNav } from './MainNav'

export interface NavigationItem {
  label: string
  href: string
  icon?: LucideIcon
  isActive?: boolean
  badge?: number
}

export interface AppShellUser {
  name: string
  email?: string
  avatarUrl?: string
}

export interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  secondaryItems?: NavigationItem[]
  user?: AppShellUser
  productName?: string
  onNavigate?: (href: string) => void
  onLogout?: () => void
}

export function AppShell({
  children,
  navigationItems,
  secondaryItems = [],
  user,
  productName = 'Nymos',
  onNavigate,
  onLogout,
}: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-full min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between h-14 px-4 border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-600 text-white text-sm font-semibold">
            N
          </div>
          <span className="font-semibold tracking-tight">{productName}</span>
        </div>
        <div className="w-9" />
      </div>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          flex flex-col shrink-0 w-60
          bg-white dark:bg-slate-900
          border-r border-slate-200 dark:border-slate-800
          transition-[transform,width] duration-200 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${isCollapsed ? 'md:w-16' : 'md:w-60'}
        `}
      >
        <MainNav
          productName={productName}
          navigationItems={navigationItems}
          secondaryItems={secondaryItems}
          user={user}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
          onCloseMobile={() => setMobileOpen(false)}
          onNavigate={(href) => {
            onNavigate?.(href)
            setMobileOpen(false)
          }}
          onLogout={onLogout}
        />
      </aside>

      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">{children}</main>
    </div>
  )
}
