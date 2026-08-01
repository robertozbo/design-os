import data from '@/../product/sections/aluno-ficha-nymos-pro/data.json'
import { AlunoFichaNymos } from './components/AlunoFichaNymos'
import type {
  AdherenceSnapshot,
  AnalysisInsight,
  PerformanceMetric,
  PlanGate,
  StudentSnapshot,
  SuggestedAction,
  WidgetStatus,
} from '@/../product/sections/aluno-ficha-nymos-pro/types'

export default function AlunoFichaNymosPreview() {
  return (
    <AlunoFichaNymos
      student={data.student as StudentSnapshot}
      metrics={data.metrics as PerformanceMetric[]}
      adherence={data.adherence as AdherenceSnapshot}
      analysisInsights={data.analysisInsights as AnalysisInsight[]}
      suggestedAction={data.suggestedAction as SuggestedAction | null}
      widgetStatus={data.widgetStatus as WidgetStatus}
      pendingSignalsCount={data.pendingSignalsCount}
      planGate={data.planGate as PlanGate}
      onBack={() => console.log('back')}
      onOpenMessages={() => console.log('open messages')}
      onSwitchTab={(tabId) => console.log('switch tab', tabId)}
      onExpand={() => console.log('expand widget')}
      onCollapse={() => console.log('collapse widget')}
      onGenerateReport={() => console.log('generate report')}
      onShareWithStudent={() => console.log('share with student')}
      onAskNymos={(q) => console.log('ask nymos', q)}
      onDrillDownInsight={(p) => console.log('drilldown insight', p)}
      onDrillDownMetric={(id) => console.log('drilldown metric', id)}
      onAcceptSuggestion={(p) => console.log('accept suggestion', p)}
      onOpenPaywall={() => console.log('open paywall')}
    />
  )
}
