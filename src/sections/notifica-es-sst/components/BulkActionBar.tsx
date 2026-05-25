import { Archive, CheckCheck, X } from 'lucide-react'

interface BulkActionBarProps {
  count: number
  onMarkRead: () => void
  onArchive: () => void
  onClear: () => void
}

export function BulkActionBar({ count, onMarkRead, onArchive, onClear }: BulkActionBarProps) {
  return (
    <div
      role="region"
      aria-label="Ações em massa"
      className="
        fixed inset-x-4 bottom-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2
        z-30
        animate-in slide-in-from-bottom-4 fade-in duration-300
      "
    >
      <div
        className="
          flex items-center gap-3 sm:gap-4
          px-3 py-2 sm:px-4
          rounded-2xl
          bg-slate-900/95 dark:bg-slate-50/95
          backdrop-blur-xl
          ring-1 ring-slate-700/50 dark:ring-slate-300/50
          shadow-2xl shadow-slate-900/20 dark:shadow-black/40
        "
      >
        <div className="flex items-center gap-2 pl-1.5 pr-1 sm:pr-2 border-r border-slate-700 dark:border-slate-300/40">
          <span className="
            inline-flex items-center justify-center
            min-w-[24px] h-6 px-2 rounded-full
            bg-teal-400 dark:bg-teal-600
            text-[11px] font-semibold tabular-nums
            text-slate-900 dark:text-white
          ">
            {count}
          </span>
          <span className="text-xs font-medium text-white dark:text-slate-900 hidden sm:inline">
            {count === 1 ? 'selecionada' : 'selecionadas'}
          </span>
        </div>

        <button
          type="button"
          onClick={onMarkRead}
          className="
            inline-flex items-center gap-1.5
            px-2.5 py-1.5 rounded-lg
            text-xs font-medium
            text-slate-200 dark:text-slate-700
            hover:bg-slate-800 dark:hover:bg-slate-200
            hover:text-white dark:hover:text-slate-900
            transition-colors duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
          "
        >
          <CheckCheck className="w-3.5 h-3.5" strokeWidth={2} />
          Marcar lidas
        </button>

        <button
          type="button"
          onClick={onArchive}
          className="
            inline-flex items-center gap-1.5
            px-2.5 py-1.5 rounded-lg
            text-xs font-medium
            text-slate-200 dark:text-slate-700
            hover:bg-slate-800 dark:hover:bg-slate-200
            hover:text-white dark:hover:text-slate-900
            transition-colors duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
          "
        >
          <Archive className="w-3.5 h-3.5" strokeWidth={2} />
          Arquivar
        </button>

        <button
          type="button"
          onClick={onClear}
          aria-label="Limpar seleção"
          className="
            inline-flex items-center justify-center
            w-7 h-7 rounded-md
            text-slate-400 dark:text-slate-500
            hover:bg-slate-800 dark:hover:bg-slate-200
            hover:text-white dark:hover:text-slate-900
            transition-colors duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
          "
        >
          <X className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
