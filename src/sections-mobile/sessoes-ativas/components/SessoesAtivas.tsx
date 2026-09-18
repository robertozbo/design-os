import { useEffect, useMemo, useState } from 'react'
import {
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  X,
  Check,
  Clock,
  Loader2,
  ShieldOff,
  type LucideIcon,
} from 'lucide-react'
import type {
  SessoesAtivasProps,
  SessaoAtiva,
  SessaoTipo,
  Tema,
} from '@/../product-mobile/sections/sessoes-ativas/types'

// ─── Tokens ──────────────────────────────────────────────────────────────

interface TT {
  bgPage: string
  bgCard: string
  bgInner: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  border: string
  borderSubtle: string
}

function tokens(tema: Tema): TT {
  if (tema === 'claro') {
    return {
      bgPage: 'bg-stone-50',
      bgCard: 'bg-white',
      bgInner: 'bg-stone-100',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-stone-500',
      textTertiary: 'text-stone-400',
      border: 'border-stone-200',
      borderSubtle: 'border-stone-200/70',
    }
  }
  return {
    bgPage: 'bg-slate-950',
    bgCard: 'bg-slate-900',
    bgInner: 'bg-slate-950',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-500',
    textTertiary: 'text-slate-400',
    border: 'border-slate-800',
    borderSubtle: 'border-slate-800/60',
  }
}

const TIPO_META: Record<SessaoTipo, { icon: LucideIcon; cor: string }> = {
  mobile: { icon: Smartphone, cor: 'violet' },
  desktop: { icon: Laptop, cor: 'sky' },
  tablet: { icon: Tablet, cor: 'emerald' },
  web: { icon: Globe, cor: 'amber' },
}

const COR_BG: Record<string, string> = {
  violet: 'bg-violet-500/15 text-violet-500 dark:text-violet-300',
  sky: 'bg-sky-500/15 text-sky-500 dark:text-sky-300',
  emerald: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-500 dark:text-amber-300',
  rose: 'bg-rose-500/15 text-rose-500 dark:text-rose-300',
}

function formatRelative(iso: string, agora = new Date()): string {
  try {
    const then = new Date(iso).getTime()
    const diffMin = Math.round((agora.getTime() - then) / 60000)
    if (diffMin < 2) return 'agora há pouco'
    if (diffMin < 60) return `há ${diffMin} min`
    const diffH = Math.round(diffMin / 60)
    if (diffH < 24) return `há ${diffH}h`
    const diffD = Math.round(diffH / 24)
    if (diffD === 1) return 'ontem'
    if (diffD < 14) return `há ${diffD} dias`
    const diffS = Math.round(diffD / 7)
    if (diffS < 5) return `há ${diffS} semana${diffS > 1 ? 's' : ''}`
    const diffM = Math.round(diffD / 30)
    return `há ${diffM} mes${diffM > 1 ? 'es' : ''}`
  } catch {
    return iso
  }
}

// ─────────────────────────────────────────────────────────────────────────

export function SessoesAtivas({
  data,
  onEncerrarSessao,
  onEncerrarTodasOutras,
}: SessoesAtivasProps) {
  const t = tokens(data.tema)
  const [encerrando, setEncerrando] = useState<string | null>(null)
  const [encerrandoMass, setEncerrandoMass] = useState(false)
  const [confirmar, setConfirmar] = useState<SessaoAtiva | null>(null)
  const [confirmarMass, setConfirmarMass] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const ordenadas = useMemo(() => {
    return [...data.sessoes].sort((a, b) => {
      if (a.atual && !b.atual) return -1
      if (!a.atual && b.atual) return 1
      return b.ultimaAtividade.localeCompare(a.ultimaAtividade)
    })
  }, [data.sessoes])

  const outras = ordenadas.filter((s) => !s.atual)
  const ativas7d = useMemo(() => {
    const corte = Date.now() - 7 * 86400000
    return data.sessoes.filter((s) => new Date(s.ultimaAtividade).getTime() >= corte).length
  }, [data.sessoes])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(id)
  }, [toast])

  const encerrar = async (sessao: SessaoAtiva) => {
    setEncerrando(sessao.id)
    try {
      await onEncerrarSessao?.(sessao.id)
      setConfirmar(null)
      setToast('Sessão encerrada')
    } finally {
      setEncerrando(null)
    }
  }

  const encerrarTodas = async () => {
    setEncerrandoMass(true)
    try {
      await onEncerrarTodasOutras?.()
      setConfirmarMass(false)
      setToast(`${outras.length} sessões encerradas`)
    } finally {
      setEncerrandoMass(false)
    }
  }

  return (
    <div className={`min-h-full ${t.bgPage} pb-28 pt-3 px-4 flex flex-col gap-3`}>
      {/* Counter card */}
      <div className={`${t.bgCard} border ${t.border} rounded-2xl px-4 py-3 flex items-end justify-between gap-3`}>
        <div>
          <div className={`text-2xl font-semibold tabular-nums ${t.textPrimary}`}>
            {data.sessoes.length}
          </div>
          <div className={`text-[10px] font-semibold uppercase tracking-wider ${t.textSecondary}`}>
            Dispositivos
          </div>
        </div>
        <div className={`text-[11px] ${t.textSecondary} text-right`}>
          {ativas7d} ativos
          <br />
          últimos 7 dias
        </div>
      </div>

      {/* Lista */}
      {ordenadas.length === 1 && ordenadas[0]?.atual ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 flex items-start gap-3">
          <ShieldOff size={16} strokeWidth={2.2} className="text-emerald-400 shrink-0 mt-0.5" />
          <p className={`text-[12.5px] leading-snug ${t.textSecondary}`}>
            <span className={`font-semibold ${t.textPrimary}`}>Apenas este dispositivo conectado.</span>
            <br />
            Nenhuma outra sessão ativa na sua conta.
          </p>
        </div>
      ) : (
        ordenadas.map((sessao) => (
          <SessaoCard
            key={sessao.id}
            sessao={sessao}
            t={t}
            encerrando={encerrando === sessao.id}
            onPedirEncerrar={() => setConfirmar(sessao)}
          />
        ))
      )}

      {/* Footer flutuante: mass revoke */}
      {outras.length >= 2 && (
        <div className={`fixed inset-x-0 bottom-0 ${t.bgPage} border-t ${t.borderSubtle} px-4 py-3 pb-5`}>
          <button
            onClick={() => setConfirmarMass(true)}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold transition"
          >
            Encerrar todas as outras sessões
          </button>
        </div>
      )}

      {/* Modal de confirmação individual */}
      {confirmar && (
        <Confirmacao
          t={t}
          titulo={`Encerrar sessão de ${confirmar.device}?`}
          body="O dispositivo será desconectado imediatamente e precisará fazer login novamente."
          cancelar={() => !encerrando && setConfirmar(null)}
          confirmar={() => encerrar(confirmar)}
          loading={encerrando !== null}
          loadingLabel="Encerrando…"
          confirmarLabel="Encerrar sessão"
        />
      )}

      {/* Modal de confirmação mass */}
      {confirmarMass && (
        <Confirmacao
          t={t}
          titulo={`Encerrar ${outras.length} sessões?`}
          body="Você precisará fazer login novamente em todos os outros dispositivos. Esta sessão atual permanece ativa."
          cancelar={() => !encerrandoMass && setConfirmarMass(false)}
          confirmar={encerrarTodas}
          loading={encerrandoMass}
          loadingLabel="Encerrando…"
          confirmarLabel="Encerrar todas"
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-4 py-2.5 rounded-full bg-emerald-500 text-white text-[12px] font-semibold shadow-lg flex items-center gap-2">
            <Check size={13} strokeWidth={2.6} />
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Subcomponentes ──────────────────────────────────────────────────────

function SessaoCard({
  sessao,
  t,
  encerrando,
  onPedirEncerrar,
}: {
  sessao: SessaoAtiva
  t: TT
  encerrando: boolean
  onPedirEncerrar: () => void
}) {
  const meta = TIPO_META[sessao.tipo]
  const Icon = meta.icon
  return (
    <div
      className={`${t.bgCard} border ${t.border} rounded-2xl px-3 py-3 flex items-start gap-3 ${
        sessao.atual ? 'ring-1 ring-sky-500/40' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-xl ${COR_BG[meta.cor]} flex items-center justify-center shrink-0`}>
        <Icon size={16} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[13.5px] font-semibold ${t.textPrimary}`}>{sessao.device}</span>
          {sessao.atual && (
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${COR_BG.sky}`}>
              Este dispositivo
            </span>
          )}
        </div>
        <div className={`text-[11.5px] ${t.textSecondary} mt-0.5`}>
          {sessao.os} · {sessao.local}
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          {sessao.atual ? (
            <>
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] text-emerald-500 dark:text-emerald-400 font-semibold">
                Ativo agora
              </span>
            </>
          ) : (
            <>
              <Clock size={10} strokeWidth={2.2} className={t.textTertiary} />
              <span className={`text-[11px] ${t.textSecondary}`}>
                Último acesso {formatRelative(sessao.ultimaAtividade)}
              </span>
            </>
          )}
        </div>
      </div>
      {!sessao.atual && (
        <button
          onClick={onPedirEncerrar}
          disabled={encerrando}
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg ${COR_BG.rose} text-[11.5px] font-semibold transition active:scale-95 disabled:opacity-50`}
        >
          {encerrando ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <X size={12} strokeWidth={2.6} />
          )}
          Encerrar
        </button>
      )}
    </div>
  )
}

function Confirmacao({
  t,
  titulo,
  body,
  cancelar,
  confirmar,
  loading,
  loadingLabel,
  confirmarLabel,
}: {
  t: TT
  titulo: string
  body: string
  cancelar: () => void
  confirmar: () => void
  loading: boolean
  loadingLabel: string
  confirmarLabel: string
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4 pb-4"
      onClick={cancelar}
    >
      <div
        className={`w-full max-w-[380px] ${t.bgCard} rounded-2xl p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`text-base font-semibold ${t.textPrimary}`}>{titulo}</h3>
        <p className={`text-[13px] ${t.textSecondary} leading-snug`}>{body}</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={cancelar}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl ${t.bgInner} border ${t.border} ${t.textPrimary} text-[13px] font-semibold transition disabled:opacity-50`}
          >
            Cancelar
          </button>
          <button
            onClick={confirmar}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold transition disabled:opacity-50"
          >
            {loading ? loadingLabel : confirmarLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
