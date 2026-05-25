import data from '@/../product/sections/profissionais/data.json'
import type { ProfissionaisPageContent } from '@/../product/sections/profissionais/types'
import { ProfissionaisList as ProfissionaisListView } from './components/ProfissionaisList'

export default function ProfissionaisListPreview() {
  const props = data as unknown as ProfissionaisPageContent
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-profissionais],
        [data-nymos-profissionais] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-profissionais] .font-mono,
        [data-nymos-profissionais] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-profissionais>
        <ProfissionaisListView
          {...props}
          onSelectProfessional={(slug) => console.log('[Profissionais] → /profissionais/' + slug)}
          onInviteProfessional={() => console.log('[Profissionais] → /convidar-profissional')}
        />
      </div>
    </>
  )
}
