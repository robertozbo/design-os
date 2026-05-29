import { useMemo, useState } from 'react'
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Filter,
  Heart,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Send,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import data from '@/../product-fisio/sections/pacientes/data.json'
import type {
  AgendamentoResumo,
  AtividadeRecente,
  AvaliacaoResumo,
  DadosWearable,
  HubTabId,
  Paciente,
  SessaoSOAP,
  Tendencia,
} from '@/../product-fisio/sections/pacientes/types'

const paciente = data.pacienteFoco as Paciente
const avaliacoes = data.avaliacoesPaciente as AvaliacaoResumo[]
const sessoes = data.sessoesPaciente as SessaoSOAP[]
const proximas = data.proximasSessoes as AgendamentoResumo[]
const wearable = data.wearable as DadosWearable
const atividade = data.atividadeRecente as AtividadeRecente[]
const evolucaoEVA = data.evolucaoEVA as Array<{ sessao: number; data: string; eva: number }>
const alertas = data.alertas as Array<{ id: string; severidade: 'atencao' | 'info'; texto: string }>

const TABS: Array<{ id: HubTabId; label: string; icon: typeof Activity }> = [
  { id: 'visao-geral', label: 'Visão geral', icon: Sparkles },
  { id: 'avaliacoes', label: 'Avaliações', icon: ClipboardList },
  { id: 'evolucao', label: 'Evolução', icon: Activity },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'saude', label: 'Saúde', icon: Heart },
]

function evaColor(eva: number) {
  if (eva <= 3) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
  if (eva <= 6) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
  return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
}

function tendenciaIcon(t: Tendencia) {
  if (t === 'melhora') return <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
  if (t === 'piora') return <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" strokeWidth={2} />
  return <Activity className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function diasDesde(iso?: string) {
  if (!iso) return '—'
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
  if (d === 0) return 'hoje'
  if (d === 1) return 'ontem'
  return `há ${d}d`
}

function diasAte(iso?: string) {
  if (!iso) return '—'
  const d = Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (d === 0) return 'hoje'
  if (d === 1) return 'amanhã'
  return `em ${d}d`
}

/* ─────────────────────────── ENTRY POINT ─────────────────────────── */
interface PacienteListItem {
  id: string
  nome: string
  idade: number
  queixaCurta: string
  queixaCategoria: string
  status: 'em-tratamento' | 'em-alta' | 'inativo'
  evaAtual: number
  sessoesRealizadas: number
  ultimaSessaoData?: string
  proximaSessaoData?: string
  statusNymosMove: 'conectado' | 'pendente' | 'nao-convidado'
  tendencia: Tendencia
  telefone?: string
}

const pacientesLista = (data.pacientesLista ?? []) as PacienteListItem[]
const tabsListaCount = (data.tabs ?? []) as { id: string; label: string; count: number }[]
const kpisLista = data.kpis as {
  totalAtivos: number
  emAltaSemana: number
  semEvolucao7d: number
  novosMes: number
}

export default function PacientesPage() {
  const [selecionado, setSelecionado] = useState<PacienteListItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [busca, setBusca] = useState('')
  const [tabAtiva, setTabAtiva] = useState<'em-tratamento' | 'em-alta' | 'inativos'>(
    'em-tratamento',
  )

  if (selecionado) {
    return <PacienteHubView onVoltar={() => setSelecionado(null)} />
  }

  return (
    <PacientesListView
      busca={busca}
      setBusca={setBusca}
      tabAtiva={tabAtiva}
      setTabAtiva={setTabAtiva}
      onSelecionar={(p) => setSelecionado(p)}
      onNovoPaciente={() => setDrawerOpen(true)}
      drawerOpen={drawerOpen}
      onFecharDrawer={() => setDrawerOpen(false)}
    />
  )
}

/* ─────────────────────────── LIST VIEW ─────────────────────────── */
function PacientesListView({
  busca,
  setBusca,
  tabAtiva,
  setTabAtiva,
  onSelecionar,
  onNovoPaciente,
  drawerOpen,
  onFecharDrawer,
}: {
  busca: string
  setBusca: (v: string) => void
  tabAtiva: 'em-tratamento' | 'em-alta' | 'inativos'
  setTabAtiva: (t: 'em-tratamento' | 'em-alta' | 'inativos') => void
  onSelecionar: (p: PacienteListItem) => void
  onNovoPaciente: () => void
  drawerOpen: boolean
  onFecharDrawer: () => void
}) {
  const tabStatusMap: Record<typeof tabAtiva, PacienteListItem['status']> = {
    'em-tratamento': 'em-tratamento',
    'em-alta': 'em-alta',
    inativos: 'inativo',
  }

  const visiveis = useMemo(() => {
    const targetStatus = tabStatusMap[tabAtiva]
    return pacientesLista
      .filter((p) => p.status === targetStatus)
      .filter((p) => {
        if (!busca.trim()) return true
        const q = busca.toLowerCase()
        return (
          p.nome.toLowerCase().includes(q) ||
          p.queixaCurta.toLowerCase().includes(q) ||
          p.telefone?.includes(q)
        )
      })
  }, [busca, tabAtiva])

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <header className="mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="size-1.5 rounded-full bg-teal-500" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Atendimento · Pacientes
            </span>
          </div>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="size-11 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-center shrink-0">
                <Users className="size-5 text-teal-600 dark:text-teal-400" strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Pacientes
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                  Sua carteira clínica — em tratamento, em alta e inativos.
                </p>
              </div>
            </div>
            <button
              onClick={onNovoPaciente}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_-4px_rgba(20,184,166,0.45)]"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              Novo paciente
            </button>
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
          <KPI label="Total ativos" valor={kpisLista.totalAtivos.toString()} />
          <KPI label="Em alta semana" valor={kpisLista.emAltaSemana.toString()} tone="emerald" />
          <KPI
            label="Sem evolução 7+ dias"
            valor={kpisLista.semEvolucao7d.toString()}
            tone="amber"
          />
          <KPI label="Novos no mês" valor={kpisLista.novosMes.toString()} tone="teal" />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-3 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {tabsListaCount.map((t) => {
            const id = t.id as typeof tabAtiva
            const ativo = tabAtiva === id
            const realCount = pacientesLista.filter(
              (p) => p.status === tabStatusMap[id],
            ).length
            return (
              <button
                key={t.id}
                onClick={() => setTabAtiva(id)}
                className={`relative inline-flex items-center gap-2 shrink-0 px-3 py-2.5 text-sm font-medium transition-colors ${
                  ativo
                    ? 'text-slate-900 dark:text-slate-50'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {t.label}
                <span
                  className={`inline-flex items-center justify-center min-w-5 h-5 rounded-full px-1.5 text-[10px] font-bold ${
                    ativo
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {realCount}
                </span>
                {ativo && (
                  <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400" />
                )}
              </button>
            )
          })}
        </div>

        {/* Busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, queixa ou telefone…"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Tabela densa */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          {visiveis.length === 0 ? (
            <div className="p-10 text-center">
              <Filter className="size-6 mx-auto text-slate-400 mb-2" strokeWidth={1.5} />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Nenhum paciente nessa categoria
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {visiveis.map((p) => (
                <PacienteRow key={p.id} paciente={p} onClick={() => onSelecionar(p)} />
              ))}
            </ul>
          )}
        </div>
      </div>

      {drawerOpen && <NovoPacienteDrawer onClose={onFecharDrawer} />}
    </div>
  )
}

function PacienteRow({
  paciente,
  onClick,
}: {
  paciente: PacienteListItem
  onClick: () => void
}) {
  const semEvolucao =
    paciente.ultimaSessaoData &&
    Math.floor(
      (Date.now() - new Date(paciente.ultimaSessaoData).getTime()) / (1000 * 60 * 60 * 24),
    ) > 7

  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full grid grid-cols-[40px_1fr_auto_auto_auto] items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
          semEvolucao ? 'border-l-4 border-l-amber-400 dark:border-l-amber-500' : ''
        }`}
      >
        <div className="size-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-xs">
          {paciente.nome
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
              {paciente.nome}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-500">
              {paciente.idade}a
            </span>
            {tendenciaIcon(paciente.tendencia)}
          </div>
          <div className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate">
            {paciente.queixaCurta}
          </div>
          {paciente.telefone && (
            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-600 mt-0.5">
              {paciente.telefone}
            </div>
          )}
        </div>
        <div className="hidden sm:flex flex-col items-end text-right">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${evaColor(paciente.evaAtual)}`}
          >
            EVA {paciente.evaAtual}
          </span>
          <span className="mt-0.5 text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-500">
            {paciente.sessoesRealizadas} sessões
          </span>
        </div>
        <div className="hidden md:block text-right text-[11px] text-slate-500 dark:text-slate-400 min-w-[80px]">
          <div className="font-mono tabular-nums">
            {paciente.ultimaSessaoData ? diasDesde(paciente.ultimaSessaoData) : '—'}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-600">última</div>
        </div>
        <div className="shrink-0 flex items-center gap-1">
          <NymosMoveBadge status={paciente.statusNymosMove} />
          <ChevronRight className="size-4 text-slate-300 dark:text-slate-600" strokeWidth={2} />
        </div>
      </button>
    </li>
  )
}

function NymosMoveBadge({ status }: { status: PacienteListItem['statusNymosMove'] }) {
  if (status === 'conectado') {
    return (
      <span
        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[9px] font-semibold uppercase tracking-wider"
        title="Conectado ao Nymos Move"
      >
        <CheckCircle2 className="size-2.5" strokeWidth={2} />
        Move
      </span>
    )
  }
  if (status === 'pendente') {
    return (
      <span
        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[9px] font-semibold uppercase tracking-wider"
        title="Convite pendente"
      >
        <Send className="size-2.5" strokeWidth={2} />
        Pend.
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500 text-[9px] font-semibold uppercase tracking-wider"
      title="Sem convite"
    >
      —
    </span>
  )
}

function KPI({
  label,
  valor,
  tone,
}: {
  label: string
  valor: string
  tone?: 'emerald' | 'amber' | 'teal'
}) {
  const toneCls =
    tone === 'emerald'
      ? 'text-emerald-700 dark:text-emerald-300'
      : tone === 'amber'
        ? 'text-amber-700 dark:text-amber-300'
        : tone === 'teal'
          ? 'text-teal-700 dark:text-teal-300'
          : 'text-slate-900 dark:text-slate-50'
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className={`mt-1 text-xl font-semibold tabular-nums ${toneCls}`}>{valor}</div>
    </div>
  )
}


/* ─────────────────────────── DRAWER CADASTRO ─────────────────────────── */
function NovoPacienteDrawer({ onClose }: { onClose: () => void }) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [dataNasc, setDataNasc] = useState('')
  const [queixa, setQueixa] = useState('')
  const [enviarConvite, setEnviarConvite] = useState(true)

  const podeSalvar = nome.trim().length > 0 && telefone.trim().length > 0

  return (
    <>
      <div
        className="fixed inset-y-0 right-0 left-0 z-30 bg-slate-900/50 backdrop-blur-sm dark:bg-slate-950/70 lg:left-60"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-[520px] flex-col bg-white shadow-2xl dark:bg-slate-950">
        <div className="px-6 pt-5 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="size-1.5 rounded-full bg-teal-500" />
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                Novo paciente
              </span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Cadastrar paciente
            </h2>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
              Cadastro mínimo — o resto se preenche na avaliação inicial.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Nome completo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Ana Carolina Mendes"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Telefone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-50 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Data de nascimento
              </label>
              <input
                type="date"
                value={dataNasc}
                onChange={(e) => setDataNasc(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-50 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="paciente@email.com"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-50 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Queixa principal
            </label>
            <textarea
              value={queixa}
              onChange={(e) => setQueixa(e.target.value)}
              rows={3}
              placeholder="O que motivou a busca por atendimento?"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:border-teal-500 resize-none"
            />
          </div>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40 cursor-pointer">
            <input
              type="checkbox"
              checked={enviarConvite}
              onChange={() => setEnviarConvite(!enviarConvite)}
              className="mt-0.5"
            />
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-50">
                <Sparkles className="size-3.5 text-teal-600 dark:text-teal-400" strokeWidth={2} />
                Enviar convite Nymos Move
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                Paciente recebe link no WhatsApp pra baixar o app gratuito e começar a acompanhar exercícios + wearable.
              </p>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              console.log('cadastrar', { nome, telefone, email, dataNasc, queixa, enviarConvite })
              onClose()
            }}
            disabled={!podeSalvar}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-40 text-white text-sm font-medium"
          >
            <UserPlus className="size-3.5" strokeWidth={2} />
            {enviarConvite ? 'Cadastrar e enviar convite' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </>
  )
}

/* ─────────────────────────── HUB VIEW (paciente individual) ─────────────────────────── */
function PacienteHubView({ onVoltar }: { onVoltar: () => void }) {
  const [activeTab, setActiveTab] = useState<HubTabId>('visao-geral')
  const [conviteEnviado, setConviteEnviado] = useState(false)

  const isConectado = paciente.statusNymosMove === 'conectado'
  const isPendente = paciente.statusNymosMove === 'pendente' || conviteEnviado
  const isNaoConvidado = paciente.statusNymosMove === 'nao-convidado' && !conviteEnviado

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-5">
        {/* Voltar */}
        <button
          onClick={onVoltar}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          Voltar para lista
        </button>

        {/* Header card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-start gap-4 flex-wrap">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-xl shrink-0">
              {paciente.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  {paciente.nome}
                </h1>
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                  {paciente.idade} anos
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[11px] font-medium">
                  Em tratamento desde {formatDate(paciente.dataInicioTratamento)}
                </span>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300 text-sm leading-snug">
                {paciente.queixaPrincipal}
              </p>
              <div className="mt-2 flex items-center gap-4 text-[12px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" strokeWidth={1.7} />
                  {paciente.telefone}
                </span>
                {paciente.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" strokeWidth={1.7} />
                    {paciente.email}
                  </span>
                )}
              </div>
            </div>

            {/* Nymos Move status */}
            <div className="flex flex-col items-end gap-2">
              {isConectado && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                  Conectado ao Nymos Move
                </span>
              )}
              {isPendente && (
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-medium">
                    <Send className="w-3.5 h-3.5" strokeWidth={2} />
                    Convite Nymos Move pendente
                  </span>
                  <button
                    className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline"
                    onClick={() => setConviteEnviado(true)}
                  >
                    Reenviar convite
                  </button>
                </div>
              )}
              {isNaoConvidado && (
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors"
                  onClick={() => setConviteEnviado(true)}
                >
                  <UserPlus className="w-4 h-4" strokeWidth={2} />
                  Enviar convite Nymos Move
                </button>
              )}
            </div>
          </div>

          {/* Action bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-xs font-medium hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors">
              <CalendarDays className="w-3.5 h-3.5" strokeWidth={2} />
              Agendar sessão
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <ClipboardList className="w-3.5 h-3.5" strokeWidth={2} />
              Nova avaliação
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Activity className="w-3.5 h-3.5" strokeWidth={2} />
              Nova evolução
            </button>
            <button className="ml-auto inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <StatCard
            label="EVA atual"
            value={paciente.evaAtual.toString()}
            sub={`inicial ${paciente.evaInicial}`}
            trend={paciente.tendencia}
            colorClass={evaColor(paciente.evaAtual)}
          />
          <StatCard
            label="Sessões"
            value={paciente.sessoesRealizadas.toString()}
            sub="realizadas"
          />
          <StatCard
            label="Última avaliação"
            value={paciente.ultimaAvaliacaoData ? diasDesde(paciente.ultimaAvaliacaoData) : '—'}
            sub={paciente.ultimaAvaliacaoData ? formatDate(paciente.ultimaAvaliacaoData) : ''}
          />
          <StatCard
            label="Próxima sessão"
            value={diasAte(paciente.proximaSessaoData)}
            sub={paciente.proximaSessaoData ? formatDate(paciente.proximaSessaoData) : ''}
          />
          <StatCard
            label="Aderência exercícios"
            value={paciente.aderenciaExercicios ? `${paciente.aderenciaExercicios}%` : '—'}
            sub="Nymos Move · 7d"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              const isDisabled = tab.id === 'saude' && !isConectado
              return (
                <button
                  key={tab.id}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-teal-600 text-teal-700 dark:text-teal-300'
                      : isDisabled
                        ? 'border-transparent text-slate-300 dark:text-slate-700 cursor-not-allowed'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.8} />
                  {tab.label}
                  {tab.id === 'saude' && !isConectado && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-600 font-normal">
                      (sem Nymos Move)
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'visao-geral' && <VisaoGeral />}
          {activeTab === 'avaliacoes' && <AvaliacoesTab />}
          {activeTab === 'evolucao' && <EvolucaoTab />}
          {activeTab === 'agenda' && <AgendaTab />}
          {activeTab === 'saude' && isConectado && <SaudeTab />}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  trend,
  colorClass,
}: {
  label: string
  value: string
  sub?: string
  trend?: Tendencia
  colorClass?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
      <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span
          className={`text-xl font-semibold tabular-nums ${
            colorClass ? `${colorClass} px-2 py-0.5 rounded-md` : 'text-slate-900 dark:text-slate-50'
          }`}
        >
          {value}
        </span>
        {trend && tendenciaIcon(trend)}
      </div>
      {sub && (
        <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
          {sub}
        </div>
      )}
    </div>
  )
}

function VisaoGeral() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left col */}
      <div className="lg:col-span-8 space-y-4">
        {/* Quadro atual */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Quadro atual
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                Hipótese
              </div>
              <div className="mt-1 text-slate-700 dark:text-slate-200">
                Lombociatalgia mecânica L5/S1 — quadro álgico em redução consistente
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                Plano resumido
              </div>
              <div className="mt-1 text-slate-700 dark:text-slate-200">
                Terapia manual + estabilização lombar + progressão de carga. Frequência 2x/semana,
                40 sessões previstas (14/40 realizadas).
              </div>
            </div>
          </div>
        </div>

        {/* Mini-gráfico EVA */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Evolução da dor (EVA)
            </h2>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums">
              últimas 8 sessões
            </span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {evolucaoEVA.map((p) => (
              <div key={p.sessao} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className={`w-full rounded-t-md ${
                    p.eva <= 3
                      ? 'bg-emerald-400 dark:bg-emerald-500'
                      : p.eva <= 6
                        ? 'bg-amber-400 dark:bg-amber-500'
                        : 'bg-rose-400 dark:bg-rose-500'
                  }`}
                  style={{ height: `${(p.eva / 10) * 100}%` }}
                />
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                  {p.eva}
                </div>
                <div className="text-[9px] text-slate-300 dark:text-slate-600 font-mono">
                  S{p.sessao}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
            <span className="text-emerald-700 dark:text-emerald-300 font-medium">
              Redução de 5 pontos
            </span>
            <span className="text-slate-400 dark:text-slate-500">
              · desde início do tratamento
            </span>
          </div>
        </div>

        {/* Atividade recente */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Atividade recente
          </h2>
          <ul className="space-y-2.5">
            {atividade.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-slate-700 dark:text-slate-200">{a.descricao}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {formatDate(a.data)} · {diasDesde(a.data)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right col */}
      <div className="lg:col-span-4 space-y-4">
        {/* Próxima sessão */}
        <div className="rounded-2xl border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/30 p-5">
          <div className="text-[11px] text-teal-700 dark:text-teal-300 uppercase tracking-wide font-medium">
            Próxima sessão
          </div>
          <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
            {paciente.proximaSessaoData
              ? new Date(paciente.proximaSessaoData).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'short',
                })
              : '—'}
          </div>
          <div className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">14:00 · 60min</div>
          <button className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium transition-colors">
            Confirmar com paciente
          </button>
        </div>

        {/* Alertas */}
        {alertas.length > 0 && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" strokeWidth={2} />
              Alertas
            </h2>
            <ul className="space-y-2.5">
              {alertas.map((a) => (
                <li key={a.id} className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  {a.texto}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Atalhos */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Atalhos
          </h2>
          <div className="space-y-1">
            <Atalho icon={Activity} label="Nova evolução" />
            <Atalho icon={CalendarDays} label="Agendar sessão" />
            <Atalho icon={Sparkles} label="Prescrever exercício (Nymos Move)" />
            <Atalho icon={ClipboardList} label="Nova reavaliação" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Atalho({ icon: Icon, label }: { icon: typeof Activity; label: string }) {
  return (
    <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
      <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" strokeWidth={1.8} />
      <span className="flex-1 text-xs text-slate-700 dark:text-slate-200">{label}</span>
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" strokeWidth={2} />
    </button>
  )
}

function AvaliacoesTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Histórico de avaliações
        </h2>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium transition-colors">
          <ClipboardList className="w-3.5 h-3.5" strokeWidth={2} />
          Nova reavaliação
        </button>
      </div>
      <div className="space-y-2">
        {avaliacoes.map((av, i) => (
          <div
            key={av.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-teal-500 dark:hover:border-teal-500 cursor-pointer transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
                    av.tipo === 'inicial'
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {av.tipo === 'inicial' ? 'Inicial' : `Reav. #${avaliacoes.length - 1 - i}`}
                </div>
                <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                  {formatDate(av.data)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${evaColor(av.eva)}`}
                  >
                    EVA {av.eva}
                  </span>
                  {av.admPrincipal && (
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      {av.admPrincipal.articulacao}: {av.admPrincipal.valor}°
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 leading-snug">
                  {av.observacao}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-1" strokeWidth={2} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EvolucaoTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Timeline de sessões
        </h2>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium transition-colors">
          <Activity className="w-3.5 h-3.5" strokeWidth={2} />
          Nova evolução
        </button>
      </div>
      <div className="space-y-2">
        {sessoes.map((s, i) => (
          <div
            key={s.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 text-center">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-medium">
                  Sessão
                </div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
                  #{sessoes.length - i + (paciente.sessoesRealizadas - sessoes.length)}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                  {formatDate(s.data)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${evaColor(s.eva)}`}
                  >
                    EVA {s.eva}
                  </span>
                  {tendenciaIcon(s.tendencia)}
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                    {s.tendencia}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <SOAPField label="S" content={s.subjetivo} />
                  <SOAPField label="O" content={s.objetivo} />
                  <SOAPField label="A" content={s.avaliacao} />
                  <SOAPField label="P" content={s.plano} />
                </div>
                {s.condutas.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                    {s.condutas.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SOAPField({ label, content }: { label: string; content: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-[10px] font-bold flex items-center justify-center shrink-0">
        {label}
      </span>
      <span className="text-slate-600 dark:text-slate-300 leading-snug">{content}</span>
    </div>
  )
}

function AgendaTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Próximas sessões
        </h2>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium transition-colors">
          <CalendarDays className="w-3.5 h-3.5" strokeWidth={2} />
          Agendar sessão
        </button>
      </div>
      <div className="space-y-2">
        {proximas.map((ag) => (
          <div
            key={ag.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center gap-4"
          >
            <div className="shrink-0 text-center w-14">
              <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-medium">
                {new Date(ag.data).toLocaleDateString('pt-BR', { month: 'short' })}
              </div>
              <div className="text-xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
                {new Date(ag.data).getDate()}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                {new Date(ag.data).toLocaleDateString('pt-BR', { weekday: 'short' })}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-slate-900 dark:text-slate-50 font-medium">
                {ag.hora} · {ag.duracaoMin}min
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {diasAte(ag.data)}
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
                ag.status === 'confirmada'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {ag.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SaudeTab() {
  const avgPassos = Math.round(wearable.passos7d.reduce((a, b) => a + b, 0) / wearable.passos7d.length)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-8 space-y-4">
        {/* Passos */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Passos diários
            </h2>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums">
              média {avgPassos.toLocaleString('pt-BR')} · 7 dias
            </span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {wearable.passos7d.map((p, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t-md bg-teal-400 dark:bg-teal-500"
                  style={{ height: `${(p / 10000) * 100}%` }}
                />
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                  {(p / 1000).toFixed(1)}k
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aderência exercícios */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Aderência aos exercícios (Nymos Move)
            </h2>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums">
              últimas 5 semanas
            </span>
          </div>
          <div className="flex items-end gap-3 h-28">
            {wearable.aderenciaExerciciosSemanal.map((a, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className={`w-full rounded-t-md ${
                    a >= 80 ? 'bg-emerald-400 dark:bg-emerald-500' : 'bg-amber-400 dark:bg-amber-500'
                  }`}
                  style={{ height: `${a}%` }}
                />
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                  {a}%
                </div>
                <div className="text-[10px] text-slate-300 dark:text-slate-600 font-mono">
                  S{i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Sinais vitais
          </h2>
          <SinalRow label="Sono médio" value={`${wearable.sonoMediaHoras}h`} sub="últimas 7 noites" />
          <SinalRow label="FC repouso" value={`${wearable.fcRepouso} bpm`} />
          <SinalRow label="FC pico (7d)" value={`${wearable.fcPico7d} bpm`} />
        </div>

        {wearable.alertas.length > 0 && (
          <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/30 p-5">
            <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" strokeWidth={2} />
              Alertas de saúde
            </h2>
            <ul className="space-y-2">
              {wearable.alertas.map((a, i) => (
                <li key={i} className="text-xs text-amber-800 dark:text-amber-200 leading-snug">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function SinalRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <div>
        <div className="text-xs text-slate-600 dark:text-slate-300">{label}</div>
        {sub && <div className="text-[10px] text-slate-400 dark:text-slate-500">{sub}</div>}
      </div>
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
        {value}
      </div>
    </div>
  )
}
