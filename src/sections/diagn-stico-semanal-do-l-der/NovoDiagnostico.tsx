import data from '@/../product/sections/diagn-stico-semanal-do-l-der/data.json'
import type {
  CurrentWeek,
  Team,
  WeeklySignal,
} from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { NovoDiagnosticoWizard } from './components/NovoDiagnosticoWizard'

export default function NovoDiagnosticoPreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-novo-diagnostico],
        [data-nymos-novo-diagnostico] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-novo-diagnostico] .font-mono,
        [data-nymos-novo-diagnostico] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        }
      `}</style>
      <div data-nymos-novo-diagnostico>
        <NovoDiagnosticoWizard
          team={data.team as Team}
          currentWeek={data.currentWeek as CurrentWeek}
          weeklySignals={data.weeklySignals as WeeklySignal[]}
          onSubmit={(draft) => console.log('Submeter diagnóstico', draft)}
          onCancel={() => console.log('Cancelar diagnóstico')}
        />
      </div>
    </>
  )
}
