import { useState } from 'react'
import { Check, ArrowRight, Sparkles, Heart, Building2, User } from 'lucide-react'
import type { PricingContent, PricingPlan, PricingColumn } from '@/../product/sections/landing-page/types'

interface Props {
  content: PricingContent
  onSelectPlan?: (slug: string) => void
  onContactSales?: (plan?: string) => void
  onAcceptInvite?: () => void
}

function PlanCard({
  plan,
  popular,
  unavailable,
  onClick,
}: {
  plan: PricingPlan
  popular?: boolean
  unavailable?: boolean
  onClick?: () => void
}) {
  return (
    <div
      className={`relative rounded-2xl p-6 lg:p-7 transition-all duration-300 flex flex-col ${
        popular
          ? 'bg-gradient-to-br from-teal-500/12 via-emerald-500/6 to-transparent ring-2 ring-teal-400/40 shadow-xl shadow-teal-500/15'
          : unavailable
            ? 'bg-white/[0.02] ring-1 ring-white/[0.06]'
            : 'bg-white/[0.03] ring-1 ring-white/[0.08] hover:ring-white/15'
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-br from-teal-300 to-emerald-400 text-slate-950 text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-teal-500/30 whitespace-nowrap">
          Popular
        </div>
      )}

      {unavailable && (
        <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30">
          {plan.availability === 'coming_soon' ? 'Em breve' : 'Sob consulta'}
        </div>
      )}

      <div className="mb-5">
        <h4 className="text-base lg:text-lg font-bold text-slate-100 tracking-tight mb-1.5">{plan.name}</h4>
        <div className="flex items-baseline gap-1.5">
          <span className={`font-mono text-2xl lg:text-3xl font-bold ${unavailable ? 'text-slate-500' : 'text-slate-50'}`}>
            {plan.price}
          </span>
          {plan.period && <span className="text-xs text-slate-500">{plan.period}</span>}
        </div>
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className={`w-3.5 h-3.5 ${unavailable ? 'text-slate-600' : 'text-teal-400'} mt-0.5 shrink-0`} strokeWidth={2.5} />
            <span className="text-xs lg:text-[13px] text-slate-300 leading-snug">{f}</span>
          </li>
        ))}
      </ul>

      {plan.microcopy && (
        <p className="text-[10px] text-slate-500 mb-3 leading-snug">{plan.microcopy}</p>
      )}

      <button
        onClick={onClick}
        className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
          popular
            ? 'bg-gradient-to-br from-teal-300 to-emerald-400 text-slate-950 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-[1.02]'
            : unavailable
              ? 'bg-amber-400/10 text-amber-200 ring-1 ring-amber-400/30 hover:ring-amber-400/60 hover:bg-amber-400/15'
              : 'bg-white/[0.05] text-slate-200 ring-1 ring-white/10 hover:bg-white/[0.1]'
        }`}
      >
        {plan.cta.label}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function TabsHeader({
  columns,
  activeId,
  onChange,
}: {
  columns: PricingColumn[]
  activeId: string
  onChange: (id: string) => void
}) {
  const TAB_ICONS: Record<string, typeof User> = { autonomous: User, clinic: Building2 }

  return (
    <div className="flex justify-center mb-10 lg:mb-12">
      <div role="tablist" className="inline-flex items-center gap-1 p-1.5 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.08] backdrop-blur-sm">
        {columns.map((col) => {
          const Icon = TAB_ICONS[col.id] ?? User
          const isActive = col.id === activeId
          return (
            <button
              key={col.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(col.id)}
              className={`group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-br from-teal-300/20 to-emerald-400/10 text-teal-200 ring-1 ring-teal-400/30 shadow-sm shadow-teal-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.2} />
              <span>{col.label}</span>
              {col.badge && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  isActive
                    ? 'bg-teal-400/20 text-teal-200'
                    : col.id === 'clinic'
                      ? 'bg-amber-400/15 text-amber-300'
                      : 'bg-teal-400/15 text-teal-300'
                }`}>
                  {col.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function LandingPricing({ content, onSelectPlan, onContactSales, onAcceptInvite }: Props) {
  const [activeTab, setActiveTab] = useState<string>(content.columns[0]?.id ?? 'autonomous')
  const activeColumn = content.columns.find((c) => c.id === activeTab) ?? content.columns[0]
  const isClinic = activeColumn?.id === 'clinic'

  return (
    <section id="pricing" className="relative py-24 lg:py-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 30% 50%, rgba(20,184,166,0.10) 0px, transparent 50%),' +
            'radial-gradient(at 70% 50%, rgba(16,185,129,0.08) 0px, transparent 50%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/30 mb-6">
            {content.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-slate-50">
            {content.titleLine1}{' '}
            <span className="bg-gradient-to-br from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              {content.titleLine2Gradient}
            </span>
          </h2>
          <p className="mt-6 text-base lg:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Tabs */}
        <TabsHeader
          columns={content.columns}
          activeId={activeTab}
          onChange={setActiveTab}
        />

        {/* Active tab content */}
        {activeColumn && (
          <div className="relative">
            <div
              role="tabpanel"
              aria-labelledby={`tab-${activeColumn.id}`}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 animate-in fade-in duration-300"
              key={activeColumn.id}
            >
              {activeColumn.plans.map((plan) => (
                <PlanCard
                  key={plan.slug}
                  plan={plan}
                  popular={plan.popular}
                  unavailable={plan.availability !== 'available'}
                  onClick={() => {
                    if (isClinic) {
                      onContactSales?.(plan.slug)
                    } else {
                      onSelectPlan?.(plan.slug)
                    }
                  }}
                />
              ))}
            </div>

            {/* Column-level CTA (clinic gets a sales link) */}
            {activeColumn.columnCta && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => onContactSales?.()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-amber-200 bg-amber-400/10 ring-1 ring-amber-400/30 hover:ring-amber-400/60 transition-all"
                >
                  {activeColumn.columnCta.label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Patient note — destacado */}
        <div className="relative rounded-3xl bg-gradient-to-br from-teal-500/15 via-emerald-500/10 to-cyan-500/5 ring-1 ring-teal-400/30 p-7 lg:p-8 mt-14 lg:mt-16 shadow-xl shadow-teal-500/10">
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-teal-400/20 via-transparent to-emerald-400/20 -z-10 blur-xl" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-br from-teal-300 to-emerald-400 text-slate-950 mb-4">
                <Heart className="w-3 h-3" strokeWidth={2.5} />
                {content.patientNote.badge}
              </div>
              <h4 className="text-xl lg:text-2xl font-bold text-slate-50 tracking-tight mb-2">
                {content.patientNote.title}
              </h4>
              <div className="font-mono text-3xl lg:text-4xl font-bold bg-gradient-to-br from-teal-300 to-emerald-300 bg-clip-text text-transparent mb-4">
                {content.patientNote.price}
              </div>
              <ul className="space-y-1.5">
                {content.patientNote.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-teal-300 mt-0.5 shrink-0" strokeWidth={2.4} />
                    <span className="text-xs lg:text-sm text-slate-300">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-5">
              <button
                onClick={onAcceptInvite}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-br from-teal-300 to-emerald-400 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/50 hover:scale-[1.02] transition-all"
              >
                {content.patientNote.cta.label}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-10">{content.footnote}</p>
      </div>
    </section>
  )
}
