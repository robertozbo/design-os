// Types for Pacientes (Psicólogo Web)

export type StatusPaciente = 'em_tratamento' | 'em_pausa' | 'alta' | 'inativo'

export type Genero = 'masculino' | 'feminino' | 'nao_binario' | 'nao_informar'

export type SeveridadeScore = 'minima' | 'leve' | 'moderada' | 'moderada_severa' | 'severa'

export type ModalidadeSessao = 'presencial' | 'online' | 'hibrida'

export interface ScoreAtual {
  /** PHQ-9 · GAD-7 · BDI-II · etc */
  instrumento: string
  valor: number
  severidade: SeveridadeScore
  /** Quando foi aplicado */
  aplicadoEm: string
}

export interface Paciente {
  id: string
  nomeCompleto: string
  inicial: string
  fotoUrl: string | null
  idade: number
  genero: Genero
  status: StatusPaciente
  /** Indicador de risco (sintomas críticos, ideação suicida, etc) */
  altoRisco: boolean
  /** Score mais recente */
  scoreAtual: ScoreAtual | null
  /** Plano terapêutico ativo */
  plano: {
    nome: string
    sessaoAtual: number
    totalSessoes: number
  } | null
  /** Próxima sessão agendada */
  proximaSessao: {
    inicioEm: string
    modalidade: ModalidadeSessao
  } | null
  /** Tempo relativo da última interação */
  ultimaInteracao: string
}

export interface KpiCarteira {
  label: string
  valor: string
  delta?: string
  cor: 'teal' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet'
}

export interface PacientesData {
  pacientes: Paciente[]
  kpis: KpiCarteira[]
}

export interface FiltroAtivo {
  statuses: StatusPaciente[]
  somenteAltoRisco: boolean
  busca: string
}

export interface PacientesProps {
  data: PacientesData

  onPacienteClick?: (id: string) => void
  onNovoPaciente?: () => void
  onIniciarSessao?: (pacienteId: string) => void
  onAplicarInstrumento?: (pacienteId: string) => void
}
