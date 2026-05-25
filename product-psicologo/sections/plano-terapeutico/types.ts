// Types for Plano Terapêutico (Psicólogo)

export type StatusObjetivo = 'em_andamento' | 'concluido' | 'abandonado' | 'pausado'

export type StatusPlano = 'em_curso' | 'pausado' | 'concluido'

export type AbordagemTerapeutica = 'tcc' | 'act' | 'mindfulness' | 'emdr' | 'humanista' | 'psicodinamica' | 'sistemica'

export type Frequencia = 'semanal' | 'quinzenal' | 'mensal'

/** Objetivo SMART */
export interface ObjetivoSmart {
  id: string
  /** S — Specific */
  especifico: string
  /** M — Measurable: indicador clínico */
  indicador: {
    instrumento: string
    valorAtual: number
    valorAlvo: number
    direcao: 'reduzir' | 'aumentar' | 'manter'
  }
  /** R — Relevant: vínculo com objetivo principal */
  relevancia: string
  /** T — Time-bound: data alvo ISO */
  prazo: string
  status: StatusObjetivo
  /** Progresso 0-1 */
  progresso: number
}

export interface TecnicaPlanejada {
  id: string
  nome: string
  abordagem: AbordagemTerapeutica
  /** Vezes planejadas no plano */
  vezesPlanejadas: number
  /** Vezes efetivamente aplicadas */
  vezesAplicadas: number
}

export interface IndicadorProgresso {
  instrumento: string
  /** Pontos cronológicos (mais antigo → recente) */
  pontos: { data: string; valor: number }[]
  /** Direção desejada */
  direcao: 'reduzir' | 'aumentar' | 'manter'
  /** Linha de base (primeira aplicação) */
  linhaBase: number
  /** Valor atual */
  atual: number
  /** Valor alvo */
  alvo: number
}

export interface VersaoPlano {
  versao: number
  /** ISO date da criação */
  criadaEm: string
  /** Quem criou */
  criadaPor: string
  /** Resumo das mudanças vs versão anterior */
  resumoMudancas: string
  ehAtual: boolean
}

export interface PlanoData {
  paciente: {
    id: string
    nomeCompleto: string
    inicial: string
    fotoUrl: string | null
    idade: number
  }
  plano: {
    nome: string
    abordagem: AbordagemTerapeutica
    status: StatusPlano
    versaoAtual: number
    /** Quando foi criado */
    criadoEm: string
    /** Sessões */
    sessaoAtual: number
    totalSessoes: number
    frequencia: Frequencia
  }
  objetivoPrincipal: string
  objetivosSmart: ObjetivoSmart[]
  tecnicas: TecnicaPlanejada[]
  indicadores: IndicadorProgresso[]
  versoes: VersaoPlano[]
}

export interface PlanoProps {
  data: PlanoData

  onPacienteClick?: () => void
  onNovaVersao?: () => void
  onEditarPlano?: () => void
  onObjetivoClick?: (id: string) => void
  onTecnicaClick?: (id: string) => void
  onVersaoClick?: (versao: number) => void
}
