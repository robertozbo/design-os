import { useEffect } from 'react'
import { ArrowRight, ChevronRight, FileText, Stethoscope, X } from 'lucide-react'
import type { RegistroReceita, TipoReceita } from '@/../product/sections/medication/types'

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

const TIPO_BADGE: Record<TipoReceita, string> = {
  inicio:
    'bg-teal-50 text-teal-700 ring-1 ring-teal-200 dark:bg-teal-500/15 dark:text-teal-300 dark:ring-teal-500/30',
  ajuste:
    'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30',
  renovacao:
    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
  descontinuacao:
    'bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30',
}

export function PrescriptionDrawer({ receita, onClose, onAbrirMemed }: Props) {
  const open = !!receita

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!receita) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Receita — ${receita.titulo}`}
        className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900 md:max-w-2xl"
      >
        {/* Header */}
        <header className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-5 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <FileText
                  className="h-5 w-5 text-teal-600 dark:text-teal-300"
                  strokeWidth={2}
                />
              </div>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${TIPO_BADGE[receita.tipo]}`}
                  >
                    {TIPO_LABEL[receita.tipo]}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                    {receita.data}
                  </span>
                </div>
                <h2 className="text-[18px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
                  {receita.titulo}
                </h2>
                <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-slate-500 dark:text-slate-400">
                  <Stethoscope size={13} strokeWidth={2} />
                  {receita.medicoNome}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Fechar"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {receita.motivo && (
            <section>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                Motivo
              </div>
              <p className="text-[14px] leading-relaxed text-slate-700 dark:text-slate-200">
                {receita.motivo}
              </p>
            </section>
          )}

          {(receita.posologiaAnterior || receita.posologiaNova) && (
            <section>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                {receita.posologiaAnterior
                  ? 'Mudança de posologia'
                  : 'Posologia prescrita'}
              </div>
              {receita.posologiaAnterior && receita.posologiaNova ? (
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                  <div className="text-[13px] text-slate-500 line-through dark:text-slate-500">
                    {receita.posologiaAnterior}
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight
                      size={13}
                      strokeWidth={2.4}
                      className="text-teal-600 dark:text-teal-300"
                    />
                    <span className="text-[14px] font-medium text-slate-900 dark:text-slate-50">
                      {receita.posologiaNova}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[14px] text-slate-700 dark:text-slate-200">
                  {receita.posologiaNova}
                </p>
              )}
            </section>
          )}
        </div>

        {/* Footer fixo */}
        {receita.memedId && (
          <footer className="border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => onAbrirMemed?.(receita.memedId!)}
              className="flex w-full items-center justify-between gap-2 rounded-xl bg-teal-600 px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
            >
              <span className="flex items-center gap-2">
                <FileText size={15} strokeWidth={2.4} />
                Ver receita Memed
              </span>
              <ChevronRight size={16} strokeWidth={2.4} />
            </button>
          </footer>
        )}
      </aside>
    </div>
  )
}
