import { Salad, Dumbbell, Brain, Stethoscope, MapPin, Video, Home, User, Sparkles, Building2 } from 'lucide-react'
import type { ProfessionalCard as ProfessionalCardType, ProfessionalVertical } from '@/../product/sections/profissionais/types'

const VERTICAL_META: Record<ProfessionalVertical, {
  icon: typeof Salad
  label: string
  bg: string
  ring: string
  text: string
  chip: string
}> = {
  nutrition: {
    icon: Salad, label: 'Nutricionista',
    bg: 'from-green-400/15 to-emerald-500/5',
    ring: 'ring-green-400/30', text: 'text-green-300',
    chip: 'bg-green-400/12 text-green-300 ring-green-400/30',
  },
  personal: {
    icon: Dumbbell, label: 'Personal',
    bg: 'from-orange-400/15 to-amber-500/5',
    ring: 'ring-orange-400/30', text: 'text-orange-300',
    chip: 'bg-orange-400/12 text-orange-300 ring-orange-400/30',
  },
  psychology: {
    icon: Brain, label: 'Psicólogo',
    bg: 'from-violet-400/15 to-purple-500/5',
    ring: 'ring-violet-400/30', text: 'text-violet-300',
    chip: 'bg-violet-400/12 text-violet-300 ring-violet-400/30',
  },
  clinical: {
    icon: Stethoscope, label: 'Médico',
    bg: 'from-rose-400/15 to-pink-500/5',
    ring: 'ring-rose-400/30', text: 'text-rose-300',
    chip: 'bg-rose-400/12 text-rose-300 ring-rose-400/30',
  },
}

const MODE_META = {
  in_person: { label: 'Presencial', icon: User },
  teleconsult: { label: 'Teleconsulta', icon: Video },
  home_visit: { label: 'Domicílio', icon: Home },
} as const

const TIER_META = {
  pro: { label: 'Pro', icon: Sparkles, bg: 'bg-gradient-to-br from-teal-300 to-emerald-400 text-slate-950' },
  clinic: { label: 'Clínica', icon: Building2, bg: 'bg-gradient-to-br from-amber-300 to-orange-400 text-slate-950' },
} as const

interface Props {
  pro: ProfessionalCardType
  onClick?: () => void
}

export function ProfessionalCard({ pro, onClick }: Props) {
  const v = VERTICAL_META[pro.vertical]
  const Icon = v.icon
  const tier = pro.tierBadge && pro.tierBadge !== 'plus' ? TIER_META[pro.tierBadge] : null
  const initials = pro.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

  return (
    <button
      onClick={onClick}
      className={`group relative text-left rounded-2xl bg-white/[0.03] backdrop-blur-sm ring-1 ring-white/[0.08] p-5 lg:p-6 hover:bg-white/[0.05] ${v.ring.replace('ring-', 'hover:ring-')} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20`}
    >
      {/* Tier badge */}
      {tier && (
        <div className={`absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tier.bg} shadow-lg shadow-black/20`}>
          <tier.icon className="w-2.5 h-2.5" strokeWidth={2.5} />
          {tier.label}
        </div>
      )}

      {/* Header: avatar + name */}
      <div className="flex items-start gap-3.5 mb-3">
        <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${v.bg} ring-1 ${v.ring} grid place-items-center text-base font-bold ${v.text}`}>
          {pro.avatarUrl ? (
            <img src={pro.avatarUrl} alt={pro.name} className="w-full h-full rounded-2xl object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="min-w-0 flex-1 pr-12">
          <h3 className="text-base lg:text-[15px] font-bold text-slate-100 tracking-tight leading-snug">
            {pro.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Icon className={`w-3 h-3 ${v.text}`} strokeWidth={2.4} />
            <span className={`text-[10px] font-mono uppercase tracking-widest ${v.text}`}>{v.label}</span>
            <span className="text-slate-700 text-[10px]">·</span>
            <span className="text-[10px] font-mono text-slate-500">{pro.registry} {pro.registryNumber}</span>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
        <MapPin className="w-3 h-3 text-slate-500" strokeWidth={2.2} />
        <span>{pro.city}, {pro.state}</span>
      </div>

      {/* Bio */}
      <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
        {pro.shortBio}
      </p>

      {/* Modes + acceptance */}
      <div className="flex items-center flex-wrap gap-1.5 pt-4 border-t border-white/[0.05]">
        {pro.modes.map((mode) => {
          const m = MODE_META[mode]
          const MIcon = m.icon
          return (
            <div key={mode} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-300 bg-white/[0.04] ring-1 ring-white/[0.08]">
              <MIcon className="w-2.5 h-2.5" strokeWidth={2.4} />
              {m.label}
            </div>
          )
        })}
        <div className="grow" />
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ${
          pro.acceptance === 'accepting'
            ? 'bg-emerald-400/12 text-emerald-300 ring-emerald-400/30'
            : 'bg-amber-400/12 text-amber-300 ring-amber-400/30'
        }`}>
          <span className={`w-1 h-1 rounded-full ${pro.acceptance === 'accepting' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          {pro.acceptance === 'accepting' ? 'Aceita pacientes' : 'Lista de espera'}
        </div>
      </div>
    </button>
  )
}
