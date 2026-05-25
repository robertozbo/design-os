import {
  Dumbbell,
  Activity,
  Heart,
  Footprints,
  Moon,
  Apple,
  Brain,
  type LucideIcon,
} from 'lucide-react'
import type { DimensionId, DimensionStatus } from '@/../product-mobile/sections/minha-saude/types'

export const DIMENSION_ICON: Record<DimensionId, LucideIcon> = {
  composicao: Dumbbell,
  metabolico: Activity,
  cardiovascular: Heart,
  atividade: Footprints,
  sono: Moon,
  nutricao: Apple,
  mental: Brain,
}

interface StatusVisual {
  bg: string
  text: string
  border: string
  ring: string
  label: string
  /** Cor base pra gauge/gradient */
  hex: string
}

export const STATUS_VISUAL: Record<DimensionStatus, StatusVisual> = {
  otimo: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    ring: 'stroke-emerald-400',
    label: 'Ótimo',
    hex: '#34d399',
  },
  bom: {
    bg: 'bg-teal-500/15',
    text: 'text-teal-300',
    border: 'border-teal-500/30',
    ring: 'stroke-teal-400',
    label: 'Bom',
    hex: '#2dd4bf',
  },
  atencao: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    ring: 'stroke-amber-400',
    label: 'Atenção',
    hex: '#fbbf24',
  },
  risco: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-300',
    border: 'border-rose-500/30',
    ring: 'stroke-rose-400',
    label: 'Risco',
    hex: '#fb7185',
  },
  sem_dados: {
    bg: 'bg-slate-800',
    text: 'text-slate-500',
    border: 'border-slate-700',
    ring: 'stroke-slate-700',
    label: 'Sem dados',
    hex: '#475569',
  },
}

export function statusFromScore(score: number | null): DimensionStatus {
  if (score === null) return 'sem_dados'
  if (score >= 85) return 'otimo'
  if (score >= 70) return 'bom'
  if (score >= 50) return 'atencao'
  return 'risco'
}

export function formatRelativeDate(iso: string): string {
  const target = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - target.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days === 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 7) return `há ${days} dias`
  if (days < 30) return `há ${Math.floor(days / 7)} sem`
  if (days < 365) return `há ${Math.floor(days / 30)} mês`
  return `há ${Math.floor(days / 365)} ano(s)`
}

export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
