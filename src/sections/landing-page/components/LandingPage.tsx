import type { LandingPageContent } from '@/../product/sections/landing-page/types'
import { LandingHeader } from './LandingHeader'
import { LandingHero } from './LandingHero'
import { LandingProblem } from './LandingProblem'
import { LandingLoop } from './LandingLoop'
import { LandingVerticais } from './LandingVerticais'
import { LandingPatient } from './LandingPatient'
import { LandingProfessional } from './LandingProfessional'
import { LandingAIDiagnostic } from './LandingAIDiagnostic'
import { LandingTrust } from './LandingTrust'
import { LandingPricing } from './LandingPricing'
import { LandingTestimonials } from './LandingTestimonials'
import { LandingFAQ } from './LandingFAQ'
import { LandingFinalCTA } from './LandingFinalCTA'
import { LandingFooter } from './LandingFooter'

export interface LandingPageProps extends LandingPageContent {
  onSignupPatient?: () => void
  onSignupProfessional?: () => void
  onLogin?: () => void
  onAcceptInvite?: () => void
  onContactSales?: (plan?: string) => void
  onNavigate?: (anchor: string) => void
  onSelectPlan?: (slug: string) => void
  onToggleTheme?: () => void
  onChangeLanguage?: () => void
}

export function LandingPage({
  header,
  hero,
  problem,
  loop,
  verticais,
  patient,
  professional,
  aiDiagnostic,
  trust,
  pricing,
  testimonials,
  faq,
  finalCta,
  footer,
  onSignupPatient,
  onSignupProfessional,
  onLogin,
  onAcceptInvite,
  onContactSales,
  onNavigate,
  onSelectPlan,
  onToggleTheme,
  onChangeLanguage,
}: LandingPageProps) {
  const handleAnchorClick = (href: string) => {
    if (href.startsWith('#')) {
      const id = href.slice(1)
      const el = typeof document !== 'undefined' ? document.getElementById(id) : null
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      onNavigate?.(href)
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden">
      {/* Ambient texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <LandingHeader
        content={header}
        onSignup={onSignupPatient}
        onLogin={onLogin}
        onNavClick={handleAnchorClick}
        onToggleTheme={onToggleTheme}
        onChangeLanguage={onChangeLanguage}
      />

      <main>
        {/* Hero + Problem share mesh */}
        <div className="relative">
          <LandingHero
            content={hero}
            onPrimary={onSignupPatient}
            onSecondary={onSignupProfessional}
            onAnchorClick={handleAnchorClick}
          />
          <LandingProblem content={problem} />
        </div>

        {/* Loop + Verticais — alt mesh */}
        <div className="relative">
          <LandingLoop content={loop} />
          <LandingVerticais content={verticais} />
        </div>

        {/* Audience splits */}
        <LandingPatient content={patient} onCta={onSignupPatient} />
        <LandingProfessional content={professional} onCta={onSignupProfessional} />

        {/* AI as standalone showcase */}
        <LandingAIDiagnostic
          content={aiDiagnostic}
          onCtaClick={() => handleAnchorClick(aiDiagnostic.cta.href)}
        />

        {/* Trust + Pricing */}
        <LandingTrust content={trust} />
        <LandingPricing
          content={pricing}
          onSelectPlan={onSelectPlan}
          onContactSales={onContactSales}
          onAcceptInvite={onAcceptInvite}
        />

        {/* Social proof + FAQ */}
        <LandingTestimonials content={testimonials} />
        <LandingFAQ content={faq} />

        {/* Closing */}
        <LandingFinalCTA
          content={finalCta}
          onPatient={onSignupPatient}
          onProfessional={onSignupProfessional}
        />
      </main>

      <LandingFooter content={footer} onNavClick={handleAnchorClick} />
    </div>
  )
}
