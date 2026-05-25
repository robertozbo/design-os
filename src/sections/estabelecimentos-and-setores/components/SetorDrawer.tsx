import { useState } from 'react'
import type {
  GestorSetor,
  Setor,
  SetorFormInput,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import { X, Check, Hash, BadgeCheck, Layers, Briefcase, Wallet } from 'lucide-react'

interface SetorDrawerProps {
  open: boolean
  estabelecimentoId: string
  setorEmEdicao?: Setor | null
  profissionaisDisponiveis: GestorSetor[]
  onClose?: () => void
  onSave?: (input: SetorFormInput) => void
}

interface FormState {
  nome: string
  codigo: string
  gestorId: string | null
  ghe: string
  ambiente: string
  centroCusto: string
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

function buildInitialForm(setor: Setor | null | undefined): FormState {
  if (setor) {
    return {
      nome: setor.nome,
      codigo: setor.codigo,
      gestorId: setor.gestor?.id ?? null,
      ghe: setor.agrupamentoPgr.ghe,
      ambiente: setor.agrupamentoPgr.ambiente,
      centroCusto: setor.agrupamentoPgr.centroCusto,
    }
  }
  return { nome: '', codigo: '', gestorId: null, ghe: '', ambiente: '', centroCusto: '' }
}

export function SetorDrawer({
  open,
  estabelecimentoId,
  setorEmEdicao,
  profissionaisDisponiveis,
  onClose,
  onSave,
}: SetorDrawerProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialForm(setorEmEdicao))

  if (!open) return null

  const isEdit = !!setorEmEdicao
  const canSubmit =
    form.nome.trim().length > 0 &&
    form.codigo.trim().length > 0 &&
    form.ghe.trim().length > 0 &&
    form.ambiente.trim().length > 0 &&
    form.centroCusto.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSave?.({
      id: setorEmEdicao?.id,
      estabelecimentoId,
      nome: form.nome,
      codigo: form.codigo,
      gestorId: form.gestorId,
      agrupamentoPgr: {
        ghe: form.ghe,
        ambiente: form.ambiente,
        centroCusto: form.centroCusto,
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-40"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Editar setor' : 'Novo setor'}
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-[2px] drawer-fade"
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
                {isEdit ? 'Editar setor' : 'Novo setor'}
              </span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {isEdit ? setorEmEdicao!.nome : 'Adicionar à estrutura'}
            </h2>
            <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
              Vincule um gestor responsável e os eixos do PGR (GHE, ambiente, centro de custo).
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <FormField id="nome-setor" label="Nome do setor" required>
                  <input
                    id="nome-setor"
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                    placeholder="Ex: Produção · Linha 1"
                    className={FIELD_INPUT}
                  />
                </FormField>
              </div>
              <FormField id="codigo-setor" label="Código" required icon={<Hash className="w-3.5 h-3.5" strokeWidth={1.75} />}>
                <input
                  id="codigo-setor"
                  type="text"
                  value={form.codigo}
                  onChange={(e) => setForm((p) => ({ ...p, codigo: e.target.value.toUpperCase() }))}
                  placeholder="PROD-L1"
                  className={`${FIELD_INPUT} font-mono`}
                />
              </FormField>
            </div>

            <FormField
              id="gestor"
              label="Gestor responsável"
              icon={<BadgeCheck className="w-3.5 h-3.5" strokeWidth={1.75} />}
              helper="Profissional responsável pelo diagnóstico semanal do líder (NR-1)."
            >
              <select
                id="gestor"
                value={form.gestorId ?? ''}
                onChange={(e) =>
                  setForm((p) => ({ ...p, gestorId: e.target.value === '' ? null : e.target.value }))
                }
                className={FIELD_INPUT}
              >
                <option value="">— Sem gestor vinculado —</option>
                {profissionaisDisponiveis.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nome} · {g.cargo}
                  </option>
                ))}
              </select>
            </FormField>

            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Layers className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                  Agrupamento PGR
                </span>
              </div>

              <div className="space-y-3">
                <FormField
                  id="ghe"
                  label="GHE — Grupo Homogêneo de Exposição"
                  required
                >
                  <input
                    id="ghe"
                    type="text"
                    value={form.ghe}
                    onChange={(e) => setForm((p) => ({ ...p, ghe: e.target.value }))}
                    placeholder="GHE-04 · Operação Linha de Pratos"
                    className={FIELD_INPUT}
                  />
                </FormField>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    id="ambiente"
                    label="Ambiente físico"
                    required
                    icon={<Briefcase className="w-3.5 h-3.5" strokeWidth={1.75} />}
                  >
                    <input
                      id="ambiente"
                      type="text"
                      value={form.ambiente}
                      onChange={(e) => setForm((p) => ({ ...p, ambiente: e.target.value }))}
                      placeholder="Linha fabril refrigerada"
                      className={FIELD_INPUT}
                    />
                  </FormField>
                  <FormField
                    id="centro-custo"
                    label="Centro de custo"
                    required
                    icon={<Wallet className="w-3.5 h-3.5" strokeWidth={1.75} />}
                  >
                    <input
                      id="centro-custo"
                      type="text"
                      value={form.centroCusto}
                      onChange={(e) => setForm((p) => ({ ...p, centroCusto: e.target.value.toUpperCase() }))}
                      placeholder="CC-410"
                      className={`${FIELD_INPUT} font-mono`}
                    />
                  </FormField>
                </div>
              </div>
            </div>
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
              {isEdit ? 'Salvar alterações' : 'Adicionar setor'}
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
  id?: string
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
      {helper && <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{helper}</p>}
    </div>
  )
}
