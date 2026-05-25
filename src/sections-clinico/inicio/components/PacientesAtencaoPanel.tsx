import { FlaskConical, MessageCircle, CalendarClock, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react'
import type {
  PacienteAtencao,
  TipoAtencao,
} from '@/../product-clinico/sections/inicio/types'
import { ATENCAO_LABEL, ATENCAO_STYLE, PRIORIDADE_DOT } from './helpers'

interface Props {
  pacientes: PacienteAtencao[]
  onAbrir?: (id: string) => void
}

const TIPO_ICON: Record<TipoAtencao, typeof FlaskConical> = {
  'exame-novo': FlaskConical,
  'mensagem-clinica': MessageCircle,
  'retorno-atrasado': CalendarClock,
  'adesao-critica': AlertTriangle,
}

export function PacientesAtencaoPanel({ pacientes, onAbrir }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3 dark:border-slate-800">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Precisam atenção
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pendências priorizadas
          </p>
        </div>
        <span className="rounded-full bg-rose-500 px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums text-white">
          {pacientes.length}
        </span>
      </header>

      {pacientes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <CheckCircle2 className="size-8 text-teal-500" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Tudo em dia
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sem pendências por agora 🎉
          </p>
        </div>
      ) : (
        <ul className="space-y-2 p-3">
          {pacientes.map((p) => {
            const Icon = TIPO_ICON[p.tipo]
            const style = ATENCAO_STYLE[p.tipo]
            return (
              <li key={p.id}>
                <button
                  onClick={() => onAbrir?.(p.id)}
                  className={`
                    group/atc flex w-full items-start gap-3 rounded-xl border p-3 text-left
                    transition-all hover:shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-teal-500/40
                    ${style.border} ${style.bg}
                  `}
                >
                  <span
                    className={`
                      mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg
                      ${style.iconBg} ${style.iconText}
                    `}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`size-1.5 rounded-full ${PRIORIDADE_DOT[p.prioridade]}`}
                        title={`Prioridade ${p.prioridade}`}
                      />
                      <p className={`text-[10px] font-semibold uppercase tracking-wider ${style.iconText}`}>
                        {ATENCAO_LABEL[p.tipo]}
                      </p>
                    </div>
                    <p className={`mt-0.5 text-sm font-medium ${style.text}`}>
                      {p.pacienteNome}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                      {p.contexto}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">{p.criadoHa}</p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-slate-300 transition-colors group-hover/atc:text-slate-500 dark:text-slate-600" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
