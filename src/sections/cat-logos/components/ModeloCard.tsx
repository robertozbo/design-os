import type {
  IdiomaSuportado,
  ModeloAvaliacao,
} from '@/../product/sections/cat-logos/types'
import {
  Pencil,
  Archive,
  Copy,
  CalendarRange,
  Activity,
  Layers3,
  Play,
} from 'lucide-react'

interface ModeloCardProps {
  modelo: ModeloAvaliacao
  revealIndex?: number
  onUse?: () => void
  onEdit?: () => void
  onDuplicate?: () => void
  onArchive?: () => void
}

const IDIOMA_LABEL: Record<IdiomaSuportado, string> = {
  pt: 'PT',
  en: 'EN',
  es: 'ES',
}

export function ModeloCard({
  modelo,
  revealIndex = 0,
  onUse,
  onEdit,
  onDuplicate,
  onArchive,
}: ModeloCardProps) {
  const cobertura = modelo.metricasUso.coberturaMediaPct
  const coberturaTone =
    cobertura === 0
      ? 'text-slate-500 dark:text-slate-400'
      : cobertura >= modelo.coberturaMinimaPct
        ? 'text-teal-700 dark:text-teal-300'
        : 'text-amber-700 dark:text-amber-300'

  return (
    <div
      style={{ animationDelay: `${30 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        rounded-2xl bg-white/95 dark:bg-slate-900/70
        border border-slate-200/80 dark:border-slate-800
        p-5
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className="
                inline-flex items-center px-2 py-0.5 rounded-md
                bg-teal-50 dark:bg-teal-950/40
                ring-1 ring-teal-200/60 dark:ring-teal-900/60
                font-mono font-semibold tracking-wider
                text-[11px] text-teal-700 dark:text-teal-300
              "
            >
              {modelo.instrumentoSigla}
            </span>
            <div className="flex items-center gap-1">
              {modelo.idiomasHabilitados.map((id) => (
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
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {modelo.nome}
          </h3>
          <p className="mt-1 text-[12px] text-slate-600 dark:text-slate-400 leading-snug">
            {modelo.descricao}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Stat
          icon={<CalendarRange className="w-3 h-3" strokeWidth={1.75} />}
          label="Janela"
          value={`${modelo.janelaDias} dias`}
          mono
        />
        <Stat
          icon={<Activity className="w-3 h-3" strokeWidth={1.75} />}
          label="Cobertura mín"
          value={`${modelo.coberturaMinimaPct}%`}
        />
        <Stat
          icon={<Play className="w-3 h-3" strokeWidth={1.75} />}
          label="Aplicações"
          value={String(modelo.metricasUso.vezesAplicado)}
        />
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Layers3 className="w-3 h-3 text-slate-500" strokeWidth={1.75} />
          <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400">
            Escopo padrão
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {modelo.escopoPadrao.map((item) => (
            <span
              key={item}
              className="
                inline-flex items-center px-1.5 py-0.5 rounded-md
                bg-slate-100 dark:bg-slate-800/70
                ring-1 ring-slate-200/70 dark:ring-slate-700
                text-[10px] text-slate-600 dark:text-slate-400 font-medium
              "
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {modelo.metricasUso.vezesAplicado > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Cobertura média alcançada</span>
          <span className={`tabular-nums font-semibold ${coberturaTone}`}>
            {modelo.metricasUso.coberturaMediaPct}%
          </span>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onUse}
          className="
            flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
            bg-teal-600 hover:bg-teal-700 active:bg-teal-800
            dark:bg-teal-500 dark:hover:bg-teal-400
            text-white font-medium text-[12px]
            shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
            dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
            transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
          "
        >
          <Play className="w-3.5 h-3.5" strokeWidth={2} />
          Usar modelo
        </button>
        <SecondaryButton
          icon={<Copy className="w-3.5 h-3.5" strokeWidth={1.75} />}
          label="Duplicar"
          onClick={onDuplicate}
        />
        <SecondaryButton
          icon={<Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />}
          label="Editar"
          onClick={onEdit}
        />
        <SecondaryButton
          icon={<Archive className="w-3.5 h-3.5" strokeWidth={1.75} />}
          label="Arquivar"
          onClick={onArchive}
        />
      </div>
    </div>
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
    <div className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-3 py-2">
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

function SecondaryButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="
        inline-flex items-center justify-center w-9 h-9 rounded-xl
        bg-white/80 dark:bg-slate-900/40
        border border-slate-200 dark:border-slate-800
        hover:bg-slate-50 dark:hover:bg-slate-800/60
        text-slate-600 dark:text-slate-400
        transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
      "
    >
      {icon}
    </button>
  )
}
