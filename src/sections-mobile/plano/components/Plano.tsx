import { useState } from 'react'
import {
  Check,
  X,
  Crown,
  Sparkles,
  CreditCard,
  Receipt,
  Shield,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'
import type {
  PlanoData,
  PlanoProps,
  PlanoTierConfig,
  CicloFaturamento,
  PlanoTier,
  PaymentMethodResumo,
  FaturaResumo,
  AssinaturaAtual,
} from '@/../product-mobile/sections/plano/types'

const COR_TIER: Record<PlanoTierConfig['cor'], { bg: string; text: string; border: string; ring: string }> = {
  slate: { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700', ring: 'ring-slate-700' },
  teal: { bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/40', ring: 'ring-teal-500/40' },
  violet: { bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/40', ring: 'ring-violet-500/40' },
}

const STATUS_VISUAL: Record<AssinaturaAtual['status'], { label: string; cls: string }> = {
  active: { label: 'Ativa', cls: 'bg-emerald-500/15 text-emerald-300' },
  trialing: { label: 'Em trial', cls: 'bg-sky-500/15 text-sky-300' },
  cancelled: { label: 'Cancelada', cls: 'bg-rose-500/15 text-rose-300' },
  past_due: { label: 'Pagamento pendente', cls: 'bg-amber-500/15 text-amber-300' },
  expired: { label: 'Expirada', cls: 'bg-slate-800 text-slate-400' },
}

function formatDataBR(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function Plano({
  data,
  onAssinar,
  onCancelarAssinatura,
  onAlterarMetodoPagamento,
  onVerFatura,
}: PlanoProps) {
  const [ciclo, setCiclo] = useState<CicloFaturamento>('monthly')
  const tierAtual = data.assinaturaAtual.tier
  const ehPagante = tierAtual !== 'free'
  const ehBloqueado =
    data.assinaturaAtual.status === 'expired' ||
    data.assinaturaAtual.status === 'past_due' ||
    (data.assinaturaAtual.status === 'cancelled' && data.assinaturaAtual.canceladoEm === null)

  return (
    <div className="min-h-full bg-slate-950 pb-6">
      {ehBloqueado && (
        <ExpiredBanner
          assinatura={data.assinaturaAtual}
          onRenovar={() => {
            const tierPraRenovar = tierAtual === 'free' ? 'plus' : tierAtual
            onAssinar?.(tierPraRenovar, data.assinaturaAtual.ciclo ?? 'monthly')
          }}
        />
      )}

      <AssinaturaAtualCard
        assinatura={data.assinaturaAtual}
        tierConfig={data.tiers.find((t) => t.tier === tierAtual)!}
      />

      <div className="px-4 mt-1 mb-3">
        <CicloToggle ciclo={ciclo} onChange={setCiclo} desconto={20} />
      </div>

      <div className="px-4 space-y-3">
        {data.tiers.map((tier) => (
          <PlanCard
            key={tier.tier}
            tier={tier}
            ciclo={ciclo}
            isAtual={tier.tier === tierAtual}
            tierAtualOrdem={ordemTier(tierAtual)}
            onAssinar={onAssinar}
          />
        ))}
      </div>

      {ehPagante && (
        <>
          <SectionLabel label="Método de pagamento" />
          <div className="bg-slate-900 border-y border-slate-800">
            {data.metodosPagamento.map((m) => (
              <PaymentMethodRow key={m.id} pm={m} onClick={onAlterarMetodoPagamento} />
            ))}
            <button
              onClick={onAlterarMetodoPagamento}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800/40 text-left"
            >
              <div className="w-9 h-9 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                <CreditCard size={14} strokeWidth={2.2} />
              </div>
              <span className="text-slate-300 font-medium text-[12.5px] flex-1">
                Adicionar método de pagamento
              </span>
              <ChevronRight size={13} className="text-slate-600" />
            </button>
          </div>

          <SectionLabel label="Histórico de pagamentos" />
          <div className="bg-slate-900 border-y border-slate-800">
            {data.faturas.map((f, i) => (
              <FaturaRow
                key={f.id}
                fatura={f}
                isLast={i === data.faturas.length - 1}
                onClick={onVerFatura}
              />
            ))}
          </div>

          <div className="px-4 mt-5">
            {data.assinaturaAtual.canceladoEm ? (
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 flex items-start gap-3">
                <AlertTriangle size={15} className="text-amber-300 mt-0.5 shrink-0" strokeWidth={2.2} />
                <div className="min-w-0">
                  <div className="text-amber-200 text-[12.5px] font-semibold">Cancelamento agendado</div>
                  <div className="text-amber-200/70 text-[11px] mt-0.5 leading-snug">
                    Sua assinatura termina em{' '}
                    <span className="font-mono">{formatDataBR(data.assinaturaAtual.renovaEm!)}</span>.
                    Você pode reativar a qualquer momento antes.
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onCancelarAssinatura}
                className="w-full h-11 rounded-2xl border border-slate-800 text-slate-400 hover:text-rose-300 hover:border-rose-500/30 text-[12.5px] font-medium"
              >
                Cancelar assinatura
              </button>
            )}
          </div>
        </>
      )}

      <div className="px-5 mt-6 flex items-center justify-center gap-2">
        <Shield size={11} className="text-slate-600" strokeWidth={2.2} />
        <span className="text-slate-600 text-[10px] font-mono">
          Pagamento seguro via Stripe · cancele quando quiser
        </span>
      </div>

      <div className="px-5 mt-2 text-center text-slate-700 text-[10px]">
        Os valores podem variar conforme a região.
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface ExpiredBannerProps {
  assinatura: AssinaturaAtual
  onRenovar: () => void
}

function ExpiredBanner({ assinatura, onRenovar }: ExpiredBannerProps) {
  const isPastDue = assinatura.status === 'past_due'
  const isExpired = assinatura.status === 'expired'

  const titulo = isPastDue
    ? 'Pagamento pendente'
    : isExpired
      ? 'Sua assinatura expirou'
      : 'Assinatura cancelada'

  const descricao = isPastDue
    ? 'A última cobrança falhou. Atualize o pagamento pra continuar com acesso completo.'
    : isExpired
      ? `${assinatura.renovaEm ? `Expirou em ${formatDataBR(assinatura.renovaEm)}. ` : ''}Renove agora pra recuperar todos os recursos.`
      : 'Seu acesso a recursos premium foi suspenso. Reative quando quiser.'

  const cor = isPastDue ? 'amber' : 'rose'
  const corMap = {
    amber: { bg: 'from-amber-500/15 to-orange-500/10', border: 'border-amber-500/40', text: 'text-amber-200', icon: 'text-amber-300', iconBg: 'bg-amber-500/20' },
    rose: { bg: 'from-rose-500/15 to-violet-500/10', border: 'border-rose-500/40', text: 'text-rose-200', icon: 'text-rose-300', iconBg: 'bg-rose-500/20' },
  } as const
  const c = corMap[cor]

  return (
    <div
      className={`mx-4 mt-3 mb-2 rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} p-4`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center ${c.icon} shrink-0`}>
          <AlertTriangle size={20} strokeWidth={2.4} />
        </div>
        <div className="min-w-0 flex-1">
          <div className={`${c.text} font-bold text-[14px]`}>{titulo}</div>
          <div className={`${c.text} opacity-80 text-[11.5px] mt-1 leading-snug`}>{descricao}</div>
        </div>
      </div>
      <button
        onClick={onRenovar}
        className="mt-3 w-full h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-bold text-[14px] flex items-center justify-center gap-2"
      >
        <Crown size={15} strokeWidth={2.6} />
        {isPastDue ? 'Atualizar pagamento' : 'Renovar agora'}
      </button>
    </div>
  )
}

function ordemTier(tier: PlanoTier): number {
  const map: Record<PlanoTier, number> = { free: 0, plus: 1, pro: 2 }
  return map[tier]
}

interface AssinaturaAtualCardProps {
  assinatura: AssinaturaAtual
  tierConfig: PlanoTierConfig
}

function AssinaturaAtualCard({ assinatura, tierConfig }: AssinaturaAtualCardProps) {
  const cor = COR_TIER[tierConfig.cor]
  const status = STATUS_VISUAL[assinatura.status]
  return (
    <div className="mx-4 mt-3 mb-4 rounded-2xl bg-slate-900 border border-slate-800 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
          Plano atual
        </div>
        <span className={`px-2 py-0.5 rounded-full ${status.cls} text-[9.5px] font-bold uppercase tracking-wider`}>
          {status.label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${cor.bg} flex items-center justify-center ${cor.text}`}>
          {tierConfig.tier === 'pro' ? (
            <Crown size={22} strokeWidth={2.4} />
          ) : tierConfig.tier === 'plus' ? (
            <Sparkles size={22} strokeWidth={2.4} />
          ) : (
            <Shield size={22} strokeWidth={2.4} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-bold text-[18px] leading-tight">{tierConfig.label}</div>
          <div className="text-slate-500 text-[11px] mt-0.5">{tierConfig.tagline}</div>
        </div>
      </div>
      {assinatura.renovaEm && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">
            {assinatura.canceladoEm ? 'Termina em' : 'Próxima renovação'}
          </span>
          <span className="text-slate-200 font-mono tabular-nums">
            {formatDataBR(assinatura.renovaEm)}
          </span>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface CicloToggleProps {
  ciclo: CicloFaturamento
  onChange: (c: CicloFaturamento) => void
  desconto: number
}

function CicloToggle({ ciclo, onChange, desconto }: CicloToggleProps) {
  return (
    <div className="rounded-full bg-slate-900 border border-slate-800 p-1 flex items-center relative">
      <button
        onClick={() => onChange('monthly')}
        className={`flex-1 h-9 rounded-full text-[12px] font-semibold transition-colors ${
          ciclo === 'monthly' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'
        }`}
      >
        Mensal
      </button>
      <button
        onClick={() => onChange('yearly')}
        className={`flex-1 h-9 rounded-full text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5 ${
          ciclo === 'yearly' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'
        }`}
      >
        Anual
        <span
          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
            ciclo === 'yearly' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-300'
          }`}
        >
          −{desconto}%
        </span>
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface PlanCardProps {
  tier: PlanoTierConfig
  ciclo: CicloFaturamento
  isAtual: boolean
  tierAtualOrdem: number
  onAssinar?: (tier: PlanoTier, ciclo: CicloFaturamento) => void
}

function PlanCard({ tier, ciclo, isAtual, tierAtualOrdem, onAssinar }: PlanCardProps) {
  const cor = COR_TIER[tier.cor]
  const ehFree = tier.tier === 'free'
  const preco = ciclo === 'monthly' || !tier.precoAnual ? tier.precoMensal : tier.precoAnual
  const ehDowngrade = ordemTier(tier.tier) < tierAtualOrdem
  const ehUpgrade = ordemTier(tier.tier) > tierAtualOrdem

  const ctaLabel = isAtual
    ? 'Plano atual'
    : ehFree
      ? 'Voltar ao Free'
      : ehUpgrade
        ? `Upgrade pra ${tier.label}`
        : ehDowngrade
          ? `Mudar pra ${tier.label}`
          : `Assinar ${tier.label}`

  const ctaDisabled = isAtual

  const ctaCls = isAtual
    ? 'bg-slate-800 text-slate-400 cursor-default'
    : ehFree
      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
      : tier.cor === 'violet'
        ? 'bg-gradient-to-r from-violet-500 to-sky-500 text-white'
        : 'bg-gradient-to-r from-teal-500 to-sky-500 text-white'

  return (
    <div
      className={`rounded-2xl bg-slate-900 border ${
        isAtual ? `${cor.border} ring-1 ${cor.ring}` : 'border-slate-800'
      } overflow-hidden`}
    >
      {tier.recomendado && (
        <div className="bg-gradient-to-r from-violet-500/20 to-sky-500/20 border-b border-violet-500/30 px-4 py-1.5 flex items-center gap-1.5 text-violet-200 text-[10px] font-bold uppercase tracking-wider">
          <Crown size={10} strokeWidth={2.6} />
          Recomendado pra você
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="text-slate-100 font-bold text-[18px]">{tier.label}</div>
              {isAtual && (
                <span className={`px-1.5 py-0.5 rounded ${cor.bg} ${cor.text} text-[9px] font-bold uppercase tracking-wider`}>
                  atual
                </span>
              )}
            </div>
            <div className="text-slate-500 text-[11.5px] mt-0.5">{tier.tagline}</div>
          </div>
        </div>

        <div className="mb-3">
          {ehFree ? (
            <div className="text-slate-100 font-bold text-[24px] font-mono tabular-nums">Grátis</div>
          ) : (
            <>
              <div className={`${cor.text} font-bold text-[24px] font-mono tabular-nums leading-none`}>
                {preco.label}
              </div>
              {ciclo === 'yearly' && tier.precoAnual?.labelMensalEquivalente && (
                <div className="text-slate-500 text-[10.5px] mt-1 font-mono">
                  {tier.precoAnual.labelMensalEquivalente}
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-1.5 mb-4">
          {tier.features.map((f, i) => (
            <FeatureRow key={i} feature={f} cor={tier.cor} />
          ))}
        </div>

        <button
          disabled={ctaDisabled}
          onClick={() => !ctaDisabled && onAssinar?.(tier.tier, ciclo)}
          className={`w-full h-11 rounded-2xl font-semibold text-[13px] flex items-center justify-center gap-2 ${ctaCls}`}
        >
          {!isAtual && !ehFree && <Sparkles size={13} strokeWidth={2.4} />}
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface FeatureRowProps {
  feature: PlanoData['tiers'][number]['features'][number]
  cor: PlanoTierConfig['cor']
}

function FeatureRow({ feature, cor }: FeatureRowProps) {
  const corVis = COR_TIER[cor]
  return (
    <div className="flex items-start gap-2.5">
      <div
        className={`w-4 h-4 rounded-full mt-0.5 shrink-0 flex items-center justify-center ${
          feature.incluso ? `${corVis.bg} ${corVis.text}` : 'bg-slate-800 text-slate-600'
        }`}
      >
        {feature.incluso ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
      </div>
      <span
        className={`text-[12px] leading-snug ${
          feature.incluso
            ? feature.destaque
              ? 'text-slate-100 font-semibold'
              : 'text-slate-300'
            : 'text-slate-600 line-through'
        }`}
      >
        {feature.texto}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-5 mt-5 mb-1.5 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
      {label}
    </div>
  )
}

interface PaymentMethodRowProps {
  pm: PaymentMethodResumo
  onClick?: () => void
}

function PaymentMethodRow({ pm, onClick }: PaymentMethodRowProps) {
  const bandeiraLabel = pm.bandeira ? pm.bandeira.charAt(0).toUpperCase() + pm.bandeira.slice(1) : 'Cartão'
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800/40 border-b border-slate-800/60 text-left"
    >
      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 shrink-0">
        <CreditCard size={14} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-slate-100 font-medium text-[12.5px]">
          {bandeiraLabel} ···· {pm.ultimos4}
        </div>
        <div className="text-slate-500 text-[10.5px] mt-0.5 font-mono tabular-nums">
          Vence {pm.vencimento}
        </div>
      </div>
      {pm.isDefault && (
        <span className="px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-300 text-[9px] font-bold uppercase tracking-wider shrink-0">
          padrão
        </span>
      )}
      <ChevronRight size={13} className="text-slate-600 shrink-0" />
    </button>
  )
}

interface FaturaRowProps {
  fatura: FaturaResumo
  isLast: boolean
  onClick?: (id: string) => void
}

const FATURA_STATUS: Record<FaturaResumo['status'], { label: string; cls: string }> = {
  paid: { label: 'Paga', cls: 'bg-emerald-500/15 text-emerald-300' },
  pending: { label: 'Pendente', cls: 'bg-amber-500/15 text-amber-300' },
  failed: { label: 'Falhou', cls: 'bg-rose-500/15 text-rose-300' },
  refunded: { label: 'Reembolsada', cls: 'bg-slate-800 text-slate-400' },
}

function FaturaRow({ fatura, isLast, onClick }: FaturaRowProps) {
  const status = FATURA_STATUS[fatura.status]
  return (
    <button
      onClick={() => onClick?.(fatura.id)}
      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800/40 text-left ${
        isLast ? '' : 'border-b border-slate-800/60'
      }`}
    >
      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 shrink-0">
        <Receipt size={14} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-slate-100 font-medium text-[12.5px] font-mono tabular-nums">
            {formatDataBR(fatura.data)}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded ${status.cls} text-[9px] font-bold uppercase tracking-wider`}
          >
            {status.label}
          </span>
        </div>
        <div className="text-slate-500 text-[10.5px] mt-0.5">Toque pra ver fatura</div>
      </div>
      <span className="text-slate-100 font-bold text-[13px] font-mono tabular-nums shrink-0">
        {fatura.valor}
      </span>
      <ChevronRight size={13} className="text-slate-600 shrink-0" />
    </button>
  )
}
