import { useMemo, useState } from 'react'
import {
  Briefcase,
  Check,
  Copy,
  House,
  MapPin,
  MoreHorizontal,
  Plus,
  Sparkles,
  Trash2,
  Video,
  X,
} from 'lucide-react'
import initialData from '@/../product-fisio/sections/servicos/data.json'
import type {
  CorChip,
  Modalidade,
  Servico,
} from '@/../product-fisio/sections/servicos/types'

const MODALIDADE_LABEL: Record<Modalidade, string> = {
  presencial: 'Presencial',
  teleconsulta: 'Teleconsulta',
  domicilio: 'Domicílio',
}

const MODALIDADE_ICON: Record<Modalidade, typeof MapPin> = {
  presencial: MapPin,
  teleconsulta: Video,
  domicilio: House,
}

const CORES: { id: CorChip; bg: string; ring: string; text: string }[] = [
  { id: 'teal', bg: 'bg-teal-100 dark:bg-teal-900/40', ring: 'ring-teal-300 dark:ring-teal-700', text: 'text-teal-700 dark:text-teal-300' },
  { id: 'sky', bg: 'bg-sky-100 dark:bg-sky-900/40', ring: 'ring-sky-300 dark:ring-sky-700', text: 'text-sky-700 dark:text-sky-300' },
  { id: 'violet', bg: 'bg-violet-100 dark:bg-violet-900/40', ring: 'ring-violet-300 dark:ring-violet-700', text: 'text-violet-700 dark:text-violet-300' },
  { id: 'emerald', bg: 'bg-emerald-100 dark:bg-emerald-900/40', ring: 'ring-emerald-300 dark:ring-emerald-700', text: 'text-emerald-700 dark:text-emerald-300' },
  { id: 'amber', bg: 'bg-amber-100 dark:bg-amber-900/40', ring: 'ring-amber-300 dark:ring-amber-700', text: 'text-amber-700 dark:text-amber-300' },
  { id: 'rose', bg: 'bg-rose-100 dark:bg-rose-900/40', ring: 'ring-rose-300 dark:ring-rose-700', text: 'text-rose-700 dark:text-rose-300' },
  { id: 'slate', bg: 'bg-slate-100 dark:bg-slate-800', ring: 'ring-slate-300 dark:ring-slate-600', text: 'text-slate-700 dark:text-slate-300' },
]

function corStyle(c: CorChip) {
  return CORES.find((x) => x.id === c) ?? CORES[0]
}

function fmtBRL(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ServicosList() {
  const [servicos, setServicos] = useState<Servico[]>(initialData.servicos as Servico[])
  const [filtroModalidade, setFiltroModalidade] = useState<Modalidade | 'todas'>('todas')
  const [drawerServico, setDrawerServico] = useState<Servico | 'novo' | null>(null)
  const [menuAberto, setMenuAberto] = useState<string | null>(null)

  const servicosVisiveis = useMemo(() => {
    if (filtroModalidade === 'todas') return servicos
    return servicos.filter((s) => s.modalidade === filtroModalidade)
  }, [servicos, filtroModalidade])

  const stats = useMemo(() => {
    const ativos = servicos.filter((s) => s.ativo)
    const valorMedio = ativos.length
      ? Math.round(ativos.reduce((a, s) => a + s.valorCentavos, 0) / ativos.length)
      : 0
    const duracaoMedia = ativos.length
      ? Math.round(ativos.reduce((a, s) => a + s.duracaoMin, 0) / ativos.length)
      : 0
    return { total: servicos.length, ativos: ativos.length, valorMedio, duracaoMedia }
  }, [servicos])

  const counts = useMemo(() => {
    const c: Record<Modalidade | 'todas', number> = {
      todas: servicos.length,
      presencial: 0,
      teleconsulta: 0,
      domicilio: 0,
    }
    for (const s of servicos) c[s.modalidade]++
    return c
  }, [servicos])

  const toggleAtivo = (id: string) => {
    setServicos((curr) => curr.map((s) => (s.id === id ? { ...s, ativo: !s.ativo } : s)))
  }

  const duplicar = (s: Servico) => {
    const novo: Servico = {
      ...s,
      id: `srv-${Date.now()}`,
      nome: `${s.nome} (cópia)`,
      agendadoUlt30d: 0,
    }
    setServicos((curr) => [...curr, novo])
    setMenuAberto(null)
  }

  const remover = (id: string) => {
    setServicos((curr) => curr.filter((s) => s.id !== id))
    setMenuAberto(null)
  }

  const salvar = (s: Servico) => {
    setServicos((curr) => {
      const exists = curr.some((x) => x.id === s.id)
      if (exists) return curr.map((x) => (x.id === s.id ? s : x))
      return [...curr, s]
    })
    setDrawerServico(null)
  }

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="size-1.5 rounded-full bg-teal-500" />
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                Catálogo · Serviços
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-11 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-center shrink-0">
                <Briefcase className="size-5 text-teal-600 dark:text-teal-400" strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Serviços
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                  Tipos de atendimento que você oferece. Pacientes escolhem na hora de agendar.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setDrawerServico('novo')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_-4px_rgba(20,184,166,0.45)]"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            Novo serviço
          </button>
        </div>

        {/* Stats inline */}
        <div className="flex items-baseline gap-2 mb-5 text-[13px] flex-wrap">
          <Stat valor={stats.total.toString()} label="serviços" />
          <Divisor />
          <Stat valor={stats.ativos.toString()} label="ativos" />
          <Divisor />
          <Stat valor={fmtBRL(stats.valorMedio)} label="valor médio" />
          <Divisor />
          <Stat valor={`${stats.duracaoMedia}min`} label="duração média" />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {(['todas', 'presencial', 'teleconsulta', 'domicilio'] as const).map((m) => {
            const ativo = filtroModalidade === m
            const count = counts[m]
            return (
              <button
                key={m}
                onClick={() => setFiltroModalidade(m)}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition-colors ${
                  ativo
                    ? 'bg-slate-900 text-white ring-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:ring-slate-100'
                    : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 dark:hover:bg-slate-800'
                }`}
              >
                {m === 'todas' ? 'Todas' : MODALIDADE_LABEL[m]}
                <span className={`font-mono text-[10px] tabular-nums ${ativo ? 'text-slate-300 dark:text-slate-500' : 'text-slate-400 dark:text-slate-600'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {servicosVisiveis.map((s) => {
            const cor = corStyle(s.cor)
            const Icon = MODALIDADE_ICON[s.modalidade]
            return (
              <div
                key={s.id}
                className={`relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 ${
                  s.ativo ? '' : 'opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`shrink-0 inline-flex items-center justify-center size-10 rounded-xl ring-1 ${cor.bg} ${cor.ring}`}>
                    <Icon className={`size-4 ${cor.text}`} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                        {s.nome}
                      </h3>
                      {s.incluiAvaliacaoInicial && (
                        <span className="inline-flex items-center gap-0.5 rounded-md px-1 py-0.5 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[9px] font-semibold uppercase tracking-wider">
                          <Sparkles className="size-2" />
                          Avaliação
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                      {s.descricao}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-[11px]">
                      <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <span className={`size-1.5 rounded-full ${cor.bg.replace('bg-', 'bg-').replace('/40', '')}`} />
                        {MODALIDADE_LABEL[s.modalidade]}
                      </span>
                      <span className="text-slate-400 dark:text-slate-600">·</span>
                      <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        {s.duracaoMin}min
                      </span>
                      <span className="text-slate-400 dark:text-slate-600">·</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-50">
                        {fmtBRL(s.valorCentavos)}
                      </span>
                    </div>
                    {s.agendadoUlt30d !== undefined && s.agendadoUlt30d > 0 && (
                      <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        {s.agendadoUlt30d} agendamentos · últimos 30 dias
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 flex items-start gap-1">
                    <Toggle ativo={s.ativo} onToggle={() => toggleAtivo(s.id)} />
                    <div className="relative">
                      <button
                        onClick={() => setMenuAberto(menuAberto === s.id ? null : s.id)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <MoreHorizontal className="size-4" strokeWidth={2} />
                      </button>
                      {menuAberto === s.id && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setMenuAberto(null)} />
                          <div className="absolute right-0 top-9 z-40 min-w-[180px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl py-1">
                            <button
                              onClick={() => {
                                setDrawerServico(s)
                                setMenuAberto(null)
                              }}
                              className="w-full px-3 py-1.5 text-left text-[13px] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => duplicar(s)}
                              className="w-full px-3 py-1.5 text-left text-[13px] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 inline-flex items-center gap-2"
                            >
                              <Copy className="size-3" /> Duplicar
                            </button>
                            <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                            <button
                              onClick={() => remover(s.id)}
                              className="w-full px-3 py-1.5 text-left text-[13px] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 inline-flex items-center gap-2"
                            >
                              <Trash2 className="size-3" /> Remover
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {drawerServico && (
        <ServicoDrawer
          servico={drawerServico === 'novo' ? null : drawerServico}
          onClose={() => setDrawerServico(null)}
          onSave={salvar}
        />
      )}
    </div>
  )
}

/* ─────────────────────────── Drawer ─────────────────────────── */
function ServicoDrawer({
  servico,
  onClose,
  onSave,
}: {
  servico: Servico | null
  onClose: () => void
  onSave: (s: Servico) => void
}) {
  const isNovo = servico === null
  const [draft, setDraft] = useState<Servico>(
    servico ?? {
      id: `srv-${Date.now()}`,
      nome: '',
      descricao: '',
      modalidade: 'presencial',
      duracaoMin: 60,
      valorCentavos: 15000,
      cor: 'teal',
      ativo: true,
      incluiAvaliacaoInicial: false,
      agendadoUlt30d: 0,
    },
  )

  const update = (patch: Partial<Servico>) => setDraft((d) => ({ ...d, ...patch }))

  return (
    <>
      <div
        className="fixed inset-y-0 right-0 left-0 z-30 bg-slate-900/50 backdrop-blur-sm dark:bg-slate-950/70 lg:left-60"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-[520px] flex-col bg-white shadow-2xl dark:bg-slate-950">
        <div className="px-6 pt-5 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="size-1.5 rounded-full bg-teal-500" />
                <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                  {isNovo ? 'Novo serviço' : 'Editar serviço'}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {isNovo ? 'Cadastrar serviço' : draft.nome || 'Sem nome'}
              </h2>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <Field label="Nome">
            <input
              type="text"
              value={draft.nome}
              onChange={(e) => update({ nome: e.target.value })}
              placeholder="Ex: Sessão de fisioterapia ortopédica"
              className={inputClass()}
            />
          </Field>

          <Field label="Descrição curta">
            <textarea
              value={draft.descricao}
              onChange={(e) => update({ descricao: e.target.value.slice(0, 180) })}
              rows={3}
              placeholder="O que está incluído neste serviço?"
              className={`${inputClass()} resize-none`}
            />
          </Field>

          <Field label="Modalidade">
            <div className="grid grid-cols-3 gap-2">
              {(['presencial', 'teleconsulta', 'domicilio'] as Modalidade[]).map((m) => {
                const Icon = MODALIDADE_ICON[m]
                const ativo = draft.modalidade === m
                return (
                  <button
                    key={m}
                    onClick={() => update({ modalidade: m })}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                      ativo
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {MODALIDADE_LABEL[m]}
                  </button>
                )
              })}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Duração">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={draft.duracaoMin}
                  onChange={(e) => update({ duracaoMin: Math.max(15, Number(e.target.value) || 0) })}
                  step={15}
                  className={inputClass({ mono: true })}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">min</span>
              </div>
            </Field>
            <Field label="Valor">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">R$</span>
                <input
                  type="number"
                  value={(draft.valorCentavos / 100).toFixed(2)}
                  onChange={(e) =>
                    update({ valorCentavos: Math.round((Number(e.target.value) || 0) * 100) })
                  }
                  step={0.5}
                  className={inputClass({ mono: true })}
                />
              </div>
            </Field>
          </div>

          <Field label="Cor de identificação">
            <div className="flex flex-wrap gap-1.5">
              {CORES.map((c) => {
                const ativo = draft.cor === c.id
                return (
                  <button
                    key={c.id}
                    onClick={() => update({ cor: c.id })}
                    className={`size-8 rounded-lg ${c.bg} ring-2 transition-all ${
                      ativo ? `${c.ring} scale-110` : 'ring-transparent hover:scale-105'
                    }`}
                    aria-label={c.id}
                  >
                    {ativo && <Check className={`size-3.5 mx-auto ${c.text}`} strokeWidth={3} />}
                  </button>
                )
              })}
            </div>
          </Field>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.incluiAvaliacaoInicial}
              onChange={() => update({ incluiAvaliacaoInicial: !draft.incluiAvaliacaoInicial })}
              className="mt-0.5"
            />
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-50">
                <Sparkles className="size-3.5 text-teal-600 dark:text-teal-400" strokeWidth={2} />
                Inclui avaliação cinético-funcional inicial
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Pré-preenche o formulário de avaliação ao realizar a sessão.
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
            <Toggle ativo={draft.ativo} onToggle={() => update({ ativo: !draft.ativo })} />
            <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
              {draft.ativo ? 'Serviço ativo (visível aos pacientes)' : 'Serviço inativo (oculto)'}
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
            onClick={() => onSave(draft)}
            disabled={!draft.nome.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-40 text-white text-sm font-medium"
          >
            <Sparkles className="size-3.5" strokeWidth={2} />
            {isNovo ? 'Criar serviço' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </>
  )
}

/* ─────────── Helpers ─────────── */
function Stat({ valor, label }: { valor: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono font-semibold text-slate-900 dark:text-slate-50 tabular-nums">{valor}</span>
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
    </span>
  )
}
function Divisor() {
  return <span className="text-slate-300 dark:text-slate-700">·</span>
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}
function inputClass(opts: { mono?: boolean } = {}) {
  return `w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600 ${
    opts.mono ? 'font-mono tabular-nums' : ''
  }`
}
function Toggle({ ativo, onToggle }: { ativo: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-5 w-9 rounded-full border transition-colors shrink-0 ${
        ativo ? 'bg-teal-500/80 border-teal-400/60' : 'bg-slate-200 border-slate-300 dark:bg-slate-800 dark:border-slate-700'
      }`}
      role="switch"
      aria-checked={ativo}
    >
      <span
        className={`absolute top-0.5 ${ativo ? 'left-[18px]' : 'left-0.5'} size-4 rounded-full bg-white shadow-sm transition-all`}
      />
    </button>
  )
}
