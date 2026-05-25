import data from '@/../product/sections/diagn-stico-semanal-do-l-der/data.json'
import type {
  ActiveAction,
  Team,
  TimelineEvent,
} from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { ActionDetail } from './components/ActionDetail'

export default function AcaoDetailPreview() {
  const actionId = 'act-001'
  const allActions = data.activeActions as ActiveAction[]
  const action = allActions.find((a) => a.id === actionId) ?? allActions[0]
  const timeline =
    ((data as { timelines?: Record<string, TimelineEvent[]> }).timelines?.[action.id] ?? []) as TimelineEvent[]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-acao-detail],
        [data-nymos-acao-detail] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-acao-detail] .font-mono,
        [data-nymos-acao-detail] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        }
      `}</style>
      <div data-nymos-acao-detail>
        <ActionDetail
          team={data.team as Team}
          action={action}
          timeline={timeline}
          onBack={() => console.log('Voltar')}
          onOpenSourceDiagnosis={(id) => console.log('Abrir diagnóstico de origem', id)}
          onComplete={(id) => console.log('Concluir ação', id)}
          onReopen={(id) => console.log('Reabrir ação', id)}
          onAddProgressNote={(id, note) => console.log('Nota de progresso', id, note)}
          onEditAction={(id) => console.log('Editar ação', id)}
        />
      </div>
    </>
  )
}
