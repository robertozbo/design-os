import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Video,
  MapPin,
  Plus,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Play,
  CalendarCheck,
  Heart,
  Target,
  type LucideIcon,
} from 'lucide-react'
import type {
  AlertaPaciente,
  DashboardProps,
  KpiCarteira,
  ModalidadeSessao,
  PacienteResumo,
  SessaoAgendada,
  SeveridadeScore,
  TipoAlerta,
} from '@/../product-psicologo/sections/dashboard/types'

const COR_BG: Record<KpiCarteira['cor'], string> = {
  teal: 'bg-teal-500/15 text-teal-300',
  sky: 'bg-sky-500/15 text-sky-300',
  emerald: 'bg-emerald-500/15 text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-300',
  rose: 'bg-rose-500/15 text-rose-300',
  violet: 'bg-violet-500/15 text-violet-300',
}

const SEVERIDADE_VISUAL: Record<SeveridadeScore, { label: string; cls: string }> = {
  minima: { label: 'Mínima', cls: 'bg-emerald-500/15 text-emerald-300' },
  leve: { label: 'Leve', cls: 'bg-teal-500/15 text-teal-300' },
  moderada: { label: 'Moderada', cls: 'bg-amber-500/15 text-amber-300' },
  moderada_severa: { label: 'Mod. severa', cls: 'bg-orange-500/15 text-orange-300' },
  severa: { label: 'Severa', cls: 'bg-rose-500/15 text-rose-300' },
}

const MODALIDADE_VISUAL: Record<ModalidadeSessao, { icon: LucideIcon; label: string }> = {
  online: { icon: Video, label: 'Online' },
  presencial: { icon: MapPin, label: 'Presencial' },
  hibrida: { icon: Users, label: 'Híbrida' },
}

const ALERTA_VISUAL: Record<TipoAlerta, { icon: LucideIcon; label: string; cls: string }> = {
  agravamento_phq: { icon: TrendingUp, label: 'Agravamento PHQ-9', cls: 'bg-rose-500/15 text-rose-300' },
  agravamento_gad: { icon: TrendingUp, label: 'Agravamento GAD-7', cls: 'bg-rose-500/15 text-rose-300' },
  faltas_consecutivas: { icon: AlertCircle, label: 'Faltas consecutivas', cls: 'bg-amber-500/15 text-amber-300' },
  mensagem_urgente: { icon: AlertCircle, label: 'Mensagem urgente', cls: 'bg-amber-500/15 text-amber-300' },
  risco_suicidio: { icon: AlertTriangle, label: 'Risco suicídio', cls: 'bg-rose-500/15 text-rose-300' },
}

export function Dashboard({
  data,
  onIniciarSessao,
  onSessaoClick,
  onPacienteClick,
  onAlertaClick,
  onNovoPaciente,
  onAplicarInstrumento,
  onAnotacaoRapida,
  onVerTodosPacientes,
}: DashboardProps) {
  const proximaSessao = data.proximaSessao ?? data.sessoesHoje.find((s) => s.ehProxima) ?? data.sessoesHoje[0]
  const outrasSessoes = data.sessoesHoje.filter((s) => s.id !== proximaSessao?.id)

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {data.fotoUrl ? (
              <img src={data.fotoUrl} alt={data.nomeProfissional} className="w-12 h-12 rounded-2xl object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-200 font-bold text-[20px]">
                {data.inicialProfissional}
              </div>
            )}
            <div>
              <div className="text-slate-400 text-[12px]">{data.saudacao},</div>
              <div className="text-slate-50 font-bold text-[20px] leading-tight">{data.nomeProfissional}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <QuickAction icon={Plus} label="Novo paciente" onClick={onNovoPaciente} />
            <QuickAction icon={Sparkles} label="Aplicar instrumento" onClick={onAplicarInstrumento} />
            <QuickAction icon={CalendarCheck} label="Anotação rápida" onClick={onAnotacaoRapida} />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {data.kpis.map((k) => (
            <KpiCard key={k.label} kpi={k} />
          ))}
        </div>

        {/* Main grid: 2 cols (sessões + alertas) */}
        <div className="grid grid-cols-3 gap-4">
          {/* Sessões hoje (2 cols) */}
          <div className="col-span-2 space-y-4">
            {proximaSessao && (
              <ProximaSessaoCard
                sessao={proximaSessao}
                onIniciar={() => onIniciarSessao?.(proximaSessao.id)}
                onClick={() => onSessaoClick?.(proximaSessao.id)}
                onPacienteClick={() => onPacienteClick?.(proximaSessao.paciente.id)}
              />
            )}

            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" strokeWidth={2.2} />
                  <h2 className="text-slate-100 font-semibold text-[14px]">Sessões de hoje</h2>
                  <span className="text-slate-600 text-[11px] font-mono tabular-nums">
                    {data.sessoesHoje.length}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {outrasSessoes.map((s) => (
                  <SessaoRow
                    key={s.id}
                    sessao={s}
                    onClick={() => onSessaoClick?.(s.id)}
                    onPacienteClick={() => onPacienteClick?.(s.paciente.id)}
                  />
                ))}
                {outrasSessoes.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-center text-slate-500 text-[12px]">
                    Sem mais sessões hoje
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alertas */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-rose-300" strokeWidth={2.2} />
                <h2 className="text-slate-100 font-semibold text-[14px]">Alertas</h2>
                <span className="text-slate-600 text-[11px] font-mono tabular-nums">
                  {data.alertas.length}
                </span>
              </div>
              <button
                onClick={onVerTodosPacientes}
                className="text-slate-400 text-[11px] font-medium hover:text-slate-200"
              >
                Ver pacientes
              </button>
            </div>
            <div className="space-y-2">
              {data.alertas.map((a) => (
                <AlertaCard
                  key={a.id}
                  alerta={a}
                  onClick={() => onAlertaClick?.(a.id)}
                  onPacienteClick={() => onPacienteClick?.(a.paciente.id)}
                />
              ))}
              {data.alertas.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-center text-slate-500 text-[12px]">
                  Nenhum alerta no momento
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function QuickAction({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-[12px] font-medium flex items-center gap-1.5"
    >
      <Icon size={13} strokeWidth={2.2} />
      {label}
    </button>
  )
}

function KpiCard({ kpi }: { kpi: KpiCarteira }) {
  const dirIcon = kpi.direcao === 'subiu' ? TrendingUp : kpi.direcao === 'desceu' ? TrendingDown : Minus
  const DirIcon = dirIcon
  const dirCls = kpi.direcao === 'manteve' ? 'text-slate-500' : 'text-slate-400'
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">{kpi.label}</span>
        <div className={`w-7 h-7 rounded-lg ${COR_BG[kpi.cor]} flex items-center justify-center`}>
          <Heart size={13} strokeWidth={2.4} />
        </div>
      </div>
      <div className="text-slate-50 font-bold text-[24px] font-mono tabular-nums leading-none">{kpi.valor}</div>
      {kpi.delta && (
        <div className={`flex items-center gap-1 mt-1.5 text-[10.5px] ${dirCls}`}>
          <DirIcon size={11} strokeWidth={2.4} />
          <span>{kpi.delta}</span>
        </div>
      )}
    </div>
  )
}

interface ProximaSessaoCardProps {
  sessao: SessaoAgendada
  onIniciar: () => void
  onClick: () => void
  onPacienteClick: () => void
}

function ProximaSessaoCard({ sessao, onIniciar, onClick, onPacienteClick }: ProximaSessaoCardProps) {
  const Mod = MODALIDADE_VISUAL[sessao.modalidade]
  return (
    <div className="rounded-2xl bg-gradient-to-br from-violet-500/15 via-slate-900 to-sky-500/10 border border-violet-500/30 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-200 text-[10px] font-bold uppercase tracking-wider">
          Próxima sessão
        </span>
        <span className="text-violet-200 text-[13px] font-mono tabular-nums font-semibold">
          {sessao.inicioRelativo}
        </span>
      </div>

      <button onClick={onPacienteClick} className="flex items-center gap-3 mb-4 w-full text-left">
        <PacienteAvatar paciente={sessao.paciente} size={56} />
        <div className="min-w-0 flex-1">
          <div className="text-slate-50 font-bold text-[18px] truncate">{sessao.paciente.nomeCompleto}</div>
          <div className="flex items-center gap-2 mt-1 text-[11.5px]">
            <span className="text-slate-400">{sessao.paciente.idade} anos</span>
            {sessao.paciente.scoreAtual && (
              <>
                <span className="text-slate-700">·</span>
                <ScoreChip score={sessao.paciente.scoreAtual} />
              </>
            )}
          </div>
        </div>
      </button>

      <div className="flex items-center gap-3 mb-4 text-[12px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Clock size={12} strokeWidth={2.2} />
          <span className="font-mono tabular-nums">
            {formatHora(sessao.inicioEm)} · {sessao.duracaoMin}min
          </span>
        </span>
        <span className="text-slate-700">·</span>
        <span className="flex items-center gap-1.5">
          <Mod.icon size={12} strokeWidth={2.2} />
          {Mod.label}
        </span>
        {sessao.numeroNoPlano && (
          <>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1.5 font-mono tabular-nums">
              <Target size={12} strokeWidth={2.2} />
              {sessao.numeroNoPlano}
            </span>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onIniciar}
          className="flex-1 h-11 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 text-white font-bold text-[13px] flex items-center justify-center gap-2"
        >
          <Play size={14} strokeWidth={2.6} fill="currentColor" />
          Iniciar sessão
        </button>
        <button
          onClick={onClick}
          className="px-4 h-11 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-[12.5px] font-medium hover:border-slate-700"
        >
          Ver detalhes
        </button>
      </div>
    </div>
  )
}

interface SessaoRowProps {
  sessao: SessaoAgendada
  onClick: () => void
  onPacienteClick: () => void
}

function SessaoRow({ sessao, onClick, onPacienteClick }: SessaoRowProps) {
  const Mod = MODALIDADE_VISUAL[sessao.modalidade]
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-3 flex items-center gap-3">
      <button onClick={onPacienteClick} className="flex items-center gap-3 min-w-0 flex-1 text-left">
        <PacienteAvatar paciente={sessao.paciente} size={36} />
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-semibold text-[12.5px] truncate">{sessao.paciente.nomeCompleto}</div>
          <div className="flex items-center gap-2 mt-0.5 text-[10.5px] text-slate-500 font-mono tabular-nums">
            <Clock size={9} />
            {formatHora(sessao.inicioEm)}
            <span className="text-slate-700">·</span>
            <Mod.icon size={9} />
            {Mod.label}
            {sessao.numeroNoPlano && (
              <>
                <span className="text-slate-700">·</span>
                {sessao.numeroNoPlano}
              </>
            )}
          </div>
        </div>
      </button>
      <span className="text-slate-500 text-[10.5px] font-mono tabular-nums">{sessao.inicioRelativo}</span>
      <button
        onClick={onClick}
        className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

interface AlertaCardProps {
  alerta: AlertaPaciente
  onClick: () => void
  onPacienteClick: () => void
}

function AlertaCard({ alerta, onClick, onPacienteClick }: AlertaCardProps) {
  const visual = ALERTA_VISUAL[alerta.tipo]
  const Icon = visual.icon
  const isCritica = alerta.severidade === 'critica'
  return (
    <div
      className={`rounded-xl p-3 ${
        isCritica
          ? 'bg-rose-500/10 border border-rose-500/30'
          : alerta.severidade === 'alta'
            ? 'bg-amber-500/10 border border-amber-500/30'
            : 'bg-slate-900 border border-slate-800'
      }`}
    >
      <div className="flex items-start gap-2.5 mb-2">
        <div className={`w-7 h-7 rounded-lg ${visual.cls} flex items-center justify-center shrink-0`}>
          <Icon size={13} strokeWidth={2.4} />
        </div>
        <div className="min-w-0 flex-1">
          <button onClick={onPacienteClick} className="text-slate-100 font-semibold text-[12.5px] hover:underline text-left block">
            {alerta.paciente.nomeCompleto}
          </button>
          <div className="text-slate-500 text-[10px] mt-0.5">
            {visual.label} · {alerta.detectadoEm}
          </div>
        </div>
      </div>
      <div className="text-slate-300 text-[11.5px] leading-snug mb-2">{alerta.mensagem}</div>
      <button
        onClick={onClick}
        className="w-full h-8 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1"
      >
        Ver detalhe
        <ChevronRight size={11} />
      </button>
    </div>
  )
}

function PacienteAvatar({ paciente, size = 40 }: { paciente: PacienteResumo; size?: number }) {
  if (paciente.fotoUrl) {
    return <img src={paciente.fotoUrl} alt={paciente.nomeCompleto} className="rounded-2xl object-cover shrink-0" style={{ width: size, height: size }} />
  }
  return (
    <div
      className="rounded-2xl bg-violet-500/20 text-violet-200 flex items-center justify-center font-bold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {paciente.inicial}
    </div>
  )
}

function ScoreChip({ score }: { score: NonNullable<PacienteResumo['scoreAtual']> }) {
  const v = SEVERIDADE_VISUAL[score.severidade]
  return (
    <span className={`px-1.5 py-0.5 rounded ${v.cls} text-[10px] font-mono tabular-nums font-semibold`}>
      {score.instrumento} {score.valor} · {v.label}
    </span>
  )
}

function formatHora(iso: string): string {
  return iso.split('T')[1]?.slice(0, 5) ?? ''
}
