export interface Fornecedor {
  id: string
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  telefone: string
  email: string
  /** Tipo de despesa padrão associado. */
  categoria: string
  cidade: string
  uf: string
  ativo: boolean
}

export interface FornecedoresData {
  fornecedores: Fornecedor[]
  /** Categorias (tipos de despesa) para vincular. */
  categorias: string[]
}
