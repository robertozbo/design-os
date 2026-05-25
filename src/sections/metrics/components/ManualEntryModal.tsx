import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type {
  ManualEntryConfig,
  ManualEntryPayload,
  MetricType,
} from '@/../product/sections/metrics/types'

export interface ManualEntryModalProps {
  open: boolean
  metricType: MetricType | null
  config: ManualEntryConfig | null
  onClose: () => void
  onSubmit?: (payload: ManualEntryPayload) => void
}

function nowLocalDatetime(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function ManualEntryModal({
  open,
  metricType,
  config,
  onClose,
  onSubmit,
}: ManualEntryModalProps) {
  const [value, setValue] = useState('')
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [recordedAt, setRecordedAt] = useState(nowLocalDatetime())
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const firstInputRef = useRef<HTMLInputElement | null>(null)

  const isBP = config?.format === 'systolic/diastolic'

  useEffect(() => {
    if (open) {
      setValue('')
      setSystolic('')
      setDiastolic('')
      setRecordedAt(nowLocalDatetime())
      setNote('')
      setError(null)
      const t = window.setTimeout(() => firstInputRef.current?.focus(), 60)
      return () => window.clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !metricType || !config) return null

  const validate = (): ManualEntryPayload | null => {
    if (isBP) {
      const s = Number(systolic)
      const d = Number(diastolic)
      if (!Number.isFinite(s) || !Number.isFinite(d)) {
        setError('Informe sistólica e diastólica.')
        return null
      }
      const [sMin, sMax] = config.systolicRange ?? [70, 220]
      const [dMin, dMax] = config.diastolicRange ?? [40, 140]
      if (s < sMin || s > sMax) {
        setError(`Sistólica deve estar entre ${sMin} e ${sMax}.`)
        return null
      }
      if (d < dMin || d > dMax) {
        setError(`Diastólica deve estar entre ${dMin} e ${dMax}.`)
        return null
      }
      return {
        metricType,
        value: `${s}/${d}`,
        recordedAt: new Date(recordedAt).toISOString(),
        note: note.trim() || undefined,
      }
    }
    const n = Number(value)
    if (!Number.isFinite(n)) {
      setError('Informe um valor numérico válido.')
      return null
    }
    if (config.min !== undefined && n < config.min) {
      setError(`Valor mínimo: ${config.min} ${config.unit}.`)
      return null
    }
    if (config.max !== undefined && n > config.max) {
      setError(`Valor máximo: ${config.max} ${config.unit}.`)
      return null
    }
    return {
      metricType,
      value: n,
      recordedAt: new Date(recordedAt).toISOString(),
      note: note.trim() || undefined,
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = validate()
    if (!payload) return
    onSubmit?.(payload)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-entry-title"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="
          absolute inset-0
          bg-slate-950/40 dark:bg-slate-950/70
          backdrop-blur-sm
          animate-[fade-in_180ms_ease-out]
        "
      />
      <div
        className="
          relative w-full max-w-md
          rounded-2xl
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-800
          shadow-2xl
          animate-[modal-in_220ms_cubic-bezier(0.16,1,0.3,1)]
        "
      >
        <style>{`
          @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
          @keyframes modal-in {
            from { opacity: 0; transform: translateY(8px) scale(0.98) }
            to { opacity: 1; transform: translateY(0) scale(1) }
          }
        `}</style>

        <header className="flex items-start justify-between gap-4 p-5 pb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-teal-600 dark:text-teal-400 mb-1">
              Novo registro
            </div>
            <h2
              id="manual-entry-title"
              className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            >
              {config.label}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="
              shrink-0 grid place-items-center w-8 h-8 rounded-lg
              text-slate-400 dark:text-slate-500
              hover:bg-slate-100 dark:hover:bg-slate-800
              hover:text-slate-700 dark:hover:text-slate-200
              transition-colors
            "
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="px-5 pb-5 flex flex-col gap-4">
          {isBP ? (
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Sistólica" suffix="mmHg">
                <input
                  ref={firstInputRef}
                  type="number"
                  inputMode="numeric"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  placeholder="120"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Diastólica" suffix="mmHg">
                <input
                  type="number"
                  inputMode="numeric"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  placeholder="80"
                  className={inputClass}
                />
              </FormField>
            </div>
          ) : (
            <FormField label="Valor" suffix={config.unit}>
              <input
                ref={firstInputRef}
                type="number"
                inputMode="decimal"
                step={config.step ?? 1}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={config.min !== undefined ? `Ex: ${config.min}` : ''}
                className={inputClass}
              />
            </FormField>
          )}

          <FormField label="Data e hora">
            <input
              type="datetime-local"
              value={recordedAt}
              onChange={(e) => setRecordedAt(e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Observação (opcional)">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Algum contexto que ajude a interpretar essa medida"
              className={`${inputClass} resize-none`}
            />
          </FormField>

          {error && (
            <div className="text-xs text-rose-600 dark:text-rose-400 px-3 py-2 rounded-lg bg-rose-500/10 dark:bg-rose-400/10 border border-rose-500/20 dark:border-rose-400/20">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2 rounded-full
                text-sm font-medium
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-colors
              "
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="
                px-5 py-2 rounded-full
                bg-teal-600 hover:bg-teal-700 text-white
                dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
                text-sm font-medium
                shadow-sm
                transition-colors
              "
            >
              Salvar registro
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputClass = `
  w-full px-3 py-2.5 rounded-xl
  bg-slate-50 dark:bg-slate-800/60
  border border-slate-200 dark:border-slate-700
  text-sm text-slate-900 dark:text-slate-100
  placeholder:text-slate-400 dark:placeholder:text-slate-500
  focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60
  dark:focus:ring-teal-400/30 dark:focus:border-teal-400/60
  transition-shadow
`

function FormField({
  label,
  suffix,
  children,
}: {
  label: string
  suffix?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {suffix && (
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
            {suffix}
          </span>
        )}
      </div>
      {children}
    </label>
  )
}
