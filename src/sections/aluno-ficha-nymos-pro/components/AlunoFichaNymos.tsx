import { ChevronLeft, MessageSquare, MoreHorizontal, Activity, Flame, CalendarCheck, TrendingUp, Calendar } from 'lucide-react'
import { NymosPerformanceCorner } from './NymosPerformanceCorner'
import type { AlunoFichaNymosProps, FichaTabId, PerformanceMetric } from '@/../product/sections/aluno-ficha-nymos-pro/types'

const TABS: { id: FichaTabId; label: string }[] = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'avaliacoes', label: 'Avaliações' },
  { id: 'treino', label: 'Treino' },
  { id: 'bioimpedancia', label: 'Bioimpedância' },
  { id: 'fotos', label: 'Fotos' },
  { id: 'atividades', label: 'Atividades' },
  { id: 'metricas', label: 'Métricas' },
  { id: 'mensagens', label: 'Mensagens' },
]

function formatBR(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function PerformanceCard({ metric }: { metric: PerformanceMetric }) {
  const trendColor =
    metric.trend === 'up'
      ? 'text-teal-300'
      : metric.trend === 'down'
        ? 'text-orange-300'
        : 'text-slate-500'
  return (
    <div className="border border-slate-800 bg-slate-950/40 px-4 py-3.5 min-h-[88px] flex flex-col justify-between">
      <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-slate-500">
        {metric.label}
      </div>
      {metric.value !== null ? (
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[26px] font-light tabular-nums text-slate-100">
              {metric.value}
            </span>
            {metric.unit && (
              <span className="text-[11px] text-slate-500">{metric.unit}</span>
            )}
          </div>
          {metric.trendDeltaPct !== null && (
            <div className={`text-[10px] font-mono tabular-nums ${trendColor} mt-0.5`}>
              {metric.trendDeltaPct > 0 ? '+' : ''}
              {metric.trendDeltaPct.toFixed(1)}% · 4sem
            </div>
          )}
        </div>
      ) : (
        <span className="text-[26px] font-light text-slate-700">—</span>
      )}
    </div>
  )
}

function FakeChart() {
  // Simple SVG sparkline mimic — looks like weight evolution
  const points = '10,40 50,38 90,35 130,32 170,28 210,26 250,22 290,20 330,18'
  return (
    <div className="relative h-48 w-full overflow-hidden">
      <svg viewBox="0 0 340 60" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid */}
        {[0, 15, 30, 45, 60].map((y) => (
          <line
            key={y}
            x1={0}
            x2={340}
            y1={y}
            y2={y}
            stroke="rgba(100,116,139,0.12)"
            strokeWidth="0.4"
          />
        ))}
        {/* Area */}
        <polygon
          points={`0,60 ${points} 340,60`}
          fill="url(#gradient)"
          opacity="0.4"
        />
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="rgb(45,212,191)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(45,212,191)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="rgb(45,212,191)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute bottom-1 left-0 right-0 flex justify-between px-1 text-[9px] font-mono text-slate-500 tracking-wider">
        <span>JAN</span>
        <span>FEV</span>
        <span>MAR</span>
        <span>ABR</span>
        <span>MAI</span>
      </div>
    </div>
  )
}

export function AlunoFichaNymos({
  student,
  metrics,
  adherence,
  analysisInsights,
  suggestedAction,
  widgetStatus,
  pendingSignalsCount,
  planGate,
  onBack,
  onOpenMessages,
  onSwitchTab,
  onExpand,
  onCollapse,
  onGenerateReport,
  onShareWithStudent,
  onAskNymos,
  onDrillDownInsight,
  onDrillDownMetric,
  onAcceptSuggestion,
  onOpenPaywall,
}: AlunoFichaNymosProps) {
  const activeTab: FichaTabId = 'overview'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.22em] uppercase text-teal-400/80 mb-4">
          <span className="w-1 h-1 bg-teal-400 rounded-full" />
          <span>Carteira</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">Ficha do Aluno</span>
        </div>

        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 mb-4"
        >
          <ChevronLeft size={16} />
          Voltar para alunos
        </button>

        {/* Student strip */}
        <div className="flex items-start gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-600/80 flex items-center justify-center text-white font-semibold text-2xl shrink-0">
            {student.avatarInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-slate-500 mb-1">
              Aluno desde {formatBR(student.studentSince)}
            </div>
            <h1 className="text-[34px] font-medium leading-tight text-slate-100 mb-2">
              {student.displayName}
            </h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-teal-300 bg-teal-500/10 border border-teal-500/30 rounded-full px-2.5 py-0.5">
                <span className="w-1.5 h-1.5 bg-teal-300 rounded-full" />
                {student.planLabel}
              </span>
              <span className="inline-flex items-center text-[11px] font-medium text-slate-300 bg-slate-800/60 border border-slate-700 rounded-full px-2.5 py-0.5">
                {student.planTag}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-300 border border-teal-500/30 rounded-full px-2.5 py-0.5">
                <span>📱</span> Vinculado app
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenMessages}
              className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-600 bg-slate-900/60 px-3.5 py-2 text-sm text-slate-200 rounded-md"
            >
              <MessageSquare size={14} />
              Mensagem
            </button>
            <button
              type="button"
              className="w-9 h-9 border border-slate-700 hover:border-slate-600 bg-slate-900/60 rounded-md flex items-center justify-center text-slate-400"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-5 gap-2.5 mb-7">
          {[
            { icon: Activity, label: 'Adesão', value: `${adherence.scorePct}%` },
            { icon: Flame, label: 'Streak', value: `${adherence.currentStreakSessions} sessões` },
            { icon: CalendarCheck, label: 'Sessões', value: `${adherence.sessionsThisWeek}/${adherence.sessionsTargetWeek}` },
            { icon: TrendingUp, label: 'Última avaliação', value: formatBR(metrics[0].lastMeasuredAt || student.studentSince) },
            { icon: Calendar, label: 'Próxima sessão', value: adherence.nextScheduledAt ? formatBR(adherence.nextScheduledAt) : '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="border border-slate-800 bg-slate-950/30 rounded-full px-4 py-2 flex items-center gap-2 text-[11px] font-mono tracking-[0.18em] uppercase"
            >
              <Icon size={12} className="text-teal-400 shrink-0" />
              <span className="text-slate-500">{label}</span>
              <span className="text-slate-300 normal-case tracking-normal font-sans ml-auto">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-800 flex items-center gap-7 mb-6">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSwitchTab?.(tab.id)}
                className={`pb-3 text-sm relative ${
                  isActive
                    ? 'text-teal-300 font-medium'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-400" />
                )}
              </button>
            )
          })}
        </div>

        {/* Performance summary */}
        <section className="mb-7">
          <h2 className="text-[10px] font-mono tracking-[0.22em] uppercase text-slate-500 mb-3">
            Resumo de performance
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {metrics.map((m) => (
              <PerformanceCard key={m.id} metric={m} />
            ))}
          </div>
        </section>

        {/* Bottom row: chart + Nymos corner */}
        <div className="grid grid-cols-[1fr_300px] gap-5">
          {/* Evolução */}
          <section className="border border-slate-800 bg-slate-950/30 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-mono tracking-[0.22em] uppercase text-slate-500">
                Evolução
              </h2>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-teal-300 font-medium flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-teal-300" /> Peso
                </span>
                <span className="text-slate-500">% Gordura</span>
                <span className="text-slate-500">IMC</span>
                <span className="text-slate-500">Cintura</span>
                <span className="text-slate-500">Massa magra</span>
              </div>
            </div>
            <FakeChart />
            <div className="mt-3 flex items-center justify-between text-[10.5px] font-mono text-slate-500 tracking-wider uppercase">
              <span>Última: {formatBR(metrics[0].lastMeasuredAt || student.studentSince)}</span>
              <span className="text-teal-300/80">+1.8% em 4 sem</span>
            </div>
          </section>

          {/* Nymos corner widget */}
          <NymosPerformanceCorner
            student={student}
            metrics={metrics}
            adherence={adherence}
            analysisInsights={analysisInsights}
            suggestedAction={suggestedAction}
            widgetStatus={widgetStatus}
            pendingSignalsCount={pendingSignalsCount}
            planGate={planGate}
            onExpand={onExpand}
            onCollapse={onCollapse}
            onGenerateReport={onGenerateReport}
            onShareWithStudent={onShareWithStudent}
            onAskNymos={onAskNymos}
            onDrillDownInsight={onDrillDownInsight}
            onDrillDownMetric={onDrillDownMetric}
            onAcceptSuggestion={onAcceptSuggestion}
            onOpenPaywall={onOpenPaywall}
          />
        </div>
      </div>
    </div>
  )
}
