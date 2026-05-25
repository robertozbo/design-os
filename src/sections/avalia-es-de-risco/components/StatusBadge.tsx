import type { AvaliacaoStatus } from '@/../product/sections/avalia-es-de-risco/types'

const STATUS_CONFIG: Record<AvaliacaoStatus, { label: string; dot: string; text: string; bg: string; ring: string; pulse?: boolean }> = {
  rascunho: {
    label: 'Rascunho',
    dot: 'bg-slate-400 dark:bg-slate-500',
    text: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    ring: 'ring-slate-200 dark:ring-slate-700',
  },
  em_aplicacao: {
    label: 'Em aplicação',
    dot: 'bg-teal-500',
    text: 'text-teal-700 dark:text-teal-300',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    ring: 'ring-teal-200/80 dark:ring-teal-800/60',
    pulse: true,
  },
  encerrada: {
    label: 'Encerrada',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    ring: 'ring-amber-200/80 dark:ring-amber-800/60',
  },
  publicada: {
    label: 'Publicada',
    dot: 'bg-violet-500',
    text: 'text-violet-700 dark:text-violet-300',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    ring: 'ring-violet-200/80 dark:ring-violet-800/60',
  },
}

export function StatusBadge({ status }: { status: AvaliacaoStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
      <span className={`relative flex h-1.5 w-1.5`}>
        {cfg.pulse && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${cfg.dot} opacity-60`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      </span>
      {cfg.label}
    </span>
  )
}
