import { useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  Lock,
  Plus,
  Receipt,
  Sparkles,
  Star,
  Trash2,
  X,
  XCircle,
} from 'lucide-react'
import initialData from '@/../product-fisio/sections/conta/data.json'
import type {
  BandeiraCartao,
  Cobranca,
  ContaData,
  MetodoPagamento,
  PlanoOption,
  PlanoTier,
  StatusCobranca,
} from '@/../product-fisio/sections/conta/types'

const STATUS_TONE: Record<StatusCobranca, { label: string; tone: string; Icon: typeof Check }> = {
  paga: {
    label: 'Paga',
    tone: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:ring-emerald-900/60',
    Icon: CheckCircle2,
  },
  pendente: {
    label: 'Pendente',
    tone: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-900/60',
    Icon: AlertCircle,
  },
  falhou: {
    label: 'Falhou',
    tone: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:ring-rose-900/60',
    Icon: XCircle,
  },
  reembolsada: {
    label: 'Reembolsada',
    tone: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
    Icon: AlertCircle,
  },
}

const BANDEIRA_LABEL: Record<BandeiraCartao, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'Amex',
  elo: 'Elo',
  outro: 'Cartão',
}

const TIER_STYLE: Record<
  PlanoTier,
  { gradient: string; ring: string; text: string; badge: string }
> = {
  free: {
    gradient: 'from-slate-500 to-slate-600',
    ring: 'ring-slate-300 dark:ring-slate-700',
    text: 'text-slate-700 dark:text-slate-300',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  plus: {
    gradient: 'from-teal-500 to-cyan-500',
    ring: 'ring-teal-300 dark:ring-teal-700',
    text: 'text-teal-700 dark:text-teal-300',
    badge: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  },
  pro: {
    gradient: 'from-orange-500 to-pink-500',
    ring: 'ring-orange-300 dark:ring-orange-700',
    text: 'text-orange-700 dark:text-orange-300',
    badge: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
  },
  premium: {
    gradient: 'from-violet-500 to-fuchsia-500',
    ring: 'ring-violet-300 dark:ring-violet-700',
    text: 'text-violet-700 dark:text-violet-300',
    badge: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  },
}

function fmtBRL(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatData(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function MinhaConta() {
  const [conta, setConta] = useState<ContaData>(initialData as unknown as ContaData)
  const [upgradeModal, setUpgradeModal] = useState<PlanoTier | null>(null)

  const planoAtual = conta.planosDisponiveis.find((p) => p.tier === conta.tierAtual)!
  const planoStyle = TIER_STYLE[conta.tierAtual]
  const cartaoPrincipal = conta.metodosPagamento.find((m) => m.principal)
  const tierOrder: PlanoTier[] = ['free', 'plus', 'pro', 'premium']
  const proximoUpgrade =
    tierOrder[Math.min(tierOrder.indexOf(conta.tierAtual) + 1, tierOrder.length - 1)]

  const tornarPrincipal = (id: string) => {
    setConta((c) => ({
      ...c,
      metodosPagamento: c.metodosPagamento.map((m) => ({ ...m, principal: m.id === id })),
    }))
  }

  const remover = (id: string) => {
    setConta((c) => ({
      ...c,
      metodosPagamento: c.metodosPagamento.filter((m) => m.id !== id),
    }))
  }

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="size-1.5 rounded-full bg-teal-500" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Conta · Cobrança
            </span>
          </div>
          <div className="flex items-start gap-3">
            <div className="size-11 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-center shrink-0">
              <CreditCard className="size-5 text-teal-600 dark:text-teal-400" strokeWidth={1.7} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Minha conta
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Assinatura, cobrança e formas de pagamento via Stripe.
              </p>
            </div>
          </div>
        </header>

        {/* Plano atual */}
        <div
          className={`rounded-2xl bg-gradient-to-br ${planoStyle.gradient} text-white p-6 mb-4 shadow-lg`}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/20 backdrop-blur text-[10px] font-semibold uppercase tracking-wider">
                  Plano atual
                </span>
                {conta.tierAtual !== 'free' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium opacity-90">
                    <Lock className="size-3" strokeWidth={2} />
                    Stripe seguro
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold leading-tight">Atender Fisio · {planoAtual.nome}</h2>
              {planoAtual.precoCentavos === 0 ? (
                <p className="mt-1 text-sm opacity-90 font-mono">Gratuito · sem renovação</p>
              ) : (
                <p className="mt-1 text-sm opacity-90 font-mono">
                  {fmtBRL(planoAtual.precoCentavos)} / mês ·{' '}
                  {conta.diasDesdeAssinatura} dias desde a assinatura
                </p>
              )}
              {conta.proximaCobrancaData && conta.proximaCobrancaCentavos && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="opacity-80">Próxima cobrança:</span>
                  <span className="font-mono font-semibold tabular-nums">
                    {fmtBRL(conta.proximaCobrancaCentavos)}
                  </span>
                  <span className="opacity-60">·</span>
                  <span className="font-mono opacity-80">
                    {formatData(conta.proximaCobrancaData)}
                  </span>
                </div>
              )}
            </div>
            {proximoUpgrade !== conta.tierAtual && (
              <button
                onClick={() => setUpgradeModal(proximoUpgrade)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-50 text-sm font-semibold shadow-sm"
              >
                <Sparkles className="size-4" strokeWidth={2} />
                Upgrade pra{' '}
                {conta.planosDisponiveis.find((p) => p.tier === proximoUpgrade)?.nome}
              </button>
            )}
          </div>

          {/* Features incluídas */}
          <div className="mt-5 pt-5 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {planoAtual.features.slice(0, 6).map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-[12px]">
                <Check className="size-3 shrink-0" strokeWidth={3} />
                <span className="opacity-90">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Métodos de pagamento */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 mb-4">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-1.5">
              <CreditCard className="size-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Métodos de pagamento
              </span>
            </div>
            <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30">
              <Plus className="size-3" strokeWidth={2.5} />
              Adicionar cartão
            </button>
          </div>
          <div className="space-y-2">
            {conta.metodosPagamento.map((m) => (
              <MetodoRow
                key={m.id}
                metodo={m}
                onTornarPrincipal={() => tornarPrincipal(m.id)}
                onRemover={() => remover(m.id)}
              />
            ))}
          </div>
        </div>

        {/* Histórico de cobranças */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 mb-4">
          <div className="flex items-center gap-1.5 mb-4">
            <Receipt className="size-3.5 text-slate-500" strokeWidth={1.75} />
            <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Histórico de cobranças
            </span>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr className="text-left">
                  <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Data
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Descrição
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                    Valor
                  </th>
                  <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {conta.cobrancasRecentes.map((c, i) => (
                  <CobrancaRow key={c.id} cobranca={c} isEven={i % 2 === 0} />
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[10px] text-slate-400 dark:text-slate-600 font-mono">
            Cobranças processadas por <span className="font-semibold">Stripe</span> · IDs visíveis no painel
          </p>
        </div>

        {/* Comparar planos */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center gap-1.5 mb-4">
            <Sparkles className="size-3.5 text-slate-500" strokeWidth={1.75} />
            <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Comparar planos
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {conta.planosDisponiveis.map((p) => (
              <PlanoCard
                key={p.tier}
                plano={p}
                atual={p.tier === conta.tierAtual}
                onUpgrade={() => setUpgradeModal(p.tier)}
              />
            ))}
          </div>
        </div>
      </div>

      {upgradeModal && (
        <UpgradeModal
          plano={conta.planosDisponiveis.find((p) => p.tier === upgradeModal)!}
          cartao={cartaoPrincipal}
          onClose={() => setUpgradeModal(null)}
          onConfirm={() => {
            setConta((c) => ({ ...c, tierAtual: upgradeModal }))
            setUpgradeModal(null)
          }}
        />
      )}
    </div>
  )
}

/* ─────────── Método de pagamento row ─────────── */
function MetodoRow({
  metodo,
  onTornarPrincipal,
  onRemover,
}: {
  metodo: MetodoPagamento
  onTornarPrincipal: () => void
  onRemover: () => void
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
        metodo.principal
          ? 'border-teal-200 bg-teal-50/50 dark:border-teal-900/60 dark:bg-teal-950/20'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="size-10 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-mono text-[10px] font-bold uppercase shrink-0">
        {BANDEIRA_LABEL[metodo.bandeira]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-mono tabular-nums text-slate-900 dark:text-slate-50">
            •••• {metodo.ultimos4}
          </span>
          {metodo.principal && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-[9px] font-bold uppercase tracking-wider">
              <Star className="size-2.5 fill-current" />
              Principal
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-500 font-mono">
          {metodo.nomeNoCartao} · vence {metodo.validade}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {!metodo.principal && (
          <button
            onClick={onTornarPrincipal}
            className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-medium"
          >
            Tornar principal
          </button>
        )}
        <button
          onClick={onRemover}
          className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
          aria-label="Remover"
        >
          <Trash2 className="size-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

/* ─────────── Cobrança row ─────────── */
function CobrancaRow({ cobranca, isEven }: { cobranca: Cobranca; isEven: boolean }) {
  const s = STATUS_TONE[cobranca.status]
  const Icon = s.Icon
  return (
    <tr
      className={`border-t border-slate-100 dark:border-slate-800 ${
        isEven ? '' : 'bg-slate-50/40 dark:bg-slate-800/20'
      }`}
    >
      <td className="px-4 py-2.5 text-xs font-mono tabular-nums text-slate-700 dark:text-slate-300">
        {formatData(cobranca.data)}
      </td>
      <td className="px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100">
        {cobranca.descricao}
        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-600 mt-0.5">
          {cobranca.stripeInvoiceId}
        </div>
      </td>
      <td className="px-4 py-2.5 text-xs font-mono font-semibold tabular-nums text-right text-slate-900 dark:text-slate-100">
        {fmtBRL(cobranca.valorCentavos)}
      </td>
      <td className="px-4 py-2.5">
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ring-1 ${s.tone}`}
        >
          <Icon className="size-2.5" strokeWidth={2.5} />
          {s.label}
        </span>
      </td>
      <td className="px-4 py-2.5 text-right">
        {cobranca.notaFiscalUrl ? (
          <a
            href={cobranca.notaFiscalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 hover:underline"
          >
            <Download className="size-3" strokeWidth={2} />
            Nota
          </a>
        ) : (
          <span className="text-[11px] text-slate-300 dark:text-slate-700">—</span>
        )}
      </td>
    </tr>
  )
}

/* ─────────── Plano card pra comparar ─────────── */
function PlanoCard({
  plano,
  atual,
  onUpgrade,
}: {
  plano: PlanoOption
  atual: boolean
  onUpgrade: () => void
}) {
  const style = TIER_STYLE[plano.tier]
  return (
    <div
      className={`relative rounded-2xl p-4 ring-1 ${
        atual
          ? `bg-white dark:bg-slate-900 ${style.ring} ring-2`
          : 'bg-slate-50/60 dark:bg-slate-900/40 ring-slate-200 dark:ring-slate-800'
      } ${plano.destaque ? 'shadow-lg' : ''}`}
    >
      {plano.destaque && (
        <span className="absolute -top-2 right-3 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-orange-500 text-white text-[9px] font-bold uppercase tracking-wider">
          <Sparkles className="size-2.5" />
          {plano.badge}
        </span>
      )}
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${style.badge}`}
        >
          {plano.nome}
        </span>
        {atual && (
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Atual
          </span>
        )}
      </div>
      <div className="mt-3">
        {plano.precoCentavos === 0 ? (
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">Grátis</div>
        ) : (
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
              {fmtBRL(plano.precoCentavos)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/mês</span>
          </div>
        )}
      </div>
      <ul className="mt-3 space-y-1">
        {plano.features.slice(0, 4).map((f) => (
          <li key={f} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
            <Check className="size-2.5 mt-1 shrink-0 text-teal-600 dark:text-teal-400" strokeWidth={3} />
            {f}
          </li>
        ))}
        {plano.features.length > 4 && (
          <li className="text-[10px] text-slate-400 dark:text-slate-600 pl-3.5">
            +{plano.features.length - 4} recursos
          </li>
        )}
      </ul>
      {!atual && (
        <button
          onClick={onUpgrade}
          className={`mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
            plano.destaque
              ? `bg-gradient-to-r ${style.gradient} text-white`
              : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {plano.precoCentavos === 0 ? 'Cancelar e voltar pra Free' : `Mudar pra ${plano.nome}`}
          <ArrowRight className="size-3" strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}

/* ─────────── Modal de upgrade (Stripe checkout simulado) ─────────── */
function UpgradeModal({
  plano,
  cartao,
  onClose,
  onConfirm,
}: {
  plano: PlanoOption
  cartao: MetodoPagamento | undefined
  onClose: () => void
  onConfirm: () => void
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const style = TIER_STYLE[plano.tier]

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 pt-5 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="size-3.5 text-slate-500" strokeWidth={2} />
              <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                Checkout Stripe seguro
              </span>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="size-4" strokeWidth={2} />
            </button>
          </div>

          {/* Stepper */}
          <div className="px-6 pt-4 pb-2 flex items-center gap-1">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex-1 flex items-center gap-1">
                <span
                  className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    n <= step
                      ? `bg-gradient-to-r ${style.gradient} text-white`
                      : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                  }`}
                >
                  {n < step ? <Check className="size-3" strokeWidth={3} /> : n}
                </span>
                {n < 3 && (
                  <div
                    className={`flex-1 h-px ${
                      n < step ? `bg-gradient-to-r ${style.gradient}` : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {step === 1 && (
              <Step1 plano={plano} />
            )}
            {step === 2 && (
              <Step2 cartao={cartao} />
            )}
            {step === 3 && (
              <Step3 plano={plano} />
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            {step > 1 && step < 3 ? (
              <button
                onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Voltar
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {step === 3 ? 'Fechar' : 'Cancelar'}
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 2) {
                    // simula chamada Stripe
                    setTimeout(() => setStep(3), 600)
                  } else {
                    setStep((step + 1) as 1 | 2 | 3)
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r ${style.gradient} text-white text-sm font-semibold`}
              >
                {step === 2 ? (
                  <>
                    <Lock className="size-3.5" strokeWidth={2} />
                    Confirmar e pagar {fmtBRL(plano.precoCentavos)}
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="size-3.5" strokeWidth={2} />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onConfirm}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r ${style.gradient} text-white text-sm font-semibold`}
              >
                <Sparkles className="size-3.5" strokeWidth={2} />
                Pronto, ativar plano
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function Step1({ plano }: { plano: PlanoOption }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
        Revisar plano {plano.nome}
      </h3>
      <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
        Você pode cancelar a qualquer momento — sem multa.
      </p>
      <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-slate-600 dark:text-slate-400">Plano</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Atender Fisio · {plano.nome}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-slate-600 dark:text-slate-400">Cobrança</span>
          <span className="text-sm font-mono tabular-nums text-slate-900 dark:text-slate-50">
            {fmtBRL(plano.precoCentavos)} / mês
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
            Total hoje
          </span>
          <span className="text-base font-bold tabular-nums text-slate-900 dark:text-slate-50">
            {fmtBRL(plano.precoCentavos)}
          </span>
        </div>
      </div>
      <ul className="mt-4 space-y-1.5">
        {plano.features.slice(0, 5).map((f) => (
          <li key={f} className="flex items-start gap-1.5 text-[12px] text-slate-700 dark:text-slate-300">
            <Check className="size-3 mt-0.5 text-teal-600 dark:text-teal-400 shrink-0" strokeWidth={3} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Step2({ cartao }: { cartao: MetodoPagamento | undefined }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
        Confirmar forma de pagamento
      </h3>
      <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
        Vamos cobrar no cartão principal já cadastrado no Stripe.
      </p>
      {cartao ? (
        <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">
          <div className="size-12 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-mono text-[11px] font-bold uppercase shrink-0">
            {BANDEIRA_LABEL[cartao.bandeira]}
          </div>
          <div className="flex-1">
            <div className="text-sm font-mono tabular-nums text-slate-900 dark:text-slate-50">
              •••• •••• •••• {cartao.ultimos4}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-500 font-mono">
              {cartao.nomeNoCartao} · vence {cartao.validade}
            </div>
          </div>
          <button className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-medium">
            Trocar
          </button>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center">
          <CreditCard className="mx-auto size-5 text-slate-400" strokeWidth={1.7} />
          <p className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
            Nenhum cartão cadastrado. Adicione um para continuar.
          </p>
        </div>
      )}
      <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
        <Lock className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={2} />
        <span className="text-[11px] text-emerald-800 dark:text-emerald-200">
          Pagamento processado por Stripe · PCI-DSS Nível 1
        </span>
      </div>
    </div>
  )
}

function Step3({ plano }: { plano: PlanoOption }) {
  return (
    <div className="text-center py-4">
      <div className="mx-auto size-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-3">
        <CheckCircle2 className="size-7 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        Plano {plano.nome} ativado!
      </h3>
      <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
        Cobrança de {fmtBRL(plano.precoCentavos)} efetuada. Nota fiscal disponível em até 24h no seu histórico.
      </p>
    </div>
  )
}
