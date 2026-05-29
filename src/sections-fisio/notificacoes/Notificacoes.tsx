import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Bell,
  BellOff,
  Check,
  CheckCircle2,
  Info,
  Mail,
  MessageCircle,
  MessageSquare,
  Moon,
  Smartphone,
  Sparkles,
} from 'lucide-react'
import initialData from '@/../product-fisio/sections/notificacoes/data.json'
import type {
  Canal,
  Categoria,
  CategoriaId,
  NotifFeedItem,
  NotificacoesData,
  NotifSeveridade,
} from '@/../product-fisio/sections/notificacoes/types'

const CANAIS: { id: Canal; label: string; icon: typeof Mail; descricao: string }[] = [
  { id: 'app', label: 'App', icon: Smartphone, descricao: 'Push no app' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, descricao: 'Mensagem WhatsApp' },
  { id: 'email', label: 'E-mail', icon: Mail, descricao: 'Caixa de entrada' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, descricao: 'Mensagem de texto' },
]

const SEVERIDADE_STYLE: Record<NotifSeveridade, { color: string; Icon: typeof Info }> = {
  info: { color: 'bg-sky-500', Icon: Info },
  sucesso: { color: 'bg-emerald-500', Icon: CheckCircle2 },
  atencao: { color: 'bg-amber-500', Icon: AlertCircle },
  risco: { color: 'bg-rose-500', Icon: AlertCircle },
}

function formatHora(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const TEMPLATES = [
  {
    id: 'conservador',
    label: 'Conservador',
    descricao: 'Só urgência + cobrança',
    apply: (c: Categoria): Categoria => ({
      ...c,
      ativo: {
        app: c.id === 'agendamento' || c.id === 'clinico',
        whatsapp: c.id === 'clinico',
        email: c.id === 'cobranca' || c.id === 'agendamento',
        sms: false,
      },
    }),
  },
  {
    id: 'completo',
    label: 'Completo',
    descricao: 'Tudo no app + WhatsApp',
    apply: (c: Categoria): Categoria => ({
      ...c,
      ativo: { app: true, whatsapp: true, email: true, sms: false },
    }),
  },
  {
    id: 'urgente',
    label: 'Só urgente',
    descricao: 'Apenas crítico, sem ruído',
    apply: (c: Categoria): Categoria => ({
      ...c,
      ativo: { app: c.critica, whatsapp: c.critica, email: c.critica, sms: false },
    }),
  },
]

export default function Notificacoes() {
  const [data, setData] = useState<NotificacoesData>(initialData as NotificacoesData)

  const toggleCanal = (catId: CategoriaId, canal: Canal) => {
    setData((d) => ({
      ...d,
      categorias: d.categorias.map((c) =>
        c.id === catId ? { ...c, ativo: { ...c.ativo, [canal]: !c.ativo[canal] } } : c,
      ),
    }))
  }

  const aplicarTemplate = (tplId: string) => {
    const tpl = TEMPLATES.find((t) => t.id === tplId)
    if (!tpl) return
    setData((d) => ({ ...d, categorias: d.categorias.map(tpl.apply) }))
  }

  const naoLidas = useMemo(() => data.recentes.filter((n) => !n.lida).length, [data.recentes])

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="size-1.5 rounded-full bg-teal-500" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Conta · Notificações
            </span>
          </div>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="size-11 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-center shrink-0">
                <Bell className="size-5 text-teal-600 dark:text-teal-400" strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Notificações
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                  Configure por onde você prefere receber cada tipo de aviso.
                </p>
              </div>
            </div>
            {naoLidas > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-300 ring-1 ring-rose-200 dark:ring-rose-900/60">
                <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
                {naoLidas} não lidas
              </span>
            )}
          </div>
        </header>

        {/* Templates */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
            Templates
          </span>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => aplicarTemplate(t.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-50/40 dark:hover:bg-teal-950/20"
              title={t.descricao}
            >
              <Sparkles className="size-3 text-teal-600 dark:text-teal-400" strokeWidth={2} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Matriz */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden mb-4">
          <div className="grid grid-cols-[1fr_72px_72px_72px_72px] gap-1 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-4 py-3">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Categoria
            </span>
            {CANAIS.map((c) => {
              const Icon = c.icon
              return (
                <div key={c.id} className="flex flex-col items-center text-center" title={c.descricao}>
                  <Icon className="size-3 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
                  <span className="mt-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {c.label}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.categorias.map((cat) => (
              <div key={cat.id} className="grid grid-cols-[1fr_72px_72px_72px_72px] gap-1 items-center px-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {cat.label}
                    </span>
                    {cat.critica && (
                      <span className="inline-flex items-center gap-0.5 rounded px-1 py-px bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[8px] font-bold uppercase tracking-wider">
                        <AlertCircle className="size-2" strokeWidth={2.5} />
                        Crítico
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {cat.descricao}
                  </p>
                </div>
                {CANAIS.map((c) => {
                  const ativo = cat.ativo[c.id]
                  return (
                    <div key={c.id} className="flex justify-center">
                      <CheckCell ativo={ativo} onToggle={() => toggleCanal(cat.id, c.id)} />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Horário de silêncio */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 mb-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Moon className="size-3.5 text-slate-500" strokeWidth={1.75} />
            <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Não perturbe
            </span>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.horarioSilencio.ativo}
              onChange={() =>
                setData((d) => ({
                  ...d,
                  horarioSilencio: { ...d.horarioSilencio, ativo: !d.horarioSilencio.ativo },
                }))
              }
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  Silenciar notificações em horário noturno
                </span>
                {data.horarioSilencio.ativo && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 dark:bg-teal-950/40 px-1.5 py-0.5 text-[10px] font-medium text-teal-700 dark:text-teal-300 font-mono tabular-nums">
                    {data.horarioSilencio.inicio} → {data.horarioSilencio.fim}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Push e mensagens não vão tocar em{' '}
                {data.horarioSilencio.aplicaACanais.map((c) => CANAIS.find((x) => x.id === c)?.label).join(' + ')}{' '}
                durante esse intervalo. Categorias críticas continuam chegando.
              </p>
            </div>
          </label>
          {data.horarioSilencio.ativo && (
            <div className="mt-3 pl-7 grid grid-cols-2 gap-3 max-w-md">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Início
                </label>
                <input
                  type="time"
                  value={data.horarioSilencio.inicio}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      horarioSilencio: { ...d.horarioSilencio, inicio: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Fim
                </label>
                <input
                  type="time"
                  value={data.horarioSilencio.fim}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      horarioSilencio: { ...d.horarioSilencio, fim: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Recentes */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <Bell className="size-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Recentes
              </span>
            </div>
            <button
              onClick={() =>
                setData((d) => ({
                  ...d,
                  recentes: d.recentes.map((n) => ({ ...n, lida: true })),
                }))
              }
              className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-medium"
            >
              Marcar todas como lidas
            </button>
          </div>
          <ul className="space-y-2">
            {data.recentes.map((n) => (
              <FeedItem key={n.id} item={n} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function CheckCell({ ativo, onToggle }: { ativo: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`size-6 rounded-md flex items-center justify-center transition-all ${
        ativo
          ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-sm'
          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400'
      }`}
      aria-pressed={ativo}
    >
      {ativo ? <Check className="size-3.5" strokeWidth={3} /> : <BellOff className="size-3" strokeWidth={2} />}
    </button>
  )
}

function FeedItem({ item }: { item: NotifFeedItem }) {
  const s = SEVERIDADE_STYLE[item.severidade]
  return (
    <li
      className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${
        item.lida
          ? 'bg-slate-50/40 dark:bg-slate-800/20'
          : 'bg-teal-50/40 dark:bg-teal-950/15 ring-1 ring-teal-100 dark:ring-teal-900/40'
      }`}
    >
      <div className={`size-7 rounded-md ${s.color} text-white flex items-center justify-center shrink-0`}>
        <s.Icon className="size-3.5" strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <h4
            className={`text-sm leading-tight ${
              item.lida
                ? 'font-medium text-slate-700 dark:text-slate-300'
                : 'font-semibold text-slate-900 dark:text-slate-50'
            }`}
          >
            {item.titulo}
            {!item.lida && (
              <span className="inline-block ml-1.5 size-1.5 rounded-full bg-teal-500 align-middle" />
            )}
          </h4>
          <span className="font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
            {formatHora(item.dataIso)}
          </span>
        </div>
        <p className="mt-0.5 text-[12px] text-slate-600 dark:text-slate-400 leading-snug">
          {item.descricao}
        </p>
        {item.acaoLabel && (
          <button className="mt-1.5 text-[11px] font-medium text-teal-600 dark:text-teal-400 hover:underline">
            {item.acaoLabel} →
          </button>
        )}
      </div>
    </li>
  )
}

