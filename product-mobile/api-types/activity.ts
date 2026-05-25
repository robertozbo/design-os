// Mirror of backend/api/modules/activities/types.ts (Zod removido).

/**
 * Bucket de duração — backend só aceita esses 5 valores no MVP de registro manual.
 * Apple Watch / HealthKit pode trazer durações arbitrárias (preserved as actualMinutes).
 */
export type ActivityDuration = 30 | 45 | 60 | 80 | 120

export interface ActivityCategory {
  id: string
  name: string
  description: string | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Catálogo de tipos de atividade (Caminhada, Corrida, Yoga, etc.).
 * Cada tipo tem pontos pré-definidos por bucket de duração + cal/min.
 */
export interface ActivityType {
  id: string
  categoryId: string
  name: string
  description: string | null
  points30min: number
  points45min: number
  points60min: number
  points80min: number
  points120min: number
  caloriesPerMinute: number
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Origem da atividade.
 * - 'manual' = usuário registrou na tela
 * - 'apple_health' / 'health_connect' / 'google_fit' = importado de wearable
 *
 * Campo proposto pra backend (não existe ainda — UI assume futuro flag).
 * Hoje pode ser inferido de deviceId !== null.
 */
export type ActivitySource = 'manual' | 'apple_health' | 'health_connect' | 'google_fit'

export interface Activity {
  id: string
  userId: string
  activityTypeId: string
  durationMinutes: ActivityDuration
  /** Duração real em minutos (pode diferir do bucket quando vem do watch) */
  actualMinutes?: number
  points: number
  caloriesBurned: number | null
  performedAt: Date
  /** Origem (proposto — backend evoluirá). Default 'manual' se não setado. */
  source?: ActivitySource
  /** Se source != 'manual', aponta pro Device origem */
  deviceId?: string | null
  notes?: string | null
  imageUrl?: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  version: number
}

/**
 * ActivityResponse com type+category aninhado (envelope da API).
 */
export interface ActivityResponse extends Activity {
  activityType: ActivityType & {
    category: ActivityCategory
  }
}

export interface CreateActivityRequest {
  activityTypeId: string
  durationMinutes: ActivityDuration
  performedAt: Date
  notes?: string
  imageUrl?: string
}

export interface UpdateActivityRequest {
  activityTypeId?: string
  durationMinutes?: ActivityDuration
  performedAt?: Date
  notes?: string
  imageUrl?: string
}

export interface ActivitiesQuery {
  page?: number
  limit?: number
  categoryId?: string
  activityTypeId?: string
  dateFrom?: Date
  dateTo?: Date
}
