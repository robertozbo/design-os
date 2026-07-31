import { useState } from 'react'
import { Mail, X } from 'lucide-react'
import type {
  ConviteForm,
  PapelMedicalClinic,
} from '@/../product-medical-clinic/sections/equipe/types'

const PAPEIS: { value: PapelMedicalClinic; label: string; hint: string }[] = [
  { value: 'medico', label: 'Médico', hint: 'Acesso clínico aos pacientes da clínica' },
  { value: 'recepcao', label: 'Recepção', hint: 'Operacional: agenda, cadastro, cobrança' },
  { value: 'admin', label: 'Admin', hint: 'Gestão do workspace, sem acesso clínico' },
]

const ESPECIALIDADES = [
  'Endocrinologia',
  'Cardiologia',
  'Nutrologia',
  'Clínica Geral',
  'Ginecologia',
  'Ortopedia',
  'Pediatria',
]

interface Props {
  limiteMedicosAtingido: boolean
  onClose: () => void
  onEnviar: (form: ConviteForm) => void
}

const VAZIO: ConviteForm = { email: '', papel: 'medico', especialidade: 'Endocrinologia' }

export function ConvidarMembroDrawer({
  limiteMedicosAtingido,
  onClose,
  onEnviar,
}: Props) {
  const [form, setForm] = useState<ConviteForm>(VAZIO)
  const [tocou, setTocou] = useState(false)

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const bloqueadoPorLimite = form.papel === 'medico' && limiteMedicosAtingido
  const podeEnviar = emailValido && !bloqueadoPorLimite

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Convidar membro
          </h2>
          <button
            aria-label="Fechar"
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                onBlur={() => setTocou(true)}
                placeholder="colega@clinica.com.br"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            {tocou && !emailValido && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">Email inválido.</p>
            )}
          </div>

          {/* Papel */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Papel
            </label>
            <div className="space-y-2">
              {PAPEIS.map((p) => {
                const ativo = form.papel === p.value
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, papel: p.value }))}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                      ativo
                        ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/30'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        ativo ? 'border-teal-500' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {ativo && <span className="h-2 w-2 rounded-full bg-teal-500" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                        {p.label}
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        {p.hint}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Especialidade — só médico */}
          {form.papel === 'medico' && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Especialidade
              </label>
              <select
                value={form.especialidade}
                onChange={(e) => setForm((f) => ({ ...f, especialidade: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {ESPECIALIDADES.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
          )}

          {bloqueadoPorLimite && (
            <div className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
              Limite de médicos do plano atingido. Faça upgrade para convidar mais médicos.
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!podeEnviar}
            onClick={() => onEnviar(form)}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enviar convite
          </button>
        </div>
      </div>
    </div>
  )
}
