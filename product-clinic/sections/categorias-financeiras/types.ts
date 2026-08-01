export type Natureza = 'receita' | 'despesa'
export type Comportamento = 'fixa' | 'variavel'

export interface TipoFinanceiro {
  id: string
  nome: string
  natureza: Natureza
  grupo: string
  /** Só em despesas. */
  comportamento?: Comportamento
  /** Vem pré-cadastrado (não pode excluir, só desativar). */
  padrao?: boolean
  ativo: boolean
}

export interface CategoriasData {
  tipos: TipoFinanceiro[]
  gruposReceita: string[]
  gruposDespesa: string[]
}
