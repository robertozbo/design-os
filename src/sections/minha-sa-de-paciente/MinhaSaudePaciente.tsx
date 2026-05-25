import data from '@/../product/sections/minha-sa-de-paciente/data.json'
import type {
  AnalysisSnapshot,
  DimensionAggregate,
  DimensionEvolution,
  EscopoConsentimento,
  EvolutionPeriod,
  EvolutionPeriodOption,
  FourAges,
  FreshnessGate,
  HealthNarrative,
  MinhaSaudePacienteProps,
  OverallScore,
  PeriodFilterValue,
  PeriodOption,
  ProjecaoCorporal,
  SnapshotDiff,
  SnapshotFotos,
  TabConfig,
} from '@/../product/sections/minha-sa-de-paciente/types'
import { MinhaSaudePaciente as MinhaSaudePacienteView } from './components/MinhaSaudePaciente'

export default function MinhaSaudePacientePreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-minha-saude-paciente],
        [data-nymos-minha-saude-paciente] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-minha-saude-paciente] .font-mono,
        [data-nymos-minha-saude-paciente] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <MinhaSaudePacienteView
        tabs={data.tabs as TabConfig[]}
        overallScore={data.overallScore as OverallScore}
        fourAges={data.fourAges as FourAges}
        dimensions={data.dimensions as DimensionAggregate[]}
        narrative={data.narrative as HealthNarrative}
        activeFilter={data.activeFilter as PeriodFilterValue}
        rangeLabel={data.rangeLabel}
        periodOptions={data.periodOptions as PeriodOption[]}
        freshnessGate={data.freshnessGate as FreshnessGate}
        snapshots={data.snapshots as AnalysisSnapshot[]}
        snapshotThumbnails={data.snapshotThumbnails as Record<string, string>}
        snapshotDiff={data.snapshotDiff as SnapshotDiff}
        fotosTimeline={data.fotosTimeline as SnapshotFotos[]}
        projecao={data.projecao as ProjecaoCorporal}
        consentimentoConfig={
          data.consentimentoConfig as MinhaSaudePacienteProps['consentimentoConfig']
        }
        evolutionPeriod={data.evolutionPeriod as EvolutionPeriod}
        evolutionPeriodOptions={
          data.evolutionPeriodOptions as EvolutionPeriodOption[]
        }
        dimensionEvolutions={
          data.dimensionEvolutions as DimensionEvolution[]
        }
        onTabChange={(id) => console.log('[MinhaSaudePaciente] tab:', id)}
        onFilterChange={(next) =>
          console.log('[MinhaSaudePaciente] filter:', next)
        }
        onDrillRoute={(id, href) =>
          console.log('[MinhaSaudePaciente] drill:', id, href)
        }
        onGapAction={(id, href) =>
          console.log('[MinhaSaudePaciente] gap action:', id, href)
        }
        onToggleInline={(id, open) =>
          console.log('[MinhaSaudePaciente] toggle inline:', id, open)
        }
        onRefreshNarrative={() =>
          console.log('[MinhaSaudePaciente] refresh narrative')
        }
        onAddFirstMeasurement={() =>
          console.log('[MinhaSaudePaciente] add first measurement')
        }
        onViewDevices={() => console.log('[MinhaSaudePaciente] view devices')}
        onRequestNewAnalysis={() =>
          console.log('[MinhaSaudePaciente] request new analysis')
        }
        onOpenSnapshot={(id) =>
          console.log('[MinhaSaudePaciente] open snapshot:', id)
        }
        onAddFreshnessRequirement={(kind, href) =>
          console.log('[MinhaSaudePaciente] add requirement:', kind, href)
        }
        onEvolutionPeriodChange={(p) =>
          console.log('[MinhaSaudePaciente] evolution period:', p)
        }
        onOpenDimensionEvolution={(id) =>
          console.log('[MinhaSaudePaciente] open dim evolution:', id)
        }
        onCompareSnapshots={(a, b) =>
          console.log('[MinhaSaudePaciente] compare:', a, b)
        }
        onOpenSnapshotPhoto={(id) =>
          console.log('[MinhaSaudePaciente] open snapshot photo:', id)
        }
        onStartProjecao={() =>
          console.log('[MinhaSaudePaciente] start projecao')
        }
        onRetryProjecao={() =>
          console.log('[MinhaSaudePaciente] retry projecao')
        }
        onConfirmProjecaoPrompt={(prompt) =>
          console.log('[MinhaSaudePaciente] confirm prompt:', prompt)
        }
        onCancelProjecaoPrompt={() =>
          console.log('[MinhaSaudePaciente] cancel prompt')
        }
        onAcceptConsentimento={(scopes) =>
          console.log('[MinhaSaudePaciente] accept consent:', scopes)
        }
        onCancelConsentimento={() =>
          console.log('[MinhaSaudePaciente] cancel consent')
        }
      />
    </>
  )
}
