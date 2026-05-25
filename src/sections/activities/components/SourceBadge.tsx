import { Smartphone, Hand } from 'lucide-react'
import type { ActivitySource } from '@/../product/sections/activities/types'

export interface SourceBadgeProps {
  source: ActivitySource
  label: string
  size?: 'xs' | 'sm'
}

export function SourceBadge({ source, label, size = 'xs' }: SourceBadgeProps) {
  const isDevice = source !== 'manual'
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-1.5 py-0.5'
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-[10px]'
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full
        ${padding} ${textSize}
        font-medium uppercase tracking-[0.08em]
        ${
          isDevice
            ? 'bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300'
            : 'bg-slate-500/10 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300'
        }
      `}
    >
      {isDevice ? <Smartphone className="w-2.5 h-2.5" /> : <Hand className="w-2.5 h-2.5" />}
      <span className="truncate">{label}</span>
    </span>
  )
}
