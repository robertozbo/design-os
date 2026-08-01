export interface Servico {
  id: string
  nome: string
  /** Preço em R$. */
  preco: number
  /** Duração em minutos. */
  duracaoMin: number
  /** Tipo de receita ao qual o serviço pertence. */
  categoria: string
  ativo: boolean
}

export interface ServicosData {
  servicos: Servico[]
  /** Tipos de receita (categorias) disponíveis. */
  categorias: string[]
}
