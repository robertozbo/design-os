import type {
  AlunoFichaProps,
  DetailTabId,
} from '@/../product-personal/sections/alunos/types'
import { FichaHeader } from './FichaHeader'
import { FichaStats } from './FichaStats'
import { FichaOverviewTab } from './FichaOverviewTab'
import { FichaTreinoTab } from './FichaTreinoTab'
import { FichaAtividadesTab } from './FichaAtividadesTab'
import { FichaMetricasTab } from './FichaMetricasTab'
import { FichaAvaliacoesTab } from './FichaAvaliacoesTab'
import { FichaMensagensTab } from './FichaMensagensTab'

const TABS: { id: DetailTabId; label: string }[] = [
  { id: 'visao-geral', label: 'Visão geral' },
  { id: 'treino', label: 'Treino' },
  { id: 'atividades', label: 'Atividades' },
  { id: 'metricas', label: 'Métricas' },
  { id: 'avaliacoes', label: 'Avaliações' },
  { id: 'mensagens', label: 'Mensagens' },
]

export function AlunoFicha({
  aluno,
  selectedTab,
  onTabChange,
  onBack,
  onMessage,
  onApplyTemplate,
  onNovaAvaliacao,
  onPausar,
  onSendMessage,
  onAddNotaPrivada,
  onRemoveNotaPrivada,
  onOpenAvaliacao,
  onEditAvaliacao,
}: AlunoFichaProps) {
  const naoLidas = aluno.mensagensNaoLidas

  return (
    <div
      data-nymos-aluno-ficha
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
          <FichaHeader
            aluno={aluno}
            onBack={onBack}
            onMessage={onMessage}
            onNovaAvaliacao={onNovaAvaliacao}
            onPausar={onPausar}
          />
        </div>

        {/* Stats */}
        <div
          style={{ animationDelay: '120ms' }}
          className="nymos-reveal opacity-0 mt-6"
        >
          <FichaStats aluno={aluno} />
        </div>

        {/* Tabs */}
        <div
          style={{ animationDelay: '200ms' }}
          className="nymos-reveal opacity-0 mt-6 border-b border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center gap-0 overflow-x-auto">
            {TABS.map((t) => {
              const active = selectedTab === t.id
              const showBadge = t.id === 'mensagens' && naoLidas > 0
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTabChange?.(t.id)}
                  className={`
                    relative inline-flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors
                    ${
                      active
                        ? 'text-slate-900 dark:text-slate-50'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }
                  `}
                >
                  {t.label}
                  {showBadge && (
                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 font-mono text-[9px] font-semibold text-white">
                      {naoLidas}
                    </span>
                  )}
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
          {selectedTab === 'visao-geral' && (
            <FichaOverviewTab
              aluno={aluno}
              onOpenPlano={() => onTabChange?.('treino')}
              onAnaliseIA={() => console.log('analise IA')}
              onNovaAvaliacao={onNovaAvaliacao}
            />
          )}
          {selectedTab === 'treino' && (
            <FichaTreinoTab
              aluno={aluno}
              onApplyTemplate={onApplyTemplate}
              onEditPlano={() => console.log('editar plano')}
            />
          )}
          {selectedTab === 'atividades' && (
            <FichaAtividadesTab aluno={aluno} />
          )}
          {selectedTab === 'metricas' && (
            <FichaMetricasTab aluno={aluno} />
          )}
          {selectedTab === 'avaliacoes' && (
            <FichaAvaliacoesTab
              aluno={aluno}
              onNovaAvaliacao={onNovaAvaliacao}
              onOpenAvaliacao={onOpenAvaliacao}
              onEditAvaliacao={onEditAvaliacao}
            />
          )}
          {selectedTab === 'mensagens' && (
            <FichaMensagensTab
              aluno={aluno}
              onSendMessage={onSendMessage}
              onAddNotaPrivada={onAddNotaPrivada}
              onRemoveNotaPrivada={onRemoveNotaPrivada}
            />
          )}
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
      [data-nymos-aluno-ficha] .nymos-reveal {
        animation: nymos-reveal-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-aluno-ficha] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
