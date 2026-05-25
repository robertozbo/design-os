import { useEffect, useState } from 'react'
import { Shield, X, Check } from 'lucide-react'
import type {
  AcceptInvitePayload,
  DataCategory,
  DataCategoryKey,
  PendingInvite,
  RecommendedByType,
} from '@/../product/sections/my-professionals/types'
import { ProfessionalAvatar } from './ProfessionalAvatar'
import { ConsentCategoriesPicker } from './ConsentCategoriesPicker'

export interface AcceptInviteModalProps {
  invite: PendingInvite | null
  dataCategories: DataCategory[]
  recommendedByType: RecommendedByType
  onClose: () => void
  onConfirm?: (payload: AcceptInvitePayload) => void
}

export function AcceptInviteModal({
  invite,
  dataCategories,
  recommendedByType,
  onClose,
  onConfirm,
}: AcceptInviteModalProps) {
  const [selected, setSelected] = useState<DataCategoryKey[]>([])

  // Initialize selection: requested categories from invite ∪ recommended for type
  useEffect(() => {
    if (!invite) return
    const requested = new Set<DataCategoryKey>(invite.requestedCategories)
    const recommended = recommendedByType[invite.professional.professionalType] ?? []
    recommended.forEach((c) => requested.add(c))
    setSelected(Array.from(requested))
  }, [invite, recommendedByType])

  useEffect(() => {
    if (!invite) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [invite, onClose])

  if (!invite) return null

  const recommended =
    recommendedByType[invite.professional.professionalType] ?? []

  const handleConfirm = () => {
    onConfirm?.({ inviteId: invite.id, sharedCategories: selected })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accept-invite-title"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="
          absolute inset-0
          bg-slate-950/40 dark:bg-slate-950/70
          backdrop-blur-sm
          animate-[fade-in_180ms_ease-out]
        "
      />
      <div
        className="
          relative w-full max-w-lg max-h-[90vh] overflow-y-auto
          rounded-2xl
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-800
          shadow-2xl
          animate-[modal-in_220ms_cubic-bezier(0.16,1,0.3,1)]
        "
      >
        <style>{`
          @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
          @keyframes modal-in {
            from { opacity: 0; transform: translateY(8px) scale(0.98) }
            to { opacity: 1; transform: translateY(0) scale(1) }
          }
        `}</style>

        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
          <div className="flex items-center gap-2 min-w-0">
            <div className="grid place-items-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300 shrink-0">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <h2
              id="accept-invite-title"
              className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50 truncate"
            >
              Aceitar convite
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="
              grid place-items-center w-8 h-8 rounded-lg
              text-slate-400 dark:text-slate-500
              hover:bg-slate-100 dark:hover:bg-slate-800
              hover:text-slate-700 dark:hover:text-slate-200
              transition-colors
            "
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="px-5 py-5 flex flex-col gap-4">
          <div
            className="
              flex items-center gap-3 px-3 py-3 rounded-xl
              bg-emerald-500/5 dark:bg-emerald-400/5
              border border-emerald-500/20 dark:border-emerald-400/20
            "
          >
            <ProfessionalAvatar
              type={invite.professional.professionalType}
              fullName={invite.professional.fullName}
              avatarUrl={invite.professional.avatarUrl}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {invite.professional.fullName}
                </span>
                {invite.validatedByEmail && (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
              </div>
              <div className="text-[10px] uppercase tracking-[0.12em] font-medium text-slate-500 dark:text-slate-400 truncate">
                {invite.professional.typeLabel}
                {invite.professional.specialty && <> · {invite.professional.specialty}</>}
              </div>
            </div>
          </div>

          {invite.message && (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              “{invite.message}”
            </p>
          )}

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Quais dados você quer compartilhar?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Pré-selecionamos o que esse tipo de profissional costuma precisar. Ajuste como preferir.
            </p>
            <ConsentCategoriesPicker
              categories={dataCategories}
              selected={selected}
              recommended={recommended}
              onChange={setSelected}
              comingSoon
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2 rounded-full
                text-sm font-medium
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-colors
              "
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="
                inline-flex items-center gap-1.5
                px-5 py-2 rounded-full
                bg-teal-600 hover:bg-teal-700 text-white
                dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
                text-sm font-medium shadow-sm
                transition-colors
              "
            >
              <Check className="w-3.5 h-3.5" />
              Aceitar vínculo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
