import { useState } from 'react'
import type {
  MinhaSaudePacienteProps,
  TabId,
} from '@/../product/sections/minha-sa-de-paciente/types'
import { Hero } from './Hero'
import { Tabs } from './Tabs'
import { EstadoAtualTab } from './EstadoAtualTab'
import { AnalisesTab } from './AnalisesTab'
import { EvolucaoTab } from './EvolucaoTab'
import { CompararTab } from './CompararTab'
import { ConsentimentoModal } from './ConsentimentoModal'
import { ProjecaoPromptModal } from './ProjecaoPromptModal'

export function MinhaSaudePaciente({
  tabs,
  activeTab: controlledTab,
  onTabChange,
  overallScore,
  fourAges,
  dimensions,
  narrative,
  activeFilter,
  rangeLabel,
  periodOptions,
  freshnessGate,
  snapshots,
  snapshotDiff,
  fotosTimeline,
  projecao,
  snapshotThumbnails,
  consentimentoConfig,
  isConsentimentoOpen,
  isProjecaoPromptOpen,
  projecaoPrompt,
  projecaoUsage,
  isGeneratingProjecao,
  evolutionPeriod,
  evolutionPeriodOptions,
  dimensionEvolutions,
  onFilterChange,
  onDrillRoute,
  onGapAction,
  onToggleInline,
  onRefreshNarrative,
  onAddFirstMeasurement,
  onViewDevices,
  onRequestNewAnalysis,
  onOpenSnapshot,
  onAddFreshnessRequirement,
  onEvolutionPeriodChange,
  onOpenDimensionEvolution,
  onCompareSnapshots,
  onOpenSnapshotPhoto,
  onStartProjecao,
  onRetryProjecao,
  onConfirmProjecaoPrompt,
  onCancelProjecaoPrompt,
  onAcceptConsentimento,
  onCancelConsentimento,
  isLoadingNarrative,
  hasNarrativeError,
  isRefreshingNarrative,
  isRequestingAnalysis,
}: MinhaSaudePacienteProps) {
  const [internalTab, setInternalTab] = useState<TabId>('estado-atual')
  const activeTab = controlledTab ?? internalTab

  function changeTab(id: TabId) {
    setInternalTab(id)
    onTabChange?.(id)
  }

  return (
    <div
      data-nymos-minha-saude-paciente
      className="min-h-full bg-slate-50/60 dark:bg-slate-950"
    >
      <div className="relative mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
        <Hero />
        <Tabs tabs={tabs} active={activeTab} onChange={changeTab} />

        <div
          role="tabpanel"
          id={`tab-panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === 'estado-atual' && (
            <EstadoAtualTab
              overallScore={overallScore}
              fourAges={fourAges}
              dimensions={dimensions}
              narrative={narrative}
              activeFilter={activeFilter}
              rangeLabel={rangeLabel}
              periodOptions={periodOptions}
              onFilterChange={onFilterChange}
              onDrillRoute={onDrillRoute}
              onGapAction={onGapAction}
              onToggleInline={onToggleInline}
              onRefreshNarrative={onRefreshNarrative}
              onAddFirstMeasurement={onAddFirstMeasurement}
              onViewDevices={onViewDevices}
              isLoadingNarrative={isLoadingNarrative}
              hasNarrativeError={hasNarrativeError}
              isRefreshingNarrative={isRefreshingNarrative}
            />
          )}
          {activeTab === 'analises' && (
            <AnalisesTab
              freshnessGate={freshnessGate}
              snapshots={snapshots}
              thumbnailById={snapshotThumbnails}
              onRequestNewAnalysis={onRequestNewAnalysis}
              onAddFreshnessRequirement={onAddFreshnessRequirement}
              onOpenSnapshot={onOpenSnapshot}
              isRequesting={isRequestingAnalysis}
            />
          )}
          {activeTab === 'evolucao' && (
            <EvolucaoTab
              period={evolutionPeriod}
              periodOptions={evolutionPeriodOptions}
              dimensions={dimensionEvolutions}
              onPeriodChange={onEvolutionPeriodChange}
              onOpenDimension={onOpenDimensionEvolution}
            />
          )}
          {activeTab === 'comparar' && (
            <CompararTab
              snapshots={snapshots}
              snapshotDiff={snapshotDiff}
              fotosTimeline={fotosTimeline}
              projecao={projecao}
              thumbnailById={snapshotThumbnails}
              onCompare={onCompareSnapshots}
              onStartProjecao={onStartProjecao}
              onRetryProjecao={onRetryProjecao}
              onOpenSnapshotPhoto={onOpenSnapshotPhoto}
            />
          )}
        </div>
      </div>

      {/* LGPD consent modal */}
      {consentimentoConfig && (
        <ConsentimentoModal
          open={!!isConsentimentoOpen}
          versaoTermo={consentimentoConfig.versaoTermo}
          requiredScopes={consentimentoConfig.requiredScopes}
          optionalScopes={consentimentoConfig.optionalScopes}
          privacyPolicyHref={consentimentoConfig.privacyPolicyHref}
          onAccept={(scopes) => onAcceptConsentimento?.(scopes)}
          onCancel={() => onCancelConsentimento?.()}
        />
      )}

      {/* Projeção prompt preview modal */}
      <ProjecaoPromptModal
        open={!!isProjecaoPromptOpen}
        prompt={projecaoPrompt ?? null}
        usage={projecaoUsage ?? null}
        isGenerating={isGeneratingProjecao}
        onCancel={() => onCancelProjecaoPrompt?.()}
        onConfirm={(edited) => onConfirmProjecaoPrompt?.(edited)}
      />
    </div>
  )
}
