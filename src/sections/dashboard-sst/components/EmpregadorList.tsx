import type { EmpregadorResumo } from '@/../product/sections/dashboard-sst/types'
import { Building2 } from 'lucide-react'
import { EmpregadorCard } from './EmpregadorCard'

interface EmpregadorListProps {
  empregadores: EmpregadorResumo[]
  onAbrirEmpregador?: (empregadorId: string) => void
  onNovoEmpregador?: () => void
}

export function EmpregadorList({ empregadores, onAbrirEmpregador, onNovoEmpregador }: EmpregadorListProps) {
  if (empregadores.length === 0) {
    return <EmptyState onNovoEmpregador={onNovoEmpregador} />
  }
  return (
    <div className="space-y-3">
      {empregadores.map((emp, idx) => (
        <EmpregadorCard
          key={emp.id}
          empregador={emp}
          revealIndex={idx + 8}
          onAbrir={() => onAbrirEmpregador?.(emp.id)}
        />
      ))}
    </div>
  )
}

function EmptyState({ onNovoEmpregador }: { onNovoEmpregador?: () => void }) {
  return (
    <div className="
      nymos-reveal opacity-0
      rounded-2xl border border-dashed border-slate-300 dark:border-slate-700
      bg-white/40 dark:bg-slate-900/30
      px-8 py-14
      flex flex-col items-center text-center
    ">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Building2 className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        Nenhum empregador na carteira
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        Adicione o primeiro empregador para começar a montar a carteira NR-1 e iniciar avaliações psicossociais.
      </p>
      <button
        type="button"
        onClick={onNovoEmpregador}
        className="
          mt-5 inline-flex items-center gap-2
          px-3.5 py-2 rounded-xl
          bg-slate-900 hover:bg-slate-800
          dark:bg-slate-100 dark:hover:bg-slate-200
          text-white dark:text-slate-900
          font-medium text-sm
          transition-colors duration-150
        "
      >
        Adicionar empregador
      </button>
    </div>
  )
}
