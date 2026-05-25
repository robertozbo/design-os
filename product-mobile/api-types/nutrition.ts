// Mirror of backend/api/modules/nutrition/types.ts (Zod removido).

export interface NutritionObjective {
  id: string
  name: string // 'weight_loss', 'muscle_gain', etc.
  displayName: string
  description: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface NutritionType {
  id: string
  /** Identificador estável: 'breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'supper' */
  name: string
  displayName: string // "Café da manhã"
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type DietType =
  | 'hypocaloric'
  | 'hypercaloric'
  | 'balanced'
  | 'low_carb'
  | 'high_protein'
  | 'custom'

export interface NutritionGoal {
  id: string
  userId: string
  dietType?: DietType
  caloriesTarget: number
  carbohydratesTarget: number
  proteinTarget: number
  fatTarget: number
  fiberTarget: number
  hydrationTarget: number // litros/dia
  sodiumTarget: number
  sugarTarget: number
  startDate: string
  endDate?: string
  isActive: boolean
  goalName?: string
  notes?: string
  objectiveId?: string | null
  objectiveDescription?: string | null
  objectiveName?: string | null
  objectiveDisplayName?: string | null
  createdByType: 'user' | 'professional'
  professionalId?: string | null
  professionalName?: string | null
  createdAt: string
  updatedAt: string
}

export interface NutritionMeal {
  id: string
  userId: string
  nutritionTypeId: string
  nutritionType?: NutritionType
  mealDate: string // YYYY-MM-DD
  mealTime: string // HH:MM
  portionName: string
  calories: number
  carbohydrates: number
  protein: number
  fat: number
  fiber: number
  sodium: number
  sugar: number
  calcium: number
  iron: number
  vitaminC: number
  isFavorite: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface NutritionStats {
  totalMeals: number
  totalCalories: number
  averageCalories: number
  recentMeals: number
  totalCarbs: number
  totalProtein: number
  totalFat: number
  totalFiber: number
}

export interface CreateNutritionMealRequest {
  nutritionTypeId: string
  mealDate: string
  mealTime: string
  portionName: string
  calories: number
  carbohydrates: number
  protein: number
  fat: number
  fiber: number
  sodium: number
  sugar: number
  calcium: number
  iron: number
  vitaminC: number
  notes?: string
}

export type UpdateNutritionMealRequest = Partial<CreateNutritionMealRequest>

export interface NutritionFilters {
  nutritionTypeId?: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}
