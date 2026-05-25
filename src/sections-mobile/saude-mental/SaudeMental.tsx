import data from '@/../product-mobile/sections/saude-mental/data.json'
import type {
  DiarioSubmission,
  SaudeMentalData,
} from '@/../product-mobile/sections/saude-mental/types'
import { SaudeMental as SaudeMentalComponent } from './components/SaudeMental'

export default function SaudeMentalPreview() {
  const sectionData = data as unknown as SaudeMentalData

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-mobile],
        [data-nymos-mobile] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-mobile] .font-mono,
        [data-nymos-mobile] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
        [data-nymos-mobile] .no-scrollbar::-webkit-scrollbar { display: none; }
        [data-nymos-mobile] .no-scrollbar { scrollbar-width: none; }
      `}</style>
      <div data-nymos-mobile="true" className="h-full">
        <SaudeMentalComponent
          data={sectionData}
          onChangeTab={(t) => console.log('[SaudeMental] tab:', t)}
          onSendMessage={(texto) => console.log('[SaudeMental] send:', texto)}
          onAttachFile={() => console.log('[SaudeMental] attach')}
          onOpenPsicologoDetail={(id) => console.log('[SaudeMental] open psicólogo:', id)}
          onInvitePsicologo={() => console.log('[SaudeMental] invite psicólogo')}
          onSubmitDiario={(payload: DiarioSubmission) =>
            console.log('[SaudeMental] submit diário:', payload)
          }
          onEditDiario={() => console.log('[SaudeMental] edit diário')}
          onOpenHistoricoItem={(id) => console.log('[SaudeMental] open histórico:', id)}
        />
      </div>
    </>
  )
}
