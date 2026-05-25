import type {
  Avaliacao,
  ClassTone,
  Classificacoes,
  ClassificacaoFaixa,
  MedidaId,
  PacienteContexto,
  SexoBiologico,
} from '@/../product/sections/avalia-o-antropom-trica/types'

// === Calculations ===

export function calcImc(pesoKg: number, alturaCm: number): number {
  if (!pesoKg || !alturaCm) return 0
  const m = alturaCm / 100
  return pesoKg / (m * m)
}

export function calcRcq(cinturaCm?: number, quadrilCm?: number): number | null {
  if (!cinturaCm || !quadrilCm) return null
  return cinturaCm / quadrilCm
}

/**
 * Pollock 3-fold body density (men: peitoral+abdominal+coxa, women: tricipital+suprailíaca+coxa).
 * We use the BR-common variant: tricipital+suprailíaca+abdominal for both sexes (a fair approximation).
 */
export function calcPercentualGorduraPollock3(
  somaMm: number,
  idade: number,
  sexo: SexoBiologico,
): number {
  if (!somaMm || somaMm < 6) return 0
  const sigma = somaMm
  const sigma2 = sigma * sigma
  const D =
    sexo === 'masculino'
      ? 1.10938 - 0.0008267 * sigma + 0.0000016 * sigma2 - 0.0002574 * idade
      : 1.0994921 - 0.0009929 * sigma + 0.0000023 * sigma2 - 0.0001392 * idade
  if (D <= 0) return 0
  return 495 / D - 450
}

// === Field-value extractor for chart series ===

export function getMedidaValue(
  avaliacao: Avaliacao,
  medida: MedidaId,
): number | null {
  switch (medida) {
    case 'peso':
      return avaliacao.basicas.pesoKg
    case 'imc':
      return calcImc(avaliacao.basicas.pesoKg, avaliacao.basicas.alturaCm)
    case 'percentualGordura':
      return avaliacao.composicao.percentualGordura ?? null
    case 'massaMagra':
      return avaliacao.composicao.massaMagraKg ?? null
    case 'gorduraVisceral':
      return avaliacao.composicao.gorduraVisceral ?? null
    case 'tmb':
      return avaliacao.composicao.tmbKcal ?? null
    case 'cintura':
      return avaliacao.circunferencias.cinturaCm ?? null
    case 'quadril':
      return avaliacao.circunferencias.quadrilCm ?? null
    case 'rcq':
      return calcRcq(
        avaliacao.circunferencias.cinturaCm,
        avaliacao.circunferencias.quadrilCm,
      )
    default:
      return null
  }
}

// === Delta helpers ===

export interface Delta {
  abs: number
  pct: number
  /** 'down' = value decreased; 'up' = value increased; 'flat' = ~0 change. */
  direction: 'down' | 'up' | 'flat'
}

export function computeDelta(current: number, previous: number): Delta | null {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null
  if (previous === 0) return null
  const abs = current - previous
  const pct = (abs / previous) * 100
  const flatThreshold = Math.abs(previous) * 0.001
  const direction =
    Math.abs(abs) <= flatThreshold ? 'flat' : abs < 0 ? 'down' : 'up'
  return { abs, pct, direction }
}

/**
 * Whether a delta is "good" or "bad" depends on the medida (e.g. lower weight is good
 * if patient wants weight loss). For the design we treat: weight, fat %, fat-mass-related,
 * waist & RCQ → "down is good"; muscle mass → "up is good". Returns the tone for the chip.
 */
export function deltaTone(medida: MedidaId, direction: Delta['direction']): ClassTone | 'slate' {
  if (direction === 'flat') return 'slate'
  const lowerIsBetter: MedidaId[] = [
    'peso',
    'imc',
    'percentualGordura',
    'gorduraVisceral',
    'cintura',
    'quadril',
    'rcq',
  ]
  const higherIsBetter: MedidaId[] = ['massaMagra', 'tmb']
  const isBetter =
    (lowerIsBetter.includes(medida) && direction === 'down') ||
    (higherIsBetter.includes(medida) && direction === 'up')
  return isBetter ? 'emerald' : 'rose'
}

// === Classifications ===

export function classifyImc(imc: number, classificacoes: Classificacoes): ClassificacaoFaixa | null {
  return findFaixa(imc, classificacoes.imc)
}

export function classifyRcq(
  rcq: number,
  sexo: SexoBiologico,
  classificacoes: Classificacoes,
): ClassificacaoFaixa | null {
  const faixas = sexo === 'masculino' ? classificacoes.rcqMasculino : classificacoes.rcqFeminino
  return findFaixa(rcq, faixas)
}

export function classifyPercentualGordura(
  pct: number,
  sexo: SexoBiologico,
  classificacoes: Classificacoes,
): ClassificacaoFaixa | null {
  const faixas =
    sexo === 'masculino'
      ? classificacoes.percentualGorduraMasculino
      : classificacoes.percentualGorduraFeminino
  return findFaixa(pct, faixas)
}

function findFaixa(value: number, faixas: ClassificacaoFaixa[]): ClassificacaoFaixa | null {
  for (const f of faixas) {
    if (value <= f.valorAte) return f
  }
  return null
}

// === Tone helpers ===

export const TONE_TEXT: Record<ClassTone | 'slate', string> = {
  rose: 'text-rose-600 dark:text-rose-400',
  amber: 'text-amber-600 dark:text-amber-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  slate: 'text-slate-500 dark:text-slate-500',
}

export const TONE_BADGE: Record<ClassTone | 'slate', string> = {
  rose: 'bg-rose-50 text-rose-700 ring-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60',
  emerald:
    'bg-emerald-50 text-emerald-700 ring-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60',
  slate:
    'bg-slate-100 text-slate-600 ring-slate-200/60 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700/60',
}

export const AVATAR_COLOR: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  sky: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
}

// === Formatters ===

export function formatRelativeDate(iso: string, now = new Date()): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const diffDay = Math.round((now.getTime() - d.getTime()) / 86_400_000)
  if (diffDay === 0) return 'hoje'
  if (diffDay === 1) return 'ontem'
  if (diffDay < 7) return `há ${diffDay} dias`
  if (diffDay < 30) return `há ${Math.round(diffDay / 7)}sem`
  if (diffDay < 365) return `há ${Math.round(diffDay / 30)}m`
  return `há ${Math.round(diffDay / 365)}a`
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function formatNumber(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function formatSigned(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return '—'
  const sign = n > 0 ? '+' : ''
  return sign + formatNumber(n, digits)
}

// Re-export for convenience
export type { Avaliacao, Classificacoes, MedidaId, PacienteContexto }
