import { ArrowRight, Sparkles, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import type {
  ComparisonInfo,
  PhotoAngle,
  PhotoSession,
} from '@/../product/sections/fotos-corporais-paciente/types'

interface ComparisonCardProps {
  comparison: ComparisonInfo | null
  sessions: PhotoSession[]
  onChange?: (baselineId: string, currentId: string) => void
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

const ANGLE_LABEL: Record<PhotoAngle, string> = {
  front: 'Frente',
  side: 'Lado',
  back: 'Costas',
}

/**
 * Encontra ângulos com fotos em ambas as sessões — só renderiza par quando
 * o ângulo existe nas duas (backend permite ângulos opcionais).
 */
function commonAngles(a: PhotoSession, b: PhotoSession): PhotoAngle[] {
  return (['front', 'side', 'back'] as PhotoAngle[]).filter(
    (angle) => !!a.photos[angle] && !!b.photos[angle],
  )
}

export function ComparisonCard({
  comparison,
  sessions,
  onChange,
}: ComparisonCardProps) {
  if (!comparison) return null

  const baseline = sessions.find((s) => s.id === comparison.baselineSessionId)
  const current = sessions.find((s) => s.id === comparison.currentSessionId)
  if (!baseline || !current) return null

  const angles = commonAngles(baseline, current)
  const delta = comparison.bodyFatDelta

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Comparar
        </h2>
        {delta != null && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${
              delta < 0
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30'
                : delta > 0
                  ? 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30'
                  : 'bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
            }`}
          >
            {delta < 0 ? (
              <TrendingDown className="h-3 w-3" />
            ) : delta > 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            Gordura {delta > 0 ? '+' : ''}
            {delta}%
          </span>
        )}
      </header>

      {/* Picker */}
      <div className="grid grid-cols-2 items-center gap-2 px-5 py-3">
        <label className="block">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Antes
          </span>
          <select
            value={baseline.id}
            onChange={(e) => onChange?.(e.target.value, current.id)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-[11px] text-slate-900 transition focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {sessions
              .filter((s) => s.id !== current.id)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {formatDate(s.date)}
                  {s.isBaseline ? ' · linha de base' : ''}
                </option>
              ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Depois
          </span>
          <select
            value={current.id}
            onChange={(e) => onChange?.(baseline.id, e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-[11px] text-slate-900 transition focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {sessions
              .filter((s) => s.id !== baseline.id)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {formatDate(s.date)}
                  {s.isLatest ? ' · última' : ''}
                </option>
              ))}
          </select>
        </label>
      </div>

      {/* Side-by-side (só ângulos presentes em ambas) */}
      {angles.length === 0 ? (
        <div className="px-5 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Não há ângulos em comum entre essas duas sessões pra comparar.
        </div>
      ) : (
        <div className="space-y-3 px-5 pb-5">
          {angles.map((angle) => (
            <div key={angle}>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {ANGLE_LABEL[angle]}
              </p>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <figure>
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                    <img
                      src={baseline.photos[angle]!}
                      alt={`${ANGLE_LABEL[angle]} — ${formatDate(baseline.date)}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-1 text-center font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    {formatDate(baseline.date)}
                  </figcaption>
                </figure>
                <ArrowRight className="h-4 w-4 text-slate-400" />
                <figure>
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-emerald-200 dark:bg-slate-800 dark:ring-emerald-500/30">
                    <img
                      src={current.photos[angle]!}
                      alt={`${ANGLE_LABEL[angle]} — ${formatDate(current.date)}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-1 text-center font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                    {formatDate(current.date)}
                  </figcaption>
                </figure>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI summary */}
      <div className="border-t border-slate-100 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 px-5 py-4 dark:border-slate-800 dark:from-emerald-500/5 dark:via-slate-900 dark:to-teal-500/5">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Evolução visual estimada
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
              {comparison.summary}
            </p>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {comparison.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300"
                >
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
