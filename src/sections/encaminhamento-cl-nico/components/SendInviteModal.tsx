import { Send, ShieldCheck, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type {
  InvitePayload,
  Language,
  PartnerProfessional,
  Referral,
} from '@/../product/sections/encaminhamento-cl-nico/types'
import {
  INVITE_TEMPLATES,
  LANGUAGE_LABEL,
  getInitials,
} from './utils'

interface SendInviteModalProps {
  referral: Referral
  partners: PartnerProfessional[]
  onClose: () => void
  onConfirm: (payload: InvitePayload) => void
}

const LANGUAGES: Language[] = ['pt', 'en', 'es']

export function SendInviteModal({ referral, partners, onClose, onConfirm }: SendInviteModalProps) {
  const [language, setLanguage] = useState<Language>('pt')
  const [message, setMessage] = useState('')
  const [assignedId, setAssignedId] = useState<string | undefined>(
    referral.assignedProfessionalId ?? undefined,
  )

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
            bg-teal-50 dark:bg-teal-950/40
            ring-1 ring-teal-200 dark:ring-teal-900/60
            flex items-center justify-center
          ">
            <Send className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Enviar convite de consentimento
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

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div>
            <label className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-500">
              Idioma da mensagem
            </label>
            <div className="mt-2 inline-flex rounded-lg ring-1 ring-slate-200 dark:ring-slate-700 p-0.5 bg-slate-50 dark:bg-slate-900/60">
              {LANGUAGES.map((lang) => {
                const active = language === lang
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`
                      px-3 py-1.5 rounded-md text-xs font-medium
                      transition-all duration-150
                      ${active
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm shadow-slate-900/5'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}
                    `}
                  >
                    {LANGUAGE_LABEL[lang].flag} · {LANGUAGE_LABEL[lang].label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-500">
              Prévia da mensagem
            </label>
            <div className="
              mt-2 rounded-xl
              bg-gradient-to-br from-violet-50/60 via-white to-teal-50/40
              dark:from-violet-950/30 dark:via-slate-900 dark:to-teal-950/30
              ring-1 ring-violet-200/60 dark:ring-violet-900/40
              p-4
            ">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {INVITE_TEMPLATES[language]}
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-violet-700 dark:text-violet-300">
                <ShieldCheck className="w-3 h-3" strokeWidth={2} />
                Mensagem padrão validada com a equipe clínica
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="invite-message" className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-500">
              Mensagem opcional do SST
            </label>
            <textarea
              id="invite-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Adicionar uma nota pessoal e respeitosa (opcional)…"
              rows={3}
              className="
                mt-2 block w-full
                rounded-lg
                bg-white dark:bg-slate-900
                ring-1 ring-slate-200 dark:ring-slate-700
                px-3 py-2 text-sm
                text-slate-900 dark:text-slate-100
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                focus:outline-none focus:ring-2 focus:ring-teal-500
                resize-none
              "
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-500">
              Profissional clínico (opcional)
            </label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <ProfessionalChoice
                selected={assignedId === undefined}
                onClick={() => setAssignedId(undefined)}
                label="Atribuir depois"
                description="Decidir após o aceite"
              />
              {partners.filter((p) => p.available).slice(0, 3).map((p) => (
                <ProfessionalChoice
                  key={p.id}
                  selected={assignedId === p.id}
                  onClick={() => setAssignedId(p.id)}
                  initials={getInitials(p.name)}
                  label={p.name}
                  description={p.specialty}
                />
              ))}
            </div>
          </div>
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
            onClick={() => onConfirm({ message: message || undefined, language, assignedProfessionalId: assignedId })}
            className="
              inline-flex items-center justify-center gap-1.5
              px-3.5 py-2 rounded-lg
              text-xs font-semibold
              bg-teal-600 hover:bg-teal-700
              dark:bg-teal-500 dark:hover:bg-teal-400
              text-white dark:text-slate-950
              shadow-sm transition-all duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
            "
          >
            <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
            Enviar convite
          </button>
        </footer>
      </div>
    </div>
  )
}

interface ProfessionalChoiceProps {
  selected: boolean
  onClick: () => void
  label: string
  description: string
  initials?: string
}

function ProfessionalChoice({ selected, onClick, label, description, initials }: ProfessionalChoiceProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-2.5
        px-3 py-2 rounded-lg text-left
        ring-1 transition-all duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
        ${selected
          ? 'bg-teal-50 dark:bg-teal-950/40 ring-teal-300 dark:ring-teal-700'
          : 'bg-white dark:bg-slate-900 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-600'}
      `}
    >
      <div className={`
        shrink-0 w-7 h-7 rounded-full
        flex items-center justify-center
        ${selected
          ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}
      `}>
        <span className="text-[10px] font-semibold">
          {initials ?? '—'}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className={`text-xs font-medium truncate ${selected ? 'text-teal-700 dark:text-teal-300' : 'text-slate-900 dark:text-slate-100'}`}>
          {label}
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-500 truncate">
          {description}
        </div>
      </div>
    </button>
  )
}
