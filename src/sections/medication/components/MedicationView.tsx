import { useMemo, useState } from 'react'
import type {
  CurvaPK,
  MedicacaoAtiva,
  MedicacaoProps,
  RegistroReceita,
} from '@/../product/sections/medication/types'
import { MedicationDetailPanel } from './MedicationDetailPanel'
import { MedicationHeader, type MedicationTimeframe } from './MedicationHeader'
import { MedicationStatCard } from './MedicationStatCard'
import { PrescriptionDrawer } from './PrescriptionDrawer'
import { PrescriptionHistory } from './PrescriptionHistory'
import { RegisterInjectionModal } from './RegisterInjectionModal'
import { RegisterSymptomsModal } from './RegisterSymptomsModal'
import { RenewedBanner } from './RenewedBanner'
import { SummaryStatCard } from './SummaryStatCard'
import { Toasts, type ToastData } from './Toast'
import { TodayDosesList } from './TodayDosesList'

let toastSeq = 0

function isGlp1Injetavel(m: MedicacaoAtiva): boolean {
  return m.categoria === 'glp1_injetavel' || m.via === 'subcutanea'
}

function diasEntreISO(aISO: string, b: Date): number {
  return Math.round((b.getTime() - new Date(aISO).getTime()) / 86400000)
}

/** Sintetiza uma sparkline de adesão 30d a partir do percentual atual. */
function sparklineAdesao(adesao30d: number): number[] {
  // Gera 12 pontos terminando próximo ao valor atual com ruído sutil.
  const arr: number[] = []
  const base = adesao30d
  let v = Math.max(60, base - 8 + Math.random() * 4)
  for (let i = 0; i < 12; i++) {
    const target = base + (Math.random() - 0.5) * 6
    v = v * 0.7 + target * 0.3
    arr.push(Math.max(50, Math.min(100, v)))
  }
  arr[arr.length - 1] = base
  return arr
}

/** Última dose label (ex "hoje 07:00", "ontem", "2d atrás"). */
function ultimaDoseLabel(med: MedicacaoAtiva, doses: { id: string; horario: string; nome: string; status: string }[]): string {
  // Match dose hoje pelo nome
  const cumpridaHoje = doses.find(
    (d) => d.nome.toLowerCase() === med.nome.toLowerCase() && d.status === 'cumprido',
  )
  if (cumpridaHoje) return `hoje · ${cumpridaHoje.horario}`
  return `início ${med.iniciadaEm}`
}

export function MedicationView({
  data,
  onMarcarDose,
  onAbrirReceitaMemed,
  onAbrirDetalheReceita,
  onVerHistoricoCompleto,
  onDispensarRenovada,
  onAplicarDose,
  onMarcarComprimido,
  onRegistrarSintomas,
  onFalarComMedico,
}: MedicacaoProps) {
  const {
    medicosVinculados,
    resumoHoje,
    medicacoesAtivas,
    historicoReceitas,
    receitaRenovada,
    curvasPK = [],
    injecoes = [],
  } = data

  const medicoPrincipal = medicosVinculados[0] ?? null

  const [timeframe, setTimeframe] = useState<MedicationTimeframe>('week')
  const [selectedMedId, setSelectedMedId] = useState<string | null>(() => {
    // Default: primeira GLP-1 injetável (mais "interessante" pra mostrar curva PK)
    const glp1 = medicacoesAtivas.find(isGlp1Injetavel)
    return glp1?.id ?? medicacoesAtivas[0]?.id ?? null
  })
  const [receitaAberta, setReceitaAberta] = useState<RegistroReceita | null>(null)
  const [bannerVisivel, setBannerVisivel] = useState(!!receitaRenovada)
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [injecaoAberta, setInjecaoAberta] = useState<MedicacaoAtiva | null>(null)
  const [sintomasAbertos, setSintomasAbertos] = useState<{
    contexto: string | null
  } | null>(null)

  const receitasMap = useMemo(() => {
    const m: Record<string, RegistroReceita> = {}
    historicoReceitas.forEach((r) => (m[r.id] = r))
    return m
  }, [historicoReceitas])

  const curvasPorMed = useMemo(() => {
    const m: Record<string, CurvaPK> = {}
    curvasPK.forEach((c) => (m[c.medicacaoId] = c))
    return m
  }, [curvasPK])

  // Adesão semana série (dot statuses → numbers)
  const adesaoSemanaSeries = useMemo(() => {
    if (!resumoHoje) return [] as number[]
    return resumoHoje.adesaoSemana.dias.map((s) => {
      if (s === 'cumprido') return 100
      if (s === 'parcial') return 60
      if (s === 'perdido') return 0
      if (s === 'hoje') return 80
      return 40
    })
  }, [resumoHoje])

  const pushToast = (tone: ToastData['tone'], texto: string) => {
    const id = ++toastSeq
    setToasts((p) => [...p, { id, tone, texto }])
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000)
  }

  const handleMarcarDose = (doseId: string) => {
    onMarcarDose?.(doseId)
    const dose = resumoHoje?.doses.find((d) => d.id === doseId)
    if (dose) {
      const agora = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
      pushToast('success', `${dose.nome} marcada · ${agora}`)
    }
  }

  const handleAbrirMemed = (medicacaoId: string) => {
    pushToast('info', 'Abrindo receita no Memed…')
    onAbrirReceitaMemed?.(medicacaoId)
  }

  const handleAbrirDetalheReceita = (id: string) => {
    const r = receitasMap[id]
    if (r) setReceitaAberta(r)
    onAbrirDetalheReceita?.(id)
  }

  const handleAplicar = (medicacaoId: string) => {
    const med = medicacoesAtivas.find((m) => m.id === medicacaoId)
    if (med) setInjecaoAberta(med)
    onAplicarDose?.(medicacaoId)
  }

  const handleConfirmarInjecao = () => {
    if (!injecaoAberta) return
    const nome = injecaoAberta.nome
    setInjecaoAberta(null)
    pushToast('success', `${nome} aplicado · registrado`)
    setTimeout(
      () => pushToast('info', `Como você está se sentindo após ${nome}?`),
      1500,
    )
  }

  const handleMarcarComprimido = (medicacaoId: string) => {
    const med = medicacoesAtivas.find((m) => m.id === medicacaoId)
    pushToast('success', med ? `${med.nome} marcado · siga firme` : 'Marcado')
    onMarcarComprimido?.(medicacaoId)
  }

  const handleAbrirSintomas = (contexto?: string | null) => {
    setSintomasAbertos({ contexto: contexto ?? null })
    onRegistrarSintomas?.()
  }

  const handleSalvarSintomas = () => {
    setSintomasAbertos(null)
    pushToast('success', 'Sintomas registrados')
  }

  // === SEM VÍNCULO ===
  if (!medicoPrincipal) {
    return (
      <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <RevealStyles />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-10">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-10 text-center dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-[14px] text-slate-600 dark:text-slate-400">
              Você ainda não está vinculado a um médico Nymos Clínico. Use o código
              de convite que recebeu pra liberar essa área.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // === BUILD STAT CARDS PRA MEDICAÇÕES ATIVAS ===
  const hoje = new Date()
  const medCards = medicacoesAtivas.map((med, i) => {
    const isGlp1 = isGlp1Injetavel(med)
    const curva = curvasPorMed[med.id]

    // Sparkline: pra GLP-1 usa série da curva PK, senão sintética
    const series = isGlp1 && curva
      ? curva.pontos.filter((p) => !p.projetado).map((p) => p.nivel * 100)
      : sparklineAdesao(med.adesao30d)

    // Trend: derive from sparkline first vs last
    const first = series[0] ?? med.adesao30d
    const last = series[series.length - 1] ?? med.adesao30d
    const trend = series.length > 1 ? ((last - first) / Math.max(1, first)) * 100 : 0

    // Big value: pra GLP-1 = countdown; senão = adesão30d %
    let bigValue: string
    let bigUnit: string
    if (isGlp1) {
      const ultInj = injecoes.find((inj) => inj.medicacaoId === med.id)
      if (ultInj) {
        const proxima = new Date(ultInj.aplicadoEm)
        proxima.setDate(proxima.getDate() + 7)
        const dias = diasEntreISO(proxima.toISOString(), hoje)
        bigValue = Math.abs(dias).toString()
        bigUnit = dias > 0 ? 'd atrasada' : dias < 0 ? 'd p/ próxima' : 'hoje'
        if (dias === 0) {
          bigValue = 'hoje'
          bigUnit = 'aplicar'
        } else {
          bigValue = Math.abs(dias).toString()
          bigUnit = dias < 0 ? 'd p/ próxima' : 'd atrasada'
        }
      } else {
        bigValue = '—'
        bigUnit = ''
      }
    } else {
      bigValue = med.adesao30d.toString()
      bigUnit = '% 30d'
    }

    const ultLabel = isGlp1
      ? injecoes.find((i) => i.medicacaoId === med.id)?.aplicadoEmLabel ?? '—'
      : ultimaDoseLabel(med, resumoHoje?.doses ?? [])

    return {
      medicacao: med,
      series,
      trendPercent: trend,
      ultimaDoseLabel: ultLabel,
      bigValue,
      bigUnit,
      summary: isGlp1
        ? { label: 'ADESÃO', value: `${med.adesao30d}`, unit: '%' }
        : { label: 'INÍCIO', value: med.iniciadaEm },
      revealIndex: i + 2,
    }
  })

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-10">
        <MedicationHeader
          timeframe={timeframe}
          medicos={medicosVinculados}
          onTimeframeChange={setTimeframe}
          onFalarComMedico={() => {
            pushToast('info', 'Abrindo conversa com médico…')
            onFalarComMedico?.()
          }}
        />

        {bannerVisivel && receitaRenovada && (
          <div
            className="nymos-reveal mt-6 opacity-0"
            style={{ animationDelay: '180ms' }}
          >
            <RenewedBanner
              receita={receitaRenovada}
              onDispensar={() => {
                setBannerVisivel(false)
                onDispensarRenovada?.()
              }}
              onAbrir={(id) => handleAbrirMemed(id)}
            />
          </div>
        )}

        {/* Grid 4-col stat cards */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {medCards.map((card) => (
            <MedicationStatCard
              key={card.medicacao.id}
              medicacao={card.medicacao}
              series={card.series}
              trendPercent={card.trendPercent}
              ultimaDoseLabel={card.ultimaDoseLabel}
              bigValue={card.bigValue}
              bigUnit={card.bigUnit}
              summary={card.summary}
              isSelected={selectedMedId === card.medicacao.id}
              revealIndex={card.revealIndex}
              onSelect={setSelectedMedId}
              onAplicarDose={handleAplicar}
              onMarcarComprimido={handleMarcarComprimido}
              onAbrirMemed={handleAbrirMemed}
            />
          ))}

          {resumoHoje && (
            <SummaryStatCard
              icon="check"
              label="Adesão semana"
              value={resumoHoje.adesaoSemana.percentual.toString()}
              unit="%"
              trendPercent={0}
              series={adesaoSemanaSeries}
              summary={{
                label: 'CUMPRIDAS',
                value: resumoHoje.adesaoSemana.dias
                  .filter((s) => s === 'cumprido')
                  .length.toString(),
                unit: '/7',
              }}
              revealIndex={medCards.length + 2}
            />
          )}
        </div>

        {/* Painel de detalhe da medicação selecionada (gráfico + próxima dose) */}
        {selectedMedId && (() => {
          const med = medicacoesAtivas.find((m) => m.id === selectedMedId) ?? null
          if (!med) return null
          const card = medCards.find((c) => c.medicacao.id === selectedMedId)
          return (
            <div
              className="nymos-reveal mt-6 opacity-0"
              style={{ animationDelay: `${80 * (medCards.length + 4)}ms` }}
            >
              <MedicationDetailPanel
                medicacao={med}
                curva={curvasPorMed[med.id] ?? null}
                injecoes={injecoes}
                resumoHoje={resumoHoje}
                adesaoSeries={card?.series ?? []}
                onAplicarDose={handleAplicar}
                onMarcarComprimido={handleMarcarComprimido}
                onMarcarDose={handleMarcarDose}
                onAbrirReceitaMemed={handleAbrirMemed}
              />
            </div>
          )
        })()}

        {/* Doses de hoje */}
        {resumoHoje && resumoHoje.doses.length > 0 && (
          <div className="mt-10">
            <TodayDosesList
              resumo={resumoHoje}
              revealIndex={medCards.length + 6}
              onMarcarDose={handleMarcarDose}
            />
          </div>
        )}

        {/* Atalho registrar sintomas */}
        {medicacoesAtivas.some(isGlp1Injetavel) && (
          <div
            className="nymos-reveal mt-4 opacity-0"
            style={{ animationDelay: `${80 * (medCards.length + 7)}ms` }}
          >
            <button
              onClick={() =>
                handleAbrirSintomas(
                  medicacoesAtivas.find(isGlp1Injetavel)?.nome ?? null,
                )
              }
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-[13px] font-medium text-teal-700 transition-all hover:border-teal-300 hover:bg-teal-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-teal-300 dark:hover:border-teal-500/40 dark:hover:bg-teal-500/5"
            >
              Registrar sintomas pós-dose →
            </button>
          </div>
        )}

        {/* Histórico de receitas */}
        {historicoReceitas.length > 0 && (
          <div
            className="nymos-reveal mt-10 opacity-0"
            style={{ animationDelay: `${80 * (medCards.length + 8)}ms` }}
          >
            <div className="mb-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Prescrições
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Histórico de receitas
              </h2>
              <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                {historicoReceitas.length} entradas
              </span>
            </div>
            <div className="mt-3">
              <PrescriptionHistory
                registros={historicoReceitas}
                onAbrirDetalhe={handleAbrirDetalheReceita}
                onVerTodas={onVerHistoricoCompleto}
              />
            </div>
          </div>
        )}
      </div>

      {/* Drawers e modais */}
      <PrescriptionDrawer
        receita={receitaAberta}
        onClose={() => setReceitaAberta(null)}
        onAbrirMemed={(memedId) => {
          setReceitaAberta(null)
          pushToast('info', `Abrindo Memed (${memedId})`)
          onAbrirReceitaMemed?.(memedId)
        }}
      />

      {injecaoAberta && (
        <RegisterInjectionModal
          medicacao={injecaoAberta}
          historico={injecoes}
          open={!!injecaoAberta}
          onClose={() => setInjecaoAberta(null)}
          onConfirmar={handleConfirmarInjecao}
        />
      )}

      {sintomasAbertos && (
        <RegisterSymptomsModal
          open={!!sintomasAbertos}
          contextoLabel={sintomasAbertos.contexto}
          onClose={() => setSintomasAbertos(null)}
          onSalvar={handleSalvarSintomas}
        />
      )}

      <Toasts items={toasts} />
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
