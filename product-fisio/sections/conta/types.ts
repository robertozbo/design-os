export type PlanoTier = 'free' | 'plus' | 'pro' | 'premium'
export type StatusCobranca = 'paga' | 'pendente' | 'falhou' | 'reembolsada'
export type BandeiraCartao = 'visa' | 'mastercard' | 'amex' | 'elo' | 'outro'

export interface MetodoPagamento {
  id: string
  bandeira: BandeiraCartao
  ultimos4: string
  validade: string // 'MM/YY'
  nomeNoCartao: string
  principal: boolean
  stripePaymentMethodId: string
}

export interface Cobranca {
  id: string
  data: string
  descricao: string
  valorCentavos: number
  status: StatusCobranca
  stripeInvoiceId: string
  notaFiscalUrl: string | null
}

export interface PlanoOption {
  tier: PlanoTier
  nome: string
  precoCentavos: number
  destaque: boolean
  badge: string | null
  features: string[]
  limites: {
    pacientes: number | 'ilimitado'
    sessoesMes: number | 'ilimitado'
    armazenamentoGB: number | 'ilimitado'
  }
}

export interface ContaData {
  tierAtual: PlanoTier
  proximaCobrancaData: string | null
  proximaCobrancaCentavos: number | null
  diasDesdeAssinatura: number
  metodosPagamento: MetodoPagamento[]
  cobrancasRecentes: Cobranca[]
  planosDisponiveis: PlanoOption[]
}
