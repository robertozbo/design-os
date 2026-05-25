import type {
  AgregadoRelatorios,
  FiltroStatus,
} from '@/../product/sections/relat-rios-de-conformidade/types'

interface StatusTabsProps {
  ativo: FiltroStatus
  agregado: AgregadoRelatorios
  onChange?: (status: FiltroStatus) => void
}

interface TabSpec {
  value: FiltroStatus
  label: string
  count: number
}

export function StatusTabs({ ativo, agregado, onChange }: StatusTabsProps) {
  const total = agregado.totalGerados + agregado.totalEnviadosMte + agregado.totalArquivados
  const tabs: TabSpec[] = [
    { value: 'todos', label: 'Todos', count: total },
    { value: 'gerado', label: 'Gerados', count: agregado.totalGerados },
    { value: 'enviado_mte', label: 'Enviados ao MTE', count: agregado.totalEnviadosMte },
    { value: 'arquivado', label: 'Arquivados', count: agregado.totalArquivados },
  ]

  return (
    <div
      role="tablist"
      aria-label="Filtrar por status"
      className="
        inline-flex p-1 rounded-xl
        bg-slate-100/80 dark:bg-slate-900/60
        ring-1 ring-slate-200/60 dark:ring-slate-800
        flex-wrap
      "
    >
      {tabs.map((tab) => {
        const isActive = ativo === tab.value
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(tab.value)}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
              text-sm font-medium transition-all duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
              ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }
            `}
          >
            <span>{tab.label}</span>
            <span
              className={`
                inline-flex items-center justify-center min-w-[22px] px-1.5
                rounded-md text-[10px] font-mono tabular-nums
                ${
                  isActive
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }
              `}
            >
              {tab.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
