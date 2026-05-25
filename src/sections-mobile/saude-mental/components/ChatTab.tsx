import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Calendar, Brain, MessageSquarePlus, BookHeart } from 'lucide-react'
import type {
  ChatState,
  ChatMensagem,
  PsicologoVinculado,
} from '@/../product-mobile/sections/saude-mental/types'

interface ChatTabProps {
  psicologo: PsicologoVinculado | null
  chat: ChatState
  onSendMessage?: (texto: string) => void
  onAttachFile?: () => void
  onOpenPsicologoDetail?: (psicologoId: string) => void
  onInvitePsicologo?: () => void
}

export function ChatTab({
  psicologo,
  chat,
  onSendMessage,
  onAttachFile,
  onOpenPsicologoDetail,
  onInvitePsicologo,
}: ChatTabProps) {
  if (!psicologo) {
    return <EmptyChatState onInvitePsicologo={onInvitePsicologo} />
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <PsicologoStrip psicologo={psicologo} onOpenDetail={onOpenPsicologoDetail} />
      <MessageList mensagens={chat.mensagens} digitando={chat.digitando} />
      <Composer onSend={onSendMessage} onAttach={onAttachFile} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface PsicologoStripProps {
  psicologo: PsicologoVinculado
  onOpenDetail?: (id: string) => void
}

function PsicologoStrip({ psicologo, onOpenDetail }: PsicologoStripProps) {
  const statusColor =
    psicologo.status === 'online'
      ? 'bg-emerald-400'
      : psicologo.status === 'em-sessao'
        ? 'bg-amber-400'
        : 'bg-slate-600'

  return (
    <button
      onClick={() => onOpenDetail?.(psicologo.id)}
      className="mx-4 mb-3 px-3 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center gap-3 text-left transition-colors"
    >
      <div className="relative shrink-0">
        <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center">
          <span className="text-violet-300 font-semibold text-[13px]">{psicologo.inicial}</span>
        </div>
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${statusColor} ring-2 ring-slate-900`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-100 font-semibold text-[13px] truncate">
            {psicologo.fullName}
          </span>
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 font-semibold uppercase tracking-wider text-[9px] shrink-0">
            <Brain size={9} strokeWidth={2.4} />
            Psi
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[10.5px] text-slate-500">
          <span>{psicologo.statusLabel}</span>
          <span>·</span>
          <span className="truncate">{psicologo.abordagem}</span>
        </div>
        {psicologo.proximoAgendamento && (
          <div className="flex items-center gap-1 mt-1 text-[10px] text-teal-300 font-mono tabular-nums">
            <Calendar size={9} strokeWidth={2.2} />
            <span>{psicologo.proximoAgendamento.label}</span>
            <span className="text-slate-500">· {psicologo.proximoAgendamento.modalidade}</span>
          </div>
        )}
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface MessageListProps {
  mensagens: ChatMensagem[]
  digitando: boolean
}

function MessageList({ mensagens, digitando }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [mensagens.length, digitando])

  const grouped = groupByDate(mensagens)

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 pb-3 no-scrollbar"
    >
      {grouped.map((group) => (
        <div key={group.key}>
          <div className="flex items-center justify-center my-3">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
              {group.label}
            </span>
          </div>
          <div className="space-y-2">
            {group.mensagens.map((m) => (
              <MessageBubble key={m.id} mensagem={m} />
            ))}
          </div>
        </div>
      ))}
      {digitando && (
        <div className="mt-2 flex">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-md px-3 py-2.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse [animation-delay:200ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse [animation-delay:400ms]" />
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  mensagem: ChatMensagem
}

function MessageBubble({ mensagem }: MessageBubbleProps) {
  if (mensagem.autor === 'sistema') {
    if (mensagem.tipo === 'diario_compartilhado') {
      return (
        <div className="flex justify-center">
          <div className="max-w-[85%] flex items-center gap-2 px-3 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl">
            <BookHeart size={12} className="text-violet-300 shrink-0" strokeWidth={2.2} />
            <span className="text-[11px] text-violet-200 leading-snug">{mensagem.texto}</span>
          </div>
        </div>
      )
    }
    return (
      <div className="flex justify-center">
        <span className="text-[10px] text-slate-500 italic px-2">{mensagem.texto}</span>
      </div>
    )
  }

  const isOwn = mensagem.autor === 'paciente'
  const time = formatTime(mensagem.enviadaEm)

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[78%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-3 py-2 rounded-2xl text-[12.5px] leading-relaxed ${
            isOwn
              ? 'bg-teal-500 text-slate-950 rounded-br-md'
              : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-md'
          }`}
        >
          {mensagem.texto}
        </div>
        <div className="flex items-center gap-1 mt-1 px-1 text-[9.5px] text-slate-500 font-mono tabular-nums">
          <span>{time}</span>
          {isOwn && (
            <>
              <span>·</span>
              <span className={mensagem.lida ? 'text-teal-400' : 'text-slate-500'}>
                {mensagem.lida ? '✓✓' : '✓'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface ComposerProps {
  onSend?: (texto: string) => void
  onAttach?: () => void
}

function Composer({ onSend, onAttach }: ComposerProps) {
  const [texto, setTexto] = useState('')
  const canSend = texto.trim().length > 0

  function handleSend() {
    if (!canSend) return
    onSend?.(texto.trim())
    setTexto('')
  }

  return (
    <div className="px-3 pt-2 pb-3 border-t border-slate-900 bg-slate-950 shrink-0">
      <div className="flex items-end gap-2 bg-slate-900 border border-slate-800 rounded-2xl pl-2 pr-1.5 py-1.5">
        <button
          onClick={onAttach}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 shrink-0 transition-colors"
          aria-label="Anexar"
        >
          <Paperclip size={15} strokeWidth={2} />
        </button>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Escreva uma mensagem…"
          rows={1}
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-[12.5px] leading-relaxed resize-none outline-none py-1.5 max-h-24"
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            canSend
              ? 'bg-teal-500 text-slate-950 hover:bg-teal-400'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
          aria-label="Enviar"
        >
          <Send size={14} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface EmptyChatStateProps {
  onInvitePsicologo?: () => void
}

function EmptyChatState({ onInvitePsicologo }: EmptyChatStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-violet-500/15 flex items-center justify-center mb-4">
        <Brain size={28} className="text-violet-300" strokeWidth={1.8} />
      </div>
      <h2 className="text-slate-100 font-semibold text-[15px]">Converse com um psicólogo</h2>
      <p className="text-slate-500 text-[12px] leading-relaxed mt-1.5 max-w-[260px]">
        Convide um psicólogo de confiança pra te acompanhar. Seu diário fica acessível enquanto
        isso.
      </p>
      <button
        onClick={onInvitePsicologo}
        className="mt-5 inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-[12.5px] h-10 px-4 rounded-xl transition-colors"
      >
        <MessageSquarePlus size={14} strokeWidth={2.2} />
        Convidar psicólogo
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

interface MessageGroup {
  key: string
  label: string
  mensagens: ChatMensagem[]
}

function groupByDate(mensagens: ChatMensagem[]): MessageGroup[] {
  const groups: MessageGroup[] = []
  let current: MessageGroup | null = null
  for (const m of mensagens) {
    const dateKey = m.enviadaEm.slice(0, 10)
    if (!current || current.key !== dateKey) {
      current = { key: dateKey, label: formatDateGroup(dateKey), mensagens: [] }
      groups.push(current)
    }
    current.mensagens.push(m)
  }
  return groups
}

function formatDateGroup(dateISO: string): string {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const todayISO = toISODate(today)
  const yesterdayISO = toISODate(yesterday)
  if (dateISO === todayISO) return 'Hoje'
  if (dateISO === yesterdayISO) return 'Ontem'
  const [y, m, d] = dateISO.split('-')
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${parseInt(d)} ${meses[parseInt(m) - 1]} ${y}`
}

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatTime(iso: string): string {
  if (!iso.includes('T')) return ''
  return iso.split('T')[1].slice(0, 5)
}
