// Mirror of backend/src/schema/health/schema.ts (goals table) + goals module types.

export type GoalStatus = 'active' | 'completed' | 'cancelled'

/**
 * Meta de saúde definida pelo usuário.
 * Aponta pra um metricTypeId (peso, % gordura, passos, etc.) e tem
 * faixa initialValue → currentValue → targetValue + janela de datas.
 */
export interface Goal {
  id: string
  userId: string
  metricTypeId: string
  description: string
  /** Valor de partida (snapshot quando criou a meta) */
  initialValue: number | null
  /** Valor alvo desejado */
  targetValue: number
  /** Valor atual (atualizado conforme novas medições) */
  currentValue: number | null
  startDate: Date
  endDate: Date
  status: GoalStatus
  createdAt?: Date
  updatedAt?: Date
}

export interface GoalStats {
  totalGoals: number
  activeGoals: number
  completedGoals: number
  averageProgress: number // 0-100
  totalPointsEarned: number
  goalsByMetricType: Array<{
    metricTypeId: string
    metricTypeLabel: string
    count: number
    completed: number
  }>
}

export interface CreateGoalRequest {
  metricTypeId: string
  description: string
  currentValue: number
  targetValue: number
  startDate: string // ISO
  endDate: string // ISO
}

export interface UpdateGoalRequest {
  description?: string
  targetValue?: number
  startDate?: string
  endDate?: string
  status?: GoalStatus
}
