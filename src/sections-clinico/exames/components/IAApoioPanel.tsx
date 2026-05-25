import { Sparkles, ShieldAlert, FileText, TrendingUp, MessageSquare, Pill } from 'lucide-react'
import type { IAAnalise, IABloco, IABlocoTipo } from '@/../product-clinico/sections/exames/types'
import { IA_BLOCO_STYLE } from './helpers'
import { RichText } from './RichText'

interface Props {
  analise: IAAnalise
  onAbrirAuditIA?: () => void
}

const ICON: Record<IABlocoTipo, typeof FileText> = {
  'resumo-laudo': FileText,
  'comparacao-historica': TrendingUp,
  'cruzamento-queixa': MessageSquare,
  'cruzamento-medicacao': Pill,
}

export function IAApoioPanel({ analise, onAbrirAuditIA }: Props) {
  const geradoEm = new Date(analise.geradoEm).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-b from-emerald-50/40 via-white to-white shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900">
      <header className="flex items-center justify-between gap-2 border-b border-emerald-200/60 bg-emerald-50/40 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Sparkles className="size-3.5" />
          </span>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800 dark:text-emerald-300">
              Apoio à interpretação · IA
            </h2>
            <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
              {analise.modeloIA} · gerado {geradoEm}
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-3 p-4">
        {analise.blocos.map((b) => (
          <BlocoCard key={b.tipo} bloco={b} />
        ))}
      </div>

      {/* Disclaimer */}
      <footer className="flex items-start gap-2 border-t border-emerald-200/60 bg-emerald-50/30 px-4 py-3 text-[11px] leading-relaxed text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200">
        <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-emerald-700 dark:text-emerald-400" />
        <div>
          <p>
            <strong className="font-semibold">Esta análise é uma sugestão de IA.</strong> Decisão
            clínica é sua. A IA não faz laudo nem substitui interpretação médica.
          </p>
          <button
            onClick={onAbrirAuditIA}
            className="mt-1 text-[11px] font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-300"
          >
            Ver log de auditoria (LGPD)
          </button>
        </div>
      </footer>
    </section>
  )
}

function BlocoCard({ bloco }: { bloco: IABloco }) {
  const Icon = ICON[bloco.tipo]
  const style = IA_BLOCO_STYLE[bloco.tipo]
  return (
    <article
      className={`
        rounded-xl border-l-4 ${style.accent}
        border border-y-slate-200/60 border-r-slate-200/60 bg-white p-3 shadow-sm
        dark:border-y-slate-800 dark:border-r-slate-800 dark:bg-slate-900
      `}
    >
      <header className="flex items-start gap-2">
        <span
          className={`
            mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md
            ${style.iconBg} ${style.iconText}
          `}
        >
          <Icon className="size-3.5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {bloco.titulo}
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{bloco.fonte}</p>
        </div>
      </header>
      <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
        <RichText texto={bloco.conteudo} />
      </p>
    </article>
  )
}
