import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Lightbulb,
  Save,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react'
import data from '@/../product-fisio/sections/evolucao/data.json'
import type {
  CondutaOption,
  FormEvolucao,
  PacienteSessao,
  SugestaoConduta,
  Tendencia,
} from '@/../product-fisio/sections/evolucao/types'

const paciente = data.pacienteFoco as PacienteSessao
const condutas = data.condutas as CondutaOption[]
const categorias = data.categorias as Array<{ id: string; label: string; emoji: string }>
const sugestoes = data.sugestoes as SugestaoConduta[]
const ultimaSessao = data.ultimaSessaoResumo as {
  data: string
  eva: number
  subjetivo: string
  plano: string
}

function evaColor(eva: number) {
  if (eva <= 3) return 'bg-emerald-500'
  if (eva <= 6) return 'bg-amber-500'
  return 'bg-rose-500'
}

function evaLabel(eva: number) {
  if (eva === 0) return 'Sem dor'
  if (eva <= 3) return 'Dor leve'
  if (eva <= 6) return 'Dor moderada'
  if (eva <= 9) return 'Dor intensa'
  return 'Pior dor possível'
}

function tendenciaColor(t: Tendencia) {
  if (t === 'melhora') return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
  if (t === 'piora') return 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
  return 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

/* ─────────────────────────── ENTRY POINT ─────────────────────────── */
interface EvolucaoItem {
  id: string
  pacienteId: string
  pacienteNome: string
  sessaoNumero: number
  data: string
  eva: number
  evaAnterior: number
  tendencia: Tendencia
  condutas: string[]
  subjetivoCurto: string
  tempoMin: number
}

const evolucoesRecentes = (data.evolucoesRecentes ?? []) as EvolucaoItem[]

function evaListTone(eva: number) {
  if (eva <= 3) return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
  if (eva <= 6) return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40'
  return 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40'
}

function tendenciaIconList(t: Tendencia) {
  if (t === 'melhora')
    return <TrendingDown className="size-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
  if (t === 'piora')
    return <TrendingUp className="size-3 text-rose-600 dark:text-rose-400" strokeWidth={2.5} />
  return <Activity className="size-3 text-slate-500" strokeWidth={2.5} />
}

function fmtDataEv(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

function diasDesdeEv(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso + 'T12:00:00').getTime()) / (1000 * 60 * 60 * 24))
  if (d === 0) return 'hoje'
  if (d === 1) return 'ontem'
  if (d < 7) return `há ${d}d`
  return fmtDataEv(iso)
}

export default function EvolucaoPage() {
  const [view, setView] = useState<'lista' | 'form'>('lista')

  if (view === 'form') {
    return <EvolucaoFormView onVoltar={() => setView('lista')} />
  }

  return <EvolucoesListView onAbrirEvolucao={() => setView('form')} onNovaEvolucao={() => setView('form')} />
}

/* ─────────────────────────── LIST VIEW ─────────────────────────── */
function EvolucoesListView({
  onAbrirEvolucao,
  onNovaEvolucao,
}: {
  onAbrirEvolucao: (id: string) => void
  onNovaEvolucao: () => void
}) {
  const [busca, setBusca] = useState('')

  const visiveis = useMemo(() => {
    if (!busca.trim()) return evolucoesRecentes
    const q = busca.toLowerCase()
    return evolucoesRecentes.filter(
      (e) =>
        e.pacienteNome.toLowerCase().includes(q) || e.subjetivoCurto.toLowerCase().includes(q),
    )
  }, [busca])

  // Sugestão: pacientes únicos da busca (pra "registrar nova evolução pra X")
  const pacientesSugeridos = useMemo(() => {
    if (!busca.trim()) return []
    const q = busca.toLowerCase()
    const seen = new Set<string>()
    const lista: { id: string; nome: string; ultimaSessao: number }[] = []
    for (const e of evolucoesRecentes) {
      if (seen.has(e.pacienteId)) continue
      if (!e.pacienteNome.toLowerCase().includes(q)) continue
      seen.add(e.pacienteId)
      lista.push({ id: e.pacienteId, nome: e.pacienteNome, ultimaSessao: e.sessaoNumero })
    }
    return lista.slice(0, 3)
  }, [busca])

  const stats = useMemo(() => {
    const hoje = new Date().toISOString().slice(0, 10)
    const dataHoje = evolucoesRecentes.filter((e) => e.data === hoje).length
    const melhora = evolucoesRecentes.filter((e) => e.tendencia === 'melhora').length
    return { total: evolucoesRecentes.length, dataHoje, melhora }
  }, [])

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <header className="mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="size-1.5 rounded-full bg-teal-500" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Clínico · Evoluções
            </span>
          </div>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="size-11 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-center shrink-0">
                <Activity className="size-5 text-teal-600 dark:text-teal-400" strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Evoluções
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                  Histórico SOAP por sessão. Busque por paciente para registrar nova evolução.
                </p>
              </div>
            </div>
            <button
              onClick={onNovaEvolucao}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_-4px_rgba(20,184,166,0.45)]"
            >
              <Activity className="size-4" strokeWidth={2.5} />
              Nova evolução
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="flex items-baseline gap-2 mb-4 text-[13px] flex-wrap">
          <span className="inline-flex items-baseline gap-1.5">
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
              {stats.total}
            </span>
            <span className="text-slate-500 dark:text-slate-400">evoluções</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="inline-flex items-baseline gap-1.5">
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
              {stats.dataHoje}
            </span>
            <span className="text-slate-500 dark:text-slate-400">hoje</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="inline-flex items-baseline gap-1.5">
            <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-300 tabular-nums">
              {stats.melhora}
            </span>
            <span className="text-slate-500 dark:text-slate-400">em melhora</span>
          </span>
        </div>

        {/* Busca de paciente */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" strokeWidth={1.75} />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar paciente para registrar evolução…"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Sugestão de pacientes (aparece quando busca tem texto) */}
        {pacientesSugeridos.length > 0 && (
          <div className="mb-4 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/20 p-2">
            <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-teal-700 dark:text-teal-300 px-2 py-1">
              Registrar nova evolução para
            </div>
            <ul className="space-y-1">
              {pacientesSugeridos.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={onNovaEvolucao}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-900 transition-colors text-left"
                  >
                    <div className="size-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-[10px] shrink-0">
                      {p.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                        {p.nome}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        Última sessão: #{p.ultimaSessao}
                      </div>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-teal-600 text-white text-[11px] font-medium">
                      <Activity className="size-3" strokeWidth={2.5} />
                      Nova evolução
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lista de evoluções */}
        <div className="space-y-2">
          {visiveis.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-10 text-center">
              <Activity className="size-6 mx-auto text-slate-400 mb-2" strokeWidth={1.5} />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Nenhuma evolução encontrada
              </p>
            </div>
          ) : (
            visiveis.map((e) => (
              <EvolucaoRow key={e.id} evolucao={e} onClick={() => onAbrirEvolucao(e.id)} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function EvolucaoRow({
  evolucao,
  onClick,
}: {
  evolucao: EvolucaoItem
  onClick: () => void
}) {
  const diff = evolucao.eva - evolucao.evaAnterior
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-sm p-4 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
          {evolucao.pacienteNome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {evolucao.pacienteNome}
            </h3>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
              Sessão #{evolucao.sessaoNumero}
            </span>
            {tendenciaIconList(evolucao.tendencia)}
            <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
              {evolucao.tendencia}
            </span>
          </div>
          <p className="mt-1 text-[12.5px] text-slate-700 dark:text-slate-300 leading-snug line-clamp-2 italic">
            &ldquo;{evolucao.subjetivoCurto}&rdquo;
          </p>
          <div className="mt-2 flex items-center gap-2 text-[11px] flex-wrap">
            <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
              {diasDesdeEv(evolucao.data)}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${evaListTone(evolucao.eva)}`}
            >
              EVA {evolucao.eva}
              {diff !== 0 && (
                <span className={`ml-1 font-mono ${diff < 0 ? 'opacity-80' : 'opacity-90'}`}>
                  ({diff > 0 ? '+' : ''}
                  {diff})
                </span>
              )}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="font-mono text-slate-500 dark:text-slate-500">{evolucao.tempoMin}min</span>
          </div>
          {evolucao.condutas.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {evolucao.condutas.slice(0, 4).map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400"
                >
                  {c}
                </span>
              ))}
              {evolucao.condutas.length > 4 && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 px-1">
                  +{evolucao.condutas.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
        <ChevronRight className="size-4 text-slate-300 dark:text-slate-600 shrink-0" strokeWidth={2} />
      </div>
    </button>
  )
}

/* ─────────────────────────── FORM VIEW (existente) ─────────────────────────── */
function EvolucaoFormView({ onVoltar }: { onVoltar: () => void }) {
  const [form, setForm] = useState<FormEvolucao>({
    eva: paciente.evaUltimaSessao,
    subjetivo: '',
    objetivo: '',
    avaliacao: '',
    plano: '',
    tendencia: 'estavel',
    condutasSelecionadas: [],
  })
  const [mostrarUltimaSessao, setMostrarUltimaSessao] = useState(false)
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null)
  const [finalizado, setFinalizado] = useState(false)

  const condutasFiltradas = useMemo(
    () => (filtroCategoria ? condutas.filter((c) => c.categoria === filtroCategoria) : condutas),
    [filtroCategoria],
  )

  const camposPreenchidos = [form.subjetivo, form.objetivo, form.avaliacao, form.plano].filter(
    (s) => s.trim().length > 0,
  ).length

  const toggleConduta = (id: string) => {
    setForm((prev) => ({
      ...prev,
      condutasSelecionadas: prev.condutasSelecionadas.includes(id)
        ? prev.condutasSelecionadas.filter((c) => c !== id)
        : [...prev.condutasSelecionadas, id],
    }))
  }

  if (finalizado) {
    return <EvolucaoSalva onNova={() => setFinalizado(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-[1000px] mx-auto px-6 py-6 space-y-5">
        {/* Voltar */}
        <button
          onClick={onVoltar}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          Voltar para lista
        </button>

        {/* Header */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold">
                {paciente.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                    {paciente.nome}
                  </h1>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {paciente.idade} anos · {paciente.queixaCurta}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium">
                    Sessão #{paciente.sessaoNumero}
                  </span>
                  <span>
                    Última: {formatDate(paciente.ultimaSessaoData)} · EVA {paciente.evaUltimaSessao}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                Auto-save ativo
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <Save className="w-3 h-3" strokeWidth={2} />
                Salvo há 4s
              </div>
            </div>
          </div>

          {/* Última sessão (collapsible) */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setMostrarUltimaSessao((v) => !v)}
              className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              <span className="font-medium">
                Última sessão ({formatDate(ultimaSessao.data)} · EVA {ultimaSessao.eva})
              </span>
              {mostrarUltimaSessao ? (
                <ChevronUp className="w-3.5 h-3.5" strokeWidth={2} />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
              )}
            </button>
            {mostrarUltimaSessao && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                    Como chegou
                  </div>
                  <p className="mt-1 text-slate-700 dark:text-slate-200 leading-snug">
                    {ultimaSessao.subjetivo}
                  </p>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                    Plano daquela sessão
                  </div>
                  <p className="mt-1 text-slate-700 dark:text-slate-200 leading-snug">
                    {ultimaSessao.plano}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* EVA slider */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Escala visual analógica (EVA)
            </h2>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              pré-preenchida da última sessão
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={form.eva}
                onChange={(e) => setForm({ ...form, eva: Number(e.target.value) })}
                className="w-full eva-slider"
                style={{
                  background: `linear-gradient(to right,
                    rgb(16 185 129) 0%,
                    rgb(16 185 129) 30%,
                    rgb(245 158 11) 30%,
                    rgb(245 158 11) 60%,
                    rgb(244 63 94) 60%,
                    rgb(244 63 94) 100%)`,
                  height: 8,
                  borderRadius: 4,
                  appearance: 'none',
                }}
              />
              <div className="flex justify-between mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                {Array.from({ length: 11 }, (_, i) => (
                  <span key={i}>{i}</span>
                ))}
              </div>
            </div>
            <div className="text-center min-w-[88px]">
              <div
                className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold tabular-nums ${evaColor(form.eva)}`}
              >
                {form.eva}
              </div>
              <div className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                {evaLabel(form.eva)}
              </div>
            </div>
          </div>

          {form.eva !== paciente.evaUltimaSessao && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs">
              {form.eva < paciente.evaUltimaSessao ? (
                <>
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                    Redução de {paciente.evaUltimaSessao - form.eva}{' '}
                    {paciente.evaUltimaSessao - form.eva === 1 ? 'ponto' : 'pontos'}
                  </span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" strokeWidth={2} />
                  <span className="text-rose-700 dark:text-rose-300 font-medium">
                    Aumento de {form.eva - paciente.evaUltimaSessao}{' '}
                    {form.eva - paciente.evaUltimaSessao === 1 ? 'ponto' : 'pontos'}
                  </span>
                </>
              )}
              <span className="text-slate-400 dark:text-slate-500">
                · vs última sessão (EVA {paciente.evaUltimaSessao})
              </span>
            </div>
          )}
        </div>

        {/* SOAP cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SOAPCard
            letra="S"
            titulo="Subjetivo"
            placeholder="Como o paciente chegou? O que ele relata?"
            value={form.subjetivo}
            onChange={(v) => setForm({ ...form, subjetivo: v })}
          />
          <SOAPCard
            letra="O"
            titulo="Objetivo"
            placeholder="O que você observou? Medidas, testes, alterações."
            value={form.objetivo}
            onChange={(v) => setForm({ ...form, objetivo: v })}
          />
          <SOAPCard
            letra="A"
            titulo="Avaliação"
            placeholder="Como está evoluindo? Hipótese para hoje."
            value={form.avaliacao}
            onChange={(v) => setForm({ ...form, avaliacao: v })}
          />
          <SOAPCard
            letra="P"
            titulo="Plano"
            placeholder="Próxima sessão: condutas, ajustes, orientações."
            value={form.plano}
            onChange={(v) => setForm({ ...form, plano: v })}
          />
        </div>

        {/* Tendência */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Tendência geral
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {(['melhora', 'estavel', 'piora'] as Tendencia[]).map((t) => (
              <button
                key={t}
                onClick={() => setForm({ ...form, tendencia: t })}
                className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                  form.tendencia === t
                    ? tendenciaColor(t)
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {t === 'melhora' ? '↗ Melhora' : t === 'piora' ? '↘ Piora' : '→ Estável'}
              </button>
            ))}
          </div>
        </div>

        {/* Condutas */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Condutas aplicadas
            </h2>
            {form.condutasSelecionadas.length > 0 && (
              <span className="text-[11px] text-teal-700 dark:text-teal-300 font-mono tabular-nums">
                {form.condutasSelecionadas.length} selecionada
                {form.condutasSelecionadas.length === 1 ? '' : 's'}
              </span>
            )}
          </div>

          {/* Filtro de categoria */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
            <button
              onClick={() => setFiltroCategoria(null)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filtroCategoria === null
                  ? 'bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Todas
            </button>
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setFiltroCategoria(c.id)}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1 ${
                  filtroCategoria === c.id
                    ? 'bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{c.emoji}</span>
                {c.label}
              </button>
            ))}
          </div>

          {/* Chips de condutas */}
          <div className="flex flex-wrap gap-1.5">
            {condutasFiltradas.map((c) => {
              const selected = form.condutasSelecionadas.includes(c.id)
              return (
                <button
                  key={c.id}
                  onClick={() => toggleConduta(c.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selected
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-300 dark:hover:border-teal-700'
                  }`}
                >
                  {selected && <CheckCircle2 className="inline w-3 h-3 mr-1" strokeWidth={2.5} />}
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Sugestões */}
        {sugestoes.length > 0 && (
          <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/30 p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" strokeWidth={2} />
              <div className="flex-1">
                <div className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  Sugestões baseadas na última sessão
                </div>
                <ul className="mt-2 space-y-1.5">
                  {sugestoes.map((s) => (
                    <li key={s.id} className="text-xs text-amber-900 dark:text-amber-100">
                      <span className="font-medium">{s.label}</span>
                      <span className="text-amber-700 dark:text-amber-300"> — {s.motivo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="sticky bottom-0 -mx-6 px-6 py-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="tabular-nums">
              {camposPreenchidos}/4 campos preenchidos
            </span>
            <button className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50">
              <Camera className="w-3.5 h-3.5" strokeWidth={2} />
              Anexar foto
            </button>
          </div>
          <button
            onClick={() => setFinalizado(true)}
            disabled={camposPreenchidos === 0}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
            Finalizar evolução
          </button>
        </div>
      </div>
    </div>
  )
}

function SOAPCard({
  letra,
  titulo,
  placeholder,
  value,
  onChange,
}: {
  letra: string
  titulo: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center">
          {letra}
        </span>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{titulo}</h3>
        {value.trim().length > 0 && (
          <CheckCircle2 className="ml-auto w-4 h-4 text-emerald-500" strokeWidth={2} />
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-colors"
      />
    </div>
  )
}

function EvolucaoSalva({ onNova }: { onNova: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Evolução registrada
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Sessão #{paciente.sessaoNumero} de {paciente.nome} salva no prontuário. O gráfico de evolução foi atualizado.
        </p>

        <div className="mt-6 space-y-2">
          <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium">
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
            Agendar próxima sessão
          </button>
          <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
            <Sparkles className="w-4 h-4" strokeWidth={2} />
            Prescrever exercício (Nymos Move)
          </button>
          <button
            onClick={onNova}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Activity className="w-4 h-4" strokeWidth={2} />
            Nova evolução (outro paciente)
          </button>
        </div>
      </div>
    </div>
  )
}

// suppress unused import warning
void X
