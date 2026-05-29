export type CategoriaPlano = 'avulso' | 'mensal' | 'pacote'

export interface PlanoTerapeutico {
  id: string
  nome: string
  descricao: string
  categoria: CategoriaPlano
  /** IDs de serviços incluídos (referencia sections/servicos) */
  servicoIds: string[]
  /** Labels short dos serviços incluídos (denormalizado pra display) */
  servicoNomes: string[]
  numSessoes: number
  valorTotalCentavos: number
  parcelamentoOpcoes: number[] // ex: [1, 3, 6]
  validadeDias: number
  ativo: boolean
  pacientesAtivos: number
  /** Cor para identificação visual */
  cor: 'teal' | 'sky' | 'violet' | 'amber' | 'rose' | 'emerald' | 'slate'
}
