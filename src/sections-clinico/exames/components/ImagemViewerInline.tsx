import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowLeft,
  Bone,
  Brain,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  GitCompare,
  Loader2,
  Maximize2,
  Minimize2,
  RotateCw,
  Save,
  Sparkles,
  Waves,
  X,
} from 'lucide-react'
import type {
  AchadoImagem,
  ComparacaoImagem,
  IAAnalise,
  ImagemSerie,
  ModalidadeImagem,
  SignificanciaAchado,
} from '@/../product-clinico/sections/exames/types'
import { FileText, MessageSquare, Pill, ShieldAlert, TrendingUp } from 'lucide-react'
import { ImagemMedicaMock } from './ImagemMedicaMock'
import type { IABloco, IABlocoTipo } from '@/../product-clinico/sections/exames/types'
import { IA_BLOCO_STYLE } from './helpers'
import { RichText } from './RichText'

interface Props {
  pacienteNome: string
  iniciais: string
  estudoTipo: string
  modalidade: ModalidadeImagem
  laboratorio: string
  dataColeta: string
  indicacao: string
  imagens: ImagemSerie[]
  achados: AchadoImagem[]
  comparacao: ComparacaoImagem | null
  /** Análise IA pré-disponível (vinda do exame). Se null, viewer mostra CTA "Analisar com IA". */
  iaAnalisePreCarregada?: IAAnalise | null
  /** Análise já salva no prontuário em sessão anterior. Pré-popula comentário + indica "salvo em". */
  analiseSalva?: {
    comentarioMedico: string | null
    imagensAnalisadasIds: string[]
    salvoEm: string
  } | null
  dicomDisponivel?: boolean
  /** Highlights por mockVisual — espelha o LaudoImagemViewer. */
  highlights?: Record<
    ImagemSerie['mockVisual'],
    { x: number; y: number; r: number; label?: string } | undefined
  >
  onVoltar?: () => void
  onAbrirDicomExterno?: (serieId: string) => void
  /** Disparado quando o médico clica em "Analisar com IA". O componente devolve loading e depois exibe os 4 blocos. */
  onAnalisarComIA?: () => Promise<IAAnalise> | IAAnalise | void
  /** Disparado quando o médico clica em "Salvar e fechar". Recebe a análise + comentário + IDs analisadas. */
  onSalvarAnalise?: (data: {
    analiseIA: IAAnalise
    comentarioMedico: string | null
    imagensAnalisadasIds: string[]
  }) => Promise<void> | void
}

const MODALIDADE_ICONE: Record<ModalidadeImagem, React.ComponentType<{ className?: string }>> = {
  'raio-x': Bone,
  usg: Waves,
  rm: Brain,
  tc: Brain,
  cintilografia: Sparkles,
}

const MODALIDADE_LABEL: Record<ModalidadeImagem, string> = {
  'raio-x': 'Raio-X',
  usg: 'USG',
  rm: 'RM',
  tc: 'TC',
  cintilografia: 'Cintilografia',
}

const SIG_STYLE: Record<SignificanciaAchado, string> = {
  normal:
    'border-emerald-200/70 bg-emerald-50/60 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300',
  atencao:
    'border-amber-200/70 bg-amber-50/60 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300',
  critico:
    'border-rose-200/70 bg-rose-50/60 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300',
}

const SIG_LABEL: Record<SignificanciaAchado, string> = {
  normal: 'Normal',
  atencao: 'Atenção',
  critico: 'Crítico',
}

export function ImagemViewerInline({
  pacienteNome,
  iniciais,
  estudoTipo,
  modalidade,
  laboratorio,
  dataColeta,
  indicacao,
  imagens,
  achados,
  comparacao,
  iaAnalisePreCarregada = null,
  analiseSalva = null,
  dicomDisponivel = false,
  highlights,
  onVoltar,
  onAbrirDicomExterno,
  onAnalisarComIA,
  onSalvarAnalise,
}: Props) {
  const [serieAtivaId, setSerieAtivaId] = useState(imagens[0]?.id ?? '')
  const [zoom, setZoom] = useState(1)
  const [rotacao, setRotacao] = useState(0)
  const [iaStage, setIaStage] = useState<'idle' | 'analyzing' | 'done'>(
    iaAnalisePreCarregada ? 'done' : 'idle',
  )
  const [iaResult, setIaResult] = useState<IAAnalise | null>(iaAnalisePreCarregada)
  const [modoFoco, setModoFoco] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () =>
      analiseSalva?.imagensAnalisadasIds.length
        ? new Set(analiseSalva.imagensAnalisadasIds)
        : new Set(imagens.map((i) => i.id)),
  )
  const [analisadasIds, setAnalisadasIds] = useState<Set<string>>(() => {
    if (analiseSalva?.imagensAnalisadasIds.length) {
      return new Set(analiseSalva.imagensAnalisadasIds)
    }
    return iaAnalisePreCarregada ? new Set(imagens.map((i) => i.id)) : new Set()
  })
  const [comentarioMedico, setComentarioMedico] = useState(analiseSalva?.comentarioMedico ?? '')
  const [savingStage, setSavingStage] = useState<'idle' | 'saving' | 'saved'>('idle')

  const salvarEFechar = async () => {
    if (!iaResult || savingStage !== 'idle') return
    setSavingStage('saving')
    try {
      await Promise.resolve(
        onSalvarAnalise?.({
          analiseIA: iaResult,
          comentarioMedico: comentarioMedico.trim() || null,
          imagensAnalisadasIds: Array.from(analisadasIds),
        }),
      )
      setSavingStage('saved')
      setTimeout(() => onVoltar?.(), 900)
    } catch {
      setSavingStage('idle')
    }
  }

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const imagensAnalisadas = imagens.filter((i) => analisadasIds.has(i.id))
  const ctaLabel =
    selectedIds.size === 0
      ? 'Selecione ao menos 1 imagem'
      : selectedIds.size === 1
        ? `Analisar ${imagens.find((i) => selectedIds.has(i.id))?.rotulo ?? 'imagem'}`
        : selectedIds.size === imagens.length
          ? `Analisar ${imagens.length} imagens`
          : `Analisar ${selectedIds.size} de ${imagens.length} imagens`

  const ModIcon = MODALIDADE_ICONE[modalidade]
  const serieAtiva = imagens.find((s) => s.id === serieAtivaId) ?? imagens[0]
  const highlight = serieAtiva && highlights ? highlights[serieAtiva.mockVisual] : undefined

  const navegar = (delta: number) => {
    if (imagens.length === 0) return
    const idx = imagens.findIndex((i) => i.id === serieAtivaId)
    const next = (idx + delta + imagens.length) % imagens.length
    setSerieAtivaId(imagens[next].id)
    setZoom(1)
    setRotacao(0)
  }

  const analisar = async () => {
    if (selectedIds.size === 0) return
    setAnalisadasIds(new Set(selectedIds))
    setIaStage('analyzing')
    try {
      const result = await Promise.resolve(onAnalisarComIA?.())
      if (result && typeof result === 'object' && 'blocos' in result) {
        setIaResult(result as IAAnalise)
      } else if (iaAnalisePreCarregada) {
        // Fallback: usa pré-carregada se o callback não devolveu
        setIaResult(iaAnalisePreCarregada)
      }
      // Simula ~3.6s de IA (~1.5 ciclos da scanline) pra varredura ser visível
      setTimeout(() => setIaStage('done'), 3600)
    } catch {
      setIaStage('idle')
    }
  }

  // Trava scroll do body enquanto overlay está aberto + Esc fecha
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (modoFoco) setModoFoco(false)
        else onVoltar?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onVoltar, modoFoco])

  return createPortal(
    <div
      data-clinico-imagem-viewer-inline
      className="fixed inset-0 z-[60] flex flex-col bg-slate-50 dark:bg-slate-950"
      role="dialog"
      aria-modal="true"
    >
      {/* Header fixo — só nome do paciente + voltar/fechar */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/85 px-5 py-3 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onVoltar}
            aria-label="Voltar"
            className="-ml-1 inline-flex items-center gap-1 rounded-md p-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </button>
          <div className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-xs font-medium text-white shadow-sm">
            {iniciais}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
              {pacienteNome}
            </p>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              <ModIcon className="-mt-0.5 mr-1 inline size-3" />
              {estudoTipo} · {laboratorio} · coletado{' '}
              {new Date(dataColeta + 'T12:00:00').toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-amber-200/70 bg-amber-50/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-700 sm:inline dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
            {MODALIDADE_LABEL[modalidade]} · {imagens.length} séries
          </span>
          <button
            onClick={onVoltar}
            aria-label="Fechar"
            className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">

      {/* Thumbnails row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 pt-4">
        {imagens.map((img) => {
          const ativo = img.id === serieAtivaId
          const selecionado = selectedIds.has(img.id)
          return (
            <div
              key={img.id}
              className={`
                relative shrink-0 overflow-hidden rounded-md border transition-all
                ${
                  ativo
                    ? 'border-teal-400 ring-2 ring-teal-500/40'
                    : selecionado
                      ? 'border-teal-200 dark:border-teal-900/50'
                      : 'border-slate-200 opacity-60 hover:opacity-100 dark:border-slate-700'
                }
              `}
              style={{ width: 96 }}
            >
              <button
                onClick={() => {
                  setSerieAtivaId(img.id)
                  setZoom(1)
                  setRotacao(0)
                }}
                className="block w-full text-left"
              >
                <ImagemMedicaMock imagem={img} />
                <div className="bg-white px-1.5 py-1 dark:bg-slate-900">
                  <p
                    className={`truncate font-mono text-[9px] font-semibold ${
                      ativo
                        ? 'text-teal-700 dark:text-teal-300'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {img.rotulo}
                  </p>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSelected(img.id)
                }}
                aria-label={selecionado ? `Desmarcar ${img.rotulo}` : `Marcar ${img.rotulo}`}
                aria-pressed={selecionado}
                className={`
                  absolute left-1 top-1 inline-flex size-4 items-center justify-center rounded-[4px]
                  border-2 transition-all
                  ${
                    selecionado
                      ? 'border-teal-500 bg-teal-500 text-white shadow-sm'
                      : 'border-white/80 bg-slate-900/40 text-transparent backdrop-blur-sm hover:border-white hover:bg-slate-900/60'
                  }
                `}
              >
                <Check className="size-3" strokeWidth={3} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Layout: 2-col padrão · 1-col em modo foco */}
      <div
        className={`
          grid flex-1 grid-cols-1 items-start gap-4
          ${modoFoco ? '' : 'lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'}
        `}
      >
        {/* Coluna 1 — imagem (altura cresce em modo foco) */}
        <div
          className={`
            relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950 dark:border-slate-800
            ${modoFoco ? 'h-[80vh]' : 'h-[560px] lg:sticky lg:top-2'}
          `}
        >
          {/* Image transformed */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            {serieAtiva && (
              <div
                className="relative w-full max-w-[640px]"
                style={{
                  transform: `scale(${zoom}) rotate(${rotacao}deg)`,
                  transition: 'transform 120ms ease-out',
                  aspectRatio: '4 / 3',
                }}
              >
                <ImagemMedicaMock imagem={serieAtiva} highlight={highlight} />
              </div>
            )}

            {/* Prev / Next */}
            {imagens.length > 1 && (
              <>
                <button
                  onClick={() => navegar(-1)}
                  aria-label="Imagem anterior"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 p-1.5 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() => navegar(1)}
                  aria-label="Próxima imagem"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 p-1.5 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <ChevronRight className="size-4" />
                </button>
              </>
            )}

            {/* HUD overlay */}
            <div className="pointer-events-none absolute left-2 top-2 space-y-0.5 font-mono text-[9px] text-emerald-400/80">
              <p>{serieAtiva?.rotulo}</p>
              <p>WL: 40 / WW: 400</p>
            </div>
            <div className="pointer-events-none absolute right-2 top-2 text-right font-mono text-[9px] text-emerald-400/80">
              <p>Zoom: {(zoom * 100).toFixed(0)}%</p>
            </div>

            {/* Varredura IA — overlay enquanto stage = analyzing */}
            {iaStage === 'analyzing' && (
              <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                {/* Dim overlay — escurece imagem por trás, scanline contrasta */}
                <div
                  className="absolute inset-0 bg-slate-950"
                  style={{ animation: 'ia-dim-pulse 2.4s ease-in-out infinite' }}
                />

                {/* Grid pattern (mais visível) */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(45,212,191,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,212,191,0.55) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    animation: 'ia-grid-fade 2.4s ease-in-out infinite',
                  }}
                />

                {/* Trail glow seguindo scanline horizontal */}
                <div
                  className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-teal-400/30 to-teal-400/60"
                  style={{ animation: 'ia-trail-y 2.4s ease-in-out infinite' }}
                />

                {/* Scanline horizontal (vai e volta verticalmente) */}
                <div
                  className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_32px_8px_rgba(94,234,212,0.85)]"
                  style={{ animation: 'ia-scan-y 2.4s ease-in-out infinite', top: 0 }}
                />

                {/* Scanline vertical (vai e volta horizontalmente) — cruza com a horizontal */}
                <div
                  className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-teal-300/80 to-transparent shadow-[0_0_20px_6px_rgba(45,212,191,0.6)]"
                  style={{ animation: 'ia-scan-x 3.6s ease-in-out infinite', left: 0 }}
                />

                {/* Detection blips — pontos pulsando aleatórios */}
                <span
                  className="absolute size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(94,234,212,0.9)]"
                  style={{ left: '22%', top: '34%', animation: 'ia-blip 1.8s ease-in-out infinite' }}
                />
                <span
                  className="absolute size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(94,234,212,0.9)]"
                  style={{ left: '68%', top: '52%', animation: 'ia-blip 1.8s ease-in-out infinite 0.4s' }}
                />
                <span
                  className="absolute size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(94,234,212,0.9)]"
                  style={{ left: '44%', top: '70%', animation: 'ia-blip 1.8s ease-in-out infinite 0.9s' }}
                />
                <span
                  className="absolute size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(94,234,212,0.9)]"
                  style={{ left: '78%', top: '28%', animation: 'ia-blip 1.8s ease-in-out infinite 1.3s' }}
                />

                {/* Corner brackets (targeting reticle) */}
                <span
                  className="absolute left-3 top-3 size-6 border-l-2 border-t-2 border-cyan-300"
                  style={{ animation: 'ia-corner-pulse 1.2s ease-in-out infinite' }}
                />
                <span
                  className="absolute right-3 top-3 size-6 border-r-2 border-t-2 border-cyan-300"
                  style={{ animation: 'ia-corner-pulse 1.2s ease-in-out infinite 0.3s' }}
                />
                <span
                  className="absolute bottom-3 left-3 size-6 border-b-2 border-l-2 border-cyan-300"
                  style={{ animation: 'ia-corner-pulse 1.2s ease-in-out infinite 0.6s' }}
                />
                <span
                  className="absolute bottom-3 right-3 size-6 border-b-2 border-r-2 border-cyan-300"
                  style={{ animation: 'ia-corner-pulse 1.2s ease-in-out infinite 0.9s' }}
                />

                {/* HUD inferior — contagem de imagens */}
                <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md border border-cyan-400/60 bg-slate-950/95 px-3.5 py-2 shadow-[0_0_24px_4px_rgba(94,234,212,0.3)] backdrop-blur-md">
                  <Loader2 className="size-3.5 animate-spin text-cyan-300" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-200">
                    Analisando · {analisadasIds.size}{' '}
                    {analisadasIds.size === 1 ? 'imagem' : 'imagens'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between gap-2 border-t border-slate-800 bg-slate-900/80 px-3 py-2">
            <div className="flex items-center gap-1">
              <ToolBtn label="Zoom out" onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}>
                −
              </ToolBtn>
              <ToolBtn label="Zoom in" onClick={() => setZoom((z) => Math.min(z + 0.25, 4))}>
                +
              </ToolBtn>
              <ToolBtn label="Reset" onClick={() => setZoom(1)}>
                <span className="font-mono text-[9px]">1:1</span>
              </ToolBtn>
              <ToolBtn label="Rotacionar" onClick={() => setRotacao((r) => (r + 90) % 360)}>
                <RotateCw className="size-3.5" />
              </ToolBtn>
            </div>
            <div className="flex items-center gap-1">
              <ToolBtn
                label={modoFoco ? 'Sair do modo foco' : 'Modo foco (esconde apoio)'}
                onClick={() => setModoFoco((v) => !v)}
              >
                {modoFoco ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
              </ToolBtn>
              {dicomDisponivel && (
                <button
                  onClick={() => serieAtiva && onAbrirDicomExterno?.(serieAtiva.id)}
                  className="ml-1 inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-900 hover:bg-white"
                >
                  <ExternalLink className="size-3" />
                  DICOM
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Coluna 2 — apoio clínico + IA on-demand · oculta em modo foco */}
        {!modoFoco && (
        <div className="flex flex-col gap-3 overflow-y-auto">
          {/* Indicação */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <ClipboardCheck className="size-3" />
              Indicação clínica
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
              {indicacao}
            </p>
          </section>

          {/* Achados estruturados */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Achados (radiologista)
              </p>
              <span className="text-[9px] font-mono text-slate-400">{achados.length}</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {achados.map((a, i) => (
                <li
                  key={i}
                  className={`
                    flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] leading-snug
                    ${SIG_STYLE[a.significancia]}
                  `}
                >
                  <span
                    className={`
                      mt-1 size-1.5 shrink-0 rounded-full
                      ${
                        a.significancia === 'critico'
                          ? 'bg-rose-500'
                          : a.significancia === 'atencao'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                      }
                    `}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{a.texto}</p>
                    {a.medida && (
                      <p className="mt-0.5 font-mono text-[10px] opacity-80">{a.medida}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-[9px] font-medium uppercase tracking-wider opacity-70">
                    {SIG_LABEL[a.significancia]}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Comparação */}
          {comparacao && (
            <section className="rounded-xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <GitCompare className="size-3" />
                Comparação com prévio
              </p>
              <p className="mt-1.5 text-[11px] font-medium text-slate-900 dark:text-slate-100">
                {comparacao.resumo}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                vs. {new Date(comparacao.dataAnterior + 'T12:00:00').toLocaleDateString('pt-BR')}
              </p>
            </section>
          )}

          {/* IA on-demand — botão compacto. Resultado vai abaixo. */}
          {iaStage === 'idle' && (
            <button
              onClick={analisar}
              disabled={selectedIds.size === 0}
              className="group flex w-full items-center gap-2.5 rounded-xl border border-dashed border-teal-300/80 bg-gradient-to-r from-teal-50/50 to-emerald-50/30 px-3 py-2.5 text-left transition-all hover:border-teal-400 hover:bg-teal-50/70 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-teal-300/80 disabled:hover:bg-gradient-to-r disabled:hover:shadow-none dark:border-teal-800/60 dark:from-teal-950/30 dark:to-emerald-950/20 dark:hover:bg-teal-950/40 dark:focus:ring-offset-slate-950"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                <Sparkles className="size-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-slate-900 dark:text-slate-50">
                  {ctaLabel}
                </span>
                <span className="block truncate text-[10px] text-slate-500 dark:text-slate-400">
                  ~30–90s · audit log registrado
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-teal-600 transition-transform group-hover:translate-x-0.5 dark:text-teal-400" />
            </button>
          )}

          {iaStage === 'analyzing' && (
            <section className="rounded-xl border border-teal-200/80 bg-teal-50/40 p-4 dark:border-teal-900/40 dark:bg-teal-950/20">
              <div className="flex items-center gap-2.5">
                <Loader2 className="size-5 animate-spin text-teal-600 dark:text-teal-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                    Analisando…
                  </p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300">
                    Extraindo achados · comparando histórico · cruzando medicação
                  </p>
                </div>
              </div>
            </section>
          )}

          {iaStage === 'done' && iaResult && (
            <section className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50/40 px-3 py-2 dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-[11px] text-emerald-900 dark:text-emerald-200">
                <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">Análise IA pronta — veja os 4 blocos abaixo.</span>
              </div>
              <button
                onClick={() => {
                  setIaStage('idle')
                  setIaResult(null)
                }}
                className="text-[10px] font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
              >
                Reanalisar
              </button>
            </section>
          )}
        </div>
        )}
      </div>

      {/* Resultado da análise — 1 card por linha, full-width abaixo */}
      {iaStage === 'done' && iaResult && (
        <section className="mt-5 overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-b from-emerald-50/40 via-white to-white shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900">
          <header className="flex items-center justify-between gap-2 border-b border-emerald-200/60 bg-emerald-50/40 px-5 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Sparkles className="size-3.5" />
              </span>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800 dark:text-emerald-300">
                  Resultado da análise IA
                </h2>
                <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
                  {iaResult.modeloIA} · gerado{' '}
                  {new Date(iaResult.geradoEm).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </header>

          <div className="space-y-5 p-5">
            {/* Análise por imagem — 1 card por série analisada */}
            {imagensAnalisadas.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Análise por imagem
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 font-mono text-[9px] text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {imagensAnalisadas.length} {imagensAnalisadas.length === 1 ? 'série' : 'séries'}
                  </span>
                </p>
                <div className="space-y-2">
                  {imagensAnalisadas.map((img) => (
                    <ImagemAnalisadaCard
                      key={img.id}
                      imagem={img}
                      highlight={highlights ? highlights[img.mockVisual] : undefined}
                      ativa={img.id === serieAtivaId}
                      onAbrir={() => {
                        setSerieAtivaId(img.id)
                        setZoom(1)
                        setRotacao(0)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Síntese cruzada — blocos integrados */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Síntese cruzada
              </p>
              <div className="space-y-3">
                {iaResult.blocos.map((b) => (
                  <IABlocoLinha key={b.tipo} bloco={b} />
                ))}
              </div>
            </div>
          </div>

          <footer className="flex items-start gap-2 border-t border-emerald-200/60 bg-emerald-50/30 px-5 py-3 text-[11px] leading-relaxed text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200">
            <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-emerald-700 dark:text-emerald-400" />
            <div>
              <p>
                <strong className="font-semibold">Esta análise é uma sugestão de IA.</strong>{' '}
                Decisão clínica é sua. A IA não faz laudo nem substitui interpretação médica.
              </p>
              <button className="mt-1 text-[11px] font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-300">
                Ver log de auditoria (LGPD)
              </button>
            </div>
          </footer>
        </section>
      )}

      {/* Painel salvar — só aparece quando há análise pra commitar */}
      {iaStage === 'done' && iaResult && (
        <section className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-700 dark:text-slate-200">
                <Save className="size-3.5 text-teal-600 dark:text-teal-400" />
                {analiseSalva ? 'Atualizar análise no prontuário' : 'Salvar no prontuário'}
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Análise IA + seu comentário ficam vinculados a este atendimento e ao paciente.
                Documento clínico (CFM 1.821 · 20 anos de retenção).
              </p>
            </div>
            {analiseSalva && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200/70 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="size-3" />
                Salvo em{' '}
                {new Date(analiseSalva.salvoEm).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>

          <label className="mt-4 block">
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200">
              Comentário do médico{' '}
              <span className="font-normal text-slate-400 dark:text-slate-500">(opcional)</span>
            </span>
            <textarea
              value={comentarioMedico}
              onChange={(e) => setComentarioMedico(e.target.value)}
              rows={3}
              placeholder="Concordo com a IA. Conduta: aumentar levotiroxina pra 75mcg, reavaliar TSH em 6 semanas. Acompanhar nódulo TI-RADS 3 em 12 meses."
              disabled={savingStage !== 'idle'}
              className="
                mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] leading-relaxed text-slate-900 placeholder:text-slate-400
                focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                disabled:opacity-60
                dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-600
              "
            />
          </label>

          <div className="mt-4 flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {imagensAnalisadas.length}{' '}
              {imagensAnalisadas.length === 1 ? 'série analisada' : 'séries analisadas'} ·
              modelo {iaResult.modeloIA}
            </p>
            <div className="flex gap-2 sm:shrink-0">
              <button
                onClick={onVoltar}
                disabled={savingStage !== 'idle'}
                className="
                  inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors
                  hover:bg-slate-50
                  focus:outline-none focus:ring-2 focus:ring-slate-500/30
                  disabled:opacity-50
                  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
                "
              >
                Cancelar
              </button>
              <button
                onClick={salvarEFechar}
                disabled={savingStage !== 'idle'}
                className="
                  inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors
                  hover:bg-teal-500
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                  disabled:cursor-not-allowed disabled:opacity-70
                  dark:focus:ring-offset-slate-950
                "
              >
                {savingStage === 'idle' && (
                  <>
                    <Save className="size-3.5" />
                    {analiseSalva ? 'Atualizar e fechar' : 'Salvar e fechar'}
                  </>
                )}
                {savingStage === 'saving' && (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Salvando…
                  </>
                )}
                {savingStage === 'saved' && (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    Salvo no prontuário
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}
      </div>

    </div>,
    document.body,
  )
}

const IA_BLOCO_ICONE: Record<IABlocoTipo, React.ComponentType<{ className?: string }>> = {
  'resumo-laudo': FileText,
  'comparacao-historica': TrendingUp,
  'cruzamento-queixa': MessageSquare,
  'cruzamento-medicacao': Pill,
}

function IABlocoLinha({ bloco }: { bloco: IABloco }) {
  const Icon = IA_BLOCO_ICONE[bloco.tipo]
  const style = IA_BLOCO_STYLE[bloco.tipo]
  return (
    <article
      className={`
        flex gap-3 rounded-xl border-l-4 ${style.accent}
        border border-y-slate-200/60 border-r-slate-200/60 bg-white p-4 shadow-sm
        dark:border-y-slate-800 dark:border-r-slate-800 dark:bg-slate-900
      `}
    >
      <span
        className={`
          mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md
          ${style.iconBg}
        `}
      >
        <Icon className={`size-3.5 ${style.iconText}`} />
      </span>
      <div className="min-w-0 flex-1">
        <header className="mb-1 flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {bloco.titulo}
          </h3>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            {bloco.fonte}
          </span>
        </header>
        <RichText
          texto={bloco.conteudo}
          className="text-[12px] leading-relaxed text-slate-700 dark:text-slate-200"
        />
      </div>
    </article>
  )
}

function ImagemAnalisadaCard({
  imagem,
  highlight,
  ativa,
  onAbrir,
}: {
  imagem: ImagemSerie
  highlight?: { x: number; y: number; r: number; label?: string }
  ativa: boolean
  onAbrir: () => void
}) {
  return (
    <button
      onClick={onAbrir}
      className={`
        group flex w-full items-center gap-3 rounded-lg border bg-white p-2 text-left transition-colors
        hover:border-teal-300 hover:bg-teal-50/30
        dark:bg-slate-900 dark:hover:border-teal-800 dark:hover:bg-teal-950/20
        ${
          ativa
            ? 'border-teal-300 ring-1 ring-teal-400/30 dark:border-teal-800'
            : 'border-slate-200/70 dark:border-slate-800'
        }
      `}
    >
      <div className="size-14 shrink-0 overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
        <ImagemMedicaMock imagem={imagem} highlight={highlight} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-slate-900 dark:text-slate-100">
          {imagem.rotulo}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-600 dark:text-slate-300">
          {imagem.descricao}
        </p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-500" />
    </button>
  )
}

function ToolBtn({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
    >
      <span className="flex size-3.5 items-center justify-center text-[11px] font-semibold leading-none">
        {children}
      </span>
    </button>
  )
}
