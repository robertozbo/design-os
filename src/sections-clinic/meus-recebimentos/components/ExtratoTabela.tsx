import { useState } from 'react'
import { Clock, Hourglass } from 'lucide-react'
import type {
  FiltroExtrato,
  LinhaExtrato,
} from '@/../product-clinic/sections/meus-recebimentos/types'
import { STATUS_META, brl, corFonte } from './helpers'

interface Props {
  extrato: LinhaExtrato[]
  filtro: FiltroExtrato
  onFiltro: (f: FiltroExtrato) => void
}

const FILTROS: { valor: FiltroExtrato; label: string }[] = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'liberado', label: 'Liberado' },
  { valor: 'aguardando', label: 'Aguardando' },
  { valor: 'glosado', label: 'Glosado' },
]

/** Uma competência tem dezenas de atendimentos; a página inteira não pode virar tabela. */
const PAGINA = 20

export function ExtratoTabela({ extrato, filtro, onFiltro }: Props) {
  const [tudo, setTudo] = useState(false)
  const lista = extrato.filter((l) => (filtro === 'todos' ? true : l.status === filtro))
  const total = lista.reduce((s, l) => s + l.valorRepasse, 0)
  const visiveis = tudo ? lista : lista.slice(0, PAGINA)

  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Extrato de atendimentos
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {visiveis.length} de {lista.length} atendimentos ·{' '}
            <span className="tabular-nums">{brl(total)}</span> de comissão
          </p>
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

      {/* Cabeçalho só no desktop — no mobile cada linha vira bloco */}
      <div className="hidden border-b border-slate-100 px-4 py-2 text-[10px] uppercase tracking-wide text-slate-400 dark:border-slate-800 lg:grid lg:grid-cols-[64px_1fr_150px_120px_88px_92px_104px] lg:gap-3">
        <span>Data</span>
        <span>Paciente</span>
        <span>Atendimento</span>
        <span>Fonte</span>
        <span className="text-right">Valor</span>
        <span className="text-right">Sua parte</span>
        <span className="text-right">Situação</span>
      </div>

      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {lista.length === 0 ? (
          <li className="p-8 text-center text-sm text-slate-400">
            Nenhum atendimento nesta situação.
          </li>
        ) : (
          visiveis.map((l) => <Linha key={l.id} linha={l} />)
        )}
      </ul>

      {lista.length > PAGINA && (
        <button
          onClick={() => setTudo((v) => !v)}
          className="w-full rounded-b-2xl border-t border-slate-100 py-2.5 text-xs font-medium text-teal-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-teal-400 dark:hover:bg-slate-800/40"
        >
          {tudo ? 'Mostrar menos' : `Mostrar todos os ${lista.length} atendimentos`}
        </button>
      )}
    </div>
  )
}

function Linha({ linha: l }: { linha: LinhaExtrato }) {
  const meta = STATUS_META[l.status]

  return (
    <li className="grid grid-cols-[1fr_auto] gap-2 px-4 py-2.5 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 lg:grid-cols-[64px_1fr_150px_120px_88px_92px_104px] lg:items-center lg:gap-3">
      <span className="order-1 text-[11px] tabular-nums text-slate-400 lg:order-none">
        {l.dataLabel}
      </span>

      <span className="order-3 col-span-2 min-w-0 truncate font-medium text-slate-800 dark:text-slate-100 lg:order-none lg:col-span-1">
        {l.pacienteNome}
      </span>

      <span className="order-4 col-span-2 truncate text-slate-500 dark:text-slate-400 lg:order-none lg:col-span-1">
        {l.servico}
      </span>

      <span className="order-5 lg:order-none">
        <span
          className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium ${corFonte(l.fonte)}`}
        >
          {l.fonte}
        </span>
      </span>

      <span className="order-6 tabular-nums text-slate-500 dark:text-slate-400 lg:order-none lg:text-right">
        {brl(l.valorBruto)}
      </span>

      <span className="order-7 font-medium tabular-nums text-slate-800 dark:text-slate-100 lg:order-none lg:text-right">
        {brl(l.valorRepasse)}
        <span className="ml-1 text-[10px] font-normal text-slate-400">{l.repassePct}%</span>
      </span>

      <span className="order-2 flex flex-col items-end gap-0.5 lg:order-none">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.chip}`}>
          {meta.label}
        </span>
        {l.status === 'aguardando' && (
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
            {l.origemEspera === 'convenio' ? (
              <>
                <Hourglass className="h-2.5 w-2.5" /> convênio · {l.previsaoLabel}
              </>
            ) : (
              <>
                <Clock className="h-2.5 w-2.5" /> paciente em aberto
              </>
            )}
          </span>
        )}
        {l.status === 'glosado' && l.motivoGlosa && (
          <span className="max-w-48 text-right text-[10px] leading-tight text-rose-500 dark:text-rose-400">
            {l.motivoGlosa}
          </span>
        )}
      </span>
    </li>
  )
}
