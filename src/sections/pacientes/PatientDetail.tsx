import { useState } from 'react'
import data from '@/../product/sections/pacientes/data.json'
import type { PacientesProps, TabKey } from '@/../product/sections/pacientes/types'
import { PatientDetail as PatientDetailView } from './components/PatientDetail'

export default function PatientDetailPreview() {
  const baseProps = data as unknown as PacientesProps
  const [activeTab, setActiveTab] = useState<TabKey>(baseProps.patientDetail.activeTab)

  const liveProps: PacientesProps = {
    ...baseProps,
    patientDetail: {
      ...baseProps.patientDetail,
      activeTab,
    },
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-paciente-detalhe],
        [data-nymos-paciente-detalhe] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-paciente-detalhe] .font-mono,
        [data-nymos-paciente-detalhe] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <PatientDetailView
        {...liveProps}
        onTabChange={setActiveTab}
        onAgendarConsulta={() => console.log('agendar consulta')}
        onOpenAnaliseIa={() => console.log('open análise IA')}
        onOpenNovoAtendimento={() => console.log('open novo atendimento')}
        onOpenAtendimento={(id) => console.log('open atendimento', id)}
        onAtendimentoStepChange={(s) => console.log('step →', s)}
        onSaveAtendimentoDraft={() => console.log('save draft')}
        onFinalizeAtendimento={() => console.log('finalize')}
        onTrocarPlano={() => console.log('trocar plano')}
        onTogglePermissao={(id, e) => console.log('toggle perm', id, e)}
        onSaveNotas={(n) => console.log('save notas', n)}
        onPerfilAction={(id) => console.log('perfil action', id)}
        onSendMessage={(t) => console.log('send msg', t)}
        onQuickReply={(t) => console.log('quick reply', t)}
        onRangeChange={(r, source) => console.log('range →', r, source)}
        onUpgradeClick={(plan) => console.log('upgrade to', plan)}
        onSearchChange={() => {}}
        onFilterChange={() => {}}
        onSortChange={() => {}}
        onOpenPatient={() => {}}
        onOpenInviteModal={() => {}}
        onOpenCadastrarModal={() => {}}
        onCloseModal={() => {}}
        onCopyInvite={() => {}}
        onShareInvite={() => {}}
        onSubmitCadastrar={() => {}}
      />
    </>
  )
}
