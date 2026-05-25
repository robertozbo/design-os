import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Globe2,
  HeadphonesIcon,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import type {
  Idioma,
  Instrumento,
  NovaAvaliacaoDraft,
  NovaAvaliacaoWizardProps,
} from '@/../product/sections/avalia-es-de-risco/types'
import { AvaliacaoWizardStepper } from './AvaliacaoWizardStepper'
import { AvaliacaoWizardFooter } from './AvaliacaoWizardFooter'

const PASSOS = [
  { id: 1, titulo: 'Instrumento', descricao: 'Escolha o questionário psicométrico validado' },
  { id: 2, titulo: 'Escopo', descricao: 'Selecione estabelecimentos e setores cobertos' },
  { id: 3, titulo: 'Janela', descricao: 'Defina a janela de aplicação' },
  { id: 4, titulo: 'Idiomas', descricao: 'Habilite idiomas e modo assistido' },
  { id: 5, titulo: 'Revisão', descricao: 'Confirme cobertura mínima e publique' },
]

const MATURIDADE_TONE = {
  baixa: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
  media: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
  alta: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
} as const

const MATURIDADE_LABEL = { baixa: 'Maturidade baixa', media: 'Maturidade média', alta: 'Maturidade alta' } as const

const IDIOMA_LABEL: Record<Idioma, string> = { pt: 'Português', en: 'English', es: 'Español' }

function emptyDraft(responsavelTecnico: string): NovaAvaliacaoDraft {
  return {
    instrumentoId: null,
    escopoSetorIds: [],
    janelaInicio: '',
    janelaFim: '',
    apenasHorarioComercial: true,
    horarioDisparo: '08:15',
    canalEmail: true,
    canalWhatsapp: false,
    idiomas: ['pt'],
    modoAssistido: true,
    responsavelTecnico,
    confirmaMaturidade: false,
    confirmaCoberturaMinima: false,
  }
}

export function NovaAvaliacaoWizard({
  empregador,
  instrumentos,
  escopoDisponivel,
  responsavelTecnico,
  initialDraft,
  onSubmit,
  onCancel,
}: NovaAvaliacaoWizardProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [draft, setDraft] = useState<NovaAvaliacaoDraft>(() => initialDraft ?? emptyDraft(responsavelTecnico))

  const instrumentoSelecionado = instrumentos.find((i) => i.id === draft.instrumentoId) ?? null
  const requiresMaturityConfirmation = instrumentoSelecionado?.maturidadeRequerida === 'alta'

  const setoresPorEstabelecimento = useMemo(() => {
    const map = new Map<string, typeof escopoDisponivel>()
    for (const s of escopoDisponivel) {
      if (!map.has(s.estabelecimento)) map.set(s.estabelecimento, [])
      map.get(s.estabelecimento)!.push(s)
    }
    return Array.from(map.entries())
  }, [escopoDisponivel])

  const totalElegiveis = useMemo(() => {
    return escopoDisponivel
      .filter((s) => draft.escopoSetorIds.includes(s.setorId))
      .reduce((sum, s) => sum + s.trabalhadores, 0)
  }, [escopoDisponivel, draft.escopoSetorIds])

  const canAdvance = useMemo(() => {
    if (activeIndex === 0) return draft.instrumentoId !== null && (!requiresMaturityConfirmation || draft.confirmaMaturidade)
    if (activeIndex === 1) return draft.escopoSetorIds.length > 0
    if (activeIndex === 2)
      return (
        draft.janelaInicio !== '' &&
        draft.janelaFim !== '' &&
        draft.janelaInicio < draft.janelaFim &&
        draft.horarioDisparo !== '' &&
        (draft.canalEmail || draft.canalWhatsapp)
      )
    if (activeIndex === 3) return draft.idiomas.length > 0
    if (activeIndex === 4) return draft.confirmaCoberturaMinima
    return false
  }, [activeIndex, draft, requiresMaturityConfirmation])

  function next() {
    if (activeIndex < PASSOS.length - 1) setActiveIndex(activeIndex + 1)
  }
  function back() {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1)
  }
  function jumpTo(index: number) {
    if (index < activeIndex) setActiveIndex(index)
  }

  function patch(partial: Partial<NovaAvaliacaoDraft>) {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  function toggleSetor(setorId: string) {
    setDraft((prev) => {
      const has = prev.escopoSetorIds.includes(setorId)
      return { ...prev, escopoSetorIds: has ? prev.escopoSetorIds.filter((id) => id !== setorId) : [...prev.escopoSetorIds, setorId] }
    })
  }

  function toggleEstabelecimento(estabelecimento: string) {
    const setoresEst = escopoDisponivel.filter((s) => s.estabelecimento === estabelecimento)
    const setorIds = setoresEst.map((s) => s.setorId)
    const allSelected = setorIds.every((id) => draft.escopoSetorIds.includes(id))
    setDraft((prev) => ({
      ...prev,
      escopoSetorIds: allSelected
        ? prev.escopoSetorIds.filter((id) => !setorIds.includes(id))
        : Array.from(new Set([...prev.escopoSetorIds, ...setorIds])),
    }))
  }

  function toggleIdioma(idioma: Idioma) {
    setDraft((prev) => ({
      ...prev,
      idiomas: prev.idiomas.includes(idioma) ? prev.idiomas.filter((i) => i !== idioma) : [...prev.idiomas, idioma],
    }))
  }

  function submit() {
    if (!canAdvance) return
    onSubmit?.(draft)
  }

  const idiomasDisponiveis: Idioma[] = instrumentoSelecionado?.idiomasSuportados ?? ['pt', 'en', 'es']

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <RevealStyles />
      <BackgroundGlow />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 pt-8 pb-32">
        <header style={{ animationDelay: '60ms' }} className="nymos-reveal opacity-0 flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200/70 dark:border-teal-900/60 text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
              <Sparkles className="w-3 h-3" strokeWidth={2.25} />
              NR-1 · Nova avaliação de risco
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              Nova avaliação · <span className="text-teal-700 dark:text-teal-300">{empregador.razaoSocial}</span>
            </h1>
            <div className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              CNPJ {empregador.cnpj} · {empregador.totalEstabelecimentos} estabelecimentos · {empregador.totalTrabalhadores} trabalhadores
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Cancelar"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </header>

        <AvaliacaoWizardStepper passos={PASSOS} activeIndex={activeIndex} onJumpTo={jumpTo} />

        <div key={activeIndex} style={{ animationDelay: '180ms' }} className="nymos-reveal opacity-0 mt-8">
          {activeIndex === 0 && (
            <StepInstrumento
              instrumentos={instrumentos}
              selectedId={draft.instrumentoId}
              confirmaMaturidade={draft.confirmaMaturidade}
              onSelect={(id) => patch({ instrumentoId: id, confirmaMaturidade: false })}
              onConfirmMaturidade={(v) => patch({ confirmaMaturidade: v })}
            />
          )}

          {activeIndex === 1 && (
            <StepEscopo
              setoresPorEstabelecimento={setoresPorEstabelecimento}
              selecionados={draft.escopoSetorIds}
              totalElegiveis={totalElegiveis}
              onToggleSetor={toggleSetor}
              onToggleEstabelecimento={toggleEstabelecimento}
            />
          )}

          {activeIndex === 2 && (
            <StepJanela draft={draft} onPatch={patch} />
          )}

          {activeIndex === 3 && (
            <StepIdiomas
              draft={draft}
              idiomasDisponiveis={idiomasDisponiveis}
              onToggleIdioma={toggleIdioma}
              onPatch={patch}
            />
          )}

          {activeIndex === 4 && (
            <StepRevisao
              empregador={empregador}
              instrumento={instrumentoSelecionado}
              draft={draft}
              totalElegiveis={totalElegiveis}
              setoresSelecionados={escopoDisponivel.filter((s) => draft.escopoSetorIds.includes(s.setorId))}
              onPatch={patch}
            />
          )}
        </div>
      </div>

      <AvaliacaoWizardFooter
        activeIndex={activeIndex}
        totalSteps={PASSOS.length}
        canAdvance={canAdvance}
        isFinalStep={activeIndex === PASSOS.length - 1}
        onBack={back}
        onNext={next}
        onSubmit={submit}
      />
    </div>
  )
}

function StepInstrumento({
  instrumentos,
  selectedId,
  confirmaMaturidade,
  onSelect,
  onConfirmMaturidade,
}: {
  instrumentos: Instrumento[]
  selectedId: string | null
  confirmaMaturidade: boolean
  onSelect: (id: string) => void
  onConfirmMaturidade: (v: boolean) => void
}) {
  const selected = instrumentos.find((i) => i.id === selectedId) ?? null
  const requiresWarning = selected?.maturidadeRequerida === 'alta'

  return (
    <div className="space-y-5">
      <header>
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Passo 1 de 5</div>
        <h2 className="mt-1 text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Escolha o instrumento psicométrico
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Os instrumentos disponíveis são cientificamente validados. Suas perguntas são imutáveis para preservar validade.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {instrumentos.map((inst) => {
          const isSelected = selectedId === inst.id
          return (
            <button
              key={inst.id}
              type="button"
              onClick={() => onSelect(inst.id)}
              className={`
                text-left p-4 rounded-2xl border transition
                ${isSelected
                  ? 'border-teal-500 dark:border-teal-500 bg-teal-50/40 dark:bg-teal-950/30 shadow-[0_14px_30px_-18px_rgba(13,148,136,0.55)]'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-teal-300 dark:hover:border-teal-800'}
              `}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 leading-tight">{inst.nome}</h3>
                  <div className="mt-0.5 text-[10px] font-mono uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    {inst.fatores} fatores · {inst.questoes} questões · ~{inst.tempoMedioMin}min
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${MATURIDADE_TONE[inst.maturidadeRequerida]}`}>
                  {MATURIDADE_LABEL[inst.maturidadeRequerida]}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{inst.descricao}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {inst.idiomasSuportados.map((idioma) => (
                  <span key={idioma} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
                    {idioma.toUpperCase()}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {requiresWarning && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">Maturidade alta exigida</div>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              Este instrumento contém perguntas sensíveis (ex. assédio moral/sexual). A empresa precisa de protocolo de acolhimento e canal seguro antes de aplicar. Aplicar sem maturidade pode causar dano.
            </p>
            <label className="mt-3 flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmaMaturidade}
                onChange={(e) => onConfirmMaturidade(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-rose-300 dark:border-rose-700 text-rose-600 focus:ring-rose-200"
              />
              <span className="text-xs text-slate-700 dark:text-slate-200">
                Confirmo que o empregador tem maturidade e protocolo para este instrumento.
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

function StepEscopo({
  setoresPorEstabelecimento,
  selecionados,
  totalElegiveis,
  onToggleSetor,
  onToggleEstabelecimento,
}: {
  setoresPorEstabelecimento: Array<[string, Array<{ setorId: string; setor: string; trabalhadores: number }>]>
  selecionados: string[]
  totalElegiveis: number
  onToggleSetor: (id: string) => void
  onToggleEstabelecimento: (est: string) => void
}) {
  return (
    <div className="space-y-5">
      <header>
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Passo 2 de 5</div>
        <h2 className="mt-1 text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">Defina o escopo</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Marque os estabelecimentos e setores que serão cobertos. A análise será feita por setor.
        </p>
      </header>

      <div className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/20 px-4 py-3 flex items-center gap-3">
        <Building2 className="w-5 h-5 text-teal-700 dark:text-teal-300" strokeWidth={2.25} />
        <div className="text-sm text-slate-700 dark:text-slate-200">
          <span className="font-semibold tabular-nums">{selecionados.length}</span> setores selecionados ·{' '}
          <span className="font-semibold tabular-nums">{totalElegiveis}</span> trabalhadores elegíveis
        </div>
      </div>

      <div className="space-y-3">
        {setoresPorEstabelecimento.map(([est, setores]) => {
          const setorIds = setores.map((s) => s.setorId)
          const allSelected = setorIds.every((id) => selecionados.includes(id))
          const someSelected = setorIds.some((id) => selecionados.includes(id))
          return (
            <div key={est} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => onToggleEstabelecimento(est)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected }}
                    onChange={() => onToggleEstabelecimento(est)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-200"
                  />
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">{est}</span>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {setores.filter((s) => selecionados.includes(s.setorId)).length} / {setores.length}
                </span>
              </button>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {setores.map((s) => {
                  const checked = selecionados.includes(s.setorId)
                  return (
                    <li key={s.setorId}>
                      <label className="flex items-center justify-between gap-3 px-5 py-2.5 hover:bg-slate-50/40 dark:hover:bg-slate-800/30 cursor-pointer transition">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => onToggleSetor(s.setorId)}
                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-200"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-200">{s.setor}</span>
                        </div>
                        <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-500">
                          {s.trabalhadores} pessoas
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StepJanela({ draft, onPatch }: { draft: NovaAvaliacaoDraft; onPatch: (p: Partial<NovaAvaliacaoDraft>) => void }) {
  const days =
    draft.janelaInicio && draft.janelaFim && draft.janelaInicio <= draft.janelaFim
      ? Math.round(
          (new Date(draft.janelaFim + 'T00:00:00').getTime() - new Date(draft.janelaInicio + 'T00:00:00').getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1
      : null

  return (
    <div className="space-y-5">
      <header>
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Passo 3 de 5</div>
        <h2 className="mt-1 text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">Janela de aplicação</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Defina o período em que a avaliação ficará aberta. A NR-1 exige que a aplicação aconteça dentro do horário de trabalho remunerado.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ja-inicio" className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={2.25} />
            Abertura
          </label>
          <input
            id="ja-inicio"
            type="date"
            value={draft.janelaInicio}
            onChange={(e) => onPatch({ janelaInicio: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 tabular-nums focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60 transition"
          />
        </div>

        <div>
          <label htmlFor="ja-fim" className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={2.25} />
            Encerramento
          </label>
          <input
            id="ja-fim"
            type="date"
            value={draft.janelaFim}
            onChange={(e) => onPatch({ janelaFim: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 tabular-nums focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60 transition"
          />
        </div>
      </div>

      {days && (
        <p className="text-[12px] text-slate-500 dark:text-slate-400">
          Janela de <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-200">{days} dias</span>. Recomendado: 14 a 21 dias para atingir cobertura mínima.
        </p>
      )}

      <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 cursor-pointer hover:border-teal-300 dark:hover:border-teal-800 transition">
        <input
          type="checkbox"
          checked={draft.apenasHorarioComercial}
          onChange={(e) => onPatch({ apenasHorarioComercial: e.target.checked })}
          className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-200"
        />
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Apenas horário de trabalho remunerado</div>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Bloqueia respostas fora do expediente do trabalhador. Recomendado e exigido pela NR-1.
          </p>
        </div>
      </label>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
        <header className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={2.25} />
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Disparo agendado</div>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Horário diário em que a plataforma envia o link aos colaboradores ainda não respondentes. Não envia se já foi disparado no dia.
            </p>
          </div>
        </header>

        <label htmlFor="horario-disparo" className="block text-[11px] font-mono uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-1.5">
          Horário de disparo (fuso do empregador)
        </label>
        <input
          id="horario-disparo"
          type="time"
          value={draft.horarioDisparo}
          onChange={(e) => onPatch({ horarioDisparo: e.target.value })}
          className="w-full sm:max-w-[180px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 tabular-nums font-mono focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60 transition"
        />
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Padrão recomendado: <span className="font-mono font-semibold">08:15</span> — coincide com início do expediente.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
        <header className="flex items-center gap-2 mb-3">
          <Globe2 className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={2.25} />
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Canais de envio</div>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Cada colaborador recebe o link no canal individual cadastrado. E-mail genérico/de setor não é aceito (LGPD).
            </p>
          </div>
        </header>

        <div className="space-y-2.5">
          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 ring-1 ring-slate-200/60 dark:ring-slate-800/60 cursor-pointer hover:ring-teal-300 dark:hover:ring-teal-800 transition">
            <input
              type="checkbox"
              checked={draft.canalEmail}
              onChange={(e) => onPatch({ canalEmail: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-200"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
                E-mail pessoal
                <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                  Padrão
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Canal principal. Link com identificação one-shot — plataforma não rastreia identidade do respondente.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 ring-1 ring-slate-200/60 dark:ring-slate-800/60 cursor-pointer hover:ring-violet-300 dark:hover:ring-violet-800 transition">
            <input
              type="checkbox"
              checked={draft.canalWhatsapp}
              onChange={(e) => onPatch({ canalWhatsapp: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-violet-600 focus:ring-violet-200"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
                WhatsApp pessoal
                <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                  Enterprise
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Canal alternativo para trabalhadores sem e-mail. Disponível apenas em planos Enterprise.
              </p>
            </div>
          </label>
        </div>

        {!draft.canalEmail && !draft.canalWhatsapp && (
          <p className="mt-3 text-[11px] text-rose-700 dark:text-rose-300 leading-relaxed">
            Selecione ao menos um canal de envio para publicar a avaliação.
          </p>
        )}
      </div>
    </div>
  )
}

function StepIdiomas({
  draft,
  idiomasDisponiveis,
  onToggleIdioma,
  onPatch,
}: {
  draft: NovaAvaliacaoDraft
  idiomasDisponiveis: Idioma[]
  onToggleIdioma: (i: Idioma) => void
  onPatch: (p: Partial<NovaAvaliacaoDraft>) => void
}) {
  return (
    <div className="space-y-5">
      <header>
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Passo 4 de 5</div>
        <h2 className="mt-1 text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">Idiomas e acessibilidade</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Habilite os idiomas dos seus trabalhadores e o modo assistido para quem precisa.
        </p>
      </header>

      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
          <Globe2 className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={2.25} />
          Idiomas habilitados
        </div>
        <div className="flex flex-wrap gap-2">
          {(['pt', 'en', 'es'] as Idioma[]).map((idioma) => {
            const enabled = idiomasDisponiveis.includes(idioma)
            const selected = draft.idiomas.includes(idioma)
            return (
              <button
                key={idioma}
                type="button"
                disabled={!enabled}
                onClick={() => onToggleIdioma(idioma)}
                className={`
                  inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition
                  ${selected
                    ? 'bg-teal-500 text-slate-950 border-teal-500 shadow-[0_8px_18px_-8px_rgba(13,148,136,0.55)]'
                    : enabled
                      ? 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-teal-300 dark:hover:border-teal-800'
                      : 'bg-slate-50/60 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800/60 text-slate-300 dark:text-slate-600 cursor-not-allowed'}
                `}
              >
                <span className="font-mono uppercase tracking-[0.16em] text-xs">{idioma}</span>
                {IDIOMA_LABEL[idioma]}
                {!enabled && <span className="text-[10px] font-mono uppercase tracking-[0.14em]">não suportado</span>}
              </button>
            )
          })}
        </div>
      </div>

      <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 cursor-pointer hover:border-teal-300 dark:hover:border-teal-800 transition">
        <input
          type="checkbox"
          checked={draft.modoAssistido}
          onChange={(e) => onPatch({ modoAssistido: e.target.checked })}
          className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-200"
        />
        <div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
            <HeadphonesIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" strokeWidth={2.25} />
            Modo assistido
          </div>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Trabalhador com baixa alfabetização ou deficiência pode pedir leitura assistida pelo aplicador. Nunca expõe a resposta a outras pessoas.
          </p>
        </div>
      </label>
    </div>
  )
}

function StepRevisao({
  empregador,
  instrumento,
  draft,
  totalElegiveis,
  setoresSelecionados,
  onPatch,
}: {
  empregador: NovaAvaliacaoWizardProps['empregador']
  instrumento: Instrumento | null
  draft: NovaAvaliacaoDraft
  totalElegiveis: number
  setoresSelecionados: Array<{ setor: string; estabelecimento: string }>
  onPatch: (p: Partial<NovaAvaliacaoDraft>) => void
}) {
  const minimo = Math.ceil(totalElegiveis * 0.6)

  return (
    <div className="space-y-5">
      <header>
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Passo 5 de 5</div>
        <h2 className="mt-1 text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">Revisão e publicação</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Confira a configuração e confirme a cobertura mínima de 60% antes de publicar.
        </p>
      </header>

      <aside className="relative overflow-hidden rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-gradient-to-br from-teal-50 via-white to-violet-50/40 dark:from-teal-950/30 dark:via-slate-950 dark:to-violet-950/30 p-5">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-teal-200/40 dark:bg-teal-900/30 blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">
            <ClipboardCheck className="w-3 h-3" strokeWidth={2.25} />
            Resumo da avaliação
          </div>
          <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">{empregador.razaoSocial}</h3>

          <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Instrumento</dt>
              <dd className="mt-0.5 text-slate-800 dark:text-slate-100 font-medium">
                {instrumento?.nome ?? '—'}
                {instrumento && (
                  <span className="text-slate-500 dark:text-slate-400 font-normal"> · {instrumento.fatores} fatores · ~{instrumento.tempoMedioMin}min</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Janela</dt>
              <dd className="mt-0.5 text-slate-800 dark:text-slate-100 font-medium tabular-nums">
                {draft.janelaInicio || '—'} → {draft.janelaFim || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Disparo diário</dt>
              <dd className="mt-0.5 text-slate-800 dark:text-slate-100 font-medium font-mono tabular-nums">
                {draft.horarioDisparo || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Canais de envio</dt>
              <dd className="mt-0.5 text-slate-800 dark:text-slate-100 font-medium">
                {[draft.canalEmail && 'E-mail', draft.canalWhatsapp && 'WhatsApp']
                  .filter(Boolean)
                  .join(' · ') || '—'}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Escopo</dt>
              <dd className="mt-0.5 text-slate-700 dark:text-slate-200">
                <span className="font-semibold tabular-nums">{setoresSelecionados.length}</span> setores ·{' '}
                <span className="font-semibold tabular-nums">{totalElegiveis}</span> trabalhadores elegíveis
                {setoresSelecionados.length > 0 && (
                  <span className="block text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {setoresSelecionados.map((s) => `${s.estabelecimento} · ${s.setor}`).join(' • ')}
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Idiomas</dt>
              <dd className="mt-0.5 text-slate-800 dark:text-slate-100 font-medium font-mono uppercase tracking-[0.14em]">
                {draft.idiomas.join(' · ')}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Modo assistido</dt>
              <dd className="mt-0.5 text-slate-800 dark:text-slate-100 font-medium">
                {draft.modoAssistido ? 'Habilitado' : 'Desabilitado'}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Responsável técnico</dt>
              <dd className="mt-0.5 text-slate-800 dark:text-slate-100 font-medium">{draft.responsavelTecnico}</dd>
            </div>
          </dl>
        </div>
      </aside>

      <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-4 h-4" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Cobertura macro mínima · 60%</div>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            Recomendação científica COPSOQ: cobertura de pelo menos 60% para validar a amostra agregada. Para esta avaliação, você precisará de pelo menos{' '}
            <span className="font-semibold tabular-nums">{minimo}</span> respostas para publicar a matriz. Cortes por setor/função ainda exigem ≥3 respondentes individualmente (regra anti re-identificação LGPD).
          </p>
          <label className="mt-3 flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.confirmaCoberturaMinima}
              onChange={(e) => onPatch({ confirmaCoberturaMinima: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded border-amber-300 dark:border-amber-700 text-amber-600 focus:ring-amber-200"
            />
            <span className="text-xs text-slate-700 dark:text-slate-200">
              Entendo que se a cobertura ficar abaixo de 60% a matriz não poderá ser gerada e a avaliação ficará encerrada sem publicação.
            </span>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2.25} />
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Ao publicar, o trabalhador receberá um link multilíngue com tempo médio estimado, garantia de anonimato e o canal de acolhimento configurado pelo SST.
        </p>
      </div>
    </div>
  )
}

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
      <div className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-teal-200/40 dark:bg-teal-900/20 blur-3xl" />
      <div className="absolute -top-16 left-[20%] w-[420px] h-[420px] rounded-full bg-violet-200/30 dark:bg-violet-950/30 blur-3xl" />
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      .nymos-reveal { animation: nymos-reveal-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      @media (prefers-reduced-motion: reduce) { .nymos-reveal { animation: none !important; opacity: 1 !important; transform: none !important; } }
    `}</style>
  )
}
