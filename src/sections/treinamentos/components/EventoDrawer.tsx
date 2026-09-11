import { useState } from 'react'
import type { Empregador, NovoEventoInput } from '@/../product/sections/treinamentos/types'

interface EventoDrawerProps {
  empregadores: Empregador[]
  onClose: () => void
  onSave?: (input: NovoEventoInput) => void
}

export function EventoDrawer({ empregadores, onClose, onSave }: EventoDrawerProps) {
  const [nome, setNome] = useState('')
  const [empregadorId, setEmpregadorId] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [local, setLocal] = useState('')
  const [descricao, setDescricao] = useState('')

  const valido = nome.trim().length > 0 && empregadorId && dataInicio

  const inputCls =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'
  const labelCls = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400'

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl dark:bg-slate-900 max-sm:max-w-full">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Novo evento</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ocasião de treinamento na empresa — as turmas são montadas dentro dele
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Fechar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <label className={labelCls}>Nome do evento</label>
            <input
              className={inputCls}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex. SIPAT 2026, Integração de segurança, Campanha de EPIs"
            />
          </div>

          <div>
            <label className={labelCls}>Empregador</label>
            <select className={inputCls} value={empregadorId} onChange={(e) => setEmpregadorId(e.target.value)}>
              <option value="">Selecione a empresa…</option>
              {empregadores.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.razaoSocial} — {e.cnpj}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Todas as turmas do evento herdam esta empresa — os alunos vêm do quadro dela.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Data de início</label>
              <input className={inputCls} type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Data de término</label>
              <input className={inputCls} type="date" value={dataFim} min={dataInicio || undefined} onChange={(e) => setDataFim(e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Local</label>
            <input className={inputCls} value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Unidade, sala ou EAD" />
          </div>

          <div>
            <label className={labelCls}>Descrição</label>
            <textarea
              className={`${inputCls} min-h-[84px] resize-y`}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Objetivo do evento e como as turmas se distribuem no período"
            />
          </div>

          <div className="rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-3 text-xs leading-relaxed text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
            Depois de salvar, abra o evento e clique em <span className="font-semibold">Nova turma</span> — empresa,
            período e local já vêm preenchidos; você só escolhe o curso e marca os alunos.
          </div>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            disabled={!valido}
            onClick={() => {
              onSave?.({
                nome: nome.trim(),
                empregadorId,
                dataInicio,
                dataFim: dataFim || dataInicio,
                local: local.trim(),
                descricao: descricao.trim(),
              })
              onClose()
            }}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Criar evento
          </button>
        </footer>
      </aside>
    </div>
  )
}
