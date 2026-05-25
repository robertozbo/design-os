import { ArrowRight, ChevronRight, FileText, Stethoscope, X } from 'lucide-react'
import type { RegistroReceita, TipoReceita } from '@/../product-mobile/sections/medicacao/types'

interface Props {
  receita: RegistroReceita | null
  onClose: () => void
  onAbrirMemed?: (memedId: string) => void
}

const TIPO_LABEL: Record<TipoReceita, string> = {
  inicio: 'Início de tratamento',
  ajuste: 'Ajuste de dose',
  renovacao: 'Renovação',
  descontinuacao: 'Descontinuação',
}

const TIPO_COR: Record<TipoReceita, string> = {
  inicio: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  ajuste: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  renovacao: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  descontinuacao: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
}

export function ReceitaDetalheDrawer({ receita, onClose, onAbrirMemed }: Props) {
  if (!receita) return null

  return (
    <>
      {/* Backdrop */}
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-0 right-0 bottom-0 z-50 rounded-t-3xl bg-slate-900 border-t border-slate-800 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom"
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <span className="w-10 h-1 rounded-full bg-slate-700" />
        </div>

        {/* Header */}
        <div className="px-5 pb-4 border-b border-slate-800 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-teal-300" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${TIPO_COR[receita.tipo]}`}
              >
                {TIPO_LABEL[receita.tipo]}
              </span>
              <span className="text-slate-500 font-mono text-[11px] tabular-nums">
                {receita.data}
              </span>
            </div>
            <h3 className="text-slate-50 text-[16px] font-semibold leading-tight">
              {receita.titulo}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-slate-400 text-[12px]">
              <Stethoscope size={12} strokeWidth={2} />
              {receita.medicoNome}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-md text-slate-500 hover:bg-slate-800 hover:text-slate-300"
            aria-label="Fechar"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="px-5 py-4 space-y-4">
          {receita.motivo && (
            <section>
              <div className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold mb-1.5">
                Motivo
              </div>
              <p className="text-slate-100 text-[13px] leading-relaxed">{receita.motivo}</p>
            </section>
          )}

          {(receita.posologiaAnterior || receita.posologiaNova) && (
            <section>
              <div className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold mb-1.5">
                {receita.posologiaAnterior ? 'Mudança de posologia' : 'Posologia prescrita'}
              </div>
              {receita.posologiaAnterior && receita.posologiaNova ? (
                <div className="rounded-2xl bg-slate-800/60 border border-slate-800 p-3 space-y-2">
                  <div className="text-slate-400 text-[12.5px]">
                    <span className="line-through opacity-70">{receita.posologiaAnterior}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight size={12} className="text-teal-300" strokeWidth={2.4} />
                    <span className="text-slate-50 text-[13px] font-medium">
                      {receita.posologiaNova}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-100 text-[13px]">{receita.posologiaNova}</p>
              )}
            </section>
          )}

          {receita.memedId && (
            <button
              onClick={() => onAbrirMemed?.(receita.memedId!)}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-teal-500 text-white font-semibold text-[13.5px] active:scale-[0.99] transition"
            >
              <span className="flex items-center gap-2">
                <FileText size={14} strokeWidth={2.4} />
                Ver receita Memed
              </span>
              <ChevronRight size={16} strokeWidth={2.4} />
            </button>
          )}
        </div>
      </div>
    </>
  )
}
