import type {
  PlanoAtribuidoDetailProps,
  DetailTabId,
} from '@/../product-personal/sections/treinos/types'
import { DetailHeader } from './DetailHeader'
import { StatsRow } from './StatsRow'
import { OverviewTab } from './OverviewTab'
import { SessoesTab } from './SessoesTab'
import { TreinosTab } from './TreinosTab'
import { ComparacaoTab } from './ComparacaoTab'

const TABS: { id: DetailTabId; label: string }[] = [
  { id: 'visao-geral', label: 'Visão geral' },
  { id: 'sessoes', label: 'Sessões' },
  { id: 'treinos', label: 'Treinos' },
  { id: 'comparacao', label: 'Comparação' },
]

export function PlanoAtribuidoDetail({
  plano,
  selectedTab,
  onTabChange,
  onBack,
  onAdjustPlano,
  onMessageAluno,
  onArchive,
  onSaveAsTemplate,
}: PlanoAtribuidoDetailProps) {
  if (!plano.aluno || !plano.adesao) {
    return (
      <div className="p-8 text-sm text-slate-500 dark:text-slate-400">
        Plano sem aluno atribuído.
      </div>
    )
  }

  return (
    <div
      data-nymos-treinos-detail
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <div style={{ animationDelay: '0ms' }} className="nymos-reveal opacity-0">
          <DetailHeader
            plano={plano}
            onBack={onBack}
            onAdjustPlano={onAdjustPlano}
            onMessageAluno={onMessageAluno}
            onSaveAsTemplate={onSaveAsTemplate}
            onArchive={onArchive}
          />
        </div>

        {/* Stats */}
        <div
          style={{ animationDelay: '100ms' }}
          className="nymos-reveal opacity-0 mt-6"
        >
          <StatsRow adesao={plano.adesao} duracaoSemanas={plano.duracaoSemanas} />
        </div>

        {/* Tabs */}
        <div
          style={{ animationDelay: '200ms' }}
          className="nymos-reveal opacity-0 mt-6 border-b border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center gap-1 overflow-x-auto">
            {TABS.map((t) => {
              const active = selectedTab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTabChange?.(t.id)}
                  className={`
                    relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors
                    ${
                      active
                        ? 'text-slate-900 dark:text-slate-50'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }
                  `}
                >
                  {t.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 bg-teal-500 dark:bg-teal-400" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div
          key={selectedTab}
          style={{ animationDelay: '280ms' }}
          className="nymos-reveal opacity-0 mt-6"
        >
          {selectedTab === 'visao-geral' && <OverviewTab plano={plano} />}
          {selectedTab === 'sessoes' && <SessoesTab plano={plano} />}
          {selectedTab === 'treinos' && (
            <TreinosTab plano={plano} onEdit={onAdjustPlano} />
          )}
          {selectedTab === 'comparacao' && <ComparacaoTab plano={plano} />}
        </div>
      </div>
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
      [data-nymos-treinos-detail] .nymos-reveal {
        animation: nymos-reveal-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-treinos-detail] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
