// Types for Plano (Mobile)
//
// Section de assinatura/upgrade integrada com Stripe (backend module: payment).
// Tiers: free, plus, pro. Backend types: see api-types/billing.ts (a criar).

export type PlanoTier = 'free' | 'plus' | 'pro'

export type CicloFaturamento = 'monthly' | 'yearly'

export type StatusAssinatura = 'active' | 'trialing' | 'cancelled' | 'past_due' | 'expired'

export interface PlanoPreco {
  /** Valor em centavos pra precisão (R$ 4990 = 49,90) */
  valorCentavos: number
  /** Currency code */
  moeda: 'BRL' | 'USD' | 'EUR'
  /** stripe_price_id (null pra free) */
  stripePriceId: string | null
  /** Label legível ("R$ 49,90/mês") */
  label: string
  /** Para anual: valor mensal equivalente ("R$ 39,90/mês equivalente") */
  labelMensalEquivalente?: string
}

export interface PlanoTierConfig {
  tier: PlanoTier
  /** Label legível ("Plus", "Pro") */
  label: string
  /** Tagline curta */
  tagline: string
  /** Cor visual */
  cor: 'slate' | 'teal' | 'violet'
  /** Preço mensal */
  precoMensal: PlanoPreco
  /** Preço anual (com desconto). null pra free. */
  precoAnual: PlanoPreco | null
  /** % de desconto no anual ("16%") */
  descontoAnualPct: number | null
  /** Lista de features */
  features: PlanoFeature[]
  /** Plano destacado como recomendado */
  recomendado?: boolean
}

export interface PlanoFeature {
  /** Texto da feature */
  texto: string
  /** Inclusa neste tier */
  incluso: boolean
  /** Destaque visual (quando esse tier é o que primeiro inclui essa feature) */
  destaque?: boolean
}

export interface AssinaturaAtual {
  tier: PlanoTier
  status: StatusAssinatura
  /** stripe_subscription_id */
  stripeSubscriptionId: string | null
  ciclo: CicloFaturamento | null
  /** ISO date — próxima cobrança / fim do período */
  renovaEm: string | null
  /** Cancelamento agendado pra fim do período */
  canceladoEm: string | null
  /** Em trial gratuito */
  emTrial: boolean
  /** Fim do trial (se em trial) */
  trialAteEm: string | null
}

export interface PaymentMethodResumo {
  id: string
  /** Tipo */
  tipo: 'credit_card' | 'debit_card' | 'pix' | 'boleto'
  /** Bandeira (visa, mastercard, etc) */
  bandeira: string | null
  /** Últimos 4 dígitos do cartão */
  ultimos4: string | null
  /** Vencimento "MM/AA" */
  vencimento: string | null
  /** Default */
  isDefault: boolean
}

export interface FaturaResumo {
  id: string
  /** ISO date */
  data: string
  /** Valor formatado ("R$ 49,90") */
  valor: string
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  /** URL pra fatura PDF na Stripe */
  invoicePdfUrl: string | null
}

export interface PlanoData {
  /** Tiers disponíveis em ordem (free, plus, pro) */
  tiers: PlanoTierConfig[]
  /** Estado atual do usuário */
  assinaturaAtual: AssinaturaAtual
  /** Métodos de pagamento salvos */
  metodosPagamento: PaymentMethodResumo[]
  /** Histórico de faturas (mais recentes) */
  faturas: FaturaResumo[]
}

export interface PlanoProps {
  data: PlanoData
  /** Trigger Stripe Checkout pra assinar/upgrade */
  onAssinar?: (tier: PlanoTier, ciclo: CicloFaturamento) => void
  onCancelarAssinatura?: () => void
  onReativarAssinatura?: () => void
  onAlterarMetodoPagamento?: () => void
  onVerFatura?: (faturaId: string) => void
}
