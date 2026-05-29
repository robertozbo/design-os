export type Modalidade = 'presencial' | 'teleconsulta' | 'domicilio'
export type CorChip = 'teal' | 'sky' | 'violet' | 'amber' | 'rose' | 'emerald' | 'slate'

export interface Servico {
  id: string
  nome: string
  descricao: string
  modalidade: Modalidade
  duracaoMin: number
  valorCentavos: number
  cor: CorChip
  ativo: boolean
  /** Inclui anamnese + avaliação cinético-funcional padrão? */
  incluiAvaliacaoInicial: boolean
  /** Quantas vezes esse serviço foi agendado (últimos 30 dias) */
  agendadoUlt30d?: number
}
