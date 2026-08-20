import { AlertTriangle, Download, Info, Minus, Wallet } from 'lucide-react'
import type {
  Contrato,
  Deducao,
  FiltroExtrato,
  LinhaExtrato,
  ProfissionalRef,
  PorFonte,
  RepassePago,
  ResumoCompetencia,
} from '@/../product-clinic/sections/meus-recebimentos/types'
import { AcumuladoChart } from './AcumuladoChart'
import { ExtratoTabela } from './ExtratoTabela'
import { HistoricoRepasses } from './HistoricoRepasses'
import { STATUS_META, barraFonte, brl, brlCurto } from './helpers'

interface Props {
  clinica: string
  profissional: ProfissionalRef
  contrato: Contrato
  resumo: ResumoCompetencia
  porFonte: PorFonte[]
  deducoes: Deducao[]
  extrato: LinhaExtrato[]
  historico: RepassePago[]
  filtro: FiltroExtrato
  onFiltro: (f: FiltroExtrato) => void
  onExportar: () => void
  onAbrirRecibo: (r: RepassePago) => void
}

export function MeusRecebimentosView({
  clinica,
  profissional,
  contrato,
  resumo,
  porFonte,
  deducoes,
  extrato,
  historico,
  filtro,
  onFiltro,
  onExportar,
  onAbrirRecibo,
}: Props) {
  const totalComissao = resumo.comissao + resumo.glosado || 1
  const pctLiberado = (resumo.liberado / totalComissao) * 100
  const pctAguardando = (resumo.aguardando / totalComissao) * 100
  const pctGlosado = (resumo.glosado / totalComissao) * 100
  const maiorFonte = Math.max(...porFonte.map((f) => f.valorRepasse), 1)
  // Acumulado do que a clínica JÁ pagou. O que ainda não caiu está no card de próximo repasse —
  // somar os dois num número só faria "recebido" incluir dinheiro que ainda não existe.
  const recebidoNoAno = historico.reduce((s, r) => s + r.liquido, 0)

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Meus recebimentos
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {profissional.nome} · {profissional.conselho} · {clinica}
          </p>
        </div>
        <button
          onClick={onExportar}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4" /> Exportar extrato
        </button>
      </div>

      {/* Próximo repasse */}
      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-5 dark:border-teal-900/60 dark:bg-teal-950/30 lg:col-span-2">
          <div className="flex items-center gap-2 text-xs font-medium text-teal-700 dark:text-teal-300">
            <Wallet className="h-4 w-4" /> Próximo repasse · previsto para{' '}
            {resumo.pagamentoPrevisto}
          </div>
          <div className="mt-2 text-4xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
            {brl(resumo.liquidoPrevisto)}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
            <span className="tabular-nums">{brl(resumo.liberado)} liberado</span>
            <Minus className="h-3 w-3 text-slate-400" />
            <span className="tabular-nums">{brl(resumo.deducoesTotal)} em deduções</span>
          </div>
          <p className="mt-3 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
            Competência {resumo.competencia} · parcial até {resumo.ateLabel}. O valor sobe conforme a
            clínica recebe os atendimentos do mês.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900/60 dark:bg-amber-950/20">
          <div className="text-xs font-medium text-amber-700 dark:text-amber-300">
            Ainda não liberado
          </div>
          <div className="mt-2 text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
            {brl(resumo.aguardando)}
          </div>
          <p className="mt-2 text-[11px] leading-snug text-slate-600 dark:text-slate-300">
            {contrato.prazoConvenio}
          </p>
          {resumo.glosado > 0 && (
            <div className="mt-3 flex items-start gap-1.5 border-t border-amber-200/70 pt-2.5 text-[11px] text-rose-600 dark:border-amber-900/60 dark:text-rose-300">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
              <span>
                <span className="font-medium tabular-nums">{brl(resumo.glosado)}</span> glosados pelo
                convênio — não entram na comissão.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Números da competência */}
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Atendimentos" valor={String(resumo.atendimentos)} />
        <Kpi label="Produzido (bruto)" valor={brlCurto(resumo.bruto)} />
        <Kpi label="Sua comissão" valor={brlCurto(resumo.comissao)} destaque />
        <Kpi label="Recebido em 2026" valor={brlCurto(recebidoNoAno)} />
      </div>

      {/* Composição da comissão */}
      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Como está sua comissão do mês
          </h2>
          <span className="text-[11px] text-slate-400">
            base {brl(resumo.comissao + resumo.glosado)}
          </span>
        </div>
        <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className={STATUS_META.liberado.barra} style={{ width: `${pctLiberado}%` }} />
          <div className={STATUS_META.aguardando.barra} style={{ width: `${pctAguardando}%` }} />
          <div className={STATUS_META.glosado.barra} style={{ width: `${pctGlosado}%` }} />
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px]">
          <Legenda cor={STATUS_META.liberado.barra} label="Liberado" valor={resumo.liberado} />
          <Legenda cor={STATUS_META.aguardando.barra} label="Aguardando" valor={resumo.aguardando} />
          <Legenda cor={STATUS_META.glosado.barra} label="Glosado" valor={resumo.glosado} />
        </div>
      </div>

      {/* Acumulado dia a dia + projeção do fechamento */}
      <AcumuladoChart extrato={extrato} resumo={resumo} />

      {/* Por fonte + deduções */}
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            De onde vem sua comissão
          </h2>
          <ul className="mt-3 space-y-3">
            {porFonte.map((f) => (
              <li key={f.nome}>
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{f.nome}</span>
                  <span className="tabular-nums text-slate-500 dark:text-slate-400">
                    {brl(f.valorRepasse)}
                    <span className="ml-1.5 text-slate-400">
                      {f.pct}% · {f.atendimentos} atend.
                    </span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full ${barraFonte(f.nome)}`}
                    style={{ width: `${(f.valorRepasse / maiorFonte) * 100}%` }}
                  />
                </div>
                {f.aguardando > 0 && (
                  <div className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">
                    {brl(f.aguardando)} ainda aguardando pagamento
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Deduções do período
          </h2>
          <ul className="mt-3 space-y-2">
            {deducoes.map((d) => (
              <li
                key={d.id}
                className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50"
              >
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-200">
                    {d.label}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-snug text-slate-400">
                    {d.descricao}
                  </div>
                </div>
                <span className="shrink-0 text-xs font-medium tabular-nums text-rose-600 dark:text-rose-400">
                  − {brl(d.valor)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-start gap-1.5 rounded-xl bg-slate-50 px-3 py-2.5 text-[11px] leading-snug text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
            <Info className="mt-0.5 h-3 w-3 shrink-0" />
            <span>
              {contrato.regra} Pagamento todo dia {contrato.diaPagamento} do mês seguinte.
            </span>
          </div>
        </div>
      </div>

      {/* Extrato */}
      <ExtratoTabela extrato={extrato} filtro={filtro} onFiltro={onFiltro} />

      {/* Histórico */}
      <HistoricoRepasses historico={historico} onAbrir={onAbrirRecibo} />
    </div>
  )
}

function Kpi({
  label,
  valor,
  destaque = false,
}: {
  label: string
  valor: string
  destaque?: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`text-xl font-semibold tabular-nums ${
          destaque ? 'text-teal-600 dark:text-teal-400' : 'text-slate-900 dark:text-slate-50'
        }`}
      >
        {valor}
      </div>
      <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  )
}

function Legenda({ cor, label, valor }: { cor: string; label: string; valor: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
      <span className={`h-2 w-2 rounded-full ${cor}`} />
      {label}
      <span className="font-medium tabular-nums text-slate-700 dark:text-slate-200">
        {brl(valor)}
      </span>
    </span>
  )
}
