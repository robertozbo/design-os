import type { TipoEvento } from '@/../product/sections/eventos-esocial/types'

const TONE: Record<
  TipoEvento,
  { bg: string; text: string; ring: string; label: string }
> = {
  'S-2210': {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    ring: 'ring-rose-200 dark:ring-rose-900',
    label: 'CAT',
  },
  'S-2220': {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-700 dark:text-teal-300',
    ring: 'ring-teal-200 dark:ring-teal-900',
    label: 'ASO',
  },
  'S-2221': {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    text: 'text-cyan-700 dark:text-cyan-300',
    ring: 'ring-cyan-200 dark:ring-cyan-900',
    label: 'Toxicológico',
  },
  'S-2240': {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-800 dark:text-amber-300',
    ring: 'ring-amber-200 dark:ring-amber-900',
    label: 'Riscos',
  },
  'S-2245': {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-700 dark:text-violet-300',
    ring: 'ring-violet-200 dark:ring-violet-900',
    label: 'Treinos',
  },
}

interface Props {
  tipo: TipoEvento
  compact?: boolean
}

export function TipoEventoBadge({ tipo, compact = false }: Props) {
  const t = TONE[tipo]
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-md ring-1 font-medium tabular-nums
        ${t.bg} ${t.text} ${t.ring}
        ${compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'}
      `}
    >
      <span className="font-mono font-semibold tracking-wide opacity-80">{tipo}</span>
      <span className="opacity-50">·</span>
      <span>{t.label}</span>
    </span>
  )
}
