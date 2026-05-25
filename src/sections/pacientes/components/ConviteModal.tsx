import { Copy, Mail, MessageCircle, QrCode, Share2, X } from 'lucide-react'
import type { InviteInfo } from '@/../product/sections/pacientes/types'

interface ConviteModalProps {
  isOpen: boolean
  invite: InviteInfo
  onClose?: () => void
  onCopy?: (kind: 'code' | 'url') => void
  onShare?: (channel: 'whatsapp' | 'email' | 'sms') => void
}

export function ConviteModal({ isOpen, invite, onClose, onCopy, onShare }: ConviteModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="convite-title"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
              Convite por código
            </p>
            <h2
              id="convite-title"
              className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            >
              Vincule um paciente ao app
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Compartilhe seu código ou link. O paciente baixa o Nymos e fica vinculado a você.
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </header>

        {/* Code + QR */}
        <div className="px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Seu código
                </p>
                <button
                  type="button"
                  onClick={() => onCopy?.('code')}
                  className="group mt-1 flex w-full items-center justify-between gap-2 rounded-xl border border-teal-200 bg-teal-50/50 px-4 py-3 text-left dark:border-teal-800 dark:bg-teal-900/20"
                >
                  <span className="font-mono text-xl font-semibold tracking-wider text-teal-900 dark:text-teal-200">
                    {invite.code}
                  </span>
                  <Copy
                    size={16}
                    className="text-teal-700 opacity-60 group-hover:opacity-100 dark:text-teal-400"
                  />
                </button>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Link de cadastro
                </p>
                <button
                  type="button"
                  onClick={() => onCopy?.('url')}
                  className="group mt-1 flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-left dark:border-slate-800 dark:bg-slate-950"
                >
                  <span className="truncate font-mono text-xs text-slate-700 dark:text-slate-300">
                    {invite.signupUrl}
                  </span>
                  <Copy
                    size={14}
                    className="shrink-0 text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-200"
                  />
                </button>
              </div>
            </div>

            {/* QR placeholder */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
                <QrCode size={96} className="text-slate-900 dark:text-slate-100" strokeWidth={1.2} />
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                QR Code
              </p>
            </div>
          </div>
        </div>

        {/* Share channels */}
        <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/40">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Compartilhar via
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button
              onClick={() => onShare?.('whatsapp')}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-3 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
            >
              <MessageCircle
                size={20}
                className="text-emerald-600 dark:text-emerald-400"
              />
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                WhatsApp
              </span>
            </button>
            <button
              onClick={() => onShare?.('email')}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-3 transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700"
            >
              <Mail size={20} className="text-teal-600 dark:text-teal-400" />
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                Email
              </span>
            </button>
            <button
              onClick={() => onShare?.('sms')}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-3 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <Share2 size={20} className="text-slate-600 dark:text-slate-400" />
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                Outro
              </span>
            </button>
          </div>

          {invite.pendingInvites > 0 && (
            <p className="mt-3 text-center text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-mono tabular-nums text-amber-600 dark:text-amber-400">
                {invite.pendingInvites}
              </span>{' '}
              convite{invite.pendingInvites === 1 ? '' : 's'} pendente{invite.pendingInvites === 1 ? '' : 's'} (paciente convidado mas ainda não baixou o app)
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
