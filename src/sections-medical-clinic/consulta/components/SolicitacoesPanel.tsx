import { FlaskConical, Pill, Share2 } from 'lucide-react'

export interface SolicItem {
  titulo: string
  sub?: string
  /** true = criado nesta consulta (ao vivo); false = de consultas anteriores. */
  nesta: boolean
}

interface Props {
  prescricoes: SolicItem[]
  exames: SolicItem[]
  encaminhamentos: SolicItem[]
}

export function SolicitacoesPanel({ prescricoes, exames, encaminhamentos }: Props) {
  const total = prescricoes.length + exames.length + encaminhamentos.length
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Solicitações do paciente
        </h2>
        <span className="text-[11px] text-slate-400">
          {total} no total · <span className="text-teal-600 dark:text-teal-400">nesta consulta em destaque</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Coluna icon={Pill} titulo="Prescrições" itens={prescricoes} vazio="Nenhuma prescrição." />
        <Coluna icon={FlaskConical} titulo="Exames" itens={exames} vazio="Nenhum exame." />
        <Coluna icon={Share2} titulo="Encaminhamentos" itens={encaminhamentos} vazio="Nenhum encaminhamento." />
      </div>
    </div>
  )
}

function Coluna({
  icon: Icon,
  titulo,
  itens,
  vazio,
}: {
  icon: typeof Pill
  titulo: string
  itens: SolicItem[]
  vazio: string
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
      <div className="mb-2 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{titulo}</span>
        <span className="ml-auto text-[10px] text-slate-400">{itens.length}</span>
      </div>
      {itens.length === 0 ? (
        <p className="text-[11px] text-slate-400">{vazio}</p>
      ) : (
        <ul className="space-y-1.5">
          {itens.map((it, i) => (
            <li
              key={`${it.titulo}-${i}`}
              className={`rounded-lg border px-2.5 py-1.5 ${
                it.nesta
                  ? 'border-teal-200 bg-teal-50/60 dark:border-teal-900/50 dark:bg-teal-950/30'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="truncate text-xs font-medium text-slate-800 dark:text-slate-100">
                  {it.titulo}
                </span>
                {it.nesta && (
                  <span className="ml-auto shrink-0 rounded-full bg-teal-500 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white">
                    nesta consulta
                  </span>
                )}
              </div>
              {it.sub && <div className="mt-0.5 truncate text-[10px] text-slate-400">{it.sub}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
