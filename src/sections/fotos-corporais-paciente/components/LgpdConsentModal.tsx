import { useEffect } from 'react'
import { X, Lock, Check } from 'lucide-react'

interface LgpdConsentModalProps {
  open: boolean
  onClose: () => void
  consentItems: string[]
}

/**
 * Modal informativo de privacidade — apenas lê as regras de proteção
 * das fotos. O **consentimento real** acontece dentro do fluxo do ai-chat
 * antes do upload.
 */
export function LgpdConsentModal({
  open,
  onClose,
  consentItems,
}: LgpdConsentModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Como suas fotos são protegidas"
        className="relative w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-slate-900 md:max-w-md md:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Privacidade das fotos
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Como suas fotos são protegidas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            Suas fotos são processadas pela nossa IA apenas pra gerar análise
            visual. O consentimento explícito é solicitado dentro do fluxo de
            captura, antes do upload.
          </p>
          <ul className="mt-4 space-y-2">
            {consentItems.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300"
              >
                <Check
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                  strokeWidth={3}
                />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400">
            Saiba mais na nossa{' '}
            <a
              href="#"
              className="font-semibold text-emerald-700 underline dark:text-emerald-400"
            >
              política de privacidade
            </a>
            .
          </p>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/60">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            Entendi
          </button>
        </footer>
      </div>
    </div>
  )
}
