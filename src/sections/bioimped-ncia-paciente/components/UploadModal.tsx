import { useEffect, useRef, useState } from 'react'
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Loader2,
  Trash2,
  Wand2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import type {
  CreateBioReadingPayload,
} from '@/../product/sections/bioimped-ncia-paciente/types'

type ModalStep = 'form' | 'processing' | 'success' | 'failure'

interface MetricPreview {
  label: string
  value: string
  unit: string
}

interface UploadResult {
  ok: boolean
  examId?: string
  /** Quando ok: prévia rápida das métricas extraídas. */
  preview?: MetricPreview[]
  /** Quando falha: motivo. */
  reason?: string
}

interface UploadModalProps {
  open: boolean
  onClose: () => void
  examTypeId: string | null
  onSubmit: (payload: CreateBioReadingPayload) => void
  /** Quando preenchido, modal transiciona pra success/failure. */
  result?: UploadResult | null
  /** Abrir detail drawer da leitura recém-criada. */
  onOpenResult?: (examId: string) => void
  isUploading?: boolean
  /** Tempo médio em segundos pra mostrar nos rótulos. */
  estimatedSeconds?: number
}

function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const PROCESSING_PHASES = [
  'Detectando display da balança',
  'Lendo métricas',
  'Validando valores',
  'Gerando análise',
]

export function UploadModal({
  open,
  onClose,
  examTypeId,
  onSubmit,
  result,
  onOpenResult,
  isUploading,
  estimatedSeconds = 15,
}: UploadModalProps) {
  const [step, setStep] = useState<ModalStep>('form')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [examDate, setExamDate] = useState('')
  const [notes, setNotes] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [phase, setPhase] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (open) {
      setStep('form')
      setFile(null)
      setPreview(null)
      setExamDate(todayISO())
      setNotes('')
      setElapsed(0)
      setPhase(0)
    } else if (preview) {
      URL.revokeObjectURL(preview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && step !== 'processing') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, step])

  // Cronômetro + rotação de fases durante processing
  useEffect(() => {
    if (step !== 'processing') {
      if (tickRef.current) {
        clearInterval(tickRef.current)
        tickRef.current = null
      }
      return
    }
    tickRef.current = setInterval(() => {
      setElapsed((e) => e + 1)
      setPhase((p) => (p + 1) % PROCESSING_PHASES.length)
    }, 1500)
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [step])

  // Quando result chega de fora → transiciona
  useEffect(() => {
    if (!result) return
    if (step === 'processing' || step === 'form') {
      setStep(result.ok ? 'success' : 'failure')
    }
  }, [result, step])

  function handleFile(f: File | null) {
    if (preview) URL.revokeObjectURL(preview)
    setFile(f)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  function handleSubmit() {
    if (!file || !examTypeId || !examDate) return
    onSubmit({
      examTypeId,
      file,
      examDate,
      notes: notes || undefined,
    })
    setStep('processing')
    setElapsed(0)
    setPhase(0)
  }

  function handleRetry() {
    setStep('form')
    setElapsed(0)
  }

  const valid = !!file && !!examDate && !!examTypeId

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => step !== 'processing' && onClose()}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nova leitura"
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-slate-900 md:max-w-xl md:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {step === 'form' && 'Nova leitura'}
              {step === 'processing' && 'Analisando…'}
              {step === 'success' && 'Pronto!'}
              {step === 'failure' && 'Não foi possível extrair'}
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              {step === 'form' && (
                <>
                  <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  IA detecta a marca e extrai todas as métricas em ~{estimatedSeconds}s
                </>
              )}
              {step === 'processing' && (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-emerald-600 dark:text-emerald-400" />
                  {PROCESSING_PHASES[phase]}…
                </>
              )}
              {step === 'success' && (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  Composição corporal extraída com sucesso
                </>
              )}
              {step === 'failure' && (
                <>
                  <AlertCircle className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                  Verifique a foto e tente novamente
                </>
              )}
            </p>
          </div>
          {step !== 'processing' && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'form' && (
            <>
              {!file ? (
                <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 px-4 py-8 text-center dark:border-emerald-500/40 dark:bg-emerald-500/5">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
                    <Camera className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-100">
                    Aponte pra balança após pesagem
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Enquadre o display com todas as métricas visíveis
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => cameraRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Tirar foto
                    </button>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Da galeria
                    </button>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                  <input
                    ref={cameraRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative mx-auto aspect-[3/4] max-w-[240px] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleFile(null)}
                      className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-700 shadow-sm transition hover:bg-rose-50"
                      aria-label="Remover"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-start gap-2 rounded-2xl bg-emerald-50/60 px-3 py-2 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
                    <Wand2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
                      A <span className="font-semibold">marca da balança</span> é detectada automaticamente pela IA a partir do display.
                    </p>
                  </div>

                  <label className="block">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Data da leitura
                    </span>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </label>

                  <label className="block">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Notas <span className="font-normal italic">(opcional)</span>
                    </span>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: após treino, em jejum"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </label>
                </div>
              )}
            </>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 -m-3 animate-ping rounded-full bg-emerald-400/30" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                  <Sparkles className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-5 font-mono text-sm font-bold text-slate-900 dark:text-slate-50">
                {Math.floor(elapsed * 1.5)}s
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {PROCESSING_PHASES[phase]}…
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                A IA está extraindo todas as métricas da foto
              </p>

              {/* Progress indeterminada */}
              <div className="mt-5 w-full max-w-xs overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-1.5 w-1/3 animate-[shimmer_1.4s_linear_infinite] rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />
              </div>
              <style>{`
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(300%); }
                }
              `}</style>
            </div>
          )}

          {step === 'success' && result?.preview && (
            <div className="space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                {result.preview.length} métricas extraídas
              </p>
              <div className="grid grid-cols-2 gap-2">
                {result.preview.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {m.label}
                    </p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-mono text-lg font-bold text-slate-900 dark:text-slate-50">
                        {m.value}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {m.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'failure' && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                <AlertCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                A IA não conseguiu ler o display
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {result?.reason ??
                  'Foto fora de foco, display parcialmente coberto ou marca não suportada.'}
              </p>
              <ul className="mx-auto max-w-xs space-y-1 text-left text-[11px] text-slate-500 dark:text-slate-400">
                <li>• Garanta boa iluminação no display</li>
                <li>• Enquadre todas as métricas visíveis</li>
                <li>• Evite reflexos e sombras</li>
              </ul>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/60">
          {step === 'form' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!valid || isUploading}
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Enviar e analisar
              </button>
            </>
          )}
          {step === 'processing' && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              Continuar em background
            </button>
          )}
          {step === 'success' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (result?.examId) onOpenResult?.(result.examId)
                  onClose()
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                Ver leitura completa
              </button>
            </>
          )}
          {step === 'failure' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
              >
                Salvar mesmo assim
              </button>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Tentar outra foto
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  )
}
