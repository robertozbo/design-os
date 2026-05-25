import data from '@/../product/sections/bioimped-ncia-paciente/data.json'
import type {
  BioExamTypeInfo,
  BioHistoryEntry,
  BioMetricKey,
  BioMetricOption,
  BioPeriod,
  BioPeriodOption,
  BioReadingView,
  BioSeriesMap,
  BioStats,
} from '@/../product/sections/bioimped-ncia-paciente/types'
import { BioimpedanciaPaciente as BioimpedanciaPacienteView } from './components/BioimpedanciaPaciente'

export default function BioimpedanciaPacientePreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-bioimped-ncia-paciente],
        [data-nymos-bioimped-ncia-paciente] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-bioimped-ncia-paciente] .font-mono,
        [data-nymos-bioimped-ncia-paciente] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
        [data-nymos-bioimped-ncia-paciente] .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        [data-nymos-bioimped-ncia-paciente] .scrollbar-none {
          scrollbar-width: none;
        }
      `}</style>
      <BioimpedanciaPacienteView
        stats={data.stats as BioStats}
        latestReading={data.latestReading as BioReadingView}
        examTypeInfo={data.examTypeInfo as BioExamTypeInfo}
        metricOptions={data.metricOptions as BioMetricOption[]}
        activeMetric={data.activeMetric as BioMetricKey}
        activePeriod={data.activePeriod as BioPeriod}
        periodOptions={data.periodOptions as BioPeriodOption[]}
        evolutionSeries={data.evolutionSeries as BioSeriesMap}
        history={data.history as BioHistoryEntry[]}
        processingIds={data.processingIds as string[]}
        onMetricChange={(k) => console.log('[Bio] metric:', k)}
        onPeriodChange={(p) => console.log('[Bio] period:', p)}
        onOpenReading={(id) => console.log('[Bio] open:', id)}
        onCreateReading={(p) =>
          console.log('[Bio] upload:', p.file.name, p.examTypeId, p.examDate)
        }
        onOpenAIChat={() => console.log('[Bio] open ai-chat: bioimpedance')}
        onUpdateReading={(p) => console.log('[Bio] update:', p.id)}
        onDeleteReading={(id) => console.log('[Bio] delete:', id)}
        onShareReading={(id) => console.log('[Bio] share:', id)}
        onOpenDevices={() => console.log('[Bio] open devices')}
      />
    </>
  )
}
