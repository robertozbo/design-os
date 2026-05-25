import data from '@/../product/sections/fotos-corporais-paciente/data.json'
import type {
  ComparisonInfo,
  LgpdBanner,
  PhotoPeriod,
  PhotoPeriodOption,
  PhotoSession,
  PhotoStats,
} from '@/../product/sections/fotos-corporais-paciente/types'
import { FotosCorporaisPaciente as FotosCorporaisPacienteView } from './components/FotosCorporaisPaciente'

export default function FotosCorporaisPacientePreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-fotos-corporais-paciente],
        [data-nymos-fotos-corporais-paciente] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-fotos-corporais-paciente] .font-mono,
        [data-nymos-fotos-corporais-paciente] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <FotosCorporaisPacienteView
        stats={data.stats as PhotoStats}
        lgpdBanner={data.lgpdBanner as LgpdBanner}
        lgpdConsentItems={data.lgpdConsentItems}
        latestSession={data.latestSession as PhotoSession}
        comparison={data.comparison as ComparisonInfo}
        sessions={data.sessions as PhotoSession[]}
        periodOptions={data.periodOptions as PhotoPeriodOption[]}
        activePeriod={data.activePeriod as PhotoPeriod}
        processingIds={data.processingIds as string[]}
        onPeriodChange={(p) => console.log('[Fotos] period:', p)}
        onDismissLgpdBanner={() => console.log('[Fotos] dismiss banner')}
        onOpenAIChat={() => console.log('[Fotos] open ai-chat: body_photo')}
        onCreatePhoto={(p) =>
          console.log(
            '[Fotos] direct upload:',
            p.examTypeId,
            p.file.name,
            p.angle,
          )
        }
        onOpenSession={(id) => console.log('[Fotos] open:', id)}
        onChangeComparison={(p) =>
          console.log(
            '[Fotos] compare:',
            p.baselineSessionId,
            '→',
            p.currentSessionId,
          )
        }
        onDeleteSession={(id) => console.log('[Fotos] delete:', id)}
        onShareSession={(id) => console.log('[Fotos] share:', id)}
      />
    </>
  )
}
