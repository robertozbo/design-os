import {
  Sparkles,
  CheckCircle2,
  ChevronRight,
  User,
  Dumbbell,
  Lock,
  ListChecks,
  Wand2,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import type {
  BodyType,
  FatPattern,
  MuscleLevel,
  PhotoSession,
  PhotoSource,
  PostureAlignment,
} from '@/../product/sections/fotos-corporais-paciente/types'

interface LatestSessionCardProps {
  session: PhotoSession | null
  onOpen?: (id: string) => void
}

const BODY_TYPE_LABEL: Record<BodyType, { label: string; description: string }> = {
  ectomorph: {
    label: 'Ectomorfo',
    description: 'Corpo magro, metabolismo rápido',
  },
  mesomorph: {
    label: 'Mesomorfo',
    description: 'Corpo atlético, facilidade pra ganhar músculo',
  },
  endomorph: {
    label: 'Endomorfo',
    description: 'Corpo mais arredondado, metabolismo mais lento',
  },
  mixed: {
    label: 'Misto',
    description: 'Características de múltiplos fisiotipos',
  },
}

const MUSCLE_THEME: Record<
  MuscleLevel,
  { bar: string; label: string; width: string; text: string }
> = {
  high: {
    bar: 'bg-emerald-500',
    label: 'Alto',
    width: 'w-full',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  moderate: {
    bar: 'bg-amber-500',
    label: 'Moderado',
    width: 'w-3/5',
    text: 'text-amber-700 dark:text-amber-400',
  },
  low: {
    bar: 'bg-rose-500',
    label: 'Baixo',
    width: 'w-1/3',
    text: 'text-rose-700 dark:text-rose-400',
  },
}

const FAT_PATTERN_LABEL: Record<FatPattern, string> = {
  android: 'Androide (superior)',
  gynoid: 'Ginoide (inferior)',
  mixed: 'Misto',
}

const POSTURE_THEME: Record<
  PostureAlignment,
  { label: string; text: string; bg: string; ring: string }
> = {
  good: {
    label: 'Boa',
    text: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    ring: 'ring-emerald-200 dark:ring-emerald-500/30',
  },
  moderate: {
    label: 'Moderada',
    text: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    ring: 'ring-amber-200 dark:ring-amber-500/30',
  },
  poor: {
    label: 'Necessita atenção',
    text: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    ring: 'ring-rose-200 dark:ring-rose-500/30',
  },
}

const SOURCE_BADGE: Record<
  PhotoSource,
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
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

function MuscleBar({ label, level }: { label: string; level: MuscleLevel | undefined }) {
  const theme = level ? MUSCLE_THEME[level] : null
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs text-slate-600 dark:text-slate-300">
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        {theme && (
          <div
            className={`h-full ${theme.bar} ${theme.width} transition-all`}
          />
        )}
      </div>
      <span
        className={`w-20 shrink-0 text-right text-[11px] font-bold uppercase tracking-wider ${theme?.text ?? 'text-slate-400'}`}
      >
        {theme?.label ?? '—'}
      </span>
    </div>
  )
}

function PhotoStrip({ session }: { session: PhotoSession }) {
  const photos = [
    { angle: 'front' as const, url: session.photos.front, label: 'Frente' },
    { angle: 'side' as const, url: session.photos.side, label: 'Lado' },
    { angle: 'back' as const, url: session.photos.back, label: 'Costas' },
  ].filter((p) => !!p.url)

  if (photos.length === 0) return null

  return (
    <div
      className={`grid gap-2 ${photos.length === 1 ? 'grid-cols-1' : photos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
    >
      {photos.map((p) => (
        <div
          key={p.angle}
          className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
        >
          <img
            src={p.url}
            alt={`Foto ${p.label}`}
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-2 left-2 inline-flex items-center rounded-full bg-slate-900/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {p.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export function LatestSessionCard({ session, onOpen }: LatestSessionCardProps) {
  if (!session || !session.analysis) {
    return (
      <section className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/40 p-8 text-center dark:border-slate-700 dark:bg-slate-800/30">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Nenhuma análise ainda
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Capture suas primeiras fotos pra ver a análise visual
        </p>
      </section>
    )
  }

  const a = session.analysis
  const bodyTypeInfo = a.bodyType ? BODY_TYPE_LABEL[a.bodyType] : null
  const fatPatternLabel = a.fatDistribution?.pattern
    ? FAT_PATTERN_LABEL[a.fatDistribution.pattern]
    : null
  const postureTheme = a.posture?.alignment
    ? POSTURE_THEME[a.posture.alignment]
    : null
  const sourceBadge = SOURCE_BADGE[session.source]
  const recommendations = a.recommendations ?? []
  const visibleRecs = recommendations.slice(0, 3)
  const moreRecs = Math.max(0, recommendations.length - 3)

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Última análise
          </h2>
          <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-mono">{formatDate(session.date)}</span>
            <span>·</span>
            <span>
              {session.examIds.length} foto
              {session.examIds.length !== 1 ? 's' : ''}
            </span>
            {a.confidence != null && (
              <>
                <span>·</span>
                <span>Confiança IA {Math.round(a.confidence * 100)}%</span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${sourceBadge.cls}`}
            title={`Fonte: ${sourceBadge.label}`}
          >
            <sourceBadge.Icon className="h-3 w-3" />
            {sourceBadge.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" />
            Pronto
          </span>
        </div>
      </header>

      <div className="space-y-5 p-5">
        <PhotoStrip session={session} />

        {bodyTypeInfo && (
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-teal-50/30 p-4 dark:border-emerald-500/30 dark:from-emerald-500/5 dark:to-teal-500/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900 dark:text-slate-50">
                    {bodyTypeInfo.label}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {bodyTypeInfo.description}
                  </p>
                </div>
              </div>
              {a.estimatedBodyFat != null && (
                <div className="rounded-2xl bg-white px-3 py-1.5 ring-1 ring-emerald-200 dark:bg-slate-900 dark:ring-emerald-500/30">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Gordura estimada
                  </p>
                  <p className="font-mono text-lg font-bold text-slate-900 dark:text-slate-50">
                    {a.estimatedBodyFat}
                    <span className="ml-0.5 text-[11px] font-medium text-slate-500">
                      %
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {a.muscleDevelopment && (
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-3 flex items-center gap-2">
              <Dumbbell className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Desenvolvimento muscular
              </p>
            </div>
            <div className="space-y-2.5">
              <MuscleBar label="Superior" level={a.muscleDevelopment.upper} />
              <MuscleBar label="Core" level={a.muscleDevelopment.core} />
              <MuscleBar label="Inferior" level={a.muscleDevelopment.lower} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {a.fatDistribution && (
            <div className="rounded-2xl bg-slate-50/60 p-4 ring-1 ring-slate-200/60 dark:bg-slate-800/40 dark:ring-slate-700/60">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Distribuição de gordura
              </p>
              {fatPatternLabel && (
                <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {fatPatternLabel}
                </p>
              )}
              {a.fatDistribution.primary &&
                a.fatDistribution.primary.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {a.fatDistribution.primary.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          )}
          {a.posture && (
            <div
              className={`rounded-2xl p-4 ring-1 ${postureTheme?.bg ?? 'bg-slate-50/60'} ${postureTheme?.ring ?? 'ring-slate-200/60 dark:ring-slate-700/60'}`}
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Postura
              </p>
              {postureTheme && (
                <p
                  className={`mt-1.5 text-sm font-semibold ${postureTheme.text}`}
                >
                  {postureTheme.label}
                </p>
              )}
              {a.posture.notes && (
                <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {a.posture.notes}
                </p>
              )}
            </div>
          )}
        </div>

        {visibleRecs.length > 0 && (
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-2 flex items-center gap-2">
              <ListChecks className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Recomendações
              </p>
            </div>
            <ul className="space-y-1.5">
              {visibleRecs.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200"
                >
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {rec}
                </li>
              ))}
              {moreRecs > 0 && (
                <li className="pt-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                  + {moreRecs} recomendação{moreRecs !== 1 ? 'ões' : ''}
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-[11px] dark:border-slate-800">
          <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Lock className="h-3 w-3" />
            Fotos criptografadas e privadas
          </span>
          <button
            type="button"
            onClick={() => onOpen?.(session.id)}
            className="inline-flex items-center gap-1 font-semibold text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200"
          >
            Ver análise completa
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </section>
  )
}
