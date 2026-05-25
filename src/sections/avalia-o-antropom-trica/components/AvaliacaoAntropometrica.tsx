import { useMemo } from 'react'
import { Plus, ArrowLeft } from 'lucide-react'
import type {
  Avaliacao,
  AvaliacaoAntropometricaProps,
  PacienteContexto,
} from '@/../product/sections/avalia-o-antropom-trica/types'
import { StatsRow } from './StatsRow'
import { EvolutionChart } from './EvolutionChart'
import { AvaliacaoHistoryCard } from './AvaliacaoHistoryCard'
import { EmptyState } from './EmptyState'
import { AVATAR_COLOR, formatDateShort, formatRelativeDate } from './utils'

export function AvaliacaoAntropometrica({
  pacienteContexto,
  avaliacoes,
  metas,
  medidasSerieOpcoes,
  classificacoes,
  medidaGrafico = 'peso',
  janelaGrafico = '6m',
  onMedidaGraficoChange,
  onJanelaGraficoChange,
  expandedAvaliacaoId,
  onToggleExpand,
  onOpenDrawer,
  onUpdateAvaliacao,
  onDeleteAvaliacao,
}: AvaliacaoAntropometricaProps) {
  // Sort by date desc (most recent first)
  const sorted = useMemo(
    () =>
      [...avaliacoes].sort((a, b) =>
        b.dataIso.localeCompare(a.dataIso),
      ),
    [avaliacoes],
  )

  const current = sorted[0]
  const previous = sorted[1]

  // Map of "previous to compare" for each avaliação in history
  const previousMap = useMemo(() => {
    const m = new Map<string, Avaliacao>()
    for (let i = 0; i < sorted.length - 1; i++) {
      m.set(sorted[i].id, sorted[i + 1])
    }
    return m
  }, [sorted])

  return (
    <div
      data-nymos-aa="true"
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <header className="nymos-reveal flex flex-col gap-3 opacity-0 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              type="button"
              className="
                mb-3 inline-flex items-center gap-1.5 rounded-md text-[11px] font-medium text-slate-500
                hover:text-teal-700
                dark:text-slate-400 dark:hover:text-teal-300
              "
            >
              <ArrowLeft size={11} />
              <span className="font-mono uppercase tracking-wider">Voltar ao paciente</span>
            </button>
            <div className="mb-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                Paciente · Avaliação
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Avaliação antropométrica
            </h1>
            <PatientLine paciente={pacienteContexto} ultimaIso={current?.dataIso} />
          </div>

          <div>
            <button
              type="button"
              onClick={() => onOpenDrawer?.(null)}
              className="
                inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white
                hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400
              "
            >
              <Plus size={14} /> Nova avaliação
            </button>
          </div>
        </header>

        {avaliacoes.length === 0 ? (
          <div
            className="nymos-reveal mt-6 opacity-0"
            style={{ animationDelay: '120ms' }}
          >
            <EmptyState
              pacienteNome={pacienteContexto.nome.split(' ')[0]}
              onCreate={() => onOpenDrawer?.(null)}
            />
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div
              className="nymos-reveal mt-6 opacity-0"
              style={{ animationDelay: '120ms' }}
            >
              <StatsRow
                pacienteContexto={pacienteContexto}
                current={current}
                previous={previous}
                classificacoes={classificacoes}
              />
            </div>

            {/* Chart */}
            <div
              className="nymos-reveal mt-5 opacity-0"
              style={{ animationDelay: '180ms' }}
            >
              <EvolutionChart
                avaliacoes={sorted}
                medidasSerieOpcoes={medidasSerieOpcoes}
                metas={metas}
                medidaGrafico={medidaGrafico}
                janelaGrafico={janelaGrafico}
                onMedidaGraficoChange={(m) => onMedidaGraficoChange?.(m)}
                onJanelaGraficoChange={(j) => onJanelaGraficoChange?.(j)}
              />
            </div>

            {/* History */}
            <section
              className="nymos-reveal mt-6 opacity-0"
              style={{ animationDelay: '240ms' }}
            >
              <header className="mb-3 flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Histórico de avaliações
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider tabular-nums text-slate-500 dark:text-slate-500">
                  {sorted.length} avaliações
                </span>
              </header>

              <ul className="space-y-2.5">
                {sorted.map((a) => (
                  <li key={a.id}>
                    <AvaliacaoHistoryCard
                      avaliacao={a}
                      previous={previousMap.get(a.id)}
                      pacienteContexto={pacienteContexto}
                      classificacoes={classificacoes}
                      expanded={expandedAvaliacaoId === a.id}
                      onToggle={() =>
                        onToggleExpand?.(expandedAvaliacaoId === a.id ? null : a.id)
                      }
                      onEdit={() => onOpenDrawer?.(a.id)}
                      onDelete={() => onDeleteAvaliacao?.(a.id)}
                    />
                  </li>
                ))}
              </ul>
            </section>

            {/* Hint about updating the patient via callback */}
            {/* (no-op visual to silence unused warning) */}
            {onUpdateAvaliacao && <span hidden />}
          </>
        )}
      </div>
    </div>
  )
}

function PatientLine({
  paciente,
  ultimaIso,
}: {
  paciente: PacienteContexto
  ultimaIso?: string
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <span
        className={`
          inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold
          ${AVATAR_COLOR[paciente.corAvatar] ?? AVATAR_COLOR.slate}
        `}
      >
        {paciente.iniciais}
      </span>
      <span className="font-medium text-slate-800 dark:text-slate-200">{paciente.nome}</span>
      {ultimaIso ? (
        <>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="font-mono text-[11px] uppercase tracking-wider">
            Última {formatDateShort(ultimaIso)} · {formatRelativeDate(ultimaIso)}
          </span>
        </>
      ) : (
        <>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="font-mono text-[11px] uppercase tracking-wider">
            Nenhuma avaliação ainda
          </span>
        </>
      )}
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
