import data from '@/../product/sections/aluno-ficha-nymos-pro/data.json'
import { useEffect } from 'react'
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

/**
 * Variante do preview que abre o popover do Nymos automaticamente — usada
 * para captura de screenshot do estado expandido.
 */
export default function AlunoFichaNymosAberto() {
  useEffect(() => {
    const tryClick = () => {
      const btn = document.querySelector(
        'button[aria-label^="Análise Nymos"]'
      ) as HTMLButtonElement | null
      if (btn) {
        btn.click()
        return true
      }
      return false
    }

    if (!tryClick()) {
      // Wait until rendered, then click
      const id = setInterval(() => {
        if (tryClick()) clearInterval(id)
      }, 100)
      setTimeout(() => clearInterval(id), 3000)
    }
  }, [])

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
    />
  )
}
