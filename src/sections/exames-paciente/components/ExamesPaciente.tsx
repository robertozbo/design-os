import { useEffect, useMemo, useState } from 'react'
import {
  FileText,
  CheckCircle2,
  Loader2,
  Wand2,
  AlertCircle,
  TrendingUp,
  FlaskConical,
  Shield,
  Plus,
  type LucideIcon,
} from 'lucide-react'
import type {
  CreateExamPayload,
  Exam,
  ExamCategoryId,
  ExamResultInput,
  ExamStatus,
  ExamTypeInfo,
  ExamesPacienteProps,
} from '@/../product/sections/exames-paciente/types'
import { ExamCard } from './ExamCard'
import { ExamDetailDrawer } from './ExamDetailDrawer'
import { UploadModal } from './UploadModal'

interface StatPillProps {
  label: string
  value: string | number
  Icon: React.ComponentType<{ className?: string }>
  tone: 'slate' | 'amber' | 'emerald' | 'rose'
}

const TONE_STYLES = {
  slate:
    'bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:ring-slate-700',
  amber:
    'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
  emerald:
    'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
  rose:
    'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
}

const CATEGORY_ICON: Record<ExamCategoryId, LucideIcon> = {
  all: FileText,
  laboratorial: FlaskConical,
  preventivo: Shield,
}

const CATEGORY_THEME: Record<
  ExamCategoryId,
  { iconBg: string; iconText: string; cardHover: string; ring: string }
> = {
  all: {
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconText: 'text-slate-700 dark:text-slate-300',
    cardHover: 'hover:border-slate-300 dark:hover:border-slate-700',
    ring: 'ring-slate-200/60 dark:ring-slate-700/60',
  },
  laboratorial: {
    iconBg: 'bg-amber-100 dark:bg-amber-500/20',
    iconText: 'text-amber-700 dark:text-amber-300',
    cardHover: 'hover:border-amber-400 dark:hover:border-amber-500/50',
    ring: 'ring-amber-200/60 dark:ring-amber-500/30',
  },
  preventivo: {
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
    iconText: 'text-emerald-700 dark:text-emerald-300',
    cardHover: 'hover:border-emerald-400 dark:hover:border-emerald-500/50',
    ring: 'ring-emerald-200/60 dark:ring-emerald-500/30',
  },
}

function StatPill({ label, value, Icon, tone }: StatPillProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 ${TONE_STYLES[tone]}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/60 dark:bg-slate-900/40">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-lg font-bold leading-none">{value}</p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-80">
          {label}
        </p>
      </div>
    </div>
  )
}

interface UploadResult {
  ok: boolean
  examId?: string
  preview?: Array<{ label: string; value: string; unit: string }>
  reason?: string
}

function resolveCategory(
  examTypeId: string,
  examTypes: ExamTypeInfo[],
): ExamCategoryId {
  const t = examTypes.find((x) => x.value === examTypeId)
  return (t?.category as ExamCategoryId) ?? 'outros'
}

interface ExamTypeCardProps {
  examType: ExamTypeInfo
  onSelect: () => void
}

function ExamTypeCard({ examType, onSelect }: ExamTypeCardProps) {
  const category = (examType.category as ExamCategoryId) ?? 'outros'
  const Icon = CATEGORY_ICON[category] ?? FileText
  const theme = CATEGORY_THEME[category] ?? CATEGORY_THEME.outros
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex flex-col items-start gap-3 rounded-2xl border-2 border-transparent bg-white p-4 text-left shadow-sm ring-1 transition hover:shadow-md dark:bg-slate-900 ${theme.ring} ${theme.cardHover}`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl transition group-hover:scale-105 ${theme.iconBg} ${theme.iconText}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-bold leading-tight text-slate-900 dark:text-slate-50">
          {examType.label}
        </p>
        {examType.description && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
            {examType.description}
          </p>
        )}
      </div>
    </button>
  )
}

export function ExamesPaciente({
  stats,
  examTypes,
  categories,
  statusOptions,
  exams,
  processingIds,
  activeCategory,
  activeStatus,
  onCategoryChange,
  onStatusChange,
  onOpenExam,
  onCreateExam,
  onUpdateExam,
  onDeleteExam,
  onConfirmResults,
  onOpenAIChat,
  onShareWithProfessional,
  onDownloadFile,
  onOpenAnalysis,
  isUploading,
  resultsByExamId,
}: ExamesPacienteProps & {
  resultsByExamId?: Record<string, ExamResultInput[]>
}) {
  const [internalCategory, setInternalCategory] = useState<ExamCategoryId>(
    activeCategory ?? 'all',
  )
  const [internalStatus, setInternalStatus] = useState<ExamStatus | 'all'>(
    activeStatus ?? 'all',
  )
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)
  const [uploadTypeId, setUploadTypeId] = useState<string | null>(null)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

  const categoryByExamId = useMemo(() => {
    const map = new Map<string, ExamCategoryId>()
    for (const e of exams) {
      map.set(e.id, resolveCategory(e.examTypeId, examTypes))
    }
    return map
  }, [exams, examTypes])

  const processingIdSet = useMemo(
    () => new Set(processingIds ?? []),
    [processingIds],
  )

  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      const cat = categoryByExamId.get(e.id) ?? 'outros'
      if (internalCategory !== 'all' && cat !== internalCategory) return false
      if (internalStatus !== 'all' && e.status !== internalStatus) return false
      return true
    })
  }, [exams, categoryByExamId, internalCategory, internalStatus])

  const selectedExam = exams.find((e) => e.id === selectedExamId) ?? null
  const selectedConfirmed = selectedExam
    ? resultsByExamId?.[selectedExam.id]
    : undefined
  const selectedNeedsConfirmation =
    !!selectedExam &&
    selectedExam.status === 'processed' &&
    !selectedConfirmed &&
    !!selectedExam.extractedData?.parameters?.length

  const uploadType = uploadTypeId
    ? examTypes.find((t) => t.value === uploadTypeId) ?? null
    : null

  function pickCategory(id: ExamCategoryId) {
    setInternalCategory(id)
    onCategoryChange?.(id)
  }

  function pickStatus(s: ExamStatus | 'all') {
    setInternalStatus(s)
    onStatusChange?.(s)
  }

  function openExam(id: string) {
    setSelectedExamId(id)
    onOpenExam?.(id)
  }

  function handleCreateExam(payload: CreateExamPayload) {
    onCreateExam?.(payload)
    setUploadResult(null)
    setTimeout(() => {
      const ref = exams.find(
        (e) =>
          e.status === 'processed' &&
          e.extractedData?.parameters &&
          e.extractedData.parameters.length > 0,
      )
      if (ref && ref.extractedData?.parameters) {
        const params = ref.extractedData.parameters.slice(0, 4)
        setUploadResult({
          ok: true,
          examId: ref.id,
          preview: params.map((p) => ({
            label: p.name,
            value:
              typeof p.value === 'number'
                ? p.value.toLocaleString('pt-BR')
                : String(p.value),
            unit: p.unit ?? '',
          })),
        })
      } else {
        setUploadResult({
          ok: false,
          reason: 'Nenhum exame de referência disponível no mock',
        })
      }
    }, 5000)
  }

  useEffect(() => {
    if (!uploadTypeId) setUploadResult(null)
  }, [uploadTypeId])

  return (
    <div
      data-nymos-exames-paciente
      className="min-h-full bg-slate-50/60 dark:bg-slate-950"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
        {/* Page header */}
        <header className="mb-6 md:mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            Exames
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
            Exames
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Envie seus exames e receba análise inteligente com extração
            automática de biomarcadores.
          </p>
        </header>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatPill
            label="Total"
            value={stats.totalExams}
            Icon={FileText}
            tone="slate"
          />
          <StatPill
            label="Aguardando"
            value={stats.pendingExams}
            Icon={Loader2}
            tone="amber"
          />
          <StatPill
            label="Prontos"
            value={stats.processedExams}
            Icon={CheckCircle2}
            tone="emerald"
          />
          <StatPill
            label="Falhados"
            value={stats.failedExams}
            Icon={AlertCircle}
            tone="rose"
          />
        </div>

        {/* Type picker — substitui o antigo hero card */}
        <section className="mb-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
                <Plus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Que tipo de exame você vai enviar?
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Escolha o tipo e abra o upload — PDF, JPG ou PNG até 20MB · IA
                extrai em ~30s.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {examTypes.map((t) => (
              <ExamTypeCard
                key={t.value}
                examType={t}
                onSelect={() => setUploadTypeId(t.value)}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onOpenAIChat?.('lab_exam')}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30 dark:hover:bg-emerald-500/20"
            >
              <Wand2 className="h-3 w-3" />
              Enviar via ai-chat
            </button>
            <button
              type="button"
              onClick={() => onOpenAnalysis?.()}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 transition hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400"
            >
              <TrendingUp className="h-3 w-3" />
              Evolução por biomarcador →
            </button>
          </div>
        </section>

        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0">
            {categories.map((cat) => {
              const active = internalCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => pickCategory(cat.id)}
                  className={`inline-flex shrink-0 items-center rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-2">
            {processingIdSet.size > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30">
                <Loader2 className="h-3 w-3 animate-spin" />
                Atualizando…
              </span>
            )}
            <select
              value={internalStatus}
              onChange={(e) => pickStatus(e.target.value as ExamStatus | 'all')}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exam list */}
        {filteredExams.length === 0 ? (
          <section className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/40 p-10 text-center dark:border-slate-700 dark:bg-slate-800/30">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <FileText className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-100">
              {exams.length === 0
                ? 'Nenhum exame enviado'
                : 'Nenhum exame com esses filtros'}
            </p>
            <p className="mt-1.5 max-w-sm mx-auto text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {exams.length === 0
                ? 'Escolha um tipo acima pra enviar o primeiro exame'
                : 'Ajuste os filtros pra ver mais resultados'}
            </p>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                category={categoryByExamId.get(exam.id) ?? 'outros'}
                isPolling={processingIdSet.has(exam.id)}
                confirmedResults={resultsByExamId?.[exam.id]}
                onOpen={() => openExam(exam.id)}
              />
            ))}
          </div>
        )}
      </div>

      <ExamDetailDrawer
        exam={selectedExam}
        confirmedResults={selectedConfirmed}
        needsConfirmation={selectedNeedsConfirmation}
        open={!!selectedExam}
        onClose={() => setSelectedExamId(null)}
        onEdit={(id) => onUpdateExam?.({ id })}
        onShare={onShareWithProfessional}
        onDelete={(id) => {
          onDeleteExam?.(id)
          setSelectedExamId(null)
        }}
        onDownloadFile={onDownloadFile}
        onOpenAnalysis={onOpenAnalysis}
        onConfirmResults={(id) => {
          onConfirmResults?.(id, { results: [], examNotes: null })
        }}
      />

      <UploadModal
        open={!!uploadType}
        onClose={() => setUploadTypeId(null)}
        examType={uploadType}
        isUploading={isUploading}
        result={uploadResult}
        onSubmit={handleCreateExam}
        onOpenResult={(id) => {
          setSelectedExamId(id)
        }}
      />
    </div>
  )
}

