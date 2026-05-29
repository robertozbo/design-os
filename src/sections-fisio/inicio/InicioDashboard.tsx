import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Info,
  Send,
  Sparkles,
  TrendingUp,
  UserPlus,
} from 'lucide-react'
import data from '@/../product-fisio/sections/inicio/data.json'
import type {
  AlertaClinico,
  AtividadeRecenteItem,
  KPIMes,
  KPIsDia,
  ProximaSessao,
  SeveridadeAlerta,
  TipoAtividade,
} from '@/../product-fisio/sections/inicio/types'

const saudacao = data.saudacao as { texto: string; dataExtenso: string }
const kpisDia = data.kpisDia as KPIsDia
const proximas = data.proximasSessoes as ProximaSessao[]
const alertas = data.alertasClinicos as AlertaClinico[]
const atividade = data.atividadeRecente as AtividadeRecenteItem[]
const kpisMes = data.kpisMes as KPIMes[]

function severidadeStyle(s: SeveridadeAlerta) {
  if (s === 'risco') {
    return {
      icon: AlertTriangle,
      iconClass: 'text-rose-600 dark:text-rose-400',
      borderClass: 'border-l-4 border-l-rose-500 dark:border-l-rose-600',
    }
  }
  if (s === 'atencao') {
    return {
      icon: AlertCircle,
      iconClass: 'text-amber-600 dark:text-amber-400',
      borderClass: 'border-l-4 border-l-amber-500 dark:border-l-amber-600',
    }
  }
  return {
    icon: Info,
    iconClass: 'text-sky-600 dark:text-sky-400',
    borderClass: 'border-l-4 border-l-sky-500 dark:border-l-sky-600',
  }
}

function tipoAtividadeIcon(t: TipoAtividade) {
  switch (t) {
    case 'evolucao':
      return { icon: Activity, color: 'bg-teal-500' }
    case 'avaliacao':
      return { icon: ClipboardList, color: 'bg-indigo-500' }
    case 'novo-paciente':
      return { icon: UserPlus, color: 'bg-emerald-500' }
    case 'convite-aceito':
      return { icon: CheckCircle2, color: 'bg-emerald-500' }
    case 'falta':
      return { icon: AlertCircle, color: 'bg-rose-500' }
    case 'alta':
      return { icon: Sparkles, color: 'bg-amber-500' }
  }
}

function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function evaColor(eva: number) {
  if (eva <= 3) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
  if (eva <= 6) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
  return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
}

export default function InicioDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-5">
        {/* Saudação */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              {saudacao.texto}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {saudacao.dataExtenso} · Você tem{' '}
              <span className="text-slate-900 dark:text-slate-50 font-medium">
                {kpisDia.total - kpisDia.realizados} sessões restantes
              </span>{' '}
              hoje, próxima às {kpisDia.proximaHora}.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors">
            <Activity className="w-4 h-4" strokeWidth={2} />
            Nova evolução
          </button>
        </div>

        {/* KPIs do dia */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <KPICard label="Hoje" value={kpisDia.total.toString()} sub="sessões marcadas" />
          <KPICard
            label="Confirmados"
            value={kpisDia.confirmados.toString()}
            sub={`de ${kpisDia.total}`}
            colorClass="text-teal-700 dark:text-teal-300"
          />
          <KPICard
            label="Realizados"
            value={kpisDia.realizados.toString()}
            sub={`${Math.round((kpisDia.realizados / kpisDia.total) * 100)}% do dia`}
            colorClass="text-emerald-700 dark:text-emerald-300"
          />
          <KPICard
            label="Próxima"
            value={kpisDia.proximaHora ?? '—'}
            sub={kpisDia.proximaHora ? 'em 4h6min' : ''}
          />
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Próximas sessões */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Próximas sessões
              </h2>
              <a href="/fisio/sections/agenda" className="text-xs text-teal-600 dark:text-teal-400 hover:underline">
                Ver agenda completa →
              </a>
            </div>
            <div className="space-y-2">
              {proximas.map((s) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    s.isProxima
                      ? 'border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-950/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Hora */}
                  <div className="shrink-0 text-center min-w-[56px]">
                    <div
                      className={`text-lg font-semibold tabular-nums ${
                        s.isProxima
                          ? 'text-teal-700 dark:text-teal-300'
                          : 'text-slate-900 dark:text-slate-50'
                      }`}
                    >
                      {s.hora}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {s.duracaoMin}min
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                    {s.pacienteNome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                      {s.pacienteNome}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {s.queixaCurta}
                    </div>
                  </div>

                  {/* EVA */}
                  <span
                    className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${evaColor(s.evaUltima)}`}
                  >
                    EVA {s.evaUltima}
                  </span>

                  {/* Status / action */}
                  <div className="shrink-0">
                    {s.status === 'confirmada' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
                        <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                        Confirmada
                      </span>
                    ) : (
                      <button className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <Send className="w-3 h-3" strokeWidth={2} />
                        Confirmar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="lg:col-span-4 space-y-2">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
                Ações rápidas
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <QuickAction icon={Activity} label="Nova evolução" primary />
                <QuickAction icon={UserPlus} label="Novo paciente" />
                <QuickAction icon={CalendarDays} label="Agendar" />
                <QuickAction icon={ClipboardList} label="Nova avaliação" />
              </div>
            </div>

            {/* Mini-KPI destaque */}
            <div className="rounded-2xl border border-teal-200 dark:border-teal-900 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/40 dark:to-teal-900/20 p-5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tabular-nums text-teal-700 dark:text-teal-300">
                  78%
                </span>
                <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={2} />
              </div>
              <div className="mt-1 text-xs text-teal-700 dark:text-teal-300 font-medium">
                Aderência média do mês
              </div>
              <div className="mt-0.5 text-[11px] text-teal-600 dark:text-teal-400">
                Exercícios Nymos Move · 5pp acima de abril
              </div>
            </div>
          </div>
        </div>

        {/* Fileira 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Alertas clínicos */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" strokeWidth={2} />
                Alertas clínicos
              </h2>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                {alertas.length}
              </span>
            </div>
            <ul className="space-y-2">
              {alertas.map((a) => {
                const style = severidadeStyle(a.severidade)
                const Icon = style.icon
                return (
                  <li
                    key={a.id}
                    className={`rounded-lg bg-slate-50 dark:bg-slate-800/30 p-3 ${style.borderClass}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${style.iconClass}`} strokeWidth={2} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-700 dark:text-slate-200 leading-snug">
                          {a.texto}
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                            {a.pacienteNome}
                          </span>
                          <button className="shrink-0 inline-flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 hover:underline">
                            {a.acaoLabel}
                            <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Atividade recente */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Atividade recente
            </h2>
            <ul className="space-y-2.5">
              {atividade.map((a) => {
                const ti = tipoAtividadeIcon(a.tipo)
                const Icon = ti.icon
                return (
                  <li key={a.id} className="flex items-start gap-2.5">
                    <div className={`shrink-0 w-6 h-6 rounded-md ${ti.color} flex items-center justify-center mt-0.5`}>
                      <Icon className="w-3 h-3 text-white" strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-700 dark:text-slate-200 leading-snug">
                        {a.texto}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono tabular-nums">
                        {formatHora(a.dataIso)}
                        {a.pacienteNome && ` · ${a.pacienteNome}`}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* KPIs do mês */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Maio em números
            </h2>
            <div className="space-y-3">
              {kpisMes.map((k) => (
                <div key={k.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {k.label}
                    </span>
                    {k.deltaPct !== undefined && (
                      <span
                        className={`text-[10px] font-mono tabular-nums font-medium ${
                          k.positivo
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {k.positivo ? '+' : ''}
                        {k.deltaPct}%
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
                    {k.valor}
                  </div>
                  {k.deltaTexto && (
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      {k.deltaTexto}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KPICard({
  label,
  value,
  sub,
  colorClass,
}: {
  label: string
  value: string
  sub?: string
  colorClass?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
      <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
        {label}
      </div>
      <div className={`mt-1 text-xl font-semibold tabular-nums ${colorClass ?? 'text-slate-900 dark:text-slate-50'}`}>
        {value}
      </div>
      {sub && (
        <div className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
          {sub}
        </div>
      )}
    </div>
  )
}

function QuickAction({
  icon: Icon,
  label,
  primary,
}: {
  icon: typeof Activity
  label: string
  primary?: boolean
}) {
  return (
    <button
      className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border transition-all hover:shadow-sm ${
        primary
          ? 'bg-slate-900 dark:bg-slate-50 border-slate-900 dark:border-slate-50 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-teal-300 dark:hover:border-teal-700'
      }`}
    >
      <Icon className="w-4 h-4" strokeWidth={2} />
      <span className="text-xs font-medium text-left leading-tight">{label}</span>
      <ChevronRight className={`w-3 h-3 ml-auto -mt-1 ${primary ? 'opacity-60' : 'opacity-40'}`} strokeWidth={2} />
    </button>
  )
}
