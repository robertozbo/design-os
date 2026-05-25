import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  Camera,
  Trash2,
  Plus,
  X,
  Search,
  Clock,
  Users,
} from 'lucide-react'
import type {
  AlimentoLite,
  CategoriaId,
  CategoriaOpcao,
  CategoriaTone,
  DificuldadeId,
  DificuldadeOpcao,
  IngredienteReceita,
  Receita,
  TagDieteticaId,
  TagOpcao,
} from '@/../product/sections/receitas/types'
import {
  CATEGORIA_GRADIENT,
  CATEGORIA_INITIAL,
  CATEGORIA_TONE,
  calcMacrosForGrams,
  formatNum,
  macrosPerPorcao,
  sumMacros,
} from './utils'

interface ReceitaBuilderProps {
  receita: Receita | null
  alimentos: AlimentoLite[]
  categoriaOpcoes: CategoriaOpcao[]
  tagOpcoes: TagOpcao[]
  dificuldades: DificuldadeOpcao[]
  onSave: (
    payload: Omit<Receita, 'id' | 'criadoEm' | 'editadoEm' | 'isFavorita' | 'usosCount'>,
  ) => void
  onSaveExisting?: (id: string, patch: Partial<Receita>) => void
  onCancel: () => void
}

interface DraftState {
  nome: string
  categoria: CategoriaId
  tags: TagDieteticaId[]
  fotoUrl: string | null
  fotoCorPlaceholder: CategoriaTone
  tempoPreparoMin: number
  porcoes: number
  dificuldade: DificuldadeId
  ingredientes: IngredienteReceita[]
  modoPreparo: string
  dicaPaciente: string
  publicada: boolean
}

const EMPTY_DRAFT: DraftState = {
  nome: '',
  categoria: 'almoco-jantar',
  tags: [],
  fotoUrl: null,
  fotoCorPlaceholder: 'teal',
  tempoPreparoMin: 15,
  porcoes: 1,
  dificuldade: 'facil',
  ingredientes: [],
  modoPreparo: '',
  dicaPaciente: '',
  publicada: false,
}

function fromReceita(r: Receita): DraftState {
  return {
    nome: r.nome,
    categoria: r.categoria,
    tags: r.tags,
    fotoUrl: r.fotoUrl,
    fotoCorPlaceholder: r.fotoCorPlaceholder,
    tempoPreparoMin: r.tempoPreparoMin,
    porcoes: r.porcoes,
    dificuldade: r.dificuldade,
    ingredientes: r.ingredientes,
    modoPreparo: r.modoPreparo,
    dicaPaciente: r.dicaPaciente,
    publicada: r.publicada,
  }
}

export function ReceitaBuilder({
  receita,
  alimentos,
  categoriaOpcoes,
  tagOpcoes,
  dificuldades,
  onSave,
  onSaveExisting,
  onCancel,
}: ReceitaBuilderProps) {
  const isEditing = !!receita
  const [draft, setDraft] = useState<DraftState>(() => (receita ? fromReceita(receita) : EMPTY_DRAFT))

  useEffect(() => {
    setDraft(receita ? fromReceita(receita) : EMPTY_DRAFT)
  }, [receita])

  const alimentosById = useMemo(
    () => Object.fromEntries(alimentos.map((a) => [a.id, a])) as Record<string, AlimentoLite>,
    [alimentos],
  )

  const total = useMemo(() => sumMacros(draft.ingredientes, alimentosById), [draft.ingredientes, alimentosById])
  const perPorcao = macrosPerPorcao(total, draft.porcoes)

  const canSave = draft.nome.trim() !== '' && draft.ingredientes.length > 0

  function update<K extends keyof DraftState>(key: K, val: DraftState[K]) {
    setDraft((d) => ({ ...d, [key]: val }))
  }

  function setCategoria(cat: CategoriaId) {
    setDraft((d) => ({
      ...d,
      categoria: cat,
      fotoCorPlaceholder: CATEGORIA_TONE[cat],
    }))
  }

  function toggleTag(t: TagDieteticaId) {
    setDraft((d) => ({
      ...d,
      tags: d.tags.includes(t) ? d.tags.filter((x) => x !== t) : [...d.tags, t],
    }))
  }

  function addIngrediente(alimento: AlimentoLite) {
    const id = `ing-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const novo: IngredienteReceita = {
      id,
      alimentoId: alimento.id,
      gramas: 100,
      equivalencia: '≈ 100g',
    }
    setDraft((d) => ({ ...d, ingredientes: [...d.ingredientes, novo] }))
  }

  function updateIngrediente(id: string, patch: Partial<IngredienteReceita>) {
    setDraft((d) => ({
      ...d,
      ingredientes: d.ingredientes.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    }))
  }

  function removeIngrediente(id: string) {
    setDraft((d) => ({ ...d, ingredientes: d.ingredientes.filter((i) => i.id !== id) }))
  }

  function handleSave(publish: boolean) {
    if (!canSave) return
    const payload = { ...draft, publicada: publish }
    if (isEditing && receita && onSaveExisting) {
      onSaveExisting(receita.id, payload)
    } else {
      onSave(payload)
    }
  }

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50">
      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-6 pb-32">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="
              inline-flex items-center gap-1.5 rounded-md text-[11px] font-medium text-slate-500
              hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300
            "
          >
            <ArrowLeft size={11} />
            <span className="font-mono uppercase tracking-wider">Voltar</span>
          </button>
          <div className="flex-1 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {isEditing ? 'Editando receita' : 'Nova receita'}
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={!canSave}
              className="
                inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700
                hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
              "
            >
              Salvar rascunho
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={!canSave}
              className="
                inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white
                hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50
                dark:bg-teal-500 dark:hover:bg-teal-400
              "
            >
              {draft.publicada ? 'Atualizar publicada' : 'Publicar no app'}
            </button>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="min-w-0 space-y-4 md:col-span-2">
            {/* Identification card */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {/* Photo placeholder */}
                <div className="shrink-0">
                  <div
                    className={`
                      relative h-40 w-40 overflow-hidden rounded-xl
                      ${CATEGORIA_GRADIENT[draft.fotoCorPlaceholder]}
                    `}
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      <span
                        className={`text-5xl font-semibold opacity-40 ${CATEGORIA_INITIAL[draft.fotoCorPlaceholder]}`}
                      >
                        {draft.nome[0]?.toUpperCase() ?? '?'}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="
                        absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded-md bg-slate-900/80 px-2 py-1
                        text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur
                        hover:bg-slate-900
                      "
                    >
                      <Camera size={10} />
                      Trocar
                    </button>
                  </div>
                </div>

                {/* Name + category + tags */}
                <div className="min-w-0 flex-1 space-y-3">
                  <input
                    type="text"
                    value={draft.nome}
                    onChange={(e) => update('nome', e.target.value)}
                    placeholder="Nome da receita"
                    className="
                      w-full border-0 border-b border-transparent bg-transparent text-xl font-semibold text-slate-900 outline-none
                      transition placeholder:text-slate-300 focus:border-teal-400
                      dark:text-slate-50 dark:placeholder:text-slate-700
                    "
                  />

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-400">
                      Categoria
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {categoriaOpcoes
                        .filter((c) => c.id !== 'todas')
                        .map((c) => {
                          const active = draft.categoria === c.id
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setCategoria(c.id as CategoriaId)}
                              className={`
                                rounded-full px-2.5 py-1 text-[11px] font-medium transition
                                ${active
                                  ? 'bg-teal-600 text-white dark:bg-teal-500'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}
                              `}
                            >
                              {c.label}
                            </button>
                          )
                        })}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-400">
                      Tags dietéticas
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {tagOpcoes.map((t) => {
                        const active = draft.tags.includes(t.id)
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleTag(t.id)}
                            className={`
                              inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium transition
                              ${active
                                ? 'border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'}
                            `}
                          >
                            {t.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Field label="Tempo" unit="min" icon={<Clock size={10} />}>
                      <input
                        type="number"
                        min={1}
                        value={draft.tempoPreparoMin}
                        onChange={(e) =>
                          update('tempoPreparoMin', Math.max(1, parseInt(e.target.value || '1', 10)))
                        }
                        className={INPUT_CLASS}
                      />
                    </Field>
                    <Field label="Porções" unit="ud" icon={<Users size={10} />}>
                      <input
                        type="number"
                        min={1}
                        value={draft.porcoes}
                        onChange={(e) =>
                          update('porcoes', Math.max(1, parseInt(e.target.value || '1', 10)))
                        }
                        className={INPUT_CLASS}
                      />
                    </Field>
                    <Field label="Dificuldade">
                      <select
                        value={draft.dificuldade}
                        onChange={(e) => update('dificuldade', e.target.value as DificuldadeId)}
                        className={INPUT_CLASS}
                      >
                        {dificuldades.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>
              </div>
            </section>

            {/* Ingredientes */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">
              <header className="mb-3 flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Ingredientes
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider tabular-nums text-slate-500 dark:text-slate-500">
                  {draft.ingredientes.length} {draft.ingredientes.length === 1 ? 'item' : 'itens'}
                </span>
              </header>

              {draft.ingredientes.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 px-3 py-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-500">
                  Adicione ao menos 1 ingrediente para salvar.
                </p>
              ) : (
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {draft.ingredientes.map((ing) => {
                    const al = alimentosById[ing.alimentoId]
                    if (!al) return null
                    const macros = calcMacrosForGrams(al, ing.gramas)
                    return (
                      <li key={ing.id} className="flex items-center gap-3 py-2.5">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                            {al.nome}
                          </p>
                          <p className="font-mono text-[10px] text-slate-500 dark:text-slate-500">
                            {ing.equivalencia}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={ing.gramas}
                            onChange={(e) =>
                              updateIngrediente(ing.id, {
                                gramas: Math.max(1, parseInt(e.target.value || '1', 10)),
                              })
                            }
                            className="w-16 rounded-md border border-slate-200 bg-white px-2 py-1 text-right font-mono text-xs tabular-nums text-slate-900 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                          />
                          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
                            g
                          </span>
                        </div>
                        <span className="hidden font-mono text-[11px] tabular-nums text-slate-600 dark:text-slate-400 sm:inline-block">
                          {formatNum(macros.kcal, 0)} kcal
                        </span>
                        <button
                          type="button"
                          onClick={() => removeIngrediente(ing.id)}
                          aria-label="Remover"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                        >
                          <X size={12} />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}

              <AddFoodSearch alimentos={alimentos} onAdd={addIngrediente} />
            </section>

            {/* Dica pro paciente */}
            <section className="rounded-2xl border border-teal-200/60 bg-teal-50/30 p-5 dark:border-teal-900/40 dark:bg-teal-950/20">
              <header className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-teal-900 dark:text-teal-100">
                  Dica pro paciente
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-teal-600/80 dark:text-teal-400/70">
                  Aparece no app
                </span>
              </header>
              <p className="mb-2 text-xs text-teal-800/80 dark:text-teal-200/70">
                Em uma frase ou parágrafo curto, conte ao paciente quando comer essa receita e o que ela tem de bom — texto amigável, sem jargão técnico.
              </p>
              <textarea
                rows={3}
                value={draft.dicaPaciente}
                onChange={(e) => update('dicaPaciente', e.target.value)}
                placeholder="Ex: Boa pra dias de pós-treino — proteína alta com carbo de absorção rápida."
                className="
                  block w-full resize-none rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm text-slate-900
                  placeholder:text-slate-400
                  focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
                  dark:border-teal-900/60 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-600
                "
              />
            </section>

            {/* Modo de preparo */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">
              <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
                Modo de preparo
              </h2>
              <textarea
                rows={8}
                value={draft.modoPreparo}
                onChange={(e) => update('modoPreparo', e.target.value)}
                placeholder="1. Comece descrevendo o primeiro passo…&#10;2. Continue numerando os próximos passos.&#10;3. Detalhe quantidades e tempos."
                className="
                  block w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                  placeholder:text-slate-400
                  focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
                  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-600
                "
              />
            </section>
          </div>

          {/* Sidebar — macros */}
          <aside className="space-y-3 md:sticky md:top-6 md:self-start">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-teal-600 dark:text-teal-400">
                Por porção
              </p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {formatNum(perPorcao.kcal, 0)}
                </span>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">kcal</span>
              </div>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
                {formatNum(total.kcal, 0)} kcal · {draft.porcoes}{' '}
                {draft.porcoes === 1 ? 'porção' : 'porções'}
              </p>

              <div className="mt-4 space-y-2.5">
                <MacroBar
                  label="Proteína"
                  value={perPorcao.proteinaG}
                  unit="g"
                  tone="rose"
                />
                <MacroBar
                  label="Carboidrato"
                  value={perPorcao.carboG}
                  unit="g"
                  tone="amber"
                />
                <MacroBar
                  label="Gordura"
                  value={perPorcao.gorduraG}
                  unit="g"
                  tone="violet"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Tags ativas
              </p>
              {draft.tags.length === 0 ? (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                  Nenhuma tag selecionada.
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-1">
                  {draft.tags.map((id) => {
                    const t = tagOpcoes.find((o) => o.id === id)
                    if (!t) return null
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                      >
                        {t.label}
                      </span>
                    )
                  })}
                </div>
              )}
            </section>
          </aside>
        </div>

        {/* Sticky footer */}
        <footer className="
          fixed bottom-0 left-0 right-0 z-30 flex items-center justify-end gap-2 border-t border-slate-200 bg-white/95
          px-4 py-3 backdrop-blur sm:px-6 lg:px-10
          dark:border-slate-800 dark:bg-slate-950/90
        ">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={!canSave}
            className="
              inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700
              hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50
              dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
            "
          >
            Salvar rascunho
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={!canSave}
            className="
              inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white
              hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50
              dark:bg-teal-500 dark:hover:bg-teal-400
            "
          >
            {draft.publicada ? 'Atualizar publicada' : 'Publicar no app'}
          </button>
        </footer>
      </div>
    </div>
  )
}

const INPUT_CLASS = `
  block w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900
  focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50
`

function Field({
  label,
  unit,
  icon,
  children,
}: {
  label: string
  unit?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          {icon}
          {label}
        </span>
        {unit && <span className="font-mono normal-case tracking-normal text-slate-400">{unit}</span>}
      </span>
      {children}
    </label>
  )
}

function MacroBar({
  label,
  value,
  unit,
  tone,
}: {
  label: string
  value: number
  unit: string
  tone: 'rose' | 'amber' | 'violet'
}) {
  const toneClass: Record<typeof tone, string> = {
    rose: 'bg-rose-400',
    amber: 'bg-amber-400',
    violet: 'bg-violet-400',
  }
  // Use a fixed scale of 50g for the bar — illustrative only
  const pct = Math.min(100, (value / 50) * 100)
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className="font-mono text-[11px] tabular-nums text-slate-900 dark:text-slate-50">
          {formatNum(value, 0)}
          <span className="ml-0.5 text-[9px] text-slate-400">{unit}</span>
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full ${toneClass[tone]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function AddFoodSearch({
  alimentos,
  onAdd,
}: {
  alimentos: AlimentoLite[]
  onAdd: (a: AlimentoLite) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return alimentos.slice(0, 12)
    return alimentos.filter((a) => a.nome.toLowerCase().includes(q)).slice(0, 12)
  }, [alimentos, query])

  return (
    <div className="mt-3">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-xs font-medium text-slate-600
            hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700
            dark:border-slate-700 dark:text-slate-400 dark:hover:border-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-300
          "
        >
          <Plus size={12} />
          Adicionar ingrediente
        </button>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="relative border-b border-slate-200 dark:border-slate-800">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar alimento no catálogo…"
              className="
                block w-full bg-white py-2 pl-9 pr-9 text-sm text-slate-900
                placeholder:text-slate-400 focus:outline-none
                dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-600
              "
            />
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                setQuery('')
              }}
              aria-label="Fechar"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X size={12} />
            </button>
          </div>
          <ul className="max-h-60 overflow-y-auto bg-white dark:bg-slate-900">
            {results.length === 0 ? (
              <li className="px-3 py-4 text-center text-xs text-slate-500">Nenhum alimento encontrado.</li>
            ) : (
              results.map((al) => (
                <li key={al.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onAdd(al)
                      setQuery('')
                    }}
                    className="
                      flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs transition
                      hover:bg-teal-50 dark:hover:bg-teal-950/40
                    "
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">{al.nome}</span>
                    <span className="font-mono text-[10px] tabular-nums text-slate-500 dark:text-slate-500">
                      {formatNum(al.kcalPer100g, 0)} kcal/100g
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
