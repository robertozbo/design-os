import { useEffect, useMemo, useRef, useState } from 'react'
import { Link2, X, ArrowLeft, ArrowRight, Check, Shield, AlertCircle } from 'lucide-react'
import type {
  DataCategory,
  DataCategoryKey,
  LinkProfessionalPayload,
  ProfessionalInfo,
  RecommendedByType,
} from '@/../product/sections/my-professionals/types'
import { ProfessionalAvatar } from './ProfessionalAvatar'
import { ConsentCategoriesPicker } from './ConsentCategoriesPicker'

export interface LinkProfessionalModalProps {
  open: boolean
  dataCategories: DataCategory[]
  recommendedByType: RecommendedByType
  /** Stub resolver — in real app this hits the API by code */
  resolveCode?: (code: string) => Promise<ProfessionalInfo | null>
  onClose: () => void
  onSubmit?: (payload: LinkProfessionalPayload) => void
}

type Step = 'code' | 'consent'

export function LinkProfessionalModal({
  open,
  dataCategories,
  recommendedByType,
  resolveCode,
  onClose,
  onSubmit,
}: LinkProfessionalModalProps) {
  const [step, setStep] = useState<Step>('code')
  const [code, setCode] = useState('')
  const [validating, setValidating] = useState(false)
  const [resolved, setResolved] = useState<ProfessionalInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<DataCategoryKey[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Reset when opens
  useEffect(() => {
    if (open) {
      setStep('code')
      setCode('')
      setResolved(null)
      setError(null)
      setSelected([])
      setValidating(false)
      const t = window.setTimeout(() => inputRef.current?.focus(), 60)
      return () => window.clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const recommended = useMemo<DataCategoryKey[]>(() => {
    if (!resolved) return []
    return recommendedByType[resolved.professionalType] ?? []
  }, [resolved, recommendedByType])

  const handleValidate = async () => {
    const trimmed = code.trim().toUpperCase()
    if (trimmed.length < 4) {
      setError('Código inválido — confira com seu profissional.')
      return
    }
    setValidating(true)
    setError(null)
    try {
      const info = resolveCode
        ? await resolveCode(trimmed)
        : await fakeResolve(trimmed)
      if (!info) {
        setError('Código não encontrado ou expirado.')
        setValidating(false)
        return
      }
      setResolved(info)
      setValidating(false)
    } catch {
      setError('Falha ao validar o código. Tente de novo.')
      setValidating(false)
    }
  }

  const handleContinue = () => {
    if (!resolved) return
    setSelected(recommended)
    setStep('consent')
  }

  const handleConfirm = () => {
    if (!resolved) return
    onSubmit?.({
      referralCode: code.trim().toUpperCase(),
      sharedCategories: selected,
    })
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="link-prof-title"
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
          {step === 'consent' ? (
            <button
              type="button"
              onClick={() => setStep('code')}
              aria-label="Voltar"
              className="
                grid place-items-center w-8 h-8 rounded-lg
                text-slate-400 dark:text-slate-500
                hover:bg-slate-100 dark:hover:bg-slate-800
                hover:text-slate-700 dark:hover:text-slate-200
                transition-colors
              "
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-8" />
          )}

          <div className="flex items-center gap-2 min-w-0">
            <div className="grid place-items-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300 shrink-0">
              {step === 'code' ? (
                <Link2 className="w-3.5 h-3.5" />
              ) : (
                <Shield className="w-3.5 h-3.5" />
              )}
            </div>
            <h2
              id="link-prof-title"
              className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50 truncate"
            >
              {step === 'code' ? 'Vincular profissional' : 'Quais dados compartilhar?'}
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

        {step === 'code' ? (
          <div className="px-5 py-5 flex flex-col gap-4">
            <div>
              <label className="flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                  Código de indicação
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase())
                    setResolved(null)
                    setError(null)
                  }}
                  placeholder="ex: NUTRI-CA847"
                  className="
                    w-full px-3 py-3 rounded-xl
                    bg-slate-50 dark:bg-slate-800/60
                    border border-slate-200 dark:border-slate-700
                    text-base font-mono tracking-wider text-slate-900 dark:text-slate-100
                    placeholder:text-slate-400 dark:placeholder:text-slate-500
                    focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60
                    dark:focus:ring-teal-400/30 dark:focus:border-teal-400/60
                  "
                />
              </label>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Peça ao profissional o código de indicação dele — geralmente está no perfil/cartão.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-rose-600 dark:text-rose-400 px-3 py-2 rounded-lg bg-rose-500/10 dark:bg-rose-400/10 border border-rose-500/20 dark:border-rose-400/20">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {resolved && (
              <div
                className="
                  flex items-center gap-3 px-3 py-3 rounded-xl
                  bg-emerald-500/5 dark:bg-emerald-400/5
                  border border-emerald-500/20 dark:border-emerald-400/20
                "
              >
                <ProfessionalAvatar
                  type={resolved.professionalType}
                  fullName={resolved.fullName}
                  avatarUrl={resolved.avatarUrl}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {resolved.fullName}
                    </span>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.12em] font-medium text-slate-500 dark:text-slate-400 truncate">
                    {resolved.typeLabel}
                    {resolved.specialty && <> · {resolved.specialty}</>}
                  </div>
                </div>
              </div>
            )}

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
              {!resolved ? (
                <button
                  type="button"
                  onClick={handleValidate}
                  disabled={validating || code.trim().length < 4}
                  className="
                    px-5 py-2 rounded-full
                    bg-teal-600 hover:bg-teal-700 text-white
                    dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
                    text-sm font-medium shadow-sm
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-colors
                  "
                >
                  {validating ? 'Validando…' : 'Validar código'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleContinue}
                  className="
                    inline-flex items-center gap-1
                    px-5 py-2 rounded-full
                    bg-teal-600 hover:bg-teal-700 text-white
                    dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
                    text-sm font-medium shadow-sm
                    transition-colors
                  "
                >
                  Continuar
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="px-5 py-5 flex flex-col gap-4">
            {resolved && (
              <div
                className="
                  flex items-center gap-3 px-3 py-3 rounded-xl
                  bg-slate-50 dark:bg-slate-800/40
                  border border-slate-200/80 dark:border-slate-800
                "
              >
                <ProfessionalAvatar
                  type={resolved.professionalType}
                  fullName={resolved.fullName}
                  avatarUrl={resolved.avatarUrl}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {resolved.fullName}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.12em] font-medium text-slate-500 dark:text-slate-400 truncate">
                    {resolved.typeLabel}
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Você controla o que esse profissional vê. Pode revisar e ajustar a qualquer momento no perfil dele.
            </p>

            <ConsentCategoriesPicker
              categories={dataCategories}
              selected={selected}
              recommended={recommended}
              onChange={setSelected}
              comingSoon
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('code')}
                className="
                  px-4 py-2 rounded-full
                  text-sm font-medium
                  text-slate-700 dark:text-slate-300
                  hover:bg-slate-100 dark:hover:bg-slate-800
                  transition-colors
                "
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="
                  px-5 py-2 rounded-full
                  bg-teal-600 hover:bg-teal-700 text-white
                  dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
                  text-sm font-medium shadow-sm
                  transition-colors
                "
              >
                Confirmar vínculo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Fallback fake resolver for the design-os preview (no real API)
async function fakeResolve(code: string): Promise<ProfessionalInfo | null> {
  await new Promise((r) => setTimeout(r, 420))
  if (code === 'INVALID') return null
  return {
    id: 'demo-prof',
    fullName: 'Dra. Marina Costa',
    professionalType: 'nutritionist',
    typeLabel: 'Nutricionista',
    specialty: 'Nutrição funcional',
    registrationNumber: 'CRN-3 31.984',
    bio: '',
    email: 'marina.costa@nutri.com.br',
    phone: '',
    referralCode: code,
    avatarUrl: null,
  }
}
