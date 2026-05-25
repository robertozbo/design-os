/**
 * Tipos para a section Sessões Finalizadas.
 * Espelha shape do backend Nymos (PsychologySessionNoteResponse + addenda),
 * com pequenas adaptações para o protótipo (paciente embedded em vez de FK).
 */

export type ModoSessao = 'soap' | 'dap' | 'livre'

export type RiscoNivel = 0 | 1 | 2 | 3

export interface PacienteResumo {
  id: string
  nomeCompleto: string
  inicial: string
  fotoUrl: string | null
  idade: number | null
}

export interface AdendoResumo {
  id: string
  criadoEm: string // ISO
  preview: string // primeiros ~80 chars do texto
}

export interface SessaoFinalizada {
  id: string
  paciente: PacienteResumo
  appointmentId: string | null
  planoNome: string | null
  modo: ModoSessao
  resumo: string // 1 linha extraída do SOAP/DAP/livre
  tecnicas: string[]
  risco: RiscoNivel
  homeworkPrescrito: boolean
  iniciadaEm: string // ISO
  finalizadaEm: string // ISO
  duracaoMin: number
  adendos: AdendoResumo[]
}

export interface SessoesFinalizadasStats {
  hoje: number
  semana: number
  altoRisco: number
  comAdendos: number
}

export interface SessoesFinalizadasData {
  stats: SessoesFinalizadasStats
  sessoes: SessaoFinalizada[]
  pacientesDisponiveis: PacienteResumo[] // pro picker de "Nova sessão" e filtro
}

export type FiltroPeriodo = 'hoje' | 'semana' | 'mes' | 'todos'
export type FiltroRisco = 'todos' | 'sem_risco' | 'baixo' | 'moderado' | 'critico'

export interface SessoesFinalizadasProps {
  data: SessoesFinalizadasData
  onIniciarSessao?: (pacienteId: string) => void
  onAbrirProntuario?: (pacienteId: string, sessaoId: string) => void
}
