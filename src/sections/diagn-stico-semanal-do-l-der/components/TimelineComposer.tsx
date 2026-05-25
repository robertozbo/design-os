import { useState } from 'react'
import { Send } from 'lucide-react'

interface Props {
  placeholder?: string
  cta?: string
  onSubmit?: (note: string) => void
  variant?: 'teal' | 'violet'
}

export function TimelineComposer({
  placeholder = 'Registre uma atualização…',
  cta = 'Adicionar atualização',
  onSubmit,
  variant = 'teal',
}: Props) {
  const [value, setValue] = useState('')

  const accent =
    variant === 'violet'
      ? {
          ring: 'focus:border-violet-500 focus:ring-violet-100 dark:focus:ring-violet-950/60',
          button:
            'bg-violet-500 hover:bg-violet-400 text-white shadow-[0_10px_22px_-10px_rgba(124,58,237,0.55)]',
        }
      : {
          ring: 'focus:border-teal-500 focus:ring-teal-100 dark:focus:ring-teal-950/60',
          button:
            'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-[0_10px_22px_-10px_rgba(20,184,166,0.55)]',
        }

  function submit() {
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit?.(trimmed)
    setValue('')
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 rounded-xl
          bg-slate-50/60 dark:bg-slate-900/40
          border border-slate-200 dark:border-slate-800
          text-sm text-slate-700 dark:text-slate-200
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          resize-none
          focus:outline-none focus:ring-2 ${accent.ring}
          transition
        `}
      />
      <div className="mt-2.5 flex items-center justify-between gap-3">
        <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
          {value.length} caracteres
        </span>
        <button
          type="button"
          onClick={submit}
          disabled={value.trim().length === 0}
          className={`
            inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl
            text-xs font-semibold
            disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-[0.98] transition
            ${accent.button}
          `}
        >
          <Send className="w-3.5 h-3.5" strokeWidth={2.25} />
          {cta}
        </button>
      </div>
    </div>
  )
}
