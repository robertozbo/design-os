import type { VoiceUtterance } from '@/../product/sections/assistente-nymos/types'
import { ArrowUpRight } from 'lucide-react'

interface TranscriptionHudProps {
  utterances: VoiceUtterance[]
  onDrillDown?: (path: string) => void
}

export function TranscriptionHud({ utterances, onDrillDown }: TranscriptionHudProps) {
  // Show the most recent 3 utterances
  const visible = utterances.slice(-3)

  return (
    <div
      className="relative w-full max-w-3xl mx-auto"
      aria-live="polite"
      aria-atomic="false"
    >
      <div
        className="relative border border-teal-500/30 bg-slate-950/70 backdrop-blur-md px-5 py-4"
        style={{
          clipPath:
            'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
        }}
      >
        {/* Top header bar */}
        <div className="flex items-center justify-between text-[9px] font-mono tracking-[0.2em] text-teal-500/60 uppercase mb-3 border-b border-teal-500/20 pb-2">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-teal-300 rounded-full animate-pulse" />
            Transcription · Live
          </span>
          <span>UTF-8 · STT v2</span>
        </div>

        <ul className="space-y-3">
          {visible.map((u, idx) => {
            const isLast = idx === visible.length - 1
            return (
              <li
                key={u.id}
                className={`flex gap-3 ${u.author === 'assistant' ? '' : ''}`}
              >
                <span
                  className={`text-[10px] font-mono tracking-widest pt-1 shrink-0 w-14 ${
                    u.author === 'assistant'
                      ? 'text-teal-300'
                      : 'text-slate-500'
                  }`}
                >
                  {u.author === 'assistant' ? 'NYMOS >' : 'USER >'}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-base sm:text-lg md:text-xl font-light leading-snug ${
                      u.author === 'assistant'
                        ? 'text-teal-100'
                        : 'text-slate-300'
                    } ${isLast && u.author === 'assistant' ? 'drop-shadow-[0_0_8px_rgba(94,234,212,0.4)]' : ''}`}
                  >
                    {u.text}
                  </p>
                  {u.drillTo && (
                    <button
                      type="button"
                      onClick={() => u.drillTo && onDrillDown?.(u.drillTo)}
                      className="
                        mt-2 inline-flex items-center gap-1.5
                        text-[10px] font-mono tracking-widest uppercase
                        text-teal-300 hover:text-teal-200
                        border border-teal-500/40 hover:border-teal-400
                        px-2.5 py-1
                        transition-colors
                      "
                    >
                      Ver detalhes
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
