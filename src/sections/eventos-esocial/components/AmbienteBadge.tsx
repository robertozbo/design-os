import type { Ambiente } from '@/../product/sections/eventos-esocial/types'
import { FlaskConical, Radio } from 'lucide-react'

interface Props {
  ambiente: Ambiente
  size?: 'sm' | 'md'
}

export function AmbienteBadge({ ambiente, size = 'sm' }: Props) {
  const isHomol = ambiente === 'homologacao'
  const Icon = isHomol ? FlaskConical : Radio

  if (size === 'md') {
    return (
      <span
        className={`
          inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider ring-1
          ${
            isHomol
              ? 'bg-orange-100 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 ring-orange-300 dark:ring-orange-900'
              : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 ring-emerald-300 dark:ring-emerald-900'
          }
        `}
      >
        <Icon className="w-3 h-3" strokeWidth={2} />
        {isHomol ? 'Homologação' : 'Produção'}
      </span>
    )
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ring-1
        ${
          isHomol
            ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 ring-orange-200 dark:ring-orange-900'
            : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-900'
        }
      `}
    >
      <Icon className="w-2.5 h-2.5" strokeWidth={2} />
      {isHomol ? 'HOMOL' : 'PROD'}
    </span>
  )
}
