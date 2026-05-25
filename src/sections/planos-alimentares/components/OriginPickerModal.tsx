import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowRight,
  Copy,
  FileText,
  LayoutTemplate,
  Search,
  Star,
  X,
} from 'lucide-react'
import type {
  ObjetivoOption,
  PatientLite,
  PlanoSummary,
  TemplateSummary,
} from '@/../product/sections/planos-alimentares/types'
import { Avatar } from './Avatar'
import { ObjetivoBadge } from './ObjetivoBadge'

interface OriginPickerModalProps {
  open: boolean
  templates: TemplateSummary[]
  planos: PlanoSummary[]
  patients: PatientLite[]
  objetivoOptions: ObjetivoOption[]
  onClose: () => void
  onPickBlank: () => void
  onPickTemplate: (templateId: string) => void
  onPickPlano: (planoId: string) => void
}

type Step = 'origin' | 'template' | 'plano'

export function OriginPickerModal({
  open,
  templates,
  planos,
  patients,
  objetivoOptions,
  onClose,
  onPickBlank,
  onPickTemplate,
  onPickPlano,
}: OriginPickerModalProps) {
  const [step, setStep] = useState<Step>('origin')
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    setStep('origin')
    setQuery('')
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  const patientsById = useMemo(
    () => Object.fromEntries(patients.map((p) => [p.id, p])),
    [patients],
  )

  const sortedTemplates = useMemo(() => {
    const list = [...templates].sort((a, b) => {
      // favorites first, then most applied, then most recent
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
      if (b.applicationsCount !== a.applicationsCount)
        return b.applicationsCount - a.applicationsCount
      return b.lastEditedAt.localeCompare(a.lastEditedAt)
    })
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((t) => t.name.toLowerCase().includes(q))
  }, [templates, query])

  const sortedPlanos = useMemo(() => {
    const list = [...planos]
      .filter((p) => p.status !== 'arquivado')
      .sort((a, b) => {
        if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
        return b.lastEditedAt.localeCompare(a.lastEditedAt)
      })
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((p) => {
      const patient = patientsById[p.patientId]
      return (
        p.name.toLowerCase().includes(q) ||
        (patient?.name.toLowerCase().includes(q) ?? false)
      )
    })
  }, [planos, query, patientsById])

  if (!open) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[10vh]">
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
        aria-label="Como criar o plano"
        style={{ animation: 'nymos-modal-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        className="
          relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl
          dark:border-slate-800 dark:bg-slate-950
        "
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Novo plano
            </p>
            <h2 className="mt-0.5 text-base font-semibold text-slate-900 dark:text-slate-50">
              {step === 'origin' && 'Como você quer começar?'}
              {step === 'template' && 'Escolha um template'}
              {step === 'plano' && 'Copiar de qual plano?'}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {step !== 'origin' && (
              <button
                type="button"
                onClick={() => {
                  setStep('origin')
                  setQuery('')
                }}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                ← Voltar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* Body — depends on step */}
        {step === 'origin' && (
          <div className="space-y-2 p-3">
            <OriginOption
              icon={<FileText size={18} />}
              title="Em branco"
              description="Comece zerado e monte cada refeição do zero."
              onClick={() => {
                onPickBlank()
              }}
            />
            <OriginOption
              icon={<LayoutTemplate size={18} />}
              title="A partir de um template"
              description={`Use um dos ${templates.length} templates do seu catálogo.`}
              onClick={() => setStep('template')}
              accent
            />
            <OriginOption
              icon={<Copy size={18} />}
              title="Copiar de outro plano"
              description="Reutilize um plano que já criou pra outro paciente."
              onClick={() => setStep('plano')}
            />
          </div>
        )}

        {step !== 'origin' && (
          <>
            {/* Search */}
            <div className="border-b border-slate-200 px-5 py-3 dark:border-slate-800">
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={step === 'template' ? 'Buscar template…' : 'Buscar plano ou paciente…'}
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
              {step === 'template' ? (
                sortedTemplates.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Nenhum template encontrado.
                  </p>
                ) : (
                  <ul className="space-y-0.5">
                    {sortedTemplates.map((t) => (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => onPickTemplate(t.id)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/20"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            <LayoutTemplate size={14} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              {t.isFavorite && (
                                <Star size={11} className="shrink-0 fill-amber-400 text-amber-400" />
                              )}
                              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
                                {t.name}
                              </p>
                            </div>
                            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-mono text-[10px] tabular-nums text-slate-500 dark:text-slate-400">
                              {t.targets && <span>{t.targets.kcal} kcal</span>}
                              <span>{t.applicationsCount} aplicações</span>
                            </div>
                          </div>
                          {t.objetivo && (
                            <ObjetivoBadge objetivo={t.objetivo} options={objetivoOptions} />
                          )}
                          <ArrowRight size={13} className="shrink-0 text-slate-400" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )
              ) : sortedPlanos.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  Nenhum plano encontrado.
                </p>
              ) : (
                <ul className="space-y-0.5">
                  {sortedPlanos.map((p) => {
                    const patient = patientsById[p.patientId]
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => onPickPlano(p.id)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/20"
                        >
                          {patient ? (
                            <Avatar initials={patient.avatarInitials} color={patient.avatarColor} size="sm" />
                          ) : (
                            <span className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              {p.isFavorite && (
                                <Star size={11} className="shrink-0 fill-amber-400 text-amber-400" />
                              )}
                              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
                                {p.name}
                              </p>
                            </div>
                            <p className="font-mono text-[10px] tabular-nums uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {patient?.name ?? '—'} · {p.targets?.kcal ?? '—'} kcal
                            </p>
                          </div>
                          {p.objetivo && (
                            <ObjetivoBadge objetivo={p.objetivo} options={objetivoOptions} />
                          )}
                          <ArrowRight size={13} className="shrink-0 text-slate-400" />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="border-t border-slate-200 px-5 py-3 dark:border-slate-800">
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {step === 'origin'
              ? 'Em qualquer caso, você escolhe o paciente no próximo passo'
              : 'Próximo passo: escolher o paciente'}
          </p>
        </footer>
      </div>
    </div>,
    document.body,
  )
}

function OriginOption({
  icon,
  title,
  description,
  accent,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  accent?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all
        ${
          accent
            ? 'border-teal-200 bg-teal-50/40 hover:border-teal-300 hover:bg-teal-50 dark:border-teal-900/60 dark:bg-teal-900/10 dark:hover:bg-teal-900/20'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800/40'
        }
      `}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          accent
            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
        }`}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{title}</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <ArrowRight size={16} className="mt-1 shrink-0 text-slate-400" />
    </button>
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
