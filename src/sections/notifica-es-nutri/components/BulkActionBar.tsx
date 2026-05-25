import { Check, Archive, X } from 'lucide-react'

interface BulkActionBarProps {
  selectedCount: number
  /** When true, hide "Marcar como lidas" (e.g. on Arquivadas tab). */
  hideMarkAsRead?: boolean
  onMarkAsRead?: () => void
  onArchive?: () => void
  onClear?: () => void
}

export function BulkActionBar({
  selectedCount,
  hideMarkAsRead,
  onMarkAsRead,
  onArchive,
  onClear,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null
  return (
    <div className="sticky bottom-4 z-30">
      <div
        className="
          flex flex-col items-stretch gap-2 rounded-2xl border bg-slate-900/95 p-2 shadow-2xl backdrop-blur
          ring-1 ring-slate-900/10 sm:flex-row sm:items-center
          dark:bg-slate-950/95 dark:ring-slate-50/10
        "
      >
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-teal-500 px-1.5 font-mono text-[10px] font-bold tabular-nums text-white">
            {selectedCount}
          </span>
          <span className="text-xs font-medium text-slate-100">
            {selectedCount === 1 ? 'selecionada' : 'selecionadas'}
          </span>
        </div>

        <div className="flex flex-1 items-center gap-1 sm:justify-end">
          {!hideMarkAsRead && (
            <button
              type="button"
              onClick={onMarkAsRead}
              className="
                inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-100
                hover:bg-white/10
              "
            >
              <Check size={13} />
              Marcar como lidas
            </button>
          )}
          <button
            type="button"
            onClick={onArchive}
            className="
              inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-900
              hover:bg-slate-100
            "
          >
            <Archive size={13} />
            Arquivar selecionadas
          </button>
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpar seleção"
            className="
              ml-1 rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white
            "
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
