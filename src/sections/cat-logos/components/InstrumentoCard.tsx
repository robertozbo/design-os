import type {
  IdiomaSuportado,
  Instrumento,
  Maturidade,
} from '@/../product/sections/cat-logos/types'
import { ChevronRight, Clock, Layers, AlertTriangle, FlaskConical } from 'lucide-react'

interface InstrumentoCardProps {
  instrumento: Instrumento
  revealIndex?: number
  onPreview?: () => void
}

const NUM = new Intl.NumberFormat('pt-BR')

const MATURIDADE_TONE: Record<
  Maturidade,
  { label: string; pill: string; helper: string }
> = {
  baixa: {
    label: 'Maturidade baixa',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50',
    helper: 'Adequado para empregadores em início de jornada NR-1.',
  },
  media: {
    label: 'Maturidade média',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
    helper: 'Recomenda treinamento prévio das lideranças do empregador.',
  },
  alta: {
    label: 'Maturidade alta',
    pill: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/50',
    helper: 'Aplicar somente em empregadores com cultura de feedback estabelecida.',
  },
}

const IDIOMA_LABEL: Record<IdiomaSuportado, string> = {
  pt: 'PT',
  en: 'EN',
  es: 'ES',
}

export function InstrumentoCard({
  instrumento,
  revealIndex = 0,
  onPreview,
}: InstrumentoCardProps) {
  const tone = MATURIDADE_TONE[instrumento.maturidadeNecessaria]

  return (
    <button
      type="button"
      onClick={onPreview}
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
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
      "
    >
      <div className="flex items-start gap-4">
        <div
          className="
            shrink-0 rounded-xl px-3 py-2
            bg-teal-50 dark:bg-teal-950/40
            ring-1 ring-teal-200/60 dark:ring-teal-900/60
            font-mono font-semibold tracking-wider
            text-teal-700 dark:text-teal-300
            text-[15px]
          "
        >
          {instrumento.sigla}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {instrumento.nome}
          </h3>
          <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
            {instrumento.origem}
          </p>
        </div>
        <ChevronRight
          className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
          strokeWidth={1.75}
        />
      </div>

      <p className="mt-3 text-[12px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
        {instrumento.validacao}
      </p>

      <div className="mt-3 grid grid-cols-3 gap-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-3.5 py-3">
        <Stat
          icon={<Layers className="w-3 h-3" strokeWidth={1.75} />}
          label="Fatores"
          value={NUM.format(instrumento.fatores)}
        />
        <Stat
          icon={<FlaskConical className="w-3 h-3" strokeWidth={1.75} />}
          label="Perguntas"
          value={NUM.format(instrumento.perguntas)}
        />
        <Stat
          icon={<Clock className="w-3 h-3" strokeWidth={1.75} />}
          label="Tempo"
          value={`${instrumento.tempoMedioMin} min`}
          mono
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          {instrumento.idiomasSuportados.map((id) => (
            <span
              key={id}
              className="
                inline-flex items-center justify-center w-7 h-5 rounded-md ring-1
                bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400
                ring-slate-200/60 dark:ring-slate-700
                text-[10px] font-mono font-semibold tracking-wider
              "
            >
              {IDIOMA_LABEL[id]}
            </span>
          ))}
        </div>
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ring-1 text-[10px] font-medium ${tone.pill}`}
          title={tone.helper}
        >
          {instrumento.maturidadeNecessaria === 'alta' && (
            <AlertTriangle className="w-3 h-3" strokeWidth={2} />
          )}
          {tone.label}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>
          Aplicado em <span className="tabular-nums font-semibold text-slate-700 dark:text-slate-300">{instrumento.uso.empregadores}</span>{' '}
          empregadores
        </span>
        <span>
          <span className="tabular-nums font-semibold text-slate-700 dark:text-slate-300">{instrumento.uso.avaliacoes}</span>{' '}
          avaliações
        </span>
      </div>
    </button>
  )
}

function Stat({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </span>
      <p
        className={`mt-0.5 text-[14px] font-semibold tracking-tight tabular-nums text-slate-900 dark:text-slate-50 ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value}
      </p>
    </div>
  )
}
