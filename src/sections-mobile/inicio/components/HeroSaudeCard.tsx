import { Heart, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { HeroSaudePreview } from '@/../product-mobile/sections/inicio/types'

interface HeroSaudeCardProps {
  hero: HeroSaudePreview
  onClick?: () => void
}

const STATUS_DOT: Record<HeroSaudePreview['microStatus'][number]['status'], string> = {
  otimo: 'bg-emerald-400',
  bom: 'bg-teal-400',
  atencao: 'bg-amber-400',
  risco: 'bg-rose-400',
  sem_dados: 'bg-slate-600',
}

function statusFromScore(score: number): { text: string; bg: string; label: string } {
  if (score >= 85) return { text: 'text-emerald-300', bg: 'bg-emerald-500/15', label: 'Ótimo' }
  if (score >= 70) return { text: 'text-teal-300', bg: 'bg-teal-500/15', label: 'Bom' }
  if (score >= 50) return { text: 'text-amber-300', bg: 'bg-amber-500/15', label: 'Atenção' }
  return { text: 'text-rose-300', bg: 'bg-rose-500/15', label: 'Risco' }
}

function formatRelativeDate(iso: string): string {
  const target = new Date(iso)
  const now = new Date()
  const days = Math.floor((now.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 7) return `há ${days}d`
  if (days < 30) return `há ${Math.floor(days / 7)}sem`
  return `há ${Math.floor(days / 30)} mês`
}

export function HeroSaudeCard({ hero, onClick }: HeroSaudeCardProps) {
  const visual = statusFromScore(hero.scoreAtual)
  const TendIcon =
    hero.tendencia === 'melhorando' ? TrendingUp : hero.tendencia === 'piorando' ? TrendingDown : Minus
  const tendCls =
    hero.tendencia === 'melhorando'
      ? 'text-emerald-300'
      : hero.tendencia === 'piorando'
        ? 'text-rose-300'
        : 'text-slate-400'

  return (
    <button
      onClick={onClick}
      className="mx-4 mt-3 mb-2 w-[calc(100%-32px)] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-500/10 border border-slate-800 hover:border-teal-500/40 px-4 py-3.5 text-left transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${visual.bg} flex items-center justify-center ${visual.text} shrink-0 relative`}>
          <Heart size={20} strokeWidth={2.4} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
              Minha Saúde
            </span>
            {hero.ultimaAnaliseEm && (
              <span className="text-slate-600 text-[10px] font-mono tabular-nums">
                · {formatRelativeDate(hero.ultimaAnaliseEm)}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className={`text-[26px] font-bold font-mono tabular-nums leading-none ${visual.text}`}>
              {hero.scoreAtual}
            </span>
            <span className={`text-[11px] font-semibold ${visual.text}`}>{visual.label}</span>
            <span className={`flex items-center gap-0.5 ${tendCls} text-[10.5px] font-semibold ml-auto`}>
              <TendIcon size={11} strokeWidth={2.6} />
              {hero.tendencia === 'melhorando'
                ? 'Melhorando'
                : hero.tendencia === 'piorando'
                  ? 'Piorando'
                  : 'Estável'}
            </span>
          </div>
        </div>

        <ChevronRight size={15} className="text-slate-500 shrink-0" />
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        {hero.microStatus.map((m) => (
          <span
            key={m.label}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10.5px] text-slate-300"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[m.status]}`} />
            {m.label}
          </span>
        ))}
      </div>
    </button>
  )
}
