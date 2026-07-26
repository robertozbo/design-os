import type { ReactNode } from 'react'
import { Activity, ArrowDown, ArrowUp, Dumbbell, Footprints, Minus, Timer, TriangleAlert } from 'lucide-react'
import type { Atividade, Ponto } from '@/../product-medical-clinic/sections/acompanhamento/types'
import { dataCurta, dataExtensa } from './helpers'

interface Props {
  atividade: Atividade
  ultimaConsultaEm: string
}

/** Abaixo disso, os números do período cobrem poucos dias e viram indicativo, não medida. */
const ADESAO_MINIMA = 60

export function AtividadePanel({ atividade, ultimaConsultaEm }: Props) {
  const { passosMedia, minutosAtivosSemana, treinosSemana, adesao, variacaoPassos, serie } = atividade

  // Passos: subir é bom. Cair não é "neutro" — é sinal de queda de atividade.
  const passosMelhorou = variacaoPassos > 0
  const passosPiorou = variacaoPassos < 0
  const adesaoBaixa = adesao < ADESAO_MINIMA

  // Queda de passos usa rose (mesma leitura de "piora" do painel de métricas). Amber fica reservado
  // para UMA coisa só neste card: o dado é pouco confiável. Duas cores, dois significados distintos.
  const corVariacao = passosMelhorou
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
    : passosPiorou
      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'

  const IconeVariacao = passosMelhorou ? ArrowUp : passosPiorou ? ArrowDown : Minus

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Activity className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Atividade física
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Última consulta · {dataExtensa(ultimaConsultaEm)}
        </span>
      </div>

      {/* Destaque — passos/dia */}
      <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-2">
        <Footprints
          className="mb-1 h-6 w-6 shrink-0 text-teal-600 dark:text-teal-400"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tabular-nums leading-none text-slate-900 sm:text-4xl dark:text-slate-50">
            {formatarNumero(passosMedia)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">passos/dia (média)</span>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold tabular-nums ${corVariacao}`}
        >
          <IconeVariacao className="h-3 w-3" aria-hidden="true" />
          {formatarComSinal(variacaoPassos)}
        </span>
      </div>
      <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        {passosMelhorou && `Passos/dia subiram desde a última consulta (${dataExtensa(ultimaConsultaEm)}).`}
        {passosPiorou &&
          `Passos/dia caíram desde a última consulta (${dataExtensa(ultimaConsultaEm)}) — o paciente caminhou menos que no período anterior.`}
        {!passosMelhorou &&
          !passosPiorou &&
          `Sem mudança nos passos/dia desde a última consulta (${dataExtensa(ultimaConsultaEm)}).`}
      </p>

      {/* Série de passos */}
      <GraficoPassos serie={serie} ultimaConsultaEm={ultimaConsultaEm} />

      {/* Semana */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Tile
          icone={<Timer className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />}
          rotulo="Minutos ativos"
          valor={formatarNumero(minutosAtivosSemana)}
          sufixo="min/semana"
        />
        <Tile
          icone={<Dumbbell className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />}
          rotulo="Treinos"
          valor={formatarNumero(treinosSemana)}
          sufixo="na semana"
        />
      </div>

      {/* Adesão — engajamento com o app, não desempenho físico */}
      <div
        className={`mt-2 rounded-xl border p-3 ${
          adesaoBaixa
            ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/20'
            : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/30'
        }`}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Adesão ao registro
          </span>
          <span
            className={`text-lg font-semibold tabular-nums leading-none ${
              adesaoBaixa ? 'text-amber-700 dark:text-amber-300' : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {formatarNumero(adesao)}%
          </span>
        </div>

        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
          role="img"
          aria-label={`Adesão de ${adesao}% dos dias com registro`}
        >
          <div
            className={`h-full rounded-full ${adesaoBaixa ? 'bg-amber-500' : 'bg-teal-500'}`}
            style={{ width: `${clamp(adesao, 0, 100)}%` }}
          />
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          % de dias com algum registro no app — mede <strong className="font-semibold">engajamento</strong>, não
          desempenho físico. Adesão alta não significa paciente mais ativo; significa dado mais confiável.
        </p>

        {adesaoBaixa && (
          <div className="mt-2 flex gap-2 rounded-lg bg-amber-100/70 p-2 text-[11px] leading-relaxed text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            <span>
              Adesão abaixo de {ADESAO_MINIMA}%: os números acima cobrem uma fração pequena dos dias do período.
              Trate passos, minutos ativos e treinos como indicativos — não como medida do comportamento real.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- Gráfico de barras (SVG à mão) ---------- */

const GRAFICO_ALTURA = 44

function GraficoPassos({ serie, ultimaConsultaEm }: { serie: Ponto[]; ultimaConsultaEm: string }) {
  if (serie.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center text-[11px] text-slate-400 dark:border-slate-700">
        Sem série de passos no período.
      </div>
    )
  }

  const valores = serie.map((p) => p.valor)
  const maximo = Math.max(...valores)
  const minimo = Math.min(...valores)
  // Piso abaixo do mínimo para a variação aparecer — barra a partir do zero achataria tudo.
  // Exceção: série toda zerada mantém o piso em 0, senão "paciente não andou nada" viraria
  // uma fileira de barras altas.
  const amplitude = maximo - minimo || Math.max(maximo, 1)
  const piso = maximo <= 0 ? 0 : minimo - amplitude * 0.3
  const teto = maximo + amplitude * 0.08

  const passoX = 10
  const larguraBarra = 6
  const largura = serie.length * passoX
  const ultimo = serie.length - 1

  const primeiroPonto = serie[0]
  const ultimoPonto = serie[ultimo]

  // A série é mais longa que o intervalo desde a consulta. Sem essa marca o médico lê a subida
  // inteira como se tivesse acontecido no período — marcamos onde a última consulta cai.
  const consulta = ultimaConsultaEm.slice(0, 10)
  const indiceConsulta = serie.findIndex((p) => p.data.slice(0, 10) >= consulta)
  const marcarConsulta = indiceConsulta > 0
  const xConsulta = indiceConsulta * passoX

  return (
    <div className="mt-4">
      <svg
        viewBox={`0 0 ${largura} ${GRAFICO_ALTURA}`}
        preserveAspectRatio="none"
        className="h-16 w-full sm:h-20"
        role="img"
        aria-label={`Passos por dia ao longo do período: de ${formatarNumero(primeiroPonto.valor)} em ${dataCurta(primeiroPonto.data)} a ${formatarNumero(ultimoPonto.valor)} em ${dataCurta(ultimoPonto.data)}${marcarConsulta ? `. A linha tracejada marca a última consulta, em ${dataCurta(consulta)} — o que está à direita dela é o período novo` : ''}`}
      >
        {marcarConsulta && (
          <line
            x1={xConsulta}
            x2={xConsulta}
            y1={0}
            y2={GRAFICO_ALTURA}
            strokeWidth={1}
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
            className="stroke-slate-400 dark:stroke-slate-600"
          >
            <title>{`Última consulta · ${dataCurta(consulta)}`}</title>
          </line>
        )}
        {serie.map((ponto, i) => {
          const altura = Math.max(2, ((ponto.valor - piso) / (teto - piso)) * GRAFICO_ALTURA)
          const destaque = i === ultimo
          return (
            <rect
              key={ponto.data}
              x={i * passoX + (passoX - larguraBarra) / 2}
              y={GRAFICO_ALTURA - altura}
              width={larguraBarra}
              height={altura}
              className={
                destaque ? 'fill-teal-600 dark:fill-teal-400' : 'fill-teal-500/35 dark:fill-teal-500/30'
              }
            >
              <title>{`${dataCurta(ponto.data)} · ${formatarNumero(ponto.valor)} passos`}</title>
            </rect>
          )
        })}
      </svg>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
        <span>
          {dataCurta(primeiroPonto.data)} · {formatarNumero(primeiroPonto.valor)}
        </span>
        {marcarConsulta && (
          <span className="flex items-center gap-1 tracking-normal">
            <span aria-hidden="true" className="text-slate-400 dark:text-slate-500">
              ┆
            </span>
            última consulta
          </span>
        )}
        <span className="font-medium text-teal-700 dark:text-teal-400">
          {dataCurta(ultimoPonto.data)} · {formatarNumero(ultimoPonto.valor)}
        </span>
      </div>
    </div>
  )
}

/* ---------- Peças menores ---------- */

function Tile({
  icone,
  rotulo,
  valor,
  sufixo,
}: {
  icone: ReactNode
  rotulo: string
  valor: string
  sufixo: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/30">
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        {icone}
        <span className="text-[11px] font-semibold uppercase tracking-wide">{rotulo}</span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="text-xl font-semibold tabular-nums leading-none text-slate-800 dark:text-slate-100">
          {valor}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">{sufixo}</span>
      </div>
    </div>
  )
}

/* ---------- Utilitários ---------- */

function clamp(valor: number, minimo: number, maximo: number) {
  return Math.min(maximo, Math.max(minimo, valor))
}

function formatarNumero(valor: number) {
  return valor.toLocaleString('pt-BR')
}

/**
 * Sinal sempre explícito — o médico precisa ver a direção antes do número. Zero vira "±0" e não "0":
 * "0 passos/dia" se lê como "o paciente não andou", que é outra coisa.
 */
function formatarComSinal(valor: number) {
  if (valor === 0) return '±0'
  return `${valor > 0 ? '+' : '−'}${formatarNumero(Math.abs(valor))}`
}

