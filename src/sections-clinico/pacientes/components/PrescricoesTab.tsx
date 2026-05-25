import { ExternalLink, FileText, Pill, ShieldCheck } from 'lucide-react'
import type {
  MedicacaoAtiva,
  PrescricaoHistorico,
} from '@/../product-clinico/sections/pacientes/types'
import { formatDataBR, PRESCRICAO_STATUS_LABEL, PRESCRICAO_STATUS_STYLE } from './helpers'

interface Props {
  medicacaoAtiva: MedicacaoAtiva[]
  prescricoes: PrescricaoHistorico[]
  onAbrirMemed?: () => void
}

export function PrescricoesTab({ medicacaoAtiva, prescricoes, onAbrirMemed }: Props) {
  return (
    <div className="space-y-6">
      {/* Medicação ativa atual */}
      <section className="rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50/60 via-emerald-50/40 to-white p-5 shadow-sm dark:border-teal-900/40 dark:from-teal-950/30 dark:via-emerald-950/20 dark:to-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
              <Pill className="size-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Medicação ativa atual
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {medicacaoAtiva.length} medicações em uso
              </p>
            </div>
          </div>
          <button
            onClick={onAbrirMemed}
            className="
              inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm
              transition-colors hover:bg-teal-500
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
              dark:focus:ring-offset-slate-950
            "
          >
            <ExternalLink className="size-3.5" />
            Nova prescrição
          </button>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {medicacaoAtiva.map((m, i) => (
            <li
              key={i}
              className="rounded-lg border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {m.nome} <span className="text-xs font-normal text-slate-500">{m.dose}</span>
                </p>
              </div>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{m.posologia}</p>
              <p className="mt-1 text-[10px] text-slate-400">
                Em uso desde {formatDataBR(m.iniciadaEm)}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
          Memed · Validade ICP-Brasil
        </p>
      </section>

      {/* Histórico de prescrições */}
      <section>
        <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Histórico de prescrições
        </h3>
        {prescricoes.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center text-sm italic text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            Nenhuma prescrição emitida ainda.
          </div>
        ) : (
          <ul className="space-y-2">
            {prescricoes.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 size-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {formatDataBR(p.data)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        Validade até {formatDataBR(p.validade)} · Memed {p.memedId}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`
                      inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium
                      ${PRESCRICAO_STATUS_STYLE[p.status]}
                    `}
                  >
                    {PRESCRICAO_STATUS_LABEL[p.status]}
                  </span>
                </div>
                <ul className="mt-3 space-y-1">
                  {p.medicacoes.map((m, i) => (
                    <li
                      key={i}
                      className="rounded-md bg-slate-50/60 px-3 py-1.5 text-xs dark:bg-slate-800/40"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {m.nome}
                      </span>{' '}
                      <span className="text-slate-500">{m.dose}</span>
                      <span className="text-slate-500"> · {m.posologia}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
