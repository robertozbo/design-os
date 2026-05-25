import {
  X,
  ShieldCheck,
  EyeOff,
  Microscope,
  Users,
  TrendingUp,
} from 'lucide-react'
import type {
  DrillDownFator,
  PerguntaInstrumento,
  DistribuicaoRespostaItem,
  ClassificacaoRisco,
} from '@/../product/sections/avalia-es-de-risco/types'
import { REGRA_TRES_RESPONDENTES } from '@/../product/sections/avalia-es-de-risco/types'

interface Props {
  open: boolean
  setor: string | null
  fator: string | null
  score: number | null
  classificacao: ClassificacaoRisco | null
  drillDown: DrillDownFator | null
  onClose: () => void
}

const CLASSIFICACAO_PILL: Record<ClassificacaoRisco, { label: string; pill: string }> = {
  baixo: {
    label: 'Baixo',
    pill: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 ring-emerald-200/60 dark:ring-emerald-900/40',
  },
  moderado: {
    label: 'Moderado',
    pill: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200 ring-amber-200/60 dark:ring-amber-900/40',
  },
  critico: {
    label: 'Crítico',
    pill: 'bg-orange-200 text-orange-900 dark:bg-orange-950/60 dark:text-orange-100 ring-orange-300/60 dark:ring-orange-900/40',
  },
  prioritario: {
    label: 'Prioritário',
    pill: 'bg-rose-200 text-rose-900 dark:bg-rose-950/60 dark:text-rose-100 ring-rose-300/60 dark:ring-rose-900/40',
  },
}

const TOM_BAR: Record<DistribuicaoRespostaItem['tom'], string> = {
  positivo: 'bg-emerald-400 dark:bg-emerald-500/80',
  neutro: 'bg-slate-300 dark:bg-slate-600',
  negativo: 'bg-rose-400 dark:bg-rose-500/80',
}

export function FatorDrillDown({
  open,
  setor,
  fator,
  score,
  classificacao,
  drillDown,
  onClose,
}: Props) {
  if (!open || !setor || !fator) return null

  const insufficientSample =
    drillDown && drillDown.perguntas.some((p) => p.totalRespondentes < REGRA_TRES_RESPONDENTES)
  const hasData = drillDown && drillDown.perguntas.length > 0 && !insufficientSample

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={`Drill-down do fator ${fator} no setor ${setor}`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar drawer"
        className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-sm"
      />

      <aside className="relative w-full max-w-2xl bg-slate-50 dark:bg-slate-950 shadow-2xl flex flex-col">
        <header className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-1">
                Drill-down · transparência metodológica
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50 tracking-tight truncate">
                {fator}
              </h2>
              <p className="mt-0.5 text-[12px] text-slate-600 dark:text-slate-400 truncate">
                Setor · <span className="font-medium text-slate-700 dark:text-slate-300">{setor}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center shrink-0 transition"
            >
              <X className="w-4 h-4 text-slate-500 dark:text-slate-400" strokeWidth={2} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {classificacao && (
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ring-1 text-[11px] font-semibold ${CLASSIFICACAO_PILL[classificacao].pill}`}
              >
                {CLASSIFICACAO_PILL[classificacao].label}
              </span>
            )}
            {score !== null && (
              <span className="inline-flex items-center gap-1 text-[12px] text-slate-600 dark:text-slate-400">
                <TrendingUp className="w-3 h-3" strokeWidth={2} />
                <span className="font-mono tabular-nums font-semibold">{score.toFixed(1)}</span>
                <span className="text-slate-500">/ 10</span>
              </span>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {!drillDown && (
            <EmptyState
              icon={<Microscope className="w-5 h-5" strokeWidth={1.75} />}
              title="Sem detalhamento disponível"
              description="As perguntas que compõem este fator ainda não foram mapeadas. Verifique a configuração do instrumento."
            />
          )}

          {insufficientSample && (
            <EmptyState
              tone="amber"
              icon={<EyeOff className="w-5 h-5" strokeWidth={1.75} />}
              title={`Mínimo de ${REGRA_TRES_RESPONDENTES} respondentes para preservar anonimato`}
              description="Este recorte tem menos respondentes do que o limite anti re-identificação. A distribuição de respostas não pode ser exibida — escolha um setor com mais respondentes ou consulte o agregado geral."
            />
          )}

          {hasData && (
            <>
              <div className="rounded-xl bg-teal-50/60 dark:bg-teal-950/30 ring-1 ring-teal-200/50 dark:ring-teal-900/40 px-4 py-3 flex items-start gap-2.5">
                <ShieldCheck
                  className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0"
                  strokeWidth={2}
                />
                <p className="text-[12px] text-teal-900 dark:text-teal-200 leading-relaxed">
                  <strong className="font-semibold">{drillDown.fator}.</strong>{' '}
                  <span className="text-teal-800 dark:text-teal-300">{drillDown.descricao}</span>
                </p>
              </div>

              <section>
                <header className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                    Perguntas que compõem o fator
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-500 font-mono tabular-nums">
                    {drillDown.perguntas.length} perguntas
                  </span>
                </header>

                <div className="space-y-4">
                  {drillDown.perguntas.map((p) => (
                    <PerguntaCard key={p.codigo} pergunta={p} />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        <footer className="px-6 py-3 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60">
          <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-relaxed">
            <ShieldCheck className="inline w-3 h-3 -mt-0.5 mr-1" strokeWidth={2} />
            Distribuições agregadas. Respostas individuais nunca são exibidas. Recortes com menos de{' '}
            {REGRA_TRES_RESPONDENTES} respondentes são ocultados.
          </p>
        </footer>
      </aside>
    </div>
  )
}

function PerguntaCard({ pergunta }: { pergunta: PerguntaInstrumento }) {
  return (
    <article className="rounded-2xl bg-white dark:bg-slate-900/60 ring-1 ring-slate-200/80 dark:ring-slate-800/80 p-4">
      <header className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-500 tracking-wider">
              {pergunta.codigo}
            </span>
            <span className="text-[10px] uppercase tracking-[0.12em] font-medium text-slate-500 dark:text-slate-400">
              {pergunta.subescala}
            </span>
          </div>
          <p className="text-[13px] text-slate-800 dark:text-slate-100 leading-snug font-medium">
            {pergunta.texto}
          </p>
        </div>
        <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-500 shrink-0">
          <Users className="w-3 h-3" strokeWidth={2} />
          <span className="font-mono tabular-nums">{pergunta.totalRespondentes}</span>
        </div>
      </header>

      <div className="space-y-1.5">
        {pergunta.distribuicao.map((d) => (
          <div key={d.rotulo} className="flex items-center gap-2.5">
            <span className="text-[11px] text-slate-600 dark:text-slate-400 w-24 sm:w-32 shrink-0 truncate">
              {d.rotulo}
            </span>
            <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${TOM_BAR[d.tom]}`}
                style={{ width: `${d.percentual}%` }}
              />
            </div>
            <span className="text-[11px] font-mono tabular-nums text-slate-700 dark:text-slate-300 w-10 text-right">
              {d.percentual}%
            </span>
          </div>
        ))}
      </div>
    </article>
  )
}

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  tone?: 'slate' | 'amber'
}

function EmptyState({ icon, title, description, tone = 'slate' }: EmptyStateProps) {
  const toneClasses =
    tone === 'amber'
      ? 'bg-amber-50/60 dark:bg-amber-950/30 ring-amber-200/60 dark:ring-amber-900/40 text-amber-900 dark:text-amber-200'
      : 'bg-slate-100/60 dark:bg-slate-900/40 ring-slate-200/80 dark:ring-slate-800/60 text-slate-700 dark:text-slate-300'
  return (
    <div className={`rounded-2xl ring-1 ${toneClasses} px-5 py-6 text-center`}>
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/60 dark:bg-slate-900/40 mb-3">
        {icon}
      </div>
      <h4 className="text-sm font-semibold mb-1.5">{title}</h4>
      <p className="text-[12px] opacity-80 max-w-md mx-auto leading-relaxed">{description}</p>
    </div>
  )
}
