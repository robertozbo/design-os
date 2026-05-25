import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Pencil,
  Sparkles,
  TrendingDown,
  XCircle,
} from 'lucide-react'
import type {
  AdesaoBreakdown,
  NutricaoData,
  PlanoVigente,
  RefeicaoDiario,
} from '@/../product/sections/pacientes/types'

interface NutricaoTabProps {
  data: NutricaoData
  onTrocarPlano?: () => void
}

function adherenceColor(percent: number) {
  if (percent >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (percent >= 65) return 'text-amber-600 dark:text-amber-400'
  return 'text-orange-600 dark:text-orange-400'
}

function adherenceBg(percent: number) {
  if (percent >= 80) return 'bg-emerald-500'
  if (percent >= 65) return 'bg-amber-500'
  return 'bg-orange-500'
}

export function NutricaoTab({ data, onTrocarPlano }: NutricaoTabProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* Left col 2/3 — plano + diário */}
      <div className="space-y-5 lg:col-span-2">
        {data.planoVigente && <PlanoVigenteCard plano={data.planoVigente} onTrocar={onTrocarPlano} />}

        {/* Diário recente */}
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <header className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                <Camera size={14} className="text-teal-600 dark:text-teal-400" />
                Diário alimentar
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Refeições registradas pelo paciente no app · análise por IA
              </p>
            </div>
            <a
              href="/professional/pacientes/diario"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Ver tudo <ArrowRight size={11} />
            </a>
          </header>

          <div className="mt-4 space-y-3">
            {data.diarioRecente.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Paciente ainda não registrou refeições.
              </p>
            ) : (
              data.diarioRecente.map((refeicao) => (
                <RefeicaoCard key={refeicao.id} refeicao={refeicao} />
              ))
            )}
          </div>
        </article>
      </div>

      {/* Right col 1/3 — adesão */}
      <div className="space-y-5">
        <AdesaoCard adesao={data.adesao} />
      </div>
    </div>
  )
}

function PlanoVigenteCard({
  plano,
  onTrocar,
}: {
  plano: PlanoVigente
  onTrocar?: () => void
}) {
  const expiraDate = new Date(plano.validoAte)
  const today = new Date()
  const daysUntilExpiry = Math.ceil(
    (expiraDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <article className="overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50/50 p-5 dark:border-teal-800 dark:from-teal-950/30 dark:via-slate-900 dark:to-emerald-950/20">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
            Plano vigente
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {plano.name}
          </h2>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
            Base · {plano.templateBase}
          </p>
        </div>
        <button
          type="button"
          onClick={onTrocar}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Pencil size={12} />
          Trocar plano
        </button>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <PlanoStat label="Adesão acumulada" value={`${plano.adesaoAcumulada}%`} tone={adherenceColor(plano.adesaoAcumulada)} />
        <PlanoStat label="Meta calórica" value={`${plano.metaCalorica}`} unit="kcal/dia" />
        <PlanoStat label="Proteína" value={`${plano.metaProteina}`} unit="g/dia" />
        <PlanoStat
          label="Expira em"
          value={`${daysUntilExpiry}`}
          unit="dias"
          tone={daysUntilExpiry < 30 ? 'text-amber-600 dark:text-amber-400' : undefined}
        />
      </div>
    </article>
  )
}

function PlanoStat({
  label,
  value,
  unit,
  tone,
}: {
  label: string
  value: string
  unit?: string
  tone?: string
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className={`mt-1 flex items-baseline gap-1 ${tone ?? 'text-slate-900 dark:text-slate-50'}`}>
        <span className="font-mono text-lg font-semibold tabular-nums">{value}</span>
        {unit && <span className="text-[10px] text-slate-500 dark:text-slate-400">{unit}</span>}
      </p>
    </div>
  )
}

function RefeicaoCard({ refeicao }: { refeicao: RefeicaoDiario }) {
  return (
    <article
      className={`flex gap-3 rounded-xl border p-3 ${
        refeicao.withinPlan
          ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40'
          : 'border-orange-200 bg-orange-50/40 dark:border-orange-800 dark:bg-orange-900/10'
      }`}
    >
      {/* Photo placeholder */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500 dark:from-slate-800 dark:to-slate-700 dark:text-slate-500">
        <Camera size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {refeicao.meal}
          </h3>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-500">
            <Clock size={10} />
            {refeicao.time}
          </span>
          {refeicao.withinPlan ? (
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={11} />
              No plano
            </span>
          ) : (
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-orange-700 dark:text-orange-400">
              <XCircle size={11} />
              Fora do plano
            </span>
          )}
        </div>

        <p className="mt-1 truncate text-xs text-slate-600 dark:text-slate-400">
          {refeicao.alimentos.join(' · ')}
        </p>

        <div className="mt-1.5 flex items-center gap-3">
          <span className="font-mono text-[11px] tabular-nums text-slate-700 dark:text-slate-300">
            {refeicao.calories} kcal
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="font-mono text-[11px] tabular-nums text-slate-700 dark:text-slate-300">
            {refeicao.protein}g prot
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
            <Sparkles size={9} />
            IA {Math.round(refeicao.aiConfidence * 100)}%
          </span>
        </div>

        {refeicao.deviationNote && (
          <p className="mt-1.5 rounded-md bg-orange-100 px-2 py-1 text-[11px] text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
            {refeicao.deviationNote}
          </p>
        )}
      </div>
    </article>
  )
}

function AdesaoCard({ adesao }: { adesao: AdesaoBreakdown }) {
  return (
    <>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-100 pb-3 dark:border-slate-800">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Adesão à dieta
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            Plano vigente vs realidade do diário
          </p>
        </header>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <AdesaoMetric label="Últimos 7 dias" value={adesao.geral7d} />
          <AdesaoMetric label="Últimos 30 dias" value={adesao.geral30d} />
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Por refeição
          </p>
          <div className="mt-2 space-y-2">
            {adesao.porRefeicao.map((r) => (
              <div key={r.meal} className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-700 dark:text-slate-300">{r.meal}</span>
                  <span className={`font-mono text-xs font-semibold tabular-nums ${adherenceColor(r.percent)}`}>
                    {r.percent}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full ${adherenceBg(r.percent)} transition-all duration-500`}
                    style={{ width: `${r.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <div className="flex items-start gap-2">
          <TrendingDown size={16} className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-400" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Padrão detectado
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-amber-900 dark:text-amber-200">
              {adesao.padraoDestaque}
            </p>
          </div>
        </div>
      </article>
    </>
  )
}

function AdesaoMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-950/40">
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className={`mt-1 font-mono text-2xl font-semibold tabular-nums ${adherenceColor(value)}`}>
        {value}%
      </p>
    </div>
  )
}
