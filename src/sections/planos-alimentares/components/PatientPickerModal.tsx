import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Search, X } from 'lucide-react'
import type { PatientLite } from '@/../product/sections/planos-alimentares/types'
import { Avatar } from './Avatar'

interface PatientPickerModalProps {
  open: boolean
  /**
   * 'create' = brand new draft.
   * 'duplicate' = clone existing plan to another patient.
   * 'apply-template' = create a plan from a template for a patient.
   */
  mode?: 'create' | 'duplicate' | 'apply-template'
  /** When mode='duplicate' or 'apply-template', name of the source being copied/applied. */
  sourcePlanName?: string
  /** When mode='duplicate', exclude the current owner from the picker. */
  excludePatientId?: string
  patients: PatientLite[]
  /** Patients that already have an active vigente plan — shown with a tag and pushed to the bottom. */
  patientsWithActivePlan?: Set<string>
  onClose: () => void
  onPick: (patientId: string) => void
}

const MODE_COPY = {
  create: {
    eyebrow: 'Novo plano',
    title: 'Para qual paciente?',
    footer: 'Será criado um rascunho vazio · você completa no builder',
  },
  duplicate: {
    eyebrow: 'Duplicar plano',
    title: 'Duplicar para qual paciente?',
    footer: 'Será criada uma cópia em rascunho · você ajusta no builder',
  },
  'apply-template': {
    eyebrow: 'Aplicar template',
    title: 'Em qual paciente aplicar?',
    footer: 'Será criado um plano em rascunho · você ajusta no builder',
  },
} as const

export function PatientPickerModal({
  open,
  mode = 'create',
  sourcePlanName,
  excludePatientId,
  patients,
  patientsWithActivePlan,
  onClose,
  onPick,
}: PatientPickerModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    setQuery('')
    setTimeout(() => inputRef.current?.focus(), 50)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = excludePatientId
      ? patients.filter((p) => p.id !== excludePatientId)
      : patients
    const filtered = q ? base.filter((p) => p.name.toLowerCase().includes(q)) : base
    if (!patientsWithActivePlan) return filtered
    const noPlan: PatientLite[] = []
    const withPlan: PatientLite[] = []
    for (const p of filtered) {
      if (patientsWithActivePlan.has(p.id)) withPlan.push(p)
      else noPlan.push(p)
    }
    return [...noPlan, ...withPlan]
  }, [patients, query, excludePatientId, patientsWithActivePlan])

  const copy = MODE_COPY[mode]
  const showSource = (mode === 'duplicate' || mode === 'apply-template') && Boolean(sourcePlanName)
  const sourceLabel = mode === 'apply-template' ? 'Aplicando' : 'Copiando de'

  if (!open) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[15vh]">
      <ModalStyles />

      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Selecionar paciente"
        style={{ animation: 'nymos-modal-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        className="
          relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl
          dark:border-slate-800 dark:bg-slate-950
        "
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {copy.eyebrow}
            </p>
            <h2 className="mt-0.5 text-base font-semibold text-slate-900 dark:text-slate-50">
              {copy.title}
            </h2>
            {showSource && (
              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                {sourceLabel} <span className="font-medium text-slate-700 dark:text-slate-300">"{sourcePlanName}"</span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </header>

        {/* Search */}
        <div className="border-b border-slate-200 px-5 py-3 dark:border-slate-800">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar paciente…"
              className="
                block w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900
                placeholder:text-slate-400
                focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-600
              "
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-[50vh] overflow-y-auto px-2 py-2">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Nenhum paciente encontrado.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {results.map((p) => {
                const hasActive = patientsWithActivePlan?.has(p.id)
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => onPick(p.id)}
                      className="
                        flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors
                        hover:bg-teal-50 dark:hover:bg-teal-900/20
                      "
                    >
                      <Avatar initials={p.avatarInitials} color={p.avatarColor} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
                          {p.name}
                        </p>
                        {hasActive && (
                          <p className="font-mono text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            Já tem plano vigente
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 px-5 py-3 dark:border-slate-800">
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {copy.footer}
          </p>
        </footer>
      </div>
    </div>,
    document.body,
  )
}

function ModalStyles() {
  return (
    <style>{`
      @keyframes nymos-modal-in {
        from { opacity: 0; transform: scale(0.96) translateY(6px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }
    `}</style>
  )
}
