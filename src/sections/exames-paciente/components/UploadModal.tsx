import { useEffect, useRef, useState } from 'react'
import {
  X,
  Upload,
  Camera,
  FileText,
  Sparkles,
  Loader2,
  Trash2,
  FileImage,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  FlaskConical,
  Shield,
  type LucideIcon,
} from 'lucide-react'
import type {
  CreateExamPayload,
  ExamCategoryId,
  ExamTypeInfo,
} from '@/../product/sections/exames-paciente/types'

type ModalStep = 'form' | 'processing' | 'success' | 'failure'

interface MetricPreview {
  label: string
  value: string
  unit: string
}

interface UploadResult {
  ok: boolean
  examId?: string
  preview?: MetricPreview[]
  reason?: string
}

interface UploadModalProps {
  open: boolean
  onClose: () => void
  /** Tipo de exame já escolhido fora do modal (picker do hero). */
  examType: ExamTypeInfo | null
  onSubmit: (payload: CreateExamPayload) => void
  /** Quando preenchido, modal transiciona pra success/failure. */
  result?: UploadResult | null
  onOpenResult?: (examId: string) => void
  isUploading?: boolean
  estimatedSeconds?: number
}

const CATEGORY_ICON: Record<ExamCategoryId, LucideIcon> = {
  all: FileText,
  laboratorial: FlaskConical,
  preventivo: Shield,
}

const CATEGORY_THEME: Record<
  ExamCategoryId,
  { bg: string; text: string; ring: string }
> = {
  all: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    ring: 'ring-slate-200 dark:ring-slate-700',
  },
  laboratorial: {
    bg: 'bg-amber-100 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-200 dark:ring-amber-500/30',
  },
  preventivo: {
    bg: 'bg-emerald-100 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    ring: 'ring-emerald-200 dark:ring-emerald-500/30',
  },
}

const PROCESSING_PHASES = [
  'Lendo o arquivo',
  'Identificando biomarcadores',
  'Validando referências',
  'Gerando análise',
]

function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadModal({
  open,
  onClose,
  examType,
  onSubmit,
  result,
  onOpenResult,
  isUploading,
  estimatedSeconds = 30,
}: UploadModalProps) {
  const [step, setStep] = useState<ModalStep>('form')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [examDate, setExamDate] = useState('')
  const [notes, setNotes] = useState('')
  const [showDateError, setShowDateError] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [phase, setPhase] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (open) {
      setStep('form')
      setFile(null)
      setPreview(null)
      setExamDate('')
      setNotes('')
      setShowDateError(false)
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

  // Cronômetro + fases rotativas
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
    setPreview(
      f && f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
    )
  }

  function handleSubmit() {
    if (!file || !examType) return
    if (!examDate) {
      setShowDateError(true)
      dateRef.current?.focus()
      return
    }
    onSubmit({
      examTypeId: examType.value,
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

  const aiEnabled = examType?.aiProcessorType !== 'none'
  const category = (examType?.category as ExamCategoryId) ?? 'outros'
  const CatIcon = CATEGORY_ICON[category] ?? FileText
  const catTheme = CATEGORY_THEME[category] ?? CATEGORY_THEME.outros

  if (!open || !examType) return null

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
        aria-label="Enviar exame"
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-slate-900 md:max-w-2xl md:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {step === 'form' && 'Enviar exame'}
              {step === 'processing' && 'Analisando…'}
              {step === 'success' && 'Pronto!'}
              {step === 'failure' && 'Não foi possível extrair'}
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              {step === 'form' && (
                <>
                  <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  {aiEnabled
                    ? `Análise por IA inclusa · ~${estimatedSeconds}s`
                    : 'Sem análise automática pra este tipo'}
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
                  Biomarcadores extraídos com sucesso
                </>
              )}
              {step === 'failure' && (
                <>
                  <AlertCircle className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                  Verifique o arquivo e tente novamente
                </>
              )}
            </p>
          </div>
          {step !== 'processing' && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'form' && (
            <div className="space-y-5">
              {/* Type chip (locked) */}
              <div
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 ${catTheme.ring} ${catTheme.bg}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 dark:bg-slate-900/40 ${catTheme.text}`}
                >
                  <CatIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider opacity-80 ${catTheme.text}`}
                  >
                    Tipo selecionado
                  </p>
                  <p
                    className={`truncate text-sm font-bold ${catTheme.text}`}
                  >
                    {examType.label}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className={`shrink-0 text-[11px] font-semibold underline-offset-2 transition hover:underline ${catTheme.text}`}
                >
                  Trocar
                </button>
              </div>

              {/* Drop zone */}
              {!file ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    handleFile(e.dataTransfer.files[0] ?? null)
                  }}
                  className={`rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-500/10'
                      : 'border-slate-300 bg-slate-50/40 dark:border-slate-700 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-100">
                    Arraste seu arquivo aqui
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    PDF, JPG ou PNG · 1 arquivo por exame · até 20MB
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Selecionar arquivo
                    </button>
                    <button
                      type="button"
                      onClick={() => cameraRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700 sm:hidden"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Tirar foto
                    </button>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf,image/png,image/jpeg"
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
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    {preview ? (
                      <img
                        src={preview}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    ) : file.type.includes('pdf') ? (
                      <FileText className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    ) : (
                      <FileImage className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {file.name}
                    </p>
                    <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      {formatSize(file.size)} · {file.type || 'arquivo'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFile(null)}
                    aria-label="Remover arquivo"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/15 dark:hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Date (obrigatória) */}
              <label className="block">
                <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Data do exame
                  <span
                    className="text-rose-600 dark:text-rose-400"
                    aria-hidden
                  >
                    *
                  </span>
                  <span className="sr-only">obrigatório</span>
                </span>
                <input
                  ref={dateRef}
                  type="date"
                  required
                  aria-required="true"
                  aria-invalid={showDateError && !examDate}
                  value={examDate}
                  onChange={(e) => {
                    setExamDate(e.target.value)
                    if (e.target.value) setShowDateError(false)
                  }}
                  max={todayISO()}
                  className={`mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 font-mono text-sm text-slate-900 transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-100 ${
                    showDateError && !examDate
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500/60'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-700'
                  }`}
                />
                {showDateError && !examDate && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                    <AlertCircle className="h-3 w-3" />
                    Informe a data em que o exame foi realizado
                  </p>
                )}
              </label>

              {/* Notes (opcional) */}
              <label className="block">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Notas <span className="font-normal italic">(opcional)</span>
                </span>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Solicitado pela Dra. Camila"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </label>
            </div>
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
                A IA está lendo o arquivo e extraindo biomarcadores
              </p>
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
                {result.preview.length} biomarcador
                {result.preview.length !== 1 ? 'es' : ''} extraído
                {result.preview.length !== 1 ? 's' : ''}
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
              <p className="rounded-2xl bg-amber-50/60 px-3 py-2 text-center text-[11px] text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                Revise os valores extraídos antes de confirmar
              </p>
            </div>
          )}

          {step === 'failure' && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                <AlertCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                A IA não conseguiu ler o arquivo
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {result?.reason ??
                  'Arquivo ilegível, formato não suportado ou tipo de exame incompatível com OCR.'}
              </p>
              <ul className="mx-auto max-w-xs space-y-1 text-left text-[11px] text-slate-500 dark:text-slate-400">
                <li>• Certifique-se que o PDF não está protegido por senha</li>
                <li>• Use boa iluminação se for foto</li>
                <li>• Confira se o tipo de exame está correto</li>
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
                disabled={!file || isUploading}
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
                Revisar e confirmar
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
                Tentar outro arquivo
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  )
}
