import { Download, FileText, Mail, Plus, Search } from 'lucide-react'
import type {
  FiltroTipo,
  MedicoRef,
  Relatorio,
} from '@/../product-clinic/sections/relatorios-medicos/types'
import { STATUS_META, TIPO_CHIP, TIPO_LABEL, dataCurta } from './helpers'

interface Props {
  clinica: string
  medico: MedicoRef
  relatorios: Relatorio[]
  busca: string
  filtro: FiltroTipo
  onBusca: (v: string) => void
  onFiltro: (f: FiltroTipo) => void
  onNovo: () => void
  onAbrir: (r: Relatorio) => void
  onPdf: (r: Relatorio) => void
  onEnviar: (r: Relatorio) => void
}

const FILTROS: { valor: FiltroTipo; label: string }[] = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'relatorio-medico', label: 'Relatório médico' },
  { valor: 'atestado', label: 'Atestado' },
  { valor: 'laudo', label: 'Laudo' },
  { valor: 'declaracao', label: 'Declaração' },
  { valor: 'evolucao', label: 'Evolução' },
]

export function RelatoriosMedicosView({
  clinica,
  medico,
  relatorios,
  busca,
  filtro,
  onBusca,
  onFiltro,
  onNovo,
  onAbrir,
  onPdf,
  onEnviar,
}: Props) {
  const termo = busca.trim().toLowerCase()
  const lista = relatorios
    .filter((r) => (filtro === 'todos' ? true : r.tipo === filtro))
    .filter(
      (r) =>
        termo.length === 0 ||
        r.paciente.nome.toLowerCase().includes(termo) ||
        r.numero.toLowerCase().includes(termo) ||
        r.motivo.toLowerCase().includes(termo),
    )
    .sort((a, b) => b.consultaData.localeCompare(a.consultaData))

  const enviados = relatorios.filter((r) => r.status === 'enviado').length
  const rascunhos = relatorios.filter((r) => r.status === 'rascunho').length

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Relatórios</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {medico.nome} · {medico.crm} · {clinica}
          </p>
        </div>
        <button
          onClick={onNovo}
          className="inline-flex items-center gap-1.5 self-start rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
        >
          <Plus className="h-4 w-4" /> Novo relatório
        </button>
      </div>

      {/* Resumo */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <Kpi label="Documentos" valor={relatorios.length} />
        <Kpi label="Enviados" valor={enviados} tom="emerald" />
        <Kpi label="Rascunhos" valor={rascunhos} tom="slate" />
      </div>

      {/* Busca + filtros */}
      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => onBusca(e.target.value)}
            placeholder="Paciente, número ou motivo…"
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              onClick={() => onFiltro(f.valor)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                filtro === f.valor
                  ? 'bg-teal-500 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="mt-4 space-y-2">
        {lista.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400 dark:border-slate-700">
            Nenhum documento com esse filtro.
          </div>
        ) : (
          lista.map((r) => (
            <RelatorioLinha
              key={r.id}
              relatorio={r}
              onAbrir={() => onAbrir(r)}
              onPdf={() => onPdf(r)}
              onEnviar={() => onEnviar(r)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function Kpi({ label, valor, tom = 'teal' }: { label: string; valor: number; tom?: string }) {
  const cor =
    tom === 'emerald'
      ? 'text-emerald-600 dark:text-emerald-400'
      : tom === 'slate'
        ? 'text-slate-600 dark:text-slate-300'
        : 'text-teal-600 dark:text-teal-400'
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
      <div className={`text-2xl font-semibold tabular-nums ${cor}`}>{valor}</div>
      <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  )
}

function RelatorioLinha({
  relatorio: r,
  onAbrir,
  onPdf,
  onEnviar,
}: {
  relatorio: Relatorio
  onAbrir: () => void
  onPdf: () => void
  onEnviar: () => void
}) {
  const status = STATUS_META[r.status]

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 transition-colors hover:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-500 sm:flex-row sm:items-center">
      <button onClick={onAbrir} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <FileText className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              {r.paciente.nome}
            </span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${TIPO_CHIP[r.tipo]}`}
            >
              {TIPO_LABEL[r.tipo]}
            </span>
          </div>
          <div className="mt-0.5 truncate text-[11px] text-slate-400">
            {r.numero} · consulta em {dataCurta(r.consultaData)} · {r.motivo}
          </div>
        </div>
      </button>

      <div className="flex items-center gap-1.5 sm:shrink-0">
        <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${status.chip}`}>
          {status.label}
        </span>
        <button
          onClick={onPdf}
          title="Baixar PDF"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Download className="h-3.5 w-3.5" /> PDF
        </button>
        <button
          onClick={onEnviar}
          title="Enviar por e-mail"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Mail className="h-3.5 w-3.5" /> E-mail
        </button>
      </div>
    </div>
  )
}
