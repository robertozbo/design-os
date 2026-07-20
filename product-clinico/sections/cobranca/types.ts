// Types for Cobrança (Web — persona Secretária)
// NOTE: no clinical data here. Only commercial/administrative fields.

export type MetodoPagamento = 'pix' | 'cartao' | 'ambos'

export type StatusCobranca = 'pago' | 'pendente' | 'link_enviado' | 'cancelado'

export type StatusConvenio = 'enviado' | 'em_analise' | 'pago' | 'glosado'

export type AbaCobranca = 'particular' | 'convenio'

export type PeriodoFiltro = '7d' | '30d' | '90d' | 'tudo'

export interface KpiFinanceiro {
  id: string
  label: string
  valor: string
  delta: string
  deltaPositivo: boolean
}

export interface Recibo {
  id: string
  emitidoEm: string // ISO date
  canal: 'email' | 'whatsapp'
}

export interface CobrancaParticular {
  id: string
  pacienteNome: string
  pacienteInicial: string
  descricao: string
  valorBrl: number
  metodo: MetodoPagamento
  status: StatusCobranca
  criadaEm: string // ISO date
  pagaEm: string | null
  linkPagamento: string | null
  recibos: Recibo[]
}

export interface AtendimentoConvenio {
  id: string
  pacienteNome: string
  pacienteInicial: string
  convenio: string
  procedimento: string
  valorEstimadoBrl: number
  status: StatusConvenio
  atualizadoEm: string // ISO date
  observacao: string | null
}

export interface FiltroCobranca {
  busca: string
  status: StatusCobranca[]
  periodo: PeriodoFiltro
}

export interface CobrancaData {
  kpis: KpiFinanceiro[]
  particulares: CobrancaParticular[]
  convenios: AtendimentoConvenio[]
}

export interface CobrancaProps {
  data: CobrancaData
  abaAtiva?: AbaCobranca
  filtro?: FiltroCobranca

  onChangeAba?: (aba: AbaCobranca) => void
  onChangeFiltro?: (filtro: FiltroCobranca) => void
  onNovoLink?: () => void
  onCopiarLink?: (id: string) => void
  onReenviar?: (id: string) => void
  onEmitirRecibo?: (id: string) => void
  onCancelar?: (id: string) => void
  onStatusConvenioChange?: (id: string, status: StatusConvenio) => void
  onExportarCsv?: (aba: AbaCobranca) => void
}
