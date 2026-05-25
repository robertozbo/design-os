import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  FlaskConical,
  Loader2,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import type { ExameRecente } from '@/../product-clinico/sections/consulta/types'
import type { ExameDetalhe as ExameLabDetalhe } from '@/../product-clinico/sections/exames/types'
import { LaudoViewer } from '@/sections-clinico/exames/components/LaudoViewer'
import { BiomarkersPanel } from '@/sections-clinico/exames/components/BiomarkersPanel'
import { IAApoioPanel } from '@/sections-clinico/exames/components/IAApoioPanel'
import { Sparkline } from './Sparkline'
import { formatDataBR } from './helpers'

const ALERT_NIVEL_STYLE: Record<string, string> = {
  normal: 'text-emerald-700 dark:text-emerald-400',
  baixo: 'text-amber-700 dark:text-amber-400',
  alto: 'text-rose-700 dark:text-rose-400',
  critico: 'text-rose-700 font-semibold dark:text-rose-400',
}

interface Props {
  exames: ExameRecente[]
  pacienteIniciaisAtual?: string
  /** Lookup pra trazer o detalhe completo do exame ao clicar (laudo + IA). */
  getExameLabDetalhe?: (exameId: string) => ExameLabDetalhe | null
  onAbrirExameDetalhe?: (id: string) => void
}

export function LaboratorioTab({
  exames,
  getExameLabDetalhe,
  onAbrirExameDetalhe,
}: Props) {
  const [exameAbertoId, setExameAbertoId] = useState<string | null>(null)
  const [iaStage, setIaStage] = useState<'analyzing' | 'done'>('analyzing')
  const [scanNonce, setScanNonce] = useState(0)

  const detalhe = exameAbertoId ? (getExameLabDetalhe?.(exameAbertoId) ?? null) : null

  // Toda vez que abre um exame ou re-analisa, dispara varredura IA por ~5s (~2 ciclos da scanline)
  useEffect(() => {
    if (!exameAbertoId) return
    setIaStage('analyzing')
    const t = window.setTimeout(() => setIaStage('done'), 5000)
    return () => window.clearTimeout(t)
  }, [exameAbertoId, scanNonce])

  const reanalisar = () => setScanNonce((n) => n + 1)

  if (exameAbertoId && detalhe) {
    return (
      <div>
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => setExameAbertoId(null)}
              className="
                -ml-1 inline-flex items-center gap-1 rounded-md p-1.5 text-xs font-medium text-slate-500
                transition-colors hover:bg-slate-100 hover:text-slate-900
                dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
              "
            >
              <ArrowLeft className="size-3.5" />
              Voltar
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                {detalhe.tipo}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {detalhe.laboratorio} · coletado {formatDataBR(detalhe.dataColeta)}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={reanalisar}
              disabled={iaStage === 'analyzing'}
              className="
                inline-flex items-center gap-1.5 rounded-md border border-emerald-300/70 bg-white px-2.5 py-1 text-[11px] font-medium text-emerald-800 shadow-sm transition-colors
                hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60
                focus:outline-none focus:ring-2 focus:ring-emerald-400
                dark:border-emerald-800/60 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40
              "
            >
              {iaStage === 'analyzing' ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  Analisando…
                </>
              ) : (
                <>
                  <RotateCcw className="size-3" />
                  Re-analisar com IA
                </>
              )}
            </button>
            {detalhe.statusRevisao === 'revisado' ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="size-3" />
                Revisado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                <Sparkles className="size-3" />
                A revisar
              </span>
            )}
          </div>
        </header>

        {/* 3-col inline: Laudo | Biomarkers | IA */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
          <div className="relative min-h-[520px] min-w-0 lg:flex-1">
            <LaudoViewer
              laudo={detalhe.laudoOriginal}
              laboratorio={detalhe.laboratorio}
              dataResultado={detalhe.dataResultado}
            />

            {/* Varredura IA — sobrepõe o laudo enquanto a IA "lê" */}
            {iaStage === 'analyzing' && <IAScanOverlay />}
          </div>
          <div className="w-full min-w-0 lg:w-[280px] lg:shrink-0">
            <BiomarkersPanel
              biomarkers={detalhe.biomarkers}
              onAbrirBiomarker={(n) => console.log('abrir biomarker:', n)}
            />
          </div>
          <div className="w-full min-w-0 lg:w-[320px] lg:shrink-0">
            {iaStage === 'analyzing' ? (
              <IAAnalyzingPlaceholder />
            ) : (
              <IAApoioPanel
                analise={detalhe.iaAnalise}
                onAbrirAuditIA={() => console.log('audit IA:', detalhe.id)}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Laboratório
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {exames.length} {exames.length === 1 ? 'exame laboratorial' : 'exames laboratoriais'} —
            clique pra abrir laudo, biomarkers e apoio IA.
          </p>
        </div>
      </header>

      <ul className="mt-5 space-y-3">
        {exames.map((e) => (
          <li key={e.id}>
            <button
              onClick={() => {
                setExameAbertoId(e.id)
                onAbrirExameDetalhe?.(e.id)
              }}
              className="
                group/lab w-full rounded-xl border border-slate-200/80 bg-white p-4 text-left transition-all
                hover:border-teal-300 hover:shadow-sm
                focus:outline-none focus:ring-2 focus:ring-teal-500/40
                dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
                    <FlaskConical className="size-3.5 text-slate-400" />
                    {e.tipo}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {e.laboratorio} · coletado {formatDataBR(e.dataColeta)}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200/70 bg-emerald-50/60 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <Sparkles className="size-2.5" />
                  IA pronta
                </span>
              </div>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {e.biomarkers.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-md border border-slate-200/60 bg-slate-50/40 p-2.5 dark:border-slate-800 dark:bg-slate-950/40"
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                        {b.nome}
                      </p>
                      <p className="text-[10px] text-slate-400">Ref. {b.faixaReferencia}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkline values={b.historico} ariaLabel={`Tendência ${b.nome}`} />
                      <span
                        className={`
                          font-mono text-sm font-medium tabular-nums ${
                            ALERT_NIVEL_STYLE[b.alertNivel] ?? 'text-slate-700 dark:text-slate-200'
                          }
                        `}
                      >
                        {b.valor}
                        <span className="ml-0.5 text-[10px] text-slate-400">{b.unidade}</span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* -------------------- Varredura IA sobre o laudo -------------------- */

function IAScanOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-2xl">
      {/* Dim suave por cima do laudo (papel ainda visível) */}
      <div
        className="absolute inset-0 bg-slate-950"
        style={{ animation: 'ia-dim-pulse 2.4s ease-in-out infinite', opacity: 0.35 }}
      />

      {/* Grid teal — sinaliza "scanner ativo" */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(45,212,191,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,212,191,0.45) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          animation: 'ia-grid-fade 2.4s ease-in-out infinite',
        }}
      />

      {/* Trail glow — segue a scanline horizontal */}
      <div
        className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-teal-400/25 to-teal-400/50"
        style={{ animation: 'ia-trail-y 2.4s ease-in-out infinite' }}
      />

      {/* Scanline horizontal — a "linha de leitura" sobre o texto */}
      <div
        className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_32px_8px_rgba(94,234,212,0.85)]"
        style={{ animation: 'ia-scan-y 2.4s ease-in-out infinite', top: 0 }}
      />

      {/* Scanline vertical secundária (cruzamento) */}
      <div
        className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-teal-300/70 to-transparent shadow-[0_0_18px_6px_rgba(45,212,191,0.5)]"
        style={{ animation: 'ia-scan-x 3.6s ease-in-out infinite', left: 0 }}
      />

      {/* Blips — "detecções" da IA sobre o laudo */}
      <span
        className="absolute size-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_3px_rgba(94,234,212,0.9)]"
        style={{ left: '28%', top: '32%', animation: 'ia-blip 1.8s ease-in-out infinite' }}
      />
      <span
        className="absolute size-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_3px_rgba(94,234,212,0.9)]"
        style={{ left: '62%', top: '58%', animation: 'ia-blip 1.8s ease-in-out infinite 0.5s' }}
      />
      <span
        className="absolute size-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_3px_rgba(94,234,212,0.9)]"
        style={{ left: '46%', top: '74%', animation: 'ia-blip 1.8s ease-in-out infinite 1.1s' }}
      />

      {/* Corner brackets — reticle de scanner */}
      <span
        className="absolute left-3 top-3 size-5 border-l-2 border-t-2 border-cyan-300"
        style={{ animation: 'ia-corner-pulse 1.2s ease-in-out infinite' }}
      />
      <span
        className="absolute right-3 top-3 size-5 border-r-2 border-t-2 border-cyan-300"
        style={{ animation: 'ia-corner-pulse 1.2s ease-in-out infinite 0.3s' }}
      />
      <span
        className="absolute bottom-3 left-3 size-5 border-b-2 border-l-2 border-cyan-300"
        style={{ animation: 'ia-corner-pulse 1.2s ease-in-out infinite 0.6s' }}
      />
      <span
        className="absolute bottom-3 right-3 size-5 border-b-2 border-r-2 border-cyan-300"
        style={{ animation: 'ia-corner-pulse 1.2s ease-in-out infinite 0.9s' }}
      />

      {/* HUD inferior — "Lendo laudo..." */}
      <div className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-md border border-cyan-400/60 bg-slate-950/90 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-200 shadow-[0_0_24px_4px_rgba(94,234,212,0.3)] backdrop-blur-md">
        <Loader2 className="size-3 animate-spin" />
        Lendo laudo · cruzando com histórico
      </div>
    </div>
  )
}

/* -------------------- Placeholder do painel IA -------------------- */

function IAAnalyzingPlaceholder() {
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-b from-emerald-50/40 via-white to-white shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900">
      <header className="flex items-center gap-2 border-b border-emerald-200/60 bg-emerald-50/40 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <span className="inline-flex size-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Sparkles className="size-3.5" />
        </span>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800 dark:text-emerald-300">
            Apoio à interpretação · IA
          </h2>
          <p className="flex items-center gap-1 text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
            <Loader2 className="size-2.5 animate-spin" />
            Analisando laudo, biomarkers e contexto clínico…
          </p>
        </div>
      </header>

      <div className="space-y-3 p-4">
        {[0, 1, 2, 3].map((i) => (
          <article
            key={i}
            className="animate-pulse rounded-xl border-l-4 border-l-emerald-300/60 border border-y-slate-200/60 border-r-slate-200/60 bg-white p-3 shadow-sm dark:border-y-slate-800 dark:border-r-slate-800 dark:bg-slate-900"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="flex items-center gap-2">
              <span className="size-7 shrink-0 rounded-md bg-emerald-100 dark:bg-emerald-950/60" />
              <div className="flex-1 space-y-1">
                <div className="h-2.5 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-1.5 w-1/3 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="h-2 w-full rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-2 w-11/12 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-2 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
