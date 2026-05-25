import type { PacientesProps, TabKey } from '@/../product/sections/pacientes/types'
import { PatientDetailHeader } from './PatientDetailHeader'
import { PatientDetailTabs } from './PatientDetailTabs'
import { AtendimentosTab } from './tabs/AtendimentosTab'
import { AtividadesTab } from './tabs/AtividadesTab'
import { AvaliacaoTab } from './tabs/AvaliacaoTab'
import { ComunicacoesTab } from './tabs/ComunicacoesTab'
import { MetricasTab } from './tabs/MetricasTab'
import { NutricaoTab } from './tabs/NutricaoTab'
import { PerfilTab } from './tabs/PerfilTab'
import { VisaoGeralTab } from './tabs/VisaoGeralTab'

export function PatientDetail({
  nutri,
  patientDetail,
  onTabChange,
  onAgendarConsulta,
  onOpenAnaliseIa,
  onOpenNovoAtendimento,
  onOpenAtendimento,
  onTrocarPlano,
  onTogglePermissao,
  onSaveNotas,
  onPerfilAction,
  onSendMessage,
  onQuickReply,
  onRangeChange,
  onUpgradeClick,
}: PacientesProps) {
  const { patient, stats, activeTab, tabs } = patientDetail

  return (
    <div
      data-nymos-paciente-detalhe
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
          <PatientDetailHeader
            patient={patient}
            stats={stats}
            currentPlan={nutri.plan}
            onAgendar={onAgendarConsulta}
            onAnaliseIa={onOpenAnaliseIa}
            onNovoAtendimento={onOpenNovoAtendimento}
          />
        </div>

        {/* Tabs */}
        <div
          style={{ animationDelay: '180ms' }}
          className="nymos-reveal opacity-0 mt-8"
        >
          <PatientDetailTabs
            tabs={tabs}
            activeTab={activeTab}
            currentPlan={nutri.plan}
            onTabChange={onTabChange}
          />
        </div>

        {/* Tab content */}
        <div
          style={{ animationDelay: '320ms' }}
          className="nymos-reveal opacity-0 mt-6"
        >
          <TabContent
            activeTab={activeTab}
            patientDetail={patientDetail}
            nutri={nutri}
            onRangeChange={onRangeChange}
            onAnaliseIa={onOpenAnaliseIa}
            onOpenNovoAtendimento={onOpenNovoAtendimento}
            onOpenAtendimento={onOpenAtendimento}
            onTrocarPlano={onTrocarPlano}
            onTogglePermissao={onTogglePermissao}
            onSaveNotas={onSaveNotas}
            onPerfilAction={onPerfilAction}
            onSendMessage={onSendMessage}
            onQuickReply={onQuickReply}
            onUpgradeClick={onUpgradeClick}
          />
        </div>
      </div>
    </div>
  )
}

function TabContent({
  activeTab,
  patientDetail,
  nutri,
  onRangeChange,
  onAnaliseIa,
  onOpenNovoAtendimento,
  onOpenAtendimento,
  onTrocarPlano,
  onTogglePermissao,
  onSaveNotas,
  onPerfilAction,
  onSendMessage,
  onQuickReply,
  onUpgradeClick,
}: {
  activeTab: TabKey
  patientDetail: PacientesProps['patientDetail']
  nutri: PacientesProps['nutri']
  onRangeChange?: PacientesProps['onRangeChange']
  onAnaliseIa?: PacientesProps['onOpenAnaliseIa']
  onOpenNovoAtendimento?: PacientesProps['onOpenNovoAtendimento']
  onOpenAtendimento?: PacientesProps['onOpenAtendimento']
  onTrocarPlano?: PacientesProps['onTrocarPlano']
  onTogglePermissao?: PacientesProps['onTogglePermissao']
  onSaveNotas?: PacientesProps['onSaveNotas']
  onPerfilAction?: PacientesProps['onPerfilAction']
  onSendMessage?: PacientesProps['onSendMessage']
  onQuickReply?: PacientesProps['onQuickReply']
  onUpgradeClick?: PacientesProps['onUpgradeClick']
}) {
  const currentPlan = nutri.plan

  switch (activeTab) {
    case 'visao-geral':
      return (
        <VisaoGeralTab
          data={patientDetail.visaoGeral}
          currentPlan={currentPlan}
          onRangeChange={(rangeId) => onRangeChange?.(rangeId, 'evolucao-peso')}
          onAnaliseIa={onAnaliseIa}
        />
      )
    case 'atendimentos':
      return (
        <AtendimentosTab
          data={patientDetail.atendimentos}
          currentPlan={currentPlan}
          onOpenNovoAtendimento={onOpenNovoAtendimento}
          onOpenAtendimento={onOpenAtendimento}
        />
      )
    case 'avaliacao':
      return (
        <AvaliacaoTab
          data={patientDetail.avaliacao}
          currentPlan={currentPlan}
          onUpgradeClick={onUpgradeClick}
        />
      )
    case 'nutricao':
      return (
        <NutricaoTab data={patientDetail.nutricao} onTrocarPlano={onTrocarPlano} />
      )
    case 'atividades':
      return <AtividadesTab data={patientDetail.atividades} />
    case 'metricas':
      return (
        <MetricasTab
          data={patientDetail.metricas}
          onRangeChange={(rangeId) => onRangeChange?.(rangeId, 'metricas')}
        />
      )
    case 'comunicacoes':
      return (
        <ComunicacoesTab
          data={patientDetail.comunicacoes}
          patientName={patientDetail.patient.name}
          patientAvatarUrl={patientDetail.patient.avatarUrl}
          nutriName={nutri.name}
          nutriAvatarUrl={nutri.avatarUrl}
          currentPlan={currentPlan}
          onSendMessage={onSendMessage}
          onQuickReply={onQuickReply}
          onUpgradeClick={onUpgradeClick}
        />
      )
    case 'perfil':
      return (
        <PerfilTab
          data={patientDetail.perfil}
          onTogglePermissao={onTogglePermissao}
          onSaveNotas={onSaveNotas}
          onPerfilAction={onPerfilAction}
        />
      )
    default:
      return (
        <PlaceholderTab
          tabKey={activeTab}
          onUpgradeClick={onUpgradeClick}
        />
      )
  }
}

function PlaceholderTab({
  tabKey,
  onUpgradeClick,
}: {
  tabKey: TabKey
  onUpgradeClick?: PacientesProps['onUpgradeClick']
}) {
  const TAB_LABELS: Record<TabKey, string> = {
    'visao-geral': 'Visão Geral',
    atendimentos: 'Atendimentos',
    avaliacao: 'Avaliação',
    nutricao: 'Nutrição',
    atividades: 'Atividades',
    metricas: 'Métricas',
    comunicacoes: 'Comunicações',
    perfil: 'Perfil',
  }

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 px-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
        Em construção
      </p>
      <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">
        Tab {TAB_LABELS[tabKey]}
      </h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Esta tab será desenhada nos próximos batches do design.
      </p>
      <button
        type="button"
        onClick={() => onUpgradeClick?.('pro')}
        className="mt-4 text-xs font-medium text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
      >
        (Voltar para Visão Geral)
      </button>
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
      [data-nymos-paciente-detalhe] .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-paciente-detalhe] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
