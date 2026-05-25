import { useEffect, useRef, useState } from 'react'
import { ChevronUp, LogOut, Settings } from 'lucide-react'

export interface ShellUser {
  name: string
  role?: string
  avatarUrl?: string
}

interface UserMenuProps {
  user: ShellUser
  onLogout?: () => void
  onProfileClick?: () => void
}

export function UserMenu({ user, onLogout, onProfileClick }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const initial = user.name.trim().charAt(0).toUpperCase() || '?'

  return (
    <div ref={containerRef} className="relative">
      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 right-0 mb-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onProfileClick?.()
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Settings className="w-4 h-4" strokeWidth={1.75} />
            Configurações
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onLogout?.()
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.75} />
            Sair
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 flex items-center justify-center text-sm font-semibold shrink-0">
            {initial}
          </div>
        )}
        <div className="flex-1 min-w-0 text-left">
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
            {user.name}
          </div>
          {user.role && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user.role}
            </div>
          )}
        </div>
        <ChevronUp
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
            open ? '' : 'rotate-180'
          }`}
          strokeWidth={1.75}
        />
      </button>
    </div>
  )
}
