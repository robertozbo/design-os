import { useState } from 'react'
import {
  ArrowLeft,
  FileText,
  Lock,
  Search,
  Send,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import type { Canal, Mensagem, Thread } from '@/../product-clinic/sections/mensagens/types'

interface Props {
  canal: Canal
  threads: Thread[]
  threadAtiva: Thread | null
  busca: string
  onCanal: (c: Canal) => void
  onBusca: (v: string) => void
  onSelecionar: (id: string) => void
  onVoltar: () => void
  onEnviar: (texto: string) => void
  onAbrirProntuario: (t: Thread) => void
}

export function MensagensView({
  canal,
  threads,
  threadAtiva,
  busca,
  onCanal,
  onBusca,
  onSelecionar,
  onVoltar,
  onEnviar,
  onAbrirProntuario,
}: Props) {
  const termo = busca.trim().toLowerCase()
  const lista = threads.filter((t) => !termo || t.paciente.nome.toLowerCase().includes(termo))
  const totalNaoLidas = threads.reduce((s, t) => s + t.naoLidas, 0)

  return (
    <div className="flex h-full flex-col">
      {/* Abas de canal */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5 pl-16 lg:pl-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-1">
          <CanalTab ativo={canal === 'clinico'} onClick={() => onCanal('clinico')} badge={totalNaoLidas}>
            <Stethoscope className="h-3.5 w-3.5" /> Clínico
          </CanalTab>
          <CanalTab ativo={canal === 'admin'} onClick={() => onCanal('admin')} locked>
            <Lock className="h-3.5 w-3.5" /> Admin
          </CanalTab>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
          <ShieldCheck className="h-3 w-3" /> Canais isolados (LGPD)
        </span>
      </div>

      {canal === 'admin' ? (
        <AdminBloqueado />
      ) : (
        <div className="flex min-h-0 flex-1">
          {/* Lista de threads */}
          <div
            className={`w-full shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 lg:flex lg:w-80 ${
              threadAtiva ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div className="border-b border-slate-100 p-3 dark:border-slate-800">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={busca}
                  onChange={(e) => onBusca(e.target.value)}
                  placeholder="Buscar paciente…"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>
            </div>
            <ul className="flex-1 overflow-y-auto">
              {lista.map((t) => (
                <ThreadItem
                  key={t.id}
                  thread={t}
                  ativo={threadAtiva?.id === t.id}
                  onClick={() => onSelecionar(t.id)}
                />
              ))}
            </ul>
            {/* Rodapé — fecha a coluna */}
            <div className="border-t border-slate-200 px-3 py-2.5 text-[11px] text-slate-400 dark:border-slate-800">
              {lista.length} conversa{lista.length === 1 ? '' : 's'}
              {totalNaoLidas > 0 && ` · ${totalNaoLidas} não lida${totalNaoLidas === 1 ? '' : 's'}`}
            </div>
          </div>

          {/* Conversa */}
          <div className={`min-w-0 flex-1 flex-col ${threadAtiva ? 'flex' : 'hidden lg:flex'}`}>
            {threadAtiva ? (
              <Conversa
                thread={threadAtiva}
                onVoltar={onVoltar}
                onEnviar={onEnviar}
                onAbrirProntuario={() => onAbrirProntuario(threadAtiva)}
              />
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-slate-400">
                Selecione uma conversa para começar.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function CanalTab({
  ativo,
  onClick,
  badge,
  locked,
  children,
}: {
  ativo: boolean
  onClick: () => void
  badge?: number
  locked?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
        ativo
          ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
          : locked
            ? 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
      }`}
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="rounded-full bg-teal-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </button>
  )
}

function ThreadItem({
  thread,
  ativo,
  onClick,
}: {
  thread: Thread
  ativo: boolean
  onClick: () => void
}) {
  const ultima = thread.mensagens[thread.mensagens.length - 1]
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex w-full items-start gap-3 border-b border-slate-100 p-3 text-left transition-colors dark:border-slate-800/60 ${
          ativo ? 'bg-teal-50/60 dark:bg-teal-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          {thread.paciente.iniciais}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`truncate text-sm ${
                thread.naoLidas > 0
                  ? 'font-semibold text-slate-900 dark:text-slate-50'
                  : 'font-medium text-slate-700 dark:text-slate-200'
              }`}
            >
              {thread.paciente.nome}
            </span>
            <span className="shrink-0 text-[10px] text-slate-400">{thread.ultimaEm}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`truncate text-[11px] ${
                thread.naoLidas > 0
                  ? 'text-slate-600 dark:text-slate-300'
                  : 'text-slate-400'
              }`}
            >
              {ultima.autor === 'profissional' && 'Você: '}
              {ultima.texto}
            </span>
            {thread.naoLidas > 0 && (
              <span className="ml-auto shrink-0 rounded-full bg-teal-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {thread.naoLidas}
              </span>
            )}
          </div>
        </div>
      </button>
    </li>
  )
}

function Conversa({
  thread,
  onVoltar,
  onEnviar,
  onAbrirProntuario,
}: {
  thread: Thread
  onVoltar: () => void
  onEnviar: (texto: string) => void
  onAbrirProntuario: () => void
}) {
  const [texto, setTexto] = useState('')

  const enviar = () => {
    if (!texto.trim()) return
    onEnviar(texto.trim())
    setTexto('')
  }

  // Agrupa mensagens por dia
  const grupos: { dia: string; itens: Mensagem[] }[] = []
  for (const m of thread.mensagens) {
    const ultimo = grupos[grupos.length - 1]
    if (ultimo && ultimo.dia === m.dia) ultimo.itens.push(m)
    else grupos.push({ dia: m.dia, itens: [m] })
  }

  return (
    <>
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950">
        <button
          onClick={onVoltar}
          className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          {thread.paciente.iniciais}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
            {thread.paciente.nome}
          </div>
          <div className="truncate text-[11px] text-slate-400">
            {thread.paciente.idade}a · {thread.paciente.condicoesCronicas.join(', ')}
          </div>
        </div>
        <button
          onClick={onAbrirProntuario}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-teal-500 hover:text-teal-700 dark:border-slate-700 dark:text-slate-300 dark:hover:text-teal-300"
        >
          <FileText className="h-3.5 w-3.5" /> Prontuário
        </button>
      </div>

      {/* Mensagens */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-4 dark:bg-slate-950/30">
        {grupos.map((g) => (
          <div key={g.dia}>
            <div className="mb-3 flex justify-center">
              <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {g.dia}
              </span>
            </div>
            <div className="space-y-2">
              {g.itens.map((m) => (
                <Bolha key={m.id} m={m} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-end gap-2">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                enviar()
              }
            }}
            rows={1}
            placeholder="Escreva uma resposta…"
            className="max-h-28 flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <button
            onClick={enviar}
            disabled={!texto.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Enviar"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1.5 px-1 text-[10px] text-slate-400">
          Respostas do canal clínico ficam registradas no histórico do paciente.
        </p>
      </div>
    </>
  )
}

function Bolha({ m }: { m: Mensagem }) {
  const meu = m.autor === 'profissional'
  return (
    <div className={`flex ${meu ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          meu
            ? 'rounded-br-sm bg-teal-500 text-white'
            : 'rounded-bl-sm bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200'
        }`}
      >
        <p>{m.texto}</p>
        <div className={`mt-0.5 text-[10px] ${meu ? 'text-teal-50/80' : 'text-slate-400'}`}>
          {m.hora}
        </div>
      </div>
    </div>
  )
}

function AdminBloqueado() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
          <Lock className="h-6 w-6" />
        </span>
        <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Canal administrativo
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          As conversas entre paciente e recepção (agendamento, cobrança, documentos) ficam neste
          canal. Por separação de dados (LGPD), o médico não acessa o canal admin — assim como a
          recepção não vê o canal clínico.
        </p>
      </div>
    </div>
  )
}
