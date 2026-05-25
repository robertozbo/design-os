import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Home, MapPin, Video, X } from 'lucide-react'
import type {
  AttendanceType,
  ColorOption,
  DrawerDefaults,
  Servico,
  ServicoColorId,
  ServicoFormDraft,
} from '@/../product/sections/servi-os/types'

interface ServicoDrawerProps {
  /** When non-null, drawer is open. */
  mode: 'closed' | 'create' | 'edit'
  /** When mode='edit' or duplicate, the servico to pre-fill from. */
  initial: Servico | null
  /** When duplicating, append this suffix to the name (e.g. "(cópia)"). */
  duplicateSuffix?: string
  defaults: DrawerDefaults
  onClose: () => void
  onSubmit: (draft: ServicoFormDraft) => void
}

const ATTENDANCE_ICON: Record<AttendanceType, typeof MapPin> = {
  presencial: MapPin,
  teleconsulta: Video,
  domicilio: Home,
}

export function ServicoDrawer({
  mode,
  initial,
  duplicateSuffix,
  defaults,
  onClose,
  onSubmit,
}: ServicoDrawerProps) {
  const [draft, setDraft] = useState<ServicoFormDraft>(() => makeInitialDraft(initial, defaults, duplicateSuffix))

  // Reset draft when mode/initial changes
  useEffect(() => {
    if (mode !== 'closed') {
      setDraft(makeInitialDraft(initial, defaults, duplicateSuffix))
    }
  }, [mode, initial, defaults, duplicateSuffix])

  // Lock body scroll while open
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

  const isEdit = mode === 'edit'
  const title = isEdit ? 'Editar serviço' : 'Novo serviço'
  const canSave = draft.name.trim().length > 0 && draft.price >= 0

  function update<K extends keyof ServicoFormDraft>(key: K, value: ServicoFormDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSave) return
    onSubmit({ ...draft, name: draft.name.trim() })
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
      />

      <DrawerStyles />

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
        aria-label={title}
      >

        {/* Header */}
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
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-6 px-6 py-5">
            {/* Name */}
            <Field label="Nome" required>
              <input
                type="text"
                required
                autoFocus
                value={draft.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Ex.: Consulta inicial"
                className={inputClass}
              />
            </Field>

            {/* Description */}
            <Field label="Descrição" hint="Texto livre — explique o que está incluído neste serviço.">
              <textarea
                value={draft.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Ex.: Anamnese + plano alimentar + 30min de orientações."
                rows={3}
                className={`${inputClass} resize-none leading-relaxed`}
              />
            </Field>

            {/* Duration */}
            <Field label="Duração">
              <select
                value={draft.defaultDurationMin}
                onChange={(e) => update('defaultDurationMin', Number(e.target.value))}
                className={inputClass}
              >
                {defaults.durationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>

            {/* Attendance */}
            <Field label="Tipo de atendimento">
              <div className="grid grid-cols-3 gap-2">
                {defaults.attendanceOptions.map((opt) => {
                  const Icon = ATTENDANCE_ICON[opt.id]
                  const active = draft.defaultAttendanceType === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => update('defaultAttendanceType', opt.id)}
                      className={`
                        flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs transition-all
                        ${
                          active
                            ? 'border-teal-500 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20 dark:bg-teal-900/20 dark:text-teal-100'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600'
                        }
                      `}
                    >
                      <Icon size={16} />
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </Field>

            {/* Price */}
            <Field label="Preço">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-400 dark:text-slate-500">
                  R$
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={draft.price}
                  onChange={(e) => update('price', Number(e.target.value))}
                  className={`${inputClass} pl-10 font-mono tabular-nums`}
                />
              </div>
            </Field>

            {/* Color */}
            <Field label="Cor no calendário">
              <ColorPicker
                colorOptions={defaults.colorOptions}
                selected={draft.color}
                onChange={(id) => update('color', id)}
              />
            </Field>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors
                hover:bg-slate-100 hover:text-slate-900
                dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50
              "
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
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                dark:focus:ring-offset-slate-950
              "
            >
              {isEdit ? 'Salvar alterações' : 'Criar serviço'}
            </button>
          </footer>
        </form>
      </aside>
    </div>,
    document.body,
  )
}

const inputClass = `
  block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
  text-slate-900 placeholder:text-slate-400
  focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-600
`

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
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
        {hint && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500">{hint}</span>
        )}
      </div>
      {children}
    </label>
  )
}

function ColorPicker({
  colorOptions,
  selected,
  onChange,
}: {
  colorOptions: ColorOption[]
  selected: ServicoColorId
  onChange: (id: ServicoColorId) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {colorOptions.map((c) => {
        const isActive = c.id === selected
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            aria-label={c.label}
            aria-pressed={isActive}
            style={{ backgroundColor: c.hex }}
            className={`
              h-8 w-8 rounded-full transition-all
              ${
                isActive
                  ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-slate-50 dark:ring-offset-slate-950'
                  : 'ring-1 ring-black/10 hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600'
              }
            `}
          />
        )
      })}
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

function makeInitialDraft(
  initial: Servico | null,
  defaults: DrawerDefaults,
  duplicateSuffix?: string,
): ServicoFormDraft {
  if (initial) {
    return {
      name: duplicateSuffix ? `${initial.name} ${duplicateSuffix}` : initial.name,
      description: initial.description,
      defaultDurationMin: initial.defaultDurationMin,
      defaultAttendanceType: initial.defaultAttendanceType,
      price: initial.price,
      color: initial.color,
    }
  }
  return {
    name: '',
    description: '',
    defaultDurationMin: defaults.defaultDuration,
    defaultAttendanceType: defaults.defaultAttendanceType,
    price: 0,
    color: defaults.defaultColor,
  }
}
