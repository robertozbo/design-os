import type { AtalhoRapido } from '@/../product/sections/dashboard-sst/types'
import { ClipboardPlus, ListChecks, FileSignature, ArrowUpRight, type LucideIcon } from 'lucide-react'

interface AtalhosRapidosProps {
  atalhos: AtalhoRapido[]
  onAtalhoRapido?: (atalhoId: string) => void
}

const ICON_MAP: Record<string, LucideIcon> = {
  ClipboardPlus,
  ListChecks,
  FileSignature,
}

export function AtalhosRapidos({ atalhos, onAtalhoRapido }: AtalhosRapidosProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {atalhos.map((atalho, idx) => {
        const Icon = ICON_MAP[atalho.icone] ?? ClipboardPlus
        return (
          <button
            key={atalho.id}
            type="button"
            onClick={() => onAtalhoRapido?.(atalho.id)}
            style={{ animationDelay: `${360 + 60 * idx}ms` }}
            className="
              nymos-reveal opacity-0 group text-left
              rounded-2xl p-4
              bg-white dark:bg-slate-900/60
              text-slate-900 dark:text-slate-100
              border border-slate-200 dark:border-slate-800
              hover:border-teal-300 dark:hover:border-teal-800
              hover:shadow-[0_18px_36px_-20px_rgba(13,148,136,0.35)]
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
            "
          >
            <div className="flex items-start justify-between gap-3">
              <div className="
                w-9 h-9 rounded-xl flex items-center justify-center
                bg-teal-50 dark:bg-teal-950/50
                ring-1 ring-teal-200 dark:ring-teal-900/60
              ">
                <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={1.75} />
              </div>
              <ArrowUpRight
                className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200"
                strokeWidth={1.75}
              />
            </div>
            <div className="mt-3.5">
              <div className="text-sm font-semibold tracking-tight">{atalho.titulo}</div>
              <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {atalho.descricao}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
