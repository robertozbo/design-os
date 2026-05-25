import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Copy, Check, Mail, MessageCircle, Link2, QrCode } from 'lucide-react'
import type {
  CanalEnvio,
  CanalEnvioOpcao,
  PerfilContexto,
} from '@/../product/sections/indica-es/types'

const CHANNEL_ICON: Record<CanalEnvio, React.ComponentType<{ size?: number }>> = {
  email: Mail,
  whatsapp: MessageCircle,
  copiar: Link2,
  qr: QrCode,
}

interface NewInviteModalProps {
  open: boolean
  perfilContexto: PerfilContexto
  canaisEnvio: CanalEnvioOpcao[]
  onClose: () => void
  onSubmit: (payload: {
    nome: string
    email: string
    telefone: string
    canais: CanalEnvio[]
  }) => void
}

export function NewInviteModal({
  open,
  perfilContexto,
  canaisEnvio,
  onClose,
  onSubmit,
}: NewInviteModalProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [canais, setCanais] = useState<CanalEnvio[]>(['email', 'whatsapp'])
  const [copied, setCopied] = useState(false)

  // Mock next code as the perfilCode-XXX
  const previewCode = `${perfilContexto.codigoBase}-XXX`
  const previewUrl = `${perfilContexto.linkBase}/${previewCode}`

  useEffect(() => {
    if (!open) return
    setNome('')
    setEmail('')
    setTelefone('')
    setCanais(['email', 'whatsapp'])
    setCopied(false)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const needsEmail = canais.includes('email')
  const needsPhone = canais.includes('whatsapp')

  const canSave = useMemo(() => {
    if (nome.trim() === '') return false
    if (canais.length === 0) return false
    if (needsEmail && email.trim() === '') return false
    if (needsPhone && telefone.trim() === '') return false
    return true
  }, [nome, email, telefone, canais, needsEmail, needsPhone])

  function toggleCanal(c: CanalEnvio) {
    setCanais((cur) => (cur.includes(c) ? cur.filter((v) => v !== c) : [...cur, c]))
  }

  function handleCopy() {
    navigator.clipboard?.writeText(previewUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  function handleSubmit() {
    if (!canSave) return
    onSubmit({ nome: nome.trim(), email: email.trim(), telefone: telefone.trim(), canais })
  }

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
        aria-label="Novo convite"
        style={{ animation: 'invite-modal-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        className="
          relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl
          dark:border-slate-800 dark:bg-slate-950
        "
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">
              Novo convite
            </p>
            <h2 className="mt-0.5 text-base font-semibold text-slate-900 dark:text-slate-50">
              Convide um paciente para o app
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Quando o paciente vincular, ele aparece automaticamente na sua carteira.
            </p>
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

        <div className="px-5 py-4">
          {/* Form fields */}
          <div className="space-y-3">
            <Field label="Nome do paciente *" required>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Mariana Lopes"
                className={INPUT_CLASS}
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={`E-mail${needsEmail ? ' *' : ''}`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="paciente@email.com"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label={`Telefone${needsPhone ? ' *' : ''}`}>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="+55 11 9XXXX-XXXX"
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          </div>

          {/* Channels */}
          <div className="mt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-400">
              Canais de envio
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {canaisEnvio.map((c) => {
                const active = canais.includes(c.value)
                const Icon = CHANNEL_ICON[c.value]
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => toggleCanal(c.value)}
                    className={`
                      inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition
                      ${active
                        ? 'border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900/40'}
                    `}
                  >
                    <Icon size={12} />
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Link preview */}
          <div className="mt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-400">
              Link gerado (preview)
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/60">
              <code className="flex-1 truncate font-mono text-xs text-slate-700 dark:text-slate-300">
                {previewUrl}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="
                  inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-slate-600
                  hover:bg-white hover:text-teal-700
                  dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-300
                "
              >
                {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-500">
              O código `{previewCode}` é único pra esse paciente. Ao vincular, ele entra direto na sua carteira.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between gap-2 border-t border-slate-200 px-5 py-3 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSave}
            className="
              inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white
              hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50
              dark:bg-teal-500 dark:hover:bg-teal-400
            "
          >
            Enviar convite
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  )
}

const INPUT_CLASS = `
  block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
  placeholder:text-slate-400
  focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-600
`

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-400">
        {label}
        {required && <span className="ml-1 text-rose-500">·</span>}
      </span>
      {children}
    </label>
  )
}

function ModalStyles() {
  return (
    <style>{`
      @keyframes invite-modal-in {
        from { opacity: 0; transform: scale(0.96) translateY(6px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }
    `}</style>
  )
}
