import { ArrowRight, RefreshCw } from 'lucide-react'
import type { PrescricaoListItem } from '@/../product-clinico/sections/prescricao/types'
import {
  CLASSE_CHIP,
  ORIGEM_LABEL_CURTA,
  STATUS_BADGE_CLASS,
  STATUS_LABEL,
  VALIDADE_TONE_CLASS,
  describeValidade,
  formatDataCurta,
} from './helpers'

interface PrescricaoRowProps {
  prescricao: PrescricaoListItem
  highlightRenovar?: boolean
  onAbrir?: () => void
  onRenovar?: () => void
}

export function PrescricaoRow({
  prescricao,
  highlightRenovar = false,
  onAbrir,
  onRenovar,
}: PrescricaoRowProps) {
  const validade = describeValidade(prescricao.diasAteVencer, prescricao.status)
  const cancelada = prescricao.status === 'cancelada'
  const expirada = prescricao.status === 'expirada'
  const meds = prescricao.medicamentosResumo
  const restantes = Math.max(0, prescricao.totalItens - 2)
  const showInlineRenovar = highlightRenovar && prescricao.precisaRenovar

  return (
    <li>
      <div
        className={`
          group/rxr flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-all
          hover:border-teal-300 hover:shadow
          dark:bg-slate-900 dark:hover:border-teal-700
          ${
            cancelada
              ? 'border-rose-200/60 dark:border-rose-900/30'
              : prescricao.precisaRenovar
                ? 'border-amber-200/70 dark:border-amber-900/40'
                : 'border-slate-200/80 dark:border-slate-800'
          }
        `}
      >
        <button
          onClick={onAbrir}
          className="flex min-w-0 flex-1 items-center gap-4 text-left focus:outline-none focus:ring-2 focus:ring-teal-500/40 rounded-xl"
        >
          {/* Avatar */}
          <div
            className={`
              flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white shadow-sm
              ${
                cancelada
                  ? 'bg-gradient-to-br from-rose-400 to-rose-600'
                  : 'bg-gradient-to-br from-teal-500 to-emerald-600'
              }
            `}
          >
            {prescricao.iniciais}
          </div>

          {/* Paciente + meds */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                {prescricao.pacienteNome}
              </p>
              <span
                className={`
                  inline-flex shrink-0 items-center rounded-full border px-1.5 py-0 text-[10px] font-medium
                  ${STATUS_BADGE_CLASS[prescricao.status]}
                `}
              >
                {STATUS_LABEL[prescricao.status]}
              </span>
            </div>

            {/* Meds chips */}
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              {meds.slice(0, 2).map((m, i) => (
                <span
                  key={i}
                  className={`
                    inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium
                    ${CLASSE_CHIP[m.classe]}
                    ${cancelada ? 'opacity-60 line-through' : ''}
                  `}
                >
                  {m.nome}
                </span>
              ))}
              {restantes > 0 && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  +{restantes}
                </span>
              )}
            </div>

            {/* Meta */}
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span>emitida {formatDataCurta(prescricao.dataEmissao)}</span>
              <span aria-hidden="true">·</span>
              <span className={VALIDADE_TONE_CLASS[validade.tone]}>{validade.texto}</span>
              <span aria-hidden="true">·</span>
              <span className="lowercase">{ORIGEM_LABEL_CURTA[prescricao.origem]}</span>
              {prescricao.condicoesCronicas[0] && !expirada && !cancelada && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {prescricao.condicoesCronicas[0]}
                  </span>
                </>
              )}
            </p>
          </div>
        </button>

        {/* Ação inline */}
        {showInlineRenovar ? (
          <button
            onClick={onRenovar}
            className="
              inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors
              hover:bg-amber-400
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
            "
          >
            <RefreshCw className="size-3.5" />
            Renovar
          </button>
        ) : (
          <ArrowRight
            className="size-4 shrink-0 text-slate-300 transition-colors group-hover/rxr:text-teal-500 dark:text-slate-600"
            aria-hidden
          />
        )}
      </div>
    </li>
  )
}
