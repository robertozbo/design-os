import { useState } from 'react'
import type { Instrumento } from '@/../product/sections/cat-logos/types'
import { X, Lock, BookCheck } from 'lucide-react'

interface InstrumentoPreviewDrawerProps {
  open: boolean
  instrumento: Instrumento | null
  onClose?: () => void
}

export function InstrumentoPreviewDrawer({
  open,
  instrumento,
  onClose,
}: InstrumentoPreviewDrawerProps) {
  const [activeFatorId, setActiveFatorId] = useState<string | null>(
    instrumento?.previewFatores[0]?.id ?? null,
  )

  if (!open || !instrumento) return null

  const activeFator =
    instrumento.previewFatores.find((f) => f.id === activeFatorId) ??
    instrumento.previewFatores[0]

  return (
    <div
      className="fixed inset-0 z-40"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview de ${instrumento.nome}`}
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-[2px] drawer-fade"
      />
      <div
        className="
          drawer-slide
          absolute right-0 top-0 bottom-0
          w-full sm:max-w-[640px]
          bg-white dark:bg-slate-950
          ring-1 ring-slate-200/80 dark:ring-slate-800
          shadow-[-12px_0_40px_-20px_rgba(15,23,42,0.25)]
          flex flex-col
        "
      >
        <header className="px-6 py-5 border-b border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                Preview do instrumento
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700">
                <Lock className="w-3 h-3" strokeWidth={2} />
                Imutável
              </span>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className="
                  inline-flex items-center justify-center px-2.5 py-1 rounded-lg
                  bg-teal-50 dark:bg-teal-950/40
                  ring-1 ring-teal-200/60 dark:ring-teal-900/60
                  font-mono font-semibold tracking-wider
                  text-teal-700 dark:text-teal-300
                  text-[13px]
                "
              >
                {instrumento.sigla}
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {instrumento.nome}
              </h2>
            </div>
            <p className="mt-2 text-[12px] text-slate-500 dark:text-slate-400 leading-snug">
              {instrumento.validacao}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-500">
              <BookCheck className="w-3 h-3 text-emerald-600" strokeWidth={2} />
              <span className="font-mono">{instrumento.origem}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="
              shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg
              text-slate-500 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition
            "
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </header>

        <div className="px-6 pt-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex gap-1 overflow-x-auto scrollbar-thin">
            {instrumento.previewFatores.map((f) => {
              const active = activeFator?.id === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFatorId(f.id)}
                  className={`
                    px-3 py-2 rounded-t-lg text-[12px] font-medium whitespace-nowrap
                    border-b-2 transition
                    ${
                      active
                        ? 'border-teal-500 text-teal-700 dark:text-teal-300'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }
                  `}
                >
                  {f.nome}
                  <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-mono tabular-nums bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {f.perguntas.length}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeFator && (
            <ol className="space-y-2">
              {activeFator.perguntas.map((p, idx) => (
                <li
                  key={idx}
                  className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-4 py-3 flex items-start gap-3"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[13px] text-slate-800 dark:text-slate-200 leading-relaxed">
                    {p}
                  </p>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-5 px-4 py-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/50 ring-1 ring-slate-200/50 dark:ring-slate-800 text-[11px] text-slate-600 dark:text-slate-400 inline-flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 mt-px text-slate-500 shrink-0" strokeWidth={1.75} />
            <span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Perguntas imutáveis
              </span>{' '}
              · Modificar perguntas comprometeria a validade científica do instrumento e a
              comparabilidade com a literatura.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
