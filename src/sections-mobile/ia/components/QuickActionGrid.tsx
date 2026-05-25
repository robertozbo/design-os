import type { QuickActionUI } from '@/../product-mobile/sections/ia/types'
import { getIcon, bgFromCor, textFromCor, borderHoverFromCor } from './_shared'

interface QuickActionGridProps {
  actions: QuickActionUI[]
  onClick?: (action: QuickActionUI) => void
}

export function QuickActionGrid({ actions, onClick }: QuickActionGridProps) {
  return (
    <div className="px-4 mb-5">
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((a) => {
          const Icon = getIcon(a.iconeNome)
          const iconBg = bgFromCor(a.cor)
          const iconText = textFromCor(a.cor)
          const borderHover = borderHoverFromCor(a.cor)
          return (
            <button
              key={a.option.type}
              onClick={() => onClick?.(a)}
              className={`rounded-2xl bg-slate-900 border border-slate-800 ${borderHover} p-3 flex items-center gap-3 text-left active:scale-[0.97] transition-all`}
            >
              <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center ${iconText} shrink-0`}>
                <Icon size={16} strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-slate-100 font-semibold text-[12px] leading-tight truncate">
                  {a.option.label}
                </div>
                <div className="text-slate-500 text-[10px] mt-0.5 leading-tight truncate">{a.resumo}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
