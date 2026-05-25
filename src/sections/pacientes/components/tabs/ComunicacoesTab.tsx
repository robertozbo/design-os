import { useState } from 'react'
import { CheckCheck, Lock, MessageCircle, Send, Sparkles } from 'lucide-react'
import type {
  ComunicacoesData,
  Mensagem,
  PlanTier,
} from '@/../product/sections/pacientes/types'
import { Avatar } from '../Avatar'

interface ComunicacoesTabProps {
  data: ComunicacoesData
  patientName: string
  patientAvatarUrl?: string | null
  nutriName: string
  nutriAvatarUrl?: string | null
  currentPlan: PlanTier
  onSendMessage?: (text: string) => void
  onQuickReply?: (text: string) => void
  onUpgradeClick?: (toPlan: PlanTier) => void
}

const PLAN_RANK: Record<PlanTier, number> = { free: 0, plus: 1, pro: 2 }

export function ComunicacoesTab({
  data,
  patientName,
  patientAvatarUrl,
  nutriName,
  nutriAvatarUrl,
  currentPlan,
  onSendMessage,
  onQuickReply,
  onUpgradeClick,
}: ComunicacoesTabProps) {
  const [text, setText] = useState('')

  if (PLAN_RANK[currentPlan] < PLAN_RANK['plus']) {
    return (
      <PaywallView
        onUpgrade={() => onUpgradeClick?.('plus')}
      />
    )
  }

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!text.trim()) return
    onSendMessage?.(text.trim())
    setText('')
  }

  const groupedByDay = groupByDay(data.messages)

  return (
    <article className="flex h-[640px] flex-col rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <MessageCircle size={14} className="text-teal-600 dark:text-teal-400" />
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Conversa com {patientName.split(' ')[0]}
          </h2>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
          {data.messages.length} mensage{data.messages.length === 1 ? 'm' : 'ns'}
        </span>
      </header>

      {/* Thread */}
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {data.messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
            Nenhuma mensagem ainda. Que tal mandar uma?
          </p>
        ) : (
          Object.entries(groupedByDay).map(([day, msgs]) => (
            <div key={day} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {day}
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>
              {msgs.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  patientName={patientName}
                  patientAvatarUrl={patientAvatarUrl}
                  nutriName={nutriName}
                  nutriAvatarUrl={nutriAvatarUrl}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Quick replies */}
      {data.quickReplies.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-2 dark:border-slate-800">
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 py-1">
            {data.quickReplies.map((reply, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setText(reply)
                  onQuickReply?.(reply)
                }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-teal-700 dark:hover:bg-teal-900/30 dark:hover:text-teal-300"
              >
                <Sparkles size={10} />
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-slate-100 px-5 py-3 dark:border-slate-800"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva uma mensagem…"
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600 dark:focus:bg-slate-900"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600"
        >
          <Send size={14} />
          Enviar
        </button>
      </form>
    </article>
  )
}

function MessageBubble({
  msg,
  patientName,
  patientAvatarUrl,
  nutriName,
  nutriAvatarUrl,
}: {
  msg: Mensagem
  patientName: string
  patientAvatarUrl?: string | null
  nutriName: string
  nutriAvatarUrl?: string | null
}) {
  const isNutri = msg.from === 'nutri'

  return (
    <div className={`flex items-end gap-2 ${isNutri ? 'flex-row-reverse' : ''}`}>
      <Avatar
        name={isNutri ? nutriName : patientName}
        imageUrl={isNutri ? nutriAvatarUrl : patientAvatarUrl}
        size="sm"
      />
      <div className={`flex max-w-[70%] flex-col gap-0.5 ${isNutri ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
            isNutri
              ? 'bg-teal-600 text-white'
              : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
          }`}
        >
          {msg.text}
        </div>
        <div
          className={`flex items-center gap-1 px-1 text-[10px] text-slate-400 dark:text-slate-500 ${
            isNutri ? 'flex-row-reverse' : ''
          }`}
        >
          <span className="font-mono tabular-nums">{formatTime(msg.sentAt)}</span>
          {isNutri && (
            <CheckCheck
              size={11}
              className={msg.read ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400'}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function PaywallView({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 p-10 text-center">
      <div
        className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-orange-500 opacity-20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 text-orange-300">
          <Lock size={20} />
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-orange-300">
          Plano Plus
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
          Comunique-se com seus pacientes
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
          Mensagens in-app, anexos de exames, lembretes automáticos e respostas rápidas.
          Tudo dentro do Nymos, sem WhatsApp pessoal.
        </p>
        <button
          type="button"
          onClick={onUpgrade}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 hover:bg-orange-400"
        >
          Ver plano Plus
        </button>
      </div>
    </div>
  )
}

function groupByDay(messages: Mensagem[]): Record<string, Mensagem[]> {
  const groups: Record<string, Mensagem[]> = {}
  for (const m of messages) {
    const day = formatDay(m.sentAt)
    if (!groups[day]) groups[day] = []
    groups[day].push(m)
  }
  return groups
}

function formatDay(iso: string) {
  try {
    const date = new Date(iso)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const isSameDay = (a: Date, b: Date) =>
      a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()

    if (isSameDay(date, today)) return 'Hoje'
    if (isSameDay(date, yesterday)) return 'Ontem'
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
  } catch {
    return iso
  }
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return iso
  }
}
