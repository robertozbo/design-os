import { Activity, Plus, Watch } from 'lucide-react'

interface EmptyStateProps {
  type?: 'no-activities' | 'no-results'
  onRegistrar?: () => void
  onConectarDispositivo?: () => void
}

export function EmptyState({ type = 'no-activities', onRegistrar, onConectarDispositivo }: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <div className="px-6 py-12 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-600 mb-3">
          <Activity size={20} strokeWidth={1.8} />
        </div>
        <p className="text-slate-400 text-[13px]">Nenhuma atividade no período</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-10 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-3xl bg-slate-800/40 flex items-center justify-center text-slate-600 mb-5">
        <Activity size={36} strokeWidth={1.5} />
      </div>
      <h3 className="text-slate-100 font-semibold text-[18px] mb-2">
        Nenhuma atividade ainda
      </h3>
      <p className="text-slate-400 text-[13.5px] leading-snug max-w-[280px] mb-5">
        Registre uma atividade manualmente ou conecte um wearable pra detecção automática.
      </p>
      <button
        onClick={onRegistrar}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-medium text-[14px] shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-transform mb-3"
      >
        <Plus size={16} strokeWidth={2.4} />
        Registrar primeira
      </button>
      <button
        onClick={onConectarDispositivo}
        className="inline-flex items-center gap-1 text-cyan-300 text-[12.5px] font-medium hover:text-cyan-200"
      >
        <Watch size={13} strokeWidth={2.2} />
        Conectar wearable
      </button>
    </div>
  )
}
