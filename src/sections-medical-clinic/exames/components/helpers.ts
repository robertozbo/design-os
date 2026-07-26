import type {
  AlertNivel,
  CorEspecialidade,
  Tendencia,
} from '@/../product-medical-clinic/sections/exames/types'

export const AVATAR_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

export const BADGE_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  sky: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
}

interface NivelMeta {
  label: string
  texto: string
  bg: string
  ponto: string
  barra: string
}

export const NIVEL_META: Record<AlertNivel, NivelMeta> = {
  baixo: {
    label: 'Baixo',
    texto: 'text-sky-700 dark:text-sky-300',
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    ponto: 'bg-sky-500',
    barra: 'bg-sky-500',
  },
  normal: {
    label: 'Normal',
    texto: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    ponto: 'bg-emerald-500',
    barra: 'bg-emerald-500',
  },
  alto: {
    label: 'Alto',
    texto: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    ponto: 'bg-amber-500',
    barra: 'bg-amber-500',
  },
  critico: {
    label: 'Crítico',
    texto: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    ponto: 'bg-rose-500',
    barra: 'bg-rose-500',
  },
}

export const TENDENCIA_SETA: Record<Tendencia, string> = {
  subindo: '↑',
  caindo: '↓',
  estavel: '→',
}
