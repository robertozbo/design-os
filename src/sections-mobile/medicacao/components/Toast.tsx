import { CheckCircle2, Info } from 'lucide-react'

export type ToastTone = 'success' | 'info' | 'warning'

export interface ToastData {
  id: number
  tone: ToastTone
  texto: string
}

const TONE_CLS: Record<ToastTone, string> = {
  success: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-100',
  info: 'bg-slate-800/90 border-slate-700 text-slate-100',
  warning: 'bg-amber-500/15 border-amber-500/40 text-amber-100',
}

export function Toasts({ items }: { items: ToastData[] }) {
  if (items.length === 0) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto w-full max-w-sm rounded-2xl border backdrop-blur-sm px-4 py-2.5 text-[13px] flex items-center gap-2 shadow-lg ${TONE_CLS[t.tone]}`}
        >
          {t.tone === 'success' && (
            <CheckCircle2 size={14} strokeWidth={2.4} className="shrink-0" />
          )}
          {t.tone !== 'success' && <Info size={14} strokeWidth={2} className="shrink-0" />}
          <span className="flex-1">{t.texto}</span>
        </div>
      ))}
    </div>
  )
}
