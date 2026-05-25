import { useState } from 'react'
import { Lock, Send, Plus, X } from 'lucide-react'
import type { Aluno } from '@/../product-personal/sections/alunos/types'

interface FichaMensagensTabProps {
  aluno: Aluno
  onSendMessage?: (texto: string) => void
  onAddNotaPrivada?: (texto: string) => void
  onRemoveNotaPrivada?: (id: string) => void
}

export function FichaMensagensTab({
  aluno,
  onSendMessage,
  onAddNotaPrivada,
  onRemoveNotaPrivada,
}: FichaMensagensTabProps) {
  const [novaMsg, setNovaMsg] = useState('')
  const [novaNota, setNovaNota] = useState('')

  const mensagens = aluno.mensagens ?? []
  const notas = aluno.anotacoesPrivadas ?? []

  const handleSend = () => {
    if (!novaMsg.trim()) return
    onSendMessage?.(novaMsg.trim())
    setNovaMsg('')
  }

  const handleAddNota = () => {
    if (!novaNota.trim()) return
    onAddNotaPrivada?.(novaNota.trim())
    setNovaNota('')
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* Conversa */}
      <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:col-span-2 lg:h-[600px]">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Conversa com {aluno.nome.split(' ')[0]}
          </p>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 bg-gradient-to-b from-slate-50/40 to-transparent dark:from-slate-900/40">
          {mensagens.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
              Sem mensagens ainda. Envie a primeira!
            </p>
          ) : (
            mensagens.map((m) => (
              <Bubble key={m.id} mensagem={m} alunoNome={aluno.nome} />
            ))
          )}
        </div>

        <div className="border-t border-slate-100 p-3 dark:border-slate-800">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white pl-3 pr-1 py-1 transition-colors focus-within:border-teal-400 dark:border-slate-800 dark:bg-slate-900 dark:focus-within:border-teal-600">
            <input
              type="text"
              value={novaMsg}
              onChange={(e) => setNovaMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend()
              }}
              placeholder={`Mensagem para ${aluno.nome.split(' ')[0]}…`}
              className="flex-1 border-none bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-50 dark:placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!novaMsg.trim()}
              aria-label="Enviar"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Send size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </article>

      {/* Anotações privadas */}
      <article className="flex flex-col overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/30 dark:border-amber-900/50 dark:bg-amber-900/10 lg:h-[600px]">
        <header className="flex items-center gap-2 border-b border-amber-200/60 px-5 py-3.5 dark:border-amber-900/40">
          <Lock size={12} className="text-amber-700 dark:text-amber-400" />
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-800 dark:text-amber-300">
            Anotações privadas
          </p>
        </header>

        <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
          {notas.length === 0 ? (
            <p className="py-8 text-center text-[12px] text-amber-700/70 dark:text-amber-300/60">
              Notas só visíveis pra você. Use pra registrar percepções, contexto, lembretes.
            </p>
          ) : (
            notas.map((n) => (
              <NotaCard
                key={n.id}
                nota={n}
                onRemove={() => onRemoveNotaPrivada?.(n.id)}
              />
            ))
          )}
        </div>

        <div className="border-t border-amber-200/60 p-3 dark:border-amber-900/40">
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-white pl-3 pr-1 py-1.5 transition-colors focus-within:border-amber-400 dark:border-amber-900/50 dark:bg-slate-900 dark:focus-within:border-amber-600">
            <textarea
              rows={2}
              value={novaNota}
              onChange={(e) => setNovaNota(e.target.value)}
              placeholder="Nova anotação privada…"
              className="flex-1 resize-none border-none bg-transparent text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-50 dark:placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={handleAddNota}
              disabled={!novaNota.trim()}
              aria-label="Adicionar nota"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus size={13} strokeWidth={2.5} />
            </button>
          </div>
          <p className="mt-1.5 px-1 font-mono text-[9px] uppercase tracking-wider text-amber-700/60 dark:text-amber-300/60">
            <Lock size={8} className="mb-0.5 mr-0.5 inline-block" />
            Não compartilhada com aluno
          </p>
        </div>
      </article>
    </div>
  )
}

function Bubble({
  mensagem,
  alunoNome,
}: {
  mensagem: { autor: 'personal' | 'aluno'; texto: string; timestamp: string; lida?: boolean }
  alunoNome: string
}) {
  const isPersonal = mensagem.autor === 'personal'
  const time = new Date(mensagem.timestamp).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`flex flex-col ${isPersonal ? 'items-end' : 'items-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2 ${
          isPersonal
            ? 'bg-teal-600 text-white dark:bg-teal-500'
            : 'bg-white text-slate-900 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700'
        }`}
      >
        <p className="text-[13px] leading-relaxed">{mensagem.texto}</p>
      </div>
      <p className="mt-1 px-1 font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {isPersonal ? 'Você' : alunoNome.split(' ')[0]} · {time}
        {isPersonal && mensagem.lida && (
          <span className="ml-1 text-teal-500 dark:text-teal-400">· lida</span>
        )}
      </p>
    </div>
  )
}

function NotaCard({
  nota,
  onRemove,
}: {
  nota: { id: string; texto: string; criadoEm: string }
  onRemove?: () => void
}) {
  const time = new Date(nota.criadoEm).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="group relative rounded-xl border border-amber-200 bg-white p-3 dark:border-amber-900/50 dark:bg-slate-900">
      <p className="text-[12px] leading-snug text-slate-700 dark:text-slate-200">
        {nota.texto}
      </p>
      <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-amber-700/70 dark:text-amber-400/70">
        {time}
      </p>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Excluir nota"
        className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-amber-700/40 opacity-0 transition-opacity hover:bg-amber-50 hover:text-rose-500 group-hover:opacity-100 dark:text-amber-400/40 dark:hover:bg-amber-900/30"
      >
        <X size={11} />
      </button>
    </div>
  )
}
