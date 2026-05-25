import { Salad, Dumbbell, Brain, Stethoscope, MapPin, Video, Home, User, GraduationCap, Languages, Globe2, Sparkles, Building2, ArrowLeft } from 'lucide-react'
import type { ProfessionalDetailPageContent, ProfessionalVertical, LanguageCode } from '@/../product/sections/profissionais/types'
import { DetailActionCard } from './DetailActionCard'

const VERTICAL_META: Record<ProfessionalVertical, {
  icon: typeof Salad
  label: string
  bg: string
  ring: string
  text: string
}> = {
  nutrition: { icon: Salad, label: 'Nutricionista', bg: 'from-green-400/20 to-emerald-500/10', ring: 'ring-green-400/30', text: 'text-green-300' },
  personal: { icon: Dumbbell, label: 'Personal Trainer', bg: 'from-orange-400/20 to-amber-500/10', ring: 'ring-orange-400/30', text: 'text-orange-300' },
  psychology: { icon: Brain, label: 'Psicólogo', bg: 'from-violet-400/20 to-purple-500/10', ring: 'ring-violet-400/30', text: 'text-violet-300' },
  clinical: { icon: Stethoscope, label: 'Médico', bg: 'from-rose-400/20 to-pink-500/10', ring: 'ring-rose-400/30', text: 'text-rose-300' },
}

const MODE_LABELS = {
  in_person: { label: 'Presencial', icon: User },
  teleconsult: { label: 'Teleconsulta', icon: Video },
  home_visit: { label: 'Visita domiciliar', icon: Home },
} as const

const LANG_LABELS: Record<LanguageCode, string> = {
  'pt-BR': 'Português',
  'en-US': 'Inglês',
  'es-PY': 'Espanhol',
  'fr-FR': 'Francês',
  'de-DE': 'Alemão',
}

const TIER_META = {
  pro: { label: 'Pro', icon: Sparkles, bg: 'bg-gradient-to-br from-teal-300 to-emerald-400 text-slate-950' },
  clinic: { label: 'Clínica', icon: Building2, bg: 'bg-gradient-to-br from-amber-300 to-orange-400 text-slate-950' },
} as const

export interface ProfessionalDetailProps extends ProfessionalDetailPageContent {
  onBack?: () => void
  onRequestLink?: () => void
  onValidateCode?: (code: string) => void
}

export function ProfessionalDetail({
  professional: p,
  actionCard,
  onBack,
  onRequestLink,
  onValidateCode,
}: ProfessionalDetailProps) {
  const v = VERTICAL_META[p.vertical]
  const Icon = v.icon
  const tier = p.tierBadge && p.tierBadge !== 'plus' ? TIER_META[p.tierBadge] : null
  const initials = p.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden">
      {/* Ambient noise */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Hero */}
      <section className="relative pt-28 pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              `radial-gradient(at 20% 30%, ${
                p.vertical === 'nutrition' ? 'rgba(34,197,94,0.12)' :
                p.vertical === 'personal' ? 'rgba(251,146,60,0.12)' :
                p.vertical === 'psychology' ? 'rgba(167,139,250,0.12)' :
                'rgba(251,113,133,0.12)'
              } 0px, transparent 50%),` +
              'radial-gradient(at 80% 0%, rgba(20,184,166,0.08) 0px, transparent 50%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.4} />
            Voltar pro diretório
          </button>

          <div className="flex flex-col sm:flex-row items-start gap-6 lg:gap-8">
            {/* Avatar */}
            <div className={`shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br ${v.bg} ring-2 ${v.ring} grid place-items-center text-2xl font-bold ${v.text} shadow-2xl shadow-black/30`}>
              {p.avatarUrl ? (
                <img src={p.avatarUrl} alt={p.name} className="w-full h-full rounded-3xl object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              {tier && (
                <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tier.bg} mb-3 shadow-lg shadow-black/20`}>
                  <tier.icon className="w-2.5 h-2.5" strokeWidth={2.5} />
                  {tier.label}
                </div>
              )}
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-slate-50 mb-3">
                {p.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${v.text}`} strokeWidth={2.2} />
                  <span className={`font-semibold ${v.text}`}>{v.label}</span>
                </div>
                <div className="text-slate-700">·</div>
                <div className="font-mono text-xs text-slate-500">{p.registry} {p.registryNumber}</div>
                <div className="text-slate-700">·</div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" strokeWidth={2.2} />
                  <span>{p.city}, {p.state}</span>
                </div>
              </div>

              {/* Mode chips */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {p.modes.map((mode) => {
                  const m = MODE_LABELS[mode]
                  const MIcon = m.icon
                  return (
                    <div key={mode} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-200 bg-white/[0.04] ring-1 ring-white/[0.08]">
                      <MIcon className="w-3 h-3" strokeWidth={2.4} />
                      {m.label}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Main column */}
            <div className="lg:col-span-8 space-y-8">
              {/* About */}
              <section>
                <h2 className="text-xl font-bold text-slate-100 tracking-tight mb-3">Sobre</h2>
                <p className="text-base text-slate-300 leading-relaxed whitespace-pre-line">
                  {p.fullBio}
                </p>
              </section>

              {/* Specializations */}
              {p.specializations.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-100 tracking-tight mb-3">Especializações</h2>
                  <div className="flex flex-wrap gap-2">
                    {p.specializations.map((s) => (
                      <span key={s} className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-br ${v.bg} ring-1 ${v.ring} ${v.text}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {p.education.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-100 tracking-tight mb-4">Formação</h2>
                  <div className="space-y-3">
                    {p.education.map((edu, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.08]">
                        <div className="shrink-0 w-9 h-9 rounded-lg bg-teal-400/10 ring-1 ring-teal-400/30 grid place-items-center">
                          <GraduationCap className="w-4 h-4 text-teal-300" strokeWidth={2.2} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-100">{edu.course}</p>
                          <p className="text-xs text-slate-400">{edu.institution}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                            <span>{edu.level}</span>
                            <span className="text-slate-700">·</span>
                            <span>{edu.year}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {p.languages.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-100 tracking-tight mb-3">Idiomas</h2>
                  <div className="flex flex-wrap gap-2">
                    {p.languages.map((lang) => (
                      <span key={lang} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-white/[0.04] ring-1 ring-white/[0.08]">
                        <Languages className="w-3 h-3" strokeWidth={2.4} />
                        {LANG_LABELS[lang]}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Where serves */}
              <section>
                <h2 className="text-xl font-bold text-slate-100 tracking-tight mb-3">Modalidades e regiões</h2>
                <div className="rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.08] p-5 space-y-3">
                  {p.servesOnline && (
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Globe2 className="w-4 h-4 text-teal-300 shrink-0" strokeWidth={2.2} />
                      <span>Atende <strong className="text-slate-100">online</strong> no Brasil inteiro via teleconsulta</span>
                    </div>
                  )}
                  {p.servesCities.length > 0 && (
                    <div className="flex items-start gap-2 text-sm text-slate-300">
                      <MapPin className="w-4 h-4 text-teal-300 mt-0.5 shrink-0" strokeWidth={2.2} />
                      <span>Presencial em: <strong className="text-slate-100">{p.servesCities.join(', ')}</strong></span>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <DetailActionCard
                  content={actionCard}
                  acceptance={p.acceptance}
                  professionalName={p.name}
                  onRequestLink={onRequestLink}
                  onValidateCode={onValidateCode}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
