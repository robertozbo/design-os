import { useEffect } from 'react'
import {
  X,
  FileText,
  FileImage,
  Download,
  Sparkles,
  Lightbulb,
  ListChecks,
  Trash2,
  Share2,
  Pencil,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react'
import type {
  BiomarkerStatus,
  Exam,
  ExamResultInput,
} from '@/../product/sections/exames-paciente/types'

interface ExamDetailDrawerProps {
  exam: Exam | null
  /** Biomarcadores confirmados (persistidos em `exam_results`). */
  confirmedResults?: ExamResultInput[]
  /** Quando true, exibe banner "aguardando confirmação humana". */
  needsConfirmation?: boolean
  open: boolean
  onClose: () => void
  onEdit?: (id: string) => void
  onShare?: (id: string) => void
  onDelete?: (id: string) => void
  onDownloadFile?: (examId: string) => void
  onOpenAnalysis?: (biomarkerCode: string) => void
  onConfirmResults?: (examId: string) => void
}

const BIOMARKER_STATUS_STYLE: Record<
  BiomarkerStatus,
  { bg: string; text: string; label: string }
> = {
  normal: {
    bg: 'bg-emerald-50 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    label: 'Normal',
  },
  low: {
    bg: 'bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30',
    text: 'text-amber-700 dark:text-amber-300',
    label: 'Baixo',
  },
  high: {
    bg: 'bg-orange-50 ring-orange-200 dark:bg-orange-500/10 dark:ring-orange-500/30',
    text: 'text-orange-700 dark:text-orange-300',
    label: 'Alto',
  },
  unknown: {
    bg: 'bg-slate-50 ring-slate-200 dark:bg-slate-500/10 dark:ring-slate-500/30',
    text: 'text-slate-600 dark:text-slate-300',
    label: '—',
  },
}

const BIOMARKER_LABELS: Record<string, string> = {
  HGB: 'Hemoglobina',
  HCT: 'Hematócrito',
  GLUC_FAST: 'Glicemia jejum',
  CHOL_TOTAL: 'Colesterol total',
  LDL_CHOL: 'LDL',
  HDL_CHOL: 'HDL',
  TRIG: 'Triglicérides',
  HBA1C: 'HbA1c',
  TSH: 'TSH',
  T4_FREE: 'T4 livre',
  E2: 'Estradiol',
  PROG: 'Progesterona',
  FSH: 'FSH',
  LH: 'LH',
  HR_REST: 'Freq. cardíaca',
  ECG_PR: 'Intervalo PR',
  ECG_QRS: 'QRS',
}

function biomarkerLabel(code: string): string {
  return BIOMARKER_LABELS[code] ?? code
}

function normalizeStatus(s: string | undefined): BiomarkerStatus {
  const v = (s ?? '').toLowerCase()
  if (v === 'normal') return 'normal'
  if (v === 'low' || v === 'below') return 'low'
  if (v === 'high' || v === 'above' || v === 'warning' || v === 'critical')
    return 'high'
  return 'unknown'
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  return `${formatDate(iso)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatReference(
  min: number | null,
  max: number | null,
  unit: string,
): string {
  if (min == null && max == null) return '—'
  if (min != null && max != null) return `${min}–${max} ${unit}`
  if (max != null) return `<${max} ${unit}`
  return `>${min} ${unit}`
}

interface RowData {
  code: string
  label: string
  value: number | string
  unit: string
  status: BiomarkerStatus
  reference: string
  confidence?: number
}

function FileIconBlock({
  mimeType,
  size = 'sm',
}: {
  mimeType: string
  size?: 'sm' | 'md'
}) {
  const dim = size === 'md' ? 'h-12 w-12' : 'h-10 w-10'
  const icoDim = size === 'md' ? 'h-5 w-5' : 'h-4 w-4'
  const isPdf = mimeType?.includes('pdf')
  const Icon: LucideIcon = isPdf ? FileText : FileImage
  const color = isPdf
    ? 'text-rose-600 dark:text-rose-400'
    : 'text-emerald-600 dark:text-emerald-400'
  return (
    <div
      className={`flex ${dim} shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800`}
    >
      <Icon className={`${icoDim} ${color}`} />
    </div>
  )
}

export function ExamDetailDrawer({
  exam,
  confirmedResults,
  needsConfirmation,
  open,
  onClose,
  onEdit,
  onShare,
  onDelete,
  onDownloadFile,
  onOpenAnalysis,
  onConfirmResults,
}: ExamDetailDrawerProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open || !exam) return null

  // Resolve linhas de biomarcadores — preferência:
  // 1. confirmedResults (persistidos, com confidence)
  // 2. extractedData.parameters (output da IA, sem confirmação)
  const rows: RowData[] = (() => {
    if (confirmedResults && confirmedResults.length > 0) {
      return confirmedResults.map((r) => ({
        code: r.biomarkerCode,
        label: biomarkerLabel(r.biomarkerCode),
        value: r.value,
        unit: r.unit,
        status: r.status,
        reference: formatReference(r.referenceMin, r.referenceMax, r.unit),
        confidence: r.confidence,
      }))
    }
    const params = exam.extractedData?.parameters ?? []
    return params.map((p) => ({
      code: p.name,
      label: p.name,
      value: p.value,
      unit: p.unit ?? '',
      status: normalizeStatus(p.status),
      reference: formatReference(
        p.referenceMin ?? null,
        p.referenceMax ?? null,
        p.unit ?? '',
      ),
    }))
  })()

  const ed = exam.extractedData
  const title = exam.examType?.displayName ?? exam.fileName
  const categoryLabel = exam.examType?.displayName ?? 'Exame'

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes — ${title}`}
        className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900 md:max-w-2xl"
      >
        <header className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-5 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                {categoryLabel}
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {title}
              </h2>
              <p className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono">{formatDate(exam.examDate)}</span>
                {exam.notes && (
                  <>
                    <span>·</span>
                    <span className="truncate">{exam.notes}</span>
                  </>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* Banner: aguardando confirmação */}
          {needsConfirmation && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 dark:border-amber-500/30 dark:bg-amber-500/10">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Aguardando confirmação
                </p>
                <p className="mt-0.5 text-xs text-amber-900 dark:text-amber-200">
                  Os valores abaixo foram extraídos pela IA. Revise e confirme
                  pra persistir como exam_results.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onConfirmResults?.(exam.id)}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-amber-600/20 transition hover:bg-amber-700"
              >
                Revisar agora
              </button>
            </div>
          )}

          {/* Resultados */}
          {rows.length > 0 && (
            <section>
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {confirmedResults ? 'Biomarcadores' : 'Resultados extraídos'}
              </h3>
              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Marcador
                      </th>
                      <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Valor
                      </th>
                      <th className="hidden px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:table-cell">
                        Referência
                      </th>
                      <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {rows.map((r) => {
                      const style = BIOMARKER_STATUS_STYLE[r.status]
                      const valueStr =
                        typeof r.value === 'number'
                          ? r.value.toLocaleString('pt-BR')
                          : r.value
                      const clickable = !!onOpenAnalysis && !!confirmedResults
                      return (
                        <tr
                          key={r.code}
                          className={
                            clickable
                              ? 'cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/40'
                              : ''
                          }
                          onClick={() =>
                            clickable && onOpenAnalysis?.(r.code)
                          }
                        >
                          <td className="px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                            {r.label}
                            {r.confidence != null && r.confidence < 0.85 && (
                              <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                                IA {Math.round(r.confidence * 100)}%
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-50">
                              {valueStr}
                            </span>
                            {r.unit && (
                              <span className="ml-1 text-[10px] text-slate-500 dark:text-slate-400">
                                {r.unit}
                              </span>
                            )}
                          </td>
                          <td className="hidden px-3 py-2.5 text-right font-mono text-[11px] text-slate-500 dark:text-slate-400 sm:table-cell">
                            {r.reference}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${style.bg} ${style.text}`}
                            >
                              {style.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Análise IA — campos opcionais de extractedData */}
          {(ed?.summary || ed?.findings || ed?.recommendations) && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                Análise IA
              </h3>
              <div className="space-y-3">
                {ed?.summary && (
                  <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 p-4 dark:border-emerald-500/30 dark:from-emerald-500/5 dark:via-slate-900 dark:to-teal-500/5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Resumo
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {ed.summary}
                    </p>
                    {ed.extractedAt && (
                      <p className="mt-3 font-mono text-[10px] text-slate-400">
                        Analisado em {formatDateTime(ed.extractedAt)}
                      </p>
                    )}
                  </div>
                )}

                {ed?.findings && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      <Lightbulb className="h-3 w-3" />
                      Insights
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {ed.findings}
                    </p>
                  </div>
                )}

                {ed?.recommendations && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      <ListChecks className="h-3 w-3" />
                      Recomendações
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {ed.recommendations}
                    </p>
                  </div>
                )}

                {(ed?.labName || ed?.confidence != null) && (
                  <p className="font-mono text-[10px] text-slate-400">
                    {ed?.labName && <>Lab: {ed.labName}</>}
                    {ed?.labName && ed?.confidence != null && ' · '}
                    {ed?.confidence != null && (
                      <>Confiança IA: {Math.round(ed.confidence * 100)}%</>
                    )}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Arquivo (único) */}
          <section>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Arquivo enviado
            </h3>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
              <FileIconBlock mimeType={exam.fileMimeType} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {exam.fileName}
                </p>
                <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                  {formatSize(exam.fileSize)} · {exam.fileMimeType}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDownloadFile?.(exam.id)}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Download className="h-3 w-3" />
                Baixar
              </button>
            </div>
          </section>

          {/* Metadata */}
          <section>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Metadata
            </h3>
            <dl className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <MetaRow label="Exam ID" value={exam.id} mono />
              <MetaRow
                label="Tipo"
                value={exam.examType?.displayName ?? exam.examTypeId}
              />
              <MetaRow label="Status" value={exam.status} />
              <MetaRow label="Data exame" value={formatDate(exam.examDate)} mono />
              <MetaRow label="Enviado em" value={formatDateTime(exam.createdAt)} mono />
              <MetaRow
                label="Atualizado"
                value={formatDateTime(exam.updatedAt)}
                mono
              />
            </dl>
          </section>
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/60">
          <button
            type="button"
            onClick={() => onDelete?.(exam.id)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
          >
            <Trash2 className="h-3 w-3" />
            Excluir
          </button>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => onShare?.(exam.id)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Share2 className="h-3 w-3" />
              Compartilhar
            </button>
            <button
              type="button"
              onClick={() => onEdit?.(exam.id)}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              <Pencil className="h-3 w-3" />
              Editar
            </button>
          </div>
        </footer>
      </aside>
    </div>
  )
}

function MetaRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd
        className={`mt-0.5 truncate text-xs text-slate-900 dark:text-slate-100 ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </dd>
    </div>
  )
}
