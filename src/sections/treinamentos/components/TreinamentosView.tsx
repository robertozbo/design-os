import { useMemo, useState } from 'react'
import type { TreinamentosProps, Treinamento } from '@/../product/sections/treinamentos/types'
import {
  MODALIDADE_LABEL,
  STATUS_TURMA_CLASSES,
  STATUS_TURMA_LABEL,
  TIPO_TURMA_LABEL,
  formatHoras,
  formatPeriodo,
  somaDisciplinas,
} from './helpers'
import { TreinamentoDrawer } from './TreinamentoDrawer'
import { NovaTurmaFlow } from './NovaTurmaFlow'
import { TurmaDetail } from './TurmaDetail'

type Tab = 'cursos' | 'turmas'

export function TreinamentosView({
  treinamentos,
  turmas,
  empregadores,
  trabalhadores,
  onCreateTreinamento,
  onCreateTurma,
  onTogglePresenca,
  onToggleAprovacao,
  onEmitirCertificados,
  onSelectTreinamento,
  onSelectTurma,
}: TreinamentosProps) {
  const [tab, setTab] = useState<Tab>('cursos')
  const [cursoAbertoId, setCursoAbertoId] = useState<string | null>(null)
  const [turmaAbertaId, setTurmaAbertaId] = useState<string | null>(null)
  const [turmaExpandidaId, setTurmaExpandidaId] = useState<string | null>(null)
  const [drawerTreinamento, setDrawerTreinamento] = useState(false)
  const [novaTurmaDe, setNovaTurmaDe] = useState<string | null | false>(false)

  const [filtroEmpregador, setFiltroEmpregador] = useState('')
  const [filtroCurso, setFiltroCurso] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')

  const certificadosEmitidos = useMemo(
    () => turmas.reduce((acc, t) => acc + t.alunos.filter((a) => a.certificadoEmitido).length, 0),
    [turmas],
  )
  const turmasAtivas = turmas.filter((t) => t.status === 'agendada' || t.status === 'em_andamento').length

  const turmasFiltradas = useMemo(
    () =>
      turmas.filter(
        (t) =>
          (!filtroEmpregador || t.empregadorId === filtroEmpregador) &&
          (!filtroCurso || t.treinamentoId === filtroCurso) &&
          (!filtroStatus || t.status === filtroStatus),
      ),
    [turmas, filtroEmpregador, filtroCurso, filtroStatus],
  )

  const cursoAberto = treinamentos.find((t) => t.id === cursoAbertoId)
  const turmaAberta = turmas.find((t) => t.id === turmaAbertaId)

  const selectCls =
    'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'

  if (turmaAberta) {
    return (
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <TurmaDetail
          turma={turmaAberta}
          treinamento={treinamentos.find((t) => t.id === turmaAberta.treinamentoId)}
          empregador={empregadores.find((e) => e.id === turmaAberta.empregadorId)}
          trabalhadores={trabalhadores}
          onBack={() => setTurmaAbertaId(null)}
          onTogglePresenca={onTogglePresenca}
          onToggleAprovacao={onToggleAprovacao}
          onEmitirCertificados={onEmitirCertificados}
        />
      </div>
    )
  }

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      {cursoAberto ? (
        <CursoDetail
          curso={cursoAberto}
          turmasDoCurso={turmas.filter((t) => t.treinamentoId === cursoAberto.id)}
          empregadores={empregadores}
          onBack={() => setCursoAbertoId(null)}
          onNovaTurma={() => setNovaTurmaDe(cursoAberto.id)}
          onOpenTurma={(id) => {
            setTurmaAbertaId(id)
            onSelectTurma?.(id)
          }}
        />
      ) : (
        <>
          <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Treinamentos</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                <span className="tabular-nums">{treinamentos.length}</span> cursos ·{' '}
                <span className="tabular-nums">{turmasAtivas}</span> turmas ativas ·{' '}
                <span className="tabular-nums">{certificadosEmitidos}</span> certificados emitidos
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDrawerTreinamento(true)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Novo treinamento
              </button>
              <button
                onClick={() => setNovaTurmaDe(null)}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
              >
                Nova turma
              </button>
            </div>
          </header>

          <div className="mb-6 flex gap-1 border-b border-slate-200 dark:border-slate-800">
            {(['cursos', 'turmas'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  tab === t
                    ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {t === 'cursos' ? 'Cursos' : 'Turmas'}{' '}
                <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs tabular-nums text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {t === 'cursos' ? treinamentos.length : turmas.length}
                </span>
              </button>
            ))}
          </div>

          {tab === 'cursos' ? (
            treinamentos.length === 0 ? (
              <EmptyState
                titulo="Nenhum curso no catálogo"
                texto="Cadastre o primeiro treinamento oferecido pela sua consultoria."
                cta="Novo treinamento"
                onCta={() => setDrawerTreinamento(true)}
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {treinamentos.map((curso) => (
                  <button
                    key={curso.id}
                    onClick={() => {
                      setCursoAbertoId(curso.id)
                      onSelectTreinamento?.(curso.id)
                    }}
                    className={`group rounded-xl border border-slate-200 bg-white p-4 text-left transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${
                      !curso.ativo ? 'opacity-55' : ''
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-md bg-teal-50 px-2 py-0.5 font-mono text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                        {curso.norma}
                      </span>
                      {!curso.ativo && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Inativo
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-teal-700 dark:text-slate-100 dark:group-hover:text-teal-300">
                      {curso.nome}
                    </h3>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="9" />
                          <path strokeLinecap="round" d="M12 7v5l3 2" />
                        </svg>
                        {formatHoras(curso.cargaHorariaHoras)}
                      </span>
                      <span>{MODALIDADE_LABEL[curso.modalidade]}</span>
                      <span className="tabular-nums">{curso.conteudoProgramatico.length} disciplinas</span>
                      {curso.validadeMeses != null && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700 tabular-nums dark:bg-amber-950/60 dark:text-amber-300">
                          Reciclagem {curso.validadeMeses}m
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )
          ) : turmas.length === 0 ? (
            <EmptyState
              titulo="Nenhuma turma criada"
              texto="Monte a primeira turma escolhendo um curso e a empresa cliente."
              cta="Nova turma"
              onCta={() => setNovaTurmaDe(null)}
            />
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                <select className={selectCls} value={filtroEmpregador} onChange={(e) => setFiltroEmpregador(e.target.value)}>
                  <option value="">Todas as empresas</option>
                  {empregadores.map((e) => (
                    <option key={e.id} value={e.id}>{e.razaoSocial}</option>
                  ))}
                </select>
                <select className={selectCls} value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
                  <option value="">Todos os cursos</option>
                  {treinamentos.map((t) => (
                    <option key={t.id} value={t.id}>{t.norma} · {t.nome}</option>
                  ))}
                </select>
                <select className={selectCls} value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                  <option value="">Todos os status</option>
                  {Object.entries(STATUS_TURMA_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                {turmasFiltradas.length === 0 && (
                  <p className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    Nenhuma turma com esses filtros.
                  </p>
                )}
                {turmasFiltradas.map((turma) => {
                  const curso = treinamentos.find((t) => t.id === turma.treinamentoId)
                  const emp = empregadores.find((e) => e.id === turma.empregadorId)
                  const expandida = turmaExpandidaId === turma.id
                  return (
                    <div key={turma.id}>
                      <button
                        onClick={() => setTurmaExpandidaId(expandida ? null : turma.id)}
                        className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <svg
                          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${expandida ? 'rotate-90' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
                            {curso && (
                              <span className="rounded bg-teal-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                                {curso.norma}
                              </span>
                            )}
                            <span className="truncate">{curso?.nome ?? turma.treinamentoId}</span>
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {emp?.razaoSocial} · {TIPO_TURMA_LABEL[turma.tipo]}
                          </p>
                        </div>
                        <span className="text-xs text-slate-500 tabular-nums dark:text-slate-400">{formatPeriodo(turma)}</span>
                        <span className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                          {turma.alunos.length} aluno{turma.alunos.length === 1 ? '' : 's'}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_TURMA_CLASSES[turma.status]}`}>
                          {STATUS_TURMA_LABEL[turma.status]}
                        </span>
                      </button>

                      {expandida && (
                        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 pl-12 dark:border-slate-800 dark:bg-slate-800/30">
                          {turma.alunos.length === 0 ? (
                            <p className="py-2 text-sm text-slate-500 dark:text-slate-400">Nenhum aluno nesta turma ainda.</p>
                          ) : (
                            <ul className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2 xl:grid-cols-3">
                              {turma.alunos.map((a) => {
                                const trab = trabalhadores.find((t) => t.id === a.trabalhadorId)
                                return (
                                  <li key={a.trabalhadorId} className="flex items-center gap-2 text-sm">
                                    <span
                                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                        a.certificadoEmitido
                                          ? 'bg-emerald-500'
                                          : a.aprovado
                                            ? 'bg-teal-500'
                                            : a.presente === false
                                              ? 'bg-rose-400'
                                              : 'bg-slate-300 dark:bg-slate-600'
                                      }`}
                                    />
                                    <span className="min-w-0 truncate text-slate-700 dark:text-slate-200">
                                      {trab?.nome ?? a.trabalhadorId}
                                    </span>
                                    <span className="shrink-0 font-mono text-xs text-slate-400 dark:text-slate-500">
                                      {trab?.matricula}
                                    </span>
                                    {a.certificadoEmitido && (
                                      <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                        Certificado
                                      </span>
                                    )}
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                          <button
                            onClick={() => {
                              setTurmaAbertaId(turma.id)
                              onSelectTurma?.(turma.id)
                            }}
                            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                          >
                            Abrir turma — presença, aprovação e certificados
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}

      {drawerTreinamento && (
        <TreinamentoDrawer onClose={() => setDrawerTreinamento(false)} onSave={onCreateTreinamento} />
      )}
      {novaTurmaDe !== false && (
        <NovaTurmaFlow
          treinamentos={treinamentos}
          empregadores={empregadores}
          trabalhadores={trabalhadores}
          treinamentoInicialId={novaTurmaDe}
          onClose={() => setNovaTurmaDe(false)}
          onCreate={(input) => {
            onCreateTurma?.(input)
            setCursoAbertoId(null)
            setTab('turmas')
          }}
        />
      )}
    </div>
  )
}

function CursoDetail({
  curso,
  turmasDoCurso,
  empregadores,
  onBack,
  onNovaTurma,
  onOpenTurma,
}: {
  curso: Treinamento
  turmasDoCurso: TreinamentosProps['turmas']
  empregadores: TreinamentosProps['empregadores']
  onBack: () => void
  onNovaTurma: () => void
  onOpenTurma: (id: string) => void
}) {
  const soma = somaDisciplinas(curso.conteudoProgramatico)
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Cursos
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-teal-50 px-2 py-0.5 font-mono text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              {curso.norma}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {MODALIDADE_LABEL[curso.modalidade]}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {formatHoras(curso.cargaHorariaHoras)}
            </span>
            {curso.validadeMeses != null && (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium tabular-nums text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                Reciclagem a cada {curso.validadeMeses} meses
              </span>
            )}
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{curso.nome}</h1>
          {curso.descricao && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{curso.descricao}</p>
          )}
        </div>
        <button
          onClick={onNovaTurma}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
        >
          Nova turma
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <h2 className="border-b border-slate-100 px-5 py-3.5 text-sm font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-100">
            Conteúdo programático
          </h2>
          {curso.conteudoProgramatico.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Nenhuma disciplina cadastrada.
            </p>
          ) : (
            <>
              <ol className="divide-y divide-slate-100 dark:divide-slate-800">
                {curso.conteudoProgramatico.map((d, i) => (
                  <li key={i} className="flex items-baseline gap-3 px-5 py-3">
                    <span className="w-5 shrink-0 text-right font-mono text-xs text-slate-400 tabular-nums">{i + 1}.</span>
                    <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">{d.titulo}</span>
                    <span className="shrink-0 font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                      {formatHoras(d.horas)}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm dark:border-slate-800">
                <span className="font-medium text-slate-500 dark:text-slate-400">Total</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                  {formatHoras(soma)}
                </span>
              </div>
            </>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <h2 className="border-b border-slate-100 px-5 py-3.5 text-sm font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-100">
            Turmas deste curso
          </h2>
          {turmasDoCurso.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">Nenhuma turma ainda.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {turmasDoCurso.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onOpenTurma(t.id)}
                  className="w-full px-5 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {empregadores.find((e) => e.id === t.empregadorId)?.razaoSocial ?? t.empregadorId}
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="tabular-nums">{formatPeriodo(t)}</span>
                    <span className="tabular-nums">{t.alunos.length} alunos</span>
                    <span className={`rounded-full px-2 py-0.5 font-medium ${STATUS_TURMA_CLASSES[t.status]}`}>
                      {STATUS_TURMA_LABEL[t.status]}
                    </span>
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function EmptyState({
  titulo,
  texto,
  cta,
  onCta,
}: {
  titulo: string
  texto: string
  cta: string
  onCta: () => void
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center dark:border-slate-700">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{titulo}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{texto}</p>
      <button
        onClick={onCta}
        className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
      >
        {cta}
      </button>
    </div>
  )
}
