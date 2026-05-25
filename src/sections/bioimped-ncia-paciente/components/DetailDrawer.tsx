import { useEffect, useState } from 'react'
import {
  X,
  Sparkles,
  ChevronDown,
  Pencil,
  Share2,
  Trash2,
  Wand2,
  Smartphone,
  Bluetooth,
  Activity,
  Lightbulb,
  ListChecks,
  type LucideIcon,
} from 'lucide-react'
import type {
  BioMetric,
  BioMetricKey,
  BioMetricTone,
  BioReadingView,
  EvaluationSource,
} from '@/../product/sections/bioimped-ncia-paciente/types'

interface SegmentalData {
  /** kg ou %. Quando todos são null/undefined, a section não renderiza. */
  rightArm?: number | null
  leftArm?: number | null
  trunk?: number | null
  rightLeg?: number | null
  leftLeg?: number | null
}

export interface DetailDrawerData extends BioReadingView {
  segmental?: {
    leanKg?: SegmentalData
    leanPct?: SegmentalData
    fatKg?: SegmentalData
    fatPct?: SegmentalData
  } | null
}

interface DetailDrawerProps {
  open: boolean
  reading: DetailDrawerData | null
  onClose: () => void
  onEdit?: (id: string) => void
  onShare?: (id: string) => void
  onDelete?: (id: string) => void
}

const TONE_TILE: Record<
  BioMetricTone,
  { bg: string; text: string; ring: string }
> = {
  slate: {
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    text: 'text-slate-800 dark:text-slate-100',
    ring: 'ring-slate-200/60 dark:ring-slate-700/60',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-800 dark:text-amber-200',
    ring: 'ring-amber-200/60 dark:ring-amber-500/20',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-800 dark:text-emerald-200',
    ring: 'ring-emerald-200/60 dark:ring-emerald-500/20',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-500/10',
    text: 'text-sky-800 dark:text-sky-200',
    ring: 'ring-sky-200/60 dark:ring-sky-500/20',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    text: 'text-rose-800 dark:text-rose-200',
    ring: 'ring-rose-200/60 dark:ring-rose-500/20',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    text: 'text-violet-800 dark:text-violet-200',
    ring: 'ring-violet-200/60 dark:ring-violet-500/20',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-500/10',
    text: 'text-teal-800 dark:text-teal-200',
    ring: 'ring-teal-200/60 dark:ring-teal-500/20',
  },
}

const SOURCE_BADGE: Record<
  EvaluationSource,
  { label: string; Icon: LucideIcon; cls: string }
> = {
  ia: {
    label: 'IA',
    Icon: Wand2,
    cls: 'bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-500/30',
  },
  manual: {
    label: 'Manual',
    Icon: Smartphone,
    cls: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-700/40 dark:text-slate-200 dark:ring-slate-600/40',
  },
  device: {
    label: 'Device',
    Icon: Bluetooth,
    cls: 'bg-teal-100 text-teal-700 ring-teal-200 dark:bg-teal-500/15 dark:text-teal-300 dark:ring-teal-500/30',
  },
}

type SegmentalMode = 'leanKg' | 'leanPct' | 'fatKg' | 'fatPct'

const SEGMENTAL_MODES: Array<{ id: SegmentalMode; label: string; unit: string }> =
  [
    { id: 'leanKg', label: 'Massa magra', unit: 'kg' },
    { id: 'leanPct', label: 'Magra %', unit: '%' },
    { id: 'fatKg', label: 'Gordura', unit: 'kg' },
    { id: 'fatPct', label: 'Gordura %', unit: '%' },
  ]

function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} · ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function formatBytes(b?: number): string {
  if (!b) return '—'
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}

function MetricTile({ metric }: { metric: BioMetric }) {
  const tone = TONE_TILE[metric.tone]
  const deltaColor =
    metric.direction === 'good'
      ? 'text-emerald-600 dark:text-emerald-400'
      : metric.direction === 'bad'
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-slate-500 dark:text-slate-400'
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-3 ring-1 ${tone.bg} ${tone.ring}`}
    >
      <p
        className={`text-[10px] font-bold uppercase tracking-wider opacity-70 ${tone.text}`}
      >
        {metric.label}
      </p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`font-mono text-2xl font-bold leading-none ${tone.text}`}>
          {metric.value.toFixed(metric.decimals)}
        </span>
        <span className={`text-[10px] font-medium opacity-70 ${tone.text}`}>
          {metric.unit}
        </span>
      </div>
      {metric.delta !== 0 && (
        <p className={`mt-1.5 text-[10px] font-bold ${deltaColor}`}>
          {metric.delta > 0 ? '+' : ''}
          {metric.delta.toFixed(metric.decimals)} {metric.unit} (
          {Math.abs(metric.deltaPercent).toFixed(1)}%)
        </p>
      )}
    </div>
  )
}

/**
 * SVG silhueta humana com 5 segmentos coloridos por valor.
 * Cor mais saturada = valor mais alto dentro do set.
 */
function BodySegmental({
  data,
  unit,
  mode,
}: {
  data: SegmentalData
  unit: string
  mode: SegmentalMode
}) {
  const values = [
    data.rightArm,
    data.leftArm,
    data.trunk,
    data.rightLeg,
    data.leftLeg,
  ].filter((v): v is number => typeof v === 'number')
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1

  // Intensidade 0.3..1 conforme value relativo
  function intensity(v: number | null | undefined): number {
    if (v == null) return 0
    return 0.3 + ((v - min) / range) * 0.7
  }

  // Cor base por modo
  const baseColor = mode.startsWith('lean') ? 'emerald' : 'rose'
  const fillFor = (v: number | null | undefined): string => {
    if (v == null) return 'rgba(148,163,184,0.25)' // slate fallback
    const i = intensity(v)
    if (baseColor === 'emerald') {
      // emerald-500: 16,185,129
      return `rgba(16,185,129,${i.toFixed(2)})`
    }
    return `rgba(244,63,94,${i.toFixed(2)})` // rose-500
  }

  function fmt(v: number | null | undefined): string {
    if (v == null) return '—'
    return v.toFixed(unit === '%' ? 1 : 1)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-2">
      {/* SVG silhueta */}
      <svg
        viewBox="0 0 200 280"
        className="h-56 w-auto"
        aria-label="Composição segmentar"
      >
        {/* Cabeça */}
        <circle
          cx="100"
          cy="30"
          r="18"
          fill="none"
          className="stroke-slate-300 dark:stroke-slate-700"
          strokeWidth="2"
        />
        {/* Pescoço */}
        <rect
          x="93"
          y="48"
          width="14"
          height="14"
          rx="3"
          fill="none"
          className="stroke-slate-300 dark:stroke-slate-700"
          strokeWidth="2"
        />
        {/* Braço direito (left of SVG) */}
        <path
          d="M 60 75 L 50 75 Q 38 75 38 95 L 38 145 Q 38 158 50 158 L 60 155 Z"
          fill={fillFor(data.rightArm)}
          className="stroke-slate-400 dark:stroke-slate-600"
          strokeWidth="1.5"
        />
        <text
          x="48"
          y="115"
          textAnchor="middle"
          className="fill-slate-700 font-mono text-[10px] font-bold dark:fill-slate-100"
        >
          {fmt(data.rightArm)}
        </text>
        {/* Tronco */}
        <path
          d="M 65 62 Q 65 62 100 62 Q 135 62 135 62 L 138 155 Q 138 168 125 168 L 75 168 Q 62 168 62 155 Z"
          fill={fillFor(data.trunk)}
          className="stroke-slate-400 dark:stroke-slate-600"
          strokeWidth="1.5"
        />
        <text
          x="100"
          y="120"
          textAnchor="middle"
          className="fill-slate-800 font-mono text-xs font-bold dark:fill-white"
        >
          {fmt(data.trunk)}
        </text>
        {/* Braço esquerdo (right of SVG) */}
        <path
          d="M 140 75 L 150 75 Q 162 75 162 95 L 162 145 Q 162 158 150 158 L 140 155 Z"
          fill={fillFor(data.leftArm)}
          className="stroke-slate-400 dark:stroke-slate-600"
          strokeWidth="1.5"
        />
        <text
          x="152"
          y="115"
          textAnchor="middle"
          className="fill-slate-700 font-mono text-[10px] font-bold dark:fill-slate-100"
        >
          {fmt(data.leftArm)}
        </text>
        {/* Perna direita (left of SVG) */}
        <path
          d="M 75 175 L 92 175 L 88 260 Q 88 268 80 268 L 70 268 Q 62 268 62 260 Z"
          fill={fillFor(data.rightLeg)}
          className="stroke-slate-400 dark:stroke-slate-600"
          strokeWidth="1.5"
        />
        <text
          x="76"
          y="225"
          textAnchor="middle"
          className="fill-slate-700 font-mono text-[10px] font-bold dark:fill-slate-100"
        >
          {fmt(data.rightLeg)}
        </text>
        {/* Perna esquerda (right of SVG) */}
        <path
          d="M 108 175 L 125 175 L 138 260 Q 138 268 130 268 L 120 268 Q 112 268 112 260 Z"
          fill={fillFor(data.leftLeg)}
          className="stroke-slate-400 dark:stroke-slate-600"
          strokeWidth="1.5"
        />
        <text
          x="124"
          y="225"
          textAnchor="middle"
          className="fill-slate-700 font-mono text-[10px] font-bold dark:fill-slate-100"
        >
          {fmt(data.leftLeg)}
        </text>
      </svg>

      {/* Legenda */}
      <div className="min-w-[140px] space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Valores em {unit}
        </p>
        <ul className="space-y-1 text-xs">
          {(
            [
              ['Braço D.', data.rightArm],
              ['Braço E.', data.leftArm],
              ['Tronco', data.trunk],
              ['Perna D.', data.rightLeg],
              ['Perna E.', data.leftLeg],
            ] as Array<[string, number | null | undefined]>
          ).map(([label, value]) => (
            <li
              key={label}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-slate-600 dark:text-slate-300">
                {label}
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-50">
                {fmt(value)}
                <span className="ml-0.5 text-[10px] font-normal text-slate-500 dark:text-slate-400">
                  {unit}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function DetailDrawer({
  open,
  reading,
  onClose,
  onEdit,
  onShare,
  onDelete,
}: DetailDrawerProps) {
  const [showSegmental, setShowSegmental] = useState(false)
  const [segmentalMode, setSegmentalMode] = useState<SegmentalMode>('leanKg')

  useEffect(() => {
    if (!open) {
      setShowSegmental(false)
      setSegmentalMode('leanKg')
      return
    }
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

  if (!open || !reading) return null

  const sourceBadge = SOURCE_BADGE[reading.source]
  const isImage = reading.fileMimeType?.startsWith('image/') ?? true

  const segmental = reading.segmental
  const hasSegmental =
    segmental &&
    Object.values(segmental).some(
      (s) =>
        s &&
        (s.rightArm != null ||
          s.leftArm != null ||
          s.trunk != null ||
          s.rightLeg != null ||
          s.leftLeg != null),
    )
  const currentSegment = segmental?.[segmentalMode]
  const currentUnit =
    SEGMENTAL_MODES.find((m) => m.id === segmentalMode)?.unit ?? 'kg'

  const metricEntries = Object.entries(reading.metrics) as Array<
    [BioMetricKey, BioMetric]
  >

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
        aria-label="Detalhes da leitura"
        className="relative flex h-full w-full max-w-[760px] flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Leitura de bioimpedância
              </h2>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${sourceBadge.cls}`}
                title={`Fonte: ${sourceBadge.label}`}
              >
                <sourceBadge.Icon className="h-3 w-3" />
                {sourceBadge.label}
              </span>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono">{formatDateTime(reading.date)}</span>
              {reading.deviceBrand && (
                <>
                  <span>·</span>
                  <span>
                    {reading.deviceBrand}
                    {reading.deviceModel && ` ${reading.deviceModel}`}
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Foto do display */}
          {reading.fileUrl && (
            <div className="mb-6 flex flex-col items-center">
              <div className="relative aspect-square w-full max-w-[320px] overflow-hidden rounded-3xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                {isImage ? (
                  <img
                    src={reading.fileUrl}
                    alt="Foto do display da balança"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-mono text-sm font-bold uppercase text-slate-400">
                      PDF
                    </span>
                  </div>
                )}
              </div>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Display original
              </p>
            </div>
          )}

          {/* Métricas core */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
              <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Composição corporal
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {metricEntries.map(([key, metric]) => (
                <MetricTile key={key} metric={metric} />
              ))}
            </div>
          </section>

          {/* Composição segmentar */}
          {hasSegmental && (
            <section className="mt-6">
              <button
                type="button"
                onClick={() => setShowSegmental((s) => !s)}
                className="flex w-full items-center justify-between gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-left ring-1 ring-slate-200/60 transition hover:bg-slate-100 dark:bg-slate-800/60 dark:ring-slate-700/60 dark:hover:bg-slate-800"
                aria-expanded={showSegmental}
              >
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Composição segmentar (5 regiões)
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition ${showSegmental ? 'rotate-180' : ''}`}
                />
              </button>
              {showSegmental && (
                <div className="mt-3 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  {/* Toggle modo */}
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {SEGMENTAL_MODES.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSegmentalMode(m.id)}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                          segmentalMode === m.id
                            ? m.id.startsWith('lean')
                              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                              : 'bg-rose-600 text-white shadow-sm shadow-rose-600/20'
                            : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                  {currentSegment ? (
                    <BodySegmental
                      data={currentSegment}
                      unit={currentUnit}
                      mode={segmentalMode}
                    />
                  ) : (
                    <p className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                      Sem dados pra esse modo nesta leitura
                    </p>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Análise IA */}
          {(reading.summary || reading.findings || reading.recommendations) && (
            <section className="mt-6 space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Análise IA
              </h3>

              {reading.summary && (
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 p-4 ring-1 ring-emerald-100 dark:from-emerald-500/5 dark:via-slate-900 dark:to-teal-500/5 dark:ring-emerald-500/20">
                  <p className="text-xs uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400">
                    Resumo
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {reading.summary}
                  </p>
                </div>
              )}

              {reading.findings && (
                <div className="rounded-2xl bg-slate-50/60 p-4 ring-1 ring-slate-200/60 dark:bg-slate-800/40 dark:ring-slate-700/60">
                  <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300">
                    <Lightbulb className="h-3 w-3" />
                    Insights
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {reading.findings}
                  </p>
                </div>
              )}

              {reading.recommendations && (
                <div className="rounded-2xl bg-slate-50/60 p-4 ring-1 ring-slate-200/60 dark:bg-slate-800/40 dark:ring-slate-700/60">
                  <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300">
                    <ListChecks className="h-3 w-3" />
                    Recomendações
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {reading.recommendations}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Metadata */}
          <section className="mt-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
              Metadata
            </h3>
            <dl className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <MetaRow label="Exam ID" value={reading.id} mono />
              {reading.evaluationId && (
                <MetaRow
                  label="Evaluation ID"
                  value={reading.evaluationId}
                  mono
                />
              )}
              <MetaRow label="Fonte" value={sourceBadge.label} />
              <MetaRow label="Status" value={reading.status} />
              {reading.processingStatus && (
                <MetaRow
                  label="Processing"
                  value={reading.processingStatus}
                />
              )}
              {reading.deviceBrand && (
                <MetaRow
                  label="Device"
                  value={`${reading.deviceBrand}${reading.deviceModel ? ` ${reading.deviceModel}` : ''}`}
                />
              )}
              <MetaRow label="Tipo MIME" value={reading.fileMimeType} mono />
            </dl>
          </section>
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/60">
          <button
            type="button"
            onClick={() => onDelete?.(reading.id)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-50 dark:bg-slate-800 dark:text-rose-300 dark:ring-rose-500/30 dark:hover:bg-rose-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Excluir
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onShare?.(reading.id)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              <Share2 className="h-3.5 w-3.5" />
              Compartilhar
            </button>
            <button
              type="button"
              onClick={() => onEdit?.(reading.id)}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              <Pencil className="h-3.5 w-3.5" />
              Editar metadata
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
