import {
  MapPin,
  Video,
  ChevronRight,
  TrendingDown,
  Clock,
  AlertTriangle,
  CalendarClock,
  ClipboardList,
  Dumbbell,
  UserPlus,
  MessageSquare,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'
import type {
  AtalhoId,
  MotivoRisco,
  PersonalInicioProps,
  StatusSessao,
} from '@/../product-mobile/sections/personal-inicio/types'

const STATUS: Record<StatusSessao, { dot: string; label: string }> = {
  realizada: { dot: 'bg-emerald-500', label: 'Realizada' },
  confirmada: { dot: 'bg-amber-500', label: 'Confirmada' },
  agendada: { dot: 'bg-slate-400', label: 'Agendada' },
  faltou: { dot: 'bg-rose-400', label: 'Faltou' },
}

const MOTIVO: Record<MotivoRisco, { Icon: LucideIcon; cor: string }> = {
  dor: { Icon: AlertTriangle, cor: 'text-rose-400 bg-rose-500/10' },
  'sem-treino': { Icon: Clock, cor: 'text-amber-400 bg-amber-500/10' },
  adesao: { Icon: TrendingDown, cor: 'text-amber-400 bg-amber-500/10' },
  reavaliacao: { Icon: CalendarClock, cor: 'text-slate-300 bg-[#1B2120]' },
}

const ATALHOS: Array<{ id: AtalhoId; label: string; Icon: LucideIcon }> = [
  { id: 'nova-avaliacao', label: 'Nova avaliação', Icon: ClipboardList },
  { id: 'aplicar-treino', label: 'Aplicar treino', Icon: Dumbbell },
  { id: 'convidar', label: 'Convidar aluno', Icon: UserPlus },
  { id: 'mensagens', label: 'Mensagens', Icon: MessageSquare },
]

function Avatar({ inicial, tamanho = 'w-9 h-9' }: { inicial: string; tamanho?: string }) {
  return (
    <div className={`${tamanho} rounded-xl bg-[#1B2120] flex items-center justify-center text-slate-200 font-semibold text-[13px] shrink-0`}>
      {inicial}
    </div>
  )
}

function Card({ titulo, acao, onAcao, children }: { titulo: string; acao?: string; onAcao?: () => void; children: React.ReactNode }) {
  return (
    <section className="mx-4 mt-4 rounded-3xl bg-[#0A0E0D] border border-[#2A3130] p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] uppercase tracking-wider font-mono text-slate-400">{titulo}</h2>
        {acao && (
          <button onClick={onAcao} className="text-emerald-300 text-[12.5px] font-medium">
            {acao}
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

export function PersonalInicio({ data, onCheckin, onAbrirAluno, onVerAgenda, onAtalho }: PersonalInicioProps) {
  const prox = data.proximaSessao
  const restantes = data.agenda.filter((s) => s.status !== 'realizada' && s.status !== 'faltou').length

  return (
    <div className="min-h-full bg-[#0A0E0D] pb-8">
      <div className="px-4 pt-1 text-slate-400 text-[13px]">{data.dataExtenso}</div>

      {/* KPIs */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2">
        {data.kpis.map((k) => (
          <div key={k.id} className="rounded-2xl bg-[#0A0E0D] border border-[#2A3130] p-3">
            <div className="text-slate-400 text-[11px] leading-tight">{k.label}</div>
            <div className="mt-1 text-white text-[20px] font-mono tabular-nums font-semibold">{k.valor}</div>
            {k.delta && (
              <div
                className={`text-[11px] font-mono ${
                  k.positivo === undefined ? 'text-slate-500' : k.positivo ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {k.delta}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Próxima sessão */}
      <section className="mx-4 mt-3 rounded-3xl bg-[#0E1A17] border border-emerald-500/40 p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider font-mono text-emerald-400">Próxima sessão</span>
          <span className="text-[12px] font-mono tabular-nums text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full">
            em {prox.emMinutos} min
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1B2120] flex items-center justify-center font-semibold text-lg">
            {prox.inicial}
          </div>
          <div className="min-w-0">
            <div className="text-[18px] font-semibold leading-tight truncate">{prox.aluno}</div>
            <div className="text-slate-300 text-[13px]">
              <span className="font-mono tabular-nums">{prox.hora}</span> · {prox.tipo}
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-slate-400 text-[12.5px]">
          {prox.modalidade === 'online' ? <Video size={13} /> : <MapPin size={13} />}
          {prox.modalidade === 'online' ? 'Online' : prox.local}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => onCheckin?.(prox)}
            className="rounded-2xl bg-emerald-500 text-[#0E1A17] font-semibold text-[14px] py-2.5 inline-flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 size={16} /> Check-in
          </button>
          <button
            onClick={() => onAbrirAluno?.(prox.alunoId)}
            className="rounded-2xl border border-[#2A3130] bg-[#1B2120] text-slate-100 font-semibold text-[14px] py-2.5"
          >
            Abrir ficha
          </button>
        </div>
      </section>

      {/* Agenda do dia */}
      <Card titulo={`Hoje · ${data.agenda.length} sessões · ${restantes} restantes`} acao="Ver agenda" onAcao={onVerAgenda}>
        <ul className="space-y-1">
          {data.agenda.map((s) => {
            const passada = s.status === 'realizada' || s.status === 'faltou'
            return (
              <li key={s.id}>
                <button
                  onClick={() => onAbrirAluno?.(s.alunoId)}
                  className={`w-full flex items-center gap-3 py-2 text-left ${passada ? 'opacity-55' : ''} ${
                    s.id === prox.id ? 'rounded-xl bg-emerald-500/10 -mx-2 px-2' : ''
                  }`}
                >
                  <span className="w-11 text-slate-300 text-[13px] font-mono tabular-nums">{s.hora}</span>
                  <span className={`w-2 h-2 rounded-full ${STATUS[s.status].dot}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-slate-100 text-[14px] truncate">{s.aluno}</div>
                    <div className="text-slate-500 text-[12px] flex items-center gap-1">
                      {s.tipo}
                      {s.modalidade === 'online' && (
                        <>
                          {' · '}
                          <Video size={11} /> online
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">{STATUS[s.status].label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </Card>

      {/* Precisam de você */}
      <Card titulo={`Precisam de você · ${data.atencao.length}`}>
        <ul className="divide-y divide-[#2A3130]">
          {data.atencao.map((a) => {
            const { Icon, cor } = MOTIVO[a.motivo]
            return (
              <li key={`${a.alunoId}-${a.motivo}`}>
                <button onClick={() => onAbrirAluno?.(a.alunoId)} className="w-full flex items-center gap-3 py-2.5 text-left">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cor}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-slate-100 text-[14px] truncate">{a.aluno}</div>
                    <div className="text-slate-400 text-[12px] truncate">{a.detalhe}</div>
                  </div>
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
              </li>
            )
          })}
        </ul>
      </Card>

      {/* Treinaram hoje */}
      <Card titulo="Treinaram hoje">
        <ul className="space-y-3">
          {data.execucoesHoje.map((e) => (
            <li key={e.alunoId}>
              <button onClick={() => onAbrirAluno?.(e.alunoId)} className="w-full flex items-center gap-3 text-left">
                <Avatar inicial={e.inicial} />
                <div className="min-w-0 flex-1">
                  <div className="text-slate-100 text-[14px] truncate">
                    {e.aluno} <span className="text-slate-500 text-[12px] font-mono">{e.hora}</span>
                  </div>
                  <div className="text-slate-400 text-[12px] truncate">
                    {e.treino} · {e.resumo}
                  </div>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-slate-300 bg-[#1B2120] px-2 py-1 rounded-lg">
                  RPE {e.rpe}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      {/* Atalhos */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-2">
        {ATALHOS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onAtalho?.(id)}
            className="relative rounded-2xl bg-[#0A0E0D] border border-[#2A3130] p-3.5 flex items-center gap-2.5 text-left active:scale-[0.98] transition"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-300 flex items-center justify-center">
              <Icon size={17} />
            </div>
            <span className="text-slate-100 text-[13.5px] font-medium leading-tight">{label}</span>
            {id === 'mensagens' && data.mensagensNaoLidas > 0 && (
              <span className="absolute top-2.5 right-2.5 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-[11px] font-semibold flex items-center justify-center">
                {data.mensagensNaoLidas}
              </span>
            )}
          </button>
        ))}
      </div>

    </div>
  )
}
