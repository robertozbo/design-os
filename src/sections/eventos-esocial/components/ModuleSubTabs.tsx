import type { SubTelaModulo } from '@/../product/sections/eventos-esocial/types'
import { Inbox, Package, BarChart3, AlertOctagon } from 'lucide-react'

interface Props {
  ativa: SubTelaModulo
  contadores?: {
    eventos?: number
    lotes?: number
    erros?: number
  }
  onChange?: (tela: SubTelaModulo) => void
}

const TABS: { value: SubTelaModulo; label: string; icon: typeof Inbox; v2?: boolean }[] = [
  { value: 'eventos', label: 'Eventos', icon: Inbox },
  { value: 'lotes', label: 'Lotes', icon: Package },
  { value: 'relatorios', label: 'Relatórios', icon: BarChart3, v2: true },
  { value: 'erros', label: 'Erros', icon: AlertOctagon, v2: true },
]

export function ModuleSubTabs({ ativa, contadores, onChange }: Props) {
  return (
    <nav
      role="tablist"
      aria-label="Gestão eSocial"
      className="nymos-reveal opacity-0 flex items-center gap-0.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 ring-1 ring-slate-200/60 dark:ring-slate-800 p-1"
    >
      {TABS.map((tab) => {
        const active = tab.value === ativa
        const counter =
          tab.value === 'eventos'
            ? contadores?.eventos
            : tab.value === 'lotes'
              ? contadores?.lotes
              : tab.value === 'erros'
                ? contadores?.erros
                : undefined

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(tab.value)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition
              ${
                active
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }
            `}
          >
            <tab.icon className="w-3.5 h-3.5" strokeWidth={1.75} />
            {tab.label}
            {tab.v2 && (
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-600 ml-0.5">
                v2
              </span>
            )}
            {counter !== undefined && counter > 0 && (
              <span
                className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold tabular-nums ${
                  active
                    ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {counter}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
