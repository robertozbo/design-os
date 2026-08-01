import type { MicState } from '@/../product/sections/assistente-nymos/types'
import { Mic, MicOff } from 'lucide-react'

interface MicIndicatorProps {
  state: MicState
}

const STATE_LABEL: Record<MicState, string> = {
  idle: 'PRONTO',
  listening: 'FALE',
  thinking: 'AGUARDE',
  speaking: 'OUVINDO NYMOS',
  muted: 'MIC OFF',
}

export function MicIndicator({ state }: MicIndicatorProps) {
  const isListening = state === 'listening'
  const isThinking = state === 'thinking'
  const isSpeaking = state === 'speaking'
  const isMuted = state === 'muted'

  const color = isMuted
    ? 'text-rose-400 border-rose-400/60'
    : isThinking
      ? 'text-orange-300 border-orange-400/60'
      : isSpeaking
        ? 'text-slate-500 border-slate-600/60'
        : 'text-teal-300 border-teal-400/70'

  const labelColor = isMuted
    ? 'text-rose-400'
    : isThinking
      ? 'text-orange-300'
      : isSpeaking
        ? 'text-slate-500'
        : 'text-teal-300'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* Outer pinging ring when listening */}
        {isListening && (
          <>
            <span
              aria-hidden="true"
              className="absolute inset-0 -m-2 rounded-full border border-teal-400/40 animate-ping"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 -m-1 rounded-full border border-teal-300/60 animate-pulse"
            />
          </>
        )}
        <div
          className={`
            relative w-11 h-11 rounded-full
            flex items-center justify-center
            border ${color}
            bg-slate-950/80 backdrop-blur-sm
            transition-colors duration-300
            ${isListening ? 'animate-[nymos-mic-pulse_0.8s_ease-in-out_infinite]' : ''}
            ${isMuted ? 'opacity-80' : ''}
          `}
        >
          {isMuted ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </div>
      </div>

      <span
        className={`text-[10px] font-mono tracking-[0.22em] uppercase ${labelColor}`}
      >
        {STATE_LABEL[state]}
      </span>

      <style>{`
        @keyframes nymos-mic-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.5); }
          50% { opacity: 0.75; box-shadow: 0 0 0 6px rgba(45, 212, 191, 0); }
        }
      `}</style>
    </div>
  )
}
