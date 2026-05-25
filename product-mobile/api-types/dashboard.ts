// Mirror of backend/api/modules/dashboard/types.ts (Zod removido).
// Dashboard metrics summary + AI insights.

export interface DashboardMetricsSummary {
  userId: string
  metrics: {
    heartRate?: number
    weight?: number
    bmi?: number
    bloodPressure?: { systolic: number; diastolic: number }
    dailyHydration?: number
    sleepHours?: number
    bodyTemperature?: number
    oxygenSaturation?: number
    age?: number
    height?: number
    glycemia?: number
    dailySteps?: number
    distanceTraveled?: number
    caloriesBurned?: number
    activeMinutes?: number
    stressLevel?: number
  }
  lastUpdated: Date
}

export type AIInsightType = 'trend' | 'recommendation' | 'risk' | 'anomaly'
export type AIInsightSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface AIInsight {
  id: string
  type: AIInsightType
  title: string
  description: string
  confidence: number // 0-100
  severity?: AIInsightSeverity
  metricType: string
  predictedValue?: number
  timeframe?: string // '7d', '30d', '90d'
  recommendations?: string[]
  data?: unknown
  createdAt: Date
}

export interface PredictiveTrend {
  metricType: string
  currentValue: number
  predictedValue: number
  trend: 'increasing' | 'decreasing' | 'stable'
  confidence: number
  timeframe: string
  dataPoints: Array<{ date: string; value: number }>
}

export interface HealthRiskAssessment {
  overallRisk: AIInsightSeverity
  riskScore: number
  riskFactors: Array<{
    metric: string
    risk: AIInsightSeverity
    description: string
    recommendations: string[]
  }>
  preventiveActions: string[]
}
