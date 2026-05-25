import type { FilaAtual } from '@/../product/sections/eventos-esocial/types'
import { Radio, AlertTriangle, ChevronRight } from 'lucide-react'

interface Props {
  fila: FilaAtual
  onAbrirFila?: () => void
}

export function FilaBanner({ fila, onAbrirFila }: Props) {
  if (fila.totalEnfileirados === 0 && fila.comFalha === 0) {
    return null
  }

  const hasFalha = fila.comFalha > 0

  return (
    <button
      type="button"
      onClick={onAbrirFila}
      className={`
        nymos-reveal opacity-0 group
        w-full rounded-2xl border px-4 py-3
        flex items-center gap-3 text-left
        transition-all duration-300
        ${
          hasFalha
            ? 'border-rose-200/70 dark:border-rose-900/60 bg-gradient-to-r from-rose-50/60 via-white to-amber-50/40 dark:from-rose-950/30 dark:via-slate-950 dark:to-amber-950/20 hover:border-rose-300 dark:hover:border-rose-800'
            : 'border-amber-200/70 dark:border-amber-900/60 bg-gradient-to-r from-amber-50/70 via-white to-emerald-50/30 dark:from-amber-950/30 dark:via-slate-950 dark:to-emerald-950/10 hover:border-amber-300 dark:hover:border-amber-800'
        }
      `}
    >
      <span
        className={`
          relative shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl
          ${hasFalha ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'}
        `}
      >
        {hasFalha ? (
          <AlertTriangle className="w-4 h-4" strokeWidth={2} />
        ) : (
          <>
            <span className="absolute inset-0 rounded-xl bg-amber-400/30 dark:bg-amber-500/30 animate-ping" />
            <Radio className="relative w-4 h-4" strokeWidth={2} />
          </>
        )}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Fila de transmissão
          </span>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            atualizado · {formatHora(fila.ultimaAtualizacao)}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-[12px] flex-wrap">
          <span className="text-slate-700 dark:text-slate-300">
            <span className="tabular-nums font-semibold">{fila.totalEnfileirados}</span> enfileirados
          </span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
            <span className="tabular-nums font-semibold">{fila.transmitindo}</span> transmitindo
          </span>
          {hasFalha && (
            <>
              <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
                <span className="tabular-nums font-semibold">{fila.comFalha}</span> com falha
              </span>
            </>
          )}
        </div>
      </div>

      <span className="shrink-0 inline-flex items-center gap-1 text-[12px] font-medium text-slate-700 dark:text-slate-300 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition">
        Ver fila
        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
      </span>
    </button>
  )
}

function formatHora(iso: string): string {
  try {
    const d = new Date(iso)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  } catch {
    return '—'
  }
}
