import {
  Minus,
  PencilLine,
  Scale,
  Stethoscope,
  Target,
  TrendingDown,
  TrendingUp,
  Watch,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type {
  FonteDado,
  Metrica,
  NivelMetrica,
  Ponto,
} from '@/../product-clinic/sections/acompanhamento/types'
import { NIVEL_META, dataCurta, dataExtensa } from './helpers'

interface Props {
  metricas: Metrica[]
  ultimaConsultaEm: string
}

/**
 * Direção desejável por métrica — o que conta como melhora clínica.
 *
 * Sem esse mapa, cair 0,7 h de sono seria pintado de verde só por ser um número negativo,
 * e subir 4 mmHg de pressão seria pintado de verde só por ser positivo. O sinal do número
 * não carrega julgamento; a métrica é que diz para que lado é bom ir.
 *
 * `neutro` = métrica sem julgamento automático (fica em slate e a leitura é do médico).
 */
type DirecaoDesejavel = 'baixar' | 'subir' | 'neutro'

const DIRECAO_DESEJAVEL: Record<string, DirecaoDesejavel> = {
  'm-peso': 'baixar', // paciente em processo de emagrecimento
  'm-glicemia': 'baixar', // glicemia de jejum menor = melhor controle
  'm-pas': 'baixar', // pressão sistólica menor = melhor
  'm-sono': 'subir', // dormir mais horas é melhora
  'm-fc': 'baixar', // FC de repouso menor = melhor condicionamento (bradicardia extrema cai em `nivel: alterado`)
  'm-passos': 'subir', // mais passos = mais atividade
}

/** Métrica não mapeada não ganha cor de julgamento — melhor neutro que errado. */
function direcaoDe(id: string): DirecaoDesejavel {
  return DIRECAO_DESEJAVEL[id] ?? 'neutro'
}

/** Fonte importa: wearable e digitação manual não têm a mesma confiabilidade. */
const FONTE_META: Record<FonteDado, { Icon: LucideIcon; detalhe: string; autoRelatado: boolean }> =
  {
    'Apple Health': {
      Icon: Watch,
      detalhe: 'Sincronizado automaticamente do Apple Health',
      autoRelatado: false,
    },
    'Google Fit': {
      Icon: Watch,
      detalhe: 'Sincronizado automaticamente do Google Fit',
      autoRelatado: false,
    },
    Garmin: {
      Icon: Watch,
      detalhe: 'Sincronizado automaticamente do Garmin',
      autoRelatado: false,
    },
    Balança: {
      Icon: Scale,
      detalhe: 'Enviado pela balança conectada do paciente',
      autoRelatado: false,
    },
    Manual: {
      Icon: PencilLine,
      detalhe: 'Digitado pelo próprio paciente — confirme antes de mudar conduta',
      autoRelatado: true,
    },
    Clínica: {
      Icon: Stethoscope,
      detalhe: 'Medido na clínica por um profissional',
      autoRelatado: false,
    },
  }

const TENDENCIA_ICONE: Record<Metrica['tendencia'], LucideIcon> = {
  subindo: TrendingUp,
  descendo: TrendingDown,
  estavel: Minus,
}

function fmt(valor: number): string {
  return valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}

/**
 * Arredonda para a mesma precisão que `fmt` exibe (1 casa).
 *
 * Sem isso, uma variação de -0,03 sairia escrita como "−0" (número negativo que arredonda para
 * zero) e ainda seria pintada de verde. Cor e texto têm que ler o MESMO número.
 */
function arredondar(valor: number): number {
  return Math.round(valor * 10) / 10
}

/** Sinal sempre explícito — o médico procura a direção antes do número. */
function fmtSinal(valor: number): string {
  if (valor === 0) return '±0'
  return `${valor > 0 ? '+' : '−'}${fmt(Math.abs(valor))}`
}

/** Datas chegam em ISO; formatamos por string para não passar por fuso horário. */
type LeituraVariacao = 'melhora' | 'piora' | 'neutra'

function lerVariacao(variacao: number, direcao: DirecaoDesejavel): LeituraVariacao {
  if (variacao === 0 || direcao === 'neutro') return 'neutra'
  const melhorou = direcao === 'baixar' ? variacao < 0 : variacao > 0
  return melhorou ? 'melhora' : 'piora'
}

const COR_VARIACAO: Record<LeituraVariacao, string> = {
  melhora: 'text-emerald-600 dark:text-emerald-400',
  piora: 'text-rose-600 dark:text-rose-400',
  neutra: 'text-slate-500 dark:text-slate-400',
}

const TITULO_VARIACAO: Record<LeituraVariacao, string> = {
  melhora: 'Movimento na direção desejada para esta métrica',
  piora: 'Movimento na direção oposta à desejada para esta métrica',
  neutra: 'Sem julgamento automático para esta métrica',
}

interface InfoMeta {
  valor: number
  atingida: boolean
  texto: string
}

function calcularMeta(metrica: Metrica, direcao: DirecaoDesejavel): InfoMeta | null {
  if (metrica.meta === null) return null
  const distancia = Math.abs(metrica.meta - metrica.valorAtual)
  let atingida: boolean
  if (direcao === 'baixar') atingida = metrica.valorAtual <= metrica.meta
  else if (direcao === 'subir') atingida = metrica.valorAtual >= metrica.meta
  else atingida = distancia < 1e-9
  return {
    valor: metrica.meta,
    atingida,
    texto: atingida ? 'atingida' : `faltam ${fmt(distancia)} ${metrica.unidade}`,
  }
}

export function MetricasPanel({ metricas, ultimaConsultaEm }: Props) {
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Métricas compartilhadas pelo paciente
        </h2>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Toda variação é desde a última consulta ·{' '}
          <span className="tabular-nums">{dataExtensa(ultimaConsultaEm)}</span>
        </p>
      </div>

      {/* Legenda — deixa explícito que a cor segue a direção desejável, não o sinal do número */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 dark:text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span
            className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
            aria-hidden="true"
          />
          melhora clínica
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="h-1.5 w-1.5 rounded-full bg-rose-500 dark:bg-rose-400"
            aria-hidden="true"
          />
          piora
        </span>
        <span className="text-slate-400 dark:text-slate-500">
          a cor segue a direção desejável de cada métrica, não o sinal do número
        </span>
      </div>

      {metricas.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
          O paciente ainda não compartilhou métricas.
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {metricas.map((metrica) => (
            <MetricaCard
              key={metrica.id}
              metrica={metrica}
              ultimaConsultaEm={ultimaConsultaEm}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function MetricaCard({
  metrica,
  ultimaConsultaEm,
}: {
  metrica: Metrica
  ultimaConsultaEm: string
}) {
  const nivel = NIVEL_META[metrica.nivel]
  const direcao = direcaoDe(metrica.id)
  // Cor e texto da variação leem o mesmo número arredondado — ver `arredondar`.
  const variacao = arredondar(metrica.variacao)
  const leitura = lerVariacao(variacao, direcao)
  const infoMeta = calcularMeta(metrica, direcao)
  const fonte = FONTE_META[metrica.fonte]
  const Seta = TENDENCIA_ICONE[metrica.tendencia]
  const FonteIcon = fonte.Icon
  const primeiroPonto = metrica.serie[0]
  const ultimoPonto = metrica.serie[metrica.serie.length - 1]

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      {/* Nome + nível */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {metrica.nome}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${nivel.badge}`}
        >
          {nivel.label}
        </span>
      </div>

      {/* Valor atual + variação desde a última consulta */}
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
            {fmt(metrica.valorAtual)}
            {/* Medida par (pressão): o segundo número faz parte do valor, não é acessório. */}
            {metrica.secundaria && (
              <>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                {fmt(metrica.secundaria.valorAtual)}
              </>
            )}
          </span>
          <span className="text-sm text-slate-400 dark:text-slate-500">{metrica.unidade}</span>
        </div>
        <div className="text-right" title={TITULO_VARIACAO[leitura]}>
          <div
            className={`flex items-center justify-end gap-1 text-sm font-semibold tabular-nums ${COR_VARIACAO[leitura]}`}
          >
            <Seta className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            <span>
              {fmtSinal(variacao)}
              {metrica.secundaria && `/${fmtSinal(arredondar(metrica.secundaria.variacao))}`}{' '}
              {metrica.unidade}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500">
            desde a consulta de{' '}
            <span className="tabular-nums">{dataCurta(ultimaConsultaEm)}</span>
          </div>
        </div>
      </div>

      {/* Série histórica */}
      <div className="mt-3">
        <Sparkline serie={metrica.serie} meta={metrica.meta} nivel={metrica.nivel} />
        {/*
          O eixo mostra o intervalo da SÉRIE; `medidoEm` é a data do valor atual e pode ser mais
          recente que o último ponto (78,4 kg medido em 24/07, série até 21/07). Rotular a borda
          direita do gráfico com `medidoEm` datava errado o último ponto.
        */}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
          <span>
            {primeiroPonto ? dataCurta(primeiroPonto.data) : '—'}
            {ultimoPonto ? ` – ${dataCurta(ultimoPonto.data)}` : ''}
          </span>
          <span title={`Valor atual medido em ${dataExtensa(metrica.medidoEm)}`}>
            medido {dataCurta(metrica.medidoEm)}
          </span>
        </div>
      </div>

      {/* Meta combinada com o paciente */}
      {infoMeta && (
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1.5 text-[11px] dark:bg-slate-800/50">
          <Target className="h-3 w-3 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
          <span className="text-slate-500 dark:text-slate-400">
            Meta <span className="tabular-nums">{fmt(infoMeta.valor)}</span> {metrica.unidade}
          </span>
          <span
            className={`ml-auto shrink-0 font-medium tabular-nums ${
              infoMeta.atingida
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {infoMeta.texto}
          </span>
        </div>
      )}

      {/* Fonte do dado */}
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3 text-[11px] text-slate-400 dark:text-slate-500">
        <FonteIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span title={fonte.detalhe}>{metrica.fonte}</span>
        {fonte.autoRelatado && (
          <span
            title={fonte.detalhe}
            className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
          >
            auto-relatado
          </span>
        )}
      </div>
    </article>
  )
}

const SPARK_W = 240
const SPARK_H = 48
const SPARK_PAD = 6
/** Raio do halo do último ponto — o maior desenho da série, é ele que define o recuo. */
const SPARK_HALO_R = 6
/**
 * Recuo lateral para o ponto destacado do último valor não ser cortado pela borda do viewBox.
 * O `svg` externo tem `overflow: hidden` por padrão, então precisa ser >= o raio do halo
 * (com 5 o halo de raio 6 perdia 1 unidade na direita).
 */
const SPARK_PAD_X = SPARK_HALO_R

function Sparkline({
  serie,
  meta,
  nivel,
}: {
  serie: Ponto[]
  meta: number | null
  nivel: NivelMetrica
}) {
  if (serie.length === 0) {
    return (
      <div className="flex h-12 items-center justify-center rounded-lg border border-dashed border-slate-200 text-[10px] text-slate-400 dark:border-slate-700 dark:text-slate-500">
        sem série
      </div>
    )
  }

  const cor = NIVEL_META[nivel]
  const valores = serie.map((p) => p.valor)
  // A meta entra no domínio para a linha tracejada caber no gráfico — a distância até ela
  // vira informação visual em vez de ficar fora do viewBox.
  const candidatos = meta !== null ? [...valores, meta] : valores
  let min = Math.min(...candidatos)
  let max = Math.max(...candidatos)
  // Série constante (ou de um ponto só): amplitude zero quebraria a normalização (divisão por zero).
  if (max - min < 1e-9) {
    min -= 1
    max += 1
  }

  const escalaY = (valor: number) =>
    SPARK_PAD + (1 - (valor - min) / (max - min)) * (SPARK_H - SPARK_PAD * 2)
  const escalaX = (indice: number) =>
    serie.length === 1
      ? SPARK_W / 2
      : SPARK_PAD_X + (indice / (serie.length - 1)) * (SPARK_W - SPARK_PAD_X * 2)

  const coordenadas = serie.map((p, i) => `${escalaX(i).toFixed(1)},${escalaY(p.valor).toFixed(1)}`)
  const linha = coordenadas.join(' ')
  const area = `M ${escalaX(0)},${SPARK_H} L ${coordenadas.join(' L ')} L ${escalaX(serie.length - 1)},${SPARK_H} Z`
  const ultimo = serie[serie.length - 1]

  return (
    <svg
      viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Evolução de ${serie.length} registros, de ${fmt(valores[0])} a ${fmt(ultimo.valor)}${
        meta !== null ? `, meta ${fmt(meta)}` : ''
      }`}
    >
      {meta !== null && (
        <line
          x1={0}
          y1={escalaY(meta)}
          x2={SPARK_W}
          y2={escalaY(meta)}
          strokeWidth={1}
          strokeDasharray="5 5"
          vectorEffect="non-scaling-stroke"
          className="stroke-slate-300 dark:stroke-slate-600"
        />
      )}
      <path d={area} className={cor.area} />
      <polyline
        points={linha}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className={cor.traco}
      />
      {/* Halo + ponto no último valor — é o número grande do card */}
      <circle
        cx={escalaX(serie.length - 1)}
        cy={escalaY(ultimo.valor)}
        r={SPARK_HALO_R}
        className={`${cor.ponto} opacity-20`}
      />
      <circle
        cx={escalaX(serie.length - 1)}
        cy={escalaY(ultimo.valor)}
        r={3}
        className={cor.ponto}
      />
    </svg>
  )
}
