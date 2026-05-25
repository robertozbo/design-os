import { User, Stethoscope, Activity, FileSearch, NotebookText, FlaskConical, Pill, FileDown } from 'lucide-react'
import type { SecaoId } from '@/../product-clinico/sections/prontuario/types'

interface NavItem {
  id: SecaoId
  label: string
  Icon: typeof User
  count?: number
}

interface Props {
  ativa: SecaoId
  counts?: Partial<Record<SecaoId, number>>
  onNavegar?: (id: SecaoId) => void
  onExportarPDF?: () => void
}

export function ProntuarioSidebar({
  ativa,
  counts = {},
  onNavegar,
  onExportarPDF,
}: Props) {
  const items: NavItem[] = [
    { id: 'identificacao', label: 'Identificação', Icon: User },
    { id: 'anamnese', label: 'Anamnese', Icon: Stethoscope },
    { id: 'exame-fisico', label: 'Exame físico', Icon: Activity },
    { id: 'hipoteses-plano', label: 'Hipóteses & Plano', Icon: FileSearch },
    { id: 'evolucoes', label: 'Evoluções', Icon: NotebookText, count: counts['evolucoes'] },
    { id: 'exames', label: 'Exames', Icon: FlaskConical, count: counts['exames'] },
    { id: 'prescricoes', label: 'Prescrições', Icon: Pill, count: counts['prescricoes'] },
  ]

  return (
    <aside className="flex flex-col gap-3">
      {/* Nav */}
      <nav
        className="
          flex flex-col gap-0.5 rounded-xl border border-slate-200/80 bg-white p-1.5
          dark:border-slate-800 dark:bg-slate-900
        "
        aria-label="Seções do prontuário"
      >
        {items.map(({ id, label, Icon, count }) => {
          const ativo = ativa === id
          return (
            <button
              key={id}
              onClick={() => onNavegar?.(id)}
              className={`
                inline-flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors
                ${
                  ativo
                    ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }
              `}
            >
              <span className="flex items-center gap-2">
                <Icon className={`size-4 ${ativo ? '' : 'opacity-70'}`} />
                {label}
              </span>
              {count !== undefined && count > 0 && (
                <span
                  className={`
                    rounded-full px-1.5 py-0 text-[10px] font-mono tabular-nums
                    ${
                      ativo
                        ? 'bg-teal-200/60 text-teal-900 dark:bg-teal-900/60 dark:text-teal-200'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }
                  `}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Export PDF */}
      <button
        onClick={onExportarPDF}
        className="
          inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm
          transition-all hover:border-teal-300 hover:bg-teal-50/40 hover:text-teal-800
          dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-700 dark:hover:bg-teal-950/30 dark:hover:text-teal-200
        "
      >
        <FileDown className="size-4" />
        Exportar PDF
      </button>

      <p className="text-center text-[10px] text-slate-400 dark:text-slate-500">
        Atalhos: 1–7 navegam seções
      </p>
    </aside>
  )
}
