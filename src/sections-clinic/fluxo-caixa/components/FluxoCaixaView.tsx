import { ChevronLeft, ChevronRight, TrendingDown, TriangleAlert, Wallet } from 'lucide-react'
import type { DiaFluxo, FluxoCaixaData, ModoFluxo } from '@/../product-clinic/sections/fluxo-caixa/types'
import { GraficoFluxo } from './GraficoFluxo'
import { TabelaDias } from './TabelaDias'
import { dataPorExtenso, moeda, moedaComSinal, montarAlerta, montarResumo } from './helpers'

interface Props {
  dados: FluxoCaixaData
  dias: DiaFluxo[]
  modo: ModoFluxo
  abertos: string[]
  onTrocarModo: (modo: ModoFluxo) => void
  onNavegarMes: (passo: -1 | 1) => void
  onMesAtual: () => void
  onAbrirDia: (data: string) => void
  onVerLancamento: (id: string) => void
}

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

export function FluxoCaixaView({
  dados,
  dias,
  modo,
  abertos,
  onTrocarModo,
  onNavegarMes,
  onMesAtual,
  onAbrirDia,
  onVerLancamento,
}: Props) {
  const resumo = montarResumo(dados, dias)
  const alerta = montarAlerta(dias)
  const [ano, mes] = dados.periodo.de.split('-')

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
            <Wallet className="h-6 w-6 text-teal-600" />
            Fluxo de caixa
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {dados.clinica} · {MESES[Number(mes) - 1]} de {ano} · regime de caixa
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
            <IconBtn rotulo="Mês anterior" onClick={() => onNavegarMes(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </IconBtn>
            <button
              onClick={onMesAtual}
              className="border-x border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Mês atual
            </button>
            <IconBtn rotulo="Próximo mês" onClick={() => onNavegarMes(1)}>
              <ChevronRight className="h-4 w-4" />
            </IconBtn>
          </div>

          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            <Aba ativo={modo === 'completo'} onClick={() => onTrocarModo('completo')}>
              Realizado + previsto
            </Aba>
            <Aba ativo={modo === 'realizado'} onClick={() => onTrocarModo('realizado')}>
              Só realizado
            </Aba>
          </div>
        </div>
      </div>

      {/* Alerta: a razão da tela existir */}
      {alerta && (
        <div
          className={`mt-5 flex flex-col gap-2 rounded-2xl border px-4 py-3 sm:flex-row sm:items-start sm:gap-4 ${
            alerta.estoura
              ? 'border-rose-200 bg-rose-50/80 dark:border-rose-900/60 dark:bg-rose-950/30'
              : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60'
          }`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              alerta.estoura
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {alerta.estoura ? <TriangleAlert className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-semibold ${
                alerta.estoura ? 'text-rose-800 dark:text-rose-200' : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {alerta.estoura
                ? `O caixa estoura em ${dataPorExtenso(alerta.data)}: ${moedaComSinal(alerta.saldo)}`
                : `Dia mais apertado: ${dataPorExtenso(alerta.data)}, com ${moedaComSinal(alerta.saldo)}`}
            </p>
            {alerta.causas.length > 0 && (
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                Caem no mesmo dia: {alerta.causas.map((c) => `${c.descricao} (R$ ${moeda(c.valor)})`).join(' · ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          rotulo="Saldo hoje"
          valor={resumo.saldoHoje}
          nota="só o que já foi pago"
          destaque={resumo.saldoHoje < 0 ? 'ruim' : 'neutro'}
        />
        <Kpi
          rotulo="Entradas do período"
          valor={resumo.entradasRealizadas}
          nota={`+ R$ ${moeda(resumo.entradasPrevistas)} previstas`}
          destaque="bom"
        />
        <Kpi
          rotulo="Saídas do período"
          valor={resumo.saidasRealizadas}
          nota={`+ R$ ${moeda(resumo.saidasPrevistas)} previstas`}
          destaque="ruim"
        />
        <Kpi
          rotulo="Saldo projetado"
          valor={resumo.saldoProjetado}
          nota="no fim do período"
          destaque={resumo.saldoProjetado < 0 ? 'ruim' : 'neutro'}
        />
      </div>

      {/* Gráfico */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <header className="border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Movimento por dia</h2>
        </header>
        <div className="bg-white px-4 py-4 dark:bg-slate-900">
          <GraficoFluxo dias={dias} hoje={dados.hoje} />
        </div>
      </section>

      {/* Tabela */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <header className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Dia a dia</h2>
          <span className="ml-auto text-[11px] text-slate-400">clique num dia para ver os lançamentos</span>
        </header>
        <div className="bg-white dark:bg-slate-900">
          <TabelaDias
            dias={dias}
            hoje={dados.hoje}
            abertos={abertos}
            onAbrirDia={onAbrirDia}
            onVerLancamento={onVerLancamento}
          />
        </div>
      </section>
    </div>
  )
}

function Kpi({
  rotulo,
  valor,
  nota,
  destaque,
}: {
  rotulo: string
  valor: number
  nota: string
  destaque: 'bom' | 'ruim' | 'neutro'
}) {
  const cor =
    destaque === 'ruim'
      ? 'text-rose-700 dark:text-rose-400'
      : destaque === 'bom'
        ? 'text-teal-700 dark:text-teal-400'
        : 'text-slate-900 dark:text-slate-50'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {rotulo}
      </p>
      <p className={`mt-1 text-xl font-semibold tabular-nums ${cor}`}>{moedaComSinal(valor)}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{nota}</p>
    </div>
  )
}

function Aba({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
        ativo
          ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100'
          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  )
}

function IconBtn({
  rotulo,
  onClick,
  children,
}: {
  rotulo: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={rotulo}
      aria-label={rotulo}
      className="px-2 py-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      {children}
    </button>
  )
}
