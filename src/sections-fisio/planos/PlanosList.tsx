import { useMemo, useState } from 'react'
import {
  CalendarRange,
  Check,
  Copy,
  Layers,
  MoreHorizontal,
  Package,
  Plus,
  Repeat,
  Sparkles,
  Trash2,
  Users,
  X,
  Zap,
} from 'lucide-react'
import initialData from '@/../product-fisio/sections/planos/data.json'
import servicosData from '@/../product-fisio/sections/servicos/data.json'
import type {
  CategoriaPlano,
  PlanoTerapeutico,
} from '@/../product-fisio/sections/planos/types'
import type { Servico } from '@/../product-fisio/sections/servicos/types'

const todosServicos = servicosData.servicos as Servico[]

const CATEGORIA_LABEL: Record<CategoriaPlano, string> = {
  avulso: 'Avulso',
  mensal: 'Mensal recorrente',
  pacote: 'Pacote fechado',
}

const CATEGORIA_ICON: Record<CategoriaPlano, typeof Package> = {
  avulso: Zap,
  mensal: Repeat,
  pacote: Package,
}

const CORES: Record<PlanoTerapeutico['cor'], { ring: string; bg: string; text: string }> = {
  teal: { ring: 'ring-teal-300 dark:ring-teal-700', bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-300' },
  sky: { ring: 'ring-sky-300 dark:ring-sky-700', bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300' },
  violet: { ring: 'ring-violet-300 dark:ring-violet-700', bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-300' },
  emerald: { ring: 'ring-emerald-300 dark:ring-emerald-700', bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300' },
  amber: { ring: 'ring-amber-300 dark:ring-amber-700', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300' },
  rose: { ring: 'ring-rose-300 dark:ring-rose-700', bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300' },
  slate: { ring: 'ring-slate-300 dark:ring-slate-600', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
}

function fmtBRL(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function PlanosList() {
  const [planos, setPlanos] = useState<PlanoTerapeutico[]>(initialData.planos as PlanoTerapeutico[])
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaPlano | 'todos'>('todos')
  const [drawer, setDrawer] = useState<PlanoTerapeutico | 'novo' | null>(null)
  const [menuAberto, setMenuAberto] = useState<string | null>(null)

  const planosVisiveis = useMemo(() => {
    if (filtroCategoria === 'todos') return planos
    return planos.filter((p) => p.categoria === filtroCategoria)
  }, [planos, filtroCategoria])

  const stats = useMemo(() => {
    const totais = planos.length
    const pacientesAtivos = planos.reduce((a, p) => a + p.pacientesAtivos, 0)
    const receitaRecorrente = planos
      .filter((p) => p.categoria === 'mensal')
      .reduce((a, p) => a + p.valorTotalCentavos * p.pacientesAtivos, 0)
    return { totais, pacientesAtivos, receitaRecorrente }
  }, [planos])

  const counts = useMemo(() => {
    const c: Record<CategoriaPlano | 'todos', number> = {
      todos: planos.length,
      avulso: 0,
      mensal: 0,
      pacote: 0,
    }
    for (const p of planos) c[p.categoria]++
    return c
  }, [planos])

  const salvar = (p: PlanoTerapeutico) => {
    setPlanos((curr) => {
      const exists = curr.some((x) => x.id === p.id)
      if (exists) return curr.map((x) => (x.id === p.id ? p : x))
      return [...curr, p]
    })
    setDrawer(null)
  }

  const duplicar = (p: PlanoTerapeutico) => {
    setPlanos((curr) => [
      ...curr,
      { ...p, id: `pln-${Date.now()}`, nome: `${p.nome} (cópia)`, pacientesAtivos: 0 },
    ])
    setMenuAberto(null)
  }

  const remover = (id: string) => {
    setPlanos((curr) => curr.filter((p) => p.id !== id))
    setMenuAberto(null)
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
                Catálogo · Planos terapêuticos
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-11 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-center shrink-0">
                <Layers className="size-5 text-teal-600 dark:text-teal-400" strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Planos terapêuticos
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                  Pacotes de tratamento com múltiplas sessões e desconto progressivo.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setDrawer('novo')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_-4px_rgba(20,184,166,0.45)]"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            Novo plano
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-baseline gap-2 mb-5 text-[13px] flex-wrap">
          <Stat valor={stats.totais.toString()} label="planos" />
          <Divisor />
          <Stat valor={stats.pacientesAtivos.toString()} label="pacientes ativos" />
          <Divisor />
          <Stat
            valor={fmtBRL(stats.receitaRecorrente)}
            label="receita recorrente mensal"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {(['todos', 'pacote', 'mensal', 'avulso'] as const).map((c) => {
            const ativo = filtroCategoria === c
            return (
              <button
                key={c}
                onClick={() => setFiltroCategoria(c)}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition-colors ${
                  ativo
                    ? 'bg-slate-900 text-white ring-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:ring-slate-100'
                    : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 dark:hover:bg-slate-800'
                }`}
              >
                {c === 'todos' ? 'Todos' : CATEGORIA_LABEL[c]}
                <span className={`font-mono text-[10px] tabular-nums ${ativo ? 'text-slate-300 dark:text-slate-500' : 'text-slate-400 dark:text-slate-600'}`}>
                  {counts[c]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {planosVisiveis.map((p) => {
            const cor = CORES[p.cor]
            const Icon = CATEGORIA_ICON[p.categoria]
            const valorPorSessao = Math.round(p.valorTotalCentavos / p.numSessoes)
            return (
              <div
                key={p.id}
                className={`relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 ${
                  p.ativo ? '' : 'opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`shrink-0 inline-flex items-center justify-center size-10 rounded-xl ring-1 ${cor.bg} ${cor.ring}`}>
                    <Icon className={`size-4 ${cor.text}`} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                        {p.nome}
                      </h3>
                      <span className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider ring-1 ${cor.bg} ${cor.text} ${cor.ring}`}>
                        {CATEGORIA_LABEL[p.categoria]}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                      {p.descricao}
                    </p>

                    {/* Stats do plano */}
                    <div className="mt-3 flex items-center gap-3 text-[11px]">
                      <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Package className="size-3" strokeWidth={1.75} />
                        <span className="font-mono tabular-nums">{p.numSessoes}</span> sessões
                      </span>
                      <span className="text-slate-400 dark:text-slate-600">·</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-50">
                        {fmtBRL(p.valorTotalCentavos)}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        ({fmtBRL(valorPorSessao)}/sessão)
                      </span>
                    </div>

                    {/* Parcelamento + validade */}
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-500 font-mono">
                      <span>
                        {p.parcelamentoOpcoes.length === 1
                          ? 'À vista'
                          : `Até ${Math.max(...p.parcelamentoOpcoes)}x`}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarRange className="size-2.5" />
                        Validade {p.validadeDias} dias
                      </span>
                    </div>

                    {/* Serviços incluídos */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.servicoNomes.slice(0, 3).map((nome, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400"
                        >
                          {nome}
                        </span>
                      ))}
                      {p.servicoNomes.length > 3 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] text-slate-500 dark:text-slate-500">
                          +{p.servicoNomes.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Pacientes ativos */}
                    {p.pacientesAtivos > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 inline-flex items-center gap-1.5 text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                        <Users className="size-3" strokeWidth={2} />
                        {p.pacientesAtivos} {p.pacientesAtivos === 1 ? 'paciente' : 'pacientes'} ativos
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 relative">
                    <button
                      onClick={() => setMenuAberto(menuAberto === p.id ? null : p.id)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <MoreHorizontal className="size-4" strokeWidth={2} />
                    </button>
                    {menuAberto === p.id && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setMenuAberto(null)} />
                        <div className="absolute right-0 top-9 z-40 min-w-[180px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl py-1">
                          <button
                            onClick={() => {
                              setDrawer(p)
                              setMenuAberto(null)
                            }}
                            className="w-full px-3 py-1.5 text-left text-[13px] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => duplicar(p)}
                            className="w-full px-3 py-1.5 text-left text-[13px] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 inline-flex items-center gap-2"
                          >
                            <Copy className="size-3" /> Duplicar
                          </button>
                          <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                          <button
                            onClick={() => remover(p.id)}
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
            )
          })}
        </div>
      </div>

      {drawer && (
        <PlanoDrawer
          plano={drawer === 'novo' ? null : drawer}
          servicos={todosServicos.filter((s) => s.ativo)}
          onClose={() => setDrawer(null)}
          onSave={salvar}
        />
      )}
    </div>
  )
}

/* ─────────────── Drawer ─────────────── */
function PlanoDrawer({
  plano,
  servicos,
  onClose,
  onSave,
}: {
  plano: PlanoTerapeutico | null
  servicos: Servico[]
  onClose: () => void
  onSave: (p: PlanoTerapeutico) => void
}) {
  const isNovo = plano === null
  const [draft, setDraft] = useState<PlanoTerapeutico>(
    plano ?? {
      id: `pln-${Date.now()}`,
      nome: '',
      descricao: '',
      categoria: 'pacote',
      servicoIds: [],
      servicoNomes: [],
      numSessoes: 10,
      valorTotalCentavos: 100000,
      parcelamentoOpcoes: [1, 3],
      validadeDias: 90,
      ativo: true,
      pacientesAtivos: 0,
      cor: 'teal',
    },
  )

  const update = (patch: Partial<PlanoTerapeutico>) => setDraft((d) => ({ ...d, ...patch }))

  const toggleServico = (id: string) => {
    setDraft((d) => {
      const tem = d.servicoIds.includes(id)
      const novosIds = tem ? d.servicoIds.filter((x) => x !== id) : [...d.servicoIds, id]
      const novosNomes = novosIds
        .map((sid) => servicos.find((s) => s.id === sid)?.nome ?? '')
        .filter(Boolean)
      return { ...d, servicoIds: novosIds, servicoNomes: novosNomes }
    })
  }

  const toggleParcelamento = (n: number) => {
    setDraft((d) => {
      const tem = d.parcelamentoOpcoes.includes(n)
      return {
        ...d,
        parcelamentoOpcoes: tem
          ? d.parcelamentoOpcoes.filter((x) => x !== n)
          : [...d.parcelamentoOpcoes, n].sort((a, b) => a - b),
      }
    })
  }

  return (
    <>
      <div
        className="fixed inset-y-0 right-0 left-0 z-30 bg-slate-900/50 backdrop-blur-sm dark:bg-slate-950/70 lg:left-60"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-[560px] flex-col bg-white shadow-2xl dark:bg-slate-950">
        <div className="px-6 pt-5 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="size-1.5 rounded-full bg-teal-500" />
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                {isNovo ? 'Novo plano' : 'Editar plano'}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {isNovo ? 'Cadastrar plano terapêutico' : draft.nome || 'Sem nome'}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <Field label="Nome">
            <input
              type="text"
              value={draft.nome}
              onChange={(e) => update({ nome: e.target.value })}
              placeholder="Ex: Tratamento Lombalgia · 10 sessões"
              className={inputClass()}
            />
          </Field>

          <Field label="Descrição">
            <textarea
              value={draft.descricao}
              onChange={(e) => update({ descricao: e.target.value.slice(0, 220) })}
              rows={3}
              placeholder="O que o paciente recebe com este plano?"
              className={`${inputClass()} resize-none`}
            />
          </Field>

          <Field label="Categoria">
            <div className="grid grid-cols-3 gap-2">
              {(['avulso', 'pacote', 'mensal'] as CategoriaPlano[]).map((c) => {
                const Icon = CATEGORIA_ICON[c]
                const ativo = draft.categoria === c
                return (
                  <button
                    key={c}
                    onClick={() => update({ categoria: c })}
                    className={`inline-flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium ${
                      ativo
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="size-4" />
                    {CATEGORIA_LABEL[c]}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label="Serviços incluídos">
            <div className="space-y-1.5">
              {servicos.map((s) => {
                const ativo = draft.servicoIds.includes(s.id)
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleServico(s.id)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg border transition-colors ${
                      ativo
                        ? 'border-teal-300 bg-teal-50/60 dark:border-teal-700 dark:bg-teal-950/30'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`size-4 rounded-full ring-2 ring-inset flex items-center justify-center ${
                          ativo ? 'bg-teal-600 ring-teal-600' : 'ring-slate-300 dark:ring-slate-600'
                        }`}
                      >
                        {ativo && <Check className="size-2.5 text-white" strokeWidth={3} />}
                      </span>
                      <span className="text-[12.5px] text-slate-900 dark:text-slate-50 truncate text-left">
                        {s.nome}
                      </span>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                      {s.duracaoMin}min · {fmtBRL(s.valorCentavos)}
                    </span>
                  </button>
                )
              })}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Número de sessões">
              <input
                type="number"
                value={draft.numSessoes}
                onChange={(e) => update({ numSessoes: Math.max(1, Number(e.target.value) || 1) })}
                className={inputClass({ mono: true })}
              />
            </Field>
            <Field label="Valor total">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">R$</span>
                <input
                  type="number"
                  value={(draft.valorTotalCentavos / 100).toFixed(2)}
                  onChange={(e) =>
                    update({ valorTotalCentavos: Math.round((Number(e.target.value) || 0) * 100) })
                  }
                  step={10}
                  className={inputClass({ mono: true })}
                />
              </div>
            </Field>
          </div>

          {draft.numSessoes > 0 && draft.valorTotalCentavos > 0 && (
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-[11px] text-slate-600 dark:text-slate-400">
              Valor por sessão:{' '}
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-50">
                {fmtBRL(Math.round(draft.valorTotalCentavos / draft.numSessoes))}
              </span>
            </div>
          )}

          <Field label="Parcelamento aceito">
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 6, 10, 12].map((n) => {
                const ativo = draft.parcelamentoOpcoes.includes(n)
                return (
                  <button
                    key={n}
                    onClick={() => toggleParcelamento(n)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      ativo
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {n}x
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label="Validade (dias para usar todas as sessões)">
            <input
              type="number"
              value={draft.validadeDias}
              onChange={(e) => update({ validadeDias: Math.max(7, Number(e.target.value) || 7) })}
              className={inputClass({ mono: true })}
            />
          </Field>

          <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
            <Toggle ativo={draft.ativo} onToggle={() => update({ ativo: !draft.ativo })} />
            <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
              {draft.ativo ? 'Plano ativo (visível aos pacientes)' : 'Plano inativo'}
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
            disabled={!draft.nome.trim() || draft.servicoIds.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-40 text-white text-sm font-medium"
          >
            <Sparkles className="size-3.5" strokeWidth={2} />
            {isNovo ? 'Criar plano' : 'Salvar alterações'}
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
