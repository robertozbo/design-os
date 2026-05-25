// Types for Instrumentos (Psicólogo) — Biblioteca de escalas validadas

export type DominioClinico =
  | 'depressao'
  | 'ansiedade'
  | 'stress'
  | 'cognicao'
  | 'tdah'
  | 'trauma'
  | 'sono'
  | 'qualidade_vida'

export type FormatoResposta = 'likert_4' | 'likert_5' | 'sim_nao' | 'multipla_escolha'

export type SeveridadeScore = 'minima' | 'leve' | 'moderada' | 'moderada_severa' | 'severa'

export interface FaixaScore {
  /** Valor mínimo (inclusivo) */
  min: number
  /** Valor máximo (inclusivo) */
  max: number
  severidade: SeveridadeScore
  label: string
}

export interface Instrumento {
  id: string
  /** Nome curto (PHQ-9, GAD-7) */
  nome: string
  /** Nome completo */
  nomeCompleto: string
  /** Autor + ano */
  autor: string
  dominio: DominioClinico
  /** Sintomas/dimensões avaliadas */
  dimensoes: string[]
  /** Quantidade de itens */
  numItens: number
  /** Tempo médio de aplicação em minutos */
  tempoMin: number
  formatoResposta: FormatoResposta
  /** Range total possível (min-max) */
  rangeTotal: { min: number; max: number }
  /** Faixas de score com severidade */
  faixas: FaixaScore[]
  /** Validação científica */
  validacaoBR: boolean
  /** Idade alvo */
  faixaEtaria: string
  /** Descrição curta */
  descricao: string
  /** Total de aplicações nesta carteira */
  totalAplicacoes: number
  /** Quando foi a última aplicação na carteira (relativo) */
  ultimaAplicacao: string | null
  /** É favorito do profissional */
  favorito: boolean
}

export interface AplicacaoRecente {
  id: string
  instrumento: { id: string; nome: string }
  paciente: { id: string; nomeCompleto: string; inicial: string; fotoUrl: string | null }
  valor: number
  severidade: SeveridadeScore
  /** Diferença vs aplicação anterior do mesmo instrumento (null se primeira) */
  delta: number | null
  /** Tempo relativo */
  aplicadoRelativo: string
}

export interface InstrumentosData {
  instrumentos: Instrumento[]
  aplicacoesRecentes: AplicacaoRecente[]
}

export interface InstrumentosProps {
  data: InstrumentosData

  onInstrumentoClick?: (id: string) => void
  onAplicar?: (instrumentoId: string) => void
  onAplicacaoClick?: (aplicacaoId: string) => void
  onFavoritoToggle?: (instrumentoId: string) => void
  onPacienteClick?: (pacienteId: string) => void
}
