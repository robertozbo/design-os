// Mirror of backend/api/modules/metrics/types.ts (Zod schemas removidos).
// Mantém compatibilidade com tipos do backend.

export interface CompositeFieldDefinition {
  label: string
  unit?: string
  required?: boolean
  minValue?: number
  maxValue?: number
  normalMin?: number
  normalMax?: number
  /** Referência estratificada por idade × sexo (opcional) */
  referenciaPorIdadeSexo?: ReferenciaPorIdadeSexo
}

// ─────────────────────────────────────────────────────────────────────────────
// Referências oficiais estratificadas por idade × sexo
// (canônico — usado em MetricTypeInfo, minha-saude/Snapshot, objetivos)
// ─────────────────────────────────────────────────────────────────────────────

export type Sexo = 'homem' | 'mulher'
export type FaixaEtaria = '18-29' | '30-39' | '40-49' | '50-59' | '60-69' | '70+'

export interface FaixaReferenciaValor {
  /** Texto pra display ("14–19%", "<5,7", "≥60 kg") */
  texto: string
  /** Limite inferior numérico (opcional, pra cálculo de status) */
  min?: number
  /** Limite superior numérico (opcional) */
  max?: number
  /** Rótulo da faixa ("ótimo", "saudável", "atenção", "risco") */
  rotulo?: string
}

/**
 * Faixas oficiais estratificadas. Estrutura:
 * - chave: faixa etária (ex: "30-39")
 * - dentro de cada faixa: valor por sexo, ou "unissex" se métrica não varia
 */
export type ReferenciaPorIdadeSexo = {
  [K in FaixaEtaria]?: {
    homem?: FaixaReferenciaValor
    mulher?: FaixaReferenciaValor
    unissex?: FaixaReferenciaValor
  }
}

/**
 * Catálogo de tipos de métrica (tabela `metric_types`).
 * Define o que pode ser medido (peso, BPM, glicemia, pressão, etc.).
 */
export interface MetricTypeInfo {
  id: string
  /** identificador estável (ex: 'weight', 'heart_rate', 'blood_pressure', 'sleep_hours') */
  value: string
  label: string
  description: string | null
  unit: string | null
  /** 'number' (escalar) | 'composite' (múltiplos campos, ex: pressão sistólica/diastólica) */
  dataType: string
  compositeFields: Record<string, CompositeFieldDefinition> | null
  minValue?: string | null
  /** Limite inferior considerado normal (faixa única, fallback) */
  normalMin?: string | null
  /** Limite superior considerado normal (faixa única, fallback) */
  normalMax?: string | null
  maxValue?: string | null
  referenceNotes?: string | null
  /**
   * Referência estratificada por idade × sexo (opcional).
   * Quando presente, o app resolve a faixa pelo perfil do usuário em runtime.
   * normalMin/normalMax permanecem como fallback de display quando não houver perfil.
   */
  referenciaPorIdadeSexo?: ReferenciaPorIdadeSexo
  /** Fonte oficial da referência ("ACSM", "OMS", "ADA", "SBC", "WHO", "NSF", "ISSN") */
  fonteReferencia?: string
  /** Pontos de gamificação atribuídos por registro */
  points: number
  isActive: boolean
  sortOrder: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Registro individual de métrica (uma medição em um momento específico).
 */
export interface Metric {
  id: string
  userId: string
  metricTypeId: string
  metricType: MetricTypeInfo
  /** Valor escalar. Para composite, usa compositeValues. */
  value: number
  /** Valores nomeados para métricas compostas (ex: { systolic: 120, diastolic: 80 }) */
  compositeValues?: Record<string, number>
  measuredAt: Date
  notes?: string
  /** "manual", "apple_health", "google_fit", "health_connect", etc. */
  source?: string | null
  /** Aponta pra Device.id quando coletado de wearable/balança */
  deviceId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface MetricFilters {
  metricTypeId?: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
  offset?: number
}

export interface CreateMetricRequest {
  metricTypeId: string
  value: number
  compositeValues?: Record<string, number>
  measuredAt: Date
  notes?: string
  source?: string
  deviceId?: string
}

export interface UpdateMetricRequest {
  value?: number
  compositeValues?: Record<string, number>
  measuredAt?: Date
  createdAt?: Date
  notes?: string
  source?: string
  deviceId?: string
}

/**
 * Identificadores estáveis usados no backend (campo `metricType.value`).
 * Mantenha sincronizado com a tabela `metric_types`.
 */
export const KNOWN_METRIC_TYPES = {
  WEIGHT: 'weight',
  HEART_RATE: 'heart_rate',
  RESTING_HEART_RATE: 'resting_heart_rate',
  HEART_RATE_VARIABILITY: 'heart_rate_variability',
  BLOOD_PRESSURE: 'blood_pressure',
  BLOOD_GLUCOSE: 'glycemia',
  OXYGEN_SATURATION: 'oxygen_saturation',
  BODY_TEMPERATURE: 'body_temperature',
  BODY_FAT_PERCENTAGE: 'body_fat_percentage',
  MUSCLE_MASS: 'muscle_mass',
  VISCERAL_FAT: 'visceral_fat',
  WAIST_CIRCUMFERENCE: 'waist_circumference',
  BMI: 'bmi',
  DAILY_STEPS: 'daily_steps',
  DISTANCE_TRAVELED: 'distance_traveled',
  CALORIES_BURNED: 'calories_burned',
  ACTIVE_MINUTES: 'active_minutes',
  FLIGHTS_CLIMBED: 'flights_climbed',
  SLEEP_HOURS: 'sleep_hours',
  SLEEP_EFFICIENCY: 'sleep_efficiency',
  REM_SLEEP: 'rem_sleep',
  DEEP_SLEEP: 'deep_sleep',
  DAILY_HYDRATION: 'daily_hydration',
  STRESS_LEVEL: 'stress_level',
  RESPIRATORY_RATE: 'respiratory_rate',
} as const

export type KnownMetricType = (typeof KNOWN_METRIC_TYPES)[keyof typeof KNOWN_METRIC_TYPES]
