import data from '@/../product/sections/diagn-stico-semanal-do-l-der/data.json'
import type {
  DiagnosisHistoryEntry,
  Team,
} from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { DiagnosticoHistory } from './components/DiagnosticoHistory'

export default function HistoricoDiagnosticosPreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-historico-diagnosticos],
        [data-nymos-historico-diagnosticos] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-historico-diagnosticos] .font-mono,
        [data-nymos-historico-diagnosticos] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        }
      `}</style>
      <div data-nymos-historico-diagnosticos>
        <DiagnosticoHistory
          team={data.team as Team}
          diagnosisHistory={data.diagnosisHistory as DiagnosisHistoryEntry[]}
          archivedDiagnoses={data.archivedDiagnoses as DiagnosisHistoryEntry[]}
          onOpenDiagnosisDetail={(id) => console.log('Abrir diagnóstico', id)}
          onFilterHistory={(period) => console.log('Filtrar período', period)}
          onSearchHistory={(query) => console.log('Buscar', query)}
          onStartDiagnosis={() => console.log('Iniciar novo diagnóstico')}
        />
      </div>
    </>
  )
}
