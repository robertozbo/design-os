// Mirror of backend/api/modules/ai-chat/types.ts (Zod removido).
//
// Backend usa OCR/IA pra extrair dados de fotos: balança, glicímetro,
// monitor de pressão, alimentos, exames laboratoriais, relatório de
// bioimpedância e fotos corporais.

export type ChatOptionType =
  | 'scale'
  | 'glucose'
  | 'blood_pressure'
  | 'food'
  | 'lab_exam'
  | 'bioimpedance'
  | 'body_photo'

export type TargetTable = 'metrics' | 'nutrition' | 'exams' | 'body_evaluations'

export interface ChatOption {
  type: ChatOptionType
  icon: string
  label: string
  description: string
  targetTable: TargetTable
  agentClass: string
}

export interface ProcessImageRequest {
  optionType: ChatOptionType
  images: string[] // base64 ou URL (até 5)
  userId: string
  metadata?: Record<string, unknown>
}

export interface ProcessImageResponse {
  success: boolean
  extractedData: unknown
  confidence: number
  savedTo: TargetTable
  recordId: string
  message: string
}

export interface ScaleResult {
  weight: number
  unit: 'kg' | 'lb'
  confidence: number
  displayValue: string
  error: string | null
}

export interface GlucoseResult {
  glucose: number
  unit: 'mg/dL' | 'mmol/L'
  confidence: number
  displayValue: string
  error: string | null
}

export interface BloodPressureResult {
  systolic: number
  diastolic: number
  pulse?: number
  unit: 'mmHg'
  confidence: number
  displayValue: string
  error: string | null
}

export interface NutritionalData {
  calories: number
  carbohydrates: number
  protein: number
  fat: number
  fiber: number
  sodium: number
  sugar: number
}

export interface FoodResult {
  foodName: string
  portionSize: string
  nutritionalData: NutritionalData
  confidence: number
  notes: string
  error: string | null
}

export interface ExamResult {
  extractedData: Record<string, unknown>
  confidence: number
  notes?: string
  error: string | null
}

export interface ChatHistoryItem {
  id: string
  type: TargetTable
  optionType: ChatOptionType
  extractedData: unknown
  confidence: number
  createdAt: Date
}

export interface ChatHistoryResponse {
  items: ChatHistoryItem[]
  total: number
  hasMore: boolean
}

/** Catálogo do backend (mantém em sync com CHAT_OPTIONS). */
export const CHAT_OPTIONS: ChatOption[] = [
  {
    type: 'scale',
    icon: 'scale',
    label: 'Foto da Balança',
    description: 'Extrair peso da imagem da balança',
    targetTable: 'metrics',
    agentClass: 'ScaleOCRAgent',
  },
  {
    type: 'glucose',
    icon: 'droplet',
    label: 'Foto de Glicemia',
    description: 'Extrair glicemia do medidor',
    targetTable: 'metrics',
    agentClass: 'GlucoseOCRAgent',
  },
  {
    type: 'blood_pressure',
    icon: 'heart-pulse',
    label: 'Foto de Pressão',
    description: 'Extrair pressão arterial do medidor',
    targetTable: 'metrics',
    agentClass: 'BloodPressureOCRAgent',
  },
  {
    type: 'food',
    icon: 'apple',
    label: 'Foto de Alimento',
    description: 'Analisar dados nutricionais',
    targetTable: 'nutrition',
    agentClass: 'FoodRecognitionAgent',
  },
  {
    type: 'lab_exam',
    icon: 'file-text',
    label: 'Exame Laboratorial',
    description: 'Extrair biomarcadores do PDF/foto',
    targetTable: 'exams',
    agentClass: 'LabExamOCRAgent',
  },
  {
    type: 'bioimpedance',
    icon: 'activity',
    label: 'Bioimpedância',
    description: 'Extrair composição corporal',
    targetTable: 'body_evaluations',
    agentClass: 'BioimpedanceOCRAgent',
  },
  {
    type: 'body_photo',
    icon: 'camera',
    label: 'Foto Corporal',
    description: 'Análise visual + projeção corporal',
    targetTable: 'body_evaluations',
    agentClass: 'BodyPhotoAgent',
  },
]
