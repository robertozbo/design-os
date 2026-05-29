export type StatusStep = 'completo' | 'atual' | 'pendente'

export interface StepAvaliacao {
  id: string
  numero: number
  titulo: string
  resumo: string
  status: StatusStep
}

export interface DadosAnamnese {
  hma: string
  hmp: string
  medicacoes: string[]
  atividadeFisica: string
  ocupacao: string
}

export interface QueixaDor {
  descricao: string
  eva: number
  localizacao: string
  tipo: 'aguda' | 'cronica' | 'mista'
  inicioMeses: number
}

export interface MedidaADM {
  id: string
  articulacao: string
  movimento: string
  direito: number
  esquerdo: number
  referencia: number
  unidade: string
}

export interface TesteFuncional {
  id: string
  nome: string
  descricaoCurta: string
  resultado: 'positivo' | 'negativo' | 'inconclusivo' | 'nao-aplicado'
  observacao?: string
  categoria: string
}

export interface PacienteAvaliacao {
  id: string
  nome: string
  idade: number
  queixaPrincipal: string
  tipoAvaliacao: 'inicial' | 'reavaliacao'
  numeroReavaliacao?: number
  ultimaAvaliacaoData?: string
  evaInicial?: number
}

export interface DiagnosticoSugerido {
  codigo?: string
  hipotese: string
  confianca: 'alta' | 'media' | 'baixa'
}
