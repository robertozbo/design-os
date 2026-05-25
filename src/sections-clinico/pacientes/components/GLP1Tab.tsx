import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Calendar,
  Edit3,
  HelpCircle,
  MessageSquare,
  Pause,
  Syringe,
  TrendingDown,
  TrendingUp,
  Minus,
} from 'lucide-react'
import type {
  MedicacaoAtiva,
  PacienteDetalhe,
} from '@/../product-clinico/sections/pacientes/types'

interface Props {
  paciente: PacienteDetalhe
  onAjustarDose?: (medicacaoNome: string) => void
  onPausarTitulacao?: (medicacaoNome: string) => void
  onMensagemClinica?: () => void
}

/** Tipo de fármaco GLP-1. */
type GLP1Drug = 'semaglutida' | 'tirzepatida' | 'liraglutida'

const GLP1_NAMES: Record<string, GLP1Drug> = {
  ozempic: 'semaglutida',
  wegovy: 'semaglutida',
  rybelsus: 'semaglutida',
  saxenda: 'liraglutida',
  victoza: 'liraglutida',
  mounjaro: 'tirzepatida',
  zepbound: 'tirzepatida',
}

function detectGLP1(med: MedicacaoAtiva): GLP1Drug | null {
  const nome = med.nome.toLowerCase()
  for (const [key, drug] of Object.entries(GLP1_NAMES)) {
    if (nome.includes(key)) return drug
  }
  return null
}

export function findGLP1(med: MedicacaoAtiva[]): MedicacaoAtiva | null {
  return med.find((m) => detectGLP1(m) !== null) ?? null
}

// ============================================================
// SYNTHESIZED CLINICAL DATA (V1 mock — eventually backend-provided)
// ============================================================

const SITIO_LABEL: Record<string, string> = {
  abdome_sup_esq: 'Abd. sup. esq.',
  abdome_sup_dir: 'Abd. sup. dir.',
  abdome_inf_esq: 'Abd. inf. esq.',
  abdome_inf_dir: 'Abd. inf. dir.',
  coxa_esq: 'Coxa esq.',
  coxa_dir: 'Coxa dir.',
  braco_esq: 'Braço esq.',
  braco_dir: 'Braço dir.',
}

const SITIO_KEYS = Object.keys(SITIO_LABEL)

interface InjecaoMock {
  data: string
  sitio: string
  dor: number
  doseLabel: string
}

interface SintomaMock {
  semana: string
  nausea: number
  foodNoise: number
  fadiga: number
}

function gerarInjecoesMock(iniciadaEm: string, doseAtual: string): InjecaoMock[] {
  const semanas = 8
  const out: InjecaoMock[] = []
  const inicio = new Date(iniciadaEm)
  const hoje = new Date()
  const semanasDesdeInicio = Math.min(
    semanas,
    Math.max(1, Math.floor((hoje.getTime() - inicio.getTime()) / (7 * 86400000))),
  )

  // Padrão de rotação: 5 sítios diferentes ciclados
  const padrao = [
    'abdome_inf_esq',
    'abdome_sup_dir',
    'coxa_dir',
    'abdome_inf_dir',
    'coxa_esq',
    'abdome_sup_esq',
    'abdome_sup_esq', // saturação proposital nas últimas semanas
    'abdome_sup_esq',
  ]

  for (let i = semanasDesdeInicio - 1; i >= 0; i--) {
    const data = new Date(hoje.getTime() - i * 7 * 86400000)
    out.push({
      data: data.toISOString(),
      sitio: padrao[(semanasDesdeInicio - 1 - i) % padrao.length],
      dor: i === 0 ? 2 : i < 3 ? 3 : i < 5 ? 4 : 3,
      doseLabel: i < 6 ? '0,25mg' : doseAtual,
    })
  }
  return out
}

function gerarSintomasMock(): SintomaMock[] {
  return [
    { semana: '-7s', nausea: 6, foodNoise: 8, fadiga: 5 },
    { semana: '-6s', nausea: 5, foodNoise: 7, fadiga: 4 },
    { semana: '-5s', nausea: 4, foodNoise: 6, fadiga: 4 },
    { semana: '-4s', nausea: 4, foodNoise: 5, fadiga: 3 },
    { semana: '-3s', nausea: 3, foodNoise: 4, fadiga: 3 },
    { semana: '-2s', nausea: 3, foodNoise: 3, fadiga: 3 },
    { semana: '-1s', nausea: 2, foodNoise: 3, fadiga: 2 },
    { semana: 'hoje', nausea: 3, foodNoise: 2, fadiga: 4 },
  ]
}

function gerarPKMock(): number[] {
  // Padrão semanal: pico após dose (dia 0-1) → cai linearmente → trough antes próxima
  return [0.62, 0.55, 0.48, 0.42, 0.36, 0.31, 0.28, 0.55, 0.82, 0.94, 0.88, 0.78, 0.66, 0.54, 0.46]
}

// ============================================================
// COMPONENT
// ============================================================

export function GLP1Tab({
  paciente,
  onAjustarDose,
  onPausarTitulacao,
  onMensagemClinica,
}: Props) {
  const med = findGLP1(paciente.medicacaoAtiva)
  const [periodo, setPeriodo] = useState<'4s' | '8s' | '12s'>('8s')

  if (!med) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Paciente sem GLP-1 ativo.
        </p>
      </div>
    )
  }

  const drug = detectGLP1(med)!
  const injecoes = useMemo(
    () => gerarInjecoesMock(med.iniciadaEm, med.dose),
    [med.iniciadaEm, med.dose],
  )
  const sintomas = useMemo(() => gerarSintomasMock(), [])
  const pkSeries = useMemo(() => gerarPKMock(), [])

  // === MÉTRICAS DERIVADAS ===
  const ultimaInj = injecoes[0]
  const proximaISO = ultimaInj
    ? new Date(new Date(ultimaInj.data).getTime() + 7 * 86400000).toISOString()
    : null
  const diasParaProxima = proximaISO
    ? Math.round((new Date(proximaISO).getTime() - Date.now()) / 86400000)
    : null

  const aderencia = paciente.adesao30Dias.find(
    (a) => a.medicacao.toLowerCase() === med.nome.toLowerCase(),
  )
  const adesaoPct = Math.round((aderencia?.percentCumprido ?? 1) * 100)

  // Heatmap de sítios — contar uso por zona
  const sitioCount: Record<string, number> = {}
  for (const k of SITIO_KEYS) sitioCount[k] = 0
  for (const inj of injecoes) {
    if (sitioCount[inj.sitio] !== undefined) sitioCount[inj.sitio] += 1
  }
  const maxCount = Math.max(1, ...Object.values(sitioCount))
  // Saturação: 3 últimas iguais
  const ult3 = injecoes.slice(0, 3).map((i) => i.sitio)
  const saturado =
    ult3.length === 3 && ult3.every((s) => s === ult3[0]) ? ult3[0] : null

  // Food noise trend (média 4 últimas vs 4 anteriores)
  const fnRecente = sintomas.slice(-4).reduce((s, p) => s + p.foodNoise, 0) / 4
  const fnAnterior = sintomas.slice(0, 4).reduce((s, p) => s + p.foodNoise, 0) / 4
  const fnDelta = fnRecente - fnAnterior // negativo é bom (food noise caiu)

  // Status PK
  const nivelHoje = pkSeries[pkSeries.length - 4] ?? 0.5
  const statusPK =
    nivelHoje > 0.8
      ? { label: 'No pico', tone: 'emerald' as const, hint: 'Saciedade alta' }
      : nivelHoje > 0.5
        ? { label: 'Caindo', tone: 'amber' as const, hint: 'Efeito reduzindo' }
        : { label: 'Vale', tone: 'rose' as const, hint: 'Próximo da próxima dose' }

  // Semana de titulação — desde iniciadaEm
  const semDesdeInicio = Math.floor(
    (Date.now() - new Date(med.iniciadaEm).getTime()) / (7 * 86400000),
  )
  const fasesTitulacao: { semanas: number; dose: string }[] = [
    { semanas: 4, dose: '0,25mg' },
    { semanas: 4, dose: '0,5mg' },
    { semanas: 4, dose: '1,0mg' },
  ]
  let semCumuladas = 0
  let faseAtual = 0
  for (let i = 0; i < fasesTitulacao.length; i++) {
    if (semDesdeInicio < semCumuladas + fasesTitulacao[i].semanas) {
      faseAtual = i
      break
    }
    semCumuladas += fasesTitulacao[i].semanas
  }
  const semNaFase = semDesdeInicio - semCumuladas
  const semRestantes = fasesTitulacao[faseAtual].semanas - semNaFase
  const proximaDecisao =
    semRestantes <= 2
      ? semRestantes === 0
        ? 'agora'
        : `em ${semRestantes}sem`
      : `em ${semRestantes}sem`

  return (
    <div className="space-y-6">
      {/* HEADER GLP-1 */}
      <header className="relative overflow-hidden rounded-2xl border border-teal-200/60 bg-gradient-to-br from-teal-50 via-white to-slate-50 p-6 dark:border-teal-500/30 dark:from-teal-500/10 dark:via-slate-900 dark:to-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-500/15 text-teal-700 dark:text-teal-300">
              <Syringe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">
                GLP-1 · {drug} · titulação ativa
              </p>
              <h2 className="mt-1 text-[22px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
                {med.nome}{' '}
                <span className="font-mono text-[15px] text-slate-500 dark:text-slate-400">
                  {med.dose}
                </span>
              </h2>
              <p className="mt-0.5 text-[13px] text-slate-600 dark:text-slate-400">
                Fase {faseAtual + 1} de {fasesTitulacao.length} · semana {semNaFase + 1} de{' '}
                {fasesTitulacao[faseAtual].semanas} · iniciada{' '}
                {new Date(med.iniciadaEm).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Status PK */}
          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
              statusPK.tone === 'emerald'
                ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                : statusPK.tone === 'amber'
                  ? 'border-amber-200 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-500/10'
                  : 'border-rose-200 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/10'
            }`}
          >
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Nível estimado
              </div>
              <div
                className={`font-mono text-[18px] font-bold tabular-nums ${
                  statusPK.tone === 'emerald'
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : statusPK.tone === 'amber'
                      ? 'text-amber-700 dark:text-amber-300'
                      : 'text-rose-700 dark:text-rose-300'
                }`}
              >
                {statusPK.label}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {statusPK.hint}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* STAT CARDS — 4 colunas */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Adesão últimas 8 semanas"
          value={`${adesaoPct}`}
          unit="%"
          tone={adesaoPct >= 90 ? 'emerald' : adesaoPct >= 70 ? 'amber' : 'rose'}
          hint={`${injecoes.length} doses registradas`}
        />
        <StatCard
          label="Próxima decisão"
          value={proximaDecisao}
          unit=""
          tone={semRestantes <= 1 ? 'amber' : 'slate'}
          hint={
            faseAtual < fasesTitulacao.length - 1
              ? `Escalar pra ${fasesTitulacao[faseAtual + 1].dose}`
              : 'Manutenção ou pausa'
          }
        />
        <StatCard
          label="Food noise (média 30d)"
          value={fnRecente.toFixed(1)}
          unit="/ 10"
          tone={fnRecente <= 4 ? 'emerald' : fnRecente <= 6 ? 'amber' : 'rose'}
          trend={fnDelta}
          trendInverse
          hint={fnRecente <= 4 ? 'Resposta ótima' : 'Acompanhar'}
        />
        <StatCard
          label="Última aplicação"
          value={
            ultimaInj
              ? new Date(ultimaInj.data).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                })
              : '—'
          }
          unit={diasParaProxima !== null ? `· próx em ${diasParaProxima}d` : ''}
          tone="slate"
          hint={ultimaInj ? `${SITIO_LABEL[ultimaInj.sitio]} · dor ${ultimaInj.dor}/10` : ''}
        />
      </div>

      {/* PK CURVE — full width */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">
              Curva farmacocinética
            </p>
            <h3 className="mt-0.5 text-[16px] font-semibold text-slate-900 dark:text-slate-50">
              Nível estimado ao longo do tempo
            </h3>
          </div>
          <div className="flex gap-1">
            {(['4s', '8s', '12s'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`rounded-md px-2.5 py-1 font-mono text-[11px] tabular-nums transition-all ${
                  periodo === p
                    ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800/60 dark:text-slate-500 dark:hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <PKChart series={pkSeries} />
        <div className="mt-2 flex items-start gap-1.5">
          <HelpCircle size={11} className="mt-px shrink-0 text-slate-400" />
          <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-500">
            Estimativa farmacocinética populacional. Não substitui medição clínica.
          </p>
        </div>
      </section>

      {/* 2-COL: Sítios + Sintomas */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Sítios */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">
            Rotação de sítios · últimas {injecoes.length} doses
          </p>
          <h3 className="mt-0.5 text-[15px] font-semibold text-slate-900 dark:text-slate-50">
            Heatmap de aplicação
          </h3>

          {saturado && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border-l-[3px] border-amber-500 bg-amber-50 px-3 py-2 dark:border-amber-400 dark:bg-amber-500/10">
              <AlertTriangle
                size={14}
                className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300"
              />
              <p className="text-[12px] leading-snug text-amber-900 dark:text-amber-200">
                Paciente aplicou 3 doses consecutivas em{' '}
                <strong>{SITIO_LABEL[saturado]}</strong>. Considere orientar rotação na próxima
                mensagem ou consulta — risco de lipodistrofia.
              </p>
            </div>
          )}

          <div className="mt-4 grid grid-cols-4 gap-2">
            {SITIO_KEYS.map((s) => {
              const count = sitioCount[s]
              const intensity = count / maxCount
              const isSaturado = saturado === s
              return (
                <div
                  key={s}
                  className={`rounded-xl border p-3 transition-colors ${
                    isSaturado
                      ? 'border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-500/15'
                      : count === 0
                        ? 'border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-800/30'
                        : 'border-slate-200 dark:border-slate-700'
                  }`}
                  style={
                    count > 0 && !isSaturado
                      ? {
                          backgroundColor: `rgba(20, 184, 166, ${0.08 + intensity * 0.18})`,
                        }
                      : undefined
                  }
                >
                  <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {SITIO_LABEL[s].replace('Abd. ', 'Abdômen ').replace('Coxa ', 'Coxa ')}
                  </div>
                  <div className="mt-1 font-mono text-[16px] font-bold tabular-nums text-slate-900 dark:text-slate-100">
                    {count}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-500">
                    {count === 0 ? 'nunca' : count === 1 ? '1 dose' : `${count} doses`}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Sintomas */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">
            Sintomas pós-dose · 8 semanas
          </p>
          <h3 className="mt-0.5 text-[15px] font-semibold text-slate-900 dark:text-slate-50">
            Náusea · Food noise · Fadiga
          </h3>

          <SymptomChart sintomas={sintomas} />

          <div className="mt-3 flex flex-wrap gap-3 text-[11px]">
            <LegendDot color="bg-rose-500" label="Náusea" />
            <LegendDot color="bg-teal-500" label="Food noise" />
            <LegendDot color="bg-amber-500" label="Fadiga" />
          </div>
        </section>
      </div>

      {/* AÇÕES */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <button
          onClick={() => onAjustarDose?.(med.nome)}
          className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
        >
          <Edit3 className="h-4 w-4" />
          Ajustar dose · Memed
        </button>
        <button
          onClick={onMensagemClinica}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <MessageSquare className="h-4 w-4" />
          Mensagem clínica
        </button>
        <button
          onClick={() => onPausarTitulacao?.(med.nome)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Pause className="h-4 w-4" />
          Pausar titulação
        </button>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          Próxima decisão recomendada: {proximaDecisao}
        </span>
      </div>
    </div>
  )
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function StatCard({
  label,
  value,
  unit,
  tone,
  hint,
  trend,
  trendInverse = false,
}: {
  label: string
  value: string
  unit: string
  tone: 'emerald' | 'amber' | 'rose' | 'slate'
  hint?: string
  trend?: number
  /** Inverte sentido (food noise menor é melhor). */
  trendInverse?: boolean
}) {
  const toneCls =
    tone === 'emerald'
      ? 'text-emerald-700 dark:text-emerald-300'
      : tone === 'amber'
        ? 'text-amber-700 dark:text-amber-300'
        : tone === 'rose'
          ? 'text-rose-700 dark:text-rose-300'
          : 'text-slate-900 dark:text-slate-100'

  const trendChip = (() => {
    if (trend === undefined) return null
    const good = trendInverse ? trend < 0 : trend > 0
    const flat = Math.abs(trend) < 0.5
    const Icon = flat ? Minus : good ? TrendingUp : TrendingDown
    const cls = flat
      ? 'text-slate-500 bg-slate-500/10'
      : good
        ? 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-300 dark:bg-emerald-400/10'
        : 'text-rose-700 bg-rose-500/10 dark:text-rose-300 dark:bg-rose-400/10'
    const sign = trend > 0 ? '+' : trend < 0 ? '−' : ''
    return (
      <span
        className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-medium ${cls}`}
      >
        <Icon className="h-2.5 w-2.5" />
        {sign}
        {Math.abs(trend).toFixed(1)}
      </span>
    )
  })()

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
        {trendChip}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={`font-mono text-[22px] font-bold tabular-nums ${toneCls}`}>
          {value}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">{unit}</span>
      </div>
      {hint && (
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-500">{hint}</p>
      )}
    </section>
  )
}

const PK_W = 720
const PK_H = 180
const PK_PAD = { top: 14, right: 16, bottom: 24, left: 16 }
const PK_PLOT_W = PK_W - PK_PAD.left - PK_PAD.right
const PK_PLOT_H = PK_H - PK_PAD.top - PK_PAD.bottom

function PKChart({ series }: { series: number[] }) {
  if (series.length < 2) return null
  const n = series.length
  const xs = series.map(
    (_, i) => PK_PAD.left + (i * PK_PLOT_W) / Math.max(1, n - 1),
  )
  const ys = series.map(
    (v) => PK_PAD.top + PK_PLOT_H * (1 - Math.max(0, Math.min(1, v))),
  )
  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')
  const areaPath = `${linePath} L${xs[n - 1]},${PK_PAD.top + PK_PLOT_H} L${xs[0]},${PK_PAD.top + PK_PLOT_H} Z`

  // Marker last solid (hoje); últimos 3 são projeção
  const lastSolid = n - 4
  const hojeX = xs[lastSolid]
  const hojeY = ys[lastSolid]

  // Split solid/dashed
  const solidPath = xs
    .slice(0, lastSolid + 1)
    .map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`)
    .join(' ')
  const dashedPath = xs
    .slice(lastSolid)
    .map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[lastSolid + i]}`)
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${PK_W} ${PK_H}`}
      className="h-auto w-full"
      preserveAspectRatio="none"
    >
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={PK_PAD.left}
          x2={PK_W - PK_PAD.right}
          y1={PK_PAD.top + PK_PLOT_H * f}
          y2={PK_PAD.top + PK_PLOT_H * f}
          className="stroke-slate-200 dark:stroke-slate-800"
          strokeWidth={1}
        />
      ))}
      <line
        x1={hojeX}
        x2={hojeX}
        y1={PK_PAD.top}
        y2={PK_PAD.top + PK_PLOT_H}
        className="stroke-slate-400 dark:stroke-slate-600"
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <path d={areaPath} fill="rgb(20 184 166 / 0.10)" />
      <path
        d={solidPath}
        className="stroke-teal-500 dark:stroke-teal-300"
        strokeWidth={2.4}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={dashedPath}
        className="stroke-teal-500 dark:stroke-teal-300"
        strokeWidth={2.2}
        fill="none"
        strokeDasharray="4 3"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.5}
      />
      <circle cx={hojeX} cy={hojeY} r={5} className="fill-teal-600 dark:fill-teal-400" />
      <circle
        cx={hojeX}
        cy={hojeY}
        r={10}
        fill="none"
        className="stroke-teal-500 dark:stroke-teal-400"
        strokeOpacity={0.35}
        strokeWidth={2}
      />
      <text
        x={hojeX}
        y={PK_H - 6}
        textAnchor="middle"
        fontSize={11}
        fontFamily="ui-monospace, monospace"
        className="fill-teal-600 dark:fill-teal-300"
      >
        hoje
      </text>
      <text
        x={xs[0]}
        y={PK_H - 6}
        textAnchor="start"
        fontSize={11}
        fontFamily="ui-monospace, monospace"
        className="fill-slate-500 dark:fill-slate-500"
      >
        -{n - 1}d
      </text>
      <text
        x={xs[n - 1]}
        y={PK_H - 6}
        textAnchor="end"
        fontSize={11}
        fontFamily="ui-monospace, monospace"
        className="fill-slate-500 dark:fill-slate-500"
      >
        +{n - 1 - lastSolid}d
      </text>
    </svg>
  )
}

const SYM_W = 540
const SYM_H = 160
const SYM_PAD = { top: 12, right: 12, bottom: 24, left: 12 }
const SYM_PLOT_W = SYM_W - SYM_PAD.left - SYM_PAD.right
const SYM_PLOT_H = SYM_H - SYM_PAD.top - SYM_PAD.bottom

function SymptomChart({ sintomas }: { sintomas: SintomaMock[] }) {
  const n = sintomas.length
  const xs = sintomas.map(
    (_, i) => SYM_PAD.left + (i * SYM_PLOT_W) / Math.max(1, n - 1),
  )

  function path(key: keyof Omit<SintomaMock, 'semana'>) {
    return sintomas
      .map((s, i) => {
        const y = SYM_PAD.top + SYM_PLOT_H * (1 - s[key] / 10)
        return `${i === 0 ? 'M' : 'L'}${xs[i]},${y}`
      })
      .join(' ')
  }

  return (
    <svg viewBox={`0 0 ${SYM_W} ${SYM_H}`} className="h-auto w-full">
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={SYM_PAD.left}
          x2={SYM_W - SYM_PAD.right}
          y1={SYM_PAD.top + SYM_PLOT_H * f}
          y2={SYM_PAD.top + SYM_PLOT_H * f}
          className="stroke-slate-200 dark:stroke-slate-800"
          strokeWidth={1}
        />
      ))}
      <path
        d={path('nausea')}
        className="stroke-rose-500 dark:stroke-rose-400"
        strokeWidth={2.2}
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d={path('foodNoise')}
        className="stroke-teal-500 dark:stroke-teal-400"
        strokeWidth={2.2}
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d={path('fadiga')}
        className="stroke-amber-500 dark:stroke-amber-400"
        strokeWidth={2.2}
        fill="none"
        strokeLinejoin="round"
        opacity={0.6}
      />
      {sintomas.map((s, i) => (
        <text
          key={i}
          x={xs[i]}
          y={SYM_H - 6}
          textAnchor="middle"
          fontSize={10}
          fontFamily="ui-monospace, monospace"
          className={`fill-slate-500 ${i === n - 1 ? 'dark:fill-teal-300' : 'dark:fill-slate-500'}`}
        >
          {s.semana}
        </text>
      ))}
    </svg>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </div>
  )
}
