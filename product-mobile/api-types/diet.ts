// Mirror of backend/api/modules/diets/types.ts (Zod removido).
// Plano alimentar prescrito pelo nutri ou template.

export type DietObjective = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'high_protein'

export type MealType =
  | 'breakfast'
  | 'morning_snack'
  | 'lunch'
  | 'afternoon_snack'
  | 'dinner'
  | 'supper'

export type DietStatus = 'active' | 'archived'

export type DietTemplateType = 'system' | 'professional'

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export interface MealMacros {
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber?: number
}

export interface DietTemplateMeal {
  id: string
  templateId: string
  mealType: MealType
  name: string
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number
  notes: string | null
  sortOrder: number
}

export interface DietTemplate {
  id: string
  type: DietTemplateType
  professionalId: string | null
  name: string
  description: string | null
  objective: DietObjective
  totalCalories: number | null
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  meals?: DietTemplateMeal[]
}

/**
 * Plano alimentar atribuído a um paciente (instância de template ou customizado).
 */
export interface PatientDiet {
  id: string
  userId: string
  templateId: string | null
  professionalId: string | null
  name: string
  description: string | null
  objective: DietObjective
  totalCalories: number | null
  status: DietStatus
  startDate: Date
  endDate: Date | null
  meals: PatientDietMeal[]
  createdAt: Date
  updatedAt: Date
}

export interface PatientDietMeal {
  id: string
  dietId: string
  mealType: MealType
  name: string
  scheduledTime: string // "HH:mm"
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number
  notes: string | null
  sortOrder: number
}

/** Registro de uma refeição consumida (opcional — o user pode marcar como feita) */
export interface MealLog {
  id: string
  dietId: string | null
  userId: string
  mealId: string | null // aponta pra PatientDietMeal se foi do plano
  mealType: MealType
  consumedAt: Date
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number
  notes: string | null
  createdAt: Date
}
