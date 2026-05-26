import { useState } from 'react'
import type {
  AvaliacoesCorporaisProps,
  AvaliacoesTab,
  Bioimpedance,
  BioimpedanceDateGroup,
  BodyPhotoSession,
  EvaluationSource,
  PhotoSessionDateGroup,
} from '@/../product-mobile/sections/avaliacoes-corporais/types'

const SOURCE_LABEL: Record<EvaluationSource, string> = {
  ia: 'IA',
  device: 'Aparelho',
  manual: 'Manual',
}

const SOURCE_BADGE: Record<EvaluationSource, string> = {
  ia: 'text-teal-300 bg-teal-500/10 border-teal-500/30',
  device: 'text-sky-300 bg-sky-500/10 border-sky-500/30',
  manual: 'text-slate-300 bg-slate-700/40 border-slate-600/40',
}

function fmt(value: number | null | undefined, unit: string): string | null {
  if (value == null) return null
  return `${value}${unit}`
}

export function AvaliacoesCorporais({
  data,
  activeTab: controlledTab,
  onChangeTab,
  onAbrirBioimpedancia,
  onAbrirSessaoFotos,
  onNovaAvaliacao,
}: AvaliacoesCorporaisProps) {
  const [internalTab, setInternalTab] = useState<AvaliacoesTab>('bioimpedancia')
  const activeTab = controlledTab ?? internalTab

  const handleTabChange = (tab: AvaliacoesTab) => {
    if (controlledTab === undefined) setInternalTab(tab)
    onChangeTab?.(tab)
  }

  const bioStats = data.bioimpedance.stats
  const photoStats = data.photos.stats

  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      <div className="px-4 pt-4 pb-24">
        {/* Segmented control */}
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
          {(
            [
              { id: 'bioimpedancia', label: 'Bioimpedância' },
              { id: 'fotos', label: 'Fotos' },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-teal-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Stats topo */}
        {activeTab === 'bioimpedancia' ? (
          <div className="mt-4 grid grid-cols-3 gap-2">
            <StatCard label="Total" value={bioStats.total} />
            <StatCard
              label="Último peso"
              value={bioStats.lastWeight != null ? `${bioStats.lastWeight}kg` : '—'}
            />
            <StatCard
              label="% gordura"
              value={bioStats.lastBodyFat != null ? `${bioStats.lastBodyFat}%` : '—'}
            />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatCard label="Sessões" value={photoStats.total} />
            <StatCard label="Última" value={photoStats.lastSessionLabel} />
          </div>
        )}

        {/* Lista */}
        {activeTab === 'bioimpedancia' ? (
          data.bioimpedance.groups.length === 0 ? (
            <EmptyState
              icon="activity"
              title="Nenhuma bioimpedância registrada"
              description="Suas avaliações de composição corporal aparecerão aqui."
              cta="Adicionar primeira avaliação"
              onAction={() => onNovaAvaliacao?.('bioimpedancia')}
            />
          ) : (
            <div className="mt-5 space-y-5">
              {data.bioimpedance.groups.map((group) => (
                <BioGroup
                  key={group.dateISO}
                  group={group}
                  onAbrir={onAbrirBioimpedancia}
                />
              ))}
            </div>
          )
        ) : data.photos.groups.length === 0 ? (
          <EmptyState
            icon="camera"
            title="Nenhuma sessão de fotos"
            description="Suas fotos corporais aparecerão aqui."
            cta="Adicionar fotos"
            onAction={() => onNovaAvaliacao?.('fotos')}
          />
        ) : (
          <div className="mt-5 space-y-5">
            {data.photos.groups.map((group) => (
              <PhotoGroup
                key={group.dateISO}
                group={group}
                onAbrir={onAbrirSessaoFotos}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => onNovaAvaliacao?.(activeTab)}
        aria-label="Nova avaliação"
        className="fixed bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-teal-500 text-2xl text-slate-950 shadow-[0_8px_24px_-6px_rgba(20,184,166,0.6)] hover:bg-teal-400"
      >
        +
      </button>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
      <div className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-teal-400">
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-slate-50">
        {value}
      </div>
    </div>
  )
}

function BioGroup({
  group,
  onAbrir,
}: {
  group: BioimpedanceDateGroup
  onAbrir?: (id: string) => void
}) {
  return (
    <div>
      <div className="mb-2 px-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {group.dateLabel}
      </div>
      <div className="space-y-2">
        {group.items.map((item) => (
          <BioCard key={item.id} item={item} onTap={() => onAbrir?.(item.id)} />
        ))}
      </div>
    </div>
  )
}

function BioCard({ item, onTap }: { item: Bioimpedance; onTap: () => void }) {
  const parts = [
    fmt(item.weight, 'kg') && `Peso ${fmt(item.weight, 'kg')}`,
    fmt(item.bodyFatPercentage, '%') && `Gordura ${fmt(item.bodyFatPercentage, '%')}`,
    fmt(item.muscleMass, 'kg') && `Músculo ${fmt(item.muscleMass, 'kg')}`,
  ].filter(Boolean) as string[]

  return (
    <button
      type="button"
      onClick={onTap}
      className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left transition-colors hover:bg-slate-900"
    >
      <div
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal-500/15 text-teal-300"
        aria-hidden
      >
        <ActivityIcon />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[12.5px] font-semibold text-slate-100">
            {SOURCE_LABEL[item.source]}
            {item.deviceBrand ? ` · ${item.deviceBrand}` : ''}
          </span>
          <span className="font-mono text-[10px] tabular-nums text-slate-500">
            {item.timeLabel}
          </span>
        </div>
        <div className="mt-0.5 truncate text-[10.5px] text-slate-400">
          {parts.length > 0 ? parts.join(' · ') : 'Sem métricas'}
        </div>
      </div>

      <span
        className={`shrink-0 rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider ${SOURCE_BADGE[item.source]}`}
      >
        {SOURCE_LABEL[item.source]}
      </span>
    </button>
  )
}

function PhotoGroup({
  group,
  onAbrir,
}: {
  group: PhotoSessionDateGroup
  onAbrir?: (id: string) => void
}) {
  return (
    <div>
      <div className="mb-2 px-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {group.dateLabel}
      </div>
      <div className="space-y-2">
        {group.items.map((item) => (
          <PhotoCard key={item.id} session={item} onTap={() => onAbrir?.(item.id)} />
        ))}
      </div>
    </div>
  )
}

function PhotoCard({
  session,
  onTap,
}: {
  session: BodyPhotoSession
  onTap: () => void
}) {
  const angleLabel: Record<string, string> = {
    front: 'F',
    side: 'L',
    back: 'C',
  }
  return (
    <button
      type="button"
      onClick={onTap}
      className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left transition-colors hover:bg-slate-900"
    >
      <div
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal-500/15 text-teal-300"
        aria-hidden
      >
        <CameraIcon />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[12.5px] font-semibold text-slate-100">
            Sessão · {SOURCE_LABEL[session.source]}
          </span>
          <span className="font-mono text-[10px] tabular-nums text-slate-500">
            {session.timeLabel}
          </span>
        </div>
        <div className="mt-0.5 truncate text-[10.5px] text-slate-400">
          {session.notes ?? `${session.photos.length} ângulo${session.photos.length === 1 ? '' : 's'}`}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {session.photos.map((p) => (
          <span
            key={p.id}
            className="grid h-6 w-6 place-items-center rounded-md border border-slate-700 bg-slate-800 text-[9.5px] font-semibold text-slate-300"
            aria-label={p.photoType}
          >
            {angleLabel[p.photoType] ?? '?'}
          </span>
        ))}
      </div>
    </button>
  )
}

function EmptyState({
  icon,
  title,
  description,
  cta,
  onAction,
}: {
  icon: 'activity' | 'camera'
  title: string
  description: string
  cta: string
  onAction?: () => void
}) {
  return (
    <div className="mt-12 flex flex-col items-center text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-500">
        {icon === 'activity' ? <ActivityIcon /> : <CameraIcon />}
      </div>
      <h3 className="mt-4 text-[14px] font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 max-w-xs text-[11.5px] text-slate-400">{description}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-5 rounded-full bg-teal-500 px-5 py-2 text-[12px] font-semibold text-slate-950 hover:bg-teal-400"
      >
        {cta}
      </button>
    </div>
  )
}

function ActivityIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}
