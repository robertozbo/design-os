import type {
  Conselho,
  ObjetivoId,
  StatusAvaliacao,
} from '@/../product-clinic/sections/avaliacao-fisica/types'
import type { Tom } from './formulas'

/** Classes do badge de classificação, por tom. */
export const TOM_BADGE: Record<Tom, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
}

export const TOM_TEXTO: Record<Tom, string> = {
  emerald: 'text-emerald-600 dark:text-emerald-400',
  amber: 'text-amber-600 dark:text-amber-400',
  rose: 'text-rose-600 dark:text-rose-400',
  slate: 'text-slate-400',
}

export const TOM_BARRA: Record<Tom, string> = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-400',
  rose: 'bg-rose-500',
  slate: 'bg-slate-300 dark:bg-slate-600',
}

/**
 * Cada conselho tem o seu tom: a mesma tela é aberta pela nutricionista e pelo educador físico,
 * e quem assina precisa aparecer antes do que foi medido.
 */
export const COR_CONSELHO: Record<Conselho, { chip: string; barra: string; texto: string }> = {
  CRN: {
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    barra: 'bg-emerald-500',
    texto: 'text-emerald-600 dark:text-emerald-400',
  },
  CREF: {
    chip: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    barra: 'bg-sky-500',
    texto: 'text-sky-600 dark:text-sky-400',
  },
}

export const CONSELHO_LABEL: Record<Conselho, string> = {
  CRN: 'Nutrição',
  CREF: 'Educação física',
}

export const OBJETIVO_LABEL: Record<ObjetivoId, string> = {
  emagrecimento: 'Emagrecimento',
  hipertrofia: 'Hipertrofia',
  recomposicao: 'Recomposição corporal',
  performance: 'Performance',
  saude: 'Saúde e manutenção',
}

export const STATUS_LABEL: Record<StatusAvaliacao, { label: string; classe: string }> = {
  rascunho: {
    label: 'Rascunho',
    classe: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  },
  concluida: {
    label: 'Concluída',
    classe: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  },
}

export function numero(valor: number | null | undefined, casas = 1): string {
  if (valor == null || !Number.isFinite(valor)) return '—'
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })
}

export interface Delta {
  valor: number
  /** Já em módulo — o sinal quem carrega é a seta, como no comparativo do personal. */
  absoluto: number
  direcao: 'sobe' | 'desce' | 'igual'
  label: string
  cor: string
}

/**
 * Delta entre duas medidas, já no tom certo.
 *
 * `menorEhMelhor` não é detalhe cosmético: para massa magra e TMB, subir é a melhora. Pintar o
 * sinal aritmético em vez da direção desejável faz a tela comemorar perda de músculo.
 */
export function delta(
  atual: number | null | undefined,
  anterior: number | null | undefined,
  menorEhMelhor = true,
  casas = 1,
): Delta | null {
  if (atual == null || anterior == null) return null
  const d = atual - anterior
  const direcao = d === 0 ? 'igual' : d > 0 ? 'sobe' : 'desce'
  const bom = menorEhMelhor ? d < 0 : d > 0
  return {
    valor: d,
    absoluto: Math.abs(d),
    direcao,
    label: `${d > 0 ? '+' : d < 0 ? '−' : ''}${numero(Math.abs(d), casas)}`,
    cor:
      d === 0
        ? 'text-slate-400'
        : bom
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-rose-600 dark:text-rose-400',
  }
}

/**
 * Escala que nunca divide por zero quando a série é constante.
 *
 * `folgaPct` é maior nas barras (0,5) do que na linha (0,15) de propósito: sem folga, a barra do
 * valor mínimo vira um traço de 4px e some — a comparação some junto. Na linha, folga grande achata
 * a curva e é o efeito contrário do desejado.
 */
export function escala(valores: number[], folgaPct = 0.15): { min: number; max: number } {
  const validos = valores.filter((v) => Number.isFinite(v))
  if (validos.length === 0) return { min: 0, max: 1 }
  const min = Math.min(...validos)
  const max = Math.max(...validos)
  if (min === max) return { min: min - 1, max: max + 1 }
  const folga = (max - min) * folgaPct
  return { min: min - folga, max: max + folga }
}

export function alturaBarra(valor: number, min: number, max: number, px = 56): number {
  return ((valor - min) / (max - min)) * px + 4
}
