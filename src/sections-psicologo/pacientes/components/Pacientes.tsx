import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Users,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Calendar,
  Clock,
  Target,
  Video,
  MapPin,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type {
  KpiCarteira,
  ModalidadeSessao,
  Paciente,
  PacientesProps,
  SeveridadeScore,
  StatusPaciente,
} from '@/../product-psicologo/sections/pacientes/types'

const COR_BG: Record<KpiCarteira['cor'], string> = {
  teal: 'bg-teal-500/15 text-teal-300',
  sky: 'bg-sky-500/15 text-sky-300',
  emerald: 'bg-emerald-500/15 text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-300',
  rose: 'bg-rose-500/15 text-rose-300',
  violet: 'bg-violet-500/15 text-violet-300',
}

const STATUS_VISUAL: Record<StatusPaciente, { label: string; cls: string }> = {
  em_tratamento: { label: 'Em tratamento', cls: 'bg-teal-500/15 text-teal-300' },
  em_pausa: { label: 'Em pausa', cls: 'bg-amber-500/15 text-amber-300' },
  alta: { label: 'Alta', cls: 'bg-emerald-500/15 text-emerald-300' },
  inativo: { label: 'Inativo', cls: 'bg-slate-800 text-slate-400' },
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

const STATUS_FILTROS: { id: StatusPaciente; label: string }[] = [
  { id: 'em_tratamento', label: 'Em tratamento' },
  { id: 'em_pausa', label: 'Em pausa' },
  { id: 'alta', label: 'Alta' },
  { id: 'inativo', label: 'Inativo' },
]

function formatDataHora(iso: string): string {
  const [date, time] = iso.split('T')
  const [, m, d] = date.split('-')
  const hora = time.slice(0, 5)
  return `${d}/${m} · ${hora}`
}

export function Pacientes({
  data,
  onPacienteClick,
  onNovoPaciente,
  onIniciarSessao,
  onAplicarInstrumento,
}: PacientesProps) {
  const [statusesAtivos, setStatusesAtivos] = useState<StatusPaciente[]>([])
  const [somenteAltoRisco, setSomenteAltoRisco] = useState(false)
  const [busca, setBusca] = useState('')

  const pacientesFiltrados = useMemo(() => {
    return data.pacientes.filter((p) => {
      if (statusesAtivos.length > 0 && !statusesAtivos.includes(p.status)) return false
      if (somenteAltoRisco && !p.altoRisco) return false
      if (busca && !p.nomeCompleto.toLowerCase().includes(busca.toLowerCase())) return false
      return true
    })
  }, [data.pacientes, statusesAtivos, somenteAltoRisco, busca])

  const toggleStatus = (s: StatusPaciente) =>
    setStatusesAtivos((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  const limparFiltros = () => {
    setStatusesAtivos([])
    setSomenteAltoRisco(false)
    setBusca('')
  }

  const temFiltrosAtivos = statusesAtivos.length > 0 || somenteAltoRisco || busca.length > 0

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-slate-50 font-bold text-[24px]">Pacientes</h1>
              <span className="text-slate-500 text-[13px] font-mono tabular-nums">
                · {data.pacientes.length} na carteira
              </span>
            </div>
            <p className="text-slate-400 text-[12.5px] mt-1">Carteira completa com filtros e busca</p>
          </div>
          <button
            onClick={onNovoPaciente}
            className="px-4 h-11 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 text-white font-semibold text-[13px] flex items-center gap-2"
          >
            <Plus size={14} strokeWidth={2.4} />
            Novo paciente
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {data.kpis.map((k) => (
            <KpiCard key={k.label} kpi={k} />
          ))}
        </div>

        {/* Filtros + busca */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-slate-600 flex-1 max-w-md">
            <Search size={14} className="text-slate-500" strokeWidth={2.2} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome..."
              className="flex-1 bg-transparent text-slate-100 text-[13px] outline-none placeholder:text-slate-700"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTROS.map((f) => {
              const active = statusesAtivos.includes(f.id)
              const counter = data.pacientes.filter((p) => p.status === f.id).length
              return (
                <button
                  key={f.id}
                  onClick={() => toggleStatus(f.id)}
                  className={`px-3 h-9 rounded-full text-[12px] font-semibold border flex items-center gap-1.5 ${
                    active
                      ? 'bg-violet-500/15 text-violet-300 border-violet-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                  <span
                    className={`text-[10px] font-mono tabular-nums px-1 rounded ${
                      active ? 'bg-violet-500/30' : 'bg-slate-800'
                    }`}
                  >
                    {counter}
                  </span>
                </button>
              )
            })}
            <button
              onClick={() => setSomenteAltoRisco((v) => !v)}
              className={`px-3 h-9 rounded-full text-[12px] font-semibold border flex items-center gap-1.5 ${
                somenteAltoRisco
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <AlertTriangle size={11} strokeWidth={2.4} />
              Alto risco
              <span
                className={`text-[10px] font-mono tabular-nums px-1 rounded ${
                  somenteAltoRisco ? 'bg-rose-500/30' : 'bg-slate-800'
                }`}
              >
                {data.pacientes.filter((p) => p.altoRisco).length}
              </span>
            </button>
            {temFiltrosAtivos && (
              <button
                onClick={limparFiltros}
                className="px-3 h-9 rounded-full text-slate-400 hover:text-slate-200 text-[11.5px] font-medium"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Resultado */}
        <div className="text-slate-500 text-[11px] mb-3 px-1">
          {pacientesFiltrados.length} de {data.pacientes.length}{' '}
          {pacientesFiltrados.length === 1 ? 'paciente' : 'pacientes'}
        </div>

        {/* Grid de pacientes */}
        {pacientesFiltrados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-12 text-center">
            <div className="text-slate-300 text-[14px] font-semibold">Nenhum paciente encontrado</div>
            <div className="text-slate-500 text-[12px] mt-1">
              {temFiltrosAtivos ? 'Ajuste os filtros pra ver mais resultados.' : 'Adicione seu primeiro paciente.'}
            </div>
            {!temFiltrosAtivos && (
              <button
                onClick={onNovoPaciente}
                className="mt-4 px-4 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 text-white font-semibold text-[12px] flex items-center gap-1.5 mx-auto"
              >
                <Plus size={13} strokeWidth={2.4} />
                Novo paciente
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {pacientesFiltrados.map((p) => (
              <PacienteCard
                key={p.id}
                paciente={p}
                onClick={() => onPacienteClick?.(p.id)}
                onIniciarSessao={() => onIniciarSessao?.(p.id)}
                onAplicarInstrumento={() => onAplicarInstrumento?.(p.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function KpiCard({ kpi }: { kpi: KpiCarteira }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">{kpi.label}</span>
        <div className={`w-7 h-7 rounded-lg ${COR_BG[kpi.cor]} flex items-center justify-center`}>
          <Users size={13} strokeWidth={2.4} />
        </div>
      </div>
      <div className="text-slate-50 font-bold text-[22px] font-mono tabular-nums leading-none">{kpi.valor}</div>
      {kpi.delta && <div className="text-slate-500 text-[10.5px] mt-1">{kpi.delta}</div>}
    </div>
  )
}

interface PacienteCardProps {
  paciente: Paciente
  onClick: () => void
  onIniciarSessao: () => void
  onAplicarInstrumento: () => void
}

function PacienteCard({ paciente, onClick, onIniciarSessao, onAplicarInstrumento }: PacienteCardProps) {
  const status = STATUS_VISUAL[paciente.status]
  const sev = paciente.scoreAtual ? SEVERIDADE_VISUAL[paciente.scoreAtual.severidade] : null

  return (
    <div
      className={`relative rounded-2xl bg-slate-900 border ${
        paciente.altoRisco ? 'border-rose-500/40' : 'border-slate-800 hover:border-slate-700'
      } p-4 flex flex-col gap-3 transition-colors`}
    >
      {paciente.altoRisco && (
        <div className="absolute top-3 right-3 px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
          <AlertTriangle size={9} strokeWidth={2.6} />
          Alto risco
        </div>
      )}

      {/* Header: avatar + nome + idade */}
      <button onClick={onClick} className="flex items-center gap-3 text-left">
        <Avatar paciente={paciente} size={48} />
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-semibold text-[14px] truncate">{paciente.nomeCompleto}</div>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
            <span>{paciente.idade} anos</span>
            <span className="text-slate-700">·</span>
            <span className={`px-1.5 py-0.5 rounded ${status.cls} text-[9.5px] font-bold uppercase tracking-wider`}>
              {status.label}
            </span>
          </div>
        </div>
      </button>

      {/* Score */}
      {paciente.scoreAtual && sev && (
        <div className="rounded-lg bg-slate-950/60 border border-slate-800/60 px-3 py-2 flex items-center justify-between">
          <div>
            <div className="text-slate-500 text-[9.5px] font-semibold uppercase tracking-wider">
              {paciente.scoreAtual.instrumento}
            </div>
            <div className="text-slate-100 text-[18px] font-bold font-mono tabular-nums leading-none mt-0.5">
              {paciente.scoreAtual.valor}
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full ${sev.cls} text-[10px] font-bold`}>{sev.label}</span>
        </div>
      )}

      {/* Plano */}
      {paciente.plano && (
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Target size={11} className="text-slate-500 shrink-0" strokeWidth={2.2} />
          <span className="font-semibold text-slate-300 truncate">{paciente.plano.nome}</span>
          <span className="text-slate-600 font-mono tabular-nums shrink-0">
            {paciente.plano.sessaoAtual}/{paciente.plano.totalSessoes}
          </span>
        </div>
      )}

      {/* Próxima sessão */}
      {paciente.proximaSessao && (
        <div className="rounded-lg bg-slate-950/40 border border-slate-800/40 px-3 py-2">
          <div className="flex items-center gap-1.5 text-slate-500 text-[9.5px] font-semibold uppercase tracking-wider mb-0.5">
            <Calendar size={9} strokeWidth={2.4} />
            Próxima sessão
          </div>
          <div className="flex items-center gap-2 text-[11.5px]">
            <span className="text-slate-200 font-mono tabular-nums">
              {formatDataHora(paciente.proximaSessao.inicioEm)}
            </span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1 text-slate-400">
              {(() => {
                const M = MODALIDADE_VISUAL[paciente.proximaSessao.modalidade]
                const Icon = M.icon
                return (
                  <>
                    <Icon size={10} strokeWidth={2.2} />
                    {M.label}
                  </>
                )
              })()}
            </span>
          </div>
        </div>
      )}

      {/* Footer: última interação + actions */}
      <div className="flex items-center justify-between mt-auto">
        <span className="flex items-center gap-1 text-slate-600 text-[10px] font-mono tabular-nums">
          <Clock size={9} />
          {paciente.ultimaInteracao}
        </span>
        <div className="flex gap-1.5">
          {paciente.proximaSessao && (
            <button
              onClick={onIniciarSessao}
              className="px-2.5 h-7 rounded-md bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 text-[10.5px] font-semibold flex items-center gap-1"
              title="Iniciar sessão"
            >
              Iniciar
            </button>
          )}
          <button
            onClick={onAplicarInstrumento}
            className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
            title="Aplicar instrumento"
          >
            <Sparkles size={12} strokeWidth={2.2} />
          </button>
          <button
            onClick={onClick}
            className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
            title="Ver detalhes"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function Avatar({ paciente, size = 48 }: { paciente: Paciente; size?: number }) {
  if (paciente.fotoUrl) {
    return (
      <img
        src={paciente.fotoUrl}
        alt={paciente.nomeCompleto}
        className="rounded-2xl object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    )
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
