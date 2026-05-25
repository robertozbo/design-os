import { ArrowLeft, Calendar, ChevronRight, ClipboardCheck, Globe2, RefreshCw, Send, ShieldCheck } from 'lucide-react'
import type { AvaliacaoDetalheProps } from '@/../product/sections/avalia-es-de-risco/types'
import { CoberturaGauge } from './CoberturaGauge'
import { SetoresCoberturaList } from './SetoresCoberturaList'
import { LembretesLog } from './LembretesLog'

const STATUS_STYLE = {
  rascunho: {
    label: 'Rascunho',
    chip: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400',
  },
  em_aplicacao: {
    label: 'Em aplicação',
    chip: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-900/60',
    dot: 'bg-teal-500',
  },
  encerrada: {
    label: 'Encerrada',
    chip: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
    dot: 'bg-rose-500',
  },
  publicada: {
    label: 'Publicada',
    chip: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
    dot: 'bg-emerald-500',
  },
} as const

export function AvaliacaoDetalhe({
  empregador,
  avaliacao,
  detalhe,
  onBack,
  onReenviarLembrete,
  onEstenderPrazo,
  onPublicar,
  onAbrirSetor,
}: AvaliacaoDetalheProps) {
  const status = STATUS_STYLE[avaliacao.status]
  const meetsMin = avaliacao.coberturaPercent >= avaliacao.coberturaMinima
  const setoresEmAlerta = detalhe.coberturaPorSetor.filter((s) => s.status === 'alerta').length

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
              <span className="text-teal-700 dark:text-teal-400">NR-1 · Avaliação de risco</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-slate-500 dark:text-slate-500">{empregador.razaoSocial}</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-[30px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              {avaliacao.nome}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${status.chip}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Instrumento <span className="font-medium text-slate-700 dark:text-slate-200">{avaliacao.instrumentoNome}</span>
              </span>
              {avaliacao.diasRestantes !== null && (
                <span className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                  · {avaliacao.diasRestantes} {avaliacao.diasRestantes === 1 ? 'dia restante' : 'dias restantes'}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={() => avaliacao.janelaFim && onEstenderPrazo?.(avaliacao.id, avaliacao.janelaFim)}
              className="
                inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl
                bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800
                text-slate-700 dark:text-slate-200 text-sm font-medium
                hover:border-slate-300 dark:hover:border-slate-700
                transition
              "
            >
              <RefreshCw className="w-3.5 h-3.5" strokeWidth={2.25} />
              Estender prazo
            </button>

            <button
              type="button"
              onClick={() => meetsMin && onPublicar?.(avaliacao.id)}
              disabled={!meetsMin || avaliacao.status !== 'em_aplicacao'}
              className={`
                inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-tight
                ${
                  meetsMin
                    ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-[0_12px_28px_-12px_rgba(20,184,166,0.55)]'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                }
                active:scale-[0.98] transition
              `}
              title={meetsMin ? 'Publicar avaliação' : 'Cobertura mínima de 60% não atingida'}
            >
              <ShieldCheck className="w-4 h-4" strokeWidth={2.25} />
              Publicar avaliação
            </button>
          </div>
        </header>

        <div style={{ animationDelay: '200ms' }} className="nymos-reveal opacity-0 mt-6 grid grid-cols-1 lg:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)] gap-6">
          <section className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5">
            <CoberturaGauge
              cobertura={avaliacao.coberturaPercent}
              minimo={avaliacao.coberturaMinima}
              respondentes={avaliacao.respondentes}
              elegiveis={avaliacao.trabalhadoresElegíveis}
            />
            <div className="mt-5 grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Mínimo NR-1</div>
                <div className="mt-0.5 text-base font-semibold tabular-nums text-slate-900 dark:text-slate-50">{avaliacao.coberturaMinima}%</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Setores em alerta</div>
                <div className={`mt-0.5 text-base font-semibold tabular-nums ${setoresEmAlerta > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {setoresEmAlerta}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 text-sm">
              <Row icon={Calendar} label="Janela">
                <span className="tabular-nums">
                  {avaliacao.janelaInicio ?? '—'} → {avaliacao.janelaFim ?? '—'}
                </span>
              </Row>
              <Row icon={ClipboardCheck} label="Escopo">
                {avaliacao.escopoEstabelecimentos} estab. · {avaliacao.escopoSetores} setores
              </Row>
              <Row icon={Globe2} label="Idiomas">
                <span className="font-mono uppercase tracking-[0.14em] text-xs">{avaliacao.idiomas.join(' · ')}</span>
              </Row>
            </div>

            {!meetsMin && (
              <div className="mt-5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 p-3 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                Faltam <span className="font-semibold tabular-nums">{Math.ceil((avaliacao.coberturaMinima - avaliacao.coberturaPercent) * avaliacao.trabalhadoresElegíveis / 100)}</span> respostas para atingir o mínimo de {avaliacao.coberturaMinima}%. Reenvie lembrete aos setores em alerta ou estenda o prazo.
              </div>
            )}
          </section>

          <div className="space-y-5 min-w-0">
            <SetoresCoberturaList
              setores={detalhe.coberturaPorSetor}
              onAbrirSetor={onAbrirSetor}
              onReenviarLembrete={(ids) => onReenviarLembrete?.(avaliacao.id, ids)}
            />

            <LembretesLog lembretes={detalhe.lembretes} />

            <button
              type="button"
              onClick={() => onReenviarLembrete?.(avaliacao.id, detalhe.coberturaPorSetor.map((s) => s.setorId))}
              className="
                w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl
                bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold
                shadow-[0_12px_28px_-12px_rgba(124,58,237,0.55)]
                active:scale-[0.98] transition
              "
            >
              <Send className="w-4 h-4" strokeWidth={2.25} />
              Enviar lembrete a todos os respondentes pendentes
              <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ icon: Icon, label, children }: { icon: typeof Calendar; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" strokeWidth={2.25} />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</div>
        <div className="mt-0.5 text-slate-700 dark:text-slate-200">{children}</div>
      </div>
    </div>
  )
}

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
      <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-teal-200/40 dark:bg-teal-900/20 blur-3xl" />
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
