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

export function TextArea({
  label,
  hint,
  valor,
  onChange,
  linhas = 2,
  placeholder,
}: {
  label: string
  hint?: string
  valor: string
  onChange: (v: string) => void
  linhas?: number
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </span>
      <textarea
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        rows={linhas}
        placeholder={placeholder}
        className="mt-1 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs leading-relaxed text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-600"
      />
    </label>
  )
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string
  value: T
  options: { id: T; label: string }[]
  onChange: (id: T) => void
  hint?: string
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition-colors focus:border-teal-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && (
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {hint}
        </p>
      )}
    </label>
  )
}

/** Campo que veio do cadastro do paciente e não se edita aqui — só se confere. */
export function ValorDoCadastro({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div className="mt-1 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/40">
        <span
          title={valor}
          className="min-w-0 truncate font-mono text-sm tabular-nums text-slate-600 dark:text-slate-300"
        >
          {valor}
        </span>
        <span className="shrink-0 rounded bg-white px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:bg-slate-900">
          cadastro
        </span>
      </div>
    </div>
  )
}

/**
 * Slot de foto do acompanhamento. No protótipo é um marcador — o que a tela precisa provar é que
 * as três vistas existem e são pareáveis com as da avaliação anterior, não o upload em si.
 */
export function PhotoSlot({
  label,
  preenchida,
  onToggle,
}: {
  label: string
  preenchida: boolean
  onToggle: () => void
}) {
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <button
        type="button"
        onClick={onToggle}
        className={`flex aspect-[3/4] w-full items-center justify-center rounded-xl border-2 border-dashed text-[11px] transition-colors ${
          preenchida
            ? 'border-teal-300 bg-gradient-to-b from-teal-50 to-slate-100 text-teal-700 dark:border-teal-700 dark:from-teal-950/40 dark:to-slate-900 dark:text-teal-300'
            : 'border-slate-200 bg-slate-50 text-slate-400 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:text-teal-400'
        }`}
      >
        {preenchida ? 'Foto anexada · remover' : '+ Anexar'}
      </button>
    </div>
  )
}

/** Seletor 0–3 do FMS. Zero não é "ruim": é dor durante o teste. */
export function ScorePicker({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-md ring-1 ring-inset ring-slate-200 dark:ring-slate-700">
      {[0, 1, 2, 3].map((s) => {
        const ativo = value === s
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            title={s === 0 ? 'Dor durante o teste' : undefined}
            className={`h-7 w-7 font-mono text-[12px] font-semibold tabular-nums transition-colors ${
              ativo
                ? s === 0
                  ? 'bg-rose-500 text-white'
                  : 'bg-teal-500 text-white'
                : 'bg-white text-slate-500 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            {s}
          </button>
        )
      })}
    </div>
  )
}

export function SubTitulo({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
      {children}
    </p>
  )
}
