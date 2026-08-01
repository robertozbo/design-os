import type { ReactNode } from 'react'
import type { HudPanelStatus } from '@/../product/sections/assistente-nymos/types'
import { ArrowUpRight } from 'lucide-react'

interface HudPanelProps {
  label: string
  status: HudPanelStatus
  children: ReactNode
  onDrillDown?: () => void
  size?: 'sm' | 'md' | 'lg'
  align?: 'left' | 'right'
}

const STATUS_STYLES: Record<HudPanelStatus, { border: string; glow: string; label: string; bg: string }> = {
  idle: {
    border: 'border-teal-500/25',
    glow: 'shadow-none',
    label: 'text-teal-500/70',
    bg: 'bg-slate-950/60',
  },
  active: {
    border: 'border-teal-400/80',
    glow: 'shadow-[0_0_18px_-2px_rgba(45,212,191,0.55)]',
    label: 'text-teal-300',
    bg: 'bg-teal-500/[0.04]',
  },
  alert: {
    border: 'border-orange-400/80',
    glow: 'shadow-[0_0_18px_-2px_rgba(251,146,60,0.55)]',
    label: 'text-orange-300',
    bg: 'bg-orange-500/[0.04]',
  },
}

export function HudPanel({
  label,
  status,
  children,
  onDrillDown,
  size = 'md',
  align = 'left',
}: HudPanelProps) {
  const s = STATUS_STYLES[status]
  const sizeClasses = {
    sm: 'p-2.5 min-w-[120px]',
    md: 'p-3 min-w-[160px]',
    lg: 'p-3.5 min-w-[200px]',
  }[size]

  return (
    <div
      className={`
        relative font-mono backdrop-blur-sm
        border ${s.border} ${s.glow} ${s.bg}
        ${sizeClasses}
        transition-all duration-300
      `}
      style={{
        clipPath:
          'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
      }}
    >
      {/* Corner brackets */}
      <span
        aria-hidden="true"
        className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${s.border.replace('/25', '/60').replace('/80', '')}`}
      />
      <span
        aria-hidden="true"
        className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${s.border.replace('/25', '/60').replace('/80', '')}`}
      />
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${s.border.replace('/25', '/60').replace('/80', '')}`}
      />
      <span
        aria-hidden="true"
        className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${s.border.replace('/25', '/60').replace('/80', '')}`}
      />

      <div
        className={`flex items-center justify-between mb-2 ${align === 'right' ? 'flex-row-reverse' : ''}`}
      >
        <span
          className={`text-[10px] tracking-[0.18em] uppercase font-medium ${s.label}`}
        >
          {label}
        </span>
        {onDrillDown && (
          <button
            type="button"
            onClick={onDrillDown}
            className="text-teal-400/60 hover:text-teal-300 transition-colors"
            aria-label={`Abrir detalhes de ${label}`}
          >
            <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className={align === 'right' ? 'text-right' : ''}>{children}</div>
    </div>
  )
}
