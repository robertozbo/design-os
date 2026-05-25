import { useState } from 'react'
import type {
  Endereco,
  Estabelecimento,
  EstabelecimentoFormInput,
  TipoEstabelecimento,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import { X, Check, Building2, Building, Hash, MapPin, Loader2 } from 'lucide-react'

interface EstabelecimentoDrawerProps {
  open: boolean
  estabelecimentoEmEdicao?: Estabelecimento | null
  empregadorCnpjBase: string
  onClose?: () => void
  onSave?: (input: EstabelecimentoFormInput) => void
  onLookupCep?: (cep: string) => Promise<Partial<Endereco> | null>
}

interface FormState {
  tipo: TipoEstabelecimento
  nome: string
  cnpjProprio: string
  codigoEsocial: string
  endereco: Endereco
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

function buildInitialForm(
  est: Estabelecimento | null | undefined,
  empregadorCnpjBase: string,
): FormState {
  if (est) {
    return {
      tipo: est.tipo,
      nome: est.nome,
      cnpjProprio: est.cnpjProprio,
      codigoEsocial: est.codigoEsocial,
      endereco: { ...est.endereco },
    }
  }
  return {
    tipo: 'filial',
    nome: '',
    cnpjProprio: empregadorCnpjBase,
    codigoEsocial: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: null,
      bairro: '',
      cidade: '',
      uf: '',
    },
  }
}

function isCepValid(raw: string) {
  return raw.replace(/\D/g, '').length === 8
}

export function EstabelecimentoDrawer({
  open,
  estabelecimentoEmEdicao,
  empregadorCnpjBase,
  onClose,
  onSave,
  onLookupCep,
}: EstabelecimentoDrawerProps) {
  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(estabelecimentoEmEdicao, empregadorCnpjBase),
  )
  const [cepState, setCepState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  if (!open) return null

  const isEdit = !!estabelecimentoEmEdicao
  const isMatriz = form.tipo === 'matriz'

  const canSubmit =
    form.nome.trim().length > 0 &&
    form.codigoEsocial.trim().length > 0 &&
    isCepValid(form.endereco.cep) &&
    form.endereco.logradouro.trim().length > 0 &&
    form.endereco.cidade.trim().length > 0 &&
    form.endereco.uf.trim().length === 2

  const setEndereco = (patch: Partial<Endereco>) =>
    setForm((p) => ({ ...p, endereco: { ...p.endereco, ...patch } }))

  const handleCepLookup = async () => {
    if (!onLookupCep || !isCepValid(form.endereco.cep)) return
    setCepState('loading')
    try {
      const result = await onLookupCep(form.endereco.cep)
      if (result) {
        setEndereco(result)
        setCepState('success')
      } else {
        setCepState('error')
      }
    } catch {
      setCepState('error')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSave?.({
      id: estabelecimentoEmEdicao?.id,
      tipo: form.tipo,
      nome: form.nome,
      cnpjProprio: form.cnpjProprio,
      codigoEsocial: form.codigoEsocial,
      endereco: form.endereco,
    })
  }

  return (
    <div
      className="fixed inset-0 z-40"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Editar estabelecimento' : 'Novo estabelecimento'}
    >
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
          w-full sm:max-w-[560px]
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
                {isEdit ? 'Editar estabelecimento' : 'Novo estabelecimento'}
              </span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {isEdit ? estabelecimentoEmEdicao!.nome : 'Adicionar à estrutura organizacional'}
            </h2>
            <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
              Os dados eSocial seguem a estrutura cadastrada no PGR. CEP preenche o endereço automaticamente.
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
            <FormField label="Tipo de unidade" required>
              <div className="inline-flex p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 ring-1 ring-slate-200/60 dark:ring-slate-800">
                {(['matriz', 'filial'] as TipoEstabelecimento[]).map((t) => {
                  const active = form.tipo === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, tipo: t }))}
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition
                        ${
                          active
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }
                      `}
                    >
                      {t === 'matriz' ? (
                        <Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                      ) : (
                        <Building className="w-3.5 h-3.5" strokeWidth={1.75} />
                      )}
                      {t === 'matriz' ? 'Matriz' : 'Filial'}
                    </button>
                  )
                })}
              </div>
            </FormField>

            <FormField id="nome-estab" label="Nome do estabelecimento" required>
              <input
                id="nome-estab"
                type="text"
                value={form.nome}
                onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                placeholder="Ex: Filial Sumaré · Distrito Industrial"
                className={FIELD_INPUT}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField id="cnpj-proprio" label="CNPJ próprio" required={!isMatriz}>
                <input
                  id="cnpj-proprio"
                  type="text"
                  value={form.cnpjProprio}
                  disabled={isMatriz}
                  onChange={(e) => setForm((p) => ({ ...p, cnpjProprio: e.target.value }))}
                  placeholder="00.000.000/0000-00"
                  className={`${FIELD_INPUT} font-mono disabled:opacity-60 disabled:cursor-not-allowed`}
                />
                {isMatriz && (
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Matriz herda o CNPJ do empregador.
                  </p>
                )}
              </FormField>

              <FormField id="codigo-esocial" label="Código eSocial" required>
                <div className="relative">
                  <Hash
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                    strokeWidth={1.75}
                  />
                  <input
                    id="codigo-esocial"
                    type="text"
                    value={form.codigoEsocial}
                    onChange={(e) => setForm((p) => ({ ...p, codigoEsocial: e.target.value }))}
                    placeholder="1, 2, 3…"
                    className={`${FIELD_INPUT} pl-8 font-mono`}
                  />
                </div>
              </FormField>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                  Endereço
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField id="cep" label="CEP" required>
                  <div className="flex gap-2">
                    <input
                      id="cep"
                      type="text"
                      value={form.endereco.cep}
                      onChange={(e) => {
                        setEndereco({ cep: e.target.value })
                        setCepState('idle')
                      }}
                      placeholder="00000-000"
                      className={`${FIELD_INPUT} font-mono`}
                    />
                    <button
                      type="button"
                      onClick={handleCepLookup}
                      disabled={!isCepValid(form.endereco.cep) || cepState === 'loading'}
                      className="
                        inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-xl
                        bg-slate-900 hover:bg-slate-800
                        dark:bg-slate-100 dark:hover:bg-slate-200
                        text-white dark:text-slate-900
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition
                      "
                      title="Buscar endereço pelo CEP"
                      aria-label="Buscar endereço pelo CEP"
                    >
                      {cepState === 'loading' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
                      ) : cepState === 'success' ? (
                        <Check className="w-3.5 h-3.5" strokeWidth={2.25} />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </FormField>

                <FormField id="logradouro" label="Logradouro" required>
                  <input
                    id="logradouro"
                    type="text"
                    value={form.endereco.logradouro}
                    onChange={(e) => setEndereco({ logradouro: e.target.value })}
                    placeholder="Av., Rua, Rod."
                    className={FIELD_INPUT}
                  />
                </FormField>

                <FormField id="numero" label="Número">
                  <input
                    id="numero"
                    type="text"
                    value={form.endereco.numero}
                    onChange={(e) => setEndereco({ numero: e.target.value })}
                    placeholder="1.234"
                    className={FIELD_INPUT}
                  />
                </FormField>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField id="bairro" label="Bairro">
                  <input
                    id="bairro"
                    type="text"
                    value={form.endereco.bairro}
                    onChange={(e) => setEndereco({ bairro: e.target.value })}
                    className={FIELD_INPUT}
                  />
                </FormField>
                <FormField id="cidade" label="Cidade" required>
                  <input
                    id="cidade"
                    type="text"
                    value={form.endereco.cidade}
                    onChange={(e) => setEndereco({ cidade: e.target.value })}
                    className={FIELD_INPUT}
                  />
                </FormField>
                <FormField id="uf" label="UF" required>
                  <input
                    id="uf"
                    type="text"
                    maxLength={2}
                    value={form.endereco.uf}
                    onChange={(e) => setEndereco({ uf: e.target.value.toUpperCase() })}
                    placeholder="SP"
                    className={`${FIELD_INPUT} uppercase`}
                  />
                </FormField>
              </div>

              <div className="mt-3">
                <FormField id="complemento" label="Complemento">
                  <input
                    id="complemento"
                    type="text"
                    value={form.endereco.complemento ?? ''}
                    onChange={(e) =>
                      setEndereco({ complemento: e.target.value === '' ? null : e.target.value })
                    }
                    placeholder="Galpão, andar, sala…"
                    className={FIELD_INPUT}
                  />
                </FormField>
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
              {isEdit ? 'Salvar alterações' : 'Adicionar estabelecimento'}
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
  children,
}: {
  id?: string
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
      >
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  )
}
