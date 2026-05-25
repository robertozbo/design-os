import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, X } from 'lucide-react'
import type { Alimento } from '@/../product/sections/alimentos/types'

interface DeleteConfirmModalProps {
  alimento: Alimento | null
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmModal({ alimento, onClose, onConfirm }: DeleteConfirmModalProps) {
  useEffect(() => {
    if (!alimento) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKey)
    }
  }, [alimento, onClose])

  if (!alimento) return null
  if (typeof document === 'undefined') return null

  const linked = alimento.linkedPlansCount > 0

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <ModalStyles />

      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-black/70"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        style={{ animation: 'nymos-modal-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        className="
          relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl
          dark:border-slate-800 dark:bg-slate-950
        "
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
              <AlertTriangle size={18} />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Excluir customizado
              </p>
              <h2 className="mt-0.5 text-base font-semibold text-slate-900 dark:text-slate-50">
                Tem certeza?
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </header>

        <div className="space-y-3 px-6 py-5">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Você está prestes a excluir{' '}
            <strong className="text-slate-900 dark:text-slate-100">"{alimento.name}"</strong>. Esta ação não pode ser desfeita.
          </p>

          {linked && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/60 dark:bg-amber-900/20">
              <p className="flex items-start gap-2 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  Este alimento está em <strong>{alimento.linkedPlansCount} plano{alimento.linkedPlansCount === 1 ? '' : 's'} alimentar
                  {alimento.linkedPlansCount === 1 ? '' : 'es'}</strong> ativo{alimento.linkedPlansCount === 1 ? '' : 's'}. As referências serão substituídas por "Alimento removido" e os macros desses planos não serão recalculados automaticamente.
                </span>
              </p>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="
              rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all
              hover:bg-rose-700 active:scale-[0.98]
            "
          >
            Excluir definitivamente
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  )
}

function ModalStyles() {
  return (
    <style>{`
      @keyframes nymos-modal-in {
        from { opacity: 0; transform: scale(0.96) translateY(6px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }
    `}</style>
  )
}
