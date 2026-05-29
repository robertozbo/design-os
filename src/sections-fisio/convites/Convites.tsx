import { useMemo, useState } from 'react'
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Globe,
  House,
  Inbox,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
  Share2,
  Sparkles,
  User,
  UserPlus,
  Video,
  X,
  XCircle,
} from 'lucide-react'
import initialData from '@/../product-fisio/sections/convites/data.json'
import type {
  CanalEnvio,
  ConviteEnviado,
  ConviteRecebido,
  ConvitesData,
  ModalidadeRecebido,
  StatusEnviado,
  StatusRecebido,
} from '@/../product-fisio/sections/convites/types'

const MODALIDADE_ICON: Record<ModalidadeRecebido, typeof MapPin> = {
  presencial: MapPin,
  teleconsulta: Video,
  domicilio: House,
}

const MODALIDADE_LABEL: Record<ModalidadeRecebido, string> = {
  presencial: 'Presencial',
  teleconsulta: 'Teleconsulta',
  domicilio: 'Domicílio',
}

const ORIGEM_LABEL: Record<ConviteRecebido['origem'], { label: string; Icon: typeof Globe; tone: string }> = {
  'perfil-publico': {
    label: 'Perfil público',
    Icon: Globe,
    tone: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  },
  indicacao: {
    label: 'Indicação',
    Icon: UserPlus,
    tone: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  },
  whatsapp: {
    label: 'WhatsApp',
    Icon: MessageCircle,
    tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
}

const CANAL_ENVIO_ICON: Record<CanalEnvio, typeof Mail> = {
  whatsapp: MessageCircle,
  email: Mail,
  link: Link2,
}

const CANAL_ENVIO_LABEL: Record<CanalEnvio, string> = {
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  link: 'Link compartilhável',
}

const STATUS_RECEBIDO_TONE: Record<
  StatusRecebido,
  { label: string; tone: string; border: string; Icon: typeof Check }
> = {
  pendente: {
    label: 'Aguardando resposta',
    tone: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    border: 'border-l-amber-400 dark:border-l-amber-500',
    Icon: Clock,
  },
  aceito: {
    label: 'Aceito',
    tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    border: 'border-l-emerald-400 dark:border-l-emerald-500',
    Icon: CheckCircle2,
  },
  recusado: {
    label: 'Recusado',
    tone: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    border: 'border-l-slate-300 dark:border-l-slate-700',
    Icon: XCircle,
  },
  expirado: {
    label: 'Expirado',
    tone: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    border: 'border-l-rose-300 dark:border-l-rose-700',
    Icon: Clock,
  },
}

const STATUS_ENVIADO_TONE: Record<StatusEnviado, { label: string; tone: string; Icon: typeof Check }> = {
  pendente: {
    label: 'Pendente',
    tone: 'bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-900/60',
    Icon: Clock,
  },
  aceito: {
    label: 'Aceito',
    tone: 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:ring-emerald-900/60',
    Icon: CheckCircle2,
  },
  recusado: {
    label: 'Recusado',
    tone: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
    Icon: XCircle,
  },
  expirado: {
    label: 'Expirado',
    tone: 'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:ring-rose-900/60',
    Icon: Clock,
  },
}

function fmtBRL(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatHora(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function tempoRelativo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const horas = Math.floor(diff / (1000 * 60 * 60))
  if (horas < 1) return 'agora há pouco'
  if (horas < 24) return `há ${horas}h`
  const dias = Math.floor(horas / 24)
  if (dias === 1) return 'ontem'
  if (dias < 7) return `há ${dias} dias`
  return formatData(iso)
}

type TabId = 'recebidos' | 'enviados'

export default function Convites() {
  const [tab, setTab] = useState<TabId>('recebidos')
  const [data, setData] = useState<ConvitesData>(initialData as ConvitesData)
  const [filtroRecebido, setFiltroRecebido] = useState<StatusRecebido | 'todos'>('todos')
  const [filtroEnviado, setFiltroEnviado] = useState<StatusEnviado | 'todos'>('todos')

  const recebidosCounts = useMemo(() => {
    const c: Record<StatusRecebido | 'todos', number> = {
      todos: data.recebidos.length,
      pendente: 0,
      aceito: 0,
      recusado: 0,
      expirado: 0,
    }
    for (const r of data.recebidos) c[r.status]++
    return c
  }, [data.recebidos])

  const enviadosCounts = useMemo(() => {
    const c: Record<StatusEnviado | 'todos', number> = {
      todos: data.enviados.length,
      pendente: 0,
      aceito: 0,
      recusado: 0,
      expirado: 0,
    }
    for (const e of data.enviados) c[e.status]++
    return c
  }, [data.enviados])

  const taxaAceitacaoEnviados = useMemo(() => {
    const concluidos = data.enviados.filter((e) => e.status !== 'pendente').length
    if (concluidos === 0) return 0
    const aceitos = data.enviados.filter((e) => e.status === 'aceito').length
    return Math.round((aceitos / concluidos) * 100)
  }, [data.enviados])

  const recebidosVisiveis = useMemo(() => {
    if (filtroRecebido === 'todos') return data.recebidos
    return data.recebidos.filter((r) => r.status === filtroRecebido)
  }, [data.recebidos, filtroRecebido])

  const enviadosVisiveis = useMemo(() => {
    if (filtroEnviado === 'todos') return data.enviados
    return data.enviados.filter((e) => e.status === filtroEnviado)
  }, [data.enviados, filtroEnviado])

  const aceitarRecebido = (id: string) => {
    setData((d) => ({
      ...d,
      recebidos: d.recebidos.map((r) => (r.id === id ? { ...r, status: 'aceito' } : r)),
    }))
  }
  const recusarRecebido = (id: string) => {
    setData((d) => ({
      ...d,
      recebidos: d.recebidos.map((r) => (r.id === id ? { ...r, status: 'recusado' } : r)),
    }))
  }

  const reenviar = (id: string) => {
    setData((d) => ({
      ...d,
      enviados: d.enviados.map((e) =>
        e.id === id
          ? {
              ...e,
              reenvios: e.reenvios + 1,
              enviadoEm: new Date().toISOString(),
              expiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'pendente',
            }
          : e,
      ),
    }))
  }
  const cancelarEnviado = (id: string) => {
    setData((d) => ({ ...d, enviados: d.enviados.filter((e) => e.id !== id) }))
  }

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <header className="mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="size-1.5 rounded-full bg-teal-500" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Atendimento · Convites
            </span>
          </div>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="size-11 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-center shrink-0">
                <Inbox className="size-5 text-teal-600 dark:text-teal-400" strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Convites
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Pacientes querendo agendar com você · Convites pro Nymos Move que você enviou.
                </p>
              </div>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_-4px_rgba(20,184,166,0.45)]">
              <Send className="size-4" strokeWidth={2.5} />
              Convidar paciente
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-5 border-b border-slate-200 dark:border-slate-800">
          {(
            [
              { id: 'recebidos', label: 'Recebidos', count: recebidosCounts.pendente },
              { id: 'enviados', label: 'Enviados', count: enviadosCounts.pendente },
            ] as { id: TabId; label: string; count: number }[]
          ).map((t) => {
            const ativo = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  ativo
                    ? 'text-slate-900 dark:text-slate-50'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {t.label}
                {t.count > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-5 h-5 rounded-full px-1.5 text-[10px] font-bold ${
                      ativo
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {t.count}
                  </span>
                )}
                {ativo && (
                  <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400" />
                )}
              </button>
            )
          })}
        </div>

        {tab === 'recebidos' ? (
          <>
            {/* KPIs recebidos */}
            <div className="flex items-baseline gap-2 mb-4 text-[13px] flex-wrap">
              <Stat valor={recebidosCounts.pendente.toString()} label="aguardando resposta" />
              <Divisor />
              <Stat valor={recebidosCounts.aceito.toString()} label="aceitos" />
              <Divisor />
              <Stat valor={recebidosCounts.todos.toString()} label="total" />
            </div>

            {/* Filtros recebidos */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(['todos', 'pendente', 'aceito', 'recusado', 'expirado'] as const).map((s) => {
                const ativo = filtroRecebido === s
                return (
                  <button
                    key={s}
                    onClick={() => setFiltroRecebido(s)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition-colors capitalize ${
                      ativo
                        ? 'bg-slate-900 text-white ring-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:ring-slate-100'
                        : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 dark:hover:bg-slate-800'
                    }`}
                  >
                    {s === 'todos' ? 'Todos' : STATUS_RECEBIDO_TONE[s].label.split(' ')[0]}
                    <span className={`font-mono text-[10px] tabular-nums ${ativo ? 'text-slate-300 dark:text-slate-500' : 'text-slate-400 dark:text-slate-600'}`}>
                      {recebidosCounts[s]}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Lista recebidos */}
            <div className="space-y-2">
              {recebidosVisiveis.length === 0 ? (
                <EmptyState
                  icon={<Inbox className="size-6 text-slate-400" strokeWidth={1.5} />}
                  titulo="Sem convites nessa categoria"
                  descricao="Quando um paciente pedir agendamento pelo seu perfil público, aparece aqui."
                />
              ) : (
                recebidosVisiveis.map((r) => (
                  <RecebidoCard
                    key={r.id}
                    convite={r}
                    onAceitar={() => aceitarRecebido(r.id)}
                    onRecusar={() => recusarRecebido(r.id)}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {/* KPIs enviados */}
            <div className="flex items-baseline gap-2 mb-4 text-[13px] flex-wrap">
              <Stat valor={enviadosCounts.pendente.toString()} label="aguardando aceite" />
              <Divisor />
              <Stat valor={enviadosCounts.aceito.toString()} label="aceitos" />
              <Divisor />
              <Stat valor={`${taxaAceitacaoEnviados}%`} label="taxa de aceitação" />
            </div>

            {/* Filtros enviados */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(['todos', 'pendente', 'aceito', 'expirado', 'recusado'] as const).map((s) => {
                const ativo = filtroEnviado === s
                return (
                  <button
                    key={s}
                    onClick={() => setFiltroEnviado(s)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition-colors capitalize ${
                      ativo
                        ? 'bg-slate-900 text-white ring-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:ring-slate-100'
                        : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 dark:hover:bg-slate-800'
                    }`}
                  >
                    {s === 'todos' ? 'Todos' : STATUS_ENVIADO_TONE[s].label}
                    <span className={`font-mono text-[10px] tabular-nums ${ativo ? 'text-slate-300 dark:text-slate-500' : 'text-slate-400 dark:text-slate-600'}`}>
                      {enviadosCounts[s]}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Lista enviados */}
            <div className="space-y-2">
              {enviadosVisiveis.length === 0 ? (
                <EmptyState
                  icon={<Send className="size-6 text-slate-400" strokeWidth={1.5} />}
                  titulo="Nenhum convite enviado"
                  descricao='Use o botão "Convidar paciente" pra mandar o link do Nymos Move.'
                />
              ) : (
                enviadosVisiveis.map((e) => (
                  <EnviadoCard
                    key={e.id}
                    convite={e}
                    onReenviar={() => reenviar(e.id)}
                    onCancelar={() => cancelarEnviado(e.id)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ─────────── Recebido card ─────────── */
function RecebidoCard({
  convite,
  onAceitar,
  onRecusar,
}: {
  convite: ConviteRecebido
  onAceitar: () => void
  onRecusar: () => void
}) {
  const tone = STATUS_RECEBIDO_TONE[convite.status]
  const origem = ORIGEM_LABEL[convite.origem]
  const Icon = MODALIDADE_ICON[convite.modalidade]
  const pendente = convite.status === 'pendente'

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 border-l-4 ${tone.border} p-4 ${pendente ? '' : 'opacity-75'}`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="size-11 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
          {convite.pacienteNome
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {convite.pacienteNome}
              </h3>
              {convite.pacienteIdade && (
                <span className="text-[11px] text-slate-500 dark:text-slate-500">
                  {convite.pacienteIdade} anos
                </span>
              )}
              {!convite.pacienteJaCadastrado && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[9px] font-bold uppercase tracking-wider">
                  Novo paciente
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              {tempoRelativo(convite.recebidoEm)}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-medium ${origem.tone}`}
            >
              <origem.Icon className="size-2.5" strokeWidth={2} />
              {origem.label}
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Icon className="size-2.5" strokeWidth={2} />
              {MODALIDADE_LABEL[convite.modalidade]}
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
              {convite.duracaoMin}min
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-50">
              {fmtBRL(convite.valorCentavos)}
            </span>
          </div>

          {/* Solicitação */}
          <div className="mt-2.5 rounded-lg bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
              Solicitação
            </div>
            <div className="text-[12.5px] text-slate-900 dark:text-slate-50 font-medium">
              {convite.servico}
            </div>
            <div className="text-[11px] font-mono tabular-nums text-slate-600 dark:text-slate-400 mt-0.5">
              {new Date(convite.dataPreferida).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
              })}
              {' · '}
              {convite.horaPreferida}
            </div>
            {convite.mensagem && (
              <p className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[12px] italic text-slate-600 dark:text-slate-400 leading-snug">
                &ldquo;{convite.mensagem}&rdquo;
              </p>
            )}
          </div>

          {/* Contato (se pendente) */}
          {pendente && (convite.pacienteTelefone || convite.pacienteEmail) && (
            <div className="mt-2 flex items-center gap-2 text-[11px]">
              {convite.pacienteTelefone && (
                <a
                  href={`https://wa.me/${convite.pacienteTelefone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <MessageCircle className="size-2.5" />
                  {convite.pacienteTelefone}
                </a>
              )}
              {convite.pacienteEmail && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <a
                    href={`mailto:${convite.pacienteEmail}`}
                    className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:underline font-mono"
                  >
                    <Mail className="size-2.5" />
                    {convite.pacienteEmail}
                  </a>
                </>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {pendente ? (
              <>
                <button
                  onClick={onAceitar}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  <Check className="size-3.5" strokeWidth={2.5} />
                  Aceitar e agendar
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                  Reagendar
                </button>
                <button
                  onClick={onRecusar}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 dark:hover:bg-rose-950/30 dark:hover:text-rose-300 dark:hover:border-rose-900"
                >
                  <X className="size-3" strokeWidth={2.5} />
                  Recusar
                </button>
              </>
            ) : (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${tone.tone}`}
              >
                <tone.Icon className="size-3" strokeWidth={2} />
                {tone.label}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────── Enviado card ─────────── */
function EnviadoCard({
  convite,
  onReenviar,
  onCancelar,
}: {
  convite: ConviteEnviado
  onReenviar: () => void
  onCancelar: () => void
}) {
  const tone = STATUS_ENVIADO_TONE[convite.status]
  const CanalIcon = CANAL_ENVIO_ICON[convite.canal]
  const pendente = convite.status === 'pendente'
  const expirado = convite.status === 'expirado'

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
          <User className="size-4" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {convite.pacienteNome}
              </h3>
              {convite.pacienteIdade && (
                <span className="text-[11px] text-slate-500 dark:text-slate-500">
                  {convite.pacienteIdade} anos
                </span>
              )}
            </div>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ring-1 ${tone.tone}`}
            >
              <tone.Icon className="size-2.5" strokeWidth={2.5} />
              {tone.label}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <CanalIcon className="size-2.5" />
              {CANAL_ENVIO_LABEL[convite.canal]}
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="font-mono">{convite.pacienteContato}</span>
          </div>

          <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-slate-400 dark:text-slate-500">
            <span>Enviado {tempoRelativo(convite.enviadoEm)}</span>
            {convite.reenvios > 0 && (
              <>
                <span>·</span>
                <span>{convite.reenvios} reenvio{convite.reenvios === 1 ? '' : 's'}</span>
              </>
            )}
            {(pendente || expirado) && (
              <>
                <span>·</span>
                <span>
                  {expirado ? 'Expirou em' : 'Expira em'} {formatData(convite.expiraEm)}
                </span>
              </>
            )}
          </div>

          {/* Ações */}
          <div className="mt-2.5 flex items-center gap-2">
            {(pendente || expirado) && (
              <button
                onClick={onReenviar}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 px-2.5 py-1 text-[11px] font-medium text-white"
              >
                <RefreshCw className="size-3" strokeWidth={2.5} />
                Reenviar
              </button>
            )}
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Copy className="size-3" strokeWidth={2} />
              Copiar link
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Share2 className="size-3" strokeWidth={2} />
              Compartilhar
            </button>
            {pendente && (
              <button
                onClick={onCancelar}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-700 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
              >
                <X className="size-3" strokeWidth={2.5} />
                Cancelar
              </button>
            )}
            {convite.status === 'aceito' && (
              <a
                href={convite.linkConvite}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 hover:underline"
              >
                <ExternalLink className="size-3" strokeWidth={2} />
                Ver paciente
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────── Helpers ─────────── */
function EmptyState({
  icon,
  titulo,
  descricao,
}: {
  icon: React.ReactNode
  titulo: string
  descricao: string
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-10 text-center">
      <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{titulo}</h3>
      <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        {descricao}
      </p>
    </div>
  )
}

function Stat({ valor, label }: { valor: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
        {valor}
      </span>
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
    </span>
  )
}
function Divisor() {
  return <span className="text-slate-300 dark:text-slate-700">·</span>
}

// suppress unused
void Sparkles
void formatHora
void Phone
