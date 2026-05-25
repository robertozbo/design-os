import type { StatusEvento } from '@/../product/sections/eventos-esocial/types'

const TONE: Record<
  StatusEvento,
  { dot: string; bg: string; text: string; ring: string; pulse?: boolean }
> = {
  disponivel: {
    dot: 'bg-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-700 dark:text-teal-300',
    ring: 'ring-teal-200 dark:ring-teal-900',
  },
  ignorado: {
    dot: 'bg-stone-400',
    bg: 'bg-stone-100/60 dark:bg-stone-800/40',
    text: 'text-stone-500 dark:text-stone-500',
    ring: 'ring-stone-200 dark:ring-stone-700',
  },
  em_lote: {
    dot: 'bg-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    ring: 'ring-indigo-200 dark:ring-indigo-900',
  },
  rascunho: {
    dot: 'bg-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    text: 'text-slate-700 dark:text-slate-300',
    ring: 'ring-slate-200 dark:ring-slate-700',
  },
  validado: {
    dot: 'bg-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-700 dark:text-sky-300',
    ring: 'ring-sky-200 dark:ring-sky-900',
  },
  em_transmissao: {
    dot: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-800 dark:text-amber-300',
    ring: 'ring-amber-200 dark:ring-amber-900',
    pulse: true,
  },
  aceito: {
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    ring: 'ring-emerald-200 dark:ring-emerald-900',
  },
  rejeitado: {
    dot: 'bg-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    ring: 'ring-rose-200 dark:ring-rose-900',
  },
  retificado: {
    dot: 'bg-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-700 dark:text-violet-300',
    ring: 'ring-violet-200 dark:ring-violet-900',
  },
  excluido: {
    dot: 'bg-stone-400',
    bg: 'bg-stone-100 dark:bg-stone-800/60',
    text: 'text-stone-600 dark:text-stone-400 line-through',
    ring: 'ring-stone-200 dark:ring-stone-700',
  },
}

interface Props {
  status: StatusEvento
  label: string
}

export function StatusBadge({ status, label }: Props) {
  const t = TONE[status]
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium tabular-nums
        ${t.bg} ${t.text} ring-1 ${t.ring}
      `}
    >
      <span className="relative inline-flex w-1.5 h-1.5">
        {t.pulse && (
          <span
            className={`absolute inset-0 rounded-full ${t.dot} opacity-60 animate-ping`}
            aria-hidden="true"
          />
        )}
        <span className={`relative inline-flex w-1.5 h-1.5 rounded-full ${t.dot}`} />
      </span>
      {label}
    </span>
  )
}
