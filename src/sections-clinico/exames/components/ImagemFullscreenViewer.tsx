import { useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Contrast,
  Download,
  ExternalLink,
  Maximize2,
  Minus,
  Move,
  Plus,
  RotateCw,
  Ruler,
  Sun,
  X,
} from 'lucide-react'
import type { ImagemSerie } from '@/../product-clinico/sections/exames/types'
import { ImagemMedicaMock } from './ImagemMedicaMock'

interface Props {
  open: boolean
  /** Conjunto de séries do estudo. */
  imagens: ImagemSerie[]
  /** Id inicial — qual aparece primeiro. */
  initialId?: string
  /** Contexto pra exibir no header (paciente, estudo). */
  pacienteNome: string
  estudoTipo: string
  /** DICOM disponível pro botão "Abrir externo". */
  dicomDisponivel?: boolean
  /** Highlight do achado por mockVisual (espelha o LaudoImagemViewer). */
  highlights?: Record<
    ImagemSerie['mockVisual'],
    { x: number; y: number; r: number; label?: string } | undefined
  >
  onClose?: () => void
  onAbrirDicomExterno?: (serieId: string) => void
}

export function ImagemFullscreenViewer({
  open,
  imagens,
  initialId,
  pacienteNome,
  estudoTipo,
  dicomDisponivel = false,
  highlights,
  onClose,
  onAbrirDicomExterno,
}: Props) {
  const [currentId, setCurrentId] = useState(initialId ?? imagens[0]?.id ?? '')
  const [zoom, setZoom] = useState(1)
  const [rotacao, setRotacao] = useState(0)
  const [tool, setTool] = useState<'pan' | 'measure' | null>(null)

  useEffect(() => {
    if (open) {
      setCurrentId(initialId ?? imagens[0]?.id ?? '')
      setZoom(1)
      setRotacao(0)
      setTool(null)
    }
  }, [open, initialId, imagens])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowLeft') navegar(-1)
      if (e.key === 'ArrowRight') navegar(1)
      if (e.key === '+') setZoom((z) => Math.min(z + 0.25, 4))
      if (e.key === '-') setZoom((z) => Math.max(z - 0.25, 0.5))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentId, imagens.length])

  if (!open) return null

  const currentIndex = imagens.findIndex((i) => i.id === currentId)
  const current = imagens[currentIndex] ?? imagens[0]
  const highlight = current && highlights ? highlights[current.mockVisual] : undefined

  function navegar(delta: number) {
    if (imagens.length === 0) return
    const next = (currentIndex + delta + imagens.length) % imagens.length
    setCurrentId(imagens[next].id)
    setZoom(1)
    setRotacao(0)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100"
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onClose}
            className="-ml-1 inline-flex items-center gap-1 rounded-md p-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Fechar viewer"
          >
            <X className="size-4" />
            Fechar
          </button>
          <div className="hidden h-4 w-px bg-slate-700 sm:block" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{pacienteNome}</p>
            <p className="truncate text-[11px] text-slate-400">
              {estudoTipo} ·{' '}
              <span className="font-mono">
                {currentIndex + 1} / {imagens.length}
              </span>
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          <span className="rounded-full border border-amber-500/40 bg-amber-950/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-400">
            Mock · não diagnóstico
          </span>
        </div>
      </header>

      {/* Viewport area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Series rail (left) */}
        <aside className="hidden w-32 shrink-0 flex-col gap-1.5 overflow-y-auto border-r border-slate-800/80 bg-slate-950/40 p-2 sm:flex">
          <p className="px-1 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
            Séries
          </p>
          {imagens.map((img) => {
            const ativo = img.id === currentId
            return (
              <button
                key={img.id}
                onClick={() => {
                  setCurrentId(img.id)
                  setZoom(1)
                  setRotacao(0)
                }}
                className={`
                  group/sr w-full overflow-hidden rounded-md border transition-all
                  ${
                    ativo
                      ? 'border-teal-400 ring-2 ring-teal-500/40'
                      : 'border-slate-800 hover:border-slate-600'
                  }
                `}
              >
                <ImagemMedicaMock
                  imagem={{
                    id: img.id,
                    rotulo: img.rotulo,
                    descricao: img.descricao,
                    mockVisual: img.mockVisual,
                  }}
                />
                <div className="bg-slate-900 px-1.5 py-1 text-left">
                  <p
                    className={`truncate font-mono text-[9px] font-semibold ${
                      ativo ? 'text-teal-300' : 'text-slate-300'
                    }`}
                  >
                    {img.rotulo}
                  </p>
                </div>
              </button>
            )
          })}
        </aside>

        {/* Main canvas */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
          {/* Image transformed */}
          {current && (
            <div
              className="relative"
              style={{
                transform: `scale(${zoom}) rotate(${rotacao}deg)`,
                transition: 'transform 120ms ease-out',
                width: 'min(80vw, 80vh)',
                aspectRatio: '4 / 3',
              }}
            >
              <ImagemMedicaMock imagem={current} highlight={highlight} />
            </div>
          )}

          {/* Prev / Next */}
          {imagens.length > 1 && (
            <>
              <button
                onClick={() => navegar(-1)}
                aria-label="Imagem anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={() => navegar(1)}
                aria-label="Próxima imagem"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          {/* DICOM-style HUD */}
          <div className="pointer-events-none absolute left-3 top-3 space-y-0.5 font-mono text-[10px] text-emerald-400/80">
            <p>{current?.rotulo}</p>
            <p>{current?.descricao}</p>
            <p>WL: 40 / WW: 400</p>
          </div>
          <div className="pointer-events-none absolute right-3 top-3 text-right font-mono text-[10px] text-emerald-400/80">
            <p>Zoom: {(zoom * 100).toFixed(0)}%</p>
            <p>Rotação: {rotacao}°</p>
          </div>
        </div>
      </div>

      {/* Bottom toolbar */}
      <footer className="flex items-center justify-between gap-2 border-t border-slate-800/80 bg-slate-950/80 px-4 py-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <ToolBtn
            label="Pan"
            icon={Move}
            ativo={tool === 'pan'}
            onClick={() => setTool(tool === 'pan' ? null : 'pan')}
          />
          <ToolBtn
            label="Medir"
            icon={Ruler}
            ativo={tool === 'measure'}
            onClick={() => setTool(tool === 'measure' ? null : 'measure')}
          />
          <Divider />
          <ToolBtn label="Zoom out" icon={Minus} onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))} />
          <ToolBtn label="Zoom in" icon={Plus} onClick={() => setZoom((z) => Math.min(z + 0.25, 4))} />
          <ToolBtn label="Reset zoom" icon={Maximize2} onClick={() => setZoom(1)} />
          <Divider />
          <ToolBtn
            label="Rotacionar 90°"
            icon={RotateCw}
            onClick={() => setRotacao((r) => (r + 90) % 360)}
          />
          <Divider />
          <ToolBtn label="Brilho (V2)" icon={Sun} disabled />
          <ToolBtn label="Contraste / Windowing (V2)" icon={Contrast} disabled />
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-[10px] text-slate-500 sm:inline">
            ←/→ navega · +/− zoom · Esc fecha
          </span>
          {dicomDisponivel ? (
            <button
              onClick={() => current && onAbrirDicomExterno?.(current.id)}
              className="
                inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-900 transition-colors
                hover:bg-white
              "
            >
              <ExternalLink className="size-3" />
              Abrir DICOM externo
            </button>
          ) : (
            <button className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-800">
              <Download className="size-3" />
              Baixar JPG
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}

function ToolBtn({
  label,
  icon: Icon,
  ativo,
  disabled,
  onClick,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  ativo?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`
        rounded-md p-1.5 transition-colors
        ${
          ativo
            ? 'bg-teal-600 text-white'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }
        disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent
      `}
    >
      <Icon className="size-4" />
    </button>
  )
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-slate-800" aria-hidden />
}
