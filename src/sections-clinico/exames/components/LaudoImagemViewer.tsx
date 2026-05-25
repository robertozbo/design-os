import { useState } from 'react'
import { Download, ExternalLink, FileText, Maximize2, ScanSearch } from 'lucide-react'
import type {
  ImagemSerie,
  LaudoOriginal,
} from '@/../product-clinico/sections/exames/types'
import { ImagemMedicaMock } from './ImagemMedicaMock'
import { ImagemFullscreenViewer } from './ImagemFullscreenViewer'

interface Props {
  imagens: ImagemSerie[]
  laudo: LaudoOriginal
  laboratorio: string
  radiologistaResponsavel: string
  dataResultado: string
  dicomDisponivel: boolean
  /** Pra header do fullscreen viewer. */
  pacienteNome?: string
  estudoTipo?: string
  onAbrirDicomExterno?: (serieId: string) => void
}

const HIGHLIGHTS: Record<string, { x: number; y: number; r: number; label?: string }> = {
  // Tireoide nodule (corresponds to mockVisual='tireoide-long' image)
  'tireoide-long': { x: 70, y: 52, r: 16, label: 'TI-RADS 3' },
  'tireoide-trans': { x: 70, y: 52, r: 13 },
  'crânio-sagital-t1': { x: 50, y: 57, r: 7, label: 'µAdenoma' },
  'crânio-coronal-t1': { x: 52, y: 60, r: 6, label: 'µAdenoma' },
  'torax-pa': { x: 50, y: 50, r: 28, label: 'ICT 0,55' },
}

export function LaudoImagemViewer({
  imagens,
  laudo,
  laboratorio,
  radiologistaResponsavel,
  dataResultado,
  dicomDisponivel,
  pacienteNome = 'Paciente',
  estudoTipo = 'Estudo',
  onAbrirDicomExterno,
}: Props) {
  const [serieAtivaId, setSerieAtivaId] = useState(imagens[0]?.id ?? '')
  const [aba, setAba] = useState<'imagem' | 'laudo'>('imagem')
  const [fullscreen, setFullscreen] = useState(false)
  const serieAtiva = imagens.find((s) => s.id === serieAtivaId) ?? imagens[0]
  const highlight = serieAtiva ? HIGHLIGHTS[serieAtiva.mockVisual] : undefined

  return (
    <>
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between gap-2 border-b border-slate-200/80 px-4 py-2.5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <ScanSearch className="size-3.5" />
          </span>
          <div>
            <h2 className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Laudo & Imagens
            </h2>
            <p className="text-[10px] text-slate-500">
              {laboratorio} · {imagens.length} {imagens.length === 1 ? 'imagem' : 'imagens'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="inline-flex items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50/60 p-0.5 dark:border-slate-700 dark:bg-slate-800/60">
          {(['imagem', 'laudo'] as const).map((id) => {
            const ativo = aba === id
            return (
              <button
                key={id}
                onClick={() => setAba(id)}
                className={`
                  rounded px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors
                  ${
                    ativo
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }
                `}
              >
                {id === 'imagem' ? 'Imagem' : 'Laudo'}
              </button>
            )
          })}
        </div>
      </header>

      {/* Body */}
      {aba === 'imagem' ? (
        <div className="flex flex-1 flex-col bg-slate-100/40 dark:bg-slate-950/40">
          {/* Main viewport */}
          <div className="flex-1 p-4">
            {serieAtiva && (
              <ImagemMedicaMock imagem={serieAtiva} highlight={highlight} />
            )}
          </div>

          {/* Toolbar inferior */}
          <div className="flex items-center justify-between gap-2 border-t border-slate-200/80 bg-slate-50/60 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/60">
            {/* Thumbnails */}
            <div className="flex flex-1 items-center gap-1.5 overflow-x-auto">
              {imagens.map((img) => {
                const ativo = img.id === serieAtivaId
                return (
                  <button
                    key={img.id}
                    onClick={() => setSerieAtivaId(img.id)}
                    className={`
                      flex shrink-0 flex-col items-start rounded-md border px-2 py-1 text-left transition-all
                      ${
                        ativo
                          ? 'border-teal-400 bg-teal-50/60 dark:border-teal-600 dark:bg-teal-950/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600'
                      }
                    `}
                  >
                    <span
                      className={`text-[10px] font-mono font-semibold ${
                        ativo
                          ? 'text-teal-700 dark:text-teal-300'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {img.rotulo}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400">
                      {img.descricao}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => setFullscreen(true)}
                className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                aria-label="Tela cheia"
                title="Tela cheia"
              >
                <Maximize2 className="size-3.5" />
              </button>
              {dicomDisponivel ? (
                <button
                  onClick={() => serieAtiva && onAbrirDicomExterno?.(serieAtiva.id)}
                  className="
                    inline-flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1.5 text-[10px] font-medium text-white shadow-sm transition-colors
                    hover:bg-slate-700
                    dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300
                  "
                >
                  <ExternalLink className="size-3" />
                  Abrir DICOM
                </button>
              ) : (
                <button className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-[10px] font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                  <Download className="size-3" />
                  Baixar JPG
                </button>
              )}
            </div>
          </div>

          {/* V1 disclaimer */}
          <div className="border-t border-amber-200/40 bg-amber-50/40 px-4 py-1.5 text-[10px] text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300">
            <strong>V1:</strong> imagem renderizada como mock. Pra examinar windowing/zoom em DICOM real, use o "Abrir DICOM" (viewer externo). Viewer embutido (Cornerstone.js) → V2.
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto bg-slate-100/50 p-4 dark:bg-slate-950/40">
          <article className="mx-auto max-w-prose rounded-md border border-slate-300/60 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
            <header className="mb-5 border-b-2 border-slate-300 pb-4 dark:border-slate-700">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
                {laboratorio}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Resultado emitido em{' '}
                {new Date(dataResultado + 'T12:00:00').toLocaleDateString('pt-BR')} ·{' '}
                {radiologistaResponsavel}
              </p>
            </header>
            <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-200">
              {laudo.texto}
            </pre>
            <footer className="mt-5 flex items-center gap-1.5 border-t border-slate-200 pt-3 text-[10px] text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <FileText className="size-3" />
              {laudo.paginas} {laudo.paginas === 1 ? 'página' : 'páginas'} · texto extraído do PDF original
            </footer>
          </article>
        </div>
      )}
    </section>
    <ImagemFullscreenViewer
      open={fullscreen}
      imagens={imagens}
      initialId={serieAtivaId}
      pacienteNome={pacienteNome}
      estudoTipo={estudoTipo}
      dicomDisponivel={dicomDisponivel}
      highlights={HIGHLIGHTS as never}
      onClose={() => setFullscreen(false)}
      onAbrirDicomExterno={onAbrirDicomExterno}
    />
    </>
  )
}
