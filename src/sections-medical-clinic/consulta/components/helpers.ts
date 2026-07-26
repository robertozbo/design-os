import type { CorEspecialidade } from '@/../product-medical-clinic/sections/consulta/types'

export const AVATAR_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

export const TEXTO_COR: Record<CorEspecialidade, string> = {
  teal: 'text-teal-700 dark:text-teal-300',
  rose: 'text-rose-700 dark:text-rose-300',
  violet: 'text-violet-700 dark:text-violet-300',
  slate: 'text-slate-600 dark:text-slate-300',
  sky: 'text-sky-700 dark:text-sky-300',
  amber: 'text-amber-700 dark:text-amber-300',
}

/** 125 -> "02:05" */
export function formatTimer(segundos: number): string {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const SOAP_LABEL: Record<'S' | 'O' | 'A' | 'P', string> = {
  S: 'Subjetivo',
  O: 'Objetivo',
  A: 'Avaliação',
  P: 'Plano',
}

/**
 * O que entra em cada letra do SOAP. O rótulo sozinho não ensina: "Subjetivo" e "Objetivo" são
 * jargão, e quem aprendeu há vinte anos (ou nunca formalizou) preenche no lugar errado.
 */
export const SOAP_AJUDA: Record<'S' | 'O' | 'A' | 'P', string> = {
  S: 'O que o paciente relata — queixa, história, sintomas nas palavras dele',
  O: 'O que você mediu e examinou — sinais vitais, exame físico, resultados',
  A: 'Sua interpretação — hipóteses diagnósticas, o que isso significa',
  P: 'A conduta — prescrição, exames solicitados, orientações, retorno',
}
