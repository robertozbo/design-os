import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Clock,
  Pause,
  Play,
  X,
  Sparkles,
  Check,
  AlertTriangle,
  Brain,
  Activity,
  Hand,
  Wind,
  Anchor,
  Target,
  Eye,
  Heart,
  Network,
  FileText,
  Plus,
  type LucideIcon,
} from 'lucide-react'
import type {
  AbordagemTerapeutica,
  CategoriaTecnica,
  ModoAnotacao,
  RiscoNivel,
  ScoreInstrumento,
  SessaoProps,
  SoapFields,
  Tecnica,
} from '@/../product-psicologo/sections/sessao/types'
import { IaInsightsPanel } from './IaInsightsPanel'

const ABORDAGEM_VISUAL: Record<
  AbordagemTerapeutica,
  { label: string; cor: 'teal' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet' }
> = {
  tcc: { label: 'TCC', cor: 'teal' },
  act: { label: 'ACT', cor: 'sky' },
  mindfulness: { label: 'Mindfulness', cor: 'emerald' },
  emdr: { label: 'EMDR', cor: 'rose' },
  humanista: { label: 'Humanista', cor: 'amber' },
  psicodinamica: { label: 'Psicodinâmica', cor: 'violet' },
  sistemica: { label: 'Sistêmica', cor: 'sky' },
  cgi: { label: 'CGI', cor: 'violet' },
}

const CATEGORIA_ICON: Record<CategoriaTecnica, LucideIcon> = {
  cognitiva: Brain,
  comportamental: Activity,
  experiencial: Heart,
  corporal: Hand,
  narrativa: FileText,
}

const COR_BG: Record<'teal' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet', string> = {
  teal: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  sky: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
}

const RISCO_VISUAL: Record<RiscoNivel, { label: string; cls: string; descricao: string }> = {
  0: { label: 'Sem risco', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', descricao: 'Nenhum sinal preocupante' },
  1: { label: 'Risco baixo', cls: 'bg-teal-500/15 text-teal-300 border-teal-500/30', descricao: 'Monitorar evolução' },
  2: { label: 'Risco moderado', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30', descricao: 'Aumentar frequência ou avaliar encaminhamento' },
  3: { label: 'Risco crítico', cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30', descricao: 'Acionar protocolo · CVV 188 se necessário' },
}

const SEVERIDADE_VISUAL: Record<ScoreInstrumento['severidade'], { label: string; cls: string }> = {
  minima: { label: 'Mínima', cls: 'bg-emerald-500/15 text-emerald-300' },
  leve: { label: 'Leve', cls: 'bg-teal-500/15 text-teal-300' },
  moderada: { label: 'Moderada', cls: 'bg-amber-500/15 text-amber-300' },
  moderada_severa: { label: 'Mod. severa', cls: 'bg-orange-500/15 text-orange-300' },
  severa: { label: 'Severa', cls: 'bg-rose-500/15 text-rose-300' },
}

function formatTimer(secs: number): string {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

// ─────────────────────────────────────────────────────────────────────────────
// Chips de "quick-insert" para os campos SOAP
// ─────────────────────────────────────────────────────────────────────────────

type SoapField = keyof SoapFields

const QUICK_CHIPS: Record<SoapField, string[]> = {
  subjetivo: ['ansiedade', 'tristeza', 'insônia', 'desmotivação', 'irritabilidade', 'medo'],
  objetivo: ['choro', 'fala lenta', 'agitação', 'afeto embotado', 'evita contato visual', 'tenso'],
  avaliacao: ['episódio depressivo', 'TAG', 'luto', 'burnout', 'estável', 'piora'],
  plano: ['manter frequência', 'homework diário', 'reaplicar PHQ-9', 'encaminhar psiquiatra', 'respiração', 'exposição gradual'],
}

interface ChipGroup {
  categoria: string
  items: string[]
}

const FULL_CHIPS: Record<SoapField, ChipGroup[]> = {
  subjetivo: [
    { categoria: 'Humor/afeto', items: ['apatia', 'vazio', 'culpa', 'solidão', 'choro fácil', 'raiva', 'vergonha', 'desesperança'] },
    { categoria: 'Ansiedade', items: ['preocupação excessiva', 'pânico', 'taquicardia', 'falta de ar', 'tensão muscular', 'ruminação', 'pensamentos catastróficos'] },
    { categoria: 'Sono', items: ['acorda à noite', 'pesadelos', 'dificuldade de iniciar sono', 'sono não reparador', 'hipersonia', 'cansaço ao acordar'] },
    { categoria: 'Cognitivo', items: ['dificuldade de concentração', 'esquecimento', 'pensamento acelerado', 'indecisão', 'brancos mentais'] },
    { categoria: 'Corpo/somático', items: ['dor de cabeça', 'dor no peito', 'tensão no estômago', 'náusea', 'perda de apetite', 'compulsão alimentar'] },
    { categoria: 'Trabalho/rotina', items: ['sobrecarga', 'medo de demissão', 'procrastinação', 'presenteísmo', 'falta de propósito', 'conflito com chefe'] },
    { categoria: 'Relacionamentos', items: ['conflito conjugal', 'ciúme', 'isolamento social', 'sentimento de rejeição', 'luto', 'separação recente'] },
    { categoria: 'Risco', items: ['uso de álcool', 'automedicação', 'ideação suicida', 'autolesão', 'gastos impulsivos'] },
    { categoria: 'Eventos/gatilhos', items: ['mudança de cidade', 'perda de emprego', 'luto recente', 'trauma', 'acidente', 'diagnóstico de doença'] },
    { categoria: 'Recursos', items: ['rede de apoio', 'hobby ativo', 'prática esportiva', 'espiritualidade', 'melhora desde última sessão'] },
  ],
  objetivo: [
    { categoria: 'Postura/motor', items: ['agitação psicomotora', 'lentificação', 'tremores', 'postura curvada', 'rigidez muscular', 'inquietação'] },
    { categoria: 'Discurso', items: ['fala acelerada', 'voz baixa', 'discurso desorganizado', 'mutismo', 'fala repetitiva', 'gagueira'] },
    { categoria: 'Afeto', items: ['lábil', 'congruente', 'irritado', 'choroso', 'apatia visível', 'embotado'] },
    { categoria: 'Contato visual', items: ['olhar fugidio', 'contato adequado', 'olhar fixo', 'pouco engajado', 'evita olhar'] },
    { categoria: 'Cognição visível', items: ['concentração reduzida', 'memória preservada', 'orientado em tempo/espaço', 'pensamento lógico', 'tangencial'] },
    { categoria: 'Aparência', items: ['cuidado preservado', 'descuido pessoal', 'vestuário inadequado', 'higiene preservada', 'fadiga visível'] },
  ],
  avaliacao: [
    { categoria: 'Hipóteses (CID-11)', items: ['episódio depressivo leve', 'episódio depressivo moderado', 'TAG', 'TEPT', 'TOC', 'transtorno bipolar', 'fobia social', 'pânico'] },
    { categoria: 'Contexto', items: ['burnout ocupacional', 'luto complicado', 'crise existencial', 'estresse agudo', 'crise familiar'] },
    { categoria: 'Evolução', items: ['estável', 'piora', 'melhora gradual', 'em remissão', 'aguardando resposta da intervenção'] },
    { categoria: 'Aliança terapêutica', items: ['boa aliança', 'aliança em construção', 'resistência à mudança', 'engajamento alto', 'evitação de temas'] },
    { categoria: 'Risco clínico', items: ['risco baixo', 'risco moderado', 'risco alto · acionar protocolo', 'monitorar ideação'] },
  ],
  plano: [
    { categoria: 'Frequência', items: ['manter semanal', 'aumentar para semanal', 'reduzir para quinzenal', 'sessão extra na semana'] },
    { categoria: 'Técnicas', items: ['reestruturação cognitiva', 'exposição gradual', 'mindfulness diário', 'ativação comportamental', 'registro de pensamentos'] },
    { categoria: 'Homework', items: ['diário de humor', 'tarefa de exposição', 'prática de respiração', 'leitura recomendada', 'registro de sono'] },
    { categoria: 'Instrumentos', items: ['reaplicar PHQ-9 em 4 semanas', 'aplicar GAD-7', 'monitorar com IES-R', 'reaplicar escala de risco'] },
    { categoria: 'Encaminhamento', items: ['encaminhar psiquiatra', 'discutir com médico', 'considerar grupo terapêutico', 'avaliação neuropsicológica'] },
  ],
}

const SEP = ' · '

function insertChip(valor: string, termo: string): string {
  const trimmed = valor.trimEnd()
  if (trimmed.length === 0) return termo
  // Se o usuário estava digitando um pedaço de palavra após o último separador, substitui esse pedaço.
  const lastSepIdx = trimmed.lastIndexOf(SEP)
  const tail = lastSepIdx === -1 ? trimmed : trimmed.slice(lastSepIdx + SEP.length)
  const head = lastSepIdx === -1 ? '' : trimmed.slice(0, lastSepIdx)
  if (tail.length > 0 && tail.length < 30 && !tail.includes(' ')) {
    // Está digitando uma palavra → troca pelo termo
    return head ? `${head}${SEP}${termo}` : termo
  }
  return `${trimmed}${SEP}${termo}`
}

function currentTypingWord(valor: string): string {
  const trimmed = valor.trimEnd()
  if (trimmed.length === 0) return ''
  const lastSepIdx = trimmed.lastIndexOf(SEP)
  const tail = lastSepIdx === -1 ? trimmed : trimmed.slice(lastSepIdx + SEP.length)
  // só consideramos "palavra em digitação" se não tiver espaço e for curtinha
  if (tail.includes(' ') || tail.length === 0 || tail.length > 30) return ''
  return tail
}

export function Sessao({
  data,
  onModoChange,
  onSoapChange,
  onLivreChange,
  onTecnicaToggle,
  onHomeworkChange,
  onRiscoChange,
  onNotasPrivadasChange,
  onPause,
  onAplicarInstrumento,
  onFinalizar,
  onCancelar,
}: SessaoProps) {
  const [pausado, setPausado] = useState(false)
  const [elapsedSec, setElapsedSec] = useState(() => {
    const start = new Date(data.iniciadaEm).getTime()
    return Math.max(0, Math.floor((Date.now() - start) / 1000))
  })

  useEffect(() => {
    if (pausado) return
    const i = setInterval(() => setElapsedSec((s) => s + 1), 1000)
    return () => clearInterval(i)
  }, [pausado])

  const tecnicasSelecionadasObj = data.catalogoTecnicas.filter((t) =>
    data.tecnicasSelecionadas.includes(t.id),
  )

  const togglePause = () => {
    setPausado((v) => !v)
    onPause?.()
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950 px-6 h-[72px] flex items-center gap-4 shrink-0">
        <button
          onClick={onCancelar}
          className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-100"
          title="Sair sem salvar"
        >
          <X size={17} strokeWidth={2.2} />
        </button>

        <PacienteStrip paciente={data.paciente} plano={data.plano} />

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 h-10 rounded-xl bg-slate-900 border border-slate-800">
            <Clock size={14} className="text-slate-500" strokeWidth={2.2} />
            <span className="text-slate-100 text-[15px] font-bold font-mono tabular-nums">
              {formatTimer(elapsedSec)}
            </span>
            {pausado && (
              <span className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">pausado</span>
            )}
          </div>

          <button
            onClick={togglePause}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-300 hover:text-slate-100"
          >
            {pausado ? (
              <Play size={15} strokeWidth={2.4} fill="currentColor" />
            ) : (
              <Pause size={15} strokeWidth={2.4} fill="currentColor" />
            )}
          </button>

          <button
            onClick={onFinalizar}
            className="px-4 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 text-white font-bold text-[12.5px] flex items-center gap-2"
          >
            <Check size={14} strokeWidth={2.4} />
            Finalizar sessão
          </button>
        </div>
      </header>

      {/* Body 3 cols */}
      <div className="flex-1 grid grid-cols-12 gap-4 px-6 py-5 max-w-[1600px] w-full mx-auto">
        {/* Left col: Anotação SOAP */}
        <div className="col-span-8 space-y-4">
          {/* Modo tabs */}
          <div className="flex items-center gap-2">
            <ModoTab label="SOAP" descricao="Subjetivo · Objetivo · Avaliação · Plano" active={data.modo === 'soap'} onClick={() => onModoChange?.('soap')} />
            <ModoTab label="DAP" descricao="Dados · Avaliação · Plano" active={data.modo === 'dap'} onClick={() => onModoChange?.('dap')} />
            <ModoTab label="Texto livre" descricao="Anotação não estruturada" active={data.modo === 'livre'} onClick={() => onModoChange?.('livre')} />
          </div>

          {/* SOAP editor */}
          {data.modo === 'soap' && (
            <div className="space-y-3">
              <SoapPanel campo="subjetivo" label="S — Subjetivo" placeholder="Relato do paciente · queixas · contexto" hint="O que o paciente diz · suas próprias palavras" valor={data.soap.subjetivo} onChange={onSoapChange} cor="teal" />
              <SoapPanel campo="objetivo" label="O — Objetivo" placeholder="Observações clínicas · postura · discurso" hint="O que você observa · sinais clínicos" valor={data.soap.objetivo} onChange={onSoapChange} cor="sky" />
              <SoapPanel campo="avaliacao" label="A — Avaliação" placeholder="Hipótese · análise · diagnóstico funcional" hint="Sua interpretação clínica" valor={data.soap.avaliacao} onChange={onSoapChange} cor="amber" />
              <SoapPanel campo="plano" label="P — Plano" placeholder="Intervenções · próximos passos · homework" hint="O que vai fazer agora e na próxima" valor={data.soap.plano} onChange={onSoapChange} cor="violet" />
            </div>
          )}

          {data.modo === 'livre' && (
            <textarea
              value={data.livre}
              onChange={(e) => onLivreChange?.(e.target.value)}
              placeholder="Anotação livre da sessão..."
              rows={20}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 focus:border-slate-600 text-slate-100 text-[13px] outline-none placeholder:text-slate-700 resize-none leading-relaxed"
            />
          )}

          {data.modo === 'dap' && (
            <div className="rounded-2xl bg-slate-900 border border-dashed border-slate-700 p-8 text-center text-slate-500">
              Modo DAP — 3 painéis (Dados · Avaliação · Plano) seguindo mesma estrutura do SOAP.
            </div>
          )}

          <SessionDivider label="Prescrição e privado" hint="Persistem entre formatos de anotação" />

          {/* Homework */}
          <HomeworkPanel
            homework={data.homework}
            onChange={onHomeworkChange}
          />

          {/* Notas privadas */}
          <details className="rounded-2xl bg-slate-900/40 border border-slate-800 p-3.5">
            <summary className="cursor-pointer text-slate-400 text-[12px] font-semibold flex items-center gap-2">
              <Eye size={12} strokeWidth={2.2} />
              Notas privadas (não vão pro prontuário)
            </summary>
            <textarea
              value={data.notasPrivadas}
              onChange={(e) => onNotasPrivadasChange?.(e.target.value)}
              placeholder="Hipóteses, observações pessoais, próximas linhas de investigação..."
              rows={4}
              className="w-full mt-2.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-slate-600 text-slate-300 text-[12px] outline-none placeholder:text-slate-700 resize-none italic leading-relaxed"
            />
          </details>
        </div>

        {/* Right col: Sidebar */}
        <div className="col-span-4 space-y-4">
          {/* Risco */}
          <RiscoPanel risco={data.risco} onChange={onRiscoChange} />

          {/* Técnicas selecionadas */}
          <TecnicasPanel
            tecnicas={data.catalogoTecnicas}
            selecionadas={data.tecnicasSelecionadas}
            onToggle={onTecnicaToggle}
          />

          {/* Instrumentos recentes */}
          <InstrumentosPanel
            scores={data.paciente.scoresRecentes}
            onAplicar={onAplicarInstrumento}
          />

          {/* IA Insights (V0 Pro tier — mock no protótipo) */}
          <IaInsightsPanel
            soapDraft={data.soap}
            homeworkDraft={data.homework.texto}
            onApplyToSoap={(campo, text) => onSoapChange?.(campo, text)}
            onApplyToHomework={(text) => onHomeworkChange?.('texto', text)}
          />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function PacienteStrip({ paciente, plano }: { paciente: SessaoProps['data']['paciente']; plano: SessaoProps['data']['plano'] }) {
  const abordVis = ABORDAGEM_VISUAL[plano.abordagem]
  return (
    <div className="flex items-center gap-3 min-w-0">
      {paciente.fotoUrl ? (
        <img src={paciente.fotoUrl} alt={paciente.nomeCompleto} className="w-10 h-10 rounded-2xl object-cover" />
      ) : (
        <div className="w-10 h-10 rounded-2xl bg-violet-500/20 text-violet-200 flex items-center justify-center font-bold text-[16px] shrink-0">
          {paciente.inicial}
        </div>
      )}
      <div className="min-w-0">
        <div className="text-slate-50 font-bold text-[14px] leading-tight truncate">{paciente.nomeCompleto}</div>
        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
          <span>{paciente.idade}a</span>
          <span className="text-slate-700">·</span>
          <span className="truncate">{plano.nome}</span>
          <span className="text-slate-700">·</span>
          <span className={`px-1.5 py-0.5 rounded ${COR_BG[abordVis.cor]} text-[9px] font-bold uppercase tracking-wider`}>
            {abordVis.label}
          </span>
          <span className="text-slate-600 font-mono tabular-nums">
            {plano.sessaoAtual}/{plano.totalSessoes}
          </span>
        </div>
      </div>
    </div>
  )
}

interface ModoTabProps {
  label: string
  descricao: string
  active: boolean
  onClick: () => void
}

function ModoTab({ label, descricao, active, onClick }: ModoTabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl border text-left transition-colors ${
        active
          ? 'bg-violet-500/10 border-violet-500/40 ring-1 ring-violet-500/20'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className={`text-[12px] font-bold ${active ? 'text-violet-300' : 'text-slate-200'}`}>{label}</div>
      <div className="text-[10px] text-slate-500 mt-0.5">{descricao}</div>
    </button>
  )
}

function SessionDivider({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="flex flex-col">
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {hint && (
          <span className="text-[10px] text-slate-500 leading-snug">
            {hint}
          </span>
        )}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent" />
    </div>
  )
}

interface SoapPanelProps {
  campo: keyof SoapFields
  label: string
  placeholder: string
  hint: string
  valor: string
  cor: 'teal' | 'sky' | 'amber' | 'violet'
  onChange?: (campo: keyof SoapFields, valor: string) => void
}

function SoapPanel({ campo, label, placeholder, hint, valor, cor, onChange }: SoapPanelProps) {
  const handleChipInsert = (termo: string) => {
    onChange?.(campo, insertChip(valor, termo))
  }
  return (
    <div className={`rounded-2xl bg-slate-900 border ${COR_BG[cor].split(' ')[2]} p-3.5`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className={`${COR_BG[cor].split(' ')[1]} text-[11px] font-bold uppercase tracking-wider`}>
            {label}
          </span>
          <span className="text-slate-500 text-[10.5px] ml-2">{hint}</span>
        </div>
        <span className="text-slate-600 text-[10px] font-mono tabular-nums">{valor.length} chars</span>
      </div>
      <textarea
        value={valor}
        onChange={(e) => onChange?.(campo, e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800/60 focus:border-slate-600 text-slate-100 text-[12.5px] outline-none placeholder:text-slate-700 resize-none leading-relaxed"
      />
      <ChipBar campo={campo} valor={valor} cor={cor} onInsert={handleChipInsert} />
    </div>
  )
}

interface ChipBarProps {
  campo: SoapField
  valor: string
  cor: 'teal' | 'sky' | 'amber' | 'violet'
  onInsert: (termo: string) => void
}

function ChipBar({ campo, valor, cor, onInsert }: ChipBarProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [openUp, setOpenUp] = useState(false)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!popoverOpen) return
    const onClick = (e: MouseEvent) => {
      if (!popoverRef.current?.contains(e.target as Node)) setPopoverOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [popoverOpen])

  useLayoutEffect(() => {
    if (!popoverOpen || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const POPOVER_MAX = 380
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    setOpenUp(spaceBelow < POPOVER_MAX && spaceAbove > spaceBelow)
  }, [popoverOpen])

  const typing = currentTypingWord(valor).toLowerCase()
  const allTerms = FULL_CHIPS[campo].flatMap((g) => g.items)
  const suggestions = typing.length >= 2
    ? Array.from(new Set(allTerms.filter((t) => t.toLowerCase().includes(typing)))).slice(0, 8)
    : null

  const chipsToShow = suggestions ?? QUICK_CHIPS[campo]
  const chipColorCls = COR_BG[cor]

  return (
    <div ref={containerRef} className="mt-2 flex flex-wrap items-center gap-1.5 relative">
      {suggestions && (
        <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 mr-0.5">Sugerido</span>
      )}
      {chipsToShow.map((termo) => (
        <button
          key={termo}
          onClick={() => onInsert(termo)}
          className={`px-2 h-6 rounded-full text-[10.5px] font-medium border transition-colors ${
            suggestions
              ? `${chipColorCls} hover:brightness-110`
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700'
          }`}
        >
          {termo}
        </button>
      ))}
      <button
        onClick={() => setPopoverOpen((v) => !v)}
        className="px-1.5 h-6 rounded-full bg-slate-950 border border-slate-800 text-slate-500 hover:text-slate-100 hover:border-slate-700 flex items-center gap-0.5 text-[10.5px] font-medium"
        title="Ver todas as sugestões"
      >
        <Plus size={11} strokeWidth={2.4} />
        {!suggestions && <span>mais</span>}
      </button>

      {popoverOpen && (
        <div
          ref={popoverRef}
          className={`absolute z-30 left-0 w-[420px] max-h-[360px] overflow-y-auto rounded-2xl bg-slate-950 border border-slate-700 shadow-2xl shadow-black/40 p-3 space-y-2.5 ${
            openUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
        >
          {FULL_CHIPS[campo].map((grupo) => (
            <div key={grupo.categoria}>
              <div className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {grupo.categoria}
              </div>
              <div className="flex flex-wrap gap-1">
                {grupo.items.map((termo) => (
                  <button
                    key={termo}
                    onClick={() => {
                      onInsert(termo)
                      setPopoverOpen(false)
                    }}
                    className="px-2 h-6 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-slate-50 text-[10.5px] font-medium"
                  >
                    {termo}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function HomeworkPanel({
  homework,
  onChange,
}: {
  homework: SessaoProps['data']['homework']
  onChange?: SessaoProps['onHomeworkChange']
}) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-300 flex items-center justify-center">
          <Target size={13} strokeWidth={2.4} />
        </div>
        <div>
          <div className="text-slate-100 font-semibold text-[12.5px]">Homework</div>
          <div className="text-slate-500 text-[10px]">Tarefa pra paciente entre sessões</div>
        </div>
      </div>
      <textarea
        value={homework.texto}
        onChange={(e) => onChange?.('texto', e.target.value)}
        placeholder="Descreva a tarefa que o paciente vai realizar..."
        rows={3}
        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800/60 focus:border-slate-600 text-slate-100 text-[12.5px] outline-none placeholder:text-slate-700 resize-none leading-relaxed"
      />
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        {homework.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-medium">
            #{tag}
          </span>
        ))}
        {homework.prazoEm && (
          <span className="ml-auto text-slate-500 text-[10.5px] font-mono tabular-nums">
            Prazo: {homework.prazoEm.split('-').reverse().slice(0, 2).join('/')}
          </span>
        )}
      </div>
    </div>
  )
}

function RiscoPanel({ risco, onChange }: { risco: RiscoNivel; onChange?: (r: RiscoNivel) => void }) {
  const v = RISCO_VISUAL[risco]
  return (
    <div className={`rounded-2xl border ${v.cls.split(' ')[2]} bg-slate-900 p-3.5`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg ${v.cls.split(' ').slice(0, 2).join(' ')} flex items-center justify-center`}>
          <AlertTriangle size={13} strokeWidth={2.4} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-semibold text-[12.5px]">Avaliação de risco</div>
          <div className={`text-[10.5px] ${v.cls.split(' ')[1]} font-semibold`}>{v.label}</div>
        </div>
      </div>
      <div className="flex gap-1.5 mb-2">
        {([0, 1, 2, 3] as RiscoNivel[]).map((n) => {
          const active = risco === n
          const visual = RISCO_VISUAL[n]
          return (
            <button
              key={n}
              onClick={() => onChange?.(n)}
              className={`flex-1 h-8 rounded-lg text-[11px] font-bold border transition-colors ${
                active ? visual.cls : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-200'
              }`}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="text-slate-400 text-[10.5px] leading-snug">{v.descricao}</div>
      {risco === 3 && (
        <div className="mt-2 rounded-lg bg-rose-500/10 border border-rose-500/30 px-2.5 py-2">
          <div className="text-rose-200 text-[10.5px] font-semibold">Protocolo de crise:</div>
          <ul className="text-rose-200/80 text-[10px] mt-1 space-y-0.5">
            <li>• Avaliar ideação suicida + plano</li>
            <li>• Contato emergência: 192 / CVV 188</li>
            <li>• Encaminhar pra psiquiatria</li>
            <li>• Notificar contato de confiança</li>
          </ul>
        </div>
      )}
    </div>
  )
}

interface TecnicasPanelProps {
  tecnicas: Tecnica[]
  selecionadas: string[]
  onToggle?: (id: string) => void
}

function TecnicasPanel({ tecnicas, selecionadas, onToggle }: TecnicasPanelProps) {
  const [filtroAbordagem, setFiltroAbordagem] = useState<AbordagemTerapeutica | null>(null)
  const filtradas = filtroAbordagem ? tecnicas.filter((t) => t.abordagem === filtroAbordagem) : tecnicas
  const abordagens = Array.from(new Set(tecnicas.map((t) => t.abordagem))) as AbordagemTerapeutica[]

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/15 text-violet-300 flex items-center justify-center">
            <Sparkles size={13} strokeWidth={2.4} />
          </div>
          <div>
            <div className="text-slate-100 font-semibold text-[12.5px]">Técnicas usadas</div>
            <div className="text-slate-500 text-[10px]">{selecionadas.length} selecionada{selecionadas.length === 1 ? '' : 's'}</div>
          </div>
        </div>
      </div>

      {/* Filtro por abordagem */}
      <div className="flex gap-1 mb-2.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setFiltroAbordagem(null)}
          className={`px-2.5 h-7 rounded-full text-[10.5px] font-semibold whitespace-nowrap shrink-0 ${
            filtroAbordagem === null ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          Todas
        </button>
        {abordagens.map((a) => {
          const v = ABORDAGEM_VISUAL[a]
          const active = filtroAbordagem === a
          return (
            <button
              key={a}
              onClick={() => setFiltroAbordagem(a === filtroAbordagem ? null : a)}
              className={`px-2.5 h-7 rounded-full text-[10.5px] font-semibold whitespace-nowrap shrink-0 ${
                active ? COR_BG[v.cor] : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {v.label}
            </button>
          )
        })}
      </div>

      <div className="space-y-1.5 max-h-[320px] overflow-y-auto no-scrollbar">
        {filtradas.map((t) => {
          const Icon = CATEGORIA_ICON[t.categoria] ?? Sparkles
          const ativo = selecionadas.includes(t.id)
          const v = ABORDAGEM_VISUAL[t.abordagem]
          return (
            <button
              key={t.id}
              onClick={() => onToggle?.(t.id)}
              className={`w-full p-2.5 rounded-xl flex items-start gap-2.5 text-left transition-colors ${
                ativo
                  ? 'bg-violet-500/10 border border-violet-500/40'
                  : 'bg-slate-950/40 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg ${COR_BG[v.cor]} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon size={12} strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[11.5px] font-semibold ${ativo ? 'text-violet-200' : 'text-slate-200'}`}>
                    {t.nome}
                  </span>
                  <span className={`px-1 py-0.5 rounded ${COR_BG[v.cor]} text-[8.5px] font-bold uppercase`}>
                    {v.label}
                  </span>
                </div>
                <div className={`text-[10px] mt-0.5 leading-snug ${ativo ? 'text-violet-200/70' : 'text-slate-500'}`}>
                  {t.descricao}
                </div>
              </div>
              {ativo && (
                <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center text-white shrink-0 mt-1">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function InstrumentosPanel({ scores, onAplicar }: { scores: ScoreInstrumento[]; onAplicar?: () => void }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-300 flex items-center justify-center">
            <Anchor size={13} strokeWidth={2.4} />
          </div>
          <div>
            <div className="text-slate-100 font-semibold text-[12.5px]">Instrumentos recentes</div>
            <div className="text-slate-500 text-[10px]">{scores.length} aplicações</div>
          </div>
        </div>
        <button
          onClick={onAplicar}
          className="px-2.5 h-7 rounded-md bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-[10.5px] font-semibold flex items-center gap-1"
        >
          <Wind size={11} strokeWidth={2.4} />
          Aplicar
        </button>
      </div>
      <div className="space-y-1.5">
        {scores.map((s) => {
          const v = SEVERIDADE_VISUAL[s.severidade]
          return (
            <div key={s.instrumento} className="rounded-lg bg-slate-950/40 border border-slate-800/60 px-3 py-2 flex items-center gap-2">
              <div>
                <div className="text-slate-500 text-[9.5px] font-semibold uppercase tracking-wider">{s.instrumento}</div>
                <div className="text-slate-100 text-[15px] font-bold font-mono tabular-nums leading-none mt-0.5">
                  {s.valor}
                </div>
              </div>
              <span className={`ml-auto px-1.5 py-0.5 rounded ${v.cls} text-[9.5px] font-bold`}>{v.label}</span>
              <span className="text-slate-600 text-[9.5px] font-mono tabular-nums shrink-0">
                {s.aplicadoEm.split('-').reverse().slice(0, 2).join('/')}
              </span>
            </div>
          )
        })}
        {scores.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-800 p-3 text-center text-slate-500 text-[10.5px]">
            Nenhum instrumento aplicado. Use "Aplicar" pra começar.
          </div>
        )}
      </div>
    </div>
  )
}
