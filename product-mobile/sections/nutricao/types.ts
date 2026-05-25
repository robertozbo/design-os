// Types for Nutrição (Mobile)
//
// Combina backend nutrition module (NutritionMeal, NutritionGoal, NutritionType)
// + diets module (PatientDiet, PatientDietMeal) num view-model único do dia.

import type {
  NutritionGoal,
  NutritionMeal,
  NutritionType,
  PatientDiet,
  PatientDietMeal,
} from '../../api-types'

/** Cor visual por refeição, mapeada do NutritionType.name */
export type RefeicaoCor = 'amber' | 'teal' | 'violet' | 'rose' | 'sky' | 'slate'

/**
 * Macros consumidos vs meta (totais do dia).
 */
export interface MacroResumo {
  /** "calories" | "protein" | "carbohydrates" | "fat" | "fiber" */
  id: string
  label: string
  unidade: string
  consumido: number
  meta: number
  /** 0-100 (clamp) */
  pct: number
  /** Tailwind suffix (ex: 'emerald-400') */
  cor: string
  /** Hex pra gradient da barra */
  hex: string
}

/**
 * Estado de uma refeição planejada (vinda do PatientDiet).
 */
export interface RefeicaoPlanejada {
  meal: PatientDietMeal
  registrada: boolean
}

/**
 * View-model de cada seção de refeição (Café, Almoço, etc.).
 */
export interface RefeicaoSection {
  /** NutritionType do backend (catálogo) */
  type: NutritionType
  /** Cor visual UI mapeada de type.name */
  cor: RefeicaoCor
  /** Lucide icon name */
  iconeNome: string
  /** Hora planejada (vinda de PatientDietMeal.scheduledTime, fallback ao type sortOrder default) */
  horarioPlanejado: string | null
  /** Items efetivamente registrados pelo usuário (NutritionMeal) */
  registrados: NutritionMeal[]
  /** Item planejado correspondente (vindo do PatientDiet, se houver) */
  planejado: RefeicaoPlanejada | null
  /** Soma de calorias consumidas nessa refeição */
  kcalConsumida: number
  /** Meta de kcal pra essa refeição (vinda do plano) */
  kcalMeta: number | null
  /** True se já passou o horário e nada foi registrado */
  emAtraso: boolean
  /** Default expandida (refeição em horário ou primeira sem registros) */
  expandidaDefault: boolean
}

/**
 * View-model do plano de hoje, se houver. Versão simplificada de PlanoHoje
 * (não duplica Início — só pill de link).
 */
export interface PlanoHojePill {
  diet: PatientDiet | null
  ativo: boolean
  profissionalNome: string
}

export interface NutricaoData {
  /** Meta diária (NutritionGoal ativo) */
  meta: NutritionGoal | null
  /** Resumo de macros do dia */
  macros: MacroResumo[]
  /** Total de kcal consumidas, gastas e meta (pro anel) */
  anel: {
    consumidas: number
    meta: number
    semMeta: boolean
  }
  /** Plano de hoje pill */
  plano: PlanoHojePill
  /** Lista de refeições do dia */
  refeicoes: RefeicaoSection[]
  /** Data exibida (YYYY-MM-DD) */
  diaExibido: string
  /** Label humanizado ("Hoje", "Ontem · 03/05") */
  diaLabel: string
}

export interface NutricaoProps {
  data: NutricaoData
  onPrevDia?: () => void
  onProxDia?: () => void
  onAlimentoClick?: (meal: NutritionMeal) => void
  onAdicionarAlimento?: (refeicao: RefeicaoSection) => void
  onMarcarPlanejada?: (refeicao: RefeicaoSection) => void
  onPlanoClick?: () => void
  onSearchClick?: () => void
  onAddClick?: () => void
  onRefresh?: () => Promise<void>
}
