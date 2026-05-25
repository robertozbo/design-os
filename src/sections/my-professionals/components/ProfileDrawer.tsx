import { useEffect, useState } from 'react'
import { X, Star, Mail, Phone, Copy, Check, Shield, UserMinus, Link2 } from 'lucide-react'
import type {
  DataCategory,
  DataCategoryKey,
  RecommendedByType,
  UserReferral,
} from '@/../product/sections/my-professionals/types'
import { ProfessionalAvatar } from './ProfessionalAvatar'
import { ConsentCategoriesPicker } from './ConsentCategoriesPicker'

export interface ProfileDrawerProps {
  referral: UserReferral | null
  dataCategories: DataCategory[]
  recommendedByType: RecommendedByType
  onClose: () => void
  onSetPrimary?: (referralId: string) => void
  onUnlink?: (referralId: string) => void
  onUpdateSharedCategories?: (referralId: string, sharedCategories: DataCategoryKey[]) => void
}

function formatLinkedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function ProfileDrawer({
  referral,
  dataCategories,
  recommendedByType,
  onClose,
  onSetPrimary,
  onUnlink,
  onUpdateSharedCategories,
}: ProfileDrawerProps) {
  const [selected, setSelected] = useState<DataCategoryKey[]>([])
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [confirmUnlink, setConfirmUnlink] = useState(false)

  useEffect(() => {
    if (!referral) return
    setSelected(referral.sharedCategories)
    setConfirmUnlink(false)
    setCopiedField(null)
  }, [referral])

  useEffect(() => {
    if (!referral) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [referral, onClose])

  if (!referral) return null

  const recommended =
    recommendedByType[referral.professional.professionalType] ?? []

  const handleCategoriesChange = (next: DataCategoryKey[]) => {
    setSelected(next)
    onUpdateSharedCategories?.(referral.id, next)
  }

  const handleCopy = async (field: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(field)
      window.setTimeout(() => setCopiedField(null), 1500)
    } catch {
      // noop
    }
  }

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-drawer-title"
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
      <aside
        className="
          absolute top-0 right-0 bottom-0
          w-full max-w-md
          bg-white dark:bg-slate-900
          border-l border-slate-200 dark:border-slate-800
          shadow-2xl
          flex flex-col
          animate-[drawer-in_260ms_cubic-bezier(0.16,1,0.3,1)]
        "
      >
        <style>{`
          @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
          @keyframes drawer-in {
            from { transform: translateX(24px); opacity: 0 }
            to { transform: translateX(0); opacity: 1 }
          }
        `}</style>

        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2
            id="profile-drawer-title"
            className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          >
            Perfil do profissional
          </h2>
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

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <ProfessionalAvatar
              type={referral.professional.professionalType}
              fullName={referral.professional.fullName}
              avatarUrl={referral.professional.avatarUrl}
              size="lg"
              showRing={referral.isPrimary}
            />
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                  {referral.professional.fullName}
                </h3>
                {referral.isPrimary && (
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                )}
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.12em] font-medium text-slate-500 dark:text-slate-400">
                {referral.professional.typeLabel}
              </div>
              {referral.professional.specialty && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {referral.professional.specialty}
                </p>
              )}
              {referral.professional.registrationNumber && (
                <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  {referral.professional.registrationNumber}
                </div>
              )}
            </div>
          </div>

          {referral.professional.bio && (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {referral.professional.bio}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Contato
            </span>
            {referral.professional.email && (
              <ContactRow
                icon={Mail}
                value={referral.professional.email}
                copied={copiedField === 'email'}
                onCopy={() => handleCopy('email', referral.professional.email)}
              />
            )}
            {referral.professional.phone && (
              <ContactRow
                icon={Phone}
                value={referral.professional.phone}
                copied={copiedField === 'phone'}
                onCopy={() => handleCopy('phone', referral.professional.phone)}
              />
            )}
          </div>

          {referral.professional.referralCode && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Código de indicação
              </span>
              <ContactRow
                icon={Link2}
                value={referral.professional.referralCode}
                copied={copiedField === 'code'}
                onCopy={() => handleCopy('code', referral.professional.referralCode)}
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Compartilhe esse código com alguém pra esse profissional atender.
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400">
            <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400">
              Vinculado desde
            </span>
            <span className="ml-auto font-mono tabular-nums text-slate-700 dark:text-slate-300">
              {formatLinkedAt(referral.linkedAt)}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Permissões de dados
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Alterações aplicam imediatamente. Dados já visualizados ficam com o profissional.
            </p>
            <ConsentCategoriesPicker
              categories={dataCategories}
              selected={selected}
              recommended={recommended}
              onChange={handleCategoriesChange}
              compact
              comingSoon
            />
          </div>
        </div>

        <footer className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          {!referral.isPrimary && (
            <button
              type="button"
              onClick={() => onSetPrimary?.(referral.id)}
              className="
                inline-flex items-center justify-center gap-1.5
                w-full px-4 py-2 rounded-full
                bg-amber-500/10 hover:bg-amber-500/20
                text-amber-700 dark:text-amber-300
                text-sm font-medium
                transition-colors
              "
            >
              <Star className="w-3.5 h-3.5" />
              Definir como primário
            </button>
          )}

          {confirmUnlink ? (
            <div
              className="
                px-4 py-3 rounded-xl
                bg-rose-500/5 dark:bg-rose-400/5
                border border-rose-500/20 dark:border-rose-400/20
                flex flex-col gap-2
              "
            >
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-rose-700 dark:text-rose-300 font-semibold">
                  Desvincular {referral.professional.fullName}?
                </strong>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Esse profissional não terá mais acesso aos seus dados a partir de agora. Dados já consultados ficam com ele conforme LGPD.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmUnlink(false)}
                  className="
                    px-3 py-1.5 rounded-full
                    text-xs font-medium
                    text-slate-700 dark:text-slate-300
                    hover:bg-slate-100 dark:hover:bg-slate-800
                    transition-colors
                  "
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUnlink?.(referral.id)
                    onClose()
                  }}
                  className="
                    px-3 py-1.5 rounded-full
                    bg-rose-600 hover:bg-rose-700 text-white
                    dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-slate-950
                    text-xs font-medium shadow-sm
                    transition-colors
                  "
                >
                  Confirmar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmUnlink(true)}
              className="
                inline-flex items-center justify-center gap-1.5
                w-full px-4 py-2 rounded-full
                border border-rose-500/30 dark:border-rose-400/30
                text-rose-600 dark:text-rose-400
                hover:bg-rose-500/10 dark:hover:bg-rose-400/10
                text-sm font-medium
                transition-colors
              "
            >
              <UserMinus className="w-3.5 h-3.5" />
              Desvincular
            </button>
          )}
        </footer>
      </aside>
    </div>
  )
}

function ContactRow({
  icon: Icon,
  value,
  copied,
  onCopy,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
      <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
      <span className="flex-1 text-xs font-mono tabular-nums text-slate-700 dark:text-slate-300 truncate">
        {value}
      </span>
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copiar"
        className={`
          grid place-items-center w-6 h-6 rounded-md
          transition-colors
          ${
            copied
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
          }
        `}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}
