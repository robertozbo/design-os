import { Microscope } from 'lucide-react'

interface InstrumentBadgeProps {
  nome: string
  compact?: boolean
}

export function InstrumentBadge({ nome, compact = false }: InstrumentBadgeProps) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 font-mono">
        <Microscope className="w-3 h-3" strokeWidth={1.75} />
        {nome.replace(' (versão curta)', '')}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100/80 dark:bg-slate-800/60 ring-1 ring-slate-200 dark:ring-slate-700 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300">
      <Microscope className="w-3 h-3 text-slate-500" strokeWidth={1.75} />
      {nome}
    </span>
  )
}
