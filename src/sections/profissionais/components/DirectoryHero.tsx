import { Search, MapPin, X } from 'lucide-react'
import type {
  HeroContent, DirectoryFilters, DirectoryStats,
  ProfessionalVertical, ConsultMode,
} from '@/../product/sections/profissionais/types'

interface Props {
  content: HeroContent
  stats: DirectoryStats
  filters: DirectoryFilters
  cities: string[]
  onFiltersChange: (filters: DirectoryFilters) => void
}

export function DirectoryHero({ content, stats, filters, cities, onFiltersChange }: Props) {
  const setVertical = (v: ProfessionalVertical | 'all') =>
    onFiltersChange({ ...filters, vertical: v })
  const setMode = (m: ConsultMode | 'all') =>
    onFiltersChange({ ...filters, mode: m })
  const setQuery = (q: string) =>
    onFiltersChange({ ...filters, query: q })
  const setCity = (c: string | null) =>
    onFiltersChange({ ...filters, city: c })

  return (
    <section className="relative pt-28 pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
      {/* Mesh background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 20% 30%, rgba(20,184,166,0.15) 0px, transparent 50%),' +
            'radial-gradient(at 80% 0%, rgba(16,185,129,0.10) 0px, transparent 50%)',
        }}
      />
      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(148,163,184,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/30 mb-5">
            {content.eyebrow}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-slate-50">
            {content.titleLine1}{' '}
            <span className="bg-gradient-to-br from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              {content.titleLine2Gradient}
            </span>
          </h1>
          <p className="mt-5 text-base lg:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" strokeWidth={2.2} />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={content.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] backdrop-blur-sm ring-1 ring-white/[0.08] focus:ring-teal-400/40 focus:outline-none text-sm text-slate-100 placeholder:text-slate-500 transition-all"
          />
        </div>

        {/* City selector */}
        <div className="flex justify-center mb-6">
          <div className="relative inline-flex items-center gap-2 max-w-xs w-full">
            <MapPin className="absolute left-3 w-3.5 h-3.5 text-slate-500" strokeWidth={2.2} />
            <select
              value={filters.city ?? ''}
              onChange={(e) => setCity(e.target.value || null)}
              className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] focus:ring-teal-400/40 focus:outline-none text-xs text-slate-200 appearance-none cursor-pointer transition-all"
            >
              <option value="" className="bg-slate-900">{content.cityPlaceholder}</option>
              {cities.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c}
                </option>
              ))}
            </select>
            {filters.city && (
              <button
                type="button"
                onClick={() => setCity(null)}
                className="absolute right-2.5 p-0.5 rounded-full text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-colors"
                aria-label="Limpar cidade"
              >
                <X className="w-3 h-3" strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>

        {/* Vertical chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          {content.verticalOptions.map((opt) => {
            const isActive = filters.vertical === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setVertical(opt.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-teal-300/20 to-emerald-400/10 text-teal-200 ring-1 ring-teal-400/40 shadow-sm shadow-teal-500/10'
                    : 'bg-white/[0.03] text-slate-400 ring-1 ring-white/[0.08] hover:text-slate-200 hover:ring-white/15'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* Mode chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-8">
          {content.modeOptions.map((opt) => {
            const isActive = filters.mode === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setMode(opt.id)}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/40'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* Stats */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            <span className="font-mono font-bold text-slate-300">{stats.totalProfessionals.toLocaleString('pt-BR')}</span>{' '}
            profissionais parceiros
            <span className="text-teal-400/40 mx-2">·</span>
            <span className="font-mono font-bold text-slate-300">{stats.totalCities}</span> cidades
            <span className="text-teal-400/40 mx-2">·</span>
            <span className="font-mono font-bold text-slate-300">{stats.totalSpecialties}</span> especialidades
          </p>
        </div>
      </div>
    </section>
  )
}
