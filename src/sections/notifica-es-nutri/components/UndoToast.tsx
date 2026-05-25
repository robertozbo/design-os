import { useEffect, useState } from 'react'
import { Undo2 } from 'lucide-react'

interface UndoToastProps {
  message: string
  onUndo?: () => void
  onClose: () => void
  /** Auto-dismiss duration in ms. Default 5000. */
  durationMs?: number
}

export function UndoToast({ message, onUndo, onClose, durationMs = 5000 }: UndoToastProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / durationMs) * 100)
      setProgress(remaining)
      if (remaining === 0) {
        clearInterval(timer)
        onClose()
      }
    }, 50)
    return () => clearInterval(timer)
  }, [durationMs, onClose])

  return (
    <div className="pointer-events-auto fixed bottom-6 right-6 z-50 max-w-sm overflow-hidden rounded-xl bg-slate-900 shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-950 dark:ring-slate-50/10">
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-sm text-slate-100">{message}</span>
        <button
          type="button"
          onClick={() => {
            onUndo?.()
            onClose()
          }}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/20"
        >
          <Undo2 size={11} />
          Desfazer
        </button>
      </div>
      <div className="h-0.5 w-full bg-slate-800 dark:bg-slate-900">
        <div
          className="h-full bg-teal-400 transition-[width]"
          style={{ width: `${progress}%`, transitionDuration: '50ms' }}
        />
      </div>
    </div>
  )
}
