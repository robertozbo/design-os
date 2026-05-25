import type {
  CurrentWeek,
  DiagnosisDraft,
  Team,
  WeeklySignal,
} from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { Calendar, Sparkles, Target, User } from 'lucide-react'

interface Props {
  draft: DiagnosisDraft
  team: Team
  currentWeek: CurrentWeek
  signals: WeeklySignal[]
  onChangeAction: (patch: Partial<DiagnosisDraft['action']>) => void
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function quickPicks(currentWeek: CurrentWeek): Array<{ label: string; date: string }> {
  const weekEnd = new Date(currentWeek.weekEnd + 'T00:00:00')
  const oneWeek = new Date(weekEnd)
  oneWeek.setDate(weekEnd.getDate() + 7)
  const twoWeeks = new Date(weekEnd)
  twoWeeks.setDate(weekEnd.getDate() + 14)
  return [
    { label: 'Fim desta semana', date: isoDate(weekEnd) },
    { label: 'Próxima semana', date: isoDate(oneWeek) },
    { label: 'Em 2 semanas', date: isoDate(twoWeeks) },
  ]
}

function formatDeadlineHint(date: string): string {
  if (!date) return ''
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  })
}

export function WizardStepAction({ draft, team, currentWeek, signals, onChangeAction }: Props) {
  const picks = quickPicks(currentWeek)
  const noteCount = Object.values(draft.signalNotes).filter((n) => n.trim().length > 0).length
  const concerningSignals = signals.filter((s) => s.concern === 'high')

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">
          Passo 3 de 3
        </div>
        <h2 className="mt-1 text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Qual ação você vai tomar?
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Defina uma ação concreta com prazo. Idealmente algo que você possa concluir em 1–2 semanas e que conecte diretamente à observação.
        </p>
      </header>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="action-description"
            className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 mb-2"
          >
            <Target className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={2.25} />
            Descrição da ação
          </label>
          <textarea
            id="action-description"
            value={draft.action.description}
            onChange={(e) => onChangeAction({ description: e.target.value })}
            rows={3}
            placeholder="Ex.: Conversar 1:1 com cada operador da Linha 2 para entender adaptação ao novo turno…"
            className="
              w-full px-4 py-3 rounded-2xl
              bg-white dark:bg-slate-900/60
              border border-slate-200 dark:border-slate-800
              text-sm text-slate-800 dark:text-slate-100
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              resize-none
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              transition
            "
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="action-deadline"
              className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 mb-2"
            >
              <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={2.25} />
              Prazo
            </label>
            <input
              id="action-deadline"
              type="date"
              value={draft.action.deadline}
              onChange={(e) => onChangeAction({ deadline: e.target.value })}
              className="
                w-full px-4 py-3 rounded-2xl
                bg-white dark:bg-slate-900/60
                border border-slate-200 dark:border-slate-800
                text-sm text-slate-800 dark:text-slate-100 tabular-nums
                focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                transition
              "
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {picks.map((pick) => {
                const active = draft.action.deadline === pick.date
                return (
                  <button
                    key={pick.label}
                    type="button"
                    onClick={() => onChangeAction({ deadline: pick.date })}
                    className={`
                      inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition
                      ${
                        active
                          ? 'bg-teal-500 text-white border-teal-500 shadow-[0_8px_18px_-8px_rgba(13,148,136,0.6)]'
                          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-teal-300 dark:hover:border-teal-800'
                      }
                    `}
                  >
                    {pick.label}
                  </button>
                )
              })}
            </div>
            {draft.action.deadline && (
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                {formatDeadlineHint(draft.action.deadline)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="action-owner"
              className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 mb-2"
            >
              <User className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={2.25} />
              Responsável
            </label>
            <input
              id="action-owner"
              type="text"
              value={draft.action.owner}
              onChange={(e) => onChangeAction({ owner: e.target.value })}
              placeholder={team.leaderName}
              className="
                w-full px-4 py-3 rounded-2xl
                bg-white dark:bg-slate-900/60
                border border-slate-200 dark:border-slate-800
                text-sm text-slate-800 dark:text-slate-100
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                transition
              "
            />
            <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              Por padrão, o líder do setor. Você pode delegar para outro membro do time.
            </p>
          </div>
        </div>
      </div>

      <ReviewSummary
        team={team}
        currentWeek={currentWeek}
        draft={draft}
        noteCount={noteCount}
        concerningCount={concerningSignals.length}
      />
    </div>
  )
}

function ReviewSummary({
  team,
  currentWeek,
  draft,
  noteCount,
  concerningCount,
}: {
  team: Team
  currentWeek: CurrentWeek
  draft: DiagnosisDraft
  noteCount: number
  concerningCount: number
}) {
  return (
    <aside
      className="
        relative overflow-hidden rounded-2xl
        border border-teal-200 dark:border-teal-900/60
        bg-gradient-to-br from-teal-50 via-white to-violet-50/40
        dark:from-teal-950/30 dark:via-slate-950 dark:to-violet-950/30
        p-5
      "
    >
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-teal-200/40 dark:bg-teal-900/30 blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">
          <Sparkles className="w-3 h-3" strokeWidth={2.25} />
          Revisão antes de submeter
        </div>
        <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">
          Resumo do diagnóstico de {currentWeek.weekLabel.toLowerCase()}
        </h3>

        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Time
            </dt>
            <dd className="mt-0.5 text-slate-800 dark:text-slate-100 font-medium">
              {team.sectorName} · {team.headcount} pessoas
            </dd>
          </div>

          <div>
            <dt className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Sinais comentados
            </dt>
            <dd className="mt-0.5 text-slate-800 dark:text-slate-100 font-medium tabular-nums">
              {noteCount} notas{' '}
              <span className="text-slate-500 dark:text-slate-400 font-normal">
                · {concerningCount} de alta atenção
              </span>
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Observação
            </dt>
            <dd className="mt-0.5 text-slate-700 dark:text-slate-200 leading-snug line-clamp-3">
              {draft.observation || (
                <span className="italic text-slate-400 dark:text-slate-500">
                  Volte ao passo 2 para registrar a observação.
                </span>
              )}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Ação · Prazo · Responsável
            </dt>
            <dd className="mt-0.5 text-slate-700 dark:text-slate-200 leading-snug">
              {draft.action.description ? (
                <>
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {draft.action.description}
                  </span>
                  <br />
                  <span className="text-[12px] text-slate-500 dark:text-slate-400">
                    {draft.action.deadline ? formatDeadlineHint(draft.action.deadline) : 'Sem prazo'} ·{' '}
                    {draft.action.owner || team.leaderName}
                  </span>
                </>
              ) : (
                <span className="italic text-slate-400 dark:text-slate-500">Defina a ação acima.</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}
