import type { Avaliacao } from '@/../product/sections/avalia-es-de-risco/types'
import { Building2, Layers, Calendar, Globe, Accessibility, ChevronRight } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { InstrumentBadge } from './InstrumentBadge'
import { CoverageBar } from './CoverageBar'

interface AvaliacaoCardProps {
  avaliacao: Avaliacao
  revealIndex?: number
  onAbrir?: () => void
}

const IDIOMA_LABEL: Record<string, string> = { pt: 'PT', en: 'EN', es: 'ES' }

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })

function formatDate(iso: string | null) {
  if (!iso) return '—'
  // Anchor at noon UTC so toLocaleDateString never shifts the day across timezones.
  return DATE_FORMATTER.format(new Date(iso + 'T12:00:00'))
}

export function AvaliacaoCard({ avaliacao, revealIndex = 0, onAbrir }: AvaliacaoCardProps) {
  const showCoverage = avaliacao.status !== 'rascunho'
  const showWindow = avaliacao.janelaInicio && avaliacao.janelaFim

  const deadlineUrgent = avaliacao.diasRestantes !== null && avaliacao.diasRestantes <= 2 && avaliacao.status === 'em_aplicacao'

  return (
    <button
      type="button"
      onClick={onAbrir}
      style={{ animationDelay: `${50 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        group relative w-full text-left
        rounded-2xl
        bg-white/95 dark:bg-slate-900/70
        border border-slate-200/80 dark:border-slate-800
        hover:border-teal-300 dark:hover:border-teal-700
        hover:shadow-[0_4px_20px_-8px_rgba(15,118,110,0.25)]
        dark:hover:shadow-[0_4px_20px_-8px_rgba(20,184,166,0.35)]
        transition-all duration-200
        p-5
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <InstrumentBadge nome={avaliacao.instrumentoNome} compact />
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              criada {formatDate(avaliacao.criadaEm)}
            </span>
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 line-clamp-1">
            {avaliacao.nome}
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={avaliacao.status} />
          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all duration-200" strokeWidth={1.75} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-x-4 gap-y-1 flex-wrap text-xs text-slate-600 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          <span className="tabular-nums">{avaliacao.escopoEstabelecimentos}</span> estab.
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          <span className="tabular-nums">{avaliacao.escopoSetores}</span> setores
        </span>
        {showWindow && (
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
            {formatDate(avaliacao.janelaInicio)} → {formatDate(avaliacao.janelaFim)}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          <span className="font-mono">{avaliacao.idiomas.map((i) => IDIOMA_LABEL[i] ?? i).join(' · ')}</span>
        </span>
        {avaliacao.modoAssistidoHabilitado && (
          <span className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
            <Accessibility className="w-3.5 h-3.5" strokeWidth={1.75} />
            assistido
          </span>
        )}
      </div>

      {showCoverage && (
        <div className="mt-4">
          <CoverageBar
            cobertura={avaliacao.coberturaPercent}
            coberturaMinima={avaliacao.coberturaMinima}
            respondentes={avaliacao.respondentes}
            elegiveis={avaliacao.trabalhadoresElegíveis}
          />
        </div>
      )}

      {deadlineUrgent && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 ring-1 ring-rose-200 dark:ring-rose-900/60 text-[11px] text-rose-700 dark:text-rose-300">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          {avaliacao.diasRestantes === 0 ? 'encerra hoje' : avaliacao.diasRestantes === 1 ? 'encerra amanhã' : `${avaliacao.diasRestantes} dias restantes`}
        </div>
      )}
    </button>
  )
}
