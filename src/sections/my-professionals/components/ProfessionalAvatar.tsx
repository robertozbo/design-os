import {
  Apple,
  Dumbbell,
  Stethoscope,
  Heart,
  Brain,
  UserCheck,
  Activity,
  type LucideIcon,
} from 'lucide-react'
import type { ProfessionalTypeKey } from '@/../product/sections/my-professionals/types'

const TYPE_ICON: Record<string, LucideIcon> = {
  nutritionist: Apple,
  personal_trainer: Dumbbell,
  doctor: Stethoscope,
  physiotherapist: Heart,
  psychologist: Brain,
  health_coach: UserCheck,
}

const TYPE_TINT: Record<string, { bg: string; fg: string; ring: string }> = {
  nutritionist: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    fg: 'text-emerald-600 dark:text-emerald-300',
    ring: 'ring-emerald-500/20 dark:ring-emerald-400/20',
  },
  personal_trainer: {
    bg: 'bg-amber-500/10 dark:bg-amber-400/10',
    fg: 'text-amber-600 dark:text-amber-300',
    ring: 'ring-amber-500/20 dark:ring-amber-400/20',
  },
  doctor: {
    bg: 'bg-rose-500/10 dark:bg-rose-400/10',
    fg: 'text-rose-600 dark:text-rose-300',
    ring: 'ring-rose-500/20 dark:ring-rose-400/20',
  },
  physiotherapist: {
    bg: 'bg-sky-500/10 dark:bg-sky-400/10',
    fg: 'text-sky-600 dark:text-sky-300',
    ring: 'ring-sky-500/20 dark:ring-sky-400/20',
  },
  psychologist: {
    bg: 'bg-violet-500/10 dark:bg-violet-400/10',
    fg: 'text-violet-600 dark:text-violet-300',
    ring: 'ring-violet-500/20 dark:ring-violet-400/20',
  },
  health_coach: {
    bg: 'bg-teal-500/10 dark:bg-teal-400/10',
    fg: 'text-teal-600 dark:text-teal-300',
    ring: 'ring-teal-500/20 dark:ring-teal-400/20',
  },
}

export interface ProfessionalAvatarProps {
  type: ProfessionalTypeKey | string
  fullName: string
  avatarUrl?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showRing?: boolean
}

const SIZE_MAP = {
  xs: { wrap: 'w-7 h-7 rounded-lg text-[10px]', icon: 'w-3 h-3' },
  sm: { wrap: 'w-9 h-9 rounded-xl text-xs', icon: 'w-4 h-4' },
  md: { wrap: 'w-12 h-12 rounded-2xl text-sm', icon: 'w-5 h-5' },
  lg: { wrap: 'w-16 h-16 rounded-2xl text-base', icon: 'w-6 h-6' },
} as const

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function ProfessionalAvatar({
  type,
  fullName,
  avatarUrl,
  size = 'md',
  showRing = false,
}: ProfessionalAvatarProps) {
  const tint = TYPE_TINT[type] ?? {
    bg: 'bg-slate-500/10 dark:bg-slate-400/10',
    fg: 'text-slate-600 dark:text-slate-300',
    ring: 'ring-slate-500/20',
  }
  const Icon = TYPE_ICON[type] ?? Activity
  const s = SIZE_MAP[size]

  if (avatarUrl) {
    return (
      <div
        className={`
          relative shrink-0 ${s.wrap} overflow-hidden
          ${tint.bg} ${tint.fg}
          ${showRing ? `ring-2 ${tint.ring}` : ''}
        `}
      >
        <img
          src={avatarUrl}
          alt={fullName}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={`
        relative shrink-0 grid place-items-center ${s.wrap}
        ${tint.bg} ${tint.fg}
        font-semibold tracking-tight
        ${showRing ? `ring-2 ${tint.ring}` : ''}
      `}
    >
      <span className="font-mono">{initials(fullName)}</span>
      <div
        className={`
          absolute -bottom-0.5 -right-0.5
          grid place-items-center w-4 h-4 rounded-full
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-800
        `}
      >
        <Icon className={`${s.icon} ${tint.fg}`} />
      </div>
    </div>
  )
}
