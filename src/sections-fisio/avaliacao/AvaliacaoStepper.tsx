import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  FileDown,
  FileText,
  Info,
  Plus,
  Save,
  Search,
  Sparkles,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react'
import data from '@/../product-fisio/sections/avaliacao/data.json'
import type {
  DadosAnamnese,
  DiagnosticoSugerido,
  MedidaADM,
  PacienteAvaliacao,
  QueixaDor,
  StepAvaliacao,
  StatusStep,
  TesteFuncional,
} from '@/../product-fisio/sections/avaliacao/types'

const paciente = data.paciente as PacienteAvaliacao
const stepsData = data.steps as StepAvaliacao[]
const anamnese = data.anamnese as DadosAnamnese
const queixa = data.queixa as QueixaDor
const medidasADM = data.medidasADM as MedidaADM[]
const admInicial = data.admInicial as MedidaADM
const testes = data.testesFuncionais as TesteFuncional[]
const diagnosticos = data.diagnosticosSugeridos as DiagnosticoSugerido[]

function evaColor(eva: number) {
  if (eva <= 3) return 'bg-emerald-500'
  if (eva <= 6) return 'bg-amber-500'
  return 'bg-rose-500'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* ─────────────────────────── ENTRY POINT ─────────────────────────── */
interface AvaliacaoFinalizadaItem {
  id: string
  pacienteId: string
  pacienteNome: string
  pacienteIdade: number
  tipo: 'inicial' | 'reavaliacao' | 'alta'
  numeroReavaliacao?: number
  data: string
  eva: number
  evaInicial?: number
  admPrincipal?: { articulacao: string; valor: number; unidade: string }
  hipotese: string
  totalSessoesAteEntao: number
  fisioterapeuta: string
  duracaoMin: number
  assinada: boolean
  pdfDisponivel: boolean
}

interface PacienteParaAvaliacao {
  id: string
  nome: string
  idade: number
  queixaCurta: string
  evaAtual: number
  sessoesRealizadas: number
  proximaReavaliacaoSugerida?: boolean
}

const avaliacoesFinalizadas = (data.avaliacoesFinalizadas ?? []) as AvaliacaoFinalizadaItem[]

const TIPO_AVALIACAO_LABEL: Record<AvaliacaoFinalizadaItem['tipo'], string> = {
  inicial: 'Inicial',
  reavaliacao: 'Reavaliação',
  alta: 'Alta clínica',
}

const TIPO_AVALIACAO_TONE: Record<AvaliacaoFinalizadaItem['tipo'], string> = {
  inicial: 'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900/60',
  reavaliacao: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/60',
  alta: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60',
}

function evaListColor(eva: number) {
  if (eva <= 3) return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
  if (eva <= 6) return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40'
  return 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40'
}

function fmtDataLista(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function AvaliacaoPage() {
  const [view, setView] = useState<'lista' | 'stepper'>('lista')
  const [modalAberto, setModalAberto] = useState(false)
  const [busca, setBusca] = useState('')

  // Pacientes disponíveis para nova avaliação (vem do data de pacientes via leitura inline)
  const pacientesParaPicker = useMemo<PacienteParaAvaliacao[]>(() => {
    const pacientesData = (data as { pacientesLista?: PacienteParaAvaliacao[] }).pacientesLista
    return pacientesData ?? PACIENTES_FALLBACK
  }, [])

  if (view === 'stepper') {
    return <AvaliacaoStepperView onVoltar={() => setView('lista')} />
  }

  return (
    <>
      <AvaliacoesListView
        busca={busca}
        setBusca={setBusca}
        onNovaAvaliacao={() => setModalAberto(true)}
        onAbrirAvaliacao={() => setView('stepper')}
      />
      {modalAberto && (
        <SelecionarPacienteModal
          pacientes={pacientesParaPicker}
          onClose={() => setModalAberto(false)}
          onSelecionar={() => {
            setModalAberto(false)
            setView('stepper')
          }}
        />
      )}
    </>
  )
}

const PACIENTES_FALLBACK: PacienteParaAvaliacao[] = [
  { id: 'p-001', nome: 'Ana Carolina Mendes', idade: 42, queixaCurta: 'Lombociatalgia L5/S1', evaAtual: 3, sessoesRealizadas: 14, proximaReavaliacaoSugerida: true },
  { id: 'p-002', nome: 'Carlos Mendonça', idade: 58, queixaCurta: 'Dor lombar L4-L5', evaAtual: 5, sessoesRealizadas: 21, proximaReavaliacaoSugerida: true },
  { id: 'p-013', nome: 'Mariana Fontes', idade: 38, queixaCurta: 'Cervicobraquialgia', evaAtual: 7, sessoesRealizadas: 2 },
  { id: 'p-014', nome: 'Henrique Ferraz', idade: 48, queixaCurta: 'Pós-op manguito rotador', evaAtual: 6, sessoesRealizadas: 1 },
]

/* ─────────────────────────── LIST VIEW ─────────────────────────── */
function AvaliacoesListView({
  busca,
  setBusca,
  onNovaAvaliacao,
  onAbrirAvaliacao,
}: {
  busca: string
  setBusca: (v: string) => void
  onNovaAvaliacao: () => void
  onAbrirAvaliacao: (id: string) => void
}) {
  const visiveis = useMemo(() => {
    if (!busca.trim()) return avaliacoesFinalizadas
    const q = busca.toLowerCase()
    return avaliacoesFinalizadas.filter(
      (a) => a.pacienteNome.toLowerCase().includes(q) || a.hipotese.toLowerCase().includes(q),
    )
  }, [busca])

  const stats = useMemo(() => {
    const iniciais = avaliacoesFinalizadas.filter((a) => a.tipo === 'inicial').length
    const reavaliacoes = avaliacoesFinalizadas.filter((a) => a.tipo === 'reavaliacao').length
    const altas = avaliacoesFinalizadas.filter((a) => a.tipo === 'alta').length
    return { total: avaliacoesFinalizadas.length, iniciais, reavaliacoes, altas }
  }, [])

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <header className="mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="size-1.5 rounded-full bg-teal-500" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Clínico · Avaliações
            </span>
          </div>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="size-11 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-center shrink-0">
                <ClipboardList className="size-5 text-teal-600 dark:text-teal-400" strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Avaliações
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                  Histórico de avaliações cinético-funcionais finalizadas.
                </p>
              </div>
            </div>
            <button
              onClick={onNovaAvaliacao}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_-4px_rgba(20,184,166,0.45)]"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              Nova avaliação
            </button>
          </div>
        </header>

        {/* Stats inline */}
        <div className="flex items-baseline gap-2 mb-4 text-[13px] flex-wrap">
          <StatInline valor={stats.total.toString()} label="total" />
          <DivisorList />
          <StatInline valor={stats.iniciais.toString()} label="iniciais" />
          <DivisorList />
          <StatInline valor={stats.reavaliacoes.toString()} label="reavaliações" />
          <DivisorList />
          <StatInline valor={stats.altas.toString()} label="altas" />
        </div>

        {/* Busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" strokeWidth={1.75} />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por paciente ou hipótese diagnóstica…"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Lista */}
        <div className="space-y-2">
          {visiveis.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-10 text-center">
              <ClipboardList className="size-6 mx-auto text-slate-400 mb-2" strokeWidth={1.5} />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Nenhuma avaliação encontrada
              </p>
            </div>
          ) : (
            visiveis.map((a) => (
              <AvaliacaoRow key={a.id} avaliacao={a} onClick={() => onAbrirAvaliacao(a.id)} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function AvaliacaoRow({
  avaliacao,
  onClick,
}: {
  avaliacao: AvaliacaoFinalizadaItem
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-sm p-4 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
          {avaliacao.pacienteNome
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {avaliacao.pacienteNome}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-500">
              {avaliacao.pacienteIdade} anos
            </span>
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ring-1 ${TIPO_AVALIACAO_TONE[avaliacao.tipo]}`}
            >
              {avaliacao.tipo === 'reavaliacao' && avaliacao.numeroReavaliacao
                ? `Reav. #${avaliacao.numeroReavaliacao}`
                : TIPO_AVALIACAO_LABEL[avaliacao.tipo]}
            </span>
            {avaliacao.assinada && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                <CheckCircle2 className="size-2.5" strokeWidth={2.5} />
                Assinada
              </span>
            )}
          </div>
          <p className="mt-1 text-[12.5px] text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">
            {avaliacao.hipotese}
          </p>
          <div className="mt-2 flex items-center gap-3 text-[11px]">
            <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
              {fmtDataLista(avaliacao.data)}
            </span>
            <DivisorList />
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${evaListColor(avaliacao.eva)}`}
            >
              EVA {avaliacao.eva}
              {avaliacao.evaInicial !== undefined && (
                <span className="ml-1 opacity-70 font-mono">
                  (era {avaliacao.evaInicial})
                </span>
              )}
            </span>
            {avaliacao.admPrincipal && (
              <>
                <DivisorList />
                <span className="text-slate-600 dark:text-slate-400">
                  {avaliacao.admPrincipal.articulacao}:{' '}
                  <span className="font-mono">
                    {avaliacao.admPrincipal.valor}°
                  </span>
                </span>
              </>
            )}
            <DivisorList />
            <span className="text-slate-500 dark:text-slate-500 font-mono">
              {avaliacao.duracaoMin}min
            </span>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1">
          {avaliacao.pdfDisponivel && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-medium" title="PDF disponível">
              <FileText className="size-3" strokeWidth={2} />
              PDF
            </span>
          )}
          <ChevronRight className="size-4 text-slate-300 dark:text-slate-600" strokeWidth={2} />
        </div>
      </div>
    </button>
  )
}

function StatInline({ valor, label }: { valor: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono font-semibold text-slate-900 dark:text-slate-50 tabular-nums">{valor}</span>
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
    </span>
  )
}
function DivisorList() {
  return <span className="text-slate-300 dark:text-slate-700">·</span>
}

/* ─────────────────────────── MODAL: Selecionar Paciente ─────────────────────────── */
function SelecionarPacienteModal({
  pacientes,
  onClose,
  onSelecionar,
}: {
  pacientes: PacienteParaAvaliacao[]
  onClose: () => void
  onSelecionar: (p: PacienteParaAvaliacao) => void
}) {
  const [busca, setBusca] = useState('')
  const [selecionado, setSelecionado] = useState<string | null>(null)

  const visiveis = useMemo(() => {
    if (!busca.trim()) return pacientes
    const q = busca.toLowerCase()
    return pacientes.filter(
      (p) => p.nome.toLowerCase().includes(q) || p.queixaCurta.toLowerCase().includes(q),
    )
  }, [busca, pacientes])

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[560px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
          <div className="px-6 pt-5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="size-1.5 rounded-full bg-teal-500" />
                  <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                    Nova avaliação
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Selecionar paciente
                </h2>
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Para quem você quer abrir uma nova avaliação cinético-funcional?
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            </div>

            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" strokeWidth={1.75} />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar paciente…"
                autoFocus
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {visiveis.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                Nenhum paciente encontrado
              </div>
            ) : (
              <ul className="space-y-1">
                {visiveis.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => setSelecionado(p.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        selecionado === p.id
                          ? 'bg-teal-50 dark:bg-teal-950/40 ring-1 ring-teal-300 dark:ring-teal-700'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="size-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-[11px] shrink-0">
                        {p.nome
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                            {p.nome}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-500">
                            {p.idade}a
                          </span>
                          {p.proximaReavaliacaoSugerida && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-[9px] font-bold uppercase tracking-wider">
                              <Sparkles className="size-2" />
                              Reav. sugerida
                            </span>
                          )}
                        </div>
                        <div className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate">
                          {p.queixaCurta}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-600 mt-0.5">
                          {p.sessoesRealizadas} sessões · EVA {p.evaAtual}
                        </div>
                      </div>
                      {selecionado === p.id && (
                        <CheckCircle2 className="size-4 text-teal-600 dark:text-teal-400 shrink-0" strokeWidth={2.5} />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                const p = pacientes.find((x) => x.id === selecionado)
                if (p) onSelecionar(p)
              }}
              disabled={!selecionado}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-40 text-white text-sm font-medium"
            >
              <ClipboardList className="size-3.5" strokeWidth={2} />
              Iniciar avaliação
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─────────────────────────── STEPPER VIEW (existente) ─────────────────────────── */
function AvaliacaoStepperView({ onVoltar }: { onVoltar: () => void }) {
  const [activeStepIdx, setActiveStepIdx] = useState(3) // Goniometria

  const steps = useMemo(() => {
    return stepsData.map((s, idx) => {
      let status: StatusStep
      if (idx < activeStepIdx) status = 'completo'
      else if (idx === activeStepIdx) status = 'atual'
      else status = 'pendente'
      return { ...s, status }
    })
  }, [activeStepIdx])

  const completos = steps.filter((s) => s.status === 'completo').length
  const activeStep = steps[activeStepIdx]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Voltar */}
        <button
          onClick={onVoltar}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 mb-4"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          Voltar para lista
        </button>

        {/* Header */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 mb-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold">
                {paciente.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                    Avaliação cinético-funcional
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold uppercase tracking-wide">
                    {paciente.tipoAvaliacao === 'inicial'
                      ? 'Inicial'
                      : `Reavaliação #${paciente.numeroReavaliacao}`}
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {paciente.nome}, {paciente.idade} anos · {paciente.queixaPrincipal}
                </div>
                {paciente.ultimaAvaliacaoData && (
                  <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Última avaliação em {formatDate(paciente.ultimaAvaliacaoData)} · EVA inicial {paciente.evaInicial}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                  Progresso
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
                    {completos}/{steps.length}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    seções
                  </span>
                </div>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                <Save className="w-3.5 h-3.5" strokeWidth={2} />
                Salvar rascunho
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all"
              style={{ width: `${(completos / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Body — sidebar fixa + main flex (min-w-0 evita que tabela infle o grid) */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Stepper sidebar */}
          <aside className="lg:w-72 lg:shrink-0">
            <nav className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 lg:sticky lg:top-4">
              <ul className="space-y-0.5">
                {steps.map((s, idx) => (
                  <li key={s.id}>
                    <button
                      onClick={() => setActiveStepIdx(idx)}
                      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        s.status === 'atual'
                          ? 'bg-teal-50 dark:bg-teal-950/40'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {s.status === 'completo' ? (
                          <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                        ) : s.status === 'atual' ? (
                          <div className="w-5 h-5 rounded-full border-2 border-teal-500 bg-white dark:bg-slate-900 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-teal-500" />
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`text-[10px] font-mono tabular-nums ${
                              s.status === 'atual'
                                ? 'text-teal-600 dark:text-teal-400'
                                : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {String(s.numero).padStart(2, '0')}
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              s.status === 'atual'
                                ? 'text-teal-700 dark:text-teal-300'
                                : s.status === 'completo'
                                  ? 'text-slate-700 dark:text-slate-200'
                                  : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {s.titulo}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                          {s.resumo}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <FileDown className="w-3.5 h-3.5" strokeWidth={2} />
                  Gerar PDF
                </button>
              </div>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 space-y-4">
            {activeStep.id === 'goniometria' ? (
              <GoniometriaStep />
            ) : activeStep.id === 'anamnese' ? (
              <AnamneseStep />
            ) : activeStep.id === 'queixa' ? (
              <QueixaStep />
            ) : activeStep.id === 'inspecao' ? (
              <PlaceholderStep titulo="Inspeção & palpação" emoji="🔍" descricao="Esta etapa já foi concluída — observações registradas." />
            ) : activeStep.id === 'testes' ? (
              <TestesStep />
            ) : activeStep.id === 'hipotese' ? (
              <HipoteseStep />
            ) : (
              <PlaceholderStep titulo="Plano terapêutico" emoji="🎯" descricao="Defina objetivos SMART e condutas previstas para o tratamento." />
            )}

            {/* Footer navigation */}
            <div className="sticky bottom-0 -mx-6 px-6 py-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                disabled={activeStepIdx === 0}
                onClick={() => setActiveStepIdx(Math.max(0, activeStepIdx - 1))}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                Voltar
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                  Etapa {activeStepIdx + 1} de {steps.length}
                </span>
                {activeStepIdx === steps.length - 1 ? (
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium">
                    <Stethoscope className="w-4 h-4" strokeWidth={2} />
                    Finalizar e assinar
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveStepIdx(Math.min(steps.length - 1, activeStepIdx + 1))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function StepHeader({ numero, titulo, hint }: { numero: number; titulo: string; hint?: string }) {
  return (
    <div className="mb-4">
      <div className="text-[11px] text-teal-600 dark:text-teal-400 font-mono tabular-nums uppercase tracking-wide font-semibold">
        Etapa {String(numero).padStart(2, '0')}
      </div>
      <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">{titulo}</h2>
      {hint && (
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">{hint}</p>
      )}
    </div>
  )
}

function GoniometriaStep() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
      <StepHeader
        numero={4}
        titulo="Goniometria (ADM)"
        hint="Mensure a amplitude de movimento de cada articulação. Comparativo com lado contralateral e referência padrão. Diff com avaliação inicial em destaque."
      />

      {/* Banner comparativo */}
      <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-3 flex items-start gap-3">
        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" strokeWidth={2} />
        <div className="flex-1 text-xs">
          <span className="font-semibold text-emerald-900 dark:text-emerald-200">
            Ganho cinético-funcional desde a inicial
          </span>
          <span className="text-emerald-700 dark:text-emerald-300">
            {' '}
            — Flexão lombar progrediu de 35° para 60° (+25°, 71% de ganho)
          </span>
        </div>
      </div>

      {/* Tabela de medidas */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr className="text-left">
              <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Articulação / Movimento
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">
                Direito
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">
                Esquerdo
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">
                Referência
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">
                % atingido
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">
                Diff inicial
              </th>
            </tr>
          </thead>
          <tbody>
            {medidasADM.map((m, idx) => {
              const media = (m.direito + m.esquerdo) / 2
              const pct = Math.round((media / m.referencia) * 100)
              const diff = m.id === admInicial.id ? (m.direito + m.esquerdo) / 2 - (admInicial.direito + admInicial.esquerdo) / 2 : null
              return (
                <tr
                  key={m.id}
                  className={`border-t border-slate-100 dark:border-slate-800 ${idx % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-slate-800/20'}`}
                >
                  <td className="px-4 py-2.5">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      {m.articulacao}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {m.movimento}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <input
                      type="number"
                      defaultValue={m.direito}
                      className="w-16 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-sm text-slate-900 dark:text-slate-50 tabular-nums focus:outline-none focus:border-teal-500"
                    />
                    <span className="ml-1 text-[11px] text-slate-400 dark:text-slate-500">°</span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <input
                      type="number"
                      defaultValue={m.esquerdo}
                      className="w-16 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-sm text-slate-900 dark:text-slate-50 tabular-nums focus:outline-none focus:border-teal-500"
                    />
                    <span className="ml-1 text-[11px] text-slate-400 dark:text-slate-500">°</span>
                  </td>
                  <td className="px-4 py-2.5 text-center text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                    {m.referencia}°
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tabular-nums ${
                        pct >= 85
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : pct >= 65
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {pct}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {diff !== null ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
                        +{diff}°
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-300 dark:text-slate-700">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Info className="w-3.5 h-3.5" strokeWidth={2} />
        Referência baseada em padrões AAOS · valores podem variar conforme idade
      </div>
    </div>
  )
}

function AnamneseStep() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
      <StepHeader
        numero={1}
        titulo="Anamnese"
        hint="Histórico médico e contexto de vida do paciente que pode influenciar o tratamento."
      />
      <Field label="HMA (História da Moléstia Atual)">
        <textarea
          defaultValue={anamnese.hma}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-50 resize-none focus:outline-none focus:border-teal-500"
        />
      </Field>
      <Field label="HMP (História da Moléstia Pregressa)">
        <textarea
          defaultValue={anamnese.hmp}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-50 resize-none focus:outline-none focus:border-teal-500"
        />
      </Field>
      <Field label="Medicações em uso">
        <div className="flex flex-wrap gap-1.5">
          {anamnese.medicacoes.map((m) => (
            <span
              key={m}
              className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200"
            >
              {m}
            </span>
          ))}
          <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
            + Adicionar
          </button>
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Atividade física">
          <input
            type="text"
            defaultValue={anamnese.atividadeFisica}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          />
        </Field>
        <Field label="Ocupação">
          <input
            type="text"
            defaultValue={anamnese.ocupacao}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          />
        </Field>
      </div>
    </div>
  )
}

function QueixaStep() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
      <StepHeader numero={2} titulo="Queixa principal" hint="Como a dor se manifesta hoje." />
      <Field label="Descrição da queixa">
        <textarea
          defaultValue={queixa.descricao}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-50 resize-none"
        />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
            EVA atual
          </label>
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold tabular-nums ${evaColor(queixa.eva)}`}>
              {queixa.eva}
            </div>
            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={10}
                defaultValue={queixa.eva}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
        <Field label="Tipo">
          <select
            defaultValue={queixa.tipo}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          >
            <option value="aguda">Aguda</option>
            <option value="cronica">Crônica</option>
            <option value="mista">Mista</option>
          </select>
        </Field>
      </div>
      <Field label="Localização">
        <input
          type="text"
          defaultValue={queixa.localizacao}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
        />
      </Field>
    </div>
  )
}

function TestesStep() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
      <StepHeader
        numero={5}
        titulo="Testes funcionais"
        hint="Aplique os testes relevantes à queixa. Marque o resultado e adicione observações."
      />
      <div className="space-y-2">
        {testes.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 p-3"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {t.nome}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    {t.categoria}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {t.descricaoCurta}
                </div>
                {t.observacao && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 italic">
                    {t.observacao}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                {(['negativo', 'positivo', 'inconclusivo', 'nao-aplicado'] as const).map((r) => (
                  <button
                    key={r}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                      t.resultado === r
                        ? r === 'positivo'
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300'
                          : r === 'negativo'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {r === 'nao-aplicado' ? 'N/A' : r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HipoteseStep() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
      <StepHeader numero={6} titulo="Hipótese diagnóstica" hint="Diagnóstico cinético-funcional com base nos dados coletados. Códigos CID opcionais." />

      <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 p-3">
        <div className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide mb-2">
          Sugestões do sistema
        </div>
        <div className="space-y-2">
          {diagnosticos.map((d, i) => (
            <button
              key={i}
              className="w-full flex items-start justify-between gap-3 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors text-left"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {d.codigo && (
                    <span className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold">
                      {d.codigo}
                    </span>
                  )}
                  <span className="text-sm text-slate-900 dark:text-slate-50">{d.hipotese}</span>
                </div>
              </div>
              <span
                className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
                  d.confianca === 'alta'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : d.confianca === 'media'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Confiança {d.confianca}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Field label="Hipótese diagnóstica final (texto livre)">
        <textarea
          rows={4}
          placeholder="Descreva sua conclusão diagnóstica cinético-funcional…"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-50 resize-none focus:outline-none focus:border-teal-500"
        />
      </Field>
    </div>
  )
}

function PlaceholderStep({
  titulo,
  emoji,
  descricao,
}: {
  titulo: string
  emoji: string
  descricao: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center">
      <div className="text-5xl mb-3">{emoji}</div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{titulo}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">{descricao}</p>
      <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
        Seção concluída
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

// suppress unused warnings
void TrendingDown
void ChevronRight
