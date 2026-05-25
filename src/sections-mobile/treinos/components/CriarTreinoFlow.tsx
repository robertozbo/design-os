import { useState } from 'react'
import {
  ChevronLeft,
  Plus,
  Trash2,
  Calendar,
  Dumbbell,
  Heart,
  Footprints,
  Activity,
  TrendingUp,
  Zap,
  X,
  Pencil,
  Check,
  RotateCcw,
} from 'lucide-react'
import catalog from '@/../product-mobile/sections/treinos/exercise-catalog.json'
import type { Exercise, MuscleGroup, DayOfWeek, SessionLetter } from '@/../product-mobile/api-types'
import { SelecionarExerciciosSheet } from './SelecionarExerciciosSheet'

const data = catalog as unknown as { exercises: Exercise[]; muscleGroups: MuscleGroup[] }

const OBJETIVOS = [
  { id: 'hipertrofia', label: 'Hipertrofia', icon: Dumbbell },
  { id: 'emagrecimento', label: 'Emagrecimento', icon: TrendingUp },
  { id: 'resistencia', label: 'Resistência', icon: Heart },
  { id: 'saude', label: 'Saúde geral', icon: Activity },
  { id: 'performance', label: 'Performance', icon: Zap },
] as const

const DIAS: { id: DayOfWeek; label: string; abrev: string }[] = [
  { id: 'monday', label: 'Segunda', abrev: 'Seg' },
  { id: 'tuesday', label: 'Terça', abrev: 'Ter' },
  { id: 'wednesday', label: 'Quarta', abrev: 'Qua' },
  { id: 'thursday', label: 'Quinta', abrev: 'Qui' },
  { id: 'friday', label: 'Sexta', abrev: 'Sex' },
  { id: 'saturday', label: 'Sábado', abrev: 'Sáb' },
  { id: 'sunday', label: 'Domingo', abrev: 'Dom' },
]

const LETRAS: SessionLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

interface SessaoEmCriacao {
  letra: SessionLetter
  /** Override manual do nome (se null, usa autoNome computado dos exercícios) */
  nomeOverride: string | null
  diaSemana: DayOfWeek | null
  exerciciosIds: string[]
  configs: Record<string, ExercicioConfig>
}

function computeAutoNome(exerciciosIds: string[]): string {
  if (exerciciosIds.length === 0) return ''
  const groupCounts = new Map<string, number>()
  exerciciosIds.forEach((id) => {
    const ex = data.exercises.find((e) => e.id === id)
    if (!ex) return
    groupCounts.set(ex.muscleGroupId, (groupCounts.get(ex.muscleGroupId) ?? 0) + 1)
  })
  const sorted = Array.from(groupCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([gid]) => data.muscleGroups.find((g) => g.id === gid))
    .filter((g): g is MuscleGroup => !!g)

  if (sorted.length === 0) return ''
  if (sorted.length === 1) return sorted[0].name
  if (sorted.length === 2) return `${sorted[0].name} e ${sorted[1].name}`
  if (sorted.length === 3) return `${sorted[0].name}, ${sorted[1].name} e ${sorted[2].name}`
  const allUpper = sorted.every((g) => g.category === 'upper_body')
  const allLower = sorted.every((g) => g.category === 'lower_body')
  if (allUpper) return 'Membros superiores'
  if (allLower) return 'Membros inferiores'
  return 'Full body'
}

interface ExercicioConfig {
  sets: number
  reps: number | null
  timeSeconds: number | null
  restSeconds: number
  loadKg: number | null
}

interface CriarTreinoFlowProps {
  onClose: () => void
  onSalvar?: (payload: unknown) => void
}

export function CriarTreinoFlow({ onClose, onSalvar }: CriarTreinoFlowProps) {
  const [nome, setNome] = useState('')
  const [objetivo, setObjetivo] = useState<typeof OBJETIVOS[number]['id']>('hipertrofia')
  const [sessoes, setSessoes] = useState<SessaoEmCriacao[]>([
    { letra: 'A', nomeOverride: null, diaSemana: 'monday', exerciciosIds: [], configs: {} },
  ])
  const [sheetSessaoIdx, setSheetSessaoIdx] = useState<number | null>(null)

  const addSessao = () => {
    if (sessoes.length >= LETRAS.length) return
    const next = LETRAS[sessoes.length]
    setSessoes((prev) => [
      ...prev,
      { letra: next, nomeOverride: null, diaSemana: null, exerciciosIds: [], configs: {} },
    ])
  }

  const removeSessao = (idx: number) => {
    setSessoes((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((s, i) => ({ ...s, letra: LETRAS[i] })),
    )
  }

  const updateSessao = (idx: number, patch: Partial<SessaoEmCriacao>) => {
    setSessoes((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)))
  }

  const addExerciciosToSessao = (idx: number, novosIds: string[]) => {
    setSessoes((prev) =>
      prev.map((s, i) => {
        if (i !== idx) return s
        const merged = Array.from(new Set([...s.exerciciosIds, ...novosIds]))
        const newConfigs = { ...s.configs }
        novosIds.forEach((id) => {
          if (!newConfigs[id]) {
            const ex = data.exercises.find((e) => e.id === id)
            newConfigs[id] = {
              sets: 4,
              reps: ex?.exerciseType === 'time' ? null : 10,
              timeSeconds: ex?.exerciseType === 'time' ? 30 : null,
              restSeconds: 60,
              loadKg: null,
            }
          }
        })
        return { ...s, exerciciosIds: merged, configs: newConfigs }
      }),
    )
  }

  const removeExercicioFromSessao = (idx: number, exId: string) => {
    setSessoes((prev) =>
      prev.map((s, i) => {
        if (i !== idx) return s
        const newConfigs = { ...s.configs }
        delete newConfigs[exId]
        return {
          ...s,
          exerciciosIds: s.exerciciosIds.filter((id) => id !== exId),
          configs: newConfigs,
        }
      }),
    )
  }

  const totalExercicios = sessoes.reduce((sum, s) => sum + s.exerciciosIds.length, 0)
  const podeSalvar = nome.trim().length > 0 && totalExercicios > 0

  const sessaoEditando = sheetSessaoIdx !== null ? sessoes[sheetSessaoIdx] : null

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col" data-nymos-mobile="true">
      <div className="h-12 shrink-0" />

      <div className="px-3 h-[64px] shrink-0 flex items-center gap-2 border-b border-slate-900">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-200 hover:text-white"
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
            Novo plano
          </div>
          <div className="text-slate-100 font-semibold text-[14px] leading-tight">
            Criar treino
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 no-scrollbar">
        {/* Nome */}
        <div>
          <label className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider mb-1.5 block">
            Nome do plano
          </label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Hipertrofia ABC"
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-slate-600 text-slate-100 text-[13px] outline-none placeholder:text-slate-600"
          />
        </div>

        {/* Objetivo */}
        <div>
          <label className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider mb-1.5 block">
            Objetivo
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {OBJETIVOS.map((o) => {
              const Icon = o.icon
              const active = objetivo === o.id
              return (
                <button
                  key={o.id}
                  onClick={() => setObjetivo(o.id)}
                  className={`flex items-center gap-1.5 px-3 h-9 rounded-full text-[12px] font-semibold border ${
                    active
                      ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon size={12} strokeWidth={2.4} />
                  {o.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Sessões */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
              Treinos · {sessoes.length}
            </label>
            <button
              onClick={addSessao}
              disabled={sessoes.length >= LETRAS.length}
              className="flex items-center gap-1 text-teal-300 text-[11px] font-medium disabled:text-slate-600"
            >
              <Plus size={12} strokeWidth={2.4} />
              Novo treino
            </button>
          </div>

          <div className="space-y-2.5">
            {sessoes.map((s, idx) => (
              <SessaoBuilder
                key={s.letra}
                sessao={s}
                onUpdate={(patch) => updateSessao(idx, patch)}
                onRemove={sessoes.length > 1 ? () => removeSessao(idx) : undefined}
                onAdicionarExercicios={() => setSheetSessaoIdx(idx)}
                onRemoverExercicio={(exId) => removeExercicioFromSessao(idx, exId)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA salvar */}
      <div className="px-4 py-3 border-t border-slate-900 bg-slate-950 shrink-0">
        <button
          disabled={!podeSalvar}
          onClick={() => onSalvar?.({ nome, objetivo, sessoes })}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold text-[14px] disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600"
        >
          {!nome.trim() ? 'Dê um nome ao plano' : totalExercicios === 0 ? 'Adicione exercícios' : `Salvar plano · ${totalExercicios} ex`}
        </button>
      </div>

      {sessaoEditando && sheetSessaoIdx !== null && (
        <SelecionarExerciciosSheet
          sessaoLetra={sessaoEditando.letra}
          sessaoNome={sessaoEditando.nomeOverride ?? computeAutoNome(sessaoEditando.exerciciosIds)}
          jaAdicionadosIds={sessaoEditando.exerciciosIds}
          onClose={() => setSheetSessaoIdx(null)}
          onConfirm={(ids) => {
            addExerciciosToSessao(sheetSessaoIdx, ids)
            setSheetSessaoIdx(null)
          }}
        />
      )}
    </div>
  )
}

interface SessaoBuilderProps {
  sessao: SessaoEmCriacao
  onUpdate: (patch: Partial<SessaoEmCriacao>) => void
  onRemove?: () => void
  onAdicionarExercicios: () => void
  onRemoverExercicio: (exId: string) => void
}

function SessaoBuilder({
  sessao,
  onUpdate,
  onRemove,
  onAdicionarExercicios,
  onRemoverExercicio,
}: SessaoBuilderProps) {
  const [editandoNome, setEditandoNome] = useState(false)
  const [rascunhoNome, setRascunhoNome] = useState('')

  const autoNome = computeAutoNome(sessao.exerciciosIds)
  const nomeExibido = sessao.nomeOverride ?? autoNome
  const ehManual = sessao.nomeOverride !== null

  const startEdit = () => {
    setRascunhoNome(nomeExibido)
    setEditandoNome(true)
  }

  const saveEdit = () => {
    const trimmed = rascunhoNome.trim()
    onUpdate({ nomeOverride: trimmed.length > 0 && trimmed !== autoNome ? trimmed : null })
    setEditandoNome(false)
  }

  const resetAuto = () => {
    onUpdate({ nomeOverride: null })
    setEditandoNome(false)
  }

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-lg bg-teal-500/15 text-teal-300 flex items-center justify-center font-bold text-[16px] font-mono tabular-nums shrink-0">
          {sessao.letra}
        </div>
        {editandoNome ? (
          <>
            <input
              autoFocus
              value={rascunhoNome}
              onChange={(e) => setRascunhoNome(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit()
                if (e.key === 'Escape') setEditandoNome(false)
              }}
              placeholder={autoNome || 'Nome do treino'}
              className="flex-1 h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 focus:border-slate-500 text-slate-100 text-[12.5px] outline-none placeholder:text-slate-600"
            />
            <button
              onClick={saveEdit}
              className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0"
              aria-label="Salvar nome"
            >
              <Check size={13} strokeWidth={2.6} />
            </button>
          </>
        ) : (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-100 font-semibold text-[13px] truncate">
                Treino {sessao.letra}
                {nomeExibido && ` · ${nomeExibido}`}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 text-[10.5px] font-medium"
              >
                <Pencil size={9} strokeWidth={2.4} />
                {nomeExibido ? 'editar nome' : 'definir nome manual'}
              </button>
              {ehManual && (
                <button
                  onClick={resetAuto}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 text-[10.5px] font-medium"
                >
                  <RotateCcw size={9} strokeWidth={2.4} />
                  auto
                </button>
              )}
              {!ehManual && nomeExibido && (
                <span className="text-slate-600 text-[10px]">· auto</span>
              )}
            </div>
          </div>
        )}
        {onRemove && !editandoNome && (
          <button
            onClick={onRemove}
            className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-rose-300 shrink-0"
            aria-label="Remover treino"
          >
            <Trash2 size={13} strokeWidth={2.2} />
          </button>
        )}
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Calendar size={11} className="text-slate-500" strokeWidth={2.2} />
          <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Dia</span>
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {DIAS.map((d) => {
            const active = sessao.diaSemana === d.id
            return (
              <button
                key={d.id}
                onClick={() => onUpdate({ diaSemana: active ? null : d.id })}
                className={`px-3 h-8 rounded-full text-[11.5px] font-semibold whitespace-nowrap shrink-0 border ${
                  active
                    ? 'bg-slate-100 text-slate-900 border-transparent'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {d.abrev}
              </button>
            )
          })}
        </div>
      </div>

      {sessao.exerciciosIds.length > 0 && (
        <div className="space-y-1">
          {sessao.exerciciosIds.map((id, i) => {
            const ex = data.exercises.find((e) => e.id === id)
            if (!ex) return null
            const cfg = sessao.configs[id]
            const isTime = ex.exerciseType === 'time'
            return (
              <div
                key={id}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800/60"
              >
                <span className="text-slate-600 text-[10.5px] font-mono tabular-nums w-4 text-center shrink-0">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-slate-100 text-[12px] font-semibold truncate leading-tight">
                    {ex.name}
                  </div>
                  <div className="text-slate-500 text-[10px] font-mono tabular-nums">
                    {cfg.sets} ×{' '}
                    {isTime ? `${cfg.timeSeconds}s` : cfg.reps}
                    {cfg.loadKg !== null && <> · {cfg.loadKg}kg</>}
                    {' · '}
                    {cfg.restSeconds}s desc
                  </div>
                </div>
                <button
                  onClick={() => onRemoverExercicio(id)}
                  className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center text-slate-500 hover:text-rose-300 shrink-0"
                  aria-label="Remover"
                >
                  <X size={11} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      <button
        onClick={onAdicionarExercicios}
        className="w-full h-10 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-[12px] font-medium flex items-center justify-center gap-1.5"
      >
        <Plus size={13} strokeWidth={2.4} />
        Adicionar exercícios
      </button>

      <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-slate-800/60">
        <span>{sessao.exerciciosIds.length} exercício(s)</span>
        {sessao.diaSemana && (
          <span>{DIAS.find((d) => d.id === sessao.diaSemana)?.label}</span>
        )}
      </div>
    </div>
  )
}
