import { Clock, Send } from 'lucide-react'

interface StuckBannerProps {
  count: number
  onResendAll?: () => void
  onShowList?: () => void
}

export function StuckBanner({ count, onResendAll, onShowList }: StuckBannerProps) {
  if (count < 3) return null
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 dark:border-amber-900/60 dark:bg-amber-950/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          <Clock size={16} strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
            <span className="tabular-nums">{count}</span> convites parados há mais de 7 dias
          </p>
          <p className="text-xs text-amber-800/80 dark:text-amber-200/70">
            Vale reenviar — pacientes às vezes esquecem do convite na caixa de entrada.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onShowList}
          className="
            inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800
            hover:bg-amber-50
            dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-950/60
          "
        >
          Ver lista
        </button>
        <button
          type="button"
          onClick={onResendAll}
          className="
            inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white
            hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400
          "
        >
          <Send size={11} />
          Reenviar todos os parados
        </button>
      </div>
    </div>
  )
}
