// Desafios — types do protótipo mobile (espelhando o que existe em produção)
// Real source: mobile/src/services/challenges.service.ts (simplificado pra spec)

export type ChallengeCategory =
  | 'atividade'
  | 'nutricao'
  | 'sono'
  | 'habito'
  | 'medicacao'

export type ChallengeStatus = 'active' | 'completed' | 'failed'

export type RankingPeriod = 'weekly' | 'monthly' | 'all_time'

export interface Challenge {
  id: string
  title: string
  description: string
  category: ChallengeCategory
  /** Lucide icon name. */
  icon: string
  status: ChallengeStatus
  /** Valor da meta (ex: 10000 passos, 7 horas, 30 dias). */
  target: number
  /** Progresso atual (mesma unidade do target). */
  currentProgress: number
  /** Unidade legível (ex: "passos", "horas", "dias"). */
  unit: string
  /** % calculada — currentProgress / target capped em 100. */
  progressPercent: number
  /** Pontos recompensa quando concluído. */
  pointsReward: number
  /** Pontos já ganhos (≤ pointsReward). */
  pointsEarned: number
  startDateISO: string
  endDateISO: string
  /** Dias restantes (calculado, 0 quando concluído/falhou). */
  daysRemaining: number
  /** Participantes no total do desafio. */
  participantCount: number
  /** Posição do paciente neste desafio (1-based). */
  currentRank?: number
  /** Quando o paciente concluiu (só se status==='completed'). */
  completedAtISO?: string
}

export interface RankingEntry {
  rank: number
  userId: string
  userName: string
  /** Inicial do nome pra avatar fallback. */
  avatarInitial: string
  points: number
  isCurrentUser: boolean
}

export interface DesafiosStats {
  /** Pontos totais acumulados pelo paciente em todos os desafios. */
  totalPoints: number
  /** Posição global do paciente no ranking all-time. */
  globalRank: number
  /** Quantos desafios já concluiu. */
  completedCount: number
  /** Quantos desafios ativos no momento. */
  activeCount: number
}

export interface DesafiosData {
  stats: DesafiosStats
  active: Challenge[]
  completed: Challenge[]
  ranking: RankingEntry[]
}

export interface DesafiosProps {
  data: DesafiosData
  onAbrirDesafio?: (id: string) => void
  onExplorarDesafios?: () => void
  onAbrirRanking?: () => void
  onRefresh?: () => void
}
