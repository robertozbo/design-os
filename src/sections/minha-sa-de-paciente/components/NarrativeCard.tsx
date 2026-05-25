import { Sparkles, RefreshCcw, Loader2, AlertCircle } from 'lucide-react'
import type { HealthNarrative } from '@/../product/sections/minha-sa-de-paciente/types'

interface NarrativeCardProps {
  narrative: HealthNarrative | null
  isLoading?: boolean
  isError?: boolean
  isRefreshing?: boolean
  onRefresh?: () => void
}

function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

// Lightweight markdown renderer for bold (**text**) and paragraphs.
function renderMarkdownInline(line: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index))
    }
    parts.push(
      <strong key={`b-${key++}`} className="font-bold text-slate-900 dark:text-slate-50">
        {match[1]}
      </strong>,
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex))
  }
  return parts
}

export function NarrativeCard({
  narrative,
  isLoading,
  isError,
  isRefreshing,
  onRefresh,
}: NarrativeCardProps) {
  const paragraphs = narrative?.narrative.split('\n\n').filter(Boolean) ?? []

  return (
    <section className="relative mt-8 overflow-hidden rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50/40 via-white to-emerald-50/30 shadow-sm dark:border-teal-500/30 dark:from-teal-500/5 dark:via-slate-900 dark:to-emerald-500/5">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-teal-400/20 via-emerald-300/10 to-transparent blur-3xl dark:from-teal-500/20 dark:via-emerald-500/10"
      />
      <header className="relative flex items-center justify-between gap-3 border-b border-teal-100 px-6 py-4 dark:border-teal-500/20">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-white shadow-sm shadow-teal-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Análise da sua evolução
              <span className="rounded-full bg-teal-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-teal-800 ring-1 ring-teal-200 dark:bg-teal-500/15 dark:text-teal-300 dark:ring-teal-500/30">
                IA
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Geração automática baseada nas suas 7 dimensões
            </p>
          </div>
        </div>
        {narrative?.cached && (
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30">
            Cacheado
          </span>
        )}
      </header>

      <div className="relative px-6 py-5">
        {isLoading && (
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-11/12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        )}

        {isError && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-rose-900 dark:text-rose-100">
                Não foi possível gerar a análise
              </p>
              <p className="mt-0.5 text-xs text-rose-800/80 dark:text-rose-200/80">
                Tente novamente em alguns instantes.
              </p>
            </div>
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300"
            >
              <RefreshCcw className="h-3 w-3" />
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !isError && !narrative && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Sparkles className="h-6 w-6 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Análise indisponível
            </p>
            <p className="max-w-sm text-xs text-slate-500 dark:text-slate-400">
              Adicione medições por pelo menos 7 dias pra liberar a análise
              automática.
            </p>
          </div>
        )}

        {!isLoading && !isError && narrative && (
          <div className="space-y-4 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
            {paragraphs.map((p, i) => (
              <p key={i}>{renderMarkdownInline(p)}</p>
            ))}
          </div>
        )}
      </div>

      {narrative && !isLoading && !isError && (
        <footer className="relative flex flex-wrap items-center justify-between gap-3 border-t border-teal-100 bg-white/40 px-6 py-3 dark:border-teal-500/20 dark:bg-slate-900/40">
          <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
            Gerado em {formatDateTime(narrative.generatedAt)}
          </p>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-100/60 disabled:opacity-50 dark:text-teal-300 dark:hover:bg-teal-500/15"
          >
            {isRefreshing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCcw className="h-3 w-3" />
            )}
            {isRefreshing ? 'Atualizando...' : 'Atualizar análise'}
          </button>
        </footer>
      )}
    </section>
  )
}
