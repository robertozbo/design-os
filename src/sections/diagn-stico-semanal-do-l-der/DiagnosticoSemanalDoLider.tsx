import data from '@/../product/sections/diagn-stico-semanal-do-l-der/data.json'
import type {
  ActionStatus,
  ActiveAction,
  CurrentWeek,
  DiagnosisHistoryEntry,
  RiskCollaborator,
  SignalHistory,
  Team,
  WeeklySignal,
} from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { DiagnosticoSemanalDoLider } from './components/DiagnosticoSemanalDoLider'

export default function DiagnosticoSemanalDoLiderPreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-diagnostico-lider],
        [data-nymos-diagnostico-lider] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-diagnostico-lider] .font-mono,
        [data-nymos-diagnostico-lider] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        }
      `}</style>
      <div data-nymos-diagnostico-lider>
        <DiagnosticoSemanalDoLider
          team={data.team as Team}
          currentWeek={data.currentWeek as CurrentWeek}
          weeklySignals={data.weeklySignals as WeeklySignal[]}
          signalHistory={data.signalHistory as SignalHistory}
          diagnosisHistory={data.diagnosisHistory as DiagnosisHistoryEntry[]}
          activeActions={data.activeActions as ActiveAction[]}
          riskCollaborators={data.riskCollaborators as RiskCollaborator[]}
          archivedDiagnoses={data.archivedDiagnoses as DiagnosisHistoryEntry[]}
          onStartDiagnosis={() => console.log('Iniciar diagnóstico semanal')}
          onOpenDiagnosisDetail={(id) => console.log('Abrir diagnóstico', id)}
          onOpenActionDetail={(id) => console.log('Abrir ação', id)}
          onUpdateActionStatus={(id, status: ActionStatus) =>
            console.log('Atualizar status da ação', id, status)
          }
          onOpenRiskCollaborator={(anonId) => console.log('Abrir colaborador em risco', anonId)}
          onUpdateRiskNotes={(anonId, notes) => console.log('Atualizar notas', anonId, notes)}
          onFilterHistory={(period) => console.log('Filtrar histórico', period)}
          onSearchHistory={(query) => console.log('Buscar no histórico', query)}
          onForwardToSst={(anonId) => console.log('Encaminhar ao SST', anonId)}
        />
      </div>
    </>
  )
}
