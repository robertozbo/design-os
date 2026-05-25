import type {
  AvatarColor,
  Objetivo,
  ObjetivoOption,
} from '@/../product/sections/planos-alimentares/types'

interface ObjetivoBadgeProps {
  objetivo: Objetivo | null
  options: ObjetivoOption[]
  size?: 'sm' | 'md'
}

const COLOR_TINT: Record<AvatarColor, { bg: string; text: string; dot: string }> = {
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-900/30',
    text: 'text-teal-700 dark:text-teal-300',
    dot: 'bg-teal-500',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-900/30',
    text: 'text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-500',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-900/30',
    text: 'text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-500',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    dot: 'bg-orange-500',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-900/30',
    text: 'text-sky-700 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-900/30',
    text: 'text-pink-700 dark:text-pink-300',
    dot: 'bg-pink-500',
  },
}

export function ObjetivoBadge({ objetivo, options, size = 'sm' }: ObjetivoBadgeProps) {
  if (!objetivo) return null

  const opt = options.find((o) => o.id === objetivo.id)
  const label =
    objetivo.id === 'outro' ? objetivo.customLabel ?? 'Outro' : opt?.label ?? objetivo.id
  const color: AvatarColor = opt?.color ?? 'sky'
  const tint = COLOR_TINT[color]

  const sizeClass =
    size === 'md'
      ? 'px-2.5 py-1 text-[11px]'
      : 'px-2 py-0.5 text-[10px]'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClass} font-medium ${tint.bg} ${tint.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tint.dot}`} />
      {label}
    </span>
  )
}
