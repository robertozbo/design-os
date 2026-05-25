import { useState } from 'react'
import type {
  Empregador,
  EmpregadorFormInput,
  EmpregadorReceitaSnapshot,
  ResponsavelTecnico,
} from '@/../product/sections/empregadores/types'
import { X, Search, Loader2, Check, Building2, BadgeCheck, CalendarRange } from 'lucide-react'

interface CadastroDrawerProps {
  open: boolean
  empregadorEmEdicao?: Empregador | null
  responsavelLogado: ResponsavelTecnico
  profissionaisDisponiveis: ResponsavelTecnico[]
  onClose?: () => void
  onSave?: (input: EmpregadorFormInput) => void
  onLookupCnpj?: (cnpj: string) => Promise<EmpregadorReceitaSnapshot | null>
}

function buildInitialForm(
  empregador: Empregador | null | undefined,
  responsavelLogado: ResponsavelTecnico,
): FormState {
  if (empregador) {
    return {
      cnpj: empregador.cnpj,
      razaoSocial: empregador.razaoSocial,
      nomeFantasia: empregador.nomeFantasia,
      responsavelTecnicoId: empregador.responsavelTecnico.id,
      vigenciaEspecifica: empregador.saudeNr1.vigenciaEspecifica ?? '',
    }
  }
  return {
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    responsavelTecnicoId: responsavelLogado.id,
    vigenciaEspecifica: '',
  }
}

interface FormState {
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  responsavelTecnicoId: string
  vigenciaEspecifica: string
}

function isCnpjValid(raw: string) {
  const digits = raw.replace(/\D/g, '')
  return digits.length === 14
}

const FIELD_INPUT = `
  w-full px-3 py-2 rounded-xl
  bg-white/80 dark:bg-slate-900/40
  border border-slate-200 dark:border-slate-800
  placeholder:text-slate-400 dark:placeholder:text-slate-500
  text-sm text-slate-800 dark:text-slate-200
  focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
  transition
`

export function CadastroDrawer({
  open,
  empregadorEmEdicao,
  responsavelLogado,
  profissionaisDisponiveis,
  onClose,
  onSave,
  onLookupCnpj,
}: CadastroDrawerProps) {
  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(empregadorEmEdicao, responsavelLogado),
  )
  const [lookupState, setLookupState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  if (!open) return null

  const isEdit = !!empregadorEmEdicao
  const cnpjValid = isCnpjValid(form.cnpj)
  const canSubmit =
    cnpjValid &&
    form.razaoSocial.trim().length > 0 &&
    form.responsavelTecnicoId !== '' &&
    form.vigenciaEspecifica !== ''

  const handleLookup = async () => {
    if (!onLookupCnpj || !cnpjValid) return
    setLookupState('loading')
    try {
      const result = await onLookupCnpj(form.cnpj)
      if (result) {
        setForm((prev) => ({
          ...prev,
          razaoSocial: result.razaoSocial,
          nomeFantasia: result.nomeFantasia,
        }))
        setLookupState('success')
      } else {
        setLookupState('error')
      }
    } catch {
      setLookupState('error')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSave?.({
      id: empregadorEmEdicao?.id,
      cnpj: form.cnpj,
      razaoSocial: form.razaoSocial,
      nomeFantasia: form.nomeFantasia,
      responsavelTecnicoId: form.responsavelTecnicoId,
      vigenciaEspecifica: form.vigenciaEspecifica,
    })
  }

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={isEdit ? 'Editar empregador' : 'Novo empregador'}>
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="
          absolute inset-0
          bg-slate-900/40 dark:bg-slate-950/60
          backdrop-blur-[2px]
          drawer-fade
        "
      />

      <div
        className="
          drawer-slide
          absolute right-0 top-0 bottom-0
          w-full sm:max-w-[520px]
          bg-white dark:bg-slate-950
          ring-1 ring-slate-200/80 dark:ring-slate-800
          shadow-[-12px_0_40px_-20px_rgba(15,23,42,0.25)]
          flex flex-col
        "
      >
        <header className="px-6 py-5 border-b border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                {isEdit ? 'Editar empregador' : 'Novo empregador'}
              </span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {isEdit ? empregadorEmEdicao!.razaoSocial : 'Adicionar à carteira NR-1'}
            </h2>
            <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
              {isEdit
                ? 'Atualize os dados do empregador. Mudanças sensíveis ficam registradas no log de auditoria.'
                : 'Comece pelo CNPJ — preenchemos razão social e fantasia automaticamente via Receita.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="
              shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg
              text-slate-500 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
            "
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div>
              <label
                htmlFor="cnpj"
                className="block text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
              >
                CNPJ <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="cnpj"
                  type="text"
                  value={form.cnpj}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, cnpj: e.target.value }))
                    setLookupState('idle')
                  }}
                  placeholder="00.000.000/0000-00"
                  disabled={isEdit}
                  className="
                    flex-1 px-3 py-2 rounded-xl
                    bg-white/80 dark:bg-slate-900/40
                    border border-slate-200 dark:border-slate-800
                    placeholder:text-slate-400 dark:placeholder:text-slate-500
                    text-sm font-mono text-slate-800 dark:text-slate-200
                    focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition
                  "
                />
                <button
                  type="button"
                  onClick={handleLookup}
                  disabled={!cnpjValid || lookupState === 'loading' || isEdit}
                  className="
                    inline-flex items-center gap-1.5 px-3 py-2 rounded-xl
                    bg-slate-900 hover:bg-slate-800 active:bg-slate-700
                    dark:bg-slate-100 dark:hover:bg-slate-200
                    text-white dark:text-slate-900 text-sm font-medium
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition shrink-0
                  "
                >
                  {lookupState === 'loading' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
                  ) : lookupState === 'success' ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={2.25} />
                  ) : (
                    <Search className="w-3.5 h-3.5" strokeWidth={2} />
                  )}
                  Buscar dados
                </button>
              </div>
              {lookupState === 'success' && (
                <p className="mt-1.5 text-[11px] text-teal-700 dark:text-teal-300 inline-flex items-center gap-1">
                  <Check className="w-3 h-3" strokeWidth={2.25} />
                  Dados preenchidos a partir da Receita.
                </p>
              )}
              {lookupState === 'error' && (
                <p className="mt-1.5 text-[11px] text-amber-700 dark:text-amber-300">
                  Não conseguimos buscar via Receita. Preencha manualmente abaixo.
                </p>
              )}
            </div>

            <FormField
              id="razao-social"
              label="Razão social"
              required
              icon={<Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />}
            >
              <input
                id="razao-social"
                type="text"
                value={form.razaoSocial}
                onChange={(e) => setForm((p) => ({ ...p, razaoSocial: e.target.value }))}
                placeholder="Nome jurídico completo"
                className={FIELD_INPUT}
              />
            </FormField>

            <FormField id="nome-fantasia" label="Nome fantasia">
              <input
                id="nome-fantasia"
                type="text"
                value={form.nomeFantasia}
                onChange={(e) => setForm((p) => ({ ...p, nomeFantasia: e.target.value }))}
                placeholder="Como o empregador é conhecido"
                className={FIELD_INPUT}
              />
            </FormField>

            <FormField
              id="responsavel"
              label="Responsável técnico SST"
              required
              icon={<BadgeCheck className="w-3.5 h-3.5" strokeWidth={1.75} />}
            >
              <select
                id="responsavel"
                value={form.responsavelTecnicoId}
                onChange={(e) => setForm((p) => ({ ...p, responsavelTecnicoId: e.target.value }))}
                className={FIELD_INPUT}
              >
                <option value="" disabled>
                  Selecione um profissional…
                </option>
                {profissionaisDisponiveis.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} · {p.registro}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              id="vigencia"
              label="Vigência NR-1 específica"
              required
              icon={<CalendarRange className="w-3.5 h-3.5" strokeWidth={1.75} />}
              helper="Data alvo da conformidade NR-1 deste empregador."
            >
              <input
                id="vigencia"
                type="date"
                value={form.vigenciaEspecifica}
                onChange={(e) => setForm((p) => ({ ...p, vigenciaEspecifica: e.target.value }))}
                className={`${FIELD_INPUT} font-mono`}
              />
            </FormField>
          </div>

          <footer className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="
                px-3.5 py-2 rounded-xl text-sm font-medium
                text-slate-600 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition
              "
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-xl
                bg-teal-600 hover:bg-teal-700 active:bg-teal-800
                dark:bg-teal-500 dark:hover:bg-teal-400
                text-white font-medium text-sm
                shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
                dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                transition-colors duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
              "
            >
              <Check className="w-3.5 h-3.5" strokeWidth={2.25} />
              {isEdit ? 'Salvar alterações' : 'Adicionar empregador'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

function FormField({
  id,
  label,
  required,
  icon,
  helper,
  children,
}: {
  id: string
  label: string
  required?: boolean
  icon?: React.ReactNode
  helper?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
      >
        {icon}
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {helper && (
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{helper}</p>
      )}
    </div>
  )
}
