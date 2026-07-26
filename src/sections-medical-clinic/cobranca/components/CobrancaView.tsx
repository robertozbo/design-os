import { useMemo, useState } from 'react'
import {
  Banknote,
  CreditCard,
  Download,
  Plus,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react'
import type {
  Cobranca,
  CobrancaData,
  FiltroStatus,
  FormaPgto,
} from '@/../product-medical-clinic/sections/cobranca/types'
import {
  BADGE_COR,
  FORMA_LABEL,
  STATUS_META,
  brl,
  dataCurta,
} from './helpers'

const FILTROS: { value: FiltroStatus; label: string }[] = [
  { value: 'todos', label: 'Todas' },
  { value: 'pendente', label: 'Pendentes' },
  { value: 'pago', label: 'Pagas' },
  { value: 'estornado', label: 'Estornadas' },
]

const FORMA_ICON: Record<FormaPgto, typeof QrCode> = {
  pix: QrCode,
  cartao: CreditCard,
  dinheiro: Banknote,
  convenio: ShieldCheck,
}

interface Props {
  dados: CobrancaData
  onNova: () => void
  onExportar: () => void
  onCobranca: (c: Cobranca) => void
}

export function CobrancaView({ dados, onNova, onExportar, onCobranca }: Props) {
  const [filtro, setFiltro] = useState<FiltroStatus>('todos')
  const [novaAberta, setNovaAberta] = useState(false)

  const cobrancas = useMemo(
    () => (filtro === 'todos' ? dados.cobrancas : dados.cobrancas.filter((c) => c.status === filtro)),
    [dados.cobrancas, filtro],
  )

  // Abrir o formulário não gera link — o toast de "link gerado" era afirmação de algo que
  // ainda não aconteceu. Quem avisa é o envio, não a abertura.
  const abrirNova = () => setNovaAberta(true)

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Cobrança</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{dados.clinica}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExportar}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" /> Exportar CSV
          </button>
          <button
            onClick={abrirNova}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
          >
            <Plus className="h-4 w-4" /> Nova cobrança
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {dados.kpis.map((k) => (
          <div
            key={k.id}
            className={`rounded-2xl border p-4 ${
              k.destaque
                ? 'border-teal-500 bg-teal-50/50 dark:border-teal-600 dark:bg-teal-950/20'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="text-[11px] uppercase tracking-wide text-slate-400">{k.label}</div>
            <div
              className={`mt-1 text-lg font-semibold ${
                k.destaque ? 'text-teal-700 dark:text-teal-300' : 'text-slate-900 dark:text-slate-50'
              }`}
            >
              {k.contagem ? k.valor : brl(k.valor)}
            </div>
          </div>
        ))}
      </div>

      {/* Nova cobrança (painel inline mock) */}
      {novaAberta && (
        <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50/40 p-4 dark:border-teal-900/60 dark:bg-teal-950/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
              Nova cobrança
            </h2>
            <button
              onClick={() => setNovaAberta(false)}
              className="rounded-md p-1 text-slate-400 hover:bg-white hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Paciente
              <input
                placeholder="Buscar paciente…"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Médico
              <input
                placeholder="Selecionar médico…"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Valor (R$)
              <input
                placeholder="0,00"
                inputMode="numeric"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Forma
              <select className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <option value="pix">PIX</option>
                <option value="cartao">Cartão</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="convenio">Convênio</option>
              </select>
            </label>
          </div>
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              onClick={() => setNovaAberta(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setNovaAberta(false)
                onNova()
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            >
              <QrCode className="h-3.5 w-3.5" /> Gerar link
            </button>
          </div>
        </div>
      )}

      {/* Cobranças */}
      <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Cobranças
          </h2>
          <div className="flex items-center gap-1">
            {FILTROS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFiltro(f.value)}
                className={`rounded-lg px-2 py-1 text-[11px] font-medium transition-colors ${
                  filtro === f.value
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {cobrancas.map((c) => {
            const FormaIcon = FORMA_ICON[c.forma]
            return (
              <li key={c.id}>
                <button
                  onClick={() => onCobranca(c)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-400 text-[10px] font-semibold text-white">
                    {c.pacienteIniciais}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                      {c.pacienteNome}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className={`rounded px-1 py-0.5 font-medium ${BADGE_COR[c.cor]}`}>
                        {c.especialidade}
                      </span>
                      <span className="truncate">{c.medico}</span>
                    </div>
                  </div>
                  <span className="hidden shrink-0 items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 sm:flex">
                    <FormaIcon className="h-3.5 w-3.5" />
                    {FORMA_LABEL[c.forma]}
                    {c.convenio ? ` · ${c.convenio}` : ''}
                  </span>
                  <span className="hidden shrink-0 text-[10px] text-slate-400 sm:inline">
                    {dataCurta(c.data)}
                  </span>
                  <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                    {brl(c.valor)}
                  </span>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium ${STATUS_META[c.status].badge}`}>
                    {STATUS_META[c.status].label}
                  </span>
                </button>
              </li>
            )
          })}
          {cobrancas.length === 0 && (
            <li className="px-4 py-8 text-center text-xs text-slate-400">
              Nenhuma cobrança nesse filtro.
            </li>
          )}
        </ul>
        <p className="border-t border-slate-100 px-4 py-2 text-[10px] text-slate-400 dark:border-slate-800">
          Convênio = tracking textual (V1). TUSS/SADT e glosa entram no V2.
        </p>
      </div>
    </div>
  )
}
