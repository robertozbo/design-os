import { useEffect, useState, type ReactNode } from 'react'
import { Menu, X } from 'lucide-react'
import { MainNav, type NavGroup } from './MainNav'
import { UserMenu, type ShellUser } from './UserMenu'

interface AppShellProps {
  children: ReactNode
  navigationGroups: NavGroup[]
  activeHref?: string
  user: ShellUser
  onNavigate?: (href: string) => void
  onLogout?: () => void
  onProfileClick?: () => void
  /** Sub-brand label shown under "Nymos" (defaults to "Psi"). */
  subBrand?: string
}

export function AppShell({
  children,
  navigationGroups,
  activeHref,
  user,
  onNavigate,
  onLogout,
  onProfileClick,
  subBrand = 'Psi',
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [activeHref])

  const handleNavigate = (href: string) => {
    setMobileOpen(false)
    onNavigate?.(href)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-sm"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5" strokeWidth={1.75} />
      </button>

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-60 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        aria-label="Navegação principal"
      >
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-teal-500 flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold leading-none">N</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Nymos
              </div>
              <div className="text-[10px] uppercase tracking-wider text-teal-600 dark:text-teal-400">
                {subBrand}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <MainNav
            groups={navigationGroups}
            activeHref={activeHref}
            onNavigate={handleNavigate}
          />
        </nav>

        <div className="border-t border-slate-200 dark:border-slate-800 p-3 shrink-0">
          <UserMenu user={user} onLogout={onLogout} onProfileClick={onProfileClick} />
        </div>
      </aside>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm"
          aria-hidden
        />
      )}

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
