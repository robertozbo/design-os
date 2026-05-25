import { Check, UserPlus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type {
  PartnerProfessional,
  Referral,
} from '@/../product/sections/encaminhamento-cl-nico/types'
import { LANGUAGE_LABEL, getInitials } from './utils'

interface AssignProfessionalModalProps {
  referral: Referral
  partners: PartnerProfessional[]
  onClose: () => void
  onConfirm: (professionalId: string) => void
}

export function AssignProfessionalModal({
  referral,
  partners,
  onClose,
  onConfirm,
}: AssignProfessionalModalProps) {
  const [selected, setSelected] = useState<string | null>(referral.assignedProfessionalId ?? null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div
        className="
          relative w-full sm:max-w-lg
          bg-white dark:bg-slate-950
          rounded-t-2xl sm:rounded-2xl
          ring-1 ring-slate-200 dark:ring-slate-800
          shadow-2xl shadow-slate-900/10 dark:shadow-black/40
          animate-in slide-in-from-bottom-4 sm:zoom-in-95 fade-in duration-200
          flex flex-col max-h-[90vh]
        "
      >
        <header className="shrink-0 flex items-start gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="
            shrink-0 w-9 h-9 rounded-xl
            bg-emerald-50 dark:bg-emerald-950/40
            ring-1 ring-emerald-200 dark:ring-emerald-900/60
            flex items-center justify-center
          ">
            <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Atribuir profissional clínico
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-mono">{referral.codename}</span> · {referral.sector}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="
              shrink-0 inline-flex items-center justify-center
              w-8 h-8 rounded-lg
              text-slate-500 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-slate-800
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
            "
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <ol className="space-y-1.5">
            {partners.map((p) => {
              const isSelected = selected === p.id
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => p.available && setSelected(p.id)}
                    disabled={!p.available}
                    aria-pressed={isSelected}
                    className={`
                      w-full flex items-center gap-3
                      px-3 py-3 rounded-xl
                      ring-1 transition-all duration-150
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                      ${!p.available
                        ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900/40 ring-slate-200 dark:ring-slate-800'
                        : isSelected
                          ? 'bg-teal-50 dark:bg-teal-950/40 ring-teal-300 dark:ring-teal-700'
                          : 'bg-white dark:bg-slate-900 ring-slate-200 dark:ring-slate-800 hover:ring-slate-300 dark:hover:ring-slate-700'}
                    `}
                  >
                    <div className={`
                      shrink-0 w-10 h-10 rounded-full
                      flex items-center justify-center
                      ${isSelected
                        ? 'bg-teal-100 dark:bg-teal-900/60 ring-1 ring-teal-200 dark:ring-teal-700'
                        : 'bg-emerald-100 dark:bg-emerald-950/50 ring-1 ring-emerald-200 dark:ring-emerald-900/60'}
                    `}>
                      <span className={`text-xs font-semibold ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                        {getInitials(p.name)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {p.name}
                        </span>
                        {!p.available && (
                          <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-500">
                            Indisponível
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {p.specialty}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {p.languages.map((lang) => (
                          <span
                            key={lang}
                            className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            {LANGUAGE_LABEL[lang].flag}
                          </span>
                        ))}
                        <span className="text-[11px] tabular-nums text-slate-500 dark:text-slate-500 ml-1">
                          {p.activeCases} caso{p.activeCases === 1 ? '' : 's'} ativo{p.activeCases === 1 ? '' : 's'}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="shrink-0 w-6 h-6 rounded-full bg-teal-600 dark:bg-teal-500 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white dark:text-slate-950" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

        <footer className="shrink-0 flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <button
            type="button"
            onClick={onClose}
            className="
              inline-flex items-center justify-center
              px-3 py-2 rounded-lg
              text-xs font-medium
              text-slate-700 dark:text-slate-300
              ring-1 ring-slate-200 dark:ring-slate-700
              hover:bg-white dark:hover:bg-slate-900
              transition-all duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
            "
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!selected}
            onClick={() => selected && onConfirm(selected)}
            className="
              inline-flex items-center justify-center gap-1.5
              px-3.5 py-2 rounded-lg
              text-xs font-semibold
              bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700
              dark:bg-teal-500 dark:hover:bg-teal-400
              text-white dark:text-slate-950 disabled:cursor-not-allowed
              shadow-sm transition-all duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
            "
          >
            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
            Confirmar atribuição
          </button>
        </footer>
      </div>
    </div>
  )
}
