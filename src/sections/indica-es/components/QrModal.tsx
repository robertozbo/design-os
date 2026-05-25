import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Copy, Check } from 'lucide-react'

interface QrModalProps {
  open: boolean
  url: string
  codigo: string
  pacienteNome: string
  onClose: () => void
}

export function QrModal({ open, url, codigo, pacienteNome, onClose }: QrModalProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    setCopied(false)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null
  if (typeof document === 'undefined') return null

  function handleCopy() {
    navigator.clipboard?.writeText(url).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="QR Code do convite"
        className="
          relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl
          dark:border-slate-800 dark:bg-slate-950
        "
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">
              QR Code
            </p>
            <h2 className="mt-0.5 text-base font-semibold text-slate-900 dark:text-slate-50">
              {pacienteNome}
            </h2>
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

        <div className="flex flex-col items-center gap-4 px-5 py-6">
          {/* QR placeholder — production would use a real QR library */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-inner dark:border-slate-700 dark:bg-slate-100">
            <FauxQr seed={codigo} />
          </div>

          <div className="w-full">
            <p className="mb-1 text-center font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
              Código
            </p>
            <p className="text-center font-mono text-sm font-semibold text-teal-700 dark:text-teal-300">
              {codigo}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="
              inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700
              hover:bg-slate-50
              dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
            "
          >
            {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
            {copied ? 'Link copiado' : 'Copiar link'}
          </button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Mostre na consulta ou compartilhe digitalmente. Quando o paciente escanear, o app abre direto na tela de cadastro com seu código pré-preenchido.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/**
 * Simple deterministic faux-QR rendered as a 21×21 grid based on a seed string.
 * Just for design preview — production should use a real QR encoder.
 */
function FauxQr({ seed }: { seed: string }) {
  const size = 21
  // Deterministic pseudo-noise from seed
  const rng = (i: number) => {
    let h = 2166136261
    for (let k = 0; k < seed.length; k++) {
      h ^= seed.charCodeAt(k) ^ i * 31
      h = Math.imul(h, 16777619)
    }
    return ((h >>> 0) % 1000) / 1000
  }
  const cells: boolean[] = []
  for (let i = 0; i < size * size; i++) {
    cells.push(rng(i) > 0.5)
  }
  // Force the 3 finder squares (top-left, top-right, bottom-left)
  function setFinder(rx: number, ry: number) {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const onBorder = x === 0 || x === 6 || y === 0 || y === 6
        const onInner = x >= 2 && x <= 4 && y >= 2 && y <= 4
        cells[(ry + y) * size + (rx + x)] = onBorder || onInner
      }
    }
  }
  setFinder(0, 0)
  setFinder(size - 7, 0)
  setFinder(0, size - 7)

  const cellPx = 8
  const dim = size * cellPx
  return (
    <svg
      role="img"
      aria-label="QR code"
      viewBox={`0 0 ${dim} ${dim}`}
      width="200"
      height="200"
      className="block"
    >
      <rect width={dim} height={dim} fill="#ffffff" />
      {cells.map((on, i) => {
        if (!on) return null
        const x = (i % size) * cellPx
        const y = Math.floor(i / size) * cellPx
        return <rect key={i} x={x} y={y} width={cellPx} height={cellPx} fill="#0f172a" />
      })}
    </svg>
  )
}
