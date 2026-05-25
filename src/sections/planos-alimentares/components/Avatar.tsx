import type { AvatarColor } from '@/../product/sections/planos-alimentares/types'

interface AvatarProps {
  initials: string
  color: AvatarColor
  size?: 'sm' | 'md' | 'lg'
}

const COLOR_BG: Record<AvatarColor, string> = {
  teal: 'bg-teal-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  orange: 'bg-orange-500',
  sky: 'bg-sky-500',
  pink: 'bg-pink-500',
}

const SIZE: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-12 w-12 text-sm',
}

export function Avatar({ initials, color, size = 'md' }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-mono font-semibold tabular-nums text-white ${COLOR_BG[color]} ${SIZE[size]}`}
    >
      {initials}
    </span>
  )
}
