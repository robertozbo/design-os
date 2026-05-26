import { useMemo, useState } from 'react'
import type {
  Challenge,
  ChallengeCategory,
  DesafiosProps,
  RankingEntry,
} from '@/../product-mobile/sections/desafios/types'

type Tab = 'active' | 'completed' | 'ranking'

const CATEGORY_STYLE: Record<
  ChallengeCategory,
  { dot: string; chip: string; bar: string; ring: string }
> = {
  atividade: {
    dot: 'bg-emerald-500',
    chip: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    bar: 'bg-emerald-400',
    ring: 'stroke-emerald-400',
  },
  nutricao: {
    dot: 'bg-amber-500',
    chip: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    bar: 'bg-amber-400',
    ring: 'stroke-amber-400',
  },
  sono: {
    dot: 'bg-indigo-500',
    chip: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30',
    bar: 'bg-indigo-400',
    ring: 'stroke-indigo-400',
  },
  habito: {
    dot: 'bg-teal-500',
    chip: 'text-teal-300 bg-teal-500/10 border-teal-500/30',
    bar: 'bg-teal-400',
    ring: 'stroke-teal-400',
  },
  medicacao: {
    dot: 'bg-rose-500',
    chip: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
    bar: 'bg-rose-400',
    ring: 'stroke-rose-400',
  },
}

const CATEGORY_LABEL: Record<ChallengeCategory, string> = {
  atividade: 'Atividade',
  nutricao: 'Nutrição',
  sono: 'Sono',
  habito: 'Hábito',
  medicacao: 'Medicação',
}

const MEDAL_COLOR: Record<number, string> = {
  1: 'text-amber-400 bg-amber-500/15 border-amber-500/40',
  2: 'text-slate-300 bg-slate-500/15 border-slate-500/40',
  3: 'text-orange-300 bg-orange-500/15 border-orange-500/40',
}

function ChallengeCard({
  challenge,
  onClick,
}: {
  challenge: Challenge
  onClick?: () => void
}) {
  const style = CATEGORY_STYLE[challenge.category]
  const isDone = challenge.status === 'completed'

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-left transition hover:border-slate-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-[9.5px] font-semibold ${style.chip}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              {CATEGORY_LABEL[challenge.category]}
            </span>
            {isDone && (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-300">
                ✓ Concluído
              </span>
            )}
          </div>
          <div className="mt-1.5 text-[12.5px] font-semibold text-slate-100 truncate">
            {challenge.title}
          </div>
          <div className="mt-0.5 text-[10.5px] text-slate-400 line-clamp-1">
            {challenge.description}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-[15px] font-semibold tabular-nums text-slate-50">
            {challenge.progressPercent}%
          </div>
          <div className="mt-0.5 text-[9.5px] text-slate-500">
            {isDone
              ? `+${challenge.pointsEarned} pts`
              : challenge.daysRemaining > 0
                ? `${challenge.daysRemaining}d restantes`
                : 'Encerrado'}
          </div>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full ${style.bar} transition-all`}
          style={{ width: `${challenge.progressPercent}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
        <span className="font-mono tabular-nums">
          {challenge.currentProgress} / {challenge.target} {challenge.unit}
        </span>
        <span>{challenge.participantCount.toLocaleString('pt-BR')} participantes</span>
      </div>
    </button>
  )
}

function HeroCard({
  challenge,
  onClick,
}: {
  challenge: Challenge
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-slate-900 p-4 text-left"
    >
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/15 px-1.5 py-0.5 text-[9.5px] font-semibold text-amber-300">
          ★ Em destaque
        </div>
        <div className="text-[10px] text-emerald-200/80">
          {challenge.daysRemaining}d restantes
        </div>
      </div>
      <div className="mt-2 text-[15px] font-semibold text-slate-50">
        {challenge.title}
      </div>
      <div className="mt-0.5 text-[11px] text-slate-300/90 line-clamp-2">
        {challenge.description}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="font-mono text-3xl font-semibold tabular-nums text-slate-50">
            {challenge.progressPercent}%
          </div>
          <div className="mt-0.5 text-[10px] text-slate-300/80 font-mono tabular-nums">
            {challenge.currentProgress} / {challenge.target} {challenge.unit}
          </div>
        </div>
        <div className="text-right text-[10.5px] text-emerald-200/90 font-semibold">
          +{challenge.pointsReward} pts ao concluir
        </div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-950/60">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
          style={{ width: `${challenge.progressPercent}%` }}
        />
      </div>
    </button>
  )
}

function RankingRow({ entry }: { entry: RankingEntry }) {
  const isTop3 = entry.rank <= 3
  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${
        entry.isCurrentUser
          ? 'border-teal-500/40 bg-teal-500/8'
          : 'border-slate-800 bg-slate-900/60'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {isTop3 ? (
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-[10.5px] font-semibold ${MEDAL_COLOR[entry.rank]}`}
          >
            {entry.rank}
          </span>
        ) : (
          <span className="inline-flex h-6 w-6 items-center justify-center text-[10.5px] font-mono tabular-nums text-slate-400">
            {entry.rank}
          </span>
        )}
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-200">
          {entry.avatarInitial}
        </span>
        <span
          className={`text-[12px] ${entry.isCurrentUser ? 'font-semibold text-teal-200' : 'text-slate-200'}`}
        >
          {entry.userName}
          {entry.isCurrentUser && (
            <span className="ml-1 text-[10px] text-teal-400/80">(você)</span>
          )}
        </span>
      </div>
      <span className="font-mono text-[12px] font-semibold tabular-nums text-slate-100">
        {entry.points.toLocaleString('pt-BR')} pts
      </span>
    </div>
  )
}

export function Desafios({
  data,
  onAbrirDesafio,
  onExplorarDesafios,
  onAbrirRanking,
}: DesafiosProps) {
  const [tab, setTab] = useState<Tab>('active')
  const { stats, active, completed, ranking } = data

  const heroChallenge = useMemo(() => {
    if (active.length === 0) return null
    return [...active].sort((a, b) => b.progressPercent - a.progressPercent)[0]
  }, [active])

  const restActive = useMemo(
    () => (heroChallenge ? active.filter((c) => c.id !== heroChallenge.id) : active),
    [active, heroChallenge],
  )

  const podium = useMemo(() => {
    const top = ranking.filter((r) => r.rank <= 3)
    const ordered: RankingEntry[] = []
    const second = top.find((r) => r.rank === 2)
    const first = top.find((r) => r.rank === 1)
    const third = top.find((r) => r.rank === 3)
    if (second) ordered.push(second)
    if (first) ordered.push(first)
    if (third) ordered.push(third)
    return ordered
  }, [ranking])

  const restRanking = useMemo(() => ranking.filter((r) => r.rank > 3), [ranking])

  const headerStats = [
    { id: 'points', label: 'Pontos', value: stats.totalPoints.toLocaleString('pt-BR') },
    { id: 'rank', label: 'Ranking', value: `#${stats.globalRank}` },
    { id: 'done', label: 'Concluídos', value: stats.completedCount },
  ]

  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      <div className="px-4 pt-4 pb-24">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-2">
          {headerStats.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <div className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-teal-400">
                {s.label}
              </div>
              <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-slate-50">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-4 grid grid-cols-3 gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
          {(
            [
              { id: 'active', label: `Ativos (${stats.activeCount})` },
              { id: 'completed', label: `Concluídos (${stats.completedCount})` },
              { id: 'ranking', label: 'Ranking' },
            ] as { id: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-2 py-1.5 text-[10.5px] font-semibold transition ${
                tab === t.id
                  ? 'bg-teal-500/15 text-teal-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Active */}
        {tab === 'active' && (
          <div className="mt-4 space-y-3">
            {heroChallenge && (
              <HeroCard
                challenge={heroChallenge}
                onClick={() => onAbrirDesafio?.(heroChallenge.id)}
              />
            )}
            {restActive.map((c) => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                onClick={() => onAbrirDesafio?.(c.id)}
              />
            ))}
            {active.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center">
                <div className="text-[12px] font-semibold text-slate-200">
                  Nenhum desafio ativo
                </div>
                <div className="mt-1 text-[10.5px] text-slate-400">
                  Explore desafios disponíveis pra começar.
                </div>
                <button
                  type="button"
                  onClick={onExplorarDesafios}
                  className="mt-3 inline-flex rounded-lg bg-teal-500/15 px-3 py-1.5 text-[11px] font-semibold text-teal-300 hover:bg-teal-500/25"
                >
                  Explorar desafios →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab: Completed */}
        {tab === 'completed' && (
          <div className="mt-4 space-y-3">
            {completed.map((c) => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                onClick={() => onAbrirDesafio?.(c.id)}
              />
            ))}
            {completed.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-[11px] text-slate-400">
                Você ainda não concluiu nenhum desafio.
              </div>
            )}
          </div>
        )}

        {/* Tab: Ranking */}
        {tab === 'ranking' && (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-[11px] font-semibold text-slate-200">
                Pódio (todos os tempos)
              </div>
              <div className="mt-3 grid grid-cols-3 items-end gap-2">
                {podium.map((entry) => {
                  const heights: Record<number, string> = {
                    1: 'h-20',
                    2: 'h-14',
                    3: 'h-10',
                  }
                  return (
                    <div
                      key={entry.rank}
                      className="flex flex-col items-center"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-[14px] font-semibold text-slate-100">
                        {entry.avatarInitial}
                      </span>
                      <span className="mt-1 truncate text-[10.5px] font-semibold text-slate-200">
                        {entry.userName.split(' ')[0]}
                      </span>
                      <span className="text-[9.5px] text-slate-400 font-mono tabular-nums">
                        {entry.points.toLocaleString('pt-BR')}
                      </span>
                      <div
                        className={`mt-1.5 w-full ${heights[entry.rank]} rounded-t-md border-t ${MEDAL_COLOR[entry.rank]} flex items-center justify-center text-[10px] font-semibold`}
                      >
                        {entry.rank}º
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              {restRanking.map((entry) => (
                <RankingRow key={entry.userId} entry={entry} />
              ))}
            </div>

            <button
              type="button"
              onClick={onAbrirRanking}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] font-semibold text-teal-300 hover:border-teal-500/40"
            >
              Ver ranking completo →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
