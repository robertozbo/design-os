import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface DayPickerProps {
  label: string // "Hoje · 04 mai", "Ontem · 03/05"
  onPrev?: () => void
  onNext?: () => void
}

export function DayPicker({ label, onPrev, onNext }: DayPickerProps) {
  return (
    <div className="px-4 mb-3 flex items-center justify-center gap-2">
      <button
        onClick={onPrev}
        className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:text-white"
        aria-label="Dia anterior"
      >
        <ChevronLeft size={16} strokeWidth={2.4} />
      </button>
      <button className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-800/70 text-slate-100 text-[13px] font-medium hover:bg-slate-800">
        <Calendar size={12} strokeWidth={2.4} className="text-slate-400" />
        <span>{label}</span>
      </button>
      <button
        onClick={onNext}
        className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:text-white"
        aria-label="Próximo dia"
      >
        <ChevronRight size={16} strokeWidth={2.4} />
      </button>
    </div>
  )
}
