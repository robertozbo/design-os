import { useEffect, useState } from 'react'
import { Menu, X, Globe, Sun } from 'lucide-react'
import type { HeaderContent } from '@/../product/sections/landing-page/types'

interface LandingHeaderProps {
  content: HeaderContent
  onSignup?: () => void
  onLogin?: () => void
  onNavClick?: (href: string) => void
  onToggleTheme?: () => void
  onChangeLanguage?: () => void
}

export function LandingHeader({
  content,
  onSignup,
  onLogin,
  onNavClick,
  onToggleTheme,
  onChangeLanguage,
}: LandingHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <button
            onClick={() => onNavClick?.('#hero')}
            className="flex items-center gap-2.5 group"
            aria-label="Início"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 grid place-items-center shadow-lg shadow-teal-500/30 group-hover:shadow-teal-500/50 transition-shadow">
              <span className="font-bold text-slate-950 text-base">N</span>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-teal-400/40 to-emerald-500/40 blur-md -z-10" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="font-bold text-slate-50 text-sm tracking-tight">{content.brand.name}</span>
              <span className="text-[10px] text-teal-300/80 tracking-wider uppercase">{content.brand.tagline}</span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {content.nav.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick?.(item.href)}
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-teal-300 transition-colors rounded-md hover:bg-white/5"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={onChangeLanguage}
              className="p-2 text-slate-400 hover:text-teal-300 hover:bg-white/5 rounded-md transition-colors"
              aria-label="Idioma"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-400 hover:text-teal-300 hover:bg-white/5 rounded-md transition-colors"
              aria-label="Tema"
            >
              <Sun className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-white/10 mx-2" />
            <button
              onClick={onLogin}
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-slate-50 transition-colors"
            >
              {content.ctaLogin.label}
            </button>
            <button
              onClick={onSignup}
              className="ml-1 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-950 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {content.ctaSignup.label}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <button
            className="lg:hidden p-2 text-slate-300 hover:text-teal-300"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-white/5 py-4 space-y-1">
            {content.nav.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavClick?.(item.href)
                  setOpen(false)
                }}
                className="block w-full text-left px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-teal-300 hover:bg-white/5 rounded-md"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 mt-3 border-t border-white/5 flex flex-col gap-2">
              <button
                onClick={onLogin}
                className="w-full px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-slate-50 text-left"
              >
                {content.ctaLogin.label}
              </button>
              <button
                onClick={onSignup}
                className="w-full px-4 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-950"
              >
                {content.ctaSignup.label}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
