import { useEffect, useRef, useState } from 'react'
import {
  Archive,
  ChevronLeft,
  CircleCheck,
  CircleCheckBig,
  MoreHorizontal,
  Paperclip,
  Send,
  Stethoscope,
  UserCog,
  Users,
} from 'lucide-react'
import type {
  Canal,
  Mensagem,
  MensagensProps,
  Thread,
} from '@/../product-clinico/sections/mensagens/types'

const CANAL_LABEL: Record<Canal, string> = {
  clinico: 'Clínico',
  admin: 'Admin',
}

function formatRelativo(iso: string): string {
  const d = new Date(iso)
  const hoje = new Date()
  const diff = Math.floor((hoje.getTime() - d.getTime()) / 1000 / 60)
  if (diff < 1) return 'agora'
  if (diff < 60) return `${diff}min`
  if (diff < 60 * 24) return `${Math.floor(diff / 60)}h`
  if (diff < 60 * 24 * 7) return `${Math.floor(diff / (60 * 24))}d`
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function formatDataAgrupada(iso: string): string {
  const d = new Date(iso)
  const hoje = new Date()
  const ontem = new Date(hoje.getTime() - 24 * 60 * 60 * 1000)
  if (d.toDateString() === hoje.toDateString()) return 'Hoje'
  if (d.toDateString() === ontem.toDateString()) return 'Ontem'
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: hoje.getFullYear() !== d.getFullYear() ? 'numeric' : undefined,
  })
}

function formatHora(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function agruparPorDia(mensagens: Mensagem[]) {
  const grupos: { dia: string; itens: Mensagem[] }[] = []
  let diaAtual = ''
  for (const m of mensagens) {
    const d = formatDataAgrupada(m.enviadaEm)
    if (d !== diaAtual) {
      grupos.push({ dia: d, itens: [m] })
      diaAtual = d
    } else {
      grupos[grupos.length - 1].itens.push(m)
    }
  }
  return grupos
}

export function MensagensInbox({
  threads,
  threadAtiva,
  canalAtivo,
  persona,
  contadores,
  onTrocarCanal,
  onAbrirThread,
  onFecharThread,
  onEnviarMensagem,
  onArquivarThread,
  onAbrirPaciente,
}: MensagensProps) {
  const [rascunho, setRascunho] = useState('')
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll pra última mensagem ao abrir thread
  useEffect(() => {
    if (!threadAtiva) return
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    })
  }, [threadAtiva?.id, threadAtiva?.mensagens.length])

  const enviar = () => {
    const texto = rascunho.trim()
    if (!texto) return
    onEnviarMensagem?.(texto)
    setRascunho('')
    composerRef.current?.focus()
  }

  // Auto-resize composer
  useEffect(() => {
    const el = composerRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [rascunho])

  const podeVerClinico = persona === 'medico'
  const threadsFiltradas = threads.filter((t) => {
    if (canalAtivo === 'arquivadas') return t.status === 'arquivada'
    if (canalAtivo === 'clinico') return t.canal === 'clinico' && t.status === 'ativa'
    return t.canal === 'admin' && t.status === 'ativa'
  })

  return (
    <div
      data-clinico-mensagens
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Mensagens</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {persona === 'medico'
              ? 'Canal clínico (com você) e admin (secretária) — separados por LGPD'
              : 'Canal admin com pacientes — agendamento, cobrança, dúvidas operacionais'}
          </p>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          className="mb-4 flex gap-1 border-b border-slate-200 dark:border-slate-800"
        >
          {podeVerClinico && (
            <TabButton
              ativo={canalAtivo === 'clinico'}
              onClick={() => onTrocarCanal?.('clinico')}
              icon={Stethoscope}
              label="Clínico"
              count={contadores.clinico}
              tone="teal"
            />
          )}
          <TabButton
            ativo={canalAtivo === 'admin'}
            onClick={() => onTrocarCanal?.('admin')}
            icon={UserCog}
            label="Admin"
            count={contadores.admin}
            tone="slate"
          />
          <TabButton
            ativo={canalAtivo === 'arquivadas'}
            onClick={() => onTrocarCanal?.('arquivadas')}
            icon={Archive}
            label="Arquivadas"
            count={contadores.arquivadas}
            tone="slate"
            mutedCount
          />
        </div>

        {/* Body 2-cols */}
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-4 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Lista */}
          <div
            className={`
              rounded-xl border border-slate-200 dark:border-slate-800
              bg-white dark:bg-slate-900 overflow-y-auto
              ${threadAtiva ? 'hidden md:block' : 'block'}
            `}
          >
            {threadsFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Nenhuma conversa neste canal
                </p>
              </div>
            ) : (
              <ul>
                {threadsFiltradas.map((t) => (
                  <ThreadListItem
                    key={t.id}
                    thread={t}
                    ativo={threadAtiva?.id === t.id}
                    onClick={() => onAbrirThread?.(t.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Conversa */}
          <div
            className={`
              rounded-xl border border-slate-200 dark:border-slate-800
              bg-white dark:bg-slate-900 flex flex-col overflow-hidden
              ${threadAtiva ? 'flex' : 'hidden md:flex'}
            `}
          >
            {!threadAtiva ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 text-sm text-slate-500 dark:text-slate-400">
                <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" strokeWidth={1.5} />
                Selecione uma conversa pra abrir
              </div>
            ) : (
              <>
                {/* Header da conversa */}
                <div className="shrink-0 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3">
                  <button
                    onClick={onFecharThread}
                    className="md:hidden p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Voltar"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <Avatar iniciais={threadAtiva.paciente.iniciais} canal={threadAtiva.canal} />
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => onAbrirPaciente?.(threadAtiva.paciente.id)}
                      className="text-sm font-semibold hover:underline truncate text-left"
                    >
                      {threadAtiva.paciente.nome}
                    </button>
                    {threadAtiva.canal === 'clinico' &&
                      threadAtiva.paciente.condicoesCronicas &&
                      threadAtiva.paciente.condicoesCronicas.length > 0 && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {threadAtiva.paciente.condicoesCronicas.join(' · ')}
                        </div>
                      )}
                  </div>
                  <button
                    onClick={() => onArquivarThread?.(threadAtiva.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Arquivar"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Arquivar</span>
                  </button>
                  <button
                    className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Mais"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Mensagens */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {agruparPorDia(threadAtiva.mensagens).map((grupo) => (
                    <div key={grupo.dia}>
                      <div className="flex items-center justify-center my-3">
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800/60">
                          {grupo.dia}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {grupo.itens.map((m) => (
                          <MensagemBubble key={m.id} m={m} canal={threadAtiva.canal} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Composer */}
                <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 p-3">
                  <div className="flex items-end gap-2">
                    {threadAtiva.canal === 'clinico' && (
                      <button
                        className="shrink-0 p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Anexar arquivo (foto/PDF)"
                        aria-label="Anexar"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                    )}
                    <textarea
                      ref={composerRef}
                      rows={1}
                      value={rascunho}
                      onChange={(e) => setRascunho(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          enviar()
                        }
                        if (e.key === 'Escape') setRascunho('')
                      }}
                      placeholder={
                        threadAtiva.canal === 'clinico'
                          ? 'Mensagem clínica · sem SLA'
                          : 'Mensagem administrativa'
                      }
                      className="
                        flex-1 resize-none rounded-md border border-slate-200 dark:border-slate-700
                        bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-sm
                        focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500
                      "
                    />
                    <button
                      onClick={enviar}
                      disabled={!rascunho.trim()}
                      className="
                        shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium
                        bg-teal-600 text-white hover:bg-teal-500
                        disabled:bg-slate-200 disabled:text-slate-400
                        dark:disabled:bg-slate-800 dark:disabled:text-slate-600
                      "
                    >
                      <Send className="w-3.5 h-3.5" />
                      Enviar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TabButton({
  ativo,
  onClick,
  icon: Icon,
  label,
  count,
  tone,
  mutedCount,
}: {
  ativo: boolean
  onClick?: () => void
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  count: number
  tone: 'teal' | 'slate'
  mutedCount?: boolean
}) {
  return (
    <button
      role="tab"
      aria-selected={ativo}
      onClick={onClick}
      className={`
        relative inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors
        ${
          ativo
            ? tone === 'teal'
              ? 'text-teal-700 dark:text-teal-300'
              : 'text-slate-900 dark:text-slate-100'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
        }
      `}
    >
      <Icon className="w-4 h-4" strokeWidth={1.75} />
      {label}
      {count > 0 && (
        <span
          className={`
            ml-1 inline-flex items-center justify-center rounded-full px-1.5 text-[10px] font-mono tabular-nums min-w-[18px]
            ${
              mutedCount
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                : tone === 'teal'
                  ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
            }
          `}
        >
          {count}
        </span>
      )}
      {ativo && (
        <span
          className={`
            absolute inset-x-2 -bottom-px h-0.5 rounded-full
            ${tone === 'teal' ? 'bg-teal-600 dark:bg-teal-400' : 'bg-slate-700 dark:bg-slate-300'}
          `}
        />
      )}
    </button>
  )
}

function ThreadListItem({
  thread,
  ativo,
  onClick,
}: {
  thread: Thread
  ativo?: boolean
  onClick?: () => void
}) {
  const preview =
    thread.ultimaMensagem.autor === 'sistema'
      ? `• ${thread.ultimaMensagem.conteudo}`
      : thread.ultimaMensagem.conteudo

  return (
    <li>
      <button
        onClick={onClick}
        className={`
          w-full flex items-start gap-3 px-3 py-3 text-left border-b border-slate-100 dark:border-slate-800 last:border-b-0
          relative transition-colors
          ${
            ativo
              ? 'bg-teal-50 dark:bg-teal-950/30'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
          }
        `}
      >
        {ativo && (
          <span
            className="absolute left-0 top-0 bottom-0 w-0.5 bg-teal-500"
            aria-hidden
          />
        )}
        <Avatar iniciais={thread.paciente.iniciais} canal={thread.canal} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium truncate">
              {thread.paciente.nome}
            </span>
            <span className="ml-auto shrink-0 text-[10px] font-mono text-slate-400 dark:text-slate-500">
              {formatRelativo(thread.ultimaMensagem.enviadaEm)}
            </span>
          </div>
          <p
            className={`
              mt-0.5 text-xs leading-snug line-clamp-2
              ${thread.naoLidas > 0 ? 'text-slate-900 dark:text-slate-100 font-medium' : 'text-slate-500 dark:text-slate-400'}
            `}
          >
            {preview}
          </p>
        </div>
        {thread.naoLidas > 0 && (
          <span className="shrink-0 ml-1 inline-flex items-center justify-center rounded-full bg-teal-600 text-white text-[10px] font-semibold min-w-[18px] h-[18px] px-1">
            {thread.naoLidas}
          </span>
        )}
      </button>
    </li>
  )
}

function Avatar({ iniciais, canal }: { iniciais: string; canal: Canal }) {
  const cor =
    canal === 'clinico'
      ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300'
      : 'bg-slate-300/40 text-slate-700 dark:text-slate-200'
  return (
    <div
      className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${cor}`}
    >
      {iniciais}
    </div>
  )
}

function MensagemBubble({ m, canal }: { m: Mensagem; canal: Canal }) {
  if (m.autor === 'sistema') {
    return (
      <div className="flex justify-center">
        <div className="max-w-[80%] rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2 text-[12px] text-slate-600 dark:text-slate-300 italic">
          {m.conteudo}
          <span className="ml-2 text-[10px] font-mono text-slate-400 dark:text-slate-500 not-italic">
            {formatHora(m.enviadaEm)}
          </span>
        </div>
      </div>
    )
  }

  const meu = m.autor === 'medico' || m.autor === 'secretaria'

  return (
    <div className={`flex ${meu ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[78%] ${meu ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`
            rounded-2xl px-3.5 py-2 text-sm leading-snug
            ${
              meu
                ? canal === 'clinico'
                  ? 'bg-teal-600 text-white rounded-br-sm'
                  : 'bg-slate-700 text-white rounded-br-sm dark:bg-slate-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm'
            }
          `}
        >
          {m.conteudo}
        </div>
        <div className="mt-1 px-1 flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
          {formatHora(m.enviadaEm)}
          {meu && m.status === 'entregue' && (
            <CircleCheckBig className="w-3 h-3 text-teal-500" strokeWidth={2} />
          )}
          {meu && m.status === 'enviada' && (
            <CircleCheck className="w-3 h-3" strokeWidth={2} />
          )}
        </div>
      </div>
    </div>
  )
}
