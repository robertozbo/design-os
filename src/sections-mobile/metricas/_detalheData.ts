// Preview-only helper: deriva séries temporais datadas a partir do view-model
// de uma métrica (que só carrega `sparkline: number[]`). NÃO é exportável —
// no app real a série vem de GET /metrics?metricTypeId=X&periodo=Y.
//
// Determinístico: mesmo id + período → mesma série (screenshots estáveis).

import type {
  MetricaViewModel,
  MetricasData,
  PeriodoDetalhe,
  PeriodoDetalheOpcao,
  SeriePonto,
  MetricaDetalheStats,
  FaixaNormal,
  AdicionarMetricaCategoria,
} from '@/../product-mobile/sections/metricas/types'

export const PERIODOS_DETALHE: PeriodoDetalheOpcao[] = [
  { id: '7d', label: '7 dias' },
  { id: '30d', label: '30 dias' },
  { id: '3m', label: '3 meses' },
  { id: '6m', label: '6 meses' },
  { id: '1a', label: '1 ano' },
]

const PERIODO_CFG: Record<PeriodoDetalhe, { points: number; stepDays: number }> = {
  '7d': { points: 7, stepDays: 1 },
  '30d': { points: 30, stepDays: 1 },
  '3m': { points: 13, stepDays: 7 },
  '6m': { points: 26, stepDays: 7 },
  '1a': { points: 12, stepDays: 30 },
}

// Data de referência ("hoje") fixa pra manter o protótipo determinístico.
const HOJE = new Date('2026-05-14T12:00:00')
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function rotuloData(d: Date, periodo: PeriodoDetalhe): string {
  if (periodo === '1a' || periodo === '6m') return `${MESES[d.getMonth()]}`
  return `${d.getDate()} ${MESES[d.getMonth()]}`
}

function hashStr(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

// PRNG determinístico (Lehmer / Park-Miller).
function seeded(seed: number): () => number {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

/** Fonte curta (antes do "·") pra preencher o histórico. */
function fonteCurta(metrica: MetricaViewModel): string {
  const raw = metrica.fonte || ''
  const part = raw.split('·')[0]?.trim()
  return part && part !== 'Sem registro' ? part : 'Manual'
}

/** Gera a série temporal pro período. 7d usa o sparkline real quando disponível. */
export function gerarSerie(metrica: MetricaViewModel, periodo: PeriodoDetalhe): SeriePonto[] {
  const spark = metrica.sparkline ?? []
  if (spark.length === 0) return []

  const last = spark[spark.length - 1]
  const decimais = Number.isInteger(last) ? 0 : 1
  const fonte = fonteCurta(metrica)
  const cfg = PERIODO_CFG[periodo]

  const arredonda = (v: number) => {
    const f = Math.pow(10, decimais)
    return Math.round(v * f) / f
  }

  const pontoEm = (offsetSteps: number, v: number): SeriePonto => {
    const d = new Date(HOJE)
    d.setDate(d.getDate() - offsetSteps * cfg.stepDays)
    return { t: isoDate(d), v, rotulo: rotuloData(d, periodo), fonte }
  }

  // 7 dias: usa o sparkline real (7 pontos) diretamente.
  if (periodo === '7d' && spark.length >= cfg.points) {
    const recentes = spark.slice(-cfg.points)
    return recentes.map((v, i) =>
      pontoEm(cfg.points - 1 - i, arredonda(v)),
    )
  }

  // Demais períodos: random walk determinístico terminando no valor atual.
  const sparkMin = Math.min(...spark)
  const sparkMax = Math.max(...spark)
  const amp = Math.max(sparkMax - sparkMin, Math.abs(last) * 0.05, decimais === 0 ? 1 : 0.1)
  const rng = seeded(hashStr(metrica.id) + cfg.points * 7)

  const vals: number[] = []
  let cur = last - amp * (rng() * 0.8)
  for (let i = 0; i < cfg.points; i++) {
    cur += (rng() - 0.5) * amp * 0.7
    vals.push(cur)
  }
  vals[cfg.points - 1] = last // ancora o último ponto no valor atual

  return vals.map((v, i) => pontoEm(cfg.points - 1 - i, arredonda(Math.max(0, v))))
}

export function calcularStats(serie: SeriePonto[], unidade: string): MetricaDetalheStats {
  if (serie.length === 0) return { min: 0, max: 0, media: 0, unidade }
  const vals = serie.map((p) => p.v)
  const soma = vals.reduce((a, b) => a + b, 0)
  const decimais = vals.every((v) => Number.isInteger(v)) ? 0 : 1
  const f = Math.pow(10, decimais)
  return {
    min: Math.min(...vals),
    max: Math.max(...vals),
    media: Math.round((soma / vals.length) * f) / f,
    unidade,
  }
}

export function faixaNormalDe(metrica: MetricaViewModel): FaixaNormal | undefined {
  const { normalMin, normalMax } = metrica.tipo
  const min = normalMin != null ? Number(normalMin) : null
  const max = normalMax != null ? Number(normalMax) : null
  if (min == null && max == null) return undefined
  return { min: Number.isNaN(min as number) ? null : min, max: Number.isNaN(max as number) ? null : max }
}

/** Deriva as opções selecionáveis (por categoria) pro formulário de cadastro. */
export function opcoesPorCategoria(data: MetricasData): AdicionarMetricaCategoria[] {
  return data.categorias.map((cat) => ({
    id: cat.id,
    label: cat.label,
    opcoes: cat.metricas.map((m) => ({
      id: m.id,
      label: m.tipo.label,
      unit: m.tipo.unit ?? '',
      iconeNome: m.iconeNome,
      iconeCor: m.iconeCor,
      iconeBg: m.iconeBg,
      dataType: m.tipo.dataType,
      compositeFields: m.tipo.compositeFields,
    })),
  }))
}

/** Formata número no padrão pt-BR (vírgula decimal, ponto de milhar). */
export function formatNum(v: number): string {
  const decimais = Number.isInteger(v) ? 0 : 1
  return v.toLocaleString('pt-BR', {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  })
}
