import type { QuickAction } from '@/../product-mobile/sections/inicio/types'
import { getIcon } from './_shared'

interface QuickActionsProps {
  actions: QuickAction[]
  onActionClick?: (action: QuickAction) => void
}

export function QuickActions({ actions, onActionClick }: QuickActionsProps) {
  return (
    <div className="px-4 mt-2 mb-6">
      <div className="grid grid-cols-3 gap-3">
        {actions.map((a) => {
          const Icon = getIcon(a.iconeNome)
          return (
            <button
              key={a.id}
              onClick={() => onActionClick?.(a)}
              className="aspect-[1/1.1] rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center gap-2 active:scale-[0.97] transition-transform hover:bg-slate-800/60"
            >
              <Icon size={28} strokeWidth={2.2} className="text-teal-400" />
              <span className="text-slate-300 text-[12.5px] font-medium">{a.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
