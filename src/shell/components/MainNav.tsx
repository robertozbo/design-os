import { ChevronsLeft, ChevronsRight, X } from 'lucide-react'
import type { AppShellUser, NavigationItem } from './AppShell'
import { UserMenu } from './UserMenu'

export interface MainNavProps {
  productName: string
  navigationItems: NavigationItem[]
  secondaryItems: NavigationItem[]
  user?: AppShellUser
  isCollapsed: boolean
  onToggleCollapse: () => void
  onCloseMobile: () => void
  onNavigate?: (href: string) => void
  onLogout?: () => void
}

function NavItemDot() {
  return (
    <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-60" />
  )
}

export function MainNav({
  productName,
  navigationItems,
  secondaryItems,
  user,
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
  onNavigate,
  onLogout,
}: MainNavProps) {
  return (
    <nav className="flex flex-col h-full">
      <div className="flex items-center gap-2 h-14 px-3 border-b border-slate-200 dark:border-slate-800">
        <div
          className={`flex items-center gap-2 flex-1 min-w-0 ${
            isCollapsed ? 'md:justify-center' : ''
          }`}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 text-white font-semibold shrink-0">
            N
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-[15px] tracking-tight truncate">
              {productName}
            </span>
          )}
        </div>
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-2">
          {navigationItems.map((item) => (
            <NavItemRow
              key={item.href}
              item={item}
              isCollapsed={isCollapsed}
              onNavigate={onNavigate}
            />
          ))}
        </ul>

        {secondaryItems.length > 0 && (
          <>
            <div className="my-3 mx-3 border-t border-slate-200 dark:border-slate-800" />
            <ul className="space-y-0.5 px-2">
              {secondaryItems.map((item) => (
                <NavItemRow
                  key={item.href}
                  item={item}
                  isCollapsed={isCollapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </>
        )}
      </div>

      <button
        onClick={onToggleCollapse}
        className={`
          hidden md:flex items-center gap-2 mx-2 mb-2 px-2.5 py-2
          text-xs text-slate-500 rounded-md
          hover:bg-slate-100 hover:text-slate-700
          dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200
          ${isCollapsed ? 'justify-center' : ''}
        `}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronsRight className="w-4 h-4" />
        ) : (
          <ChevronsLeft className="w-4 h-4" />
        )}
        {!isCollapsed && <span>Collapse</span>}
      </button>

      {user && (
        <div className="border-t border-slate-200 dark:border-slate-800">
          <UserMenu user={user} isCollapsed={isCollapsed} onLogout={onLogout} />
        </div>
      )}
    </nav>
  )
}

function NavItemRow({
  item,
  isCollapsed,
  onNavigate,
}: {
  item: NavigationItem
  isCollapsed: boolean
  onNavigate?: (href: string) => void
}) {
  const Icon = item.icon
  const hasBadge = item.badge != null && item.badge > 0
  const renderIcon = (extraClass: string) =>
    Icon ? (
      <Icon className={`w-5 h-5 shrink-0 ${extraClass}`} />
    ) : (
      <span
        className={`w-5 h-5 shrink-0 inline-flex items-center justify-center ${extraClass}`}
      >
        <NavItemDot />
      </span>
    )
  return (
    <li>
      <button
        onClick={() => onNavigate?.(item.href)}
        title={isCollapsed ? item.label : undefined}
        className={`
          group relative flex items-center gap-3 w-full
          px-2.5 py-2 rounded-md text-sm
          transition-colors
          ${isCollapsed ? 'md:justify-center' : ''}
          ${
            item.isActive
              ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
          }
        `}
      >
        {renderIcon(item.isActive ? 'text-teal-600 dark:text-teal-400' : '')}
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>
            {hasBadge && (
              <span className="shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-medium rounded-full bg-violet-500 text-white">
                {item.badge}
              </span>
            )}
          </>
        )}
        {isCollapsed && hasBadge && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-white dark:ring-slate-900" />
        )}
      </button>
    </li>
  )
}
