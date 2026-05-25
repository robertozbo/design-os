// Types for Dashboard (Psicólogo Web)
//
// Visão diária do clínico — sessões, alertas, métricas da carteira.

export type ModalidadeSessao = 'presencial' | 'online' | 'hibrida'

export type StatusSessao = 'agendada' | 'em_andamento' | 'concluida' | 'no_show' | 'cancelada'

export interface PacienteResumo {
  id: string
  nomeCompleto: string
  /** Avatar inicial fallback */
  inicial: string
  fotoUrl: string | null
  idade: number
  /** Score atual mais relevante (PHQ-9 ou GAD-7) */
  scoreAtual: { instrumento: string; valor: number; severidade: SeveridadeScore } | null
}

export type SeveridadeScore = 'minima' | 'leve' | 'moderada' | 'moderada_severa' | 'severa'

export interface SessaoAgendada {
  id: string
  paciente: PacienteResumo
  /** ISO datetime */
  inicioEm: string
  /** Duração em minutos */
  duracaoMin: number
  modalidade: ModalidadeSessao
  status: StatusSessao
  /** Se essa é a próxima a iniciar (computado) */
  ehProxima?: boolean
  /** Quando "em X min/h" relativo */
  inicioRelativo: string
  /** Sessão de número N do plano terapêutico (ex: "8/12") */
  numeroNoPlano: string | null
}

export type TipoAlerta = 'agravamento_phq' | 'agravamento_gad' | 'faltas_consecutivas' | 'mensagem_urgente' | 'risco_suicidio'

export interface AlertaPaciente {
  id: string
  paciente: PacienteResumo
  tipo: TipoAlerta
  /** Severidade do alerta pra ordenação visual */
  severidade: 'critica' | 'alta' | 'media'
  /** Texto principal ("PHQ-9 subiu de 8 → 17 em 2 sessões") */
  mensagem: string
  /** Tempo relativo da detecção */
  detectadoEm: string
}

export interface KpiCarteira {
  label: string
  valor: string
  /** Sub-label ("vs mês anterior") */
  delta?: string
  /** Direção */
  direcao?: 'subiu' | 'desceu' | 'manteve'
  /** Cor visual */
  cor: 'teal' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet'
}

export interface DashboardData {
  /** Saudação contextual (Bom dia/Boa tarde/Boa noite + nome) */
  saudacao: string
  /** Nome do profissional */
  nomeProfissional: string
  /** Avatar do profissional */
  fotoUrl: string | null
  inicialProfissional: string
  /** Sessões do dia em ordem cronológica */
  sessoesHoje: SessaoAgendada[]
  /** Próxima sessão (sub-set de sessoesHoje, primeira com status agendada) */
  proximaSessao: SessaoAgendada | null
  /** Alertas de pacientes (severidade desc) */
  alertas: AlertaPaciente[]
  /** KPIs da carteira */
  kpis: KpiCarteira[]
}

export interface DashboardProps {
  data: DashboardData

  onIniciarSessao?: (sessaoId: string) => void
  onSessaoClick?: (sessaoId: string) => void
  onPacienteClick?: (pacienteId: string) => void
  onAlertaClick?: (alertaId: string) => void
  onNovoPaciente?: () => void
  onAplicarInstrumento?: () => void
  onAnotacaoRapida?: () => void
  onVerTodosPacientes?: () => void
}
