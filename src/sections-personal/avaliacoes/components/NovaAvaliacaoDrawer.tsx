import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ChevronDown,
  Ruler,
  Save,
  Search,
  Send,
  X,
} from 'lucide-react'
import type {
  Antropometria,
  AvaliacaoTabId,
  Funcional,
  NovaAvaliacaoData,
  NovaAvaliacaoDrawerProps,
} from '@/../product-personal/sections/avaliacoes/types'
import { AntropometriaForm } from './AntropometriaForm'
import { FuncionalForm } from './FuncionalForm'
import {
  EMPTY_ANTROPOMETRIA,
  EMPTY_FUNCIONAL,
} from './avaliacaoFormHelpers'

const TABS: { id: AvaliacaoTabId; label: string; icon: React.ElementType }[] = [
  { id: 'antropometria', label: 'Antropometria', icon: Ruler },
  { id: 'funcional', label: 'Funcional', icon: Activity },
]

export function NovaAvaliacaoDrawer({
  open,
  alunos,
  preSelectedAlunoId,
  editing,
  onClose,
  onSave,
}: NovaAvaliacaoDrawerProps) {
  const isEditing = !!editing
  const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(
    preSelectedAlunoId ?? null,
  )
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10))
  const [observacoes, setObservacoes] = useState('')
  const [obsOpen, setObsOpen] = useState(false)
  const [tab, setTab] = useState<AvaliacaoTabId>('antropometria')
  const [antropometria, setAntropometria] = useState<Antropometria>(EMPTY_ANTROPOMETRIA)
  const [funcional, setFuncional] = useState<Funcional>(EMPTY_FUNCIONAL)
  const [includeAntro, setIncludeAntro] = useState(true)
  const [includeFunc, setIncludeFunc] = useState(true)
  const [compartilharNutri, setCompartilharNutri] = useState(false)
  const [alunoQuery, setAlunoQuery] = useState('')

  // Reset / pre-fill on open
  useEffect(() => {
    if (!open) return

    if (editing) {
      // Modo edição — pré-popula tudo
      setSelectedAlunoId(editing.alunoId)
      setData(editing.data)
      setObservacoes(editing.observacoes ?? '')
      setObsOpen((editing.observacoes ?? '').length > 0)
      setTab(editing.antropometria ? 'antropometria' : 'funcional')
      setAntropometria(editing.antropometria ?? EMPTY_ANTROPOMETRIA)
      setFuncional(editing.funcional ?? EMPTY_FUNCIONAL)
      setIncludeAntro(!!editing.antropometria)
      setIncludeFunc(!!editing.funcional)
      setCompartilharNutri(!!editing.compartilhadaComNutri)
      setAlunoQuery('')
    } else {
      // Modo criar
      setSelectedAlunoId(preSelectedAlunoId ?? null)
      setData(new Date().toISOString().slice(0, 10))
      setObservacoes('')
      setObsOpen(false)
      setTab('antropometria')
      setAntropometria(EMPTY_ANTROPOMETRIA)
      setFuncional(EMPTY_FUNCIONAL)
      setIncludeAntro(true)
      setIncludeFunc(true)
      setCompartilharNutri(false)
      setAlunoQuery('')
    }
  }, [open, preSelectedAlunoId, editing])

  const aluno = selectedAlunoId
    ? alunos.find((a) => a.id === selectedAlunoId) ?? null
    : null

  const filteredAlunos = useMemo(() => {
    if (!alunoQuery) return alunos
    const q = alunoQuery.toLowerCase()
    return alunos.filter((a) => a.nome.toLowerCase().includes(q))
  }, [alunos, alunoQuery])

  const canSave = !!aluno && (includeAntro || includeFunc)

  const buildPayload = (status: 'rascunho' | 'finalizada'): NovaAvaliacaoData | null => {
    if (!aluno) return null
    return {
      alunoId: aluno.id,
      data,
      observacoes,
      antropometria: includeAntro ? antropometria : null,
      funcional: includeFunc ? funcional : null,
      compartilhadaComNutri: compartilharNutri && aluno.temNutri,
      status,
    }
  }

  const handleSave = (status: 'rascunho' | 'finalizada') => {
    const payload = buildPayload(status)
    if (payload) onSave?.(payload)
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300
          ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}
        `}
        aria-hidden
      />

      <aside
        className={`
          fixed inset-y-0 right-0 z-50 flex w-full max-w-[760px] flex-col bg-white shadow-2xl transition-transform duration-300
          dark:bg-slate-950
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-label="Nova avaliação"
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              {isEditing
                ? `Editando · ${new Date(editing!.data).toLocaleDateString('pt-BR')}`
                : 'Avaliação física'}
            </p>
            <h2 className="mt-1 text-xl font-semibold leading-snug text-slate-900 dark:text-slate-50">
              {isEditing ? 'Editar avaliação' : 'Nova avaliação'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {/* Identificação */}
          <section className="space-y-4 border-b border-slate-100 p-5 dark:border-slate-800">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
              {/* Aluno picker */}
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Aluno
                </p>
                {!aluno ? (
                  <>
                    <div className="relative mt-1">
                      <Search
                        size={14}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                      />
                      <input
                        type="search"
                        value={alunoQuery}
                        onChange={(e) => setAlunoQuery(e.target.value)}
                        placeholder="Buscar aluno…"
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
                      />
                    </div>
                    {alunoQuery && (
                      <div className="mt-1 max-h-44 space-y-1 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/40 p-1 dark:border-slate-800 dark:bg-slate-900/40">
                        {filteredAlunos.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => {
                              setSelectedAlunoId(a.id)
                              setAlunoQuery('')
                            }}
                            className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-white dark:hover:bg-slate-800"
                          >
                            {a.avatarUrl ? (
                              <img
                                src={a.avatarUrl}
                                alt={a.nome}
                                className="h-7 w-7 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
                              />
                            ) : (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                                {a.nome.charAt(0)}
                              </div>
                            )}
                            <p className="truncate text-[13px] text-slate-700 dark:text-slate-300">
                              {a.nome}
                            </p>
                          </button>
                        ))}
                        {filteredAlunos.length === 0 && (
                          <p className="px-2 py-3 text-center text-[12px] text-slate-400 dark:text-slate-500">
                            Nenhum aluno encontrado
                          </p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-1 flex items-center gap-3 rounded-lg bg-teal-50 p-2 ring-1 ring-inset ring-teal-200 dark:bg-teal-900/30 dark:ring-teal-800">
                    {aluno.avatarUrl ? (
                      <img
                        src={aluno.avatarUrl}
                        alt={aluno.nome}
                        className="h-9 w-9 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                        {aluno.nome.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                        {aluno.nome}
                      </p>
                      <p className="truncate font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Última:{' '}
                        {aluno.ultimaAvaliacaoData
                          ? new Date(aluno.ultimaAvaliacaoData).toLocaleDateString('pt-BR')
                          : 'primeira'}
                      </p>
                    </div>
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setSelectedAlunoId(null)}
                        className="text-[11px] font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                      >
                        Trocar
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Data
                </p>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-teal-600"
                />
              </div>
            </div>

            {/* Observações collapsible */}
            <div>
              <button
                type="button"
                onClick={() => setObsOpen(!obsOpen)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Observações
                <ChevronDown
                  size={12}
                  className={`transition-transform ${obsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {obsOpen && (
                <textarea
                  rows={2}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Anotações livres sobre a avaliação…"
                  className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
                />
              )}
            </div>

            {/* Toggle compartilhar com nutri */}
            {aluno?.temNutri && (
              <label className="flex cursor-pointer items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900/60">
                <input
                  type="checkbox"
                  checked={compartilharNutri}
                  onChange={(e) => setCompartilharNutri(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900"
                />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-slate-900 dark:text-slate-50">
                    Compartilhar antropometria com nutricionista
                  </p>
                  <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                    Aluno tem nutri vinculado no Nymos. Antropometria aparece na ficha do nutri também.
                  </p>
                </div>
              </label>
            )}
          </section>

          {/* Tabs */}
          <div className="border-b border-slate-100 px-5 dark:border-slate-800">
            <div className="flex items-center gap-1">
              {TABS.map((t) => {
                const Icon = t.icon
                const active = tab === t.id
                const include = t.id === 'antropometria' ? includeAntro : includeFunc
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`
                      relative inline-flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                      ${
                        active
                          ? 'text-slate-900 dark:text-slate-50'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      }
                    `}
                  >
                    <Icon size={13} />
                    {t.label}
                    {include && (
                      <span className="inline-flex items-center rounded-md bg-teal-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                        Ativo
                      </span>
                    )}
                    {active && (
                      <span className="absolute inset-x-3 -bottom-px h-0.5 bg-teal-500 dark:bg-teal-400" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form area */}
          <section className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[12px] text-slate-500 dark:text-slate-400">
                {tab === 'antropometria'
                  ? 'Bloco opcional. Cada subseção pode ser preenchida ou pulada.'
                  : 'Bloco opcional. Personal escolhe quais testes aplicar.'}
              </p>
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={tab === 'antropometria' ? includeAntro : includeFunc}
                  onChange={(e) =>
                    tab === 'antropometria'
                      ? setIncludeAntro(e.target.checked)
                      : setIncludeFunc(e.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900"
                />
                Incluir nesta avaliação
              </label>
            </div>

            {tab === 'antropometria' ? (
              <div className={includeAntro ? '' : 'opacity-40 pointer-events-none'}>
                <AntropometriaForm
                  value={antropometria}
                  onChange={setAntropometria}
                />
              </div>
            ) : (
              <div className={includeFunc ? '' : 'opacity-40 pointer-events-none'}>
                <FuncionalForm value={funcional} onChange={setFuncional} />
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                disabled={!canSave}
                onClick={() => handleSave('rascunho')}
                className={`
                  inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors
                  ${
                    canSave
                      ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                      : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
                  }
                `}
              >
                <Save size={14} />
                Salvar rascunho
              </button>
            )}
            <button
              type="button"
              disabled={!canSave}
              onClick={() =>
                handleSave(isEditing ? editing!.status : 'finalizada')
              }
              className={`
                inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors
                ${
                  canSave
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                }
              `}
            >
              {isEditing ? (
                <>
                  <Save size={14} strokeWidth={2.5} />
                  Salvar alterações
                </>
              ) : (
                <>
                  <Send size={14} strokeWidth={2.5} />
                  Salvar e finalizar
                </>
              )}
            </button>
          </div>
        </footer>
      </aside>
    </>
  )
}
