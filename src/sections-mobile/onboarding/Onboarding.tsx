import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  User,
  Cake,
  Scale,
  Ruler,
  Target,
  Activity,
  Droplet,
  HeartPulse,
  Moon,
  Bot,
  Camera,
  FileText,
  Watch,
  Smartphone,
  Apple,
  Send,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────

type Cor = 'teal' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet' | 'orange'

interface SelectOption {
  id: string
  label: string
  emoji?: string
}

interface BaseQuestion {
  id: string
  pergunta: string
  icon: LucideIcon
  cor: Cor
}

interface TextQuestion extends BaseQuestion {
  tipo: 'text'
  placeholder: string
}

interface NumberQuestion extends BaseQuestion {
  tipo: 'number'
  unidade: string
  min: number
  max: number
  placeholder: string
}

interface SelectQuestion extends BaseQuestion {
  tipo: 'select'
  options: SelectOption[]
}

interface ImageQuestion extends BaseQuestion {
  tipo: 'image'
  hint: string
  opcional: boolean
}

interface DeviceQuestion extends BaseQuestion {
  tipo: 'device'
  hint: string
  opcional: boolean
}

type Question = TextQuestion | NumberQuestion | SelectQuestion | ImageQuestion | DeviceQuestion

interface ResponseValue {
  raw: string
  display: string
}

const QUESTIONS: Question[] = [
  { id: 'nome', pergunta: 'Qual é o seu nome completo?', icon: User, cor: 'teal', tipo: 'text', placeholder: 'João Silva' },
  { id: 'idade', pergunta: 'Quantos anos você tem?', icon: Cake, cor: 'rose', tipo: 'number', unidade: 'anos', min: 12, max: 100, placeholder: '35' },
  { id: 'peso', pergunta: 'Qual o seu peso atual?', icon: Scale, cor: 'emerald', tipo: 'number', unidade: 'kg', min: 30, max: 250, placeholder: '78' },
  { id: 'altura', pergunta: 'Qual a sua altura?', icon: Ruler, cor: 'sky', tipo: 'number', unidade: 'cm', min: 100, max: 230, placeholder: '178' },
  {
    id: 'sexo',
    pergunta: 'Qual seu sexo biológico? Uso isso pra benchmarks por idade+sexo (OMS, ACSM).',
    icon: User,
    cor: 'violet',
    tipo: 'select',
    options: [
      { id: 'masculino', label: 'Masculino' },
      { id: 'feminino', label: 'Feminino' },
      { id: 'intersexo', label: 'Intersexo' },
      { id: 'nao_informar', label: 'Prefiro não informar' },
    ],
  },
  {
    id: 'objetivo',
    pergunta: 'Qual seu objetivo principal por aqui?',
    icon: Target,
    cor: 'teal',
    tipo: 'select',
    options: [
      { id: 'emagrecimento', label: 'Emagrecer', emoji: '📉' },
      { id: 'hipertrofia', label: 'Ganhar massa', emoji: '💪' },
      { id: 'manutencao', label: 'Manter peso', emoji: '⚖️' },
      { id: 'performance', label: 'Performance', emoji: '🚀' },
      { id: 'saude', label: 'Saúde geral', emoji: '❤️' },
    ],
  },
  {
    id: 'atividade',
    pergunta: 'Como descreveria seu nível de atividade física?',
    icon: Activity,
    cor: 'amber',
    tipo: 'select',
    options: [
      { id: 'sedentario', label: 'Sedentário', emoji: '🛋️' },
      { id: 'leve', label: '1-2x por semana', emoji: '🚶' },
      { id: 'moderado', label: '3-4x por semana', emoji: '🏃' },
      { id: 'intenso', label: '5+ vezes por semana', emoji: '🏋️' },
    ],
  },
  {
    id: 'pressao',
    pergunta: 'Você sabe sua pressão arterial em geral?',
    icon: HeartPulse,
    cor: 'rose',
    tipo: 'select',
    options: [
      { id: 'baixa', label: 'Baixa (<90/60)' },
      { id: 'normal', label: 'Normal (~120/80)' },
      { id: 'alta', label: 'Alta (>140/90)' },
      { id: 'nao_sei', label: 'Não sei dizer' },
    ],
  },
  {
    id: 'agua',
    pergunta: 'Quantos litros de água você bebe por dia?',
    icon: Droplet,
    cor: 'sky',
    tipo: 'select',
    options: [
      { id: 'menos_1', label: 'Menos de 1L', emoji: '💧' },
      { id: '1_2', label: 'Entre 1L e 2L', emoji: '💧💧' },
      { id: '2_3', label: 'Entre 2L e 3L', emoji: '💧💧💧' },
      { id: 'mais_3', label: 'Mais de 3L', emoji: '🌊' },
    ],
  },
  {
    id: 'sono',
    pergunta: 'Em média, quantas horas você dorme por noite?',
    icon: Moon,
    cor: 'violet',
    tipo: 'select',
    options: [
      { id: 'menos_5', label: 'Menos de 5h' },
      { id: '5_6', label: '5h a 6h' },
      { id: '6_7', label: '6h a 7h' },
      { id: '7_8', label: '7h a 8h' },
      { id: 'mais_8', label: 'Mais de 8h' },
    ],
  },
  { id: 'bioimpedancia', pergunta: 'Tem alguma bioimpedância recente? Posso extrair as métricas pra você.', icon: Activity, cor: 'emerald', tipo: 'image', hint: 'Foto ou PDF do relatório', opcional: true },
  { id: 'exame', pergunta: 'E exames laboratoriais? Posso ler hemograma, lipidograma, glicemia.', icon: FileText, cor: 'sky', tipo: 'image', hint: 'PDF ou foto do exame', opcional: true },
  { id: 'fotos_corporais', pergunta: 'Pra acompanhar evolução visual, envia 4 fotos (frontal, posterior, laterais).', icon: Camera, cor: 'rose', tipo: 'image', hint: 'Até 4 fotos', opcional: true },
  { id: 'wearable', pergunta: 'Quer conectar um wearable agora? Sincroniza atividades e sono automaticamente.', icon: Watch, cor: 'amber', tipo: 'device', hint: 'Apple Health ou Health Connect', opcional: true },
]

const COR_BG: Record<Cor, string> = {
  teal: 'bg-teal-500/15 text-teal-300',
  sky: 'bg-sky-500/15 text-sky-300',
  emerald: 'bg-emerald-500/15 text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-300',
  rose: 'bg-rose-500/15 text-rose-300',
  violet: 'bg-violet-500/15 text-violet-300',
  orange: 'bg-orange-500/15 text-orange-300',
}

interface MessageItem {
  id: string
  role: 'assistant' | 'user'
  content: ReactNode
  cor?: Cor
  icon?: LucideIcon
}

export default function OnboardingPreview() {
  const [respostas, setRespostas] = useState<Record<string, ResponseValue>>({})
  const [perguntaIdx, setPerguntaIdx] = useState(0)
  const [digitando, setDigitando] = useState(false)
  const [historico, setHistorico] = useState<MessageItem[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Inicializa o chat
  useEffect(() => {
    if (historico.length > 0) return
    setHistorico([
      makeAssistantMessage('intro-1', 'Oi! Sou o assistente Nymos. 👋'),
      makeAssistantMessage('intro-2', 'Vamos preencher seu perfil em formato de conversa — leva uns 2 minutos.'),
    ])
    setTimeout(() => fazerPergunta(0), 800)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    })
  }, [historico, digitando])

  const fazerPergunta = (idx: number) => {
    if (idx >= QUESTIONS.length) {
      setHistorico((h) => [
        ...h,
        makeAssistantMessage('fim', 'Tudo pronto! Vou organizar suas informações... ✨', 'emerald', Sparkles),
      ])
      setTimeout(() => {
        try {
          sessionStorage.setItem(
            'nymos:onboarding-respostas',
            JSON.stringify(respostasRef.current),
          )
        } catch {
          /* ignore */
        }
        window.location.href = '/mobile/sections/onboarding-completo'
      }, 1400)
      return
    }
    setDigitando(true)
    setTimeout(() => {
      setDigitando(false)
      const q = QUESTIONS[idx]
      setHistorico((h) => [...h, makeAssistantMessage(`q-${q.id}`, q.pergunta, q.cor, q.icon)])
    }, 700)
  }

  const respostasRef = useRef(respostas)
  useEffect(() => {
    respostasRef.current = respostas
  }, [respostas])

  const responder = (display: string, raw: string) => {
    const q = QUESTIONS[perguntaIdx]
    setRespostas((r) => ({ ...r, [q.id]: { raw, display } }))
    setHistorico((h) => [...h, { id: `a-${q.id}`, role: 'user', content: <span>{display}</span> }])
    const next = perguntaIdx + 1
    setPerguntaIdx(next)
    setTimeout(() => fazerPergunta(next), 350)
  }

  const pular = () => {
    const q = QUESTIONS[perguntaIdx]
    setHistorico((h) => [
      ...h,
      { id: `a-${q.id}-skip`, role: 'user', content: <span className="italic opacity-70">Pular</span> },
    ])
    const next = perguntaIdx + 1
    setPerguntaIdx(next)
    setTimeout(() => fazerPergunta(next), 350)
  }

  const perguntaAtual = QUESTIONS[perguntaIdx] ?? null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-mobile],
        [data-nymos-mobile] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-mobile] .font-mono,
        [data-nymos-mobile] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
        [data-nymos-mobile] .no-scrollbar::-webkit-scrollbar { display: none; }
        [data-nymos-mobile] .no-scrollbar { scrollbar-width: none; }
      `}</style>
      <div data-nymos-mobile="true" className="min-h-full bg-slate-950 flex flex-col">
        <div className="px-4 pt-4 pb-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center text-white shrink-0">
              <Bot size={18} strokeWidth={2.4} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-slate-100 font-semibold text-[13.5px]">Assistente Nymos</div>
              <div className="text-emerald-400 text-[10.5px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {perguntaIdx < QUESTIONS.length ? `${perguntaIdx} de ${QUESTIONS.length} respondidas` : 'Concluído'}
              </div>
            </div>
          </div>
          <div className="mt-3 h-1 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-sky-400 transition-all duration-500"
              style={{ width: `${(perguntaIdx / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar">
          {historico.map((msg) => (
            <ChatBubble key={msg.id} msg={msg} />
          ))}
          {digitando && <DigitandoBubble />}
          <div ref={bottomRef} />
        </div>

        <div className="px-4 py-3 border-t border-slate-900 bg-slate-950 shrink-0">
          {perguntaAtual && !digitando ? (
            <ResponseInput question={perguntaAtual} onResponder={responder} onPular={pular} />
          ) : (
            <div className="h-12" />
          )}
        </div>
      </div>
    </>
  )
}

function makeAssistantMessage(id: string, texto: string, cor: Cor = 'teal', icon: LucideIcon = Bot): MessageItem {
  return { id, role: 'assistant', content: texto, cor, icon }
}

function ChatBubble({ msg }: { msg: MessageItem }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] px-3.5 py-2.5 rounded-2xl bg-teal-500/15 text-teal-100 text-[13px] leading-snug rounded-br-md">
          {msg.content}
        </div>
      </div>
    )
  }
  const Icon = msg.icon ?? Bot
  const corCls = msg.cor ? COR_BG[msg.cor] : COR_BG.teal
  return (
    <div className="flex justify-start gap-2">
      <div className={`w-7 h-7 rounded-lg ${corCls} flex items-center justify-center shrink-0`}>
        <Icon size={13} strokeWidth={2.4} />
      </div>
      <div className="max-w-[78%] px-3.5 py-2.5 rounded-2xl bg-slate-900 text-slate-100 text-[13px] leading-snug border border-slate-800 rounded-bl-md">
        {msg.content}
      </div>
    </div>
  )
}

function DigitandoBubble() {
  return (
    <div className="flex justify-start gap-2">
      <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-300 flex items-center justify-center shrink-0">
        <Bot size={13} strokeWidth={2.4} />
      </div>
      <div className="px-3.5 py-3 rounded-2xl bg-slate-900 border border-slate-800 rounded-bl-md flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '160ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '320ms' }} />
      </div>
    </div>
  )
}

interface ResponseInputProps {
  question: Question
  onResponder: (display: string, raw: string) => void
  onPular: () => void
}

function ResponseInput({ question, onResponder, onPular }: ResponseInputProps) {
  if (question.tipo === 'text') return <TextResponseInput q={question} onResponder={onResponder} />
  if (question.tipo === 'number') return <NumberResponseInput q={question} onResponder={onResponder} />
  if (question.tipo === 'select') return <SelectResponseInput q={question} onResponder={onResponder} />
  if (question.tipo === 'image') return <ImageResponseInput q={question} onResponder={onResponder} onPular={onPular} />
  return <DeviceResponseInput q={question} onResponder={onResponder} onPular={onPular} />
}

function TextResponseInput({ q, onResponder }: { q: TextQuestion; onResponder: (d: string, r: string) => void }) {
  const [valor, setValor] = useState('')
  const submit = () => {
    if (valor.trim().length < 2) return
    onResponder(valor.trim(), valor.trim())
  }
  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder={q.placeholder}
        className="flex-1 h-11 px-3.5 rounded-full bg-slate-900 border border-slate-800 focus:border-slate-600 text-slate-100 text-[13px] outline-none placeholder:text-slate-700"
      />
      <button
        onClick={submit}
        disabled={valor.trim().length < 2}
        className="w-11 h-11 rounded-full bg-gradient-to-r from-teal-500 to-sky-500 text-white flex items-center justify-center disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600"
      >
        <Send size={15} strokeWidth={2.4} />
      </button>
    </div>
  )
}

function NumberResponseInput({ q, onResponder }: { q: NumberQuestion; onResponder: (d: string, r: string) => void }) {
  const [valor, setValor] = useState('')
  const num = Number(valor)
  const valido = !!valor && num >= q.min && num <= q.max
  const submit = () => {
    if (!valido) return
    onResponder(`${num} ${q.unidade}`, String(num))
  }
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2 h-11 px-3.5 rounded-full bg-slate-900 border border-slate-800 focus-within:border-slate-600">
        <input
          autoFocus
          type="number"
          inputMode="numeric"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={q.placeholder}
          className="flex-1 bg-transparent text-slate-100 text-[13px] font-mono tabular-nums outline-none placeholder:text-slate-700"
        />
        <span className="text-slate-500 text-[12px]">{q.unidade}</span>
      </div>
      <button
        onClick={submit}
        disabled={!valido}
        className="w-11 h-11 rounded-full bg-gradient-to-r from-teal-500 to-sky-500 text-white flex items-center justify-center disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600"
      >
        <Send size={15} strokeWidth={2.4} />
      </button>
    </div>
  )
}

function SelectResponseInput({ q, onResponder }: { q: SelectQuestion; onResponder: (d: string, r: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto no-scrollbar pb-1">
      {q.options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onResponder(opt.label, opt.id)}
          className="px-3.5 h-9 rounded-full text-[12px] font-semibold border bg-slate-900 text-slate-200 border-slate-800 hover:border-teal-500/40 hover:text-teal-300 active:scale-[0.97] transition-all flex items-center gap-1.5"
        >
          {opt.emoji && <span>{opt.emoji}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function ImageResponseInput({ q, onResponder, onPular }: { q: ImageQuestion; onResponder: (d: string, r: string) => void; onPular: () => void }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onResponder('Foto enviada 📸', 'foto-mock')}
          className="h-11 rounded-full bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-slate-200 text-[12.5px] font-semibold flex items-center justify-center gap-2"
        >
          <Camera size={14} strokeWidth={2.2} />
          Câmera
        </button>
        <button
          onClick={() => onResponder('Arquivo enviado 📎', 'arquivo-mock')}
          className="h-11 rounded-full bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-slate-200 text-[12.5px] font-semibold flex items-center justify-center gap-2"
        >
          <FileText size={14} strokeWidth={2.2} />
          Galeria
        </button>
      </div>
      {q.opcional && (
        <button onClick={onPular} className="w-full h-9 text-slate-500 hover:text-slate-300 text-[11.5px] font-medium">
          Pular essa pergunta
        </button>
      )}
    </div>
  )
}

function DeviceResponseInput({ q, onResponder, onPular }: { q: DeviceQuestion; onResponder: (d: string, r: string) => void; onPular: () => void }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onResponder('Apple Health 🍎', 'apple_health')}
          className="h-11 rounded-full bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-slate-200 text-[12.5px] font-semibold flex items-center justify-center gap-2"
        >
          <Apple size={14} strokeWidth={2.2} />
          Apple Health
        </button>
        <button
          onClick={() => onResponder('Health Connect 📱', 'health_connect')}
          className="h-11 rounded-full bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-slate-200 text-[12.5px] font-semibold flex items-center justify-center gap-2"
        >
          <Smartphone size={14} strokeWidth={2.2} />
          Health Connect
        </button>
      </div>
      {q.opcional && (
        <button onClick={onPular} className="w-full h-9 text-slate-500 hover:text-slate-300 text-[11.5px] font-medium">
          Conectar depois
        </button>
      )}
    </div>
  )
}
