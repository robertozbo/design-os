import type { Antropometria, Funcional } from '@/../product-personal/sections/avaliacoes/types'

export const EMPTY_ANTROPOMETRIA: Antropometria = {
  pesoKg: null,
  estaturaCm: null,
  imc: null,
  circunferencias: {
    cintura: null,
    quadril: null,
    braco: null,
    coxa: null,
    panturrilha: null,
    abdomen: null,
  },
  dobras: {
    peitoral: null,
    axilarMedia: null,
    triciptal: null,
    subescapular: null,
    abdominal: null,
    suprailiaca: null,
    coxa: null,
    percentualGorduraPollock: null,
  },
  bioimpedancia: {
    pesoKg: null,
    percentualGordura: null,
    massaMagraKg: null,
    percentualAgua: null,
  },
  fotos: { frontalUrl: null, lateralUrl: null, posteriorUrl: null },
}

export const EMPTY_FUNCIONAL: Funcional = {
  rm: { supino: null, squat: null, deadlift: null },
  fms: null,
  flexibilidade: null,
  cardio: null,
  resistenciaLocal: null,
}

/** IMC = peso / (estatura/100)² */
export function calcularIMC(
  pesoKg: number | null,
  estaturaCm: number | null,
): number | null {
  if (!pesoKg || !estaturaCm) return null
  const m = estaturaCm / 100
  return Math.round((pesoKg / (m * m)) * 10) / 10
}

/** Soma das 7 dobras (Pollock) */
export function somaDobras(dobras: {
  peitoral: number | null
  axilarMedia: number | null
  triciptal: number | null
  subescapular: number | null
  abdominal: number | null
  suprailiaca: number | null
  coxa: number | null
}): number | null {
  const valores = [
    dobras.peitoral,
    dobras.axilarMedia,
    dobras.triciptal,
    dobras.subescapular,
    dobras.abdominal,
    dobras.suprailiaca,
    dobras.coxa,
  ]
  if (valores.some((v) => v == null)) return null
  return valores.reduce<number>((sum, v) => sum + (v ?? 0), 0)
}

/**
 * Pollock 7-dobras (Jackson-Pollock) — equação masculina simplificada
 * Densidade = 1.112 - 0.00043499 × S + 0.00000055 × S² - 0.00028826 × idade
 * %G = (4.95/D - 4.50) × 100 (Siri)
 * Idade default 30 (não temos no formulário ainda — refinar depois).
 */
export function calcularPercentualGorduraPollock(
  dobras: Parameters<typeof somaDobras>[0],
  idade: number = 30,
): number | null {
  const S = somaDobras(dobras)
  if (S == null) return null
  const D =
    1.112 -
    0.00043499 * S +
    0.00000055 * S * S -
    0.00028826 * idade
  const pg = (4.95 / D - 4.5) * 100
  return Math.round(pg * 10) / 10
}

/** 1RM Brzycki: peso × 36 / (37 - reps) */
export function calcular1RMBrzycki(
  pesoKg: number | null,
  reps: number | null,
): number | null {
  if (!pesoKg || !reps || reps < 1 || reps > 36) return null
  return Math.round((pesoKg * 36) / (37 - reps))
}

export const FMS_TESTES: { key: keyof FMSValues; label: string }[] = [
  { key: 'deepSquat', label: 'Deep Squat' },
  { key: 'hurdleStep', label: 'Hurdle Step' },
  { key: 'inLineLunge', label: 'In-Line Lunge' },
  { key: 'shoulderMobility', label: 'Shoulder Mobility' },
  { key: 'activeStraightLegRaise', label: 'Active Straight Leg Raise' },
  { key: 'trunkStabilityPushup', label: 'Trunk Stability Push-up' },
  { key: 'rotaryStability', label: 'Rotary Stability' },
]

export interface FMSValues {
  deepSquat: number
  hurdleStep: number
  inLineLunge: number
  shoulderMobility: number
  activeStraightLegRaise: number
  trunkStabilityPushup: number
  rotaryStability: number
}

export function fmsTotal(v: FMSValues): number {
  return (
    v.deepSquat +
    v.hurdleStep +
    v.inLineLunge +
    v.shoulderMobility +
    v.activeStraightLegRaise +
    v.trunkStabilityPushup +
    v.rotaryStability
  )
}
