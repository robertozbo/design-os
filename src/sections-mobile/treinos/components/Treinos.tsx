import { useState } from 'react'
import { CalendarDays, History, Plus, Dumbbell, ChevronRight } from 'lucide-react'
import type {
  AgendaDia,
  TreinoProprio,
  TreinosAba,
  TreinosProps,
} from '@/../product-mobile/sections/treinos/types'
import { HeroTreinoHoje } from './HeroTreinoHoje'
import { ExecucaoRow } from './ExecucaoRow'
import { StatsStrip } from './StatsStrip'

export function Treinos({
  data,
  onChangeAba,
  onIniciarTreino,
  onSessaoClick,
  onExecucaoClick,
  onVerTodoHistorico,
  onOpenPersonalDetail,
  onTreinoProprioClick,
  onNovoTreinoProprio,
}: TreinosProps) {
  const [aba, setAba] = useState<TreinosAba>(data.abaAtiva)

  function handleAba(a: TreinosAba) {
    setAba(a)
    onChangeAba?.(a)
  }

  return (
    <div className="min-h-full bg-slate-950 pb-6">
      <div className="px-4 pt-3 pb-1 flex gap-2">
        <TabButton
          label="Meu Personal"
          counter={data.sessoes.length}
          active={aba === 'meu-personal'}
          onClick={() => handleAba('meu-personal')}
        />
        <TabButton
          label="Meus treinos"
          counter={data.treinosProprios.length}
          active={aba === 'meus-treinos'}
          onClick={() => handleAba('meus-treinos')}
        />
      </div>

      {aba === 'meu-personal' ? (
        <MeuPersonalTab
          data={data}
          onIniciarTreino={onIniciarTreino}
          onSessaoClick={onSessaoClick}
          onExecucaoClick={onExecucaoClick}
          onVerTodoHistorico={onVerTodoHistorico}
          onOpenPersonalDetail={onOpenPersonalDetail}
        />
      ) : (
        <MeusTreinosTab
          treinos={data.treinosProprios}
          onTreinoClick={onTreinoProprioClick}
          onNovoTreino={onNovoTreinoProprio}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab buttons
// ─────────────────────────────────────────────────────────────────────────────

interface TabButtonProps {
  label: string
  counter: number
  active: boolean
  onClick: () => void
}

function TabButton({ label, counter, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 h-10 rounded-2xl text-[12.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
        active
          ? 'bg-teal-500 text-slate-950'
          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
      }`}
    >
      {label}
      {counter > 0 && (
        <span
          className={`min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center font-mono tabular-nums ${
            active ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {counter}
        </span>
      )}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Meu Personal
// ─────────────────────────────────────────────────────────────────────────────

interface MeuPersonalTabProps {
  data: TreinosProps['data']
  onIniciarTreino?: TreinosProps['onIniciarTreino']
  onSessaoClick?: TreinosProps['onSessaoClick']
  onExecucaoClick?: TreinosProps['onExecucaoClick']
  onVerTodoHistorico?: TreinosProps['onVerTodoHistorico']
  onOpenPersonalDetail?: TreinosProps['onOpenPersonalDetail']
}

function MeuPersonalTab({
  data,
  onIniciarTreino,
  onSessaoClick,
  onExecucaoClick,
  onVerTodoHistorico,
  onOpenPersonalDetail,
}: MeuPersonalTabProps) {
  const personal = data.workout.professional
  return (
    <>
      <HeroTreinoHoje
        sessao={data.sessaoDeHoje}
        personalName={personal?.fullName ?? null}
        personalId={personal?.id ?? null}
        onIniciarClick={onIniciarTreino}
        onDetalheClick={onSessaoClick}
        onOpenPersonalDetail={onOpenPersonalDetail}
      />

      <StatsStrip stats={data.stats} />

      <AgendaSemanal
        agenda={data.agendaSemanal}
        diaSemanaHoje={data.diaSemanaHoje}
        sessoes={data.sessoes}
        onSessaoClick={onSessaoClick}
      />

      <SessoesList sessoes={data.sessoes} onSessaoClick={onSessaoClick} />

      <HistoricoSection
        historico={data.historico}
        onExecucaoClick={onExecucaoClick}
        onVerTodoHistorico={onVerTodoHistorico}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Agenda semanal (dia-a-dia)
// ─────────────────────────────────────────────────────────────────────────────

const COR_CHIP: Record<string, string> = {
  teal: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  sky: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
}

interface AgendaSemanalProps {
  agenda: AgendaDia[]
  diaSemanaHoje: string
  sessoes: TreinosProps['data']['sessoes']
  onSessaoClick?: (sessaoId: string) => void
}

function AgendaSemanal({ agenda, diaSemanaHoje, sessoes, onSessaoClick }: AgendaSemanalProps) {
  function corOfLetra(letra: string | null): string {
    if (!letra) return 'teal'
    const s = sessoes.find((x) => x.letra === letra)
    return s?.cor ?? 'teal'
  }
  function idOfLetra(letra: string | null): string | null {
    if (!letra) return null
    const s = sessoes.find((x) => x.letra === letra)
    return s?.session.id ?? null
  }
  return (
    <div className="px-4 mt-5">
      <div className="flex items-center gap-1.5 mb-2">
        <CalendarDays size={11} className="text-slate-400" strokeWidth={2.4} />
        <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
          Plano semanal
        </span>
        <span className="text-slate-600 text-[10px] font-mono tabular-nums">
          {agenda.filter((d) => d.letra).length}× /sem
        </span>
      </div>
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden divide-y divide-slate-800">
        {agenda.map((d) => {
          const isHoje = d.diaSemana === diaSemanaHoje
          const cor = corOfLetra(d.letra)
          const sessionId = idOfLetra(d.letra)
          return (
            <button
              key={d.diaSemana}
              onClick={() => sessionId && onSessaoClick?.(sessionId)}
              disabled={!sessionId}
              className={`w-full px-3 py-2.5 flex items-center gap-3 text-left transition-colors ${
                sessionId ? 'hover:bg-slate-800/40 cursor-pointer' : 'cursor-default'
              } ${isHoje ? 'bg-slate-800/30' : ''}`}
            >
              <span
                className={`w-9 text-center text-[11px] font-semibold ${
                  isHoje ? 'text-teal-300' : 'text-slate-500'
                }`}
              >
                {d.diaCurto}
              </span>
              {d.letra ? (
                <>
                  <span
                    className={`w-6 h-6 rounded-md border flex items-center justify-center text-[11px] font-bold font-mono tabular-nums ${COR_CHIP[cor]}`}
                  >
                    {d.letra}
                  </span>
                  <span className="text-slate-200 text-[12px] font-medium flex-1 truncate">
                    {d.nome}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-6 h-6 rounded-md border border-dashed border-slate-700" />
                  <span className="text-slate-500 text-[11.5px] italic flex-1">descanso</span>
                </>
              )}
              {isHoje && (
                <span className="text-[9px] uppercase tracking-wider font-semibold text-teal-300 bg-teal-500/15 px-1.5 py-0.5 rounded">
                  hoje
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sessões list (compacta — as 3 sessões do plano)
// ─────────────────────────────────────────────────────────────────────────────

function SessoesList({
  sessoes,
  onSessaoClick,
}: {
  sessoes: TreinosProps['data']['sessoes']
  onSessaoClick?: (id: string) => void
}) {
  return (
    <div className="px-4 mt-5">
      <div className="flex items-center gap-1.5 mb-2">
        <Dumbbell size={11} className="text-slate-400" strokeWidth={2.4} />
        <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
          Sessões do plano
        </span>
        <span className="text-slate-600 text-[10px] font-mono tabular-nums">
          {sessoes.length}
        </span>
      </div>
      <div className="space-y-1.5">
        {sessoes.map((s) => (
          <button
            key={s.session.id}
            onClick={() => onSessaoClick?.(s.session.id)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl px-3 py-2.5 flex items-center gap-3 text-left transition-colors"
          >
            <span
              className={`w-9 h-9 rounded-xl border flex items-center justify-center text-[14px] font-bold font-mono tabular-nums shrink-0 ${COR_CHIP[s.cor]}`}
            >
              {s.letra}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-slate-100 text-[13px] font-semibold truncate">
                {s.session.name}
              </div>
              <div className="text-slate-500 text-[10.5px] font-mono tabular-nums mt-0.5">
                {s.session.exercises.length} ex · {s.duracaoEstimadaMin}min
                {s.diaSemanaLabel && <> · {s.diaSemanaLabel}</>}
              </div>
            </div>
            <ChevronRight size={13} className="text-slate-600 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Histórico
// ─────────────────────────────────────────────────────────────────────────────

function HistoricoSection({
  historico,
  onExecucaoClick,
  onVerTodoHistorico,
}: {
  historico: TreinosProps['data']['historico']
  onExecucaoClick?: (id: string) => void
  onVerTodoHistorico?: () => void
}) {
  return (
    <div className="px-4 mt-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <History size={11} className="text-slate-400" strokeWidth={2.4} />
          <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
            Histórico recente
          </span>
        </div>
        {historico.length > 0 && (
          <button
            onClick={onVerTodoHistorico}
            className="text-slate-400 text-[10.5px] font-medium hover:text-slate-200"
          >
            Ver tudo
          </button>
        )}
      </div>
      {historico.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 px-4 py-6 text-center">
          <div className="text-slate-300 text-[12.5px] font-medium">
            Nenhum treino registrado ainda
          </div>
          <div className="text-slate-500 text-[11px] mt-0.5">
            Conclua sua primeira sessão pra começar o histórico.
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          {historico.map((h) => (
            <ExecucaoRow key={h.execucao.id} item={h} onClick={onExecucaoClick} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Meus treinos
// ─────────────────────────────────────────────────────────────────────────────

interface MeusTreinosTabProps {
  treinos: TreinoProprio[]
  onTreinoClick?: (id: string) => void
  onNovoTreino?: () => void
}

function MeusTreinosTab({ treinos, onTreinoClick, onNovoTreino }: MeusTreinosTabProps) {
  return (
    <div className="px-4 mt-3 space-y-2">
      <p className="text-slate-500 text-[11px] leading-snug px-1">
        Treinos que você criou, separados do plano do seu Personal.
      </p>
      {treinos.map((t) => (
        <button
          key={t.id}
          onClick={() => onTreinoClick?.(t.id)}
          className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
              <Dumbbell size={16} strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-slate-100 text-[13px] font-semibold truncate">{t.nome}</div>
              <div className="text-slate-500 text-[10.5px] mt-0.5">{t.tipo}</div>
            </div>
            <ChevronRight size={13} className="text-slate-600" />
          </div>
          <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500 font-mono tabular-nums">
            <span>{t.duracaoMin}min</span>
            <span>·</span>
            <span>{t.frequenciaLabel}</span>
          </div>
        </button>
      ))}
      <button
        onClick={onNovoTreino}
        className="w-full h-12 rounded-2xl border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-[12.5px] font-medium flex items-center justify-center gap-1.5"
      >
        <Plus size={13} strokeWidth={2.4} />
        Novo treino
      </button>
    </div>
  )
}
