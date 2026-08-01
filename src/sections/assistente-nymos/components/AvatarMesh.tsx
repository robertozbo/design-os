import { useEffect, useRef, useState } from 'react'
import type { AvatarState } from '@/../product/sections/assistente-nymos/types'

interface AvatarMeshProps {
  state: AvatarState
  className?: string
  /** When true, the mesh rotates softly toward the pointer/cursor. Default true. */
  trackPointer?: boolean
}

// Front-facing stylized humanoid head — low-poly wireframe.
// Coordinates in a 200x240 viewBox so the head reads as slightly taller than wide.
const VERTICES: Array<[number, number]> = [
  [100, 18],   // 0  top center
  [70, 22],    // 1  top-left forehead
  [130, 22],   // 2  top-right forehead
  [50, 40],    // 3  left temple top
  [150, 40],   // 4  right temple top
  [40, 65],    // 5  left temple
  [160, 65],   // 6  right temple
  [38, 95],    // 7  left ear top
  [162, 95],   // 8  right ear top
  [40, 130],   // 9  left cheek
  [160, 130],  // 10 right cheek
  [52, 168],   // 11 left jaw
  [148, 168],  // 12 right jaw
  [78, 198],   // 13 left chin angle
  [122, 198],  // 14 right chin angle
  [100, 218],  // 15 chin tip
  [78, 68],    // 16 brow left outer
  [94, 66],    // 17 brow left inner
  [106, 66],   // 18 brow right inner
  [122, 68],   // 19 brow right outer
  [72, 90],    // 20 eye left outer
  [88, 86],    // 21 eye left top
  [95, 92],    // 22 eye left inner
  [88, 96],    // 23 eye left bottom
  [105, 92],   // 24 eye right inner
  [112, 86],   // 25 eye right top
  [128, 90],   // 26 eye right outer
  [112, 96],   // 27 eye right bottom
  [100, 92],   // 28 nose bridge top
  [100, 118],  // 29 nose mid
  [92, 134],   // 30 nose left
  [108, 134],  // 31 nose right
  [100, 138],  // 32 nose tip
  [82, 160],   // 33 mouth left
  [100, 158],  // 34 upper lip center
  [118, 160],  // 35 mouth right
  [100, 168],  // 36 lower lip center
  [90, 172],   // 37 mouth bottom-left
  [110, 172],  // 38 mouth bottom-right
  [100, 184],  // 39 chin pad
  [62, 112],   // 40 left cheekbone
  [138, 112],  // 41 right cheekbone
]

const EDGES: Array<[number, number]> = [
  // Outline left
  [0, 1], [1, 3], [3, 5], [5, 7], [7, 9], [9, 11], [11, 13], [13, 15],
  // Outline right
  [0, 2], [2, 4], [4, 6], [6, 8], [8, 10], [10, 12], [12, 14], [14, 15],
  // Brow
  [16, 17], [17, 18], [18, 19],
  [1, 16], [2, 19], [16, 17], [18, 19],
  // Eye sockets
  [20, 21], [21, 22], [22, 23], [23, 20], [21, 23],
  [24, 25], [25, 26], [26, 27], [27, 24], [25, 27],
  // Bridge of nose + eyes
  [17, 28], [18, 28], [28, 22], [28, 24],
  // Nose
  [28, 29], [29, 30], [29, 31], [30, 32], [31, 32], [30, 31],
  // Cheekbones connecting
  [20, 40], [40, 30], [40, 9], [40, 33], [3, 16], [5, 20],
  [26, 41], [41, 31], [41, 10], [41, 35], [4, 19], [6, 26],
  // Lower cheeks
  [7, 40], [8, 41], [9, 33], [10, 35],
  // Mouth
  [33, 34], [34, 35], [33, 37], [37, 36], [36, 38], [38, 35], [34, 36],
  // Jaw
  [11, 33], [12, 35], [11, 37], [12, 38], [13, 37], [14, 38],
  [33, 37], [35, 38],
  // Chin
  [37, 39], [38, 39], [13, 39], [14, 39], [39, 15], [36, 39],
]

// Vertices in the lower jaw / mouth area — these get the "speaking" jitter
const JAW_VERTICES = new Set<number>([
  11, 12, 13, 14, 15, 33, 34, 35, 36, 37, 38, 39,
])

function getStateClasses(state: AvatarState) {
  switch (state) {
    case 'listening':
      return {
        wrapper: 'animate-[nymos-pulse_1.2s_ease-in-out_infinite]',
        vertex: 'fill-teal-300',
        edge: 'stroke-teal-400/60',
        glow: 'opacity-100',
        scan: 'opacity-80',
        jaw: '',
      }
    case 'thinking':
      return {
        wrapper: 'animate-[nymos-orbit_3.5s_linear_infinite]',
        vertex: 'fill-teal-400',
        edge: 'stroke-teal-500/50',
        glow: 'opacity-70',
        scan: 'opacity-30',
        jaw: '',
      }
    case 'speaking':
      return {
        wrapper: 'animate-[nymos-breathe_2.4s_ease-in-out_infinite]',
        vertex: 'fill-teal-200',
        edge: 'stroke-teal-300/70',
        glow: 'opacity-100',
        scan: 'opacity-90',
        jaw: 'animate-[nymos-jaw_0.32s_ease-in-out_infinite]',
      }
    case 'idle':
    default:
      return {
        wrapper: 'animate-[nymos-breathe_5s_ease-in-out_infinite]',
        vertex: 'fill-teal-400',
        edge: 'stroke-teal-500/45',
        glow: 'opacity-60',
        scan: 'opacity-40',
        jaw: '',
      }
  }
}

export function AvatarMesh({
  state,
  className = '',
  trackPointer = true,
}: AvatarMeshProps) {
  const s = getStateClasses(state)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const [rot, setRot] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!trackPointer) return
    if (typeof window === 'undefined') return

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const MAX_DEG = 14
    const SMOOTH = 0.12

    function getCenter() {
      const el = containerRef.current
      if (!el) return { cx: window.innerWidth / 2, cy: window.innerHeight / 2 }
      const rect = el.getBoundingClientRect()
      return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 }
    }

    function onMove(e: PointerEvent) {
      const { cx, cy } = getCenter()
      // Normalize across half the viewport so the head stops rotating near the edges
      const halfW = window.innerWidth / 2
      const halfH = window.innerHeight / 2
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / halfW))
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / halfH))
      targetRef.current = { x: nx, y: ny }
    }

    function tick() {
      setRot((prev) => {
        const targetRotY = targetRef.current.x * MAX_DEG
        const targetRotX = -targetRef.current.y * MAX_DEG
        const nextY = prev.y + (targetRotY - prev.y) * SMOOTH
        const nextX = prev.x + (targetRotX - prev.x) * SMOOTH
        return { x: nextX, y: nextY }
      })
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [trackPointer])

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ perspective: '900px' }}
    >
      <style>{`
        @keyframes nymos-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
        @keyframes nymos-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 12px rgba(45, 212, 191, 0.55)); }
          50% { transform: scale(1.035); filter: drop-shadow(0 0 24px rgba(94, 234, 212, 0.85)); }
        }
        @keyframes nymos-orbit {
          0% { transform: rotate(-2deg) translateY(0); }
          50% { transform: rotate(2deg) translateY(-2px); }
          100% { transform: rotate(-2deg) translateY(0); }
        }
        @keyframes nymos-jaw {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(2px); }
        }
        @keyframes nymos-scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.9; }
          90% { opacity: 0.9; }
          100% { transform: translateY(220px); opacity: 0; }
        }
        @keyframes nymos-halo {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.06); opacity: 0.65; }
        }
      `}</style>

      {/* Outer halo glow */}
      <div
        className={`absolute inset-0 rounded-full bg-teal-500/15 blur-3xl ${s.glow}`}
        style={{ animation: 'nymos-halo 4.5s ease-in-out infinite' }}
        aria-hidden="true"
      />

      <div
        className="relative w-full h-full"
        style={{
          transform: `rotateX(${rot.x.toFixed(2)}deg) rotateY(${rot.y.toFixed(2)}deg)`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center 50%',
          willChange: 'transform',
        }}
      >
      <svg
        viewBox="0 0 200 240"
        className={`relative w-full h-full ${s.wrapper}`}
        style={{ filter: 'drop-shadow(0 0 8px rgba(20, 184, 166, 0.45))' }}
        role="img"
        aria-label={`Nymos ${state}`}
      >
        {/* Scan line */}
        <line
          x1="20"
          x2="180"
          y1="0"
          y2="0"
          className={`stroke-teal-200 ${s.scan}`}
          strokeWidth="0.6"
          style={{
            animation: state === 'thinking' ? 'none' : 'nymos-scan 4s linear infinite',
          }}
        />

        {/* Edges */}
        <g className={s.edge} fill="none" strokeWidth="0.6" strokeLinecap="round">
          {EDGES.map(([a, b], i) => {
            const [x1, y1] = VERTICES[a]
            const [x2, y2] = VERTICES[b]
            const isJawEdge = JAW_VERTICES.has(a) && JAW_VERTICES.has(b)
            return (
              <line
                key={`edge-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={isJawEdge ? s.jaw : ''}
                style={{ transformOrigin: '100px 170px' }}
              />
            )
          })}
        </g>

        {/* Vertices */}
        <g className={s.vertex}>
          {VERTICES.map(([x, y], i) => {
            const isJaw = JAW_VERTICES.has(i)
            return (
              <circle
                key={`vertex-${i}`}
                cx={x}
                cy={y}
                r="1.6"
                className={isJaw ? s.jaw : ''}
                style={{ transformOrigin: '100px 170px' }}
              />
            )
          })}
        </g>
      </svg>
      </div>
    </div>
  )
}
