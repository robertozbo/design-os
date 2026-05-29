export type Tendencia = 'melhora' | 'estavel' | 'piora'

export interface CondutaOption {
  id: string
  label: string
  categoria: 'terapia-manual' | 'eletro' | 'exercicio' | 'orientacao' | 'outros'
}

export interface PacienteSessao {
  id: string
  nome: string
  idade: number
  queixaCurta: string
  evaUltimaSessao: number
  evaInicial: number
  sessaoNumero: number
  ultimaSessaoData: string
  statusNymosMove: 'conectado' | 'pendente' | 'nao-convidado'
  proximaSessaoData?: string
}

export interface FormEvolucao {
  eva: number
  subjetivo: string
  objetivo: string
  avaliacao: string
  plano: string
  tendencia: Tendencia
  condutasSelecionadas: string[]
  anexoFotoNome?: string
}

export interface SugestaoConduta {
  id: string
  label: string
  motivo: string
}
