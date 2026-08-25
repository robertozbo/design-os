import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Classificacao } from './formulas'
import { TOM_BADGE } from './helpers'

interface NumberInputProps {
  label: string
  value: number | null
  unit?: string
  step?: number
  min?: number
  max?: number
  placeholder?: string
  hint?: string
  onChange?: (value: number | null) => void
  /** Campo derivado: read-only, em teal, e nunca aceita digitação. */
  computed?: boolean
  /** Sítio exigido pelo protocolo escolhido. */
  destaque?: boolean
  /** Sítio que o protocolo não usa: continua editável, mas sai do primeiro plano. */
  apagado?: boolean
}

/**
 * O campo numérico de toda a avaliação.
 *
 * A validação é por faixa, não por `required`: nenhuma medida é obrigatória — a avaliação
 * antropométrica que só coletou peso e cintura ainda vale. O que não pode passar é um valor
 * impossível (dobra de 300 mm) entrando no cálculo como se fosse medida.
 */
export function NumberInput({
  label,
  value,
  unit,
  step = 0.1,
  min,
  max,
  placeholder,
  hint,
  onChange,
  computed,
  destaque,
  apagado,
}: NumberInputProps) {
  const foraDaFaixa =
    value != null && ((min != null && value < min) || (max != null && value > max))

  const erro = foraDaFaixa
    ? min != null && max != null
      ? `valor entre ${min} e ${max}`
      : max != null
        ? `máx ${max}`
        : `mín ${min}`
    : null

  return (
    <label
      className={`block transition-opacity ${
        apagado ? 'opacity-40 hover:opacity-100 focus-within:opacity-100' : ''
      }`}
    >
      <span className="flex items-center gap-1.5">
        {destaque && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />}
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </span>
      <div
        className={`mt-1 flex items-center rounded-lg border bg-white pr-3 transition-colors dark:bg-slate-900 ${
          foraDaFaixa
            ? 'border-rose-400 dark:border-rose-700'
            : computed
              ? 'border-teal-200 bg-teal-50/40 dark:border-teal-900/50 dark:bg-teal-900/10'
              : destaque
                ? 'border-teal-400 ring-1 ring-teal-300 dark:border-teal-600 dark:ring-teal-800'
                : 'border-slate-200 focus-within:border-teal-400 dark:border-slate-800 dark:focus-within:border-teal-600'
        }`}
      >
        <input
          type="number"
          step={step}
          value={value ?? ''}
          readOnly={computed}
          placeholder={placeholder ?? '—'}
          onChange={(e) => {
            if (!onChange) return
            const bruto = e.target.value
            if (bruto === '') return onChange(null)
            const v = Number(bruto)
            onChange(Number.isFinite(v) ? v : null)
          }}
          className={`w-full min-w-0 flex-1 border-none bg-transparent px-3 py-2 font-mono text-sm tabular-nums text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-50 dark:placeholder:text-slate-600 ${
            computed ? 'text-teal-800 dark:text-teal-200' : ''
          }`}
        />
        {unit && (
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {unit}
          </span>
        )}
      </div>
      {erro ? (
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-rose-600 dark:text-rose-400">
          {erro}
        </p>
      ) : (
        hint && (
          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {hint}
          </p>
        )
      )}
    </label>
  )
}

export function CollapsibleBlock({
  title,
  description,
  badge,
  defaultOpen = false,
  active,
  children,
}: {
  title: string
  description?: string
  badge?: ReactNode
  defaultOpen?: boolean
  active?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <article
      className={`overflow-hidden rounded-2xl border transition-colors ${
        active
          ? 'border-teal-200 bg-teal-50/20 dark:border-teal-900/50 dark:bg-teal-900/5'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">{title}</p>
            {badge}
          </div>
          {description && (
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform dark:text-slate-500 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-slate-100 px-4 py-4 dark:border-slate-800">{children}</div>
      )}
    </article>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
}) {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
      {options.map((opt) => {
        const ativo = value === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              ativo
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/** Badge de classificação. Sem classificação não há badge — nunca um "—" pintado de verde. */
export function ClassBadge({
  prefixo,
  classificacao,
}: {
  prefixo?: string
  classificacao: Classificacao | null
}) {
  if (!classificacao) return null
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        TOM_BADGE[classificacao.tom]
      }`}
    >
      {prefixo ? `${prefixo} · ` : ''}
      {classificacao.label}
    </span>
  )
}

export function SubTitulo({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
      {children}
    </p>
  )
}
