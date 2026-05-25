import { useEffect, useState } from 'react'
import {
  Scale,
  Camera,
  Plus,
  Bluetooth,
  Wand2,
  TrendingUp,
  TrendingDown,
  Minus,
  type LucideIcon,
} from 'lucide-react'
import type {
  BioMetricKey,
  BioPeriod,
  BioStatKpi,
  BioimpedanciaPacienteProps,
  BioReadingView,
  CreateBioReadingPayload,
} from '@/../product/sections/bioimped-ncia-paciente/types'
import { LatestReadingCard } from './LatestReadingCard'
import { EvolutionChart } from './EvolutionChart'
import { HistoryList } from './HistoryList'
import { UploadModal } from './UploadModal'
import { DetailDrawer, type DetailDrawerData } from './DetailDrawer'

interface UploadResult {
  ok: boolean
  examId?: string
  preview?: Array<{ label: string; value: string; unit: string }>
  reason?: string
}

function StatHero({
  label,
  kpi,
}: {
  label: string
  kpi: BioStatKpi
}) {
  const DeltaIcon: LucideIcon =
    kpi.delta > 0 ? TrendingUp : kpi.delta < 0 ? TrendingDown : Minus
  const deltaColor =
    kpi.direction === 'good'
      ? 'text-emerald-600 dark:text-emerald-400'
      : kpi.direction === 'bad'
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-slate-500 dark:text-slate-400'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 ring-1 ring-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-700/50">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {kpi.value.toFixed(kpi.unit.includes('%') || kpi.value < 100 ? 1 : 0)}
        </span>
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {kpi.unit}
        </span>
        {kpi.delta !== 0 && (
          <span
            className={`ml-1 inline-flex items-center gap-0.5 text-[11px] font-bold ${deltaColor}`}
          >
            <DeltaIcon className="h-3 w-3" strokeWidth={3} />
            {Math.abs(kpi.deltaPercent).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  )
}

// Dados segmental mock pro detail drawer (vai como prop em integração real)
const MOCK_SEGMENTAL = {
  leanKg: {
    rightArm: 2.8,
    leftArm: 2.7,
    trunk: 21.4,
    rightLeg: 7.6,
    leftLeg: 7.5,
  },
  leanPct: {
    rightArm: 6.8,
    leftArm: 6.6,
    trunk: 52.1,
    rightLeg: 18.5,
    leftLeg: 18.3,
  },
  fatKg: {
    rightArm: 0.9,
    leftArm: 0.9,
    trunk: 8.2,
    rightLeg: 3.1,
    leftLeg: 3.0,
  },
  fatPct: {
    rightArm: 5.6,
    leftArm: 5.6,
    trunk: 51.2,
    rightLeg: 19.3,
    leftLeg: 18.7,
  },
}

export function BioimpedanciaPaciente({
  stats,
  latestReading,
  examTypeInfo,
  metricOptions,
  activeMetric,
  activePeriod,
  periodOptions,
  evolutionSeries,
  history,
  onMetricChange,
  onPeriodChange,
  onOpenReading,
  onCreateReading,
  onOpenAIChat,
  onUpdateReading,
  onDeleteReading,
  onShareReading,
  onOpenDevices,
  isUploading,
}: BioimpedanciaPacienteProps) {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [drawerReading, setDrawerReading] = useState<BioReadingView | null>(
    null,
  )
  const [internalMetric, setInternalMetric] = useState<BioMetricKey>(
    activeMetric ?? 'weight',
  )
  const [internalPeriod, setInternalPeriod] = useState<BioPeriod>(
    activePeriod ?? '3m',
  )

  function pickMetric(key: BioMetricKey) {
    setInternalMetric(key)
    onMetricChange?.(key)
  }

  function pickPeriod(p: BioPeriod) {
    setInternalPeriod(p)
    onPeriodChange?.(p)
  }

  function handleOpenReading(id: string) {
    onOpenReading?.(id)
    // No preview: abre drawer com a última leitura (mock).
    if (latestReading) setDrawerReading(latestReading)
  }

  function handleCreateReading(payload: CreateBioReadingPayload) {
    onCreateReading?.(payload)
    // Simula polling do backend (~4.5s) e devolve preview da extração.
    setUploadResult(null)
    setTimeout(() => {
      if (latestReading) {
        const m = latestReading.metrics
        setUploadResult({
          ok: true,
          examId: latestReading.id,
          preview: [
            {
              label: 'Peso',
              value: m.weight.value.toFixed(1),
              unit: m.weight.unit,
            },
            {
              label: '% Gordura',
              value: m.bodyFat.value.toFixed(1),
              unit: m.bodyFat.unit,
            },
            {
              label: 'Músculo',
              value: m.muscleMass.value.toFixed(1),
              unit: m.muscleMass.unit,
            },
            {
              label: 'Água',
              value: m.bodyWater.value.toFixed(1),
              unit: m.bodyWater.unit,
            },
          ],
        })
      } else {
        setUploadResult({
          ok: false,
          reason: 'Sem leitura de referência no mock',
        })
      }
    }, 4500)
  }

  // Limpa result quando modal fecha
  useEffect(() => {
    if (!uploadOpen) setUploadResult(null)
  }, [uploadOpen])

  const drawerData: DetailDrawerData | null = drawerReading
    ? { ...drawerReading, segmental: MOCK_SEGMENTAL }
    : null

  return (
    <div
      data-nymos-bioimped-ncia-paciente
      className="min-h-full bg-slate-50/60 dark:bg-slate-950"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
        <header className="mb-6 md:mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            Bioimpedância
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
            Bioimpedância
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Foto do display da balança + IA = todas as métricas extraídas.
          </p>
        </header>

        {/* 3 stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <StatHero label="Peso" kpi={stats.weight} />
          <StatHero label="% Gordura" kpi={stats.bodyFat} />
          <StatHero label="Massa muscular" kpi={stats.muscleMass} />
        </div>

        {/* Upload hero */}
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 shadow-sm dark:border-emerald-500/30 dark:from-emerald-500/5 dark:via-slate-900 dark:to-teal-500/5">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-gradient-to-br from-emerald-400/30 via-teal-300/15 to-transparent blur-3xl dark:from-emerald-500/20 dark:via-teal-500/10"
          />
          <div className="relative flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
                <Scale className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-lg">
                  Nova leitura
                </h2>
                <p className="mt-0.5 max-w-md text-xs text-slate-600 dark:text-slate-400">
                  Aponte pro display após a pesagem. A IA detecta a marca e extrai 7 métricas em ~15s.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setUploadOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                <Camera className="h-3.5 w-3.5" />
                Tirar foto
              </button>
              <button
                type="button"
                onClick={() => setUploadOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Da galeria
              </button>
            </div>
          </div>
          <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-emerald-100 bg-white/50 px-5 py-2 dark:border-emerald-500/20 dark:bg-slate-900/40">
            <button
              type="button"
              onClick={onOpenAIChat}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200"
            >
              <Wand2 className="h-3 w-3" />
              Enviar via ai-chat
            </button>
            <button
              type="button"
              onClick={onOpenDevices}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200"
            >
              <Bluetooth className="h-3 w-3" />
              Conectar balança Bluetooth →
            </button>
          </div>
        </section>

        <div className="space-y-6">
          <LatestReadingCard
            reading={latestReading}
            onOpen={handleOpenReading}
          />
          <EvolutionChart
            metricOptions={metricOptions}
            periodOptions={periodOptions}
            series={evolutionSeries}
            activeMetric={internalMetric}
            activePeriod={internalPeriod}
            onMetricChange={pickMetric}
            onPeriodChange={pickPeriod}
          />
          <HistoryList entries={history} onOpen={handleOpenReading} />
        </div>
      </div>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        examTypeId={examTypeInfo?.value ?? null}
        isUploading={isUploading}
        result={uploadResult}
        onSubmit={handleCreateReading}
        onOpenResult={(id) => {
          if (latestReading) setDrawerReading(latestReading)
          onOpenReading?.(id)
        }}
      />

      <DetailDrawer
        open={!!drawerData}
        reading={drawerData}
        onClose={() => setDrawerReading(null)}
        onEdit={(id) => onUpdateReading?.({ id })}
        onShare={onShareReading}
        onDelete={onDeleteReading}
      />
    </div>
  )
}
