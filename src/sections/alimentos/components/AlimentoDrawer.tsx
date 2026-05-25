import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Copy,
  ExternalLink,
  Pencil,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import type {
  Alimento,
  AlimentoFormDraft,
  CategoryId,
  DrawerDefaults,
  DrawerMode,
} from '@/../product/sections/alimentos/types'

interface AlimentoDrawerProps {
  mode: DrawerMode
  /** For view/edit: the existing alimento. For create-from-duplicate: source TBCA item to seed. */
  alimento: Alimento | null
  /** When true (with mode='create' and an alimento), pre-fills form with "(custom)" suffix. */
  duplicateFromTbca?: boolean
  defaults: DrawerDefaults
  /** Map of category id → display label for badges. */
  categoryLabels: Record<CategoryId, string>
  onClose: () => void
  onCreate?: (draft: AlimentoFormDraft) => void
  onUpdate?: (alimentoId: string, draft: AlimentoFormDraft) => void
  onEdit?: (alimentoId: string) => void
  onDuplicateAsCustom?: (alimentoId: string) => void
  onRequestDelete?: (alimentoId: string) => void
  onToggleFavorite?: (alimentoId: string) => void
}

export function AlimentoDrawer(props: AlimentoDrawerProps) {
  const { mode, onClose } = props

  // Lock body scroll + ESC
  useEffect(() => {
    if (mode === 'closed') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKey)
    }
  }, [mode, onClose])

  if (mode === 'closed') return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <DrawerStyles />

      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
      />

      {/* Drawer */}
      <aside
        style={{ animation: 'nymos-drawer-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        className="
          ml-auto flex h-full w-full max-w-[480px] flex-col
          border-l border-slate-200 bg-white shadow-2xl
          dark:border-slate-800 dark:bg-slate-950
        "
        role="dialog"
        aria-modal="true"
      >
        {mode === 'view' && props.alimento ? (
          <ViewMode {...props} alimento={props.alimento} />
        ) : (
          <FormMode {...props} />
        )}
      </aside>
    </div>,
    document.body,
  )
}

// ===== View mode =====

function ViewMode({
  alimento,
  categoryLabels,
  onClose,
  onEdit,
  onDuplicateAsCustom,
  onRequestDelete,
  onToggleFavorite,
}: AlimentoDrawerProps & { alimento: Alimento }) {
  const isCustom = alimento.source === 'custom'
  const portion = alimento.defaultPortion
  const factor = portion.grams / 100

  const portionMacros = {
    kcal: alimento.kcalPer100g * factor,
    protein: alimento.proteinPer100g * factor,
    carb: alimento.carbPer100g * factor,
    fat: alimento.fatPer100g * factor,
    fiber: alimento.fiberPer100g * factor,
  }

  return (
    <>
      {/* Header */}
      <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Detalhe
          </p>
          <h2 className="mt-0.5 text-lg font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
            {alimento.name}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {categoryLabels[alimento.category]}
            </span>
            <span
              className={`
                inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider
                ${
                  isCustom
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                    : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                }
              `}
            >
              {isCustom && <Sparkles size={9} />}
              {isCustom ? 'Customizado' : 'TBCA'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleFavorite?.(alimento.id)}
            aria-label={alimento.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Star
              size={16}
              className={
                alimento.isFavorite
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-400 dark:text-slate-500'
              }
            />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        {/* Por 100g */}
        <section>
          <SectionTitle>Por 100g</SectionTitle>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="font-mono text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {fmt(alimento.kcalPer100g)}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Kcal
                </div>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">por 100g</span>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
              <MacroCell label="P" value={alimento.proteinPer100g} unit="g" tone="rose" />
              <MacroCell label="C" value={alimento.carbPer100g} unit="g" tone="amber" />
              <MacroCell label="G" value={alimento.fatPer100g} unit="g" tone="violet" />
              <MacroCell label="Fibra" value={alimento.fiberPer100g} unit="g" tone="emerald" />
            </div>
          </div>
        </section>

        {/* Porção padrão */}
        <section>
          <SectionTitle>Porção padrão</SectionTitle>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {portion.label}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {portion.grams}g
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {fmt(portionMacros.kcal)}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  kcal
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
              <MacroCell label="P" value={portionMacros.protein} unit="g" tone="rose" small />
              <MacroCell label="C" value={portionMacros.carb} unit="g" tone="amber" small />
              <MacroCell label="G" value={portionMacros.fat} unit="g" tone="violet" small />
              <MacroCell label="Fibra" value={portionMacros.fiber} unit="g" tone="emerald" small />
            </div>
          </div>
        </section>

        {alimento.linkedPlansCount > 0 && (
          <p className="font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
            Usado em {alimento.linkedPlansCount} plano{alimento.linkedPlansCount === 1 ? '' : 's'} alimentar
            {alimento.linkedPlansCount === 1 ? '' : 'es'} ativo{alimento.linkedPlansCount === 1 ? '' : 's'}.
          </p>
        )}

        {/* Source attribution */}
        <SourceAttribution source={alimento.source} />
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
        {isCustom ? (
          <>
            <button
              type="button"
              onClick={() => onRequestDelete?.(alimento.id)}
              className="
                inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium
                text-rose-600 transition-colors hover:bg-rose-50
                dark:text-rose-400 dark:hover:bg-rose-900/30
              "
            >
              <Trash2 size={14} />
              Excluir
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={() => onEdit?.(alimento.id)}
              className="
                inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm
                hover:bg-teal-700
              "
            >
              <Pencil size={14} />
              Editar
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={() => onDuplicateAsCustom?.(alimento.id)}
              className="
                inline-flex items-center gap-1.5 rounded-lg border border-teal-300 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800
                hover:bg-teal-100
                dark:border-teal-800 dark:bg-teal-900/30 dark:text-teal-200 dark:hover:bg-teal-900/50
              "
            >
              <Copy size={14} />
              Duplicar como customizado
            </button>
          </>
        )}
      </footer>
    </>
  )
}

// ===== Form mode (create / edit) =====

function FormMode({
  mode,
  alimento,
  duplicateFromTbca,
  defaults,
  onClose,
  onCreate,
  onUpdate,
}: AlimentoDrawerProps) {
  const initial = useMemo<AlimentoFormDraft>(() => {
    if (alimento) {
      return {
        name: duplicateFromTbca ? `${alimento.name} (custom)` : alimento.name,
        category: alimento.category,
        kcalPer100g: alimento.kcalPer100g,
        proteinPer100g: alimento.proteinPer100g,
        carbPer100g: alimento.carbPer100g,
        fatPer100g: alimento.fatPer100g,
        fiberPer100g: alimento.fiberPer100g,
        portionLabel: alimento.defaultPortion.label,
        portionGrams: alimento.defaultPortion.grams,
      }
    }
    return {
      name: '',
      category: defaults.defaultCategory,
      kcalPer100g: 0,
      proteinPer100g: 0,
      carbPer100g: 0,
      fatPer100g: 0,
      fiberPer100g: 0,
      portionLabel: '',
      portionGrams: defaults.portionGramsPlaceholder,
    }
  }, [alimento, duplicateFromTbca, defaults])

  const [draft, setDraft] = useState<AlimentoFormDraft>(initial)

  // Reset draft when initial changes (mode/alimento switch)
  useEffect(() => {
    setDraft(initial)
  }, [initial])

  const isEdit = mode === 'edit'
  const title = isEdit ? 'Editar customizado' : 'Novo customizado'
  const canSave =
    draft.name.trim().length > 0 &&
    draft.kcalPer100g >= 0 &&
    draft.portionLabel.trim().length > 0 &&
    draft.portionGrams > 0

  function update<K extends keyof AlimentoFormDraft>(key: K, value: AlimentoFormDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSave) return
    if (isEdit && alimento) {
      onUpdate?.(alimento.id, { ...draft, name: draft.name.trim() })
    } else {
      onCreate?.({ ...draft, name: draft.name.trim() })
    }
  }

  return (
    <>
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {isEdit ? 'Editar' : 'Cadastrar'}
          </p>
          <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex-1 space-y-5 px-6 py-5">
          <Field label="Nome" required>
            <input
              type="text"
              required
              autoFocus
              value={draft.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Ex.: Whey Protein concentrado"
              className={inputClass}
            />
          </Field>

          <Field label="Categoria">
            <select
              value={draft.category}
              onChange={(e) => update('category', e.target.value as CategoryId)}
              className={inputClass}
            >
              {defaults.categoryOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          <SectionTitle>Porção padrão</SectionTitle>
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <Field label="Descrição" required>
              <input
                type="text"
                required
                value={draft.portionLabel}
                onChange={(e) => update('portionLabel', e.target.value)}
                placeholder={defaults.portionLabelPlaceholder}
                className={inputClass}
              />
            </Field>
            <Field label="Gramas" required>
              <div className="relative w-28">
                <input
                  type="number"
                  required
                  min={1}
                  step="1"
                  value={draft.portionGrams}
                  onChange={(e) => update('portionGrams', Number(e.target.value))}
                  className={`${inputClass} pr-7 font-mono tabular-nums`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400 dark:text-slate-500">
                  g
                </span>
              </div>
            </Field>
          </div>

          <SectionTitle>Macros por 100g</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Calorias (kcal)"
              value={draft.kcalPer100g}
              onChange={(v) => update('kcalPer100g', v)}
              suffix="kcal"
            />
            <NumberField
              label="Proteína"
              value={draft.proteinPer100g}
              onChange={(v) => update('proteinPer100g', v)}
              suffix="g"
            />
            <NumberField
              label="Carboidrato"
              value={draft.carbPer100g}
              onChange={(v) => update('carbPer100g', v)}
              suffix="g"
            />
            <NumberField
              label="Gordura"
              value={draft.fatPer100g}
              onChange={(v) => update('fatPer100g', v)}
              suffix="g"
            />
            <NumberField
              label="Fibra"
              value={draft.fiberPer100g}
              onChange={(v) => update('fiberPer100g', v)}
              suffix="g"
            />
          </div>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canSave}
            className="
              rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all
              hover:bg-teal-700 active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {isEdit ? 'Salvar alterações' : 'Criar customizado'}
          </button>
        </footer>
      </form>
    </>
  )
}

// ===== Source attribution =====

function SourceAttribution({ source }: { source: 'tbca' | 'custom' }) {
  if (source === 'tbca') {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-[11px] leading-relaxed text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
        <p>
          Fonte: <strong className="text-slate-700 dark:text-slate-300">TBCA</strong> — Tabela Brasileira de Composição de Alimentos, mantida pelo Centro de Pesquisa em Alimentos (FoRC) da USP.
        </p>
        <a
          href="https://www.tbca.net.br"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-teal-700 hover:text-teal-800 hover:underline dark:text-teal-400 dark:hover:text-teal-300"
        >
          <ExternalLink size={10} />
          tbca.net.br
        </a>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50/60 px-3 py-2.5 text-[11px] leading-relaxed text-teal-800 dark:border-teal-900/60 dark:bg-teal-900/20 dark:text-teal-200">
      <p>
        <Sparkles size={10} className="mr-1 inline -translate-y-px" />
        Customizado por você. Visível apenas na sua conta.
      </p>
    </div>
  )
}

// ===== Reusable bits =====

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </span>
      </div>
      {children}
    </label>
  )
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  suffix: string
}) {
  return (
    <Field label={label}>
      <div className="relative">
        <input
          type="number"
          min={0}
          step="0.1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`${inputClass} pr-10 font-mono tabular-nums`}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400 dark:text-slate-500">
          {suffix}
        </span>
      </div>
    </Field>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
      {children}
    </p>
  )
}

function MacroCell({
  label,
  value,
  unit,
  tone,
  small,
}: {
  label: string
  value: number
  unit: string
  tone: 'rose' | 'amber' | 'violet' | 'emerald'
  small?: boolean
}) {
  const TONE: Record<typeof tone, string> = {
    rose: 'text-rose-600 dark:text-rose-400',
    amber: 'text-amber-600 dark:text-amber-400',
    violet: 'text-violet-600 dark:text-violet-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
  }
  return (
    <div className="text-center">
      <div className={`font-mono ${small ? 'text-sm' : 'text-base'} font-semibold tabular-nums text-slate-900 dark:text-slate-50`}>
        {fmt(value)}
        <span className="ml-0.5 text-[9px] font-normal text-slate-400 dark:text-slate-500">{unit}</span>
      </div>
      <div className={`font-mono text-[9px] uppercase tracking-wider ${TONE[tone]}`}>{label}</div>
    </div>
  )
}

function DrawerStyles() {
  return (
    <style>{`
      @keyframes nymos-drawer-in {
        from { transform: translateX(100%); opacity: 0; }
        to   { transform: translateX(0); opacity: 1; }
      }
    `}</style>
  )
}

const inputClass = `
  block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
  text-slate-900 placeholder:text-slate-400
  focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-600
`

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}
