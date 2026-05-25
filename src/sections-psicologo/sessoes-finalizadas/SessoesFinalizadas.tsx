import { useMemo, useState } from 'react'
import {
  Sparkles,
  Search,
  Calendar,
  FileText,
  Activity,
  Paperclip,
  AlertTriangle,
  ChevronRight,
  Plus,
  Users,
  Clock,
  X as XIcon,
} from 'lucide-react'
import data from '@/../product-psicologo/sections/sessoes-finalizadas/data.json'
import type {
  FiltroPeriodo,
  FiltroRisco,
  PacienteResumo,
  RiscoNivel,
  SessaoFinalizada,
  SessoesFinalizadasData,
} from '@/../product-psicologo/sections/sessoes-finalizadas/types'

const TYPED_DATA = data as unknown as SessoesFinalizadasData

const RISCO_VISUAL: Record<RiscoNivel, { label: string; cls: string; dot: string }> = {
  0: { label: 'Sem risco', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  1: { label: 'Baixo', cls: 'bg-teal-500/15 text-teal-300 border-teal-500/30', dot: 'bg-teal-400' },
  2: { label: 'Moderado', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30', dot: 'bg-amber-400' },
  3: { label: 'Crítico', cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30', dot: 'bg-rose-400' },
}

const MODO_LABEL: Record<'soap' | 'dap' | 'livre', { short: string; full: string; cls: string }> = {
  soap: { short: 'S', full: 'SOAP', cls: 'bg-violet-500/15 text-violet-300' },
  dap: { short: 'D', full: 'DAP', cls: 'bg-sky-500/15 text-sky-300' },
  livre: { short: 'L', full: 'Livre', cls: 'bg-slate-700 text-slate-300' },
}

const PERIODO_OPTIONS: Array<{ value: FiltroPeriodo; label: string }> = [
  { value: 'hoje', label: 'Hoje' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mês' },
  { value: 'todos', label: 'Tudo' },
]

const RISCO_OPTIONS: Array<{ value: FiltroRisco; label: string }> = [
  { value: 'todos', label: 'Qualquer risco' },
  { value: 'sem_risco', label: 'Sem risco' },
  { value: 'baixo', label: 'Baixo' },
  { value: 'moderado', label: 'Moderado' },
  { value: 'critico', label: 'Crítico' },
]

function formatDateTime(iso: string): { data: string; hora: string } {
  const d = new Date(iso)
  return {
    data: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
    hora: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  }
}

function isInPeriodo(iso: string, periodo: FiltroPeriodo): boolean {
  if (periodo === 'todos') return true
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const dayMs = 86_400_000
  if (periodo === 'hoje') return diffMs < dayMs
  if (periodo === 'semana') return diffMs < 7 * dayMs
  return diffMs < 30 * dayMs
}

function matchRisco(risco: RiscoNivel, filtro: FiltroRisco): boolean {
  if (filtro === 'todos') return true
  const map: Record<Exclude<FiltroRisco, 'todos'>, RiscoNivel> = {
    sem_risco: 0,
    baixo: 1,
    moderado: 2,
    critico: 3,
  }
  return map[filtro] === risco
}

export function SessoesFinalizadas() {
  const [search, setSearch] = useState('')
  const [periodo, setPeriodo] = useState<FiltroPeriodo>('semana')
  const [risco, setRisco] = useState<FiltroRisco>('todos')
  const [pickerOpen, setPickerOpen] = useState(false)

  const filteredSessoes = useMemo(() => {
    const q = search.trim().toLowerCase()
    return TYPED_DATA.sessoes.filter((s) => {
      if (!isInPeriodo(s.finalizadaEm, periodo)) return false
      if (!matchRisco(s.risco, risco)) return false
      if (q && !s.paciente.nomeCompleto.toLowerCase().includes(q)) return false
      return true
    })
  }, [search, periodo, risco])

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950 px-6 py-5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-slate-50 font-bold text-[22px] leading-tight">Sessões finalizadas</h1>
            <p className="text-slate-500 text-[12px] mt-1">
              Histórico de atendimentos · {TYPED_DATA.sessoes.length} sessões registradas
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="px-4 h-11 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 text-white font-bold text-[13px] flex items-center gap-2 shadow-lg shadow-violet-500/20"
          >
            <Plus size={15} strokeWidth={2.4} />
            Nova sessão
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-[1400px] mx-auto px-6 pt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Calendar} label="Hoje" value={TYPED_DATA.stats.hoje} cor="violet" />
        <StatCard icon={Clock} label="Esta semana" value={TYPED_DATA.stats.semana} cor="sky" />
        <StatCard icon={AlertTriangle} label="Alto risco" value={TYPED_DATA.stats.altoRisco} cor="rose" />
        <StatCard icon={Paperclip} label="Com adendos" value={TYPED_DATA.stats.comAdendos} cor="amber" />
      </div>

      {/* Filtros */}
      <div className="max-w-[1400px] mx-auto px-6 pt-5">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Busca */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" strokeWidth={2.2} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome do paciente…"
              className="w-full pl-9 pr-3 h-10 rounded-xl bg-slate-900 border border-slate-800 focus:border-violet-500 text-slate-100 text-[12.5px] outline-none placeholder:text-slate-600"
            />
          </div>

          {/* Período */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
            {PERIODO_OPTIONS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPeriodo(p.value)}
                className={`px-3 h-8 rounded-lg text-[11.5px] font-semibold transition ${
                  periodo === p.value
                    ? 'bg-violet-500/15 text-violet-300'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Risco */}
          <select
            value={risco}
            onChange={(e) => setRisco(e.target.value as FiltroRisco)}
            className="px-3 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-[12.5px] outline-none focus:border-violet-500 cursor-pointer"
          >
            {RISCO_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <div className="ml-auto text-slate-500 text-[11.5px]">
            {filteredSessoes.length} de {TYPED_DATA.sessoes.length}
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="max-w-[1400px] mx-auto px-6 py-5">
        {filteredSessoes.length === 0 ? (
          <EmptyState onNovaSessao={() => setPickerOpen(true)} />
        ) : (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            {/* Table header (desktop) */}
            <div className="hidden md:grid grid-cols-[1fr_2fr_70px_90px_1.5fr_120px_70px_40px] gap-3 px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 text-[9.5px] font-bold uppercase tracking-wider text-slate-500">
              <div>Data/Hora</div>
              <div>Paciente · Plano</div>
              <div>Modo</div>
              <div>Duração</div>
              <div>Resumo</div>
              <div>Risco</div>
              <div className="text-center">Adendos</div>
              <div></div>
            </div>

            <div className="divide-y divide-slate-800">
              {filteredSessoes.map((s) => (
                <SessaoRow key={s.id} sessao={s} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Picker modal */}
      {pickerOpen && (
        <PacientePickerModal
          pacientes={TYPED_DATA.pacientesDisponiveis}
          onClose={() => setPickerOpen(false)}
          onSelect={(id) => {
            // No protótipo, vai pra section sessão (real Nymos seria /sessao?pacienteId=)
            window.location.href = `/psicologo/sections/sessao?pacienteId=${id}`
          }}
        />
      )}
    </div>
  )
}

// =============================================================================

interface StatCardProps {
  icon: typeof Calendar
  label: string
  value: number
  cor: 'violet' | 'sky' | 'rose' | 'amber'
}

const STAT_COR: Record<StatCardProps['cor'], string> = {
  violet: 'bg-violet-500/15 text-violet-300',
  sky: 'bg-sky-500/15 text-sky-300',
  rose: 'bg-rose-500/15 text-rose-300',
  amber: 'bg-amber-500/15 text-amber-300',
}

function StatCard({ icon: Icon, label, value, cor }: StatCardProps) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-3.5 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${STAT_COR[cor]}`}>
        <Icon size={17} strokeWidth={2.4} />
      </div>
      <div>
        <div className="text-slate-100 font-bold text-[22px] leading-none font-mono tabular-nums">{value}</div>
        <div className="text-slate-500 text-[11px] mt-0.5">{label}</div>
      </div>
    </div>
  )
}

function SessaoRow({ sessao }: { sessao: SessaoFinalizada }) {
  const dt = formatDateTime(sessao.finalizadaEm)
  const risco = RISCO_VISUAL[sessao.risco]
  const modo = MODO_LABEL[sessao.modo]

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_70px_90px_1.5fr_120px_70px_40px] gap-3 px-4 py-3 hover:bg-violet-500/[0.03] transition cursor-pointer group items-center">
      {/* Data */}
      <div>
        <div className="text-slate-200 text-[12px] font-semibold font-mono tabular-nums">{dt.data}</div>
        <div className="text-slate-500 text-[10.5px] font-mono">{dt.hora}</div>
      </div>

      {/* Paciente + plano */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-violet-500/15 text-violet-300 flex items-center justify-center font-bold text-[13px] shrink-0">
          {sessao.paciente.inicial}
        </div>
        <div className="min-w-0">
          <div className="text-slate-100 text-[12.5px] font-semibold truncate">{sessao.paciente.nomeCompleto}</div>
          <div className="text-slate-500 text-[10.5px] truncate">
            {sessao.planoNome ?? <span className="italic">Sem plano</span>}
          </div>
        </div>
      </div>

      {/* Modo */}
      <div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${modo.cls}`}>
          {modo.short}
        </span>
      </div>

      {/* Duração */}
      <div className="text-slate-400 text-[11.5px] font-mono tabular-nums flex items-center gap-1">
        <Clock size={10} strokeWidth={2.4} className="text-slate-600" />
        {sessao.duracaoMin}min
      </div>

      {/* Resumo */}
      <div className="text-slate-400 text-[11.5px] leading-snug truncate" title={sessao.resumo}>
        {sessao.resumo}
      </div>

      {/* Risco */}
      <div>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${risco.cls} text-[10px] font-bold uppercase tracking-wider`}>
          <span className={`w-1.5 h-1.5 rounded-full ${risco.dot}`}></span>
          {risco.label}
        </span>
      </div>

      {/* Adendos */}
      <div className="text-center">
        {sessao.adendos.length > 0 ? (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 text-[10px] font-semibold">
            <Paperclip size={9} strokeWidth={2.4} />
            {sessao.adendos.length}
          </span>
        ) : (
          <span className="text-slate-700 text-[10px]">—</span>
        )}
      </div>

      {/* Arrow */}
      <div className="flex justify-end">
        <ChevronRight size={14} className="text-slate-700 group-hover:text-violet-400" strokeWidth={2.4} />
      </div>
    </div>
  )
}

function EmptyState({ onNovaSessao }: { onNovaSessao: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-3">
        <FileText size={26} strokeWidth={2.2} />
      </div>
      <div className="text-slate-200 font-semibold text-[15px] mb-1">Nenhuma sessão no filtro atual</div>
      <div className="text-slate-500 text-[12px] mb-5">Ajuste o período ou inicie uma nova sessão.</div>
      <button
        type="button"
        onClick={onNovaSessao}
        className="px-4 h-10 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold inline-flex items-center gap-2"
      >
        <Plus size={13} strokeWidth={2.4} />
        Nova sessão
      </button>
    </div>
  )
}

interface PacientePickerModalProps {
  pacientes: PacienteResumo[]
  onClose: () => void
  onSelect: (id: string) => void
}

function PacientePickerModal({ pacientes, onClose, onSelect }: PacientePickerModalProps) {
  const [query, setQuery] = useState('')
  const filtered = pacientes.filter((p) => p.nomeCompleto.toLowerCase().includes(query.toLowerCase()))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-300 flex items-center justify-center">
              <Users size={17} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-slate-50 font-bold text-[15px]">Nova sessão</h2>
              <p className="text-slate-500 text-[11.5px] mt-0.5">Selecione o paciente para iniciar</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center"
            aria-label="Fechar"
          >
            <XIcon size={14} strokeWidth={2.4} />
          </button>
        </div>

        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" strokeWidth={2.2} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar paciente…"
            autoFocus
            className="w-full pl-9 pr-3 h-10 rounded-xl bg-slate-950 border border-slate-800 focus:border-violet-500 text-slate-100 text-[12.5px] outline-none placeholder:text-slate-600"
          />
        </div>

        <div className="space-y-1.5 max-h-[360px] overflow-y-auto">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-violet-500 hover:bg-violet-500/[0.04] transition text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 text-violet-300 flex items-center justify-center font-bold text-[14px] shrink-0">
                {p.inicial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-slate-100 font-semibold text-[13px] truncate">{p.nomeCompleto}</div>
                <div className="text-slate-500 text-[10.5px]">{p.idade}a</div>
              </div>
              <ChevronRight size={14} className="text-slate-700 group-hover:text-violet-400" strokeWidth={2.4} />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-6 text-slate-500 text-[12px]">Nenhum paciente encontrado.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SessoesFinalizadas
