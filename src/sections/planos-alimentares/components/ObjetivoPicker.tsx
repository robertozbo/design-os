import { useEffect, useRef, useState } from 'react'
import { Check, Tag, X } from 'lucide-react'
import type {
  Objetivo,
  ObjetivoOption,
} from '@/../product/sections/planos-alimentares/types'
import { ObjetivoBadge } from './ObjetivoBadge'

interface ObjetivoPickerProps {
  value: Objetivo | null
  options: ObjetivoOption[]
  onChange: (next: Objetivo | null) => void
}

export function ObjetivoPicker({ value, options, onChange }: ObjetivoPickerProps) {
  const [open, setOpen] = useState(false)
  const [customLabel, setCustomLabel] = useState(
    value?.id === 'outro' ? value.customLabel ?? '' : '',
  )
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    function handlePointer(e: PointerEvent) {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointer, true)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointer, true)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  function handlePick(opt: ObjetivoOption) {
    if (opt.id === 'outro') {
      onChange({ id: 'outro', customLabel: customLabel || 'Outro' })
    } else {
      onChange({ id: opt.id })
      setOpen(false)
    }
  }

  function handleClear() {
    onChange(null)
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 px-2 py-0.5 text-[11px]
          text-slate-500 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-700
          dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800/50 dark:hover:text-slate-200
        "
      >
        {value ? (
          <ObjetivoBadge objetivo={value} options={options} />
        ) : (
          <>
            <Tag size={11} />
            Definir objetivo
          </>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 dark:border-slate-800">
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Objetivo
            </p>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
              >
                <X size={10} />
                Limpar
              </button>
            )}
          </div>

          <ul className="max-h-72 overflow-y-auto py-1">
            {options.map((opt) => {
              const isSelected = value?.id === opt.id
              const isOutro = opt.id === 'outro'
              return (
                <li key={opt.id}>
                  {isOutro ? (
                    <div className="px-3 py-2">
                      <label className="mb-1 block font-mono text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Outro (texto livre)
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={customLabel}
                          onChange={(e) => setCustomLabel(e.target.value)}
                          placeholder="Ex.: Pré-cirurgia bariátrica"
                          className="
                            block flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900
                            focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400/30
                            dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50
                          "
                        />
                        <button
                          type="button"
                          onClick={() => {
                            handlePick(opt)
                            setOpen(false)
                          }}
                          disabled={!customLabel.trim()}
                          className="rounded-md bg-teal-600 px-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePick(opt)}
                      className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/20"
                    >
                      <ObjetivoBadge
                        objetivo={{ id: opt.id }}
                        options={options}
                      />
                      {isSelected && <Check size={12} className="text-teal-600 dark:text-teal-400" />}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
