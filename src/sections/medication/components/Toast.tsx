import { Check, Info, WifiOff } from 'lucide-react'

export interface ToastData {
  id: number
  tone: 'success' | 'info' | 'warning' | 'neutral'
  texto: string
}

const TONE_STYLE: Record<ToastData['tone'], string> = {
  success:
    'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-500/15 dark:text-emerald-100',
  info: 'border-teal-300 bg-teal-50 text-teal-900 dark:border-teal-400/40 dark:bg-teal-500/15 dark:text-teal-100',
  warning:
    'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-400/40 dark:bg-amber-500/15 dark:text-amber-100',
  neutral:
    'border-stone-300 bg-stone-100 text-stone-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
}

function ToneIcon({ tone }: { tone: ToastData['tone'] }) {
  if (tone === 'success') return <Check size={14} strokeWidth={2.6} />
  if (tone === 'info') return <Info size={14} strokeWidth={2.4} />
  if (tone === 'warning') return <Info size={14} strokeWidth={2.4} />
  return <WifiOff size={14} strokeWidth={2.4} />
}

export function Toasts({ items }: { items: ToastData[] }) {
  if (!items.length) return null
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] shadow-lg ${TONE_STYLE[t.tone]}`}
          role="status"
        >
          <ToneIcon tone={t.tone} />
          <span>{t.texto}</span>
        </div>
      ))}
    </div>
  )
}
