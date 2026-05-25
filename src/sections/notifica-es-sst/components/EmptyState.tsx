import { Archive, Bell, Filter, type LucideIcon } from 'lucide-react'

type EmptyVariant = 'inbox-clear' | 'archived-empty' | 'filtered-empty'

interface EmptyStateProps {
  variant: EmptyVariant
  onAction?: () => void
  actionLabel?: string
}

const VARIANT: Record<EmptyVariant, {
  icon: LucideIcon
  title: string
  description: string
  iconBg: string
  iconText: string
  decorTone: string
}> = {
  'inbox-clear': {
    icon: Bell,
    title: 'Tudo em dia na carteira',
    description: 'Nenhuma notificação pendente — você revisou todos os alertas operacionais da carteira NR-1.',
    iconBg: 'bg-teal-50 dark:bg-teal-950/40',
    iconText: 'text-teal-600 dark:text-teal-400',
    decorTone: 'from-teal-100 dark:from-teal-950/40',
  },
  'archived-empty': {
    icon: Archive,
    title: 'Nenhuma notificação arquivada',
    description: 'Quando você arquivar notificações tratadas, elas aparecem aqui.',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconText: 'text-slate-500 dark:text-slate-400',
    decorTone: 'from-slate-100 dark:from-slate-800/60',
  },
  'filtered-empty': {
    icon: Filter,
    title: 'Nenhuma notificação corresponde aos filtros',
    description: 'Ajuste os filtros aplicados ou limpe-os para ver mais resultados.',
    iconBg: 'bg-violet-50 dark:bg-violet-950/40',
    iconText: 'text-violet-600 dark:text-violet-400',
    decorTone: 'from-violet-100 dark:from-violet-950/40',
  },
}

export function EmptyState({ variant, onAction, actionLabel }: EmptyStateProps) {
  const config = VARIANT[variant]
  const Icon = config.icon

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
      <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${config.decorTone} to-transparent opacity-60`} aria-hidden="true" />
      <div className="relative flex flex-col items-center text-center px-6 py-14 sm:py-16">
        <div className={`
          w-14 h-14 rounded-2xl
          flex items-center justify-center
          ring-1 ring-slate-200 dark:ring-slate-700
          ${config.iconBg}
        `}>
          <Icon className={`w-6 h-6 ${config.iconText}`} strokeWidth={1.5} />
        </div>
        <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-50">
          {config.title}
        </h3>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
          {config.description}
        </p>
        {onAction && actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="
              mt-5 inline-flex items-center gap-1.5
              px-3.5 py-2 rounded-lg
              text-xs font-medium
              text-slate-700 dark:text-slate-200
              bg-white dark:bg-slate-900
              ring-1 ring-slate-200 dark:ring-slate-700
              hover:ring-teal-400 dark:hover:ring-teal-500
              hover:text-teal-700 dark:hover:text-teal-300
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
            "
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
