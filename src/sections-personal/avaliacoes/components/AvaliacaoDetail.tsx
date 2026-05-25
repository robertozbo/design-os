import {
  Activity,
  GitCompare,
  ImageIcon,
  Ruler,
} from 'lucide-react'
import type {
  AvaliacaoDetailProps,
  DetailTabId,
} from '@/../product-personal/sections/avaliacoes/types'
import { DetailHeader } from './DetailHeader'
import { DetailStats } from './DetailStats'
import { AntropometriaPanel } from './AntropometriaPanel'
import { FuncionalPanel } from './FuncionalPanel'
import { ComparacaoPanel } from './ComparacaoPanel'
import { FotosPanel } from './FotosPanel'

const TABS: { id: DetailTabId; label: string; icon: React.ElementType }[] = [
  { id: 'antropometria', label: 'Antropometria', icon: Ruler },
  { id: 'funcional', label: 'Funcional', icon: Activity },
  { id: 'comparacao', label: 'Comparação', icon: GitCompare },
  { id: 'fotos', label: 'Fotos', icon: ImageIcon },
]

export function AvaliacaoDetail({
  avaliacao,
  outrasAvaliacoes,
  selectedTab,
  comparacaoId,
  onTabChange,
  onComparacaoChange,
  onBack,
  onEdit,
  onDuplicate,
  onCompare,
  onExportPdf,
  onDelete,
  onToggleNutriShare,
}: AvaliacaoDetailProps) {
  // Avaliação anterior (mais recente antes desta) — pra radar fantasma
  const anterior =
    outrasAvaliacoes
      .filter(
        (a) =>
          a.alunoId === avaliacao.alunoId &&
          a.id !== avaliacao.id &&
          a.data < avaliacao.data,
      )
      .sort((a, b) => b.data.localeCompare(a.data))[0] ?? null

  return (
    <div
      data-nymos-avaliacao-detail
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
            avaliacao={avaliacao}
            onBack={onBack}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onCompare={onCompare}
            onExportPdf={onExportPdf}
            onDelete={onDelete}
            onToggleNutriShare={onToggleNutriShare}
          />
        </div>

        {/* Stats */}
        <div
          style={{ animationDelay: '100ms' }}
          className="nymos-reveal opacity-0 mt-6"
        >
          <DetailStats avaliacao={avaliacao} />
        </div>

        {/* Tabs */}
        <div
          style={{ animationDelay: '180ms' }}
          className="nymos-reveal opacity-0 mt-6 border-b border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center gap-0 overflow-x-auto">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = selectedTab === t.id
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
                  <Icon size={13} />
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
          style={{ animationDelay: '260ms' }}
          className="nymos-reveal opacity-0 mt-6"
        >
          {selectedTab === 'antropometria' && (
            <AntropometriaPanel antropometria={avaliacao.antropometria} />
          )}
          {selectedTab === 'funcional' && (
            <FuncionalPanel avaliacao={avaliacao} anterior={anterior} />
          )}
          {selectedTab === 'comparacao' && (
            <ComparacaoPanel
              atual={avaliacao}
              outras={outrasAvaliacoes}
              comparacaoId={comparacaoId}
              onChange={onComparacaoChange}
            />
          )}
          {selectedTab === 'fotos' && (
            <FotosPanel atual={avaliacao} outras={outrasAvaliacoes} />
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
      [data-nymos-avaliacao-detail] .nymos-reveal {
        animation: nymos-reveal-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-avaliacao-detail] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
