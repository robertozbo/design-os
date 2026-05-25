import {
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  ImageIcon,
  MapPin,
  Pill,
  Sparkles,
  Stethoscope,
  Video,
} from 'lucide-react'
import type {
  ConsultaFinalizadaItem,
  ConsultasFinalizadasProps,
  FiltroPeriodo,
} from '@/../product-clinico/sections/consultas/types'

const FILTROS: { id: FiltroPeriodo; label: string }[] = [
  { id: 'hoje', label: 'Hoje' },
  { id: 'semana', label: 'Esta semana' },
  { id: 'mes', label: 'Este mês' },
  { id: 'tudo', label: 'Tudo' },
]

const HOJE = '2026-05-10'

function isHoje(iso: string) {
  return iso.startsWith(HOJE)
}

function isMesmaSemana(iso: string) {
  // Semana = 2026-05-04 (segunda) a 2026-05-10 (domingo)
  const dia = iso.slice(0, 10)
  return dia >= '2026-05-04' && dia <= '2026-05-10'
}

function isMesmoMes(iso: string) {
  return iso.startsWith('2026-05')
}

function aplicarFiltro(consultas: ConsultaFinalizadaItem[], filtro: FiltroPeriodo) {
  if (filtro === 'hoje') return consultas.filter((c) => isHoje(c.inicioEm))
  if (filtro === 'semana') return consultas.filter((c) => isMesmaSemana(c.inicioEm))
  if (filtro === 'mes') return consultas.filter((c) => isMesmoMes(c.inicioEm))
  return consultas
}

function formatarData(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', weekday: 'short' })
}

function formatarHora(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function agruparPorDia(consultas: ConsultaFinalizadaItem[]) {
  const map = new Map<string, ConsultaFinalizadaItem[]>()
  consultas.forEach((c) => {
    const dia = c.inicioEm.slice(0, 10)
    if (!map.has(dia)) map.set(dia, [])
    map.get(dia)!.push(c)
  })
  return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a))
}

export function ConsultasListaView({
  consultas,
  filtroAtivo,
  onAlterarFiltro,
  onAbrirConsulta,
}: ConsultasFinalizadasProps) {
  const filtradas = aplicarFiltro(consultas, filtroAtivo).sort((a, b) =>
    b.inicioEm.localeCompare(a.inicioEm),
  )

  const totais = {
    consultas: filtradas.length,
    minutos: filtradas.reduce((s, c) => s + c.duracaoMin, 0),
    prescricoes: filtradas.reduce((s, c) => s + c.prescricoesCount, 0),
    exames: filtradas.reduce((s, c) => s + c.examesSolicitadosCount, 0),
    imagens: filtradas.reduce((s, c) => s + c.imagensAnalisadasCount, 0),
    com_ia: filtradas.filter((c) => c.geradoPorIA).length,
  }

  const horas = Math.floor(totais.minutos / 60)
  const mins = totais.minutos % 60

  const grupos = agruparPorDia(filtradas)

  return (
    <div
      data-clinico-consultas-lista
      className="
        relative min-h-screen
        bg-gradient-to-b from-slate-50 via-white to-slate-100/60
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100
      "
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Consultas finalizadas
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Histórico de atendimentos assinados — revisar o que foi feito
          </p>
        </div>
      </header>

      {/* Filtros */}
      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        {FILTROS.map((f) => {
          const ativo = filtroAtivo === f.id
          return (
            <button
              key={f.id}
              onClick={() => onAlterarFiltro?.(f.id)}
              aria-pressed={ativo}
              className={`
                rounded-full border px-3 py-1 text-xs font-medium transition-colors
                ${
                  ativo
                    ? 'border-teal-400 bg-teal-50 text-teal-800 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50/40 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-700 dark:hover:bg-teal-950/30'
                }
              `}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Stats */}
      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <Stat icon={ClipboardList} label="Consultas" value={totais.consultas.toString()} />
        <Stat
          icon={Clock}
          label="Tempo total"
          value={horas > 0 ? `${horas}h${mins > 0 ? ` ${mins}m` : ''}` : `${mins}m`}
        />
        <Stat icon={Pill} label="Prescrições" value={totais.prescricoes.toString()} />
        <Stat icon={FileText} label="Exames sol." value={totais.exames.toString()} />
        <Stat icon={ImageIcon} label="Imagens IA" value={totais.imagens.toString()} />
        <Stat icon={Sparkles} label="Com IA escriba" value={totais.com_ia.toString()} />
      </section>

      {/* Lista agrupada por dia */}
      {grupos.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
          <Stethoscope className="size-8 text-slate-400" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Nenhuma consulta nesse período
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tente outro filtro pra ver outros períodos
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {grupos.map(([dia, items]) => (
            <section key={dia}>
              <header className="mb-2 flex items-center gap-2">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {formatarData(dia)}
                </h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[9px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {items.length}
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </header>
              <ul className="space-y-2">
                {items.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => onAbrirConsulta?.(c.id)}
                      className="
                        group w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition-all
                        hover:border-teal-300 hover:shadow
                        focus:outline-none focus:ring-2 focus:ring-teal-500/40
                        dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700
                      "
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-xs font-medium text-white shadow-sm">
                          {c.pacienteIniciais}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                              {c.pacienteNome}
                            </p>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                              {formatarHora(c.inicioEm)} · {c.duracaoMin}min
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-[12px] text-slate-600 dark:text-slate-300">
                            <span className="font-medium">{c.queixaPrincipal}</span>
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-[11px] italic text-slate-500 dark:text-slate-400">
                            "{c.hipoteseDiagnostica}"
                          </p>

                          {/* Badges */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <Badge>
                              {c.modalidade === 'tele' ? (
                                <Video className="size-3" />
                              ) : (
                                <MapPin className="size-3" />
                              )}
                              {c.modalidade === 'tele' ? 'Tele' : 'Presencial'}
                            </Badge>
                            {c.geradoPorIA && (
                              <Badge tom="emerald">
                                <Sparkles className="size-3" />
                                IA escriba
                              </Badge>
                            )}
                            {c.prescricoesCount > 0 && (
                              <Badge tom="violet">
                                <Pill className="size-3" />
                                {c.prescricoesCount} rx
                              </Badge>
                            )}
                            {c.examesSolicitadosCount > 0 && (
                              <Badge tom="amber">
                                <FileText className="size-3" />
                                {c.examesSolicitadosCount} exames
                              </Badge>
                            )}
                            {c.imagensAnalisadasCount > 0 && (
                              <Badge tom="emerald">
                                <ImageIcon className="size-3" />
                                {c.imagensAnalisadasCount} img IA
                              </Badge>
                            )}
                          </div>
                        </div>

                        <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-500" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-slate-200/70 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
        <Icon className="size-3" />
        {label}
      </p>
      <p className="mt-1 font-mono text-lg font-bold tabular-nums text-slate-900 dark:text-slate-50">
        {value}
      </p>
    </div>
  )
}

function Badge({
  children,
  tom = 'slate',
}: {
  children: React.ReactNode
  tom?: 'slate' | 'emerald' | 'violet' | 'amber'
}) {
  const styles = {
    slate:
      'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
    emerald:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300',
    violet:
      'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/30 dark:text-violet-300',
    amber:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${styles[tom]}`}
    >
      {children}
    </span>
  )
}
