import type {
  Empregador,
  Evento,
  Trabalhador,
  Treinamento,
  Turma,
} from '@/../product/sections/treinamentos/types'
import {
  STATUS_EVENTO_CLASSES,
  STATUS_EVENTO_LABEL,
  STATUS_TURMA_CLASSES,
  STATUS_TURMA_LABEL,
  TIPO_TURMA_LABEL,
  formatHoras,
  formatPeriodo,
} from './helpers'

interface EventoDetailProps {
  evento: Evento
  empregador?: Empregador
  turmasDoEvento: Turma[]
  treinamentos: Treinamento[]
  trabalhadores: Trabalhador[]
  onBack: () => void
  onNovaTurma: () => void
  onOpenTurma: (id: string) => void
}

export function EventoDetail({
  evento,
  empregador,
  turmasDoEvento,
  treinamentos,
  trabalhadores,
  onBack,
  onNovaTurma,
  onOpenTurma,
}: EventoDetailProps) {
  const turmasOrdenadas = [...turmasDoEvento].sort((a, b) => a.dataInicio.localeCompare(b.dataInicio))
  const inscritos = new Set(turmasDoEvento.flatMap((t) => t.alunos.map((a) => a.trabalhadorId)))
  const certificados = turmasDoEvento.reduce(
    (acc, t) => acc + t.alunos.filter((a) => a.certificadoEmitido).length,
    0,
  )
  const horas = turmasDoEvento.reduce(
    (acc, t) => acc + (treinamentos.find((c) => c.id === t.treinamentoId)?.cargaHorariaHoras ?? 0),
    0,
  )
  const fechado = evento.status === 'concluido'

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Eventos
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_EVENTO_CLASSES[evento.status]}`}>
              {STATUS_EVENTO_LABEL[evento.status]}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {formatPeriodo(evento)}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{evento.nome}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {empregador?.razaoSocial ?? evento.empregadorId}
            {empregador && <span className="ml-2 font-mono text-xs text-slate-400 dark:text-slate-500">{empregador.cnpj}</span>}
            {evento.local && <span> · {evento.local}</span>}
          </p>
          {evento.descricao && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{evento.descricao}</p>
          )}
        </div>
        <button
          onClick={onNovaTurma}
          disabled={fechado}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Nova turma neste evento
        </button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Resumo rotulo="Turmas" valor={turmasDoEvento.length} />
        <Resumo rotulo="Trabalhadores inscritos" valor={inscritos.size} />
        <Resumo rotulo="Horas de treinamento" valor={formatHoras(horas)} />
        <Resumo rotulo="Certificados emitidos" valor={certificados} destaque={certificados > 0} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Turmas do evento</h2>
          <span className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
            {turmasDoEvento.length} turma{turmasDoEvento.length === 1 ? '' : 's'}
          </span>
        </div>

        {turmasOrdenadas.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nenhuma turma neste evento</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Monte a primeira turma: escolha o curso e marque os funcionários de {empregador?.razaoSocial ?? 'empresa'}.
            </p>
            {!fechado && (
              <button
                onClick={onNovaTurma}
                className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
              >
                Nova turma
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {turmasOrdenadas.map((turma) => {
              const curso = treinamentos.find((t) => t.id === turma.treinamentoId)
              const emitidos = turma.alunos.filter((a) => a.certificadoEmitido).length
              return (
                <button
                  key={turma.id}
                  onClick={() => onOpenTurma(turma.id)}
                  className="flex w-full flex-wrap items-center gap-x-4 gap-y-1.5 px-5 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
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
                      {TIPO_TURMA_LABEL[turma.tipo]}
                      {turma.instrutor && <span> · {turma.instrutor}</span>}
                      {turma.local && <span> · {turma.local}</span>}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 tabular-nums dark:text-slate-400">{formatPeriodo(turma)}</span>
                  <span className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                    {turma.alunos.length} aluno{turma.alunos.length === 1 ? '' : 's'}
                    {emitidos > 0 && (
                      <span className="ml-1 text-emerald-600 dark:text-emerald-400">· {emitidos} cert.</span>
                    )}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_TURMA_CLASSES[turma.status]}`}>
                    {STATUS_TURMA_LABEL[turma.status]}
                  </span>
                  <svg className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )
            })}
          </div>
        )}
      </section>

      {inscritos.size > 0 && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Inscritos no evento:{' '}
          {[...inscritos]
            .map((id) => trabalhadores.find((t) => t.id === id)?.nome ?? id)
            .sort((a, b) => a.localeCompare(b))
            .join(', ')}
        </p>
      )}
    </div>
  )
}

function Resumo({ rotulo, valor, destaque }: { rotulo: string; valor: number | string; destaque?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{rotulo}</p>
      <p
        className={`mt-1 text-2xl font-semibold tabular-nums ${
          destaque ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
        }`}
      >
        {valor}
      </p>
    </div>
  )
}
