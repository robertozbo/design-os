/**
 * IaInsightsPanel — versão protótipo Design OS (sem backend)
 *
 * Mock: clicar "Gerar insight" simula 1.5s de loading e retorna fake data
 * baseada no SOAP draft. Mesma visual da versão real do Nymos.
 *
 * Card tone: violet wash (sinaliza "isso é IA", não confunde com brand emerald).
 */

import { useState } from 'react'
import {
  Sparkles,
  Loader2,
  TrendingUp,
  Lightbulb,
  Target,
  Plus,
  X as XIcon,
  AlertCircle,
  RotateCcw,
  Info,
} from 'lucide-react'
import type { SoapFields } from '@/../product-psicologo/sections/sessao/types'

type Confidence = 'low' | 'medium' | 'high'
type SourceWindow = '7d' | '30d' | '90d' | 'all'

interface Pattern {
  text: string
  sourceWindow: SourceWindow
}

interface Hypothesis {
  cid: string | null
  label: string
  confidence: Confidence
  rationale: string
}

interface HomeworkSuggestion {
  text: string
  rationale: string
}

interface InsightResult {
  patterns: Pattern[]
  hypotheses: Hypothesis[]
  homework: HomeworkSuggestion[]
}

const CONFIDENCE_VISUAL: Record<Confidence, { label: string; cls: string }> = {
  low: { label: 'baixa', cls: 'bg-slate-800 text-slate-400' },
  medium: { label: 'média', cls: 'bg-amber-500/15 text-amber-300' },
  high: { label: 'alta', cls: 'bg-rose-500/15 text-rose-300' },
}

const WINDOW_LABEL: Record<SourceWindow, string> = {
  '7d': '7 dias',
  '30d': '30 dias',
  '90d': '90 dias',
  all: 'tudo',
}

interface IaInsightsPanelProps {
  soapDraft: SoapFields
  homeworkDraft: string
  onApplyToSoap: (campo: keyof SoapFields, text: string) => void
  onApplyToHomework: (text: string) => void
}

export function IaInsightsPanel({
  soapDraft,
  homeworkDraft,
  onApplyToSoap,
  onApplyToHomework,
}: IaInsightsPanelProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [data, setData] = useState<InsightResult | null>(null)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const handleGenerate = () => {
    setDismissed(new Set())
    setStatus('loading')
    setData(null)
    setTimeout(() => {
      setData(buildMockInsight(soapDraft))
      setStatus('success')
    }, 1500)
  }

  const dismiss = (key: string) => setDismissed((prev) => new Set(prev).add(key))

  const visiblePatterns = data?.patterns.filter((p) => !dismissed.has(patternKey(p))) ?? []
  const visibleHypotheses = data?.hypotheses.filter((h) => !dismissed.has(hypothesisKey(h))) ?? []
  const visibleHomework = data?.homework.filter((h) => !dismissed.has(homeworkKey(h))) ?? []

  return (
    <div className="rounded-2xl bg-slate-900 border border-violet-500/30 p-3.5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/15 text-violet-300 flex items-center justify-center">
            <Sparkles size={13} strokeWidth={2.4} />
          </div>
          <div>
            <div className="text-slate-100 font-semibold text-[12.5px] flex items-center gap-1.5">
              IA Insights
              <span className="px-1 py-0.5 rounded bg-violet-500/15 text-violet-300 text-[8.5px] font-bold uppercase tracking-wider">
                Pro
              </span>
            </div>
            <div className="text-slate-500 text-[10px]">Assistente de raciocínio clínico</div>
          </div>
        </div>
        {data && status === 'success' && (
          <button
            type="button"
            onClick={handleGenerate}
            className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center"
            title="Gerar novamente"
          >
            <RotateCcw size={12} strokeWidth={2.4} />
          </button>
        )}
      </div>

      {/* IDLE */}
      {status === 'idle' && (
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!hasMinimumContext(soapDraft)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold text-[12px] flex items-center justify-center gap-2 transition"
        >
          <Sparkles size={13} strokeWidth={2.4} />
          {hasMinimumContext(soapDraft) ? 'Gerar insight' : 'Anote algo no SOAP primeiro'}
        </button>
      )}

      {/* LOADING */}
      {status === 'loading' && (
        <div className="py-4 flex flex-col items-center gap-2 text-slate-500">
          <Loader2 size={20} className="animate-spin text-violet-400" />
          <span className="text-[11px]">Analisando contexto…</span>
          <span className="text-[10px] text-slate-600">~15 segundos</span>
        </div>
      )}

      {/* ERROR */}
      {status === 'error' && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="text-rose-400 mt-0.5 shrink-0" />
            <div className="text-[11px] text-rose-200 leading-snug">Erro ao gerar insight.</div>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            className="w-full py-1.5 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-[11px] font-semibold"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* SUCCESS */}
      {status === 'success' && data && (
        <div className="space-y-3">
          {visiblePatterns.length > 0 && (
            <Section icon={<TrendingUp size={11} />} label="Padrões observados">
              {visiblePatterns.map((p) => (
                <PatternCard
                  key={patternKey(p)}
                  pattern={p}
                  onApply={() => {
                    onApplyToSoap('avaliacao', appendText(soapDraft.avaliacao, p.text))
                    dismiss(patternKey(p))
                  }}
                  onDismiss={() => dismiss(patternKey(p))}
                />
              ))}
            </Section>
          )}

          {visibleHypotheses.length > 0 && (
            <Section icon={<Lightbulb size={11} />} label="Hipóteses a considerar">
              {visibleHypotheses.map((h) => (
                <HypothesisCard
                  key={hypothesisKey(h)}
                  hypothesis={h}
                  onApply={() => {
                    const composed = h.cid
                      ? `${h.label} (${h.cid}) — ${h.rationale}`
                      : `${h.label} — ${h.rationale}`
                    onApplyToSoap('avaliacao', appendText(soapDraft.avaliacao, composed))
                    dismiss(hypothesisKey(h))
                  }}
                  onDismiss={() => dismiss(hypothesisKey(h))}
                />
              ))}
            </Section>
          )}

          {visibleHomework.length > 0 && (
            <Section icon={<Target size={11} />} label="Sugestões de homework">
              {visibleHomework.map((h) => (
                <HomeworkCard
                  key={homeworkKey(h)}
                  homework={h}
                  onApply={() => {
                    onApplyToHomework(appendText(homeworkDraft, h.text))
                    dismiss(homeworkKey(h))
                  }}
                  onDismiss={() => dismiss(homeworkKey(h))}
                />
              ))}
            </Section>
          )}

          {visiblePatterns.length === 0 &&
            visibleHypotheses.length === 0 &&
            visibleHomework.length === 0 && (
              <div className="text-center text-[11px] text-slate-500 py-3">
                Todos os insights foram aplicados ou descartados.
              </div>
            )}

          <SourcesUsed soap={soapDraft} homework={homeworkDraft} />

          <div className="flex items-start gap-1.5 text-slate-500 text-[10.5px] mt-2 leading-tight">
            <Info size={11} className="shrink-0 mt-px" />
            <span>Gerado por IA para fins informativos. Não substitui orientação profissional.</span>
          </div>
        </div>
      )}
    </div>
  )
}

function SourcesUsed({ soap, homework }: { soap: SoapFields; homework: string }) {
  const usedSoap = [
    { key: 'S', label: 'Subjetivo', filled: !!soap.subjetivo?.trim() },
    { key: 'O', label: 'Objetivo', filled: !!soap.objetivo?.trim() },
    { key: 'A', label: 'Avaliação', filled: !!soap.avaliacao?.trim() },
    { key: 'P', label: 'Plano', filled: !!soap.plano?.trim() },
  ]
  const usedHomework = !!homework.trim()
  const phase2 = ['histórico de sessões', 'scores PHQ-9/GAD-7', 'plano terapêutico', 'risco atual', 'técnicas']

  return (
    <details className="mt-3 rounded-lg bg-slate-950/40 border border-slate-800 p-2.5">
      <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
        <Info size={10} strokeWidth={2.4} />
        Fontes desta análise
      </summary>
      <div className="mt-2 space-y-2">
        <div>
          <div className="text-[9.5px] font-semibold text-emerald-400 mb-1">Usado</div>
          <div className="flex flex-wrap gap-1">
            {usedSoap.map((s) => (
              <span
                key={s.key}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  s.filled
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : 'bg-slate-800 text-slate-600 line-through'
                }`}
                title={s.label}
              >
                {s.key} · {s.label}
              </span>
            ))}
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                usedHomework
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'bg-slate-800 text-slate-600 line-through'
              }`}
            >
              Homework rascunho
            </span>
          </div>
        </div>
        <div>
          <div className="text-[9.5px] font-semibold text-slate-500 mb-1">
            Não usado nesta fase
          </div>
          <div className="flex flex-wrap gap-1">
            {phase2.map((p) => (
              <span
                key={p}
                className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-600 text-[10px] font-medium"
              >
                {p}
              </span>
            ))}
          </div>
          <div className="text-[9.5px] text-slate-600 italic mt-1.5 leading-snug">
            Fase 2 — quando ativado, IA passa a considerar histórico longitudinal.
          </div>
        </div>
      </div>
    </details>
  )
}

// =============================================================================
// Subcomponents
// =============================================================================

function Section({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
        {icon}
        {label}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function PatternCard({ pattern, onApply, onDismiss }: { pattern: Pattern; onApply: () => void; onDismiss: () => void }) {
  return (
    <div className="rounded-lg bg-violet-500/[0.04] border border-violet-500/20 p-2.5 space-y-2">
      <div className="text-[11.5px] text-slate-200 leading-snug">{pattern.text}</div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9.5px] font-medium text-slate-500">janela: {WINDOW_LABEL[pattern.sourceWindow]}</span>
        <CardActions onApply={onApply} onDismiss={onDismiss} />
      </div>
    </div>
  )
}

function HypothesisCard({ hypothesis, onApply, onDismiss }: { hypothesis: Hypothesis; onApply: () => void; onDismiss: () => void }) {
  const visual = CONFIDENCE_VISUAL[hypothesis.confidence]
  return (
    <div className="rounded-lg bg-violet-500/[0.04] border border-violet-500/20 p-2.5 space-y-1.5">
      <div className="flex items-start gap-1.5 flex-wrap">
        <span className="text-[11.5px] font-semibold text-slate-100">{hypothesis.label}</span>
        {hypothesis.cid && (
          <span className="px-1 py-0.5 rounded bg-sky-500/15 text-sky-300 text-[9px] font-bold tracking-wide">
            CID-11 {hypothesis.cid}
          </span>
        )}
        <span className={`px-1 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${visual.cls}`}>
          {visual.label}
        </span>
      </div>
      <div className="text-[11px] text-slate-400 leading-snug">{hypothesis.rationale}</div>
      <div className="flex justify-end">
        <CardActions onApply={onApply} onDismiss={onDismiss} />
      </div>
    </div>
  )
}

function HomeworkCard({ homework, onApply, onDismiss }: { homework: HomeworkSuggestion; onApply: () => void; onDismiss: () => void }) {
  return (
    <div className="rounded-lg bg-violet-500/[0.04] border border-violet-500/20 p-2.5 space-y-1.5">
      <div className="text-[11.5px] font-medium text-slate-100 leading-snug">{homework.text}</div>
      <div className="text-[10.5px] italic text-slate-500 leading-snug">{homework.rationale}</div>
      <div className="flex justify-end">
        <CardActions onApply={onApply} onDismiss={onDismiss} />
      </div>
    </div>
  )
}

function CardActions({ onApply, onDismiss }: { onApply: () => void; onDismiss: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onDismiss}
        className="px-1.5 h-6 rounded-md bg-transparent hover:bg-slate-800 text-slate-500 hover:text-slate-300 text-[10px] font-medium flex items-center gap-0.5"
        title="Descartar"
      >
        <XIcon size={10} strokeWidth={2.4} />
        Descartar
      </button>
      <button
        type="button"
        onClick={onApply}
        className="px-2 h-6 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-semibold flex items-center gap-0.5"
        title="Aplicar"
      >
        <Plus size={10} strokeWidth={2.4} />
        Aplicar
      </button>
    </div>
  )
}

// =============================================================================
// Helpers
// =============================================================================

function hasMinimumContext(soap: SoapFields): boolean {
  return Boolean(
    (soap.subjetivo && soap.subjetivo.trim().length >= 10) ||
      (soap.objetivo && soap.objetivo.trim().length >= 10) ||
      (soap.avaliacao && soap.avaliacao.trim().length >= 10) ||
      (soap.plano && soap.plano.trim().length >= 10),
  )
}

function appendText(existing: string | undefined, addition: string): string {
  const base = (existing ?? '').trimEnd()
  if (!base) return addition
  return `${base}\n${addition}`
}

function patternKey(p: Pattern): string {
  return `pattern:${p.text.slice(0, 64)}`
}

function hypothesisKey(h: Hypothesis): string {
  return `hyp:${h.cid ?? 'nocid'}:${h.label}`
}

function homeworkKey(h: HomeworkSuggestion): string {
  return `hw:${h.text.slice(0, 64)}`
}

// =============================================================================
// Mock data generator — substitui chamada real do agente
// =============================================================================

/**
 * FASE 1: insight gerado APENAS a partir do SOAP draft.
 * Sem histórico longitudinal (scores/sessões anteriores/plano) — por isso
 * `patterns` fica sempre vazio nessa fase. Hipóteses e homework saem do
 * texto digitado pelo psi agora.
 */
function buildMockInsight(soap: SoapFields): InsightResult {
  const subj = (soap.subjetivo ?? '').toLowerCase()
  const obj = (soap.objetivo ?? '').toLowerCase()
  const all = subj + ' ' + obj
  const hasAnxiety = /ansied|medo|pânico|preocup/.test(subj)
  const hasDepressive = /trist|desmotiv|vazio|apatia|insônia|desesperan/.test(subj)
  const hasAvoidance = /evita|isolamento|sozinh/.test(all)

  const hypotheses: Hypothesis[] = []
  const homework: HomeworkSuggestion[] = []

  if (hasDepressive) {
    hypotheses.push({
      cid: '6A70',
      label: 'Considerar episódio depressivo',
      confidence: 'medium',
      rationale: 'Relato de anedonia, desmotivação e/ou insônia descrito no Subjetivo é compatível com sintomas depressivos. Aplicar PHQ-9 pra triagem.',
    })
    homework.push({
      text: 'Registrar 3 atividades prazerosas executadas por dia durante 7 dias.',
      rationale: 'Ativação comportamental como teste terapêutico inicial.',
    })
  }

  if (hasAnxiety) {
    hypotheses.push({
      cid: '6B00',
      label: 'Considerar transtorno de ansiedade',
      confidence: hasAvoidance ? 'medium' : 'low',
      rationale: 'Preocupação/medo relatados' + (hasAvoidance ? ' + sinais de evitação' : '') + '. Investigar contexto + aplicar GAD-7.',
    })
    homework.push({
      text: 'Respiração diafragmática 5 min, 2x/dia (manhã + antes de situação gatilho).',
      rationale: 'Reduz ativação simpática enquanto se mapeia gatilhos.',
    })
  }

  if (!hasAnxiety && !hasDepressive) {
    hypotheses.push({
      cid: null,
      label: 'Avaliação inicial em andamento',
      confidence: 'low',
      rationale: 'Conteúdo insuficiente pra hipótese clínica baseada só no SOAP atual. Sugerir aplicar PHQ-9 + GAD-7 como triagem.',
    })
    homework.push({
      text: 'Anotar contexto, intensidade (0-10) e duração dos sintomas durante a semana.',
      rationale: 'Coleta inicial pra estabelecer baseline antes da próxima sessão.',
    })
  }

  return { patterns: [], hypotheses, homework }
}

export default IaInsightsPanel
