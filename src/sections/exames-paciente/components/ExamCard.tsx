import {
  FlaskConical,
  Shield,
  FileText,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  type LucideIcon,
} from 'lucide-react'
import type {
  BiomarkerStatus,
  Exam,
  ExamCategoryId,
  ExamResultInput,
  ExamStatus,
  ExtractedParameter,
} from '@/../product/sections/exames-paciente/types'

/**
 * Status sintético exibido no card — combina status persistido do Exam
 * com o status derivado de `analysis-status` (polling).
 */
type CardStatus = ExamStatus | 'processing'

const CATEGORY_ICON: Record<ExamCategoryId, LucideIcon> = {
  all: FileText,
  laboratorial: FlaskConical,
  preventivo: Shield,
}

const CATEGORY_THEME: Record<
  ExamCategoryId,
  { border: string; iconBg: string; iconColor: string }
> = {
  all: {
    border: 'before:bg-slate-400',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-700 dark:text-slate-300',
  },
  laboratorial: {
    border: 'before:bg-amber-500',
    iconBg: 'bg-amber-100 dark:bg-amber-500/20',
    iconColor: 'text-amber-700 dark:text-amber-300',
  },
  preventivo: {
    border: 'before:bg-emerald-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-700 dark:text-emerald-300',
  },
}

const STATUS_THEME: Record<
  CardStatus,
  { label: string; bg: string; text: string; ring: string; Icon: LucideIcon }
> = {
  pending: {
    label: 'Aguardando',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    ring: 'ring-slate-200 dark:ring-slate-700',
    Icon: Clock,
  },
  processing: {
    label: 'Processando',
    bg: 'bg-amber-100 dark:bg-amber-500/15',
    text: 'text-amber-800 dark:text-amber-300',
    ring: 'ring-amber-200 dark:ring-amber-500/30',
    Icon: Loader2,
  },
  processed: {
    label: 'Pronto',
    bg: 'bg-emerald-100 dark:bg-emerald-500/15',
    text: 'text-emerald-800 dark:text-emerald-300',
    ring: 'ring-emerald-200 dark:ring-emerald-500/30',
    Icon: CheckCircle2,
  },
  failed: {
    label: 'Falhou',
    bg: 'bg-rose-100 dark:bg-rose-500/15',
    text: 'text-rose-800 dark:text-rose-300',
    ring: 'ring-rose-200 dark:ring-rose-500/30',
    Icon: AlertCircle,
  },
}

const BIOMARKER_STATUS_STYLE: Record<BiomarkerStatus, string> = {
  normal:
    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
  low: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
  high: 'bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30',
  unknown:
    'bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/30',
}

function formatExamDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

function StatusBadge({ status }: { status: CardStatus }) {
  const theme = STATUS_THEME[status]
  const Icon = theme.Icon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${theme.bg} ${theme.text} ${theme.ring}`}
    >
      <Icon
        className={`h-3 w-3 ${status === 'processing' ? 'animate-spin' : ''}`}
      />
      {theme.label}
    </span>
  )
}

/**
 * Normaliza um status livre vindo de extractedData → BiomarkerStatus canônico.
 * Backend permite 'normal' | 'high' | 'low' | 'unknown', mas a IA pode emitir
 * variações como 'above'/'below'/'warning'/'critical'.
 */
function normalizeStatus(s: string | undefined): BiomarkerStatus {
  const v = (s ?? '').toLowerCase()
  if (v === 'normal') return 'normal'
  if (v === 'low' || v === 'below') return 'low'
  if (v === 'high' || v === 'above' || v === 'warning' || v === 'critical')
    return 'high'
  return 'unknown'
}

interface MiniBiomarkerData {
  name: string
  value: number | string
  unit: string
  status: BiomarkerStatus
}

function MiniBiomarker({ marker }: { marker: MiniBiomarkerData }) {
  const valueStr =
    typeof marker.value === 'number'
      ? marker.value.toLocaleString('pt-BR')
      : marker.value
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="truncate text-[11px] text-slate-600 dark:text-slate-400">
        {marker.name}
      </span>
      <span
        className={`inline-flex shrink-0 items-baseline gap-1 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold ring-1 ${BIOMARKER_STATUS_STYLE[marker.status]}`}
      >
        {valueStr}
        {marker.unit && (
          <span className="text-[9px] font-normal opacity-80">
            {marker.unit}
          </span>
        )}
      </span>
    </div>
  )
}

interface ExamCardProps {
  exam: Exam
  /** Categoria resolvida (derivada via lookup no catálogo de examTypes). */
  category: ExamCategoryId
  /** Quando true, exibe estado sintético "processing" mesmo com status='pending'. */
  isPolling?: boolean
  /** Biomarcadores confirmados (após `/confirm-results`). Quando ausente,
   *  o card cai pra `extractedData.parameters[]` se disponível. */
  confirmedResults?: ExamResultInput[]
  onOpen?: () => void
}

/**
 * Mapeia biomarcador → label legível pra UI.
 * Códigos canônicos do backend (`biomarkerCode`) → label PT-BR.
 * Quando não há mapping, usa o code direto.
 */
const BIOMARKER_LABELS: Record<string, string> = {
  HGB: 'Hemoglobina',
  HCT: 'Hematócrito',
  GLUC_FAST: 'Glicemia',
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

export function ExamCard({
  exam,
  category,
  isPolling,
  confirmedResults,
  onOpen,
}: ExamCardProps) {
  const Icon = CATEGORY_ICON[category] ?? FileText
  const theme = CATEGORY_THEME[category] ?? CATEGORY_THEME.outros

  // Status derivado: pending + isPolling → 'processing' (estado sintético da UI)
  const cardStatus: CardStatus =
    isPolling && exam.status === 'pending' ? 'processing' : exam.status

  const isProcessing = cardStatus === 'processing'
  const isFailed = cardStatus === 'failed'
  const isProcessed = cardStatus === 'processed'

  // Preferência de fonte de biomarcadores:
  // 1. confirmedResults (estruturados, persistidos)
  // 2. extractedData.parameters (output da IA, ainda não confirmado)
  const topBiomarkers: MiniBiomarkerData[] = (() => {
    if (confirmedResults && confirmedResults.length > 0) {
      return confirmedResults.slice(0, 3).map((r) => ({
        name: biomarkerLabel(r.biomarkerCode),
        value: r.value,
        unit: r.unit,
        status: r.status,
      }))
    }
    const params = exam.extractedData?.parameters
    if (params && params.length > 0) {
      return params.slice(0, 3).map((p: ExtractedParameter) => ({
        name: p.name,
        value: p.value,
        unit: p.unit ?? '',
        status: normalizeStatus(p.status),
      }))
    }
    return []
  })()

  const totalBiomarkers =
    confirmedResults?.length ?? exam.extractedData?.parameters?.length ?? 0
  const remaining = Math.max(0, totalBiomarkers - 3)

  const summary = exam.extractedData?.summary
  const title = exam.examType?.displayName ?? exam.fileName

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={isProcessing || isFailed}
      className={`group relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition-all hover:shadow-md disabled:cursor-default dark:border-slate-800 dark:bg-slate-900 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 ${theme.border} ${isProcessing ? 'animate-pulse-soft' : ''}`}
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${theme.iconBg} ${theme.iconColor}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h3>
            <p className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-mono">{formatExamDate(exam.examDate)}</span>
              <span>·</span>
              <span className="truncate">{exam.fileName}</span>
            </p>
          </div>
          <StatusBadge status={cardStatus} />
        </div>

        {isProcessing && (
          <div className="mt-4 rounded-2xl bg-amber-50/60 px-3 py-2.5 dark:bg-amber-500/5">
            <p className="text-[11px] font-medium text-amber-800 dark:text-amber-300">
              IA está extraindo os biomarcadores…
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-amber-200/60 dark:bg-amber-500/20">
              <div className="h-full w-1/3 animate-pulse bg-amber-500 dark:bg-amber-400" />
            </div>
          </div>
        )}

        {isFailed && (
          <div className="mt-4 rounded-2xl bg-rose-50/60 px-3 py-2.5 dark:bg-rose-500/5">
            <p className="text-[11px] font-medium text-rose-800 dark:text-rose-300">
              Não foi possível processar — verifique o arquivo
            </p>
          </div>
        )}

        {isProcessed && topBiomarkers.length > 0 && (
          <div className="mt-4 space-y-1.5">
            {topBiomarkers.map((m, i) => (
              <MiniBiomarker key={`${m.name}-${i}`} marker={m} />
            ))}
            {remaining > 0 && (
              <p className="pt-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                + {remaining} marcador{remaining !== 1 ? 'es' : ''}
              </p>
            )}
            {!confirmedResults && (
              <p className="pt-1 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                Valores extraídos pela IA — aguardando sua confirmação
              </p>
            )}
          </div>
        )}

        {isProcessed && summary && (
          <p className="mt-3 line-clamp-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            {summary}
          </p>
        )}

        {isProcessed && (
          <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3 text-[11px] font-semibold text-emerald-700 dark:border-slate-800 dark:text-emerald-400">
            Ver detalhes
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        )}
      </div>
    </button>
  )
}
