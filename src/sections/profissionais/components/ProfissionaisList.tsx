import { useState, useMemo } from 'react'
import type { ProfissionaisPageContent, DirectoryFilters } from '@/../product/sections/profissionais/types'
import { DirectoryHero } from './DirectoryHero'
import { ProfessionalCard } from './ProfessionalCard'
import { EmptyState } from './EmptyState'
import { InviteBanner } from './InviteBanner'

const INITIAL_FILTERS: DirectoryFilters = {
  query: '',
  vertical: 'all',
  mode: 'all',
  city: null,
}

export interface ProfissionaisListProps extends ProfissionaisPageContent {
  onSelectProfessional?: (slug: string) => void
  onInviteProfessional?: () => void
}

export function ProfissionaisList({
  hero,
  stats,
  professionals,
  emptyState,
  inviteBanner,
  onSelectProfessional,
  onInviteProfessional,
}: ProfissionaisListProps) {
  const [filters, setFilters] = useState<DirectoryFilters>(INITIAL_FILTERS)

  // Derive unique cities from professionals (sorted)
  const cities = useMemo(
    () =>
      Array.from(new Set(professionals.map((p) => `${p.city}, ${p.state}`))).sort((a, b) =>
        a.localeCompare(b, 'pt-BR')
      ),
    [professionals]
  )

  // Apply filters
  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    return professionals.filter((p) => {
      if (filters.vertical !== 'all' && p.vertical !== filters.vertical) return false
      if (filters.mode !== 'all' && !p.modes.includes(filters.mode)) return false
      if (filters.city && `${p.city}, ${p.state}` !== filters.city) return false
      if (q) {
        const haystack = `${p.name} ${p.city} ${p.state} ${p.shortBio}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [professionals, filters])

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

      <DirectoryHero
        content={hero}
        stats={stats}
        filters={filters}
        cities={cities}
        onFiltersChange={setFilters}
      />

      {/* Grid */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(at 50% 100%, rgba(16,185,129,0.06) 0px, transparent 50%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Result count */}
          {filtered.length > 0 && (
            <p className="text-center text-xs font-mono uppercase tracking-widest text-slate-500 mb-8">
              {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {filtered.length === 0 ? (
              <EmptyState
                content={emptyState}
                onReset={() => setFilters(INITIAL_FILTERS)}
              />
            ) : (
              filtered.map((pro) => (
                <ProfessionalCard
                  key={pro.slug}
                  pro={pro}
                  onClick={() => onSelectProfessional?.(pro.slug)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <InviteBanner content={inviteBanner} onClick={onInviteProfessional} />
    </div>
  )
}
