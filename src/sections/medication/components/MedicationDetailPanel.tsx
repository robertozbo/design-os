import { Check, ExternalLink, HelpCircle, MapPin, Pill, Syringe } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  SITIO_LABELS,
  STATUS_PK_LABEL,
  type CurvaPK,
  type MedicacaoAtiva,
  type PeriodoPK,
  type RegistroInjecao,
  type ResumoHoje,
  type StatusPK,
} from '@/../product/sections/medication/types'

interface Props {
  medicacao: MedicacaoAtiva | null
  curva?: CurvaPK | null
  injecoes?: RegistroInjecao[]
  resumoHoje?: ResumoHoje | null
  adesaoSeries?: number[]
  onAplicarDose?: (medicacaoId: string) => void
  onMarcarComprimido?: (medicacaoId: string) => void
  onMarcarDose?: (doseId: string) => void
  onAbrirReceitaMemed?: (medicacaoId: string) => void
}

const PERIODOS: PeriodoPK[] = ['14D', '30D', '90D']

const STATUS_COLOR: Record<StatusPK, string> = {
  no_pico: 'text-emerald-600 dark:text-emerald-300',
  subindo: 'text-teal-600 dark:text-teal-300',
  caindo: 'text-amber-600 dark:text-amber-300',
  vale: 'text-rose-600 dark:text-rose-300',
}

const STATUS_HINT: Record<StatusPK, string> = {
  no_pico: 'Saciedade alta esperada',
  subindo: 'Efeito aumentando',
  caindo: 'Efeito reduzindo',
  vale: 'Próximo da próxima dose',
}

const W = 560
const H = 220
const PADDING = { top: 18, right: 24, bottom: 30, left: 24 }
const PLOT_W = W - PADDING.left - PADDING.right
const PLOT_H = H - PADDING.top - PADDING.bottom

function formatTick(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${d}/${Number(m)}`
}

function diasEntre(aISO: string, b: Date): number {
  return Math.round((b.getTime() - new Date(aISO).getTime()) / 86400000)
}

function isGlp1Injetavel(m: MedicacaoAtiva): boolean {
  return m.categoria === 'glp1_injetavel' || m.via === 'subcutanea'
}

function isGlp1Oral(m: MedicacaoAtiva): boolean {
  return m.categoria === 'glp1_oral'
}

function dosePendenteDe(
  med: MedicacaoAtiva,
  resumo: ResumoHoje | null | undefined,
): { id: string; horario: string } | null {
  if (!resumo) return null
  const d = resumo.doses.find(
    (x) =>
      x.nome.toLowerCase() === med.nome.toLowerCase() && x.status === 'pendente',
  )
  return d ? { id: d.id, horario: d.horario } : null
}

function diaMesISO(iso: string): { dia: string; mes: string } {
  const [, m, d] = iso.split('T')[0].split('-')
  return { dia: d, mes: m }
}

export function MedicationDetailPanel({
  medicacao,
  curva = null,
  injecoes = [],
  resumoHoje = null,
  adesaoSeries = [],
  onAplicarDose,
  onMarcarComprimido,
  onMarcarDose,
  onAbrirReceitaMemed,
}: Props) {
  const [periodo, setPeriodo] = useState<PeriodoPK>('14D')

  if (!medicacao) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/40 p-10 text-center dark:border-slate-800 dark:bg-slate-900/30">
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
          Selecione uma medicação acima pra ver o detalhe e administrar a dose.
        </p>
      </div>
    )
  }

  const isInjetavel = isGlp1Injetavel(medicacao)
  const isOralGLP1 = isGlp1Oral(medicacao)
  const dosePendente = dosePendenteDe(medicacao, resumoHoje)
  const ultimaInjecao = useMemo(
    () => injecoes.find((i) => i.medicacaoId === medicacao.id) ?? null,
    [injecoes, medicacao.id],
  )

  // Calcula info da "próxima dose"
  const proximaInfo = useMemo(() => {
    if (isInjetavel && ultimaInjecao) {
      const proxima = new Date(ultimaInjecao.aplicadoEm)
      proxima.setDate(proxima.getDate() + 7)
      const dias = diasEntre(proxima.toISOString(), new Date())
      const { dia, mes } = diaMesISO(proxima.toISOString())
      return {
        dataLabel: `${dia}/${Number(mes)}`,
        countdown:
          dias === 0
            ? 'hoje'
            : dias > 0
              ? `atrasada ${dias}d`
              : `em ${Math.abs(dias)}d`,
        tone:
          dias > 0 ? 'rose' : dias === 0 ? 'teal' : ('teal' as 'rose' | 'teal'),
      }
    }
    if (dosePendente) {
      return {
        dataLabel: 'hoje',
        countdown: dosePendente.horario,
        tone: 'teal' as const,
      }
    }
    return null
  }, [isInjetavel, ultimaInjecao, dosePendente])

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-900/60">
      {/* Header bar full width */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300">
            {isInjetavel ? (
              <Syringe className="h-5 w-5" />
            ) : (
              <Pill className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {isInjetavel
                ? 'GLP-1 injetável · curva PK'
                : isOralGLP1
                  ? 'GLP-1 oral · adesão'
                  : 'Histórico de adesão'}
            </div>
            <div className="mt-0.5 text-[20px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
              {medicacao.nome}{' '}
              <span className="font-mono text-[15px] text-slate-500 dark:text-slate-400">
                {medicacao.dose}
              </span>
            </div>
            <p className="mt-0.5 text-[12.5px] text-slate-500 dark:text-slate-400">
              {medicacao.posologia}
            </p>
          </div>
        </div>

        {isInjetavel && curva && (
          <div className="text-right">
            <div
              className={`font-mono text-[16px] font-bold tabular-nums ${STATUS_COLOR[curva.statusHoje]}`}
            >
              {STATUS_PK_LABEL[curva.statusHoje]}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {STATUS_HINT[curva.statusHoje]}
            </div>
          </div>
        )}
      </div>

      {/* 2-col grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT: Próxima dose + CTA */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Próxima dose
            </div>
            {proximaInfo ? (
              <div className="mt-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-[42px] font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-50">
                    {proximaInfo.dataLabel}
                  </span>
                  <span
                    className={`font-mono text-[14px] font-bold tabular-nums ${
                      proximaInfo.tone === 'rose'
                        ? 'text-rose-600 dark:text-rose-300'
                        : 'text-teal-600 dark:text-teal-300'
                    }`}
                  >
                    {proximaInfo.countdown}
                  </span>
                </div>
                {medicacao.proximaDoseLabel && (
                  <p className="mt-1 text-[12.5px] text-slate-500 dark:text-slate-400">
                    {medicacao.proximaDoseLabel}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-2 rounded-xl bg-emerald-500/10 px-4 py-3 dark:bg-emerald-400/10">
                <p className="text-[13px] font-medium text-emerald-700 dark:text-emerald-300">
                  Sem doses pendentes
                </p>
                <p className="mt-0.5 text-[11.5px] text-emerald-700/80 dark:text-emerald-200/80">
                  Você está em dia com essa medicação.
                </p>
              </div>
            )}
          </div>

          {/* Última aplicação / dose */}
          {ultimaInjecao ? (
            <div className="rounded-xl border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">
                Última aplicação
              </div>
              <div className="font-mono text-[13px] tabular-nums text-slate-700 dark:text-slate-200">
                {ultimaInjecao.aplicadoEmLabel}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                <MapPin size={11} />
                {SITIO_LABELS[ultimaInjecao.sitio]}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                <span className="font-mono">dor {ultimaInjecao.dor}/10</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">
                Adesão 30d
              </div>
              <div
                className={`text-[24px] font-semibold tabular-nums ${
                  medicacao.adesao30d >= 90
                    ? 'text-emerald-600 dark:text-emerald-300'
                    : medicacao.adesao30d >= 70
                      ? 'text-amber-600 dark:text-amber-300'
                      : 'text-rose-600 dark:text-rose-300'
                }`}
              >
                {medicacao.adesao30d}%
              </div>
              <div className="mt-0.5 text-[11.5px] text-slate-500 dark:text-slate-400">
                início {medicacao.iniciadaEm} · {medicacao.duracaoLabel.toLowerCase()}
              </div>
            </div>
          )}

          {/* Orientação */}
          {medicacao.orientacao && (
            <div className="rounded-xl border-l-[3px] border-teal-500 bg-teal-50/60 px-4 py-3 dark:border-teal-400 dark:bg-teal-500/5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                Orientação do médico
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-700 dark:text-slate-200">
                {medicacao.orientacao}
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto flex flex-wrap items-center gap-2">
            {isInjetavel && (
              <button
                type="button"
                onClick={() => onAplicarDose?.(medicacao.id)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
              >
                <Syringe className="h-4 w-4" />
                Administrar dose
              </button>
            )}
            {isOralGLP1 && (
              <button
                type="button"
                onClick={() => onMarcarComprimido?.(medicacao.id)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
              >
                <Check className="h-4 w-4" />
                Marcar comprimido
              </button>
            )}
            {!isInjetavel && !isOralGLP1 && dosePendente && (
              <button
                type="button"
                onClick={() => onMarcarDose?.(dosePendente.id)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
              >
                <Check className="h-4 w-4" />
                Marcar dose · {dosePendente.horario}
              </button>
            )}
            {medicacao.memedId && (
              <button
                type="button"
                onClick={() => onAbrirReceitaMemed?.(medicacao.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Receita
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Chart */}
        <div className="lg:col-span-7 flex flex-col">
          {isInjetavel && curva && (
            <div className="mb-3 flex gap-1">
              {PERIODOS.map((p) => {
                const active = p === periodo
                return (
                  <button
                    key={p}
                    onClick={() => setPeriodo(p)}
                    className={`rounded-md px-2.5 py-1 font-mono text-[11px] tabular-nums transition-all ${
                      active
                        ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800/60 dark:text-slate-500 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
          )}

          <div className="flex-1 rounded-2xl border border-slate-200 bg-white/40 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            {isInjetavel && curva ? (
              <PKChart curva={curva} periodo={periodo} />
            ) : (
              <AdesaoChart series={adesaoSeries} />
            )}
          </div>

          {isInjetavel && curva && (
            <div className="mt-2 flex items-start gap-1.5">
              <HelpCircle
                size={11}
                className="mt-px shrink-0 text-slate-400 dark:text-slate-600"
              />
              <p className="text-[10.5px] leading-snug text-slate-500 dark:text-slate-500">
                Estimativa baseada em farmacocinética populacional. Não substitui medição clínica.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// PK chart
// ============================================================
function PKChart({ curva, periodo }: { curva: CurvaPK; periodo: PeriodoPK }) {
  const pontos = useMemo(() => {
    const dias = periodo === '14D' ? 14 : periodo === '30D' ? 30 : 90
    return curva.pontos.slice(-dias)
  }, [curva.pontos, periodo])

  if (pontos.length === 0) return null

  const n = pontos.length
  const xs = pontos.map(
    (_, i) => PADDING.left + (i * PLOT_W) / Math.max(1, n - 1),
  )
  const ys = pontos.map(
    (p) => PADDING.top + PLOT_H * (1 - Math.max(0, Math.min(1, p.nivel))),
  )

  let solidPath = ''
  let dashedPath = ''
  let crossover = -1
  pontos.forEach((p, i) => {
    if (!p.projetado) {
      solidPath += i === 0 ? `M${xs[i]},${ys[i]}` : ` L${xs[i]},${ys[i]}`
    } else {
      if (crossover === -1) {
        crossover = i
        dashedPath = `M${xs[i - 1]},${ys[i - 1]} L${xs[i]},${ys[i]}`
      } else {
        dashedPath += ` L${xs[i]},${ys[i]}`
      }
    }
  })

  let areaPath = ''
  pontos.forEach((p, i) => {
    if (p.projetado) return
    areaPath += i === 0 ? `M${xs[i]},${ys[i]}` : ` L${xs[i]},${ys[i]}`
  })
  const lastSolid = crossover === -1 ? n - 1 : crossover - 1
  if (lastSolid >= 0) {
    areaPath += ` L${xs[lastSolid]},${PADDING.top + PLOT_H} L${xs[0]},${PADDING.top + PLOT_H} Z`
  }
  const hojeX = xs[lastSolid]
  const hojeY = ys[lastSolid]
  const ticks = [0, Math.floor(lastSolid / 2), lastSolid]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      preserveAspectRatio="none"
    >
      {[0.25, 0.5, 0.75].map((frac) => {
        const y = PADDING.top + PLOT_H * frac
        return (
          <line
            key={frac}
            x1={PADDING.left}
            x2={W - PADDING.right}
            y1={y}
            y2={y}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth={1}
          />
        )
      })}
      {lastSolid >= 0 && (
        <line
          x1={hojeX}
          x2={hojeX}
          y1={PADDING.top}
          y2={PADDING.top + PLOT_H}
          className="stroke-slate-400 dark:stroke-slate-600"
          strokeWidth={1}
          strokeDasharray="2 3"
        />
      )}
      {areaPath && <path d={areaPath} fill="rgb(20 184 166 / 0.10)" stroke="none" />}
      {solidPath && (
        <path
          d={solidPath}
          className="stroke-teal-500 dark:stroke-teal-300"
          strokeWidth={2.4}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
      {dashedPath && (
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
      )}
      {lastSolid >= 0 && (
        <>
          <circle
            cx={hojeX}
            cy={hojeY}
            r={5}
            className="fill-teal-600 dark:fill-teal-400"
          />
          <circle
            cx={hojeX}
            cy={hojeY}
            r={10}
            fill="none"
            className="stroke-teal-500 dark:stroke-teal-400"
            strokeOpacity={0.35}
            strokeWidth={2}
          />
        </>
      )}
      {ticks.map((i) => {
        if (i < 0 || i >= pontos.length) return null
        return (
          <text
            key={i}
            x={xs[i]}
            y={H - 8}
            textAnchor="middle"
            fontSize={11}
            fontFamily="ui-monospace, monospace"
            className="fill-slate-500 dark:fill-slate-500"
          >
            {formatTick(pontos[i].data)}
          </text>
        )
      })}
      {lastSolid >= 0 && lastSolid !== ticks[2] && (
        <text
          x={hojeX}
          y={H - 8}
          textAnchor="middle"
          fontSize={11}
          fontFamily="ui-monospace, monospace"
          className="fill-teal-600 dark:fill-teal-300"
        >
          hoje
        </text>
      )}
    </svg>
  )
}

// ============================================================
// Adesão chart (non GLP-1)
// ============================================================
function AdesaoChart({ series }: { series: number[] }) {
  if (series.length < 2) {
    return (
      <div
        className="flex w-full items-center justify-center"
        style={{ minHeight: H }}
      >
        <p className="text-[12px] text-slate-500 dark:text-slate-500">
          Sem dados suficientes.
        </p>
      </div>
    )
  }

  const min = Math.min(...series, 50)
  const max = 100
  const range = max - min || 1
  const n = series.length
  const xs = series.map(
    (_, i) => PADDING.left + (i * PLOT_W) / Math.max(1, n - 1),
  )
  const ys = series.map((v) => PADDING.top + PLOT_H * (1 - (v - min) / range))

  const linePath = xs
    .map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`)
    .join(' ')
  const areaPath =
    `${linePath} L${xs[n - 1]},${PADDING.top + PLOT_H} L${xs[0]},${PADDING.top + PLOT_H} Z`

  const ref90Y = PADDING.top + PLOT_H * (1 - (90 - min) / range)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      preserveAspectRatio="none"
    >
      {[0.25, 0.5, 0.75].map((frac) => {
        const y = PADDING.top + PLOT_H * frac
        return (
          <line
            key={frac}
            x1={PADDING.left}
            x2={W - PADDING.right}
            y1={y}
            y2={y}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth={1}
          />
        )
      })}
      <line
        x1={PADDING.left}
        x2={W - PADDING.right}
        y1={ref90Y}
        y2={ref90Y}
        className="stroke-emerald-400/50 dark:stroke-emerald-400/40"
        strokeWidth={1}
        strokeDasharray="3 4"
      />
      <text
        x={W - PADDING.right}
        y={ref90Y - 4}
        textAnchor="end"
        fontSize={10}
        fontFamily="ui-monospace, monospace"
        className="fill-emerald-600 dark:fill-emerald-400"
      >
        meta 90%
      </text>
      <path d={areaPath} fill="rgb(16 185 129 / 0.12)" stroke="none" />
      <path
        d={linePath}
        className="stroke-emerald-500 dark:stroke-emerald-400"
        strokeWidth={2.4}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={xs[n - 1]}
        cy={ys[n - 1]}
        r={5}
        className="fill-emerald-600 dark:fill-emerald-400"
      />
      <circle
        cx={xs[n - 1]}
        cy={ys[n - 1]}
        r={10}
        fill="none"
        className="stroke-emerald-500 dark:stroke-emerald-400"
        strokeOpacity={0.35}
        strokeWidth={2}
      />
      <text
        x={xs[0]}
        y={H - 8}
        textAnchor="start"
        fontSize={11}
        fontFamily="ui-monospace, monospace"
        className="fill-slate-500 dark:fill-slate-500"
      >
        -{n - 1}d
      </text>
      <text
        x={xs[Math.floor(n / 2)]}
        y={H - 8}
        textAnchor="middle"
        fontSize={11}
        fontFamily="ui-monospace, monospace"
        className="fill-slate-500 dark:fill-slate-500"
      >
        -{Math.floor(n / 2)}d
      </text>
      <text
        x={xs[n - 1]}
        y={H - 8}
        textAnchor="end"
        fontSize={11}
        fontFamily="ui-monospace, monospace"
        className="fill-emerald-600 dark:fill-emerald-300"
      >
        hoje
      </text>
    </svg>
  )
}
