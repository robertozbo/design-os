import { useEffect, useMemo, useState } from 'react'
import {
  X,
  Play,
  Check,
  SkipForward,
  ChevronRight,
  Pause,
  Camera,
  Star,
  Clock,
  Flame,
} from 'lucide-react'
import type { SessaoUI } from '@/../product-mobile/sections/treinos/types'
import { COR_BG, COR_TEXT, iconForExercise, formatLoad } from './_shared'
import { TimerCircular } from './TimerCircular'

interface ExecutarTreinoFlowProps {
  sessao: SessaoUI
  /** Peso do usuário pra cálculo de calorias (Compêndio Ainsworth: kcal = MET × kg × h) */
  pesoUsuarioKg: number
  pesoMedidoEm: string | null
  onClose: () => void
  onSalvar?: (payload: ExecutarPayload) => void
}

interface SerieLog {
  exerciseId: string
  serieIndex: number
  /** Reps realmente feitas (pode diferir do target) */
  repsReal?: number | null
  timeRealSeconds?: number | null
  loadRealKg?: number | null
  concluida: boolean
}

interface ExecutarPayload {
  sessaoId: string
  durationMinutes: number
  estimatedCalories: number
  rating: number | null
  notes: string
  series: SerieLog[]
}

type Fase = 'doing' | 'resting' | 'finishing'

export function ExecutarTreinoFlow({
  sessao,
  pesoUsuarioKg,
  pesoMedidoEm,
  onClose,
  onSalvar,
}: ExecutarTreinoFlowProps) {
  const exercicios = sessao.session.exercises
  const totalExercicios = exercicios.length

  const [exIdx, setExIdx] = useState(0)
  const [setIdx, setSetIdx] = useState(0)
  const [fase, setFase] = useState<Fase>('doing')
  const [series, setSeries] = useState<SerieLog[]>([])
  const [restRemaining, setRestRemaining] = useState(0)
  const [startedAt] = useState(() => Date.now())
  const [elapsedSec, setElapsedSec] = useState(0)
  const [paused, setPaused] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [notes, setNotes] = useState('')

  const exAtual = exercicios[exIdx]
  const totalSets = exAtual?.sets ?? 0
  const isTime = exAtual?.exercise.exerciseType === 'time'
  const concluiuTudo = exIdx >= totalExercicios

  // Cronômetro total
  useEffect(() => {
    if (paused || fase === 'finishing') return
    const interval = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAt) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt, paused, fase])

  // Countdown de descanso
  useEffect(() => {
    if (fase !== 'resting' || paused) return
    if (restRemaining <= 0) {
      avancarPosDescanso()
      return
    }
    const timeout = setTimeout(() => setRestRemaining((r) => r - 1), 1000)
    return () => clearTimeout(timeout)
  }, [fase, restRemaining, paused])

  const concluirSerie = () => {
    if (!exAtual) return
    const log: SerieLog = {
      exerciseId: exAtual.exercise.id,
      serieIndex: setIdx,
      repsReal: isTime ? null : exAtual.reps,
      timeRealSeconds: isTime ? exAtual.timeSeconds : null,
      loadRealKg: exAtual.loadKg,
      concluida: true,
    }
    setSeries((prev) => [...prev, log])

    const ehUltimaSerie = setIdx >= totalSets - 1
    const ehUltimoExercicio = exIdx >= totalExercicios - 1

    if (ehUltimaSerie && ehUltimoExercicio) {
      setFase('finishing')
      return
    }

    setRestRemaining(exAtual.restSeconds)
    setFase('resting')
  }

  const avancarPosDescanso = () => {
    const ehUltimaSerie = setIdx >= totalSets - 1
    if (ehUltimaSerie) {
      setExIdx((i) => i + 1)
      setSetIdx(0)
    } else {
      setSetIdx((i) => i + 1)
    }
    setFase('doing')
  }

  const pularDescanso = () => {
    setRestRemaining(0)
    avancarPosDescanso()
  }

  const pularExercicio = () => {
    if (exIdx >= totalExercicios - 1) {
      setFase('finishing')
      return
    }
    setExIdx((i) => i + 1)
    setSetIdx(0)
    setFase('doing')
  }

  const caloriasEstimadas = useMemo(() => {
    // Compêndio de Atividades Físicas (Ainsworth/ACSM): kcal = MET × peso(kg) × horas
    const horas = elapsedSec / 3600
    const metMedio =
      exercicios.reduce((sum, ex) => sum + ex.exercise.estimatedMet, 0) / Math.max(1, exercicios.length)
    return Math.round(metMedio * pesoUsuarioKg * horas)
  }, [elapsedSec, exercicios, pesoUsuarioKg])

  const metMedioCalc = useMemo(
    () =>
      exercicios.reduce((sum, ex) => sum + ex.exercise.estimatedMet, 0) /
      Math.max(1, exercicios.length),
    [exercicios],
  )

  const salvar = () => {
    onSalvar?.({
      sessaoId: sessao.session.id,
      durationMinutes: Math.round(elapsedSec / 60),
      estimatedCalories: caloriasEstimadas,
      rating,
      notes,
      series,
    })
    onClose()
  }

  const corBg = COR_BG[sessao.cor]
  const corText = COR_TEXT[sessao.cor]

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col" data-nymos-mobile="true">
      <div className="h-12 shrink-0" />

      <Header
        sessao={sessao}
        elapsedSec={elapsedSec}
        paused={paused}
        onClose={onClose}
        onTogglePause={() => setPaused((p) => !p)}
      />

      {fase !== 'finishing' && (
        <ProgressChips
          exercicios={exercicios}
          exIdx={exIdx}
          completedCount={series.filter((s) => s.concluida).length}
          totalSetsAcumulados={exercicios.reduce((sum, ex, i) => sum + (i < exIdx ? ex.sets : 0), 0)}
        />
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
        {fase === 'finishing' && (
          <FinalizarPanel
            sessao={sessao}
            elapsedSec={elapsedSec}
            calorias={caloriasEstimadas}
            seriesConcluidas={series.length}
            pesoUsuarioKg={pesoUsuarioKg}
            pesoMedidoEm={pesoMedidoEm}
            metMedio={metMedioCalc}
            rating={rating}
            onRatingChange={setRating}
            notes={notes}
            onNotesChange={setNotes}
          />
        )}

        {fase === 'doing' && exAtual && (
          <DoingPanel
            sessionExercise={exAtual}
            setIdx={setIdx}
            cor={sessao.cor}
            corBg={corBg}
            corText={corText}
            onConcluir={concluirSerie}
            onPular={pularExercicio}
          />
        )}

        {fase === 'resting' && exAtual && (
          <RestingPanel
            restRemaining={restRemaining}
            restTotal={exAtual.restSeconds}
            paused={paused}
            proximoSetIdx={setIdx >= totalSets - 1 ? null : setIdx + 1}
            proximoExercicio={
              setIdx >= totalSets - 1 && exIdx < totalExercicios - 1
                ? exercicios[exIdx + 1]?.exercise.name
                : null
            }
            onPular={pularDescanso}
          />
        )}

        {concluiuTudo && fase !== 'finishing' && (
          <div className="text-center py-12 text-slate-300">Treino completo!</div>
        )}
      </div>

      {fase === 'finishing' && (
        <div className="px-4 py-3 border-t border-slate-900 bg-slate-950 shrink-0">
          <button
            onClick={salvar}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold text-[14px] flex items-center justify-center gap-2"
          >
            <Check size={15} strokeWidth={2.6} />
            Salvar treino
          </button>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface HeaderProps {
  sessao: SessaoUI
  elapsedSec: number
  paused: boolean
  onClose: () => void
  onTogglePause: () => void
}

function Header({ sessao, elapsedSec, paused, onClose, onTogglePause }: HeaderProps) {
  const min = Math.floor(elapsedSec / 60)
  const sec = elapsedSec % 60
  const corBg = COR_BG[sessao.cor]
  const corText = COR_TEXT[sessao.cor]
  return (
    <div className="px-4 h-[64px] shrink-0 flex items-center gap-2 border-b border-slate-900">
      <button
        onClick={onClose}
        className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:text-white shrink-0"
        aria-label="Fechar"
      >
        <X size={17} strokeWidth={2.2} />
      </button>
      <div className={`w-9 h-9 rounded-lg ${corBg} ${corText} flex items-center justify-center font-bold text-[14px] font-mono tabular-nums shrink-0`}>
        {sessao.letra}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-slate-100 font-semibold text-[12.5px] truncate leading-tight">
          {sessao.session.name}
        </div>
        <div className="text-slate-500 text-[10px] mt-0.5 font-mono tabular-nums">
          {`${min}:${String(sec).padStart(2, '0')}`}
        </div>
      </div>
      <button
        onClick={onTogglePause}
        className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:text-white shrink-0"
        aria-label={paused ? 'Continuar' : 'Pausar'}
      >
        {paused ? <Play size={15} strokeWidth={2.4} fill="currentColor" /> : <Pause size={15} strokeWidth={2.4} fill="currentColor" />}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface ProgressChipsProps {
  exercicios: SessaoUI['session']['exercises']
  exIdx: number
  completedCount: number
  totalSetsAcumulados: number
}

function ProgressChips({ exercicios, exIdx }: ProgressChipsProps) {
  return (
    <div className="px-4 py-2 shrink-0 overflow-x-auto no-scrollbar">
      <div className="flex gap-1.5">
        {exercicios.map((ex, i) => {
          const status = i < exIdx ? 'done' : i === exIdx ? 'current' : 'pending'
          const cls =
            status === 'done'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : status === 'current'
                ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800'
          return (
            <div
              key={ex.id}
              className={`px-2.5 h-7 rounded-full border ${cls} flex items-center gap-1 text-[10.5px] font-medium whitespace-nowrap shrink-0`}
            >
              {status === 'done' && <Check size={10} strokeWidth={2.6} />}
              <span className="font-mono tabular-nums">{i + 1}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface DoingPanelProps {
  sessionExercise: SessaoUI['session']['exercises'][number]
  setIdx: number
  cor: SessaoUI['cor']
  corBg: string
  corText: string
  onConcluir: () => void
  onPular: () => void
}

function DoingPanel({
  sessionExercise,
  setIdx,
  corBg,
  corText,
  onConcluir,
  onPular,
}: DoingPanelProps) {
  const ex = sessionExercise.exercise
  const Icon = iconForExercise(sessionExercise.muscleGroup.category)
  const isTime = ex.exerciseType === 'time'
  const totalSets = sessionExercise.sets

  return (
    <div className="space-y-4">
      <div className="aspect-[4/3] rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center relative">
        {ex.imageUrl ? (
          <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-cover rounded-2xl" />
        ) : (
          <Icon size={64} className="text-slate-700" strokeWidth={1.4} />
        )}
        {ex.videoUrl && (
          <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-950/80 flex items-center justify-center text-teal-300">
            <Play size={14} fill="currentColor" />
          </button>
        )}
        <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-slate-950/80 backdrop-blur-sm">
          <div className="text-slate-100 font-semibold text-[14px] leading-tight">{ex.name}</div>
          <div className="text-slate-400 text-[10.5px] mt-0.5">{sessionExercise.muscleGroup.name}</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: totalSets }).map((_, i) => {
          const done = i < setIdx
          const current = i === setIdx
          return (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                done ? 'bg-emerald-400' : current ? 'bg-teal-400 ring-2 ring-teal-500/30' : 'bg-slate-700'
              }`}
            />
          )
        })}
      </div>

      <div className="text-center">
        <div className="text-slate-500 text-[10.5px] uppercase tracking-wider font-semibold">
          Série {setIdx + 1} de {totalSets}
        </div>
        <div className="mt-2 flex items-center justify-center gap-3 flex-wrap">
          <div className={`px-4 py-2 rounded-xl ${corBg} ${corText}`}>
            <div className="text-[24px] font-bold font-mono tabular-nums leading-none">
              {isTime ? `${sessionExercise.timeSeconds}s` : sessionExercise.reps}
            </div>
            <div className="text-[9.5px] uppercase tracking-wider opacity-80 mt-1 font-semibold">
              {isTime ? 'tempo' : 'reps'}
            </div>
          </div>
          {sessionExercise.loadKg !== null && (
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-100 text-[24px] font-bold font-mono tabular-nums leading-none">
                {formatLoad(sessionExercise.loadKg)}
              </div>
              <div className="text-slate-500 text-[9.5px] uppercase tracking-wider mt-1 font-semibold">
                carga
              </div>
            </div>
          )}
        </div>
        {sessionExercise.notes && (
          <div className="text-slate-400 text-[11.5px] italic mt-3 leading-snug">
            {sessionExercise.notes}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={onConcluir}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
        >
          <Check size={17} strokeWidth={2.6} />
          Concluir série
        </button>
        <button
          onClick={onPular}
          className="w-full h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[12px] font-medium flex items-center justify-center gap-1.5"
        >
          <SkipForward size={12} strokeWidth={2.4} />
          Pular exercício
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface RestingPanelProps {
  restRemaining: number
  restTotal: number
  paused: boolean
  proximoSetIdx: number | null
  proximoExercicio: string | null
  onPular: () => void
}

function RestingPanel({
  restRemaining,
  restTotal,
  paused,
  proximoSetIdx,
  proximoExercicio,
  onPular,
}: RestingPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-5">
      <div className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
        Descanso{paused && ' · pausado'}
      </div>

      <TimerCircular remaining={restRemaining} total={restTotal} />

      <div className="text-center">
        <div className="text-slate-500 text-[10.5px] uppercase tracking-wider font-semibold mb-1">
          Próximo
        </div>
        <div className="text-slate-100 text-[14px] font-semibold">
          {proximoExercicio
            ? `${proximoExercicio}`
            : proximoSetIdx !== null
              ? `Série ${proximoSetIdx + 1}`
              : 'Finalizar'}
        </div>
      </div>

      <button
        onClick={onPular}
        className="px-5 h-11 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 text-[12.5px] font-semibold flex items-center gap-1.5"
      >
        <SkipForward size={13} strokeWidth={2.4} />
        Pular descanso
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface FinalizarPanelProps {
  sessao: SessaoUI
  elapsedSec: number
  calorias: number
  seriesConcluidas: number
  pesoUsuarioKg: number
  pesoMedidoEm: string | null
  metMedio: number
  rating: number | null
  onRatingChange: (n: number) => void
  notes: string
  onNotesChange: (s: string) => void
}

function FinalizarPanel({
  sessao,
  elapsedSec,
  calorias,
  seriesConcluidas,
  pesoUsuarioKg,
  pesoMedidoEm,
  metMedio,
  rating,
  onRatingChange,
  notes,
  onNotesChange,
}: FinalizarPanelProps) {
  const min = Math.round(elapsedSec / 60)
  const horas = elapsedSec / 3600
  const corBg = COR_BG[sessao.cor]
  const corText = COR_TEXT[sessao.cor]
  const [showFormula, setShowFormula] = useState(false)
  return (
    <div className="space-y-5">
      <div className="text-center pt-4">
        <div className={`w-16 h-16 mx-auto rounded-2xl ${corBg} flex items-center justify-center ${corText} font-bold text-[32px] font-mono tabular-nums`}>
          {sessao.letra}
        </div>
        <div className="text-slate-100 font-semibold text-[16px] mt-3">Treino concluído</div>
        <div className="text-slate-400 text-[12px] mt-0.5">{sessao.session.name}</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <SummaryStat icon={Clock} valor={`${min}min`} label="duração" />
        <button onClick={() => setShowFormula((v) => !v)} className="text-left">
          <SummaryStat icon={Flame} valor={`${calorias}`} label="kcal" interactive />
        </button>
        <SummaryStat icon={Check} valor={`${seriesConcluidas}`} label="séries" />
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-300 shrink-0">
            <Flame size={13} strokeWidth={2.4} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-slate-300 text-[11px] font-semibold">
              Estimado pelo Compêndio de Atividades Físicas
            </div>
            <div className="text-slate-500 text-[10px]">
              Ainsworth · ACSM · WHO · com peso real do usuário
            </div>
          </div>
        </div>
        {showFormula && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-800/60 space-y-1.5">
            <div className="text-slate-400 text-[10.5px] leading-snug">
              <span className="font-mono">kcal = MET × peso × horas</span>
            </div>
            <div className="font-mono text-[10.5px] text-slate-300 tabular-nums">
              {calorias} = {metMedio.toFixed(1)} × {pesoUsuarioKg} × {horas.toFixed(2)}h
            </div>
            {pesoMedidoEm && (
              <div className="text-slate-600 text-[9.5px]">
                Peso medido em {pesoMedidoEm.split('-').reverse().join('/')}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <div className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider mb-2">
          Como foi o treino?
        </div>
        <div className="flex items-center justify-center gap-2.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onRatingChange(n)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                rating !== null && n <= rating ? 'bg-amber-500/15 text-amber-300' : 'bg-slate-900 text-slate-600'
              }`}
              aria-label={`${n} estrela${n === 1 ? '' : 's'}`}
            >
              <Star size={18} strokeWidth={2.2} fill={rating !== null && n <= rating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider mb-2">
          Notas (opcional)
        </div>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Como você se sentiu? Algo pra ajustar no próximo?"
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-slate-600 text-slate-100 text-[12.5px] outline-none placeholder:text-slate-600 resize-none"
        />
      </div>
    </div>
  )
}

interface SummaryStatProps {
  icon: typeof Clock
  valor: string
  label: string
  interactive?: boolean
}

function SummaryStat({ icon: Icon, valor, label, interactive }: SummaryStatProps) {
  return (
    <div
      className={`rounded-xl bg-slate-900 border ${interactive ? 'border-slate-700 hover:border-slate-600' : 'border-slate-800'} px-2 py-3 text-center`}
    >
      <Icon size={14} className="text-slate-500 mx-auto mb-1" strokeWidth={2.2} />
      <div className="text-slate-100 font-bold text-[14px] font-mono tabular-nums leading-none">{valor}</div>
      <div className="text-slate-500 text-[9.5px] uppercase tracking-wider mt-1">
        {label}
        {interactive && <span className="text-slate-600 ml-0.5">ⓘ</span>}
      </div>
    </div>
  )
}
