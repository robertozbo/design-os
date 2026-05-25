import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Copy,
  Info,
  Loader2,
  MailPlus,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import type { Genero, PacienteListItem } from '@/../product-clinico/sections/pacientes/types'

export interface CadastroPacienteForm {
  nome: string
  cpf: string
  dataNascimento: string
  genero: Genero
  telefone: string
  email: string
  endereco: string
  convenio: string
  observacao: string
  enviarConvite: boolean
  metodoConvite: 'sms' | 'email' | 'copiar'
  consentimentoTutela: boolean
}

interface Props {
  open: boolean
  /** Quando definido, drawer entra em modo edição: pré-preenche form e troca CTAs. */
  pacienteEdicao?: PacienteListItem | null
  onClose?: () => void
  /** Disparado ao confirmar cadastro/edição. Devolve o id do paciente (mock). */
  onSalvar?: (
    form: CadastroPacienteForm,
    modo: 'cadastro' | 'edicao',
    pacienteId?: string,
  ) => string | Promise<string>
  /** Disparado ao clicar "Abrir paciente" no estado sucesso (após cadastrar). */
  onAbrirPaciente?: (pacienteId: string) => void
}

const GENERO_OPCOES: { id: Genero; label: string }[] = [
  { id: 'feminino', label: 'Feminino' },
  { id: 'masculino', label: 'Masculino' },
  { id: 'outro', label: 'Outro' },
]

const CONVENIOS_SUGESTAO = [
  'Particular',
  'Unimed',
  'Bradesco Saúde',
  'Amil',
  'SulAmérica',
  'Notredame',
  'Hapvida',
]

function formatCPF(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1-$2')
}

function formatTelefone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 10) {
    return d
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
}

export function CadastroPacienteDrawer({
  open,
  pacienteEdicao,
  onClose,
  onSalvar,
  onAbrirPaciente,
}: Props) {
  const modo: 'cadastro' | 'edicao' = pacienteEdicao ? 'edicao' : 'cadastro'
  const [stage, setStage] = useState<'form' | 'salvando' | 'salvo'>('form')
  const [pacienteId, setPacienteId] = useState<string | null>(null)
  const [codigoConvite, setCodigoConvite] = useState<string | null>(null)
  const [form, setForm] = useState<CadastroPacienteForm>(initialForm(pacienteEdicao))

  useEffect(() => {
    if (open) {
      setStage('form')
      setPacienteId(pacienteEdicao?.id ?? null)
      setCodigoConvite(null)
      setForm(initialForm(pacienteEdicao))
    }
  }, [open, pacienteEdicao])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stage === 'form') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, stage, onClose])

  if (!open) return null

  const camposObrigatorios =
    form.nome.trim().length >= 5 &&
    form.cpf.replace(/\D/g, '').length === 11 &&
    form.dataNascimento.trim().length === 10 &&
    form.telefone.replace(/\D/g, '').length >= 10 &&
    form.consentimentoTutela

  const conviteValidoPraEnviar =
    !form.enviarConvite ||
    (form.metodoConvite === 'sms' && form.telefone.replace(/\D/g, '').length >= 10) ||
    (form.metodoConvite === 'email' && /\S+@\S+\.\S+/.test(form.email)) ||
    form.metodoConvite === 'copiar'

  const valido = camposObrigatorios && conviteValidoPraEnviar

  const submeter = async () => {
    if (!valido) return
    setStage('salvando')
    if (modo === 'cadastro' && form.enviarConvite) {
      const codigo =
        form.nome
          .split(' ')[0]
          ?.toUpperCase()
          .replace(/[^A-Z]/g, '') +
        '-' +
        Math.random().toString(36).slice(2, 6).toUpperCase()
      setCodigoConvite(codigo)
    }
    setTimeout(async () => {
      const id =
        (await Promise.resolve(onSalvar?.(form, modo, pacienteEdicao?.id))) ??
        pacienteEdicao?.id ??
        `pct-novo-${Date.now()}`
      setPacienteId(id)
      setStage('salvo')
    }, 1100)
  }

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Fechar"
        onClick={() => stage === 'form' && onClose?.()}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] dark:bg-slate-950/70"
      />

      <aside className="relative ml-auto flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        {/* Header */}
        <header className="flex items-start justify-between gap-3 border-b border-slate-200/80 bg-slate-50/40 px-5 py-4 dark:border-slate-800/80 dark:bg-slate-900/40">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              {stage === 'salvo'
                ? modo === 'edicao'
                  ? 'Alterações salvas'
                  : 'Paciente cadastrado'
                : modo === 'edicao'
                  ? 'Editar paciente'
                  : 'Novo paciente'}
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {stage === 'salvo'
                ? modo === 'edicao'
                  ? 'Dados atualizados · audit log registrado.'
                  : 'Vínculo paciente↔médico criado com sucesso.'
                : modo === 'edicao'
                  ? `Atualizando dados de ${pacienteEdicao?.nome}.`
                  : 'Cadastro mínimo + opção de convite pro app na hora.'}
            </p>
          </div>
          <button
            onClick={() => stage === 'form' && onClose?.()}
            disabled={stage === 'salvando'}
            aria-label="Fechar"
            className="-mr-1 -mt-1 inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="size-4" />
          </button>
        </header>

        {stage === 'form' && (
          <FormStage
            form={form}
            setForm={setForm}
            valido={valido}
            modo={modo}
            onSalvar={submeter}
            onCancelar={onClose}
          />
        )}

        {stage === 'salvando' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-12">
            <Loader2 className="size-9 animate-spin text-teal-600 dark:text-teal-400" />
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {modo === 'edicao' ? 'Atualizando paciente…' : 'Criando paciente…'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {modo === 'edicao'
                ? 'Salvando alterações · registrando diff no audit log'
                : 'Validando CPF · gerando vínculo · audit log LGPD'}
            </p>
          </div>
        )}

        {stage === 'salvo' && pacienteId && (
          <SalvoStage
            form={form}
            modo={modo}
            codigoConvite={codigoConvite}
            onAbrirPaciente={() => onAbrirPaciente?.(pacienteId)}
            onFechar={onClose}
          />
        )}
      </aside>
    </div>
  )
}

// ─── Stages ────────────────────────────────────────────────────────────────

function FormStage({
  form,
  setForm,
  valido,
  modo,
  onSalvar,
  onCancelar,
}: {
  form: CadastroPacienteForm
  setForm: React.Dispatch<React.SetStateAction<CadastroPacienteForm>>
  valido: boolean
  modo: 'cadastro' | 'edicao'
  onSalvar: () => void
  onCancelar?: () => void
}) {
  return (
    <>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {/* Identificação */}
        <Section titulo="Identificação" obrigatorio>
          <Field label="Nome completo" required>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Maria Silva Andrade"
              autoFocus
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="CPF" required>
              <input
                type="text"
                inputMode="numeric"
                value={form.cpf}
                onChange={(e) => setForm({ ...form, cpf: formatCPF(e.target.value) })}
                placeholder="000.000.000-00"
                className={inputClass}
              />
            </Field>
            <Field label="Data de nascimento" required>
              <input
                type="date"
                value={form.dataNascimento}
                onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Gênero" required>
            <div className="inline-flex w-full items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50/60 p-0.5 dark:border-slate-700 dark:bg-slate-800/60">
              {GENERO_OPCOES.map((g) => {
                const ativo = form.genero === g.id
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setForm({ ...form, genero: g.id })}
                    className={`
                      flex-1 rounded px-2.5 py-1.5 text-xs font-medium transition-colors
                      ${
                        ativo
                          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                      }
                    `}
                  >
                    {g.label}
                  </button>
                )
              })}
            </div>
          </Field>
        </Section>

        {/* Contato */}
        <Section titulo="Contato">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Telefone" required hint="Usado pra convite SMS">
              <input
                type="tel"
                inputMode="tel"
                value={form.telefone}
                onChange={(e) =>
                  setForm({ ...form, telefone: formatTelefone(e.target.value) })
                }
                placeholder="(11) 98765-4321"
                className={inputClass}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="maria@exemplo.com"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Endereço (opcional)">
            <input
              type="text"
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              placeholder="Rua, número, bairro, cidade — UF"
              className={inputClass}
            />
          </Field>
        </Section>

        {/* Convênio */}
        <Section titulo="Convênio">
          <Field label="Plano (texto livre)" hint="V1 — sem TUSS/SADT">
            <input
              type="text"
              list="convenios-sugeridos"
              value={form.convenio}
              onChange={(e) => setForm({ ...form, convenio: e.target.value })}
              placeholder="Particular, Unimed, Bradesco Saúde…"
              className={inputClass}
            />
            <datalist id="convenios-sugeridos">
              {CONVENIOS_SUGESTAO.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </Section>

        {/* Observação */}
        <Section titulo="Observação inicial (opcional)">
          <textarea
            rows={2}
            value={form.observacao}
            onChange={(e) => setForm({ ...form, observacao: e.target.value })}
            placeholder="ex: encaminhada pela Dra. Joana — investigar nódulo tireoidiano"
            className={`${inputClass} resize-none`}
          />
        </Section>

        {/* Convite app — só no modo cadastro */}
        {modo === 'cadastro' && (
        <section className="rounded-xl border border-teal-200/70 bg-gradient-to-br from-teal-50/40 to-emerald-50/30 p-4 dark:border-teal-900/40 dark:from-teal-950/20 dark:to-emerald-950/20">
          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              checked={form.enviarConvite}
              onChange={(e) => setForm({ ...form, enviarConvite: e.target.checked })}
              className="mt-0.5 size-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <div className="flex-1">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
                <MailPlus className="size-3.5 text-teal-600 dark:text-teal-400" />
                Enviar convite pro app na hora
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                Gera código único (ex: <span className="font-mono">MARIA-7K3X</span>) que vincula
                paciente↔médico ao abrir no app.
              </p>
            </div>
          </label>

          {form.enviarConvite && (
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'sms', label: 'SMS', icon: MessageCircle },
                  { id: 'email', label: 'Email', icon: MailPlus },
                  { id: 'copiar', label: 'Copiar link', icon: Copy },
                ] as const
              ).map((opt) => {
                const ativo = form.metodoConvite === opt.id
                const Icon = opt.icon
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setForm({ ...form, metodoConvite: opt.id })}
                    className={`
                      inline-flex flex-col items-center gap-1 rounded-md border px-2 py-2 text-[10px] font-medium transition-all
                      ${
                        ativo
                          ? 'border-teal-400 bg-white text-teal-800 shadow-sm dark:border-teal-700 dark:bg-slate-900 dark:text-teal-300'
                          : 'border-slate-200 bg-white/50 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-slate-600'
                      }
                    `}
                  >
                    <Icon className="size-3.5" />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )}
        </section>
        )}

        {/* Consentimento LGPD */}
        <label className="flex items-start gap-2.5 rounded-lg border border-slate-200/60 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/40">
          <input
            type="checkbox"
            checked={form.consentimentoTutela}
            onChange={(e) => setForm({ ...form, consentimentoTutela: e.target.checked })}
            className="mt-0.5 size-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <div className="text-[11px] leading-relaxed">
            <p className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
              <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
              Tutela da saúde (LGPD Art. 11)
            </p>
            <p className="mt-0.5 text-slate-500 dark:text-slate-400">
              Confirmo que tenho relação clínica direta com o paciente e processo dados
              sensíveis com base em <strong>tutela da saúde</strong>. Audit log registrará a
              criação do vínculo.
            </p>
          </div>
        </label>

        <p className="flex items-start gap-2 rounded-md bg-slate-100/60 px-3 py-2 text-[11px] leading-relaxed text-slate-600 dark:bg-slate-900/60 dark:text-slate-400">
          <Info className="mt-0.5 size-3 shrink-0 text-slate-400" />
          Anamnese e prontuário começam vazios. O paciente pode pré-preencher anamnese pelo app
          antes da primeira consulta.
        </p>
      </div>

      <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200/80 bg-slate-50/40 px-5 py-3 dark:border-slate-800/80 dark:bg-slate-950/60">
        <button
          type="button"
          onClick={onCancelar}
          className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onSalvar}
          disabled={!valido}
          className="
            inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors
            hover:bg-teal-500
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
            disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-teal-600
          "
        >
          <CheckCircle2 className="size-3.5" />
          {modo === 'edicao'
            ? 'Salvar alterações'
            : form.enviarConvite
              ? 'Cadastrar e enviar convite'
              : 'Cadastrar paciente'}
        </button>
      </footer>
    </>
  )
}

function SalvoStage({
  form,
  modo,
  codigoConvite,
  onAbrirPaciente,
  onFechar,
}: {
  form: CadastroPacienteForm
  modo: 'cadastro' | 'edicao'
  codigoConvite: string | null
  onAbrirPaciente: () => void
  onFechar?: () => void
}) {
  const [copiado, setCopiado] = useState(false)
  const link = codigoConvite
    ? `https://nymos.app/c/${codigoConvite.toLowerCase()}`
    : ''

  const copiar = () => {
    if (!link) return
    void navigator.clipboard.writeText(link).catch(() => {})
    setCopiado(true)
    setTimeout(() => setCopiado(false), 1800)
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* Sucesso */}
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="size-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
              {form.nome}
            </p>
            <p className="mt-0.5 text-[11px] text-emerald-800 dark:text-emerald-200">
              {modo === 'edicao' ? 'Atualizado' : 'Cadastrado'} · CPF {form.cpf} ·{' '}
              {form.convenio || 'Particular'}
            </p>
            <p className="mt-1 text-[10px] text-emerald-700/80 dark:text-emerald-300/80">
              {modo === 'edicao'
                ? 'Diff de campos registrado no audit log'
                : 'Vínculo paciente↔médico ativo · audit log registrado'}
            </p>
          </div>
        </div>

        {/* Convite — só no modo cadastro com convite */}
        {modo === 'cadastro' && form.enviarConvite && codigoConvite && (
          <section className="mt-5 rounded-xl border border-teal-200/70 bg-gradient-to-br from-teal-50/40 to-white p-5 shadow-sm dark:border-teal-900/40 dark:from-teal-950/20 dark:to-slate-900">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              <Sparkles className="size-3" />
              Convite gerado
            </p>
            <div className="mt-3 flex items-center gap-3 rounded-lg border-2 border-dashed border-teal-300 bg-white p-3 dark:border-teal-700 dark:bg-slate-900">
              <p className="flex-1 font-mono text-xl font-bold tracking-wider text-teal-700 dark:text-teal-300">
                {codigoConvite}
              </p>
              <button
                onClick={copiar}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {copiado ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copiar link
                  </>
                )}
              </button>
            </div>
            <p className="mt-3 text-[11px] text-slate-600 dark:text-slate-300">
              {form.metodoConvite === 'sms' && (
                <>
                  Enviado por SMS pra <strong>{form.telefone}</strong>. Paciente abre o app,
                  digita o código e vincula.
                </>
              )}
              {form.metodoConvite === 'email' && (
                <>
                  Enviado por email pra <strong>{form.email}</strong>. Link expira em 7 dias.
                </>
              )}
              {form.metodoConvite === 'copiar' && (
                <>Copie o link e envie como preferir. Link expira em 7 dias.</>
              )}
            </p>
            <p className="mt-2 break-all rounded bg-slate-100/60 px-2 py-1.5 font-mono text-[10px] text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              {link}
            </p>
          </section>
        )}

        <p className="mt-5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          Próximo passo natural: <strong>agendar primeira consulta</strong> ou abrir o paciente
          pra revisar/completar dados.
        </p>
      </div>

      <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200/80 bg-slate-50/40 px-5 py-3 dark:border-slate-800/80 dark:bg-slate-950/60">
        <button
          type="button"
          onClick={onFechar}
          className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Fechar
        </button>
        <button
          type="button"
          onClick={onAbrirPaciente}
          className="
            inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors
            hover:bg-teal-500
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
          "
        >
          Abrir paciente
        </button>
      </footer>
    </>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-900'

function Section({
  titulo,
  obrigatorio,
  children,
}: {
  titulo: string
  obrigatorio?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {titulo}
        {obrigatorio && <span className="text-rose-600">*</span>}
      </p>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required && <span className="ml-0.5 text-rose-600">*</span>}
        {hint && (
          <span className="ml-1.5 text-[10px] font-normal text-slate-500 dark:text-slate-400">
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  )
}

function initialForm(p?: PacienteListItem | null): CadastroPacienteForm {
  return {
    nome: p?.nome ?? '',
    cpf: '',
    dataNascimento: '',
    genero: p?.genero ?? 'feminino',
    telefone: '',
    email: '',
    endereco: '',
    convenio: p?.convenio ?? '',
    observacao: '',
    enviarConvite: !p,
    metodoConvite: 'sms',
    consentimentoTutela: true,
  }
}
