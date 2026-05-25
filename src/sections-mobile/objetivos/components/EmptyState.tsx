import { Target, Plus } from 'lucide-react'

interface EmptyStateProps {
  type?: 'no-goals' | 'no-results'
  onCriar?: () => void
}

export function EmptyState({ type = 'no-goals', onCriar }: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <div className="px-6 py-12 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-600 mb-3">
          <Target size={20} strokeWidth={1.8} />
        </div>
        <p className="text-slate-400 text-[13px]">Nenhum objetivo nesse status</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-10 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-3xl bg-slate-800/40 flex items-center justify-center text-slate-600 mb-5">
        <Target size={36} strokeWidth={1.5} />
      </div>
      <h3 className="text-slate-100 font-semibold text-[18px] mb-2">
        Defina sua primeira meta
      </h3>
      <p className="text-slate-400 text-[13.5px] leading-snug max-w-[280px] mb-6">
        Onde você quer chegar? Peso, sono, passos, gordura corporal — você define, a gente acompanha.
      </p>
      <button
        onClick={onCriar}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-medium text-[14px] shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-transform"
      >
        <Plus size={16} strokeWidth={2.4} />
        Criar meta
      </button>
    </div>
  )
}
