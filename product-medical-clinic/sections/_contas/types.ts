export type TipoConta = 'receber' | 'pagar'
export type StatusConta = 'aberto' | 'pago' | 'vencido'

export interface Conta {
  id: string
  tipo: TipoConta
  descricao: string
  /** Receber → nome do paciente; Pagar → fornecedor. `null` se não vinculado. */
  contraparte: string | null
  /** Só em Contas a Pagar. */
  categoria: string | null
  /** Vencimento em ISO (YYYY-MM-DD). */
  vencimento: string
  valor: number
  metodo: string
  status: StatusConta
  /** Data de pagamento em ISO, se pago. */
  pagoEm: string | null
  recorrencia: string
}

export interface Servico {
  nome: string
  valor: number
}

export interface GrupoTipos {
  grupo: string
  itens: string[]
}

export interface FinanceiroData {
  contas: Conta[]
  periodo: { de: string; ate: string }
  /** "hoje" em ISO — referência para calcular vencidos no protótipo. */
  hoje: string
  /** Catálogo de serviços da clínica (fonte da descrição em Contas a Receber). */
  servicos: Servico[]
  /** Tipos de receita/despesa agrupados (vêm do cadastro Tipos de conta). */
  tiposReceita: GrupoTipos[]
  tiposDespesa: GrupoTipos[]
  categoriasPagar: string[]
  metodosReceber: string[]
  metodosPagar: string[]
  recorrencias: string[]
  pacientes: string[]
  /** Fornecedores cadastrados (para vincular em contas a pagar). */
  fornecedores: FornecedorRef[]
}

export interface FornecedorRef {
  nome: string
  cnpj: string
  categoria: string
}
