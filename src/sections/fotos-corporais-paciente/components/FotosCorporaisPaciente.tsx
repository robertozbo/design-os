import { useState } from 'react'
import { Lock, X, Camera, Calendar, Clock } from 'lucide-react'
import type {
  FotosCorporaisPacienteProps,
  PhotoPeriod,
} from '@/../product/sections/fotos-corporais-paciente/types'
import { CaptureCard } from './CaptureCard'
import { LatestSessionCard } from './LatestSessionCard'
import { ComparisonCard } from './ComparisonCard'
import { HistoryGallery } from './HistoryGallery'
import { LgpdConsentModal } from './LgpdConsentModal'

function formatRelative(iso: string | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (days < 1) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 7) return `há ${days}d`
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

function StatPill({
  label,
  value,
  Icon,
}: {
  label: string
  value: string | number
  Icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-lg font-bold leading-none text-slate-900 dark:text-slate-50">
          {value}
        </p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </p>
      </div>
    </div>
  )
}

export function FotosCorporaisPaciente({
  stats,
  lgpdBanner,
  lgpdConsentItems,
  latestSession,
  comparison,
  sessions,
  periodOptions,
  activePeriod,
  processingIds,
  onPeriodChange,
  onDismissLgpdBanner,
  onOpenAIChat,
  onCreatePhoto,
  onOpenSession,
  onChangeComparison,
}: FotosCorporaisPacienteProps) {
  const [bannerVisible, setBannerVisible] = useState(lgpdBanner.visible)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [internalPeriod, setInternalPeriod] = useState<PhotoPeriod>(
    activePeriod ?? 'all',
  )

  function pickPeriod(p: PhotoPeriod) {
    setInternalPeriod(p)
    onPeriodChange?.(p)
  }

  function dismissBanner() {
    setBannerVisible(false)
    onDismissLgpdBanner?.()
  }

  function handleDirectUpload() {
    // Simulação: dispara upload de 1 foto fake (sem ângulo)
    const blob = new Blob(['fake'], { type: 'image/jpeg' })
    const file = new File([blob], 'foto.jpg', { type: 'image/jpeg' })
    onCreatePhoto?.({
      examTypeId: 'body_photo',
      file,
    })
  }

  return (
    <div
      data-nymos-fotos-corporais-paciente
      className="min-h-full bg-slate-50/60 dark:bg-slate-950"
    >
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-10">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            Evolução corporal
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
            Fotos corporais
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Análise visual por IA — tipo somático, composição muscular,
            distribuição de gordura e postura.
          </p>
        </header>

        {bannerVisible && lgpdBanner.message && (
          <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/40 px-4 py-3 ring-1 ring-emerald-100 dark:bg-emerald-500/5 dark:ring-emerald-500/20">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="flex-1 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
              {lgpdBanner.message}
            </p>
            <button
              type="button"
              onClick={dismissBanner}
              aria-label="Fechar banner"
              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-emerald-100 dark:text-slate-400 dark:hover:bg-emerald-500/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatPill
            label="Sessões totais"
            value={stats.totalSessions}
            Icon={Camera}
          />
          <StatPill
            label="Última sessão"
            value={formatRelative(stats.lastSessionDate)}
            Icon={Calendar}
          />
          <StatPill
            label="Dias desde"
            value={stats.daysSinceLastSession ?? '—'}
            Icon={Clock}
          />
        </div>

        <CaptureCard
          onOpenAIChat={onOpenAIChat}
          onOpenDirectUpload={handleDirectUpload}
          onOpenPrivacy={() => setPrivacyOpen(true)}
        />

        <LatestSessionCard
          session={latestSession}
          onOpen={onOpenSession}
        />

        {comparison && (
          <ComparisonCard
            comparison={comparison}
            sessions={sessions}
            onChange={(baselineId, currentId) =>
              onChangeComparison?.({
                baselineSessionId: baselineId,
                currentSessionId: currentId,
              })
            }
          />
        )}

        <HistoryGallery
          sessions={sessions}
          periodOptions={periodOptions}
          activePeriod={internalPeriod}
          onPeriodChange={pickPeriod}
          onOpen={onOpenSession}
        />

        {processingIds && processingIds.length > 0 && (
          <p className="text-center text-[11px] font-medium text-amber-700 dark:text-amber-400">
            {processingIds.length} foto
            {processingIds.length !== 1 ? 's' : ''} ainda processando…
          </p>
        )}
      </div>

      <LgpdConsentModal
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        consentItems={lgpdConsentItems}
      />
    </div>
  )
}
