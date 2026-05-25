import { useMemo, useState } from 'react'
import type {
  EstabelecimentoLite,
  IdiomaPreferido,
  Regime,
  SetorLite,
  Trabalhador,
  TrabalhadorFormInput,
} from '@/../product/sections/trabalhadores/types'
import { PADROES_EMAIL_GENERICO_BLOQUEADOS } from '@/../product/sections/trabalhadores/types'
import {
  X,
  Check,
  Hash,
  IdCard,
  Briefcase,
  CalendarRange,
  Layers3,
  Languages,
  Accessibility,
  Mail,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  AlertTriangle,
} from 'lucide-react'

interface TrabalhadorDrawerProps {
  open: boolean
  trabalhadorEmEdicao?: Trabalhador | null
  estabelecimentos: EstabelecimentoLite[]
  setores: SetorLite[]
  onClose?: () => void
  onSave?: (input: TrabalhadorFormInput) => void
}

interface FormState {
  nome: string
  matricula: string
  cargo: string
  regime: Regime
  dataAdmissao: string
  estabelecimentoId: string
  setorId: string
  idiomaPreferido: IdiomaPreferido
  acessibilidade: string[]
  emailPessoal: string
  whatsappPessoal: string
  emailCorporativo: string
  convidarParaNymos: boolean
}

function validarEmailPessoal(email: string): { ok: boolean; mensagem: string | null } {
  if (email === '') return { ok: true, mensagem: null }
  const lower = email.toLowerCase().trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)) {
    return { ok: false, mensagem: 'Formato de e-mail inválido.' }
  }
  for (const padrao of PADROES_EMAIL_GENERICO_BLOQUEADOS) {
    if (lower.startsWith(padrao)) {
      return {
        ok: false,
        mensagem:
          'E-mails compartilhados (RH, supervisor, e-mail de setor) não são aceitos. Cada trabalhador precisa de canal individual — fornecer canal de terceiros configura coerção (LGPD).',
      }
    }
  }
  return { ok: true, mensagem: null }
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

const SUGESTOES_ACESSIBILIDADE = [
  'Leitor de tela',
  'Tela ampliada',
  'Posto adaptado · audição',
  'Posto adaptado · mobilidade reduzida',
  'Bancada acessível',
  'Tradução em Libras',
]

function buildInitialForm(t: Trabalhador | null | undefined): FormState {
  if (t) {
    return {
      nome: t.nome,
      matricula: t.matricula,
      cargo: t.cargo,
      regime: t.regime,
      dataAdmissao: t.dataAdmissao,
      estabelecimentoId: t.estabelecimentoId,
      setorId: t.setorId,
      idiomaPreferido: t.idiomaPreferido,
      acessibilidade: [...t.acessibilidade],
      emailPessoal: t.canalContato.emailPessoal ?? '',
      whatsappPessoal: t.canalContato.whatsappPessoal ?? '',
      emailCorporativo: t.emailCorporativo,
      convidarParaNymos: false,
    }
  }
  return {
    nome: '',
    matricula: '',
    cargo: '',
    regime: 'CLT',
    dataAdmissao: '',
    estabelecimentoId: '',
    setorId: '',
    idiomaPreferido: 'pt',
    acessibilidade: [],
    emailPessoal: '',
    whatsappPessoal: '',
    emailCorporativo: '',
    convidarParaNymos: false,
  }
}

export function TrabalhadorDrawer({
  open,
  trabalhadorEmEdicao,
  estabelecimentos,
  setores,
  onClose,
  onSave,
}: TrabalhadorDrawerProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialForm(trabalhadorEmEdicao))

  const setoresDisponiveis = useMemo(
    () => setores.filter((s) => s.estabelecimentoId === form.estabelecimentoId),
    [setores, form.estabelecimentoId],
  )

  const validacaoEmailPessoal = validarEmailPessoal(form.emailPessoal.trim())

  if (!open) return null

  const isEdit = !!trabalhadorEmEdicao
  const canSubmit =
    form.nome.trim().length > 0 &&
    form.matricula.trim().length > 0 &&
    form.cargo.trim().length > 0 &&
    form.estabelecimentoId !== '' &&
    form.setorId !== '' &&
    validacaoEmailPessoal.ok

  const toggleAcessibilidade = (item: string) => {
    setForm((p) => {
      const exists = p.acessibilidade.includes(item)
      return {
        ...p,
        acessibilidade: exists
          ? p.acessibilidade.filter((a) => a !== item)
          : [...p.acessibilidade, item],
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSave?.({
      id: trabalhadorEmEdicao?.id,
      ...form,
    })
  }

  return (
    <div
      className="fixed inset-0 z-40"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Editar trabalhador' : 'Novo trabalhador'}
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
                {isEdit ? 'Editar trabalhador' : 'Novo trabalhador'}
              </span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {isEdit ? trabalhadorEmEdicao!.nome : 'Adicionar à carteira NR-1'}
            </h2>
            <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
              Idioma e acessibilidade definem o modo de aplicação das avaliações.
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
            "
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            <Section icon={<IdCard className="w-3.5 h-3.5" strokeWidth={1.75} />} label="Identificação">
              <FormField id="nome" label="Nome completo" required>
                <input
                  id="nome"
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                  placeholder="Ex: Maria Eduarda Soares"
                  className={FIELD_INPUT}
                />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField
                  id="matricula"
                  label="Matrícula"
                  required
                  icon={<Hash className="w-3.5 h-3.5" strokeWidth={1.75} />}
                >
                  <input
                    id="matricula"
                    type="text"
                    value={form.matricula}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, matricula: e.target.value.toUpperCase() }))
                    }
                    placeholder="VG-00000"
                    className={`${FIELD_INPUT} font-mono`}
                  />
                </FormField>
                <div className="sm:col-span-2">
                  <FormField
                    id="cargo"
                    label="Cargo"
                    required
                    icon={<Briefcase className="w-3.5 h-3.5" strokeWidth={1.75} />}
                  >
                    <input
                      id="cargo"
                      type="text"
                      value={form.cargo}
                      onChange={(e) => setForm((p) => ({ ...p, cargo: e.target.value }))}
                      placeholder="Ex: Operadora de Linha · Sênior"
                      className={FIELD_INPUT}
                    />
                  </FormField>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Regime de contratação" required>
                  <div className="inline-flex p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 ring-1 ring-slate-200/60 dark:ring-slate-800">
                    {(['CLT', 'estatutario'] as Regime[]).map((r) => {
                      const active = form.regime === r
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, regime: r }))}
                          className={`
                            px-3 py-1.5 rounded-lg text-sm font-medium transition
                            ${
                              active
                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }
                          `}
                        >
                          {r === 'CLT' ? 'CLT' : 'Estatutário'}
                        </button>
                      )
                    })}
                  </div>
                </FormField>
                <FormField
                  id="data-admissao"
                  label="Data de admissão"
                  icon={<CalendarRange className="w-3.5 h-3.5" strokeWidth={1.75} />}
                >
                  <input
                    id="data-admissao"
                    type="date"
                    value={form.dataAdmissao}
                    onChange={(e) => setForm((p) => ({ ...p, dataAdmissao: e.target.value }))}
                    className={`${FIELD_INPUT} font-mono`}
                  />
                </FormField>
              </div>
            </Section>

            <Section icon={<Layers3 className="w-3.5 h-3.5" strokeWidth={1.75} />} label="Vinculação organizacional">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField id="estabelecimento" label="Estabelecimento" required>
                  <select
                    id="estabelecimento"
                    value={form.estabelecimentoId}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        estabelecimentoId: e.target.value,
                        setorId: '',
                      }))
                    }
                    className={FIELD_INPUT}
                  >
                    <option value="" disabled>
                      Selecione…
                    </option>
                    {estabelecimentos.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nome}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField id="setor" label="Setor" required>
                  <select
                    id="setor"
                    value={form.setorId}
                    onChange={(e) => setForm((p) => ({ ...p, setorId: e.target.value }))}
                    disabled={form.estabelecimentoId === ''}
                    className={`${FIELD_INPUT} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="" disabled>
                      {form.estabelecimentoId === ''
                        ? 'Escolha um estabelecimento'
                        : 'Selecione…'}
                    </option>
                    {setoresDisponiveis.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nome} · {s.codigo}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </Section>

            <Section
              icon={<Languages className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Elegibilidade para avaliações"
            >
              <FormField label="Idioma preferido" required>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { v: 'pt', label: 'Português', code: 'PT', helper: 'Brasil' },
                      { v: 'en', label: 'English', code: 'EN', helper: 'Internacional' },
                      { v: 'es', label: 'Español', code: 'ES', helper: 'Hispano' },
                    ] as { v: IdiomaPreferido; label: string; code: string; helper: string }[]
                  ).map((opt) => {
                    const active = form.idiomaPreferido === opt.v
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, idiomaPreferido: opt.v }))}
                        className={`
                          flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl ring-1 transition text-left
                          ${
                            active
                              ? 'bg-teal-50 ring-teal-200 dark:bg-teal-950/40 dark:ring-teal-900/60'
                              : 'bg-white/60 dark:bg-slate-900/40 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }
                        `}
                      >
                        <span
                          className={`text-[14px] font-mono font-semibold ${
                            active
                              ? 'text-teal-700 dark:text-teal-300'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {opt.code}
                        </span>
                        <span className="text-[11px] text-slate-700 dark:text-slate-200 font-medium">
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {opt.helper}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </FormField>

              <FormField
                label="Necessidades de acessibilidade"
                icon={<Accessibility className="w-3.5 h-3.5" strokeWidth={1.75} />}
                helper="Define modo de aplicação assistido durante a campanha NR-1."
              >
                <div className="flex flex-wrap gap-1.5">
                  {SUGESTOES_ACESSIBILIDADE.map((item) => {
                    const active = form.acessibilidade.includes(item)
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAcessibilidade(item)}
                        className={`
                          inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium ring-1 transition
                          ${
                            active
                              ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 ring-violet-200/60 dark:ring-violet-900/60'
                              : 'bg-white/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }
                        `}
                      >
                        {active && <Check className="w-3 h-3" strokeWidth={2.5} />}
                        {item}
                      </button>
                    )
                  })}
                </div>
              </FormField>
            </Section>

            <Section
              icon={<ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Canal de contato individual (LGPD)"
            >
              <div className="rounded-xl bg-amber-50/60 dark:bg-amber-950/30 ring-1 ring-amber-200/60 dark:ring-amber-900/40 px-3 py-2 text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed">
                Canal usado apenas para envio do link da pesquisa NR-1. Plataforma nunca rastreia respostas
                ao colaborador. E-mails compartilhados (RH, supervisor, e-mail de setor) não são aceitos —
                fornecer canal de terceiros configura coerção. Sem canal = sem participação no ciclo, sem
                fallback.
              </div>

              <FormField
                id="email-pessoal"
                label="E-mail pessoal"
                icon={<Mail className="w-3.5 h-3.5" strokeWidth={1.75} />}
                helper="Obrigatório para participar de campanhas NR-1. Use um e-mail individual do colaborador."
              >
                <input
                  id="email-pessoal"
                  type="email"
                  value={form.emailPessoal}
                  onChange={(e) => setForm((p) => ({ ...p, emailPessoal: e.target.value }))}
                  placeholder="nome.pessoal@gmail.com"
                  className={`${FIELD_INPUT} font-mono ${
                    !validacaoEmailPessoal.ok
                      ? 'border-rose-400 dark:border-rose-700 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950/60'
                      : ''
                  }`}
                  aria-invalid={!validacaoEmailPessoal.ok}
                  aria-describedby={validacaoEmailPessoal.mensagem ? 'email-pessoal-erro' : undefined}
                />
                {validacaoEmailPessoal.mensagem && (
                  <p
                    id="email-pessoal-erro"
                    className="mt-1.5 flex items-start gap-1.5 text-[11px] text-rose-700 dark:text-rose-300"
                  >
                    <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={2} />
                    <span>{validacaoEmailPessoal.mensagem}</span>
                  </p>
                )}
              </FormField>

              <FormField
                id="whatsapp"
                label={
                  <span className="inline-flex items-center gap-1.5">
                    WhatsApp pessoal
                    <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                      Enterprise
                    </span>
                  </span>
                }
                icon={<MessageCircle className="w-3.5 h-3.5" strokeWidth={1.75} />}
                helper="Canal alternativo usado apenas em planos Enterprise."
              >
                <input
                  id="whatsapp"
                  type="tel"
                  value={form.whatsappPessoal}
                  onChange={(e) => setForm((p) => ({ ...p, whatsappPessoal: e.target.value }))}
                  placeholder="+55 11 99999-0000"
                  className={`${FIELD_INPUT} font-mono`}
                />
              </FormField>

              {form.emailPessoal === '' && form.whatsappPessoal === '' && (
                <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                  Sem canal de contato — colaborador será cadastrado mas <strong>excluído</strong> das
                  próximas campanhas até ter e-mail ou WhatsApp pessoal cadastrado.
                </p>
              )}
            </Section>

            <Section
              icon={<Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Vínculo Nymos & e-mail corporativo"
            >
              <FormField
                id="email-corp"
                label="E-mail corporativo"
                icon={<Mail className="w-3.5 h-3.5" strokeWidth={1.75} />}
                helper="Opcional. Não é usado para envio da pesquisa — apenas para convite Nymos."
              >
                <input
                  id="email-corp"
                  type="email"
                  value={form.emailCorporativo}
                  onChange={(e) => setForm((p) => ({ ...p, emailCorporativo: e.target.value }))}
                  placeholder="nome@empregador.com.br"
                  className={`${FIELD_INPUT} font-mono`}
                />
              </FormField>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.convidarParaNymos}
                  disabled={form.emailCorporativo === ''}
                  onChange={(e) => setForm((p) => ({ ...p, convidarParaNymos: e.target.checked }))}
                  className="mt-1 accent-violet-600 dark:accent-violet-400 disabled:opacity-50"
                />
                <span className="text-[12px] text-slate-700 dark:text-slate-200">
                  Convidar para o Nymos ao salvar
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Envia link de criação de conta e habilita encaminhamento clínico, sem expor dados ao empregador.
                  </span>
                </span>
              </label>
            </Section>
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
                transition
              "
            >
              <Check className="w-3.5 h-3.5" strokeWidth={2.25} />
              {isEdit ? 'Salvar alterações' : 'Adicionar trabalhador'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

function Section({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-slate-500">{icon}</span>
        <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
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
  label: React.ReactNode
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
