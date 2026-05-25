import {
  ArrowLeft,
  Camera,
  Sparkles,
  Wand2,
  PersonStanding,
  Target,
  ShieldCheck,
  Info,
  TrendingDown,
} from 'lucide-react'
import type {
  Snapshot,
  ProjecaoMeta,
  RegiaoCorporal,
} from '@/../product-mobile/sections/minha-saude/types'
import { IdadesCard } from './IdadesCard'
import { statusFromScore, STATUS_VISUAL, formatDateBR } from './_shared'

interface SnapshotDetailProps {
  snapshot: Snapshot
  /** Meta + prompt config (se já definidos) */
  projecaoMeta?: ProjecaoMeta
  promptTexto?: string
  modeloIA?: string
  disclaimerEducativo?: string
  onBack: () => void
  onGerarProjecao?: () => void
  onEditarMeta?: () => void
}

const REGIAO_LABEL: Record<RegiaoCorporal, string> = {
  abdomen: 'Abdômen',
  flancos: 'Flancos',
  peitoral: 'Peitoral',
  costas: 'Costas',
  bracos: 'Braços',
  pernas: 'Pernas',
  cintura: 'Cintura',
  ombros: 'Ombros',
  postura: 'Postura',
}

export function SnapshotDetail({
  snapshot,
  projecaoMeta,
  promptTexto,
  modeloIA = 'nano-banana',
  disclaimerEducativo,
  onBack,
  onGerarProjecao,
  onEditarMeta,
}: SnapshotDetailProps) {
  const status = statusFromScore(snapshot.scoreGeral)
  const visual = STATUS_VISUAL[status]
  const fotoCount = snapshot.fotos
    ? Object.values(snapshot.fotos).filter(Boolean).length
    : 0

  return (
    <div className="min-h-full bg-slate-950 pb-6">
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-slate-900">
        <div className="px-4 pt-3 pb-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-300 shrink-0"
            aria-label="Voltar"
          >
            <ArrowLeft size={15} strokeWidth={2.2} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-slate-50 font-semibold text-[14px] leading-tight font-mono tabular-nums">
              {formatDateBR(snapshot.geradoEm)}
            </div>
            <div className="text-slate-500 text-[10.5px] mt-0.5">Análise · snapshot</div>
          </div>
          <div
            className={`shrink-0 w-12 h-12 rounded-xl ${visual.bg} flex items-center justify-center ${visual.text} font-bold text-[16px] font-mono tabular-nums`}
          >
            {snapshot.scoreGeral}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/15 flex items-center justify-center text-teal-300">
              <Sparkles size={13} strokeWidth={2.2} />
            </div>
            <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
              Resumo da IA
            </span>
          </div>
          <p className="text-slate-200 text-[12.5px] leading-relaxed">{snapshot.resumoIA}</p>
          {snapshot.destaques.length > 0 && (
            <ul className="mt-3 space-y-1.5 pt-3 border-t border-slate-800/80">
              {snapshot.destaques.map((d, i) => (
                <li key={i} className="text-slate-300 text-[11.5px] flex gap-2 leading-snug">
                  <span className="text-teal-400 shrink-0">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {snapshot.idades && (
          <IdadesCard idades={snapshot.idades} showProjetada={!!snapshot.idades.visualProjetada} />
        )}

        {snapshot.fotos && fotoCount > 0 && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="px-3.5 py-2.5 border-b border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Camera size={11} strokeWidth={2.4} />
                Fotos congeladas
              </span>
              <span className="text-slate-600 text-[10px] font-mono tabular-nums">
                {fotoCount} foto{fotoCount === 1 ? '' : 's'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 p-2">
              {(['frontal', 'posterior', 'lateralEsquerda', 'lateralDireita'] as const).map((k) => {
                const url = snapshot.fotos?.[k]
                const labels: Record<typeof k, string> = {
                  frontal: 'Frente',
                  posterior: 'Costas',
                  lateralEsquerda: 'Perfil E',
                  lateralDireita: 'Perfil D',
                }
                return (
                  <div key={k} className="aspect-[3/4] rounded-lg overflow-hidden bg-slate-800/60 flex items-center justify-center relative">
                    {url ? (
                      <PersonStanding size={28} className="text-slate-600" strokeWidth={1.4} />
                    ) : (
                      <PersonStanding size={28} className="text-slate-700/50" strokeWidth={1.2} />
                    )}
                    <span className="absolute bottom-1 left-1 right-1 text-center text-[8.5px] text-slate-500 font-mono uppercase tracking-wider">
                      {labels[k]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {projecaoMeta && (
          <ProjecaoBlock
            meta={projecaoMeta}
            promptTexto={promptTexto}
            modeloIA={modeloIA}
            disclaimerEducativo={disclaimerEducativo}
            onGerar={onGerarProjecao}
            onEditarMeta={onEditarMeta}
          />
        )}

        {snapshot.consentimento && (
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={13} className="text-emerald-400 shrink-0" strokeWidth={2.2} />
              <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
                Consentimento registrado
              </span>
            </div>
            <div className="text-slate-500 text-[10.5px] font-mono">
              termo {snapshot.consentimento.versaoTermo} · {formatDateBR(snapshot.consentimento.aceitoEm.split('T')[0])}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {snapshot.consentimento.escopo.map((e) => (
                <span
                  key={e}
                  className="text-[9.5px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
                >
                  {e.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-3 flex gap-2">
          <Info size={12} className="text-slate-500 shrink-0 mt-0.5" strokeWidth={2.2} />
          <p className="text-slate-500 text-[10.5px] leading-relaxed">
            Esta análise é educativa, não substitui avaliação profissional. Idades visuais são
            estimativas subjetivas. Prescrição (volume, déficit, plano alimentar) continua via seu
            profissional vinculado.
          </p>
        </div>
      </div>
    </div>
  )
}

function ProjecaoBlock({
  meta,
  promptTexto,
  modeloIA,
  disclaimerEducativo,
  onGerar,
  onEditarMeta,
}: {
  meta: ProjecaoMeta
  promptTexto?: string
  modeloIA: string
  disclaimerEducativo?: string
  onGerar?: () => void
  onEditarMeta?: () => void
}) {
  const linhas: { label: string; atual: string; alvo: string }[] = [
    {
      label: 'Peso',
      atual: `${meta.peso.atual} kg`,
      alvo: `${meta.peso.alvoMin}–${meta.peso.alvoMax} kg`,
    },
    {
      label: '% Gordura',
      atual: `${meta.gorduraPercent.atual}%`,
      alvo: `${meta.gorduraPercent.alvoMin}–${meta.gorduraPercent.alvoMax}%`,
    },
    {
      label: 'Massa muscular',
      atual: `${meta.massaMuscular.atual} kg`,
      alvo: meta.massaMuscular.estrategia === 'manter' ? 'Manter' : meta.massaMuscular.estrategia === 'ganhar' ? 'Ganhar' : 'Reduzir',
    },
  ]
  if (meta.idadeCorporal) {
    linhas.push({
      label: 'Idade corporal',
      atual: `${meta.idadeCorporal.atual} anos`,
      alvo: `${meta.idadeCorporal.alvoMin}–${meta.idadeCorporal.alvoMax} anos`,
    })
  }

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-slate-900 to-sky-500/10 overflow-hidden">
      <div className="px-3.5 pt-3.5 pb-2.5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-300 shrink-0">
          <Wand2 size={18} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-semibold text-[13.5px]">Projeção Corporal</div>
          <div className="text-violet-300/80 text-[10.5px] mt-0.5 font-mono">
            modelo: {modeloIA}
          </div>
        </div>
        <button
          onClick={onEditarMeta}
          className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-center shrink-0"
          aria-label="Editar meta"
        >
          <Target size={13} strokeWidth={2.2} />
        </button>
      </div>

      <div className="px-3.5 pb-2">
        <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-1 px-3 py-2 border-b border-slate-800/60 text-[9.5px] font-semibold uppercase tracking-wider text-slate-500">
            <span>Métrica</span>
            <span className="text-center">Atual</span>
            <span className="text-right">Meta</span>
          </div>
          {linhas.map((l) => (
            <div key={l.label} className="grid grid-cols-[1fr_auto_1fr] gap-1 px-3 py-1.5 text-[11.5px] border-b border-slate-800/40 last:border-b-0">
              <span className="text-slate-400">{l.label}</span>
              <span className="text-slate-300 font-mono tabular-nums text-center">{l.atual}</span>
              <span className="text-violet-300 font-mono tabular-nums text-right font-semibold">{l.alvo}</span>
            </div>
          ))}
        </div>
      </div>

      {meta.regioesPrioritarias.length > 0 && (
        <div className="px-3.5 pb-2.5">
          <div className="text-slate-500 text-[9.5px] font-semibold uppercase tracking-wider mb-1.5">
            Regiões priorizadas
          </div>
          <div className="flex flex-wrap gap-1.5">
            {meta.regioesPrioritarias.map((r) => (
              <span
                key={r}
                className="text-[10.5px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-200 border border-violet-500/30"
              >
                {REGIAO_LABEL[r]}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="px-3.5 pb-3.5">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <div className="text-slate-500 text-[9.5px] font-semibold uppercase tracking-wider text-center mb-1.5">
              Atual
            </div>
            <div className="aspect-[3/4] rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <PersonStanding size={56} className="text-slate-600/60" strokeWidth={1.2} />
            </div>
          </div>
          <div>
            <div className="text-violet-300 text-[9.5px] font-semibold uppercase tracking-wider text-center mb-1.5 flex items-center justify-center gap-1">
              <TrendingDown size={9} strokeWidth={2.6} />
              Projetada
            </div>
            <div className="aspect-[3/4] rounded-xl bg-violet-500/5 border border-dashed border-violet-500/40 flex items-center justify-center relative">
              <PersonStanding size={56} className="text-violet-300/40" strokeWidth={1.2} />
              <span className="absolute bottom-1.5 left-1.5 right-1.5 text-center text-[8.5px] text-violet-300/60 font-mono uppercase tracking-wider">
                placeholder
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onGerar}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 text-white font-semibold text-[13px] flex items-center justify-center gap-2"
        >
          <Wand2 size={14} strokeWidth={2.4} />
          Gerar com {modeloIA}
        </button>

        {promptTexto && (
          <details className="mt-2.5">
            <summary className="text-slate-500 text-[10px] font-mono cursor-pointer hover:text-slate-400">
              ver prompt enviado pra IA
            </summary>
            <pre className="mt-1.5 rounded-lg bg-slate-950/60 border border-slate-800/60 p-2 text-[10px] text-slate-400 leading-relaxed whitespace-pre-wrap font-mono">
              {promptTexto}
            </pre>
          </details>
        )}

        {disclaimerEducativo && (
          <p className="text-violet-200/60 text-[10px] mt-2.5 leading-relaxed text-center italic">
            {disclaimerEducativo}
          </p>
        )}
      </div>
    </div>
  )
}
