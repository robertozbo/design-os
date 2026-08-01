import { useEffect, useRef, useState } from 'react'

interface VoiceWaveformOverlayProps {
  /** Number of bars. Defaults to 48. */
  bars?: number
  /** Confidence (0..1) shown as small badge. */
  confidence?: number
}

/**
 * Floating waveform that overlays the avatar area when the User is speaking.
 * Renders as a horizontal strip of glowing teal bars positioned at the bottom
 * of the avatar bracket frame. Not a card — just the waveform itself with
 * a small status label and no background container.
 */
export function VoiceWaveformOverlay({
  bars = 48,
  confidence = 0.92,
}: VoiceWaveformOverlayProps) {
  const [heights, setHeights] = useState<number[]>(() => new Array(bars).fill(0.2))
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    function tick(now: number) {
      setHeights((prev) =>
        prev.map((_, i) => {
          const t = now / 1000
          const base = Math.abs(Math.sin(t * (2.2 + i * 0.05) + i * 0.3)) * 0.55
          const burst = Math.abs(Math.sin(t * 7 + i * 0.6)) * 0.3
          const noise = Math.random() * 0.18
          let amp = base + burst + noise
          const dist = Math.abs(i - prev.length / 2) / (prev.length / 2)
          const env = 1 - Math.pow(dist, 1.6) * 0.55
          amp *= env
          return Math.max(0.07, Math.min(1, amp))
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
      className="pointer-events-none absolute inset-x-0 bottom-2 px-4 flex flex-col items-center gap-2 font-mono select-none"
      role="status"
      aria-label="Capturando voz"
    >
      {/* Status mini-strip */}
      <div className="flex items-center gap-3 text-[9px] tracking-[0.24em] uppercase">
        <span className="flex items-center gap-1.5 text-teal-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-300" />
          </span>
          Capturing · Voice
        </span>
        <span className="text-teal-500/60">|</span>
        <span className="text-teal-500/80">
          Conf · <span className="text-teal-300">{Math.round(confidence * 100)}%</span>
        </span>
      </div>

      {/* Waveform bars — no background card, just the bars */}
      <div className="flex items-end gap-[3px] h-10 w-full max-w-md">
        {heights.map((amp, i) => (
          <span
            key={i}
            className="flex-1 rounded-[1px] bg-teal-300"
            style={{
              height: `${amp * 100}%`,
              opacity: 0.4 + amp * 0.55,
              boxShadow:
                amp > 0.7
                  ? '0 0 10px rgba(94,234,212,0.85), 0 0 4px rgba(94,234,212,0.9)'
                  : amp > 0.4
                    ? '0 0 6px rgba(94,234,212,0.5)'
                    : undefined,
              transition: 'height 60ms linear',
            }}
          />
        ))}
      </div>
    </div>
  )
}
