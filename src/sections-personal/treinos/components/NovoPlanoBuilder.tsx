import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Copy,
  Dumbbell,
  GripVertical,
  Plus,
  Save,
  Search,
  Send,
  Settings2,
  Trash2,
  X,
} from 'lucide-react'
import type {
  AgendaSemanal,
  BuilderStepId,
  DiaSemanaId,
  DuracaoId,
  ExercicioBiblio,
  ExercicioPrescrito,
  ModoSerie,
  NovoPlanoBuilderProps,
  Objetivo,
  SeriePrescricao,
  Treino,
} from '@/../product-personal/sections/treinos/types'
import { OBJETIVO_STYLE } from './objetivoStyle'

const STEPS: { id: BuilderStepId; label: string; description: string }[] = [
  { id: 'identificacao', label: 'Identificação', description: 'Nome e objetivo' },
  { id: 'treinos', label: 'Treinos', description: 'A · B · C…' },
  { id: 'exercicios', label: 'Exercícios', description: 'Prescrição' },
  { id: 'config', label: 'Configuração', description: 'Agenda e duração' },
]

const OBJETIVOS: { id: Objetivo; label: string }[] = [
  { id: 'hipertrofia', label: 'Hipertrofia' },
  { id: 'emagrecimento', label: 'Emagrecimento' },
  { id: 'performance', label: 'Performance' },
  { id: 'reabilitacao', label: 'Reabilitação' },
  { id: 'geral', label: 'Geral' },
]

const DIAS: { id: DiaSemanaId; label: string }[] = [
  { id: 'seg', label: 'Seg' },
  { id: 'ter', label: 'Ter' },
  { id: 'qua', label: 'Qua' },
  { id: 'qui', label: 'Qui' },
  { id: 'sex', label: 'Sex' },
  { id: 'sab', label: 'Sáb' },
  { id: 'dom', label: 'Dom' },
]

const DURACAO_LABEL: Record<DuracaoId, string> = {
  '4': '4 semanas',
  '8': '8 semanas',
  '12': '12 semanas',
  indeterminado: 'Indeterminado',
}

const EMPTY_AGENDA: AgendaSemanal = {
  seg: null,
  ter: null,
  qua: null,
  qui: null,
  sex: null,
  sab: null,
  dom: null,
}

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F']

export function NovoPlanoBuilder({
  open,
  exercicios,
  onClose,
  onSave,
}: NovoPlanoBuilderProps) {
  const [step, setStep] = useState<BuilderStepId>('identificacao')
  const [nome, setNome] = useState('')
  const [objetivo, setObjetivo] = useState<Objetivo>('hipertrofia')
  const [descricao, setDescricao] = useState('')
  const [treinos, setTreinos] = useState<Treino[]>([
    { id: 't-1', letra: 'A', nome: '', exercicios: [] },
  ])
  const [activeTreinoId, setActiveTreinoId] = useState<string>('t-1')
  const [agenda, setAgenda] = useState<AgendaSemanal>(EMPTY_AGENDA)
  const [duracao, setDuracao] = useState<DuracaoId>('8')
  const [permitirAjusteCarga, setPermitirAjusteCarga] = useState(true)
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setStep('identificacao')
      setNome('')
      setObjetivo('hipertrofia')
      setDescricao('')
      setTreinos([{ id: 't-1', letra: 'A', nome: '', exercicios: [] }])
      setActiveTreinoId('t-1')
      setAgenda(EMPTY_AGENDA)
      setDuracao('8')
      setPermitirAjusteCarga(true)
    }
  }, [open])

  const stepIdx = STEPS.findIndex((s) => s.id === step)
  const isFirstStep = stepIdx === 0
  const isLastStep = stepIdx === STEPS.length - 1

  const canAdvance = (() => {
    if (step === 'identificacao') return nome.trim().length > 0
    if (step === 'treinos') return treinos.length > 0 && treinos.every((t) => t.letra)
    if (step === 'exercicios') return treinos.some((t) => t.exercicios.length > 0)
    if (step === 'config')
      return Object.values(agenda).some((v) => v != null)
    return false
  })()

  const goNext = () => {
    if (!canAdvance) return
    if (isLastStep) return
    setStep(STEPS[stepIdx + 1].id)
  }
  const goBack = () => {
    if (isFirstStep) return
    setStep(STEPS[stepIdx - 1].id)
  }

  const handleSave = (asDraft: boolean) => {
    if (!asDraft && !canAdvance) return
    onSave?.(
      {
        nome,
        objetivo,
        descricao,
        treinos,
        agendaPadrao: agenda,
        duracaoPadrao: duracao,
        permitirAjusteCarga,
      },
      asDraft,
    )
  }

  // Treino actions
  const addTreino = () => {
    if (treinos.length >= 6) return
    const nextLetter = LETRAS[treinos.length]
    const novoId = `t-${Date.now()}`
    setTreinos([...treinos, { id: novoId, letra: nextLetter, nome: '', exercicios: [] }])
    setActiveTreinoId(novoId)
  }
  const removeTreino = (id: string) => {
    if (treinos.length <= 1) return
    const restantes = treinos
      .filter((t) => t.id !== id)
      .map((t, i) => ({ ...t, letra: LETRAS[i] }))
    setTreinos(restantes)
    if (activeTreinoId === id) setActiveTreinoId(restantes[0].id)
  }
  const renameTreino = (id: string, nome: string) => {
    setTreinos(treinos.map((t) => (t.id === id ? { ...t, nome } : t)))
  }
  const duplicateTreino = (id: string) => {
    if (treinos.length >= 6) return
    const orig = treinos.find((t) => t.id === id)
    if (!orig) return
    const novoId = `t-${Date.now()}`
    const nova = {
      ...orig,
      id: novoId,
      letra: LETRAS[treinos.length],
      nome: orig.nome ? `${orig.nome} (cópia)` : '',
      exercicios: orig.exercicios.map((e) => ({ ...e })),
    }
    setTreinos([...treinos, nova])
    setActiveTreinoId(novoId)
  }

  // Exercício actions
  const addExerciciosToTreino = (exs: ExercicioBiblio[]) => {
    setTreinos((prev) =>
      prev.map((t) =>
        t.id === activeTreinoId
          ? {
              ...t,
              exercicios: [
                ...t.exercicios,
                ...exs.map((e) => ({
                  exercicioId: e.id,
                  exercicioNome: e.name,
                  grupoMuscular: e.primaryMuscle,
                  thumbUrl: e.gifUrl ?? e.fallbackImageUrl,
                  series: [
                    {
                      numero: 1,
                      modo: 'reps' as ModoSerie,
                      reps: 10,
                      cargaKg: null,
                      rpeAlvo: 7,
                    },
                    {
                      numero: 2,
                      modo: 'reps' as ModoSerie,
                      reps: 10,
                      cargaKg: null,
                      rpeAlvo: 7,
                    },
                    {
                      numero: 3,
                      modo: 'reps' as ModoSerie,
                      reps: 10,
                      cargaKg: null,
                      rpeAlvo: 7,
                    },
                  ],
                  descansoSegundos: 60,
                  observacoes: '',
                })),
              ],
            }
          : t,
      ),
    )
  }

  const updateExercicio = (
    treinoId: string,
    exId: string,
    patch: Partial<ExercicioPrescrito>,
  ) => {
    setTreinos((prev) =>
      prev.map((t) =>
        t.id === treinoId
          ? {
              ...t,
              exercicios: t.exercicios.map((e) =>
                e.exercicioId === exId ? { ...e, ...patch } : e,
              ),
            }
          : t,
      ),
    )
  }

  const removeExercicio = (treinoId: string, exId: string) => {
    setTreinos((prev) =>
      prev.map((t) =>
        t.id === treinoId
          ? {
              ...t,
              exercicios: t.exercicios.filter((e) => e.exercicioId !== exId),
            }
          : t,
      ),
    )
  }

  if (!open) return null

  const activeTreino = treinos.find((t) => t.id === activeTreinoId) ?? treinos[0]

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X size={18} />
          </button>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Novo plano de treino
            </p>
            <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              {nome || 'Sem nome'}
            </h1>
          </div>
        </div>

        {/* Stepper */}
        <ol className="hidden items-center gap-1.5 lg:flex">
          {STEPS.map((s, i) => {
            const active = step === s.id
            const done = stepIdx > i
            return (
              <li key={s.id} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                      : done
                        ? 'text-emerald-700 hover:bg-slate-100 dark:text-emerald-400 dark:hover:bg-slate-800'
                        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono ${
                      active
                        ? 'bg-teal-600 text-white dark:bg-teal-500'
                        : done
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {done ? <Check size={11} strokeWidth={3} /> : i + 1}
                  </span>
                  {s.label}
                </button>
                {i < STEPS.length - 1 && (
                  <span className="text-slate-300 dark:text-slate-700">→</span>
                )}
              </li>
            )
          })}
        </ol>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:inline-flex"
          >
            <Save size={14} />
            Rascunho
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 py-8">
          {step === 'identificacao' && (
            <StepIdentificacao
              nome={nome}
              objetivo={objetivo}
              descricao={descricao}
              onNomeChange={setNome}
              onObjetivoChange={setObjetivo}
              onDescricaoChange={setDescricao}
            />
          )}

          {step === 'treinos' && (
            <StepTreinos
              treinos={treinos}
              activeId={activeTreinoId}
              onSetActive={setActiveTreinoId}
              onAdd={addTreino}
              onRemove={removeTreino}
              onRename={renameTreino}
              onDuplicate={duplicateTreino}
            />
          )}

          {step === 'exercicios' && (
            <StepExercicios
              treinos={treinos}
              activeTreino={activeTreino}
              onSetActive={setActiveTreinoId}
              onOpenPicker={() => setPickerOpen(true)}
              onUpdateExercicio={updateExercicio}
              onRemoveExercicio={removeExercicio}
            />
          )}

          {step === 'config' && (
            <StepConfig
              treinoLetras={treinos.map((t) => t.letra)}
              agenda={agenda}
              duracao={duracao}
              permitirAjusteCarga={permitirAjusteCarga}
              onAgendaChange={setAgenda}
              onDuracaoChange={setDuracao}
              onPermitirAjusteCargaChange={setPermitirAjusteCarga}
            />
          )}
        </div>
      </main>

      {/* Footer nav */}
      <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={goBack}
          disabled={isFirstStep}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium transition-colors dark:border-slate-800 dark:bg-slate-900 ${
            isFirstStep
              ? 'cursor-not-allowed opacity-40'
              : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <ArrowLeft size={14} />
          Voltar
        </button>

        <p className="hidden font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:block">
          Step <span className="tabular-nums">{stepIdx + 1}</span> de{' '}
          <span className="tabular-nums">{STEPS.length}</span>
        </p>

        {!isLastStep ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canAdvance}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              canAdvance
                ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
                : 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
            }`}
          >
            Avançar
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={!canAdvance}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              canAdvance
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
            }`}
          >
            <Send size={14} strokeWidth={2.5} />
            Salvar template
          </button>
        )}
      </footer>

      {/* Picker overlay */}
      {pickerOpen && (
        <ExercicioPickerDrawer
          exercicios={exercicios}
          alreadyAddedIds={activeTreino.exercicios.map((e) => e.exercicioId)}
          onClose={() => setPickerOpen(false)}
          onAdd={(exs) => {
            addExerciciosToTreino(exs)
            setPickerOpen(false)
          }}
        />
      )}
    </div>
  )
}

// ===== Step 1: Identificação =====

function StepIdentificacao({
  nome,
  objetivo,
  descricao,
  onNomeChange,
  onObjetivoChange,
  onDescricaoChange,
}: {
  nome: string
  objetivo: Objetivo
  descricao: string
  onNomeChange: (v: string) => void
  onObjetivoChange: (v: Objetivo) => void
  onDescricaoChange: (v: string) => void
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
          Step 1
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Identificação do plano
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Dê um nome que faça sentido pra reuso e escolha o objetivo principal.
        </p>
      </header>

      <div className="space-y-4">
        <div>
          <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Nome <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => onNomeChange(e.target.value)}
            placeholder="Ex: Hipertrofia ABC · Iniciante"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
          />
        </div>

        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Objetivo
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {OBJETIVOS.map((o) => {
              const active = objetivo === o.id
              const tone = OBJETIVO_STYLE[o.id]
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => onObjetivoChange(o.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
                    active
                      ? `${tone.badge} ring-2 ring-offset-1 ring-teal-300 dark:ring-teal-700`
                      : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                  {o.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Descrição (opcional)
          </label>
          <textarea
            rows={3}
            value={descricao}
            onChange={(e) => onDescricaoChange(e.target.value)}
            placeholder="Pra quem é, frequência sugerida, considerações…"
            className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
          />
        </div>
      </div>
    </div>
  )
}

// ===== Step 2: Treinos =====

function StepTreinos({
  treinos,
  activeId,
  onSetActive,
  onAdd,
  onRemove,
  onRename,
  onDuplicate,
}: {
  treinos: Treino[]
  activeId: string
  onSetActive: (id: string) => void
  onAdd: () => void
  onRemove: (id: string) => void
  onRename: (id: string, nome: string) => void
  onDuplicate: (id: string) => void
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
          Step 2
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Estrutura de treinos
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Crie um ou mais treinos (A, B, C…). Cada um receberá seus próprios
          exercícios no próximo step.
        </p>
      </header>

      <div className="space-y-2">
        {treinos.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 rounded-2xl border p-4 transition-colors ${
              activeId === t.id
                ? 'border-teal-300 bg-teal-50/30 dark:border-teal-800 dark:bg-teal-900/10'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <GripVertical
              size={16}
              className="shrink-0 text-slate-300 dark:text-slate-700"
            />
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-base font-semibold ${
                activeId === t.id
                  ? 'bg-teal-600 text-white dark:bg-teal-500'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {t.letra}
            </span>
            <input
              type="text"
              value={t.nome}
              onChange={(e) => onRename(t.id, e.target.value)}
              onFocus={() => onSetActive(t.id)}
              placeholder={`Ex: Peito e Tríceps`}
              className="flex-1 border-none bg-transparent px-2 py-1 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-50 dark:placeholder:text-slate-500"
            />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onDuplicate(t.id)}
                aria-label="Duplicar"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <Copy size={13} />
              </button>
              <button
                type="button"
                onClick={() => onRemove(t.id)}
                disabled={treinos.length <= 1}
                aria-label="Remover"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={treinos.length >= 6}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-600 dark:hover:text-teal-400"
      >
        <Plus size={14} />
        Adicionar treino
      </button>
    </div>
  )
}

// ===== Step 3: Exercícios =====

function StepExercicios({
  treinos,
  activeTreino,
  onSetActive,
  onOpenPicker,
  onUpdateExercicio,
  onRemoveExercicio,
}: {
  treinos: Treino[]
  activeTreino: Treino
  onSetActive: (id: string) => void
  onOpenPicker: () => void
  onUpdateExercicio: (
    treinoId: string,
    exId: string,
    patch: Partial<ExercicioPrescrito>,
  ) => void
  onRemoveExercicio: (treinoId: string, exId: string) => void
}) {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
          Step 3
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Exercícios e prescrição
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Para cada treino, adicione exercícios da biblioteca e configure as
          séries.
        </p>
      </header>

      {/* Treino tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800">
        {treinos.map((t) => {
          const active = activeTreino.id === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSetActive(t.id)}
              className={`relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'text-slate-900 dark:text-slate-50'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-md font-mono text-[11px] font-semibold ${
                  active
                    ? 'bg-teal-600 text-white dark:bg-teal-500'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {t.letra}
              </span>
              {t.nome || `Treino ${t.letra}`}
              <span className="font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
                {t.exercicios.length}
              </span>
              {active && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 bg-teal-500 dark:bg-teal-400" />
              )}
            </button>
          )
        })}
      </div>

      {/* Exercícios do treino ativo */}
      <div className="space-y-3">
        {activeTreino.exercicios.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
            <Dumbbell
              size={28}
              className="mx-auto text-slate-300 dark:text-slate-700"
            />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Treino {activeTreino.letra} ainda sem exercícios
            </p>
            <button
              type="button"
              onClick={onOpenPicker}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              <Plus size={14} strokeWidth={2.5} />
              Adicionar exercício
            </button>
          </div>
        ) : (
          <>
            {activeTreino.exercicios.map((e) => (
              <ExercicioPrescritoEditor
                key={e.exercicioId}
                exercicio={e}
                onUpdate={(patch) =>
                  onUpdateExercicio(activeTreino.id, e.exercicioId, patch)
                }
                onRemove={() => onRemoveExercicio(activeTreino.id, e.exercicioId)}
              />
            ))}
            <button
              type="button"
              onClick={onOpenPicker}
              className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-600 dark:hover:text-teal-400"
            >
              <Plus size={14} />
              Adicionar mais exercícios
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function ExercicioPrescritoEditor({
  exercicio,
  onUpdate,
  onRemove,
}: {
  exercicio: ExercicioPrescrito
  onUpdate: (patch: Partial<ExercicioPrescrito>) => void
  onRemove: () => void
}) {
  const [open, setOpen] = useState(true)

  const setSerie = (numero: number, patch: Partial<SeriePrescricao>) => {
    onUpdate({
      series: exercicio.series.map((s) =>
        s.numero === numero ? { ...s, ...patch } : s,
      ),
    })
  }

  const addSerie = () => {
    const last = exercicio.series[exercicio.series.length - 1]
    onUpdate({
      series: [
        ...exercicio.series,
        {
          ...last,
          numero: exercicio.series.length + 1,
        },
      ],
    })
  }

  const removeSerie = (numero: number) => {
    if (exercicio.series.length <= 1) return
    onUpdate({
      series: exercicio.series
        .filter((s) => s.numero !== numero)
        .map((s, i) => ({ ...s, numero: i + 1 })),
    })
  }

  const toggleModo = () => {
    const novoModo: ModoSerie = exercicio.series[0]?.modo === 'reps' ? 'tempo' : 'reps'
    onUpdate({
      series: exercicio.series.map((s) => ({
        ...s,
        modo: novoModo,
        reps: novoModo === 'reps' ? s.reps ?? 10 : undefined,
        tempoSegundos: novoModo === 'tempo' ? s.tempoSegundos ?? 30 : undefined,
      })),
    })
  }

  const modo = exercicio.series[0]?.modo ?? 'reps'

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <GripVertical
          size={14}
          className="shrink-0 text-slate-300 dark:text-slate-700"
        />
        {exercicio.thumbUrl ? (
          <img
            src={exercicio.thumbUrl}
            alt=""
            className="h-9 w-9 shrink-0 rounded-lg bg-slate-100 object-cover dark:bg-slate-800"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <Dumbbell size={14} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-slate-900 dark:text-slate-50">
            {exercicio.exercicioNome}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {exercicio.grupoMuscular} · {exercicio.series.length}× ·{' '}
            {modo === 'reps' ? 'reps' : 'tempo'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <ChevronDown
            size={14}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remover"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
        >
          <Trash2 size={13} />
        </button>
      </header>

      {open && (
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={toggleModo}
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Modo: <span className="text-teal-700 dark:text-teal-400">{modo === 'reps' ? 'Reps' : 'Tempo'}</span>
            </button>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
              clique pra alternar
            </span>
          </div>

          {/* Series table */}
          <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-2 bg-slate-50/60 px-3 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
              <div>#</div>
              <div>{modo === 'reps' ? 'Reps' : 'Tempo'}</div>
              <div>Carga</div>
              <div>RPE</div>
              <div></div>
            </div>
            {exercicio.series.map((s) => (
              <div
                key={s.numero}
                className="grid grid-cols-[40px_1fr_1fr_1fr_40px] items-center gap-2 border-t border-slate-100 px-3 py-1.5 dark:border-slate-800"
              >
                <span className="font-mono text-[12px] tabular-nums text-slate-500 dark:text-slate-400">
                  {s.numero}
                </span>
                <input
                  type="number"
                  step={1}
                  min={0}
                  value={modo === 'reps' ? (s.reps ?? '') : (s.tempoSegundos ?? '')}
                  onChange={(e) => {
                    const v = e.target.value === '' ? undefined : Number(e.target.value)
                    setSerie(s.numero, modo === 'reps' ? { reps: v } : { tempoSegundos: v })
                  }}
                  placeholder={modo === 'reps' ? '10' : '30'}
                  className="w-full rounded-md bg-white px-2 py-1 font-mono text-[12px] tabular-nums text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-teal-400 focus:outline-none dark:bg-slate-900 dark:text-slate-50 dark:ring-slate-700 dark:focus:ring-teal-600"
                />
                <input
                  type="number"
                  step={0.5}
                  min={0}
                  value={s.cargaKg ?? ''}
                  onChange={(e) => {
                    const v = e.target.value === '' ? null : Number(e.target.value)
                    setSerie(s.numero, { cargaKg: v })
                  }}
                  placeholder="kg"
                  className="w-full rounded-md bg-white px-2 py-1 font-mono text-[12px] tabular-nums text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-teal-400 focus:outline-none dark:bg-slate-900 dark:text-slate-50 dark:ring-slate-700 dark:focus:ring-teal-600"
                />
                <input
                  type="number"
                  step={0.5}
                  min={0}
                  max={10}
                  value={s.rpeAlvo ?? ''}
                  onChange={(e) => {
                    const v = e.target.value === '' ? null : Number(e.target.value)
                    setSerie(s.numero, { rpeAlvo: v })
                  }}
                  placeholder="0-10"
                  className="w-full rounded-md bg-white px-2 py-1 font-mono text-[12px] tabular-nums text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-teal-400 focus:outline-none dark:bg-slate-900 dark:text-slate-50 dark:ring-slate-700 dark:focus:ring-teal-600"
                />
                <button
                  type="button"
                  onClick={() => removeSerie(s.numero)}
                  disabled={exercicio.series.length <= 1}
                  aria-label="Remover série"
                  className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSerie}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/20"
          >
            <Plus size={12} />
            Adicionar série
          </button>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[120px_1fr]">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Descanso
              </p>
              <div className="mt-1 flex items-center rounded-lg border border-slate-200 bg-white pr-2 focus-within:border-teal-400 dark:border-slate-800 dark:bg-slate-900 dark:focus-within:border-teal-600">
                <input
                  type="number"
                  step={15}
                  min={0}
                  value={exercicio.descansoSegundos}
                  onChange={(e) =>
                    onUpdate({
                      descansoSegundos: Number(e.target.value) || 0,
                    })
                  }
                  className="flex-1 border-none bg-transparent px-3 py-1.5 font-mono text-[12px] tabular-nums text-slate-900 focus:outline-none dark:text-slate-50"
                />
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  s
                </span>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Observações
              </p>
              <input
                type="text"
                value={exercicio.observacoes}
                onChange={(e) => onUpdate({ observacoes: e.target.value })}
                placeholder='Ex: "controle excêntrico 3s"'
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
              />
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

// ===== Step 4: Configuração =====

function StepConfig({
  treinoLetras,
  agenda,
  duracao,
  permitirAjusteCarga,
  onAgendaChange,
  onDuracaoChange,
  onPermitirAjusteCargaChange,
}: {
  treinoLetras: string[]
  agenda: AgendaSemanal
  duracao: DuracaoId
  permitirAjusteCarga: boolean
  onAgendaChange: (a: AgendaSemanal) => void
  onDuracaoChange: (d: DuracaoId) => void
  onPermitirAjusteCargaChange: (v: boolean) => void
}) {
  const setDay = (dia: DiaSemanaId) => {
    const current = agenda[dia]
    if (current == null) {
      onAgendaChange({ ...agenda, [dia]: treinoLetras[0] })
      return
    }
    const idx = treinoLetras.indexOf(current)
    if (idx === treinoLetras.length - 1) {
      onAgendaChange({ ...agenda, [dia]: null })
    } else {
      onAgendaChange({ ...agenda, [dia]: treinoLetras[idx + 1] })
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
          Step 4
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Configuração padrão
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Esses valores serão sugeridos quando você aplicar o template em um
          aluno (e podem ser ajustados na hora de aplicar).
        </p>
      </header>

      <section>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <CalendarDays size={12} className="mb-0.5 mr-1 inline-block" />
          Agenda semanal padrão
        </p>
        <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
          Toque várias vezes para alternar entre treinos.
        </p>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {DIAS.map((d) => {
            const letra = agenda[d.id]
            const filled = letra != null
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDay(d.id)}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2.5 text-center transition-colors ${
                  filled
                    ? 'bg-teal-600 text-white shadow-sm hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600'
                    : 'border border-dashed border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600'
                }`}
              >
                <span className="font-mono text-[9px] font-semibold uppercase tracking-wider opacity-80">
                  {d.label}
                </span>
                <span className="font-mono text-base font-bold tabular-nums">
                  {letra ?? '—'}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Duração padrão
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(Object.keys(DURACAO_LABEL) as DuracaoId[]).map((id) => {
            const active = duracao === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onDuracaoChange(id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'
                }`}
              >
                {DURACAO_LABEL[id]}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <Settings2 size={12} className="mb-0.5 mr-1 inline-block" />
          Autonomia padrão
        </p>
        <label className="mt-2 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700">
          <input
            type="checkbox"
            checked={permitirAjusteCarga}
            onChange={(e) => onPermitirAjusteCargaChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
              Permitir aluno ajustar carga no app (padrão)
            </p>
            <p className="mt-0.5 text-[12px] leading-snug text-slate-500 dark:text-slate-400">
              Personal pode mudar isso na hora de aplicar em cada aluno.
            </p>
          </div>
        </label>
      </section>
    </div>
  )
}

// ===== Picker drawer =====

function ExercicioPickerDrawer({
  exercicios,
  alreadyAddedIds,
  onClose,
  onAdd,
}: {
  exercicios: ExercicioBiblio[]
  alreadyAddedIds: string[]
  onClose: () => void
  onAdd: (exs: ExercicioBiblio[]) => void
}) {
  const [query, setQuery] = useState('')
  const [grupo, setGrupo] = useState<string>('todos')
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set())

  const grupos = ['todos', ...Array.from(new Set(exercicios.map((e) => e.muscleGroup)))]

  const filtered = exercicios.filter((e) => {
    if (alreadyAddedIds.includes(e.id)) return false
    if (grupo !== 'todos' && e.muscleGroup !== grupo) return false
    if (query) {
      const q = query.toLowerCase()
      if (!e.name.toLowerCase().includes(q)) return false
    }
    return true
  })

  const toggle = (id: string) => {
    setSelecionados((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleAdd = () => {
    const exs = exercicios.filter((e) => selecionados.has(e.id))
    onAdd(exs)
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        onClick={onClose}
        className="flex-1 bg-slate-950/40 backdrop-blur-sm"
        aria-hidden
      />
      <aside
        className="flex w-full max-w-[520px] flex-col bg-white shadow-2xl dark:bg-slate-950"
        role="dialog"
        aria-label="Adicionar exercícios"
      >
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Adicionar exercícios
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-3 border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar exercício…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {grupos.map((g) => {
              const active = grupo === g
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrupo(g)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${
                    active
                      ? 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:ring-teal-800'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {g}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
              Nenhum exercício encontrado
            </p>
          ) : (
            <ul className="space-y-1">
              {filtered.map((e) => {
                const checked = selecionados.has(e.id)
                return (
                  <li
                    key={e.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors ${
                      checked
                        ? 'bg-teal-50 ring-1 ring-inset ring-teal-200 dark:bg-teal-900/30 dark:ring-teal-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                    onClick={() => toggle(e.id)}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        checked
                          ? 'border-teal-500 bg-teal-500'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {checked && (
                        <Check size={11} strokeWidth={3} className="text-white" />
                      )}
                    </span>
                    {e.gifUrl || e.fallbackImageUrl ? (
                      <img
                        src={e.gifUrl ?? e.fallbackImageUrl ?? ''}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-lg bg-slate-100 object-cover dark:bg-slate-800"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800">
                        <Dumbbell size={14} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                        {e.name}
                      </p>
                      <p className="truncate font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {e.primaryMuscle} · {e.equipment}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={selecionados.size === 0}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              selecionados.size > 0
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
            }`}
          >
            <Plus size={14} strokeWidth={2.5} />
            Adicionar{' '}
            {selecionados.size > 0 ? `(${selecionados.size})` : ''}
          </button>
        </footer>
      </aside>
    </div>
  )
}
