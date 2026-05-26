import { useMemo, useState } from 'react'
import {
  Bell,
  Pill,
  FileText,
  MessageCircle,
  Trophy,
  Flame,
  Heart,
  Medal,
  CheckCheck,
  ChevronRight,
} from 'lucide-react'
import type {
  FiltroNotificacao,
  Notificacao,
  NotificacaoBucket,
  NotificacoesProps,
  TipoNotificacao,
} from '@/../product-mobile/sections/notificacoes/types'

const TIPO_ICON: Record<TipoNotificacao, typeof Bell> = {
  'lembrete-medicacao': Pill,
  'alerta-exame': FileText,
  'mensagem-profissional': MessageCircle,
  conquista: Trophy,
  sequencia: Flame,
  saude: Heart,
  ranking: Medal,
  sistema: Bell,
}

// Tailwind precisa das classes completas no source pra purge funcionar
const TIPO_TINT: Record<TipoNotificacao, { ring: string; bg: string; icon: string; dot: string; border: string }> = {
  'lembrete-medicacao': {
    ring: 'bg-teal-500/15',
    bg: 'bg-teal-500/[0.04]',
    icon: 'text-teal-300',
    dot: 'bg-teal-400',
    border: 'border-teal-500/30',
  },
  'alerta-exame': {
    ring: 'bg-amber-500/15',
    bg: 'bg-amber-500/[0.04]',
    icon: 'text-amber-300',
    dot: 'bg-amber-400',
    border: 'border-amber-500/30',
  },
  'mensagem-profissional': {
    ring: 'bg-violet-500/15',
    bg: 'bg-violet-500/[0.04]',
    icon: 'text-violet-300',
    dot: 'bg-violet-400',
    border: 'border-violet-500/30',
  },
  conquista: {
    ring: 'bg-amber-500/15',
    bg: 'bg-amber-500/[0.04]',
    icon: 'text-amber-300',
    dot: 'bg-amber-400',
    border: 'border-amber-500/30',
  },
  sequencia: {
    ring: 'bg-rose-500/15',
    bg: 'bg-rose-500/[0.04]',
    icon: 'text-rose-300',
    dot: 'bg-rose-400',
    border: 'border-rose-500/30',
  },
  saude: {
    ring: 'bg-emerald-500/15',
    bg: 'bg-emerald-500/[0.04]',
    icon: 'text-emerald-300',
    dot: 'bg-emerald-400',
    border: 'border-emerald-500/30',
  },
  ranking: {
    ring: 'bg-orange-500/15',
    bg: 'bg-orange-500/[0.04]',
    icon: 'text-orange-300',
    dot: 'bg-orange-400',
    border: 'border-orange-500/30',
  },
  sistema: {
    ring: 'bg-slate-500/15',
    bg: 'bg-slate-500/[0.04]',
    icon: 'text-slate-300',
    dot: 'bg-slate-400',
    border: 'border-slate-500/30',
  },
}

const FILTROS: { key: FiltroNotificacao; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'saude', label: 'Saúde' },
  { key: 'conquista', label: 'Conquistas' },
  { key: 'sequencia', label: 'Sequências' },
  { key: 'lembrete-medicacao', label: 'Lembretes' },
  { key: 'alerta-exame', label: 'Exames' },
  { key: 'mensagem-profissional', label: 'Mensagens' },
  { key: 'ranking', label: 'Ranking' },
  { key: 'sistema', label: 'Sistema' },
]

function formatShort(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)
  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `${diffMin}min`
  if (diffH < 24) return `${diffH}h`
  if (diffD < 7) return `${diffD}d`
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}`
}

export function Notificacoes({
  data,
  onAbrirNotificacao,
  onMarcarTodasLidas,
}: NotificacoesProps) {
  const { stats, buckets } = data
  const [filtro, setFiltro] = useState<FiltroNotificacao>('todas')

  const filteredBuckets = useMemo<NotificacaoBucket[]>(() => {
    if (filtro === 'todas') return buckets
    return buckets
      .map((b) => ({ ...b, notificacoes: b.notificacoes.filter((n) => n.tipo === filtro) }))
      .filter((b) => b.notificacoes.length > 0)
  }, [buckets, filtro])

  const isEmpty = filteredBuckets.length === 0

  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      <div className="px-4 pt-4 pb-24">
        {/* Stats topo */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Total
            </div>
            <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-slate-50">
              {stats.total}
            </div>
          </div>
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/[0.06] p-3">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              <div className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                Não lidas
              </div>
            </div>
            <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-slate-50">
              {stats.naoLidas}
            </div>
          </div>
        </div>

        {/* CTA marcar todas como lidas */}
        {stats.naoLidas > 0 && (
          <button
            type="button"
            onClick={onMarcarTodasLidas}
            className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-teal-300 hover:text-teal-200"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Marcar todas como lidas
          </button>
        )}

        {/* Filtros */}
        <div className="mt-4 -mx-4 overflow-x-auto px-4">
          <div className="flex gap-1.5 pb-1">
            {FILTROS.map((f) => {
              const active = filtro === f.key
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFiltro(f.key)}
                  className={
                    'shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium transition ' +
                    (active
                      ? 'border-teal-500/40 bg-teal-500/15 text-teal-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200')
                  }
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Lista */}
        {isEmpty ? (
          <div className="mt-12 flex flex-col items-center px-6 text-center">
            <div className="rounded-full border border-slate-800 bg-slate-900/60 p-3">
              <Bell className="h-5 w-5 text-slate-500" />
            </div>
            <div className="mt-3 text-sm font-semibold text-slate-200">
              Nenhuma notificação por aqui
            </div>
            <div className="mt-1 text-[11.5px] text-slate-400">
              Quando você receber lembretes, alertas e mensagens, eles aparecem aqui.
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            {filteredBuckets.map((bucket) => (
              <section key={bucket.bucket}>
                <div className="mb-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {bucket.label}
                </div>
                <div className="space-y-2">
                  {bucket.notificacoes.map((n) => (
                    <NotificacaoCard
                      key={n.id}
                      notif={n}
                      onTap={() => onAbrirNotificacao?.(n.id)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NotificacaoCard({ notif, onTap }: { notif: Notificacao; onTap: () => void }) {
  const Icon = TIPO_ICON[notif.tipo]
  const tint = TIPO_TINT[notif.tipo]
  const isUnread = notif.status === 'nao-lida'

  return (
    <button
      type="button"
      onClick={onTap}
      className={
        'w-full rounded-xl border p-3 text-left transition ' +
        (isUnread
          ? `${tint.border} ${tint.bg}`
          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700')
      }
    >
      <div className="flex gap-3">
        <div className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-full ' + tint.ring}>
          <Icon className={'h-4 w-4 ' + tint.icon} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div
              className={
                'min-w-0 flex-1 truncate text-[12.5px] leading-snug ' +
                (isUnread ? 'font-semibold text-slate-50' : 'font-medium text-slate-200')
              }
            >
              {notif.titulo}
            </div>
            <div className="shrink-0 font-mono text-[10px] tabular-nums text-slate-500">
              {formatShort(notif.criadaEmISO)}
            </div>
            {isUnread && <div className={'mt-1 h-1.5 w-1.5 shrink-0 rounded-full ' + tint.dot} />}
          </div>
          <div className="mt-1 text-[11.5px] leading-relaxed text-slate-400">
            {notif.mensagem}
          </div>
          {notif.ctaLabel && (
            <div className={'mt-2 inline-flex items-center gap-1 text-[11px] font-semibold ' + tint.icon}>
              {notif.ctaLabel}
              <ChevronRight className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
