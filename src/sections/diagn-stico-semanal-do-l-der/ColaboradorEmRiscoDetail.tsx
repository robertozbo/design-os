import data from '@/../product/sections/diagn-stico-semanal-do-l-der/data.json'
import type {
  RiskCollaborator,
  Team,
  TimelineEvent,
} from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { RiskCollaboratorDetail } from './components/RiskCollaboratorDetail'

export default function ColaboradorEmRiscoDetailPreview() {
  const targetId = 'Colaborador #4307'
  const all = data.riskCollaborators as RiskCollaborator[]
  const collaborator = all.find((c) => c.anonId === targetId) ?? all[0]
  const timeline =
    ((data as { timelines?: Record<string, TimelineEvent[]> }).timelines?.[collaborator.anonId] ?? []) as TimelineEvent[]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-colab-detail],
        [data-nymos-colab-detail] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-colab-detail] .font-mono,
        [data-nymos-colab-detail] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        }
      `}</style>
      <div data-nymos-colab-detail>
        <RiskCollaboratorDetail
          team={data.team as Team}
          collaborator={collaborator}
          timeline={timeline}
          onBack={() => console.log('Voltar')}
          onAddLeaderNote={(anonId, note) => console.log('Nota privada', anonId, note)}
          onForwardToSst={(anonId) => console.log('Encaminhar ao SST', anonId)}
          onCloseObservation={(anonId) => console.log('Encerrar observação', anonId)}
        />
      </div>
    </>
  )
}
