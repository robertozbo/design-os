import { useState } from 'react'
import type { Disciplina, Modalidade, Treinamento } from '@/../product/sections/treinamentos/types'
import { MODALIDADE_LABEL, formatHoras, somaDisciplinas } from './helpers'

const NORMAS = ['NR-1', 'NR-5', 'NR-6', 'NR-10', 'NR-11', 'NR-12', 'NR-17', 'NR-18', 'NR-20', 'NR-33', 'NR-35']

interface TreinamentoDrawerProps {
  onClose: () => void
  onSave?: (treinamento: Omit<Treinamento, 'id'>) => void
}

export function TreinamentoDrawer({ onClose, onSave }: TreinamentoDrawerProps) {
  const [nome, setNome] = useState('')
  const [norma, setNorma] = useState('NR-35')
  const [modalidade, setModalidade] = useState<Modalidade>('presencial')
  const [cargaHoraria, setCargaHoraria] = useState('')
  const [validade, setValidade] = useState('')
  const [descricao, setDescricao] = useState('')
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([{ titulo: '', horas: 0 }])

  const carga = Number(cargaHoraria) || 0
  const soma = somaDisciplinas(disciplinas)
  const somaDiverge = carga > 0 && soma > 0 && soma !== carga
  const valido = nome.trim().length > 0 && carga > 0

  const updateDisciplina = (i: number, patch: Partial<Disciplina>) =>
    setDisciplinas((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)))

  const inputCls =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'
  const labelCls = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400'

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-[540px] flex-col bg-white shadow-2xl dark:bg-slate-900 max-sm:max-w-full">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Novo treinamento</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Curso do catálogo oferecido aos empregadores</p>
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

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <div>
            <label className={labelCls}>Nome do treinamento</label>
            <input className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex. Trabalho em Altura" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Norma relacionada</label>
              <select className={inputCls} value={norma} onChange={(e) => setNorma(e.target.value)}>
                {NORMAS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Modalidade</label>
              <select className={inputCls} value={modalidade} onChange={(e) => setModalidade(e.target.value as Modalidade)}>
                {(Object.keys(MODALIDADE_LABEL) as Modalidade[]).map((m) => (
                  <option key={m} value={m}>{MODALIDADE_LABEL[m]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Carga horária (horas)</label>
              <input className={inputCls} type="number" min={1} value={cargaHoraria} onChange={(e) => setCargaHoraria(e.target.value)} placeholder="8" />
            </div>
            <div>
              <label className={labelCls}>Validade / reciclagem (meses)</label>
              <input className={inputCls} type="number" min={0} value={validade} onChange={(e) => setValidade(e.target.value)} placeholder="24 · vazio = não expira" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Descrição / conteúdo</label>
            <textarea
              className={`${inputCls} min-h-[84px] resize-y`}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Objetivo do curso, público-alvo e o que a capacitação cobre"
            />
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label className={`${labelCls} mb-0`}>Conteúdo programático</label>
              <span
                className={`text-xs tabular-nums ${
                  somaDiverge ? 'font-medium text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Soma: {formatHoras(soma)}{carga > 0 ? ` / ${formatHoras(carga)}` : ''}
              </span>
            </div>
            <div className="space-y-2">
              {disciplinas.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 shrink-0 text-right font-mono text-xs text-slate-400 tabular-nums">{i + 1}.</span>
                  <input
                    className={`${inputCls} min-w-0 flex-1`}
                    value={d.titulo}
                    onChange={(e) => updateDisciplina(i, { titulo: e.target.value })}
                    placeholder="Título da disciplina"
                  />
                  <input
                    className="w-20 shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-right text-sm text-slate-900 tabular-nums placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                    type="number"
                    min={0}
                    step={0.5}
                    value={d.horas || ''}
                    onChange={(e) => updateDisciplina(i, { horas: Number(e.target.value) })}
                    placeholder="h"
                  />
                  <button
                    onClick={() => setDisciplinas((prev) => prev.filter((_, idx) => idx !== i))}
                    disabled={disciplinas.length === 1}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-30 dark:hover:bg-rose-950"
                    aria-label="Remover disciplina"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" d="M19 7l-.9 12.1A2 2 0 0116.1 21H7.9a2 2 0 01-2-1.9L5 7m5 4v6m4-6v6M4 7h16M9 7V4h6v3" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setDisciplinas((prev) => [...prev, { titulo: '', horas: 0 }])}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M12 5v14m-7-7h14" />
              </svg>
              Adicionar disciplina
            </button>
            {somaDiverge && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                A soma das disciplinas ({formatHoras(soma)}) difere da carga horária declarada ({formatHoras(carga)}).
              </p>
            )}
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
                norma,
                modalidade,
                cargaHorariaHoras: carga,
                validadeMeses: validade ? Number(validade) : null,
                descricao: descricao.trim(),
                conteudoProgramatico: disciplinas.filter((d) => d.titulo.trim()),
                ativo: true,
              })
              onClose()
            }}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Salvar treinamento
          </button>
        </footer>
      </aside>
    </div>
  )
}
