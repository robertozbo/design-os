import {
  Footprints,
  Bike,
  Droplet,
  Music,
  Zap,
  Dumbbell,
  Sparkles,
  Activity,
  Award,
  Heart,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  footprints: Footprints,
  bike: Bike,
  droplet: Droplet,
  music: Music,
  zap: Zap,
  dumbbell: Dumbbell,
  sparkles: Sparkles,
  activity: Activity,
  award: Award,
  heart: Heart,
  'more-horizontal': MoreHorizontal,
}

const CATEGORY_TINT: Record<string, { bg: string; fg: string }> = {
  cardio: {
    bg: 'bg-rose-500/10 dark:bg-rose-400/10',
    fg: 'text-rose-600 dark:text-rose-300',
  },
  forca: {
    bg: 'bg-amber-500/10 dark:bg-amber-400/10',
    fg: 'text-amber-600 dark:text-amber-300',
  },
  flexibilidade: {
    bg: 'bg-violet-500/10 dark:bg-violet-400/10',
    fg: 'text-violet-600 dark:text-violet-300',
  },
  esporte: {
    bg: 'bg-sky-500/10 dark:bg-sky-400/10',
    fg: 'text-sky-600 dark:text-sky-300',
  },
  bem_estar: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    fg: 'text-emerald-600 dark:text-emerald-300',
  },
  outros: {
    bg: 'bg-slate-500/10 dark:bg-slate-400/10',
    fg: 'text-slate-600 dark:text-slate-300',
  },
}

export interface ActivityIconProps {
  iconKey: string
  categoryKey: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_MAP = {
  sm: { wrap: 'w-8 h-8 rounded-lg', icon: 'w-3.5 h-3.5' },
  md: { wrap: 'w-10 h-10 rounded-xl', icon: 'w-4 h-4' },
  lg: { wrap: 'w-12 h-12 rounded-2xl', icon: 'w-5 h-5' },
} as const

export function ActivityIcon({ iconKey, categoryKey, size = 'md' }: ActivityIconProps) {
  const Icon = ICONS[iconKey] ?? Activity
  const tint = CATEGORY_TINT[categoryKey] ?? CATEGORY_TINT.outros
  const s = SIZE_MAP[size]
  return (
    <div className={`shrink-0 grid place-items-center ${s.wrap} ${tint.bg} ${tint.fg}`}>
      <Icon className={s.icon} />
    </div>
  )
}
