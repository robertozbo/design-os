// Types for Treinos (Mobile)
//
// View-model: combina backend (Workout + WorkoutSession + Exercises) com
// extensões UI (cor por muscle group, formatação de duração, status visual).

import type {
  WorkoutWithSessions,
  WorkoutSessionWithExercises,
  SessionExerciseWithDetails,
  WorkoutExecutionWithRefs,
  MuscleGroupCategory,
  SessionLetter,
  DayOfWeek,
} from '../../api-types'

export type TreinoCor = 'teal' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet' | 'orange'

/** Tabs no topo da section — origem do treino */
export type TreinosAba = 'meu-personal' | 'meus-treinos'

/** Item da agenda semanal — dia da semana mapeado pra letra da sessão (ou null = descanso) */
export interface AgendaDia {
  diaSemana: DayOfWeek
  /** Label curto pra UI ("Seg", "Ter", "Qua") */
  diaCurto: string
  /** Letra da sessão prescrita ou null se descanso */
  letra: SessionLetter | null
  /** Nome da sessão pra display (espelha SessaoUI.session.name) ou null se descanso */
  nome: string | null
}

/** Treino criado pelo próprio aluno (não vinculado ao Personal) */
export interface TreinoProprio {
  id: string
  nome: string
  tipo: string
  duracaoMin: number
  /** Label de frequência ("3x por semana") */
  frequenciaLabel: string
  /** ISO date */
  criadoEm: string
}

/** View-model de uma sessão pra ser renderizada como card. */
export interface SessaoUI {
  /** Sessão original do backend */
  session: WorkoutSessionWithExercises
  /** Letra grande pra display ("A", "B", ...) */
  letra: SessionLetter
  /** Cor por categoria predominante de muscle group */
  cor: TreinoCor
  /** Grupos musculares principais ("Peito · Tríceps") */
  gruposPrincipais: string[]
  /** Duração estimada em minutos baseada em sets × (tempo médio + descanso) */
  duracaoEstimadaMin: number
  /** Calorias estimadas (MET × peso × tempo) */
  caloriasEstimadas: number
  /** Dia da semana se estiver agendada */
  diaSemanaLabel: string | null
  /** Se essa é a sessão de hoje */
  ehHoje: boolean
  /** Última vez que foi executada */
  ultimaExecucaoEm: string | null
}

/** View-model de exercício dentro de uma sessão. */
export interface ExercicioUI {
  /** Exercise + session config do backend */
  sessionExercise: SessionExerciseWithDetails
  /** Resumo formatado: "4 × 12 · 60kg" ou "3 × 30s · descanso 60s" */
  resumoSeries: string
  /** Cor do muscle group */
  cor: TreinoCor
  /** Lucide icon name */
  iconeNome: string
  /** Se já foi marcado como concluído na sessão atual */
  concluido: boolean
}

/** View-model de execução pra histórico. */
export interface ExecucaoUI {
  /** WorkoutExecution original */
  execucao: WorkoutExecutionWithRefs
  /** Cor por sessionLetter (mantém consistência) */
  cor: TreinoCor
  /** "há 2h", "ontem", "há 3d" */
  tempoRelativo: string
  /** Rating em estrelas formatado */
  ratingLabel: string
}

export interface TreinosStats {
  totalMes: number
  frequenciaSemanalMedia: number
  duracaoMediaMin: number
  caloriasMediasPorTreino: number
  /** Distribuição por categoria de muscle group */
  distribuicaoMusculos: { categoria: MuscleGroupCategory; label: string; count: number; pct: number }[]
  /** Sequência atual de dias */
  streakDias: number
}

export interface TreinosData {
  /** Aba ativa */
  abaAtiva: TreinosAba
  /** Workout ativo (plano vigente prescrito pelo Personal) */
  workout: WorkoutWithSessions
  /** Sessões processadas pra UI */
  sessoes: SessaoUI[]
  /** Sessão de hoje (computada de dayOfWeek) */
  sessaoDeHoje: SessaoUI | null
  /** Mapeamento dia-da-semana → sessão (agenda semanal pré-computada) */
  agendaSemanal: AgendaDia[]
  /** Lista de execuções recentes */
  historico: ExecucaoUI[]
  /** Treinos criados pelo próprio aluno (tab "Meus treinos") */
  treinosProprios: TreinoProprio[]
  /** Stats do período */
  stats: TreinosStats
  /** Dia da semana atual ("Quarta", "Quinta") */
  diaSemanaHoje: DayOfWeek
  /** Peso atual do usuário (última medição em metrics) — usado pra cálculo de calorias */
  pesoUsuarioKg: number
  /** ISO date da última pesagem (pra mostrar idade do dado) */
  pesoMedidoEm: string | null
}

export interface TreinosProps {
  data: TreinosData

  /** Trocou de aba (Meu Personal / Meus treinos) */
  onChangeAba?: (aba: TreinosAba) => void

  /** Iniciar a sessão de hoje (modo execução) */
  onIniciarTreino?: (sessaoId: string) => void

  /** Ver detalhe de uma sessão (sem iniciar) */
  onSessaoClick?: (sessaoId: string) => void

  /** Ver detalhes/vídeo de um exercício */
  onExercicioClick?: (exercicioId: string) => void

  /** Ver detalhe de uma execução do histórico */
  onExecucaoClick?: (execucaoId: string) => void

  /** Ver todas as execuções do histórico */
  onVerTodoHistorico?: () => void

  /** Ver stats completos */
  onVerStats?: () => void

  /** Tocou no perfil do Personal no hero (abre detalhe via Profissionais) */
  onOpenPersonalDetail?: (professionalId: string) => void

  /** Tocou em um treino próprio na tab "Meus treinos" */
  onTreinoProprioClick?: (id: string) => void

  /** Tocou em "+ Novo treino" na tab "Meus treinos" */
  onNovoTreinoProprio?: () => void
}
