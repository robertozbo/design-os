import { useState } from 'react'
import { X, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { LinkRequestModalContent, ProfessionalVertical } from '@/../product/sections/profissionais/types'

const VERTICAL_LABEL: Record<ProfessionalVertical, string> = {
  nutrition: 'nutricionista',
  personal: 'personal',
  psychology: 'psicólogo',
  clinical: 'médico',
}

const VERTICAL_CATEGORIES: Record<ProfessionalVertical, string> = {
  nutrition: 'Métricas, Nutrição, Composição',
  personal: 'Métricas, Atividades, Composição',
  psychology: 'Saúde mental, Métricas',
  clinical: 'Métricas, Exames, Atividades, Medicação',
}

export interface LinkRequestModalProps {
  isOpen: boolean
  content: LinkRequestModalContent
  /** If "visitor" — render the signup state. If "logged" — direct request. */
  mode: 'visitor' | 'logged'
  /** Who is being requested */
  professionalName: string
  professionalVertical: ProfessionalVertical
  /** Show success screen after submission */
  succeeded?: boolean
  firstNameAfterSubmit?: string
  onClose?: () => void
  onSubmit?: (payload: { name?: string; email?: string; phone?: string; message?: string; acceptedTerms?: boolean }) => void
  onLoginClick?: () => void
  onAdjustPermissions?: () => void
}

export function LinkRequestModal({
  isOpen,
  content,
  mode,
  professionalName,
  professionalVertical,
  succeeded = false,
  firstNameAfterSubmit,
  onClose,
  onSubmit,
  onLoginClick,
  onAdjustPermissions,
}: LinkRequestModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [accepted, setAccepted] = useState(false)

  if (!isOpen) return null

  const verticalLabel = VERTICAL_LABEL[professionalVertical]
  const recommendedCats = VERTICAL_CATEGORIES[professionalVertical]

  const canSubmit = mode === 'logged'
    ? true
    : name.trim().length > 0 && /\S+@\S+\.\S+/.test(email) && accepted

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit?.({
      name: mode === 'visitor' ? name : undefined,
      email: mode === 'visitor' ? email : undefined,
      phone: mode === 'visitor' ? phone : undefined,
      message: message || undefined,
      acceptedTerms: mode === 'visitor' ? accepted : undefined,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-slate-900/95 ring-1 ring-white/10 backdrop-blur-xl shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          {succeeded ? (
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30 mb-3">
                <CheckCircle2 className="w-3 h-3" strokeWidth={2.4} />
                Solicitação enviada
              </div>
              <h2 className="text-2xl font-bold text-slate-50 tracking-tight">
                {content.successTitleTemplate.replace('{firstName}', firstNameAfterSubmit ?? 'tudo certo')}
              </h2>
            </div>
          ) : mode === 'visitor' ? (
            <h2 className="text-xl font-bold text-slate-50 tracking-tight pr-4">{content.visitor.title}</h2>
          ) : (
            <h2 className="text-xl font-bold text-slate-50 tracking-tight pr-4">
              {content.logged.titleTemplate.replace('{name}', professionalName)}
            </h2>
          )}
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" strokeWidth={2.4} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          {succeeded ? (
            <div className="space-y-5">
              <p className="text-sm text-slate-300 leading-relaxed">{content.successDescription}</p>
              <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] p-4 text-xs text-slate-400 leading-relaxed">
                Você verá o status em <strong className="text-slate-200">Minhas solicitações pendentes</strong> dentro do app paciente. Quando o profissional aprovar, você receberá um convite com permissões pré-selecionadas pra confirmar.
              </div>
              <button
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-br from-teal-300 to-emerald-400 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-[1.01] transition-all"
              >
                Entendido
              </button>
            </div>
          ) : mode === 'visitor' ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
            >
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {content.visitor.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] focus:ring-teal-400/40 focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {content.visitor.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] focus:ring-teal-400/40 focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {content.visitor.phoneLabel}{' '}
                  <span className="text-slate-500 font-normal">{content.visitor.phoneOptional}</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] focus:ring-teal-400/40 focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {content.visitor.messageLabel}
                </label>
                <textarea
                  rows={3}
                  maxLength={content.visitor.messageMax}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={content.visitor.messagePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] focus:ring-teal-400/40 focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 resize-none transition-all"
                />
                <div className="text-right text-[10px] font-mono text-slate-600 mt-1">
                  {message.length}/{content.visitor.messageMax}
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.04] text-teal-400 focus:ring-teal-400/40 focus:ring-offset-0 focus:ring-offset-slate-900"
                />
                <span className="text-xs text-slate-300 leading-relaxed">{content.visitor.termsLabel}</span>
              </label>

              {/* CTA */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="group w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-br from-teal-300 to-emerald-400 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/50 hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all"
              >
                {content.visitor.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Login link */}
              <button
                type="button"
                onClick={onLoginClick}
                className="w-full text-center text-xs text-slate-400 hover:text-teal-300 transition-colors"
              >
                {content.visitor.loginLink}
              </button>
            </form>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
            >
              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {content.logged.messageLabel}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={content.logged.messagePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] focus:ring-teal-400/40 focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 resize-none transition-all"
                />
              </div>

              {/* Permissions hint */}
              <div className="rounded-2xl bg-teal-400/[0.06] ring-1 ring-teal-400/20 p-4">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-300 mt-0.5 shrink-0" strokeWidth={2.4} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {content.logged.permissionsHintTemplate
                        .replace('{verticalLabel}', verticalLabel)
                        .replace('{categories}', recommendedCats)}
                    </p>
                    <button
                      type="button"
                      onClick={onAdjustPermissions}
                      className="mt-2 text-[11px] font-semibold text-teal-300 hover:text-teal-200 transition-colors"
                    >
                      {content.logged.permissionsAdjustLink} →
                    </button>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                type="submit"
                className="group w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-br from-teal-300 to-emerald-400 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/50 hover:scale-[1.02] transition-all"
              >
                {content.logged.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
