import { Mic, MicOff, Pause, Play } from 'lucide-react'
import type { GravacaoStatus } from '@/../product-clinico/sections/consulta/types'
import { formatTempoDecorrido } from './helpers'

interface Props {
  status: GravacaoStatus
  tempoDecorridoSeg: number
  onIniciar?: () => void
  onPausar?: () => void
  onRetomar?: () => void
  onEncerrar?: () => void
}

export function RecordingIndicator({
  status,
  tempoDecorridoSeg,
  onIniciar,
  onPausar,
  onRetomar,
  onEncerrar,
}: Props) {
  const isGravando = status === 'gravando'
  const isPausado = status === 'pausado'
  const isAtivo = isGravando || isPausado

  return (
    <div className="flex items-center gap-3">
      {/* Status pill */}
      <div
        className={`
          relative inline-flex items-center gap-2 rounded-full
          border px-3 py-1.5 text-xs font-medium tracking-tight
          transition-colors
          ${
            isGravando
              ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300'
              : isPausado
              ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300'
              : status === 'preparando'
              ? 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
          }
        `}
        aria-live="polite"
      >
        {isGravando ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
            </span>
            Gravando
          </>
        ) : isPausado ? (
          <>
            <Pause className="size-3.5" />
            Pausado
          </>
        ) : status === 'preparando' ? (
          <>
            <Mic className="size-3.5 animate-pulse" />
            Preparando…
          </>
        ) : status === 'encerrado' ? (
          <>
            <MicOff className="size-3.5" />
            Encerrado
          </>
        ) : (
          <>
            <Mic className="size-3.5" />
            Pronto
          </>
        )}
      </div>

      {/* Timer */}
      {isAtivo && (
        <div className="font-mono text-sm tabular-nums tracking-tight text-slate-700 dark:text-slate-200">
          {formatTempoDecorrido(tempoDecorridoSeg)}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {status === 'idle' && (
          <button
            onClick={onIniciar}
            className="
              inline-flex items-center gap-1.5 rounded-lg
              bg-rose-600 px-3 py-1.5 text-xs font-medium text-white
              shadow-sm transition-all hover:bg-rose-500
              focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2
              dark:focus:ring-offset-slate-950
            "
          >
            <Mic className="size-3.5" />
            Gravar
          </button>
        )}
        {isGravando && (
          <button
            onClick={onPausar}
            className="
              rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600
              transition-colors hover:bg-slate-50
              focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2
              dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800
              dark:focus:ring-slate-600 dark:focus:ring-offset-slate-950
            "
            aria-label="Pausar gravação"
          >
            <Pause className="size-3.5" />
          </button>
        )}
        {isPausado && (
          <button
            onClick={onRetomar}
            className="
              rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600
              transition-colors hover:bg-slate-50
              focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2
              dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800
              dark:focus:ring-slate-600 dark:focus:ring-offset-slate-950
            "
            aria-label="Retomar gravação"
          >
            <Play className="size-3.5" />
          </button>
        )}
        {isAtivo && (
          <button
            onClick={onEncerrar}
            className="
              rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600
              transition-colors hover:bg-slate-50
              focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2
              dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800
              dark:focus:ring-slate-600 dark:focus:ring-offset-slate-950
            "
          >
            Encerrar
          </button>
        )}
      </div>
    </div>
  )
}
