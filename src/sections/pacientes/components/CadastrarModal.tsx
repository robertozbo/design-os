import { UserPlus, X } from 'lucide-react'
import { useState } from 'react'

interface CadastrarModalProps {
  isOpen: boolean
  onClose?: () => void
  onSubmit?: (data: { name: string; email?: string; phone?: string; notes?: string }) => void
}

export function CadastrarModal({ isOpen, onClose, onSubmit }: CadastrarModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [sendInvite, setSendInvite] = useState(true)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit?.({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cadastrar-title"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
              Novo paciente
            </p>
            <h2
              id="cadastrar-title"
              className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            >
              Cadastrar paciente manualmente
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Preencha o básico — você pode completar os dados depois no perfil do paciente.
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

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <Field label="Nome completo" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="Ex: Ana Silva"
              className="input"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" hint="Recomendado pra enviar convite">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ana@email.com"
                className="input"
              />
            </Field>

            <Field label="Telefone" hint="Opcional">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 11 98765-4321"
                className="input"
              />
            </Field>
          </div>

          <Field label="Observações iniciais" hint="Privadas, só você vê">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Ex: Indicação da Dra. Joana, relato de fadiga, vegetariana há 3 anos..."
              className="input resize-none"
            />
          </Field>

          <label className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50/50 p-3 dark:border-teal-800 dark:bg-teal-900/20">
            <input
              type="checkbox"
              checked={sendInvite}
              onChange={(e) => setSendInvite(e.target.checked)}
              disabled={!email.trim()}
              className="mt-0.5 h-4 w-4 rounded border-teal-400 text-teal-600 focus:ring-teal-500"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-teal-900 dark:text-teal-100">
                Enviar convite por email após cadastrar
              </p>
              <p className="text-[11px] text-teal-700/80 dark:text-teal-300/80">
                Paciente recebe o link com seu código pra baixar o app.{' '}
                {!email.trim() && <span className="font-medium">Adicione um email pra habilitar.</span>}
              </p>
            </div>
          </label>
        </form>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-3 dark:border-slate-800 dark:bg-slate-950/40">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600"
          >
            <UserPlus size={14} />
            Cadastrar paciente
          </button>
        </footer>

        <style>{`
          .input {
            width: 100%;
            border-radius: 0.5rem;
            border: 1px solid rgb(226 232 240);
            background: white;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            color: rgb(15 23 42);
            outline: none;
            transition: border-color 0.15s;
          }
          .input::placeholder { color: rgb(148 163 184); }
          .input:focus { border-color: rgb(45 212 191); }
          .dark .input {
            border-color: rgb(30 41 59);
            background: rgb(15 23 42);
            color: rgb(241 245 249);
          }
          .dark .input::placeholder { color: rgb(71 85 105); }
          .dark .input:focus { border-color: rgb(20 184 166); }
        `}</style>
      </div>
    </div>
  )
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {label}
          {required && <span className="ml-1 text-orange-500">*</span>}
        </label>
        {hint && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500">{hint}</span>
        )}
      </div>
      {children}
    </div>
  )
}
