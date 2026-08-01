import { useEffect, useRef, useState } from 'react'
import { Radio } from 'lucide-react'

interface VoiceCaptureCardProps {
  /** Partial transcription captured so far for the current user turn. */
  partialTranscript?: string
  /** Confidence (0..1) of the STT engine. Optional, drives a small bar. */
  confidence?: number
}

export function VoiceCaptureCard({
  partialTranscript = '',
  confidence = 0.92,
}: VoiceCaptureCardProps) {
  const [bars, setBars] = useState<number[]>(() => new Array(36).fill(0.2))
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    function tick(now: number) {
      setBars((prev) =>
        prev.map((_, i) => {
          const t = now / 1000
          const base = Math.abs(Math.sin(t * (2 + i * 0.07) + i * 0.4)) * 0.6
          const burst = Math.abs(Math.sin(t * 6 + i)) * 0.25
          const noise = Math.random() * 0.18
          let amp = base + burst + noise
          const dist = Math.abs(i - prev.length / 2) / (prev.length / 2)
          const env = 1 - Math.pow(dist, 1.4) * 0.55
          amp *= env
          return Math.max(0.08, Math.min(1, amp))
        }),
      )
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      className="
        relative w-full max-w-xl mx-auto font-mono
        text-teal-100
      "
      role="status"
      aria-label="Capturando sua voz"
    >
      <div
        className="
          relative border border-teal-400/70 bg-black/80 backdrop-blur-md
          shadow-[0_0_28px_-4px_rgba(45,212,191,0.6)]
          px-5 py-4
        "
        style={{
          clipPath:
            'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between text-[9px] tracking-[0.22em] uppercase mb-3 pb-2 border-b border-teal-500/30">
          <span className="flex items-center gap-2 text-teal-300">
            <Radio className="w-3 h-3 animate-pulse" />
            Capturing · Voice
          </span>
          <span className="text-teal-500/70">
            Conf · <span className="text-teal-300">{Math.round(confidence * 100)}%</span>
          </span>
        </div>

        {/* Waveform */}
        <div className="flex items-end gap-[3px] h-14 mb-3">
          {bars.map((amp, i) => (
            <span
              key={i}
              className="flex-1 rounded-sm bg-teal-300"
              style={{
                height: `${amp * 100}%`,
                opacity: 0.55 + amp * 0.45,
                boxShadow: amp > 0.7 ? '0 0 6px rgba(94,234,212,0.7)' : undefined,
                transition: 'height 60ms linear',
              }}
            />
          ))}
        </div>

        {/* Live transcription */}
        <div className="flex items-start gap-3 min-h-[44px]">
          <span className="text-[10px] tracking-widest text-slate-500 pt-1 shrink-0 w-12">
            USER &gt;
          </span>
          <p className="flex-1 text-base sm:text-lg font-light leading-snug text-slate-100">
            {partialTranscript || (
              <span className="text-slate-500 italic font-mono text-sm">
                escutando…
              </span>
            )}
            <span
              className="inline-block w-[2px] h-[1.1em] bg-teal-300 ml-1 align-middle"
              style={{ animation: 'nymos-blink 0.85s steps(2) infinite' }}
              aria-hidden="true"
            />
          </p>
        </div>
      </div>

      <style>{`
        @keyframes nymos-blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
