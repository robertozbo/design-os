import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface NumberInputProps {
  label: string
  value: number | null
  unit?: string
  step?: number
  placeholder?: string
  onChange: (value: number | null) => void
  hint?: string
  /** Se true, renderiza como display read-only (calculado) */
  computed?: boolean
}

export function NumberInput({
  label,
  value,
  unit,
  step = 0.1,
  placeholder,
  onChange,
  hint,
  computed,
}: NumberInputProps) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div
        className={`
          mt-1 flex items-center rounded-lg border bg-white pr-3 transition-colors
          ${
            computed
              ? 'border-teal-200 bg-teal-50/40 dark:border-teal-900/50 dark:bg-teal-900/10'
              : 'border-slate-200 focus-within:border-teal-400 dark:border-slate-800 dark:bg-slate-900 dark:focus-within:border-teal-600'
          }
        `}
      >
        <input
          type="number"
          step={step}
          value={value ?? ''}
          readOnly={computed}
          placeholder={placeholder ?? '—'}
          onChange={(e) => {
            const v = e.target.value === '' ? null : Number(e.target.value)
            onChange(Number.isFinite(v as number) ? (v as number) : null)
          }}
          className={`
            flex-1 border-none bg-transparent px-3 py-2 text-sm font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-50 dark:placeholder:text-slate-500
            ${computed ? 'text-teal-800 dark:text-teal-200' : ''}
          `}
        />
        {unit && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {hint}
        </p>
      )}
    </label>
  )
}

interface CollapsibleBlockProps {
  title: string
  description?: string
  badge?: React.ReactNode
  defaultOpen?: boolean
  active?: boolean
  children: React.ReactNode
}

export function CollapsibleBlock({
  title,
  description,
  badge,
  defaultOpen = false,
  active,
  children,
}: CollapsibleBlockProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <article
      className={`
        overflow-hidden rounded-xl border transition-colors
        ${
          active
            ? 'border-teal-200 bg-teal-50/20 dark:border-teal-900/50 dark:bg-teal-900/5'
            : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
        }
      `}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
              {title}
            </p>
            {badge}
          </div>
          {description && (
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? 'rotate-180' : ''
          } dark:text-slate-500`}
        />
      </button>
      {open && (
        <div className="border-t border-slate-100 px-4 py-4 dark:border-slate-800">
          {children}
        </div>
      )}
    </article>
  )
}

interface SegmentedProps<T extends string> {
  options: { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
      {options.map((opt) => {
        const active = value === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`
              rounded-md px-3 py-1.5 text-xs font-semibold transition-colors
              ${
                active
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }
            `}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

interface PhotoUploadSlotProps {
  label: string
  url: string | null
  onChange: (url: string | null) => void
}

export function PhotoUploadSlot({ label, url, onChange }: PhotoUploadSlotProps) {
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <div
        className={`
          relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl border-2 border-dashed
          ${
            url
              ? 'border-teal-300 bg-teal-50/20 dark:border-teal-700'
              : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40'
          }
        `}
      >
        {url ? (
          <>
            <img src={url} alt={label} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-2 top-2 inline-flex h-6 px-2 items-center justify-center rounded-md bg-slate-900/75 text-[10px] font-semibold text-white hover:bg-slate-900"
            >
              Remover
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() =>
              onChange(
                'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80',
              )
            }
            className="flex flex-col items-center gap-1 px-4 py-3 text-[11px] text-slate-500 transition-colors hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
          >
            <span className="text-2xl">+</span>
            <span>Subir foto</span>
          </button>
        )}
      </div>
    </div>
  )
}
