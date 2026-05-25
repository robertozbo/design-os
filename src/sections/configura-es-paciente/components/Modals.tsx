import { useEffect, useState } from 'react'
import {
  X,
  AlertOctagon,
  Trash2,
  Loader2,
  Check,
  Sparkles,
  Download,
  Clock,
  FileText,
  ArrowLeft,
} from 'lucide-react'
import type {
  AvailablePlan,
  CancelReason,
  CancelSubscriptionPayload,
  ConsentHistoryEntry,
  DataExportFormat,
  DeleteAccountPayload,
  LegalDocument,
  PlanInterval,
} from '@/../product/sections/configura-es-paciente/types'

// =============================================================================
// Shared modal shell
// =============================================================================

interface ModalShellProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const SIZE_CLASSES = {
  sm: 'md:max-w-md',
  md: 'md:max-w-xl',
  lg: 'md:max-w-2xl',
  xl: 'md:max-w-4xl',
}

function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}: ModalShellProps) {
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
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex max-h-[92vh] w-full ${SIZE_CLASSES[size]} flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-slate-900 md:rounded-3xl`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="min-w-0">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <footer className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/60">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}

function PrimaryButton({
  loading,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  )
}

function DangerButton({
  loading,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-rose-600/20 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  )
}

function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
    />
  )
}

// =============================================================================
// TermsModal
// =============================================================================

interface TermsModalProps {
  open: boolean
  onClose: () => void
  document: LegalDocument | null
}

export function TermsModal({ open, onClose, document }: TermsModalProps) {
  if (!document) return null

  const isPrivacy = document.type === 'privacy'

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={document.title}
      subtitle={`${document.version} · atualizado em ${new Date(document.updatedAt).toLocaleDateString('pt-BR')}`}
      size="lg"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Fechar</SecondaryButton>
          {document.requiresReAccept && (
            <PrimaryButton onClick={onClose}>Aceitar nova versão</PrimaryButton>
          )}
        </>
      }
    >
      <div className="prose prose-sm max-w-none text-slate-700 dark:prose-invert dark:text-slate-300">
        <p className="lead">
          {isPrivacy
            ? 'Esta Política de Privacidade descreve como o Nymos coleta, usa, armazena e protege seus dados pessoais e de saúde.'
            : 'Estes Termos de Uso regulam o relacionamento entre você e a plataforma Nymos.'}
        </p>
        <h4>1. Dados que coletamos</h4>
        <p>
          Coletamos apenas os dados necessários pra prestação do serviço:
          informações de cadastro, dados de saúde inseridos voluntariamente,
          métricas de uso anonimizadas (com consentimento) e histórico de
          interações com profissionais vinculados.
        </p>
        <h4>2. Uso dos dados</h4>
        <p>
          Seus dados são usados pra fornecer o serviço, gerar análises
          personalizadas, melhorar a plataforma e cumprir obrigações legais.
          Nunca vendemos seus dados pessoais a terceiros.
        </p>
        <h4>3. Seus direitos LGPD</h4>
        <p>
          Você tem direito a: acessar seus dados, solicitar correção, exportar
          uma cópia completa (portabilidade), revogar consentimentos a qualquer
          momento e solicitar a exclusão permanente da sua conta.
        </p>
        <h4>4. Compartilhamento com profissionais</h4>
        <p>
          Quando você vincula um profissional de saúde, ele recebe acesso aos
          dados específicos que você autorizou. Você pode revogar esse acesso
          a qualquer momento na seção Meus Profissionais.
        </p>
        <h4>5. Retenção e exclusão</h4>
        <p>
          Após solicitar a exclusão da conta, seus dados são marcados pra
          remoção. Você tem 30 dias pra reativar fazendo login. Após esse
          período, todos os dados são permanentemente apagados, exceto aqueles
          requeridos por lei (ex: registros fiscais).
        </p>
        <h4>6. Contato</h4>
        <p>
          Dúvidas sobre privacidade podem ser direcionadas a{' '}
          <span className="font-mono">privacy@nymos.health</span>.
        </p>
      </div>
    </ModalShell>
  )
}

// =============================================================================
// DataExportModal
// =============================================================================

interface DataExportModalProps {
  open: boolean
  onClose: () => void
  email: string
  onConfirm: (format: DataExportFormat) => void
  isRequesting?: boolean
}

export function DataExportModal({
  open,
  onClose,
  email,
  onConfirm,
  isRequesting,
}: DataExportModalProps) {
  const [format, setFormat] = useState<DataExportFormat>('JSON')

  useEffect(() => {
    if (open) setFormat('JSON')
  }, [open])

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Solicitar exportação de dados"
      subtitle="Portabilidade LGPD"
      size="md"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton
            loading={isRequesting}
            onClick={() => onConfirm(format)}
          >
            <Download className="h-3.5 w-3.5" />
            Solicitar exportação
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl bg-teal-50 px-4 py-3 dark:bg-teal-500/10">
          <p className="text-sm text-teal-800 dark:text-teal-200">
            Você receberá um email em{' '}
            <span className="font-mono font-semibold">{email}</span> em até 15
            dias úteis com o link pra baixar o arquivo.
          </p>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Formato do arquivo
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {(['JSON', 'CSV', 'PDF'] as DataExportFormat[]).map((f) => {
              const active = format === f
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`rounded-xl border-2 px-3 py-3 text-left transition ${
                    active
                      ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-500/10'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                  }`}
                >
                  <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                    {f}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {f === 'JSON' && 'Para desenvolvedores'}
                    {f === 'CSV' && 'Abre no Excel'}
                    {f === 'PDF' && 'Documento legível'}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/40">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            O que será incluído
          </p>
          <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex gap-2">
              <Check className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
              Dados pessoais e endereço
            </li>
            <li className="flex gap-2">
              <Check className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
              Métricas de saúde e medições
            </li>
            <li className="flex gap-2">
              <Check className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
              Histórico de atividades e refeições
            </li>
            <li className="flex gap-2">
              <Check className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
              Vínculos com profissionais
            </li>
            <li className="flex gap-2">
              <Check className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
              Histórico de pagamentos
            </li>
          </ul>
        </div>
      </div>
    </ModalShell>
  )
}

// =============================================================================
// ConsentHistoryDrawer
// =============================================================================

interface ConsentHistoryDrawerProps {
  open: boolean
  onClose: () => void
  history: ConsentHistoryEntry[]
}

const CONSENT_LABELS: Record<string, string> = {
  dataSharing: 'Compartilhamento de dados',
  analytics: 'Analytics de uso',
  thirdPartyAccess: 'Acesso por terceiros',
  profileVisibility: 'Visibilidade do perfil',
}

const CHANNEL_LABELS: Record<string, string> = {
  settings_web: 'Configurações (web)',
  settings_mobile: 'Configurações (mobile)',
  onboarding: 'Onboarding',
}

function formatConsentValue(value: boolean | string): string {
  if (typeof value === 'boolean') return value ? 'Ativo' : 'Inativo'
  return value
}

export function ConsentHistoryDrawer({
  open,
  onClose,
  history,
}: ConsentHistoryDrawerProps) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Histórico de consentimentos"
      subtitle="Todas mudanças nas suas preferências de privacidade"
      size="lg"
      footer={<SecondaryButton onClick={onClose}>Fechar</SecondaryButton>}
    >
      {history.length === 0 ? (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Nenhuma mudança registrada ainda
        </p>
      ) : (
        <ul className="space-y-3">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/40"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
                <Clock className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {CONSENT_LABELS[entry.consent] ?? entry.consent}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  De{' '}
                  <span className="rounded-md bg-slate-200 px-1.5 py-0.5 font-mono font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {formatConsentValue(entry.previousValue)}
                  </span>{' '}
                  para{' '}
                  <span className="rounded-md bg-teal-100 px-1.5 py-0.5 font-mono font-semibold text-teal-800 dark:bg-teal-500/20 dark:text-teal-200">
                    {formatConsentValue(entry.newValue)}
                  </span>
                </p>
                <p className="mt-1 font-mono text-[11px] text-slate-400">
                  {new Date(entry.changedAt).toLocaleString('pt-BR')} ·{' '}
                  {CHANNEL_LABELS[entry.channel] ?? entry.channel}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ModalShell>
  )
}

// =============================================================================
// DeleteAccountModal
// =============================================================================

interface DeleteAccountModalProps {
  open: boolean
  onClose: () => void
  expectedEmail: string
  onConfirm: (payload: DeleteAccountPayload) => void
  isDeleting?: boolean
}

export function DeleteAccountModal({
  open,
  onClose,
  expectedEmail,
  onConfirm,
  isDeleting,
}: DeleteAccountModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [emailInput, setEmailInput] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)

  useEffect(() => {
    if (open) {
      setStep(1)
      setEmailInput('')
      setAcknowledged(false)
    }
  }, [open])

  const emailMatches = emailInput.trim().toLowerCase() === expectedEmail.toLowerCase()
  const step2Valid = emailMatches && acknowledged

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Excluir minha conta"
      subtitle={`Passo ${step} de 3`}
      size="md"
      footer={
        step === 1 ? (
          <>
            <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
            <DangerButton onClick={() => setStep(2)}>
              Continuar
            </DangerButton>
          </>
        ) : step === 2 ? (
          <>
            <SecondaryButton onClick={() => setStep(1)}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar
            </SecondaryButton>
            <DangerButton disabled={!step2Valid} onClick={() => setStep(3)}>
              Continuar
            </DangerButton>
          </>
        ) : (
          <>
            <SecondaryButton onClick={() => setStep(2)}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar
            </SecondaryButton>
            <DangerButton
              loading={isDeleting}
              onClick={() => onConfirm({ emailConfirmation: emailInput })}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Excluir permanentemente
            </DangerButton>
          </>
        )
      }
    >
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50/50 px-4 py-3 dark:border-rose-500/30 dark:bg-rose-500/10">
            <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <div>
              <p className="text-sm font-semibold text-rose-900 dark:text-rose-100">
                Esta ação é irreversível após 30 dias
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-rose-800/80 dark:text-rose-200/80">
                Você poderá reativar fazendo login durante esse período. Depois,
                tudo será apagado permanentemente.
              </p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              O que será excluído
            </p>
            <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {[
                'Todos seus dados pessoais e endereço',
                'Histórico completo de métricas, exames e refeições',
                'Vínculos com todos os profissionais',
                'Métodos de pagamento e histórico de cobranças',
                'Exportações de dados pendentes',
                'Acesso ao app mobile vinculado a essa conta',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Para confirmar, digite seu email completo:
          </p>
          <div className="rounded-2xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
            <p className="font-mono text-sm text-slate-700 dark:text-slate-200">
              {expectedEmail}
            </p>
          </div>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Digite seu email"
            autoFocus
            className={`w-full rounded-xl border-2 bg-white px-3 py-2.5 font-mono text-sm transition focus:outline-none dark:bg-slate-800 ${
              emailInput.length === 0
                ? 'border-slate-200 dark:border-slate-700'
                : emailMatches
                  ? 'border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'border-rose-300 dark:border-rose-500/50'
            }`}
          />
          <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
            />
            Entendo que esta ação é{' '}
            <strong className="font-semibold">irreversível após 30 dias</strong>{' '}
            e perderei o acesso a todos meus dados.
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <AlertOctagon className="h-8 w-8" />
          </div>
          <h4 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Última confirmação
          </h4>
          <p className="mx-auto max-w-sm text-sm text-slate-600 dark:text-slate-300">
            Ao clicar em "Excluir permanentemente", sua conta será marcada pra
            exclusão. Você tem 30 dias pra mudar de ideia fazendo login.
          </p>
        </div>
      )}
    </ModalShell>
  )
}

// =============================================================================
// ChangePlanModal
// =============================================================================

interface ChangePlanModalProps {
  open: boolean
  onClose: () => void
  currentPlanId: string
  availablePlans: AvailablePlan[]
  onConfirm: (planId: string, interval: PlanInterval) => void
  isChanging?: boolean
}

function formatPlanPrice(price: number, currency: string): string {
  if (price === 0) return 'Grátis'
  if (currency === 'BRL') return `R$ ${price.toFixed(2).replace('.', ',')}`
  return `${currency} ${price.toFixed(2)}`
}

export function ChangePlanModal({
  open,
  onClose,
  currentPlanId,
  availablePlans,
  onConfirm,
  isChanging,
}: ChangePlanModalProps) {
  const [interval, setInterval] = useState<PlanInterval>('month')
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setInterval('month')
      setSelected(null)
    }
  }, [open])

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Trocar plano"
      subtitle="Escolha o plano que se encaixa em você"
      size="xl"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton
            loading={isChanging}
            disabled={!selected || selected === currentPlanId}
            onClick={() => selected && onConfirm(selected, interval)}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Confirmar troca
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-5">
        {/* Interval toggle */}
        <div className="mx-auto flex w-fit gap-1 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
          {(['month', 'year'] as PlanInterval[]).map((opt) => {
            const active = interval === opt
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setInterval(opt)}
                className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {opt === 'month' ? 'Mensal' : 'Anual'}
                {opt === 'year' && (
                  <span className="ml-1.5 inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    -20%
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Plans grid */}
        <div className="grid gap-3 md:grid-cols-3">
          {availablePlans.map((plan) => {
            const isCurrent = plan.id === currentPlanId
            const isSelected = plan.id === selected
            const displayPrice =
              interval === 'year' ? plan.price * 12 * 0.8 : plan.price
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => !isCurrent && setSelected(plan.id)}
                disabled={isCurrent}
                className={`relative flex flex-col rounded-2xl border-2 p-5 text-left transition ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/40 ring-4 ring-teal-500/20 dark:bg-teal-500/10'
                    : isCurrent
                      ? 'border-slate-200 bg-slate-50/60 opacity-75 dark:border-slate-700 dark:bg-slate-800/40'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                } ${isCurrent ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {plan.isRecommended && !isCurrent && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm shadow-teal-600/30">
                    Mais escolhido
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    Atual
                  </span>
                )}

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {plan.tagline}
                  </p>
                  <p className="mt-1 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {plan.name}
                  </p>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {formatPlanPrice(displayPrice, plan.currency)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      /{interval === 'month' ? 'mês' : 'ano'}
                    </span>
                  )}
                </div>

                <ul className="mt-4 flex-1 space-y-1.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <Check
                        className={`mt-0.5 h-3 w-3 shrink-0 ${
                          plan.isRecommended
                            ? 'text-teal-600 dark:text-teal-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                        strokeWidth={3}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>
      </div>
    </ModalShell>
  )
}

// =============================================================================
// AddPaymentMethodModal
// =============================================================================

interface AddPaymentMethodModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (token: string, setAsDefault: boolean) => void
  isAdding?: boolean
}

export function AddPaymentMethodModal({
  open,
  onClose,
  onConfirm,
  isAdding,
}: AddPaymentMethodModalProps) {
  const [number, setNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [zip, setZip] = useState('')
  const [setAsDefault, setSetAsDefault] = useState(true)

  useEffect(() => {
    if (open) {
      setNumber('')
      setExpiry('')
      setCvc('')
      setName('')
      setZip('')
      setSetAsDefault(true)
    }
  }, [open])

  const valid =
    number.replace(/\s/g, '').length >= 13 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvc.length >= 3 &&
    name.trim().length > 0

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Adicionar cartão"
      subtitle="Pagamento processado com segurança via Stripe"
      size="md"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton
            loading={isAdding}
            disabled={!valid}
            onClick={() => onConfirm('stripe_token_mock', setAsDefault)}
          >
            Adicionar cartão
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Número do cartão
            </span>
            <input
              type="text"
              value={number}
              onChange={(e) =>
                setNumber(
                  e.target.value
                    .replace(/\D/g, '')
                    .slice(0, 16)
                    .replace(/(.{4})/g, '$1 ')
                    .trim(),
                )
              }
              placeholder="0000 0000 0000 0000"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Validade
            </span>
            <input
              type="text"
              value={expiry}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
                if (digits.length >= 3) {
                  setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`)
                } else {
                  setExpiry(digits)
                }
              }}
              placeholder="MM/AA"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
          <label className="block">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              CVC
            </span>
            <input
              type="text"
              value={cvc}
              onChange={(e) =>
                setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))
              }
              placeholder="123"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
        </div>
        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Nome no cartão
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            placeholder="NOME COMPLETO"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm uppercase text-slate-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>
        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            CEP
          </span>
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="00000-000"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={setAsDefault}
            onChange={(e) => setSetAsDefault(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          Definir como padrão
        </label>
      </div>
    </ModalShell>
  )
}

// =============================================================================
// CancelSubscriptionModal
// =============================================================================

const CANCEL_REASONS: Array<{ value: CancelReason; label: string }> = [
  { value: 'too_expensive', label: 'Preço muito alto' },
  { value: 'not_using', label: 'Não uso o suficiente' },
  { value: 'switched_professional', label: 'Mudei de profissional' },
  { value: 'found_alternative', label: 'Encontrei alternativa' },
  { value: 'other', label: 'Outro motivo' },
]

interface CancelSubscriptionModalProps {
  open: boolean
  onClose: () => void
  accessUntil: string
  onConfirm: (payload: CancelSubscriptionPayload) => void
  isCancelling?: boolean
}

export function CancelSubscriptionModal({
  open,
  onClose,
  accessUntil,
  onConfirm,
  isCancelling,
}: CancelSubscriptionModalProps) {
  const [reason, setReason] = useState<CancelReason | null>(null)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (open) {
      setReason(null)
      setFeedback('')
    }
  }, [open])

  const formattedDate = new Date(accessUntil).toLocaleDateString('pt-BR')

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Cancelar assinatura?"
      subtitle="Vamos sentir sua falta"
      size="md"
      footer={
        <>
          <PrimaryButton onClick={onClose}>Manter assinatura</PrimaryButton>
          <button
            type="button"
            onClick={() => onConfirm({ reason, feedback: feedback || null })}
            disabled={isCancelling}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
          >
            {isCancelling && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Cancelar mesmo assim
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl border-2 border-teal-200 bg-teal-50/50 px-4 py-3 dark:border-teal-500/30 dark:bg-teal-500/10">
          <p className="text-sm text-teal-900 dark:text-teal-100">
            <strong className="font-semibold">
              Você manterá acesso até {formattedDate}.
            </strong>
            <br />
            Depois disso, sua conta retorna ao plano Free.
          </p>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Por que está cancelando? <span className="font-normal italic">(opcional)</span>
          </p>
          <div className="space-y-1.5">
            {CANCEL_REASONS.map((opt) => {
              const active = reason === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setReason(opt.value)}
                  className={`flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2 text-left text-sm transition ${
                    active
                      ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-500/10'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      active
                        ? 'border-teal-500 bg-teal-500'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">
                    {opt.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Algum feedback adicional? <span className="font-normal italic">(opcional)</span>
          </span>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="Conta pra gente o que poderíamos melhorar..."
            className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>
      </div>
    </ModalShell>
  )
}
