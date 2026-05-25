import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Send, Sparkles, Bot, Plus } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const SUGGESTIONS = [
  'Como melhorar minha qualidade do sono?',
  'Analisar minha glicemia da semana',
  'Sugerir treino de hoje',
  'Resumo dos meus exames',
]

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    role: 'assistant',
    text:
      'Oi Roberto! 👋 Sou o assistente Nymos. Posso analisar seus dados, comparar tendências e sugerir ações. Em que posso ajudar?',
  },
]

interface ChatIAFullscreenProps {
  onClose: () => void
}

export function ChatIAFullscreen({ onClose }: ChatIAFullscreenProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    })
  }, [messages])

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text:
            'Analisando seus dados dos últimos 7 dias... Identifiquei 3 pontos relevantes. Quer que eu detalhe?',
        },
      ])
    }, 700)
  }

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col" data-nymos-mobile="true">
      <div className="h-12 shrink-0" />

      <div className="px-4 h-[60px] shrink-0 flex items-center gap-3 border-b border-slate-900">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-200 hover:text-white"
          aria-label="Voltar"
        >
          <ArrowLeft size={18} strokeWidth={2.2} />
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center text-white">
          <Bot size={17} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-semibold text-[14px] leading-tight">Nymos IA</div>
          <div className="text-emerald-400 text-[10.5px] leading-tight flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Online
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {messages.length === 1 && (
          <div className="pt-2">
            <div className="text-slate-500 text-[10.5px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles size={10} strokeWidth={2.4} />
              Sugestões
            </div>
            <div className="space-y-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-[12.5px]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 px-3 pt-2 pb-4 border-t border-slate-900 bg-slate-950">
        <div className="flex items-center gap-2">
          <button
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white shrink-0"
            aria-label="Anexar"
          >
            <Plus size={18} strokeWidth={2.2} />
          </button>
          <div className="flex-1 flex items-center gap-2 px-3.5 h-11 rounded-full bg-slate-900 border border-slate-800 focus-within:border-slate-600">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage(input)
              }}
              placeholder="Pergunte sobre seus dados..."
              className="flex-1 bg-transparent text-slate-100 text-[13px] outline-none placeholder:text-slate-600"
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center text-white disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 shrink-0"
            aria-label="Enviar"
          >
            <Send size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center text-white shrink-0">
          <Bot size={14} strokeWidth={2.2} />
        </div>
      )}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-snug ${
          isUser
            ? 'bg-teal-500/15 text-teal-100 rounded-br-md'
            : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-md'
        }`}
      >
        {message.text}
      </div>
    </div>
  )
}
