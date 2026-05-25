import { useState } from 'react'
import { ArrowLeft, Download, FileDown, Lock, Send, ShieldCheck } from 'lucide-react'
import type {
  ClassificacaoRisco,
  MatrizPsicossocialProps,
} from '@/../product/sections/avalia-es-de-risco/types'
import { MatrizHeatmap } from './MatrizHeatmap'
import { SugestoesAcaoPanel } from './SugestoesAcaoPanel'
import { FatorDrillDown } from './FatorDrillDown'

export function MatrizPsicossocial({
  empregador,
  avaliacao,
  matriz,
  onBack,
  onExportarPgr,
  onBaixarRelatorio,
  onSelecionarCelula,
}: MatrizPsicossocialProps) {
  const [drillDownOpen, setDrillDownOpen] = useState(false)
  const [drillSelection, setDrillSelection] = useState<{
    setor: string
    fator: string
    score: number
    classificacao: ClassificacaoRisco
  } | null>(null)

  const handleSelecionarCelula = (setor: string, fator: string) => {
    const celula = matriz.celulas.find((c) => c.setor === setor && c.fator === fator)
    if (celula) {
      setDrillSelection({
        setor,
        fator,
        score: celula.score,
        classificacao: celula.classificacao,
      })
      setDrillDownOpen(true)
    }
    onSelecionarCelula?.(setor, fator)
  }

  const drillDownAtual = drillSelection
    ? matriz.drillDownFatores?.find((d) => d.fator === drillSelection.fator) ?? null
    : null

  const meetsMin = avaliacao.coberturaPercent >= avaliacao.coberturaMinima
  const totalCelulas = matriz.celulas.length
  const prioritarios = matriz.celulas.filter((c) => c.classificacao === 'prioritario').length
  const criticos = matriz.celulas.filter((c) => c.classificacao === 'critico').length

  if (!meetsMin) {
    return (
      <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <RevealStyles />
        <div className="relative mx-auto w-full max-w-[760px] px-4 sm:px-6 lg:px-10 pt-6 pb-16">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-[0.16em] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.25} />
            Voltar
          </button>

          <div
            style={{ animationDelay: '120ms' }}
            className="nymos-reveal opacity-0 mt-6 rounded-3xl border border-rose-200 dark:border-rose-900/60 bg-gradient-to-br from-rose-50 via-white to-amber-50/40 dark:from-rose-950/30 dark:via-slate-950 dark:to-amber-950/20 p-6 sm:p-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-[0_14px_28px_-12px_rgba(225,29,72,0.55)]">
                <Lock className="w-5 h-5" strokeWidth={2.25} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">
                  Matriz bloqueada
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                  Cobertura abaixo do mínimo NR-1
                </h1>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  A matriz psicossocial só é gerada com cobertura ≥ {avaliacao.coberturaMinima}%. A avaliação{' '}
                  <span className="font-semibold">{avaliacao.nome}</span> atingiu apenas{' '}
                  <span className="font-semibold tabular-nums">{avaliacao.coberturaPercent.toFixed(1)}%</span>{' '}
                  ({avaliacao.respondentes} de {avaliacao.trabalhadoresElegíveis} respondentes).
                </p>

                <div className="mt-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white/70 dark:bg-slate-900/40 p-4">
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-50">Por que esse limite existe?</h3>
                  <p className="mt-1 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    Cobertura abaixo de 60% gera viés de auto-seleção: tendem a responder quem está no extremo (muito mal ou muito bem). Isso distorce a matriz e produz plano de ação errado, prejudicando o trabalhador.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-teal-400 active:scale-[0.98] transition"
                  >
                    <Send className="w-3.5 h-3.5" strokeWidth={2.25} />
                    Voltar ao detalhe e estender prazo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <RevealStyles />
      <BackgroundGlow />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 pt-6 pb-16">
        <button
          type="button"
          onClick={onBack}
          style={{ animationDelay: '40ms' }}
          className="
            nymos-reveal opacity-0
            inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
            text-xs font-mono uppercase tracking-[0.16em]
            text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200
            hover:bg-slate-100 dark:hover:bg-slate-800
            transition
          "
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.25} />
          Voltar
        </button>

        <header style={{ animationDelay: '120ms' }} className="nymos-reveal opacity-0 mt-5 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em]">
              <span className="text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" strokeWidth={2.25} />
                NR-1 · Matriz publicada
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-slate-500 dark:text-slate-500">{empregador.razaoSocial}</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-[30px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              {avaliacao.nome}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
              <span>Instrumento <span className="font-medium text-slate-700 dark:text-slate-200">{avaliacao.instrumentoNome}</span></span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="tabular-nums">Cobertura {avaliacao.coberturaPercent.toFixed(1)}% ({avaliacao.respondentes} respostas)</span>
              {avaliacao.publicadaEm && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="tabular-nums">
                    Publicada {new Date(avaliacao.publicadaEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={() => onBaixarRelatorio?.(avaliacao.id)}
              className="
                inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl
                bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800
                text-slate-700 dark:text-slate-200 text-sm font-medium
                hover:border-slate-300 dark:hover:border-slate-700
                transition
              "
            >
              <FileDown className="w-3.5 h-3.5" strokeWidth={2.25} />
              Baixar PDF
            </button>

            <button
              type="button"
              onClick={() => onExportarPgr?.(avaliacao.id)}
              className="
                inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl
                bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold tracking-tight
                shadow-[0_12px_28px_-12px_rgba(124,58,237,0.55)]
                active:scale-[0.98] transition
              "
            >
              <Download className="w-4 h-4" strokeWidth={2.25} />
              Exportar para PGR
            </button>
          </div>
        </header>

        <section style={{ animationDelay: '200ms' }} className="nymos-reveal opacity-0 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard label="Setores" value={matriz.setores.length} />
          <SummaryCard label="Fatores" value={matriz.fatores.length} />
          <SummaryCard label="Críticos" value={criticos} accent="orange" />
          <SummaryCard label="Prioritários" value={prioritarios} accent="rose" />
        </section>

        <div style={{ animationDelay: '280ms' }} className="nymos-reveal opacity-0 mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-5">
          <MatrizHeatmap matriz={matriz} onSelecionarCelula={handleSelecionarCelula} />
          <SugestoesAcaoPanel sugestoes={matriz.sugestoesAcao} />
        </div>

        <p
          style={{ animationDelay: '360ms' }}
          className="nymos-reveal opacity-0 mt-6 text-[11px] text-slate-400 dark:text-slate-500 text-center tabular-nums"
        >
          {totalCelulas} células avaliadas · clique numa célula para ver perguntas que compõem o fator · resultado anonimizado · auditável pelo MTE
        </p>
      </div>

      <FatorDrillDown
        open={drillDownOpen}
        setor={drillSelection?.setor ?? null}
        fator={drillSelection?.fator ?? null}
        score={drillSelection?.score ?? null}
        classificacao={drillSelection?.classificacao ?? null}
        drillDown={drillDownAtual}
        onClose={() => setDrillDownOpen(false)}
      />
    </div>
  )
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: 'orange' | 'rose'
}) {
  const accentClass =
    accent === 'rose'
      ? 'text-rose-700 dark:text-rose-300'
      : accent === 'orange'
        ? 'text-orange-700 dark:text-orange-300'
        : 'text-slate-900 dark:text-slate-50'
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4">
      <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${accentClass}`}>{value}</div>
    </div>
  )
}

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
      <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-emerald-200/40 dark:bg-emerald-900/20 blur-3xl" />
      <div className="absolute -top-16 left-[18%] w-[400px] h-[400px] rounded-full bg-violet-200/30 dark:bg-violet-950/30 blur-3xl" />
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      .nymos-reveal { animation: nymos-reveal-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      @media (prefers-reduced-motion: reduce) { .nymos-reveal { animation: none !important; opacity: 1 !important; transform: none !important; } }
    `}</style>
  )
}
