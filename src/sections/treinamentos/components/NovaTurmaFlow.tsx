import { useMemo, useState } from 'react'
import type {
  Empregador,
  NovaTurmaInput,
  TipoTurma,
  Trabalhador,
  Treinamento,
} from '@/../product/sections/treinamentos/types'
import { TIPO_TURMA_LABEL, formatHoras } from './helpers'

interface NovaTurmaFlowProps {
  treinamentos: Treinamento[]
  empregadores: Empregador[]
  trabalhadores: Trabalhador[]
  /** Pré-seleção quando o fluxo abre a partir do detalhe de um curso */
  treinamentoInicialId?: string | null
  onClose: () => void
  onCreate?: (input: NovaTurmaInput) => void
}

export function NovaTurmaFlow({
  treinamentos,
  empregadores,
  trabalhadores,
  treinamentoInicialId,
  onClose,
  onCreate,
}: NovaTurmaFlowProps) {
  const [etapa, setEtapa] = useState<1 | 2>(1)
  const [treinamentoId, setTreinamentoId] = useState(treinamentoInicialId ?? '')
  const [tipo, setTipo] = useState<TipoTurma>('formacao_inicial')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [instrutor, setInstrutor] = useState('')
  const [local, setLocal] = useState('')
  const [empregadorId, setEmpregadorId] = useState('')
  const [busca, setBusca] = useState('')
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set())

  const treinamento = treinamentos.find((t) => t.id === treinamentoId)
  const empregador = empregadores.find((e) => e.id === empregadorId)

  const candidatos = useMemo(
    () => trabalhadores.filter((t) => t.empregadorId === empregadorId),
    [trabalhadores, empregadorId],
  )
  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return candidatos
    return candidatos.filter(
      (t) => t.nome.toLowerCase().includes(q) || t.matricula.toLowerCase().includes(q),
    )
  }, [candidatos, busca])

  const porSetor = useMemo(() => {
    const map = new Map<string, Trabalhador[]>()
    for (const t of filtrados) {
      const list = map.get(t.setor) ?? []
      list.push(t)
      map.set(t.setor, list)
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [filtrados])

  const etapa1Valida = treinamentoId && empregadorId && dataInicio && (dataFim || dataInicio)

  const toggle = (id: string) =>
    setSelecionados((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleSetor = (membros: Trabalhador[]) =>
    setSelecionados((prev) => {
      const next = new Set(prev)
      const todosMarcados = membros.every((m) => next.has(m.id))
      membros.forEach((m) => (todosMarcados ? next.delete(m.id) : next.add(m.id)))
      return next
    })

  const inputCls =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'
  const labelCls = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400'

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-[600px] flex-col bg-white shadow-2xl dark:bg-slate-900 max-sm:max-w-full">
        <header className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Nova turma</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              aria-label="Fechar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-3 flex items-center gap-3">
            {[1, 2].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    etapa >= n
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                  }`}
                >
                  {n}
                </span>
                <span
                  className={`text-xs font-medium ${
                    etapa >= n ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {n === 1 ? 'Dados da turma' : 'Selecionar alunos'}
                </span>
                {n === 1 && <div className="h-px w-8 bg-slate-200 dark:bg-slate-700" />}
              </div>
            ))}
          </div>
        </header>

        {etapa === 1 ? (
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div>
              <label className={labelCls}>Treinamento</label>
              <select className={inputCls} value={treinamentoId} onChange={(e) => setTreinamentoId(e.target.value)}>
                <option value="">Selecione um curso do catálogo…</option>
                {treinamentos.filter((t) => t.ativo).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.norma} · {t.nome} ({formatHoras(t.cargaHorariaHoras)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Tipo</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(TIPO_TURMA_LABEL) as TipoTurma[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTipo(t)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      tipo === t
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {TIPO_TURMA_LABEL[t]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Data de início</label>
                <input className={inputCls} type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Data de término</label>
                <input className={inputCls} type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
              <div>
                <label className={labelCls}>Instrutor</label>
                <input className={inputCls} value={instrutor} onChange={(e) => setInstrutor(e.target.value)} placeholder="Nome do instrutor" />
              </div>
              <div>
                <label className={labelCls}>Local</label>
                <input className={inputCls} value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Sala, unidade ou EAD" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Empregador</label>
              <select
                className={inputCls}
                value={empregadorId}
                onChange={(e) => {
                  setEmpregadorId(e.target.value)
                  setSelecionados(new Set())
                }}
              >
                <option value="">Selecione a empresa…</option>
                {empregadores.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.razaoSocial} — {e.cnpj}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Na próxima etapa a lista de funcionários dessa empresa será carregada para você marcar a turma.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-3 dark:border-slate-800">
              <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">
                Funcionários de <span className="font-semibold text-slate-900 dark:text-slate-100">{empregador?.razaoSocial}</span>
              </p>
              <input
                className={inputCls}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou matrícula…"
              />
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {candidatos.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Nenhum trabalhador cadastrado nesta empresa</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Cadastre os funcionários na seção Trabalhadores antes de montar a turma.</p>
                </div>
              ) : (
                porSetor.map(([setor, membros]) => {
                  const todosMarcados = membros.every((m) => selecionados.has(m.id))
                  return (
                    <div key={setor} className="mb-4">
                      <div className="mb-1.5 flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{setor}</h3>
                        <button
                          onClick={() => toggleSetor(membros)}
                          className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
                        >
                          {todosMarcados ? 'Desmarcar setor' : 'Selecionar setor'}
                        </button>
                      </div>
                      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-700">
                        {membros.map((t) => (
                          <label
                            key={t.id}
                            className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          >
                            <input
                              type="checkbox"
                              checked={selecionados.has(t.id)}
                              onChange={() => toggle(t.id)}
                              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{t.nome}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{t.cargo}</p>
                            </div>
                            <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{t.matricula}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200">
              <span className="tabular-nums">{selecionados.size}</span> selecionado{selecionados.size === 1 ? '' : 's'}
              {treinamento && (
                <span className="ml-2 font-normal text-slate-500 dark:text-slate-400">
                  · {treinamento.norma} — {treinamento.nome}
                </span>
              )}
            </div>
          </div>
        )}

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          {etapa === 2 ? (
            <button
              onClick={() => setEtapa(1)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              ← Voltar
            </button>
          ) : (
            <span />
          )}
          {etapa === 1 ? (
            <button
              disabled={!etapa1Valida}
              onClick={() => setEtapa(2)}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Carregar funcionários →
            </button>
          ) : (
            <button
              disabled={selecionados.size === 0}
              onClick={() => {
                onCreate?.({
                  treinamentoId,
                  empregadorId,
                  tipo,
                  dataInicio,
                  dataFim: dataFim || dataInicio,
                  instrutor: instrutor.trim(),
                  local: local.trim(),
                  trabalhadorIds: [...selecionados],
                })
                onClose()
              }}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Criar turma com {selecionados.size} aluno{selecionados.size === 1 ? '' : 's'}
            </button>
          )}
        </footer>
      </aside>
    </div>
  )
}
