import { ArrowDown, ArrowRight, ArrowUp, ClipboardCheck, GitCompare, Sparkles } from 'lucide-react'
import type {
  AchadoImagem,
  ComparacaoImagem,
  SignificanciaAchado,
} from '@/../product-clinico/sections/exames/types'
import { formatDataBR } from './helpers'

interface Props {
  indicacao: string
  achados: AchadoImagem[]
  comparacao: ComparacaoImagem | null
  onAbrirComparacao?: () => void
}

const SIG_STYLE: Record<SignificanciaAchado, string> = {
  normal:
    'border-emerald-200/70 bg-emerald-50/60 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300',
  atencao:
    'border-amber-200/70 bg-amber-50/60 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300',
  critico:
    'border-rose-200/70 bg-rose-50/60 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300',
}

const SIG_LABEL: Record<SignificanciaAchado, string> = {
  normal: 'Normal',
  atencao: 'Atenção',
  critico: 'Crítico',
}

export function AchadosImagemPanel({
  indicacao,
  achados,
  comparacao,
  onAbrirComparacao,
}: Props) {
  return (
    <div className="space-y-3">
      {/* Indicação */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <ClipboardCheck className="size-3" />
          Indicação clínica
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
          {indicacao}
        </p>
      </section>

      {/* Achados estruturados */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Sparkles className="size-3 text-teal-600 dark:text-teal-400" />
            Achados estruturados
          </p>
          <span className="text-[9px] font-mono text-slate-400">{achados.length}</span>
        </div>
        <ul className="mt-3 space-y-1.5">
          {achados.map((a, i) => (
            <li
              key={i}
              className={`
                flex items-start gap-2 rounded-lg border px-2.5 py-2 text-[11px] leading-snug
                ${SIG_STYLE[a.significancia]}
              `}
            >
              <SignificanciaDot tipo={a.significancia} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{a.texto}</p>
                {a.medida && (
                  <p className="mt-0.5 font-mono text-[10px] opacity-80">{a.medida}</p>
                )}
              </div>
              <span className="shrink-0 text-[9px] font-medium uppercase tracking-wider opacity-70">
                {SIG_LABEL[a.significancia]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Comparação histórica */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <GitCompare className="size-3" />
          Comparação com prévio
        </p>
        {comparacao ? (
          <button
            onClick={onAbrirComparacao}
            className="
              mt-3 flex w-full items-center gap-3 rounded-lg border border-slate-200/80 bg-slate-50/40 p-3 text-left transition-colors
              hover:border-teal-300 hover:bg-teal-50/40
              dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-teal-700 dark:hover:bg-teal-950/20
            "
          >
            <DeltaIcon delta={comparacao.delta} />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-slate-900 dark:text-slate-100">
                {comparacao.resumo}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                vs. exame de {formatDataBR(comparacao.dataAnterior)}
              </p>
            </div>
            <ArrowRight className="size-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
          </button>
        ) : (
          <div className="mt-3 rounded-lg bg-slate-50/60 p-3 text-[11px] italic text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
            Primeiro exame deste tipo no histórico — sem prévio pra comparar.
          </div>
        )}
      </section>
    </div>
  )
}

function SignificanciaDot({ tipo }: { tipo: SignificanciaAchado }) {
  const color =
    tipo === 'critico' ? 'bg-rose-500' : tipo === 'atencao' ? 'bg-amber-500' : 'bg-emerald-500'
  return <span className={`mt-1 size-1.5 shrink-0 rounded-full ${color}`} />
}

function DeltaIcon({ delta }: { delta: ComparacaoImagem['delta'] }) {
  const map = {
    estavel: { Icon: ArrowRight, color: 'text-slate-500' },
    progressao: { Icon: ArrowUp, color: 'text-rose-600 dark:text-rose-400' },
    regressao: { Icon: ArrowDown, color: 'text-emerald-600 dark:text-emerald-400' },
    novo: { Icon: Sparkles, color: 'text-amber-600 dark:text-amber-400' },
  } as const
  const { Icon, color } = map[delta]
  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 ${color}`}
    >
      <Icon className="size-4" />
    </span>
  )
}
