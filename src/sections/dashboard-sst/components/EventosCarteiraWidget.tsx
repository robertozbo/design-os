import type {
  EventoCarteiraItem,
  EventoCarteiraStatus,
  EventoCarteiraTipo,
  EventosCarteiraResumo,
} from '@/../product/sections/dashboard-sst/types'
import {
  Radio,
  ArrowUpRight,
  Hourglass,
  Send,
  XCircle,
  AlertTriangle,
  Flame,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'

interface Props {
  resumo: EventosCarteiraResumo
  onAbrirEvento?: (empregadorId: string, eventoId: string) => void
  onAbrirEventosDoEmpregador?: (empregadorId: string) => void
}

const TIPO_COLOR: Record<EventoCarteiraTipo, { bg: string; text: string; ring: string; label: string }> = {
  'S-2210': { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', ring: 'ring-rose-200 dark:ring-rose-900', label: 'CAT' },
  'S-2220': { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-300', ring: 'ring-teal-200 dark:ring-teal-900', label: 'ASO' },
  'S-2240': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-800 dark:text-amber-300', ring: 'ring-amber-200 dark:ring-amber-900', label: 'Riscos' },
  'S-2245': { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-300', ring: 'ring-violet-200 dark:ring-violet-900', label: 'Treinos' },
}

const STATUS_TONE: Record<EventoCarteiraStatus, { dot: string; text: string; pulse?: boolean }> = {
  rascunho: { dot: 'bg-slate-400', text: 'text-slate-700 dark:text-slate-300' },
  rejeitado: { dot: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300' },
  enviando: { dot: 'bg-amber-500', text: 'text-amber-800 dark:text-amber-300', pulse: true },
  falhou_retry: { dot: 'bg-orange-500', text: 'text-orange-800 dark:text-orange-300' },
  aguardando_retorno: { dot: 'bg-sky-500', text: 'text-sky-700 dark:text-sky-300', pulse: true },
  exausto: { dot: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300' },
}

export function EventosCarteiraWidget({
  resumo,
  onAbrirEvento,
  onAbrirEventosDoEmpregador,
}: Props) {
  const hasSlaRisk = resumo.slaRiskCount > 0
  const hasCertBloqueando = resumo.certificadosBloqueando > 0

  return (
    <section
      style={{ animationDelay: '380ms' }}
      className="nymos-reveal opacity-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-950 overflow-hidden"
    >
      <header className="px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Radio className="w-3.5 h-3.5" strokeWidth={1.75} />
          </span>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Eventos eSocial · carteira
          </h2>
          {(hasSlaRisk || hasCertBloqueando) && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300">
              <AlertCircle className="w-2.5 h-2.5" strokeWidth={2.25} />
              Atenção
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
          Top {resumo.topUrgentes.length} · ordenados por prazo e severidade
        </span>
      </header>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200/70 dark:border-slate-800/80">
        <KpiTile
          icon={<Hourglass className="w-3.5 h-3.5" strokeWidth={1.75} />}
          label="Pendentes"
          value={resumo.totalPendentes}
          tone="slate"
        />
        <KpiTile
          icon={<Send className="w-3.5 h-3.5" strokeWidth={1.75} />}
          label="Em transmissão"
          value={resumo.totalEmTransmissao}
          tone="amber"
          pulse
        />
        <KpiTile
          icon={<XCircle className="w-3.5 h-3.5" strokeWidth={1.75} />}
          label="Rejeitados · mês"
          value={resumo.totalRejeitadosMes}
          tone="rose"
        />
        <KpiTile
          icon={<Flame className="w-3.5 h-3.5" strokeWidth={1.75} />}
          label="SLA em risco"
          value={resumo.slaRiskCount}
          tone={hasSlaRisk ? 'rose' : 'emerald'}
          last
        />
      </div>

      {/* Lista urgentes */}
      <div className="divide-y divide-slate-200/70 dark:divide-slate-800/80">
        {resumo.topUrgentes.map((item, idx) => (
          <UrgenteRow
            key={item.jobId}
            item={item}
            revealIndex={idx}
            onClick={() => onAbrirEvento?.(item.empregadorId, item.eventoId)}
            onAbrirEmpregador={(e) => {
              e.stopPropagation()
              onAbrirEventosDoEmpregador?.(item.empregadorId)
            }}
          />
        ))}
        {resumo.topUrgentes.length === 0 && (
          <div className="px-5 py-10 text-center">
            <p className="text-[12px] text-slate-500 dark:text-slate-400">
              Nenhum evento urgente. Toda a carteira em dia.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function KpiTile({
  icon,
  label,
  value,
  tone,
  pulse = false,
  last = false,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone: 'slate' | 'amber' | 'rose' | 'emerald'
  pulse?: boolean
  last?: boolean
}) {
  const tones = {
    slate: { text: 'text-slate-900 dark:text-slate-50', iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300', dot: 'bg-slate-400' },
    amber: { text: 'text-amber-900 dark:text-amber-100', iconBg: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300', dot: 'bg-amber-400' },
    rose: { text: 'text-rose-900 dark:text-rose-100', iconBg: 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300', dot: 'bg-rose-400' },
    emerald: { text: 'text-emerald-900 dark:text-emerald-100', iconBg: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-400' },
  }
  const t = tones[tone]
  return (
    <div
      className={`px-4 py-3 flex items-center gap-3 ${
        last ? '' : 'sm:border-r sm:border-slate-200/70 sm:dark:border-slate-800/80'
      }`}
    >
      <span className={`relative shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl ${t.iconBg}`}>
        {pulse && value > 0 && (
          <span className={`absolute inset-0 rounded-xl ${t.dot} opacity-30 animate-ping`} />
        )}
        <span className="relative">{icon}</span>
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className={`text-xl font-semibold tabular-nums ${t.text}`}>{value}</p>
      </div>
    </div>
  )
}

function UrgenteRow({
  item,
  revealIndex,
  onClick,
  onAbrirEmpregador,
}: {
  item: EventoCarteiraItem
  revealIndex: number
  onClick: () => void
  onAbrirEmpregador: (e: React.MouseEvent) => void
}) {
  const tipo = TIPO_COLOR[item.tipo]
  const statusTone = STATUS_TONE[item.status]
  const isSlaUrgent = item.diasRestantesPrazo !== undefined && item.diasRestantesPrazo <= 1

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${440 + revealIndex * 50}ms` }}
      className={`
        nymos-reveal opacity-0 group relative
        w-full px-5 py-3 grid grid-cols-12 gap-3 items-center text-left
        transition-colors
        hover:bg-slate-50/80 dark:hover:bg-slate-800/40
        ${isSlaUrgent ? 'bg-rose-50/30 dark:bg-rose-950/15' : ''}
      `}
    >
      {isSlaUrgent && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-3 bottom-3 w-[2px] rounded-r bg-gradient-to-b from-rose-500 to-rose-600"
        />
      )}

      {/* Tipo + status */}
      <div className="col-span-12 sm:col-span-3 flex items-center gap-2 min-w-0">
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium ring-1 ${tipo.bg} ${tipo.text} ${tipo.ring}`}
        >
          <span className="font-mono font-semibold opacity-80">{item.tipo}</span>
          <span className="opacity-50">·</span>
          <span>{tipo.label}</span>
        </span>
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${statusTone.text}`}>
          <span className="relative inline-flex w-1.5 h-1.5">
            {statusTone.pulse && (
              <span className={`absolute inset-0 rounded-full ${statusTone.dot} opacity-60 animate-ping`} />
            )}
            <span className={`relative inline-flex w-1.5 h-1.5 rounded-full ${statusTone.dot}`} />
          </span>
          {item.statusLabel}
        </span>
      </div>

      {/* Empregador */}
      <div className="col-span-6 sm:col-span-3 min-w-0">
        <span
          role="button"
          tabIndex={0}
          onClick={onAbrirEmpregador}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onAbrirEmpregador(e as unknown as React.MouseEvent)
            }
          }}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 transition cursor-pointer truncate"
        >
          {item.empregadorFantasia}
          <ArrowUpRight className="w-2.5 h-2.5 opacity-50" strokeWidth={2} />
        </span>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
          {item.trabalhadorNome}
        </p>
      </div>

      {/* Erro ou prazo */}
      <div className="col-span-6 sm:col-span-5 min-w-0">
        {item.ultimoErroDescricao && (
          <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
            <span className="font-mono font-semibold mr-1">[{item.ultimoErroCodigo}]</span>
            {item.ultimoErroDescricao}
          </p>
        )}
        {isSlaUrgent && !item.ultimoErroDescricao && (
          <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium inline-flex items-center gap-1">
            <Flame className="w-2.5 h-2.5" strokeWidth={2.25} />
            CAT 24h · prazo {item.diasRestantesPrazo === 0 ? 'hoje' : `em ${item.diasRestantesPrazo}d`}
          </p>
        )}
        {!item.ultimoErroDescricao && !isSlaUrgent && (
          <p className="text-[11px] text-slate-500 dark:text-slate-500">
            CPF <span className="font-mono">{item.trabalhadorCpf}</span>
          </p>
        )}
      </div>

      <div className="col-span-12 sm:col-span-1 flex justify-end">
        <ChevronRight
          className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all"
          strokeWidth={1.75}
        />
      </div>
    </button>
  )
}
