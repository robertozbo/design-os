// Mirror of backend/api/modules/workouts/types.ts (Zod removido).
//
// Workout = plano de treino com sessões A-G. Cada sessão tem exercises
// (sets x reps + carga + descanso). Executions são logs session-level.

export type ExerciseType = 'reps' | 'time'

export type WorkoutStatus = 'active' | 'archived'

export type WorkoutCreatedByType = 'professional' | 'patient'

export type MuscleGroupCategory = 'upper_body' | 'lower_body' | 'core' | 'cardio'

export type SessionLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

// ─────────────────────────────────────────────────────────────────────────────
// Catálogo global
// ─────────────────────────────────────────────────────────────────────────────

export interface MuscleGroup {
  id: string
  name: string
  category: MuscleGroupCategory
  description: string | null
  icon: string | null
  sortOrder: number
  isActive: boolean
}

export interface Exercise {
  id: string
  muscleGroupId: string
  name: string
  instructions: string | null
  exerciseType: ExerciseType
  imageUrl: string | null
  videoUrl: string | null
  /** MET pra cálculo de calorias (Cal = MET × kg × horas) */
  estimatedMet: number
  sortOrder: number
  isActive: boolean
}

export interface WorkoutGoal {
  id: string
  name: string
  description: string | null
  icon: string | null
  sortOrder: number
  isActive: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Workout (plano do usuário)
// ─────────────────────────────────────────────────────────────────────────────

export interface Workout {
  id: string
  userId: string
  createdByType: WorkoutCreatedByType
  professionalId: string | null
  goalId: string | null
  name: string
  description: string | null
  status: WorkoutStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface WorkoutSession {
  id: string
  workoutId: string
  sessionLetter: SessionLetter
  dayOfWeek: DayOfWeek | null
  name: string
  description: string | null
  sortOrder: number
}

export interface WorkoutSessionExercise {
  id: string
  sessionId: string
  exerciseId: string
  /** Número de séries */
  sets: number
  /** Reps por série (null se for time-based) */
  reps: number | null
  /** Tempo por série em segundos (null se for reps-based) */
  timeSeconds: number | null
  /** Descanso entre séries em segundos */
  restSeconds: number
  /** Carga sugerida em kg (null se peso corporal ou variável) */
  loadKg: number | null
  sortOrder: number
  notes: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Composições (com relações)
// ─────────────────────────────────────────────────────────────────────────────

export interface SessionExerciseWithDetails extends WorkoutSessionExercise {
  exercise: Pick<Exercise, 'id' | 'name' | 'exerciseType' | 'estimatedMet' | 'imageUrl' | 'videoUrl' | 'instructions'>
  muscleGroup: Pick<MuscleGroup, 'id' | 'name' | 'category'>
}

export interface WorkoutSessionWithExercises extends WorkoutSession {
  exercises: SessionExerciseWithDetails[]
}

export interface WorkoutWithSessions extends Workout {
  sessions: WorkoutSessionWithExercises[]
  goal?: WorkoutGoal
  professional?: { id: string; userId: string; fullName: string }
}

// ─────────────────────────────────────────────────────────────────────────────
// Execução (log)
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkoutExecution {
  id: string
  userId: string
  workoutId: string
  sessionId: string
  executedAt: string // ISO date
  durationMinutes: number
  estimatedCalories: number
  isCompleted: boolean
  notes: string | null
  /** 1-5 estrelas */
  rating: number | null
}

export interface WorkoutExecutionWithRefs extends WorkoutExecution {
  session: { sessionLetter: SessionLetter; name: string }
  workout: { name: string }
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkoutPerformanceStats {
  summary: {
    totalWorkouts: number
    avgPerWeek: number
    avgDurationMin: number
    avgRating: number
    totalDurationMin: number
  }
  muscleGroupDistribution: { muscleGroupId: string; name: string; count: number; percentage: number }[]
  weeklyConsistency: { weekStart: string; count: number }[]
  topExercises: { exerciseId: string; name: string; count: number }[]
  executionsByDay: { date: string; count: number }[]
}
