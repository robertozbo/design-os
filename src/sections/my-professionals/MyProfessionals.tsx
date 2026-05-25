import data from '@/../product/sections/my-professionals/data.json'
import type { MyProfessionalsProps } from '@/../product/sections/my-professionals/types'
import { MyProfessionals as MyProfessionalsView } from './components/MyProfessionals'

export default function MyProfessionalsPreview() {
  const props = data as unknown as MyProfessionalsProps
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-my-professionals],
        [data-nymos-my-professionals] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-my-professionals] .font-mono,
        [data-nymos-my-professionals] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-my-professionals>
        <MyProfessionalsView
          stats={props.stats}
          pendingInvites={props.pendingInvites}
          types={props.types}
          professionals={props.professionals}
          pagination={props.pagination}
          dataCategories={props.dataCategories}
          recommendedByType={props.recommendedByType}
          onOpenLink={() => console.log('[MyProfessionals] open link modal')}
          onSubmitLink={(payload) =>
            console.log('[MyProfessionals] submit link:', payload)
          }
          onAcceptInvite={(payload) =>
            console.log('[MyProfessionals] accept invite:', payload)
          }
          onDismissInvite={(id) => console.log('[MyProfessionals] dismiss invite:', id)}
          onTypeChange={(k) => console.log('[MyProfessionals] type:', k)}
          onSearchChange={(q) => console.log('[MyProfessionals] search:', q)}
          onViewChange={(v) => console.log('[MyProfessionals] view:', v)}
          onSelectProfessional={(id) =>
            console.log('[MyProfessionals] select:', id)
          }
          onUpdateSharedCategories={(payload) =>
            console.log('[MyProfessionals] update categories:', payload)
          }
          onSetPrimary={(id) => console.log('[MyProfessionals] set primary:', id)}
          onUnlinkProfessional={(id) =>
            console.log('[MyProfessionals] unlink:', id)
          }
          onPageChange={(p) => console.log('[MyProfessionals] page:', p)}
        />
      </div>
    </>
  )
}
