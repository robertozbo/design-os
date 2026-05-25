import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

export interface ActivityActionsMenuProps {
  disabled?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function ActivityActionsMenu({ disabled, onEdit, onDelete }: ActivityActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', handle)
    return () => window.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        aria-label="Ações"
        className={`
          grid place-items-center w-8 h-8 rounded-lg transition-colors
          ${
            disabled
              ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
              : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
          }
        `}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && !disabled && (
        <div
          className="
            absolute right-0 top-full mt-1 z-20
            min-w-[140px]
            rounded-xl
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800
            shadow-lg
            py-1
            animate-[fade-in_120ms_ease-out]
          "
        >
          <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(-2px) } to { opacity: 1; transform: translateY(0) } }`}</style>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onEdit?.()
            }}
            className="
              w-full flex items-center gap-2 px-3 py-2 text-left
              text-sm text-slate-700 dark:text-slate-200
              hover:bg-slate-50 dark:hover:bg-slate-800
              transition-colors
            "
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onDelete?.()
            }}
            className="
              w-full flex items-center gap-2 px-3 py-2 text-left
              text-sm text-rose-600 dark:text-rose-400
              hover:bg-rose-500/10 dark:hover:bg-rose-400/10
              transition-colors
            "
          >
            <Trash2 className="w-3.5 h-3.5" />
            Excluir
          </button>
        </div>
      )}
    </div>
  )
}
