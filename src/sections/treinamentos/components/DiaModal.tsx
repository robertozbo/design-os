import { useEffect } from 'react'
import type { Empregador, Treinamento, Turma } from '@/../product/sections/treinamentos/types'
import {
  MODALIDADE_LABEL,
  STATUS_TURMA_CLASSES,
  STATUS_TURMA_LABEL,
  TIPO_TURMA_LABEL,
  formatHoras,
  formatPeriodo,
} from './helpers'

const DIAS_EXTENSO = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const MESES_EXTENSO = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

/** "Terça, 8 de setembro de 2026" — a partir do ISO, sem passar por Date/fuso. */
function tituloDoDia(diaIso: string): string {
  const [ano, mes, dia] = diaIso.split('-').map(Number)
  const semana = DIAS_EXTENSO[new Date(ano, mes - 1, dia).getDay()]
  return `${semana}, ${dia} de ${MESES_EXTENSO[mes - 1]} de ${ano}`
}

export interface DiaModalProps {
  diaIso: string
  /** Turmas que cobrem este dia (o filtro é de quem abre). */
  turmas: Turma[]
  treinamentos: Treinamento[]
  empregadores: Empregador[]
  onOpenTurma: (id: string) => void
  onNovaTurma: () => void
  onClose: () => void
}

/** Detalhe do dia da Agenda: o que acontece naquela data, com atalho para a turma. */
export function DiaModal({
  diaIso,
  turmas,
  treinamentos,
  empregadores,
  onOpenTurma,
  onNovaTurma,
  onClose,
}: DiaModalProps) {
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [onClose])

  const alunos = new Set(turmas.flatMap((t) => t.alunos.map((a) => a.trabalhadorId))).size

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={tituloDoDia(diaIso)}
        className="relative flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {tituloDoDia(diaIso)}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {turmas.length === 0 ? (
                'Nenhuma turma neste dia'
              ) : (
                <>
                  <span className="tabular-nums">{turmas.length}</span> turma
                  {turmas.length === 1 ? '' : 's'} ·{' '}
                  <span className="tabular-nums">{alunos}</span> aluno{alunos === 1 ? '' : 's'}
                </>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="-mr-1.5 -mt-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {turmas.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Dia livre. Nenhuma turma marcada.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {turmas.map((t) => {
                const curso = treinamentos.find((c) => c.id === t.treinamentoId)
                const emp = empregadores.find((e) => e.id === t.empregadorId)
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => {
                        onClose()
                        onOpenTurma(t.id)
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-teal-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-700 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                            <span className="font-mono text-teal-700 dark:text-teal-400">{curso?.norma}</span>{' '}
                            {curso?.nome}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {emp?.razaoSocial}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium ${STATUS_TURMA_CLASSES[t.status]}`}
                        >
                          {STATUS_TURMA_LABEL[t.status]}
                        </span>
                      </div>

                      <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                        <div>
                          <dt className="text-slate-400 dark:text-slate-500">Período</dt>
                          <dd className="text-slate-700 tabular-nums dark:text-slate-300">{formatPeriodo(t)}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-400 dark:text-slate-500">Carga horária</dt>
                          <dd className="text-slate-700 dark:text-slate-300">
                            {curso ? formatHoras(curso.cargaHorariaHoras) : '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-400 dark:text-slate-500">Instrutor</dt>
                          <dd className="truncate text-slate-700 dark:text-slate-300">{t.instrutor}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-400 dark:text-slate-500">Local</dt>
                          <dd className="truncate text-slate-700 dark:text-slate-300">{t.local}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-400 dark:text-slate-500">Tipo</dt>
                          <dd className="text-slate-700 dark:text-slate-300">
                            {TIPO_TURMA_LABEL[t.tipo]}
                            {curso ? ` · ${MODALIDADE_LABEL[curso.modalidade]}` : ''}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-400 dark:text-slate-500">Alunos</dt>
                          <dd className="text-slate-700 tabular-nums dark:text-slate-300">{t.alunos.length}</dd>
                        </div>
                      </dl>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 dark:border-slate-800">
          <button
            onClick={() => {
              onClose()
              onNovaTurma()
            }}
            className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          >
            + Agendar turma
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
