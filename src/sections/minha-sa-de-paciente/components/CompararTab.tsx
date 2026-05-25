import { useEffect, useState } from 'react'
import { ArrowRight, GitCompare, Sparkles } from 'lucide-react'
import type {
  AnalysisSnapshot,
  ProjecaoCorporal,
  ScoreBand,
  SnapshotDiff,
  SnapshotFotos,
} from '@/../product/sections/minha-sa-de-paciente/types'
import { DiffRow } from './DiffRow'
import { FotosCompare } from './FotosCompare'
import { FotosTimeline } from './FotosTimeline'
import { ProjecaoCard } from './ProjecaoCard'
import { SnapshotPicker } from './SnapshotPicker'

interface CompararTabProps {
  snapshots: AnalysisSnapshot[]
  snapshotDiff?: SnapshotDiff | null
  fotosTimeline?: SnapshotFotos[]
  projecao?: ProjecaoCorporal
  thumbnailById?: Record<string, string>
  onCompare?: (a: string, b: string) => void
  onStartProjecao?: () => void
  onRetryProjecao?: () => void
  onOpenSnapshotPhoto?: (snapshotId: string) => void
}

const BAND_BG: Record<ScoreBand, string> = {
  good: 'bg-emerald-100 dark:bg-emerald-500/20',
  attention: 'bg-amber-100 dark:bg-amber-500/20',
  risk: 'bg-rose-100 dark:bg-rose-500/20',
}

const BAND_TEXT: Record<ScoreBand, string> = {
  good: 'text-emerald-700 dark:text-emerald-300',
  attention: 'text-amber-700 dark:text-amber-300',
  risk: 'text-rose-700 dark:text-rose-300',
}

function formatDateBR(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function MiniScoreCard({ snap }: { snap: AnalysisSnapshot }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${BAND_BG[snap.band]}`}
      >
        <span className={`font-mono text-xl font-bold ${BAND_TEXT[snap.band]}`}>
          {snap.score}
        </span>
      </div>
      <p className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
        {formatDateBR(snap.date)}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Score Saúde
      </p>
    </div>
  )
}

export function CompararTab({
  snapshots,
  snapshotDiff,
  fotosTimeline,
  projecao,
  thumbnailById,
  onCompare,
  onStartProjecao,
  onRetryProjecao,
  onOpenSnapshotPhoto,
}: CompararTabProps) {
  const sortedDesc = [...snapshots].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const insufficient = snapshots.length < 2

  const [aId, setAId] = useState<string | null>(null)
  const [bId, setBId] = useState<string | null>(null)

  useEffect(() => {
    if (!insufficient && !aId && !bId) {
      setBId(sortedDesc[0]?.id ?? null)
      setAId(sortedDesc[1]?.id ?? null)
    }
  }, [insufficient, sortedDesc, aId, bId])

  useEffect(() => {
    if (aId && bId && aId !== bId) onCompare?.(aId, bId)
  }, [aId, bId, onCompare])

  if (insufficient) {
    return (
      <section className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/40 p-10 text-center dark:border-slate-700 dark:bg-slate-800/30">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <GitCompare className="h-6 w-6" />
        </div>
        <p className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-100">
          Comparação indisponível
        </p>
        <p className="mt-1.5 mx-auto max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Gere ao menos 2 análises pra ver evolução lado a lado.
        </p>
      </section>
    )
  }

  const snapA = snapshots.find((s) => s.id === aId)
  const snapB = snapshots.find((s) => s.id === bId)
  const delta = snapA && snapB ? snapB.score - snapA.score : 0
  const usableDiff =
    snapshotDiff &&
    snapshotDiff.snapshotA.id === aId &&
    snapshotDiff.snapshotB.id === bId
      ? snapshotDiff
      : null

  return (
    <div className="space-y-6">
      {/* Pickers */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 sm:grid-cols-2">
          <SnapshotPicker
            label="Antes"
            snapshots={sortedDesc.filter((s) => s.id !== bId)}
            selectedId={aId}
            thumbnailById={thumbnailById}
            onSelect={setAId}
          />
          <SnapshotPicker
            label="Depois"
            snapshots={sortedDesc.filter((s) => s.id !== aId)}
            selectedId={bId}
            thumbnailById={thumbnailById}
            onSelect={setBId}
          />
        </div>
      </section>

      {/* Score variation header */}
      {snapA && snapB && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Visão geral
          </h3>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <MiniScoreCard snap={snapA} />
            <ArrowRight className="h-5 w-5 text-slate-400" aria-hidden />
            <MiniScoreCard snap={snapB} />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Variação do score
            </span>
            <span
              className={`font-mono text-xl font-bold ${
                delta > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : delta < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-500'
              }`}
            >
              {delta > 0 ? '+' : ''}
              {delta}
            </span>
          </div>
        </section>
      )}

      {/* Photos comparison */}
      {usableDiff && (
        <FotosCompare
          fotosA={usableDiff.fotosA ?? null}
          fotosB={usableDiff.fotosB ?? null}
          labelA={`Antes — ${formatDateBR(usableDiff.snapshotA.date)}`}
          labelB={`Depois — ${formatDateBR(usableDiff.snapshotB.date)}`}
        />
      )}

      {/* Dimension diff */}
      {usableDiff && usableDiff.dimensions.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <header className="mb-4 flex items-center gap-2">
            <Sparkles
              className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400"
              aria-hidden
            />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Diferenças por dimensão
            </h3>
          </header>
          <div className="space-y-4">
            {usableDiff.dimensions.map((dim) => (
              <div key={dim.id}>
                <h4 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {dim.title}
                </h4>
                <div className="space-y-2">
                  {dim.metrics.map((m, i) => (
                    <DiffRow key={`${dim.id}-${i}`} diff={m} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Body projection */}
      {projecao && (
        <ProjecaoCard
          projecao={projecao}
          onStartProjecao={onStartProjecao}
          onRetry={onRetryProjecao}
        />
      )}

      {/* Photo timeline */}
      {fotosTimeline && fotosTimeline.length > 0 && (
        <FotosTimeline
          series={fotosTimeline}
          onOpen={(date) => {
            // resolve date → snapshotId if any
            const snap = snapshots.find((s) => s.date === date)
            if (snap) onOpenSnapshotPhoto?.(snap.id)
          }}
        />
      )}
    </div>
  )
}
