import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

interface Props {
  onEditar?: () => void
  onExcluir?: () => void
  /** Classe extra pro botão trigger. */
  triggerClassName?: string
}

export function PacienteAcoesMenu({ onEditar, onExcluir, triggerClassName = '' }: Props) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        aria-label="Mais ações"
        aria-haspopup="menu"
        aria-expanded={open}
        className={`
          inline-flex size-7 items-center justify-center rounded-md text-slate-400 transition-colors
          hover:bg-slate-100 hover:text-slate-700
          dark:hover:bg-slate-800 dark:hover:text-slate-200
          ${triggerClassName}
        `}
      >
        <MoreHorizontal className="size-4" />
      </button>

      {open && (
        <div
          role="menu"
          onClick={(e) => e.stopPropagation()}
          className="
            absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg
            dark:border-slate-700 dark:bg-slate-900
          "
        >
          <button
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
              onEditar?.()
            }}
            className="
              flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors
              hover:bg-slate-50
              dark:text-slate-200 dark:hover:bg-slate-800
            "
          >
            <Pencil className="size-3.5 text-slate-400" />
            Editar paciente
          </button>
          <button
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
              onExcluir?.()
            }}
            className="
              flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-xs font-medium text-rose-600 transition-colors
              hover:bg-rose-50
              dark:border-slate-800 dark:text-rose-400 dark:hover:bg-rose-950/30
            "
          >
            <Trash2 className="size-3.5" />
            Excluir paciente
          </button>
        </div>
      )}
    </div>
  )
}
