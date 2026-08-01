import type { NivelMetrica } from '@/../product-clinic/sections/acompanhamento/types'

/**
 * Leitura clínica do valor — **fonte única** de cor para os painéis da section. `normal` é emerald
 * (e não slate) porque aqui "normal" é resultado bom, não ausência de informação.
 */
export const NIVEL_META: Record<
  NivelMetrica,
  { label: string; badge: string; texto: string; traco: string; area: string; ponto: string }
> = {
  normal: {
    label: 'Normal',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    texto: 'text-emerald-700 dark:text-emerald-400',
    traco: 'stroke-emerald-500 dark:stroke-emerald-400',
    area: 'fill-emerald-500/10 dark:fill-emerald-400/15',
    ponto: 'fill-emerald-500 dark:fill-emerald-400',
  },
  atencao: {
    label: 'Atenção',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    texto: 'text-amber-700 dark:text-amber-400',
    traco: 'stroke-amber-500 dark:stroke-amber-400',
    area: 'fill-amber-500/10 dark:fill-amber-400/15',
    ponto: 'fill-amber-500 dark:fill-amber-400',
  },
  alterado: {
    label: 'Alterado',
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    texto: 'text-rose-700 dark:text-rose-400',
    traco: 'stroke-rose-500 dark:stroke-rose-400',
    area: 'fill-rose-500/10 dark:fill-rose-400/15',
    ponto: 'fill-rose-500 dark:fill-rose-400',
  },
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** "2026-07-10" → "10 jul". */
export function dataCurta(iso: string): string {
  const [, m, d] = iso.split('-').map(Number)
  return `${d} ${MESES[m - 1]}`
}

/** "2026-07-10" → "10 jul 2026". */
export function dataExtensa(iso: string): string {
  const [a, m, d] = iso.split('-').map(Number)
  return `${d} ${MESES[m - 1]} ${a}`
}

/**
 * Distância em dias até "hoje" no protótipo. O mock tem data fixa — usar `new Date()` real deixaria
 * a tela mudando de texto todo dia e quebraria screenshot.
 */
const HOJE = '2026-07-25'

export function diasEntre(de: string, ate = HOJE): number {
  const [a1, m1, d1] = de.split('-').map(Number)
  const [a2, m2, d2] = ate.split('-').map(Number)
  const ms = Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1)
  return Math.round(ms / 86400000)
}

/** "há 15 dias" / "ontem" / "hoje". */
export function desdeUltimaConsulta(iso: string): string {
  const dias = diasEntre(iso)
  if (dias <= 0) return 'hoje'
  if (dias === 1) return 'ontem'
  if (dias < 30) return `há ${dias} dias`
  const meses = Math.round(dias / 30)
  return meses === 1 ? 'há 1 mês' : `há ${meses} meses`
}

/**
 * Número com sinal explícito — a variação só é legível se o sinal aparecer.
 *
 * Usa o menos tipográfico `−` (U+2212), não o hífen que o `Intl` devolve: os painéis da section
 * dividem a mesma tela e o glifo mudava ao trocar de aba.
 */
export function comSinal(n: number, casas = 1): string {
  const v = n.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })
  return n > 0 ? `+${v}` : v.replace(/^-/, '−')
}

export function numero(n: number, casas = 0): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })
}
