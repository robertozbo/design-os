import type {
  AlimentoLite,
  CategoriaTone,
  CategoriaId,
  IngredienteReceita,
} from '@/../product/sections/receitas/types'

// === Macro calculation ===

export interface MacrosTotal {
  kcal: number
  proteinaG: number
  carboG: number
  gorduraG: number
}

export function calcMacrosForGrams(alimento: AlimentoLite, gramas: number): MacrosTotal {
  const factor = gramas / 100
  return {
    kcal: alimento.kcalPer100g * factor,
    proteinaG: alimento.proteinaPer100g * factor,
    carboG: alimento.carboPer100g * factor,
    gorduraG: alimento.gorduraPer100g * factor,
  }
}

export function sumMacros(
  ingredientes: IngredienteReceita[],
  alimentosById: Record<string, AlimentoLite>,
): MacrosTotal {
  let kcal = 0
  let proteinaG = 0
  let carboG = 0
  let gorduraG = 0
  for (const ing of ingredientes) {
    const al = alimentosById[ing.alimentoId]
    if (!al) continue
    const m = calcMacrosForGrams(al, ing.gramas)
    kcal += m.kcal
    proteinaG += m.proteinaG
    carboG += m.carboG
    gorduraG += m.gorduraG
  }
  return { kcal, proteinaG, carboG, gorduraG }
}

export function macrosPerPorcao(total: MacrosTotal, porcoes: number): MacrosTotal {
  if (porcoes <= 0) return total
  return {
    kcal: total.kcal / porcoes,
    proteinaG: total.proteinaG / porcoes,
    carboG: total.carboG / porcoes,
    gorduraG: total.gorduraG / porcoes,
  }
}

// === Tone mapping ===

export const CATEGORIA_TONE: Record<CategoriaId, CategoriaTone> = {
  cafe: 'amber',
  'almoco-jantar': 'teal',
  lanche: 'violet',
  'sobremesa-bebida': 'rose',
}

export const CATEGORIA_GRADIENT: Record<CategoriaTone, string> = {
  amber:
    'bg-gradient-to-br from-amber-200 via-amber-100 to-orange-200 dark:from-amber-900/40 dark:via-amber-950/40 dark:to-orange-900/40',
  teal:
    'bg-gradient-to-br from-teal-200 via-emerald-100 to-cyan-200 dark:from-teal-900/40 dark:via-emerald-950/40 dark:to-cyan-900/40',
  violet:
    'bg-gradient-to-br from-violet-200 via-purple-100 to-indigo-200 dark:from-violet-900/40 dark:via-purple-950/40 dark:to-indigo-900/40',
  rose:
    'bg-gradient-to-br from-rose-200 via-pink-100 to-fuchsia-200 dark:from-rose-900/40 dark:via-pink-950/40 dark:to-fuchsia-900/40',
  slate:
    'bg-gradient-to-br from-slate-200 via-slate-100 to-stone-200 dark:from-slate-800 dark:via-slate-900 dark:to-stone-800',
}

export const CATEGORIA_BADGE: Record<CategoriaTone, string> = {
  amber: 'bg-amber-50 text-amber-700 ring-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60',
  teal: 'bg-teal-50 text-teal-700 ring-teal-200/60 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900/60',
  violet:
    'bg-violet-50 text-violet-700 ring-violet-200/60 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/60',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60',
  slate:
    'bg-slate-100 text-slate-600 ring-slate-200/60 dark:bg-slate-800/60 dark:text-slate-400 dark:ring-slate-700/60',
}

export const CATEGORIA_INITIAL: Record<CategoriaTone, string> = {
  amber: 'text-amber-700 dark:text-amber-300',
  teal: 'text-teal-700 dark:text-teal-300',
  violet: 'text-violet-700 dark:text-violet-300',
  rose: 'text-rose-700 dark:text-rose-300',
  slate: 'text-slate-700 dark:text-slate-300',
}

// === Formatters ===

export function formatNum(n: number, digits = 0): string {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function formatRelativeDate(iso: string, now = new Date()): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const diffDay = Math.round((now.getTime() - d.getTime()) / 86_400_000)
  if (diffDay === 0) return 'hoje'
  if (diffDay === 1) return 'ontem'
  if (diffDay < 7) return `há ${diffDay} dias`
  if (diffDay < 30) return `há ${Math.round(diffDay / 7)}sem`
  if (diffDay < 365) return `há ${Math.round(diffDay / 30)}m`
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}
