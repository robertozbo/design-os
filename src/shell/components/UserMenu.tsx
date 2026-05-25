import { useEffect, useRef, useState } from 'react'
import { ChevronUp, LogOut, Settings, User, type LucideIcon } from 'lucide-react'
import type { AppShellUser } from './AppShell'

export interface UserMenuProps {
  user: AppShellUser
  isCollapsed: boolean
  onLogout?: () => void
}

export function UserMenu({ user, isCollapsed, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [open])

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <div ref={ref} className="relative p-2">
      <button
        onClick={() => setOpen((v) => !v)}
        title={isCollapsed ? user.name : undefined}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`
          w-full flex items-center gap-2 px-1.5 py-1.5 rounded-md
          hover:bg-slate-100 dark:hover:bg-slate-800
          transition-colors
          ${isCollapsed ? 'md:justify-center' : ''}
        `}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-violet-500 text-white flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {user.name}
              </div>
              {user.email && (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </div>
              )}
            </div>
            <ChevronUp
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                open ? '' : 'rotate-180'
              }`}
            />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={`
            absolute bottom-full mb-1
            ${isCollapsed ? 'left-full ml-1' : 'left-2 right-2'}
            min-w-[200px]
            bg-white dark:bg-slate-800
            border border-slate-200 dark:border-slate-700
            rounded-md shadow-lg
            py-1
            z-10
          `}
        >
          <MenuItem icon={User} label="Profile" onClick={() => setOpen(false)} />
          <MenuItem icon={Settings} label="Settings" onClick={() => setOpen(false)} />
          <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
          <MenuItem
            icon={LogOut}
            label="Logout"
            onClick={() => {
              setOpen(false)
              onLogout?.()
            }}
          />
        </div>
      )}
    </div>
  )
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon
  label: string
  onClick?: () => void
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60"
    >
      <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      <span>{label}</span>
    </button>
  )
}
