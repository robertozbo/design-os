import { useState } from 'react'
import { Plus, Check, X } from 'lucide-react'
import type { NotaDiario } from '@/../product-personal/sections/inicio/types'

interface DiarioBlockProps {
  diario: NotaDiario[]
  onAddNota?: (texto: string) => void
  onToggleNota?: (notaId: string) => void
  onRemoveNota?: (notaId: string) => void
}

export function DiarioBlock({
  diario,
  onAddNota,
  onToggleNota,
  onRemoveNota,
}: DiarioBlockProps) {
  const [novaNota, setNovaNota] = useState('')

  const handleAdd = () => {
    if (!novaNota.trim()) return
    onAddNota?.(novaNota.trim())
    setNovaNota('')
  }

  const pendentes = diario.filter((n) => !n.feita).length

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Diário do dia
        </p>
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <span className="tabular-nums text-slate-900 dark:text-slate-50">
            {pendentes}
          </span>{' '}
          pendente{pendentes === 1 ? '' : 's'}
        </span>
      </header>

      {/* Notes list */}
      <ul className="mt-3 space-y-1.5">
        {diario.map((n) => (
          <NotaRow
            key={n.id}
            nota={n}
            onToggle={() => onToggleNota?.(n.id)}
            onRemove={() => onRemoveNota?.(n.id)}
          />
        ))}
      </ul>

      {diario.length === 0 && (
        <p className="mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/40 px-3 py-4 text-center text-[12px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
          Sem notas hoje
        </p>
      )}

      {/* Input */}
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white pl-3 pr-1 py-1 transition-colors focus-within:border-teal-400 dark:border-slate-800 dark:bg-slate-900 dark:focus-within:border-teal-600">
        <input
          type="text"
          value={novaNota}
          onChange={(e) => setNovaNota(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd()
          }}
          placeholder="Anotar lembrete…"
          className="flex-1 border-none bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-50 dark:placeholder:text-slate-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!novaNota.trim()}
          aria-label="Adicionar nota"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    </article>
  )
}

function NotaRow({
  nota,
  onToggle,
  onRemove,
}: {
  nota: NotaDiario
  onToggle?: () => void
  onRemove?: () => void
}) {
  const time = new Date(nota.criadoEm).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <li
      className={`group flex items-start gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={nota.feita ? 'Marcar como pendente' : 'Marcar como feita'}
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
          nota.feita
            ? 'border-teal-500 bg-teal-500 text-white'
            : 'border-slate-300 hover:border-teal-400 dark:border-slate-700'
        }`}
      >
        {nota.feita && <Check size={10} strokeWidth={3} />}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[12px] leading-snug ${
            nota.feita
              ? 'text-slate-400 line-through dark:text-slate-500'
              : 'text-slate-700 dark:text-slate-200'
          }`}
        >
          {nota.texto}
        </p>
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {time}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Excluir nota"
        className="opacity-0 transition-opacity hover:text-rose-500 group-hover:opacity-100 dark:hover:text-rose-400"
      >
        <X size={12} />
      </button>
    </li>
  )
}
