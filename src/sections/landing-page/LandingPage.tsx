import data from '@/../product/sections/landing-page/data.json'
import type { LandingPageContent } from '@/../product/sections/landing-page/types'
import { LandingPage as LandingPageView } from './components/LandingPage'

export default function LandingPagePreview() {
  const props = data as unknown as LandingPageContent
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-landing],
        [data-nymos-landing] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-landing] .font-mono,
        [data-nymos-landing] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-landing>
        <LandingPageView
          {...props}
          onSignupPatient={() => console.log('[Landing] → /signup?type=patient')}
          onSignupProfessional={() => console.log('[Landing] → /registre-professional')}
          onLogin={() => console.log('[Landing] → /auth/login')}
          onAcceptInvite={() => console.log('[Landing] → /auth/accept-invite')}
          onContactSales={(plan) => console.log('[Landing] contact sales:', plan)}
          onNavigate={(anchor) => console.log('[Landing] navigate to:', anchor)}
          onSelectPlan={(slug) => console.log('[Landing] select plan:', slug)}
          onToggleTheme={() => console.log('[Landing] toggle theme')}
          onChangeLanguage={() => console.log('[Landing] change language')}
        />
      </div>
    </>
  )
}
