import { Undo2 } from 'lucide-react'

interface UndoToastProps {
  message: string
  onUndo: () => void
}

export function UndoToast({ message, onUndo }: UndoToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="
        fixed left-1/2 -translate-x-1/2 bottom-20 sm:bottom-4 z-40
        animate-in slide-in-from-bottom-4 fade-in duration-200
      "
    >
      <div className="
        inline-flex items-center gap-3
        pl-4 pr-2 py-2
        rounded-full
        bg-slate-900 dark:bg-slate-50
        ring-1 ring-slate-700 dark:ring-slate-300
        shadow-lg shadow-slate-900/20 dark:shadow-black/40
      ">
        <span className="text-xs font-medium text-white dark:text-slate-900">
          {message}
        </span>
        <button
          type="button"
          onClick={onUndo}
          className="
            inline-flex items-center gap-1
            px-2.5 py-1 rounded-full
            text-xs font-semibold
            text-teal-300 dark:text-teal-700
            hover:bg-slate-800 dark:hover:bg-slate-200
            transition-colors duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
          "
        >
          <Undo2 className="w-3 h-3" strokeWidth={2.5} />
          Desfazer
        </button>
      </div>
    </div>
  )
}
