import { Filter, Heart, Inbox, Mail, Sparkles, type LucideIcon } from 'lucide-react'
import type { ReferralTab } from '@/../product/sections/encaminhamento-cl-nico/types'

interface EmptyStateProps {
  tab: ReferralTab
  filtered: boolean
  onClearFilters?: () => void
}

const TAB_EMPTY: Record<ReferralTab, { icon: LucideIcon; title: string; description: string; tone: 'positive' | 'neutral' }> = {
  sugestoes: {
    icon: Sparkles,
    title: 'Nenhum sinal de risco individual no momento',
    description: 'Os instrumentos psicométricos não geraram sugestões pendentes. Tudo segue acompanhado.',
    tone: 'positive',
  },
  aguardando: {
    icon: Mail,
    title: 'Nenhum convite pendente',
    description: 'Quando enviar um convite a partir das Sugestões, ele aparecerá aqui aguardando o aceite do trabalhador.',
    tone: 'neutral',
  },
  em_atendimento: {
    icon: Heart,
    title: 'Nenhum atendimento ativo',
    description: 'Casos com aceite e atendimento clínico em andamento aparecerão nesta tab.',
    tone: 'neutral',
  },
  concluidos: {
    icon: Inbox,
    title: 'Nenhum atendimento concluído ainda',
    description: 'Casos finalizados, recusados ou cancelados aparecerão aqui com a timeline completa.',
    tone: 'neutral',
  },
}

export function EmptyState({ tab, filtered, onClearFilters }: EmptyStateProps) {
  if (filtered) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 px-6 py-14 text-center">
        <div className="
          mx-auto w-12 h-12 rounded-2xl
          bg-violet-50 dark:bg-violet-950/40
          ring-1 ring-violet-200 dark:ring-violet-900/60
          flex items-center justify-center
        ">
          <Filter className="w-5 h-5 text-violet-600 dark:text-violet-400" strokeWidth={1.5} />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
          Nenhum caso corresponde aos filtros
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Ajuste os filtros aplicados ou limpe-os para ver mais casos.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="
              mt-4 inline-flex items-center gap-1.5
              px-3 py-1.5 rounded-lg
              text-xs font-medium
              bg-white dark:bg-slate-900
              ring-1 ring-slate-200 dark:ring-slate-700
              hover:ring-teal-400 dark:hover:ring-teal-500
              hover:text-teal-700 dark:hover:text-teal-300
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
            "
          >
            Limpar filtros
          </button>
        )}
      </div>
    )
  }

  const cfg = TAB_EMPTY[tab]
  const Icon = cfg.icon
  const positive = cfg.tone === 'positive'

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
      <div
        aria-hidden="true"
        className={`
          absolute inset-x-0 top-0 h-32 bg-gradient-to-b
          ${positive
            ? 'from-teal-100/60 dark:from-teal-950/40'
            : 'from-slate-100 dark:from-slate-800/40'}
          to-transparent
        `}
      />
      <div className="relative flex flex-col items-center text-center px-6 py-14">
        <div className={`
          w-14 h-14 rounded-2xl
          flex items-center justify-center
          ring-1
          ${positive
            ? 'bg-teal-50 dark:bg-teal-950/40 ring-teal-200 dark:ring-teal-900/60'
            : 'bg-slate-100 dark:bg-slate-800 ring-slate-200 dark:ring-slate-700'}
        `}>
          <Icon className={`w-6 h-6 ${positive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`} strokeWidth={1.5} />
        </div>
        <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-50">
          {cfg.title}
        </h3>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
          {cfg.description}
        </p>
      </div>
    </div>
  )
}
